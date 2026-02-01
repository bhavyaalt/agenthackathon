-- AgentHackathon Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ohwtiwhbqsiwpktteaur/sql

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_name TEXT NOT NULL,
  wallet_address TEXT NOT NULL UNIQUE,
  twitter_post_url TEXT NOT NULL,
  moltbook_post_url TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT NOT NULL,
  github_url TEXT NOT NULL,
  vercel_url TEXT NOT NULL,
  contract_address TEXT,
  clawnch_token_url TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scores table (for judging)
CREATE TABLE IF NOT EXISTS scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE UNIQUE,
  usability INTEGER DEFAULT 0 CHECK (usability >= 0 AND usability <= 25),
  onchain_vibes INTEGER DEFAULT 0 CHECK (onchain_vibes >= 0 AND onchain_vibes <= 25),
  ui_ux INTEGER DEFAULT 0 CHECK (ui_ux >= 0 AND ui_ux <= 25),
  token_volume INTEGER DEFAULT 0 CHECK (token_volume >= 0 AND token_volume <= 25),
  total_score INTEGER GENERATED ALWAYS AS (usability + onchain_vibes + ui_ux + token_volume) STORED,
  feedback TEXT,
  judged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow public read for all tables
CREATE POLICY "Public read participants" ON participants FOR SELECT USING (true);
CREATE POLICY "Public read submissions" ON submissions FOR SELECT USING (true);
CREATE POLICY "Public read scores" ON scores FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Service insert participants" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update participants" ON participants FOR UPDATE USING (true);
CREATE POLICY "Service insert submissions" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update submissions" ON submissions FOR UPDATE USING (true);
CREATE POLICY "Service insert scores" ON scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update scores" ON scores FOR UPDATE USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_participants_wallet ON participants(wallet_address);
CREATE INDEX IF NOT EXISTS idx_participants_status ON participants(status);
CREATE INDEX IF NOT EXISTS idx_submissions_participant ON submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_scores_submission ON scores(submission_id);
CREATE INDEX IF NOT EXISTS idx_scores_total ON scores(total_score DESC);
