'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { clamp } from '@/lib/utils';

interface WorldClock {
  city: string;
  timeZone: string;
}

const CLOCKS: WorldClock[] = [
  { city: 'Oslo', timeZone: 'Europe/Oslo' },
  { city: 'London', timeZone: 'Europe/London' },
  { city: 'San Francisco', timeZone: 'America/Los_Angeles' },
];

interface NextRouteInfo {
  nextHref: string;
  nextLabel: string;
  eyebrow: string;
  subtext: string;
}

function getNextRoute(pathname: string): NextRouteInfo {
  if (pathname === '/work' || pathname.startsWith('/work/')) {
    return {
      nextHref: '/services',
      nextLabel: 'Explore Services →',
      eyebrow: 'Next / 03 · Capabilities',
      subtext: 'Product engineering, design systems, interactive 3D, and strategy.',
    };
  }
  if (pathname === '/services') {
    return {
      nextHref: '/about',
      nextLabel: 'Meet the Studio →',
      eyebrow: 'Next / 04 · Studio',
      subtext: 'Studio principles, engineering ethos, and the orbit journey.',
    };
  }
  if (pathname === '/about') {
    return {
      nextHref: '/contact',
      nextLabel: 'Start a Conversation →',
      eyebrow: 'Next / 05 · Connect',
      subtext: 'Tell us about your project. We’ll map the orbit together.',
    };
  }
  if (pathname === '/contact') {
    return {
      nextHref: '/',
      nextLabel: 'Back to Home →',
      eyebrow: 'Orbit / 01 · Return',
      subtext: 'Return to the primary orbit and explore our featured capabilities.',
    };
  }
  // Default for home '/'
  return {
    nextHref: '/work',
    nextLabel: 'Explore Work →',
    eyebrow: 'Next / 02 · Selected Work',
    subtext: 'Featured case studies across fintech, infrastructure, and Web3.',
  };
}

/**
 * Section 07 · Footer & Controlled Next-Page Action
 *
 * 1. Deep cosmic dark (#07080a) with radiant mint aura.
 * 2. Route-aware, opt-in next-page destination:
 *    Home → Work → Services → About → Contact → Home.
 *    Scroll progress is visual only — NO automatic redirect on scroll!
 *    Navigation only occurs on explicit click or keyboard action.
 * 3. Studio timezones (Oslo, London, San Francisco) with live calculation.
 * 4. Monumental architectural wordmark "ORBITVALE" anchored across the bottom.
 */
