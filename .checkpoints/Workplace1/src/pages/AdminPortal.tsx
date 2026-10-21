import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield, Users, Wallet, FileText, Settings, AlertTriangle,
  CheckCircle2, XCircle, Search, RefreshCw, Lock, Sparkles, Activity
} from 'lucide-react';
import { Artist, PlatformSettings, CmsContent, LedgerEntry, ArtistPayout, AuditLog } from '../types';

interface AdminPortalProps {
  onNavigate: (path: string) => void;
  initialTab?: string;
}

const validTabs = ['metrics', 'artists', 'cms', 'ledger', 'payouts', 'settings', 'audit'] as const;
type TabType = typeof validTabs[number];

const normalizeTab = (tabStr?: string): TabType => {
  if (!tabStr) return 'metrics';
  const clean = tabStr.toLowerCase().replace(/^[#?]/, '');
  if (clean === 'overview' || clean === 'kpis' || clean === 'metrics') return 'metrics';
  if (clean === 'verifications' || clean === 'artist' || clean === 'artists') return 'artists';
  if (clean === 'cms' || clean === 'website') return 'cms';
  if (clean === 'ledger' || clean === 'financial') return 'ledger';
  if (clean === 'payouts' || clean === 'payout') return 'payouts';
  if (clean === 'settings' || clean === 'rules' || clean === 'emergency') return 'settings';
  if (clean === 'audit' || clean === 'logs' || clean === 'security') return 'audit';
  return (validTabs as readonly string[]).includes(clean) ? (clean as TabType) : 'metrics';
};

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigate, initialTab }) => {
  const { user, token, loading, isAdmin, isSuperAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>(() => normalizeTab(initialTab));

  useEffect(() => {
    if (initialTab) {
      setActiveTab(normalizeTab(initialTab));
    }
  }, [initialTab]);
  
  // Data states
  const [metrics, setMetrics] = useState<any>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [cms, setCms] = useState<CmsContent | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [payouts, setPayouts] = useState<ArtistPayout[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Notifications
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAll = () => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    fetch('/api/admin/metrics', { headers }).then(r => r.json()).then(d => setMetrics(d.metrics)).catch(() => {});
    fetch('/api/admin/artists', { headers }).then(r => r.json()).then(d => setArtists(d.artists || [])).catch(() => {});
    fetch('/api/admin/settings', { headers }).then(r => r.json()).then(d => setSettings(d.settings)).catch(() => {});
    fetch('/api/admin/cms', { headers }).then(r => r.json()).then(d => setCms(d.cms)).catch(() => {});
    fetch('/api/admin/ledger', { headers }).then(r => r.json()).then(d => setLedger(d.ledger || [])).catch(() => {});
    fetch('/api/admin/payouts', { headers }).then(r => r.json()).then(d => setPayouts(d.payouts || [])).catch(() => {});
    fetch('/api/admin/audit-logs', { headers }).then(r => r.json()).then(d => setAuditLogs(d.auditLogs || [])).catch(() => {});
  };

  useEffect(() => {
    fetchAll();
  }, [token]);

  // Tab switcher with zero full-page reload
  const handleTabSwitch = (e: React.MouseEvent, tab: TabType) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTab(tab);
    try {
      window.history.replaceState(null, '', `/admin?section=${tab}`);
    } catch {
      // fallback
    }
  };

  // Handle Artist verification
  const handleVerifyArtist = async (artistId: string, status: 'verified' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/artists/${artistId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          notes: status === 'verified' ? 'Lineage confirmed by oral tradition curatorial circle' : 'Insufficient oral documentation'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg({ type: 'success', text: data.message });
      fetchAll();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Action failed' });
    }
  };

  // Handle Payout approval
  const handleProcessPayout = async (payoutId: string, status: 'completed' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/payouts/${payoutId}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          referenceId: `RZP_DISBURSE_${Date.now()}`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg({ type: 'success', text: data.message });
      fetchAll();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Payout processing failed' });
    }
  };

  // Handle CMS Update
  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cms) return;

    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cms)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg({ type: 'success', text: 'Homepage and editorial content updated live across the platform!' });
      fetchAll();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  // Handle Settings Update (Commission rules & Emergency toggles)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg({ type: 'success', text: 'Platform configuration updated. Historical ledger records preserved.' });
      fetchAll();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#C85A32] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-serif text-lg text-[#5E5B54]">Verifying administrative credentials...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <Lock className="w-12 h-12 text-[#C85A32] mx-auto" />
        <h1 className="font-serif text-2xl font-bold text-[#1C1B19]">Administrative Access Restricted</h1>
        <p className="text-xs text-[#5E5B54]">
          This privileged portal requires Super Admin or Content Admin credentials.
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/login');
          }}
          className="py-2.5 px-5 bg-[#1C1B19] text-white text-xs font-semibold rounded-xl cursor-pointer hover:bg-[#C85A32] transition-colors"
        >
          Sign In with Admin Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Admin Header */}
      <div className="bg-[#1C1B19] text-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#3A3630] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#D97724] font-semibold">
              Super Admin Console • Encrypted
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            ANUNAAD Platform Management
          </h1>
          <p className="text-xs text-[#A8A296]">
            Administrator: <strong>{user?.name}</strong> ({user?.email}) • Role: <span className="font-mono text-[#E89254] uppercase">{user?.role}</span>
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-[#2D2A24] p-1.5 rounded-2xl border border-[#4A453C]">
          <button
            type="button"
            onClick={(e) => handleTabSwitch(e, 'metrics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'metrics' ? 'bg-[#C85A32] text-white font-bold' : 'text-[#D8D1C2] hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={(e) => handleTabSwitch(e, 'artists')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'artists' ? 'bg-[#C85A32] text-white font-bold' : 'text-[#D8D1C2] hover:text-white'
            }`}
          >
            Verifications
          </button>
          <button
            type="button"
            onClick={(e) => handleTabSwitch(e, 'cms')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'cms' ? 'bg-[#C85A32] text-white font-bold' : 'text-[#D8D1C2] hover:text-white'
            }`}
          >
            Website CMS
          </button>
          <button
            type="button"
            onClick={(e) => handleTabSwitch(e, 'ledger')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'ledger' ? 'bg-[#C85A32] text-white font-bold' : 'text-[#D8D1C2] hover:text-white'
            }`}
          >
            Financial Ledger
          </button>
          <button
            type="button"
            onClick={(e) => handleTabSwitch(e, 'payouts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'payouts' ? 'bg-[#C85A32] text-white font-bold' : 'text-[#D8D1C2] hover:text-white'
            }`}
          >
            Payouts ({payouts.filter(p => p.status === 'pending').length})
          </button>
          <button
            type="button"
            onClick={(e) => handleTabSwitch(e, 'settings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'settings' ? 'bg-[#C85A32] text-white font-bold' : 'text-[#D8D1C2] hover:text-white'
            }`}
          >
            Rules & Emergency
          </button>
          <button
            type="button"
            onClick={(e) => handleTabSwitch(e, 'audit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'audit' ? 'bg-[#C85A32] text-white font-bold' : 'text-[#D8D1C2] hover:text-white'
            }`}
          >
            Audit Log
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {msg && (
        <div className={`p-4 rounded-2xl text-xs font-medium flex items-center justify-between shadow-sm ${
          msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <span>{msg.text}</span>
          <button type="button" onClick={() => setMsg(null)} className="font-bold ml-4 cursor-pointer">×</button>
        </div>
      )}

      {/* TAB 1: METRICS OVERVIEW */}
      {activeTab === 'metrics' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] space-y-2 shadow-sm">
              <span className="text-xs font-mono uppercase text-[#8E877B] block">Gross Transaction Volume</span>
              <div className="font-mono text-3xl font-bold text-[#1C1B19]">
                ₹{metrics.grossVolumeInr.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-[#5E5B54]">Total platform GMV processed</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] space-y-2 shadow-sm">
              <span className="text-xs font-mono uppercase text-[#2D4F38] font-bold block">Artist Share (80-95%)</span>
              <div className="font-mono text-3xl font-bold text-[#2D4F38]">
                ₹{metrics.artistEarningsInr.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-[#5E5B54]">Credited into living keepers' wallets</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] space-y-2 shadow-sm">
              <span className="text-xs font-mono uppercase text-[#C85A32] font-bold block">ANUNAAD Platform Share</span>
              <div className="font-mono text-3xl font-bold text-[#C85A32]">
                ₹{metrics.anunaadRevenueInr.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-[#5E5B54]">Archival, streaming & operational fund</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] space-y-2 shadow-sm">
              <span className="text-xs font-mono uppercase text-[#8E877B] block">Total Keepers</span>
              <div className="font-mono text-3xl font-bold text-[#1C1B19]">
                {metrics.totalArtistsCount}
              </div>
              <p className="text-[11px] text-[#5E5B54]">
                {metrics.verifiedArtistsCount} Verified • {metrics.pendingArtistsCount} Pending Review
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARTIST VERIFICATION WORKFLOW */}
      {activeTab === 'artists' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1C1B19]">Artist Verification Pipeline</h2>
              <p className="text-xs text-[#5E5B54]">Authenticate oral lineages and grant the verified keeper badge.</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                fetchAll();
              }}
              className="text-xs text-[#C85A32] flex items-center gap-1 cursor-pointer hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <div className="space-y-4">
            {artists.map(artist => (
              <div
                key={artist.id}
                className="p-5 bg-[#FAF7F0] rounded-2xl border border-[#E8E2D5] flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={artist.portraitImage}
                    alt={artist.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#D97724] shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-lg font-bold text-[#1C1B19]">{artist.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                        artist.verifiedStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                        artist.verifiedStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {artist.verifiedStatus}
                      </span>
                    </div>
                    <p className="text-xs text-[#C85A32]">{artist.title} • {artist.location}</p>
                    <p className="text-xs text-[#5E5B54]"><strong>Guru:</strong> {artist.lineage?.guruName || 'Oral Tradition'}</p>
                    <p className="text-xs text-[#8E877B] italic">«{artist.quote}»</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {artist.verifiedStatus !== 'verified' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleVerifyArtist(artist.id, 'verified');
                      }}
                      className="py-2 px-4 bg-[#2D4F38] hover:bg-[#233d2b] text-white text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Verify</span>
                    </button>
                  )}

                  {artist.verifiedStatus !== 'rejected' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleVerifyArtist(artist.id, 'rejected');
                      }}
                      className="py-2 px-3 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WEBSITE CMS */}
      {activeTab === 'cms' && cms && (
        <form onSubmit={handleSaveCms} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] space-y-6 shadow-sm">
          <div className="border-b border-[#E8E2D5] pb-3">
            <h2 className="font-serif text-2xl font-bold text-[#1C1B19]">Website Content Management (CMS)</h2>
            <p className="text-xs text-[#5E5B54]">Update live homepage titles, subtexts, and announcements without touching code.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Hero Tagline</label>
              <input
                type="text"
                value={cms.heroTagline}
                onChange={e => setCms({ ...cms, heroTagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-serif text-base focus:outline-none focus:border-[#C85A32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Hero Supporting Subtext</label>
              <textarea
                rows={2}
                value={cms.heroSubtext}
                onChange={e => setCms({ ...cms, heroSubtext: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Announcement Banner</label>
              <input
                type="text"
                value={cms.announcementBanner}
                onChange={e => setCms({ ...cms, announcementBanner: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Editorial Manifesto Statement</label>
              <textarea
                rows={3}
                value={cms.editorialManifesto}
                onChange={e => setCms({ ...cms, editorialManifesto: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
            >
              Publish Content Live →
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: FINANCIAL LEDGER */}
      {activeTab === 'ledger' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1C1B19]">Platform Financial Ledger</h2>
              <p className="text-xs text-[#5E5B54]">Immutable SHA-256 hash-chained accounting records.</p>
            </div>
            <span className="text-xs font-mono text-[#2D4F38]">Total Records: {ledger.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F0] border-b border-[#E8E2D5] font-mono text-[#5E5B54]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Balance After</th>
                  <th className="p-3">Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D5]">
                {ledger.map(entry => (
                  <tr key={entry.id} className="hover:bg-[#FAF7F0]/50 font-mono">
                    <td className="p-3 text-[#8E877B]">{new Date(entry.createdAt).toLocaleTimeString()}</td>
                    <td className="p-3 uppercase text-[#C85A32]">{entry.entryType.replace('_', ' ')}</td>
                    <td className="p-3 font-sans text-[#1C1B19]">{entry.description}</td>
                    <td className="p-3 text-right font-bold">₹{entry.amountInr.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-[#5E5B54]">₹{entry.balanceAfterInr.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-[#8E877B]">{entry.referenceHash.slice(0, 10)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] space-y-6 shadow-sm">
          <div className="border-b border-[#E8E2D5] pb-3">
            <h2 className="font-serif text-2xl font-bold text-[#1C1B19]">Artist Settlement Requests</h2>
            <p className="text-xs text-[#5E5B54]">Disburse bank transfers via Razorpay Route marketplace payout.</p>
          </div>

          <div className="space-y-4">
            {payouts.map(payout => (
              <div
                key={payout.id}
                className="p-5 bg-[#FAF7F0] rounded-2xl border border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg text-[#1C1B19]">{payout.artistName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      payout.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      payout.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {payout.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#5E5B54] font-mono">
                    Amount: <strong className="text-[#1C1B19]">₹{payout.amountInr.toLocaleString('en-IN')}</strong> • Bank A/C: •••• {payout.bankAccountLast4} • IFSC: {payout.ifscCode}
                  </p>
                  <p className="text-[11px] text-[#8E877B] font-mono">
                    Requested: {new Date(payout.createdAt).toLocaleString()}
                  </p>
                </div>

                {payout.status === 'pending' && isSuperAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProcessPayout(payout.id, 'completed');
                      }}
                      className="py-2 px-4 bg-[#2D4F38] hover:bg-[#233d2b] text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Approve & Disburse
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProcessPayout(payout.id, 'rejected');
                      }}
                      className="py-2 px-3 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}

            {payouts.length === 0 && (
              <p className="text-xs text-[#8E877B] text-center py-6">No payout requests pending.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: RULES & EMERGENCY SETTINGS */}
      {activeTab === 'settings' && settings && isSuperAdmin && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] space-y-6 shadow-sm">
          <div className="border-b border-[#E8E2D5] pb-3">
            <h2 className="font-serif text-2xl font-bold text-[#1C1B19]">Commission Rules & Emergency Controls</h2>
            <p className="text-xs text-[#5E5B54]">Configurable platform settings. Modifying rates never changes historical ledger transactions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Workshops Platform Fee (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={settings.commissionWorkshops}
                onChange={e => setSettings({ ...settings, commissionWorkshops: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-mono"
              />
              <span className="text-[10px] text-[#8E877B]">Artist receives {100 - settings.commissionWorkshops}%</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">1-on-1 Lessons Fee (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={settings.commissionLessons}
                onChange={e => setSettings({ ...settings, commissionLessons: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-mono"
              />
              <span className="text-[10px] text-[#8E877B]">Artist receives {100 - settings.commissionLessons}%</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Direct Tips Fee (%)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={settings.commissionTips}
                onChange={e => setSettings({ ...settings, commissionTips: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-mono"
              />
              <span className="text-[10px] text-[#8E877B]">Artist receives {100 - settings.commissionTips}%</span>
            </div>
          </div>

          {/* Emergency Kill Switches */}
          <div className="pt-4 border-t border-[#E8E2D5] space-y-4">
            <h3 className="font-serif text-lg font-bold text-red-700 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Emergency Platform Controls
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 p-4 bg-[#FAF7F0] rounded-2xl border border-[#E8E2D5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 text-[#C85A32]"
                />
                <span className="text-xs font-medium text-[#1C1B19]">Maintenance Mode</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-[#FAF7F0] rounded-2xl border border-[#E8E2D5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.registrationsEnabled}
                  onChange={e => setSettings({ ...settings, registrationsEnabled: e.target.checked })}
                  className="w-4 h-4 text-[#C85A32]"
                />
                <span className="text-xs font-medium text-[#1C1B19]">Registrations Open</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-[#FAF7F0] rounded-2xl border border-[#E8E2D5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.payoutsEnabled}
                  onChange={e => setSettings({ ...settings, payoutsEnabled: e.target.checked })}
                  className="w-4 h-4 text-[#C85A32]"
                />
                <span className="text-xs font-medium text-[#1C1B19]">Payouts Active</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="py-3 px-6 bg-[#1C1B19] hover:bg-[#C85A32] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
          >
            Save Global Settings →
          </button>
        </form>
      )}

      {/* TAB 7: OWASP SECURITY AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] space-y-4 shadow-sm">
          <div className="border-b border-[#E8E2D5] pb-3">
            <h2 className="font-serif text-2xl font-bold text-[#1C1B19]">Security Audit Trail</h2>
            <p className="text-xs text-[#5E5B54]">Complete chronological log of administrative and financial operations.</p>
          </div>

          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8E2D5] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-[#C85A32]">{log.action}</span>
                  <span className="text-[#8E877B] ml-2">by {log.userEmail} ({log.role})</span>
                </div>
                <span className="text-[#8E877B]">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
