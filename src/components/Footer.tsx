'use client';

import Link from 'next/link';

export default function Footer() {
  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'Email', href: 'mailto:rakshit0702@gmail.com' },
  ];

  return (
    <footer className="w-full bg-[#0e0e0e] border-t border-brand-border py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Column: Signature */}
        <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
          <Link
            href="/about"
            className="font-mono text-lg font-bold text-brand-primary tracking-wider hover:opacity-85 transition-opacity"
          >
            RAKSHIT_SHARMA
          </Link>
          <div className="text-sm text-brand-on-surface-variant font-sans mt-2">
            © 2024 Built with coffee and regex.
          </div>
          <div className="text-xs text-brand-on-surface-variant/50 font-mono mt-1">
            Over-engineered on the backend, under-engineered on the frontend — exactly as advertised.
          </div>
        </div>

        {/* Right Column: Links */}
        <div className="flex flex-wrap gap-6 items-center justify-center">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm text-brand-on-surface-variant hover:text-brand-primary hover:text-glow transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
