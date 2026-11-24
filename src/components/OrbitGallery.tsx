'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { liveCollections } from '@/lib/liveExperiences';
import { projects as allProjects } from '@/lib/projects';
import { prefersReducedMotion } from '@/lib/utils';

export interface OrbitProject {
  slug: string;
  num: string;
  title: string;
  subtitle: string;
  image?: string;
  accent?: string;
  kpi?: string;
  tags?: string[];
}

const DEFAULT_PROJECTS: OrbitProject[] = [
  {
    slug: 'project-phoenix',
    num: '01',
    title: 'Project Phoenix',
    subtitle: 'Next-gen SaaS platform',
    image: '/covers/project-phoenix.svg',
    accent: '#ff6230',
  },
  {
    slug: 'nebula-cms',
    num: '02',
    title: 'Nebula CMS',
    subtitle: 'Headless content management',
    image: '/covers/nebula-cms.svg',
    accent: '#c084fc',
  },
  {
    slug: 'orbitdb',
    num: '03',
    title: 'OrbitDB',
    subtitle: 'Decentralized database layer',
    image: '/covers/orbitdb.svg',
    accent: '#7ff3d0',
  },
  {
    slug: 'lumen',
    num: '04',
    title: 'Lumen',
    subtitle: 'Real-time analytics dashboard',
    image: '/covers/lumen.svg',
    accent: '#a3e635',
  },
  {
    slug: 'astra',
    num: '05',
    title: 'Astra',
    subtitle: 'AI-powered analytics engine',
    image: '/covers/astra.svg',
    accent: '#e879f9',
  },
  {
    slug: 'nova',
    num: '06',
    title: 'Nova',
    subtitle: 'Blockchain infrastructure',
    image: '/covers/nova.svg',
    accent: '#f59e0b',
  },
];

interface OrbitGalleryProps {
  projects?: OrbitProject[];
}

