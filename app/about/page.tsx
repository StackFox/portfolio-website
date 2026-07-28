import type { Metadata } from 'next';
import AboutView from '@/src/components/AboutView';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Rakshit Sharma — backend engineer based in Delhi, India. Learn about my tech stack, open source contributions, and development philosophy.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Rakshit Sharma',
    description:
      'Backend engineer based in Delhi, India. Learn about my tech stack, open source contributions, and development philosophy.',
    url: '/about',
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rakshit.codes';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rakshit Sharma',
  jobTitle: 'Backend Developer',
  url: `${SITE_URL}/about`,
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

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <AboutView />
    </>
  );
}
