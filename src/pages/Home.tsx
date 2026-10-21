import React, { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { LineageTree } from '../components/common/LineageTree';
import { IndiaMap } from '../components/common/IndiaMap';
import { SupportArtistModal } from '../components/common/SupportArtistModal';
import { RazorpayModal } from '../components/common/RazorpayModal';
import { VideoModal } from '../components/common/VideoModal';
import { HeroResonanceScene } from '../components/3d/HeroResonanceScene';
import { ArtisanArtifactViewer } from '../components/3d/ArtisanArtifactViewer';
import { SoundscapePill } from '../components/common/SoundscapePill';
import { triggerHeritageConfetti } from '../components/common/Confetti';
import {
  Play, Pause, Volume2, ArrowRight, Sparkles, Heart,
  Compass, Users, BookOpen, ShieldCheck, MapPin, Calendar, Clock, Film
} from 'lucide-react';
import { Artist, ArtForm, Offering, Experience } from '../types';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudio();
  
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artForms, setArtForms] = useState<ArtForm[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [activeTab, setActiveTab] = useState<'listen' | 'watch' | 'story' | 'learn' | 'experience' | 'support'>('story');

  // Modals
  const [supportModalArtist, setSupportModalArtist] = useState<Artist | null>(null);
  const [checkoutOffering, setCheckoutOffering] = useState<Offering | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoData, setVideoData] = useState<{ title: string; url: string; artistName?: string; description?: string } | null>(null);

  useEffect(() => {
    // Fetch seed / database data from local API
    fetch('/api/artists').then(r => r.json()).then(d => setArtists(d.artists || [])).catch(() => {});
    fetch('/api/artforms').then(r => r.json()).then(d => setArtForms(d.artForms || [])).catch(() => {});
    fetch('/api/offerings').then(r => r.json()).then(d => setOfferings(d.offerings || [])).catch(() => {});
    fetch('/api/experiences').then(r => r.json()).then(d => setExperiences(d.experiences || [])).catch(() => {});
  }, []);

  const featuredArtist = artists.find(a => a.id === 'artist-raghunath') || artists[0];

  return (
    <div className="space-y-24 lg:space-y-36 pb-20">
      
      {/* 1. INTERACTIVE 3D HERO RESONANCE SCENE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <HeroResonanceScene
          onExploreClick={() => onNavigate('/discover')}
          onEnterBaithakClick={() => {
            const el = document.getElementById('heritage-3d-pavilion');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </section>

      {/* AMBIENT ACOUSTIC RIYAZ SOUNDSCAPE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SoundscapePill />
      </section>

      {/* 2. EDITORIAL STATEMENT SCROLL */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="w-12 h-0.5 bg-[#C85A32] mx-auto"></div>
        <div className="space-y-6">
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1C1B19] leading-relaxed font-normal">
            «Somewhere, someone is still singing a song you've never heard.
          </p>
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#5E5B54] leading-relaxed font-normal">
            Someone is still playing an instrument you didn't know existed.
          </p>
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#5E5B54] leading-relaxed font-normal">
            Someone is still practicing an art their teacher taught them decades ago.
          </p>
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1C1B19] leading-relaxed font-normal">
            And somewhere, someone is looking for exactly that.»
          </p>
        </div>
        
        {/* Animated Reveal Punchline */}
        <div className="pt-6">
          <div className="inline-block bg-[#F5F2EA] border border-[#E8E2D5] px-6 py-3 rounded-full shadow-sm">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#C85A32]">
              ANUNAAD connects them.
            </span>
          </div>
        </div>
      </section>

      {/* 3. DISCOVER SECTION: Horizontal Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E2D5] pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
              Cultural Treasure Chest
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B19] mt-1">
              Discover something you've never heard of.
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/discover')}
            className="text-xs font-semibold uppercase tracking-wider text-[#1C1B19] hover:text-[#C85A32] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All Living Traditions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artForms.slice(0, 6).map((art) => (
            <div
              key={art.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E8E2D5] hover:border-[#C85A32]/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col"
            >
              {/* Card Image with Audio trigger */}
              <div className="relative h-56 w-full overflow-hidden bg-[#E8E2D5]">
                <img
                  src={art.heroImage}
                  alt={art.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Region Pill */}
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur text-white text-[11px] font-mono px-3 py-1 rounded-full border border-white/20">
                  {art.state}
                </div>

                {/* Quick Audio Play Button */}
                <button
                  onClick={() => playTrack({
                    id: `art-${art.id}`,
                    title: `${art.name} Traditional Melody`,
                    artistName: 'Field Sound Archive',
                    artFormName: art.name,
                    region: art.state,
                    audioUrl: art.audioSampleUrl
                  })}
                  className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 hover:bg-[#C85A32] hover:text-white text-[#1C1B19] flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  title="Listen to sample"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-4 text-white">
                  <span className="font-devanagari text-xs opacity-80 block">{art.devanagari}</span>
                  <h3 className="font-serif text-xl font-bold">{art.name}</h3>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-[#5E5B54] line-clamp-3 leading-relaxed">
                  {art.shortDesc}
                </p>

                <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between text-xs">
                  <span className="text-[#8E877B] capitalize font-mono text-[11px]">
                    Category: {art.category.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => onNavigate(`/art-forms/${art.slug}`)}
                    className="text-[#C85A32] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MEET THE KEEPERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
            The Keepers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B19]">
            Meet the people behind the tradition.
          </h2>
          <p className="text-sm text-[#5E5B54]">
            Not just artists. Keepers of knowledge passed from one generation to another.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="group bg-[#FAF7F0] border border-[#E8E2D5] rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:shadow-md transition-all hover:border-[#C85A32]/40"
            >
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-xl overflow-hidden relative bg-[#E8E2D5]">
                  <img
                    src={artist.portraitImage}
                    alt={artist.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2.5 py-0.5 rounded-full text-white text-[10px] font-mono">
                    {artist.yearsExperience}+ yrs practice
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#C85A32] font-semibold">
                    <span>{artist.location}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1C1B19] mt-0.5">{artist.name}</h3>
                  <p className="text-xs text-[#8E877B]">{artist.title}</p>
                </div>

                <p className="text-xs text-[#5E5B54] italic leading-relaxed border-l-2 border-[#C85A32] pl-3 py-0.5">
                  «{artist.quote}»
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E2D5] mt-4 flex items-center justify-between">
                <button
                  onClick={() => setSupportModalArtist(artist)}
                  className="text-xs text-[#D97724] hover:text-[#C85A32] font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Support</span>
                </button>
                <button
                  onClick={() => onNavigate(`/artists/${artist.id}`)}
                  className="text-xs font-semibold text-[#1C1B19] hover:text-[#C85A32] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Meet {artist.name.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED ARTIST PROFILE PREVIEW & LINEAGE */}
      {featuredArtist && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-3xl p-6 lg:p-12 shadow-sm space-y-8">
            
            {/* Profile Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-[#E8E2D5] pb-8">
              <div className="lg:col-span-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-2 border-[#E8E2D5]">
                  <img
                    src={featuredArtist.portraitImage}
                    alt={featuredArtist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-[#C85A32] text-white text-xs font-mono uppercase rounded-full">
                    Featured Master Keeper
                  </span>
                  <span className="px-3 py-1 bg-white text-[#2D4F38] border border-[#2D4F38]/30 text-xs font-semibold rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2D4F38]" /> ✓ Verified Artist
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B19]">
                  {featuredArtist.name}
                </h2>
                <p className="text-sm font-medium text-[#C85A32]">
                  {featuredArtist.title} • {featuredArtist.location} • {featuredArtist.yearsExperience}+ Years of Living Riyaz
                </p>
                <p className="text-sm text-[#5E5B54] leading-relaxed">
                  {featuredArtist.bio}
                </p>

                {/* Interactive Profile Tabs */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab('listen')}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'listen' ? 'bg-[#1C1B19] text-white' : 'bg-white text-[#1C1B19] border border-[#E8E2D5]'
                    }`}
                  >
                    🎧 Listen ({featuredArtist.audioSamples.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('watch')}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'watch' ? 'bg-[#1C1B19] text-white' : 'bg-white text-[#1C1B19] border border-[#E8E2D5]'
                    }`}
                  >
                    ▶ Watch (1)
                  </button>
                  <button
                    onClick={() => setActiveTab('story')}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'story' ? 'bg-[#1C1B19] text-white' : 'bg-white text-[#1C1B19] border border-[#E8E2D5]'
                    }`}
                  >
                    📖 Oral Lineage
                  </button>
                  <button
                    onClick={() => setActiveTab('learn')}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'learn' ? 'bg-[#1C1B19] text-white' : 'bg-white text-[#1C1B19] border border-[#E8E2D5]'
                    }`}
                  >
                    🧑‍🏫 Learn From Ustad
                  </button>
                  <button
                    onClick={() => setSupportModalArtist(featuredArtist)}
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-[#C85A32] text-white hover:bg-[#B34D28] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5" /> Support The Master
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Contents */}
            <div>
              {activeTab === 'story' && (
                <LineageTree lineage={featuredArtist.lineage} artistName={featuredArtist.name} />
              )}

              {activeTab === 'listen' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredArtist.audioSamples.map(sample => (
                    <div key={sample.id} className="p-4 bg-white rounded-xl border border-[#E8E2D5] flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#1C1B19]">{sample.title}</h4>
                        <p className="text-xs text-[#8E877B]">{sample.description}</p>
                      </div>
                      <button
                        onClick={() => playTrack({
                          id: sample.id,
                          title: sample.title,
                          artistName: featuredArtist.name,
                          artFormName: 'Maand Tradition',
                          audioUrl: sample.url
                        })}
                        className="w-10 h-10 rounded-full bg-[#C85A32] text-white flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer"
                      >
                        <Play className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'watch' && (
                <div 
                  onClick={() => {
                    setVideoData({
                      title: featuredArtist.videoSamples?.[0]?.title || 'Transmission in the Thar Desert',
                      url: featuredArtist.videoSamples?.[0]?.url || 'https://www.youtube.com/embed/fJ9rUzIMcZQ',
                      artistName: featuredArtist.name,
                      description: featuredArtist.videoSamples?.[0]?.description || 'Rare documentary footage of Ustad Raghunath teaching his apprentices in the courtyard.'
                    });
                    setVideoModalOpen(true);
                  }}
                  className="bg-black/90 rounded-2xl overflow-hidden aspect-video max-w-2xl mx-auto flex items-center justify-center text-white relative group cursor-pointer shadow-2xl transition-all hover:scale-[1.01]"
                >
                  <img
                    src={featuredArtist.coverImage || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop"}
                    alt="Documentary Preview"
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                  />
                  <div className="absolute text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#C85A32] group-hover:bg-[#B34D28] group-hover:scale-110 flex items-center justify-center mx-auto shadow-2xl transition-all">
                      <Play className="w-7 h-7 ml-1 text-white" />
                    </div>
                    <div>
                      <p className="font-serif text-xl font-bold tracking-wide">
                        {featuredArtist.videoSamples?.[0]?.title || 'Transmission in the Thar Desert'}
                      </p>
                      <p className="text-xs text-[#D8D1C2] mt-1 font-mono">
                        Click to Watch Full Documentary ({featuredArtist.videoSamples?.[0]?.duration || '8:30'})
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'learn' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offerings.filter(o => o.artistId === featuredArtist.id).map(offering => (
                    <div key={offering.id} className="p-5 bg-white rounded-xl border border-[#E8E2D5] space-y-3 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase bg-[#F5F2EA] text-[#C85A32] px-2 py-0.5 rounded">
                          {offering.type.replace('_', ' ')}
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#1C1B19] mt-2">{offering.title}</h4>
                        <p className="text-xs text-[#5E5B54] mt-1">{offering.durationDesc}</p>
                      </div>
                      <div className="pt-2 border-t border-[#E8E2D5] flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-[#1C1B19]">₹{offering.priceInr}</span>
                        <button
                          onClick={() => setCheckoutOffering(offering)}
                          className="py-1.5 px-3 bg-[#1C1B19] hover:bg-[#C85A32] text-white text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          Enroll Directly
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* 6. "LISTEN / WATCH / LEARN" THREE IMMERSIVE BLOCKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LISTEN */}
          <div className="relative rounded-3xl overflow-hidden bg-[#1C1B19] text-white p-8 sm:p-10 flex flex-col justify-between min-h-[360px] border border-[#3A3630] group">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D97724] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" /> Acoustic Sanctuary
              </span>
              <h3 className="font-serif text-3xl font-bold leading-tight">LISTEN</h3>
              <p className="text-sm text-[#A8A296] leading-relaxed">
                Hear traditions you've never encountered. Intimate desert baithaks, sacred monastic chants, and acoustic instruments bowed in solitude.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/discover?filter=music')}
              className="mt-6 py-3 px-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Explore Sound Archives</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* WATCH */}
          <div className="relative rounded-3xl overflow-hidden bg-[#2D2A24] text-white p-8 sm:p-10 flex flex-col justify-between min-h-[360px] border border-[#4A453C] group">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32] flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5" /> Living Practice
              </span>
              <h3 className="font-serif text-3xl font-bold leading-tight">WATCH</h3>
              <p className="text-sm text-[#A8A296] leading-relaxed">
                See artists practice and perform. Witness the clay masks of Chhau, the illuminated shadow puppets of Andhra, and the sacred mudras of Majuli.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/art-forms')}
              className="mt-6 py-3 px-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Watch Visual Traditions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* LEARN */}
          <div className="relative rounded-3xl overflow-hidden bg-[#2D4F38] text-white p-8 sm:p-10 flex flex-col justify-between min-h-[360px] border border-[#3E654C] group">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#93C9A6] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Direct Transmission
              </span>
              <h3 className="font-serif text-3xl font-bold leading-tight">LEARN</h3>
              <p className="text-sm text-[#D1E6D8] leading-relaxed">
                Learn directly from the people who carry the tradition. One-on-one riyaz, live masterclasses, and 6-month guru-shishya apprenticeships.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/learn')}
              className="mt-6 py-3 px-5 bg-white text-[#2D4F38] hover:bg-[#FAF7F0] rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer shadow-md"
            >
              <span>Explore Masterclasses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 3D LIVING HERITAGE PAVILION */}
      <section id="heritage-3d-pavilion" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ArtisanArtifactViewer onLearnMore={() => onNavigate('/art-forms')} />
      </section>

      {/* 7. LEARNING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E2D5] pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
              Oral Transmission
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B19] mt-1">
              Learn from the source.
            </h2>
            <p className="text-sm text-[#5E5B54] mt-1">
              Go beyond watching. Learn directly from practitioners who carry centuries of memory.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/learn')}
            className="text-xs font-semibold uppercase tracking-wider text-[#1C1B19] hover:text-[#C85A32] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Browse All Courses & Fellowships</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offerings.slice(0, 3).map((offering) => (
            <div
              key={offering.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D5] hover:border-[#C85A32]/40 transition-all shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-[#E8E2D5]">
                  <img
                    src={offering.imageUrl}
                    alt={offering.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#1C1B19]/80 backdrop-blur text-white text-[11px] font-mono px-3 py-0.5 rounded-full">
                    {offering.type.replace('_', ' ')}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#2D4F38] text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
                    80% to Artist
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#1C1B19] leading-snug group-hover:text-[#C85A32] transition-colors">
                    {offering.title}
                  </h3>
                  <p className="text-xs text-[#5E5B54] leading-relaxed line-clamp-2">
                    {offering.description}
                  </p>
                  <div className="text-xs text-[#8E877B] space-y-1 pt-2 font-mono">
                    <div>Format: {offering.durationDesc}</div>
                    <div>Level: {offering.level}</div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8E877B] block uppercase">Tuition</span>
                    <span className="font-mono text-base font-bold text-[#1C1B19]">₹{offering.priceInr.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    onClick={() => setCheckoutOffering(offering)}
                    className="py-2 px-4 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    Enroll Now →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. EXPERIENCES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E2D5] pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
              Gatherings & Baithaks
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B19] mt-1">
              Don't just discover it. Experience it.
            </h2>
            <p className="text-sm text-[#5E5B54] mt-1">
              Live acoustic performances, studio visits, shadow puppetry, and heritage walks.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/experiences')}
            className="text-xs font-semibold uppercase tracking-wider text-[#1C1B19] hover:text-[#C85A32] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>All Gatherings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experiences.slice(0, 3).map((exp) => (
            <div
              key={exp.id}
              className="bg-[#FAF7F0] rounded-2xl overflow-hidden border border-[#E8E2D5] flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="h-44 relative overflow-hidden bg-[#E8E2D5]">
                  <img
                    src={exp.imageUrl}
                    alt={exp.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[#C85A32] text-[11px] font-mono px-3 py-0.5 rounded-full font-bold">
                    📍 {exp.city}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#8E877B] font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#D97724]" />
                    <span>{exp.dateTime}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1C1B19] leading-snug">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-[#5E5B54] line-clamp-2">
                    {exp.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#1C1B19]">
                    ₹{exp.priceInr} / person
                  </span>
                  <button
                    onClick={() => onNavigate('/experiences')}
                    className="text-xs font-semibold text-[#C85A32] hover:text-[#B34D28] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Reserve Seat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. MAP / REGIONAL DISCOVERY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
            Subcontinental Roots
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B19]">
            Explore culture by place.
          </h2>
          <p className="text-sm text-[#5E5B54]">
            Every valley and desert sand dune has cultivated a unique language of sound, movement, and form.
          </p>
        </div>

        <IndiaMap onNavigate={onNavigate} />
      </section>

      {/* 10. “WHY ANUNAAD?” SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
            Core Principles
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B19]">
            Why ANUNAAD?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] text-[#1C1B19] flex items-center justify-center font-serif font-bold text-lg border border-[#E8E2D5]">
              01
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1C1B19]">DISCOVER</h4>
            <p className="text-xs text-[#5E5B54] leading-relaxed">
              Find rare regional traditions you didn't know existed across song, dance, puppetry, and craft.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] text-[#1C1B19] flex items-center justify-center font-serif font-bold text-lg border border-[#E8E2D5]">
              02
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1C1B19]">CONNECT</h4>
            <p className="text-xs text-[#5E5B54] leading-relaxed">
              Meet the people who carry decades of practice. Build personal, dignified relationships.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] text-[#1C1B19] flex items-center justify-center font-serif font-bold text-lg border border-[#E8E2D5]">
              03
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1C1B19]">LEARN</h4>
            <p className="text-xs text-[#5E5B54] leading-relaxed">
              Learn directly from oral practitioners through live masterclasses and 6-month apprenticeships.
            </p>
          </div>

          {/* 4th Principle Visually Emphasized */}
          <div className="bg-[#C85A32] text-white p-6 rounded-2xl shadow-xl space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-serif font-bold text-lg">
              04
            </div>
            <h4 className="font-serif text-lg font-bold">CONTINUE</h4>
            <p className="text-xs text-[#F5E6D3] leading-relaxed">
              Help traditions reach another generation. When knowledge passes to eager hands, the resonance continues.
            </p>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
          </div>
        </div>
      </section>

      {/* 11. PRESERVATION MANIFESTO SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-3xl p-8 sm:p-14 space-y-6 shadow-sm">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
            Our Conviction
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#1C1B19] leading-tight">
            Preservation isn't enough.
          </h2>
          <p className="font-serif text-2xl sm:text-3xl text-[#C85A32] italic">
            «A tradition survives when someone learns it.»
          </p>
          <p className="text-sm text-[#5E5B54] max-w-2xl mx-auto leading-relaxed">
            ANUNAAD turns cultural preservation into participation—connecting knowledge holders with people who want to listen, learn and carry it forward.
          </p>
        </div>
      </section>

      {/* 12. ARTIST CALL-TO-ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1B19] text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#3A3630] relative overflow-hidden">
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D97724]">
              For The Keepers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Are you keeping a tradition alive?
            </h2>
            <p className="text-sm text-[#D8D1C2] leading-relaxed">
              Your knowledge matters. Your story matters. Your art deserves to be discovered. Join a community that values the dignity, ownership, and sustainable livelihood of traditional masters.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('/join-artist')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                Join ANUNAAD as an Artist →
              </button>
              <button
                onClick={() => onNavigate('/about')}
                className="w-full sm:w-auto px-6 py-3.5 border border-white/20 hover:border-white text-xs text-white font-medium rounded-xl transition-colors cursor-pointer"
              >
                Learn How It Works
              </button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 font-serif text-[180px] select-none pointer-events-none hidden lg:block">
            अनु
          </div>
        </div>
      </section>

      {/* 13. COMMUNITY SECTION: Lineage Thread */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
            The Living Thread
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B19] mt-1">
            From one generation to the next.
          </h2>
        </div>

        {/* Visual Lineage Metaphor */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          <div className="p-5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-2xl space-y-2">
            <span className="text-xs font-mono text-[#D97724] font-bold">STAGE 1</span>
            <h4 className="font-serif font-bold text-base text-[#1C1B19]">Artist & Guru</h4>
            <p className="text-xs text-[#5E5B54]">Decades of oral transmission & mastery</p>
          </div>

          <div className="p-5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-2xl space-y-2">
            <span className="text-xs font-mono text-[#C85A32] font-bold">STAGE 2</span>
            <h4 className="font-serif font-bold text-base text-[#1C1B19]">Learner</h4>
            <p className="text-xs text-[#5E5B54]">Discovers, listens, and internalizes</p>
          </div>

          <div className="p-5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-2xl space-y-2">
            <span className="text-xs font-mono text-[#4A3528] font-bold">STAGE 3</span>
            <h4 className="font-serif font-bold text-base text-[#1C1B19]">New Practitioner</h4>
            <p className="text-xs text-[#5E5B54]">Applies the art with deep respect</p>
          </div>

          <div className="p-5 bg-[#EDF5F0] border border-[#2D4F38]/30 rounded-2xl space-y-2">
            <span className="text-xs font-mono text-[#2D4F38] font-bold">STAGE 4</span>
            <h4 className="font-serif font-bold text-base text-[#2D4F38]">Future Generation</h4>
            <p className="text-xs text-[#2D4F38]">The resonance continues to echo</p>
          </div>
        </div>
      </section>

      {/* 14. FINAL EMOTIONAL MOMENT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 pt-8">
        <div className="space-y-4">
          <p className="font-serif text-2xl sm:text-3xl text-[#5E5B54] leading-relaxed">
            «Some traditions disappear quietly.
          </p>
          <p className="font-serif text-2xl sm:text-3xl text-[#5E5B54] leading-relaxed">
            Some find another voice.
          </p>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1B19] leading-relaxed">
            Be the person who listens.»
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => onNavigate('/discover')}
            className="px-10 py-4 bg-[#C85A32] hover:bg-[#B34D28] text-white font-medium rounded-2xl shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2 cursor-pointer text-sm"
          >
            <span>Discover ANUNAAD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Modals */}
      {supportModalArtist && (
        <SupportArtistModal
          isOpen={!!supportModalArtist}
          onClose={() => setSupportModalArtist(null)}
          artistId={supportModalArtist.id}
          artistName={supportModalArtist.name}
          artistPortrait={supportModalArtist.portraitImage}
          artFormName={supportModalArtist.title}
          goalTitle={supportModalArtist.supportGoal?.title}
        />
      )}

      {checkoutOffering && (
        <RazorpayModal
          isOpen={!!checkoutOffering}
          onClose={() => setCheckoutOffering(null)}
          offeringId={checkoutOffering.id}
          itemTitle={checkoutOffering.title}
          artistName={checkoutOffering.artistName || 'Traditional Master'}
          priceInr={checkoutOffering.priceInr}
        />
      )}

      {videoModalOpen && videoData && (
        <VideoModal
          isOpen={videoModalOpen}
          onClose={() => { setVideoModalOpen(false); setVideoData(null); }}
          title={videoData.title}
          videoUrl={videoData.url}
          artistName={videoData.artistName}
          description={videoData.description}
        />
      )}

    </div>
  );
};
