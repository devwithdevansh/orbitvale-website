'use client';

import { useState, useEffect, useRef } from 'react';
import { clamp, prefersReducedMotion } from '@/lib/utils';

const SERVICES = [
  { title: 'Product Engineering', blurb: 'Full-stack systems, APIs, and platforms built to scale with your orbit.' },
  { title: 'Experience Design', blurb: 'Interfaces with editorial restraint and motion that earns its place.' },
  { title: 'Interactive 3D', blurb: 'WebGL worlds, scroll-driven cameras, and brand moments you can inhabit.' },
  { title: 'Design Systems', blurb: 'Tokens, components, and documentation that keep teams in sync.' },
  { title: 'Cloud & DevOps', blurb: 'Infrastructure that stays quiet until you need it to move fast.' },
  { title: 'Strategy & Advisory', blurb: 'Roadmaps that connect technology choices to business gravity.' },
];

// Inner ring: services 0–2, Outer ring: services 3–5
const INNER = [0, 1, 2];
const OUTER = [3, 4, 5];

interface ServicesOrbitProps {
  /**
   * Global page scroll progress (0→1) from the master ScrollClock.
   * When provided, rotation is driven by the shared clock instead of a
   * local scroll listener — one rAF loop for the whole page.
   * Falls back to a local scroll listener when omitted (e.g. /services page).
   */
  globalProgress?: number;
}

/**
 * Act III — The Constellation.
 * Dual-ring scroll-driven orbit: inner 3 services + outer 3 services,
 * both tilted −13° per brand ring. Ghost trails, staggered entry, hover card.
 */
