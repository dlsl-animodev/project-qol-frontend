import { Suspense, type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase/auth'
import Loading from './loading'

export default async function MainLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <Suspense fallback={<Loading />}>{children}</Suspense>
  )
}
