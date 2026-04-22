import { createBrowserClient } from '@supabase/ssr'

const HARDCODED_URL = 'https://swlfljsfujptehmawnai.supabase.co';
// Please replace this placeholder with your actual Anon Key!
const HARDCODED_KEY = 'PASTE_YOUR_LONG_ANON_KEY_HERE';

export function createClient() {
  return createBrowserClient(HARDCODED_URL, HARDCODED_KEY);
}
