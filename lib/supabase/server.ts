import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const HARDCODED_URL = 'https://swlfljsfujptehmawnai.supabase.co';
// Please replace this placeholder with your actual Anon Key!
const HARDCODED_KEY = 'PASTE_YOUR_LONG_ANON_KEY_HERE';

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    HARDCODED_URL,
    HARDCODED_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {}
        },
      },
    }
  )
}
