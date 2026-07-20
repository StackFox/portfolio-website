'use client';

import { useState } from 'react';
import { Terminal, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SkillItem } from '../types';

const SKILLS_DATA: SkillItem[] = [
  // Languages
  { name: 'JavaScript', level: 85, category: 'Languages', description: 'Primary language for full-stack web development. Used across React, Next.js, and Node.js projects including LinkZap, LifeQR, and the LinkTree clone.' },
  { name: 'TypeScript', level: 80, category: 'Languages', description: 'Used in Next.js and React projects for type-safe development. Applied in LegalSaathi, AuraPDF, and this portfolio website.' },
  { name: 'Python', level: 75, category: 'Languages', description: 'Used for backend scripting, AI-driven projects, and automation. Experience with Flask and data processing pipelines.' },
  { name: 'Java', level: 65, category: 'Languages', description: 'Basic proficiency. Currently learning Spring Boot for building robust backend APIs and microservices.' },
  { name: 'HTML / CSS', level: 85, category: 'Languages', description: 'Strong foundation in semantic HTML and modern CSS. Used Tailwind CSS extensively across projects for rapid UI development.' },
  { name: 'C / C++', level: 60, category: 'Languages', description: 'Basic proficiency from academic coursework. Understanding of memory management, OOP concepts, and data structures.' },

  // Frontend
  { name: 'React', level: 85, category: 'Frontend', description: 'Core frontend library used in most projects. Built interactive UIs with hooks, context API, and component-based architecture.' },
  { name: 'Next.js', level: 82, category: 'Frontend', description: 'Full-stack React framework used for LegalSaathi, LinkZap, LifeQR-frontend, and this portfolio. Experience with App Router, SSR, and API routes.' },
  { name: 'Tailwind CSS', level: 80, category: 'Frontend', description: 'Utility-first CSS framework used across all recent projects for fast, responsive UI development.' },
  { name: 'Vue.js', level: 55, category: 'Frontend', description: 'Basic experience with Vue components and reactive data binding. Listed in GitHub tech stack badges.' },

  // Backend & Databases
  { name: 'Node.js', level: 78, category: 'Backend & Databases', description: 'Server-side JavaScript runtime used for building REST APIs and handling business logic in Express-based applications.' },
  { name: 'Spring Boot', level: 50, category: 'Backend & Databases', description: 'Currently learning. Built a basic URL shortener (Linkly) with Spring Boot to explore Java backend development.' },
  { name: 'MongoDB', level: 72, category: 'Backend & Databases', description: 'NoSQL database used in LifeQR and LinkTree clone for flexible document storage and fast prototyping.' },
  { name: 'MySQL', level: 65, category: 'Backend & Databases', description: 'Relational database experience from academic projects and backend applications requiring structured data storage.' },

  // DevOps & Tools
  { name: 'Git / GitHub', level: 82, category: 'DevOps & Tools', description: 'Version control and collaboration. Active on GitHub with 30+ repositories. SSoC 2026 open source contributor. Experienced with PRs, branching, and code review.' },
  { name: 'Docker', level: 60, category: 'DevOps & Tools', description: 'Containerization basics. Used Docker Compose in AuraPDF for setting up client/server development environments.' },
  { name: 'VS Code', level: 85, category: 'DevOps & Tools', description: 'Primary IDE. Proficient with extensions, debugging, Git integration, and terminal workflows.' },
];

export default function SkillsView() {
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(SKILLS_DATA[0]);
  const [typedCommand, setTypedCommand] = useState('skill --describe javascript');

  const handleSkillClick = (skill: SkillItem) => {
    setActiveSkill(skill);
    setTypedCommand(`skill --describe ${skill.name.toLowerCase().replace(' / ', '_').replace(' ', '_')}`);
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
          My technical capabilities across frontend, backend, and tools. Full Stack Web Developer focused on React, Next.js, and modern JavaScript frameworks.
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
