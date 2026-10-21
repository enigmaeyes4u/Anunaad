import React from 'react';
import { Heart, Sparkles, ShieldCheck, BookOpen, Users, Compass, ArrowRight } from 'lucide-react';

interface AboutProps {
  onNavigate: (path: string) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Manifesto Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
          Manifesto & Ethics
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#1C1B19] leading-tight">
          Culture should not only be preserved in archives.
          <span className="block font-normal text-[#C85A32] italic mt-2">
            It should continue to live through people.
          </span>
        </h1>
        <p className="font-devanagari text-base text-[#8E877B]">
          संस्कृति कोई निर्जीव वस्तु नहीं, यह गुरु-शिष्य की जीती-जागती सांस है।
        </p>
      </div>

      {/* Core Concept */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E8E2D5] space-y-6 shadow-sm">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1B19]">
          The Story of Anunaad (अनुनाद)
        </h2>
        <p className="text-sm sm:text-base text-[#5E5B54] leading-relaxed">
          In Sanskrit, <strong>Anunaad</strong> translates to resonance—an echo that does not die away, but gathers warmth as it touches another listener.
        </p>
        <p className="text-sm sm:text-base text-[#5E5B54] leading-relaxed">
          Across the desert villages of Marwar, the river islands of Majuli, the red-soil hamlets of Birbhum, and the courtyards of Mithila, masters carry centuries of refined aesthetic intelligence. They hold songs not transcribed in textbooks, dances that invoke celestial battles, and pigments ground by hand from wild roots.
        </p>
        <p className="text-sm sm:text-base text-[#5E5B54] leading-relaxed">
          Too often, well-meaning institutions lock this heritage away in museum vitrines or scholarly JSTOR papers. But a song is not preserved by storing its tape in a basement; it is preserved when someone listens with tears in their eyes and learns to sing the next stanza.
        </p>
      </div>

      {/* Primary Ethical Principle: Culture is not a commodity */}
      <div className="bg-[#FAF7F0] border-2 border-[#C85A32]/30 p-8 sm:p-12 rounded-3xl space-y-6">
        <div className="flex items-center gap-3 text-[#C85A32]">
          <ShieldCheck className="w-7 h-7" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">
            Guiding Ethos
          </span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#1C1B19]">
          Culture is not a commodity.
        </h2>
        <p className="text-sm text-[#5E5B54] leading-relaxed">
          ANUNAAD is built on non-extractive principles. We do not treat traditional knowledge as generic public-domain intellectual property to be exploited by tech companies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-white rounded-xl border border-[#E8E2D5] space-y-1">
            <h4 className="font-serif font-bold text-sm text-[#1C1B19]">Keeper-Controlled Media</h4>
            <p className="text-xs text-[#5E5B54]">Artists determine what can be recorded, what can be monetized, and what remains private within traditional gurukulas.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#E8E2D5] space-y-1">
            <h4 className="font-serif font-bold text-sm text-[#1C1B19]">Uncompromised Attribution</h4>
            <p className="text-xs text-[#5E5B54]">Every piece of oral knowledge is credited to its hereditary lineage, guru, and geographic community.</p>
          </div>
        </div>
      </div>

      {/* Transparent Revenue Sharing Table */}
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
            Economic Architecture
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1B19]">
            The Artist Comes First: Transparent Revenue Splits
          </h2>
          <p className="text-sm text-[#5E5B54]">
            Every rupee is accounted for on our immutable double-entry ledger. We never hide fees or deductions.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F0] border-b border-[#E8E2D5] font-mono text-[#5E5B54]">
              <tr>
                <th className="p-4 font-semibold">Offering Type</th>
                <th className="p-4 font-semibold text-[#2D4F38]">Artist Direct Share</th>
                <th className="p-4 font-semibold text-[#5E5B54]">ANUNAAD Support Fee</th>
                <th className="p-4 font-semibold">Purpose & Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D5] text-[#1C1B19]">
              <tr>
                <td className="p-4 font-medium">Direct Patronage & Tips</td>
                <td className="p-4 font-bold text-[#2D4F38] font-mono">95%</td>
                <td className="p-4 font-mono">5%</td>
                <td className="p-4 text-[#8E877B]">Zero-cut support for instrument maintenance & field travel</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">One-on-One Mentorship</td>
                <td className="p-4 font-bold text-[#2D4F38] font-mono">85%</td>
                <td className="p-4 font-mono">15%</td>
                <td className="p-4 text-[#8E877B]">Private vocal critique & oral transmission sessions</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Cohorts & Masterclasses</td>
                <td className="p-4 font-bold text-[#2D4F38] font-mono">80%</td>
                <td className="p-4 font-mono">20%</td>
                <td className="p-4 text-[#8E877B]">Multi-session live interactive classes</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">6-Month Apprenticeships</td>
                <td className="p-4 font-bold text-[#2D4F38] font-mono">85%</td>
                <td className="p-4 font-mono">15%</td>
                <td className="p-4 text-[#8E877B]">Includes residential retreats & formal lineage certificates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-8 border-t border-[#E8E2D5] space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#1C1B19]">
          Become part of the transmission circle.
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onNavigate('/discover')}
            className="py-3 px-6 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
          >
            Explore Living Traditions
          </button>
          <button
            onClick={() => onNavigate('/join-artist')}
            className="py-3 px-6 bg-white border border-[#E8E2D5] text-[#1C1B19] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Apply as a Keeper
          </button>
        </div>
      </div>

    </div>
  );
};
