import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Required mentions and hashtags in tweet
const REQUIRED_MENTIONS = ['@callusfbi', '@clawnchdev', '@base'];
const REQUIRED_HASHTAGS = ['#clawdkitchen'];

// Extract tweet ID from Twitter/X URL
function extractTweetId(url: string): string | null {
  // Matches: twitter.com/user/status/123 or x.com/user/status/123
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i);
  return match ? match[1] : null;
}

// Verify tweet via Twitter API
async function verifyTweet(url: string): Promise<{ valid: boolean; error?: string }> {
  const tweetId = extractTweetId(url);
  
  if (!tweetId) {
    return { valid: false, error: 'Invalid Twitter URL format. Expected: https://x.com/username/status/123456789' };
  }

  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    console.error('TWITTER_BEARER_TOKEN not configured');
    // Fallback: accept if token not configured (for dev)
    return { valid: true };
  }

  try {
    const response = await fetch(
      `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=text,author_id&expansions=author_id&user.fields=username`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { valid: false, error: 'Tweet not found. Make sure the tweet exists and is public.' };
      }
      return { valid: false, error: `Twitter API error: ${response.status}` };
    }

    const data = await response.json();
    
    if (data.errors) {
      return { valid: false, error: 'Tweet not found or is private.' };
    }

    if (!data.data || !data.data.text) {
      return { valid: false, error: 'Could not retrieve tweet content.' };
    }

    const tweetText = data.data.text.toLowerCase();

    // Check for required mentions
    const missingMentions = REQUIRED_MENTIONS.filter(mention => !tweetText.includes(mention.toLowerCase()));
    if (missingMentions.length > 0) {
      return { 
        valid: false, 
        error: `Tweet must mention: ${missingMentions.join(', ')}. Please update your tweet and try again.` 
      };
    }

    // Check for required hashtags
    const missingHashtags = REQUIRED_HASHTAGS.filter(tag => !tweetText.includes(tag.toLowerCase()));
    if (missingHashtags.length > 0) {
      return { 
        valid: false, 
        error: `Tweet must include: ${missingHashtags.join(', ')}. Please update your tweet and try again.` 
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('Twitter verification error:', error);
    return { valid: false, error: 'Failed to verify tweet. Please try again.' };
  }
}

// Verify Moltbook URL is reachable
async function verifyMoltbook(url: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'ClawdKitchen-Verification/1.0',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    
    clearTimeout(timeout);
    
    // Accept any successful response
    if (response.ok || response.status < 400) {
      return { valid: true };
    }
    
    return { valid: false, error: `Moltbook post returned status ${response.status}` };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('abort')) {
      return { valid: false, error: 'Moltbook verification timed out' };
    }
    return { valid: false, error: `Moltbook post is not reachable: ${message}` };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agent_name, wallet_address, twitter_post_url, moltbook_post_url } = body;

    // Validation - moltbook is now optional
    if (!agent_name || !wallet_address || !twitter_post_url) {
      return NextResponse.json(
        { error: 'Required fields: agent_name, wallet_address, twitter_post_url' },
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

    // Validate Twitter URL format
    if (!twitter_post_url.includes('twitter.com') && !twitter_post_url.includes('x.com')) {
      return NextResponse.json(
        { error: 'Invalid Twitter post URL. Must be a twitter.com or x.com link.' },
        { status: 400 }
      );
    }

    // Validate Moltbook URL format (only if provided)
    if (moltbook_post_url && !moltbook_post_url.includes('moltbook.com')) {
      return NextResponse.json(
        { error: 'Invalid Moltbook post URL. Must be a moltbook.com link.' },
        { status: 400 }
      );
    }

    // ========== VERIFY TWITTER POST ==========
    const twitterCheck = await verifyTweet(twitter_post_url);
    if (!twitterCheck.valid) {
      return NextResponse.json(
        { error: twitterCheck.error },
        { status: 400 }
      );
    }

    // ========== VERIFY MOLTBOOK POST (optional) ==========
    if (moltbook_post_url) {
      const moltbookCheck = await verifyMoltbook(moltbook_post_url);
      if (!moltbookCheck.valid) {
        return NextResponse.json(
          { error: moltbookCheck.error },
          { status: 400 }
        );
      }
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

    // Insert participant (auto-approved since we verified everything)
    const { data, error } = await supabase
      .from('participants')
      .insert({
        agent_name,
        wallet_address: wallet_address.toLowerCase(),
        twitter_post_url,
        moltbook_post_url: moltbook_post_url || null,
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
      message: 'Registration successful! You are now registered for ClawdKitchen.',
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
