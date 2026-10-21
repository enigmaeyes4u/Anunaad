import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Artist, ArtistWallet, LedgerEntry, Offering, ArtistPayout } from '../types';
import {
  Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck,
  PlusCircle, Sparkles, AlertCircle, CheckCircle2, Clock,
  Edit3, X, Save, BookOpen, Music, Film, Trash2, Play
} from 'lucide-react';

interface ArtistDashboardProps {
  onNavigate: (path: string) => void;
}

export const ArtistDashboard: React.FC<ArtistDashboardProps> = ({ onNavigate }) => {
  const { user, token } = useAuth();
  const [data, setData] = useState<{
    artist: Artist;
    wallet: ArtistWallet;
    offerings: Offering[];
    recentSales: any[];
    ledger: LedgerEntry[];
    payouts: ArtistPayout[];
  } | null>(null);

  const [payoutAmount, setPayoutAmount] = useState<string>('5000');
  const [bankLast4, setBankLast4] = useState<string>('4921');
  const [ifsc, setIfsc] = useState<string>('SBIN0001234');
  const [payoutSuccess, setPayoutSuccess] = useState<string>('');
  const [payoutError, setPayoutError] = useState<string>('');
  const [loadingPayout, setLoadingPayout] = useState<boolean>(false);

  // Edit profile modal state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', title: '', bio: '', quote: '', location: '', yearsExperience: 0, portraitImage: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Create masterclass modal state
  const [createOfferingOpen, setCreateOfferingOpen] = useState(false);
  const [offeringForm, setOfferingForm] = useState({ title: '', description: '', type: 'live_session', level: 'beginner', priceInr: '', capacity: '10', durationDesc: '60 min', language: 'Hindi' });
  const [savingOffering, setSavingOffering] = useState(false);
  const [offeringError, setOfferingError] = useState('');

  // Media (Music / Video) management state
  const [addMediaOpen, setAddMediaOpen] = useState(false);
  const [mediaForm, setMediaForm] = useState<{ type: 'audio' | 'video'; title: string; url: string; duration: string; description: string }>({
    type: 'audio',
    title: '',
    url: '',
    duration: '4:30',
    description: ''
  });
  const [savingMedia, setSavingMedia] = useState(false);
  const [mediaError, setMediaError] = useState('');

  const [selectedStudioArtistId, setSelectedStudioArtistId] = useState<string>('');

  const fetchData = (overrideArtistId?: string) => {
    if (!token) return;
    const targetId = overrideArtistId !== undefined ? overrideArtistId : selectedStudioArtistId;
    const url = targetId ? `/api/artist/dashboard?artistId=${targetId}` : '/api/artist/dashboard';
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d && d.artist) {
          setData(d);
          setSelectedStudioArtistId(d.artist.id);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleOpenEditProfile = () => {
    if (!data?.artist) return;
    setEditForm({
      name: data.artist.name,
      title: data.artist.title,
      bio: data.artist.bio || '',
      quote: data.artist.quote || '',
      location: data.artist.location || '',
      yearsExperience: data.artist.yearsExperience || 0,
      portraitImage: data.artist.portraitImage || ''
    });
    setProfileSaved(false);
    setEditProfileOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    setSavingProfile(true);
    try {
      const res = await fetch('/api/artist/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error('Failed');
      setProfileSaved(true);
      fetchData();
      setTimeout(() => setEditProfileOpen(false), 1500);
    } catch {
      // silent
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateOffering = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingOffering(true);
    setOfferingError('');
    try {
      const res = await fetch('/api/artist/offerings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...offeringForm, priceInr: Number(offeringForm.priceInr), capacity: Number(offeringForm.capacity) })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create');
      fetchData();
      setCreateOfferingOpen(false);
      setOfferingForm({ title: '', description: '', type: 'live_session', level: 'beginner', priceInr: '', capacity: '10', durationDesc: '60 min', language: 'Hindi' });
    } catch (err: any) {
      setOfferingError(err.message);
    } finally {
      setSavingOffering(false);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMediaError('Please sign in to add recordings.');
      return;
    }
    setSavingMedia(true);
    setMediaError('');
    try {
      const res = await fetch('/api/artist/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(mediaForm)
      });
      
      const rawText = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(rawText);
      } catch {
        throw new Error(`Server returned non-JSON response. Please ensure backend is running with "npm start".`);
      }

      if (!res.ok) throw new Error(json.error || 'Failed to add media');

      // Optimistically update local artist data so new track appears immediately
      const newMediaItem = json.media || {
        id: `sample-${mediaForm.type}-${Date.now()}`,
        ...mediaForm
      };
      setData(prev => {
        if (!prev) return prev;
        if (mediaForm.type === 'audio') {
          return {
            ...prev,
            artist: {
              ...prev.artist,
              audioSamples: [...(prev.artist.audioSamples || []), newMediaItem]
            }
          };
        } else {
          return {
            ...prev,
            artist: {
              ...prev.artist,
              videoSamples: [...(prev.artist.videoSamples || []), newMediaItem]
            }
          };
        }
      });

      setAddMediaOpen(false);
      setMediaForm({ type: 'audio', title: '', url: '', duration: '4:30', description: '' });
      fetchData();
    } catch (err: any) {
      setMediaError(err.message || 'Failed to save recording');
    } finally {
      setSavingMedia(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this recording?')) return;
    // Optimistic deletion
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        artist: {
          ...prev.artist,
          audioSamples: (prev.artist.audioSamples || []).filter(m => m.id !== id),
          videoSamples: (prev.artist.videoSamples || []).filter(m => m.id !== id)
        }
      };
    });

    try {
      const res = await fetch(`/api/artist/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch {
      // silent
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPayout(true);
    setPayoutSuccess('');
    setPayoutError('');

    try {
      const res = await fetch('/api/artist/payout-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amountInr: payoutAmount,
          bankAccountLast4: bankLast4,
          ifscCode: ifsc
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Payout request failed');
      }

      setPayoutSuccess(json.message);
      fetchData();
    } catch (err: any) {
      setPayoutError(err.message || 'Failed to submit payout request');
    } finally {
      setLoadingPayout(false);
    }
  };

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#C85A32] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-serif text-lg text-[#5E5B54]">Opening your Artist Wallet & Ledger...</p>
      </div>
    );
  }

  const { artist, wallet, offerings, ledger, payouts } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">

      {/* Atelier Studio Quick-Switcher (Inspect any tradition's dashboard) */}
      <div className="bg-white p-4 px-6 rounded-2xl border border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs">
          <div className="w-7 h-7 rounded-lg bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#C85A32]" />
          </div>
          <div>
            <span className="font-bold text-[#1C1B19] block">Atelier Studio Switcher:</span>
            <span className="text-[#8E877B] text-[11px]">Select any of India's living masters to preview and manage their studio:</span>
          </div>
        </div>

        <select
          value={selectedStudioArtistId || artist.id}
          onChange={(e) => {
            const newId = e.target.value;
            setSelectedStudioArtistId(newId);
            fetchData(newId);
          }}
          className="px-3.5 py-2 rounded-xl border border-[#E8E2D5] bg-[#FAF7F0] text-xs font-semibold text-[#1C1B19] focus:outline-none focus:border-[#C85A32] cursor-pointer shadow-xs"
        >
          <option value="artist-gafur">🎨 Padma Shri Abdul Gafur Khatri — Rogan Art (Gujarat)</option>
          <option value="artist-kamala">🖌️ Kamala Devi Jha — Madhubani Painting (Bihar)</option>
          <option value="artist-raghunath">🎵 Ustad Raghunath Manganiyar — Maand Vocal (Rajasthan)</option>
          <option value="artist-gouranga">🪕 Gouranga Das Baul — Baul Mystic Songs (Bengal)</option>
          <option value="artist-teejan">⚡ Teejan Devi Sahu — Kapalik Pandavani (Chhattisgarh)</option>
          <option value="artist-tarapada">🎭 Guru Tarapada Mahato — Purulia Chhau Dance (West Bengal)</option>
          <option value="artist-bhabananda">🌿 Bhabananda Barbayan — Sattriya Classical Dance (Assam)</option>
          <option value="artist-chalapathi">🏮 Padma Shri Dalavai Chalapathi Rao — Tholu Bommalata (Andhra)</option>
        </select>
      </div>
      
      {/* Header */}
      <div className="bg-[#FAF7F0] p-6 sm:p-10 rounded-3xl border border-[#E8E2D5] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={artist.portraitImage}
            alt={artist.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop';
            }}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D97724] shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#C85A32] font-semibold">Keeper's Studio</span>
              {artist.verifiedStatus === 'verified' && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#2D4F38] text-white text-[10px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> ✓ Verified Artist
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#1C1B19]">{artist.name}</h1>
            <p className="text-xs text-[#5E5B54]">{artist.title} • {artist.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenEditProfile}
            className="py-2.5 px-5 bg-[#C85A32] text-white text-xs font-semibold rounded-xl hover:bg-[#B34D28] cursor-pointer flex items-center gap-2 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
          <button
            onClick={() => onNavigate(`/artists/${artist.id}`)}
            className="py-2.5 px-5 bg-white border border-[#E8E2D5] text-xs font-semibold text-[#1C1B19] rounded-xl hover:bg-[#FAF7F0] cursor-pointer"
          >
            View Public Profile →
          </button>
        </div>
      </div>

      {/* ARTIST WALLET METRICS */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1C1B19] flex items-center gap-2">
          <Wallet className="w-6 h-6 text-[#C85A32]" />
          <span>Artist Wallet (Double-Entry Financial Ledger)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border-2 border-[#2D4F38]/30 space-y-2 shadow-sm">
            <span className="text-xs font-mono uppercase text-[#2D4F38] font-bold block">Available Balance</span>
            <div className="font-mono text-3xl font-bold text-[#2D4F38]">
              ₹{wallet.availableBalanceInr.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#5E5B54]">Cleared funds ready for Razorpay Route bank payout</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] space-y-2">
            <span className="text-xs font-mono uppercase text-[#D97724] font-bold block">Pending Settlement</span>
            <div className="font-mono text-3xl font-bold text-[#D97724]">
              ₹{wallet.pendingBalanceInr.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#5E5B54]">In transit through banking batch hours</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] space-y-2">
            <span className="text-xs font-mono uppercase text-[#5E5B54] block">This Month's Earnings</span>
            <div className="font-mono text-3xl font-bold text-[#1C1B19]">
              ₹{(wallet.thisMonthEarningsInr || 14800).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#5E5B54]">Gross artist share from masterclasses & tips</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] space-y-2">
            <span className="text-xs font-mono uppercase text-[#5E5B54] block">Lifetime Earnings</span>
            <div className="font-mono text-3xl font-bold text-[#1C1B19]">
              ₹{wallet.lifetimeEarningsInr.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#5E5B54]">Total sustainable income generated on ANUNAAD</p>
          </div>

        </div>
      </div>

      {/* Payout Settlement Action & Ledger Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Request Payout Form */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] space-y-5 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#1C1B19]">Request Bank Settlement</h3>
          <p className="text-xs text-[#5E5B54] leading-relaxed">
            Disburse your available wallet balance directly to your linked Indian bank account via Razorpay Route.
          </p>

          {payoutSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{payoutSuccess}</span>
            </div>
          )}

          {payoutError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{payoutError}</span>
            </div>
          )}

          <form onSubmit={handleRequestPayout} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Settlement Amount (INR)</label>
              <input
                type="number"
                required
                min="1000"
                max={wallet.availableBalanceInr}
                value={payoutAmount}
                onChange={e => setPayoutAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-mono focus:outline-none focus:border-[#C85A32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Linked Bank Account (Last 4 Digits)</label>
              <input
                type="text"
                required
                value={bankLast4}
                onChange={e => setBankLast4(e.target.value)}
                placeholder="4921"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-mono focus:outline-none focus:border-[#C85A32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Bank IFSC Code</label>
              <input
                type="text"
                required
                value={ifsc}
                onChange={e => setIfsc(e.target.value)}
                placeholder="SBIN0001234"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-mono uppercase focus:outline-none focus:border-[#C85A32]"
              />
            </div>

            <button
              type="submit"
              disabled={loadingPayout || wallet.availableBalanceInr < 1000}
              className="w-full py-3 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loadingPayout ? 'Submitting...' : 'Disburse to Bank (24 Hrs) →'}
            </button>
          </form>
        </div>

        {/* Double-Entry Ledger History */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#1C1B19]">
              Transparent Transaction Ledger
            </h3>
            <span className="text-[11px] font-mono text-[#8E877B]">Cryptographic Hash Chained</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F0] border-b border-[#E8E2D5] font-mono text-[#5E5B54]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Description & Breakdown</th>
                  <th className="p-3 text-right">Artist Credit / Debit</th>
                  <th className="p-3 text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D5]">
                {ledger.map(entry => (
                  <tr key={entry.id} className="hover:bg-[#FAF7F0]/50 transition-colors">
                    <td className="p-3 text-[#8E877B] font-mono whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-[#1C1B19]">{entry.description}</div>
                      <div className="text-[10px] font-mono text-[#8E877B] truncate max-w-xs">
                        Hash: {entry.referenceHash.slice(0, 16)}...
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold whitespace-nowrap">
                      {entry.entryType.startsWith('credit') ? (
                        <span className="text-[#2D4F38]">+₹{entry.amountInr.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-red-600">-₹{entry.amountInr.toLocaleString('en-IN')}</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono text-[#5E5B54] whitespace-nowrap">
                      ₹{entry.balanceAfterInr.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Offerings Manager */}
      <div className="space-y-6">
        <div className="border-b border-[#E8E2D5] pb-3 flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold text-[#1C1B19]">
            My Teaching Programs & Cohorts ({offerings.length})
          </h3>
          <button
            onClick={() => setCreateOfferingOpen(true)}
            className="py-2 px-4 bg-[#1C1B19] hover:bg-[#C85A32] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Create New Masterclass
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {offerings.map(o => (
            <div key={o.id} className="bg-white p-5 rounded-2xl border border-[#E8E2D5] space-y-3">
              <span className="text-[10px] font-mono uppercase bg-[#FAF7F0] text-[#C85A32] px-2 py-0.5 rounded">
                {o.type.replace('_', ' ')} • {o.level}
              </span>
              <h4 className="font-serif font-bold text-base text-[#1C1B19]">{o.title}</h4>
              <div className="text-xs text-[#5E5B54] flex items-center justify-between font-mono">
                <span>Tuition: ₹{o.priceInr}</span>
                <span>Enrolled: {o.bookedCount} / {o.capacity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Sound & Video Archives Section ─── */}
      <div className="space-y-6">
        <div className="border-b border-[#E8E2D5] pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1C1B19]">
              Sound & Video Archives
            </h3>
            <p className="text-xs text-[#5E5B54] mt-0.5">
              Preserve your authentic musical recordings and performance documentaries for public discovery.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMediaForm({ type: 'audio', title: '', url: '/audio/maand_sarangi.wav', duration: '4:30', description: '' });
                setAddMediaOpen(true);
              }}
              className="py-2 px-3.5 bg-[#FAF7F0] hover:bg-[#E8E2D5] text-[#1C1B19] border border-[#E8E2D5] text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Music className="w-3.5 h-3.5 text-[#C85A32]" />
              Add Audio Track
            </button>
            <button
              onClick={() => {
                setMediaForm({ type: 'video', title: '', url: 'https://www.youtube.com/embed/fJ9rUzIMcZQ', duration: '12:00', description: '' });
                setAddMediaOpen(true);
              }}
              className="py-2 px-3.5 bg-[#1C1B19] hover:bg-[#C85A32] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5" />
              Add Video Recording
            </button>
          </div>
        </div>

        {/* Audio Recordings List */}
        <div>
          <h4 className="font-serif font-bold text-base text-[#1C1B19] mb-3 flex items-center gap-2">
            <Music className="w-4 h-4 text-[#C85A32]" />
            Audio Samples & Traditional Songs ({(artist.audioSamples || []).length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(artist.audioSamples || []).map((sample: any) => (
              <div key={sample.id} className="bg-white p-4 rounded-2xl border border-[#E8E2D5] flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center text-[#C85A32] shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-serif font-bold text-sm text-[#1C1B19] truncate">{sample.title}</h5>
                    <p className="text-[11px] text-[#5E5B54] truncate">{sample.description || 'Traditional Archival Sample'} • {sample.duration}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMedia(sample.id)}
                  title="Remove track"
                  className="p-1.5 text-[#8E877B] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {!(artist.audioSamples?.length) && (
              <p className="text-xs text-[#8E877B] italic col-span-2">No audio tracks added yet. Click &quot;Add Audio Track&quot; above.</p>
            )}
          </div>
        </div>

        {/* Video Recordings List */}
        <div>
          <h4 className="font-serif font-bold text-base text-[#1C1B19] mb-3 flex items-center gap-2">
            <Film className="w-4 h-4 text-[#C85A32]" />
            Video Performances & Footage ({(artist.videoSamples || []).length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(artist.videoSamples || []).map((sample: any) => (
              <div key={sample.id} className="bg-white p-4 rounded-2xl border border-[#E8E2D5] flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center text-[#C85A32] shrink-0">
                    <Film className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-serif font-bold text-sm text-[#1C1B19] truncate">{sample.title}</h5>
                    <p className="text-[11px] text-[#5E5B54] truncate">{sample.description || 'Documentary performance'} • {sample.duration}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMedia(sample.id)}
                  title="Remove video"
                  className="p-1.5 text-[#8E877B] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {!(artist.videoSamples?.length) && (
              <p className="text-xs text-[#8E877B] italic col-span-2">No video recordings added yet. Click &quot;Add Video Recording&quot; above.</p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Edit Profile Modal ─── */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#FDFBF7] rounded-2xl max-w-lg w-full shadow-2xl border border-[#E8E2D5] overflow-hidden">
            <div className="bg-[#1C1B19] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#D97724]" />
                <h3 className="font-semibold text-sm">Edit Artist Profile</h3>
              </div>
              <button onClick={() => setEditProfileOpen(false)} className="p-1 rounded-full hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {profileSaved && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Profile saved successfully!
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Full Name / Stage Name</label>
                  <input
                    value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Title / Art Specialty</label>
                  <input
                    value={editForm.title}
                    onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Location / City</label>
                  <input
                    value={editForm.location}
                    onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={editForm.yearsExperience}
                    onChange={e => setEditForm(f => ({ ...f, yearsExperience: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Portrait Image URL</label>
                  <input
                    value={editForm.portraitImage}
                    onChange={e => setEditForm(f => ({ ...f, portraitImage: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32] font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Artist Quote</label>
                  <textarea
                    rows={2}
                    value={editForm.quote}
                    onChange={e => setEditForm(f => ({ ...f, quote: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32] resize-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Biography</label>
                  <textarea
                    rows={4}
                    value={editForm.bio}
                    onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32] resize-none"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="w-full py-3 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Create New Masterclass Modal ─── */}
      {createOfferingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#FDFBF7] rounded-2xl max-w-lg w-full shadow-2xl border border-[#E8E2D5] overflow-hidden">
            <div className="bg-[#1C1B19] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D97724]" />
                <h3 className="font-semibold text-sm">Create New Masterclass</h3>
              </div>
              <button onClick={() => setCreateOfferingOpen(false)} className="p-1 rounded-full hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateOffering} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {offeringError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">{offeringError}</div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Masterclass Title *</label>
                <input
                  required
                  value={offeringForm.title}
                  onChange={e => setOfferingForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Introduction to Maand Gayaki"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={offeringForm.description}
                  onChange={e => setOfferingForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Type</label>
                  <select
                    value={offeringForm.type}
                    onChange={e => setOfferingForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  >
                    <option value="live_session">Live Session</option>
                    <option value="cohort">Cohort Course</option>
                    <option value="retreat">Retreat / In-Person</option>
                    <option value="recorded">Recorded Course</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Level</label>
                  <select
                    value={offeringForm.level}
                    onChange={e => setOfferingForm(f => ({ ...f, level: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Price (INR) *</label>
                  <input
                    required
                    type="number"
                    min="100"
                    value={offeringForm.priceInr}
                    onChange={e => setOfferingForm(f => ({ ...f, priceInr: e.target.value }))}
                    placeholder="e.g. 2500"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Capacity (seats)</label>
                  <input
                    type="number"
                    min="1"
                    value={offeringForm.capacity}
                    onChange={e => setOfferingForm(f => ({ ...f, capacity: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Duration</label>
                  <input
                    value={offeringForm.durationDesc}
                    onChange={e => setOfferingForm(f => ({ ...f, durationDesc: e.target.value }))}
                    placeholder="e.g. 8 weeks"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Language</label>
                  <input
                    value={offeringForm.language}
                    onChange={e => setOfferingForm(f => ({ ...f, language: e.target.value }))}
                    placeholder="Hindi / English"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={savingOffering}
                className="w-full py-3 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {savingOffering ? 'Creating...' : 'Publish Masterclass'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── Add Media Modal (Music / Audio / Video) ─── */}
      {addMediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#FDFBF7] rounded-2xl max-w-lg w-full shadow-2xl border border-[#E8E2D5] overflow-hidden">
            <div className="bg-[#1C1B19] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {mediaForm.type === 'audio' ? <Music className="w-4 h-4 text-[#D97724]" /> : <Film className="w-4 h-4 text-[#D97724]" />}
                <h3 className="font-semibold text-sm">
                  {mediaForm.type === 'audio' ? 'Add Audio Sample / Music' : 'Add Video Recording / Documentary'}
                </h3>
              </div>
              <button onClick={() => setAddMediaOpen(false)} className="p-1 rounded-full hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddMedia} className="p-6 space-y-4">
              {mediaError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {mediaError}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Recording Media Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaForm(f => ({ ...f, type: 'audio', url: f.url.includes('youtube') ? '/audio/maand_sarangi.wav' : f.url }))}
                    className={`py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer ${mediaForm.type === 'audio' ? 'bg-[#C85A32] text-white border-[#C85A32]' : 'bg-white text-[#5E5B54] border-[#E8E2D5]'}`}
                  >
                    <Music className="w-3.5 h-3.5" /> Audio / Music
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaForm(f => ({ ...f, type: 'video', url: f.url.startsWith('/audio') ? 'https://www.youtube.com/embed/fJ9rUzIMcZQ' : f.url }))}
                    className={`py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer ${mediaForm.type === 'video' ? 'bg-[#C85A32] text-white border-[#C85A32]' : 'bg-white text-[#5E5B54] border-[#E8E2D5]'}`}
                  >
                    <Film className="w-3.5 h-3.5" /> Video Footage
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Track / Recording Title *</label>
                <input
                  required
                  value={mediaForm.title}
                  onChange={e => setMediaForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={mediaForm.type === 'audio' ? 'e.g. Traditional Sarangi Alap in Raga Des' : 'e.g. Live Performance at Royal Courtyard'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E5B54] mb-1">
                  {mediaForm.type === 'audio' ? 'Audio File URL or Preset *' : 'Video / YouTube Embed URL *'}
                </label>
                <input
                  required
                  value={mediaForm.url}
                  onChange={e => setMediaForm(f => ({ ...f, url: e.target.value }))}
                  placeholder={mediaForm.type === 'audio' ? '/audio/maand_sarangi.wav or https://...' : 'https://www.youtube.com/embed/...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-mono focus:outline-none focus:border-[#C85A32]"
                />
                {mediaForm.type === 'audio' && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-[#8E877B] self-center">Presets:</span>
                    {['/audio/maand_sarangi.wav', '/audio/baul_ektara.wav', '/audio/pandavani_tambura.wav', '/audio/sattriya_flute.wav'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setMediaForm(f => ({ ...f, url: p }))}
                        className="text-[10px] bg-[#FAF7F0] border border-[#E8E2D5] px-2 py-0.5 rounded text-[#5E5B54] hover:text-[#C85A32] cursor-pointer"
                      >
                        {p.split('/').pop()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Duration (MM:SS)</label>
                  <input
                    value={mediaForm.duration}
                    onChange={e => setMediaForm(f => ({ ...f, duration: e.target.value }))}
                    placeholder="4:30"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-mono focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Description / Context</label>
                  <input
                    value={mediaForm.description}
                    onChange={e => setMediaForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="e.g. Rare ancestral rendition"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingMedia}
                className="w-full py-3 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {savingMedia ? 'Saving...' : 'Add to Cultural Archive'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
