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
    concept: true,
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
    concept: true,
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
    tags: ['Distributed', 'Rust', 'Wasm', 'P2P'],
    index: '03',
    concept: true,
    challenge:
      'Edge applications needed offline-first data synchronization with conflict-free resolution across unreliable satellite and mobile networks.',
    approach:
      'We engineered an append-only distributed log backed by CRDTs, compiled to WebAssembly for edge runtimes, with zero-copy deserialization in Rust.',
    outcome:
      'Sub-millisecond local reads, verifiable cryptographic audit chains, and automated multi-master synchronization across thousands of active nodes.',
    metrics: [
      { label: 'Read Latency', value: '< 1ms', unit: 'in-memory local' },
      { label: 'Sync Convergence', value: '100%', unit: 'CRDT state sync' },
      { label: 'Binary Footprint', value: '180KB', unit: 'optimized wasm' },
    ],
    stack: ['Rust', 'WebAssembly', 'CRDTs', 'libp2p', 'TypeScript SDK', 'Tokio'],
    next: 'lumen',
  },
  {
    slug: 'lumen',
    title: 'Lumen',
    subtitle: 'Real-time Analytics Dashboard',
    cover: '/covers/lumen.svg',
    accent: '#a3e635',
    year: '2024',
    tags: ['Analytics', 'WebSocket', 'D3', 'Canvas'],
    index: '04',
    concept: true,
    challenge:
      'Financial operations teams were overwhelmed by delayed tabular feeds and required real-time sub-second visual anomaly detection for millions of transactions.',
    approach:
      'Constructed a bespoke WebGL-accelerated timeline engine with reactive WebSocket streams and GPU-buffered line graphs that handle 100,000 data points at 60fps.',
    outcome:
      'Zero-lag visual telemetry, 400ms average query latency, and instantaneous anomaly alerting before downstream pipeline saturation.',
    metrics: [
      { label: 'Framerate', value: '60fps', unit: '100k data points' },
      { label: 'Query Response', value: '400ms', unit: 'telemetry search' },
      { label: 'Incident Time', value: '-65%', unit: 'MTTD decrease' },
    ],
    stack: ['TypeScript', 'WebGL', 'D3.js', 'WebSockets', 'ClickHouse', 'Go'],
    next: 'astra',
  },
  {
    slug: 'astra',
    title: 'Astra',
    subtitle: 'AI-powered Analytics Engine',
    cover: '/covers/astra.svg',
    accent: '#e879f9',
    year: '2025',
    tags: ['AI/ML', 'Python', 'Vector DB', 'FastAPI'],
    index: '05',
    concept: true,
    challenge:
      'Enterprise customers wanted natural language querying over unstructured PDF reports and internal knowledge bases with strict zero-hallucination guardrails.',
    approach:
      'Designed a hybrid sparse-dense retrieval architecture (RAG) with reciprocal rank fusion, local vector embeddings, and deterministic citation verification.',
    outcome:
      '89% top-1 prediction precision, complete compliance auditability with grounded source links, and 3x faster knowledge lookup for research teams.',
    metrics: [
      { label: 'Accuracy', value: '89%', unit: 'top-1 precision' },
      { label: 'Retrieval', value: '120ms', unit: 'hybrid search' },
      { label: 'Adoption', value: '4.2×', unit: 'daily active queries' },
    ],
    stack: ['Python', 'FastAPI', 'Qdrant', 'OpenAI', 'LangChain', 'Next.js'],
    next: 'nova',
  },
  {
    slug: 'nova',
    title: 'Nova',
    subtitle: 'Blockchain Infrastructure',
    cover: '/covers/nova.svg',
    accent: '#f59e0b',
    year: '2025',
    tags: ['Web3', 'Solidity', 'Rust', 'EVM'],
    index: '06',
    concept: true,
    challenge:
      'A cross-chain liquidity bridge required provable validator consensus and low gas overhead without sacrificing smart contract composability.',
    approach:
      'Implemented optimistic verification protocols with zero-knowledge fraud proofs, modular relayer networks in Rust, and gas-optimized EVM bytecode.',
    outcome:
      '2.1s average block finality, 80% gas reduction compared to previous generation bridges, and zero vulnerability exploits during rigorous audit cycles.',
    metrics: [
      { label: 'Finality', value: '2.1s', unit: 'average cross-chain' },
      { label: 'Gas Cost', value: '-80%', unit: 'per transfer' },
      { label: 'Audits', value: '3/3', unit: 'clean security audits' },
    ],
    stack: ['Rust', 'Solidity', 'Foundry', 'EVM', 'Circom', 'Subgraphs'],
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
    title: `${project.title} — Case Study — Orbitvale`,
    description: project.challenge,
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const nextProject = PROJECTS.find((p) => p.slug === project.next)!;

  return (
    <article className="relative min-h-screen overflow-hidden bg-bg text-ink">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative h-[72svh] min-h-[520px] w-full overflow-hidden md:h-[82svh]">
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
            background: `linear-gradient(to bottom, rgba(8,9,11,0.3) 0%, rgba(8,9,11,0.0) 25%, rgba(8,9,11,0.85) 75%, rgba(8,9,11,1) 100%)`,
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
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted hover:text-accent transition-colors focus-visible:ring-1 focus-visible:ring-accent rounded"
            >
              ← All Case Studies
            </Link>
            <span className="text-dim">/</span>
            <span
              className="font-mono text-[11px] uppercase tracking-[0.28em]"
              style={{ color: project.accent }}
            >
              {project.index} · {project.year}
            </span>
            <span className="rounded-full border border-line/60 bg-white/5 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
              Concept Exploration
            </span>
          </div>

          <h1 className="mb-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl xl:text-7xl">
            {project.title}
          </h1>
          <p className="text-xl text-muted md:text-2xl">{project.subtitle}</p>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 pb-36 pt-16 md:px-14 lg:px-8">

        {/* Metrics strip */}
        <div
          className="mb-20 grid grid-cols-1 gap-px sm:grid-cols-3 rounded-xl overflow-hidden border border-line"
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

          {/* Left sticky nav col */}
          <div>
            <div className="sticky top-28">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.26em] text-dim">
                Contents
              </p>
              <nav className="flex flex-col gap-3" aria-label="Case Study Sections">
                {['Challenge', 'Approach', 'Outcome', 'Stack'].map((s) => (
                  <a
                    key={s}
                    href={`#${s.toLowerCase()}`}
                    className="font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent rounded p-0.5"
                  >
                    {s}
                  </a>
                ))}
              </nav>

              <div id="stack" className="mt-14 scroll-mt-28">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.26em] text-dim">
                  Technology Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted bg-panel"
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
            <section id="challenge" className="scroll-mt-28">
              <p
                className="mb-4 font-mono text-[11px] uppercase tracking-[0.26em]"
                style={{ color: project.accent }}
              >
                01 · The Challenge
              </p>
              <p className="text-xl leading-[1.65] text-ink/90 md:text-2xl">
                {project.challenge}
              </p>
            </section>

            {/* Full-width cover repeat */}
            <div
              className="relative h-64 w-full overflow-hidden rounded-2xl border border-line md:h-80"
            >
              <Image
                src={project.cover}
                alt={`${project.title} detail visualization`}
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

            <section id="approach" className="scroll-mt-28">
              <p
                className="mb-4 font-mono text-[11px] uppercase tracking-[0.26em]"
                style={{ color: project.accent }}
              >
                02 · Our Approach
              </p>
              <p className="text-lg leading-[1.75] text-muted md:text-xl">
                {project.approach}
              </p>
            </section>

            <section id="outcome" className="scroll-mt-28">
              <p
                className="mb-4 font-mono text-[11px] uppercase tracking-[0.26em]"
                style={{ color: project.accent }}
              >
                03 · Measurable Outcome
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
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.26em] text-dim">
            Next Case Study
          </p>
          <Link
            href={`/work/${nextProject.slug}`}
            className="group flex items-center justify-between gap-6 rounded-2xl border border-line bg-panel px-8 py-8 transition-colors hover:border-accent/40 hover:bg-panel-2 focus-visible:ring-2 focus-visible:ring-accent"
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
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border transition-colors group-hover:border-accent group-hover:bg-accent/10"
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
