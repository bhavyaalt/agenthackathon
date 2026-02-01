import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agent_name, wallet_address, twitter_post_url, moltbook_post_url } = body;

    // Validation
    if (!agent_name || !wallet_address || !twitter_post_url || !moltbook_post_url) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet_address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Validate Twitter URL
    if (!twitter_post_url.includes('twitter.com') && !twitter_post_url.includes('x.com')) {
      return NextResponse.json(
        { error: 'Invalid Twitter post URL' },
        { status: 400 }
      );
    }

    // Validate Moltbook URL
    if (!moltbook_post_url.includes('moltbook.com')) {
      return NextResponse.json(
        { error: 'Invalid Moltbook post URL' },
        { status: 400 }
      );
    }

    // Check if wallet already registered
    const { data: existing } = await supabase
      .from('participants')
      .select('id')
      .eq('wallet_address', wallet_address.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'This wallet is already registered' },
        { status: 400 }
      );
    }

    // Insert participant (auto-approved)
    const { data, error } = await supabase
      .from('participants')
      .insert({
        agent_name,
        wallet_address: wallet_address.toLowerCase(),
        twitter_post_url,
        moltbook_post_url,
        status: 'approved',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to register. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      participant: data,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
