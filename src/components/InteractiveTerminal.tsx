'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, X, AlertCircle } from 'lucide-react';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

interface InteractiveTerminalProps {
  onClose: () => void;
}

export default function InteractiveTerminal({ onClose }: InteractiveTerminalProps) {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'RAKSHIT_SHARMA Command Line Interface [v1.0.4]', type: 'success' },
    { text: "Type 'help' to resolve available parameters, or 'clear' to reset console.", type: 'output' },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Focus input on launch
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newLines = [...lines, { text: `$ ${input}`, type: 'input' as const }];
    setInput('');

    // Witty quotes list
    const csQuotes = [
      "There are only two hard things in Computer Science: cache invalidation and naming things. — Phil Karlton",
      "To understand recursion, one must first understand recursion. — Anonymous",
      "Any system over-engineered on the backend will naturally look humble on the frontend. — Rakshit",
      "Optimizing before you measure is the root of all engineering failure. — Donald Knuth",
      "It is not that I hate CSS, it is just that compile-time safety smells much sweeter. — System Architect",
    ];

    switch (cmd) {
      case 'help':
        setLines([
          ...newLines,
          { text: 'Available CLI instructions:', type: 'output' },
          { text: '  whoami    - Resolve active profile metadata', type: 'output' },
          { text: '  projects  - Query recent production deployments', type: 'output' },
          { text: '  skills    - Print key software stacks', type: 'output' },
          { text: '  blog      - Print publication indexes', type: 'output' },
          { text: '  about     - Navigate UI directly to /about_me', type: 'output' },
          { text: '  quote     - Fetch random CS wisdom', type: 'output' },
          { text: '  time      - Resolve localized ISO timestamp', type: 'output' },
          { text: '  clear     - Purge terminal records', type: 'output' },
          { text: '  close     - Dismiss terminal overlay', type: 'output' },
        ]);
        break;

      case 'whoami':
        setLines([
          ...newLines,
          { text: 'PROFILE_STATUS: Senior Backend Architect', type: 'success' },
          { text: 'GEOGRAPHY: Remote / Distributed / Earth', type: 'output' },
          { text: 'PRIMARY_EMAIL: rakshit0702@gmail.com', type: 'output' },
          { text: "SLOGAN: 'Coffee in, robust scalable microservices out.'", type: 'output' },
        ]);
        break;

      case 'projects':
        setLines([
          ...newLines,
          { text: 'Production System Topologies:', type: 'success' },
          { text: '  • LegalSaathi - High volume document search pipeline [Rust/PostgreSQL/ES]', type: 'output' },
          { text: '  • LinkZap     - URL Proxy redirect proxy [Go/Redis/gRPC/ClickHouse]', type: 'output' },
          { text: '  • CacheFlow   - Lock-free memory caching cluster [C++/ZeroMQ]', type: 'output' },
          { text: "Type 'about' or switch tabs to explore full visual blueprints.", type: 'output' },
        ]);
        break;

      case 'skills':
        setLines([
          ...newLines,
          { text: 'Recognized Core Stack Capabilities:', type: 'success' },
          { text: '  Languages: Go (95%), Rust (90%), C++ (80%), Typescript/Node (75%)', type: 'output' },
          { text: '  Databases: PostgreSQL, Redis Clusters, Elasticsearch, ClickHouse', type: 'output' },
          { text: '  DevOps: Kubernetes container pools, Docker multi-stage, Linux TCP/sockets tuning', type: 'output' },
        ]);
        break;

      case 'blog':
        setLines([
          ...newLines,
          { text: 'Active Publication Records:', type: 'success' },
          { text: '  • Optimizing Redis Caching for Microservices (2024.10.24)', type: 'output' },
          { text: '  • The Case for Vanilla Kubernetes (2024.09.12)', type: 'output' },
          { text: '  • Rust vs Go: A Pragmatic Backend Comparison (2024.08.05)', type: 'output' },
          { text: '  • Designing Idempotent APIs (2024.06.18)', type: 'output' },
        ]);
        break;

      case 'about':
        setLines([...newLines, { text: 'Navigating routes to /about...', type: 'success' }]);
        router.push('/about');
        break;

      case 'quote':
        const randomQuote = csQuotes[Math.floor(Math.random() * csQuotes.length)];
        setLines([...newLines, { text: `> ${randomQuote}`, type: 'success' }]);
        break;

      case 'time':
        setLines([...newLines, { text: `UTC_TIMESTAMP: ${new Date().toISOString()}`, type: 'output' }]);
        break;

      case 'clear':
        setLines([]);
        break;

      case 'close':
        onClose();
        break;

      default:
        setLines([
          ...newLines,
          { text: `bash: instruction not found: '${cmd}'. Execute 'help' to review syntax.`, type: 'error' },
        ]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-[#1c1b1b] border border-brand-border rounded-lg max-w-2xl w-full h-[70vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Terminal Header bar */}
        <div className="bg-[#2a2a2a] px-4 py-3 border-b border-brand-border flex justify-between items-center select-none">
          <div className="flex items-center gap-2 font-mono text-xs text-brand-on-surface">
            <Terminal className="w-4.5 h-4.5 text-brand-primary animate-pulse" />
            <span>developer@system-node: ~</span>
          </div>
          <button
            onClick={onClose}
            className="text-brand-on-surface-variant hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
            title="Dismiss Terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Console logs */}
        <div className="flex-grow p-6 overflow-y-auto font-mono text-xs space-y-2 select-text bg-[#131313]/95">
          {lines.map((line, i) => {
            let color = 'text-brand-on-surface-variant';
            if (line.type === 'input') color = 'text-brand-on-surface';
            else if (line.type === 'success') color = 'text-brand-primary';
            else if (line.type === 'error') color = 'text-red-400 flex items-center gap-1.5';

            return (
              <div key={i} className={`${color} leading-relaxed whitespace-pre-wrap`}>
                {line.type === 'error' && <AlertCircle className="w-3.5 h-3.5 inline-block" />}
                {line.text}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Command Input form */}
        <form
          onSubmit={handleCommand}
          className="bg-[#131313] border-t border-brand-border px-6 py-3 flex items-center gap-2 select-none"
        >
          <span className="font-mono text-xs text-brand-primary font-bold animate-pulse">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-transparent font-mono text-xs text-brand-on-surface outline-none placeholder:text-brand-on-surface-variant/40"
            placeholder="Type 'help' and press Enter..."
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
