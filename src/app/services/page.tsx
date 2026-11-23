import { ServicesOrbit } from '@/components/ServicesOrbit';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services — Orbitvale',
  description: 'Product engineering, experience design, interactive 3D, design systems, cloud & DevOps, strategy & advisory.',
};

const DETAILS = [
  {
    num: '01',
    title: 'Product Engineering',
    sub: 'Full-stack systems built to orbit your goals',
    bullets: [
      'React / Next.js front-ends with real performance budgets',
      'Node.js, Go, or Python backends — we pick what moves fastest',
      'API design, platform architecture, and third-party integrations',
      'CI/CD pipelines and test coverage from day one',
    ],
  },
  {
    num: '02',
    title: 'Experience Design',
    sub: 'Interfaces with editorial restraint',
    bullets: [
      'UX research, journey mapping, and prototype-to-production',
      'Motion design that earns every frame — nothing decorative',
      'Figma → code handoff with zero interpretation loss',
      'Accessibility built in, not bolted on',
    ],
  },
  {
    num: '03',
    title: 'Interactive 3D',
    sub: 'WebGL worlds and scroll-driven cameras',
    bullets: [
      'React Three Fiber scenes with custom GLSL shaders',
      'Scroll-driven camera journeys (Lenis + master clock)',
      'Award-ready hero sections and immersive case-study media',
      'DPR-aware performance: mobile-first GPU budgets',
    ],
  },
  {
    num: '04',
    title: 'Design Systems',
    sub: 'Tokens, components, and living documentation',
    bullets: [
      'Tailwind token systems aligned to your brand DNA',
      'Component libraries with Storybook + accessibility testing',
      'Multi-brand theming and dark/light mode from the ground up',
      'Documentation that keeps distributed teams in sync',
    ],
  },
  {
    num: '05',
    title: 'Cloud & DevOps',
    sub: 'Infrastructure that stays quiet until you need speed',
    bullets: [
      'AWS, GCP, or Vercel — right-sized for the project',
      'Kubernetes, Docker, and IaC with Terraform',
      'Zero-downtime deployments and rollback strategies',
      'Monitoring, alerting, and on-call runbooks',
    ],
  },
  {
    num: '06',
    title: 'Strategy & Advisory',
    sub: 'Roadmaps connecting tech decisions to business gravity',
    bullets: [
      'Technology audits and architectural reviews',
      'Build vs. buy decisions with long-term cost modelling',
      'Team structure and hiring roadmaps for scaling phases',
      'CTO-level advisory for pre-seed through Series B',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-32 px-6">
      <div className="mx-auto max-w-6xl">
        {/* ── Arrival Hero Screen — tighter on desktop so title reads close to header ── */}
        <section className="min-h-[44vh] sm:min-h-[50vh] lg:min-h-[44vh] flex flex-col justify-between pb-8 mb-14 select-none border-b border-line/20">
          <div className="flex items-center justify-between border-b border-line/20 pb-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
              Services // 03
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
              Six Capabilities · One Orbit
            </span>
          </div>

          <div className="mt-auto pt-8">
            <h1 className="font-display font-semibold uppercase text-ink tracking-tight leading-[0.92] text-[46px] sm:text-[68px] md:text-[92px]">
              OUR<br />
              <span className="text-accent">SERVICES</span>
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-muted font-normal">
              We don't offer services — we offer positions on the orbit. Each capability has a distinct job and distance from your centre.
            </p>
            <div className="mt-8 flex items-center gap-3 text-dim font-mono text-xs uppercase tracking-[0.22em]">
              <span className="text-accent animate-pulse">↓</span>
              <span>Scroll to explore capabilities</span>
            </div>
          </div>
        </section>

        {/* Live orbital diagram */}
        <ServicesOrbit />

        {/* Detail grid */}
        <div className="py-20">
          <p className="mb-12 font-mono text-[11px] uppercase tracking-[0.26em] text-dim">What each orbit does</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DETAILS.map((s) => (
              <div
                key={s.num}
                className="group rounded-xl border border-line bg-panel p-7 transition-all duration-300 hover:border-accent/35 hover:bg-panel-2"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-accent">{s.num}</span>
                  <div className="h-px flex-1 bg-line" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-ink">{s.title}</h3>
                <p className="mb-5 font-mono text-[11px] text-muted">{s.sub}</p>
                <ul className="space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-xs leading-relaxed text-muted">
                      <span className="mt-0.5 shrink-0 text-accent">↗</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA strip */}
      <div className="border-t border-line px-6 py-20">
        <div className="mx-auto max-w-5xl flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              Ready to begin the orbit?
            </h2>
            <p className="mt-2 text-muted">Tell us about your project — we typically respond within 24 hours.</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-accent px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bg transition hover:bg-accent/90"
          >
            Start a project
          </Link>
        </div>
      </div>
    </div>
  );
}
