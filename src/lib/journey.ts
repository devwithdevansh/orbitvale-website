export interface RouteStage {
  pathname: string;
  nextRoute: string | null;
  prevRoute: string | null;
  nextHeading: string;
  prevHeading: string;
  nextLabel: string;
  prevLabel: string;
  subtext: string;
}

export const ROUTE_STAGES: Record<string, RouteStage> = {
  '/': {
    pathname: '/',
    nextRoute: '/work',
    prevRoute: null,
    nextHeading: 'SELECTED WORK',
    prevHeading: '',
    nextLabel: '02 / 05',
    prevLabel: '',
    subtext: 'Case studies across platform engineering, distributed systems, and real-time interfaces.',
  },
  '/work': {
    pathname: '/work',
    nextRoute: '/services',
    prevRoute: '/',
    nextHeading: 'OUR SERVICES',
    prevHeading: 'HOME',
    nextLabel: '03 / 05',
    prevLabel: '01 / 05',
    subtext: 'Full-stack product engineering, experience design, interactive 3D, and strategy.',
  },
  '/services': {
    pathname: '/services',
    nextRoute: '/about',
    prevRoute: '/work',
    nextHeading: 'ABOUT ORBITVALE',
    prevHeading: 'SELECTED WORK',
    nextLabel: '04 / 05',
    prevLabel: '02 / 05',
    subtext: 'Bold tech with editorial restraint. Our principles, culture, and the orbit so far.',
  },
  '/about': {
    pathname: '/about',
    nextRoute: '/contact',
    prevRoute: '/services',
    nextHeading: "LET'S CONNECT",
    prevHeading: 'OUR SERVICES',
    nextLabel: '05 / 05',
    prevLabel: '03 / 05',
    subtext: "Tell us what you're building. We'll map the orbit together.",
  },
  '/contact': {
    pathname: '/contact',
    nextRoute: null,
    prevRoute: '/about',
    nextHeading: '',
    prevHeading: 'ABOUT ORBITVALE',
    nextLabel: '',
    prevLabel: '04 / 05',
    subtext: '',
  },
};

export function getRouteStage(pathname: string): RouteStage {
  if (pathname.startsWith('/work/')) {
    return {
      pathname,
      nextRoute: '/services',
      prevRoute: '/work',
      nextHeading: 'OUR SERVICES',
      prevHeading: 'SELECTED WORK',
      nextLabel: '03 / 05',
      prevLabel: '02 / 05',
      subtext: 'Full-stack product engineering, experience design, interactive 3D, and strategy.',
    };
  }
  return ROUTE_STAGES[pathname] || ROUTE_STAGES['/'];
}
