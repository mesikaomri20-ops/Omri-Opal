"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const publicLinks = [
  { name: "Home", path: "/" },
];

const authLinks = [
  { name: "Our Journey", path: "/our-journey" },
  { name: "Adventures", path: "/adventures" },
  { name: "The Vault", path: "/the-vault" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-brand-border/50 transition-colors duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-light tracking-widest text-foreground hover:opacity-80 transition-opacity">
          OMRI <span className="text-brand-gold">&</span> OPAL
        </Link>
        
        <nav className="hidden md:flex items-center space-x-10">
          {[...publicLinks, ...(user ? authLinks : [])].map((link) => {
            const isActive = pathname === link.path;
            
            return (
              <Link 
                key={link.name} 
                href={link.path}
                className={`relative text-sm font-medium tracking-wider uppercase transition-colors hover:text-brand-gold
                  ${isActive ? "text-brand-gold" : "text-foreground/70"}`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-px bg-brand-gold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            );
          })}
          
          {user ? (
            <button 
              onClick={handleLogout} 
              className="text-sm font-medium tracking-wider uppercase transition-colors text-brand-gold hover:opacity-80"
            >
              Logout
            </button>
          ) : (
            <Link 
              href="/login" 
              className="text-sm font-medium tracking-wider uppercase transition-colors text-foreground/70 hover:text-brand-gold"
            >
              Login
            </Link>
          )}
        </nav>
        
        {/* Mobile menu toggle could go here, keeping minimal for now */}
        <div className="md:hidden flex items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-brand-gold">Menu</span>
        </div>
      </div>
    </header>
  );
}
