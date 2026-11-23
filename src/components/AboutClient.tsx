'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MagneticButton } from '@/components/MagneticButton';
import { TextReveal } from '@/components/TextReveal';

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
    copy: "Every project starts with a single gravitational centre — the business goal. Everything orbits that. Scope creep is just poor orbital mechanics.",
  },
  {
    glyph: '—',
    title: 'Restraint earns trust',
    copy: "Animation and motion must earn their frame. If removing it makes the product clearer, it goes. Silence is craft.",
  },
  {
    glyph: '⟳',
    title: 'Continuous motion',
    copy: "Software is never done — it orbits. We build for iteration: clean APIs, documented systems, teams we can hand the keys to.",
  },
  {
    glyph: 'Λ',
    title: 'Velocity with direction',
    copy: "Speed is pointless without vector. We move fast when the direction is locked, and we slow down to lock the direction when it isn't.",
  },
];

const STATS = [
  { value: '86', label: 'Projects delivered' },
  { value: '14', label: 'Regions active' },
  { value: '99.9%', label: 'Infrastructure uptime' },
  { value: '5', label: 'Years in orbit' },
];

/** Animated counter — counts up from 0 to target when in view */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="border-b border-line pb-7">
      <div
        className="font-mono text-4xl font-semibold tracking-tight text-ink tabular-nums transition-all duration-700 md:text-5xl"
        style={{ opacity: shown ? 1 : 0, transform: shown ? 'translateY(0)' : 'translateY(16px)' }}
      >
        {value}
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{label}</div>
    </div>
  );
}

/** Timeline row — reveals on scroll */
function TimelineRow({ year, label, copy, index }: { year: string; label: string; copy: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isLast = index === TIMELINE.length - 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative pl-14"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms`,
      }}
    >
      {/* Node */}
      <div
        className="absolute left-[11px] top-1 h-[17px] w-[17px] rounded-full border"
        style={{
          background: isLast ? '#7ff3d0' : '#08090b',
          borderColor: '#7ff3d0',
          boxShadow: isLast ? '0 0 12px rgba(127,243,208,0.5)' : undefined,
        }}
      />
      <div className="mb-1 flex items-center gap-3">
        <span className="font-mono text-[11px] tracking-[0.18em] text-accent">{year}</span>
        <span className="font-mono text-[11px] tracking-[0.14em] text-dim">·</span>
        <span className="font-mono text-[11px] tracking-[0.14em] text-muted">{label}</span>
      </div>
      <p className="text-sm leading-relaxed text-muted">{copy}</p>
    </div>
  );
}

export function AboutClient() {
  return (
    <div className="px-6 pb-32">
      <div className="mx-auto max-w-6xl">

        {/* ── Arrival Hero Screen — tighter on desktop ── */}
        <section className="min-h-[44vh] sm:min-h-[50vh] lg:min-h-[44vh] flex flex-col justify-between pt-24 pb-8 select-none border-b border-line/20 mb-14">
          {/* Top metadata tag */}
          <div className="flex items-center justify-between border-b border-line/20 pb-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              About // 04
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
              Studio Principles · 2026
            </span>
          </div>

          {/* Bottom-left anchored page name */}
          <div className="mt-auto pt-8">
            <h1
              className="font-display font-semibold uppercase text-ink tracking-tight leading-[0.92] text-[46px] sm:text-[68px] md:text-[92px]"
            >
              ABOUT<br />
              <span className="text-accent">ORBITVALE</span>
            </h1>

            <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-muted font-normal">
              Bold tech. Editorial restraint. Digital experiences that orbit your business gravity.
            </p>

            <div className="mt-8 flex items-center gap-3 text-dim font-mono text-xs uppercase tracking-[0.22em]">
              <span className="text-accent animate-pulse">↓</span>
              <span>Scroll to explore studio ethos</span>
            </div>
          </div>
        </section>

        {/* Narrative & Content */}
        <div className="max-w-4xl mx-auto">
          <p className="mb-20 max-w-2xl text-lg leading-relaxed text-muted">
            Orbitvale is an IT company that treats digital products like places you can inhabit —
            one continuous camera, one object, every chapter a stop on the orbit. We blend
            Lusion-grade immersion with Halden-style silence: loud when it earns the frame,
            quiet when the copy should breathe.
          </p>

          {/* Stats strip */}
          <div className="mb-20 grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((s) => (
              <AnimatedStat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>

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

        <div className="mb-20 h-px w-full bg-line" />

        {/* Timeline */}
        <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.26em] text-dim">The orbit so far</p>
        <div className="relative">
          {/* Spine line */}
          <div className="absolute bottom-0 left-[19px] top-3 w-px bg-gradient-to-b from-accent to-transparent" />
          <div className="space-y-10">
            {TIMELINE.map((item, i) => (
              <TimelineRow
                key={item.year}
                year={item.year}
                label={item.label}
                copy={item.copy}
                index={i}
              />
            ))}
          </div>
        </div>

        <div className="mb-20 mt-20 h-px w-full bg-line" />

        {/* CTA */}
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              Join the orbit.
            </h2>
            <p className="mt-2 max-w-md text-muted">
              We&apos;re a small team that moves fast. If you care about craft and want to build
              things that last, we should talk.
            </p>
          </div>
          <MagneticButton strength={0.3}>
            <Link
              href="/contact"
              className="shrink-0 rounded-full bg-accent px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bg transition hover:bg-accent/90"
            >
              Start a project
            </Link>
          </MagneticButton>
        </div>
      </div>
    </div>
  </div>
  );
}
