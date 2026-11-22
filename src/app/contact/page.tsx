import type { Metadata } from 'next';
import { ContactFormCard } from '@/components/ContactFormCard';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — Orbitvale',
  description:
    "Start a project with Orbitvale. Tell us what you're building and we'll map the orbit together.",
};

const CHANNELS = [
  {
    label: 'Direct Email',
    value: 'hello@orbitvale.com',
    href: 'mailto:hello@orbitvale.com',
    glyph: '✉',
  },
  {
    label: 'Response SLA',
    value: '< 24 hours guaranteed',
    href: null,
    glyph: '◎',
  },
  {
    label: 'Studio Timezones',
    value: 'Oslo · London · San Francisco',
    href: null,
    glyph: '⊙',
  },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07080a] text-[#f2f4f7]">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 800,
          height: 800,
          background:
            'radial-gradient(circle, rgba(127,243,208,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-32 pt-28 sm:pt-32">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            Connect // 05
          </p>
          <h1
            className="mb-6 text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.06] tracking-tight text-ink"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Start a<br />
            <span className="text-accent">project.</span>
          </h1>
          <p className="text-lg leading-relaxed text-muted md:text-xl">
            Tell us what you&apos;re building.{' '}
            <span className="text-ink/80">We&apos;ll map the orbit together.</span>
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_380px]">
          {/* ── Form Card with Lunar Physics ─────────────────── */}
          <ContactFormCard>
            <ContactForm />
          </ContactFormCard>

          {/* ── Side panel ───────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Orbital ring graphic */}
            <div className="relative mx-auto flex h-48 w-48 items-center justify-center lg:mx-0">
              <svg
                viewBox="-80 -80 160 160"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <ellipse
                  cx="0"
                  cy="0"
                  rx="72"
                  ry="26"
                  fill="none"
                  stroke="rgba(127,243,208,0.25)"
                  strokeWidth="1.5"
                  transform="rotate(-13)"
                />
                <ellipse
                  cx="0"
                  cy="0"
                  rx="56"
                  ry="20"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  transform="rotate(-13)"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="10"
                  fill="#0f1013"
                  stroke="rgba(127,243,208,0.5)"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#7ff3d0"
                  fontFamily="monospace"
                  fontSize="8"
                  letterSpacing="1"
                >
                  OV
                </text>
                <circle
                  cx="68"
                  cy="-16"
                  r="4"
                  fill="#7ff3d0"
                  opacity="0.9"
                  transform="rotate(-13)"
                />
                <circle
                  cx="-62"
                  cy="20"
                  r="2.5"
                  fill="#ffb86b"
                  opacity="0.7"
                  transform="rotate(-13)"
                />
              </svg>
            </div>

            {/* Contact channels */}
            <div
              className="rounded-2xl border border-line/60 p-6 bg-panel"
            >
              <h2 className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                Direct channels
              </h2>
              <div className="space-y-5">
                {CHANNELS.map((c) => (
                  <div key={c.label} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line text-sm text-accent">
                      {c.glyph}
                    </span>
                    <div>
                      <p className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                        {c.label}
                      </p>
                      {c.href ? (
                        <a
                          href={c.href}
                          className="text-sm font-medium text-ink transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent rounded"
                        >
                          {c.value}
                        </a>
                      ) : (
                        <p className="text-sm text-ink">{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process note */}
            <div
              className="rounded-2xl border border-line/40 p-6 bg-panel"
            >
              <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                Our onboarding orbit
              </h2>
              <ol className="space-y-3">
                {[
                  'Discovery session — 30 min alignment',
                  'Technical brief & proposal — 48 h',
                  'Sprint kickoff — Week 1',
                  'Continuous delivery & direct Slack sync',
                ].map((step, i) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tabular-nums text-accent/80">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-muted">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
