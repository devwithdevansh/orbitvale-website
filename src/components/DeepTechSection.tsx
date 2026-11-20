'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * Act V — The Deep.
 * Cinematic black hole: gravitational lensing ring, Keplerian accretion disk,
 * relativistic jets, lensed starfield. Pure Canvas 2D — no WebGL deps.
 */
export function DeepTechSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let raf = 0;
    let t = 0;
    let running = true;

    // ── deterministic seeded PRNG ──────────────────────────────────────────
    let seed = 42;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 0xffffffff;
    };

    // ── star field (generated once) ───────────────────────────────────────
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    type Star = { nx: number; ny: number; size: number; bright: number; twinkleSpeed: number; twinklePhase: number };
    const stars: Star[] = Array.from({ length: isMobile ? 160 : 320 }, () => ({
      nx: rand() * 2 - 1,
      ny: rand() * 2 - 1,
      size: rand() * 1.4 + 0.3,
      bright: rand() * 0.6 + 0.3,
      twinkleSpeed: rand() * 1.5 + 0.5,
      twinklePhase: rand() * Math.PI * 2,
    }));

    // ── accretion disk particles ────────────────────────────────────────────
    type Particle = {
      angle: number; speed: number; orbitA: number; orbitB: number;
      tilt: number; warm: boolean; alpha: number; size: number;
    };
    const DISK_N = isMobile ? 120 : 240;
    const particles: Particle[] = Array.from({ length: DISK_N }, (_, i) => {
      const frac = i / DISK_N;
      const inner = 0.28 + rand() * 0.08;
      const outer = 0.52 + rand() * 0.14;
      const orbitA = inner + (outer - inner) * Math.pow(rand(), 0.6);
      return {
        angle: rand() * Math.PI * 2,
        speed: (0.004 + (1 - orbitA / 0.65) * 0.012) * (rand() > 0.5 ? 1 : -1),
        orbitA,
        orbitB: orbitA * (0.26 + rand() * 0.08),
        tilt: (rand() - 0.5) * 0.18,
        warm: frac < 0.55,
        alpha: 0.5 + rand() * 0.5,
        size: 0.9 + rand() * 1.4,
      };
    });

    // ── jet particles ──────────────────────────────────────────────────────
    type Jet = { angle: number; speed: number; life: number; maxLife: number; dir: 1 | -1 };
    const JET_N = isMobile ? 30 : 60;
    const jets: Jet[] = Array.from({ length: JET_N }, (_, i) => ({
      angle: (rand() - 0.5) * 0.18,
      speed: 0.012 + rand() * 0.018,
      life: rand() * 1,
      maxLife: 0.6 + rand() * 0.4,
      dir: i < JET_N / 2 ? 1 : -1,
    }));

    // ── resize ─────────────────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = host.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ── main draw ──────────────────────────────────────────────────────────
    const draw = () => {
      if (!running) return;
      const { width, height } = host.getBoundingClientRect();
      if (!reduced) t += 0.006;

      // Background
      ctx.fillStyle = '#08090b';
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const R = Math.min(width, height) * 0.36; // base radius

      // ── Atmospheric halo ────────────────────────────────────────────────
      const halo = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 2.0);
      halo.addColorStop(0, 'rgba(255,160,80,0.10)');
      halo.addColorStop(0.3, 'rgba(127,243,208,0.05)');
      halo.addColorStop(0.65, 'rgba(60,30,80,0.04)');
      halo.addColorStop(1, 'transparent');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);

      // ── Gravitationally lensed starfield ────────────────────────────────
      for (const s of stars) {
        const sx = cx + s.nx * width * 0.6;
        const sy = cy + s.ny * height * 0.6;
        const dx = sx - cx; const dy = sy - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const lensR = R * 0.9;
        // push stars outward near the hole
        let rx = sx; let ry = sy;
        if (dist < lensR && dist > 0.1) {
          const push = (lensR - dist) / lensR;
          const f = 1 + push * push * 2.4;
          rx = cx + (dx / dist) * dist * f;
          ry = cy + (dy / dist) * dist * f;
        }
        const twinkle = reduced ? 0 : Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.3;
        const a = Math.min(1, s.bright + twinkle) * (dist < lensR * 0.4 ? 0 : 1);
        ctx.beginPath();
        ctx.arc(rx, ry, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      }

      // ── Relativistic jets ───────────────────────────────────────────────
      for (const j of jets) {
        if (!reduced) {
          j.life += j.speed;
          if (j.life > j.maxLife) j.life = 0;
        }
        const frac = j.life / j.maxLife;
        const spread = j.angle;
        const jx = cx + Math.sin(spread) * R * 0.1 + Math.sin(spread + Math.PI / 2) * R * frac * 0.08;
        const jy = cy + j.dir * frac * R * 1.6;
        const a = Math.sin(frac * Math.PI) * 0.55;
        ctx.beginPath();
        ctx.arc(jx, jy, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160,210,255,${a})`;
        ctx.fill();
      }
      // Jet cone glow
      for (let dir of [-1, 1] as const) {
        const jg = ctx.createRadialGradient(cx, cy + dir * R * 0.3, 0, cx, cy + dir * R * 0.3, R * 1.2);
        jg.addColorStop(0, 'rgba(140,200,255,0.06)');
        jg.addColorStop(1, 'transparent');
        ctx.fillStyle = jg;
        ctx.beginPath();
        ctx.ellipse(cx, cy + dir * R * 0.3, R * 0.12, R * 1.0, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Accretion disk ───────────────────────────────────────────────────
      // Sort by z so back particles render behind front ones
      const pSorted = [...particles].sort((a, b) => {
        const za = Math.sin(a.angle) * a.orbitB;
        const zb = Math.sin(b.angle) * b.orbitB;
        return za - zb;
      });

      for (const p of pSorted) {
        if (!reduced) p.angle += p.speed;

        const px = cx + Math.cos(p.angle) * R * p.orbitA;
        const py = cy + Math.sin(p.angle) * R * p.orbitB + p.tilt * R;

        // Hide particles inside event horizon
        const dxp = px - cx; const dyp = py - cy;
        if (Math.sqrt(dxp * dxp + dyp * dyp) < R * 0.21) continue;

        // Color: inner hot (white→amber), outer cool (amber→mint)
        const frac = (p.orbitA - 0.28) / 0.38;
        let col: string;
        if (p.warm) {
          if (frac < 0.25) col = `rgba(255,255,220,${p.alpha * 0.9})`;
          else if (frac < 0.55) col = `rgba(255,180,80,${p.alpha * 0.8})`;
          else col = `rgba(255,140,60,${p.alpha * 0.6})`;
        } else {
          if (frac < 0.4) col = `rgba(255,210,140,${p.alpha * 0.7})`;
          else col = `rgba(127,243,208,${p.alpha * 0.5})`;
        }

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
      }

      // ── Gravitational lensing ring (photon ring) ─────────────────────────
      // Bright side (doppler blueshift — left)
      const photonA = R * 0.265;
      const photonB = R * 0.088;
      ctx.save();
      ctx.translate(cx, cy);
      for (let i = 0; i < 3; i++) {
        const radius = photonA * (1 + i * 0.04);
        const radiusB = photonB * (1 + i * 0.04);
        const alpha = [0.75, 0.4, 0.15][i];
        const grd = ctx.createLinearGradient(-radius, 0, radius, 0);
        grd.addColorStop(0, `rgba(200,230,255,${alpha})`);   // blueshift (approaching)
        grd.addColorStop(0.4, `rgba(255,220,160,${alpha * 0.8})`);
        grd.addColorStop(1, `rgba(255,120,40,${alpha * 0.5})`); // redshift (receding)
        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radiusB, 0, 0, Math.PI * 2);
        ctx.strokeStyle = grd;
        ctx.lineWidth = i === 0 ? 2.5 : 1.2;
        ctx.stroke();
      }
      ctx.restore();

      // ── Event horizon (black hole core) ──────────────────────────────────
      const holeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.26);
      holeGrad.addColorStop(0, '#000000');
      holeGrad.addColorStop(0.75, '#020304');
      holeGrad.addColorStop(1, 'rgba(2,3,4,0)');
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * 0.26, R * 0.09, 0, 0, Math.PI * 2);
      ctx.fillStyle = holeGrad;
      ctx.fill();

      // Sharp inner edge
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * 0.22, R * 0.075, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    // ── IntersectionObserver: pause when off-screen ───────────────────────
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
    else draw();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div ref={hostRef} className="relative min-h-[70svh] w-full md:min-h-[640px]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        {/* Left edge scrim so copy is readable */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-bg/80 to-transparent" />
        <div className="relative z-10 flex min-h-[70svh] items-end px-6 pb-16 md:min-h-[640px] md:pb-24">
          <div className="mx-auto w-full max-w-5xl">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.26em] text-warm">
              Act V · The Deep
            </p>
            <h2 className="max-w-[16ch] text-3xl font-semibold tracking-tight text-ink md:text-5xl">
              Deep tech, held at the edge.
            </h2>
            <p className="mt-4 max-w-md text-muted">
              The loudest frame on the page. Copy never covers the centre — gravity does the talking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
