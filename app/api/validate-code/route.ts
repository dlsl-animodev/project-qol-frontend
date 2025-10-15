// API Route: POST /api/validate-code
//  for validating event codes

import { NextRequest, NextResponse } from 'next/server'
import { validateCodeAndGetEvent } from '@/lib/queries/events'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { code } = body

    if (typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid code format: code must be a non-empty string'
        },
        { status: 400 }
      )
    }
    
    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameter: code'
        },
        { status: 400 }
      )
    }

    const validation = await validateCodeAndGetEvent(code, supabase)

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          reason: validation.reason
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      valid: true,
      event: validation.event,
      code: validation.code
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