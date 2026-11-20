'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

/*
 * 404 — Off Orbit
 *
 * A message in a bottle drifting on animated SVG waves.
 * The bottle bobs gently; the waves scroll left; tiny stars drift above.
 * Jurors always visit 404. Charm matters.
 */
export default function NotFound() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const svg = svgRef.current;
    if (!svg) return;

    const wave1 = svg.querySelector<SVGPathElement>('#wave1')!;
    const wave2 = svg.querySelector<SVGPathElement>('#wave2')!;
    const wave3 = svg.querySelector<SVGPathElement>('#wave3')!;
    const bottle = svg.querySelector<SVGGElement>('#bottle')!;
    const stars = svg.querySelectorAll<SVGCircleElement>('.star');

    let t = 0;
    let raf = 0;

    const W = 800;

    function waveY(x: number, freq: number, amp: number, phase: number) {
      return amp * Math.sin((x / W) * Math.PI * freq + phase);
    }

    function buildWavePath(freq: number, amp: number, phase: number, y: number) {
      const pts = [];
      for (let x = 0; x <= W; x += 20) {
        pts.push(`${x === 0 ? 'M' : 'L'}${x},${y + waveY(x, freq, amp, phase)}`);
      }
      pts.push(`L${W},400 L0,400 Z`);
      return pts.join(' ');
    }

    function tick() {
      t += 0.012;

      wave1.setAttribute('d', buildWavePath(3, 14, t, 220));
      wave2.setAttribute('d', buildWavePath(2.5, 10, t * 1.3 + 1, 235));
      wave3.setAttribute('d', buildWavePath(2, 7, t * 0.8 + 2, 248));

      // bottle bobs on wave surface
      const bottleY = waveY(W * 0.52, 3, 14, t);
      const bottleRot = waveY(W * 0.52, 3, 10, t * 1.1) * 0.6;
      bottle.setAttribute('transform', `translate(0, ${bottleY}) rotate(${bottleRot}, 400, 230)`);

      // drift stars
      stars.forEach((s, i) => {
        const cx = parseFloat(s.getAttribute('data-cx') ?? '0');
        const spd = 0.2 + i * 0.07;
        const nx = ((cx - spd * 0.5 + W) % W);
        s.setAttribute('cx', String(nx));
        s.setAttribute('data-cx', String(nx));
        const a = 0.3 + 0.2 * Math.sin(t * 2 + i);
        s.setAttribute('opacity', String(a));
      });

      raf = requestAnimationFrame(tick);
    }

    // init star positions
    stars.forEach((s, i) => {
      const cx = Math.random() * W;
      s.setAttribute('cx', String(cx));
      s.setAttribute('data-cx', String(cx));
    });

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center overflow-hidden bg-bg">

      {/* Text block */}
      <div className="relative z-10 mt-28 flex flex-col items-center px-6 text-center">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-dim">404</p>
        <h1 className="mb-4 font-display text-6xl font-semibold tracking-tight text-ink md:text-8xl">
          Off<span className="text-accent">Orbit</span>
        </h1>
        <p className="mb-10 max-w-sm text-muted">
          This trajectory doesn't exist. The bottle drifted here by accident.
          <br />
          Return to the ring.
        </p>
        <Link
          href="/"
          className="rounded-full border border-accent/50 bg-accent/10 px-8 py-3 font-mono text-xs uppercase tracking-[0.22em] text-accent transition-all hover:bg-accent hover:text-bg"
        >
          Back to orbit
        </Link>
      </div>

      {/* Ocean SVG scene */}
      <div className="relative mt-auto w-full max-w-3xl self-end">
        <svg
          ref={svgRef}
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMax meet"
          className="w-full"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="skyGlow" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#7ff3d0" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#08090b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ocean1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f3d35" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#08090b" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="ocean2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d2e28" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#08090b" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="ocean3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a2320" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#08090b" stopOpacity="0.98" />
            </linearGradient>
            <filter id="bottleGlow">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Sky glow */}
          <rect width="800" height="400" fill="url(#skyGlow)" />

          {/* Stars */}
          {Array.from({ length: 24 }, (_, i) => (
            <circle
              key={i}
              className="star"
              cx={Math.random() * 800}
              cy={20 + Math.random() * 160}
              r={0.6 + Math.random() * 1}
              fill="#fff"
              opacity="0.3"
            />
          ))}

          {/* Moon */}
          <circle cx="680" cy="60" r="22" fill="none" stroke="#7ff3d0" strokeWidth="1" opacity="0.4" />
          <circle cx="693" cy="55" r="20" fill="#08090b" />

          {/* Wave layers (paths updated by rAF) */}
          <path id="wave1" fill="url(#ocean1)" />
          <path id="wave2" fill="url(#ocean2)" />
          <path id="wave3" fill="url(#ocean3)" />

          {/* Mint wave crest lines */}
          <path id="wave1" d="M0,220 Q200,200 400,220 Q600,240 800,220" fill="none" stroke="#7ff3d0" strokeWidth="0.8" strokeOpacity="0.25" />

          {/* The bottle */}
          <g id="bottle" filter="url(#bottleGlow)">
            {/* Cork */}
            <rect x="384" y="186" width="32" height="10" rx="3" fill="#c8a26e" />
            {/* Neck */}
            <rect x="390" y="196" width="20" height="20" rx="2" fill="#b5d4cf" fillOpacity="0.8" />
            {/* Body */}
            <rect x="378" y="216" width="44" height="52" rx="8" fill="#7fc9bd" fillOpacity="0.6" stroke="#7ff3d0" strokeWidth="0.8" strokeOpacity="0.5" />
            {/* Paper inside */}
            <rect x="385" y="224" width="30" height="22" rx="2" fill="#f4f4f6" fillOpacity="0.7" />
            <line x1="389" y1="230" x2="411" y2="230" stroke="#8a8b93" strokeWidth="1" />
            <line x1="389" y1="235" x2="411" y2="235" stroke="#8a8b93" strokeWidth="1" />
            <line x1="389" y1="240" x2="405" y2="240" stroke="#8a8b93" strokeWidth="1" />
            {/* Highlight */}
            <rect x="382" y="220" width="6" height="40" rx="3" fill="#fff" fillOpacity="0.15" />
          </g>

          {/* Mint orbit ring reflection */}
          <ellipse cx="400" cy="258" rx="30" ry="6" fill="none" stroke="#7ff3d0" strokeWidth="0.5" strokeOpacity="0.15" />
        </svg>
      </div>
    </div>
  );
}
