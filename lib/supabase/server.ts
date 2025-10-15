import { cookies } from 'next/headers'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

// we want to use supabase in the future to generate types from our database
type Database = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
export type Supabase = SupabaseClient<Database>

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