import React, { useState, useEffect } from 'react';
import { Offering } from '../types';
import { RazorpayModal } from '../components/common/RazorpayModal';
import { BookOpen, Sparkles, Clock, Users, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LearnProps {
  onNavigate: (path: string) => void;
}

export const Learn: React.FC<LearnProps> = ({ onNavigate }) => {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);

  useEffect(() => {
    fetch('/api/offerings').then(r => r.json()).then(d => setOfferings(d.offerings || [])).catch(() => {});
  }, []);

  const types = [
    { id: 'all', label: 'All Learning Programs' },
    { id: 'workshop', label: 'Live Workshops' },
    { id: 'one_on_one', label: 'One-on-One Mentorship' },
    { id: 'apprenticeship', label: '6-Month Apprenticeships' }
  ];

  const filtered = offerings.filter(o => selectedType === 'all' || o.type === selectedType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32] flex items-center justify-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Living Transmission
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1B19]">
          Learn from the source.
        </h1>
        <p className="text-sm sm:text-base text-[#5E5B54] font-light leading-relaxed">
          Go beyond watching. Study directly under traditional masters through intimate cohorts, personal vocal critique, and deep apprenticeships.
        </p>

        {/* Economic Guarantee */}
        <div className="pt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#EDF5F0] border border-[#2D4F38]/20 rounded-full text-xs text-[#2D4F38] font-medium">
          <ShieldCheck className="w-4 h-4 text-[#2D4F38]" />
          <span>The Artist Comes First: 80% to 85% of what you pay is disbursed directly to your teacher.</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedType === t.id
                ? 'bg-[#1C1B19] text-white shadow-sm'
                : 'bg-white text-[#5E5B54] border border-[#E8E2D5] hover:border-[#C85A32]/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Offerings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(offering => (
          <div
            key={offering.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#E8E2D5] hover:border-[#C85A32]/40 transition-all shadow-sm flex flex-col justify-between group"
          >
            <div>
              <div className="h-52 relative overflow-hidden bg-[#E8E2D5]">
                <img
                  src={offering.imageUrl}
                  alt={offering.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                <div className="absolute top-3 left-3 bg-[#1C1B19]/80 backdrop-blur px-3 py-0.5 rounded-full text-white text-[11px] font-mono">
                  {offering.type.replace('_', ' ')}
                </div>

                <div className="absolute top-3 right-3 bg-[#2D4F38] text-white text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md">
                  80% Direct to Artist
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[11px] text-[#D97724] font-mono block">Teacher & Guru</span>
                  <h4 className="font-serif text-lg font-bold">{offering.artistName}</h4>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-[#C85A32] uppercase font-semibold">
                    Level: {offering.level} • {offering.mode.replace('_', ' ')}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#1C1B19] leading-snug">
                    {offering.title}
                  </h3>
                </div>

                <p className="text-xs text-[#5E5B54] leading-relaxed">
                  {offering.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-[#E8E2D5]/70">
                  {offering.features.slice(0, 3).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-[#5E5B54]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4F38] shrink-0" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-[#8E877B] font-mono pt-2">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {offering.durationDesc}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {offering.capacity - offering.bookedCount} spots</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8E877B] block uppercase">Tuition</span>
                  <span className="font-mono text-xl font-bold text-[#1C1B19]">
                    ₹{offering.priceInr.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOffering(offering)}
                  className="py-2.5 px-5 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Enroll Now →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedOffering && (
        <RazorpayModal
          isOpen={!!selectedOffering}
          onClose={() => setSelectedOffering(null)}
          offeringId={selectedOffering.id}
          itemTitle={selectedOffering.title}
          artistName={selectedOffering.artistName || 'Traditional Master'}
          priceInr={selectedOffering.priceInr}
        />
      )}

    </div>
  );
};
