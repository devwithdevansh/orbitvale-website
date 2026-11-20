import Link from 'next/link';
import type { Metadata } from 'next';
import { PROJECTS } from '@/app/work/[slug]/page';

export const metadata: Metadata = {
  title: 'Work — Orbitvale',
  description: 'Selected projects from Orbitvale — platforms, products, and immersive digital experiences.',
};

export default function WorkPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 800,
          height: 500,
          background: 'radial-gradient(circle, rgba(127,243,208,0.045) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-40 pt-28 md:px-10">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
          Work · Selected Projects
        </p>
        <h1 className="mb-5 max-w-[14ch] font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl lg:text-7xl">
          The fleet
        </h1>
        <p className="mb-20 max-w-lg text-lg leading-relaxed text-muted">
          Six missions. Each one a proof that technology and craft can move together.
        </p>

        {/* Grid of project cards */}
        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group relative flex flex-col overflow-hidden bg-bg transition-colors hover:bg-panel"
            >
              {/* Cover */}
              <div className="relative h-52 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.cover}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  draggable={false}
                />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at 30% 70%, ${project.accent}22 0%, transparent 60%)`,
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p
                    className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em]"
                    style={{ color: project.accent }}
                  >
                    {project.index} · {project.year}
                  </p>
                  <h2 className="mb-1 text-xl font-semibold text-ink transition-colors group-hover:text-accent">
                    {project.title}
                  </h2>
                  <p className="text-sm text-muted">{project.subtitle}</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-dim"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-bg/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:border-accent/40">
                <span className="text-xs text-accent">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 flex flex-col items-center gap-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-dim">
            Ready to start yours?
          </p>
          <Link
            href="/contact"
            className="rounded-full bg-accent px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bg transition hover:bg-accent/90"
          >
            Start a project
          </Link>
        </div>
      </div>
    </div>
  );
}
