/*
  # Roll back email field changes from profiles table

  1. Changes
    - Drop email sync trigger
    - Drop email sync function
    - Drop unique email constraint
    - Drop email column
    - Restore original handle_new_user function
*/

-- Drop the email sync trigger
DROP TRIGGER IF EXISTS sync_email_changes ON auth.users;

-- Drop the email sync function
DROP FUNCTION IF EXISTS sync_user_email();

-- Drop the unique email constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS unique_email;

-- Drop the email column
ALTER TABLE profiles DROP COLUMN IF EXISTS email;

-- Restore original handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;