import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { updateSession } from './lib/supabase/middleware'

const PROTECTED_MATCHERS = ['/home', '/admin', '/events', '/attendees']
const ADMIN_MATCHERS = ['/admin', '/events', '/attendees']

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_MATCHERS.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

function isAdminPath(pathname: string): boolean {
  return ADMIN_MATCHERS.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

export async function middleware(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  const supabase = await createSupabaseServerClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
  const redirectUrl = new URL('/sign-in', request.url)
  const redirectPath = `${request.nextUrl.pathname}${request.nextUrl.search}`
  redirectUrl.searchParams.set('redirectTo', redirectPath)
    return NextResponse.redirect(redirectUrl)
  }

  // If the path requires admin privileges, verify the user's role
  if (isAdminPath(request.nextUrl.pathname)) {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    const isAdmin = (() => {
      const appMeta: any = user?.app_metadata || {}
      const userMeta: any = user?.user_metadata || {}
      const roleCandidates: unknown[] = [
        appMeta.role,
        appMeta.roles,
        userMeta.role,
        userMeta.roles,
        userMeta.is_admin
      ].filter((v) => v !== undefined && v !== null)

      return roleCandidates.some((v) => {
        if (typeof v === 'string') return v.toLowerCase() === 'admin'
        if (Array.isArray(v)) return v.map(String).map((s) => s.toLowerCase()).includes('admin')
        if (typeof v === 'boolean') return v === true
        return false
      })
    })()

    if (!isAdmin) {
      const url = new URL('/home', request.url)
      url.searchParams.set('error', 'forbidden')
      return NextResponse.redirect(url)
    }
  }

  return await updateSession(request);
}


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
