import React, { useState, useEffect } from 'react';
import { ArtForm } from '../types';
import { Search, Volume2, ArrowRight, Sparkles, Film } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { VideoModal } from '../components/common/VideoModal';

interface ArtFormsProps {
  onNavigate: (path: string) => void;
}

export const ArtForms: React.FC<ArtFormsProps> = ({ onNavigate }) => {
  const { playTrack, pauseTrack } = useAudio();
  const [artForms, setArtForms] = useState<ArtForm[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoData, setVideoData] = useState<{
    title: string;
    videoUrl: string;
    artistName?: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/artforms').then(r => r.json()).then(d => setArtForms(d.artForms || [])).catch(() => {});
  }, []);

  const isVisualOrMovement = (category: string) =>
    ['dance', 'visual_art', 'craft', 'puppetry'].includes(category);

  // Play Video ONLY: pauses any background audio so only one plays at a time
  const handlePlayVideo = (art: ArtForm) => {
    pauseTrack();
    setVideoData({
      title: `${art.name} — Living Demonstration`,
      videoUrl: art.videoSampleUrl || 'https://www.youtube.com/embed/fJ9rUzIMcZQ',
      artistName: `Traditional Keepers of ${art.state}`,
      description: `Watch the living creation, bodily movements, and artisanal technique of ${art.name} (${art.region}, ${art.state}).`
    });
    setVideoModalOpen(true);
  };

  // Play Audio ONLY: closes any video modal so only audio plays
  const handlePlayAudio = (art: ArtForm) => {
    setVideoModalOpen(false);
    playTrack({
      id: `af-${art.id}`,
      title: `${art.name} Traditional Resonance`,
      artistName: 'Field Sound Archives',
      artFormName: art.name,
      region: `${art.region}, ${art.state}`,
      audioUrl: art.audioSampleUrl
    });
  };

  const categories = [
    { id: 'all', label: 'All Traditions' },
    { id: 'music', label: 'Music & Oral' },
    { id: 'dance', label: 'Dance & Movement' },
    { id: 'storytelling', label: 'Epic Storytelling' },
    { id: 'visual_art', label: 'Visual Painting' },
    { id: 'craft', label: 'Rare Crafts' },
    { id: 'puppetry', label: 'Shadow Puppetry' }
  ];

  const filtered = artForms.filter(af => {
    const matchCat = selectedCat === 'all' || af.category === selectedCat;
    const matchSearch = !searchQuery ||
      af.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      af.devanagari.includes(searchQuery) ||
      af.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      af.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32] flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Living Taxonomy
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1B19]">
          The Traditional Art Forms
        </h1>
        <p className="text-sm sm:text-base text-[#5E5B54] font-light leading-relaxed">
          Explore the profound tapestry of regional, classical, tribal, and rare craft arts. Dance and visual arts are experienced through video, while music offers distinct audio and video encounters.
        </p>

        {/* Search */}
        <div className="pt-2 max-w-xl mx-auto relative">
          <Search className="w-4 h-4 text-[#8E877B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by art form name (e.g. Rogan Art, Sattriya, Chhau), state, or discipline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E8E2D5] rounded-2xl text-sm focus:outline-none focus:border-[#C85A32] shadow-sm"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCat === c.id
                ? 'bg-[#1C1B19] text-white shadow-sm'
                : 'bg-white text-[#5E5B54] border border-[#E8E2D5] hover:border-[#C85A32]/40'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(art => {
          const isVisual = isVisualOrMovement(art.category);

          return (
            <div
              key={art.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E8E2D5] hover:border-[#C85A32]/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] relative overflow-hidden bg-[#E8E2D5]">
                  <img
                    src={art.heroImage}
                    alt={art.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=1200&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-[10px] font-mono">
                    {art.state}
                  </div>

                  {/* Thumbnail Play Controls */}
                  {isVisual ? (
                    /* Visual arts & dance: VIDEO ONLY */
                    <button
                      onClick={() => handlePlayVideo(art)}
                      className="absolute bottom-3 right-3 py-1.5 px-3 rounded-full bg-[#C85A32] hover:bg-[#B34D28] text-white flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer text-xs font-medium"
                      title="Watch Technique Video"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span className="text-[11px] tracking-wide">Watch Video</span>
                    </button>
                  ) : (
                    /* Musical / Oral arts: AUDIO & VIDEO buttons (mutually exclusive) */
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => handlePlayAudio(art)}
                        className="w-8 h-8 rounded-full bg-white/90 hover:bg-[#C85A32] hover:text-white text-[#1C1B19] flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                        title="Listen to Audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handlePlayVideo(art)}
                        className="w-8 h-8 rounded-full bg-[#C85A32] hover:bg-[#B34D28] text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                        title="Watch Video"
                      >
                        <Film className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 text-white max-w-[60%]">
                    <span className="font-devanagari text-xs opacity-90 block text-[#D97724]">{art.devanagari}</span>
                    <h3 className="font-serif text-2xl font-bold leading-tight">{art.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#D97724] block">
                    Category: {art.category.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-[#5E5B54] line-clamp-3 leading-relaxed">
                    {art.shortDesc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {art.tags.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E8E2D5] text-[#8E877B]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 space-y-2">
                <div className="pt-4 border-t border-[#E8E2D5]">
                  {isVisual ? (
                    /* Visual arts & dance: Video button + Details */
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePlayVideo(art)}
                        className="flex-1 py-2 px-3 bg-[#1C1B19] hover:bg-[#C85A32] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Watch Video</span>
                      </button>
                      <button
                        onClick={() => onNavigate(`/art-forms/${art.slug}`)}
                        className="py-2 px-3 bg-[#FAF7F0] hover:bg-[#E8E2D5] text-[#1C1B19] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Read story"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    /* Music & oral: Listen Audio OR Watch Video (one at a time) + Details */
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePlayAudio(art)}
                        className="flex-1 py-2 px-2.5 bg-[#FAF7F0] hover:bg-[#C85A32] hover:text-white text-[#1C1B19] text-xs font-semibold rounded-xl border border-[#E8E2D5] transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Play audio only"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#C85A32]" />
                        <span>Listen</span>
                      </button>
                      <button
                        onClick={() => handlePlayVideo(art)}
                        className="flex-1 py-2 px-2.5 bg-[#1C1B19] hover:bg-[#C85A32] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Play video only"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Watch</span>
                      </button>
                      <button
                        onClick={() => onNavigate(`/art-forms/${art.slug}`)}
                        className="p-2 bg-[#FAF7F0] hover:bg-[#E8E2D5] text-[#1C1B19] text-xs font-semibold rounded-xl transition-all flex items-center justify-center cursor-pointer"
                        title="View full details"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal (automatically pauses audio when open) */}
      {videoModalOpen && videoData && (
        <VideoModal
          isOpen={videoModalOpen}
          onClose={() => { setVideoModalOpen(false); setVideoData(null); }}
          title={videoData.title}
          videoUrl={videoData.videoUrl}
          artistName={videoData.artistName}
          description={videoData.description}
        />
      )}

    </div>
  );
};
