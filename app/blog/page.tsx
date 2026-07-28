import type { Metadata } from 'next';
import BlogView from '@/src/components/BlogView';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Technical articles and architectural breakdowns by Rakshit Sharma on backend engineering, caching strategies, system design, and open source.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog | Rakshit Sharma',
    description:
      'Technical articles and architectural breakdowns on backend engineering, caching strategies, and system design.',
    url: '/blog',
  },
};

export default function BlogPage() {
  return <BlogView />;
}
