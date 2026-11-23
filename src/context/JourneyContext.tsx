'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getRouteStage, type RouteStage } from '@/lib/journey';
import { prefersReducedMotion } from '@/lib/utils';

export type JourneyState =
  | 'idle'
  | 'scrubbing'
  | 'committing'
  | 'cooldown';

interface JourneyContextValue {
  state: JourneyState;
  stage: RouteStage;
  scrubProgress: number;
  setScrubProgress: (progress: number) => void;
  triggerForward: (overrideRoute?: string) => void;
  enterCooldown: (durationMs?: number) => void;
}

const JourneyContext = createContext<JourneyContextValue>({
  state: 'idle',
  stage: getRouteStage('/'),
  scrubProgress: 0,
  setScrubProgress: () => {},
  triggerForward: () => {},
  enterCooldown: () => {},
});

export function useJourney() {
  return useContext(JourneyContext);
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const stage = getRouteStage(pathname);

  const [state, setState] = useState<JourneyState>('idle');

  const stateRef = useRef<JourneyState>('idle');
  stateRef.current = state;

  const scrubProgressRef = useRef(0);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);

  // Set transition cooldown helper (prevents inertial double-skips)
  const enterCooldown = useCallback((durationMs = 450) => {
    setState('cooldown');
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => {
      setState('idle');
    }, durationMs);
  }, []);

  // Reset on pathname change
  useEffect(() => {
    scrubProgressRef.current = 0;
    enterCooldown(450);

    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, [pathname, enterCooldown]);

  // High-performance scrub progress update (does not cause whole-tree React re-renders)
  const setScrubProgress = useCallback((progress: number) => {
    scrubProgressRef.current = progress;
    if (stateRef.current !== 'committing' && stateRef.current !== 'cooldown') {
      if (progress > 0.05 && progress < 0.98 && stateRef.current !== 'scrubbing') {
        setState('scrubbing');
      } else if (progress <= 0.05 && stateRef.current !== 'idle') {
        setState('idle');
      }
    }
  }, []);

  // Forward Navigation Commit
  const triggerForward = useCallback(
    (overrideRoute?: string) => {
      const destination = overrideRoute || stage.nextRoute;
      if (!destination || stateRef.current === 'committing' || stateRef.current === 'cooldown') {
        return;
      }

      setState('committing');
      scrubProgressRef.current = 1.0;

      const reduced = prefersReducedMotion();
      const delay = reduced ? 20 : 70;

      setTimeout(() => {
        router.push(destination);
      }, delay);
    },
    [stage.nextRoute, router]
  );

  return (
    <JourneyContext.Provider
      value={{
        state,
        stage,
        scrubProgress: scrubProgressRef.current,
        setScrubProgress,
        triggerForward,
        enterCooldown,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export default JourneyProvider;
