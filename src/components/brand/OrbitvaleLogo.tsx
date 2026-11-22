'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { OrbitvaleSvgLogo } from './OrbitvaleSvgLogo';

export interface OrbitvaleLogoProps {
  className?: string;
  /**
   * 'full'  — authentic extracted tight logo PNG with wordmark + orbit (best quality)
   * 'black' — alternative on light background
   * 'ring'  — SVG ring animation only (use in ScrollProgress, favicon, etc.)
   */
  variant?: 'full' | 'black' | 'ring';
  /** 0→1 ring draw progress (only used in 'ring' variant) */
  ringProgress?: number;
  priority?: boolean;
}

/**
 * Primary Orbitvale brand component.
 *
 * Uses the authentic tight transparent logo PNG from /brand/v2/full-logo.png
 * (1162×459, aspect ratio ~2.532).
 * True alpha channel — no mix-blend-screen hack required.
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

  const src = variant === 'black'
    ? '/brand/v2/full-logo-black.png'
    : '/brand/v2/full-logo.png';

  return (
    <div className={cn('relative inline-flex items-center aspect-[1162/459]', className)}>
      <Image
        src={src}
        alt="Orbitvale"
        width={1162}
        height={459}
        priority={priority}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export default OrbitvaleLogo;
