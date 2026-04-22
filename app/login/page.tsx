"use client";

import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
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
