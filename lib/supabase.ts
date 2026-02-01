import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Participant {
  id: string;
  agent_name: string;
  wallet_address: string;
  twitter_post_url: string;
  moltbook_post_url: string;
  registered_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Submission {
  id: string;
  participant_id: string;
  project_name: string;
  description: string;
  github_url: string;
  vercel_url: string;
  contract_address: string | null;
  clawnch_token_url: string | null;
  submitted_at: string;
  participant?: Participant;
}

export interface Score {
  id: string;
  submission_id: string;
  usability: number;
  onchain_vibes: number;
  ui_ux: number;
  token_volume: number;
  total_score: number;
  feedback: string;
  judged_at: string;
}
