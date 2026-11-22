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
  | 'panel-entering'
  | 'panel-ready'
  | 'transitioning'
  | 'settling'
  | 'cooldown';

interface JourneyContextValue {
  state: JourneyState;
  stage: RouteStage;
  panelProgress: number;
  triggerForward: (overrideRoute?: string) => void;
  triggerReverse: (overrideRoute?: string) => void;
  setPanelRef: (el: HTMLElement | null) => void;
}

const JourneyContext = createContext<JourneyContextValue>({
  state: 'idle',
  stage: getRouteStage('/'),
  panelProgress: 0,
  triggerForward: () => {},
  triggerReverse: () => {},
  setPanelRef: () => {},
});

export function useJourney() {
  return useContext(JourneyContext);
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const stage = getRouteStage(pathname);

  const [state, setState] = useState<JourneyState>('idle');
  const [panelProgress, setPanelProgress] = useState(0);

  const stateRef = useRef<JourneyState>('idle');
  stateRef.current = state;

  const panelElementRef = useRef<HTMLElement | null>(null);
  const accumulatedWheelDown = useRef(0);
  const accumulatedWheelUp = useRef(0);
  const wheelResetTimer = useRef<NodeJS.Timeout | null>(null);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);

  const touchStartY = useRef(0);
  const isTouchActive = useRef(false);

  // Set transition cooldown helper
  const enterCooldown = useCallback((durationMs = 1200) => {
    setState('cooldown');
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => {
      setState('idle');
    }, durationMs);
  }, []);

  // Clear timers on pathname change
  useEffect(() => {
    accumulatedWheelDown.current = 0;
    accumulatedWheelUp.current = 0;
    if (wheelResetTimer.current) clearTimeout(wheelResetTimer.current);

    // Enter short cooldown on route mount so momentum doesn't trigger another page transition
    enterCooldown(1000);

    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      if (wheelResetTimer.current) clearTimeout(wheelResetTimer.current);
    };
  }, [pathname, enterCooldown]);

  // Forward Navigation
  const triggerForward = useCallback(
    (overrideRoute?: string) => {
      const destination = overrideRoute || stage.nextRoute;
      if (!destination || stateRef.current === 'transitioning' || stateRef.current === 'cooldown') {
        return;
      }

      setState('transitioning');

      const reduced = prefersReducedMotion();
      const delay = reduced ? 80 : 450;

      setTimeout(() => {
        router.push(destination);
      }, delay);
    },
    [stage.nextRoute, router]
  );

  // Reverse Navigation
  const triggerReverse = useCallback(
    (overrideRoute?: string) => {
      const destination = overrideRoute || stage.prevRoute;
      if (!destination || stateRef.current === 'transitioning' || stateRef.current === 'cooldown') {
        return;
      }

      setState('transitioning');

      const reduced = prefersReducedMotion();
      const delay = reduced ? 80 : 450;

      setTimeout(() => {
        // Pass nav=reverse so destination lands at its transition panel
        const targetUrl = destination === '/'
          ? '/?nav=reverse#next-page-transition'
          : `${destination}?nav=reverse#next-page-transition`;
        router.push(targetUrl);
      }, delay);
    },
    [stage.prevRoute, router]
  );

  // Track panel scroll progress and state
  useEffect(() => {
    let ticking = false;

    const checkPanelVisibility = () => {
      if (stateRef.current === 'transitioning') {
        ticking = false;
        return;
      }

      const panel = panelElementRef.current;
      if (!panel) {
        setPanelProgress(0);
        ticking = false;
        return;
      }

      const rect = panel.getBoundingClientRect();
      const windowH = window.innerHeight;

      // How far panel has entered the viewport
      const enteredPx = windowH - rect.top;
      const progress = Math.min(1, Math.max(0, enteredPx / (windowH * 0.75)));
      setPanelProgress(progress);

      if (stateRef.current !== 'cooldown') {
        if (progress >= 0.85) {
          setState('panel-ready');
        } else if (progress > 0.1) {
          setState('panel-entering');
        } else {
          setState('idle');
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(checkPanelVisibility);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    checkPanelVisibility();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  // Handle Wheel Events for deliberate forward and reverse transitions
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Ignore if user is inside a form input, textarea, select or modal
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      // Check current state
      const currentState = stateRef.current;
      if (currentState === 'transitioning' || currentState === 'cooldown') {
        return;
      }

      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const isAtBottom = scrollY + windowH >= docH - 35;
      const isAtTop = scrollY <= 4;

      // 1. Forward continuation: at bottom of document inside or facing the panel
      if (isAtBottom && stage.nextRoute && e.deltaY > 0) {
        accumulatedWheelDown.current += e.deltaY;
        if (wheelResetTimer.current) clearTimeout(wheelResetTimer.current);
        wheelResetTimer.current = setTimeout(() => {
          accumulatedWheelDown.current = 0;
        }, 350);

        // Deliberate downward momentum threshold
        if (accumulatedWheelDown.current > 75) {
          accumulatedWheelDown.current = 0;
          triggerForward();
        }
      }

      // 2. Reverse continuation: at very top of document scrolling upwards
      if (isAtTop && stage.prevRoute && e.deltaY < 0) {
        accumulatedWheelUp.current += Math.abs(e.deltaY);
        if (wheelResetTimer.current) clearTimeout(wheelResetTimer.current);
        wheelResetTimer.current = setTimeout(() => {
          accumulatedWheelUp.current = 0;
        }, 350);

        // Deliberate upward momentum threshold
        if (accumulatedWheelUp.current > 75) {
          accumulatedWheelUp.current = 0;
          triggerReverse();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [stage.nextRoute, stage.prevRoute, triggerForward, triggerReverse]);

  // Handle Touch Gestures for mobile
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      isTouchActive.current = true;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isTouchActive.current) return;
      isTouchActive.current = false;

      const currentState = stateRef.current;
      if (currentState === 'transitioning' || currentState === 'cooldown') {
        return;
      }

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY; // Positive = swipe up / scroll down

      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const isAtBottom = scrollY + windowH >= docH - 45;
      const isAtTop = scrollY <= 5;

      // Deliberate upward swipe at bottom -> forward
      if (isAtBottom && stage.nextRoute && deltaY > 80) {
        triggerForward();
      }

      // Deliberate downward swipe at top -> reverse
      if (isAtTop && stage.prevRoute && deltaY < -80) {
        triggerReverse();
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [stage.nextRoute, stage.prevRoute, triggerForward, triggerReverse]);

  const setPanelRef = useCallback((el: HTMLElement | null) => {
    panelElementRef.current = el;
  }, []);

  return (
    <JourneyContext.Provider
      value={{
        state,
        stage,
        panelProgress,
        triggerForward,
        triggerReverse,
        setPanelRef,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}
