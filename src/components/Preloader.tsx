'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface CardItem {
  title: string;
  category: string;
  cover: string;
  accent: string;
  xOffset: string;
  rotate: string;
  delay: number;
}

const FAN_CARDS: CardItem[] = [
  {
    title: 'Project Phoenix',
    category: 'SaaS Platform',
    cover: '/covers/project-phoenix.svg',
    accent: '#ff6230',
    xOffset: '-34vw',
    rotate: '-14deg',
    delay: 0,
  },
  {
    title: 'Nebula CMS',
    category: 'Headless CMS',
    cover: '/covers/nebula-cms.svg',
    accent: '#c084fc',
    xOffset: '-12vw',
    rotate: '-5deg',
    delay: 120,
  },
  {
    title: 'OrbitDB',
    category: 'Decentralized DB',
    cover: '/covers/orbitdb.svg',
    accent: '#7ff3d0',
    xOffset: '12vw',
    rotate: '6deg',
    delay: 240,
  },
  {
    title: 'Lumen',
    category: 'Real-time Analytics',
    cover: '/covers/lumen.svg',
    accent: '#a3e635',
    xOffset: '34vw',
    rotate: '15deg',
    delay: 360,
  },
];

/**
 * Section 00 · Opening Sequence (Halden Reference Rebuild)
 *
 * Sequence:
 * 1. Pitch black screen. Orbit ring sweeps and draws itself with mint glow (-13° tilt).
 * 2. Giant "ORBITVALE" typography rises monumental from the bottom to anchor the screen.
 * 3. Four project cards deal out from the center stack and fan out in 3D above the name.
 * 4. Center card displays the circular "See Work" badge.
 * 5. Name locks into top navigation, unlocking scroll.
 * 6. Includes a clean "Skip" button and keyboard [ESC] dismiss.
 */
export function Preloader() {
  const [active, setActive] = useState(true);
  const [phase, setPhase] = useState<'ring' | 'rise' | 'fan' | 'lock' | 'exit'>('ring');
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard escape listener to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const skip = () => {
    setPhase('exit');
    setTimeout(() => {
      setActive(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ov-opened-v2', '1');
        document.body.style.overflow = '';
      }
    }, 450);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if previously viewed in this session
    if (sessionStorage.getItem('ov-opened-v2') === '1') {
      setActive(false);
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setActive(false);
      return;
    }

    // Lock body scroll during opening sequence
    document.body.style.overflow = 'hidden';

    // Timeline steps
    // 0.0s: Ring drawing starts
    const tRise = setTimeout(() => setPhase('rise'), 750);
    const tFan = setTimeout(() => setPhase('fan'), 1450);
    const tLock = setTimeout(() => setPhase('lock'), 2850);
    const tExit = setTimeout(() => {
      setPhase('exit');
      setTimeout(() => {
        setActive(false);
        sessionStorage.setItem('ov-opened-v2', '1');
        document.body.style.overflow = '';
      }, 650);
    }, 3900);

    return () => {
      clearTimeout(tRise);
      clearTimeout(tFan);
      clearTimeout(tLock);
      clearTimeout(tExit);
      document.body.style.overflow = '';
    };
  }, []);

  // Subtle 3D mouse parallax on fanned cards
  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setPointer({ x, y });
  };

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#07080a] text-[#f2f4f7] select-none"
      style={{
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: phase === 'exit' ? 'none' : 'auto',
      }}
      role="dialog"
      aria-label="Orbitvale Opening Sequence"
    >
      {/* Top Nav Lock Position indicator */}
      <div
        className="absolute top-5 left-6 z-30 font-display font-semibold tracking-[-0.01em] text-sm md:text-base text-ink"
        style={{
          opacity: phase === 'lock' || phase === 'exit' ? 1 : 0,
          transform: phase === 'lock' || phase === 'exit' ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        ORBITVALE
      </div>

      {/* Skip Button */}
      <button
        type="button"
        onClick={skip}
        className="absolute top-5 right-6 z-30 flex items-center gap-2 rounded-full border border-line/40 bg-panel/60 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
        aria-label="Skip intro animation"
      >
        <span>Skip</span>
        <span className="text-dim">[ESC]</span>
      </button>

      {/* ── Ring Sweep Layer ────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 600 300"
          className="w-full max-w-3xl h-auto overflow-visible"
          style={{
            opacity: phase === 'exit' ? 0 : 0.65,
            transition: 'opacity 0.6s ease',
          }}
          aria-hidden="true"
        >
          <defs>
            <filter id="ring-glow-open">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Subtle background track */}
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
          {/* Animated drawing ring */}
          <ellipse
            cx="300"
            cy="150"
            rx="240"
            ry="64"
            transform="rotate(-13 300 150)"
            fill="none"
            stroke="#7ff3d0"
            strokeWidth="2"
            strokeDasharray="1600"
            strokeDashoffset={phase === 'ring' ? '800' : '0'}
            strokeLinecap="round"
            filter="url(#ring-glow-open)"
            style={{
              transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>
      </div>

      {/* ── 3D Fanned Project Cards (Halden Hero Deck) ──────────────────── */}
      <div
        className="relative z-10 flex items-center justify-center w-full max-w-4xl h-64 md:h-80"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {FAN_CARDS.map((card, index) => {
          const isFanned = phase === 'fan' || phase === 'lock' || phase === 'exit';
          const isCenter = index === 1 || index === 2;
          const tiltX = pointer.y * -8;
          const tiltY = pointer.x * 12;

          return (
            <div
              key={card.title}
              className="absolute w-36 sm:w-44 md:w-52 aspect-[3/4] rounded-2xl border border-white/10 bg-[#101216] p-2 shadow-2xl transition-all duration-700"
              style={{
                transform: isFanned
                  ? `translateX(${card.xOffset}) rotate(${card.rotate}) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${isCenter ? 1.05 : 0.95})`
                  : 'translateX(0) rotate(0deg) scale(0.65)',
                opacity: phase === 'ring' ? 0 : isFanned ? 1 : 0.8,
                transitionDelay: `${card.delay}ms`,
                transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                zIndex: isCenter ? 20 : 10,
              }}
            >
              {/* Card Cover Image */}
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.cover}
                  alt={card.title}
                  className="h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                />
                <div className="absolute bottom-3 left-3 right-3">
                  <div
                    className="font-mono text-[9px] uppercase tracking-[0.2em]"
                    style={{ color: card.accent }}
                  >
                    {card.category}
                  </div>
                  <div className="font-display text-xs font-semibold text-white">
                    {card.title}
                  </div>
                </div>

                {/* Center Badge on top card (Halden "See Work" badge) */}
                {index === 2 && isFanned && (
                  <div
                    className="absolute -top-3 -right-3 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#07080a] border border-accent/60 shadow-xl transition-transform duration-500 hover:scale-110"
                    style={{
                      animation: 'pulse-slow 2.5s infinite ease-in-out',
                    }}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-wider text-accent text-center leading-tight">
                      See<br />Work →
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Giant Architectural ORBITVALE Typography (Halden Anchor) ────── */}
      <div
        className="absolute left-0 right-0 bottom-[-2%] z-0 text-center font-display font-extrabold tracking-[-0.02em] select-none text-white/90"
        style={{
          fontSize: 'clamp(44px, 11.5vw, 160px)',
          lineHeight: 0.9,
          transform: phase === 'ring' ? 'translateY(110%)' : 'translateY(0)',
          opacity: phase === 'ring' ? 0 : 0.92,
          transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease',
        }}
      >
        ORBITVALE
      </div>
    </div>
  );
}

export default Preloader;
