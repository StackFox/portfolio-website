'use client';

import { useState, useEffect } from 'react';
import { Linkedin, Mail, Coffee } from 'lucide-react';
import { SiGithub, SiLeetcode, SiX } from 'react-icons/si';
import { motion, AnimatePresence } from 'motion/react';

const confessions = [
  "This footer took longer to design than most of my backend logic.",
  "Frontend polish level: I tried.",
  "This site is over-engineered on the backend and under-engineered on the frontend — exactly as advertised.",
];

export default function Footer() {
  const [confessionIndex, setConfessionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setConfessionIndex((prev) => (prev + 1) % confessions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com/StackFox', icon: SiGithub, size: 26 },
    { label: 'LeetCode', href: 'https://leetcode.com/u/jacoder69/', icon: SiLeetcode, size: 26 },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/rakshit-codes', icon: Linkedin, size: 26 },
    { label: 'X / Twitter', href: 'https://x.com/sharma_rak72933', icon: SiX, size: 26 },
    { label: 'Buy Me a Coffee', href: 'https://buymeacoffee.com/rakshit.dev', icon: Coffee, size: 26 },
    { label: 'Email', href: 'mailto:rakshit0702@gmail.com', icon: Mail, size: 26 },
  ];

  return (
    <footer className="relative w-full mt-auto">
      {/* Gradient fade from page bg to solid footer bg */}
      <div className="h-24 bg-gradient-to-b from-transparent to-[#0a0a0a]" />

      <div className="bg-[#0a0a0a] border-t border-brand-border/30">
        <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col items-center gap-12">

          {/* 1. Easter Egg Line */}
          <div className="text-center space-y-2">
            <p className="font-mono text-sm italic text-brand-on-surface-variant/50">
              &ldquo;Ah, you made it to the end.&rdquo;
            </p>
            <p className="font-mono text-xs text-brand-on-surface-variant/30">
              There&apos;s no prize. Just this footer. Congrats.
            </p>
          </div>

          {/* 2. Sarcastic Stats Strip */}
          <div className="w-full text-center">
            <p className="font-mono text-[11px] text-brand-on-surface-variant/40 leading-relaxed break-words">
              Coffee consumed: unmeasured &nbsp;&middot;&nbsp; Bugs fixed: some &nbsp;&middot;&nbsp; Bugs created: also some &nbsp;&middot;&nbsp; Uptime of this site: better than my sleep schedule
            </p>
          </div>

          {/* 3. Honest Footer Card — rotating confessions */}
          <div className="w-full border border-brand-border/40 rounded-xl bg-[#1c1b1b]/60 p-6 text-center min-h-[88px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={confessionIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5 }}
                className="font-mono text-sm text-brand-on-surface-variant/70"
              >
                &ldquo;{confessions[confessionIndex]}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>

          {/* 4. Real Contact Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:rakshit0702@gmail.com"
              className="px-6 py-2.5 rounded-lg border border-brand-primary text-brand-primary font-mono text-sm font-medium hover:bg-brand-primary hover:text-black transition-all duration-200"
            >
              Email me
            </a>
            <a
              href="https://drive.google.com/file/d/16kuws3BlyAFBnvqVEdsQ17q3LXU9rKPG/view?usp=sharing"
              target="_blank"
              className="px-6 py-2.5 rounded-lg border border-brand-primary text-brand-primary font-mono text-sm font-medium hover:bg-brand-primary hover:text-black transition-all duration-200"
            >
              Download resume
            </a>
          </div>

          {/* 5. Social Icons Row */}
          <div className="flex gap-5">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  title={link.label}
                  aria-label={link.label}
                  className="text-brand-on-surface-variant/50 hover:text-brand-primary transition-colors duration-200"
                >
                  <Icon size={link.size} />
                </a>
              );
            })}
          </div>

          {/* 6. Bottom Legal / Meta Line */}
          <p className="font-mono text-[10px] text-brand-on-surface-variant/30 text-center">
            &copy; 2026 Rakshit Sharma. Built with Next.js, mild sleep deprivation, and Stack Overflow.
          </p>

        </div>
      </div>
    </footer>
  );
}
