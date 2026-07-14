'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  bpm: number;
}

const TRACKS: Track[] = [
  { title: 'Lofi Synthwave Focus', artist: 'Coding Playlist Vol.1', bpm: 80 },
  { title: 'Cyberpunk DB Optimizer', artist: 'System Beats Vol.4', bpm: 90 },
  { title: 'Midnight Query Tuner', artist: 'Index Scan Sessions', bpm: 72 },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Web Audio synth refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);

  const activeTrack = TRACKS[trackIndex];

  // Increment simulated progress bar
  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNextTrack();
            return 0;
          }
          return prev + 0.5;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, trackIndex]);

  // Audio synthesis setup and loop
  const startSynthesizer = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const bpm = activeTrack.bpm;
      const stepDuration = 60 / bpm / 2; // eighth notes

      stepRef.current = 0;

      // Synth loop using nested scheduler or simple intervals
      synthIntervalRef.current = window.setInterval(() => {
        if (!ctx || ctx.state === 'suspended' || isMuted) return;

        const now = ctx.currentTime;
        const currentStep = stepRef.current;

        // Simple chord progression notes (A minor, F major, C major, G major)
        const chordProgressions = [
          [220, 261, 329], // Am (A3, C4, E4)
          [174, 220, 261], // F  (F3, A3, C4)
          [130, 164, 196], // C  (C3, E3, G3)
          [196, 246, 293], // G  (G3, B3, D4)
        ];

        const progressionIndex = Math.floor(currentStep / 8) % 4;
        const activeChord = chordProgressions[progressionIndex];

        // 1. Play Soft Pad Chord on first beat of bar
        if (currentStep % 8 === 0) {
          activeChord.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            // Soft attack and decay
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.08 * volume, now + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 7);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + stepDuration * 7);
          });
        }

        // 2. Play Cozy Lofi Kick Drum (every odd beat: 0, 4)
        if (currentStep % 4 === 0) {
          const kickOsc = ctx.createOscillator();
          const kickGain = ctx.createGain();

          kickOsc.frequency.setValueAtTime(150, now);
          kickOsc.frequency.exponentialRampToValueAtTime(0.01, now + 0.15);

          kickGain.gain.setValueAtTime(0.15 * volume, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          kickOsc.connect(kickGain);
          kickGain.connect(ctx.destination);

          kickOsc.start(now);
          kickOsc.stop(now + 0.16);
        }

        // 3. Play Soft Lofi Hihat / Snare (beat 2, 6)
        if (currentStep % 4 === 2) {
          // Soft snare-like white noise or high freq pop
          const snareOsc = ctx.createOscillator();
          const snareGain = ctx.createGain();

          snareOsc.type = 'triangle';
          snareOsc.frequency.setValueAtTime(800 + Math.random() * 200, now);

          snareGain.gain.setValueAtTime(0.03 * volume, now);
          snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          snareOsc.connect(snareGain);
          snareGain.connect(ctx.destination);

          snareOsc.start(now);
          snareOsc.stop(now + 0.09);
        }

        // 4. Cozy Melodic Arpeggio (every second step)
        if (currentStep % 2 === 0) {
          const arpNotes = [0, 2, 1, 2];
          const noteOffset = arpNotes[(currentStep / 2) % 4];
          const targetFreq = activeChord[noteOffset % activeChord.length] * 2; // octave higher

          const arpOsc = ctx.createOscillator();
          const arpGain = ctx.createGain();

          arpOsc.type = 'sine';
          arpOsc.frequency.setValueAtTime(targetFreq, now);

          arpGain.gain.setValueAtTime(0, now);
          arpGain.gain.linearRampToValueAtTime(0.04 * volume, now + 0.02);
          arpGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.5);

          arpOsc.connect(arpGain);
          arpGain.connect(ctx.destination);

          arpOsc.start(now);
          arpOsc.stop(now + stepDuration * 1.5);
        }

        stepRef.current = (currentStep + 1) % 32;
      }, stepDuration * 1000);

    } catch (e) {
      console.error('Failed to initialize synthesized synthwave:', e);
    }
  };

  const stopSynthesizer = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      stopSynthesizer();
      startSynthesizer();
    } else {
      stopSynthesizer();
    }
    return () => stopSynthesizer();
  }, [isPlaying, trackIndex, volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full max-w-md bg-[#1c1b1b]/80 border border-brand-border rounded-lg p-4 flex flex-col gap-3 shadow-lg glow-primary-hover transition-all duration-300 mt-10">
      {/* Top Section: Track Details & Visualizer */}
      <div className="flex items-center gap-3">
        {/* Animated Disk Cover */}
        <div
          className={`w-10 h-10 rounded-full bg-[#131313] border border-brand-border flex items-center justify-center relative overflow-hidden ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '6s' }}
        >
          <Music className={`w-5 h-5 text-brand-primary ${isPlaying ? 'scale-110' : ''}`} />
          <div className="absolute w-2 h-2 rounded-full bg-[#171717] border border-brand-border" />
        </div>

        {/* Text */}
        <div className="flex-grow min-w-0">
          <div className="text-xs font-mono font-medium text-brand-on-surface truncate">
            {activeTrack.title}
          </div>
          <div className="text-[10px] font-mono text-brand-on-surface-variant truncate">
            {activeTrack.artist}
          </div>
        </div>

        {/* Visualizer Lines */}
        <div className="flex gap-[2px] h-4 items-end">
          <span
            className={`w-[2px] bg-brand-primary rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-[bounce_0.8s_infinite_0s]' : 'h-1'
            }`}
            style={{ height: isPlaying ? undefined : '3px' }}
          />
          <span
            className={`w-[2px] bg-brand-primary rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-[bounce_0.8s_infinite_0.2s]' : 'h-1'
            }`}
            style={{ height: isPlaying ? undefined : '5px' }}
          />
          <span
            className={`w-[2px] bg-brand-primary rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-[bounce_0.8s_infinite_0.1s]' : 'h-1'
            }`}
            style={{ height: isPlaying ? undefined : '2px' }}
          />
          <span
            className={`w-[2px] bg-brand-primary rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-[bounce_0.8s_infinite_0.3s]' : 'h-1'
            }`}
            style={{ height: isPlaying ? undefined : '4px' }}
          />
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex gap-2 items-center">
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-brand-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play Synthesized Synthwave'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black translate-x-[1px]" />}
          </button>
          <button
            onClick={handleNextTrack}
            className="p-1.5 text-brand-on-surface-variant hover:text-brand-primary transition-colors cursor-pointer"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-brand-on-surface-variant hover:text-brand-primary transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-16 h-1 bg-[#131313] accent-brand-primary rounded-lg appearance-none cursor-pointer"
            title="Adjust synth volume"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#131313] h-[3px] rounded-full overflow-hidden relative mt-1">
        <div
          className="bg-brand-primary h-full transition-all duration-1000 ease-linear shadow-[0_0_6px_#4fdbc8]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
