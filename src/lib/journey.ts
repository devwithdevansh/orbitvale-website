export interface RouteStage {
  pathname: string;
  nextRoute: string | null;
  prevRoute: string | null;
  nextHeading: string;
  nextLabel: string;
  subtext: string;
}

export const ROUTE_STAGES: Record<string, RouteStage> = {
  '/': {
    pathname: '/',
    nextRoute: '/work',
    prevRoute: null,
    nextHeading: 'SELECTED WORK',
    nextLabel: 'Work · 02',
    subtext: 'Case studies across platform engineering, distributed systems, and real-time interfaces.',
  },
  '/work': {
    pathname: '/work',
    nextRoute: '/services',
    prevRoute: '/',
    nextHeading: 'OUR SERVICES',
    nextLabel: 'Services · 03',
    subtext: 'Full-stack product engineering, experience design, interactive 3D, and strategy.',
  },
  '/services': {
    pathname: '/services',
    nextRoute: '/about',
    prevRoute: '/work',
    nextHeading: 'ABOUT ORBITVALE',
    nextLabel: 'About · 04',
    subtext: 'Bold tech with editorial restraint. Our principles, culture, and the orbit so far.',
  },
  '/about': {
    pathname: '/about',
    nextRoute: '/contact',
    prevRoute: '/services',
    nextHeading: "LET'S CONNECT",
    nextLabel: 'Contact · 05',
    subtext: "Tell us what you're building. We'll map the orbit together.",
  },
  '/contact': {
    pathname: '/contact',
    nextRoute: null,
    prevRoute: '/about',
    nextHeading: 'ORBIT COMPLETE',
    nextLabel: 'Return Home · 01',
    subtext: 'You have reached the end of the orbit journey. Return to the homepage to explore again.',
  },
};

export function getRouteStage(pathname: string): RouteStage {
  if (pathname.startsWith('/work/')) {
    return {
      pathname,
      nextRoute: '/services',
      prevRoute: '/work',
      nextHeading: 'OUR SERVICES',
      nextLabel: 'Services · 03',
      subtext: 'Full-stack product engineering, experience design, interactive 3D, and strategy.',
    };
  }
  return ROUTE_STAGES[pathname] || ROUTE_STAGES['/'];
}
