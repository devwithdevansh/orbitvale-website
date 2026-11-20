/**
 * The orbit ring — the single most reusable element in the Orbitvale system.
 *
 * Pulled from the logo: a hairline ellipse tilted -13°, with a single accent
 * satellite dot. Used as the preloader ring, the scroll-progress ring, the
 * hero scene, and the section divider. Same shape, same tilt, everywhere.
 */
export function OrbitRing({
  progress = 1,
  size = 200,
  stroke = 1.5,
  className = '',
  showDot = true,
  glow = false,
}: {
  progress?: number;
  size?: number;
  stroke?: number;
  className?: string;
  showDot?: boolean;
  glow?: boolean;
}) {
  const r = size / 2 - stroke;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ transform: 'rotate(-13deg)' }}
      aria-hidden="true"
    >
      <defs>
        {glow && (
          <filter id="ov-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
        <linearGradient id="ov-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7ff3d0" />
          <stop offset="100%" stopColor="#ffb86b" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(127,243,208,0.14)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#ov-ring-grad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dash}
        filter={glow ? 'url(#ov-glow)' : undefined}
      />
      {showDot && (
        <circle
          cx={size / 2}
          cy={size / 2 - r}
          r={stroke * 1.5}
          fill="#7ff3d0"
          style={{ transformBox: 'fill-box', transformOrigin: `${size / 2}px ${size / 2}px` }}
        />
      )}
    </svg>
  );
}