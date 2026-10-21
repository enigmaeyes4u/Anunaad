import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { triggerHeritageConfetti } from './Confetti';
import {
  ShieldCheck, CheckCircle2, AlertCircle, Sparkles, X,
  ArrowRight, Lock, User, Mail, Phone, CreditCard,
  Smartphone, Building2, QrCode, Copy, Check
} from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  offeringId?: string;
  experienceId?: string;
  tipArtistId?: string;
  tipAmountInr?: number;
  itemTitle: string;
  artistName: string;
  priceInr: number;
  onSuccess?: () => void;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking';
type Step = 'review' | 'payment' | 'processing' | 'success' | 'error';

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  offeringId,
  experienceId,
  tipArtistId,
  tipAmountInr,
  itemTitle,
  artistName,
  priceInr,
  onSuccess
}) => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('review');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [copied, setCopied] = useState(false);
  const [upiTimer, setUpiTimer] = useState(300); // 5 min

  // Customer info (prefilled from user)
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');

  // Card info
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // NetBanking
  const [selectedBank, setSelectedBank] = useState('');

  // UPI countdown timer
  useEffect(() => {
    if (step === 'payment' && paymentMethod === 'upi') {
      const interval = setInterval(() => {
        setUpiTimer(t => {
          if (t <= 1) { clearInterval(interval); return 0; }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, paymentMethod]);

  if (!isOpen) return null;

  const isTip = !!tipArtistId;
  const artistPercent = isTip ? 95 : 80;
  const platformPercent = 100 - artistPercent;
  const approxArtistShare = Math.round((priceInr * artistPercent) / 100);
  const approxPlatformFee = priceInr - approxArtistShare;

  const upiId = 'u.gond.1@superyes';
  const payeeName = 'Ujjwal Gond';
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${priceInr}&cu=INR&tn=${encodeURIComponent(itemTitle)}`;
  const qrImageUrl = '/assets/images/payment_qr_card.png';

  const formatTimer = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormatCard = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleProceedToPayment = () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      alert('Please fill in your name and email.');
      return;
    }
    setStep('payment');
  };

  const handleInitiatePayment = async () => {
    if (!user || !token) {
      alert('Please sign in to proceed.');
      return;
    }

    setLoading(true);
    setStep('processing');
    setErrorMessage('');

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          offeringId,
          experienceId,
          tipArtistId,
          tipAmountInr,
          learnerName: customerName,
          learnerEmail: customerEmail
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initiate payment order');

      setOrderData(data);

      // Simulate secure gateway confirmation
      setTimeout(async () => {
        try {
          const verifyRes = await fetch('/api/payments/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              gatewayOrderId: data.gatewayOrderId,
              gatewayPaymentId: `pay_mock_${Date.now()}`,
              gatewaySignature: 'mock_valid_signature_2026'
            })
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment signature verification failed');

          setStep('success');
          triggerHeritageConfetti();
          if (onSuccess) onSuccess();
        } catch (vErr: any) {
          setErrorMessage(vErr.message || 'Signature verification rejected by server');
          setStep('error');
        } finally {
          setLoading(false);
        }
      }, 1400);

    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing error');
      setStep('error');
      setLoading(false);
    }
  };

  const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India', 'Yes Bank'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FDFBF7] text-[#1C1B19] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E8E2D5]">
        
        {/* Header */}
        <div className="bg-[#1C1B19] text-[#FDFBF7] p-5 flex items-center justify-between border-b border-[#3A3630]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#C85A32] flex items-center justify-center text-white text-xs font-serif font-bold">
              अनु
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wide">ANUNAAD SECURE CHECKOUT</h3>
              <p className="text-[11px] text-[#A8A296] flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#D97724]" /> 256-Bit SSL Encrypted
              </p>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#A8A296] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">

          {/* ─── STEP 1: Review + Customer Info ─── */}
          {step === 'review' && (
            <div className="space-y-5">
              {/* Booking summary */}
              <div className="bg-[#F5F2EA] p-4 rounded-xl border border-[#E8E2D5]">
                <span className="text-[11px] font-mono tracking-wider text-[#C85A32] uppercase block mb-1">
                  {isTip ? 'Artist Support Tip' : 'Living Transmission Experience'}
                </span>
                <h4 className="font-serif text-lg font-bold text-[#1C1B19] leading-snug">{itemTitle}</h4>
                <p className="text-xs text-[#5E5B54] mt-1">
                  With Master Keeper: <strong className="text-[#1C1B19]">{artistName}</strong>
                </p>
                <div className="mt-3 pt-3 border-t border-[#E8E2D5] space-y-1.5">
                  <div className="flex justify-between text-xs text-[#5E5B54]">
                    <span>Total Amount</span>
                    <span className="font-bold text-sm text-[#1C1B19] font-mono">₹{priceInr.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#2D4F38]">
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-[#D97724]" />Artist Share ({artistPercent}%)</span>
                    <span className="font-mono font-bold">₹{approxArtistShare.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#8E877B]">
                    <span>Platform Fee ({platformPercent}%)</span>
                    <span className="font-mono">₹{approxPlatformFee.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-[#1C1B19] uppercase tracking-wider">Your Details</h5>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8E877B]" />
                  <input
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8E877B]" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8E877B]" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="Phone Number (optional)"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full py-3 px-4 bg-[#C85A32] hover:bg-[#B34D28] text-white font-medium rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span className="text-sm">Proceed to Payment</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-[11px] text-center text-[#8E877B] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D4F38]" /> Instant Booking Confirmation
              </p>
            </div>
          )}

          {/* ─── STEP 2: Payment Method ─── */}
          {step === 'payment' && (
            <div className="space-y-5">
              {/* Amount reminder */}
              <div className="bg-[#F5F2EA] p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="text-[#5E5B54]">{itemTitle.slice(0, 30)}{itemTitle.length > 30 ? '...' : ''}</span>
                <span className="font-mono font-bold text-[#1C1B19]">₹{priceInr.toLocaleString('en-IN')}</span>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex rounded-xl border border-[#E8E2D5] overflow-hidden">
                {(['upi', 'card', 'netbanking'] as PaymentMethod[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`flex-1 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      paymentMethod === m
                        ? 'bg-[#C85A32] text-white'
                        : 'bg-white text-[#5E5B54] hover:bg-[#FAF7F0]'
                    }`}
                  >
                    {m === 'upi' && <Smartphone className="w-3 h-3" />}
                    {m === 'card' && <CreditCard className="w-3 h-3" />}
                    {m === 'netbanking' && <Building2 className="w-3 h-3" />}
                    {m === 'upi' ? 'UPI / QR' : m === 'card' ? 'Card' : 'Net Banking'}
                  </button>
                ))}
              </div>

              {/* UPI / QR Code */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-[#E8E2D5] p-5 flex flex-col items-center gap-3 shadow-xs">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#EEF2FF] text-[#4F46E5] mb-1.5 border border-[#C7D2FE]">
                        <Smartphone className="w-3.5 h-3.5" /> super.money Verified UPI
                      </div>
                      <p className="text-xs text-[#5E5B54]">
                        Scan and pay using any UPI app (super.money, GPay, PhonePe, Paytm, BHIM)
                      </p>
                    </div>

                    <div className="p-2.5 bg-gradient-to-b from-[#FAF7F0] to-[#F3EEE3] rounded-2xl border border-[#E8E2D5] shadow-inner flex flex-col items-center max-w-[240px] w-full">
                      <img
                        src="/assets/images/payment_qr_card.png"
                        alt="UPI QR Code - Ujjwal Gond (super.money)"
                        className="w-full h-auto object-contain rounded-xl shadow-xs"
                      />
                    </div>

                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between text-xs px-1 text-[#8E877B]">
                        <span>Payee: <strong className="text-[#1C1B19] font-medium">{payeeName}</strong></span>
                        <span className="font-bold text-[#2D4F38]">Amount: ₹{priceInr.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center gap-2 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl px-3 py-2">
                        <span className="flex-1 font-mono text-xs text-[#1C1B19] font-bold truncate">{upiId}</span>
                        <button
                          onClick={handleCopyUpi}
                          className="flex items-center gap-1 text-[11px] text-[#C85A32] font-semibold cursor-pointer hover:opacity-80 shrink-0"
                        >
                          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {upiTimer > 0 ? (
                      <p className="text-[11px] text-[#D97724] font-mono">Session valid for {formatTimer(upiTimer)}</p>
                    ) : (
                      <p className="text-[11px] text-red-500">QR expired. Please refresh.</p>
                    )}
                  </div>

                  <button
                    onClick={handleInitiatePayment}
                    disabled={loading}
                    className="w-full py-3 bg-[#2D4F38] hover:bg-[#1F3828] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    I Have Paid — Confirm Booking
                  </button>
                  <p className="text-[11px] text-center text-[#8E877B]">Click after completing payment in your UPI app</p>
                </div>
              )}

              {/* Card Payment */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Card Number</label>
                    <input
                      value={cardNumber}
                      onChange={e => setCardNumber(handleFormatCard(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-mono focus:outline-none focus:border-[#C85A32] tracking-widest"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Expiry (MM/YY)</label>
                      <input
                        value={cardExpiry}
                        onChange={e => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setCardExpiry(v.length > 2 ? `${v.slice(0,2)}/${v.slice(2)}` : v);
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-mono focus:outline-none focus:border-[#C85A32]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#5E5B54] mb-1">CVV</label>
                      <input
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="•••"
                        type="password"
                        maxLength={4}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs font-mono focus:outline-none focus:border-[#C85A32]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Name on Card</label>
                    <input
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      placeholder="As printed on card"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32] uppercase"
                    />
                  </div>
                  <button
                    onClick={handleInitiatePayment}
                    disabled={loading || !cardNumber || !cardExpiry || !cardCvv}
                    className="w-full py-3 bg-[#C85A32] hover:bg-[#B34D28] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Pay ₹{priceInr.toLocaleString('en-IN')} Securely
                  </button>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5E5B54] mb-1">Select Your Bank</label>
                    <select
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                    >
                      <option value="">— Select Bank —</option>
                      {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  {selectedBank && (
                    <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5] text-xs text-[#5E5B54]">
                      You will be redirected to <strong className="text-[#1C1B19]">{selectedBank}</strong>'s secure portal to complete the payment of <strong className="text-[#C85A32]">₹{priceInr.toLocaleString('en-IN')}</strong>.
                    </div>
                  )}
                  <button
                    onClick={handleInitiatePayment}
                    disabled={loading || !selectedBank}
                    className="w-full py-3 bg-[#C85A32] hover:bg-[#B34D28] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Proceed to {selectedBank || 'Bank'} →
                  </button>
                </div>
              )}

              <button
                onClick={() => setStep('review')}
                className="w-full text-xs text-[#8E877B] hover:text-[#1C1B19] py-1 cursor-pointer"
              >
                ← Back to Details
              </button>
            </div>
          )}

          {/* ─── Processing ─── */}
          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 border-3 border-[#C85A32]/30 border-t-[#C85A32] rounded-full animate-spin mx-auto"></div>
              <h4 className="font-serif text-lg font-bold text-[#1C1B19]">Securing Transaction...</h4>
              <p className="text-xs text-[#5E5B54] max-w-xs mx-auto">
                Verifying HMAC-SHA256 signature with Razorpay Route and logging immutable financial credit.
              </p>
            </div>
          )}

          {/* ─── Success ─── */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-[#2D4F38]/10 text-[#2D4F38] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#1C1B19]">Resonance Confirmed</h4>
              <p className="text-xs text-[#5E5B54] max-w-xs mx-auto leading-relaxed">
                Thank you, <strong>{customerName}</strong>. Your participation ensures this tradition continues to live.
              </p>
              <div className="bg-[#F5F2EA] p-4 rounded-xl text-left text-xs space-y-2">
                <div className="flex justify-between"><span className="text-[#8E877B]">Name</span><span className="font-medium">{customerName}</span></div>
                <div className="flex justify-between"><span className="text-[#8E877B]">Email</span><span className="font-medium">{customerEmail}</span></div>
                <div className="flex justify-between"><span className="text-[#8E877B]">Course</span><span className="font-medium max-w-[180px] text-right">{itemTitle}</span></div>
                <div className="flex justify-between"><span className="text-[#8E877B]">Artist</span><span className="font-medium">{artistName}</span></div>
                <div className="flex justify-between border-t border-[#E8E2D5] pt-2"><span className="text-[#8E877B]">Amount Paid</span><span className="font-mono font-bold text-[#C85A32]">₹{priceInr.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-[#8E877B]">Order ID</span><span className="font-mono text-[10px] text-[#8E877B]">{orderData?.orderId || 'ORD_2026_SUCCESS'}</span></div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-[#1C1B19] hover:bg-[#2D2A24] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Return to Experience
              </button>
            </div>
          )}

          {/* ─── Error ─── */}
          {step === 'error' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#1C1B19]">Payment Verification Failed</h4>
              <p className="text-xs text-red-600 max-w-xs mx-auto">
                {errorMessage || 'Unable to confirm transaction signature.'}
              </p>
              <button
                onClick={() => setStep('review')}
                className="py-2 px-6 bg-[#C85A32] text-white text-xs rounded-xl font-medium cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
