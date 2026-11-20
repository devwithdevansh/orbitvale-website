'use client';

import { useEffect, useState } from 'react';
import { clamp } from '@/lib/utils';

/**
 * Master scroll clock — one 0→1 progress value for the whole page.
 * Chapters map ranges of this clock to their local animation.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max <= 0 ? 0 : clamp(window.scrollY / max, 0, 1));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}

/** Map global progress into a local 0→1 for a chapter range. */
export function chapterProgress(global: number, start: number, end: number): number {
  if (end <= start) return 0;
  return clamp((global - start) / (end - start), 0, 1);
}
