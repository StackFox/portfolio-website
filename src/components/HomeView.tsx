'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, FileText, ExternalLink, Check } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { motion } from 'motion/react';
import MusicPlayer from './MusicPlayer';
import { a } from 'motion/react-client';

type ResponseData = {
  totalCommits: number,
  currentStreak: number,
  totalRepos: number,
  totalLCSolved: number
}

export default function HomeView() {
  const router = useRouter();
  const [copiedEmail, setCopiedEmail] = useState(false);
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

  const handleResumeClick = () => {
    // TODO: Add analytics when a user clicks on the button
    window.open(
      "https://drive.google.com/file/d/16kuws3BlyAFBnvqVEdsQ17q3LXU9rKPG/view?usp=sharing",
      "_blank",
      "noopener,noreferrer"
    );
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
            <Image
              src="https://github.com/StackFox.png"
              alt="Rakshit Sharma — GitHub avatar"
              className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500 scale-105"
              width={144}
              height={144}
              priority
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
          {/* GitHub Profile Button */}
          <a
            href="https://github.com/StackFox"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#1c1b1b] hover:bg-brand-primary hover:text-black border border-brand-border hover:border-brand-primary text-brand-primary flex items-center justify-center transition-all duration-300 relative group cursor-pointer shadow-lg"
            title="GitHub Profile"
            aria-label="Visit GitHub profile"
          >
            <SiGithub className="w-5 h-5" />
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-[#2a2a2a] text-brand-on-surface text-xs font-mono py-1 px-2 rounded border border-brand-border pointer-events-none whitespace-nowrap z-20">
              GitHub
            </span>
          </a>

          {/* Email Button */}
          <button
            onClick={handleCopyEmail}
            className="w-12 h-12 rounded-full bg-[#1c1b1b] hover:bg-brand-primary hover:text-black border border-brand-border hover:border-brand-primary text-brand-primary flex items-center justify-center transition-all duration-300 relative group cursor-pointer shadow-lg"
            title="Email Me"
            aria-label="Send email to Rakshit Sharma"
          >
            {copiedEmail ? <Check className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-[#2a2a2a] text-brand-on-surface text-xs font-mono py-1 px-2 rounded border border-brand-border pointer-events-none whitespace-nowrap z-20">
              {copiedEmail ? 'Opening mail...' : 'Email'}
            </span>
          </button>

          {/* Resume Button */}
          <button
            onClick={() => { handleResumeClick() }}
            className="w-12 h-12 rounded-full bg-[#1c1b1b] hover:bg-brand-primary hover:text-black border border-brand-border hover:border-brand-primary text-brand-primary flex items-center justify-center transition-all duration-300 relative group cursor-pointer shadow-lg"
            title="View Resume"
            aria-label="Open resume in new tab"
          >
            <FileText className="w-5 h-5" />
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-[#2a2a2a] text-brand-on-surface text-xs font-mono py-1 px-2 rounded border border-brand-border pointer-events-none whitespace-nowrap z-20">
              View Resume
            </span>
          </button>
        </div>

        {/* System Synth / Now Playing Widget */}
        <div className="min-h-[76px] w-full flex justify-center">
          <MusicPlayer />
        </div>
      </div>

      {/* Terminal Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {githubData
          ? stats.map((stat, i) => (
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
            ))
          : stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#1c1b1b]/80 border border-brand-border rounded-lg p-5 flex flex-col gap-3 animate-pulse"
              >
                <div className="flex items-center gap-1.5 border-b border-brand-border/30 pb-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex flex-col">
                  <div className="font-mono text-xs text-brand-on-surface-variant/80 mb-1">
                    {stat.label}
                  </div>
                  <div className="font-mono text-2xl font-bold text-brand-on-surface-variant/20">
                    --
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* CTA Section */}
      <div className="border border-brand-border bg-[#1c1b1b]/40 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="font-mono text-lg font-bold text-brand-on-surface mb-1">
            Want to build something bulletproof?
          </h2>
          <p className="font-sans text-sm text-brand-on-surface-variant">
            Explore my projects or read my architectural breakdowns.
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
    </div >
  );
}
