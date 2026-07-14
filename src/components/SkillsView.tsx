'use client';

import { useState } from 'react';
import { Terminal, Database, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SkillItem } from '../types';

const SKILLS_DATA: SkillItem[] = [
  // Backend Systems
  { name: 'Rust', level: 90, category: 'Languages', description: 'Used for legal processing pipelines (LegalSaathi) and safe concurrent token parsing. Experienced in tokio multi-threading, custom error traits, and stream handling.' },
  { name: 'Go', level: 95, category: 'Languages', description: 'Primary language for highly concurrent proxy routers and shorteners (LinkZap). Expert in channels, select-case statements, go-routines, and HTTP fiber frameworks.' },
  { name: 'C++', level: 80, category: 'Languages', description: 'Used for ultra-low-latency consensus engines (CacheFlow). Expert in C++20 raw socket polling, std::move optimization, and memory pooling.' },
  { name: 'gRPC / Protobuf', level: 88, category: 'Languages', description: 'Implemented for microservice-to-microservice calls with strict proto schemas. Reduced payload overhead by 65% compared to REST/JSON.' },

  // Databases
  { name: 'PostgreSQL', level: 92, category: 'Databases', description: 'Highly skilled in complex indexing, EXPLAIN plan analysis, custom replication schemas, and connection pool optimization.' },
  { name: 'Redis', level: 94, category: 'Databases', description: 'Used extensively for cluster replication, sliding window rate limiters, Bloom filter proxies, and distributed cache locking.' },
  { name: 'Elasticsearch', level: 85, category: 'Databases', description: 'Implemented vector search matrices and customized indexing configurations for full-text legal corpus processing.' },

  // DevOps & Infrastructure
  { name: 'Docker / OCI Containers', level: 90, category: 'DevOps & Cloud', description: 'Multi-stage builds targeting highly slim images. Setup automated layer caches for speedy production builds.' },
  { name: 'Kubernetes', level: 88, category: 'DevOps & Cloud', description: 'Managed bare-metal k8s clusters. Confident writing YAML manifests, custom ingress controllers, and pod disruption budgets.' },
  { name: 'Linux System Administration', level: 92, category: 'DevOps & Cloud', description: 'Comfortable with bash scripting, systemd daemon setups, network socket tuning (TCP/IP), and advanced memory tracking.' },
];

export default function SkillsView() {
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(SKILLS_DATA[0]);
  const [typedCommand, setTypedCommand] = useState('skill --describe rust');

  const handleSkillClick = (skill: SkillItem) => {
    setActiveSkill(skill);
    setTypedCommand(`skill --describe ${skill.name.toLowerCase().replace(' / ', '_')}`);
  };

  // Group by category
  const categories = Array.from(new Set(SKILLS_DATA.map((s) => s.category)));

  return (
    <div className="w-full">
      {/* Title block */}
      <div className="mb-12">
        <h1 className="font-mono text-4xl md:text-5xl font-extrabold text-brand-on-surface mb-4">
          /skills
        </h1>
        <p className="font-sans text-base md:text-lg text-brand-on-surface-variant max-w-2xl leading-relaxed">
          My technical capabilities and systems expertise. Classically trained in performance optimization, concurrency, and robust infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left 7 Columns: Interactive Meters categorized */}
        <div className="lg:col-span-7 space-y-8">
          {categories.map((category) => (
            <div key={category} className="space-y-4">
              <h3 className="font-mono text-xs text-brand-primary uppercase tracking-widest border-b border-brand-border/40 pb-2">
                // {category}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SKILLS_DATA.filter((s) => s.category === category).map((skill) => {
                  const isActive = activeSkill?.name === skill.name;
                  return (
                    <div
                      key={skill.name}
                      onClick={() => handleSkillClick(skill)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 bg-[#1c1b1b]/80 flex flex-col gap-2 ${
                        isActive
                          ? 'border-brand-primary glow-primary bg-[#1c1b1b]'
                          : 'border-brand-border hover:border-brand-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs font-semibold text-brand-on-surface">
                          {skill.name}
                        </span>
                        <span className="font-mono text-[10px] text-brand-primary">
                          {skill.level}%
                        </span>
                      </div>

                      {/* Loading Meter bar */}
                      <div className="w-full bg-[#131313] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-primary h-full rounded-full transition-all duration-500 shadow-[0_0_4px_#4fdbc8]"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right 5 Columns: Mock terminal console for diagnostics */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h3 className="font-mono text-xs text-brand-secondary uppercase tracking-widest pb-1">
            // Diagnostic CLI Output
          </h3>

          <div className="bg-[#1c1b1b] border border-brand-border rounded-lg overflow-hidden flex flex-col shadow-xl flex-grow min-h-[350px]">
            {/* Window bar */}
            <div className="bg-[#2a2a2a] border-b border-brand-border px-4 py-2.5 flex items-center gap-1.5 justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="font-mono text-[10px] text-brand-on-surface-variant">bash - skills_query</span>
            </div>

            {/* CLI Console lines */}
            <div className="p-5 font-mono text-xs text-brand-on-surface-variant flex-grow flex flex-col gap-4 leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-brand-primary">$</span>
                <span className="text-brand-on-surface">{typedCommand}</span>
              </div>

              {activeSkill ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-brand-primary font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                    <span>DIAGNOSTIC RESOLVED: {activeSkill.name.toUpperCase()}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] text-brand-on-surface-variant/60 uppercase border-b border-brand-border/30 pb-0.5">
                      Description:
                    </div>
                    <p className="text-brand-on-surface text-xs leading-relaxed font-sans">
                      {activeSkill.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] text-brand-on-surface-variant/60 uppercase">
                      Operational Status:
                    </div>
                    <div className="flex items-center gap-1.5 text-brand-secondary text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                      <span>ONLINE & DEPLOYED IN PROD</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-brand-on-surface-variant/50 italic flex items-center gap-2 py-4">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Click a skill to execute diagnostics...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
