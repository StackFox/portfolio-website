'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { Database, Terminal as TermIcon, HardDrive, Cpu, Send, CheckCircle2, Trash2 } from 'lucide-react';
import { ActivityCalendar } from 'react-activity-calendar';
import { GuestbookMessage, ActivityCalendarData } from '../types';

export default function AboutView() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [msgInput, setMsgInput] = useState('');
  const [wittyQuote, setWittyQuote] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<ActivityCalendarData | null>(null);
  const [activityLoading, setActivityLoading] = useState(true);

  // Load and save messages in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('developer_guestbook');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Initial seeds
      const initial: GuestbookMessage[] = [
        { id: '1', name: 'recruiter_bot_9000', message: 'Incredible system latency! Sending interview packet now.', timestamp: Date.now() - 3600000 * 24 },
        { id: '2', name: 'db_admin_sam', message: 'Your Redis stampede post saved our production stack. Coffee on me!', timestamp: Date.now() - 3600000 * 5 },
      ];
      setMessages(initial);
      localStorage.setItem('developer_guestbook', JSON.stringify(initial));
    }
  }, []);

  // Fetch activity calendar data
  useEffect(() => {
    fetch('/api/activity-calendar')
      .then((res) => res.json())
      .then((data: ActivityCalendarData) => setActivityData(data))
      .catch((err) => console.error('Failed to load activity calendar:', err))
      .finally(() => setActivityLoading(false));
  }, []);

  const handleSubmitMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !msgInput.trim()) return;

    const newMsg: GuestbookMessage = {
      id: Math.random().toString(),
      name: nameInput.trim().toLowerCase().replace(/\s+/g, '_'),
      message: msgInput.trim(),
      timestamp: Date.now(),
    };

    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem('developer_guestbook', JSON.stringify(updated));

    setNameInput('');
    setMsgInput('');
  };

  const handleClearMessages = () => {
    setMessages([]);
    localStorage.setItem('developer_guestbook', JSON.stringify([]));
  };

  const handleShoutoutClick = (tool: string) => {
    const quotes: Record<string, string> = {
      PostgreSQL: "Because SQLite wasn't meant for multi-node scale and Oracle costs a kidney.",
      Linux: "Compile, crash, deploy, repeat. If it fits, it ships.",
      Redis: "Literally saving our PostgreSQL clusters from meltdown since 2017.",
      Docker: "'It worked on my machine' — so we containerized my machine and now we ship my machine.",
    };
    setWittyQuote(quotes[tool] || null);
    setTimeout(() => setWittyQuote(null), 8000);
  };

  return (
    <div className="w-full space-y-16">
      {/* Asymmetric Profile Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-8">
        <div className="md:col-span-7 space-y-6">
          <h1 className="font-mono text-4xl md:text-5xl font-extrabold text-brand-primary">
            <span className="text-brand-on-surface-variant/40">~/</span>about_me
            <span className="animate-pulse">_</span>
          </h1>
          <p className="font-sans text-base md:text-lg text-brand-on-surface-variant leading-relaxed max-w-2xl">
            I'm a backend engineer who spends too much time optimizing database queries that already run in 10ms. 
            I believe in clean architecture, exhaustive testing, and the undeniable truth that caching is the hardest problem in computer science.
          </p>
        </div>

        <div className="md:col-span-5 flex justify-center md:justify-end">
          <div className="relative w-64 h-64 rounded-xl overflow-hidden border border-brand-border glow-primary">
            <Image
              src="https://github.com/StackFox.png"
              alt="Rakshit Sharma"
              fill
              sizes="256px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Activity Calendars */}
      <section className="space-y-6">
        <div>
          <h2 className="font-mono text-xl md:text-2xl font-bold text-brand-on-surface">
            Activity Logs
          </h2>
          <p className="font-sans text-xs md:text-sm text-brand-on-surface-variant mt-2">
            Contribution history across platforms.
          </p>
        </div>
        {activityLoading ? (
          <div className="bg-[#1c1b1b] border border-brand-border rounded-lg p-6 animate-pulse min-h-[200px]">
            <p className="font-mono text-xs text-brand-on-surface-variant">Loading activity data...</p>
          </div>
        ) : activityData ? (
          <div className="space-y-4">
            {activityData.githubCalendar.length > 0 && (
              <div className="bg-[#1c1b1b] border border-brand-border rounded-lg p-4 overflow-x-auto">
                <p className="font-mono text-[10px] text-brand-on-surface-variant mb-3">// GitHub Contributions</p>
                <ActivityCalendar
                  data={activityData.githubCalendar}
                  theme={{ dark: ['#1c1b1b', '#0e4429', '#006d32', '#26a641', '#39d353'] }}
                  blockSize={14}
                  blockMargin={4}
                  fontSize={12}
                />
              </div>
            )}
            {activityData.leetcodeCalendar.length > 0 && (
              <div className="bg-[#1c1b1b] border border-brand-border rounded-lg p-4 overflow-x-auto">
                <p className="font-mono text-[10px] text-brand-on-surface-variant mb-3">// LeetCode Submissions</p>
                <ActivityCalendar
                  data={activityData.leetcodeCalendar}
                  theme={{ dark: ['#1c1b1b', '#4fdbc8', '#4fdbc8', '#4fdbc8', '#4fdbc8'] }}
                  blockSize={14}
                  blockMargin={4}
                  fontSize={12}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#1c1b1b] border border-brand-border rounded-lg p-6">
            <p className="font-mono text-xs text-brand-on-surface-variant">Activity data unavailable.</p>
          </div>
        )}
      </section>

      {/* Terminal fact list */}
      <section className="grid grid-cols-1 gap-6">
        <div className="bg-[#1c1b1b] rounded-lg border border-brand-border overflow-hidden shadow-lg glow-primary">
          {/* Mock Title bar */}
          <div className="bg-[#2a2a2a] px-4 py-2 flex items-center gap-2 border-b border-brand-border">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            <span className="ml-4 font-mono text-[10px] text-brand-on-surface-variant/70">bash - whoami</span>
          </div>

          {/* Terminal commands */}
          <div className="p-6 font-mono text-xs text-brand-on-surface space-y-4 leading-relaxed">
            <div className="flex">
              <span className="text-brand-primary mr-2">$</span>
              <span className="text-brand-secondary">cat</span>{' '}
              <span className="text-brand-on-surface ml-2">/etc/location</span>
            </div>
            <div className="pl-4 text-brand-on-surface-variant/80">&gt; Delhi, India</div>

            <div className="flex mt-4">
              <span className="text-brand-primary mr-2">$</span>
              <span className="text-brand-secondary">echo</span>{' '}
              <span className="text-brand-on-surface ml-2">$CURRENT_ROLE</span>
            </div>
            <div className="pl-4 text-brand-on-surface-variant/80">&gt; Freelance developer</div>

            <div className="flex mt-4">
              <span className="text-brand-primary mr-2">$</span>
              <span className="text-brand-secondary">tail</span>{' '}
              <span className="text-brand-on-surface ml-2">-f /var/log/status</span>
            </div>
            <div className="pl-4 text-brand-primary animate-pulse">
              &gt; currently trying not to procrastinate on writing documentation...
            </div>
          </div>
        </div>
      </section>

      {/* Built on the shoulders of nerds shoutouts */}
      <section className="space-y-6">
        <div>
          <h2 className="font-mono text-xl md:text-2xl font-bold text-brand-on-surface">
            Built on the shoulders of nerds
          </h2>
          <p className="font-sans text-xs md:text-sm text-brand-on-surface-variant mt-2">
            Open source tools I couldn't live without. Click to inspect developer commentary.
          </p>
        </div>

        {/* Witty Quote popover if selected */}
        {wittyQuote && (
          <div className="bg-[#1c1b1b] border border-brand-primary/40 rounded p-4 font-mono text-xs text-brand-primary animate-in fade-in slide-in-from-top-2 duration-300">
            &gt; {wittyQuote}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => handleShoutoutClick('PostgreSQL')}
            className="bg-[#1c1b1b]/80 border border-brand-border rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:border-brand-primary/50 hover:bg-[#1c1b1b] transition-all cursor-pointer group hover:-translate-y-1"
          >
            <Database className="w-8 h-8 text-brand-on-surface-variant group-hover:text-brand-primary transition-colors" />
            <span className="font-mono text-xs text-brand-on-surface">PostgreSQL</span>
          </div>

          <div
            onClick={() => handleShoutoutClick('Linux')}
            className="bg-[#1c1b1b]/80 border border-brand-border rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:border-brand-primary/50 hover:bg-[#1c1b1b] transition-all cursor-pointer group hover:-translate-y-1"
          >
            <TermIcon className="w-8 h-8 text-brand-on-surface-variant group-hover:text-brand-primary transition-colors" />
            <span className="font-mono text-xs text-brand-on-surface">Linux</span>
          </div>

          <div
            onClick={() => handleShoutoutClick('Redis')}
            className="bg-[#1c1b1b]/80 border border-brand-border rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:border-brand-primary/50 hover:bg-[#1c1b1b] transition-all cursor-pointer group hover:-translate-y-1"
          >
            <HardDrive className="w-8 h-8 text-brand-on-surface-variant group-hover:text-brand-primary transition-colors" />
            <span className="font-mono text-xs text-brand-on-surface">Redis</span>
          </div>

          <div
            onClick={() => handleShoutoutClick('Docker')}
            className="bg-[#1c1b1b]/80 border border-brand-border rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:border-brand-primary/50 hover:bg-[#1c1b1b] transition-all cursor-pointer group hover:-translate-y-1"
          >
            <Cpu className="w-8 h-8 text-brand-on-surface-variant group-hover:text-brand-primary transition-colors" />
            <span className="font-mono text-xs text-brand-on-surface">Docker</span>
          </div>
        </div>
      </section>

      {/* Guestbook persistent terminal */}
      <section className="space-y-6">
        <div>
          <h2 className="font-mono text-xl md:text-2xl font-bold text-brand-on-surface">
            Secure Guestbook Logs
          </h2>
          <p className="font-sans text-xs md:text-sm text-brand-on-surface-variant mt-2">
            Leave a record of your visit to this node. Stored inside your persistent client cookie logs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-5 bg-[#1c1b1b] border border-brand-border p-5 rounded-lg space-y-4">
            <h3 className="font-mono text-xs text-brand-primary uppercase tracking-wider">// New Entry Payload</h3>
            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] text-brand-on-surface-variant">NODE_ALIAS:</label>
                <input
                  type="text"
                  placeholder="e.g. guest_user_401"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#131313] border border-brand-border rounded px-3 py-2 font-mono text-xs text-brand-on-surface outline-none focus:border-brand-primary"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] text-brand-on-surface-variant">MESSAGE_BUFFER:</label>
                <textarea
                  rows={3}
                  placeholder="Leave a message or suggestion..."
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  className="w-full bg-[#131313] border border-brand-border rounded px-3 py-2 font-sans text-xs text-brand-on-surface outline-none focus:border-brand-primary resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary/80 text-black font-mono text-xs font-semibold py-2 rounded flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WRITE_TO_SECTOR</span>
              </button>
            </form>
          </div>

          {/* Right Column: Feed log */}
          <div className="lg:col-span-7 bg-[#1c1b1b]/60 border border-brand-border rounded-lg p-5 flex flex-col gap-4 max-h-[360px] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
              <span className="font-mono text-xs text-brand-secondary">// Active Streams</span>
              {messages.length > 0 && (
                <button
                  onClick={handleClearMessages}
                  className="text-[10px] font-mono text-brand-on-surface-variant hover:text-red-400 flex items-center gap-1 cursor-pointer"
                  title="Purge logs"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>[PURGE_LOGS]</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((m) => (
                  <div key={m.id} className="text-xs font-mono border-l-2 border-brand-primary pl-3 py-0.5 space-y-1">
                    <div className="flex justify-between text-[10px] text-brand-on-surface-variant/80">
                      <span className="text-brand-secondary">@{m.name}</span>
                      <span>{new Date(m.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-brand-on-surface font-sans leading-relaxed">{m.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-brand-on-surface-variant/50 font-mono italic">
                  Node records are clean. Leave the first footprint!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
