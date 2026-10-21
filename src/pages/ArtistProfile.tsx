import React, { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { LineageTree } from '../components/common/LineageTree';
import { SupportArtistModal } from '../components/common/SupportArtistModal';
import { RazorpayModal } from '../components/common/RazorpayModal';
import { VideoModal } from '../components/common/VideoModal';
import {
  ShieldCheck, Heart, Play, ArrowLeft, Film,
  Sparkles, Calendar, BookOpen, Clock, Users
} from 'lucide-react';
import { Artist, ArtForm, Offering } from '../types';

interface ArtistProfileProps {
  artistId: string;
  onNavigate: (path: string) => void;
  initialTab?: string;
}

const normalizeArtistTab = (tabStr?: string): 'lineage' | 'audio' | 'video' | 'offerings' | 'patrons' => {
  if (!tabStr) return 'lineage';
  const clean = tabStr.toLowerCase().replace(/^[#?]/, '');
  if (clean === 'audio' || clean === 'sound' || clean === 'recordings') return 'audio';
  if (clean === 'video' || clean === 'videos' || clean === 'archive') return 'video';
  if (clean === 'offerings' || clean === 'masterclasses' || clean === 'workshops' || clean === 'learn') return 'offerings';
  if (clean === 'patrons' || clean === 'patronage' || clean === 'community') return 'patrons';
  return 'lineage';
};

export const ArtistProfile: React.FC<ArtistProfileProps> = ({ artistId, onNavigate, initialTab }) => {
  const { playTrack } = useAudio();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artForm, setArtForm] = useState<ArtForm | null>(null);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [activeTab, setActiveTab] = useState<'lineage' | 'audio' | 'video' | 'offerings' | 'patrons'>(() => normalizeArtistTab(initialTab));
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoData, setVideoData] = useState<{ title: string; url: string; artistName: string; description: string } | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(normalizeArtistTab(initialTab));
    }
  }, [initialTab]);

  const handleTabSwitch = (e: React.MouseEvent, tab: 'lineage' | 'audio' | 'video' | 'offerings' | 'patrons') => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTab(tab);
    try {
      window.history.replaceState(null, '', `/artists/${artistId}?section=${tab}`);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetch(`/api/artists/${artistId}`)
      .then(r => r.json())
      .then(data => {
        if (data.artist) {
          setArtist(data.artist);
          setArtForm(data.artForm);
          setOfferings(data.offerings || []);
        }
      })
      .catch(() => {});
  }, [artistId]);

  if (!artist) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#C85A32] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-serif text-lg text-[#5E5B54]">Locating Keeper's oral lineage...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      
      {/* Cover and Hero */}
      <div className="relative bg-[#1C1B19] text-white">
        <div className="h-72 sm:h-96 w-full relative overflow-hidden">
          <img
            src={artist.coverImage}
            alt={artist.name}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19] via-transparent to-black/60"></div>
          
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/artists');
            }}
            className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur text-xs text-white hover:bg-black/75 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Keepers</span>
          </button>
        </div>

        {/* Profile Info Overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 sm:-mt-32 relative z-10 pb-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-[#FDFBF7] shadow-2xl bg-[#E8E2D5] shrink-0">
                <img
                  src={artist.portraitImage}
                  alt={artist.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#C85A32] text-white text-[11px] font-mono uppercase">
                    {artist.yearsExperience}+ Years of Living Riyaz
                  </span>
                  {artist.verifiedStatus === 'verified' && (
                    <span className="px-3 py-0.5 rounded-full bg-[#2D4F38] text-white text-[11px] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> ✓ Verified Artist
                    </span>
                  )}
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
                  {artist.name}
                </h1>
                <p className="text-sm sm:text-base text-[#D8D1C2]">
                  {artist.title} • <span className="text-[#D97724]">{artist.location}</span>
                </p>
              </div>
            </div>

            {/* Support CTA */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSupportModalOpen(true);
                }}
                className="py-3 px-6 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Support This Keeper</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E8E2D5] gap-6 text-sm font-medium mb-8 overflow-x-auto">
          <button
            type="button"
            onClick={(e) => handleTabSwitch(e, 'lineage')}
            className={`pb-3 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'lineage'
                ? 'border-b-2 border-[#C85A32] text-[#C85A32] font-bold'
                : 'text-[#5E5B54] hover:text-[#1C1B19]'
            }`}
          >
            Oral Lineage & Biography
          </button>
          <button
            type="button"
            onClick={(e) => handleTabSwitch(e, 'audio')}
            className={`pb-3 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'audio'
                ? 'border-b-2 border-[#C85A32] text-[#C85A32] font-bold'
                : 'text-[#5E5B54] hover:text-[#1C1B19]'
            }`}
          >
            Sound & Archival Recordings ({artist.audioSamples.length})
          </button>
          <button
            type="button"
            onClick={(e) => handleTabSwitch(e, 'video')}
            className={`pb-3 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'video'
                ? 'border-b-2 border-[#C85A32] text-[#C85A32] font-bold'
                : 'text-[#5E5B54] hover:text-[#1C1B19]'
            }`}
          >
            Video Archive ({(artist as any).videoSamples?.length || 0})
          </button>
          <button
            type="button"
            onClick={(e) => handleTabSwitch(e, 'offerings')}
            className={`pb-3 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'offerings'
                ? 'border-b-2 border-[#C85A32] text-[#C85A32] font-bold'
                : 'text-[#5E5B54] hover:text-[#1C1B19]'
            }`}
          >
            Masterclasses & Fellowships ({offerings.length})
          </button>
          <button
            type="button"
            onClick={(e) => handleTabSwitch(e, 'patrons')}
            className={`pb-3 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'patrons'
                ? 'border-b-2 border-[#C85A32] text-[#C85A32] font-bold'
                : 'text-[#5E5B54] hover:text-[#1C1B19]'
            }`}
          >
            Patronage & Community
          </button>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-8">
            {activeTab === 'lineage' && (
              <div className="space-y-8">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#1C1B19]">Personal Voice</h3>
                  <blockquote className="font-serif text-lg sm:text-xl text-[#5C4033] italic border-l-3 border-[#C85A32] pl-4 py-1 leading-relaxed">
                    «{artist.quote}»
                  </blockquote>
                  <p className="text-sm text-[#5E5B54] leading-relaxed pt-2">
                    {artist.bio}
                  </p>
                </div>

                <LineageTree lineage={artist.lineage} artistName={artist.name} />
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#1C1B19]">Field & Living Recordings</h3>
                  <p className="text-xs text-[#5E5B54]">
                    Recorded with minimal digital compression to preserve ambient room tone and acoustic authenticity.
                  </p>
                  <div className="space-y-3 pt-2">
                    {artist.audioSamples.map(sample => (
                      <div
                        key={sample.id}
                        className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E8E2D5] flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <h4 className="font-serif font-bold text-base text-[#1C1B19]">{sample.title}</h4>
                          <p className="text-xs text-[#5E5B54]">{sample.description}</p>
                          <span className="text-[11px] font-mono text-[#8E877B] block">Duration: {sample.duration}</span>
                        </div>
                        <button
                          onClick={() => playTrack({
                            id: sample.id,
                            title: sample.title,
                            artistName: artist.name,
                            artFormName: artist.title,
                            region: artist.state,
                            audioUrl: sample.url
                          })}
                          className="w-11 h-11 rounded-full bg-[#C85A32] text-white flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-md cursor-pointer"
                        >
                          <Play className="w-5 h-5 ml-0.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#1C1B19]">Video Archive & Performances</h3>
                  <p className="text-xs text-[#5E5B54]">
                    Rare documentary footage, live performances, and teaching sessions preserved on ANUNAAD.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {((artist as any).videoSamples || []).map((video: any) => (
                      <button
                        key={video.id}
                        onClick={() => {
                          setVideoData({
                            title: video.title,
                            url: video.url,
                            artistName: artist.name,
                            description: video.description || ''
                          });
                          setVideoModalOpen(true);
                        }}
                        className="relative rounded-2xl overflow-hidden border border-[#E8E2D5] group cursor-pointer text-left w-full"
                      >
                        <div className="aspect-video bg-[#1C1B19] relative">
                          <img
                            src={artist.coverImage}
                            alt={video.title}
                            className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-[#C85A32]/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                              <Film className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-[#FAF7F0]">
                          <h4 className="font-serif font-bold text-sm text-[#1C1B19] leading-tight">{video.title}</h4>
                          <p className="text-[11px] text-[#5E5B54] mt-0.5">{video.description}</p>
                        </div>
                      </button>
                    ))}
                    {!((artist as any).videoSamples?.length) && (
                      <div className="col-span-2 py-8 text-center text-sm text-[#8E877B] italic">
                        No video archive available yet for this artist.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'offerings' && (
              <div className="space-y-6">
                <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E8E2D5] text-xs text-[#5E5B54] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D97724] shrink-0" />
                  <span>
                    <strong>Transparent Economics:</strong> 80% to 85% of your learning tuition is disbursed directly to {artist.name}'s wallet.
                  </span>
                </div>

                <div className="space-y-4">
                  {offerings.map(offering => (
                    <div
                      key={offering.id}
                      className="bg-white p-6 rounded-3xl border border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                    >
                      <div className="space-y-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#FAF7F0] text-[#C85A32] font-mono text-[10px] uppercase">
                          {offering.type.replace('_', ' ')} • {offering.level}
                        </span>
                        <h4 className="font-serif text-xl font-bold text-[#1C1B19]">{offering.title}</h4>
                        <p className="text-xs text-[#5E5B54] max-w-xl leading-relaxed">{offering.description}</p>
                        <div className="flex items-center gap-4 text-xs text-[#8E877B] font-mono pt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {offering.durationDesc}</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {offering.capacity - offering.bookedCount} seats left</span>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 space-y-2">
                        <div className="font-mono text-xl font-bold text-[#1C1B19]">
                          ₹{offering.priceInr.toLocaleString('en-IN')}
                        </div>
                        <button
                          onClick={() => setSelectedOffering(offering)}
                          className="w-full sm:w-auto py-2.5 px-5 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
                        >
                          Book / Enroll →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'patrons' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#1C1B19]">Patronage Circle</h3>
                <p className="text-xs text-[#5E5B54] leading-relaxed">
                  Join fellow cultural guardians supporting {artist.name}'s ongoing practice, instrument maintenance, and apprentice stipends.
                </p>
                
                {artist.supportGoal && (
                  <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#D97724]/20 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1C1B19]">{artist.supportGoal.title}</span>
                      <span className="font-mono text-[#C85A32] font-bold">
                        ₹{artist.supportGoal.currentAmount.toLocaleString('en-IN')} / ₹{artist.supportGoal.targetAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#E8E2D5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D97724] to-[#C85A32]"
                        style={{ width: `${Math.min(100, (artist.supportGoal.currentAmount / artist.supportGoal.targetAmount) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-[#5E5B54] italic">
                      {artist.supportGoal.description}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setSupportModalOpen(true)}
                  className="py-3 px-6 bg-[#C85A32] text-white text-xs font-semibold uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Contribute as a Patron →
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Direct Support Card */}
            <div className="bg-[#FAF7F0] p-6 rounded-3xl border border-[#E8E2D5] space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C85A32] block">
                Patron Guarantee
              </span>
              <h4 className="font-serif text-lg font-bold text-[#1C1B19]">Support This Keeper Directly</h4>
              <p className="text-xs text-[#5E5B54] leading-relaxed">
                95% of your donation is transferred directly into {artist.name}'s verified bank wallet via Razorpay Route.
              </p>
              <button
                onClick={() => setSupportModalOpen(true)}
                className="w-full py-3 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Support Master ({artist.name.split(' ')[0]})</span>
              </button>
            </div>

            {/* Art Form Context */}
            {artForm && (
              <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] space-y-3">
                <span className="text-xs font-mono text-[#D97724] uppercase tracking-wider block">
                  Preserved Art Form
                </span>
                <h4 className="font-serif text-lg font-bold text-[#1C1B19]">{artForm.name} ({artForm.devanagari})</h4>
                <p className="text-xs text-[#5E5B54] line-clamp-3 leading-relaxed">{artForm.shortDesc}</p>
                <button
                  onClick={() => onNavigate(`/art-forms/${artForm.slug}`)}
                  className="text-xs font-semibold text-[#C85A32] hover:underline block pt-1 cursor-pointer"
                >
                  Explore Art Form Details →
                </button>
              </div>
            )}

            {/* Cultural Ethics badge */}
            <div className="p-5 rounded-2xl bg-[#EDF5F0] border border-[#2D4F38]/20 text-xs text-[#2D4F38] space-y-1.5">
              <span className="font-bold block">Culture Is Not A Commodity</span>
              <p className="text-[11px] leading-relaxed">
                {artist.name} exercises complete ownership over their teachings, recordings, and historical representation on ANUNAAD.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Modals */}
      {supportModalOpen && (
        <SupportArtistModal
          isOpen={supportModalOpen}
          onClose={() => setSupportModalOpen(false)}
          artistId={artist.id}
          artistName={artist.name}
          artistPortrait={artist.portraitImage}
          artFormName={artist.title}
          goalTitle={artist.supportGoal?.title}
        />
      )}

      {selectedOffering && (
        <RazorpayModal
          isOpen={!!selectedOffering}
          onClose={() => setSelectedOffering(null)}
          offeringId={selectedOffering.id}
          itemTitle={selectedOffering.title}
          artistName={artist.name}
          priceInr={selectedOffering.priceInr}
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
