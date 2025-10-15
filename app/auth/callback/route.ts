import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  // Extract auth code and optional redirect path
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();

    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the intended path or fallback to homepage
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // In case of any issues, redirect to sign-in with an error message
  const signInUrl = new URL('/sign-in', origin);
  signInUrl.searchParams.set('error', 'Failed to authenticate.');
  return NextResponse.redirect(signInUrl);
}
