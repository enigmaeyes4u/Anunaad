import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Sparkles, User, Palette } from 'lucide-react';

interface LoginProps {
  onNavigate: (path: string) => void;
}

const MASTER_ARTISTS = [
  {
    id: 'artist-gafur',
    name: 'Abdul Gafur Khatri',
    artForm: 'Rogan Art',
    region: 'Kutch, Gujarat',
    email: 'gafur.rogan@anunaad.org',
    icon: '🎨'
  },
  {
    id: 'artist-kamala',
    name: 'Kamala Devi Jha',
    artForm: 'Madhubani Painting',
    region: 'Mithila, Bihar',
    email: 'kamala.mithila@anunaad.org',
    icon: '🖌️'
  },
  {
    id: 'artist-raghunath',
    name: 'Ustad Raghunath',
    artForm: 'Maand Vocal',
    region: 'Jodhpur, Rajasthan',
    email: 'raghunath.maand@anunaad.org',
    icon: '🎵'
  },
  {
    id: 'artist-gouranga',
    name: 'Gouranga Das Baul',
    artForm: 'Baul Music',
    region: 'Birbhum, Bengal',
    email: 'gouranga.baul@anunaad.org',
    icon: '🪕'
  },
  {
    id: 'artist-teejan',
    name: 'Teejan Devi Sahu',
    artForm: 'Pandavani',
    region: 'Durg, Chhattisgarh',
    email: 'teejan.pandavani@anunaad.org',
    icon: '⚡'
  },
  {
    id: 'artist-tarapada',
    name: 'Guru Tarapada Mahato',
    artForm: 'Chhau Dance',
    region: 'Purulia, West Bengal',
    email: 'tarapada.chhau@anunaad.org',
    icon: '🎭'
  },
  {
    id: 'artist-bhabananda',
    name: 'Bhabananda Barbayan',
    artForm: 'Sattriya Dance',
    region: 'Majuli, Assam',
    email: 'bhabananda.sattriya@anunaad.org',
    icon: '🌿'
  },
  {
    id: 'artist-chalapathi',
    name: 'Dalavai Chalapathi Rao',
    artForm: 'Tholu Bommalata',
    region: 'Nimmalakunta, Andhra',
    email: 'chalapathi.tholu@anunaad.org',
    icon: '🏮'
  }
];

