/*
  # Update profiles table and handle_new_user function

  1. Changes
    - Add email column to handle_new_user function
    - Ensure email is included when creating new profiles

  2. Notes
    - Only updates the trigger function
    - Avoids recreating existing table and policies
*/

-- Update function to handle user creation with email
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;