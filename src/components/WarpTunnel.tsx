'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * WarpTunnel — Canvas 2D light-streak transition overlay.
 * Fires a fast warp animation when the route pathname changes.
 * Guaranteed pointer-events-none; never intercepts clicks.
 * Cleanly cancels previous RAFs on fast route transitions and unmounts.
 */
export function WarpTunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [active, setActive] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Skip initial mount, only run on actual pathname transitions
    if (prevPathRef.current === pathname) {
      return;
    }
    prevPathRef.current = pathname;

    // Cancel any previous in-flight transition
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const reduced = prefersReducedMotion();
    if (reduced) {
      // With reduced motion, skip canvas warp entirely
      setActive(false);
      return;
    }

    const duration = 500;
    const start = performance.now();

    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;

    type Streak = {
      angle: number;
      dist: number;
      speed: number;
      length: number;
      bright: number;
      warm: boolean;
    };

    const streaks: Streak[] = Array.from({ length: 120 }, (_, i) => ({
      angle: (i / 120) * Math.PI * 2 + (Math.random() - 0.5) * 0.1,
      dist: 20 + Math.random() * 60,
      speed: 1.5 + Math.random() * 2.0,
      length: 60 + Math.random() * 160,
      bright: 0.3 + Math.random() * 0.7,
      warm: Math.random() > 0.65,
    }));

    canvas.width = W;
    canvas.height = H;
    setActive(true);

    const tick = (now: number) => {
      const rawP = Math.min((now - start) / duration, 1);
      const p = rawP < 0.5 ? rawP * 2 : 1;
      const fade = rawP < 0.6 ? 1 : 1 - (rawP - 0.6) / 0.4;

      ctx.clearRect(0, 0, W, H);

      // Dark vignette
      const maxR = Math.sqrt(cx * cx + cy * cy);
      const vig = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      vig.addColorStop(0, `rgba(7,8,10,${0.35 * fade})`);
      vig.addColorStop(1, `rgba(7,8,10,${0.9 * fade})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Light streaks radiating from center
      for (const s of streaks) {
        const traveled = p * s.speed * Math.min(W, H) * 0.85;
        const r0 = s.dist + traveled * 0.5;
        const r1 = r0 + s.length * p;
        const x0 = cx + Math.cos(s.angle) * r0;
        const y0 = cy + Math.sin(s.angle) * r0;
        const x1 = cx + Math.cos(s.angle) * r1;
        const y1 = cy + Math.sin(s.angle) * r1;

        const grad = ctx.createLinearGradient(x0, y0, x1, y1);
        const col = s.warm ? '255,184,107' : '127,243,208';
        grad.addColorStop(0, `rgba(${col},0)`);
        grad.addColorStop(0.3, `rgba(${col},${s.bright * fade * 0.85})`);
        grad.addColorStop(1, `rgba(${col},0)`);

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8 + s.bright * 1.2;
        ctx.stroke();
      }

      // Central white flash at peak
      if (p > 0.35 && p < 0.75) {
        const flashP = 1 - Math.abs(p - 0.55) / 0.2;
        const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
        flash.addColorStop(0, `rgba(255,255,255,${flashP * 0.55 * fade})`);
        flash.addColorStop(0.4, `rgba(200,240,255,${flashP * 0.18 * fade})`);
        flash.addColorStop(1, 'transparent');
        ctx.fillStyle = flash;
        ctx.fillRect(0, 0, W, H);
      }

      if (rawP < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, W, H);
        setActive(false);
        rafRef.current = 0;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      if (ctx) {
        ctx.clearRect(0, 0, W, H);
      }
      setActive(false);
    };
  }, [pathname]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[200] transition-opacity duration-150"
      aria-hidden="true"
      style={{
        width: '100vw',
        height: '100vh',
        display: active ? 'block' : 'none',
      }}
    />
  );
}

export default WarpTunnel;
