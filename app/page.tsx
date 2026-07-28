import type { Metadata } from 'next';
import HomeView from '@/src/components/HomeView';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Backend engineer specializing in PostgreSQL, Redis, Docker, and scalable microservices. View my projects, skills, and blog.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Rakshit Sharma | Backend Developer',
    description:
      'Backend engineer specializing in PostgreSQL, Redis, Docker, and scalable microservices.',
    url: '/',
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rakshit.codes';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rakshit Sharma',
  jobTitle: 'Backend Developer',
  url: SITE_URL,
  sameAs: [
    'https://github.com/StackFox',
    'https://linkedin.com/in/rakshit-codes',
    'https://leetcode.com/u/jacoder69/',
    'https://x.com/sharma_rak72933',
  ],
  knowsAbout: [
    'PostgreSQL',
    'Redis',
    'Docker',
    'Node.js',
    'TypeScript',
    'Python',
    'Java',
    'Microservices',
    'System Design',
    'Linux',
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <HomeView />
    </>
  );
}
