import { createBrowserClient } from '@supabase/ssr'

export function createClient(urlUrl?: string, keyKey?: string) {
  const url = urlUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = keyKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Missing Supabase environment variables!");
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createBrowserClient(url, key);
}
