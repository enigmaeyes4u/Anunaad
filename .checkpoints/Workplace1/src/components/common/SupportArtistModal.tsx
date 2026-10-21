import React, { useState } from 'react';
import { Heart, Sparkles, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { RazorpayModal } from './RazorpayModal';

interface SupportArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistId: string;
  artistName: string;
  artistPortrait: string;
  artFormName: string;
  goalTitle?: string;
  onSuccess?: () => void;
}

const PRESET_AMOUNTS = [250, 500, 1000, 2500, 5000];

export const SupportArtistModal: React.FC<SupportArtistModalProps> = ({
  isOpen,
  onClose,
  artistId,
  artistName,
  artistPortrait,
  artFormName,
  goalTitle,
  onSuccess
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;
  const artistShare = Math.round(currentAmount * 0.95);
  const platformShare = currentAmount - artistShare;

  const handleProceed = () => {
    if (currentAmount < 50) {
      alert('Minimum contribution amount is ₹50');
      return;
    }
    setShowCheckout(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#FDFBF7] text-[#1C1B19] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E8E2D5]">
          
          {/* Header with artist avatar */}
          <div className="bg-[#1C1B19] text-[#FDFBF7] p-6 relative border-b border-[#3A3630]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-[#A8A296] hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <img
                src={artistPortrait}
                alt={artistName}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#D97724] shadow-md"
              />
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#D97724] flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-[#D97724]" /> Support The Keeper
                </span>
                <h3 className="font-serif text-lg font-bold text-[#FDFBF7]">{artistName}</h3>
                <p className="text-xs text-[#A8A296]">{artFormName} Tradition</p>
              </div>
            </div>
            {goalTitle && (
              <div className="mt-4 pt-3 border-t border-white/10 text-xs text-[#E8E2D5]">
                <strong className="text-[#D97724]">Current Focus:</strong> {goalTitle}
              </div>
            )}
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#5E5B54] uppercase tracking-wider mb-2">
                Select Patron Contribution (INR)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setIsCustom(false);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-medium transition-all ${
                      !isCustom && selectedAmount === amt
                        ? 'border-[#C85A32] bg-[#C85A32] text-white shadow-sm'
                        : 'border-[#E8E2D5] bg-white text-[#1C1B19] hover:border-[#C85A32]/50'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustom(true)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    isCustom
                      ? 'border-[#C85A32] bg-[#C85A32] text-white shadow-sm'
                      : 'border-[#E8E2D5] bg-white text-[#1C1B19] hover:border-[#C85A32]/50'
                  }`}
                >
                  Custom
                </button>
              </div>

              {isCustom && (
                <div className="mt-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[#8E877B]">₹</span>
                    <input
                      type="number"
                      placeholder="Enter amount (min ₹50)"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 text-sm border border-[#E8E2D5] rounded-xl bg-white focus:outline-none focus:border-[#C85A32]"
                      min="50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Split Transparency */}
            <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#D97724]/20 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#2D4F38] font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D97724]" />
                  Direct to Artist Wallet (95%)
                </span>
                <span className="font-mono font-bold">₹{artistShare.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-[#5E5B54]">
                <span>ANUNAAD Archival Fee (5%)</span>
                <span className="font-mono">₹{platformShare.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-[#8E877B] pt-1 border-t border-[#E8E2D5] italic">
                Direct patron funds support practice materials, apprentice stipends, and field journeys.
              </p>
            </div>

            {/* Action */}
            <button
              onClick={handleProceed}
              disabled={currentAmount < 50}
              className="w-full py-3 px-4 bg-[#C85A32] hover:bg-[#B34D28] text-white font-medium rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              <span>Support with ₹{currentAmount.toLocaleString('en-IN')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <p className="text-[11px] text-center text-[#8E877B] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D4F38]" /> Protected by ANUNAAD Artist-First Guarantee
            </p>
          </div>
        </div>
      </div>

      {showCheckout && (
        <RazorpayModal
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            onClose();
          }}
          tipArtistId={artistId}
          tipAmountInr={currentAmount}
          itemTitle={`Patron Contribution to ${artistName}`}
          artistName={artistName}
          priceInr={currentAmount}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};
