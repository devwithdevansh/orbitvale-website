'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor — Lusion-class magnetic cursor
 *
 * - Soft-follow ring with spring physics
 * - Dot locks to exact pointer position
 * - Scales up on <a>, <button> hover (magnetic attraction)
 * - Media query guarded: ONLY active on devices with fine pointer & hover support
 * - Automatically falls back to native cursor on touchscreens and reduced motion
 * - Full pointer-events-none; never intercepts clicks or touch events
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const stateRef = useRef({
    mx: -100,
    my: -100,
    rx: -100,
    ry: -100,
    vx: 0,
    vy: 0,
    hovered: false,
    visible: false,
    raf: 0,
  });

  useEffect(() => {
    // Only enable on devices with a mouse/fine pointer and hover capability
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || reducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const s = stateRef.current;
    const STIFFNESS = 0.14;
    const DAMPING = 0.78;

    document.documentElement.style.cursor = 'none';

    function onMove(e: PointerEvent) {
      s.mx = e.clientX;
      s.my = e.clientY;
      if (!s.visible) {
        s.rx = e.clientX;
        s.ry = e.clientY;
        s.visible = true;
        if (dot) dot.style.opacity = '1';
        if (ring) ring.style.opacity = '1';
      }
    }

    function onLeave() {
      s.visible = false;
      if (dot) dot.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
    }

    function onOver(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      s.hovered = !!(
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('[data-cursor-hover]')
      );
    }

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });

    function frame() {
      if (dot && ring) {
        // Dot snaps instantly to pointer
        dot.style.transform = `translate(${s.mx - 4}px, ${s.my - 4}px)`;

        // Ring spring physics
        const dx = s.mx - s.rx;
        const dy = s.my - s.ry;
        s.vx = s.vx * DAMPING + dx * STIFFNESS;
        s.vy = s.vy * DAMPING + dy * STIFFNESS;
        s.rx += s.vx;
        s.ry += s.vy;

        const scale = s.hovered ? 1.85 : 1;
        ring.style.transform = `translate(${s.rx - 20}px, ${s.ry - 20}px) scale(${scale})`;
      }

      s.raf = requestAnimationFrame(frame);
    }

    s.raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(s.raf);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.style.cursor = '';
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <>
      {/* Precision pointer dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-accent opacity-0 transition-opacity duration-200"
        style={{ willChange: 'transform' }}
      />
      {/* Spring trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 rounded-full border border-accent/60 opacity-0 transition-opacity duration-200"
        style={{
          boxShadow: '0 0 12px rgba(127, 243, 208, 0.25)',
          willChange: 'transform',
        }}
      />
    </>
  );
}

export default CustomCursor;
