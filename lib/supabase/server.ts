import { cookies } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'

function getEnvVar(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing Supabase environment variable: ${key}`)
  }

  return value
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

export function createClient() {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  )
}

// Deprecated: use createSupabaseServerClient() directly for all server contexts
// Note: Route/middleware-specific helpers removed; use createSupabaseServerClient() directly.




export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}