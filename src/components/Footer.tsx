'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
 * Global Studio Footer
 *
 * Dedicated to studio index, live global timezones, direct frequencies,
 * brand copyright, and the monumental ORBITVALE architectural wordmark.
 *
 * The cinematic Next-Page journey stage is intentionally decoupled
 * and rendered immediately after this component in document flow
 * (Page Content → Footer → NextPageTransition).
 */
export function Footer() {
  const pathname = usePathname();
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
    const interval = setInterval(updateTimes, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      className="relative w-full bg-[#07080a] text-[#f2f4f7] overflow-hidden pt-20 pb-12 px-6 select-none border-t border-line/30"
      id="section-footer"
      style={{ isolation: 'isolate' }}
      aria-label="Studio Footer"
    >
      {/* ── Radiant Mint Glow Aura ──────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[80%] z-0"
        style={{
          background:
            'radial-gradient(65% 80% at 50% 100%, rgba(127, 243, 208, 0.16), transparent 75%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ── Studio Navigation & Live Clocks ────────────────────────────── */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 pt-4 mb-20">
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

          {/* Col 3: Studio Timezones */}
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
