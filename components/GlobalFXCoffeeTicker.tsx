'use client';

import React, { useState, useEffect } from 'react';
import { fetchLiveFXRates, convertCoffeePrice } from '@/app/actions/currencyAction';
import { SupportedCurrency } from '@/lib/schemas/currencySchema';

const SYMBOLS: Record<SupportedCurrency, string> = {
  ILS: '₪',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

export default function GlobalFXCoffeeTicker() {
  const [currency, setCurrency] = useState<SupportedCurrency>('ILS');
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [sampleCoffeePriceILS] = useState<number>(68); // 68 ILS for Specialty Coffee Bean
  const [convertedPrice, setConvertedPrice] = useState<number>(68);

  useEffect(() => {
    fetchLiveFXRates().then((res) => setRates(res.rates));
  }, []);

  const handleCurrencyChange = async (newCurr: SupportedCurrency) => {
    setCurrency(newCurr);
    playSpatialAudioTone();
    const result = await convertCoffeePrice(sampleCoffeePriceILS, 'ILS', newCurr);
    setConvertedPrice(result);
  };

  const playSpatialAudioTone = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createPanner?.();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      if (panner) {
        panner.setPosition?.((Math.random() - 0.5) * 2, 0, 1);
        osc.connect(panner);
        panner.connect(gain);
      } else {
        osc.connect(gain);
      }

      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio context fallback
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-6 rounded-2xl bg-[#0c0a09]/80 border border-amber-500/30 backdrop-blur-2xl shadow-[0_0_30px_rgba(245,158,11,0.15)] transform-gpu transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-amber-500/20 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
          <h2 className="text-xl font-bold text-amber-100 tracking-tight font-sans">
            בורסת קפה וFX בזמן אמת <span className="text-xs text-cyan-400 font-mono font-normal">(rapidapi_currency)</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-amber-500/20">
          {(['ILS', 'USD', 'EUR', 'GBP', 'JPY'] as SupportedCurrency[]).map((curr) => (
            <button
              key={curr}
              onClick={() => handleCurrencyChange(curr)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all transform-gpu active:scale-95 ${
                currency === curr
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-white/5'
              }`}
            >
              {curr} ({SYMBOLS[curr]})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex flex-col justify-between">
          <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">מחיר פולי גואטמלה גורמה (250g)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">
              {SYMBOLS[currency]} {convertedPrice}
            </span>
            <span className="text-xs text-stone-400">({currency})</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex flex-col justify-between">
          <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">שערי חליפין מול השקל (ILS ₪)</span>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono text-cyan-300">
            <div>USD: <span className="text-white font-bold">{rates ? rates.USD : '...'}</span></div>
            <div>EUR: <span className="text-white font-bold">{rates ? rates.EUR : '...'}</span></div>
            <div>GBP: <span className="text-white font-bold">{rates ? rates.GBP : '...'}</span></div>
            <div>JPY: <span className="text-white font-bold">{rates ? rates.JPY : '...'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
