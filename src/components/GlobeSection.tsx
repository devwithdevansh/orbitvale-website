'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { clamp } from '@/lib/utils';

const COUNTERS = [
  { label: 'Projects delivered', value: 86 },
  { label: 'Regions live', value: 14 },
  { label: 'Uptime this year', value: 99.9, suffix: '%' },
];

// Fibonacci sphere point generation (golden angle)
function fibonacciSphere(n: number) {
  const pts: { lat: number; lon: number }[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({ lat: Math.asin(y), lon: theta });
  }
  return pts;
}

// Connection arc endpoints [lat1, lon1, lat2, lon2] in radians
const ARCS = [
  [0.52, -0.33, 0.78, 2.1],   // Americas → Europe
  [0.78, 2.1, 0.22, 2.56],    // Europe → Middle East
  [0.22, 2.56, 0.21, 2.17],   // Middle East → India
  [0.21, 2.17, -0.17, 2.56],  // India → SE Asia
  [0.52, -0.33, -0.17, -0.72], // Americas → South America
];

const DOT_POINTS = fibonacciSphere(900);

/**
 * Act VI — The Network.
 * Interactive 3D dot-matrix globe on Canvas 2D with great-circle arcs and counters.
 */
export function GlobeSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ y: 0, px: 0, py: 0 });
  const [visible, setVisible] = useState(false);
  const [countProgress, setCountProgress] = useState(0);
  const rafRef = useRef(0);
  const runningRef = useRef(true);

  // Arc travel phases (one per arc)
  const arcPhases = useRef(ARCS.map((_, i) => i / ARCS.length));

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host || !runningRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = host.getBoundingClientRect();
    const cx = width / 2;
    const cy = height / 2;
    const R = Math.min(width, height) * 0.44;

    // Rotation
    rotRef.current.y += 0.003;
    const targetPX = (pointerRef.current.x - cx) / cx * 0.26;
    const targetPY = (pointerRef.current.y - cy) / cy * 0.18;
    rotRef.current.px += (targetPX - rotRef.current.px) * 0.05;
    rotRef.current.py += (targetPY - rotRef.current.py) * 0.05;
    const ry = rotRef.current.y;
    const rx = rotRef.current.py;
    const rz = rotRef.current.px;

    ctx.clearRect(0, 0, width, height);

    // 3D → 2D projection with rotation
    const project = (lat: number, lon: number): { x: number; y: number; z: number } => {
      const cosLat = Math.cos(lat), sinLat = Math.sin(lat);
      const cosLon = Math.cos(lon + ry), sinLon = Math.sin(lon + ry);
      // Sphere coords
      let px = cosLat * cosLon;
      let py = cosLat * sinLon;
      let pz = sinLat;
      // Rotate around X (pitch)
      const cosRx = Math.cos(rx), sinRx = Math.sin(rx);
      const py2 = py * cosRx - pz * sinRx;
      const pz2 = py * sinRx + pz * cosRx;
      py = py2; pz = pz2;
      // Rotate around Z (yaw tilt)
      const cosRz = Math.cos(rz), sinRz = Math.sin(rz);
      const px2 = px * cosRz - py * sinRz;
      const py3 = px * sinRz + py * cosRz;
      px = px2;
      return { x: cx + px * R, y: cy - pz2 * R, z: py3 };
    };

    // Atmospheric glow
    const glow = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.35);
    glow.addColorStop(0, 'rgba(127,243,208,0.07)');
    glow.addColorStop(0.5, 'rgba(127,243,208,0.03)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // Grid lines (latitude circles every 30°)
    for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
      const lat = (latDeg * Math.PI) / 180;
      ctx.beginPath();
      let first = true;
      for (let lonDeg = 0; lonDeg <= 360; lonDeg += 4) {
        const lon = (lonDeg * Math.PI) / 180;
        const { x, y, z } = project(lat, lon);
        if (z < 0) { first = true; continue; }
        if (first) { ctx.moveTo(x, y); first = false; }
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(127,243,208,0.07)';
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    // Dot matrix sphere
    for (const pt of DOT_POINTS) {
      const { x, y, z } = project(pt.lat, pt.lon);
      if (z < -0.1) continue; // back-face cull
      const depth = (z + 1) / 2; // 0=far, 1=near
      const size = 0.7 + depth * 1.0;
      const alpha = 0.15 + depth * 0.65;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(127,243,208,${alpha})`;
      ctx.fill();
    }

    // Rim lighting
    const rim = ctx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R * 1.05);
    rim.addColorStop(0, 'transparent');
    rim.addColorStop(0.8, 'rgba(127,243,208,0.04)');
    rim.addColorStop(1, 'rgba(127,243,208,0.12)');
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
    ctx.fill();

    // Connection arcs
    for (let ai = 0; ai < ARCS.length; ai++) {
      const arc = ARCS[ai];
      const p1 = project(arc[0], arc[1]);
      const p2 = project(arc[2], arc[3]);
      // Only draw if at least one endpoint faces front
      if (p1.z < -0.3 && p2.z < -0.3) continue;

      // Draw great-circle arc as polyline
      ctx.beginPath();
      let first = true;
      for (let step = 0; step <= 40; step++) {
        const f = step / 40;
        // SLERP between two 3D points
        const lat = arc[0] + (arc[2] - arc[0]) * f;
        const lon = arc[1] + (arc[3] - arc[1]) * f;
        const { x, y, z } = project(lat, lon);
        if (z < 0) { first = true; continue; }
        if (first) { ctx.moveTo(x, y); first = false; }
        else ctx.lineTo(x, y);
      }
      const arcAlpha = Math.max(0, (p1.z + p2.z) / 2);
      ctx.strokeStyle = ai % 2 === 0
        ? `rgba(127,243,208,${arcAlpha * 0.4})`
        : `rgba(255,184,107,${arcAlpha * 0.35})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Traveling pulse dot
      arcPhases.current[ai] = (arcPhases.current[ai] + 0.004) % 1;
      const f = arcPhases.current[ai];
      const pLat = arc[0] + (arc[2] - arc[0]) * f;
      const pLon = arc[1] + (arc[3] - arc[1]) * f;
      const pd = project(pLat, pLon);
      if (pd.z > 0) {
        const pa = Math.sin(f * Math.PI) * arcAlpha;
        ctx.beginPath();
        ctx.arc(pd.x, pd.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = ai % 2 === 0
          ? `rgba(127,243,208,${pa})`
          : `rgba(255,184,107,${pa})`;
        ctx.fill();
        // Halo
        ctx.beginPath();
        ctx.arc(pd.x, pd.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = ai % 2 === 0
          ? `rgba(127,243,208,${pa * 0.3})`
          : `rgba(255,184,107,${pa * 0.3})`;
        ctx.fill();
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = host.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointer = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const io = new IntersectionObserver(([entry]) => {
      runningRef.current = entry.isIntersecting;
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(draw);
      }
    }, { rootMargin: '5% 0px' });

    resize();
    io.observe(host);
    canvas.addEventListener('mousemove', onPointer);
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      canvas.removeEventListener('mousemove', onPointer);
      window.removeEventListener('resize', resize);
    };
  }, [draw]);

  // Counter animation driven by intersection
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (now: number) => {
      const p = clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCountProgress(eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  return (
    <section className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.26em] text-dim">
          Act VI · The Network
        </p>
        <h2 className="mb-4 max-w-[18ch] text-3xl font-semibold tracking-tight text-ink md:text-5xl">
          Where we are
        </h2>
        <p className="mb-16 max-w-xl text-muted">
          Reach you can see — arcs between regions, counters that tick as the globe comes into view.
        </p>

        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* 3D Globe Canvas */}
          <div
            ref={hostRef}
            className="relative mx-auto aspect-square w-full max-w-sm"
          >
            <canvas
              ref={canvasRef}
              className="h-full w-full"
              aria-label="Interactive globe showing Orbitvale's global presence"
            />
          </div>

          {/* Animated counters */}
          <div className="space-y-8">
            {COUNTERS.map((c) => {
              const shown = c.value * countProgress;
              const display =
                c.suffix === '%'
                  ? shown.toFixed(1)
                  : String(Math.round(shown)).padStart(2, '0');
              return (
                <div key={c.label} className="border-b border-line pb-6">
                  <div className="font-mono text-4xl tracking-tight text-ink md:text-5xl tabular-nums">
                    {display}
                    {c.suffix ?? ''}
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                    {c.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
