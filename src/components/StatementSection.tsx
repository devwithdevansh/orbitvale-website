'use client';

import { useEffect, useRef, useState } from 'react';
import { clamp } from '@/lib/utils';

const MANIFESTO_WORDS = [
  { word: 'Every', isAccent: false },
  { word: 'business', isAccent: false },
  { word: 'has', isAccent: false },
  { word: 'gravity.', isAccent: false },
  { word: 'We', isAccent: false },
  { word: 'build', isAccent: false },
  { word: 'what', isAccent: false },
  { word: 'keeps', isAccent: false },
  { word: 'it', isAccent: false },
  { word: 'in', isAccent: false },
  { word: 'orbit.', isAccent: true }, // The Halden italic accent move
];

const BEATS = [
  { label: 'Who we are', text: 'A creative technology company building for real business needs.' },
  { label: 'What we build', text: 'Ready-made products and custom-built digital solutions.' },
  { label: 'Who for', text: 'Organisations across industries ready to modernise how they work.' },
];

interface StatementSectionProps {
  globalProgress?: number;
}

/**
 * Section 02 · Manifesto (Halden Pinned Text + Italic Accent)
 *
 * Pinned headline:
 * "Every business has gravity. We build what keeps it in orbit."
 * Words light up progressively as you scroll.
 * The word "orbit." is styled in high-contrast Georgia italic serif with mint accent.
 */
export function StatementSection({ globalProgress }: StatementSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const lengthRef = useRef(0);
  const [scrollP, setScrollP] = useState(0);

  // Measure path length once
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    lengthRef.current = length;
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
  }, []);

  const compute = () => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    const start = viewH * 0.9;
    const end = viewH * 0.15;
    const p = clamp((start - rect.top) / (start - end + rect.height * 0.5), 0, 1);
    setScrollP(p);

    if (pathRef.current && lengthRef.current) {
      pathRef.current.style.strokeDashoffset = String(lengthRef.current * (1 - p));
    }
  };

  useEffect(() => {
    if (globalProgress !== undefined) {
      compute();
      return;
    }
    const onScroll = () => compute();
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [globalProgress]);

  return (
    <section
      ref={ref}
      className="relative px-6 py-32 md:py-48 max-w-6xl mx-auto"
      id="chapter-manifesto"
    >
      {/* Chapter Indicator */}
      <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
        Act 02 · The Manifesto
      </div>

      {/* Pinned Big Manifesto Headline */}
      <h2
        className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.12] tracking-tight text-ink mb-20 max-w-4xl"
        aria-label="Every business has gravity. We build what keeps it in orbit."
      >
        {MANIFESTO_WORDS.map((item, i) => {
          // Calculate when each word lights up along scroll progress
          const wordThreshold = (i + 0.3) / MANIFESTO_WORDS.length;
          const isLit = scrollP >= wordThreshold;

          if (item.isAccent) {
            return (
              <span
                key={i}
                className="inline-block transition-all duration-500"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 500,
                  color: isLit ? '#7ff3d0' : 'rgba(255,255,255,0.22)',
                  transform: isLit ? 'translateY(0)' : 'translateY(4px)',
                }}
              >
                {item.word}{' '}
              </span>
            );
          }

          return (
            <span
              key={i}
              className="inline-block transition-all duration-400"
              style={{
                color: isLit ? '#f2f4f7' : 'rgba(255,255,255,0.22)',
                transform: isLit ? 'translateY(0)' : 'translateY(4px)',
              }}
            >
              {item.word}{' '}
            </span>
          );
        })}
      </h2>

      {/* Three Positioning Beats with Glowing Vertical Line */}
      <div className="relative mt-20 pt-10 border-t border-line/40">
        <div className="grid gap-12 md:grid-cols-3">
          {BEATS.map((beat, i) => {
            const beatThreshold = (i + 0.5) / 3;
            const visible = scrollP >= beatThreshold * 0.7;

            return (
              <div
                key={beat.label}
                className="transition-all duration-700"
                style={{
                  opacity: visible ? 1 : 0.25,
                  transform: `translateY(${visible ? 0 : 16}px)`,
                }}
              >
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  {String(i + 1).padStart(2, '0')} · {beat.label}
                </div>
                <p className="text-base md:text-lg leading-relaxed text-muted">
                  {beat.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StatementSection;