export function ServicesOrbit({ globalProgress }: ServicesOrbitProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [scrollRot, setScrollRot] = useState(0);
  const reduced = typeof window !== 'undefined' ? prefersReducedMotion() : false;

  // Ring geometry
  const innerA = 128;
  const innerB = 128 * 0.42;
  const outerA = 192;
  const outerB = 192 * 0.42;
  const tilt = -13; // brand ring tilt, degrees

  // ── Rotation driven by master clock (preferred) ─────────────────────────
  // When globalProgress changes, re-read the section's BCR to get local p.
  // This replaces a local scroll listener with a single shared rAF tick.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewH = window.innerHeight;
    // 0 when section top enters viewport bottom, 1 when bottom exits top
    const p = clamp((viewH - rect.top) / (viewH + rect.height), 0, 1);
    setScrollRot(p * Math.PI * 1.5); // rotate up to 270° over the scroll pass
  }, [reduced, globalProgress]); // re-runs on every master clock tick

  // ── Fallback: local listener when no master clock ───────────────────────
  useEffect(() => {
    if (reduced || globalProgress !== undefined) return; // master clock handles it
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const p = clamp((viewH - rect.top) / (viewH + rect.height), 0, 1);
      setScrollRot(p * Math.PI * 1.5);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [reduced, globalProgress]);

  // ── Entry trigger via IntersectionObserver ──────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setEntered(true); },
      { threshold: 0.15 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Helper: ellipse x,y at angle
  const getPos = (a: number, b: number, angle: number) => ({
    x: Math.cos(angle) * a,
    y: Math.sin(angle) * b,
  });

  const renderRingDivs = (
    indices: number[],
    a: number,
    b: number,
    speedMult: number,
    entryBaseDelay: number
  ) => {
    return indices.map((si, j) => {
      const baseAngle = (j / indices.length) * Math.PI * 2 - Math.PI / 2;
      const angle = baseAngle + scrollRot * speedMult;
      const ghostAngle = angle - 0.52;

      const pos = getPos(a, b, angle);
      const ghostPos = getPos(a, b, ghostAngle);
      const isActive = active === si;
      const entryDelay = entryBaseDelay + j * 90;

      // Depth occlusion: sin(angle) in ellipse coords gives the "vertical" position.
      // sin > 0 → bottom half of ellipse → satellite is "in front" of ring (higher z).
      // sin < 0 → top half → "behind" the ring (lower z, slight dim).
      // We use the un-tilted Y component to determine front/back.
      const sinA = Math.sin(angle);
      const isBehind = sinA < 0;
      // z-index: front satellites above ring SVG (z-20), behind below (z-5)
      const zIndex = isActive ? 30 : isBehind ? 5 : 20;
      // Dim satellites that are "behind" the ring plane slightly
      const depthOpacity = isBehind ? 0.55 : 1.0;

      return (
        <div key={si}>
          {/* Ghost trail dot */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full border border-accent/20 bg-accent/5"
            style={{
              width: 36, height: 36,
              left: `calc(50% + ${ghostPos.x}px)`,
              top: `calc(50% + ${ghostPos.y}px)`,
              transform: 'translate(-50%, -50%)',
              opacity: entered && !reduced ? 0.5 * depthOpacity : 0,
              transition: 'opacity 0.5s',
              transitionDelay: `${entryDelay + 160}ms`,
              zIndex: zIndex - 1,
            }}
          />
          {/* Satellite */}
          <button
            type="button"
            className="absolute flex h-11 w-11 items-center justify-center rounded-full border font-mono text-[10px] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            style={{
              left: `calc(50% + ${pos.x}px)`,
              top: `calc(50% + ${pos.y}px)`,
              transform: `translate(-50%, -50%) scale(${isActive ? 1.22 : 1})`,
              borderColor: isActive ? '#7ff3d0' : isBehind ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.13)',
              backgroundColor: isActive ? 'rgba(127,243,208,0.12)' : '#0f1013',
              color: isActive ? '#7ff3d0' : isBehind ? '#5c5e66' : '#f4f4f6',
              boxShadow: isActive ? '0 0 28px rgba(127,243,208,0.42)' : undefined,
              opacity: entered ? depthOpacity : 0,
              transitionDelay: entered ? `${entryDelay}ms` : '0ms',
              transition: 'opacity 0.6s, transform 0.3s, border-color 0.3s, background-color 0.3s, box-shadow 0.3s',
              zIndex,
            }}
            onMouseEnter={() => setActive(si)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(si)}
            onBlur={() => setActive(null)}
            aria-label={SERVICES[si].title}
          >
            {String(si + 1).padStart(2, '0')}
          </button>
        </div>
      );
    });
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 py-32 md:py-44">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.26em] text-dim">
          Act III · The Constellation
        </p>
        <h2 className="mb-4 max-w-[16ch] text-3xl font-semibold tracking-tight text-ink md:text-5xl">
          What we do
        </h2>
        <p className="mb-16 max-w-xl text-muted">
          Six capabilities in orbit around one centre. Hover a satellite to pull it into focus.
        </p>

        <div className="relative mx-auto flex h-[460px] max-w-xl items-center justify-center md:h-[520px]">
          {/* Orbit ring ellipses — SVG midlayer for depth occlusion */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            style={{ zIndex: 10 }}
            aria-hidden="true"
          >
            {/* Inner ring */}
            <ellipse
              cx="50%" cy="50%"
              rx={innerA} ry={innerB}
              transform={`rotate(${tilt} 50% 50%)`}
              fill="none"
              stroke="rgba(127,243,208,0.18)"
              strokeWidth="1"
            />
            {/* Outer ring (dashed) */}
            <ellipse
              cx="50%" cy="50%"
              rx={outerA} ry={outerB}
              transform={`rotate(${tilt} 50% 50%)`}
              fill="none"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1"
              strokeDasharray="5 8"
            />
          </svg>

          {/* Central core — pulsing OV planet */}
          <div
            className={`absolute z-10 flex h-24 w-24 items-center justify-center rounded-full border md:h-28 md:w-28 ${entered && !reduced ? 'ov-pulse' : ''}`}
            style={{
              borderColor: 'rgba(127,243,208,0.35)',
              backgroundColor: '#0f1013',
              opacity: entered ? 1 : 0,
              transform: entered ? 'scale(1)' : 'scale(0.6)',
              transition: 'opacity 0.6s, transform 0.6s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <span className="font-mono text-xs tracking-[0.2em] text-accent">OV</span>
          </div>

          {/* Inner satellites */}
          {renderRingDivs(INNER, innerA, innerB, 1.0, 0)}

          {/* Outer satellites */}
          {renderRingDivs(OUTER, outerA, outerB, 0.6, 180)}

          {/* Hover card */}
          <div
            className="absolute bottom-0 left-0 right-0 z-30 mx-auto max-w-sm rounded-xl border border-line bg-panel/90 p-5 text-left backdrop-blur-md"
            style={{
              opacity: active !== null ? 1 : 0,
              transform: `translateY(${active !== null ? 0 : 14}px)`,
              pointerEvents: active !== null ? 'auto' : 'none',
              transition: 'opacity 0.25s, transform 0.25s cubic-bezier(0.16,1,0.3,1)',
            }}
            aria-hidden={active === null}
          >
            {active !== null && (
              <>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  Service {String(active + 1).padStart(2, '00')}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-ink">{SERVICES[active].title}</h3>
                <p className="text-sm leading-relaxed text-muted">{SERVICES[active].blurb}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
