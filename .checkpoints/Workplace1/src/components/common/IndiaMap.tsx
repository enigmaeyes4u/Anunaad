import React, { useState } from 'react';
import { MapPin, Sparkles, ArrowRight, Volume2, Film, User } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { VideoModal } from './VideoModal';

export interface RegionData {
  id: string;
  name: string;
  state: string;
  tagline: string;
  traditions: string[];
  primaryArtName: string;
  artSlug: string;
  category: string;
  sampleTitle: string;
  sampleAudio: string;
  videoUrl: string;
  isVideoOnly: boolean;
  keeperName: string;
  artistId: string;
  xPercent: number;
  yPercent: number;
  imageUrl: string;
}

const REGIONS: RegionData[] = [
  {
    id: 'rajasthan',
    name: 'Thar & Marwar',
    state: 'Rajasthan',
    tagline: 'Desert vocal Maand, bowed Kamaicha, puppetry, and miniature murals',
    traditions: ['Maand Vocal Heritage', 'Kamaicha Melodies', 'Kathputli Puppetry', 'Phad Scrolls'],
    primaryArtName: 'Maand Vocal Heritage',
    artSlug: 'maand',
    category: 'Traditional Music',
    sampleTitle: 'Kesariya Balam (Antique Desert Style)',
    sampleAudio: '/audio/maand_sarangi.wav',
    videoUrl: 'https://www.youtube.com/embed/QD16Nf_IFMk',
    isVideoOnly: false,
    keeperName: 'Ustad Raghunath Manganiyar',
    artistId: 'artist-raghunath',
    xPercent: 26,
    yPercent: 36,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'gujarat',
    name: 'Kutch Peninsula',
    state: 'Gujarat',
    tagline: '400-year castor oil Rogan textile painting, Ajrakh block printing, and Mutwa embroidery',
    traditions: ['Rogan Castor Oil Painting', 'Ajrakh Natural Resist', 'Barni Copper Bells', 'Kutchi Weaving'],
    primaryArtName: 'Rogan Art',
    artSlug: 'rogan-art',
    category: 'Rare Craft',
    sampleTitle: 'Rogan Stylus & Castor Oil Resonance',
    sampleAudio: '/audio/rogan_ambient.wav',
    videoUrl: 'https://www.youtube.com/embed/qTSTJ9XQAwY',
    isVideoOnly: true,
    keeperName: 'Padma Shri Abdul Gafur Khatri',
    artistId: 'artist-gafur',
    xPercent: 18,
    yPercent: 49,
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'bengal',
    name: 'Bengal Delta & Rarh',
    state: 'West Bengal',
    tagline: 'Mystic Baul philosophy, Purulia masked Chhau, and scroll storytelling',
    traditions: ['Baul Mystic Songs', 'Purulia Chhau Dance', 'Patachitra Scrolls', 'Dokra Brass'],
    primaryArtName: 'Baul & Chhau',
    artSlug: 'baul',
    category: 'Mystic Music & Dance',
    sampleTitle: 'Milon Hobe Koto Dine (Song of Yearning)',
    sampleAudio: '/audio/baul_ektara.wav',
    videoUrl: 'https://www.youtube.com/embed/Zu37jWgW660',
    isVideoOnly: false,
    keeperName: 'Gouranga Das Baul & Guru Tarapada Mahato',
    artistId: 'artist-gouranga',
    xPercent: 68,
    yPercent: 47,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'assam',
    name: 'Brahmaputra Valley',
    state: 'Assam',
    tagline: '500-year monastic Sattriya dance, Majuli river masks, and Eri silk weaving',
    traditions: ['Sattriya Monastic Dance', 'Borgeet Chants', 'Majuli Bamboo Masks', 'Muga Weaving'],
    primaryArtName: 'Sattriya Dance',
    artSlug: 'sattriya',
    category: 'Classical Dance',
    sampleTitle: 'Monastic Borgeet Flute & Sacred Khol',
    sampleAudio: '/audio/sattriya_flute.wav',
    videoUrl: 'https://www.youtube.com/embed/AUnqW8p0t9I',
    isVideoOnly: true,
    keeperName: 'Bhabananda Barbayan',
    artistId: 'artist-bhabananda',
    xPercent: 86,
    yPercent: 35,
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'bihar',
    name: 'Mithila Cultural Zone',
    state: 'Bihar',
    tagline: 'Maternal courtyard Madhubani frescoes, natural botanical dyes, and Aripana',
    traditions: ['Mithila Kohbar Murals', 'Sujani Needlework', 'Vocal Maithili Lore', 'Sikki Grass Craft'],
    primaryArtName: 'Madhubani Painting',
    artSlug: 'madhubani',
    category: 'Sacred Visual Art',
    sampleTitle: 'Maithili Courtyard Songs of Creation',
    sampleAudio: '/audio/madhubani_folk.wav',
    videoUrl: 'https://www.youtube.com/embed/IZqOxAHhZsQ',
    isVideoOnly: true,
    keeperName: 'Kamala Devi Jha',
    artistId: 'artist-kamala',
    xPercent: 61,
    yPercent: 39,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'chhattisgarh',
    name: 'Central Tribal Plains',
    state: 'Chhattisgarh',
    tagline: 'Fierce Kapalik Pandavani Mahabharata narrations, Tambura, and bell metal',
    traditions: ['Pandavani Epic Narrations', 'Ghotul Muria Rhythms', 'Bastar Wrought Iron', 'Panthi Dance'],
    primaryArtName: 'Pandavani',
    artSlug: 'pandavani',
    category: 'Epic Storytelling',
    sampleTitle: 'Draupadi Cheer Haran (Live Chanting)',
    sampleAudio: '/audio/pandavani_tambura.wav',
    videoUrl: 'https://www.youtube.com/embed/Nw0VRYTgWm0',
    isVideoOnly: false,
    keeperName: 'Teejan Devi Sahu',
    artistId: 'artist-teejan',
    xPercent: 53,
    yPercent: 50,
    imageUrl: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'andhra',
    name: 'Deccan & Rayalaseema',
    state: 'Andhra Pradesh',
    tagline: 'Illuminated goat-hide shadow puppetry, Kalamkari pen murals, and Kuchipudi',
    traditions: ['Tholu Bommalata Shadow Puppets', 'Srikalahasti Kalamkari', 'Burra Katha Ballads', 'Kondapalli Toys'],
    primaryArtName: 'Tholu Bommalata',
    artSlug: 'tholu-bommalata',
    category: 'Shadow Puppetry',
    sampleTitle: 'Bronze Cymbals & Chants of the Shadow Screen',
    sampleAudio: '/audio/tholu_puppetry.wav',
    videoUrl: 'https://www.youtube.com/embed/O23SXPXBReE',
    isVideoOnly: true,
    keeperName: 'Padma Shri Dalavai Chalapathi Rao',
    artistId: 'artist-chalapathi',
    xPercent: 46,
    yPercent: 68,
    imageUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'kerala',
    name: 'Malabar & Travancore',
    state: 'Kerala',
    tagline: 'Colossal ritual trance Theyyam, Kudiyattam Sanskrit theatre, and Sopana Sangeetham',
    traditions: ['Theyyam Ritual Trance', 'Kudiyattam Temple Theatre', 'Kalaripayattu Martial Art', 'Aranmula Mirrors'],
    primaryArtName: 'Theyyam & Sanskrit Theatre',
    artSlug: '',
    category: 'Ritual Theatre',
    sampleTitle: 'Theyyam Fire Trance Percussion',
    sampleAudio: '/audio/chhau_drums.wav',
    videoUrl: 'https://www.youtube.com/embed/fJ9rUzIMcZQ',
    isVideoOnly: false,
    keeperName: 'Guru Appunni Marar',
    artistId: '',
    xPercent: 37,
    yPercent: 86,
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop'
  }
];

