import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function sanitizeRedirect(target: string | null): string {
  if (!target) return '/home'
  if (!target.startsWith('/')) return '/home'
  if (target.startsWith('//')) return '/home'
  return target
}

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const url = new URL(request.url)
  const redirectParam = sanitizeRedirect(url.searchParams.get('redirectTo'))

  let callbackUrl = `${url.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectParam)}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
      queryParams: {
        prompt: 'consent',
        access_type: 'offline'
      }
    }
  })

  if (error || !data?.url) {
    const back = new URL('/sign-in', url.origin)
    back.searchParams.set('error', 'Failed to start Google sign-in.')
    back.searchParams.set('redirectTo', redirectParam)
    return NextResponse.redirect(back)
  }

  return NextResponse.redirect(data.url)
}
