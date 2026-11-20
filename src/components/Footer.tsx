'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-panel-2 border-t border-line text-center text-sm text-muted py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <Link href="/" aria-label="Orbitvale home" className="group">
              <Image
                src="/brand/orbitvale.png"
                alt="Orbitvale"
                width={120}
                height={40}
                className="h-6 w-auto object-contain mix-blend-screen brightness-110 opacity-70 transition-opacity group-hover:opacity-100"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (!img.src.includes('orbitvale-logo.jpg')) {
                    img.src = '/brand/orbitvale-logo.jpg';
                  }
                }}
              />
            </Link>
            <nav className="flex gap-6">
              <Link href="/work" className="text-sm text-muted hover:text-accent transition-colors">Work</Link>
              <Link href="/services" className="text-sm text-muted hover:text-accent transition-colors">Services</Link>
              <Link href="/about" className="text-sm text-muted hover:text-accent transition-colors">About</Link>
              <Link href="/contact" className="text-sm text-muted hover:text-accent transition-colors">Contact</Link>
            </nav>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim">
            ORBITVALE © 2026 · Built for orbiting business goals
          </div>
        </div>
      </div>
    </footer>
  );
}
