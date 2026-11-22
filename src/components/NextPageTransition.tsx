'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useJourney } from '@/context/JourneyContext';
import { usePathname } from 'next/navigation';

/**
 * NextPageTransition — Dedicated editorial next-page stage.
 *
 * Sequence: Page Content → Footer → NextPageTransition → Next Route.
 * Follows the footer naturally in document flow.
 * Visual and spatial composition inspired by LUSION reference (43–48s):
 * - Separate dark cinematic panel appearing after footer
 * - Massive typographic next-page heading (SELECTED WORK, OUR SERVICES, etc.)
 * - Micro-labels ("CONTINUE EXPLORING", "NEXT PAGE")
 * - Thin progressive fill line
 * - Scroll-down hint and accessible manual trigger button
 */
export function NextPageTransition() {
  const { state, stage, panelProgress, triggerForward, setPanelRef } = useJourney();
  const pathname = usePathname();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setPanelRef(sectionRef.current);
    return () => setPanelRef(null);
  }, [setPanelRef, pathname]);

  const isContact = pathname === '/contact';
  const hasNext = Boolean(stage.nextRoute);

  return (
    <section
      ref={sectionRef}
      id="next-page-transition"
      className="relative w-full min-h-[85vh] sm:min-h-[92vh] flex flex-col justify-between bg-[#07080a] text-[#f2f4f7] px-6 py-16 sm:py-24 border-t border-line/40 overflow-hidden select-none"
      style={{ isolation: 'isolate' }}
      aria-label="Next page journey transition"
    >
      {/* ── Background Orbital Motif ───────────────────────────────────── */}
      <div
        className="pointer-events-none absolute right-4 sm:right-16 top-1/2 -translate-y-1/2 w-64 sm:w-96 md:w-[480px] aspect-[752/459] opacity-15"
        style={{
          transform: `translateY(-50%) rotate(-13deg) scale(${0.9 + panelProgress * 0.15})`,
          transition: 'transform 0.4s ease-out',
        }}
        aria-hidden="true"
      >
        <Image
          src="/brand/v2/orbit-combined.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* ── Subtle radial floor glow ───────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 100%, rgba(127, 243, 208, 0.12), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl flex-1 flex flex-col justify-between">
        {/* ── Top Bar: Micro-labels & Progress ─────────────────────────── */}
        <div className="flex items-center justify-between border-b border-line/30 pb-6 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.26em] text-muted">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-accent">
              {isContact ? 'MISSION STATUS' : 'CONTINUE EXPLORING'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-dim hidden sm:inline">NEXT PAGE</span>
            <span className="text-ink font-semibold tabular-nums">
              {isContact ? 'END OF ORBIT' : stage.nextLabel}
            </span>
          </div>
        </div>

        {/* ── Central Typographic Stage ───────────────────────────────── */}
        <div className="my-auto py-12 sm:py-16">
          {/* Thin Progress Indicator */}
          <div className="mb-8 w-full max-w-md">
            <div
              className="h-1 w-full rounded-full bg-white/10 overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(panelProgress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Next page reveal progress"
            >
              <div
                className="h-full bg-accent transition-all duration-150 rounded-full"
                style={{ width: `${Math.round(panelProgress * 100)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
              <span>Section Reveal</span>
              <span className="text-accent">{Math.round(panelProgress * 100)}%</span>
            </div>
          </div>

          {/* Large Editorial Heading */}
          <h2
            className="font-display font-extrabold text-ink tracking-tight leading-[0.95] max-w-4xl"
            style={{
              fontSize: 'clamp(36px, 7.5vw, 96px)',
              transform: `translateY(${(1 - panelProgress) * 24}px)`,
              opacity: Math.min(1, panelProgress * 1.3),
              transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            }}
          >
            {stage.nextHeading}
          </h2>

          <p className="mt-6 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            {stage.subtext}
          </p>

          {/* Explicit interactive action button */}
          <div className="mt-10 flex flex-wrap items-center gap-5">
            {hasNext ? (
              <button
                type="button"
                onClick={() => triggerForward()}
                disabled={state === 'transitioning'}
                className="group relative inline-flex items-center gap-3 rounded-full border border-accent/60 bg-accent/15 px-8 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-accent transition-all duration-300 hover:bg-accent hover:text-[#07080a] hover:border-accent hover:shadow-[0_0_24px_rgba(127,243,208,0.35)] focus-visible:ring-2 focus-visible:ring-accent outline-none disabled:opacity-50"
                aria-label={`Continue directly to ${stage.nextHeading}`}
              >
                <span>
                  {state === 'transitioning' ? 'Entering section…' : 'Enter section'}
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => triggerForward('/')}
                disabled={state === 'transitioning'}
                className="group relative inline-flex items-center gap-3 rounded-full border border-accent/60 bg-accent/15 px-8 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-accent transition-all duration-300 hover:bg-accent hover:text-[#07080a] hover:border-accent hover:shadow-[0_0_24px_rgba(127,243,208,0.35)] focus-visible:ring-2 focus-visible:ring-accent outline-none"
              >
                <span>Back to Home</span>
                <span className="transition-transform duration-300 group-hover:-translate-y-1">
                  ↑
                </span>
              </button>
            )}

            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim flex items-center gap-2">
              <span className="text-accent/80">↓</span>
              <span>
                {hasNext
                  ? 'Scroll downward to proceed to the next route'
                  : 'Orbit journey complete · Return to start'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom Micro-Bar ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-line/30 pt-6 text-[10px] font-mono text-dim">
          <div>
            Orbitvale Page Flow · Bidirectional Continuous Journey
          </div>
          <div className="flex items-center gap-4">
            <span>Scroll up to revisit previous section</span>
            <span className="text-accent/40">●</span>
            <span>Manual navigation always active</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NextPageTransition;
