// API Route: /api/events/[eventId]
// GET: get event details and attendance by event ID
// PUT: update event details
// DELETE: delete event

import { NextRequest, NextResponse } from 'next/server';
import { getEventAttendance, getAttendanceCount } from '@/lib/queries/attendance';
import { getEventById } from '@/lib/queries/events';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/queries/user';

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

    const event = await getEventById(eventId, supabase);

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: 'Event not found'
        },
        { status: 404 }
      );
    }

    const attendance = await getEventAttendance(eventId, supabase);
    const count = await getAttendanceCount(eventId, supabase);

    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        name: event.event_name,
        date: event.event_date,
        description: event.description
      },
      attendance,
      count
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// update event details
export async function PUT(
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

    const role = await getUserRole();

    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { eventId } = await params;
    const body = await request.json();

    const existingEvent = await getEventById(eventId, supabase);
    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // updates object
    const updates: {
      event_name?: string
      event_date?: string
      description?: string
    } = {}

    if (body.event_name) updates.event_name = body.event_name;

    if (body.event_date) updates.event_date = body.event_date;

    if (body.description !== undefined) updates.description = body.description;

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully',
      event: {
        id: data.id,
        event_name: data.event_name,
        event_date: data.event_date,
        description: data.description,
        user_id: data.user_id
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
      )
    }

    const role = await getUserRole();

    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { eventId } = await params;

    const existingEvent = await getEventById(eventId, supabase);

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}