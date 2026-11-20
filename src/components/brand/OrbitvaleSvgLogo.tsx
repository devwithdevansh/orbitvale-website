'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface OrbitvaleSvgLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  /** progress 0→1: animates the ring stroke-dashoffset */
  ringProgress?: number;
  glowColor?: string;
}

/**
 * Orbitvale ring-only SVG — the aerodynamic Saturn swoosh extracted from the logo.
 * Used for: Preloader ring draw, ScrollProgress overlay, favicon animation.
 * The wordmark is NEVER hand-drawn here — always use the real PNG asset for that.
 */
export function OrbitvaleSvgLogo({
  className,
  ringProgress = 1,
  glowColor = '#7ff3d0',
  ...props
}: OrbitvaleSvgLogoProps) {
  // The swoosh is two mirrored crescent ellipses forming a tilted ring.
  // Viewbox 200×200, ring center (100,100), tilt -13deg matching logo.
  const ringPath =
    'M 38 72 C 52 36 110 18 158 28 C 186 34 198 54 188 72 C 174 96 136 108 94 106 C 58 104 26 96 38 72 Z';
  const ringPath2 =
    'M 162 128 C 148 164 90 182 42 172 C 14 166 2 146 12 128 C 26 104 64 92 106 94 C 142 96 174 104 162 128 Z';

  const perimeter = 320; // approximate stroke perimeter for dash animation
  const dash = perimeter * Math.min(1, Math.max(0, ringProgress));

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('overflow-visible', className)}
      aria-label="Orbitvale ring mark"
      {...props}
    >
      <defs>
        <linearGradient id="ov-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0.5" />
        </linearGradient>
        <filter id="ov-ring-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Upper crescent */}
      <path
        d={ringPath}
        fill="url(#ov-ring-grad)"
        filter="url(#ov-ring-glow)"
        style={{
          opacity: ringProgress,
          transition: 'opacity 0.3s',
        }}
      />

      {/* Lower crescent */}
      <path
        d={ringPath2}
        fill="url(#ov-ring-grad)"
        filter="url(#ov-ring-glow)"
        style={{
          opacity: ringProgress,
          transition: 'opacity 0.3s',
        }}
      />

      {/* Animated progress stroke (used in preloader / scroll progress) */}
      {ringProgress < 1 && (
        <ellipse
          cx="100"
          cy="100"
          rx="72"
          ry="38"
          transform="rotate(-13 100 100)"
          stroke={glowColor}
          strokeWidth="2"
          fill="none"
          strokeDasharray={`${perimeter}`}
          strokeDashoffset={`${perimeter - dash}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      )}
    </svg>
  );
}
