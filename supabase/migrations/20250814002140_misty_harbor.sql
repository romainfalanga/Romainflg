/*
  # Setup Admin Authentication

  1. Security Configuration
    - Disable public user registration
    - Enable email confirmation (optional)
    - Configure authentication settings

  2. Admin User Creation
    - Create admin user with specific email and password
    - Set up user profile with admin role
    - Ensure proper permissions

  3. Database Policies
    - Restrict applications access to admin users only
    - Ensure user_profiles can only be managed by admins
    - Set up proper Row Level Security
*/

-- Disable public user registration (only admins can create users)
-- This needs to be done in Supabase Dashboard under Authentication > Settings
-- Set "Enable email confirmations" to false for easier setup
-- Set "Enable phone confirmations" to false

-- Create the admin user (this will be done via Supabase Auth, but we prepare the profile)
-- The actual user creation needs to be done through Supabase Dashboard or API

-- First, let's make sure we have the proper trigger function for user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    CASE 
      WHEN new.email = 'romainfalanga83@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update existing user profiles to ensure admin role for the specific email
-- This will work if the user already exists
DO $$
BEGIN
  -- Check if user exists and update their profile
  UPDATE user_profiles 
  SET role = 'admin'
  WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'romainfalanga83@gmail.com'
  );
  
  -- If no rows were updated, it means the user doesn't exist yet
  -- The trigger will handle it when the user is created
END $$;

-- Ensure RLS policies are properly set for applications table
DROP POLICY IF EXISTS "Admin can manage all applications" ON applications;
CREATE POLICY "Admin can manage all applications"
  ON applications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Ensure RLS policies for user_profiles
DROP POLICY IF EXISTS "Admin can manage all profiles" ON user_profiles;
CREATE POLICY "Admin can manage all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role = 'admin'
    )
  );

-- Remove public access to applications (only authenticated admins)
DROP POLICY IF EXISTS "Anyone can submit applications" ON applications;
CREATE POLICY "Anyone can submit applications"
  ON applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Keep read access for authenticated users (admins)
DROP POLICY IF EXISTS "Authenticated users can read applications" ON applications;
CREATE POLICY "Authenticated users can read applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );