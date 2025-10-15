// API Route: GET /api/events/[eventId]
// get event details and attendance by event ID

import { NextRequest, NextResponse } from 'next/server'
import { getEventAttendance, getAttendanceCount } from '@/lib/queries/attendance'
import { getEventById } from '@/lib/queries/events'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
  const supabase = await createSupabaseServerClient()
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      )
    }

    const {
      data: { user }
    } = await supabase.auth.getUser()
    const appMeta: any = user?.app_metadata || {}
    const userMeta: any = user?.user_metadata || {}
    const roles: string[] = [
      ...(Array.isArray(appMeta.roles) ? appMeta.roles : [appMeta.role].filter(Boolean)),
      ...(Array.isArray(userMeta.roles) ? userMeta.roles : [userMeta.role].filter(Boolean))
    ]
      .map(String)
      .map((r) => r.toLowerCase())

    if (!roles.includes('admin')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { eventId } = await params

    const event = await getEventById(eventId, supabase)

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: 'Event not found'
        },
        { status: 404 }
      )
    }

    const attendance = await getEventAttendance(eventId, supabase)
    const count = await getAttendanceCount(eventId, supabase)

    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        name: event.event_name,
        code: event.event_code,
        date: event.event_date
      },
      attendance,
      count
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