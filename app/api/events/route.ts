// API Route: GET /api/events
// get all events or specific event by code

import { NextRequest, NextResponse } from 'next/server'
import { getAllEvents, getEventByCode } from '@/lib/queries/events'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')

    if (code) {
      const event = await getEventByCode(code, supabase)

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

    const events = await getAllEvents(supabase)

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