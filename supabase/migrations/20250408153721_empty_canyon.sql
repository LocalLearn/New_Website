/*
  # Add email field to profiles table

  1. Changes
    - Add email column to profiles table
    - Populate email from auth.users table
    - Add unique constraint on email
    - Create trigger function to sync email changes
    - Create trigger to maintain email sync

  2. Security
    - Maintains existing RLS policies
    - Email uniqueness enforced at database level

  3. Notes
    - Existing profiles will be updated with corresponding emails
    - Future email changes in auth.users will automatically sync
*/

-- Add email column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;
END $$;

-- Update existing profiles with emails from auth.users
UPDATE profiles 
SET email = auth.users.email 
FROM auth.users 
WHERE profiles.id = auth.users.id;

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'unique_email' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT unique_email UNIQUE(email);
  END IF;
END $$;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles 
    SET email = NEW.email 
    WHERE id = NEW.id;
  ELSIF TG_OP = 'UPDATE' AND OLD.email != NEW.email THEN
    UPDATE profiles 
    SET email = NEW.email 
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists and create it
DROP TRIGGER IF EXISTS sync_email_changes ON auth.users;

CREATE TRIGGER sync_email_changes
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION sync_user_email();