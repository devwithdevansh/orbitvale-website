import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Orbitvale — Digital systems in continuous motion';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#08090b',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dot grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />

        {/* Mint radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(127,243,208,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Orbital ring SVG */}
        <svg
          width="420"
          height="420"
          viewBox="-210 -210 420 420"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
        >
          <ellipse
            cx="0"
            cy="0"
            rx="190"
            ry="68"
            fill="none"
            stroke="rgba(127,243,208,0.22)"
            strokeWidth="1.5"
            transform="rotate(-13)"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="155"
            ry="55"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            transform="rotate(-13)"
          />
          {/* Orbital dot */}
          <circle
            cx={Math.cos((30 * Math.PI) / 180) * 190}
            cy={Math.sin((30 * Math.PI) / 180) * 68}
            r="6"
            fill="#7ff3d0"
            opacity="0.9"
            transform="rotate(-13)"
          />
        </svg>

        {/* Wordmark */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: '#f4f4f6',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            ORBITVALE
          </span>
          <div
            style={{
              width: 480,
              height: 1,
              background:
                'linear-gradient(90deg, transparent, rgba(127,243,208,0.4), transparent)',
            }}
          />
          <span
            style={{
              fontSize: 22,
              color: '#8a8b93',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            Digital systems in continuous motion
          </span>
        </div>

        {/* Bottom corner label */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 48,
            fontSize: 14,
            color: 'rgba(127,243,208,0.5)',
            letterSpacing: '0.2em',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
          }}
        >
          orbitvale.com
        </div>
      </div>
    ),
    { ...size }
  );
}
