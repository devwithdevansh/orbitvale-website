'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface WorksWheelItem {
  title: string;
  subtitle: string;
  image: string;
  slug: string;
  accent?: string;
}

export function WorksWheel({
  items = [
    { title: 'Project Phoenix', subtitle: 'Next-gen SaaS platform', image: '/covers/project-phoenix.svg', slug: 'project-phoenix', accent: '#ff6230' },
    { title: 'Nebula CMS', subtitle: 'Headless content management', image: '/covers/nebula-cms.svg', slug: 'nebula-cms', accent: '#c084fc' },
    { title: 'OrbitDB', subtitle: 'Decentralized database', image: '/covers/orbitdb.svg', slug: 'orbitdb', accent: '#7ff3d0' },
    { title: 'Lumen', subtitle: 'Real-time analytics dashboard', image: '/covers/lumen.svg', slug: 'lumen', accent: '#a3e635' },
    { title: 'Astra', subtitle: 'AI-powered analytics', image: '/covers/astra.svg', slug: 'astra', accent: '#e879f9' },
    { title: 'Nova', subtitle: 'Blockchain infrastructure', image: '/covers/nova.svg', slug: 'nova', accent: '#f59e0b' },
  ],
}: {
  items?: WorksWheelItem[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, isDragging: false, moved: false });

  const onPointerDown = (clientX: number) => {
    dragState.current = { startX: clientX, isDragging: true, moved: false };
  };

  const onPointerMove = (clientX: number) => {
    if (!dragState.current.isDragging) return;
    const deltaX = clientX - dragState.current.startX;
    const step = Math.round(deltaX / 80);
    if (step !== 0) {
      dragState.current.moved = true;
      const newIndex = Math.max(0, Math.min(currentIndex + step, items.length - 1));
      setCurrentIndex(newIndex);
      dragState.current.startX = clientX;
    }
  };

  const onPointerUp = () => { dragState.current.isDragging = false; };

  return (
    <div
      className="relative h-[360px] w-full overflow-hidden rounded-xl border border-line bg-panel-2/40 shadow-2xl backdrop-blur-sm"
      ref={wheelRef}
      style={{ cursor: 'grab', perspective: '1200px' }}
      onMouseDown={(e) => onPointerDown(e.clientX)}
      onMouseMove={(e) => onPointerMove(e.clientX)}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
      onTouchEnd={onPointerUp}
    >
      <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        {items.map((item, index) => {
          const offset = index - currentIndex;
          const isActive = offset === 0;
          const accent = item.accent ?? '#7ff3d0';

          return (
            <div
              key={item.title}
              className="absolute rounded-xl border bg-panel shadow-2xl"
              style={{
                transform: `translateX(${offset * 160}px) rotateY(${offset * -22}deg) scale(${isActive ? 1.06 : 0.84})`,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out, border-color 0.3s',
                zIndex: isActive ? 10 : Math.max(0, 5 - Math.abs(offset)),
                opacity: Math.abs(offset) > 2 ? 0 : 1,
                width: '280px',
                borderColor: isActive ? `${accent}60` : 'rgba(255,255,255,0.08)',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              {/* Cover image */}
              <div className="relative overflow-hidden rounded-t-xl h-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                {isActive && (
                  <div
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(ellipse at 20% 80%, ${accent}18 0%, transparent 60%)` }}
                  />
                )}
              </div>

              {/* Info + CTA */}
              <div className="flex items-end justify-between p-4">
                <div>
                  <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                  <p className="font-mono text-[10px] text-muted tracking-wide mt-0.5">{item.subtitle}</p>
                </div>
                {isActive && (
                  <Link
                    href={`/work/${item.slug}`}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-accent/40 text-xs text-accent transition-colors hover:bg-accent hover:text-bg"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`View ${item.title}`}
                  >
                    →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Drag hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.2em] text-dim opacity-50">
        drag to explore
      </div>
    </div>
  );
}

export default WorksWheel;
