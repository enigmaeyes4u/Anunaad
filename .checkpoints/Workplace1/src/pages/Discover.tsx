import React, { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { ArtForm, Artist } from '../types';
import { Search, Volume2, ArrowRight, Sparkles, Filter, Heart, Film } from 'lucide-react';
import { SupportArtistModal } from '../components/common/SupportArtistModal';
import { VideoModal } from '../components/common/VideoModal';

interface DiscoverProps {
  onNavigate: (path: string) => void;
  initialRegion?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'music', label: 'Traditional Music' },
  { id: 'dance', label: 'Classical & Martial Dance' },
  { id: 'storytelling', label: 'Epic Storytelling' },
  { id: 'visual_art', label: 'Sacred Visual Arts' },
  { id: 'craft', label: 'Rare Crafts' },
  { id: 'puppetry', label: 'Shadow Puppetry' }
];

export const Discover: React.FC<DiscoverProps> = ({ onNavigate, initialRegion }) => {
  const { playTrack, pauseTrack } = useAudio();
  const [artForms, setArtForms] = useState<ArtForm[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>(initialRegion || '');
  const [supportArtist, setSupportArtist] = useState<Artist | null>(null);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoData, setVideoData] = useState<{
    title: string;
    videoUrl: string;
    artistName?: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/artforms').then(r => r.json()).then(d => setArtForms(d.artForms || [])).catch(() => {});
    fetch('/api/artists').then(r => r.json()).then(d => setArtists(d.artists || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialRegion) {
      setRegionFilter(initialRegion);
    }
  }, [initialRegion]);

  const isVisualOrMovement = (cat: string) =>
    ['dance', 'visual_art', 'craft', 'puppetry'].includes(cat);

  const handlePlayVideo = (art: ArtForm, keeper?: Artist) => {
    pauseTrack();
    setVideoData({
      title: `${art.name} — Living Demonstration`,
      videoUrl: art.videoSampleUrl || 'https://www.youtube.com/embed/fJ9rUzIMcZQ',
      artistName: keeper?.name || `Traditional Keepers of ${art.state}`,
      description: `Watch the creation, bodily movements, and artisanal technique of ${art.name} (${art.region}, ${art.state}).`
    });
    setVideoModalOpen(true);
  };

  const handlePlayAudio = (art: ArtForm, keeper?: Artist) => {
    setVideoModalOpen(false);
    playTrack({
      id: `disc-${art.id}`,
      title: `${art.name} Oral Transmission`,
      artistName: keeper ? keeper.name : 'Archival Recording',
      artFormName: art.name,
      region: art.state,
      audioUrl: art.audioSampleUrl
    });
  };

  // Filtered traditions
  const filtered = artForms.filter(af => {
    const matchCat = selectedCategory === 'all' || af.category === selectedCategory;
    const matchSearch = !searchQuery || 
      af.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      af.devanagari.includes(searchQuery) ||
      af.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      af.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRegion = !regionFilter || af.state.toLowerCase().includes(regionFilter.toLowerCase()) || af.region.toLowerCase().includes(regionFilter.toLowerCase());
    return matchCat && matchSearch && matchRegion;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32] flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Infinite Cultural Feed
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1B19]">
          What will you discover today?
        </h1>
        <p className="text-sm sm:text-base text-[#5E5B54] font-light leading-relaxed">
          Open the cultural treasure chest. Every scroll connects you to living visual crafts, bodily dance movements, and acoustic oral lineages.
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-xl mx-auto relative">
          <Search className="w-4 h-4 text-[#8E877B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by tradition, state (e.g. Rajasthan, Assam), instrument, or oral epic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E8E2D5] rounded-2xl text-sm focus:outline-none focus:border-[#C85A32] shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#1C1B19] text-white shadow-sm'
                : 'bg-white text-[#5E5B54] border border-[#E8E2D5] hover:border-[#C85A32]/40'
            }`}
          >
            {cat.label}
          </button>
        ))}

        {regionFilter && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F0] border border-[#C85A32] text-[#C85A32] rounded-full text-xs">
            <span>Region: {regionFilter}</span>
            <button onClick={() => setRegionFilter('')} className="ml-1 hover:text-black">×</button>
          </div>
        )}
      </div>

      {/* Storytelling Discovery Loop Feed */}
      <div className="space-y-16">
        {filtered.map((artForm, idx) => {
          // Find matching keeper for this art form
          const keeper = artists.find(a => a.artFormId === artForm.id) || artists[idx % artists.length];
          const isVisual = isVisualOrMovement(artForm.category);

          return (
            <div
              key={artForm.id}
              className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all p-6 lg:p-10 space-y-8"
            >
              
              {/* Top Prompt: "You may have never heard of this." */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D5] pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C85A32]"></span>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#8E877B]">
                    Discovery #{idx + 1} • You may have never heard of this
                  </span>
                </div>
                <div className="text-xs font-mono text-[#C85A32]">
                  {artForm.region}, {artForm.state}
                </div>
              </div>

              {/* Tradition Showcase */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#E8E2D5] shadow-md group">
                  <img
                    src={artForm.heroImage}
                    alt={artForm.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=1200&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Media Trigger Button */}
                  {isVisual ? (
                    /* Visual arts & dance (Rogan Art, Madhubani, Pottery, Sattriya): VIDEO ONLY */
                    <button
                      onClick={() => handlePlayVideo(artForm, keeper)}
                      className="absolute bottom-4 right-4 py-2 px-4 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-medium rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                      title="Watch Technique Video"
                    >
                      <Film className="w-4 h-4" />
                      <span>Watch Video</span>
                    </button>
                  ) : (
                    /* Musical / Oral: Audio and Video options (only one plays at a time) */
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(artForm, keeper)}
                        className="py-2 px-3 bg-white/90 hover:bg-[#C85A32] hover:text-white text-[#1C1B19] text-xs font-medium rounded-xl shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                        title="Listen to Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Listen Audio</span>
                      </button>
                      <button
                        onClick={() => handlePlayVideo(artForm, keeper)}
                        className="py-2 px-3 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-medium rounded-xl shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                        title="Watch Video"
                      >
                        <Film className="w-4 h-4" />
                        <span>Watch Video</span>
                      </button>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="font-devanagari text-xs opacity-80 block">{artForm.devanagari}</span>
                    <h3 className="font-serif text-2xl font-bold">{artForm.name}</h3>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs font-mono text-[#D97724] uppercase tracking-wider block">
                    Living Heritage ({artForm.category.replace('_', ' ')})
                  </span>
                  <h3 className="font-serif text-3xl font-bold text-[#1C1B19] leading-tight">
                    {artForm.name}
                  </h3>
                  <p className="text-sm text-[#5E5B54] leading-relaxed">
                    {artForm.shortDesc}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    {artForm.tags.map(tag => (
                      <span key={tag} className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white border border-[#E8E2D5] text-[#8E877B]">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => onNavigate(`/art-forms/${artForm.slug}`)}
                      className="text-xs font-semibold text-[#1C1B19] hover:text-[#C85A32] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Read Full Editorial & Oral Perspectives</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Master Keeper Spotlight Sub-Card */}
              {keeper && (
                <div className="bg-white rounded-2xl border border-[#E8E2D5] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={keeper.portraitImage}
                      alt={keeper.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#D97724] shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#C85A32] block">
                        The Keeper • {keeper.yearsExperience}+ Years Practicing
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#1C1B19]">{keeper.name}</h4>
                      <p className="text-xs text-[#5E5B54] italic line-clamp-1">«{keeper.quote}»</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setSupportArtist(keeper)}
                      className="py-2 px-3.5 bg-[#FAF7F0] hover:bg-[#E8E2D5] text-[#1C1B19] rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-[#D97724]" />
                      <span>Support</span>
                    </button>
                    <button
                      onClick={() => onNavigate(`/artists/${keeper.id}`)}
                      className="py-2 px-4 bg-[#1C1B19] hover:bg-[#C85A32] text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Meet Keeper</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <p className="font-serif text-xl text-[#5E5B54]">No living traditions matched your search.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setRegionFilter(''); }}
              className="py-2 px-4 bg-[#C85A32] text-white text-xs rounded-xl font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {supportArtist && (
        <SupportArtistModal
          isOpen={!!supportArtist}
          onClose={() => setSupportArtist(null)}
          artistId={supportArtist.id}
          artistName={supportArtist.name}
          artistPortrait={supportArtist.portraitImage}
          artFormName={supportArtist.title}
        />
      )}

      {/* Video Modal (automatically pauses background audio) */}
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