export function OrbitGallery({ projects = DEFAULT_PROJECTS }: OrbitGalleryProps) {
  const items = projects && projects.length > 0 ? projects : DEFAULT_PROJECTS;
  const N = items.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reduced motion state
  const [reducedMotion, setReducedMotion] = useState(false);

  // Active index state (ONLY updated when active card index changes, NEVER per-frame)
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Physics refs
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const velocityRef = useRef(0);
  const rafIdRef = useRef<number>(0);

  // Ellipse dimensions
  const radiusXRef = useRef(320);
  const radiusYRef = useRef(36);

  // Pointer tracking
  const pointerDownRef = useRef({
    isDown: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startTarget: 0,
    hasMoved: false,
  });

  const lastWheelTimeRef = useRef(0);

  // Shortest path helper
  const goToIndex = useCallback((targetIdx: number) => {
    const currentInt = Math.round(targetRef.current);
    const currentMod = ((currentInt % N) + N) % N;
    let diff = targetIdx - currentMod;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    targetRef.current = currentInt + diff;
  }, [N]);

  const goToPrev = useCallback(() => {
    targetRef.current = Math.round(targetRef.current) - 1;
  }, []);

  const goToNext = useCallback(() => {
    targetRef.current = Math.round(targetRef.current) + 1;
  }, []);

  // Update card styles directly in DOM (60fps, 0 React re-renders)
  const updateCardStyles = useCallback((curr: number) => {
    const rx = radiusXRef.current;
    const ry = radiusYRef.current;
    const tiltRad = (-12 * Math.PI) / 180; // -12 deg orbit tilt

    for (let i = 0; i < N; i++) {
      const cardEl = cardRefs.current[i];
      if (!cardEl) continue;

      // Angle of card i relative to current position
      const angle = ((i - curr) * (2 * Math.PI)) / N;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      // normZ: 1.0 (front / nearest), 0.0 (back / farthest)
      const normZ = (cos + 1) / 2;

      // Coordinate on tilted ellipse
      const x = sin * rx;
      const y = x * Math.tan(tiltRad) + cos * ry;

      // Visual scaling & depth cues
      const scale = 0.74 + normZ * 0.38;
      const opacity = 0.32 + Math.pow(normZ, 1.4) * 0.68;
      const zIndex = Math.round(normZ * 100) + 10;
      const rotateY = -sin * 20;
      const rotateZ = -12 + (1 - normZ) * 4;

      cardEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0px) rotateZ(${rotateZ.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      cardEl.style.zIndex = String(zIndex);
      cardEl.style.opacity = opacity.toFixed(3);

      const isActive = i === activeIndexRef.current;
      const accent = items[i].accent || '#7ff3d0';

      if (isActive) {
        cardEl.style.borderColor = `${accent}80`;
        cardEl.style.boxShadow = `0 16px 40px -10px ${accent}30, 0 0 20px 0 ${accent}18`;
      } else {
        cardEl.style.borderColor = 'rgba(255,255,255,0.08)';
        cardEl.style.boxShadow = 'none';
      }
    }
  }, [N, items]);

  // Reduced motion check & resize handler
  useEffect(() => {
    setReducedMotion(prefersReducedMotion());

    const updateDimensions = () => {
      const w = containerRef.current?.clientWidth || window.innerWidth;
      if (w < 640) {
        radiusXRef.current = 150;
        radiusYRef.current = 24;
      } else if (w < 1024) {
        radiusXRef.current = 230;
        radiusYRef.current = 32;
      } else {
        radiusXRef.current = 330;
        radiusYRef.current = 38;
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Listen to list row hovers below: "Hovering a row in the project list below spins the gallery to that project."
  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>('[data-project-index]');
    const cleanups: (() => void)[] = [];

    rows.forEach((row) => {
      const idx = Number(row.dataset.projectIndex);
      if (isNaN(idx)) return;

      const handleMouseEnter = () => {
        goToIndex(idx);
      };

      row.addEventListener('mouseenter', handleMouseEnter);
      cleanups.push(() => row.removeEventListener('mouseenter', handleMouseEnter));
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, [goToIndex]);

  // Spring animation loop: strictly NO per-frame React state updates
  useEffect(() => {
    if (reducedMotion) return;

    const tick = () => {
      const target = targetRef.current;
      let current = currentRef.current;
      let velocity = velocityRef.current;

      const diff = target - current;
      velocity = velocity * 0.82 + diff * 0.08;
      current += velocity;

      // Snap when resting and not dragging
      if (Math.abs(diff) < 0.0001 && Math.abs(velocity) < 0.0001 && !pointerDownRef.current.isDown) {
        current = target;
        velocity = 0;
      }

      currentRef.current = current;
      velocityRef.current = velocity;

      // Update active index for counter ONLY when integer card changes
      const newActiveIdx = ((Math.round(current) % N) + N) % N;
      if (newActiveIdx !== activeIndexRef.current) {
        activeIndexRef.current = newActiveIdx;
        setActiveIndex(newActiveIdx);
      }

      // 60fps direct DOM manipulation
      updateCardStyles(current);

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafIdRef.current);
  }, [N, reducedMotion, updateCardStyles]);

  // Pointer event handlers with pointer capture & 6px move threshold
  const DRAG_PX_PER_CARD = 260;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Primary button only
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    pointerDownRef.current = {
      isDown: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startTarget: targetRef.current,
      hasMoved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDownRef.current.isDown) return;
    const dx = e.clientX - pointerDownRef.current.startX;
    const dy = e.clientY - pointerDownRef.current.startY;

    if (!pointerDownRef.current.hasMoved && Math.hypot(dx, dy) > 6) {
      pointerDownRef.current.hasMoved = true;
    }

    if (pointerDownRef.current.hasMoved) {
      // Continuous smooth drag
      targetRef.current = pointerDownRef.current.startTarget - dx / DRAG_PX_PER_CARD;
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDownRef.current.isDown) return;
    pointerDownRef.current.isDown = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    // Snap to nearest integer card when pointer released
    targetRef.current = Math.round(targetRef.current);
  };

  // Wheel handling with debounce to prevent inertial skipping
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 16) return;

    const now = performance.now();
    if (now - lastWheelTimeRef.current < 200) return;
    lastWheelTimeRef.current = now;

    targetRef.current = Math.round(targetRef.current) + (delta > 0 ? 1 : -1);
  };

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  // Card click: rotate if inactive, ignore if dragged > 6px
  const handleCardClick = (index: number, e: React.MouseEvent) => {
    if (pointerDownRef.current.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (index !== activeIndexRef.current) {
      e.preventDefault();
      e.stopPropagation();
      goToIndex(index);
    }
  };

  // Reduced motion accessible fallback
  if (reducedMotion) {
    return (
      <div
        className="w-full overflow-x-auto snap-x snap-mandatory flex gap-6 pb-6 pt-2 scrollbar-none"
        role="region"
        aria-label="Projects carousel"
      >
        {items.map((item) => (
          <div
            key={item.slug}
            className="snap-center shrink-0 w-[300px] sm:w-[340px] rounded-2xl border border-line bg-panel p-5 shadow-xl"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-panel-2">
              <Image
                src={item.image || `/covers/${item.slug}.svg`}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                Concept // {item.num}
              </span>
            </div>
            <h3 className="font-display font-medium text-lg text-ink">{item.title}</h3>
            <p className="font-mono text-xs text-muted mt-0.5">{item.subtitle}</p>
            <div className="mt-5">
              <Link
                href={`/work/${item.slug}`}
                className="inline-flex items-center gap-2 font-mono text-xs text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                View Concept →
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const activeProject = items[activeIndex];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Interactive 3D project gallery. Use arrow keys to navigate."
      className="relative w-full rounded-2xl border border-line/40 bg-panel-2/30 backdrop-blur-sm overflow-hidden select-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      style={{
        touchAction: 'pan-y',
        cursor: pointerDownRef.current.isDown ? 'grabbing' : 'grab',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
    >
      {/* ── Top HUD / Controls Bar ── */}
      <div className="relative z-30 flex items-center justify-between px-6 sm:px-8 pt-5 pb-2">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
            ORBIT SHELF · 3D ROTATION
          </span>
        </div>

        {/* Counter and Prev/Next buttons */}
        <div className="flex items-center gap-4">
          <span
            className="font-mono text-xs tracking-widest text-ink tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {String(activeIndex + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous project"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-panel/60 text-xs font-mono text-muted transition-colors hover:border-accent hover:text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              ←
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next project"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-panel/60 text-xs font-mono text-muted transition-colors hover:border-accent hover:text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* ── 3D Orbit Stage ── */}
      <div
        ref={stageRef}
        className="relative flex h-[440px] sm:h-[480px] w-full items-center justify-center overflow-visible"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Subtle background orbital guide ellipse echoing logo orbit */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-[110px] sm:h-[130px] w-[560px] sm:w-[740px] rounded-[100%] border border-accent/[0.08]"
          style={{
            transform: 'rotate(-12deg) scale(1.02)',
            boxShadow: '0 0 60px -10px rgba(127,243,208,0.04)',
          }}
        />

        {/* Cards */}
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const accent = item.accent || '#7ff3d0';

          return (
            <div
              key={item.slug}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onClick={(e) => handleCardClick(index, e)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[270px] sm:w-[320px] md:w-[340px] rounded-2xl border bg-panel transition-[border-color,box-shadow] duration-300"
              style={{
                willChange: 'transform, opacity',
                cursor: isActive ? 'default' : 'pointer',
              }}
              aria-label={`${item.title} — ${item.subtitle}`}
            >
              {/* Cover Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-panel-2">
                <Image
                  src={item.image || `/covers/${item.slug}.svg`}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 270px, (max-width: 1024px) 320px, 340px"
                  className="object-cover"
                  unoptimized
                  priority={index === 0}
                  draggable={false}
                />

                {/* Concept badge overlay */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent/90 bg-bg/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-accent/25">
                    Concept // {item.num}
                  </span>
                </div>

                {/* Active card radial lighting */}
                {isActive && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse at 30% 90%, ${accent}25 0%, transparent 65%)`,
                    }}
                  />
                )}
              </div>

              {/* Card Meta & Action */}
              <div className="p-4 sm:p-5 flex items-end justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-medium text-base sm:text-lg text-ink truncate">
                    {item.title}
                  </h3>
                  <p className="font-mono text-[11px] text-muted tracking-wide truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                {/* Actions for front card */}
                {isActive ? (
                  <div className="shrink-0 flex items-center gap-2">
                    {(() => {
                      const proj = allProjects.find(p => p.slug === item.slug);
                      const demoUrl = item.slug === 'forge-gym'
                        ? 'https://demo-web-forge-gym.onrender.com/'
                        : (proj?.demo || (liveCollections[item.slug] ? `/live-lab/${item.slug}` : null));
                      if (!demoUrl) return null;
                      const isExt = demoUrl.startsWith('http');
                      return isExt ? (
                        <a
                          href={demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (pointerDownRef.current.hasMoved) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                          className="inline-flex items-center gap-1 rounded-full px-2.5 sm:px-3 py-1.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.14em] transition-all duration-200 bg-accent text-[#07080a] font-semibold hover:bg-white"
                          aria-label={`Explore ${item.title} live demo`}
                        >
                          <span>Explore Demo</span>
                          <span>↗</span>
                        </a>
                      ) : (
                        <Link
                          href={demoUrl}
                          onClick={(e) => {
                            if (pointerDownRef.current.hasMoved) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                          className="inline-flex items-center gap-1 rounded-full px-2.5 sm:px-3 py-1.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.14em] transition-all duration-200 bg-accent text-[#07080a] font-semibold hover:bg-white"
                          aria-label={`Explore ${item.title} live demo`}
                        >
                          <span>Explore Demo</span>
                          <span>↗</span>
                        </Link>
                      );
                    })()}
                    <Link
                      href={`/work/${item.slug}`}
                    onClick={(e) => {
                      if (pointerDownRef.current.hasMoved) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                    style={{
                      backgroundColor: `${accent}18`,
                      borderColor: `${accent}40`,
                      color: accent,
                      borderWidth: '1px',
                    }}
                    aria-label={`View ${item.title} case study`}
                    >
                      <span>View</span>
                      <span>→</span>
                    </Link>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToIndex(index);
                    }}
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-line text-muted font-mono text-[10px] transition-colors hover:text-ink hover:border-accent/40"
                    aria-label={`Bring ${item.title} to front`}
                  >
                    ↗
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Telemetry / Hint ── */}
      <div className="relative z-30 flex items-center justify-between px-6 sm:px-8 py-3.5 border-t border-line/20 bg-bg/40 text-[10px] font-mono text-dim">
        <div className="flex items-center gap-2">
          <span>ORBIT TILT: -12°</span>
          <span className="text-line">·</span>
          <span>SPRING DAMPED</span>
        </div>
        <div className="flex items-center gap-2">
          <span>DRAG, WHEEL OR KEYS TO ROTATE</span>
          <span className="text-accent animate-pulse">●</span>
        </div>
      </div>
    </div>
  );
}

export default OrbitGallery;
