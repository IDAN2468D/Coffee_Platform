'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Loader2,
  Sparkles,
  CreditCard,
  Lock,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  QrCode,
  Smartphone,
  Fingerprint,
  Coins,
  Check,
  AlertCircle,
  KeyRound,
  ExternalLink,
  ChevronDown,
  Layers,
  Zap,
  Wand2,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import {
  detectCardBrand,
  validateLuhn,
  validateIsraeliId,
  CardBrand,
} from '@/lib/validations/payment';

interface ThreeDCardPaymentProps {
  amount: number;
  fullName: string;
  phone: string;
  address: string;
  onPaymentComplete: () => Promise<void> | void;
  onCancel: () => void;
}

type PaymentTab = 'credit_card' | 'bit' | 'apple_pay' | 'google_pay' | 'roast_coins';

// Default Verified Test VISA Card Data for Instant Auto-Fill
const DEFAULT_AUTO_VISA = {
  cardNumber: '4580123456789015',
  expiry: '12/30',
  cvv: '770',
  citizenId: '012345674',
};

export const ThreeDCardPayment: React.FC<ThreeDCardPaymentProps> = ({
  amount,
  fullName,
  phone,
  address,
  onPaymentComplete,
  onCancel,
}) => {
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<PaymentTab>('credit_card');
  const [entryMode, setEntryMode] = useState<'manual' | 'auto_demo'>('manual');

  // Credit Card Form States - Initialized with Automatic Verified VISA Data
  const [cardNumber, setCardNumber] = useState(
    user?.cardNo?.replace(/\s+/g, '') || DEFAULT_AUTO_VISA.cardNumber
  );
  const [cardHolder, setCardHolder] = useState(
    user?.cardHolder || fullName || 'ישראל ישראלי'
  );
  const [expiry, setExpiry] = useState(user?.cardExpiry || DEFAULT_AUTO_VISA.expiry);
  const [cvv, setCvv] = useState(user?.cardCvv || DEFAULT_AUTO_VISA.cvv);
  const [citizenId, setCitizenId] = useState(DEFAULT_AUTO_VISA.citizenId);
  const [installments, setInstallments] = useState(1);

  // 3D Visual & Flow States
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('מוכן לביצוע סליקה מאובטחת');
  const [errorMsg, setErrorMsg] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [bitTimer, setBitTimer] = useState(180); // 3 minutes for Bit session

  const cardRef = useRef<HTMLDivElement>(null);
  const cardBrand: CardBrand = detectCardBrand(cardNumber);

  // Form Validation checks
  const isCardNumberValid = validateLuhn(cardNumber) || cardNumber.length === 8 || cardNumber.length === 9;
  const isIdValid = !citizenId || validateIsraeliId(citizenId);
  const isExpiryValid = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry);
  const isCvvValid = /^\d{3,4}$/.test(cvv);

  // Mouse Parallax/Tilt effect on 3D Card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / (rect.height / 2)) * 12;
    const tiltY = -(x / (rect.width / 2)) * 12;
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) ${
      isFlipped ? 'rotateY(180deg)' : ''
    }`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(${isFlipped ? '180deg' : '0deg'})`;
  };

  // Instant Reset to Automatic VISA
  const handleResetToAutoVisa = () => {
    setCardNumber(DEFAULT_AUTO_VISA.cardNumber);
    setCardHolder(fullName || user?.fullName || 'ישראל ישראלי');
    setExpiry(DEFAULT_AUTO_VISA.expiry);
    setCvv(DEFAULT_AUTO_VISA.cvv);
    setCitizenId(DEFAULT_AUTO_VISA.citizenId);
    setErrorMsg('');
  };

  // Auto-typing animation targets
  const targetCardNumber = '4580123456789015';
  const targetCardHolder = fullName || user?.fullName || 'ישראל ישראלי';
  const targetExpiry = '12/30';
  const targetCvv = '770';

  const runAutoDemo = async () => {
    setLoading(true);
    setErrorMsg('');
    setStatusText('מפעיל סימולציית סליקה אוטומטית לכרטיס VISA...');

    // Clear first
    setCardNumber('');
    setCardHolder('');
    setExpiry('');
    setCvv('');

    // Step 1: Card number
    for (let i = 0; i <= targetCardNumber.length; i++) {
      await new Promise((r) => setTimeout(r, 45));
      setCardNumber(targetCardNumber.slice(0, i));
    }

    // Step 2: Card holder
    await new Promise((r) => setTimeout(r, 200));
    for (let i = 0; i <= targetCardHolder.length; i++) {
      await new Promise((r) => setTimeout(r, 50));
      setCardHolder(targetCardHolder.slice(0, i));
    }

    // Step 3: Expiry
    await new Promise((r) => setTimeout(r, 200));
    for (let i = 0; i <= targetExpiry.length; i++) {
      await new Promise((r) => setTimeout(r, 60));
      setExpiry(targetExpiry.slice(0, i));
    }

    // Step 4: Flip card
    await new Promise((r) => setTimeout(r, 250));
    setIsFlipped(true);

    // Step 5: CVV
    await new Promise((r) => setTimeout(r, 300));
    for (let i = 0; i <= targetCvv.length; i++) {
      await new Promise((r) => setTimeout(r, 80));
      setCvv(targetCvv.slice(0, i));
    }

    await new Promise((r) => setTimeout(r, 300));
    setIsFlipped(false);
    setStatusText('מבצע הצפנת AES-256 וסליקה מול שרתי שב"א...');

    await handleExecuteBackendPayment('credit_card');
  };

  // Bit countdown timer
  useEffect(() => {
    if (activeTab !== 'bit') return;
    const interval = setInterval(() => {
      setBitTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Format Card input
  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    setCardNumber(clean);
  };

  const handleExpiryChange = (val: string) => {
    let clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      clean = `${clean.slice(0, 2)}/${clean.slice(2)}`;
    }
    setExpiry(clean);
  };

  const formatCardDisplay = (num: string) => {
    const parts = num.match(/.{1,4}/g) || [];
    return parts.join(' ');
  };

  // Backend payment execution
  const handleExecuteBackendPayment = async (method: PaymentTab) => {
    setLoading(true);
    setErrorMsg('');
    setStatusText('מבצע handshake מוצפן מול מסוף הסליקה...');

    try {
      const res = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: method,
          amount,
          cardNumber: cardNumber || targetCardNumber,
          cardHolder: cardHolder || fullName || 'ישראל ישראלי',
          cardExpiry: expiry || targetExpiry,
          cardCvv: cvv || targetCvv,
          citizenId: citizenId || DEFAULT_AUTO_VISA.citizenId,
          installments,
          bitPhone: phone,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatusText(`עסקה אושרה בהצלחה! אישור: ${data.authorizationCode}`);
        await new Promise((r) => setTimeout(r, 500));
        await onPaymentComplete();
      } else {
        setErrorMsg(data.error || 'שגיאה בעיבוד העסקה מול חברת האשראי');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Payment API call error:', err);
      setErrorMsg('אירעה שגיאה בתקשורת עם שרת התשלומים');
      setLoading(false);
    }
  };

  const handleCreditCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCardNumberValid) {
      setErrorMsg('מספר כרטיס אשראי אינו תקין');
      return;
    }
    if (!isExpiryValid) {
      setErrorMsg('תוקף כרטיס שגוי (MM/YY)');
      return;
    }
    if (!isCvvValid) {
      setErrorMsg('קוד CVV שגוי בגב הכרטיס');
      return;
    }
    if (citizenId && !isIdValid) {
      setErrorMsg('מספר תעודת זהות ישראלית שגוי');
      return;
    }

    // Trigger 3D Secure OTP Step for transactions over ₪150
    if (amount > 150 && !showOtpModal) {
      setShowOtpModal(true);
      return;
    }

    handleExecuteBackendPayment('credit_card');
  };

  const handleOtpVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setErrorMsg('נא להזין קוד אימות מלא');
      return;
    }
    setShowOtpModal(false);
    await handleExecuteBackendPayment('credit_card');
  };

  const renderBrandLogo = () => {
    switch (cardBrand) {
      case 'visa':
        return <span className="font-black italic text-sky-400 text-lg tracking-wider">VISA</span>;
      case 'mastercard':
        return (
          <div className="flex items-center -space-x-2">
            <div className="w-5 h-5 rounded-full bg-rose-500 opacity-90" />
            <div className="w-5 h-5 rounded-full bg-amber-400 opacity-90" />
          </div>
        );
      case 'isracard':
        return (
          <span className="font-extrabold text-blue-400 text-xs tracking-tighter bg-white/10 px-1.5 py-0.5 rounded">
            ישראכרט
          </span>
        );
      case 'amex':
        return <span className="font-black text-cyan-300 text-sm tracking-widest">AMEX</span>;
      case 'diners':
        return <span className="font-black text-blue-300 text-xs tracking-wide">DINERS</span>;
      default:
        return <span className="font-mono text-[10px] text-stone-400">EMV SECURE</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto" dir="rtl">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl liquid-glass border border-amber-500/30 rounded-3xl p-5 sm:p-7 space-y-4 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-100 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>חזרה לעגלה</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PCI-DSS Level 1 & שב"א EMV</span>
            </span>
          </div>
        </div>

        {/* Payment Channels Tabs */}
        <div className="grid grid-cols-4 gap-1.5 bg-stone-900/80 p-1 rounded-2xl border border-stone-800 text-xs text-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab('credit_card');
              setErrorMsg('');
            }}
            className={`py-2 px-2 rounded-xl transition-all font-bold flex flex-col items-center gap-1 ${
              activeTab === 'credit_card'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-[11px]">אשראי VISA</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('bit');
              setErrorMsg('');
            }}
            className={`py-2 px-2 rounded-xl transition-all font-bold flex flex-col items-center gap-1 ${
              activeTab === 'bit'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span className="text-[11px]">Bit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('apple_pay');
              setErrorMsg('');
            }}
            className={`py-2 px-2 rounded-xl transition-all font-bold flex flex-col items-center gap-1 ${
              activeTab === 'apple_pay'
                ? 'bg-stone-100 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span className="text-[11px]">Apple/Google Pay</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('roast_coins');
              setErrorMsg('');
            }}
            className={`py-2 px-2 rounded-xl transition-all font-bold flex flex-col items-center gap-1 ${
              activeTab === 'roast_coins'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="text-[11px]">RoastCoins</span>
          </button>
        </div>

        {/* Tab 1: Credit Card Experience */}
        {activeTab === 'credit_card' && (
          <div className="space-y-4">
            {/* Auto VISA Status Banner */}
            <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-2xl p-2.5 px-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>כרטיס VISA מאומת מוזן אוטומטית (מוכן לסליקה מיידית)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleResetToAutoVisa}
                  className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-300 text-[11px] font-bold transition-all border border-amber-500/40 flex items-center gap-1"
                  title="מילוי אוטומטי מחדש של פרטי כרטיס Visa"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>שחזר כרטיס VISA</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEntryMode('auto_demo');
                    runAutoDemo();
                  }}
                  className="px-2 py-1 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-stone-100 text-[11px] font-bold transition-all border border-stone-700 flex items-center gap-1"
                  title="הפעל אנימציית הקלדה אוטומטית חיה"
                >
                  <Wand2 className="w-3 h-3 text-amber-400" />
                  <span>הדגמה מונפשת</span>
                </button>
              </div>
            </div>

            {/* 3D Holographic Card View */}
            <div className="h-48 w-full flex items-center justify-center relative perspective-1000">
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsFlipped((prev) => !prev)}
                className={`w-full max-w-sm h-44 rounded-2xl relative cursor-pointer select-none transition-transform duration-700 preserve-3d shadow-2xl border border-amber-500/30 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{
                  background: 'linear-gradient(135deg, #1c1917 0%, #0c0a09 100%)',
                }}
              >
                {/* CARD FRONT */}
                <div className="absolute inset-0 w-full h-full p-5 flex flex-col justify-between backface-hidden z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-extrabold text-amber-400 tracking-wider">
                        THE DIGITAL ROAST PAY
                      </span>
                      <span className="text-[9px] text-stone-400 font-mono">EMV QUANTUM CARD</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {renderBrandLogo()}
                      <div className="w-8 h-6 rounded-md bg-gradient-to-tr from-amber-400 to-amber-200 border border-amber-500/40 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute w-full h-px bg-stone-950/30 top-1/2" />
                        <div className="absolute h-full w-px bg-stone-950/30 left-1/2" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Card Number */}
                    <div className="font-mono text-base sm:text-lg font-black tracking-widest text-stone-100 text-left drop-shadow-md" dir="ltr">
                      {formatCardDisplay(cardNumber) || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex justify-between items-end text-xs">
                      <div className="flex flex-col text-right">
                        <span className="text-[8px] text-stone-500 uppercase font-mono">
                          בעל הכרטיס
                        </span>
                        <span className="font-bold text-stone-200 uppercase tracking-wider truncate max-w-[170px]">
                          {cardHolder || 'ישראל ישראלי'}
                        </span>
                      </div>

                      <div className="flex flex-col text-left font-mono" dir="ltr">
                        <span className="text-[8px] text-stone-500 uppercase">תוקף</span>
                        <span className="font-bold text-stone-200">{expiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD BACK */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl p-4 flex flex-col justify-between backface-hidden rotate-y-180 z-10"
                  style={{ background: '#11100f' }}
                >
                  <div className="w-full h-9 bg-black -mx-4 mt-2" />

                  <div className="space-y-1">
                    <div className="flex justify-end items-center pr-4">
                      <span className="text-[9px] text-stone-400 font-mono">CVV / CVC</span>
                    </div>
                    <div className="h-8 bg-white/90 rounded flex items-center justify-end px-3">
                      <span className="font-mono font-black text-stone-950 text-sm tracking-widest">
                        {cvv || '•••'}
                      </span>
                    </div>
                  </div>

                  <div className="text-center text-[8px] text-stone-500 font-mono">
                    SECURED BY DIGITAL ROAST EMV 3D SECURE 2.2
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Filled Form Details */}
            <form onSubmit={handleCreditCardSubmit} className="space-y-3 pt-1 text-right">
              {errorMsg && (
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {/* Card Number */}
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    מספר כרטיס אשראי (הוזן אוטומטית) *
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="4580 1234 5678 9012"
                      value={formatCardDisplay(cardNumber)}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      onFocus={() => setIsFlipped(false)}
                      className="w-full px-3 py-2 pl-10 rounded-xl bg-stone-950 border border-emerald-500/50 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono text-left"
                      dir="ltr"
                    />
                    <div className="absolute right-3">{renderBrandLogo()}</div>
                    {isCardNumberValid && (
                      <div className="absolute left-3 text-emerald-400 flex items-center gap-1 font-mono text-[10px]">
                        <Check className="w-3.5 h-3.5" />
                        <span>מאומת</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Holder */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    שם מחזיק הכרטיס *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ישראל ישראלי"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    onFocus={() => setIsFlipped(false)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-emerald-500/50 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-right"
                  />
                </div>

                {/* Israeli ID */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    תעודת זהות של בעל הכרטיס
                  </label>
                  <input
                    type="text"
                    placeholder="9 ספרות"
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-emerald-500/50 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono text-left"
                    dir="ltr"
                  />
                </div>

                {/* Expiry */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    תוקף (MM/YY) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/30"
                    value={expiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    onFocus={() => setIsFlipped(false)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-emerald-500/50 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono text-center"
                    dir="ltr"
                  />
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    קוד אבטחה (CVV) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="770"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-emerald-500/50 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono text-center"
                    dir="ltr"
                  />
                </div>

                {/* Installments selector */}
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    פריסה לתשלומים ללא ריבית:
                  </label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500 text-right cursor-pointer"
                  >
                    <option value={1}>תשלום אחד מלא (₪{amount})</option>
                    <option value={2}>2 תשלומים של ₪{Math.round(amount / 2)} ללא ריבית</option>
                    <option value={3}>3 תשלומים של ₪{Math.round(amount / 3)} ללא ריבית</option>
                    <option value={6}>6 תשלומים של ₪{Math.round(amount / 6)} ללא ריבית</option>
                    <option value={12}>12 תשלומים של ₪{Math.round(amount / 12)} ללא ריבית</option>
                  </select>
                </div>
              </div>

              {/* Instant Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-black text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{statusText}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>אישור וסליקה מאובטחת מיידית (₪{amount}) ⚡</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Bit App Payment */}
        {activeTab === 'bit' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-stone-100">תשלום מהיר באפליקציית Bit</h4>
              <p className="text-xs text-stone-400">
                סרוק את קוד ה-QR בנייד או לחץ על הכפתור למעבר ישיר לאפליקציה:
              </p>
            </div>

            {/* Bit QR Code Simulation */}
            <div className="p-4 bg-white rounded-2xl w-44 h-44 mx-auto flex flex-col items-center justify-center shadow-2xl relative">
              <QrCode className="w-32 h-32 text-stone-950" />
              <span className="text-[10px] font-bold text-stone-900 mt-1 font-mono">₪{amount} ILS</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
              <span>הסשן תקף למשך:</span>
              <span className="font-mono text-amber-400 font-bold">
                {Math.floor(bitTimer / 60)}:{(bitTimer % 60).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`bit://pay?amount=${amount}&ref=ROAST-COFFEE`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-blue-500 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>פתח אפליקציית Bit</span>
              </a>

              <button
                type="button"
                onClick={() => handleExecuteBackendPayment('bit')}
                disabled={loading}
                className="py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>אישרתי תשלום ב-Bit</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Apple Pay / Google Pay */}
        {activeTab === 'apple_pay' && (
          <div className="space-y-5 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
              <Fingerprint className="w-8 h-8 animate-pulse text-amber-400" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-base text-stone-100">סליקה ביומטרית בלחיצה אחת</h4>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                אימות מאובטח ומיידי באמצעות Touch ID, Face ID או טביעת אצבע.
              </p>
            </div>

            <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 text-xs space-y-1 text-right">
              <div className="flex justify-between text-stone-300">
                <span>חשבון סולק:</span>
                <span className="font-bold text-stone-100">Digital Roast Apple/Google Merchant</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>סכום מאושר לחיוב:</span>
                <span className="font-mono font-bold text-amber-400">₪{amount}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleExecuteBackendPayment('apple_pay')}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                <span>שלם עם Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => handleExecuteBackendPayment('google_pay')}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 border border-stone-700 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-400" />}
                <span>שלם עם Google Pay</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: RoastCoins VIP Wallet */}
        {activeTab === 'roast_coins' && (
          <div className="space-y-4 text-center py-3">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
              <Coins className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-stone-100">תשלום בארנק RoastCoins VIP</h4>
              <p className="text-xs text-stone-400">
                נצל את יתרת מטבעות הקלייה שצברת במועדון הבראיסטה
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2 text-right">
              <div className="flex justify-between text-stone-300">
                <span>יתרת מטבעות נוכחית:</span>
                <span className="font-mono font-bold text-amber-400">
                  {user?.roastCoins || 1250} RoastCoins
                </span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>שווי למימוש בהזמנה זו:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₪{Math.min(amount, Math.floor((user?.roastCoins || 1250) / 10))}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleExecuteBackendPayment('roast_coins')}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
              <span>שלם עם יתרת RoastCoins (מימוש מיידי)</span>
            </button>
          </div>
        )}

        {/* 3D Secure 2.2 OTP Verification Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-sm liquid-glass border border-amber-500/40 rounded-3xl p-6 space-y-4 text-center shadow-2xl animate-scaleIn">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 shadow-md">
                <KeyRound className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-base text-stone-100">אימות 3D Secure 2.2</h4>
                <p className="text-xs text-stone-400">
                  קוד אימות חד-פעמי (OTP) נשלח למספר הנייד {phone || 'שלך'}:
                </p>
              </div>

              <form onSubmit={handleOtpVerifyAndSubmit} className="space-y-3">
                <div className="bg-stone-950 p-2.5 rounded-2xl border border-stone-800 flex justify-center">
                  <input
                    type="text"
                    autoFocus
                    required
                    maxLength={6}
                    placeholder="9402"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-36 text-center tracking-[0.4em] font-mono text-xl font-black bg-transparent text-amber-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <p className="text-[10px] text-stone-500">
                  (קוד הדגמה מהיר: <strong className="text-amber-400">9402</strong>)
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowOtpModal(false)}
                    className="py-2.5 px-3 rounded-xl bg-stone-900 text-stone-400 hover:text-stone-200 text-xs font-bold transition-all"
                  >
                    ביטול
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>אמת ועבור לסליקה</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
