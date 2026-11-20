import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

/* ─── Project data ──────────────────────────────────────────────────── */
const PROJECTS = [
  {
    slug: 'project-phoenix',
    title: 'Project Phoenix',
    subtitle: 'Next-gen SaaS Platform',
    cover: '/covers/project-phoenix.svg',
    accent: '#ff6230',
    year: '2025',
    tags: ['SaaS', 'React', 'Node.js', 'AWS'],
    index: '01',
    challenge:
      'A legacy monolith processing 40 M events/day needed to be reborn as a distributed SaaS platform without a single hour of downtime.',
    approach:
      'We decomposed the system into event-driven microservices behind a GraphQL gateway, migrated data with zero-downtime blue-green deployments, and rebuilt the UI in React with a component system the product team could own independently.',
    outcome:
      '12× faster cold-start, 99.98 % uptime through migration, and a team that ships features weekly instead of quarterly.',
    metrics: [
      { label: 'Performance', value: '12×', unit: 'faster cold-start' },
      { label: 'Uptime', value: '99.98%', unit: 'during migration' },
      { label: 'Deploy freq', value: '4×', unit: 'per week' },
    ],
    stack: ['React 18', 'Node.js', 'GraphQL', 'Kafka', 'PostgreSQL', 'AWS ECS', 'Terraform'],
    next: 'nebula-cms',
  },
  {
    slug: 'nebula-cms',
    title: 'Nebula CMS',
    subtitle: 'Headless Content Management',
    cover: '/covers/nebula-cms.svg',
    accent: '#c084fc',
    year: '2025',
    tags: ['CMS', 'Next.js', 'TypeScript', 'Edge'],
    index: '02',
    challenge:
      "An editorial team at a global media brand was blocked by a monolithic CMS that took 3 seconds per save and couldn't serve content on the edge.",
    approach:
      'We built a custom headless CMS with a structured block editor, real-time collaborative drafts, and a delivery API that pushes content to 300 Cloudflare edge nodes on publish. The editorial UI runs in the browser with optimistic updates — saves feel instant.',
    outcome:
      'Save latency dropped from 3 s to 80 ms. Time to first byte from the edge: 28 ms globally. The editorial team went from 2 articles/day to 11.',
    metrics: [
      { label: 'Save latency', value: '80ms', unit: 'down from 3 s' },
      { label: 'TTFB', value: '28ms', unit: 'global edge' },
      { label: 'Output', value: '5.5×', unit: 'more articles' },
    ],
    stack: ['Next.js 14', 'TypeScript', 'Cloudflare Workers', 'D1', 'Tiptap', 'Zod'],
    next: 'orbitdb',
  },
  {
    slug: 'orbitdb',
    title: 'OrbitDB',
    subtitle: 'Decentralised Database Layer',
    cover: '/covers/orbitdb.svg',
    accent: '#7ff3d0',
    year: '2024',
    tags: ['Web3', 'Distributed', 'P2P', 'TypeScript'],
    index: '03',
    challenge:
      'A DeFi protocol needed a database layer that worked without any centralised infrastructure, survived node churn, and remained consistent under network partitions.',
    approach:
      'We designed an CRDT-based distributed log with libp2p gossipsub propagation, local-first writes that merge automatically on reconnection, and an end-to-end encrypted identity layer tied to wallet signatures.',
    outcome:
      'Zero-downtime across 1 400 simultaneous node failures in chaos testing. Writes survive offline for up to 72 hours and merge without conflicts on reconnect.',
    metrics: [
      { label: 'Node failures', value: '1400', unit: 'survived in test' },
      { label: 'Offline writes', value: '72h', unit: 'merge-safe' },
      { label: 'Conflict rate', value: '0%', unit: 'in production' },
    ],
    stack: ['TypeScript', 'libp2p', 'IPFS', 'CRDTs', 'AES-GCM', 'Rust (WASM)'],
    next: 'lumen',
  },
  {
    slug: 'lumen',
    title: 'Lumen',
    subtitle: 'Real-time Analytics Dashboard',
    cover: '/covers/lumen.svg',
    accent: '#a3e635',
    year: '2024',
    tags: ['Analytics', 'WebSocket', 'D3', 'ClickHouse'],
    index: '04',
    challenge:
      'A logistics operator watching 60 000 shipments live needed a dashboard that updated every second without hammering their database.',
    approach:
      'We built a streaming pipeline from ClickHouse materialized views through a WebSocket multiplexer to a D3-powered canvas renderer. The front end renders 60 000 shipment markers at 60 fps using a spatial index — no DOM manipulation at all.',
    outcome:
      'Dashboard latency cut from 8 s to 320 ms. GPU-accelerated canvas renders 60 K markers at 60 fps on a 2018 laptop.',
    metrics: [
      { label: 'Latency', value: '320ms', unit: 'down from 8 s' },
      { label: 'Markers', value: '60K', unit: 'at 60 fps' },
      { label: 'DB load', value: '−94%', unit: 'vs previous' },
    ],
    stack: ['React', 'D3', 'Canvas 2D', 'WebSocket', 'ClickHouse', 'Go', 'Redis'],
    next: 'astra',
  },
  {
    slug: 'astra',
    title: 'Astra',
    subtitle: 'AI-Powered Analytics',
    cover: '/covers/astra.svg',
    accent: '#e879f9',
    year: '2025',
    tags: ['AI', 'LLM', 'Python', 'RAG'],
    index: '05',
    challenge:
      'A B2B SaaS company wanted their users to ask questions in plain English and get answers from their own data — without exposing raw data to any third-party model.',
    approach:
      'We built a RAG pipeline that embeds the customer\'s data locally, routes natural-language questions through a fine-tuned intent classifier, retrieves semantically relevant chunks, and generates SQL that runs inside the customer\'s own VPC. No data leaves their network.',
    outcome:
      '86 % of analyst ad-hoc queries answered without engineering involvement. Time-to-insight from days to seconds.',
    metrics: [
      { label: 'Queries self-served', value: '86%', unit: 'without engineering' },
      { label: 'Insight time', value: '−98%', unit: 'days → seconds' },
      { label: 'Data residency', value: '100%', unit: 'in-VPC' },
    ],
    stack: ['Python', 'FastAPI', 'pgvector', 'LangChain', 'OpenAI (private)', 'dbt', 'Kubernetes'],
    next: 'nova',
  },
  {
    slug: 'nova',
    title: 'Nova',
    subtitle: 'Blockchain Infrastructure',
    cover: '/covers/nova.svg',
    accent: '#f59e0b',
    year: '2024',
    tags: ['Blockchain', 'Solidity', 'EVM', 'Security'],
    index: '06',
    challenge:
      'A tokenisation platform needed a smart-contract layer for real-world assets that could pass a Big-4 audit, handle 10 000 TPS, and remain upgradeable without breaking existing token holders.',
    approach:
      'We designed a diamond-proxy architecture (EIP-2535) with an on-chain governance module for safe upgrades, a permit-2 allowance system for gasless UX, and a formal verification suite that proved the core invariants before submission to audit.',
    outcome:
      'Passed the security audit with zero critical findings. 10 400 TPS on Polygon zkEVM testnet. \$2.4 B in assets tokenised in first 6 months.',
    metrics: [
      { label: 'Audit findings', value: '0', unit: 'critical' },
      { label: 'Throughput', value: '10.4K', unit: 'TPS on zkEVM' },
      { label: 'Assets tokenised', value: '$2.4B', unit: 'in 6 months' },
    ],
    stack: ['Solidity', 'Hardhat', 'Foundry', 'EIP-2535', 'Polygon zkEVM', 'TypeScript', 'Echidna'],
    next: 'project-phoenix',
  },
];

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  if (!project) return { title: 'Not found' };
  return {
    title: `${project.title} — Orbitvale`,
    description: project.challenge,
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const nextProject = PROJECTS.find((p) => p.slug === project.next)!;

  return (
    <article className="relative min-h-screen overflow-hidden bg-bg">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative h-[70svh] min-h-[500px] w-full overflow-hidden md:h-[80svh]">
        {/* Cover image full-bleed */}
        <Image
          src={project.cover}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        {/* Dark gradient overlay — bottom-heavy so copy is readable */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(8,9,11,0.3) 0%, rgba(8,9,11,0.0) 30%, rgba(8,9,11,0.85) 75%, rgba(8,9,11,1) 100%)`,
          }}
        />
        {/* Left accent glow matching project color */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-1/2"
          style={{
            background: `radial-gradient(ellipse at 20% 60%, ${project.accent}18 0%, transparent 65%)`,
          }}
        />

        {/* Hero copy */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-14 md:px-14 lg:px-20">
          <p
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em]"
            style={{ color: project.accent }}
          >
            {project.index} / {project.year} · {project.tags.join(' · ')}
          </p>
          <h1 className="mb-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl xl:text-7xl">
            {project.title}
          </h1>
          <p className="text-xl text-muted md:text-2xl">{project.subtitle}</p>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 pb-40 pt-20 md:px-14 lg:px-8">

        {/* Metrics strip */}
        <div
          className="mb-20 grid grid-cols-1 gap-px sm:grid-cols-3"
          style={{ background: `${project.accent}20` }}
        >
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className="flex flex-col gap-1 bg-panel px-8 py-8"
            >
              <span
                className="font-display text-4xl font-semibold tracking-tight md:text-5xl"
                style={{ color: project.accent }}
              >
                {m.value}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {m.unit}
              </span>
              <span className="mt-1 text-xs text-dim">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Editorial columns */}
        <div className="grid gap-20 md:grid-cols-[1fr_2fr]">

          {/* Left nav col */}
          <div>
            <div className="sticky top-28">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.26em] text-dim">
                Contents
              </p>
              <nav className="flex flex-col gap-3">
                {['Challenge', 'Approach', 'Outcome', 'Stack'].map((s) => (
                  <a
                    key={s}
                    href={`#${s.toLowerCase()}`}
                    className="font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
                  >
                    {s}
                  </a>
                ))}
              </nav>

              <div className="mt-14">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.26em] text-dim">
                  Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right editorial col */}
          <div className="flex flex-col gap-16">
            <section id="challenge">
              <p
                className="mb-4 font-mono text-[11px] uppercase tracking-[0.26em]"
                style={{ color: project.accent }}
              >
                01 · Challenge
              </p>
              <p className="text-xl leading-[1.65] text-ink/90 md:text-2xl">
                {project.challenge}
              </p>
            </section>

            {/* Full-width cover repeat with slight tilt */}
            <div
              className="relative h-64 w-full overflow-hidden rounded-2xl border border-line md:h-80"
              style={{ transform: 'rotate(-0.5deg)' }}
            >
              <Image
                src={project.cover}
                alt={`${project.title} detail`}
                fill
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${project.accent}12 0%, transparent 60%)`,
                }}
              />
            </div>

            <section id="approach">
              <p
                className="mb-4 font-mono text-[11px] uppercase tracking-[0.26em]"
                style={{ color: project.accent }}
              >
                02 · Approach
              </p>
              <p className="text-lg leading-[1.75] text-muted md:text-xl">
                {project.approach}
              </p>
            </section>

            <section id="outcome">
              <p
                className="mb-4 font-mono text-[11px] uppercase tracking-[0.26em]"
                style={{ color: project.accent }}
              >
                03 · Outcome
              </p>
              <p className="text-lg leading-[1.75] text-ink/80 md:text-xl">
                {project.outcome}
              </p>
            </section>
          </div>
        </div>

        {/* ── Accent divider ──────────────────────────────────────── */}
        <div
          className="my-24 h-px w-full"
          style={{ background: `linear-gradient(to right, transparent, ${project.accent}40, transparent)` }}
        />

        {/* ── Next project ───────────────────────────────────────── */}
        <div>
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.26em] text-dim">
            Next project
          </p>
          <Link
            href={`/work/${nextProject.slug}`}
            className="group flex items-center justify-between gap-6 rounded-2xl border border-line bg-panel px-8 py-8 transition-colors hover:border-accent/40 hover:bg-panel-2"
          >
            <div>
              <p
                className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
                style={{ color: nextProject.accent }}
              >
                {nextProject.index}
              </p>
              <h2 className="text-2xl font-semibold text-ink group-hover:text-accent transition-colors md:text-3xl">
                {nextProject.title}
              </h2>
              <p className="mt-1 text-muted">{nextProject.subtitle}</p>
            </div>
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border transition-colors group-hover:border-accent"
              style={{ borderColor: `${nextProject.accent}40` }}
            >
              <span className="text-muted group-hover:text-accent transition-colors">→</span>
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
}
