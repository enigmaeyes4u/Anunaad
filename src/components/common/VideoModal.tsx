import React, { useEffect } from 'react';
import { X, Film } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string;
  artistName?: string;
  description?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  title,
  videoUrl,
  artistName,
  description
}) => {
  const { pauseTrack } = useAudio();

  // Whenever a video modal opens, automatically pause any background audio so sounds never clash!
  useEffect(() => {
    if (isOpen) {
      pauseTrack();
    }
  }, [isOpen, pauseTrack]);

  if (!isOpen) return null;

  // Transform standard YouTube watch URL to embed URL if needed
  let embedUrl = videoUrl;
  if (videoUrl.includes('youtube.com/watch?v=')) {
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  } else if (videoUrl.includes('youtu.be/')) {
    const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
    embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  }

  const isIframe = embedUrl.includes('youtube') || embedUrl.includes('vimeo');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1C1B19] text-[#FDFBF7] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#C85A32]/40 transition-all flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-[#161513]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C85A32] flex items-center justify-center text-white">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white leading-snug">{title}</h3>
              <p className="text-xs text-[#A8A296]">
                {artistName ? `Master Practitioner: ${artistName}` : 'Living Archival Footage'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#A8A296] hover:text-white transition-colors cursor-pointer"
            aria-label="Close video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {isIframe ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              src={embedUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Caption / Description Footer */}
        {description && (
          <div className="p-4 bg-[#161513] border-t border-white/10 text-xs text-[#A8A296] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D97724] shrink-0"></span>
            <p className="leading-relaxed">{description}</p>
          </div>
        )}

      </div>
    </div>
  );
};
