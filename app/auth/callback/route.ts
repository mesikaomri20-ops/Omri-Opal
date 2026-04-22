import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // Enforce Vercel production URL context
  const targetHost = 'https://omri-opal.vercel.app'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${targetHost}${next === '/' ? '' : next}`)
    } else {
      // Pass the actual error message back to the UI for debugging
      console.error("Auth Callback Error:", error.message);
      return NextResponse.redirect(`${targetHost}/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  return NextResponse.redirect(`${targetHost}/login?error=No_code_provided`)
}

