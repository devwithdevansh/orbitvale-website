'use client';

import { useEffect, useRef } from 'react';

/**
 * CustomCursor — Lusion-class magnetic cursor
 *
 * - Soft-follow ring with spring physics
 * - Dot locks to exact pointer position
 * - Scales up on <a>, <button> hover (magnetic attraction)
 * - Hides native cursor globally
 * - Reduced-motion: hides itself entirely (native cursor returns)
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    mx: -100, my: -100,  // mouse pos
    rx: -100, ry: -100,  // ring pos (spring follows)
    vx: 0, vy: 0,        // ring velocity
    hovered: false,
    visible: false,
    raf: 0,
  });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const s = stateRef.current;

    // Spring constants — tweak for feel
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
        dot!.style.opacity = '1';
        ring!.style.opacity = '1';
      }
    }

    function onLeave() {
      s.visible = false;
      dot!.style.opacity = '0';
      ring!.style.opacity = '0';
    }

    function onOver(e: PointerEvent) {
      const target = e.target as HTMLElement;
      s.hovered = !!(
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]')
      );
    }

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });

    function frame() {
      // Dot snaps instantly
      dot!.style.transform = `translate(${s.mx - 4}px, ${s.my - 4}px)`;

      // Ring spring physics
      const dx = s.mx - s.rx;
      const dy = s.my - s.ry;
      s.vx = s.vx * DAMPING + dx * STIFFNESS;
      s.vy = s.vy * DAMPING + dy * STIFFNESS;
      s.rx += s.vx;
      s.ry += s.vy;

      const scale = s.hovered ? 1.9 : 1;
      ring!.style.transform = `translate(${s.rx - 20}px, ${s.ry - 20}px) scale(${scale})`;

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

  return (
    <>
      {/* Exact dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-accent opacity-0"
        style={{ willChange: 'transform', transition: 'opacity 0.2s' }}
      />
      {/* Spring-follow ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 rounded-full border border-accent/60 opacity-0"
        style={{
          willChange: 'transform',
          transition: 'opacity 0.2s, transform 0s',
        }}
      />
    </>
  );
}
