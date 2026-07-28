'use client';

import Link from 'next/link';
import Markdown from 'react-markdown';
import { ChevronLeft, Clock, Tag } from 'lucide-react';

interface BlogPostContentProps {
  title: string;
  date: string | null;
  category: string;
  readTime: string;
  markdown: string;
}

export default function BlogPostContent({
  title,
  date,
  category,
  readTime,
  markdown,
}: BlogPostContentProps) {
  return (
    <article className="space-y-6 max-w-3xl mx-auto pb-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-mono text-xs text-brand-primary hover:text-brand-secondary transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>[RETURN_TO_ARCHIVES]</span>
      </Link>

      <header className="space-y-4 border-b border-brand-border/30 pb-6">
        <div className="flex flex-wrap gap-3 items-center text-xs text-brand-on-surface-variant font-mono">
          <span className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-brand-primary" />
            {category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readTime}
          </span>
          {date && (
            <>
              <span>•</span>
              <span>Published: {date}</span>
            </>
          )}
        </div>
        <h1 className="font-mono text-3xl md:text-4xl font-bold text-brand-on-surface leading-tight text-glow">
          {title}
        </h1>
      </header>

      <div className="prose prose-invert prose-sm max-w-none font-sans text-brand-on-surface-variant leading-relaxed prose-headings:font-mono prose-headings:text-brand-on-surface prose-headings:text-glow prose-code:text-brand-primary prose-pre:bg-[#131313] prose-pre:border prose-pre:border-brand-border/60 prose-pre:rounded prose-a:text-brand-primary hover:prose-a:text-brand-secondary">
        <Markdown>{markdown}</Markdown>
      </div>

      <div className="border-t border-brand-border/30 pt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-brand-primary hover:text-brand-secondary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>[RETURN_TO_ARCHIVES]</span>
        </Link>
      </div>
    </article>
  );
}
