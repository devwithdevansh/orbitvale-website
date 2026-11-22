'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { clamp } from '@/lib/utils';

/**
 * ScrollClock — single event-throttled master scroll clock.
 *
 * Provides:
 *   - `progress` — 0→1 for the full page (top to bottom)
 *   - `chapterProgress(start, end)` — maps a [start,end] slice of the global
 *     clock to its own 0→1 value.
 *
 * Performance-engineered:
 *   - Updates on passive scroll/resize events instead of an infinite idle loop
 *   - Automatically sleeps when document is hidden (inactive tab)
 */

interface ScrollClockValue {
  progress: number;
  chapterProgress: (start: number, end: number) => number;
}

const ScrollClockContext = createContext<ScrollClockValue>({
  progress: 0,
  chapterProgress: () => 0,
});

export function ScrollClockProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const lastRef = useRef(-1);

  useEffect(() => {
    let ticking = false;

    const measure = () => {
      if (document.visibilityState === 'hidden') {
        ticking = false;
        return;
      }

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max <= 0 ? 0 : clamp(window.scrollY / max, 0, 1);

      // Only re-render when delta exceeds threshold to avoid micro-renders
      if (Math.abs(p - lastRef.current) > 0.0005) {
        lastRef.current = p;
        setProgress(p);
      }
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(measure);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        onScrollOrResize();
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Initial measurement
    onScrollOrResize();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const chapterProgress = useCallback(
    (start: number, end: number): number => {
      if (end <= start) return 0;
      return clamp((progress - start) / (end - start), 0, 1);
    },
    [progress]
  );

  return (
    <ScrollClockContext.Provider value={{ progress, chapterProgress }}>
      {children}
    </ScrollClockContext.Provider>
  );
}

export function useScrollClock() {
  return useContext(ScrollClockContext);
}

export default ScrollClockProvider;
