'use client';

import { useEffect, useRef, useState } from 'react';
import { clamp } from '@/lib/utils';

const BEATS = [
  { label: 'Who we are', text: 'An IT company that builds systems you can feel.' },
  { label: 'What we build', text: 'Immersive products, design systems, and platforms.' },
  { label: 'Who for', text: 'Ambitious teams who need digital experiences that orbit their goals.' },
];

interface StatementSectionProps {
  /**
   * Global page scroll progress (0→1) from the master ScrollClock.
   * When provided, path drawing is driven by the shared clock instead of a
   * local scroll listener. Falls back to a local listener when omitted.
   */
  globalProgress?: number;
}

/**
 * Act II — The Signal.
 * Positioning statement writes itself along a glowing path as you scroll.
 */
export function StatementSection({ globalProgress }: StatementSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const lengthRef = useRef(0);
  const [local, setLocal] = useState(0);

  // ── Init: measure SVG path length once on mount ──────────────────────────
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    lengthRef.current = length;
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
  }, []);

  // ── Core update function (BCR-based, works in both modes) ───────────────
  const computeAndApply = () => {
    const el = ref.current;
    const path = pathRef.current;
    if (!el || !path || !lengthRef.current) return;

    const rect = el.getBoundingClientRect();
    const view = window.innerHeight;
    const start = view * 0.85;
    const end = view * 0.2;
    const p = clamp((start - rect.top) / (start - end), 0, 1);
    setLocal(p);
    // Direct DOM write for the SVG stroke — bypasses React for jank-free draw
    path.style.strokeDashoffset = String(lengthRef.current * (1 - p));
  };

  // ── Driven by master clock when globalProgress is provided ───────────────
  useEffect(() => {
    if (globalProgress === undefined) return;
    computeAndApply();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalProgress]);

  // ── Fallback: local scroll listener (standalone / /services page) ────────
  useEffect(() => {
    if (globalProgress !== undefined) return; // master clock handles it

    const update = () => computeAndApply();
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalProgress]);

  return (
    <section ref={ref} className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-4xl">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.26em] text-dim">
          Act II · The Signal
        </p>
        <h2 className="mb-16 max-w-[18ch] text-3xl font-semibold tracking-tight text-ink md:text-5xl">
          Digital experiences that{' '}
          <span className="text-accent">orbit</span> your business goals.
        </h2>

        <div className="relative">
          <svg
            className="pointer-events-none absolute -left-4 top-0 hidden h-full w-16 md:block"
            viewBox="0 0 40 420"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              ref={pathRef}
              d="M20 0 C20 80, 8 140, 20 210 C32 280, 20 340, 20 420"
              fill="none"
              stroke="#7ff3d0"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <div className="space-y-14 md:pl-16">
            {BEATS.map((beat, i) => {
              const threshold = (i + 0.35) / BEATS.length;
              const visible = local >= threshold;
              return (
                <div
                  key={beat.label}
                  className="transition-all duration-700"
                  style={{
                    opacity: visible ? 1 : 0.18,
                    transform: `translateY(${visible ? 0 : 18}px)`,
                  }}
                >
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {String(i + 1).padStart(2, '0')} · {beat.label}
                  </div>
                  <p className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
                    {beat.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
