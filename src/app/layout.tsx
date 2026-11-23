import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { NextPageTransition } from '@/components/NextPageTransition';
import { ScrollProgress } from '@/components/ScrollProgress';
import { SmoothScroll } from '@/components/SmoothScroll';
import { JourneyProvider } from '@/context/JourneyContext';
import { WarpTunnel } from '@/components/WarpTunnel';
import { CustomCursor } from '@/components/CustomCursor';
import { AmbientSound } from '@/components/AmbientSound';

/**
 * Syne — display / heading font.
 * Self-hosted WOFF2 for zero-network build reliability.
 */
const syne = localFont({
  src: [
    {
      path: '../../public/fonts/Syne-latin-ext.woff2',
      weight: '400 700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Syne-latin.woff2',
      weight: '400 700',
      style: 'normal',
    },
  ],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});

/**
 * JetBrains Mono — monospace / label font.
 */
const jetbrainsMono = localFont({
  src: [
    {
      path: '../../public/fonts/JetBrainsMono-latin-ext.woff2',
      weight: '400 700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/JetBrainsMono-latin.woff2',
      weight: '400 700',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
  fallback: ['ui-monospace', 'Menlo', 'Consolas', 'monospace'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://orbitvale.com'),
  title: 'Orbitvale — Digital systems in continuous motion',
  description:
    'Orbitvale builds digital experiences that orbit your business goals. Development, design, and strategic technology solutions.',
  keywords: [
    'IT company',
    'software development',
    'digital agency',
    'web design',
    'technology solutions',
    'Orbitvale',
  ],
  openGraph: {
    title: 'Orbitvale — Digital systems in continuous motion',
    description: 'We build digital experiences that orbit your business goals.',
    type: 'website',
    url: 'https://orbitvale.com',
    siteName: 'Orbitvale',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orbitvale — Digital systems in continuous motion',
    description: 'We build digital experiences that orbit your business goals.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${syne.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#08090b] text-[#f4f4f6]">
        <SmoothScroll>
          <JourneyProvider>
            <CustomCursor />
            <AmbientSound />
            <WarpTunnel />
            <ScrollProgress />
            <Nav />
            <main id="main-content">
              {children}
            </main>
            <Footer />
            <NextPageTransition />
          </JourneyProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
