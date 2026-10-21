import React from 'react';
import { ArtistLineage } from '../../types';
import { BookOpen, Sparkles, HeartHandshake, Users, ArrowDown } from 'lucide-react';

interface LineageTreeProps {
  lineage: ArtistLineage;
  artistName: string;
}

export const LineageTree: React.FC<LineageTreeProps> = ({ lineage, artistName }) => {
  return (
    <div className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-2xl p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">
            Living Transmission & Lineage
          </span>
          <h3 className="font-serif text-xl font-bold text-[#1C1B19] mt-0.5">
            The Chain of Oral Knowledge
          </h3>
        </div>
        {lineage.generationCount && (
          <span className="text-xs bg-[#EFE8D8] text-[#5C4033] px-3 py-1 rounded-full font-serif font-semibold border border-[#D3C9B6]">
            {lineage.generationCount} Generations Unbroken
          </span>
        )}
      </div>

      <div className="relative pl-6 lg:pl-10 space-y-8 before:absolute before:left-3 lg:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#D97724] via-[#C85A32] to-[#2D4F38]">
        
        {/* Step 1: Who taught them */}
        <div className="relative group">
          <div className="absolute -left-6 lg:-left-10 top-0.5 w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[#D97724] text-white flex items-center justify-center shadow-md">
            <HeartHandshake className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#D97724] font-semibold block">
              1. The Source & Gurukula
            </span>
            <h4 className="font-serif text-lg font-bold text-[#1C1B19] mt-0.5">
              {lineage.guruName}
            </h4>
            {lineage.guruLocation && (
              <p className="text-xs text-[#8E877B] mt-0.5">{lineage.guruLocation}</p>
            )}
            <p className="text-xs text-[#5E5B54] mt-1.5 leading-relaxed bg-white/70 p-3 rounded-xl border border-[#E8E2D5]/70">
              Imparted through strict guru-shishya parampara (oral devotion), learning without notation in the quiet of early mornings.
            </p>
          </div>
        </div>

        {/* Step 2: What was learned */}
        <div className="relative group">
          <div className="absolute -left-6 lg:-left-10 top-0.5 w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[#C85A32] text-white flex items-center justify-center shadow-md">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#C85A32] font-semibold block">
              2. What Was Learned & Internalized
            </span>
            <h4 className="font-serif text-lg font-bold text-[#1C1B19] mt-0.5">
              {lineage.traditionName}
            </h4>
            <p className="text-xs text-[#5E5B54] mt-1.5 leading-relaxed bg-white/70 p-3 rounded-xl border border-[#E8E2D5]/70">
              {lineage.whatLearned}
            </p>
          </div>
        </div>

        {/* Step 3: What was preserved */}
        <div className="relative group">
          <div className="absolute -left-6 lg:-left-10 top-0.5 w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[#5C4033] text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C4033] font-semibold block">
              3. What Is Preserved Today by {artistName}
            </span>
            <p className="text-xs text-[#5E5B54] mt-1.5 leading-relaxed bg-white/70 p-3 rounded-xl border border-[#E8E2D5]/70">
              {lineage.whatPreserved}
            </p>
          </div>
        </div>

        {/* Step 4: Who they teach today */}
        <div className="relative group">
          <div className="absolute -left-6 lg:-left-10 top-0.5 w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[#2D4F38] text-white flex items-center justify-center shadow-md">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#2D4F38] font-semibold block">
              4. Carrying Forward to the Next Generation
            </span>
            <p className="text-xs text-[#5E5B54] mt-1.5 leading-relaxed bg-[#EDF5F0] p-3 rounded-xl border border-[#2D4F38]/20 text-[#2D4F38] font-medium">
              {lineage.whoTeachesToday}
            </p>
          </div>
        </div>

      </div>

      <div className="pt-2 text-center">
        <p className="text-xs text-[#8E877B] italic">
          «Culture should not only be preserved in archives. It should continue to live through people.»
        </p>
      </div>
    </div>
  );
};
