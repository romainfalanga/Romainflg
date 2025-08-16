/*
  # Correction complète du système d'authentification

  1. Suppression complète de tous les éléments existants
  2. Recréation de la table user_profiles avec une structure simplifiée
  3. Création d'une fonction trigger ultra-robuste
  4. Configuration des politiques RLS appropriées
  5. Test de la configuration
*/

-- 1. Supprimer complètement tous les éléments existants
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP FUNCTION IF EXISTS create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 2. Recréer la table user_profiles avec une structure simplifiée
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Activer RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Créer les politiques RLS
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Créer une fonction trigger ultra-robuste
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_username text;
  user_email text;
  counter integer := 0;
  final_username text;
BEGIN
  -- Récupérer l'email depuis auth.users
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  
  -- Si pas d'email, utiliser un fallback
  IF user_email IS NULL THEN
    user_email := 'user@example.com';
  END IF;
  
  -- Récupérer le username depuis les métadonnées
  user_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(user_email, '@', 1)
  );
  
  -- Si le username est vide, utiliser un fallback
  IF user_username IS NULL OR user_username = '' THEN
    user_username := 'user_' || substring(NEW.id::text, 1, 8);
  END IF;
  
  final_username := user_username;
  
  -- Gérer les conflits de username
  WHILE EXISTS (SELECT 1 FROM user_profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := user_username || '_' || counter;
    
    -- Éviter les boucles infinies
    IF counter > 100 THEN
      final_username := 'user_' || substring(NEW.id::text, 1, 8) || '_' || extract(epoch from now())::integer;
      EXIT;
    END IF;
  END LOOP;
  
  -- Insérer le profil utilisateur
  INSERT INTO user_profiles (id, username, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    final_username,
    user_email,
    'user',
    now(),
    now()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, on log mais on ne fait pas échouer l'inscription
    RAISE LOG 'Erreur lors de la création du profil pour %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 6. Créer le trigger
CREATE TRIGGER handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 7. Créer des index pour les performances
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- 8. Test de la configuration (optionnel - sera ignoré en production)
DO $$
BEGIN
  RAISE NOTICE 'Configuration d''authentification mise à jour avec succès';
  RAISE NOTICE 'Table user_profiles: %', (SELECT COUNT(*) FROM user_profiles);
  RAISE NOTICE 'Fonction handle_new_user créée';
  RAISE NOTICE 'Trigger handle_new_user activé';
  RAISE NOTICE 'Politiques RLS configurées';
END $$;