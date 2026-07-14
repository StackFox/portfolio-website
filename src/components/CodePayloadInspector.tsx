'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, Code, Copy, Check } from 'lucide-react';

interface CodePayloadInspectorProps {
  isTerminalOpen: boolean;
  onClose: () => void;
}

export default function CodePayloadInspector({
  isTerminalOpen,
  onClose,
}: CodePayloadInspectorProps) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [sessionSecs, setSessionSecs] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSecs((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Retrieve count from guestbook
  const savedMsg = localStorage.getItem('developer_guestbook');
  const cachedMessagesCount = savedMsg ? JSON.parse(savedMsg).length : 2;

  const mockPayload = {
    service: 'developer-portfolio-api',
    node_environment: 'production',
    localized_time: new Date().toISOString(),
    session_status: {
      uptime_seconds: sessionSecs,
      active_route: pathname,
      terminal_drawer_state: isTerminalOpen ? 'ACTIVE_OPEN' : 'CLOSED',
    },
    client_cache_metrics: {
      guestbook_records: cachedMessagesCount,
      audio_synthesis_engine: 'WebAudioAPI_SynthWave_Core_v1',
      canvas_background_shader: 'Interactive_2D_Drift_Constellation',
    },
    loaded_manifests: {
      projects_schema: ['LegalSaathi (Rust)', 'LinkZap (Go)', 'CacheFlow (C++)'],
      blog_archived_count: 4,
      skills_diagnostic_count: 10,
    },
    authorized_keys_loaded: {
      GEMINI_API_KEY: 'DECLARED_HIDDEN_SERVER',
      APP_URL: window.location.origin,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(mockPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-[#1c1b1b] border border-brand-border rounded-lg max-w-xl w-full h-[65vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Title bar */}
        <div className="bg-[#2a2a2a] px-4 py-3 border-b border-brand-border flex justify-between items-center select-none">
          <div className="flex items-center gap-2 font-mono text-xs text-brand-on-surface">
            <Code className="w-4.5 h-4.5 text-brand-primary" />
            <span>API Response Inspector (HTTP 200 OK)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="text-brand-on-surface-variant hover:text-brand-primary p-1 rounded transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono border border-brand-border/40 hover:bg-[#131313]"
              title="Copy JSON Payload"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-primary" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED!' : 'COPY_JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-brand-on-surface-variant hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* JSON Preview Box */}
        <div className="flex-grow p-6 overflow-y-auto font-mono text-xs select-text bg-[#131313]/95 text-brand-secondary leading-relaxed">
          <pre className="text-brand-on-surface-variant">
            {JSON.stringify(mockPayload, null, 2)
              .replace(/"(service|node_environment|localized_time|session_status|client_cache_metrics|loaded_manifests|authorized_keys_loaded)"/g, '"<span class="text-brand-primary font-bold">$1</span>"')
              .replace(/"(ACTIVE_OPEN|CLOSED|production|WebAudioAPI_SynthWave_Core_v1|Interactive_2D_Drift_Constellation|DECLARED_HIDDEN_SERVER)"/g, '"<span class="text-brand-secondary">$1</span>"')
              .split('\n')
              .map((line, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: line }} />
              ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
