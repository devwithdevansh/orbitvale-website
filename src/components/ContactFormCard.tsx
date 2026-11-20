'use client';

import { type ReactNode } from 'react';
import { LunarGravityCard } from '@/components/LunarGravityCard';

export function ContactFormCard({ children }: { children: ReactNode }) {
  return (
    <LunarGravityCard
      className="relative rounded-2xl border border-line/60"
      maxTilt={8}
      glowColor="#7ff3d0"
    >
      <div
        className="relative rounded-2xl p-8 md:p-12"
        style={{ background: 'var(--panel)' }}
      >
        {/* Corner accent line */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-8 h-px w-12 -translate-x-full"
          style={{ background: 'var(--accent)', opacity: 0.5 }}
        />
        {children}
      </div>
    </LunarGravityCard>
  );
}
