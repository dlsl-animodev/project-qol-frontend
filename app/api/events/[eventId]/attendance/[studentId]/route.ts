// API route to check if a student has attended an event
// GET /api/events/[eventId]/attendance/[studentId]

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { hasAttended } from '@/lib/queries/attendance';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; studentId: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { eventId, studentId } = await params;

    const attended = await hasAttended(eventId, studentId, supabase);

    return NextResponse.json({
      success: true,
      attended,
      eventId,
      studentId
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
