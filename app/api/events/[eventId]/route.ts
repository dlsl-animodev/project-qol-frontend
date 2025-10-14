// API Route: GET /api/events/[eventId]
// get event details and attendance by event ID

import { NextRequest, NextResponse } from 'next/server'
import { getEventAttendance, getAttendanceCount } from '@/lib/queries/attendance'
import { getEventById } from '@/lib/queries/events'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params

    const event = await getEventById(eventId)

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: 'Event not found'
        },
        { status: 404 }
      )
    }

    const attendance = await getEventAttendance(eventId)
    const count = await getAttendanceCount(eventId)

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