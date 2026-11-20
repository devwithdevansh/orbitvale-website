'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface HeroCard {
  title: string;
  category: string;
  cover: string;
  accent: string;
  slug: string;
  xOffset: string;
  rotate: string;
  delay: number;
}

const HERO_CARDS: HeroCard[] = [
  {
    title: 'Project Phoenix',
    category: 'SaaS Platform',
    cover: '/covers/project-phoenix.svg',
    accent: '#ff6230',
    slug: 'project-phoenix',
    xOffset: '-32vw',
    rotate: '-14deg',
    delay: 0,
  },
  {
    title: 'Nebula CMS',
    category: 'Headless CMS',
    cover: '/covers/nebula-cms.svg',
    accent: '#c084fc',
    slug: 'nebula-cms',
    xOffset: '-11vw',
    rotate: '-5deg',
    delay: 100,
  },
  {
    title: 'OrbitDB',
    category: 'Decentralized DB',
    cover: '/covers/orbitdb.svg',
    accent: '#7ff3d0',
    slug: 'orbitdb',
    xOffset: '11vw',
    rotate: '6deg',
    delay: 200,
  },
  {
    title: 'Lumen',
    category: 'Real-time Analytics',
    cover: '/covers/lumen.svg',
    accent: '#a3e635',
    slug: 'lumen',
    xOffset: '32vw',
    rotate: '15deg',
    delay: 300,
  },
];

/**
 * Section 01 · Hero Section (Halden 3D Deck + Lusion Orbital Precision)
 *
 * The opening animation IS this hero section:
 * 1. Orbital ring sweeps across and draws itself with mint glow.
 * 2. Monumental "ORBITVALE" typography rises to anchor the bottom of the screen.
 * 3. Four project cards deal out from the center stack and fan into a 3D perspective deck.
 * 4. Center card features the interactive circular "See Work" badge.
 * 5. Interactive pointer parallax: moving the mouse tilts the 3D cards in physical space.
 * 6. "↓ Scroll to explore" prompts the journey into the manifesto.
 */
export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Trigger opening sequence on mount
    const timer = setTimeout(() => setMounted(true), 100);
    const sync = () => setIsMobile(window.innerWidth < 640);
    sync();
    window.addEventListener('resize', sync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', sync);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setPointer({ x, y });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] w-full flex flex-col justify-between overflow-hidden bg-[#07080a] text-[#f2f4f7] pt-24 pb-8 px-6 select-none"
      style={{ isolation: 'isolate' }}
    >
      {/* ── Background Orbit Ring SVG ────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg
          viewBox="0 0 600 300"
          className="w-full max-w-4xl h-auto overflow-visible opacity-50"
          aria-hidden="true"
        >
          <defs>
            <filter id="hero-ring-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Dim background orbit track */}
          <ellipse
            cx="300"
            cy="150"
            rx="240"
            ry="64"
            transform="rotate(-13 300 150)"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
          />
          {/* Mint active orbit ring with dash draw-in */}
          <ellipse
            cx="300"
            cy="150"
            rx="240"
            ry="64"
            transform="rotate(-13 300 150)"
            fill="none"
            stroke="#7ff3d0"
            strokeWidth="1.8"
            strokeDasharray="1600"
            strokeDashoffset={mounted ? '0' : '1600'}
            strokeLinecap="round"
            filter="url(#hero-ring-glow)"
            style={{
              transition: 'stroke-dashoffset 2.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>
      </div>

      {/* ── Editorial Top Micro-Copy ─────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.22em] text-muted">
        <div className="max-w-xs leading-relaxed hidden sm:block">
          Digital systems in continuous motion
        </div>
        <div className="text-right text-dim">
          Act 01 · The Object
        </div>
      </div>

      {/* ── 3D Fanned Project Cards (The Centerpiece Deck) ───────────────── */}
      <div
        className="relative z-10 mx-auto my-auto flex items-center justify-center w-full max-w-5xl h-72 sm:h-80 md:h-96"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {HERO_CARDS.map((card, index) => {
          const isCenter = index === 2;
          const isHovered = activeCard === index;
          const tiltX = pointer.y * -9;
          const tiltY = pointer.x * 12;

          const currentOffset = isMobile
            ? `calc(${card.xOffset} * 0.72)`
            : card.xOffset;

          return (
            <Link
              key={card.title}
              href={`/work/${card.slug}`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              className="absolute w-32 sm:w-44 md:w-56 aspect-[3/4] rounded-2xl border bg-[#101216] p-2 sm:p-2.5 shadow-2xl transition-all duration-700 cursor-pointer"
              style={{
                transform: mounted
                  ? `translateX(${currentOffset}) rotate(${card.rotate}) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${isHovered ? 1.12 : isCenter ? 1.05 : 0.95})`
                  : 'translateX(0) rotate(0deg) scale(0.65)',
                opacity: mounted ? 1 : 0,
                borderColor: isHovered ? card.accent : 'rgba(255,255,255,0.12)',
                boxShadow: isHovered
                  ? `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${card.accent}30`
                  : '0 15px 35px rgba(0,0,0,0.6)',
                transitionDelay: mounted ? `${card.delay}ms` : '0ms',
                transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                zIndex: isHovered ? 30 : isCenter ? 20 : 10,
              }}
            >
              {/* Cover Image inside card */}
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.cover}
                  alt={card.title}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Card labels */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div
                    className="font-mono text-[9px] uppercase tracking-[0.2em]"
                    style={{ color: card.accent }}
                  >
                    {card.category}
                  </div>
                  <div className="font-display text-xs sm:text-sm font-semibold text-white mt-0.5">
                    {card.title}
                  </div>
                </div>

                {/* Halden "See Work" circular badge on front card */}
                {isCenter && (
                  <div
                    className="absolute -top-3 -right-3 z-30 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#07080a] border border-accent/60 shadow-xl transition-transform duration-300 hover:scale-110"
                    style={{
                      animation: 'pulse 3s infinite ease-in-out',
                    }}
                  >
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-accent text-center leading-tight">
                      See<br />Work →
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Bottom Section: Scroll prompt + Monumental ORBITVALE ──────────── */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Scroll CTA Indicator */}
        <div className="mb-4 flex items-center gap-2 rounded-full border border-line/40 bg-panel/60 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted backdrop-blur-md transition-colors hover:border-accent hover:text-accent">
          <span>↓ Scroll to explore</span>
        </div>

        {/* Monumental Architectural Wordmark */}
        <div
          className="w-full text-center font-display font-extrabold tracking-[-0.02em] select-none text-white/90 leading-none"
          style={{
            fontSize: 'clamp(48px, 12.5vw, 175px)',
            transform: mounted ? 'translateY(0)' : 'translateY(60px)',
            opacity: mounted ? 0.94 : 0,
            transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease',
          }}
        >
          ORBITVALE
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
