'use client';

import { useState, useRef, useEffect } from 'react';

interface CoverFlowItem {
  title: string;
  subtitle?: string;
  image: string;
}

interface CoverFlowProps {
  items: CoverFlowItem[];
  index?: number;
  onIndexChange?: (index: number) => void;
}

/**
 * CoverFlow - 3D cover-flow shelf for featured projects.
 *
 * Items are arranged on a horizontal 3D shelf; the centre item is in focus,
 * and dragging or scrolling steps the shelf. The centre item is the "active"
 * project and is rendered at full opacity; side items are scaled down and
 * slightly rotated.
 */
export function CoverFlow({ items, index = 0, onIndexChange }: CoverFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(index);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, isDragging: false });

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  const onPointerDown = (clientX: number) => {
    dragState.current = { startX: clientX, isDragging: true };
  };

  const onPointerMove = (clientX: number) => {
    if (!dragState.current.isDragging) return;
    const deltaX = clientX - dragState.current.startX;
    const step = Math.round(deltaX / 80);
    if (step !== 0) {
      const newIndex = Math.max(0, Math.min(currentIndex + step, items.length - 1));
      handleIndexChange(newIndex);
      dragState.current.startX = clientX;
    }
  };

  const onPointerUp = () => {
    dragState.current.isDragging = false;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => onPointerDown(e.clientX);
    const handleMouseMove = (e: MouseEvent) => onPointerMove(e.clientX);
    const handleMouseUp = () => onPointerUp();

    const handleTouchStart = (e: TouchEvent) => onPointerDown(e.touches[0].clientX);
    const handleTouchMove = (e: TouchEvent) => onPointerMove(e.touches[0].clientX);
    const handleTouchEnd = () => onPointerUp();

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, items.length]);

  return (
    <div
      ref={containerRef}
      className="relative h-[340px] w-full overflow-hidden rounded-xl bg-panel-2/60 border border-line shadow-2xl backdrop-blur-sm"
      style={{ cursor: 'grab' }}
    >
      <div className="flex h-full w-full items-center justify-center">
        {items.map((item, idx) => {
          const offset = idx - currentIndex;
          const isActive = offset === 0;
          const scale = isActive ? 1.05 : 0.82;
          const translateX = offset * 150;
          const rotateY = offset * -18;
          const opacity = Math.abs(offset) > 2 ? 0 : 1;
          const zIndex = isActive ? 10 : Math.max(1, 5 - Math.abs(offset));

          return (
            <div
              key={idx}
              className="absolute flex flex-col justify-between rounded-xl border border-line bg-panel p-3.5 shadow-2xl transition-all duration-300"
              style={{
                transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity,
                zIndex,
                width: '280px',
                height: '240px',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-36 w-full rounded-lg object-cover border border-line-2/40"
                draggable={false}
              />
              <div className="pt-3 pb-1 px-1">
                <h3 className="text-base font-semibold text-ink tracking-tight">{item.title}</h3>
                {item.subtitle && (
                  <p className="font-mono text-[11px] text-muted tracking-wide mt-0.5">{item.subtitle}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CoverFlow;
