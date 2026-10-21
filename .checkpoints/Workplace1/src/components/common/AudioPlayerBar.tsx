import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, X, Volume2, Music2 } from 'lucide-react';

export const AudioPlayerBar: React.FC = () => {
  const { currentTrack, isPlaying, togglePlay, progress, duration, closePlayer, seek, audioMode } = useAudio();

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1C1B19]/95 text-[#FDFBF7] backdrop-blur-md border-t border-[#C85A32]/30 shadow-2xl transition-all duration-300">
      {/* Progress line */}
      <div 
        className="w-full h-1.5 bg-[#3A3630] cursor-pointer relative group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = (e.clientX - rect.left) / rect.width;
          if (duration > 0) seek(pos * duration);
        }}
      >
        <div 
          className="h-full bg-gradient-to-r from-[#D97724] to-[#C85A32] relative transition-all"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Track info */}
        <div className="flex items-center gap-3 min-w-0 max-w-sm">
          <div className="w-10 h-10 rounded-xl bg-[#2D2A24] border border-[#4A453C] flex items-center justify-center shrink-0 text-[#D97724] relative overflow-hidden">
            {isPlaying ? (
              <div className="flex items-end gap-1 h-5">
                <span className="w-1 bg-[#D97724] h-full animate-bounce rounded-sm" style={{ animationDuration: '0.6s' }}></span>
                <span className="w-1 bg-[#C85A32] h-4/5 animate-bounce rounded-sm" style={{ animationDuration: '0.8s' }}></span>
                <span className="w-1 bg-[#D97724] h-3/5 animate-bounce rounded-sm" style={{ animationDuration: '0.5s' }}></span>
              </div>
            ) : (
              <Music2 className="w-5 h-5 opacity-70" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-[#FDFBF7] truncate">{currentTrack.title}</h4>
            <p className="text-xs text-[#A8A296] truncate">
              {currentTrack.artistName} <span className="opacity-40">•</span> {currentTrack.artFormName} {currentTrack.region ? `(${currentTrack.region})` : ''}
            </p>
          </div>
        </div>

        {/* Center controls */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#8E877B] font-mono hidden sm:inline">{formatTime(progress)}</span>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#C85A32] hover:bg-[#B34D28] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-md cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <span className="text-xs text-[#8E877B] font-mono hidden sm:inline">{formatTime(duration)}</span>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-[#D97724] bg-[#2A231C] px-3 py-1 rounded-full border border-[#D97724]/20">
            <Volume2 className="w-3.5 h-3.5" />
            <span>{audioMode === 'synth' ? 'Classical Tanpura (Acoustic Drone)' : 'Living Master Recording'}</span>
          </div>
          <button
            onClick={closePlayer}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#8E877B] hover:text-white transition-colors cursor-pointer"
            aria-label="Close audio player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
