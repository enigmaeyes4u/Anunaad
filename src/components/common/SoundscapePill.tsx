import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Music2, Bell, Wind, Disc, Activity } from 'lucide-react';

interface SoundTexture {
  id: string;
  label: string;
  fullName: string;
  icon: any;
  description: string;
}

const TEXTURES: SoundTexture[] = [
  { id: 'tanpura', label: 'Tanpura', fullName: 'Vedic Tanpura (432Hz)', icon: Music2, description: '4-string authentic Sa-Pa acoustic drone with jawari buzz' },
  { id: 'temple', label: 'Kashi Bell', fullName: 'Kashi Bronze Temple Bell', icon: Bell, description: 'Resonant sacred temple bell with natural acoustic decay' },
  { id: 'kutch', label: 'Kutch Wind', fullName: 'Kutch Desert Calm', icon: Wind, description: 'Gentle warm evening breeze across the Great Rann' },
  { id: 'ghungroo', label: 'Ghungroo', fullName: 'Chhau Ankle Bells', icon: Disc, description: 'Rhythmic metallic shimmer of traditional dance ghungroos' }
];

export const SoundscapePill: React.FC = () => {
  const [activeTextureId, setActiveTextureId] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.5);
  const [audioStarted, setAudioStarted] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<{ stop: () => void; disconnect: () => void }[]>([]);
  const loopTimerRef = useRef<number | null>(null);

  // Initialize or get running AudioContext
  const getAudioContext = async (): Promise<AudioContext> => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    if (!masterGainRef.current) {
      const g = ctx.createGain();
      g.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      g.connect(ctx.destination);
      masterGainRef.current = g;
    }
    return ctx;
  };

  // Immediate synchronous stop of all active sound generators
  const stopAllCurrentSounds = () => {
    if (loopTimerRef.current) {
      window.clearInterval(loopTimerRef.current);
      loopTimerRef.current = null;
    }

    activeNodesRef.current.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch {}
    });
    activeNodesRef.current = [];
  };

  const handleStop = () => {
    stopAllCurrentSounds();
    setActiveTextureId(null);
  };

  // Update volume in real-time
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(newVol * 0.15, audioCtxRef.current.currentTime, 0.05);
    }
  };

  const playTexture = async (texture: SoundTexture) => {
    if (activeTextureId === texture.id) {
      handleStop();
      return;
    }

    // Stop current sound synchronously
    stopAllCurrentSounds();

    try {
      const ctx = await getAudioContext();
      const masterGain = masterGainRef.current!;
      masterGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);

      const nodes: { stop: () => void; disconnect: () => void }[] = [];

      if (texture.id === 'tanpura') {
        // Authentic 4-String Indian Tanpura Drone: Pa (G3), Sa (C4), Sa (C4), Sa (C3 Kharja)
        // Staggered plucking cycle every 5 seconds
        const strings = [
          { freq: 196.00, delay: 0.0 },   // Pa (Pancham)
          { freq: 261.63, delay: 1.2 },   // Sa (Jodi 1)
          { freq: 261.63, delay: 2.4 },   // Sa (Jodi 2)
          { freq: 130.81, delay: 3.6 }    // Sa (Kharja / Low)
        ];

        const pluckCycle = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
          const now = ctx.currentTime;

          strings.forEach(str => {
            const pluckTime = now + str.delay;

            // Fundamental
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth'; // rich harmonics
            osc.frequency.setValueAtTime(str.freq, pluckTime);

            // Subtle vibrato/LFO
            const lfo = ctx.createOscillator();
            lfo.frequency.setValueAtTime(4.2, pluckTime);
            const lfoGain = ctx.createGain();
            lfoGain.gain.setValueAtTime(str.freq * 0.015, pluckTime);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            // Lowpass Jawari filter to give that acoustic buzzing warmth
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1400, pluckTime);
            filter.Q.setValueAtTime(2.5, pluckTime);

            // Envelope
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.0001, pluckTime);
            gain.gain.exponentialRampToValueAtTime(0.28, pluckTime + 0.12);
            gain.gain.exponentialRampToValueAtTime(0.0001, pluckTime + 3.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);

            osc.start(pluckTime);
            lfo.start(pluckTime);
            osc.stop(pluckTime + 4.0);
            lfo.stop(pluckTime + 4.0);

            nodes.push({
              stop: () => {
                try { osc.stop(); lfo.stop(); } catch {}
              },
              disconnect: () => {
                try { gain.disconnect(); filter.disconnect(); } catch {}
              }
            });
          });
        };

        // First cycle immediately
        pluckCycle();
        // Repeat continuously every 5 seconds
        loopTimerRef.current = window.setInterval(pluckCycle, 4800);

      } else if (texture.id === 'temple') {
        // Kashi Bronze Temple Bell with multi-overtones
        const ringBell = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
          const now = ctx.currentTime;
          const harmonics = [432, 864, 1296, 2160, 3456];
          const amps = [0.4, 0.25, 0.15, 0.08, 0.04];
          const decays = [5.5, 4.2, 3.0, 2.0, 1.2];

          harmonics.forEach((h, idx) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(h, now);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(amps[idx], now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(now);
            osc.stop(now + decays[idx]);

            nodes.push({
              stop: () => { try { osc.stop(); } catch {} },
              disconnect: () => { try { gain.disconnect(); } catch {} }
            });
          });
        };

        ringBell();
        loopTimerRef.current = window.setInterval(ringBell, 6000);

      } else if (texture.id === 'kutch') {
        // Kutch Desert Wind Ambient (Filtered noise synth)
        const bufferSize = ctx.sampleRate * 3;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(320, ctx.currentTime);
        bandpass.Q.setValueAtTime(1.8, ctx.currentTime);

        // LFO for slow wind gusts
        const windLfo = ctx.createOscillator();
        windLfo.frequency.setValueAtTime(0.2, ctx.currentTime);
        const windLfoGain = ctx.createGain();
        windLfoGain.gain.setValueAtTime(180, ctx.currentTime);
        windLfo.connect(windLfoGain);
        windLfoGain.connect(bandpass.frequency);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.5);

        whiteNoise.connect(bandpass);
        bandpass.connect(gain);
        gain.connect(masterGain);

        whiteNoise.start();
        windLfo.start();

        nodes.push({
          stop: () => {
            try { whiteNoise.stop(); windLfo.stop(); } catch {}
          },
          disconnect: () => {
            try { gain.disconnect(); bandpass.disconnect(); } catch {}
          }
        });

      } else if (texture.id === 'ghungroo') {
        // Chhau Ankle Ghungroo rhythmic cadence
        const jingle = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
          const now = ctx.currentTime;
          const bells = [1200, 1600, 2400, 3200];

          bells.forEach(freq => {
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq + (Math.random() * 80 - 40), now);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(now);
            osc.stop(now + 0.4);

            nodes.push({
              stop: () => { try { osc.stop(); } catch {} },
              disconnect: () => { try { gain.disconnect(); } catch {} }
            });
          });
        };

        jingle();
        loopTimerRef.current = window.setInterval(jingle, 1600);
      }

      activeNodesRef.current = nodes;
      setActiveTextureId(texture.id);
      setAudioStarted(true);

    } catch (err) {
      console.error('Audio initialization error:', err);
    }
  };

  useEffect(() => {
    return () => {
      stopAllCurrentSounds();
    };
  }, []);

  const activeTexture = TEXTURES.find(t => t.id === activeTextureId);

  return (
    <div className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-3xl p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Title & Info */}
        <div className="flex items-start sm:items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
            activeTextureId
              ? 'bg-[#C85A32] text-white shadow-md animate-pulse'
              : 'bg-[#E8E2D5] text-[#5E5B54]'
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-[#1C1B19]">
                Acoustic Riyaz Ambient Soundscape
              </span>
              {activeTexture && (
                <span className="px-2 py-0.5 rounded-full bg-[#2D4F38] text-white text-[10px] font-mono tracking-wider flex items-center gap-1 animate-pulse">
                  <Activity className="w-3 h-3" /> Playing {activeTexture.label}
                </span>
              )}
            </div>
            <p className="text-xs text-[#5E5B54] mt-0.5">
              {activeTexture ? activeTexture.description : 'Click any acoustic texture below for continuous riyaz drone immersion'}
            </p>
          </div>
        </div>

        {/* Buttons and Volume Slider */}
        <div className="flex flex-wrap items-center gap-2">
          {TEXTURES.map(t => {
            const Icon = t.icon;
            const isActive = activeTextureId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => playTexture(t)}
                className={`px-4 py-2 rounded-2xl text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#C85A32] text-white font-semibold shadow-md scale-105'
                    : 'bg-white hover:bg-[#F2ECE1] text-[#1C1B19] border border-[#E8E2D5] hover:border-[#C85A32]/40 shadow-2xs'
                }`}
                title={t.fullName}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#C85A32]'}`} />
                <span>{t.label}</span>
                {isActive && (
                  <span className="flex space-x-0.5 items-end h-3 ml-1">
                    <span className="w-0.5 h-3 bg-white animate-pulse" />
                    <span className="w-0.5 h-2 bg-white animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-3 bg-white animate-pulse" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </button>
            );
          })}

          {/* Stop / Silence button */}
          {activeTextureId && (
            <button
              type="button"
              onClick={handleStop}
              title="Silence Ambient Soundscape"
              className="py-2 px-3 rounded-2xl bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <VolumeX className="w-4 h-4" />
              <span>Silence</span>
            </button>
          )}

          {/* Volume Control */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#E8E2D5] ml-1">
            <Volume2 className="w-4 h-4 text-[#8E877B]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-18 accent-[#C85A32] cursor-pointer"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
