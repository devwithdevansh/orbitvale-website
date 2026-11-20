import type { Metadata } from 'next';
import { ContactFormCard } from '@/components/ContactFormCard';

export const metadata: Metadata = {
  title: 'Contact — Orbitvale',
  description:
    "Start a project with Orbitvale. Tell us what you're building and we'll map the orbit together.",
};

const CHANNELS = [
  {
    label: 'Email',
    value: 'hello@orbitvale.com',
    href: 'mailto:hello@orbitvale.com',
    glyph: '✉',
  },
  {
    label: 'Response time',
    value: '< 24 hours',
    href: null,
    glyph: '◎',
  },
  {
    label: 'Location',
    value: 'Remote — Global',
    href: null,
    glyph: '⊙',
  },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 700,
          height: 700,
          background:
            'radial-gradient(circle, rgba(127,243,208,0.055) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-40 pt-32">
        {/* Header */}
        <div className="mb-20 max-w-2xl">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
            Contact // 07
          </p>
          <h1
            className="mb-6 text-5xl font-semibold leading-[1.08] tracking-tight text-ink md:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Start a
            <br />
            <span className="text-accent">project</span>
          </h1>
          <p className="text-lg leading-relaxed text-muted md:text-xl">
            Tell us what you&apos;re building.{' '}
            <span className="text-ink/70">We&apos;ll map the orbit together.</span>
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_380px]">
          {/* ── Form card ─────────────────────────────────────── */}
          <ContactFormCard>

            <form className="space-y-8" action="mailto:hello@orbitvale.com" method="get">
              {/* Row: Name + Email */}
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                    Your name
                  </span>
                  <input
                    name="name"
                    required
                    placeholder="Alex Rivera"
                    className="w-full rounded-xl border border-line bg-panel-2 px-4 py-3.5 text-sm text-ink placeholder:text-dim/60 outline-none transition-all focus:border-accent/60 focus:ring-1 focus:ring-accent/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                    Email address
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="alex@company.com"
                    className="w-full rounded-xl border border-line bg-panel-2 px-4 py-3.5 text-sm text-ink placeholder:text-dim/60 outline-none transition-all focus:border-accent/60 focus:ring-1 focus:ring-accent/20"
                  />
                </label>
              </div>

              {/* Company + Budget */}
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                    Company (optional)
                  </span>
                  <input
                    name="company"
                    placeholder="Acme Corp"
                    className="w-full rounded-xl border border-line bg-panel-2 px-4 py-3.5 text-sm text-ink placeholder:text-dim/60 outline-none transition-all focus:border-accent/60 focus:ring-1 focus:ring-accent/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                    Budget range
                  </span>
                  <select
                    name="budget"
                    className="w-full cursor-pointer appearance-none rounded-xl border border-line bg-panel-2 px-4 py-3.5 text-sm text-ink outline-none transition-all focus:border-accent/60 focus:ring-1 focus:ring-accent/20"
                    style={{ color: 'var(--ink)' }}
                  >
                    <option value="" style={{ background: '#0f1013' }}>Select range…</option>
                    <option value="lt10k" style={{ background: '#0f1013' }}>Under $10k</option>
                    <option value="10-25k" style={{ background: '#0f1013' }}>$10k – $25k</option>
                    <option value="25-50k" style={{ background: '#0f1013' }}>$25k – $50k</option>
                    <option value="50k+" style={{ background: '#0f1013' }}>$50k+</option>
                    <option value="discuss" style={{ background: '#0f1013' }}>Let&apos;s discuss</option>
                  </select>
                </label>
              </div>

              {/* Project type pills */}
              <div>
                <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                  Project type
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Web App', 'Mobile', 'AI / ML', 'Platform', 'Design System', 'Consultation'].map(
                    (t) => (
                      <label key={t} className="group cursor-pointer select-none">
                        <input type="checkbox" name="type" value={t} className="sr-only peer" />
                        <span className="inline-flex items-center rounded-full border border-line bg-panel-2 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-all peer-checked:border-accent/50 peer-checked:bg-accent/10 peer-checked:text-accent hover:border-line-2 hover:text-ink">
                          {t}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Message */}
              <label className="block">
                <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                  Tell us about your project
                </span>
                <textarea
                  name="body"
                  rows={5}
                  required
                  placeholder="Describe what you're building, what problem you're solving, and your timeline…"
                  className="w-full resize-y rounded-xl border border-line bg-panel-2 px-4 py-3.5 text-sm leading-relaxed text-ink placeholder:text-dim/60 outline-none transition-all focus:border-accent/60 focus:ring-1 focus:ring-accent/20"
                />
              </label>

              {/* CTA */}
              <div className="flex items-center gap-6">
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 rounded-full border border-accent/50 bg-accent/10 px-8 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-accent transition-all hover:bg-accent hover:text-bg"
                >
                  <span>Launch message</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                  Opens your mail client
                </p>
              </div>
            </form>
          </ContactFormCard>

          {/* ── Side panel ───────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Orbital ring decoration */}
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
                  stroke="rgba(127,243,208,0.22)"
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
                  stroke="rgba(127,243,208,0.4)"
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
              className="rounded-2xl border border-line/60 p-6"
              style={{ background: 'var(--panel)' }}
            >
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                Direct channels
              </p>
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
                          className="text-sm text-ink transition-colors hover:text-accent"
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
              className="rounded-2xl border border-line/40 p-6"
              style={{ background: 'var(--panel)' }}
            >
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                Our process
              </p>
              <ol className="space-y-3">
                {[
                  'Discovery call — 30 min',
                  'Proposal & scope — 48 h',
                  'Sprint kickoff — Week 1',
                  'Continuous delivery',
                ].map((step, i) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tabular-nums text-accent/70">
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
