import type { Metadata } from 'next';
import SkillsView from '@/src/components/SkillsView';

export const metadata: Metadata = {
  title: 'Skills',
  description:
    'Technical skills and proficiency levels for Rakshit Sharma — JavaScript, TypeScript, Python, React, Next.js, Node.js, PostgreSQL, MongoDB, Docker, and more.',
  alternates: {
    canonical: '/skills',
  },
  openGraph: {
    title: 'Skills | Rakshit Sharma',
    description:
      'Technical skills and proficiency levels across frontend, backend, and DevOps.',
    url: '/skills',
  },
};

export default function SkillsPage() {
  return <SkillsView />;
}
