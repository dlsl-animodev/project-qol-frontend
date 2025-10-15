import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()

  // Supabase will handle the code exchange and set the session cookies
  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  // Determine target redirect
  const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/home'

  if (error) {
    const url = new URL('/sign-in', request.url)
    url.searchParams.set('error', 'Authentication failed.')
    url.searchParams.set('redirectTo', redirectTo)
    return NextResponse.redirect(url)
  }

  if (!session) {
    const url = new URL('/sign-in', request.url)
    url.searchParams.set('error', 'No session returned.')
    url.searchParams.set('redirectTo', redirectTo)
    return NextResponse.redirect(url)
  }

  const url = new URL(redirectTo, request.url)
  return NextResponse.redirect(url)
}
