'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * Act VII — The Arrival.
 * Stars streak into a tunnel; speed ramps up when user hovers the CTA.
 * The whole section feels like breaking the speed of light.
 */
export function CtaSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const speedRef = useRef(12);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    type Star = { x: number; y: number; z: number; pz: number };
    let stars: Star[] = [];
    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;

    const spawn = () => {
      stars = Array.from({ length: 160 }, () => ({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * w,
        pz: 0,
      }));
      stars.forEach((s) => { s.pz = s.z; });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = host.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    };

    const draw = () => {
      if (!running) return;

      // Smooth speed ramp: accelerate on hover, decelerate on leave
      const targetSpeed = hoveredRef.current ? 56 : 12;
      speedRef.current += (targetSpeed - speedRef.current) * 0.06;
      const speed = reduced ? 0 : speedRef.current;

      // Motion blur trail — heavier at speed
      const trailAlpha = 0.15 + (speedRef.current / 56) * 0.2;
      ctx.fillStyle = `rgba(8,9,11,${trailAlpha})`;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Vignette — stronger at speed
      const vigAlpha = 0.4 + (speedRef.current / 56) * 0.4;
      const vig = ctx.createRadialGradient(cx, cy, h * 0.1, cx, cy, h * 0.9);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, `rgba(0,0,0,${vigAlpha})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed;
        if (s.z <= 1) {
          s.x = (Math.random() - 0.5) * w;
          s.y = (Math.random() - 0.5) * h;
          s.z = w;
          s.pz = s.z;
        }

        const sx = cx + (s.x / s.z) * w * 0.5;
        const sy = cy + (s.y / s.z) * h * 0.5;
        const px = cx + (s.x / s.pz) * w * 0.5;
        const py = cy + (s.y / s.pz) * h * 0.5;
        const brightness = Math.min(1, (1 - s.z / w) * 1.6);

        // At high speed — shift to warm white
        const r = Math.round(127 + brightness * 128);
        const g = Math.round(243 - (speedRef.current / 56) * 80);
        const b = Math.round(208 - (speedRef.current / 56) * 80);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(${r},${g},${b},${brightness})`;
        ctx.lineWidth = Math.max(0.5, brightness * 2.5);
        ctx.stroke();
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !reduced) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(draw);
        }
      },
      { rootMargin: '10% 0px' }
    );

    resize();
    io.observe(host);
    window.addEventListener('resize', resize);
    if (!reduced) raf = requestAnimationFrame(draw);
    else {
      ctx.fillStyle = '#08090b';
      ctx.fillRect(0, 0, w, h);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div ref={hostRef} className="relative min-h-[72svh] w-full md:min-h-[560px]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="relative z-10 flex min-h-[72svh] flex-col items-center justify-center px-6 text-center md:min-h-[560px]">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.26em] text-dim">
            Act VII · The Arrival
          </p>
          <h2 className="mb-6 max-w-[14ch] font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            Ready for<br /><span className="text-accent">orbit?</span>
          </h2>
          <p className="mb-10 max-w-md text-muted">
            Tell us what you&apos;re building. We&apos;ll map the orbit together.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full border border-accent/50 bg-accent/10 px-8 py-4 font-mono text-xs uppercase tracking-[0.22em] text-accent transition-all duration-300 hover:bg-accent hover:text-bg hover:border-accent"
            onMouseEnter={() => { hoveredRef.current = true; }}
            onMouseLeave={() => { hoveredRef.current = false; }}
          >
            Begin the journey
            <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
          </Link>
          <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.24em] text-dim opacity-50">
            hover to accelerate
          </p>
        </div>
      </div>
    </section>
  );
}

