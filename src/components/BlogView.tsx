'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, BookOpen, Clock, Tag } from 'lucide-react';
import { BlogPost } from '../types';

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'redis-cache',
    title: 'Optimizing Redis Caching for Microservices',
    excerpt: 'A deep dive into reducing latency across distributed systems by implementing intelligent caching strategies and handling cache invalidation anomalies. We explore edge cases in high-throughput environments.',
    content: `
Caching is frequently cited as one of the two hardest problems in computer engineering. In high-throughput distributed systems, a naive caching implementation can easily lead to catastrophic cache stampedes, stale data states, or severe performance degradation of backing datastores.

### The Challenge of Microservice Scale
When dealing with hundreds of internal services executing tens of thousands of requests per second, the naive "Cache-Aside" pattern often falls short. 
If a cache key expires, multiple concurrent microservice instances might simultaneously detect the miss and execute identical resource-intensive database queries.

### Mitigating Cache Stampede
To protect PostgreSQL databases from collapsing under transient loads, we implemented **Sliding-Window Locking (Distributed Locks)** and **Probabilistic Early Expiration** algorithms:

\`\`\`rust
// Soft-lock mechanism to avoid redundant database reads
fn fetch_with_stampede_protection(key: &str) -> CacheResult<Value> {
    match redis::get(key) {
        Some(val) => {
            // Check if key is nearing expiration probabilistically
            if is_near_expiration(val.ttl) && try_acquire_lock(format!("{}:lock", key)) {
                // Spawn background update block
                tokio::spawn(async move {
                    let updated = fetch_database_raw(key).await;
                    redis::set(key, updated);
                    release_lock(format!("{}:lock", key));
                });
            }
            Ok(val.value)
        }
        None => {
            // Hard lock to force single database reader
            acquire_blocking_lock(key);
            let updated = fetch_database_raw(key).await;
            redis::set(key, updated);
            Ok(updated)
        }
    }
}
\`\`\`

### Cache Invalidation Patterns
Stale cache states are the primary source of application integrity bugs. We established a strict **Write-Through** pattern coupled with an **event-driven pub/sub architecture** via RabbitMQ. 
Every write operation targeting the system metadata immediately emits a broadcast event forcing all relevant Cache proxies to gracefully evict or mutate their keys within 20 milliseconds.
    `,
    date: '2024.10.24',
    readTime: '6 min read',
    category: 'Databases',
  },
  {
    id: 'vanilla-k8s',
    title: 'The Case for Vanilla Kubernetes',
    excerpt: 'Moving away from heavy abstractions and managed services. Why sometimes going back to raw YAML manifests and understanding the control plane fundamentals leads to more resilient infrastructure.',
    content: `
Modern DevOps is flooded with complex abstractions that promise to completely hide container orchestration under a simple, developer-friendly GUI. While these wrapper tools are tempting, they frequently add obscure failure states that are difficult to debug.

### Why Vanilla Manifests?
Relying on custom templates, Helm wrappers, or opinionated managed setups creates layers of obfuscation. By returning to standard, native Kubernetes YAML manifests:
- **Clarity of Intent:** Your state files describe exactly what pods, network policies, and state sets are active.
- **Portability:** Moving between AWS EKS, Google GKE, or an on-premise bare-metal k3s deployment requires virtually zero changes.
- **Debuggability:** If a replica set is crashing, standard \`kubectl describe pod\` outputs reference exact native properties, rather than custom abstraction variables.

### Topology Network Isolation example
Here is an example of a strict, highly secure network policy configuration isolating database ingress to application pods alone:

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-strict-isolation
  namespace: database
spec:
  podSelector:
    matchLabels:
      role: postgres-db
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: backend-api
    ports:
    - protocol: TCP
      port: 5432
\`\`\`

By mastering these native primitives, small team engineering structures maintain full control of container lifecycles without relying on vendor-locked cloud dashboards.
    `,
    date: '2024.09.12',
    readTime: '8 min read',
    category: 'DevOps',
  },
  {
    id: 'rust-vs-go',
    title: 'Rust vs Go: A Pragmatic Backend Comparison',
    excerpt: 'Evaluating both languages not on synthetic benchmarks, but on developer ergonomics, ecosystem maturity, and maintenance overhead for a small engineering team scaling a data-intensive API.',
    content: `
Selecting a backend technology stack is often decided by personal hype rather than practical engineering constraints. For data-intensive REST/gRPC microservices, both Rust and Go are exceptional choices, but they solve different organizational problems.

### Go: Built for Teams & Velocity
Go prioritizes simplicity and velocity above all else. Its minimal language specs mean a junior engineer can read, understand, and contribute to complex microservices in less than a week.

**The Pros:**
- Fast compile times enabling rapid local deployment loops.
- Industry-leading concurrency primitives (Go-channels) built right into the runtime.
- Simple, predictable GC (Garbage Collector) tuned for sub-millisecond pauses.

### Rust: Built for Precision & Resource Safety
Rust trades compiling velocity for extreme system safety and unmatched runtime efficiency. It eliminates entire classes of concurrency memory bugs at compile time.

**The Pros:**
- Zero runtime overhead: No Garbage Collector overhead or unexpected pause pauses.
- Powerful algebraic type systems that enforce strict error safety.
- Excellent memory characteristics: Ideal for container packaging where every megabyte counts.

### Pragmatic Recommendation
If your project is dominated by standard business logic, simple API proxies, and tight deadlines: **Choose Go**. The speed of shipping code outweighs the microscopic performance gains of native binary compiles.

If your project is building custom caches, database engines, or dealing with highly memory-constrained environments where thread safety is vital: **Choose Rust**. It is a tool for precision digital craftsmanship.
    `,
    date: '2024.08.05',
    readTime: '10 min read',
    category: 'Architecture',
  },
  {
    id: 'idempotent-api',
    title: 'Designing Idempotent APIs',
    excerpt: 'Why idempotency is critical for financial transactions and how to enforce it at the database layer using unique constraints and distributed lock patterns.',
    content: `
An API is idempotent if executing multiple identical requests has the same effect as executing a single request. 
In payment processing or booking systems, network retries make idempotency a strict requirement to avoid double-charging users.

### The Idempotency Key Pattern
The industry standard pattern involves the client attaching a unique UUID header (\`Idempotency-Key\`) to stateful mutations:

1. **Check Cache:** The server checks if the Idempotency Key is already stored in Redis.
2. **If Found:** Return the cached response directly without re-executing business logic.
3. **If Miss:** Place a lock, execute the mutation database records, save response in Redis, and release lock.

### Database Lock safety
Using unique constraints in PostgreSQL is a highly robust method to avoid race conditions when two identical keys hit the system concurrently:

\`\`\`sql
CREATE TABLE idempotency_records (
    key_hash VARCHAR(64) PRIMARY KEY,
    response_payload JSONB NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
\`\`s
\`\`\`

By enforcing integrity at the database layer, you protect financial ledger operations from dirty writes or parallel duplication bugs.
    `,
    date: '2024.06.18',
    readTime: '5 min read',
    category: 'Architecture',
  },
];

