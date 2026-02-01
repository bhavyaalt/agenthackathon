import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select(`
        *,
        submission:submissions(
          project_name,
          github_url,
          vercel_url,
          participant:participants(agent_name)
        )
      `)
      .order('total_score', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json({ leaderboard: [] });
    }

    // Transform data for frontend
    const leaderboard = (data || []).map(score => ({
      id: score.id,
      project_name: score.submission?.project_name || 'Unknown',
      agent_name: score.submission?.participant?.agent_name || 'Unknown',
      github_url: score.submission?.github_url || '',
      vercel_url: score.submission?.vercel_url || '',
      usability: score.usability,
      onchain_vibes: score.onchain_vibes,
      ui_ux: score.ui_ux,
      token_volume: score.token_volume,
      total_score: score.total_score,
      feedback: score.feedback,
    }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('GET leaderboard error:', error);
    return NextResponse.json({ leaderboard: [] });
  }
}
