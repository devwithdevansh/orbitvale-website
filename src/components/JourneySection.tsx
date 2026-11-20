'use client';

import { useEffect, useRef, useState } from 'react';
import { clamp } from '@/lib/utils';

/**
 * Section 03 · The Journey (Lusion Ring Tunnel & Probe + Light Burst Transition)
 *
 * Pinned scroll-driven experience:
 * 1. Pinned sticky viewport (`h-screen`) over a multi-page scroll track (`h-[300vh]`).
 * 2. Concentric orbital rings fly from distance toward the camera, scaling up past the viewer.
 * 3. A central scientific probe / satellite with solar wings hovers and drifts in 3D space, responding to pointer.
 * 4. Giant spatial typography "STEP INTO ORBIT" flies forward in Z-depth past the camera.
 * 5. As progress reaches 0.85 -> 1.0, an intense blinding white-light flash expands to cover the viewport.
 * 6. The flash dissolves directly into the Light Theme Block (Services, Work, Process), flipping the site's palette.
 */
export function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0); // 0.0 to 1.0 scroll progress
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalDist = el.offsetHeight - window.innerHeight;
      if (totalDist <= 0) return;
      const progress = clamp(-rect.top / totalDist, 0, 1);
      setP(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setPointer({ x, y });
  };

  // Generate 8 ring layers at staggered depths
  const RING_COUNT = 8;
  const rings = Array.from({ length: RING_COUNT }, (_, i) => {
    // Offset each ring's virtual z-position based on scroll
    // Loop through 0 to 1 range
    const baseOffset = i / RING_COUNT;
    const ringZ = (baseOffset + p * 2.2) % 1; // 0 (far) to 1 (passed camera)

    // Exponential scale from distance to beyond camera
    const scale = Math.pow(ringZ, 2.5) * 4.2 + 0.08;
    // Fade in as it approaches, fade out as it flies behind camera
    let opacity = 0;
    if (ringZ < 0.25) {
      opacity = ringZ / 0.25;
    } else if (ringZ < 0.8) {
      opacity = 0.95;
    } else {
      opacity = (1 - ringZ) / 0.2;
    }

    return { index: i, scale, opacity, ringZ };
  });

  // Spatial Text flythrough
  // Text appears at p=0.2, reaches camera at p=0.75
  const textProgress = clamp((p - 0.15) / 0.6, 0, 1);
  const textScale = Math.pow(textProgress, 2.2) * 5.5 + 0.6;
  const textOpacity =
    textProgress < 0.2
      ? textProgress / 0.2
      : textProgress > 0.85
      ? (1 - textProgress) / 0.15
      : 1;

  // Final blinding flash (0.82 to 1.0)
  const flashOpacity = p < 0.8 ? 0 : clamp((p - 0.8) / 0.18, 0, 1);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[320vh] bg-[#07080a] select-none"
      id="chapter-journey"
    >
      {/* ── Sticky Viewport (100vh pinned) ────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Background cosmic depth stars */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

        {/* ── Ring Tunnel Layers ────────────────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {rings.map((ring) => (
            <div
              key={ring.index}
              className="absolute flex items-center justify-center will-change-transform"
              style={{
                width: 'min(90vw, 680px)',
                aspectRatio: '2.5 / 1',
                transform: `scale(${ring.scale}) rotate(-13deg)`,
                opacity: ring.opacity * (1 - flashOpacity),
                transition: 'opacity 0.05s linear',
              }}
            >
              <svg viewBox="0 0 600 240" className="w-full h-full overflow-visible">
                <defs>
                  <filter id={`tunnel-glow-${ring.index}`}>
                    <feGaussianBlur stdDeviation={ring.scale * 1.5 + 1} result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <ellipse
                  cx="300"
                  cy="120"
                  rx="260"
                  ry="95"
                  fill="none"
                  stroke={ring.index % 2 === 0 ? '#7ff3d0' : '#4ade80'}
                  strokeWidth={Math.max(1, 2.4 * ring.scale)}
                  strokeDasharray={ring.index % 3 === 0 ? '6 8' : 'none'}
                  filter={`url(#tunnel-glow-${ring.index})`}
                />
              </svg>
            </div>
          ))}
        </div>

        {/* ── Central Scientific Probe / Satellite ─────────────────────── */}
        <div
          className="relative z-20 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${pointer.x * 24}px, ${pointer.y * 18}px) scale(${1 + p * 0.35})`,
            opacity: 1 - flashOpacity,
          }}
        >
          {/* Probe Body */}
          <div className="relative flex items-center justify-center">
            {/* Left Solar Panel Antenna */}
            <div className="w-8 sm:w-12 h-1 bg-[#f2f4f7] rounded-l opacity-80 shadow-[0_0_12px_#7ff3d0]" />

            {/* Probe Core Capsule */}
            <div className="relative mx-1 w-12 sm:w-16 h-8 sm:h-10 rounded-xl border border-white/80 bg-[#101216] flex items-center justify-center shadow-[0_0_25px_rgba(127,243,208,0.5)]">
              {/* Sensor Eye / Core Pulse */}
              <div className="w-3.5 h-3.5 rounded-full bg-accent animate-ping opacity-60" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_#7ff3d0]" />
              {/* Tiny telemetry label */}
              <span className="absolute -bottom-4 font-mono text-[7px] tracking-[0.2em] text-accent/80 uppercase">
                OV-PRB
              </span>
            </div>

            {/* Right Solar Panel Antenna */}
            <div className="w-8 sm:w-12 h-1 bg-[#f2f4f7] rounded-r opacity-80 shadow-[0_0_12px_#7ff3d0]" />
          </div>
        </div>

        {/* ── Spatial 3D Flythrough Typography ─────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
          style={{
            opacity: textOpacity * (1 - flashOpacity),
            transform: `scale(${textScale}) translateY(${(1 - textProgress) * 40}px)`,
            willChange: 'transform, opacity',
          }}
        >
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.34em] text-accent uppercase mb-2">
            Act 03 · The Journey
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-7xl tracking-[-0.02em] text-white text-center whitespace-nowrap">
            STEP INTO ORBIT
          </h2>
        </div>

        {/* Progress scrub indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.24em] text-muted transition-opacity duration-300"
          style={{ opacity: flashOpacity > 0.5 ? 0 : 0.8 }}
        >
          <span>Accelerating</span>
          <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-75"
              style={{ width: `${Math.round(p * 100)}%` }}
            />
          </div>
          <span className="tabular-nums text-accent">{Math.round(p * 100)}%</span>
        </div>

        {/* ── Final Blinding White-Light Burst (Light Block Flip) ───────── */}
        <div
          className="absolute inset-0 z-50 pointer-events-none transition-opacity duration-150"
          style={{
            backgroundColor: '#f4f5f7',
            opacity: flashOpacity,
            mixBlendMode: 'normal',
          }}
        />
      </div>
    </div>
  );
}

export default JourneySection;
