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
 * Implements the LUSION contrast design:
 * - All routes except Contact: Light panel (#ECEEF1), dark text (#0B0D10),
 *   muted #5D6573, link accent #0A8F6A, and ORBITVALE wordmark in #0B0D10.
 * - Radial mint glow removed so the light panel creates striking physical contrast
 *   against the dark next-page strip emerging from underneath.
 * - On /contact: retains dark studio palette.
 */
export function Footer() {
  const pathname = usePathname();
  const [times, setTimes] = useState<{ [city: string]: string }>({});

  const isContact = pathname === '/contact';
  const isLight = false; // Footer is always dark — strip is the light surface

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
      className={`relative w-full overflow-hidden pt-20 pb-8 px-6 select-none transition-colors duration-200 ${
        isLight
          ? 'bg-[#ECEEF1] text-[#0B0D10] border-t border-[#CFD3DA]'
          : 'bg-[#07080a] text-[#f2f4f7] border-t border-line/30'
      }`}
      id="section-footer"
      style={{
        isolation: 'isolate',
        position: 'relative',
        zIndex: 20,
        // Cast a shadow downward — footer floats above the strip beneath it
        boxShadow: '0 8px 32px 8px rgba(0,0,0,0.45)',
      }}
      aria-label="Studio Footer"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ── Studio Navigation & Live Clocks ────────────────────────────── */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 pt-4 mb-20">
          {/* Col 1: Studio Ethos */}
          <div>
            <h3
              className={`font-mono text-[10px] uppercase tracking-[0.24em] mb-4 ${
                isLight ? 'text-[#88909e]' : 'text-dim'
              }`}
            >
              Orbitvale Studio
            </h3>
            <p
              className={`text-sm leading-relaxed ${
                isLight ? 'text-[#5D6573]' : 'text-muted'
              }`}
            >
              An IT and design studio engineering digital experiences that orbit your business gravity.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link
                href="/about"
                className={`font-mono text-xs transition-colors focus-visible:ring-1 ${
                  isLight
                    ? 'text-[#0B0D10] hover:text-[#0A8F6A] focus-visible:ring-[#0A8F6A]'
                    : 'text-ink hover:text-accent focus-visible:ring-accent'
                }`}
              >
                About us →
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation Index */}
          <div>
            <h3
              className={`font-mono text-[10px] uppercase tracking-[0.24em] mb-4 ${
                isLight ? 'text-[#88909e]' : 'text-dim'
              }`}
            >
              Index
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/work', label: 'Selected Work' },
                { href: '/services', label: 'Capabilities' },
                { href: '/about', label: 'Studio Principles' },
                { href: '/contact', label: 'Start a Project' },
              ].map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`transition-colors ${
                        isLight
                          ? isActive
                            ? 'text-[#0A8F6A] font-medium'
                            : 'text-[#5D6573] hover:text-[#0B0D10]'
                          : isActive
                          ? 'text-accent'
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Studio Timezones */}
          <div>
            <h3
              className={`font-mono text-[10px] uppercase tracking-[0.24em] mb-4 ${
                isLight ? 'text-[#88909e]' : 'text-dim'
              }`}
            >
              Studio Timezones
            </h3>
            <p
              className={`text-xs mb-3 ${
                isLight ? 'text-[#88909e]' : 'text-dim'
              }`}
            >
              Distributed collaboration across key timezones.
            </p>
            <div className="space-y-3">
              {CLOCKS.map((clock) => (
                <div
                  key={clock.city}
                  className="flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                        isLight ? 'bg-[#0A8F6A]' : 'bg-accent'
                      }`}
                    />
                    <span className={isLight ? 'text-[#5D6573]' : 'text-muted'}>
                      {clock.city}
                    </span>
                  </div>
                  <span
                    className={`tabular-nums ${
                      isLight ? 'text-[#0B0D10] font-medium' : 'text-ink'
                    }`}
                  >
                    {times[clock.city] || '--:--'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Direct Inquiries */}
          <div>
            <h3
              className={`font-mono text-[10px] uppercase tracking-[0.24em] mb-4 ${
                isLight ? 'text-[#88909e]' : 'text-dim'
              }`}
            >
              Direct Frequency
            </h3>
            <p
              className={`text-sm mb-3 ${
                isLight ? 'text-[#5D6573]' : 'text-muted'
              }`}
            >
              Currently accepting proposals for Q1 &amp; Q2.
            </p>
            <a
              href="mailto:hello@orbitvale.com"
              className={`font-mono text-xs hover:underline block ${
                isLight ? 'text-[#0A8F6A]' : 'text-accent'
              }`}
            >
              hello@orbitvale.com
            </a>
            <div className="mt-4">
              <Link
                href="/contact"
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors focus-visible:ring-1 ${
                  isLight
                    ? 'border-[#0A8F6A]/40 bg-[#0A8F6A]/10 text-[#0A8F6A] hover:bg-[#0A8F6A] hover:text-[#FFFFFF] focus-visible:ring-[#0A8F6A]'
                    : 'border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-bg focus-visible:ring-accent'
                }`}
              >
                <span>Book discovery call</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Sub-Footer Metadata ────────────────────────────────────────── */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-8 text-[11px] font-mono ${
            isLight
              ? 'border-[#CFD3DA] text-[#5D6573]'
              : 'border-line/30 text-dim'
          }`}
        >
          <div>
            © 2026 Orbitvale. All systems nominal.
          </div>
          <div className="flex items-center gap-6">
            <span>One orbit · Continuous motion</span>
            <span className={isLight ? 'text-[#0A8F6A]/60' : 'text-accent/60'}>
              ●
            </span>
            <span>Awwwards SOTD Benchmark</span>
          </div>
        </div>

        {/* ── Monumental ORBITVALE Architectural Anchor ───────────────────── */}
        <div
          className={`w-full text-center font-display font-extrabold tracking-[-0.02em] select-none leading-none mt-10 mb-2 ${
            isLight ? 'text-[#0B0D10]' : 'text-white/90'
          }`}
          style={{
            fontSize: 'clamp(40px, 9vw, 115px)',
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
