'use client';

import { useState } from 'react';
import { Gavel, Link, Cpu, Database, Search, Terminal, ArrowUpRight, Code } from 'lucide-react';
import { Project } from '../types';

const PROJECTS: Project[] = [
  {
    id: 'legalsaathi',
    title: 'LegalSaathi',
    description: 'A robust document management and processing pipeline for legal professionals. Built to handle massive PDF parsing and indexing with sub-second search times.',
    updatedText: 'updated 2d ago',
    tags: ['Rust', 'PostgreSQL', 'Elasticsearch'],
    iconName: 'gavel',
    architectureDetails: `
Pipeline Flow:
[Client] ---> [Actix-Web API (Rust)] ---> [Kafka Queue] ---> [OCR/Parsing Workers (Rust/Tesseract)]
                                                                    |
                                                                    +---> [PostgreSQL (Metadata)]
                                                                    +---> [Elasticsearch (Vector Indexes)]

Key Features:
- Stream-based multipart file uploads supporting PDFs up to 500MB.
- Sub-second fuzzy search queries across millions of pages using tailored tokenizers.
- Secure, read-restricted document download URLs protected by AES-GCM-256 tokens.
    `,
  },
  {
    id: 'linkzap',
    title: 'LinkZap',
    description: 'High-performance URL shortener and analytics engine. Designed for extreme concurrency and low latency redirect resolution.',
    updatedText: 'updated 5d ago',
    tags: ['Go', 'Redis', 'gRPC'],
    iconName: 'link',
    architectureDetails: `
Pipeline Flow:
[HTTP Redirect Request] ---> [Fiber Proxy (Go)] ---> [Redis Cache (Hot Links)]
                                      |
                                      +---> (Cache Miss) ---> [PostgreSQL Cluster]
                                      |
                                      +---> [gRPC Collector] ---> [ClickHouse Analytics]

Key Features:
- Real-time client-telemetry aggregation pipeline processing 20k+ logs/sec.
- Bloom Filter cache proxies optimized to instantly block 99.9% of invalid misses.
- Auto-collapsing redirect queues implementing sliding window counter algorithms.
    `,
  },
  {
    id: 'cacheflow',
    title: 'CacheFlow',
    description: 'Distributed, in-memory caching layer with automatic eviction strategies and persistent fallback. Experimental side project exploring consensus algorithms.',
    updatedText: 'updated 12d ago',
    tags: ['C++', 'ZeroMQ'],
    iconName: 'cpu',
    architectureDetails: `
Pipeline Flow:
[Client Node] ---> [ZeroMQ Router] ---> [Eviction Layer (LRU-K / ARC Cache)]
                                                    |
                                                    +---> [AOF Journal (Disk Sync)]
                                                    +---> [Raft Consensus Broker]

Key Features:
- Written in pure modern C++20 with raw socket polling and lock-free thread queues.
- Adaptive Eviction Engine dynamically shifting ratios based on hit/miss frequencies.
- Automated snapshot journaling and point-in-time recovery to maintain integrity.
    `,
  },
];

