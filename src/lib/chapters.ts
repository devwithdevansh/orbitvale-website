/**
 * Home page chapter ranges on the master 0→1 scroll clock.
 * Keep in sync with the visual order in `src/app/page.tsx`.
 */
export const CHAPTERS = {
  hero: { start: 0, end: 0.12 },
  singularity: { start: 0.1, end: 0.22 },
  signal: { start: 0.2, end: 0.34 },
  constellation: { start: 0.32, end: 0.48 },
  fleet: { start: 0.46, end: 0.62 },
  deep: { start: 0.6, end: 0.76 },
  network: { start: 0.74, end: 0.88 },
  arrival: { start: 0.86, end: 1 },
} as const;

export type ChapterId = keyof typeof CHAPTERS;
