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
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollToTop: () => {},
  scrollToHash: () => {},
});

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Route Scroll & Navigation Coordinator
 * Ensures new routes ALWAYS land at the true top, below the fixed header.
 * Respects fragment/hash navigation (e.g. /work/project-phoenix#challenge).
 * Cancels residual Lenis momentum across page switches.
 */
function NavigationScrollCoordinator({ lenis }: { lenis: Lenis | null }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Only act when navigating to a DIFFERENT pathname
    if (prevPathRef.current === pathname) {
      return;
    }
    prevPathRef.current = pathname;

    // Check for fragment hash
    const hash = window.location.hash;

    // Stop ongoing momentum from previous page
    if (lenis) {
      lenis.stop();
    }

    if (hash) {
      // Allow DOM to commit before scrolling to hash target
      const timeoutId = setTimeout(() => {
        const targetId = hash.replace(/^#/, '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const headerOffset = 90; // Fixed header clearance
          const top = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
          if (lenis) {
            lenis.start();
            lenis.scrollTo(top, { immediate: false, duration: 0.6 });
          } else {
            window.scrollTo({ top, behavior: 'smooth' });
          }
        } else {
          // Target not found; default to top
          if (lenis) {
            lenis.start();
            lenis.scrollTo(0, { immediate: true });
          }
          window.scrollTo(0, 0);
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    } else {
      // Normal route navigation: land immediately at the top
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
        // Resume Lenis tracking on the new page
        requestAnimationFrame(() => {
          lenis.start();
          lenis.resize();
        });
      }
    }
  }, [pathname, searchParams, lenis]);

  return null;
}

/**
 * SmoothScroll Provider
 * Wraps the app in Lenis smooth scroll with path-aware resets,
 * reduced-motion bypass, and context access for programmatic navigation.
 */
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

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance, scrollToTop, scrollToHash }}>
      <Suspense fallback={null}>
        <NavigationScrollCoordinator lenis={lenisInstance} />
      </Suspense>
      {children}
    </LenisContext.Provider>
  );
}
