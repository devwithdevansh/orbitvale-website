'use client';

import { useState, useRef, useEffect } from 'react';

interface NeonLoopItem {
  title: string;
  subtitle?: string;
  image: string;
}

interface NeonLoopProps {
  items: NeonLoopItem[];
  index?: number;
  onIndexChange?: (index: number) => void;
}

/**
 * NeonLoop - A looping neon animation that creates a continuous visual rhythm.
 *
 * Items rotate in a 3D shelf; dragging steps through them. The centre item is
 * lit brightly while the others fade into the background like neon on a wall.
 */
export function NeonLoop({ items, index = 0, onIndexChange }: NeonLoopProps) {
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
      className="relative h-[300px] w-full overflow-hidden rounded-xl bg-panel-2 shadow-xl"
      style={{ cursor: 'grab' }}
    >
      <div className="flex h-full w-full items-center justify-center">
        {items.map((item, idx) => {
          const offset = idx - currentIndex;
          const isActive = offset === 0;
          const scale = isActive ? 1.0 : 0.75;
          const translateX = offset * 120;
          const rotateY = offset * -15;
          const opacity = Math.abs(offset) > 2 ? 0 : 1;
          const zIndex = isActive ? 10 : 1;

          return (
            <div
              key={idx}
              className="absolute flex flex-col items-center justify-center rounded-xl border border-line bg-panel-2 p-4 transition-all duration-300"
              style={{
                transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity,
                zIndex,
                width: '260px',
                height: '220px',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-32 w-full rounded-lg object-cover"
                draggable={false}
              />
              <div className="mt-3 text-center">
                <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                {item.subtitle && <p className="text-xs text-muted">{item.subtitle}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NeonLoop;
