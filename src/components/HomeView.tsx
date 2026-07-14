'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Link2, FileText, Check, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import MusicPlayer from './MusicPlayer';

type ResponseData = {
    totalCommits: number,
    currentStreak: number,
    totalRepos: number,
    totalLCSolved: number
}

export default function HomeView() {
  const router = useRouter();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [githubData, setGithubData] = useState<ResponseData>();

  useEffect(() => {
    const getGithubStats = async () => {
      const res = await fetch('/api/github-stats');
      const data = await res.json();
      setGithubData(data);
    };
    getGithubStats();
  }, []);


  const stats = [
    { label: 'commits_ytd', value: githubData?.totalCommits, color: 'text-brand-primary' },
    { label: 'current_streak', value: githubData?.currentStreak, color: 'text-brand-secondary' },
    { label: 'total_repos', value: githubData?.totalRepos, color: 'text-[#f38764]' },
    { label: 'lc_solved', value: githubData?.totalLCSolved, color: 'text-[#ffb59e]' },
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('rakshit0702@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
    window.location.href = 'mailto:rakshit0702@gmail.com';
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Intro Section */}
      <div className="flex flex-col items-center text-center mt-8 mb-16">
        {/* Profile Avatar Frame */}
        <div className="relative group mb-8">
          {/* Cybernetic overlay and rotating border */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative w-36 h-36 rounded-full overflow-hidden border border-brand-border bg-[#1c1b1b] flex items-center justify-center">
            <img
              src="https://github.com/StackFox.png"
              alt="Developer Avatar"
              className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500 scale-105"
            />
            {/* Scanline Overlay effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-mono text-3xl md:text-5xl font-extrabold text-brand-on-surface tracking-tight mb-4">
          Rakshit Sharma
        </h1>

        {/* Subtitle / Shell Mock */}
        <div className="max-w-xl font-mono text-xs md:text-sm text-brand-on-surface-variant leading-relaxed mb-8 flex items-start gap-2 bg-[#1c1b1b]/60 border border-brand-border/40 p-4 rounded-lg">
          <span className="text-brand-primary text-base select-none">$</span>
          <span className="text-left block">
            I know frontend about as well as I know French –{' '}
            <span className="text-brand-secondary italic">bonjour</span>, that's it.
          </span>
        </div>

        {/* Circular Action Links */}
        <div className="flex gap-4 items-center">
          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="w-12 h-12 rounded-full bg-[#1c1b1b] hover:bg-brand-primary hover:text-black border border-brand-border hover:border-brand-primary text-brand-primary flex items-center justify-center transition-all duration-300 relative group cursor-pointer shadow-lg"
            title="Copy Portfolio Link"
          >
            {copiedLink ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-[#2a2a2a] text-brand-on-surface text-xs font-mono py-1 px-2 rounded border border-brand-border pointer-events-none whitespace-nowrap z-20">
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </span>
          </button>

          {/* Email Button */}
          <button
            onClick={handleCopyEmail}
            className="w-12 h-12 rounded-full bg-[#1c1b1b] hover:bg-brand-primary hover:text-black border border-brand-border hover:border-brand-primary text-brand-primary flex items-center justify-center transition-all duration-300 relative group cursor-pointer shadow-lg"
            title="Email Me"
          >
            {copiedEmail ? <Check className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-[#2a2a2a] text-brand-on-surface text-xs font-mono py-1 px-2 rounded border border-brand-border pointer-events-none whitespace-nowrap z-20">
              {copiedEmail ? 'Opening mail...' : 'Email'}
            </span>
          </button>

          {/* Resume Button */}
          <button
            onClick={() => setShowResumeModal(true)}
            className="w-12 h-12 rounded-full bg-[#1c1b1b] hover:bg-brand-primary hover:text-black border border-brand-border hover:border-brand-primary text-brand-primary flex items-center justify-center transition-all duration-300 relative group cursor-pointer shadow-lg"
            title="View Resume / Credentials"
          >
            <FileText className="w-5 h-5" />
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-[#2a2a2a] text-brand-on-surface text-xs font-mono py-1 px-2 rounded border border-brand-border pointer-events-none whitespace-nowrap z-20">
              View Resume
            </span>
          </button>
        </div>

        {/* System Synth / Now Playing Widget */}
        <MusicPlayer />
      </div>

      {/* Terminal Stat Grid */}
      {githubData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-[#1c1b1b]/80 border border-brand-border rounded-lg p-5 flex flex-col gap-3 glow-primary-hover transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Mock Window Controls */}
              <div className="flex items-center gap-1.5 border-b border-brand-border/30 pb-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>

              {/* Stat Details */}
              <div className="flex flex-col">
                <div className="font-mono text-xs text-brand-on-surface-variant/80 mb-1">
                  {stat.label}
                </div>
                <div className={`font-mono text-2xl font-bold ${stat.color} text-glow`}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <div className="border border-brand-border bg-[#1c1b1b]/40 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h3 className="font-mono text-lg font-bold text-brand-on-surface mb-1">
            Want to build something bulletproof?
          </h3>
          <p className="font-sans text-sm text-brand-on-surface-variant">
            Explore my production projects or read my architectural breakdowns.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/projects')}
            className="px-4 py-2 rounded bg-brand-primary text-black font-mono text-xs font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            /projects
          </button>
          <button
            onClick={() => router.push('/skills')}
            className="px-4 py-2 rounded border border-brand-border text-brand-primary font-mono text-xs hover:border-brand-primary transition-all cursor-pointer bg-[#131313]"
          >
            /skills
          </button>
        </div>
      </div>

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-[#131313]/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#1c1b1b] border border-brand-border rounded-lg max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Title bar */}
            <div className="bg-[#2a2a2a] px-4 py-3 border-b border-brand-border flex justify-between items-center">
              <div className="flex items-center gap-2 font-mono text-xs text-brand-on-surface">
                <FileText className="w-4 h-4 text-brand-primary" />
                <span>system_resume_v2.1.sh</span>
              </div>
              <button
                onClick={() => setShowResumeModal(false)}
                className="text-brand-on-surface-variant hover:text-brand-primary text-sm font-mono cursor-pointer"
              >
                [ESC_CLOSE]
              </button>
            </div>

            {/* Modal Scroll content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm font-sans">
              <div className="border-b border-brand-border pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
                <div>
                  <h2 className="text-xl font-mono font-bold text-brand-primary">Rakshit Portfolio</h2>
                  <p className="text-xs text-brand-on-surface-variant font-mono mt-1">
                    Senior Backend Developer & System Architect
                  </p>
                </div>
                <div className="text-xs text-brand-on-surface-variant font-mono">
                  <div>Location: Earth (Remote)</div>
                  <div>Email: rakshit0702@gmail.com</div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <h3 className="font-mono text-xs text-brand-primary border-b border-brand-border pb-1 uppercase tracking-wider">
                  // Professional Experience
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-brand-on-surface">Senior Software Engineer — HyperScale Corp</span>
                      <span className="font-mono text-xs text-brand-on-surface-variant">2022 - Present</span>
                    </div>
                    <p className="text-xs text-brand-on-surface-variant/80 mt-1">
                      Designed and maintained fault-tolerant microservices handles 1M+ concurrent TCP sessions. Rewrote slow query indexing routines to boost API speeds by 400%.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-brand-on-surface">Backend Lead — LogicCloud Solutions</span>
                      <span className="font-mono text-xs text-brand-on-surface-variant">2019 - 2022</span>
                    </div>
                    <p className="text-xs text-brand-on-surface-variant/80 mt-1">
                      Orchestrated migration from bare metal servers to Kubernetes, deploying high availability Redis clusters and PostgreSQL database replication schemas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-2">
                <h3 className="font-mono text-xs text-brand-primary border-b border-brand-border pb-1 uppercase tracking-wider">
                  // Education & Certifications
                </h3>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-brand-on-surface">B.S. in Computer Science & Engineering</span>
                  <span className="font-mono text-brand-on-surface-variant">Class of 2019</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-brand-border">
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="px-4 py-2 bg-brand-primary text-black font-mono text-xs font-semibold rounded hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
