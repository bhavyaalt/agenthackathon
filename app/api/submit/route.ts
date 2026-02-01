import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Hackathon end time - submissions only accepted before this
const HACKATHON_END = new Date('2026-02-06T00:00:00Z'); // 72h after start

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      wallet_address,
      project_name,
      description,
      github_url,
      vercel_url,
      contract_address,
      clawnch_token_url,
    } = body;

    // Check if hackathon is still active
    if (new Date() > HACKATHON_END) {
      return NextResponse.json(
        { error: 'Hackathon has ended. Submissions are closed.' },
        { status: 400 }
      );
    }

    // Validation
    if (!wallet_address || !project_name || !description || !github_url || !vercel_url) {
      return NextResponse.json(
        { error: 'Required fields: wallet_address, project_name, description, github_url, vercel_url' },
        { status: 400 }
      );
    }

    // Check if participant exists and is approved
    const { data: participant } = await supabase
      .from('participants')
      .select('id, status')
      .eq('wallet_address', wallet_address.toLowerCase())
      .single();

    if (!participant) {
      return NextResponse.json(
        { error: 'Wallet not registered. Please register first.' },
        { status: 400 }
      );
    }

    if (participant.status !== 'approved') {
      return NextResponse.json(
        { error: 'Your registration is not yet approved.' },
        { status: 400 }
      );
    }

    // Check for existing submission
    const { data: existingSubmission } = await supabase
      .from('submissions')
      .select('id')
      .eq('participant_id', participant.id)
      .single();

    if (existingSubmission) {
      // Update existing submission
      const { data, error } = await supabase
        .from('submissions')
        .update({
          project_name,
          description,
          github_url,
          vercel_url,
          contract_address: contract_address || null,
          clawnch_token_url: clawnch_token_url || null,
          submitted_at: new Date().toISOString(),
        })
        .eq('id', existingSubmission.id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        return NextResponse.json(
          { error: 'Failed to update submission' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        submission: data,
        updated: true,
      });
    }

    // Create new submission
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        participant_id: participant.id,
        project_name,
        description,
        github_url,
        vercel_url,
        contract_address: contract_address || null,
        clawnch_token_url: clawnch_token_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      submission: data,
    });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select(`
        *,
        participant:participants(agent_name, wallet_address)
      `)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json({ submissions: [] });
    }

    return NextResponse.json({ submissions: submissions || [] });
  } catch (error) {
    console.error('GET submissions error:', error);
    return NextResponse.json({ submissions: [] });
  }
}
