'use client';

import { cn } from '@/lib/utils';

interface WordmarkProps {
  className?: string;
  /** Accent the VALE half */
  split?: boolean;
  /** Letter-by-letter opacity for assembly animations */
  letterProgress?: number;
}

const LETTERS = ['O', 'R', 'B', 'I', 'T', 'V', 'A', 'L', 'E'] as const;

/**
 * ORBITVALE wordmark — stencil tracking, logo-faithful spacing.
 */
export function Wordmark({ className, split = true, letterProgress = 1 }: WordmarkProps) {
  return (
    <span
      className={cn(
        'inline-flex font-mono font-bold uppercase tracking-[0.28em] text-ink',
        className
      )}
      aria-label="Orbitvale"
    >
      {LETTERS.map((letter, i) => {
        const threshold = (i + 1) / LETTERS.length;
        const visible = letterProgress >= threshold - 0.05;
        const isAccent = split && i >= 5;
        return (
          <span
            key={`${letter}-${i}`}
            className={cn(
              'transition-opacity duration-300',
              isAccent ? 'text-accent' : 'text-ink'
            )}
            style={{ opacity: visible ? 1 : 0.12 }}
          >
            {letter}
          </span>
        );
      })}
    </span>
  );
}
