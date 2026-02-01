import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  try {
    const { data: participants, error } = await supabase
      .from('participants')
      .select('*')
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json({ participants: [] });
    }

    return NextResponse.json({ participants: participants || [] });
  } catch (error) {
    console.error('GET participants error:', error);
    return NextResponse.json({ participants: [] });
  }
}
