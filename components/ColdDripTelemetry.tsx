'use client';

import React, { useState, useEffect } from 'react';
import { Droplet, Clock, Thermometer, ShieldAlert, ShoppingBag, Sparkles, Activity } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

export default function ColdDripTelemetry() {
  const { addItem } = useCartStore();

  const [dpm, setDpm] = useState<number>(45); // Drops per minute
  const [ambientTemp, setAmbientTemp] = useState<number>(21); // °C
  const [iceRatio, setIceRatio] = useState<number>(70); // % ice vs water
  const [elapsedHours, setElapsedHours] = useState<number>(3.5);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  // Math metrics for Kyoto Cold Drip Tower
  const totalHours = (600 / dpm).toFixed(1); // Hours to complete 600ml brew
  const calculatedTDS = (1.25 + (dpm / 100) * 0.4 - (ambientTemp - 20) * 0.01).toFixed(2);
  const extractionYield = (Number(calculatedTDS) * 5.2).toFixed(1); // % EY

  const handleAddToCart = () => {
    addItem({
      coffeeItemId: 'kyoto-cold-drip-reserve',
      name: 'Kyoto Cold Drip 12h Reserve Bottle',
      hebrewName: 'בקבוק קולד דריפ יפני חליטה איטית 12 שעות',
      price: 68,
      shots: 1,
      milkType: 'NONE',
      imageUrl: '/images/cold-drip.jpg',
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="relative p-6 md:p-8 rounded-3xl bg-neutral-950/80 backdrop-blur-2xl border border-blue-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Droplet className="w-4 h-4" />
              <span>טלמטריית קולד דריפ יפני v6.0</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Kyoto Cold Drip Telemetry
            </h1>
            <p className="text-neutral-400 max-w-xl text-sm md:text-base leading-relaxed">
              ניטור קצב טפטוף מדויק (Drops Per Minute - DPM), עקומת המסת הדינמיקה התרמית של הקרח, ומיצוי מוצקים מומסים (TDS).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-500/30 font-mono text-center space-y-1">
            <div className="text-xs text-neutral-400">זמן חליטה כולל משוער:</div>
            <div className="text-3xl font-extrabold text-blue-400">{totalHours} שעות</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animated Tower Telemetry */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span>מגדל הטפטוף והמיומנות</span>
            </h2>
            <span className="text-xs font-mono text-blue-400 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30">
              {dpm} טיפות/דקה (DPM)
            </span>
          </div>

          {/* Visual Tower Container */}
          <div className="relative h-64 md:h-72 rounded-2xl bg-neutral-950 border border-white/5 overflow-hidden flex items-center justify-around p-4">
            {/* Top Ice Vessel */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-20 h-20 rounded-2xl border border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-blue-400 font-mono font-bold">
                {iceRatio}% קרח
              </div>
              <span className="text-xs text-neutral-400">מיכל קרח ומים</span>
            </div>

            {/* Drip Valve animation */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-1 h-12 bg-neutral-800 relative overflow-hidden">
                <div className="w-full h-3 bg-blue-400 rounded-full animate-bounce" />
              </div>
              <Droplet className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>

            {/* Bottom Flask */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-24 h-24 rounded-b-full border-2 border-amber-500/40 bg-amber-950/30 flex items-center justify-center text-amber-400 font-mono font-bold text-sm">
                TDS {calculatedTDS}%
              </div>
              <span className="text-xs text-neutral-400">בקבוק איסוף</span>
            </div>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5 space-y-1">
              <span className="text-neutral-400 block">TDS מחושב:</span>
              <span className="text-blue-400 font-bold text-base">{calculatedTDS}%</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5 space-y-1">
              <span className="text-neutral-400 block">Extraction Yield (EY):</span>
              <span className="text-amber-400 font-bold text-base">{extractionYield}%</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5 space-y-1 col-span-2 md:col-span-1">
              <span className="text-neutral-400 block">טמפרטורת חדר:</span>
              <span className="text-emerald-400 font-bold text-base">{ambientTemp}°C</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-blue-400" />
              <span>כוון קצב טפטוף ואקלים</span>
            </h3>

            {/* DPM Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">קצב טיפות לדקה (DPM):</span>
                <span className="font-mono text-blue-400 font-bold">{dpm} DPM</span>
              </div>
              <input
                type="range"
                min={20}
                max={90}
                value={dpm}
                onChange={(e) => setDpm(Number(e.target.value))}
                className="w-full accent-blue-500 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Ice Ratio Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">יחס קרח למי חליטה (%):</span>
                <span className="font-mono text-cyan-400 font-bold">{iceRatio}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={90}
                value={iceRatio}
                onChange={(e) => setIceRatio(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Ambient Temp Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">טמפרטורת סביבה (°C):</span>
                <span className="font-mono text-emerald-400 font-bold">{ambientTemp}°C</span>
              </div>
              <input
                type="range"
                min={16}
                max={30}
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{addedToCart ? 'התווסף לסל!' : 'הזמן בקבוק קולד דריפ 12h (₪68)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
