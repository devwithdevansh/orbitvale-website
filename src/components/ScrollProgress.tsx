'use client';

import { useScrollProgress } from '@/lib/scroll';
import { OrbitRing } from '@/components/brand/OrbitRing';

/**
 * Logo ring as scroll progress — corner chrome, −13° tilt, never competes with the hero.
 */
export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className="pointer-events-none fixed bottom-6 right-6 z-40 hidden sm:block"
      aria-hidden="true"
    >
      <div className="h-12 w-12 text-accent">
        <OrbitRing className="h-full w-full" progress={progress} strokeWidth={1.6} />
      </div>
      <div className="mt-1 text-center font-mono text-[9px] tracking-[0.18em] text-dim tabular-nums">
        {String(Math.round(progress * 100)).padStart(2, '0')}
      </div>
    </div>
  );
}
