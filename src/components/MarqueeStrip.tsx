'use client';

import { useEffect, useRef } from 'react';

/**
 * MarqueeStrip — infinite horizontal ticker / marquee.
 *
 * Items scroll left continuously. Pauses on reduced-motion.
 * Duplicates items so the loop is seamless.
 *
 * Usage:
 *   <MarqueeStrip
 *     items={['Product Engineering', 'WebGL', 'Design Systems', ...]}
 *     speed={0.6}
 *     separator="·"
 *     className="border-y border-line py-5"
 *   />
 */

interface MarqueeStripProps {
  items: string[];
  speed?: number;          // px per frame at 60fps
  separator?: string;
  className?: string;
  itemClassName?: string;
}

export function MarqueeStrip({
  items,
  speed = 0.6,
  separator = '·',
  className = '',
  itemClassName = '',
}: MarqueeStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const xRef = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const track = trackRef.current;
    if (!track) return;

    // Measure single set width (half the track since we duplicated items)
    const setWidth = track.scrollWidth / 2;
    widthRef.current = setWidth;

    const tick = () => {
      xRef.current -= speed;
      if (Math.abs(xRef.current) >= setWidth) {
        xRef.current = 0;
      }
      track.style.transform = `translateX(${xRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed]);

  // Duplicate for seamless loop
  const all = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ whiteSpace: 'nowrap' }}
      >
        {all.map((item, i) => (
          <span
            key={i}
            className={`inline-flex shrink-0 items-center gap-5 font-mono text-[11px] uppercase tracking-[0.22em] text-dim ${itemClassName}`}
          >
            <span>{item}</span>
            <span className="text-accent/50">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
