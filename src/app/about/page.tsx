import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Orbitvale',
  description: 'Bold tech, editorial restraint. Orbitvale builds digital systems that move with your business.',
};

const TIMELINE = [
  { year: '2020', label: 'First orbit', copy: 'Founded with one belief: software should feel as precise as it looks. First client shipped in 90 days.' },
  { year: '2021', label: 'Signal amplified', copy: 'Grew to a core team of eight across three time zones. Launched our first WebGL product experience.' },
  { year: '2022', label: 'Constellation expands', copy: 'Added interactive 3D and design systems to the service orbit. Shipped 24 products across fintech, logistics, and media.' },
  { year: '2023', label: 'Deep tech moment', copy: 'First AI-augmented engineering project. Built OrbitDB — our internal distributed data layer, now open source.' },
  { year: '2024', label: 'The network', copy: 'Clients across 14 regions. 86 projects delivered. 99.9% uptime across all infrastructure we own and operate.' },
  { year: '2025', label: 'The arrival', copy: 'Orbitvale 2.0: a new chapter combining engineering depth with award-level visual craft. This site is the proof.' },
];

const PRINCIPLES = [
  {
    glyph: '◯',
    title: 'One object',
    copy: 'Every project starts with a single gravitational centre — the business goal. Everything orbits that. Scope creep is just poor orbital mechanics.',
  },
  {
    glyph: '—',
    title: 'Restraint earns trust',
    copy: 'Animation and motion must earn their frame. If removing it makes the product clearer, it goes. Silence is craft.',
  },
  {
    glyph: '⟳',
    title: 'Continuous motion',
    copy: 'Software is never done — it orbits. We build for iteration: clean APIs, documented systems, teams we can hand the keys to.',
  },
  {
    glyph: 'Λ',
    title: 'Velocity with direction',
    copy: 'Speed is pointless without vector. We move fast when the direction is locked, and we slow down to lock the direction when it isn\'t.',
  },
];

export default function AboutPage() {
  return (
    <div className="px-6 pb-32 pt-28">
      <div className="mx-auto max-w-4xl">

        {/* Hero */}
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.26em] text-accent">About</p>
        <h1 className="mb-10 max-w-[18ch] text-4xl font-semibold leading-[1.0] tracking-tight text-ink md:text-6xl">
          Bold tech.{' '}
          <span className="text-ink/40">Editorial restraint.</span>
        </h1>
        <p className="mb-20 max-w-2xl text-lg leading-relaxed text-muted">
          Orbitvale is an IT company that treats digital products like places you can inhabit —
          one continuous camera, one object, every chapter a stop on the orbit. We blend
          Lusion-grade immersion with Halden-style silence: loud when it earns the frame,
          quiet when the copy should breathe.
        </p>

        {/* Divider */}
        <div className="mb-20 h-px w-full bg-line" />

        {/* Principles */}
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.26em] text-dim">How we work</p>
        <div className="mb-24 grid gap-6 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-line bg-panel p-7 transition-colors duration-300 hover:border-accent/30"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-line-2 bg-panel-2 font-mono text-base font-bold text-accent">
                {p.glyph}
              </div>
              <h3 className="mb-2 text-base font-semibold text-ink">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{p.copy}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-20 h-px w-full bg-line" />

        {/* Timeline */}
        <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.26em] text-dim">The orbit so far</p>
        <div className="relative">
          {/* Spine line */}
          <div className="absolute bottom-0 left-[19px] top-3 w-px bg-gradient-to-b from-accent to-transparent" />

          <div className="space-y-10">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className="relative pl-14">
                {/* Node */}
                <div
                  className="absolute left-[11px] top-1 h-[17px] w-[17px] rounded-full border"
                  style={{
                    background: i === TIMELINE.length - 1 ? '#7ff3d0' : '#08090b',
                    borderColor: '#7ff3d0',
                    boxShadow: '0 0 18px rgba(127,243,208,0.3)',
                  }}
                />
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  {item.year} · {item.label}
                </div>
                <p className="max-w-xl text-sm leading-relaxed text-muted">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-20 mt-24 h-px w-full bg-line" />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { n: '86', label: 'Projects shipped' },
            { n: '14', label: 'Regions active' },
            { n: '99.9%', label: 'Uptime, always' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-mono text-3xl tracking-tight text-ink md:text-4xl">{s.n}</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
