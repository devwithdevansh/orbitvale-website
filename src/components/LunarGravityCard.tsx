'use client';

import { useRef, useEffect, type ReactNode } from 'react';

interface LunarGravityCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
}

/**
 * LunarGravityCard — Halden-class mouse-tilt physics card.
 *
 * The card tilts toward the cursor using spring physics.
 * A mint highlight follows the pointer (specular reflection).
 * Only active on pointer:fine & hover:hover devices.
 * Springs flat on leave or on touch devices.
 */
export function LunarGravityCard({
  children,
  className = '',
  maxTilt = 10,
  glowColor = '#7ff3d0',
}: LunarGravityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    rx: 0,
    ry: 0,
    vrx: 0,
    vry: 0,
    gx: 50,
    gy: 50,
    active: false,
    raf: 0,
  });

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;

    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const cardEl: HTMLDivElement = card;
    const glowEl: HTMLDivElement = glow;
    const s = stateRef.current;

    const STIFFNESS = 0.09;
    const DAMPING = 0.76;

    function onMove(e: PointerEvent) {
      const rect = cardEl.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;
      s.ry = (mx - 0.5) * maxTilt * 2;
      s.rx = -(my - 0.5) * maxTilt * 2;
      s.gx = mx * 100;
      s.gy = my * 100;
    }

    function onEnter() {
      s.active = true;
    }

    function onLeave() {
      s.active = false;
      s.ry = 0;
      s.rx = 0;
      s.gx = 50;
      s.gy = 50;
    }

    cardEl.addEventListener('pointermove', onMove, { passive: true });
    cardEl.addEventListener('pointerenter', onEnter, { passive: true });
    cardEl.addEventListener('pointerleave', onLeave, { passive: true });

    let currentRx = 0;
    let currentRy = 0;

    function frame() {
      const ax = (s.rx - currentRx) * STIFFNESS;
      const ay = (s.ry - currentRy) * STIFFNESS;
      s.vrx = s.vrx * DAMPING + ax;
      s.vry = s.vry * DAMPING + ay;
      currentRx += s.vrx;
      currentRy += s.vry;

      cardEl.style.transform = `perspective(900px) rotateX(${currentRx}deg) rotateY(${currentRy}deg)`;
      glowEl.style.background = `radial-gradient(circle at ${s.gx}% ${s.gy}%, ${glowColor}20 0%, transparent 65%)`;
      glowEl.style.opacity = s.active ? '1' : '0';

      s.raf = requestAnimationFrame(frame);
    }

    s.raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(s.raf);
      cardEl.removeEventListener('pointermove', onMove);
      cardEl.removeEventListener('pointerenter', onEnter);
      cardEl.removeEventListener('pointerleave', onLeave);
    };
  }, [maxTilt, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`relative will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300"
      />
      {children}
    </div>
  );
}

export default LunarGravityCard;
