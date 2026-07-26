'use client';

import { useState } from 'react';
import { Code, Terminal, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onToggleTerminal: () => void;
  onToggleCodeMode: () => void;
}

export default function Header({
  onToggleTerminal,
  onToggleCodeMode,
}: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const tabs = ['Projects', 'Skills', 'Blog', 'About'];

  const isActive = (tab: string) => {
    if (tab === 'About') return pathname === '/about';
    return pathname === `/${tab.toLowerCase()}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-[#131313]/85 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-xl font-bold text-brand-primary tracking-tight cursor-pointer hover:opacity-90 active:scale-95 transition-all text-glow"
        >
          RAKSHIT_SHARMA
        </Link>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex gap-8 h-full items-center">
          {tabs.map((tab) => {
            const active = isActive(tab);
            return (
              <Link
                key={tab}
                href={`/${tab.toLowerCase()}`}
                className={`h-full px-1 flex items-center font-mono text-sm relative transition-colors duration-200 cursor-pointer ${
                  active
                    ? 'text-brand-primary font-semibold'
                    : 'text-brand-on-surface-variant hover:text-brand-primary'
                }`}
              >
                {tab}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary shadow-[0_0_8px_#4fdbc8]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex gap-4 items-center">
          <button
            onClick={onToggleCodeMode}
            title="Inspect API / JSON mode"
            className="p-2 text-brand-primary hover:text-brand-secondary active:scale-90 transition-all rounded hover:bg-[#1c1b1b]"
          >
            <Code className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleTerminal}
            title="Open Interactive Terminal shell"
            className="p-2 text-brand-primary hover:text-brand-secondary active:scale-90 transition-all rounded hover:bg-[#1c1b1b] relative"
          >
            <Terminal className="w-5 h-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            title="Toggle navigation menu"
            className="md:hidden p-2 text-brand-primary hover:text-brand-secondary active:scale-90 transition-all rounded hover:bg-[#1c1b1b]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav className="md:hidden absolute top-16 left-0 right-0 bg-[#131313]/95 backdrop-blur-md border-b border-brand-border animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col px-4 py-4 gap-1">
            {tabs.map((tab) => {
              const active = isActive(tab);
              return (
                <Link
                  key={tab}
                  href={`/${tab.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 font-mono text-sm rounded transition-colors ${
                    active
                      ? 'text-brand-primary font-semibold bg-[#1c1b1b]'
                      : 'text-brand-on-surface-variant hover:text-brand-primary hover:bg-[#1c1b1b]/50'
                  }`}
                >
                  {`/${tab.toLowerCase()}`}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
