'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * Act 00 — Preloader — Particle Assembly
 *
 * Phase 1 (0 → 0.5): Ring traces itself (SVG stroke-dashoffset)
 * Phase 2 (0.4 → 0.85): Canvas particles converge into ORBITVALE letterforms
 * Phase 3 (0.85 → 1.0): Full brand logo PNG cross-fades in; particles dissolve
 * Exit: whole screen scales up and fades out
 *
 * Session-scoped — only plays once per browser session.
 */

const WORD = 'ORBITVALE';

export function Preloader() {
  const [active, setActive] = useState(true);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('ov-preloaded') === '1') {
      setActive(false);
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 200 : 2600;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 2.4);
      setProgress(eased);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem('ov-preloaded', '1');
        window.setTimeout(() => setActive(false), 700);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Particle canvas */
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    /* ── Sample letterform targets ───────────────────────────────────── */
    function sampleText(word: string, canvasW: number, canvasH: number) {
      const off = document.createElement('canvas');
      const fontSize = Math.min(canvasW * 0.075, 56);
      off.width = canvasW;
      off.height = canvasH;
      const octx = off.getContext('2d')!;
      octx.fillStyle = '#fff';
      octx.font = `600 ${fontSize}px ui-monospace,monospace`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.letterSpacing = '0.28em';
      octx.fillText(word, canvasW / 2, canvasH / 2);
      const data = octx.getImageData(0, 0, canvasW, canvasH).data;
      const pts: [number, number][] = [];
      const step = 4;
      for (let y = 0; y < canvasH; y += step) {
        for (let x = 0; x < canvasW; x += step) {
          if (data[(y * canvasW + x) * 4 + 3] > 128) {
            pts.push([x, y]);
          }
        }
      }
      return pts;
    }

    /* ── Particle type ──────────────────────────────────────────────── */
    type Particle = {
      x: number; y: number;   // current pos
      tx: number; ty: number; // target (letter pixel)
      ox: number; oy: number; // origin (scatter pos)
      vx: number; vy: number; // velocity
      size: number;
      alpha: number;
    };

    let W = 0, H = 0, dpr = 1;
    let particles: Particle[] = [];
    let targets: [number, number][] = [];
    let running = true;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      targets = sampleText(WORD, W, H);
      init();
    };

    const init = () => {
      const count = Math.min(targets.length, 600);
      particles = [];
      for (let i = 0; i < count; i++) {
        const t = targets[Math.floor(Math.random() * targets.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = 200 + Math.random() * 300;
        const ox = W / 2 + Math.cos(angle) * dist;
        const oy = H / 2 + Math.sin(angle) * dist;
        particles.push({
          x: ox, y: oy, tx: t[0], ty: t[1],
          ox, oy, vx: 0, vy: 0,
          size: 1 + Math.random() * 1.5,
          alpha: 0.6 + Math.random() * 0.4,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      // phase: 0=scatter, 1=assembled (driven by global progress)
      const globalP = parseFloat(canvas.dataset.progress || '0');
      // particles start converging at 40% global, fully assembled at 85%
      const phase = Math.max(0, Math.min(1, (globalP - 0.4) / 0.45));
      // dissolve at 85%+
      const dissolve = Math.max(0, Math.min(1, (globalP - 0.82) / 0.15));

      for (const p of particles) {
        // Spring toward target when phase > 0
        const ax = (p.tx - p.x) * 0.08 * phase;
        const ay = (p.ty - p.y) * 0.08 * phase;
        p.vx = p.vx * 0.75 + ax;
        p.vy = p.vy * 0.75 + ay;
        // scatter drift when phase is 0
        if (phase < 0.05) {
          p.vx += (Math.random() - 0.5) * 0.3;
          p.vy += (Math.random() - 0.5) * 0.3;
        }
        p.x += p.vx;
        p.y += p.vy;

        const a = p.alpha * (1 - dissolve);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(127,243,208,${a})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  /* Keep canvas progress in sync via data attribute */
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.dataset.progress = String(progress);
    }
  }, [progress]);

  if (!active) return null;

  const exiting = progress >= 0.97;

  /* Ring geometry */
  const rx = 110, ry = 42;
  const circ = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  const ringP = Math.min(1, progress / 0.5);
  const dashOffset = circ * (1 - ringP);

  /* Logo fade */
  const logoOpacity = Math.max(0, Math.min(1, (progress - 0.8) / 0.18));

  /* Counter */
  const counter = String(Math.round(progress * 100)).padStart(3, '0');

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
      style={{
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.08)' : 'scale(1)',
        transition: 'opacity 0.65s ease-in-out, transform 0.65s ease-in-out',
        pointerEvents: exiting ? 'none' : 'auto',
      }}
      role="status"
      aria-label="Loading Orbitvale"
      aria-hidden={exiting}
    >
      {/* Particle canvas — covers whole screen */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      />

      {/* Ring SVG */}
      <div className="relative z-10 flex flex-col items-center">
        <div style={{ width: 280, height: 130, position: 'relative' }}>
          <svg
            viewBox="0 0 280 130"
            fill="none"
            className="absolute inset-0 w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <filter id="pre-glow">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Dim track */}
            <ellipse cx="140" cy="65" rx={rx} ry={ry} transform="rotate(-13 140 65)"
              stroke="rgba(127,243,208,0.07)" strokeWidth="1.5" fill="none" />
            {/* Animated fill */}
            <ellipse cx="140" cy="65" rx={rx} ry={ry} transform="rotate(-13 140 65)"
              stroke="#7ff3d0" strokeWidth="2" fill="none"
              strokeDasharray={`${circ}`}
              strokeDashoffset={`${dashOffset}`}
              strokeLinecap="round"
              filter="url(#pre-glow)"
              style={{ transition: 'stroke-dashoffset 0.04s linear' }}
            />
            {/* Leading dot */}
            {ringP > 0.03 && ringP < 0.97 && (() => {
              const angle = (-13 - 90 + ringP * 360) * (Math.PI / 180);
              const x = 140 + rx * Math.cos(angle);
              const y = 65 + ry * Math.sin(angle);
              return <circle cx={x} cy={y} r="3" fill="#7ff3d0" filter="url(#pre-glow)" />;
            })()}
          </svg>

          {/* Real logo PNG cross-fade */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: logoOpacity, transition: 'opacity 0.3s ease-out' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/orbitvale.png"
              alt="Orbitvale"
              style={{
                height: 56,
                width: 'auto',
                mixBlendMode: 'screen',
                filter: `drop-shadow(0 0 ${16 * logoOpacity}px rgba(127,243,208,${0.5 * logoOpacity}))`,
              }}
            />
          </div>
        </div>

        {/* Counter + label */}
        <div className="mt-10 font-mono text-xs tracking-[0.32em] text-muted tabular-nums">
          {counter}
        </div>
        <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-dim">
          assembling orbit
        </div>
      </div>
    </div>
  );
}
