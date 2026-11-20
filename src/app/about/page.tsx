import type { Metadata } from 'next';
import { AboutClient } from '@/components/AboutClient';

export const metadata: Metadata = {
  title: 'About — Orbitvale',
  description: 'Bold tech, editorial restraint. Orbitvale builds digital systems that move with your business.',
};

export default function AboutPage() {
  return <AboutClient />;
}
