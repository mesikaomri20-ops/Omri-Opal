import { createBrowserClient } from '@supabase/ssr'

export function createClient(urlArg?: string, keyArg?: string) {
  // Use exact process.env string access without destructuring 
  const url = urlArg || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = keyArg || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Return the client even if keys are empty so we don't crash Next.js routing,
  // we will handle the missing key error explicitly in the UI components
  return createBrowserClient(url, key);
}
