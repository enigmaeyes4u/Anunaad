import React, { useState } from 'react';
import { Sparkles, CheckCircle2, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface JoinArtistProps {
  onNavigate: (path: string) => void;
}

export const JoinArtist: React.FC<JoinArtistProps> = ({ onNavigate }) => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    artFormName: '',
    region: '',
    location: '',
    yearsExperience: '15',
    age: '40',
    bio: '',
    guruName: '',
    traditionName: '',
    whatLearned: '',
    whatPreserved: '',
    whoTeachesToday: '',
    quote: '',
    audioSampleTitle: '',
    sampleAudioUrl: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/artists/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-[#2D4F38]/10 text-[#2D4F38] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
          Lineage Received With Reverence
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B19]">
          Pranaam, {formData.name}
        </h1>
        <p className="text-sm sm:text-base text-[#5E5B54] leading-relaxed">
          Your oral lineage and devotion to <strong>{formData.artFormName}</strong> have reached our curatorial circle. Every submission is personally reviewed and authenticated within 48 hours.
        </p>
        <div className="pt-4">
          <button
            onClick={() => onNavigate('/')}
            className="py-3 px-8 bg-[#1C1B19] text-white text-xs font-semibold uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32] flex items-center justify-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5" /> Dignified Keeper Onboarding
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1B19]">
          Are you keeping a tradition alive?
        </h1>
        <p className="text-sm sm:text-base text-[#5E5B54] leading-relaxed font-light">
          Your knowledge matters. Your story matters. Your art deserves to be discovered. ANUNAAD is not an open e-commerce catalog; it is an economic sanctuary for true practitioners.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E8E2D5] space-y-8 shadow-sm">
        
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Part 1: Practitioner Details */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#1C1B19] border-b border-[#E8E2D5] pb-2">
            1. Identity & Tradition
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ustad Raghunath Khan"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Art Form / Living Tradition *</label>
              <input
                type="text"
                required
                value={formData.artFormName}
                onChange={e => setFormData({ ...formData, artFormName: e.target.value })}
                placeholder="e.g. Maand Singing, Pandavani, Rogan Art"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Village / City & State *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Jodhpur, Rajasthan"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Years of Practice (Riyaz) *</label>
              <input
                type="number"
                required
                value={formData.yearsExperience}
                onChange={e => setFormData({ ...formData, yearsExperience: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Contact Email / Phone *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@address.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 Mobile number"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
              />
            </div>
          </div>
        </div>

        {/* Part 2: Oral Lineage */}
        <div className="space-y-4 pt-4 border-t border-[#E8E2D5]">
          <h3 className="font-serif text-xl font-bold text-[#1C1B19] border-b border-[#E8E2D5] pb-2">
            2. The Sacred Lineage & Guru
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Who taught you? (Guru / Master / Mother / Elder) *</label>
            <input
              type="text"
              required
              value={formData.guruName}
              onChange={e => setFormData({ ...formData, guruName: e.target.value })}
              placeholder="e.g. My father Ustad Chhote Khan & Guru Punaram Nishad"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E5B54] mb-1">What did you learn and master?</label>
            <textarea
              rows={2}
              value={formData.whatLearned}
              onChange={e => setFormData({ ...formData, whatLearned: e.target.value })}
              placeholder="Describe the techniques, ragas, mudras, pigments, or verses imparted to you."
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E5B54] mb-1">What rare compositions or heritage do you preserve today?</label>
            <textarea
              rows={2}
              value={formData.whatPreserved}
              onChange={e => setFormData({ ...formData, whatPreserved: e.target.value })}
              placeholder="e.g. 140 unrecorded desert ragas; rare floor mandalas; 6-foot goat-hide shadow puppets."
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Who do you teach today?</label>
            <input
              type="text"
              value={formData.whoTeachesToday}
              onChange={e => setFormData({ ...formData, whoTeachesToday: e.target.value })}
              placeholder="e.g. Currently mentoring 12 village apprentices in Barmer"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Personal Quote or Philosophy</label>
            <input
              type="text"
              value={formData.quote}
              onChange={e => setFormData({ ...formData, quote: e.target.value })}
              placeholder="«A piece of wisdom passed to you by your teacher»"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#E8E2D5] space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#C85A32] hover:bg-[#B34D28] text-white font-medium text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? 'Submitting with reverence...' : 'Submit Keeper Lineage Application →'}
          </button>
          <p className="text-[11px] text-center text-[#8E877B] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D4F38]" />
            Your contact details remain confidential and are never shared publicly.
          </p>
        </div>

      </form>

    </div>
  );
};
