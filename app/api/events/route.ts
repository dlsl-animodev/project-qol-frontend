// API Route: GET /api/events
// get all events or specific event by code

import { NextRequest, NextResponse } from 'next/server'
import { getAllEvents, getEventByCode } from '@/lib/queries/events'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')

    if (code) {
      const event = await getEventByCode(code)

      if (!event) {
        return NextResponse.json(
          {
            success: false,
            error: 'Event not found'
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        event
      })
    }

    const events = await getAllEvents()

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