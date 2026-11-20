'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { OrbitvaleSvgLogo } from './OrbitvaleSvgLogo';

export interface OrbitvaleLogoProps {
  className?: string;
  /**
   * 'full'  — real PNG wordmark + ring (best quality, use in Nav / hero)
   * 'ring'  — SVG ring animation only (use in Preloader, ScrollProgress, favicon)
   */
  variant?: 'full' | 'ring';
  /** 0→1 ring draw progress (only used in 'ring' variant) */
  ringProgress?: number;
  priority?: boolean;
}

/**
 * Primary Orbitvale brand component.
 *
 * Uses the authentic logo PNG (white-on-black) with mix-blend-screen so it
 * composites cleanly over any dark background without cropping.
 *
 * The PNG at /brand/orbitvale.png (or fallback orbitvale-logo.jpg) is the
 * source of truth for the wordmark — no hand-coded SVG paths.
 */
export function OrbitvaleLogo({
  className,
  variant = 'full',
  ringProgress = 1,
  priority = false,
}: OrbitvaleLogoProps) {
  if (variant === 'ring') {
    return (
      <OrbitvaleSvgLogo
        className={cn('block', className)}
        ringProgress={ringProgress}
      />
    );
  }

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <Image
        src="/brand/orbitvale.png"
        alt="Orbitvale"
        width={240}
        height={80}
        priority={priority}
        className="h-auto w-full object-contain mix-blend-screen brightness-110"
        style={{ imageRendering: 'crisp-edges' }}
        onError={(e) => {
          // Graceful fallback to JPG if PNG not yet placed
          const img = e.currentTarget as HTMLImageElement;
          if (!img.src.includes('orbitvale-logo.jpg')) {
            img.src = '/brand/orbitvale-logo.jpg';
          }
        }}
      />
    </div>
  );
}
