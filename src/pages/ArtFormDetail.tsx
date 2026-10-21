import React, { useState, useEffect } from 'react';
import { ArtForm, Artist, Offering, Experience } from '../types';
import { useAudio } from '../context/AudioContext';
import { RazorpayModal } from '../components/common/RazorpayModal';
import { VideoModal } from '../components/common/VideoModal';
import { ArrowLeft, Volume2, Sparkles, BookOpen, Users, Calendar, ArrowRight, Film } from 'lucide-react';

interface ArtFormDetailProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ArtFormDetail: React.FC<ArtFormDetailProps> = ({ slug, onNavigate }) => {
  const { playTrack, pauseTrack } = useAudio();
  const [artForm, setArtForm] = useState<ArtForm | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/artforms/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.artForm) {
          setArtForm(d.artForm);
          setArtists(d.artists || []);
          setOfferings(d.offerings || []);
          setExperiences(d.experiences || []);
        }
      })
      .catch(() => {});
  }, [slug]);

  if (!artForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#C85A32] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-serif text-lg text-[#5E5B54]">Retrieving cultural archive...</p>
      </div>
    );
  }

  const isVisual = ['dance', 'visual_art', 'craft', 'puppetry'].includes(artForm.category);

  // Play Video: pauses background audio so only video audio plays
  const handlePlayVideo = () => {
    pauseTrack();
    setVideoModalOpen(true);
  };

  // Play Audio: closes video modal so only audio plays
  const handlePlayAudio = () => {
    setVideoModalOpen(false);
    playTrack({
      id: `editorial-${artForm.id}`,
      title: `${artForm.name} Archival Resonance`,
      artistName: 'Field Sound Archives',
      artFormName: artForm.name,
      region: artForm.state,
      audioUrl: artForm.audioSampleUrl
    });
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Header */}
      <div className="relative bg-[#1C1B19] text-white">
        <div className="h-80 sm:h-[460px] w-full relative overflow-hidden">
          <img
            src={artForm.heroImage}
            alt={artForm.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=1200&auto=format&fit=crop';
            }}
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19] via-black/40 to-black/70"></div>
          
          <button
            onClick={() => onNavigate('/art-forms')}
            className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur text-xs text-white hover:bg-black/75 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Traditions</span>
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 relative z-10 pb-12 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#C85A32] text-white text-xs font-mono uppercase rounded-full">
              {artForm.region} • {artForm.state}
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur text-[#F5E6D3] text-xs font-mono rounded-full">
              Discipline: {artForm.category.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-devanagari text-xl text-[#D97724]">{artForm.devanagari}</span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white">
              {artForm.name}
            </h1>
          </div>

          <p className="text-base sm:text-xl text-[#D8D1C2] max-w-3xl font-light leading-relaxed">
            {artForm.shortDesc}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            {isVisual ? (
              /* Visual arts, dance, craft, pottery: VIDEO ONLY */
              <button
                onClick={handlePlayVideo}
                className="py-3 px-6 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer group"
              >
                <Film className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Watch Living Technique (Video)</span>
              </button>
            ) : (
              /* Music & oral traditions: AUDIO or VIDEO (only one at a time) */
              <>
                <button
                  onClick={handlePlayAudio}
                  className="py-3 px-6 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer group"
                >
                  <Volume2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Listen to Archival Sound</span>
                </button>
                <button
                  onClick={handlePlayVideo}
                  className="py-3 px-5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer border border-white/20"
                >
                  <Film className="w-4 h-4 text-[#D97724]" />
                  <span>Watch Performance Video</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Editorial Columns */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Living Visual / Acoustic Showcase Banner */}
        <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#C85A32] font-bold block mb-1">
                {isVisual ? 'Visual & Movement Archive' : 'Oral & Musical Heritage'}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1C1B19]">
                {isVisual
                  ? `Witness the Living Mastery of ${artForm.name}`
                  : `Experience the Authentic Acoustic Lineage of ${artForm.name}`}
              </h3>
              <p className="text-xs text-[#5E5B54] mt-1 max-w-2xl leading-relaxed">
                {isVisual
                  ? `Arts such as ${artForm.name} come alive through visual technique, stylus mastery, and bodily expression. Watch the master demonstration on video.`
                  : `Nurtured across generations, hear the resonant compositions and vocal ornaments preserved in our sound archives.`}
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
              {isVisual ? (
                <button
                  onClick={handlePlayVideo}
                  className="py-3 px-5 bg-[#1C1B19] hover:bg-[#C85A32] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Film className="w-4 h-4 text-[#D97724]" />
                  <span>Watch Technique Video</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePlayAudio}
                    className="py-3 px-4 bg-[#FAF7F0] hover:bg-[#E8E2D5] text-[#1C1B19] border border-[#E8E2D5] text-xs font-semibold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Volume2 className="w-4 h-4 text-[#C85A32]" />
                    <span>Play Audio</span>
                  </button>
                  <button
                    onClick={handlePlayVideo}
                    className="py-3 px-4 bg-[#1C1B19] hover:bg-[#C85A32] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Film className="w-4 h-4 text-[#D97724]" />
                    <span>Watch Video</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Section 1: The Tradition & The Story */}
        <div className="space-y-6">
          <div className="border-b border-[#E8E2D5] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
              Part I
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1B19]">
              The Living Tradition & The Story
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#5E5B54] leading-relaxed">
            {artForm.traditionStory}
          </p>
        </div>

        {/* Section 2: Three Perspectives (History vs Community vs Contemporary) */}
        <div className="space-y-6">
          <div className="border-b border-[#E8E2D5] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
              Part II • Critical Perspectives
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1B19]">
              History, Community Voice & Contemporary Reality
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Historical Information */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] space-y-3">
              <span className="text-[11px] font-mono uppercase text-[#D97724] font-bold block">
                01 • Historical Documentation
              </span>
              <h4 className="font-serif text-lg font-bold text-[#1C1B19]">Archival Context</h4>
              <p className="text-xs text-[#5E5B54] leading-relaxed">
                {artForm.historyContext}
              </p>
            </div>

            {/* Community Perspectives */}
            <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#C85A32]/30 space-y-3">
              <span className="text-[11px] font-mono uppercase text-[#C85A32] font-bold block">
                02 • Inside the Lineage
              </span>
              <h4 className="font-serif text-lg font-bold text-[#1C1B19]">Community Perspective</h4>
              <p className="text-xs text-[#5E5B54] leading-relaxed">
                {artForm.communityPerspective}
              </p>
            </div>

            {/* Contemporary Practice */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] space-y-3">
              <span className="text-[11px] font-mono uppercase text-[#2D4F38] font-bold block">
                03 • Living Today
              </span>
              <h4 className="font-serif text-lg font-bold text-[#1C1B19]">Contemporary Practice</h4>
              <p className="text-xs text-[#5E5B54] leading-relaxed">
                {artForm.contemporaryPractice}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Living Keepers Practicing It */}
        <div className="space-y-6">
          <div className="border-b border-[#E8E2D5] pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
                Part III
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1B19]">
                Practitioners Preserving {artForm.name}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {artists.map(artist => (
              <div
                key={artist.id}
                className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E8E2D5] flex items-center gap-5 hover:shadow-md transition-all"
              >
                <img
                  src={artist.portraitImage}
                  alt={artist.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop';
                  }}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D97724] shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <h4 className="font-serif text-lg font-bold text-[#1C1B19] truncate">{artist.name}</h4>
                  <p className="text-xs text-[#C85A32]">{artist.yearsExperience}+ yrs riyaz • {artist.location}</p>
                  <p className="text-xs text-[#5E5B54] italic line-clamp-1">«{artist.quote}»</p>
                  <button
                    onClick={() => onNavigate(`/artists/${artist.id}`)}
                    className="text-xs font-semibold text-[#1C1B19] hover:text-[#C85A32] pt-1 block cursor-pointer"
                  >
                    View Lineage Tree →
                  </button>
                </div>
              </div>
            ))}
            {artists.length === 0 && (
              <div className="col-span-full py-8 px-6 bg-[#FAF7F0] border border-dashed border-[#E8E2D5] rounded-2xl text-center">
                <p className="text-sm font-serif text-[#1C1B19] font-medium">Lineage Master Documentation in Progress</p>
                <p className="text-xs text-[#8E877B] mt-1">Our field archivist team is currently onboarding living masters for {artForm.name}.</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Upcoming Learning Offerings */}
        {offerings.length > 0 && (
          <div className="space-y-6">
            <div className="border-b border-[#E8E2D5] pb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
                Part IV
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1B19]">
                Learn Directly From the Masters
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {offerings.map(o => (
                <div key={o.id} className="bg-white p-6 rounded-2xl border border-[#E8E2D5] flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase bg-[#FAF7F0] text-[#C85A32] px-2 py-0.5 rounded">
                      {o.type.replace('_', ' ')}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-[#1C1B19]">{o.title}</h4>
                    <p className="text-xs text-[#5E5B54]">{o.description}</p>
                  </div>
                  <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-[#1C1B19]">₹{o.priceInr}</span>
                    <button
                      onClick={() => setSelectedOffering(o)}
                      className="py-2 px-4 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
                    >
                      Enroll →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {selectedOffering && (
        <RazorpayModal
          isOpen={!!selectedOffering}
          onClose={() => setSelectedOffering(null)}
          offeringId={selectedOffering.id}
          itemTitle={selectedOffering.title}
          artistName={selectedOffering.artistName || 'Master Practitioner'}
          priceInr={selectedOffering.priceInr}
        />
      )}

      {/* Video Modal (automatically pauses background audio) */}
      {videoModalOpen && (
        <VideoModal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          title={`${artForm.name} — Living Demonstration`}
          videoUrl={artForm.videoSampleUrl || 'https://www.youtube.com/embed/fJ9rUzIMcZQ'}
          artistName={`Traditional Keepers of ${artForm.state}`}
          description={`Watch the living technique and movement of ${artForm.name} (${artForm.region}, ${artForm.state}).`}
        />
      )}

    </div>
  );
};
