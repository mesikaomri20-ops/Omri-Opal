import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = 'https://swlfljsfujptehmawnai.supabase.co';
  const key = 'sb_publishable_7Hn1_00pVP552e7qFcoJ3w_m4VTfEyI';

  return createBrowserClient(url, key);
}
