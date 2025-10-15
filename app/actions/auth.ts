'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function sanitizeRedirect(target: unknown): string | null {
  if (typeof target !== 'string') return null
  if (!target.startsWith('/')) return null
  if (target.startsWith('//')) return null
  return target
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const redirectTo = sanitizeRedirect(formData.get('redirectTo')) ?? '/home'

  const origin = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || ''
  const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`
  const callbackUrl = `${baseUrl}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${callbackUrl}?redirectTo=${encodeURIComponent(redirectTo)}`,
      queryParams: {
        prompt: 'consent',
        access_type: 'offline'
      }
    }
  })

  if (error) {
    // If we can't initiate OAuth, just go back to sign-in
    redirect('/sign-in')
  }

  // Redirect the user to the provider's consent screen
  if (data?.url) {
    redirect(data.url)
  }

  redirect('/sign-in')
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/sign-in')
}
