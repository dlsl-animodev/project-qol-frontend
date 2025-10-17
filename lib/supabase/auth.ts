import { redirect } from 'next/navigation'
import type { Session, User } from '@supabase/supabase-js'
import { createSupabaseServerClient } from './server'

export async function getServerSession(): Promise<Session | null> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  return session
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return user ?? null
}

export async function requireUser(): Promise<User> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();

  const { getUserRole } = await import('../queries/user');
  const role = await getUserRole();

  if (role !== 'admin') {
    redirect('/home?error=forbidden');
  }

  return user;
}
