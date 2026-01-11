'use client';

import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="px-4 h-14 sticky top-0 inset-x-0 w-full bg-background/40 backdrop-blur-lg border-b border-border z-50">
      <div className="flex items-center justify-between h-full mx-auto md:max-w-screen-xl">
        <Link href="/" className="flex items-center gap-2">
          {/* Remove <a> tag if it exists, Link handles it */}
          <span className="text-xl font-bold">Logo</span>
        </Link>
        
        <nav className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <ul className="flex items-center justify-center gap-8">
            <li>
              <Link href="#features" className="hover:text-foreground/80 text-sm">
                Features
              </Link>
            </li>
            <li>
              <Link href="#features" className="hover:text-foreground/80 text-sm">
                Features
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-foreground/80 text-sm">
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>

        {/* ...existing user menu/auth buttons... */}
      </div>
    </header>
  );
}