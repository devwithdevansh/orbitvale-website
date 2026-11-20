'use client';

import { cn } from '@/lib/utils';

interface OrbitRingProps {
  className?: string;
  /** 0→1 fill progress along the ellipse */
  progress?: number;
  showSatellite?: boolean;
  strokeWidth?: number;
}

/**
 * Logo-derived orbit ellipse at −13°. Used for preloader, scroll chrome, and accents.
 */
export function OrbitRing({
  className,
  progress = 1,
  showSatellite = true,
  strokeWidth = 2,
}: OrbitRingProps) {
  const pathLength = 100;
  const dash = pathLength * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn('overflow-visible', className)}
      aria-hidden="true"
    >
      <ellipse
        cx="100"
        cy="100"
        rx="86"
        ry="28"
        transform="rotate(-13 100 100)"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity={0.18}
      />
      <ellipse
        cx="100"
        cy="100"
        rx="86"
        ry="28"
        transform="rotate(-13 100 100)"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={pathLength}
        strokeDasharray={pathLength}
        strokeDashoffset={dash}
      />
      {showSatellite && (
        <circle
          cx="178"
          cy="72"
          r="3.5"
          fill="currentColor"
          style={{
            opacity: progress > 0.92 ? 1 : 0.35 + progress * 0.65,
          }}
        />
      )}
    </svg>
  );
}
