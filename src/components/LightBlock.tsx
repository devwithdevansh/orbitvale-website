'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { featuredProjects } from '@/lib/projects';

interface ServiceItem {
  num: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

const SERVICES: ServiceItem[] = [
 {num:'01',title:'Ready-made software products',description:'Purpose-built systems for businesses that want a practical starting point: explore School ERP, FORGE Gym and automotive website packages.',tags:['School ERP','FORGE Gym','Automotive Websites'],image:featuredProjects[0].image},
 {num:'02',title:'Custom software & platforms',description:'Business-specific portals, workflows, management systems and integrations shaped around real operating requirements.',tags:['ERP','Automation','Custom Development'],image:featuredProjects[3].image},
 {num:'03',title:'Websites & digital experiences',description:'Responsive websites and interactive experiences with thoughtful art direction, performance and usability.',tags:['Web Development','UI / UX','Interaction'],image:featuredProjects[2].image},
 {num:'04',title:'Mobile & connected experiences',description:'Mobile applications and connected web interfaces designed around the same user and business journeys.',tags:['Mobile','Member Apps','Integrated Systems'],image:featuredProjects[1].image},
];

interface WorkItem {
  num: string;
  title: string;
  slug: string;
  year: string;
  category: string;
  cover: string;
  accent: string;
}

const FEATURED_WORK: WorkItem[] = featuredProjects.map((p,i)=>({
 num:String(i+1).padStart(2,'0'),title:p.title,slug:p.slug,year:p.kind,category:p.industry,cover:p.image,accent:p.accent
}));

interface ProcessPhase {
  num: string;
  title: string;
  weeks: string;
  description: string;
  barWidth: string;
  barOffset: string;
}

const PROCESS_PHASES: ProcessPhase[] = [
  {
    num: '01',
    title: 'Discover',
    weeks: 'Phase 01',
    description: 'Deep audit of business gravity, legacy architecture, user journeys, and technical constraints.',
    barWidth: '22%',
    barOffset: '0%',
  },
  {
    num: '02',
    title: 'Define & Design',
    weeks: 'Phase 02',
    description: 'Interactive Figma design systems, motion choreography, and high-fidelity prototype validation.',
    barWidth: '32%',
    barOffset: '20%',
  },
  {
    num: '03',
    title: 'Build & Scale',
    weeks: 'Phase 03',
    description: 'Production engineering sprints with continuous integration, automated testing, and performance budgets.',
    barWidth: '38%',
    barOffset: '50%',
  },
  {
    num: '04',
    title: 'Launch & Orbit',
    weeks: 'Phase 04',
    description: 'Zero-downtime release, observability instrumentation, team onboarding, and ongoing orbital iteration.',
    barWidth: '18%',
    barOffset: '82%',
  },
];

/**
 * Sections 04–06 · The Light Block (Halden Reference)
 *
 * Flips the page theme to clean crisp off-white (`#f4f5f7`):
 * - Section 04: Services List with interactive hover slide and image preview tilt
 * - Section 05: Selected Work rows with hover preview and case study routing
 * - Section 06: Process Gantt schedule bars with animated orbit nodes
 */
export function LightBlock() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [hoveredWork, setHoveredWork] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="theme-light relative w-full bg-[#f4f5f7] text-[#0c0e12] py-28 md:py-36 px-6 transition-colors duration-700 select-none"
      id="light-block"
    >
      <div className="mx-auto max-w-6xl">

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 04 · SERVICES (Halden List Rows)
           ══════════════════════════════════════════════════════════════════ */}
        <section id="section-services" className="mb-32 md:mb-44">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#0a8f6a] mb-3">
                04 · Capabilities
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#0c0e12]">
                Our Services
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-[#5d6573] leading-relaxed">
              Explore existing business products or work with us on a solution designed around your specific needs.
            </p>
          </div>

          {/* Services Rows */}
          <div className="border-t border-[#cfd3da]">
            {SERVICES.map((s, idx) => {
              const isHovered = hoveredService === idx;

              return (
                <div
                  key={s.num}
                  onMouseEnter={() => setHoveredService(idx)}
                  onMouseLeave={() => setHoveredService(null)}
                  className="group relative flex flex-col md:flex-row md:items-center justify-between py-8 sm:py-10 border-b border-[#cfd3da] cursor-pointer transition-all duration-300"
                  style={{
                    paddingLeft: isHovered ? '24px' : '0px',
                  }}
                >
                  {/* Left: Number + Title */}
                  <div className="flex items-baseline gap-6 md:gap-10">
                    <span className="font-mono text-xs sm:text-sm text-[#88909e] group-hover:text-[#0a8f6a] transition-colors">
                      {s.num}
                    </span>
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-[#0c0e12] group-hover:text-[#0a8f6a] transition-colors">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#5d6573] max-w-xl leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Tags + Arrow */}
                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                      {s.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#cfd3da] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#5d6573]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-base text-[#88909e] group-hover:text-[#0a8f6a] group-hover:translate-x-1.5 transition-all">
                      ↗
                    </span>
                  </div>

                  {/* Halden Tilted Image Preview Thumbnail on Hover */}
                  {isHovered && (
                    <div
                      className="hidden lg:block pointer-events-none absolute right-44 top-[-30px] z-20 w-44 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-white/60 transition-all duration-300"
                      style={{
                        transform: 'rotate(-5deg) scale(1.05)',
                        animation: 'fadeIn 0.25s ease-out',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 05 · SELECTED WORK (Halden List Rows)
           ══════════════════════════════════════════════════════════════════ */}
        <section id="section-work" className="mb-32 md:mb-44">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#0a8f6a] mb-3">
                05 · Case Studies
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#0c0e12]">
                Selected{' '}
                <span
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    color: '#0a8f6a',
                  }}
                >
                  Work
                </span>
              </h2>
            </div>
            <Link
              href="/work"
              className="font-mono text-xs uppercase tracking-[0.18em] text-[#0a8f6a] hover:underline"
            >
              See All Work ↗
            </Link>
          </div>

          {/* Work Rows */}
          <div className="border-t border-[#cfd3da]">
            {FEATURED_WORK.map((w, idx) => {
              const isHovered = hoveredWork === idx;

              return (
                <Link
                  key={w.slug}
                  href={`/work/${w.slug}`}
                  onMouseEnter={() => setHoveredWork(idx)}
                  onMouseLeave={() => setHoveredWork(null)}
                  className="group relative flex items-center justify-between py-7 sm:py-9 border-b border-[#cfd3da] cursor-pointer transition-all duration-300"
                  style={{
                    paddingLeft: isHovered ? '24px' : '0px',
                  }}
                >
                  {/* Left: Number + Title */}
                  <div className="flex items-baseline gap-6 sm:gap-10">
                    <span className="font-mono text-xs sm:text-sm text-[#88909e] group-hover:text-[#0a8f6a] transition-colors">
                      {w.num}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-[#0c0e12] group-hover:text-[#0a8f6a] transition-colors">
                      {w.title}
                    </h3>
                  </div>

                  {/* Middle / Right: Category & Year */}
                  <div className="flex items-center gap-6 sm:gap-12">
                    <span className="font-mono text-xs text-[#5d6573]">
                      {w.category}
                    </span>
                    <span className="font-mono text-xs text-[#88909e]">
                      {w.year}
                    </span>
                    <span className="font-mono text-base text-[#88909e] group-hover:text-[#0a8f6a] group-hover:translate-x-1.5 transition-all">
                      →
                    </span>
                  </div>

                  {/* Tilted Cover Thumbnail on Hover */}
                  {isHovered && (
                    <div
                      className="hidden lg:block pointer-events-none absolute right-48 top-[-36px] z-20 w-48 aspect-[16/10] rounded-xl overflow-hidden shadow-2xl border border-white/60 transition-all duration-300"
                      style={{
                        transform: 'rotate(-4deg) scale(1.08)',
                        animation: 'fadeIn 0.2s ease-out',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={w.cover}
                        alt={w.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 06 · PROCESS (Halden Gantt Schedule Bars)
           ══════════════════════════════════════════════════════════════════ */}
        <section id="section-process">
          <div className="mb-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#0a8f6a] mb-3">
              06 · Method
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#0c0e12]">
              How We Work
            </h2>
            <p className="mt-4 max-w-xl text-sm sm:text-base text-[#5d6573] leading-relaxed">
              Every engagement is shaped around scope, complexity and your priorities. These four phases describe how we work, not a fixed delivery timeline.
            </p>
          </div>

          {/* Phase Header */}
          <div className="hidden sm:grid grid-cols-10 border-b border-[#cfd3da] pb-3 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-[#88909e] mb-6">
            <div>P01</div>
            <div>P02</div>
            <div>P03</div>
            <div>P04</div>
            <div>P05</div>
            <div>P06</div>
            <div>P07</div>
            <div>P08</div>
            <div>P09</div>
            <div>P10</div>
          </div>

          {/* Gantt Schedule Rows */}
          <div className="space-y-6 sm:space-y-8">
            {PROCESS_PHASES.map((phase) => (
              <div
                key={phase.num}
                className="group rounded-2xl border border-[#cfd3da] bg-white p-6 sm:p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4f5f7] font-mono text-[10px] font-semibold text-[#0a8f6a]">
                      {phase.num}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-[#0c0e12]">
                      {phase.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-[#5d6573]">
                    {phase.weeks}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#5d6573] leading-relaxed mb-6 max-w-2xl">
                  {phase.description}
                </p>

                {/* Animated Schedule Gantt Bar */}
                <div className="relative h-3 w-full rounded-full bg-[#e9eef6] overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-[#0c0e12] transition-all duration-700 group-hover:bg-[#0a8f6a]"
                    style={{
                      left: phase.barOffset,
                      width: phase.barWidth,
                    }}
                  />
                  {/* Orbit Node Dot */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[#0a8f6a] border border-white shadow-sm"
                    style={{
                      left: phase.barOffset,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default LightBlock;
