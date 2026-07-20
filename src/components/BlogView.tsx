'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, BookOpen, Clock, Tag } from 'lucide-react';
import Markdown from 'react-markdown';
import { BlogPost, BlogPostAPI } from '../types';

function deriveReadTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function deriveCategory(markdown: string): string {
  const match = markdown.match(/^###\s+(.+)/m);
  if (match) return match[1].trim();
  return 'General';
}

function mapPost(raw: BlogPostAPI): BlogPost {
  return {
    id: raw.id,
    title: raw.title,
    excerpt: raw.excerpt,
    content: raw.markdown,
    date: raw.date ?? 'Unknown',
    readTime: deriveReadTime(raw.markdown),
    category: deriveCategory(raw.markdown),
  };
}

export default function BlogView() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch blogs');
        return res.json();
      })
      .then((data: BlogPostAPI[]) => setPosts(data.map(mapPost)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const postsPerPage = 4;

  // Filter posts
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination bounds
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="w-full">
      {loading ? (
        <div className="text-center py-20">
          <p className="font-mono text-sm text-brand-on-surface-variant animate-pulse">
            &gt;&gt; Loading blog posts...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="font-mono text-sm text-red-400">
            &gt;&gt; Error: {error}
          </p>
        </div>
      ) : selectedPost ? (
        // Detailed Blog Post Reader
        <div className="animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 font-mono text-xs text-brand-primary hover:text-brand-secondary transition-colors mb-6 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>[RETURN_TO_ARCHIVES]</span>
          </button>

          <article className="space-y-6 max-w-3xl mx-auto pb-12">
            <header className="space-y-4 border-b border-brand-border/30 pb-6">
              <div className="flex flex-wrap gap-3 items-center text-xs text-brand-on-surface-variant font-mono">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-brand-primary" />
                  {selectedPost.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedPost.readTime}
                </span>
                <span>•</span>
                <span>Published: {selectedPost.date}</span>
              </div>
              <h1 className="font-mono text-3xl md:text-4xl font-bold text-brand-on-surface leading-tight text-glow">
                {selectedPost.title}
              </h1>
            </header>

            {/* Content body with beautiful text styling */}
            <div className="prose prose-invert prose-sm max-w-none font-sans text-brand-on-surface-variant leading-relaxed prose-headings:font-mono prose-headings:text-brand-on-surface prose-headings:text-glow prose-code:text-brand-primary prose-pre:bg-[#131313] prose-pre:border prose-pre:border-brand-border/60 prose-pre:rounded prose-a:text-brand-primary hover:prose-a:text-brand-secondary">
              <Markdown>{selectedPost.content}</Markdown>
            </div>
          </article>
        </div>
      ) : (
        // Main Blog Archives list
        <div className="w-full">
          {/* Header block */}
          <header className="mb-12">
            <h1 className="font-mono text-4xl md:text-5xl font-extrabold text-brand-on-surface mb-4">
              Blog
            </h1>
            <p className="font-mono text-xs md:text-sm text-brand-on-surface-variant opacity-70">
              &gt;&gt; grep -r "thoughts" ./mind
            </p>
          </header>

          {/* Search bar */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-brand-on-surface-variant/70" />
            <input
              type="text"
              placeholder="Query database articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1c1b1b] border border-brand-border rounded px-4 py-2 pl-10 font-mono text-xs focus:border-brand-primary outline-none transition-colors"
            />
          </div>

          {/* Blog Articles */}
          <section className="flex flex-col border-t border-brand-border/30">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="py-8 border-b border-brand-border/30 group hover:bg-[#1c1b1b]/40 transition-colors duration-200 px-4 -mx-4 rounded cursor-pointer flex flex-col gap-2"
                >
                  <div className="flex gap-4 items-center text-xs font-mono text-brand-on-surface-variant/70 group-hover:text-brand-primary transition-colors">
                    <time>{post.date}</time>
                    <span>•</span>
                    <span className="flex items-center gap-1 uppercase tracking-wider text-[10px] bg-[#2a2a2a] border border-brand-border px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                  </div>

                  <h2 className="font-mono text-xl md:text-2xl font-bold text-brand-on-surface group-hover:text-brand-primary transition-colors text-glow">
                    {post.title}
                  </h2>

                  <p className="font-sans text-sm text-brand-on-surface-variant leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-brand-primary font-mono opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>[READ_POST]</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="font-mono text-sm text-brand-on-surface-variant">
                  No system records matched your filter. Try adjusting query logs.
                </p>
              </div>
            )}
          </section>

          {/* Minimal Pagination block matching mockup */}
          <div className="flex justify-between items-center pt-8 border-t border-brand-border/50 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`font-mono text-xs text-brand-on-surface-variant hover:text-brand-primary transition-colors flex items-center gap-2 cursor-pointer ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : ''
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Newer
            </button>

            <span className="font-mono text-xs text-brand-on-surface-variant/70">
              {currentPage} / {Math.max(1, totalPages)}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`font-mono text-xs text-brand-on-surface-variant hover:text-brand-primary transition-colors flex items-center gap-2 cursor-pointer ${currentPage === totalPages || totalPages === 0 ? 'opacity-40 cursor-not-allowed' : ''
                }`}
            >
              Older
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
