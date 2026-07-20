'use client';

import { useState } from 'react';
import { Gavel, Link, Database, Search, Terminal, ArrowUpRight, Code } from 'lucide-react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Project } from '../types';

const PROJECTS: Project[] = [
  {
    id: 'legalsaathi',
    title: 'LegalSaathi',
    description: 'AI-powered legal aid platform providing accessible legal guidance to Indian citizens. Uses RAG with real Indian legal statutes to deliver cited legal information in 10 Indian languages.',
    updatedText: 'updated recently',
    tags: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Pinecone', 'Gemini AI'],
    iconName: 'gavel',
    githubUrl: 'https://github.com/StackFox/LegalSaathi',
    liveUrl: 'https://legal-saathi-six.vercel.app',
    architectureDetails: `
Pipeline Flow:
[User Query (Text/Voice)] ---> [Next.js API Route] ---> [Gemini 2.5 Flash + Embeddings]
                                                              |
                                                              +---> [Pinecone Vector DB (Legal Statutes)]
                                                              |
                                                              +---> [RAG Pipeline]
                                                                        |
                                                                        +---> Domain Classification (Tenancy, Police, Consumer, etc.)
                                                                        +---> Confidence Scoring (High/Medium/Low)
                                                                        +---> Cited Response (Act, Section, Relevance)

Key Features:
- RAG pipeline with Google Gemini 2.5 Flash + Pinecone for accurate legal citations.
- Multilingual support across 10 Indian languages with i18n context.
- Voice input via Web Speech API for accessibility.
- Clerk authentication with Email/Password + Google OAuth.
- Admin analytics dashboard for tracking queries, escalations, and domain distribution.
    `,
  },
  {
    id: 'linkzap',
    title: 'LinkZap',
    description: 'Simple, clean URL shortener built with Next.js. Shorten links quickly with a minimal interface.',
    updatedText: 'updated recently',
    tags: ['Next.js', 'JavaScript', 'CSS'],
    iconName: 'link',
    githubUrl: 'https://github.com/StackFox/LinkZap',
    architectureDetails: `
Pipeline Flow:
[User] ---> [Next.js Frontend] ---> [API Route] ---> [Short URL Generator]
                                                            |
                                                            +---> [Database (URL Storage)]
                                                            |
                                                            +---> [Redirect Handler]

Key Features:
- Clean, minimal interface for shortening URLs.
- Next.js App Router with server-side rendering.
- Responsive design with CSS modules.
    `,
  },
  {
    id: 'aura-pdf',
    title: 'AuraPDF',
    description: 'A RAG application for natural language processing on PDF files. Ask questions about your PDFs and get AI-powered answers with source citations.',
    updatedText: 'updated recently',
    tags: ['TypeScript', 'Docker', 'RAG', 'AI'],
    iconName: 'database',
    githubUrl: 'https://github.com/StackFox/aura-pdf',
    architectureDetails: `
Pipeline Flow:
[User Upload (PDF)] ---> [Client App] ---> [Server API]
                                                  |
                                                  +---> [PDF Parser / Text Extractor]
                                                  |
                                                  +---> [Embedding Generator]
                                                  |
                                                  +---> [Vector Store]
                                                  |
                                                  +---> [RAG Query Pipeline]
                                                            |
                                                            +---> [LLM Response with Citations]

Key Features:
- Full-stack RAG application with client/server architecture.
- Docker Compose for easy deployment and development.
- Natural language querying over PDF content.
- Source citation tracking for AI-generated answers.
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
                <div className="flex gap-2">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-brand-primary text-black font-mono text-xs font-semibold rounded hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                    >
                      View on GitHub
                      <FaExternalLinkAlt className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 border border-brand-border text-brand-on-surface-variant font-mono text-xs rounded hover:border-brand-primary hover:text-brand-primary transition-all cursor-pointer"
                  >
                    [CLOSE]
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
