/*
  # Create onboarding-related tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `age` (integer)
      - `gender` (text)
      - `zip_code` (text)
      - `learning_preferences` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `interests`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamptz)
    
    - `user_interests`
      - `user_id` (uuid, references auth.users)
      - `interest_id` (uuid, references interests)
      - `created_at` (timestamptz)
    
    - `user_availability`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `day` (text)
      - `start_time` (text)
      - `end_time` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  age integer,
  gender text,
  zip_code text,
  learning_preferences text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create interests table
CREATE TABLE IF NOT EXISTS interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create user_interests table
CREATE TABLE IF NOT EXISTS user_interests (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  interest_id uuid REFERENCES interests(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, interest_id)
);

-- Create user_availability table
CREATE TABLE IF NOT EXISTS user_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  day text NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_availability ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for interests
CREATE POLICY "Anyone can read interests"
  ON interests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create interests"
  ON interests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for user_interests
CREATE POLICY "Users can read own interests"
  ON user_interests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own interests"
  ON user_interests
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_availability
CREATE POLICY "Users can read own availability"
  ON user_availability
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own availability"
  ON user_availability
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);