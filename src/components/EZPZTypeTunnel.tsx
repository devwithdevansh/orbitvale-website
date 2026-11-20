'use client';

import { useEffect, useRef, type CSSProperties } from "react";

export interface EZPZTypeTunnelProps {
  text?: string;
  rows?: number;
  opening?: number;
  depth?: number;
  background?: string;
  ink?: string;
  fontFamily?: string;
  resolution?: number;
  className?: string;
  style?: CSSProperties;
  label?: string;
  decorative?: boolean;
}

export default function EZPZTypeTunnel({
  text = "ORBITVALE",
  rows = 10,
  opening = 0.22,
  depth = 1,
  background = "#08090b",
  ink = "#7ff3d0",
  fontFamily = '"ui-monospace", "SFMono-Regular", Menlo, Consolas, monospace',
  resolution = 1200,
  className,
  style,
  label,
  decorative = false,
}: EZPZTypeTunnelProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let cancelled = false;

    const finite = (n: number, f: number) => (Number.isFinite(n) ? n : f);

    async function render() {
      canvas!.dataset.renderState = "loading";
      try {
        await document.fonts.load(`900 120px ${fontFamily}`, text || " ");
      } catch {
        /* Fallback */
      }
      if (cancelled) return;

      const size = Math.round(Math.max(400, Math.min(1800, finite(resolution, 1200))));
      canvas!.width = size;
      canvas!.height = size;
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, size, size);

      const mask = document.createElement("canvas");
      mask.width = 1100;
      mask.height = 180;
      const m = mask.getContext("2d")!;
      m.font = `900 180px ${fontFamily}`;
      const metrics = m.measureText(text);
      const mw = Math.max(1, metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight);
      const mh = Math.max(1, metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);

      m.fillStyle = ink;
      m.scale(1080 / mw, 160 / mh);
      m.fillText(
        text,
        metrics.actualBoundingBoxLeft + (10 * mw) / 1080,
        metrics.actualBoundingBoxAscent + (10 * mh) / 160
      );

      const count = Math.round(Math.max(3, Math.min(18, finite(rows, 10))));
      const inner = Math.max(0.12, Math.min(0.55, finite(opening, 0.22)));
      const curve = Math.max(0.5, Math.min(2, finite(depth, 1)));
      const outer = size * 0.445;
      const radius = (v: number) => outer / (1 + (1 / inner - 1) * Math.pow(v, curve));

      for (let side = 0; side < 4; side++) {
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((side * Math.PI) / 2);

        for (let row = 0; row < count; row++) {
          ctx.globalAlpha = 1 - 0.64 * Math.pow(row / (count - 1), 0.8);

          for (let sy = 0; sy < 180; sy++) {
            const v0 = (row + 0.1 + (0.73 * sy) / 180) / count;
            const v1 = (row + 0.1 + (0.73 * (sy + 1)) / 180) / count;
            const r0 = radius(v0);
            const r1 = radius(v1);
            const r = radius((v0 + v1) / 2);
            ctx.drawImage(
              mask,
              0,
              sy,
              1100,
              1,
              -r * 0.965,
              -r0,
              r * 1.93,
              Math.max(0.3, r0 - r1 + 0.16)
            );
          }
        }
        ctx.restore();
      }
      canvas!.dataset.renderState = "ready";
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [text, rows, opening, depth, background, ink, fontFamily, resolution]);

  return (
    <canvas
      ref={ref}
      width={1200}
      height={1200}
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label ?? `${text} typography tunnel`}
      aria-hidden={decorative || undefined}
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        aspectRatio: "1",
        background,
        ...style,
      }}
    >
      {decorative ? null : label ?? `${text} typography tunnel`}
    </canvas>
  );
}