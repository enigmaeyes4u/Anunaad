import React from 'react';
import { Heart, Sparkles, Shield, Compass, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <footer className="bg-[#1C1B19] text-[#FDFBF7] border-t border-[#3A3630] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Editorial Highlight */}
        <div className="border-b border-[#3A3630] pb-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D97724] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Cultural Manifesto
              </span>
              <h2 className="font-serif text-2xl lg:text-3xl font-normal leading-relaxed text-[#FDFBF7]">
                «Culture should not only be preserved in archives. It should continue to live through people.»
              </h2>
              <p className="text-sm text-[#A8A296] font-light max-w-2xl">
                Every tradition is a thread connecting generations. When you listen, learn, or support a keeper, you help ensure that resonance never fades into silence.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={() => handleNav('/join-artist')}
                className="py-3 px-5 bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-medium rounded-xl transition-colors text-center shadow-md cursor-pointer"
              >
                Join as a Keeper of Tradition →
              </button>
              <button
                onClick={() => handleNav('/about')}
                className="py-3 px-5 border border-[#4A453C] hover:border-[#D97724] text-[#E8E2D5] text-xs font-medium rounded-xl transition-colors text-center cursor-pointer"
              >
                Our Cultural Ethics & Economics
              </button>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C85A32] text-white flex items-center justify-center font-serif font-bold text-lg">
                A
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight block">ANUNAAD</span>
                <span className="font-devanagari text-xs text-[#A8A296] block -mt-1">अनुनाद</span>
              </div>
            </div>
            <p className="text-xs text-[#A8A296] leading-relaxed max-w-sm">
              An editorial platform bridging The Keepers of rare, regional, and endangered arts with curious learners and patrons worldwide.
            </p>
            <div className="text-[11px] text-[#8E877B] pt-2 border-t border-[#3A3630]">
              Tagline: <em className="text-[#E8E2D5]">Every tradition deserves to resonate.</em>
            </div>
          </div>

          {/* Traditions */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D97724] mb-3">
              Living Arts
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A296]">
              <li><button onClick={() => handleNav('/art-forms')} className="hover:text-white transition-colors cursor-pointer">Maand Vocal (Rajasthan)</button></li>
              <li><button onClick={() => handleNav('/art-forms')} className="hover:text-white transition-colors cursor-pointer">Pandavani Epics (Chhattisgarh)</button></li>
              <li><button onClick={() => handleNav('/art-forms')} className="hover:text-white transition-colors cursor-pointer">Purulia Chhau (Bengal)</button></li>
              <li><button onClick={() => handleNav('/art-forms')} className="hover:text-white transition-colors cursor-pointer">Baul Mysticism (Bengal)</button></li>
              <li><button onClick={() => handleNav('/art-forms')} className="hover:text-white transition-colors cursor-pointer">Tholu Bommalata (Andhra)</button></li>
              <li><button onClick={() => handleNav('/art-forms')} className="hover:text-white transition-colors cursor-pointer">Sattriya Dance (Assam)</button></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D97724] mb-3">
              Explore & Learn
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A296]">
              <li><button onClick={() => handleNav('/discover')} className="hover:text-white transition-colors cursor-pointer">Cultural Discover Feed</button></li>
              <li><button onClick={() => handleNav('/artists')} className="hover:text-white transition-colors cursor-pointer">Directory of Keepers</button></li>
              <li><button onClick={() => handleNav('/learn')} className="hover:text-white transition-colors cursor-pointer">Live Masterclasses</button></li>
              <li><button onClick={() => handleNav('/learn')} className="hover:text-white transition-colors cursor-pointer">6-Month Apprenticeships</button></li>
              <li><button onClick={() => handleNav('/experiences')} className="hover:text-white transition-colors cursor-pointer">Intimate Baithaks</button></li>
              <li><button onClick={() => handleNav('/join-artist')} className="hover:text-white transition-colors cursor-pointer">Keeper Onboarding</button></li>
            </ul>
          </div>

          {/* Ethics & Access */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D97724] mb-3">
              Ethics & Portals
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A296]">
              <li><button onClick={() => handleNav('/about')} className="hover:text-white transition-colors cursor-pointer">Culture is Not a Commodity</button></li>
              <li><button onClick={() => handleNav('/about')} className="hover:text-white transition-colors cursor-pointer">Consent & Attribution</button></li>
              <li><button onClick={() => handleNav('/about')} className="hover:text-white transition-colors cursor-pointer">80-95% Artist Revenue Split</button></li>
              <li><button onClick={() => handleNav('/login')} className="hover:text-white transition-colors cursor-pointer">Learner Dashboard</button></li>
              <li><button onClick={() => handleNav('/login')} className="hover:text-white transition-colors cursor-pointer">Artist Wallet Dashboard</button></li>
              <li><button onClick={() => handleNav('/admin')} className="text-[#2D4F38] hover:text-[#528a64] font-semibold transition-colors cursor-pointer">Admin Console (/admin)</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 border-t border-[#3A3630] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E877B]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} ANUNAAD (अनुनाद). All rights reserved.</span>
            <span className="opacity-40">•</span>
            <span>Made with reverence for living traditions.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Free & Open-Source Stack</span>
            <span className="opacity-40">•</span>
            <span>Zero Proprietary Cloud Costs</span>
            <span className="opacity-40">•</span>
            <span>Local Database Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
