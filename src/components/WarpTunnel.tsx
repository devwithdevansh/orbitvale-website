'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * WarpTunnel — Canvas 2D light-streak transition overlay.
 * Fires a 650ms warp animation whenever the route pathname changes.
 * Respects prefers-reduced-motion (skips to fade-only).
 */
export function WarpTunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const duration = reduced ? 240 : 650;
    const start = performance.now();
    let raf = 0;

    // Seed deterministic streaks
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

    const streaks: Streak[] = Array.from({ length: reduced ? 0 : 160 }, (_, i) => ({
      angle: (i / 160) * Math.PI * 2 + (Math.random() - 0.5) * 0.08,
      dist: 20 + Math.random() * 60,
      speed: 1.4 + Math.random() * 2.2,
      length: 60 + Math.random() * 180,
      bright: 0.3 + Math.random() * 0.7,
      warm: Math.random() > 0.6,
    }));

    canvas.width = W;
    canvas.height = H;
    setActive(true);

    const tick = (now: number) => {
      const rawP = Math.min((now - start) / duration, 1);
      // Ease: fast in, slow out
      const p = rawP < 0.5 ? rawP * 2 : 1;
      const fade = rawP < 0.65 ? 1 : 1 - (rawP - 0.65) / 0.35;

      ctx.clearRect(0, 0, W, H);

      // Dark vignette
      const vig = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy));
      vig.addColorStop(0, `rgba(8,9,11,${0.4 * fade})`);
      vig.addColorStop(1, `rgba(8,9,11,${0.95 * fade})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      if (!reduced) {
        // Light streaks radiating from center
        for (const s of streaks) {
          const traveled = p * s.speed * Math.min(W, H) * 0.9;
          const r0 = s.dist + traveled * 0.5;
          const r1 = r0 + s.length * p;
          const x0 = cx + Math.cos(s.angle) * r0;
          const y0 = cy + Math.sin(s.angle) * r0;
          const x1 = cx + Math.cos(s.angle) * r1;
          const y1 = cy + Math.sin(s.angle) * r1;

          const grad = ctx.createLinearGradient(x0, y0, x1, y1);
          const col = s.warm ? '255,184,107' : '127,243,208';
          grad.addColorStop(0, `rgba(${col},0)`);
          grad.addColorStop(0.3, `rgba(${col},${s.bright * fade * 0.9})`);
          grad.addColorStop(1, `rgba(${col},0)`);

          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8 + s.bright * 1.4;
          ctx.stroke();
        }

        // Central white flash at peak
        if (p > 0.35 && p < 0.75) {
          const flashP = 1 - Math.abs(p - 0.55) / 0.2;
          const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
          flash.addColorStop(0, `rgba(255,255,255,${flashP * 0.65 * fade})`);
          flash.addColorStop(0.4, `rgba(200,240,255,${flashP * 0.2 * fade})`);
          flash.addColorStop(1, 'transparent');
          ctx.fillStyle = flash;
          ctx.fillRect(0, 0, W, H);
        }
      }

      if (rawP < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setActive(false);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setActive(false);
    };
  }, [pathname]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[200]"
      aria-hidden="true"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
