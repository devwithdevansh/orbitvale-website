'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { OrbitalHeroSection } from '@/components/OrbitalHeroSection';
import { TextReveal } from '@/components/TextReveal';
import { MagneticButton } from '@/components/MagneticButton';

function useNarrow(query = '(max-width: 767px)') {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const sync = () => setNarrow(m.matches);
    sync();
    m.addEventListener('change', sync);
    return () => m.removeEventListener('change', sync);
  }, [query]);
  return narrow;
}

/**
 * Act I — The Object.
 * Live Kepler orbital system with pointer parallax; brand type sits in the quiet half.
 * TextReveal adds Lusion-class word-by-word stagger on mount.
 * MagneticButton makes the CTAs physically responsive to the cursor.
 */
export function HeroSection() {
  const narrow = useNarrow();

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden md:min-h-[760px]">
      <OrbitalHeroSection
        className="min-h-[100svh] md:min-h-[760px]"
        focus={narrow ? [0.5, 0.82] : [0.72, 0.4]}
        scrim={narrow ? 'top' : 'left'}
        scrimStrength={narrow ? 0.94 : 0.9}
        viewRadius={narrow ? 2.15 : 3.05}
        lead={narrow ? 0.04 : 0.1}
        glow={narrow ? 0.55 : 1}
        yearSeconds={18}
        trailYears={2.4}
        showOrbits={false}
        showSunTrack
        interactive
        roll={13}
      >
        <div className="flex h-full min-h-[100svh] items-start px-6 pb-16 pt-28 sm:px-10 md:min-h-[760px] md:items-center md:pt-0 lg:px-16 xl:px-24">
          <div className="max-w-[36rem]">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Act I · The Object
            </p>

            {/* Lusion-class word-by-word reveal */}
            <TextReveal
              text="One orbit."
              as="h1"
              className="font-display text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[4.4rem]"
              stagger={60}
              duration={900}
              threshold={0.1}
            />
            <span
              className="mt-1 block font-display text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.03em] text-ink/45 sm:text-6xl lg:text-[4.4rem]"
              aria-hidden="true"
            >
              <TextReveal
                text="Nine chapters."
                as="span"
                stagger={55}
                duration={900}
                threshold={0.1}
              />
            </span>

            <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:mt-7 md:text-[1.05rem]">
              Orbitvale builds digital systems that move with your business —
              development, design, and technology in continuous motion.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3 md:mt-11">
              <MagneticButton strength={0.3}>
                <Link
                  href="/contact"
                  className="rounded-full bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bg transition hover:bg-accent/90"
                >
                  Start a project
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.25}>
                <Link
                  href="/work"
                  className="rounded-full border border-line-2 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/80 transition hover:border-accent/40 hover:text-accent"
                >
                  See the work
                </Link>
              </MagneticButton>
            </div>

            <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.28em] text-dim md:mt-16">
              Scroll to orbit ↓
            </p>
          </div>
        </div>
      </OrbitalHeroSection>
    </section>
  );
}
