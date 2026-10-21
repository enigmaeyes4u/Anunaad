import React, { useState, useEffect } from 'react';
import { Experience } from '../types';
import { RazorpayModal } from '../components/common/RazorpayModal';
import { MapPin, Calendar, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface ExperiencesProps {
  onNavigate: (path: string) => void;
}

export const Experiences: React.FC<ExperiencesProps> = ({ onNavigate }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

  useEffect(() => {
    fetch('/api/experiences').then(r => r.json()).then(d => setExperiences(d.experiences || [])).catch(() => {});
  }, []);

  const cities = ['all', ...Array.from(new Set(experiences.map(e => e.city)))];

  const filtered = experiences.filter(e => selectedCity === 'all' || e.city === selectedCity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32] flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Physical Gathering
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1B19]">
          Don't just discover it. Experience it.
        </h1>
        <p className="text-sm sm:text-base text-[#5E5B54] font-light leading-relaxed">
          Intimate courtyard baithaks, candlelit shadow puppetry, artisan village walks, and monastic chanting. Small gathering sizes that respect tradition and acoustic intimacy.
        </p>
      </div>

      {/* City Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {cities.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCity(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCity === c
                ? 'bg-[#1C1B19] text-white shadow-sm'
                : 'bg-white text-[#5E5B54] border border-[#E8E2D5] hover:border-[#C85A32]/40'
            }`}
          >
            {c === 'all' ? 'All Locations' : `📍 ${c}`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(exp => (
          <div
            key={exp.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#E8E2D5] hover:border-[#C85A32]/40 transition-all shadow-sm flex flex-col justify-between group"
          >
            <div>
              <div className="h-52 relative overflow-hidden bg-[#E8E2D5]">
                <img
                  src={exp.imageUrl}
                  alt={exp.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                <div className="absolute top-3 left-3 bg-[#1C1B19]/80 backdrop-blur px-3 py-1 rounded-full text-white text-[11px] font-mono">
                  {exp.category}
                </div>

                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-xs font-mono text-[#D97724] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {exp.location}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-xs text-[#8E877B] font-mono">
                    <span className="flex items-center gap-1 text-[#C85A32] font-semibold">
                      <Calendar className="w-3.5 h-3.5" /> {exp.dateTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {exp.duration}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#1C1B19] leading-snug pt-1">
                    {exp.title}
                  </h3>
                </div>

                <p className="text-xs text-[#5E5B54] leading-relaxed">
                  {exp.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-[#E8E2D5]/70">
                  {exp.highlights.slice(0, 2).map((hl, hIdx) => (
                    <div key={hIdx} className="text-xs text-[#5E5B54] flex items-start gap-1.5">
                      <span className="text-[#C85A32] font-bold">•</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8E877B] block uppercase">Seat Price</span>
                  <span className="font-mono text-xl font-bold text-[#1C1B19]">
                    ₹{exp.priceInr.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedExp(exp)}
                  className="py-2.5 px-5 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Reserve Seat →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedExp && (
        <RazorpayModal
          isOpen={!!selectedExp}
          onClose={() => setSelectedExp(null)}
          experienceId={selectedExp.id}
          itemTitle={selectedExp.title}
          artistName={selectedExp.artistName || 'Traditional Master'}
          priceInr={selectedExp.priceInr}
        />
      )}

    </div>
  );
};
