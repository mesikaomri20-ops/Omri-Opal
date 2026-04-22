"use client";

import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { LogIn, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  // Hard-read the variables here to ensure Next.js bundles them into the client JS
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isMissingEnvVars = !url || !key;

  const handleLogin = async () => {
    if (isMissingEnvVars) return;
    
    // Correctly pass the anon_key (and url) down to the client dynamically
    const supabase = createClient(url, key);
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/`,
      },
    })
  }

  if (isMissingEnvVars) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4">
        <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-3xl p-10 md:p-14 shadow-lg text-center text-red-800">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500 opacity-80" />
          <h1 className="text-xl md:text-2xl font-medium tracking-wide mb-4">Configuration Error</h1>
          <p className="text-sm font-light leading-relaxed">
            The database environment variables are missing. Please configure <b>NEXT_PUBLIC_SUPABASE_URL</b> and <b>NEXT_PUBLIC_SUPABASE_ANON_KEY</b> to enable login.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white border border-brand-border/60 rounded-3xl p-10 md:p-14 shadow-lg text-center"
      >
        <h1 className="text-2xl md:text-3xl font-light tracking-wide text-foreground mb-4">Welcome Back</h1>
        <p className="text-foreground/60 text-sm font-light mb-10 leading-relaxed">
          Please sign in to access The Journey, The Vault, and manage your private Life Capsule memories.
        </p>

        <button 
          onClick={handleLogin}
          className="w-full relative flex items-center justify-center gap-3 px-6 py-4 bg-brand-dark text-white rounded-xl hover:bg-brand-dark/90 transition-all font-light tracking-wide shadow-md group"
        >
          <LogIn className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          Sign in with Google
        </button>
      </motion.div>
    </div>
  )
}
