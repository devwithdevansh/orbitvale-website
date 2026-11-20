import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Work — Orbitvale',
  description:
    'Case studies across fintech, logistics, media, and infrastructure. Six products built for orbit.',
};

const PROJECTS = [
  {
    slug: 'project-phoenix',
    num: '01',
    title: 'Project Phoenix',
    subtitle: 'Next-gen SaaS platform',
    tags: ['Platform', 'React', 'Node.js'],
    accent: '#ff6230',
    kpi: '3× faster time-to-deploy',
  },
  {
    slug: 'nebula-cms',
    num: '02',
    title: 'Nebula CMS',
    subtitle: 'Headless content management',
    tags: ['CMS', 'API', 'Next.js'],
    accent: '#c084fc',
    kpi: '12 editorial teams onboarded',
  },
  {
    slug: 'orbitdb',
    num: '03',
    title: 'OrbitDB',
    subtitle: 'Decentralized database layer',
    tags: ['Infrastructure', 'Open Source', 'Distributed'],
    accent: '#7ff3d0',
    kpi: '99.97% query uptime',
  },
  {
    slug: 'lumen',
    num: '04',
    title: 'Lumen',
    subtitle: 'Real-time analytics dashboard',
    tags: ['Analytics', 'WebSocket', 'D3'],
    accent: '#a3e635',
    kpi: '400ms avg query response',
  },
  {
    slug: 'astra',
    num: '05',
    title: 'Astra',
    subtitle: 'AI-powered analytics engine',
    tags: ['AI/ML', 'Python', 'Vector DB'],
    accent: '#e879f9',
    kpi: '89% prediction accuracy',
  },
  {
    slug: 'nova',
    num: '06',
    title: 'Nova',
    subtitle: 'Blockchain infrastructure',
    tags: ['Web3', 'Solidity', 'Rust'],
    accent: '#f59e0b',
    kpi: '2.1s avg block finality',
  },
];

export default function WorkPage() {
  return (
    <div className="pt-28 pb-32 px-6">
      <div className="mx-auto max-w-6xl">

        {/* Hero */}
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
          Selected work
        </p>
        <h1 className="mb-6 max-w-[18ch] font-display text-4xl font-semibold leading-[1.0] tracking-tight text-ink md:text-6xl">
          Products built<br />
          <span className="text-ink/40">for orbit.</span>
        </h1>
        <p className="mb-20 max-w-xl text-lg leading-relaxed text-muted">
          Six case studies across SaaS, infrastructure, analytics, and Web3.
          Each one starts with a business centre of gravity — everything else orbits that.
        </p>

        {/* Project list — editorial numbered rows */}
        <div className="space-y-0">
          {PROJECTS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className="group flex flex-col gap-4 border-t border-line py-8 transition-colors duration-300 hover:border-accent/30 md:flex-row md:items-center md:gap-0"
            >
              {/* Number */}
              <span
                className="shrink-0 font-mono text-[11px] tracking-[0.18em] text-dim transition-colors group-hover:text-accent md:w-16"
              >
                {p.num}
              </span>

              {/* Title + subtitle */}
              <div className="flex-1 md:pl-4">
                <h2 className="text-xl font-semibold text-ink transition-colors group-hover:text-accent md:text-2xl">
                  {p.title}
                </h2>
                <p className="mt-1 font-mono text-[11px] text-muted tracking-wide">
                  {p.subtitle}
                </p>
              </div>

              {/* KPI */}
              <div className="shrink-0 font-mono text-[11px] text-muted md:w-56 md:text-right">
                {p.kpi}
              </div>

              {/* Tags */}
              <div className="hidden shrink-0 items-center gap-2 md:flex md:w-56 md:justify-end">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-dim"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Arrow indicator */}
              <span
                className="ml-0 shrink-0 font-mono text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent md:ml-8"
                aria-hidden="true"
              >
                →
              </span>

              {/* Accent glow on hover */}
              <span
                className="pointer-events-none absolute left-0 h-px w-0 opacity-0 transition-all duration-500 group-hover:w-full group-hover:opacity-100"
                style={{ background: p.accent, bottom: 0 }}
                aria-hidden="true"
              />
            </Link>
          ))}
          {/* Final border */}
          <div className="border-t border-line" />
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.26em] text-dim">
            Have a project in mind?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 rounded-full border border-accent/50 bg-accent/10 px-8 py-4 font-mono text-xs uppercase tracking-[0.22em] text-accent transition-all duration-300 hover:bg-accent hover:text-bg hover:border-accent"
          >
            Start a project
            <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
