import React, { useState, useEffect } from 'react';
import { Artist } from '../types';
import { Search, ShieldCheck, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { SupportArtistModal } from '../components/common/SupportArtistModal';

interface ArtistsProps {
  onNavigate: (path: string) => void;
}

export const Artists: React.FC<ArtistsProps> = ({ onNavigate }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [supportArtist, setSupportArtist] = useState<Artist | null>(null);

  useEffect(() => {
    fetch('/api/artists').then(r => r.json()).then(d => setArtists(d.artists || [])).catch(() => {});
  }, []);

  const states = ['all', ...Array.from(new Set(artists.map(a => a.state)))];

  const filtered = artists.filter(a => {
    const matchState = selectedState === 'all' || a.state === selectedState;
    const matchSearch = !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.lineage.traditionName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchState && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32] flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Guardians of Memory
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1B19]">
          The Keepers of Tradition
        </h1>
        <p className="text-sm sm:text-base text-[#5E5B54] font-light leading-relaxed">
          Not just performers or artisans. Teachers, masters, and lineages carrying the living resonance of India's classical, folk, and tribal knowledge.
        </p>

        {/* Search */}
        <div className="pt-2 max-w-xl mx-auto relative">
          <Search className="w-4 h-4 text-[#8E877B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by artist name, region, or lineage..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E8E2D5] rounded-2xl text-sm focus:outline-none focus:border-[#C85A32] shadow-sm"
          />
        </div>
      </div>

      {/* State / Region Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {states.map(s => (
          <button
            key={s}
            onClick={() => setSelectedState(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedState === s
                ? 'bg-[#1C1B19] text-white shadow-sm'
                : 'bg-white text-[#5E5B54] border border-[#E8E2D5] hover:border-[#C85A32]/40'
            }`}
          >
            {s === 'all' ? 'All States' : s}
          </button>
        ))}
      </div>

      {/* Artist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(artist => (
          <div
            key={artist.id}
            className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-[4/3] relative overflow-hidden bg-[#E8E2D5]">
                <img
                  src={artist.portraitImage}
                  alt={artist.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-[11px] font-mono">
                  {artist.yearsExperience}+ yrs practice
                </div>

                {artist.verifiedStatus === 'verified' && (
                  <div className="absolute top-3 left-3 bg-[#2D4F38] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <ShieldCheck className="w-3 h-3" /> ✓ Verified
                  </div>
                )}

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-xs font-mono text-[#D97724] uppercase tracking-wider block">
                    {artist.location}
                  </span>
                  <h3 className="font-serif text-2xl font-bold">{artist.name}</h3>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <p className="text-xs font-medium text-[#C85A32]">{artist.title}</p>
                <p className="text-xs text-[#5E5B54] line-clamp-3 leading-relaxed">
                  {artist.bio}
                </p>
                <p className="text-xs text-[#1C1B19] italic border-l-2 border-[#D97724] pl-3 py-0.5">
                  «{artist.quote}»
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                <button
                  onClick={() => setSupportArtist(artist)}
                  className="text-xs text-[#D97724] hover:text-[#C85A32] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Support</span>
                </button>

                <button
                  onClick={() => onNavigate(`/artists/${artist.id}`)}
                  className="py-2 px-4 bg-[#1C1B19] hover:bg-[#C85A32] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>View Lineage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {supportArtist && (
        <SupportArtistModal
          isOpen={!!supportArtist}
          onClose={() => setSupportArtist(null)}
          artistId={supportArtist.id}
          artistName={supportArtist.name}
          artistPortrait={supportArtist.portraitImage}
          artFormName={supportArtist.title}
          goalTitle={supportArtist.supportGoal?.title}
        />
      )}

    </div>
  );
};
