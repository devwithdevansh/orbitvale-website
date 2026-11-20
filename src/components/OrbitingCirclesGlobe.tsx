'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * OrbitingCirclesGlobe - A rotating globe with orbiting circles that shows global reach
 */
export function OrbitingCirclesGlobe() {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const globeRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const globe = globeRef.current;
    const circle = circleRef.current;
    if (!globe || !circle) return;

    const update = () => {
      const progress = Math.min(window.scrollY / 200, 1);
      setProgress(progress);
      if (circle) {
        circle.style.transform = `rotate(${progress * 360}deg)`;
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    update();

    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="relative h-[200px] w-full overflow-hidden rounded-xl bg-panel-2 shadow-xl" ref={globeRef}>
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 z-20">
          <div className="absolute inset-0 z-20 rounded-full border-2 border-accent border-opacity-25" />
        </div>
      </div>
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 z-10 rounded-full border-2 border-accent border-opacity-40" />
      </div>
      <div className="absolute inset-0 z-5">
        <div className="absolute inset-0 z-5 rounded-full border-2 border-accent border-opacity-50" />
      </div>
      <div className="absolute inset-0 z-1">
        <div className="absolute inset-0 z-1 rounded-full border-2 border-accent border-opacity-70" />
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-1 rounded-full border-2 border-accent border-opacity-80" />
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-1 rounded-full border-2 border-accent border-opacity-90" />
      </div>
    </div>
  );
}

export default OrbitingCirclesGlobe;