import { Suspense, type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase/auth'
import Loading from './loading'
import ContentTransition from './content-transition'

export default async function MainLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <Suspense fallback={<Loading />}>
      <ContentTransition>{children}</ContentTransition>
    </Suspense>
  )
}