export default function BlogView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const postsPerPage = 4;

  // Filter posts
  const filteredPosts = BLOG_POSTS.filter((post) =>
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
      {selectedPost ? (
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
            <div className="font-sans text-brand-on-surface-variant leading-relaxed text-sm md:text-base space-y-6">
              {selectedPost.content.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith('```')) {
                  // Preformatted Code blocks
                  const codeLines = trimmed.replace(/```[a-zA-Z]*/g, '').replace(/```/g, '').trim();
                  return (
                    <pre
                      key={idx}
                      className="bg-[#131313] border border-brand-border/60 rounded p-4 font-mono text-xs text-brand-on-surface overflow-x-auto my-4 leading-relaxed"
                    >
                      <code>{codeLines}</code>
                    </pre>
                  );
                }
                if (trimmed.startsWith('###')) {
                  // Subheadings
                  return (
                    <h3
                      key={idx}
                      className="font-mono text-base md:text-lg font-bold text-brand-on-surface pt-4 text-glow border-b border-brand-border/20 pb-1"
                    >
                      {trimmed.replace('###', '').trim()}
                    </h3>
                  );
                }
                if (trimmed.startsWith('-')) {
                  // Bullet lists
                  return (
                    <ul key={idx} className="list-disc list-inside pl-4 space-y-2 text-sm">
                      {trimmed.split('\n').map((li, liIdx) => (
                        <li key={liIdx}>{li.replace('-', '').trim()}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx}>{trimmed}</p>;
              })}
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
              className={`font-mono text-xs text-brand-on-surface-variant hover:text-brand-primary transition-colors flex items-center gap-2 cursor-pointer ${
                currentPage === 1 ? 'opacity-40 cursor-not-allowed' : ''
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
              className={`font-mono text-xs text-brand-on-surface-variant hover:text-brand-primary transition-colors flex items-center gap-2 cursor-pointer ${
                currentPage === totalPages || totalPages === 0 ? 'opacity-40 cursor-not-allowed' : ''
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