interface IndiaMapProps {
  onNavigate?: (path: string) => void;
  onSelectRegion?: (regionName: string) => void;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ onNavigate, onSelectRegion }) => {
  const [activeRegion, setActiveRegion] = useState<RegionData>(REGIONS[0]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const { playTrack, pauseTrack } = useAudio();

  const handleSelectPin = (reg: RegionData, e: React.MouseEvent) => {
    // Prevent any page reload or default anchor behavior
    e.preventDefault();
    e.stopPropagation();
    setActiveRegion(reg);
    // Optional parent notification without triggering page reload/redirection
    if (onSelectRegion) {
      onSelectRegion(reg.state);
    }
  };

  const handlePlayVideo = () => {
    pauseTrack();
    setVideoModalOpen(true);
  };

  const handlePlayAudio = () => {
    setVideoModalOpen(false);
    playTrack({
      id: `map-${activeRegion.id}`,
      title: activeRegion.sampleTitle,
      artistName: activeRegion.keeperName,
      artFormName: activeRegion.primaryArtName,
      region: activeRegion.state,
      audioUrl: activeRegion.sampleAudio
    });
  };

  return (
    <div className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-3xl p-6 lg:p-10 shadow-sm space-y-6">
      
      {/* Interactive Exploration Instructions */}
      <div className="flex items-center justify-between text-xs text-[#5E5B54] border-b border-[#E8E2D5] pb-3">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-4 h-4 text-[#C85A32]" />
          Click any region pin on the map to explore its living arts in-place:
        </span>
        <span className="font-mono text-[11px] text-[#8E877B] hidden sm:inline">
          Active: <strong className="text-[#1C1B19]">{activeRegion.state}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive SVG Map */}
        <div className="lg:col-span-6 relative aspect-square max-w-lg mx-auto w-full bg-[#F5F1E6] rounded-2xl p-4 border border-[#E0D9CB] overflow-hidden flex items-center justify-center select-none">
          
          {/* Subtle geographical contours */}
          <svg
            viewBox="0 0 400 450"
            className="w-full h-full opacity-60 pointer-events-none drop-shadow-sm"
          >
            {/* Elegant simplified silhouette of the subcontinent */}
            <path
              d="M 160 30 
                 Q 185 10, 205 35 
                 Q 230 65, 235 90 
                 Q 280 110, 340 120 
                 Q 380 140, 360 180 
                 Q 310 180, 275 195 
                 Q 280 240, 260 280 
                 Q 230 350, 195 430 
                 Q 175 420, 150 350 
                 Q 130 280, 120 250 
                 Q 80 220, 60 200 
                 Q 75 170, 120 170 
                 Q 120 110, 160 30 Z"
              fill="#EAE3D2"
              stroke="#D3C9B6"
              strokeWidth="2"
            />
            {/* Regional terrain hatching hints */}
            <line x1="80" y1="180" x2="160" y2="150" stroke="#C4B7A0" strokeDasharray="3 3" />
            <line x1="140" y1="280" x2="240" y2="280" stroke="#C4B7A0" strokeDasharray="3 3" />
          </svg>

          {/* Regional Pins - Pure in-place selection with zero page reload */}
          {REGIONS.map(reg => {
            const isSelected = activeRegion.id === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={(e) => handleSelectPin(reg, e)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-10 cursor-pointer ${
                  isSelected ? 'scale-125 z-20' : 'hover:scale-115'
                }`}
                style={{ left: `${reg.xPercent}%`, top: `${reg.yPercent}%` }}
                title={`${reg.name} (${reg.state}) — Click to view arts`}
              >
                <div className="relative flex items-center justify-center">
                  {isSelected && (
                    <span className="absolute w-7 h-7 rounded-full bg-[#C85A32]/40 animate-ping"></span>
                  )}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md ${
                    isSelected ? 'bg-[#C85A32] text-white ring-2 ring-white scale-110 shadow-lg' : 'bg-[#1C1B19] text-[#FDFBF7] hover:bg-[#C85A32]'
                  }`}>
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                </div>
                <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap px-2 py-0.5 rounded shadow transition-opacity ${
                  isSelected ? 'bg-[#1C1B19] text-white opacity-100' : 'bg-white text-[#1C1B19] opacity-0 group-hover:opacity-100'
                }`}>
                  {reg.state}
                </span>
              </button>
            );
          })}

          <div className="absolute bottom-3 left-3 bg-[#FAF7F0]/95 backdrop-blur px-3 py-1.5 rounded-lg border border-[#E0D9CB] text-[11px] text-[#5E5B54] flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D97724]" />
            <span>Click any pin to inspect living traditions without leaving this page</span>
          </div>
        </div>

        {/* Right Active Region Card — Displays arts related to selected place */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D5] bg-white shadow-sm transition-all">
            <div className="h-48 w-full relative overflow-hidden bg-[#1C1B19]">
              <img
                src={activeRegion.imageUrl}
                alt={activeRegion.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop';
                }}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
              
              <div className="absolute top-4 left-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#F5E6D3] bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/20">
                  📍 {activeRegion.state} • {activeRegion.name}
                </span>
              </div>

              <div className="absolute bottom-4 left-5 right-5 text-white space-y-1">
                <span className="text-[10px] font-mono uppercase bg-[#C85A32] text-white px-2 py-0.5 rounded">
                  {activeRegion.category}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">
                  {activeRegion.primaryArtName}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-xs sm:text-sm text-[#5E5B54] leading-relaxed italic border-l-2 border-[#C85A32] pl-3 py-0.5">
                "{activeRegion.tagline}"
              </p>

              {/* Preserved Traditions Pills */}
              <div>
                <h5 className="text-[11px] font-mono text-[#8E877B] uppercase tracking-wider mb-2 font-semibold">
                  Living Traditions Preserved in {activeRegion.state}
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {activeRegion.traditions.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#FAF7F0] text-[#1C1B19] text-xs rounded-xl border border-[#E8E2D5] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Master Keeper Info */}
              <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E8E2D5] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#1C1B19] text-white flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#D97724]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#8E877B] block uppercase font-mono">Master Practitioner</span>
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-[#1C1B19] truncate">{activeRegion.keeperName}</h4>
                  </div>
                </div>

                {activeRegion.artistId && onNavigate && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/artists/${activeRegion.artistId}`);
                    }}
                    className="shrink-0 text-xs font-semibold text-[#C85A32] hover:text-[#B34D28] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lineage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Interactive Audio / Video / Details Action Bar */}
              <div className="pt-2 border-t border-[#E8E2D5] flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  {/* Visual Arts (like Rogan Art): Direct Video Modal */}
                  {activeRegion.isVideoOnly ? (
                    <button
                      type="button"
                      onClick={handlePlayVideo}
                      className="py-2 px-3.5 bg-[#1C1B19] hover:bg-[#C85A32] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Film className="w-3.5 h-3.5 text-[#D97724]" />
                      <span>Watch Living Video</span>
                    </button>
                  ) : (
                    <>
                      {/* Audio Track */}
                      <button
                        type="button"
                        onClick={handlePlayAudio}
                        className="py-2 px-3.5 bg-[#FAF7F0] hover:bg-[#EFE8D8] text-[#C85A32] border border-[#C85A32]/30 text-xs font-medium rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Hear Sound</span>
                      </button>
                      {/* Video Track if available */}
                      {activeRegion.videoUrl && (
                        <button
                          type="button"
                          onClick={handlePlayVideo}
                          className="py-2 px-3 bg-white hover:bg-[#FAF7F0] text-[#1C1B19] border border-[#E8E2D5] text-xs font-medium rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Film className="w-3.5 h-3.5 text-[#D97724]" />
                          <span>Video</span>
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Explore Artform Details without hard reload */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) {
                      if (activeRegion.artSlug) {
                        onNavigate(`/art-forms/${activeRegion.artSlug}`);
                      } else {
                        onNavigate(`/discover?region=${encodeURIComponent(activeRegion.state)}`);
                      }
                    }
                  }}
                  className="py-2 px-4 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Explore {activeRegion.primaryArtName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Video Modal for in-place playback without leaving the page */}
      {videoModalOpen && activeRegion.videoUrl && (
        <VideoModal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          title={`${activeRegion.primaryArtName} — ${activeRegion.state}`}
          videoUrl={activeRegion.videoUrl}
          artistName={activeRegion.keeperName}
          description={`Witness authentic living technique and cultural practice of ${activeRegion.primaryArtName} from ${activeRegion.name}, ${activeRegion.state}.`}
        />
      )}
    </div>
  );
};
