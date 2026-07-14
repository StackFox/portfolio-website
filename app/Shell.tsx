'use client';

import { useState, ReactNode } from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import BackgroundCanvas from '@/src/components/BackgroundCanvas';
import InteractiveTerminal from '@/src/components/InteractiveTerminal';
import CodePayloadInspector from '@/src/components/CodePayloadInspector';

export default function Shell({ children }: { children: ReactNode }) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCodeInspectorOpen, setIsCodeInspectorOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden select-none bg-[#131313] text-[#e5e2e1] antialiased">
      <BackgroundCanvas />

      <Header
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
        onToggleCodeMode={() => setIsCodeInspectorOpen(!isCodeInspectorOpen)}
      />

      <main className="flex-grow pt-24 pb-16 px-6 md:px-16 max-w-5xl mx-auto w-full relative z-10 flex flex-col">
        {children}
      </main>

      <Footer />

      {isTerminalOpen && (
        <InteractiveTerminal onClose={() => setIsTerminalOpen(false)} />
      )}

      {isCodeInspectorOpen && (
        <CodePayloadInspector
          isTerminalOpen={isTerminalOpen}
          onClose={() => setIsCodeInspectorOpen(false)}
        />
      )}
    </div>
  );
}
