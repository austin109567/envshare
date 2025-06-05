/*
  # Create env vault tables

  1. New Tables
    - `env_vault` - Stores the environment variables
      - `id` (serial, primary key)
      - `name` (text, not null) - Name of the environment
      - `content` (text, not null) - The environment variables
      - `created_by` (text, not null) - Email of user who created it
      - `created_at` (timestamptz, not null, default: now())
    
  2. Security
    - Enable RLS on `env_vault` table
    - Add policy for authenticated users to read and insert
*/

-- Create the env_vault table
CREATE TABLE IF NOT EXISTS env_vault (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE env_vault ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all records
CREATE POLICY "Allow authenticated users to read all entries" 
  ON env_vault
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to insert records
CREATE POLICY "Allow authenticated users to insert entries"
  ON env_vault
  FOR INSERT
  TO authenticated
  WITH CHECK (true);