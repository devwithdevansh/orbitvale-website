'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { MagneticButton } from '@/components/MagneticButton';
import { useLenis } from '@/components/SmoothScroll';
import { liveCollections } from '@/lib/liveExperiences';

const LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];


function getDemoForPath(pathname: string): { url: string; isExternal: boolean } | null {
  if (!pathname.startsWith('/work/')) return null;
  const slug = pathname.replace('/work/', '').split('/')[0];
  if (!slug) return null;
  if (slug === 'forge-gym') {
    return { url: 'https://demo-web-forge-gym.onrender.com/', isExternal: true };
  }
  if (slug === 'automotive') {
    return { url: 'https://car-detailing-by-dwd.onrender.com/', isExternal: true };
  }
  if (slug === 'school-erp') {
    return { url: 'https://school-erp-frontend-fjqv.onrender.com/', isExternal: true };
  }
  if (liveCollections[slug]) {
    return { url: `/live-lab/${slug}`, isExternal: false };
  }
  return null;
}

export function Nav() {
  const pathname = usePathname();
  const onProjectPage = pathname.startsWith('/work/');
  const currentDemo = getDemoForPath(pathname);
  const { scrollToTop } = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  const handleLogoClick = useCallback(() => {
    if (pathname === '/') {
      scrollToTop(true);
    }
  }, [pathname, scrollToTop]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1000] isolate transition-[background-color,border-color,box-shadow] duration-300 ${
        onProjectPage ? 'border-b border-white/15 bg-[#08090c]/95 backdrop-blur-xl shadow-lg shadow-black/20' : scrolled
          ? 'border-b border-line/40 bg-[#07080a]/85 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 sm:py-4">
        {/* Brand Logo link: Uses tight transparent full logo without artificial screen blend */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="group relative flex items-center transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent rounded-md p-1"
          aria-label="Orbitvale homepage"
        >
          <div className="relative w-[136px] sm:w-[174px] md:w-[184px] aspect-[1162/459]">
            <Image
              src="/brand/v2/full-logo.png"
              alt="Orbitvale"
              fill
              priority
              sizes="(max-width: 640px) 136px, (max-width: 768px) 174px, 184px"
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-9 md:flex" aria-label="Main Navigation">
          {LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-mono text-[11px] uppercase tracking-[0.2em] transition-colors py-1 focus-visible:ring-1 focus-visible:ring-accent rounded ${
                  active ? 'text-accent font-medium' : onProjectPage ? 'text-[#b8bcc7] hover:text-white' : 'text-muted hover:text-ink'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Explore Demo Button (When on /work/[slug]) */}
        {currentDemo && (
          <div className="hidden md:inline-block mr-3">
            {currentDemo.isExternal ? (
              <a
                href={currentDemo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent text-[#07080a] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 hover:bg-white hover:border-white shadow-[0_0_15px_rgba(127,243,208,0.25)]"
              >
                <span>Explore Demo</span>
                <span>↗</span>
              </a>
            ) : (
              <Link
                href={currentDemo.url}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent text-[#07080a] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 hover:bg-white hover:border-white shadow-[0_0_15px_rgba(127,243,208,0.25)]"
              >
                <span>Explore Demo</span>
                <span>↗</span>
              </Link>
            )}
          </div>
        )}

        {/* Magnetic CTA button */}
        <div className="hidden md:inline-block">
          <MagneticButton strength={0.35}>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-accent/50 bg-accent/10 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent transition-all duration-300 hover:bg-accent hover:text-[#07080a] hover:border-accent hover:shadow-[0_0_18px_rgba(127,243,208,0.3)] focus-visible:ring-2 focus-visible:ring-accent outline-none"
            >
              Start a project
            </Link>
          </MagneticButton>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <span
            className={`h-0.5 w-6 bg-ink transition-transform duration-300 ${
              open ? 'translate-y-[4px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-ink transition-transform duration-300 ${
              open ? '-translate-y-[4px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile navigation drawer */}
      {open && (
        <nav
          id="mobile-nav"
          className="flex flex-col gap-2 border-t border-line/40 bg-[#07080a]/95 backdrop-blur-xl px-6 py-6 md:hidden shadow-2xl"
          aria-label="Mobile Navigation"
        >
          {currentDemo && (
            currentDemo.isExternal ? (
              <a
                href={currentDemo.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mb-2 inline-flex items-center justify-center gap-2 rounded-full border border-accent bg-accent text-[#07080a] font-mono text-xs uppercase tracking-[0.2em] font-semibold py-3 shadow-[0_0_20px_rgba(127,243,208,0.3)]"
              >
                <span>Explore Demo</span>
                <span>↗</span>
              </a>
            ) : (
              <Link
                href={currentDemo.url}
                onClick={() => setOpen(false)}
                className="mb-2 inline-flex items-center justify-center gap-2 rounded-full border border-accent bg-accent text-[#07080a] font-mono text-xs uppercase tracking-[0.2em] font-semibold py-3 shadow-[0_0_20px_rgba(127,243,208,0.3)]"
              >
                <span>Explore Demo</span>
                <span>↗</span>
              </Link>
            )
          )}
          {[...LINKS, { href: '/contact', label: 'Start a project' }].map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));
            const isCta = link.href === '/contact';
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-3 font-mono text-xs uppercase tracking-[0.22em] transition-colors focus-visible:ring-1 focus-visible:ring-accent rounded px-2 ${
                  isCta
                    ? 'mt-2 inline-flex items-center justify-center rounded-full border border-accent bg-accent/15 text-accent font-semibold py-3'
                    : active
                    ? 'text-accent font-semibold bg-white/5'
                    : 'text-muted hover:text-ink'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
export default Nav;
