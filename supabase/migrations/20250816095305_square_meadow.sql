/*
  # Configuration des politiques de stockage pour les photos de profil

  1. Bucket Configuration
    - Crée le bucket `profile-photos` s'il n'existe pas
    - Configure comme bucket public pour permettre l'accès aux images

  2. Politiques RLS
    - INSERT: Permet aux utilisateurs authentifiés d'uploader des fichiers
    - SELECT: Permet à tous de voir les images (bucket public)
    - UPDATE: Permet aux propriétaires de modifier leurs fichiers
    - DELETE: Permet aux propriétaires de supprimer leurs fichiers

  3. Sécurité
    - Utilise auth.uid() pour identifier l'utilisateur authentifié
    - Vérifie que l'utilisateur est connecté avant d'autoriser l'upload
*/

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow authenticated users to upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own profile photos" ON storage.objects;

-- Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO UPDATE SET
  public = true;

-- Politique pour permettre l'upload (INSERT) aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to upload profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid() IS NOT NULL
);

-- Politique pour permettre la lecture (SELECT) à tous (bucket public)
CREATE POLICY "Allow public access to profile photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Politique pour permettre la mise à jour (UPDATE) aux propriétaires
CREATE POLICY "Allow users to update own profile photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique pour permettre la suppression (DELETE) aux propriétaires
CREATE POLICY "Allow users to delete own profile photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);