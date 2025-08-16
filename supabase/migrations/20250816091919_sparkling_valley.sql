/*
  # Système d'utilisateurs global pour toutes les plateformes

  1. Nouvelles Tables
    - `global_users`
      - `id` (uuid, primary key) - ID global de l'utilisateur
      - `username` (text, unique) - Nom d'utilisateur partagé entre toutes les plateformes
      - `email` (text, unique) - Email de l'utilisateur
      - `profile_photo_url` (text) - URL de la photo de profil globale
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `site_user_profiles`
      - `id` (uuid, primary key)
      - `global_user_id` (uuid, foreign key) - Référence vers global_users
      - `site_name` (text) - Nom du site (ex: 'romainflg', 'chess-value', etc.)
      - `description` (text) - Description spécifique au site
      - `site_specific_data` (jsonb) - Données spécifiques au site
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS sur toutes les tables
    - Policies pour que les utilisateurs ne voient que leurs propres données
    - Trigger pour synchroniser avec auth.users

  3. Migration des données existantes
    - Migrer les données de user_profiles vers le nouveau système
*/

-- Créer la table des utilisateurs globaux
CREATE TABLE IF NOT EXISTS global_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  profile_photo_url text DEFAULT '/profile-photos/default-avatar.png',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des profils spécifiques par site
CREATE TABLE IF NOT EXISTS site_user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  global_user_id uuid NOT NULL REFERENCES global_users(id) ON DELETE CASCADE,
  site_name text NOT NULL,
  description text DEFAULT '',
  site_specific_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(global_user_id, site_name)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_global_users_auth_user_id ON global_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_global_users_username ON global_users(username);
CREATE INDEX IF NOT EXISTS idx_global_users_email ON global_users(email);
CREATE INDEX IF NOT EXISTS idx_site_user_profiles_global_user_id ON site_user_profiles(global_user_id);
CREATE INDEX IF NOT EXISTS idx_site_user_profiles_site_name ON site_user_profiles(site_name);

-- Activer RLS
ALTER TABLE global_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies pour global_users
CREATE POLICY "Users can read own global profile"
  ON global_users
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own global profile"
  ON global_users
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own global profile"
  ON global_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

-- Policies pour site_user_profiles
CREATE POLICY "Users can read own site profiles"
  ON site_user_profiles
  FOR SELECT
  TO authenticated
  USING (
    global_user_id IN (
      SELECT id FROM global_users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own site profiles"
  ON site_user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    global_user_id IN (
      SELECT id FROM global_users WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    global_user_id IN (
      SELECT id FROM global_users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own site profiles"
  ON site_user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    global_user_id IN (
      SELECT id FROM global_users WHERE auth_user_id = auth.uid()
    )
  );

-- Fonction pour créer automatiquement un profil global lors de l'inscription
CREATE OR REPLACE FUNCTION handle_new_user_global()
RETURNS trigger AS $$
BEGIN
  INSERT INTO global_users (auth_user_id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  
  -- Créer automatiquement le profil pour le site RomainFLG
  INSERT INTO site_user_profiles (global_user_id, site_name, description)
  VALUES (
    (SELECT id FROM global_users WHERE auth_user_id = NEW.id),
    'romainflg',
    ''
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement les profils
DROP TRIGGER IF EXISTS on_auth_user_created_global ON auth.users;
CREATE TRIGGER on_auth_user_created_global
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_global();

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_global_users_updated_at
  BEFORE UPDATE ON global_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_user_profiles_updated_at
  BEFORE UPDATE ON site_user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migrer les données existantes de user_profiles vers le nouveau système
DO $$
BEGIN
  -- Vérifier si user_profiles existe et contient des données
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
    -- Migrer vers global_users (en évitant les doublons)
    INSERT INTO global_users (auth_user_id, username, email, created_at)
    SELECT DISTINCT 
      up.id,
      up.username,
      up.email,
      up.created_at
    FROM user_profiles up
    WHERE NOT EXISTS (
      SELECT 1 FROM global_users gu WHERE gu.auth_user_id = up.id
    );
    
    -- Migrer les descriptions vers site_user_profiles pour RomainFLG
    INSERT INTO site_user_profiles (global_user_id, site_name, description, created_at)
    SELECT 
      gu.id,
      'romainflg',
      '', -- Pas de description dans l'ancien système
      up.created_at
    FROM user_profiles up
    JOIN global_users gu ON gu.auth_user_id = up.id
    WHERE NOT EXISTS (
      SELECT 1 FROM site_user_profiles sup 
      WHERE sup.global_user_id = gu.id AND sup.site_name = 'romainflg'
    );
  END IF;
END $$;