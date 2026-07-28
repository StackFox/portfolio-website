'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface NowPlayingData {
  isPlaying: boolean;
  track: string | null;
  artist: string;
  album: string;
  albumArt: string;
}

export default function MusicPlayer() {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/lastfm');
        const data = await res.json();
        setNowPlaying(data);
      } catch {
        // Silently fail
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!nowPlaying?.track) return null;

  return (
    <a
      href="https://www.last.fm/user/StackFox"
      target="_blank"
      rel="noreferrer"
      className="mt-10 flex items-center gap-4 w-full max-w-sm bg-[#1c1b1b]/80 border border-brand-border rounded-xl p-3 shadow-lg glow-primary-hover transition-all duration-300 hover:border-brand-primary/50 cursor-pointer group"
      aria-label={`Now playing: ${nowPlaying.track} by ${nowPlaying.artist}. View on Last.fm`}
    >
      {/* Album Art */}
      <div className="w-16 h-16 rounded-lg overflow-hidden border border-brand-border/50 flex-shrink-0 relative">
        <Image
          src={nowPlaying.albumArt}
          alt={`${nowPlaying.album} album cover`}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* Track Info */}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-mono font-semibold text-brand-on-surface truncate group-hover:text-brand-primary transition-colors duration-200">
          {nowPlaying.track}
        </div>
        <div className="text-xs font-mono text-brand-on-surface-variant/70 truncate mt-0.5">
          {nowPlaying.artist}
        </div>
      </div>

      {/* Sound Bars Animation */}
      <div className="flex items-end gap-[3px] h-5 flex-shrink-0" aria-hidden="true">
        <span className="w-[3px] bg-brand-primary rounded-full animate-[soundbar_0.8s_infinite_0s]" />
        <span className="w-[3px] bg-brand-primary rounded-full animate-[soundbar_0.8s_infinite_0.15s]" />
        <span className="w-[3px] bg-brand-primary rounded-full animate-[soundbar_0.8s_infinite_0.3s]" />
      </div>
    </a>
  );
}
