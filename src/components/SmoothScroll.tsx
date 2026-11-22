'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  Suspense,
  type ReactNode,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Lenis from 'lenis';
import { prefersReducedMotion } from '@/lib/utils';

interface LenisContextValue {
  lenis: Lenis | null;
  scrollToTop: (immediate?: boolean) => void;
  scrollToHash: (hash: string) => void;
  scrollToElement: (el: HTMLElement, immediate?: boolean) => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollToTop: () => {},
  scrollToHash: () => {},
  scrollToElement: () => {},
});

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Route Scroll & Bidirectional Navigation Coordinator
 * - Normal forward navigation: Lands immediately at scroll position 0 (page top).
 * - Reverse navigation (nav=reverse): Lands with the NextPageTransition panel in full view.
 * - Fragment/hash navigation: Scrolls to target with fixed header clearance.
 * - Clears residual Lenis momentum across page switches to prevent skipping.
 */
function NavigationScrollCoordinator({ lenis }: { lenis: Lenis | null }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const isNewPath = prevPathRef.current !== pathname;
    prevPathRef.current = pathname;

    const isReverse = searchParams.get('nav') === 'reverse';
    const hash = window.location.hash;

    // Stop ongoing momentum from the prior route
    if (lenis) {
      lenis.stop();
    }

    if (isReverse) {
      // Land on the previous page's NextPageTransition panel
      const timeoutId = setTimeout(() => {
        const panelEl = document.getElementById('next-page-transition');
        if (panelEl) {
          const top = panelEl.getBoundingClientRect().top + window.scrollY;
          if (lenis) {
            lenis.scrollTo(top, { immediate: true });
            lenis.start();
            lenis.resize();
          } else {
            window.scrollTo({ top, behavior: 'instant' });
          }
        } else {
          // Fallback to top if panel not found
          window.scrollTo(0, 0);
          if (lenis) {
            lenis.scrollTo(0, { immediate: true });
            lenis.start();
          }
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    } else if (hash && hash !== '#next-page-transition') {
      // Normal fragment anchor
      const timeoutId = setTimeout(() => {
        const targetId = hash.replace(/^#/, '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const headerOffset = 90;
          const top = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
          if (lenis) {
            lenis.start();
            lenis.scrollTo(top, { immediate: false, duration: 0.6 });
          } else {
            window.scrollTo({ top, behavior: 'smooth' });
          }
        } else {
          window.scrollTo(0, 0);
          if (lenis) {
            lenis.scrollTo(0, { immediate: true });
            lenis.start();
          }
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    } else if (isNewPath) {
      // Default: Land at true top of the new page
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
        requestAnimationFrame(() => {
          lenis.start();
          lenis.resize();
        });
      }
    }
  }, [pathname, searchParams, lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    setLenisInstance(lenis);

    let rafId = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  const scrollToTop = (immediate = true) => {
    window.scrollTo(0, 0);
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate });
    }
  };

  const scrollToHash = (hash: string) => {
    const targetId = hash.replace(/^#/, '');
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const headerOffset = 90;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
      if (lenisInstance) {
        lenisInstance.scrollTo(top, { immediate: false, duration: 0.6 });
      } else {
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  const scrollToElement = (el: HTMLElement, immediate = false) => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (lenisInstance) {
      lenisInstance.scrollTo(top, { immediate, duration: 0.8 });
    } else {
      window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' });
    }
  };

  return (
    <LenisContext.Provider
      value={{
        lenis: lenisInstance,
        scrollToTop,
        scrollToHash,
        scrollToElement,
      }}
    >
      <Suspense fallback={null}>
        <NavigationScrollCoordinator lenis={lenisInstance} />
      </Suspense>
      {children}
    </LenisContext.Provider>
  );
}

export default SmoothScroll;
