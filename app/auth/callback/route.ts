import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Safely redirect back to the app using dynamic URL resolution 
      // instead of hardcoded strings to avoid PKCE cookie mismatches.
      return NextResponse.redirect(new URL(next, request.url))
    } else {
      console.error("Auth Callback Error:", error.message);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url))
    }
  }

  return NextResponse.redirect(new URL(`/login?error=No_code_provided`, request.url))
}
