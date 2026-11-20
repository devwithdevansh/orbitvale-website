'use client';

import { useRef, useCallback } from 'react';

/**
 * MagneticButton — Halden/Lusion-style magnetic hover attraction.
 *
 * The inner content is physically attracted toward the cursor
 * within a bounding zone, then springs back on mouse-leave.
 * Wraps any child — works for links, buttons, divs.
 *
 * Usage:
 *   <MagneticButton strength={0.42}>
 *     <Link href="/contact">Start a project</Link>
 *   </MagneticButton>
 */

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;   // 0–1 attraction multiplier (default 0.4)
  className?: string;
}

export function MagneticButton({
  children,
  strength = 0.4,
  className = '',
}: MagneticButtonProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const setTransform = useCallback((x: number, y: number, duration: string) => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transition = `transform ${duration} cubic-bezier(0.16,1,0.3,1)`;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const outer = outerRef.current;
      if (!outer) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = outer.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        setTransform(dx, dy, '0.25s');
      });
    },
    [strength, setTransform]
  );

  const onMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setTransform(0, 0, '0.5s');
  }, [setTransform]);

  return (
    <div
      ref={outerRef}
      className={`inline-block ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div ref={innerRef}>
        {children}
      </div>
    </div>
  );
}
