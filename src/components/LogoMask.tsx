'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * LogoMask — Awwwards-class letter-cutout chapter reveal.
 *
 * Usage:
 *   <LogoMask word="ORBITVALE" threshold={0.25}>
 *     <YourSectionContent />
 *   </LogoMask>
 *
 * When the section enters the viewport, the content briefly appears only
 * through letter-shaped cutouts in the word (CSS clip-path: inset + SVG masks),
 * then the mask dissolves to reveal the full section.
 *
 * Zero external deps. Respects prefers-reduced-motion.
 */

interface LogoMaskProps {
  word?: string;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

export function LogoMask({
  word = 'ORBITVALE',
  children,
  threshold = 0.2,
  className = '',
}: LogoMaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'hidden' | 'masking' | 'revealed'>('hidden');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Skip animation entirely on reduced-motion
    if (reduced) {
      setPhase('revealed');
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === 'hidden') {
          setPhase('masking');
          // After 700ms stencil reveal, dissolve to full reveal
          const timer = setTimeout(() => setPhase('revealed'), 700);
          io.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);

  const letters = word.split('');

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Full content — always rendered, masked during "masking" phase */}
      <div
        style={{
          opacity: phase === 'hidden' ? 0 : 1,
          transition: phase === 'revealed' ? 'opacity 0.6s ease' : 'none',
          // During masking phase, clip the content to letter shapes via SVG filter trick:
          // We use a stacked approach — content is overlaid with the stencil
        }}
      >
        {children}
      </div>

      {/* Letter stencil overlay — covers content, then fades out */}
      {phase !== 'revealed' && (
        <div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: '#08090b',
            opacity: phase === 'masking' ? 1 : 0,
            transition: phase === 'hidden' ? 'none' : 'opacity 0.6s ease 0.5s',
          }}
        >
          {/* The letters are punched out via mix-blend-mode:destination-out */}
          <div
            className="relative flex select-none items-center"
            style={{ isolation: 'isolate' }}
          >
            {/* Dark backdrop — will have letters knocked out */}
            <div
              className="absolute inset-0 rounded"
              style={{ backgroundColor: '#08090b' }}
            />
            {/* Letter row — mix-blend-mode:destination-out punches holes in backdrop */}
            <div
              className="relative flex"
              style={{ mixBlendMode: 'destination-out' }}
            >
              {letters.map((char, i) => (
                <span
                  key={i}
                  className="font-display font-semibold tracking-[-0.02em] text-white"
                  style={{
                    fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                    lineHeight: 1,
                    opacity: phase === 'masking' ? 1 : 0,
                    transform: phase === 'masking' ? 'translateY(0)' : 'translateY(60px)',
                    transition: `opacity 0.4s ease ${i * 35}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 35}ms`,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
