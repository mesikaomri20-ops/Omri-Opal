import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        // Safely redirect back using the origin
        const isRelative = next.startsWith('/')
        const redirectUrl = isRelative ? `${origin}${next}` : `${origin}/${next}`
        return NextResponse.redirect(redirectUrl)
      } else {
        console.error("Auth Callback Error:", error.message);
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
      }
    }

    return NextResponse.redirect(`${origin}/login?error=No_code_provided`)
  } catch (error) {
    console.error("Auth Callback Exception:", error)
    // Fallback in case request.url parsing fails
    return NextResponse.redirect(new URL('/login?error=Invalid_request', request.url).toString())
  }
}