export default function ProjectsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Extract all unique technology tags
  const allTags = ['All', ...Array.from(new Set(PROJECTS.flatMap((p) => p.tags)))];

  // Filter projects based on search and tags
  const filteredProjects = PROJECTS.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || project.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'gavel':
        return <Gavel className="w-5 h-5 text-brand-primary" />;
      case 'link':
        return <Link className="w-5 h-5 text-brand-primary" />;
      case 'memory':
      case 'cpu':
        return <Cpu className="w-5 h-5 text-brand-primary" />;
      default:
        return <Database className="w-5 h-5 text-brand-primary" />;
    }
  };

  return (
    <div className="w-full">
      {/* Title block */}
      <div className="mb-12">
        <h1 className="font-mono text-4xl md:text-5xl font-extrabold text-brand-on-surface mb-4">
          /projects
        </h1>
        <p className="font-sans text-base md:text-lg text-brand-on-surface-variant max-w-2xl leading-relaxed">
          A selection of tools, services, and systems I've built. Focusing on performance, scalability, and clean architecture.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-brand-border/30">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-brand-on-surface-variant/70" />
          <input
            type="text"
            placeholder="Search system systems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1c1b1b] border border-brand-border rounded px-4 py-2 pl-10 font-mono text-xs focus:border-brand-primary outline-none transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider cursor-pointer transition-all duration-200 border ${
                selectedTag === tag
                  ? 'bg-brand-primary text-black border-brand-primary font-semibold shadow-[0_0_8px_#4fdbc8]'
                  : 'bg-[#1c1b1b] text-brand-on-surface-variant border-brand-border hover:border-brand-primary'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-6 mb-16">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-[#1c1b1b]/80 border border-brand-border rounded-lg p-6 glow-primary-hover transition-all duration-300 group flex flex-col md:flex-row gap-6 items-start cursor-pointer hover:-translate-y-[2px]"
            >
              {/* Left Column Icon Block */}
              <div className="flex-shrink-0 w-12 h-12 bg-[#2a2a2a] rounded-md flex items-center justify-center border border-brand-border group-hover:border-brand-primary transition-colors duration-300">
                {getIcon(project.iconName)}
              </div>

              {/* Right Column Content */}
              <div className="flex-grow flex flex-col gap-2 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h2 className="font-mono text-xl font-bold text-brand-on-surface group-hover:text-brand-primary transition-colors flex items-center gap-1.5">
                    {project.title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-brand-primary" />
                  </h2>
                  <span className="font-mono text-[10px] text-brand-on-surface-variant/80 px-2.5 py-1 bg-[#2a2a2a] rounded border border-brand-border/60">
                    {project.updatedText}
                  </span>
                </div>
                <p className="font-sans text-sm text-brand-on-surface-variant leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] text-brand-primary px-2.5 py-1 border border-brand-border/60 rounded bg-[#2a2a2a]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-12 bg-[#1c1b1b]/50 border border-brand-border rounded-lg">
            <Terminal className="w-8 h-8 text-brand-on-surface-variant/40 mx-auto mb-3" />
            <div className="font-mono text-sm text-brand-on-surface-variant">
              No matching systems found. Execute 'projects --all' or refine query.
            </div>
          </div>
        )}
      </div>

      {/* System Architecture Details Drawer Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-[#131313]/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#1c1b1b] border border-brand-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Title Bar */}
            <div className="bg-[#2a2a2a] px-4 py-3 border-b border-brand-border flex justify-between items-center">
              <div className="flex items-center gap-2 font-mono text-xs text-brand-on-surface">
                <Code className="w-4 h-4 text-brand-primary" />
                <span>system_design://{selectedProject.id}.conf</span>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-brand-on-surface-variant hover:text-brand-primary text-sm font-mono cursor-pointer"
              >
                [CLOSE_X]
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h2 className="font-mono text-2xl font-bold text-brand-primary">
                  {selectedProject.title}
                </h2>
                <p className="font-sans text-sm text-brand-on-surface-variant mt-2 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Architecture Map block */}
              <div>
                <h3 className="font-mono text-xs text-brand-secondary border-b border-brand-border pb-1 uppercase tracking-wider mb-2">
                  // Core Architecture Topology
                </h3>
                <pre className="bg-[#131313] border border-brand-border rounded p-4 font-mono text-xs text-brand-on-surface overflow-x-auto leading-relaxed">
                  {selectedProject.architectureDetails?.trim()}
                </pre>
              </div>

              {/* Technology metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#131313] border border-brand-border rounded p-3 text-center">
                  <div className="font-mono text-[10px] text-brand-on-surface-variant">Latency</div>
                  <div className="font-mono text-sm font-bold text-brand-primary mt-1">&lt;10ms</div>
                </div>
                <div className="bg-[#131313] border border-brand-border rounded p-3 text-center">
                  <div className="font-mono text-[10px] text-brand-on-surface-variant">Uptime</div>
                  <div className="font-mono text-sm font-bold text-brand-primary mt-1">99.99%</div>
                </div>
                <div className="bg-[#131313] border border-brand-border rounded p-3 text-center">
                  <div className="font-mono text-[10px] text-brand-on-surface-variant">Throughput</div>
                  <div className="font-mono text-sm font-bold text-brand-primary mt-1">100k+ req/s</div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-brand-border">
                <div className="flex gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] bg-[#2a2a2a] text-brand-on-surface-variant px-2 py-0.5 rounded border border-brand-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 bg-brand-primary text-black font-mono text-xs font-semibold rounded hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Terminate Diagnostic
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
