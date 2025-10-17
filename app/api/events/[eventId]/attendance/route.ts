// API route to get attendance list for an event
// GET /api/events/[eventId]/attendance

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getEventAttendance } from '@/lib/queries/attendance';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { eventId } = await params;

    const attendance = await getEventAttendance(eventId, supabase);

    return NextResponse.json({
      success: true,
      attendance: attendance || [],
      count: attendance?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred :<'
      },
      { status: 500 }
    );
  }
}
