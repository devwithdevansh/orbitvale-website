'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

/**
 * Section 07 · Footer & Next Page Bar (Lusion Ending + Halden Live Clocks)
 *
 * 1. Contrast returns to deep cosmic dark (`#07080a`).
 * 2. Lusion Next-Page Bar: "Ready for liftoff?" + scroll-driven filling progress bar.
 *    Once full, the orbital ring expands over the screen into `/contact`.
 * 3. Radiant mint aura glow (`#7ff3d0`) illuminating from the lower foundation.
 * 4. Halden 3-column studio layout with live world clocks (Oslo, London, SF) and green status dots.
 * 5. Monumental architectural wordmark "ORBITVALE" anchored across the bottom.
 */
export function Footer() {
  const router = useRouter();
  const footerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expanding, setExpanding] = useState(false);
  const [times, setTimes] = useState<{ [city: string]: string }>({});

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
    const interval = setInterval(updateTimes, 10000); // update every 10s
    return () => clearInterval(interval);
  }, []);

  // Track scroll inside footer for next-page trigger
  useEffect(() => {
    const handleScroll = () => {
      const el = footerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Progress fills as footer reaches bottom of viewport
      const visibleDistance = windowH - rect.top;
      const totalRequired = rect.height * 0.75;
      const p = clamp(visibleDistance / totalRequired, 0, 1);
      setScrollProgress(p);

      // Auto-trigger expand transition if user scrolls deeply into the footer bar
      if (p >= 0.98 && !expanding) {
        triggerNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [expanding]);

  const triggerNextPage = () => {
    if (expanding) return;
    setExpanding(true);
    setTimeout(() => {
      router.push('/contact');
    }, 700);
  };

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

      {/* ── Expanding Ring Page Transition Overlay ─────────────────────── */}
      {expanding && (
        <div
          className="pointer-events-none fixed left-1/2 top-1/2 z-[300] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-accent bg-[#07080a]"
          style={{
            width: '40px',
            height: '40px',
            animation: 'expandRing 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        />
      )}

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* ── Lusion Next-Page Bar ───────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center text-center mb-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent mb-3">
            07 · The Horizon
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-ink mb-6">
            Ready for liftoff?
          </h2>

          {/* Interactive Progress Bar */}
          <div
            onClick={triggerNextPage}
            className="group w-full max-w-md cursor-pointer flex flex-col items-center gap-2 p-2"
          >
            <div className="relative h-2.5 w-full rounded-full border border-accent/40 bg-white/5 p-0.5 overflow-hidden transition-all group-hover:border-accent">
              <div
                className="h-full rounded-full bg-accent transition-all duration-150"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted group-hover:text-accent transition-colors">
              <span>keep scrolling → Contact</span>
              <span className="text-accent tabular-nums">
                ({Math.round(scrollProgress * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* ── Studio Navigation & Live Clocks ────────────────────────────── */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 border-t border-line/40 pt-16 mb-24">

          {/* Col 1: Studio Info */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim mb-4">
              Orbitvale Studio
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              An IT and design studio engineering digital experiences that orbit your business gravity.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link href="/about" className="font-mono text-xs text-ink hover:text-accent transition-colors">
                About us →
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim mb-4">
              Index
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/work" className="text-muted hover:text-ink transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted hover:text-ink transition-colors">
                  Capabilities
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted hover:text-ink transition-colors">
                  Studio Principles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted hover:text-accent transition-colors">
                  Start a Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Live World Clocks (Halden Hallmark) */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim mb-4">
              Hubs & Live Clocks
            </h4>
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
            <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim mb-4">
              Direct Frequency
            </h4>
            <p className="text-sm text-muted mb-3">
              Currently accepting proposals for Q1 & Q2.
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
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent hover:bg-accent hover:text-bg transition-colors"
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
