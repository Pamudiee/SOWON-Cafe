import { createClient } from '@supabase/supabase-js'

let supabase

// Initialize on first use so the existing site works before .env is configured.
export function getSupabase() {
  if (supabase) return supabase

  const url = import.meta.env.VITE_SUPABASE_URL
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error(
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your local .env file, then restart Vite.',
    )
  }

  supabase = createClient(url, publishableKey)
  return supabase
}
