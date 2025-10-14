// API Route: POST /api/validate-code
//  for validating event codes

import { NextRequest, NextResponse } from 'next/server'
import { validateCodeAndGetEvent } from '@/lib/queries/events'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameter: code'
        },
        { status: 400 }
      )
    }

    const validation = await validateCodeAndGetEvent(code)

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