/*
  # Create profile-photos storage bucket

  1. Storage Bucket
    - Create `profile-photos` bucket for storing user profile images
    - Set as public bucket for easy access to profile photos
    - Configure appropriate file size limits

  2. Security Policies
    - Allow authenticated users to upload their own profile photos
    - Allow public read access to all profile photos
    - Allow users to update/delete their own profile photos
*/

-- Create the profile-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload their own profile photos
CREATE POLICY "Users can upload own profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow public read access to all profile photos
CREATE POLICY "Public read access to profile photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Policy: Allow users to update their own profile photos
CREATE POLICY "Users can update own profile photos"
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

-- Policy: Allow users to delete their own profile photos
CREATE POLICY "Users can delete own profile photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);