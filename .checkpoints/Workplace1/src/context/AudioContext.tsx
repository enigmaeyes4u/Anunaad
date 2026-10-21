import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

export interface AudioTrack {
  id: string;
  title: string;
  artistName: string;
  artFormName: string;
  region?: string;
  audioUrl: string;
  coverImage?: string;
}

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  audioMode: 'recording' | 'synth';
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  closePlayer: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [audioMode, setAudioMode] = useState<'recording' | 'synth'>('recording');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const webAudioCtxRef = useRef<any>(null);
  const synthNodesRef = useRef<any[]>([]);
  const synthTimerRef = useRef<any>(null);

  // Stop Web Audio synth
  const stopSynth = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    synthNodesRef.current.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    synthNodesRef.current = [];
  };

  // Start Indian Classical Tanpura & Sitar acoustic drone synthesizer
  const startSynth = () => {
    try {
      stopSynth();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!webAudioCtxRef.current || webAudioCtxRef.current.state === 'closed') {
        webAudioCtxRef.current = new AudioCtx();
      }
      const ctx = webAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Master output gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.22, ctx.currentTime);
      masterGain.connect(ctx.destination);
      synthNodesRef.current.push(masterGain);

      // Lowpass acoustic filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.connect(masterGain);
      synthNodesRef.current.push(filter);

      // Indian Classical Raga tuning (Raag Mand / Bhairav Sa-Pa Tanpura: C# tuning)
      // Sa1: 138.59Hz, Pa: 207.65Hz, Sa2: 277.18Hz, Kharaj Sa: 69.30Hz
      const pitches = [138.59, 207.65, 277.18, 69.30];

      pitches.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = idx === 1 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Subtle gentle vibrato (meend)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(4.5 + idx * 0.5, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();
        synthNodesRef.current.push(lfo, lfoGain);

        oscGain.gain.setValueAtTime(0.25, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();

        synthNodesRef.current.push(osc, oscGain);
      });

      setAudioMode('synth');
      setIsPlaying(true);
      setDuration(180);

      // Advance progress counter every second
      synthTimerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 180) {
            stopSynth();
            setIsPlaying(false);
            return 0;
          }
          return p + 1;
        });
      }, 1000);
    } catch (e) {
      console.warn('Web Audio synthesis error:', e);
    }
  };

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const onError = () => {
      console.warn('Audio element error, falling back to Indian Classical Tanpura synthesizer.');
      startSynth();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      stopSynth();
    };
  }, []);

  const playTrack = (track: AudioTrack) => {
    if (!audioRef.current) return;

    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    // New track selected
    stopSynth();
    setCurrentTrack(track);
    setProgress(0);

    if (track.audioUrl && track.audioUrl.trim().length > 0) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setAudioMode('recording');
          setIsPlaying(true);
        })
        .catch(err => {
          console.warn('HTML5 audio play blocked/error, activating authentic Tanpura synth:', err);
          startSynth();
        });
    } else {
      startSynth();
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopSynth();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      pauseTrack();
    } else {
      if (audioMode === 'recording' && audioRef.current && audioRef.current.src) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => startSynth());
      } else {
        startSynth();
      }
    }
  };

  const seek = (seconds: number) => {
    if (audioMode === 'recording' && audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
    setProgress(seconds);
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopSynth();
    setIsPlaying(false);
    setCurrentTrack(null);
    setProgress(0);
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      progress,
      duration,
      audioMode,
      playTrack,
      pauseTrack,
      togglePlay,
      seek,
      closePlayer
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

