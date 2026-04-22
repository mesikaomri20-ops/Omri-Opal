"use client";

import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  const [authError, setAuthError] = useState<string | null>(searchParams?.error || null);

  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isMissingEnvVars = !envUrl || !envKey;

  const handleLogin = async () => {
    if (isMissingEnvVars) return;
    setAuthError(null);

    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback?next=/`,
        },
      });

      if (error) {
        setAuthError(error.message);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err?.message || "An unexpected error occurred during the login request.");
    }
  }

  if (isMissingEnvVars) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4 text-center">
        <div className="p-8 border-4 border-red-500 bg-red-50 rounded-xl">
          <h1 className="text-3xl md:text-4xl font-black text-red-600 tracking-widest mb-6">
            DEBUG: API KEY IS MISSING FROM BROWSER
          </h1>
          <p className="text-red-800 font-medium text-lg leading-relaxed">
            <strong>URL present:</strong> {envUrl ? "YES" : "NO"} <br/>
            <strong>Key present:</strong> {envKey ? "YES" : "NO"}
          </p>
          <p className="text-red-700 mt-4 text-sm max-w-lg mx-auto">
            Vercel is definitely not passing the variables to the client side. Check that the prefix 'NEXT_PUBLIC_' is exact, and that the environment variables are configured for Production/Preview correctly in Vercel settings, then redeploy.
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
        className="w-full max-w-md bg-white border border-brand-border/60 rounded-3xl p-10 md:p-14 shadow-lg text-center relative"
      >
        <h1 className="text-2xl md:text-3xl font-light tracking-wide text-foreground mb-4">Welcome Back</h1>
        <p className="text-foreground/60 text-sm font-light mb-8 leading-relaxed">
          Please sign in to access The Journey, The Vault, and manage your private Life Capsule memories.
        </p>

        {authError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-left">
            <strong>Login Failed:</strong> {authError}
          </div>
        )}

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
