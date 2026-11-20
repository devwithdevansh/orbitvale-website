'use client';

import { ScrollClockProvider, useScrollClock } from '@/components/ScrollClock';
import { HeroSection } from '@/components/HeroSection';
import { SingularityCore } from '@/components/SingularityCore';
import { StatementSection } from '@/components/StatementSection';
import { ServicesOrbit } from '@/components/ServicesOrbit';
import { WorksWheel } from '@/components/WorksWheel';
import { DeepTechSection } from '@/components/DeepTechSection';
import { GlobeSection } from '@/components/GlobeSection';
import { CtaSection } from '@/components/CtaSection';
import { MarqueeStrip } from '@/components/MarqueeStrip';
import { LogoMask } from '@/components/LogoMask';

const MARQUEE_ITEMS = [
  'Product Engineering',
  'Experience Design',
  'Interactive 3D',
  'Design Systems',
  'Cloud & DevOps',
  'Strategy & Advisory',
  'Orbitvale',
  'Continuous Motion',
];

/**
 * Inner component: has access to ScrollClockContext.
 * Passes the single global progress value to every animated chapter,
 * so all scroll-driven effects share one rAF loop instead of N listeners.
 */
function HomeContent() {
  const { progress } = useScrollClock();

  return (
    <div className="relative min-h-screen selection:bg-accent/30">
      {/* Act I — The Object: live Kepler orbital hero */}
      <HeroSection />

      {/* Capability ticker — separates hero from rest */}
      <MarqueeStrip
        items={MARQUEE_ITEMS}
        speed={0.55}
        separator="·"
        className="border-y border-line py-5"
      />

      {/* Quiet beat — brand object / particle core */}
      <LogoMask
        word="ORBITVALE"
        threshold={0.2}
        className="relative h-[70svh] min-h-[480px] w-full overflow-hidden md:h-[640px]"
      >
        <section
          id="chapter-singularity"
          className="relative h-[70svh] min-h-[480px] w-full overflow-hidden md:h-[640px]"
          data-chapter="singularity"
        >
          <SingularityCore headline="ORBITVALE" particleCount={1800} className="h-full" />
        </section>
      </LogoMask>

      {/* Act II — The Signal */}
      <div id="chapter-signal" data-chapter="signal">
        <StatementSection globalProgress={progress} />
      </div>

      {/* Act III — The Constellation */}
      <div id="chapter-constellation" data-chapter="constellation">
        <ServicesOrbit globalProgress={progress} />
      </div>

      {/* Act IV — The Fleet */}
      <section
        id="chapter-fleet"
        data-chapter="fleet"
        className="relative px-6 py-32 md:py-44"
      >
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.26em] text-dim">
            Act IV · The Fleet
          </p>
          <h2 className="mb-4 max-w-[14ch] font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Selected work
          </h2>
          <p className="mb-14 max-w-xl text-muted">
            Drag the drum. The front card snaps into focus — a physical object, not a slide deck.
          </p>
          <WorksWheel />
        </div>
      </section>

      {/* Act V — The Deep */}
      <div id="chapter-deep" data-chapter="deep">
        <DeepTechSection />
      </div>

      {/* Capability ticker between sections */}
      <MarqueeStrip
        items={[...MARQUEE_ITEMS].reverse()}
        speed={0.45}
        separator="○"
        className="border-y border-line py-5"
      />

      {/* Act VI — The Network */}
      <div id="chapter-network" data-chapter="network">
        <GlobeSection />
      </div>

      {/* Act VII — The Arrival */}
      <div id="chapter-arrival" data-chapter="arrival">
        <CtaSection />
      </div>
    </div>
  );
}

/**
 * HomeClient — wraps the home page in the master ScrollClockProvider,
 * then renders all chapters. Exported for use from the server page.tsx.
 */
export function HomeClient() {
  return (
    <ScrollClockProvider>
      <HomeContent />
    </ScrollClockProvider>
  );
}
