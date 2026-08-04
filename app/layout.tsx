import type { Metadata } from 'next';
import '@/src/index.css';
import Shell from './Shell';
import { Analytics } from '@vercel/analytics/next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rakshit.codes';

export const metadata: Metadata = {
  title: {
    default: 'Rakshit Sharma | Backend Developer',
    template: '%s | Rakshit Sharma',
  },
  description:
    'Backend engineer specializing in PostgreSQL, Redis, Docker, and scalable microservices. Building reliable systems with clean architecture.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Rakshit Sharma — Portfolio',
    title: 'Rakshit Sharma | Backend Developer',
    description:
      'Backend engineer specializing in PostgreSQL, Redis, Docker, and scalable microservices. Building reliable systems with clean architecture.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Rakshit Sharma — Backend Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rakshit Sharma | Backend Developer',
    description:
      'Backend engineer specializing in PostgreSQL, Redis, Docker, and scalable microservices.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
        <Analytics />
      </body>
    </html>
  );
}
