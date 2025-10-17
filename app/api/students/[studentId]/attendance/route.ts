// API route to get a student's attendance history
// GET /api/students/[studentId]/attendance

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getStudentAttendance } from '@/lib/queries/attendance';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
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

    const { studentId } = await params;

    // optional only: limit parameter from query string (default 50)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const attendance = await getStudentAttendance(studentId, limit, supabase);

    return NextResponse.json({
      success: true,
      attendance: attendance || [],
      count: attendance?.length || 0,
      studentId
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
