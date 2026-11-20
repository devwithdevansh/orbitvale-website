'use client';

import { ScrollClockProvider, useScrollClock } from '@/components/ScrollClock';
import { HeroSection } from '@/components/HeroSection';
import { StatementSection } from '@/components/StatementSection';
import { JourneySection } from '@/components/JourneySection';
import { LightBlock } from '@/components/LightBlock';

/**
 * HomeClient — wraps the home page in the master ScrollClockProvider.
 *
 * New Architecture (One object, one line):
 * 01 · Hero Window (HeroSection.tsx)
 * 02 · Manifesto (StatementSection.tsx)
 * 03 · The Journey (JourneySection.tsx)
 * 04–06 · Light Block: Services, Selected Work, Process (LightBlock.tsx)
 * 07 · Footer / Next Page (Step 6)
 */
function HomeContent() {
  const { progress } = useScrollClock();

  return (
    <div className="relative min-h-screen selection:bg-accent/30">
      {/* Section 01 · Hero: 3D ring window, scroll to explore */}
      <HeroSection />

      {/* Section 02 · Manifesto: Pinned text reveal with italic accent */}
      <div id="section-manifesto">
        <StatementSection globalProgress={progress} />
      </div>

      {/* Section 03 · The Journey: Pinned 3D ring tunnel + probe + light burst flip */}
      <div id="section-journey">
        <JourneySection />
      </div>

      {/* Sections 04–06 · The Light Block: Services, Selected Work, Process */}
      <div id="section-light-block">
        <LightBlock />
      </div>
    </div>
  );
}

export function HomeClient() {
  return (
    <ScrollClockProvider>
      <HomeContent />
    </ScrollClockProvider>
  );
}
