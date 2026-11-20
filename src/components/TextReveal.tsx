'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * TextReveal — Lusion-class character-by-character scroll reveal.
 *
 * Each word fades + slides up staggered as the element enters the viewport.
 * Wraps any string in <span> per-word with individual transition-delay.
 *
 * Usage:
 *   <TextReveal
 *     text="Digital systems in continuous motion."
 *     as="h2"
 *     className="text-5xl font-semibold text-ink"
 *     stagger={40}   // ms per word
 *     threshold={0.3}
 *   />
 */

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

interface TextRevealProps {
  text: string;
  as?: Tag;
  className?: string;
  stagger?: number;         // ms delay per word
  duration?: number;        // ms per word transition
  threshold?: number;       // IntersectionObserver threshold
  once?: boolean;           // only reveal once
}

export function TextReveal({
  text,
  as: Tag = 'p',
  className = '',
  stagger = 50,
  duration = 700,
  threshold = 0.25,
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduced) { setRevealed(true); return; }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) io.disconnect();
        } else if (!once) {
          setRevealed(false);
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, threshold, once]);

  const words = text.split(' ');

  // Cast ref to any to satisfy TypeScript's polymorphic ref constraint
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden"
          style={{ verticalAlign: 'bottom' }}
        >
          <span
            className="inline-block"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(1.1em)',
              transition: reduced
                ? 'none'
                : `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms`,
            }}
          >
            {word}
          </span>
          {i < words.length - 1 && '\u00a0'}
        </span>
      ))}
    </Tag>
  );
}