const ART_FORMS = [
  { id: 'art-rogan', name: 'Rogan Art (Castor Oil Textile Craft — Gujarat)' },
  { id: 'art-madhubani', name: 'Madhubani / Mithila Painting (Natural Dyes — Bihar)' },
  { id: 'art-maand', name: 'Maand Vocal Heritage (Thar Desert — Rajasthan)' },
  { id: 'art-baul', name: 'Baul Mystic Songs & Philosophy (Bengal)' },
  { id: 'art-pandavani', name: 'Pandavani Epic Narrations (Tambura — Chhattisgarh)' },
  { id: 'art-chhau', name: 'Purulia Chhau Martial Mask Dance (West Bengal)' },
  { id: 'art-sattriya', name: 'Sattriya Monastic Classical Dance (Majuli Island, Assam)' },
  { id: 'art-tholu-bommalata', name: 'Tholu Bommalata Leather Shadow Puppetry (Andhra Pradesh)' }
];

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('learner');
  const [selectedArtFormId, setSelectedArtFormId] = useState('art-rogan');
  const [artistTitle, setArtistTitle] = useState('Traditional Living Master');
  const [artistLocation, setArtistLocation] = useState('Nirona, Kutch, Gujarat');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfa, setShowMfa] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAllMasters, setShowAllMasters] = useState(false);

  // Quick switch helpers for testing/demoing all distinct artists and roles
  const fillCredentials = (targetEmail: string, isSuperAdmin: boolean = false) => {
    setIsRegister(false);
    setErrorMsg('');
    setEmail(targetEmail);
    setPassword('Anunaad@2026');
    if (isSuperAdmin) {
      setMfaCode('202626');
      setShowMfa(true);
    } else {
      setShowMfa(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        const extra = role === 'artist' ? {
          artFormId: selectedArtFormId,
          title: artistTitle,
          region: artistLocation.split(',')[0]?.trim() || 'Regional India',
          state: artistLocation.split(',')[1]?.trim() || 'India'
        } : {};

        const res = await register(name, email, password, role, extra);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          onNavigate(role === 'artist' ? '/dashboard/artist' : '/dashboard/learner');
        }
      } else {
        const res = await login(email, password, showMfa ? mfaCode : undefined);
        if (res.error) {
          setErrorMsg(res.error);
        } else if (res.requiresMfa) {
          setShowMfa(true);
          setErrorMsg('');
        } else {
          const userRole = res.user?.role;
          if (userRole === 'super_admin' || userRole === 'content_admin' || email.includes('admin')) {
            onNavigate('/admin');
          } else if (userRole === 'artist' || email.includes('anunaad.org')) {
            onNavigate('/dashboard/artist');
          } else {
            onNavigate('/dashboard/learner');
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      
      {/* Brand Title */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#1C1B19] text-[#FDFBF7] flex items-center justify-center mx-auto shadow-md">
          <span className="font-serif font-bold text-xl">A</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1C1B19]">
          {isRegister ? 'Join ANUNAAD' : 'Welcome to ANUNAAD'}
        </h1>
        <p className="text-xs text-[#5E5B54]">
          {isRegister ? 'Register as a Curious Learner or a Living Traditional Master' : 'Access your dashboard, living atelier, or cultural patronage'}
        </p>
      </div>

      {/* 1-Click Role & Artist Switcher Panel */}
      <div className="bg-[#FAF7F0] p-5 rounded-3xl border border-[#E8E2D5] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#C85A32] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 1-Click Testing Logins (Password: Anunaad@2026)
          </span>
          <span className="text-[10px] text-[#8E877B] font-mono">Select any role below</span>
        </div>

        {/* Learner & Admin Fast Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillCredentials('aarav@gmail.com')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
              email === 'aarav@gmail.com'
                ? 'bg-[#1C1B19] text-white border-[#1C1B19] shadow-sm'
                : 'bg-white hover:bg-[#F5F2EA] text-[#1C1B19] border-[#E8E2D5]'
            }`}
          >
            <div>
              <span className="block font-medium">Aarav Sharma</span>
              <span className="text-[10px] opacity-70">Learner & Patron</span>
            </div>
            <User className="w-4 h-4 opacity-70" />
          </button>

          <button
            type="button"
            onClick={() => fillCredentials('admin@anunaad.org', true)}
            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
              email === 'admin@anunaad.org'
                ? 'bg-[#2D4F38] text-white border-[#2D4F38] shadow-sm'
                : 'bg-white hover:bg-[#F5F2EA] text-[#2D4F38] border-[#2D4F38]/30'
            }`}
          >
            <div>
              <span className="block font-medium">Devavrat Sen</span>
              <span className="text-[10px] opacity-80">Super Admin (MFA)</span>
            </div>
            <Shield className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Master Keepers by Tradition */}
        <div className="space-y-2 pt-2 border-t border-[#E8E2D5]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-serif font-bold text-[#1C1B19] flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-[#C85A32]" /> Traditional Master Artists (Select Any Tradition):
            </span>
            <button
              type="button"
              onClick={() => setShowAllMasters(!showAllMasters)}
              className="text-[10px] font-mono text-[#C85A32] hover:underline cursor-pointer"
            >
              {showAllMasters ? 'Show Fewer' : 'View All 8 Masters'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(showAllMasters ? MASTER_ARTISTS : MASTER_ARTISTS.slice(0, 4)).map((artist) => {
              const isSelected = email === artist.email;
              return (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => fillCredentials(artist.email)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-sm'
                      : 'bg-white hover:bg-[#F5F2EA] text-[#1C1B19] border-[#E8E2D5]'
                  }`}
                >
                  <span className="text-lg shrink-0">{artist.icon}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">{artist.name}</span>
                    <span className={`text-[10px] block truncate ${isSelected ? 'text-white/90' : 'text-[#8E877B]'}`}>
                      {artist.artForm} • {artist.region}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Authentication Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] space-y-4 shadow-sm">
        
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMsg}
          </div>
        )}

        {isRegister && (
          <div>
            <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Master Rizwan Khatri"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="e.g. gafur.rogan@anunaad.org"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        {/* 2FA input if required for admin */}
        {showMfa && (
          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#D97724]/40 space-y-2">
            <span className="text-xs font-semibold text-[#1C1B19] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#D97724]" />
              Super Admin 2FA Token Required
            </span>
            <p className="text-[11px] text-[#5E5B54]">Enter your 6-digit authenticator code (pre-filled: 202626)</p>
            <input
              type="text"
              value={mfaCode}
              onChange={e => setMfaCode(e.target.value)}
              placeholder="202626"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D5] text-xs font-mono tracking-widest text-center"
            />
          </div>
        )}

        {/* Role & Art Form Selector for New Signups */}
        {isRegister && (
          <div className="space-y-4 pt-2 border-t border-[#E8E2D5]">
            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">I am registering as a:</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32] bg-white font-medium"
              >
                <option value="artist">Traditional Master / Artisan Keeper</option>
                <option value="learner">Cultural Learner & Supporter</option>
              </select>
            </div>

            {role === 'artist' && (
              <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E8E2D5] space-y-3">
                <span className="text-[11px] font-mono uppercase text-[#C85A32] font-bold block">
                  Art Tradition & Lineage Details
                </span>
                
                <div>
                  <label className="block text-[11px] font-semibold text-[#5E5B54] mb-1">
                    Select Your Living Art Form
                  </label>
                  <select
                    value={selectedArtFormId}
                    onChange={e => {
                      setSelectedArtFormId(e.target.value);
                      if (e.target.value === 'art-rogan') {
                        setArtistTitle('Master Rogan Castor Oil Artisan');
                        setArtistLocation('Nirona, Gujarat');
                      } else if (e.target.value === 'art-madhubani') {
                        setArtistTitle('Master Mithila Mural Painter');
                        setArtistLocation('Jitwarpur, Bihar');
                      } else if (e.target.value === 'art-sattriya') {
                        setArtistTitle('Sattriya Monastic Classical Exponent');
                        setArtistLocation('Majuli Island, Assam');
                      } else if (e.target.value === 'art-chhau') {
                        setArtistTitle('Purulia Chhau Martial Dancer & Mask Maker');
                        setArtistLocation('Charida, West Bengal');
                      } else if (e.target.value === 'art-tholu-bommalata') {
                        setArtistTitle('Master Shadow Puppeteer & Leather Artisan');
                        setArtistLocation('Nimmalakunta, Andhra Pradesh');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32] bg-white"
                  >
                    {ART_FORMS.map(af => (
                      <option key={af.id} value={af.id}>{af.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5E5B54] mb-1">
                    Your Title / Lineage Designation
                  </label>
                  <input
                    type="text"
                    value={artistTitle}
                    onChange={e => setArtistTitle(e.target.value)}
                    placeholder="e.g. 8th Generation Rogan Stylus Master"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5E5B54] mb-1">
                    Village / Region & State
                  </label>
                  <input
                    type="text"
                    value={artistLocation}
                    onChange={e => setArtistLocation(e.target.value)}
                    placeholder="e.g. Nirona, Kutch, Gujarat"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32] bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#C85A32] hover:bg-[#B34D28] text-white font-medium text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? 'Authenticating...' : isRegister ? 'Register as Keeper / Learner →' : 'Sign In to Dashboard →'}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
            className="text-xs text-[#5E5B54] hover:text-[#C85A32] cursor-pointer"
          >
            {isRegister ? 'Already have an account? Sign In with 1-Click' : "Want to create a custom account? Register here"}
          </button>
        </div>

      </form>

    </div>
  );
};
