-- University of Iowa Sports Passion Survey
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create the survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  grade_level TEXT NOT NULL,
  gender TEXT NOT NULL,
  sports_followed TEXT[] NOT NULL,
  passion_level TEXT NOT NULL,
  event_attendance TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (submit a survey response)
CREATE POLICY "Allow public inserts"
  ON survey_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to SELECT (view aggregated results)
CREATE POLICY "Allow public reads"
  ON survey_responses
  FOR SELECT
  TO anon
  USING (true);
