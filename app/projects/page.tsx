import type { Metadata } from 'next';
import ProjectsView from '@/src/components/ProjectsView';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Selected backend and full-stack projects by Rakshit Sharma — LegalSaathi, LinkZap, AuraPDF, and more. Focused on performance, scalability, and clean architecture.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Projects | Rakshit Sharma',
    description:
      'Selected backend and full-stack projects focused on performance, scalability, and clean architecture.',
    url: '/projects',
  },
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