export function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const footerRef = useRef<HTMLElement>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [expanding, setExpanding] = useState(false);
  const [times, setTimes] = useState<{ [city: string]: string }>({});

  const nextRoute = getNextRoute(pathname);

  // Clear any pending transition timers on unmount or pathname change
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, [pathname]);

  // Reset expanding state when pathname changes
  useEffect(() => {
    setExpanding(false);
  }, [pathname]);

  // Live world clocks calculation
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const newTimes: { [city: string]: string } = {};
      CLOCKS.forEach((clock) => {
        newTimes[clock.city] = new Intl.DateTimeFormat('en-GB', {
          timeZone: clock.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now);
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 10000);
    return () => clearInterval(interval);
  }, []);

  // Track scroll inside footer for visual progress indicator ONLY (no auto redirect)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const el = footerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const windowH = window.innerHeight;

        const visibleDistance = windowH - rect.top;
        const totalRequired = Math.max(rect.height * 0.7, 200);
        const p = clamp(visibleDistance / totalRequired, 0, 1);
        setScrollProgress(p);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Explicit user-triggered navigation
  const handleNextPageClick = useCallback(() => {
    if (expanding) return;
    if (pathname === nextRoute.nextHref) return; // Prevent pushing to current path

    setExpanding(true);

    transitionTimerRef.current = setTimeout(() => {
      router.push(nextRoute.nextHref);
    }, 600);
  }, [expanding, pathname, nextRoute.nextHref, router]);

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#07080a] text-[#f2f4f7] overflow-hidden pt-24 pb-12 px-6 select-none border-t border-line/30"
      id="section-footer"
      style={{ isolation: 'isolate' }}
    >
      {/* ── Radiant Mint Glow Aura ──────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[80%] z-0"
        style={{
          background:
            'radial-gradient(65% 80% at 50% 100%, rgba(127, 243, 208, 0.22), transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* ── Expanding Ring Page Transition Overlay (Explicit Opt-in) ─────── */}
      {expanding && (
        <div
          className="pointer-events-none fixed left-1/2 top-1/2 z-[300] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-accent bg-[#07080a]"
          style={{
            width: '40px',
            height: '40px',
            animation: 'expandRing 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* ── Controlled Next-Page Destination ────────────────────────────── */}
        <div className="flex flex-col items-center justify-center text-center mb-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent mb-3">
            {nextRoute.eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-ink mb-3">
            Ready for what&apos;s next?
          </h2>
          <p className="text-sm text-muted max-w-md mb-8">
            {nextRoute.subtext}
          </p>

          {/* Controlled Interactive Action Button & Progress */}
          <div className="w-full max-w-md flex flex-col items-center gap-4">
            {/* Scroll progress visualization (non-forcing) */}
            <div className="w-full flex items-center gap-3">
              <div
                className="relative h-2 flex-1 rounded-full border border-line bg-white/5 p-0.5 overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(scrollProgress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Footer scroll completion"
              >
                <div
                  className="h-full rounded-full bg-accent transition-all duration-150"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim tabular-nums">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>

            {/* Explicit accessible Next-Page Button */}
            <button
              type="button"
              onClick={handleNextPageClick}
              disabled={expanding}
              className="group relative inline-flex items-center gap-3 rounded-full border border-accent/60 bg-accent/15 px-8 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-accent transition-all duration-300 hover:bg-accent hover:text-[#07080a] hover:border-accent hover:shadow-[0_0_24px_rgba(127,243,208,0.35)] focus-visible:ring-2 focus-visible:ring-accent outline-none disabled:opacity-50"
              aria-label={`Navigate to ${nextRoute.nextLabel}`}
            >
              <span>{nextRoute.nextLabel}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
              Suggested next destination · Standard navigation always available
            </span>
          </div>
        </div>

        {/* ── Studio Navigation & Live Clocks ────────────────────────────── */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 border-t border-line/40 pt-16 mb-24">

          {/* Col 1: Studio Ethos */}
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim mb-4">
              Orbitvale Studio
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              An IT and design studio engineering digital experiences that orbit your business gravity.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link
                href="/about"
                className="font-mono text-xs text-ink hover:text-accent transition-colors focus-visible:ring-1 focus-visible:ring-accent"
              >
                About us →
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation Index */}
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim mb-4">
              Index
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className={`transition-colors ${pathname === '/' ? 'text-accent' : 'text-muted hover:text-ink'}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/work"
                  className={`transition-colors ${pathname.startsWith('/work') ? 'text-accent' : 'text-muted hover:text-ink'}`}
                >
                  Selected Work
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className={`transition-colors ${pathname === '/services' ? 'text-accent' : 'text-muted hover:text-ink'}`}
                >
                  Capabilities
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`transition-colors ${pathname === '/about' ? 'text-accent' : 'text-muted hover:text-ink'}`}
                >
                  Studio Principles
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`transition-colors ${pathname === '/contact' ? 'text-accent' : 'text-muted hover:text-accent'}`}
                >
                  Start a Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Studio Timezones (Transparent, Accurate Labeling) */}
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim mb-4">
              Studio Timezones
            </h3>
            <p className="text-xs text-dim mb-3">
              Distributed collaboration across key timezones.
            </p>
            <div className="space-y-3">
              {CLOCKS.map((clock) => (
                <div key={clock.city} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-muted">{clock.city}</span>
                  </div>
                  <span className="text-ink tabular-nums">
                    {times[clock.city] || '--:--'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Direct Inquiries */}
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim mb-4">
              Direct Frequency
            </h3>
            <p className="text-sm text-muted mb-3">
              Currently accepting proposals for Q1 &amp; Q2.
            </p>
            <a
              href="mailto:hello@orbitvale.com"
              className="font-mono text-xs text-accent hover:underline block"
            >
              hello@orbitvale.com
            </a>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent hover:bg-accent hover:text-bg transition-colors focus-visible:ring-1 focus-visible:ring-accent"
              >
                <span>Book discovery call</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Sub-Footer Metadata ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line/30 pt-8 text-[11px] font-mono text-dim">
          <div>
            © 2026 Orbitvale. All systems nominal.
          </div>
          <div className="flex items-center gap-6">
            <span>One orbit · Continuous motion</span>
            <span className="text-accent/60">●</span>
            <span>Awwwards SOTD Benchmark</span>
          </div>
        </div>

        {/* ── Monumental ORBITVALE Architectural Anchor ───────────────────── */}
        <div
          className="w-full text-center font-display font-extrabold tracking-[-0.02em] select-none text-white/90 leading-none mt-12 mb-[-1.5%]"
          style={{
            fontSize: 'clamp(48px, 12.5vw, 175px)',
          }}
          aria-hidden="true"
        >
          ORBITVALE
        </div>

      </div>
    </footer>
  );
}

export default Footer;
