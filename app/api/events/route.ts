// API Route: GET /api/events
// Get all events (optionally filtered by user_id)

import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents } from '@/lib/queries/events';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    if (userId) {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId)
        .order('event_date', { ascending: false });

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: error.message
          },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        events,
        count: events.length
      })
    }

    // otherwise, just return all events
    const events = await getAllEvents(supabase);

    return NextResponse.json({
      success: true,
      events,
      count: events.length
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}