import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  try {
    // Get participant count
    const { count: participants } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    // Get submission count
    const { count: submissions } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      participants: participants || 0,
      submissions: submissions || 0,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({
      participants: 0,
      submissions: 0,
    });
  }
}
