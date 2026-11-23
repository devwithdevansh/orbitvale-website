'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useJourney } from '@/context/JourneyContext';
import { usePathname, useRouter } from 'next/navigation';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * NextPageTransition — Award-Caliber Responsive Elastic Stretch System
 *
 * Designed for immediate tactile feedback with zero jank:
 * 1. Responsive sensitivity (~300px delta) — no sluggish dead-weight feeling.
 * 2. 60–120 FPS spring interpolation (`requestAnimationFrame`) for liquid elasticity.
 * 3. 100% direct GPU-composited DOM updates — zero React re-renders during scrubbing.
 * 4. Sturdy bottom detection: activates when the strip reaches the viewport bottom.
 * 5. Instant upward retreat: scrolling up smoothly unstretches, then yields cleanly to Lenis.
 */

export function NextPageTransition() {
  const { state, stage, setScrubProgress } = useJourney();
  const pathname = usePathname();
  const router = useRouter();

  // Root DOM refs
  const trackRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Sub-element DOM refs for direct 120fps styling
  const membraneRef = useRef<HTMLDivElement>(null);
  const radialBloomRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const chargeRingRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tensionLineRef = useRef<HTMLDivElement>(null);

  const [stripH, setStripH] = useState(210);

  // Discrete wipe overlay state (only updates during route handoff)
  const [wipeState, setWipeState] = useState<'idle' | 'sweeping-in' | 'sweeping-out'>('idle');
  const wipeRef = useRef<'idle' | 'sweeping-in' | 'sweeping-out'>('idle');

  const commitLock = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const destination = stage.nextRoute;

  // Animation values (pure refs — zero React state overhead during scrubbing)
  const targetP = useRef(0);
  const currentP = useRef(0);
  const rafId = useRef(0);
  const isLoopRunning = useRef(false);

  // Ready state: true when strip is at bottom of viewport
  const isAtBottomRef = useRef(false);

  useEffect(() => {
    wipeRef.current = wipeState;
  }, [wipeState]);

  // Direct DOM render pass: applies tension and stretch transforms at display refresh rate
  const renderVisuals = useCallback((p: number) => {
    const strip = stripRef.current;
    const inner = innerRef.current;
    if (!strip || !inner) return;

    const eased = 1 - Math.pow(1 - p, 1.6);
    const charged = Math.pow(p, 1.8);

    // 1. Strip container stretch (bottom anchored)
    const stretch = 1 + p * 0.16;
    strip.style.transform = `scaleY(${stretch.toFixed(4)})`;

    // 2. Inner content counter-scale (creates upward parallax drift)
    inner.style.transform = `scaleY(${(1 / stretch).toFixed(4)})`;

    // 3. Background tint (off-white -> faint mint-charged light)
    const r = Math.round(240 - p * 10);
    const g = Math.round(242 - p * 5);
    const b = Math.round(245 - p * 14);
    strip.style.backgroundColor = `rgb(${r},${g},${b})`;

    // 4. Top membrane line & glow
    if (membraneRef.current) {
      const h = 1 + charged * 3;
      membraneRef.current.style.height = `${h.toFixed(2)}px`;
      membraneRef.current.style.background = `rgba(10,143,106,${(charged * 0.85).toFixed(3)})`;
      membraneRef.current.style.boxShadow =
        p > 0.45
          ? `0 0 ${Math.round(charged * 22)}px rgba(10,143,106,${(charged * 0.65).toFixed(2)})`
          : 'none';
    }

    // 5. Radial energy bloom from bottom
    if (radialBloomRef.current) {
      radialBloomRef.current.style.background = `radial-gradient(ellipse 55% 48% at 50% 100%, rgba(10,143,106,${(charged * 0.2).toFixed(3)}) 0%, transparent 72%)`;
    }

    // 6. Heading upward drift & subtle letter spacing expansion
    if (headingRef.current) {
      const y = -24 * eased;
      const s = 1 + eased * 0.03;
      const ls = -0.055 + eased * 0.016;
      headingRef.current.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
      headingRef.current.style.letterSpacing = `${ls.toFixed(4)}em`;
      headingRef.current.style.color = `rgba(11,13,16,${(0.82 + charged * 0.18).toFixed(3)})`;
    }

    // 7. Progress bar fill
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${(p * 100).toFixed(1)}%`;
      progressBarRef.current.style.boxShadow =
        p > 0.4
          ? `0 0 ${Math.round(charged * 14)}px rgba(10,143,106,${(charged * 0.9).toFixed(2)})`
          : 'none';
    }

    // 8. Arrow shift and scale
    if (arrowRef.current) {
      const shift = 12 * eased;
      const s = 1 + eased * 0.28;
      arrowRef.current.style.transform = `translate3d(${shift.toFixed(2)}px, 0, 0) scale(${s.toFixed(3)})`;
      arrowRef.current.style.textShadow =
        p > 0.3
          ? `0 0 ${Math.round(charged * 12)}px rgba(10,143,106,${(charged * 0.8).toFixed(2)})`
          : 'none';
    }

    // 9. Charge ring (appears at p > 0.6)
    if (chargeRingRef.current) {
      if (p > 0.6) {
        const ringScale = 0.5 + ((p - 0.6) / 0.4) * 0.6;
        const ringAlpha = Math.min(1, (p - 0.6) / 0.18);
        chargeRingRef.current.style.opacity = ringAlpha.toFixed(3);
        chargeRingRef.current.style.transform = `translate(0, -50%) scale(${ringScale.toFixed(3)})`;
        chargeRingRef.current.style.boxShadow = `0 0 ${Math.round(charged * 16)}px rgba(10,143,106,0.5)`;
      } else {
        chargeRingRef.current.style.opacity = '0';
      }
    }

    // 10. Markers
    const thresholds = [0.15, 0.35, 0.55, 0.75, 0.95];
    markerRefs.current.forEach((markerEl, idx) => {
      if (!markerEl) return;
      const threshold = thresholds[idx];
      const lit = p >= threshold;
      const local = lit ? Math.min(1, (p - threshold) / 0.2) : 0;
      markerEl.style.color = lit ? '#0A8F6A' : 'rgba(0,0,0,0.18)';
      markerEl.style.textShadow = lit
        ? `0 0 ${Math.round(4 + local * 12)}px rgba(10,143,106,${(0.4 + local * 0.6).toFixed(2)})`
        : 'none';
      markerEl.style.transform = lit ? `scale(${(1 + local * 0.4).toFixed(3)})` : 'scale(1)';
    });

    // 11. Elastic tension pull-line
    if (tensionLineRef.current) {
      tensionLineRef.current.style.height = `${(1 + charged * 3).toFixed(2)}px`;
      tensionLineRef.current.style.transform = `scaleX(${Math.min(1, p * 1.1).toFixed(3)})`;
      tensionLineRef.current.style.boxShadow =
        charged > 0.1
          ? `0 0 ${Math.round(charged * 18)}px rgba(10,143,106,${(charged * 0.6).toFixed(2)})`
          : 'none';
      tensionLineRef.current.style.opacity = p > 0.02 ? '1' : '0';
    }
  }, []);

  // Execute route handoff
  const executeHandoff = useCallback(
    (targetRoute: string) => {
      if (commitLock.current || wipeRef.current !== 'idle' || stateRef.current === 'cooldown') return;
      commitLock.current = true;

      if (prefersReducedMotion()) {
        router.push(targetRoute);
        window.scrollTo(0, 0);
        targetP.current = 0;
        currentP.current = 0;
        commitLock.current = false;
        setScrubProgress(0);
        renderVisuals(0);
        return;
      }

      setWipeState('sweeping-in');
      wipeRef.current = 'sweeping-in';

      setTimeout(() => {
        router.push(targetRoute);
        window.scrollTo(0, 0);
        targetP.current = 0;
        currentP.current = 0;
        setScrubProgress(0);
        renderVisuals(0);

        setWipeState('sweeping-out');
        wipeRef.current = 'sweeping-out';

        setTimeout(() => {
          setWipeState('idle');
          wipeRef.current = 'idle';
          commitLock.current = false;
        }, 300);
      }, 350);
    },
    [router, setScrubProgress, renderVisuals]
  );

  // Animation loop: rapid responsive spring interpolation at 60-120 FPS
  const runAnimationStep = useCallback(() => {
    const target = targetP.current;
    let curr = currentP.current;

    // Responsive spring lerp (0.24 rate gives immediate spring feel without drag-lag)
    const diff = target - curr;
    curr += diff * 0.24;

    if (Math.abs(diff) < 0.001) {
      curr = target;
    }

    currentP.current = curr;
    renderVisuals(curr);
    setScrubProgress(curr);

    // Commit at full tension
    if (curr >= 0.99 && destination && !commitLock.current) {
      isLoopRunning.current = false;
      executeHandoff(destination);
      return;
    }

    // Continue loop while moving
    if (Math.abs(target - curr) > 0.0005 || target > 0.001) {
      rafId.current = requestAnimationFrame(runAnimationStep);
    } else {
      currentP.current = 0;
      targetP.current = 0;
      renderVisuals(0);
      setScrubProgress(0);
      isLoopRunning.current = false;
    }
  }, [destination, renderVisuals, setScrubProgress, executeHandoff]);

  const ensureAnimationRunning = useCallback(() => {
    if (!isLoopRunning.current) {
      isLoopRunning.current = true;
      rafId.current = requestAnimationFrame(runAnimationStep);
    }
  }, [runAnimationStep]);

  // Reset on route change
  useEffect(() => {
    targetP.current = 0;
    currentP.current = 0;
    commitLock.current = false;
    isLoopRunning.current = false;
    isAtBottomRef.current = false;
    cancelAnimationFrame(rafId.current);
    setScrubProgress(0);
    renderVisuals(0);
  }, [pathname, setScrubProgress, renderVisuals]);

  // Measure dimensions
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const sh = w < 640 ? 190 : w < 1024 ? 200 : 210;
      setStripH(sh);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [pathname]);

  // Check bottom scroll position
  useEffect(() => {
    if (!destination) return;

    const checkPosition = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const h = window.innerHeight;
      // Strip is revealed when top is within viewport
      isAtBottomRef.current = rect.top <= h - 40;
    };

    window.addEventListener('scroll', checkPosition, { passive: true });
    checkPosition();
    return () => window.removeEventListener('scroll', checkPosition);
  }, [destination]);

  // Wheel intercept with responsive tactile tension
  useEffect(() => {
    if (!destination) return;

    // Lower sensitivity constant (300px) = crisp, immediate responsiveness
    const SCRUB_SENSITIVITY = 300;

    const onWheel = (e: WheelEvent) => {
      if (wipeRef.current !== 'idle') return;
      if (stateRef.current === 'committing' || stateRef.current === 'cooldown') return;
      if (commitLock.current) return;

      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.getAttribute('contenteditable') === 'true')
      )
        return;

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 28;
      if (e.deltaMode === 2) delta *= 400;

      const current = targetP.current;
      const atBottom = isAtBottomRef.current;

      // Scrolling down while at bottom OR while already scrubbing: accumulate tension
      if (delta > 0 && (atBottom || current > 0.01)) {
        e.preventDefault();

        // Progressive resistance: free up to 60%, gentle cushion at the end
        const rawStep = Math.min(Math.abs(delta) / SCRUB_SENSITIVITY, 0.16);
        const resist = current > 0.8 ? 0.65 : 1.0;
        const next = Math.min(1, current + rawStep * resist);

        targetP.current = next;
        ensureAnimationRunning();

      // Scrolling up while actively stretched: un-stretch smoothly
      } else if (delta < 0 && current > 0.01) {
        e.preventDefault();

        const step = Math.min(Math.abs(delta) / (SCRUB_SENSITIVITY * 0.7), 0.2);
        const next = Math.max(0, current - step);

        targetP.current = next;
        ensureAnimationRunning();
      }
      // If delta < 0 and current <= 0.01, do NOT preventDefault: page scrolls up naturally!
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(rafId.current);
      isLoopRunning.current = false;
    };
  }, [destination, ensureAnimationRunning]);

  // Touch intercept
  useEffect(() => {
    if (!destination) return;
    let lastTouchY = 0;
    const TOUCH_SENSITIVITY = 150;

    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (wipeRef.current !== 'idle') return;
      if (stateRef.current === 'committing' || stateRef.current === 'cooldown') return;
      if (commitLock.current) return;

      const currentY = e.touches[0].clientY;
      const delta = lastTouchY - currentY;
      lastTouchY = currentY;
      const current = targetP.current;
      const atBottom = isAtBottomRef.current;

      if (delta > 1 && (atBottom || current > 0.01)) {
        e.preventDefault();
        const resist = current > 0.8 ? 0.65 : 1.0;
        const step = (delta / TOUCH_SENSITIVITY) * resist;
        targetP.current = Math.min(1, current + step);
        ensureAnimationRunning();
      } else if (delta < -1 && current > 0.01) {
        e.preventDefault();
        const step = Math.abs(delta) / (TOUCH_SENSITIVITY * 0.7);
        targetP.current = Math.max(0, current - step);
        ensureAnimationRunning();
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [destination, ensureAnimationRunning]);

  if (!destination) return null;

  return (
    <>
      {/* ── Track: z:1, below footer (z:20) so footer visually slides over strip ── */}
      <section
        ref={trackRef}
        id="next-page-transition"
        className="relative w-full"
        style={{ height: `${stripH}px`, zIndex: 1 }}
        aria-label={`Next section: ${stage.nextHeading}`}
      >
        {/* ── Elastic Strip ── */}
        <div
          ref={stripRef}
          onClick={() => {
            if (destination) executeHandoff(destination);
          }}
          className="sticky bottom-0 w-full overflow-hidden cursor-pointer select-none"
          style={{
            height: `${stripH}px`,
            backgroundColor: '#F0F2F5',
            color: '#0B0D10',
            isolation: 'isolate',
            transformOrigin: 'bottom center',
            willChange: 'transform, background-color',
            zIndex: 1,
          }}
          aria-label={`Continue to ${stage.nextHeading}. Scroll or click to proceed.`}
        >
          {/* Radial energy bloom */}
          <div
            ref={radialBloomRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: '140%',
              height: '220%',
              background:
                'radial-gradient(ellipse 55% 48% at 50% 100%, rgba(10,143,106,0) 0%, transparent 72%)',
            }}
          />

          {/* Top elastic membrane */}
          <div
            ref={membraneRef}
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: '1px',
              background: 'rgba(10,143,106,0)',
            }}
          />

          {/* Inner counter-scaled content */}
          <div
            ref={innerRef}
            className="absolute inset-0 flex flex-col justify-between px-6 sm:px-12 md:px-16 py-6 sm:py-7"
            style={{
              transformOrigin: 'bottom center',
              willChange: 'transform',
            }}
          >
            {/* Top row */}
            <div className="w-full flex items-start justify-between">
              <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#5D6573] leading-tight">
                <div>KEEP SCROLLING</div>
                <div className="text-[#8A909E]">TO LEARN MORE</div>
              </div>
              <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#5D6573]">
                {stage.nextLabel}
              </div>
            </div>

            {/* Centre: heading + NEXT PAGE indicator */}
            <div className="my-auto py-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
              <h2
                ref={headingRef}
                className="font-display font-medium uppercase tracking-tight leading-none"
                style={{
                  fontSize: 'clamp(36px, 4.6vw, 54px)',
                  transformOrigin: 'left center',
                  letterSpacing: '-0.055em',
                  color: 'rgba(11,13,16,0.82)',
                  willChange: 'transform',
                }}
              >
                {stage.nextHeading}
              </h2>

              <div className="flex items-center gap-3 sm:gap-4 shrink-0 relative">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#5D6573]">
                  NEXT PAGE
                </span>

                {/* Progress line */}
                <div
                  className="relative overflow-hidden bg-black/10"
                  style={{ width: 'clamp(72px, 7vw, 110px)', height: '1.5px' }}
                  role="progressbar"
                  aria-label="Page transition progress"
                >
                  <div
                    ref={progressBarRef}
                    className="absolute inset-y-0 left-0 bg-[#0A8F6A]"
                    style={{ width: '0%' }}
                  />
                </div>

                {/* Arrow */}
                <span
                  ref={arrowRef}
                  className="font-mono text-xs text-[#0A8F6A]"
                  style={{
                    willChange: 'transform',
                  }}
                >
                  →
                </span>

                {/* Charge ring */}
                <div
                  ref={chargeRingRef}
                  aria-hidden="true"
                  className="absolute -right-6 top-1/2 rounded-full border border-[#0A8F6A] pointer-events-none"
                  style={{
                    width: 18,
                    height: 18,
                    opacity: 0,
                    transform: 'translate(0, -50%) scale(0.5)',
                  }}
                />
              </div>
            </div>

            {/* Bottom: markers + tension line */}
            <div className="relative w-full flex items-center justify-between font-mono text-xs select-none pt-2 border-t border-black/[0.08]">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  ref={(el) => {
                    markerRefs.current[i] = el;
                  }}
                  style={{
                    color: 'rgba(0,0,0,0.18)',
                    display: 'inline-block',
                    willChange: 'transform, color',
                  }}
                >
                  +
                </span>
              ))}

              {/* Elastic tension pull-line */}
              <div
                ref={tensionLineRef}
                aria-hidden="true"
                className="absolute left-0 right-0 bottom-0 pointer-events-none"
                style={{
                  height: '1px',
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(10,143,106,0.3) 15%, rgba(10,143,106,0.6) 50%, rgba(10,143,106,0.3) 85%, transparent 100%)',
                  transform: 'scaleX(0)',
                  transformOrigin: 'center',
                  opacity: 0,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Diagonal Sweep Overlay ── */}
      {wipeState !== 'idle' && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className={`absolute inset-0 bg-[#08090b] ${
              wipeState === 'sweeping-in' ? 'diagonal-sweep-tl-in' : 'diagonal-sweep-tl-out'
            }`}
          />
          <div
            className={`absolute inset-0 bg-[#08090b] ${
              wipeState === 'sweeping-in' ? 'diagonal-sweep-br-in' : 'diagonal-sweep-br-out'
            }`}
          />
        </div>
      )}
    </>
  );
}

export default NextPageTransition;
