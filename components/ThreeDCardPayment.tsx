'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Loader2, Sparkles, CreditCard, Lock, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

interface ThreeDCardPaymentProps {
  amount: number;
  fullName: string;
  phone: string;
  address: string;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

export const ThreeDCardPayment: React.FC<ThreeDCardPaymentProps> = ({
  amount,
  fullName,
  phone,
  address,
  onPaymentComplete,
  onCancel,
}) => {
  const { user } = useAuthStore();
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [statusText, setStatusText] = useState('ממתין לתחילת סליקה מאובטחת...');
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-typing animation targets (cleans non-digits for typing loop, uses saved details if present)
  const rawSavedCard = user?.cardNo ? user.cardNo.replace(/\s+/g, '') : '';
  const targetCardNumber = rawSavedCard || '4580123456789012';
  const targetCardHolder = user?.cardHolder || fullName || 'ישראל ישראלי';
  const targetExpiry = user?.cardExpiry || '12/30';
  const targetCvv = user?.cardCvv || '770';

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

  // Auto-typing simulator loop
  useEffect(() => {
    if (!isPlaying) return;

    let timeout: NodeJS.Timeout;

    const runSimulation = async () => {
      // Step 1: Type Card Number
      setStatusText('מזין מספר כרטיס אשראי מוצפן...');
      for (let i = 0; i <= targetCardNumber.length; i++) {
        await new Promise((r) => setTimeout(r, 120));
        setCardNumber(targetCardNumber.slice(0, i));
      }

      // Step 2: Type Card Holder in Hebrew RTL
      await new Promise((r) => setTimeout(r, 600));
      setStatusText('רושם שם מחזיק הכרטיס בעברית...');
      for (let i = 0; i <= targetCardHolder.length; i++) {
        await new Promise((r) => setTimeout(r, 150));
        setCardHolder(targetCardHolder.slice(0, i));
      }

      // Step 3: Type Expiry
      await new Promise((r) => setTimeout(r, 500));
      setStatusText('מזין תוקף כרטיס...');
      for (let i = 0; i <= targetExpiry.length; i++) {
        await new Promise((r) => setTimeout(r, 180));
        setExpiry(targetExpiry.slice(0, i));
      }

      // Step 4: Flip card to back
      await new Promise((r) => setTimeout(r, 600));
      setStatusText('מאמת קוד אבטחה בגב הכרטיס (CVV)...');
      setIsFlipped(true);

      // Step 5: Type CVV
      await new Promise((r) => setTimeout(r, 800));
      for (let i = 0; i <= targetCvv.length; i++) {
        await new Promise((r) => setTimeout(r, 200));
        setCvv(targetCvv.slice(0, i));
      }

      // Step 6: Verify and submit
      await new Promise((r) => setTimeout(r, 1000));
      setStatusText('מבצע הצפנת AES-256 ושולח בקשה לסולק...');
      await new Promise((r) => setTimeout(r, 1200));
      setStatusText('העסקה אושרה בהצלחה! מייצר קבלה...');
      await new Promise((r) => setTimeout(r, 800));

      onPaymentComplete();
    };

    runSimulation();
  }, [isPlaying]);

  // Start the simulation immediately on mount
  useEffect(() => {
    setIsPlaying(true);
  }, []);

  const formatCardNumber = (num: string) => {
    const parts = num.match(/.{1,4}/g) || [];
    return parts.join(' ');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      {/* Dynamic Glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg liquid-glass border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>חזרה לעגלה</span>
          </button>
          <div className="flex items-center gap-1.5 text-amber-400 font-label-caps text-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>סליקה מאובטחת</span>
          </div>
        </div>

        {/* 3D Card Area */}
        <div className="h-56 w-full flex items-center justify-center relative perspective-1000">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`w-full max-w-sm h-48 rounded-2xl relative cursor-pointer select-none transition-transform duration-700 preserve-3d shadow-2xl border border-amber-500/30 ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              background: 'linear-gradient(135deg, #1c1917 0%, #0c0a09 100%)',
            }}
          >
            {/* CARD FRONT */}
            <div className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between backface-hidden z-10">
              {/* Card Brand & Chip */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-amber-400 tracking-wider">OBSIDIAN COFFEE</span>
                  <span className="text-[10px] text-stone-400 font-mono">PREMIUM CARD</span>
                </div>
                <div className="w-10 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 border border-amber-500/40 relative overflow-hidden flex items-center justify-center">
                  {/* Microchip pattern lines */}
                  <div className="absolute w-full h-px bg-stone-950/30 top-1/2" />
                  <div className="absolute h-full w-px bg-stone-950/30 left-1/2" />
                </div>
              </div>

              {/* Card Number */}
              <div className="text-xl font-bold font-mono tracking-[0.15em] text-stone-100 drop-shadow-md text-center py-2 min-h-[2.5rem]">
                {formatCardNumber(cardNumber) || '•••• •••• •••• ••••'}
              </div>

              {/* Card Holder & Expiry */}
              <div className="flex justify-between items-end">
                <div className="flex flex-col text-right" dir="rtl">
                  <span className="text-[9px] text-stone-400 uppercase tracking-wider">מחזיק הכרטיס</span>
                  <span className="text-xs font-bold text-amber-300 font-sans tracking-wide min-h-[1.2rem]">
                    {cardHolder || 'ישראל ישראלי'}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-stone-400 uppercase tracking-wider">תוקף</span>
                  <span className="text-xs font-bold text-stone-200 font-mono min-h-[1.2rem]">{expiry || '••/••'}</span>
                </div>
              </div>
            </div>

            {/* CARD BACK */}
            <div className="absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between backface-hidden rotate-y-180 p-6">
              {/* Magnetic Strip */}
              <div className="absolute left-0 right-0 top-6 h-10 bg-stone-950" />

              <div className="mt-14 flex items-center justify-between">
                {/* Signature Block */}
                <div className="w-3/4 h-8 bg-stone-800/80 rounded border border-stone-700 flex items-center px-3 text-stone-400 text-xs italic font-serif">
                  Obsidian Roast Premium
                </div>
                {/* CVV */}
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-stone-400 uppercase">CVV</span>
                  <div className="bg-amber-400 text-stone-950 font-bold font-mono px-3 py-1 rounded text-xs min-h-[1.5rem]">
                    {cvv || '•••'}
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-stone-500 leading-tight">
                This card is protected by AES-256 quantum encrypted coffee-net protocols. Usage signifies agreement to digital barista terms.
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 space-y-3">
          <div className="flex justify-between text-xs text-stone-300">
            <span>סכום לתשלום:</span>
            <span className="font-bold text-stone-100">₪{amount}</span>
          </div>
          <div className="flex justify-between text-xs text-stone-300">
            <span>כתובת משלוח:</span>
            <span className="font-bold text-stone-100 max-w-[200px] truncate">{address}</span>
          </div>
          <div className="flex justify-between text-xs text-stone-300">
            <span>טלפון ליצירת קשר:</span>
            <span className="font-bold text-stone-100">{phone}</span>
          </div>
        </div>

        {/* Live Status logger */}
        <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 flex items-center gap-3">
          <div className="relative">
            <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
            <div className="absolute inset-0 m-auto w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
          </div>
          <p className="text-xs font-bold text-stone-300 leading-normal text-right w-full" dir="rtl">
            {statusText}
          </p>
        </div>

        <div className="text-center text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>חיבור מאובטח ומפוקח תחת רשת Coffee-Auth</span>
        </div>
      </div>

      {/* Styled card flipping helper classes */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};
