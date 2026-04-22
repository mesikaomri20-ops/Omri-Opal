"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Our Journey", path: "/our-journey" },
  { name: "The Vault", path: "/the-vault" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-brand-border/50 transition-colors duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-light tracking-widest text-foreground hover:opacity-80 transition-opacity">
          OMRI <span className="text-brand-gold">&</span> OPEL
        </Link>
        
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => {
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
        </nav>
        
        {/* Mobile menu toggle could go here, keeping minimal for now */}
        <div className="md:hidden flex items-center">
          <span className="text-xs uppercase tracking-widest text-brand-gold">Menu</span>
        </div>
      </div>
    </header>
  );
}
