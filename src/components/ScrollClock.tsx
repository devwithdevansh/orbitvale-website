'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { clamp } from '@/lib/utils';

/**
 * ScrollClock — single rAF-based master scroll clock for the whole page.
 *
 * Provides:
 *   - `progress` — 0→1 for the full page (top to bottom)
 *   - `chapterProgress(start, end)` — maps a [start,end] slice of the global
 *     clock to its own 0→1 value. Memoised; call it at render time.
 *
 * Usage:
 *   const { progress, chapterProgress } = useScrollClock();
 *   const p = chapterProgress(0.15, 0.35); // 0→1 while page is 15%–35%
 */

interface ScrollClockValue {
  progress: number;
  chapterProgress: (start: number, end: number) => number;
}

const ScrollClockContext = createContext<ScrollClockValue>({
  progress: 0,
  chapterProgress: () => 0,
});

export function ScrollClockProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const lastRef = useRef(-1);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max <= 0 ? 0 : clamp(window.scrollY / max, 0, 1);
      // Only re-render when value actually changed (avoid micro-renders)
      if (Math.abs(p - lastRef.current) > 0.0002) {
        lastRef.current = p;
        setProgress(p);
      }
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
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
