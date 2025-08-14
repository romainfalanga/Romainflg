/*
  # Create applications table for job applications

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `project_name` (text)
      - `name` (text)
      - `email` (text)
      - `position` (text)
      - `telegram` (text)
      - `tiktok` (text, optional)
      - `motivation` (text)
      - `creativity` (text, optional)
      - `universe_model` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `applications` table
    - Add policy for public to insert applications
    - Add policy for authenticated users to read applications (admin only)
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  position text NOT NULL CHECK (position IN ('COO', 'CM')),
  telegram text NOT NULL,
  tiktok text,
  motivation text NOT NULL,
  creativity text,
  universe_model text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit applications
CREATE POLICY "Anyone can submit applications"
  ON applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users can read applications (for admin dashboard)
CREATE POLICY "Authenticated users can read applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);