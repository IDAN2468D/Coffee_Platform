'use client';

import React, { useState } from 'react';
import { TestTube, Sliders, Droplets, Zap, ShoppingBag, Sparkles, RefreshCw } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

export default function MineralBypassEngine() {
  const { addItem } = useCartStore();

  const [espressoVolume, setEspressoVolume] = useState<number>(36); // ml shot
  const [bypassVolume, setBypassVolume] = useState<number>(45); // ml RO water
  const [magnesiumPpm, setMagnesiumPpm] = useState<number>(45); // ppm Mg2+
  const [calciumPpm, setCalciumPpm] = useState<number>(25); // ppm Ca2+
  const [bicarbonatePpm, setBicarbonatePpm] = useState<number>(15); // ppm HCO3-
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  // Math metrics for bypass dilution & TDS balance
  const totalBeverageMl = espressoVolume + bypassVolume;
  const bypassPercent = ((bypassVolume / totalBeverageMl) * 100).toFixed(1);
  const totalGhPpm = (magnesiumPpm * 4.1 + calciumPpm * 2.5).toFixed(0);
  const totalKhPpm = (bicarbonatePpm * 0.8).toFixed(0);

  const handleAddToCart = () => {
    addItem({
      coffeeItemId: 'barista-remineralizer-kit',
      name: 'Barista Remineralizer Ion Dropper Kit',
      hebrewName: 'ערכת מינרלים ותמציות יונים למעקף מים',
      price: 79,
      shots: 1,
      milkType: 'NONE',
      imageUrl: '/images/minerals-kit.jpg',
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="relative p-6 md:p-8 rounded-3xl bg-neutral-950/80 backdrop-blur-2xl border border-purple-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
              <TestTube className="w-4 h-4" />
              <span>מחשב מעקף מים והזרקת יונים v6.0</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Mineral Bypass Engine
            </h1>
            <p className="text-neutral-400 max-w-xl text-sm md:text-base leading-relaxed">
              מהילת מים טהורים (RO Bypass) והזרקת יוני מגנזיום (Mg²⁺) וסידן (Ca²⁺) פוסט-חליטה לאיזון בהירות החומציות.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/30 font-mono text-center space-y-1">
            <div className="text-xs text-neutral-400">אחוז מעקף (Bypass):</div>
            <div className="text-3xl font-extrabold text-purple-400">{bypassPercent}%</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bypass Simulator */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-purple-400" />
              <span>ניטור מהילה ומאזן מינרלים פוסט-חליטה</span>
            </h2>
            <span className="text-xs font-mono text-purple-400 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30">
              נפח כוס כולל: {totalBeverageMl} ml
            </span>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 p-4 rounded-2xl bg-neutral-950/60 border border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">נפח מאי אספרסו (ml):</span>
                <span className="font-mono text-amber-400 font-bold">{espressoVolume} ml</span>
              </div>
              <input
                type="range"
                min={20}
                max={60}
                value={espressoVolume}
                onChange={(e) => setEspressoVolume(Number(e.target.value))}
                className="w-full accent-amber-500 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-neutral-950/60 border border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">מים מדוללים במעקף (Bypass ml):</span>
                <span className="font-mono text-cyan-400 font-bold">{bypassVolume} ml</span>
              </div>
              <input
                type="range"
                min={0}
                max={150}
                value={bypassVolume}
                onChange={(e) => setBypassVolume(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-neutral-950/60 border border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">מינון מגנזיום Mg²⁺ (ppm):</span>
                <span className="font-mono text-purple-400 font-bold">{magnesiumPpm} ppm</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={magnesiumPpm}
                onChange={(e) => setMagnesiumPpm(Number(e.target.value))}
                className="w-full accent-purple-400 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-neutral-950/60 border border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">מינון סידן Ca²⁺ (ppm):</span>
                <span className="font-mono text-emerald-400 font-bold">{calciumPpm} ppm</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                value={calciumPpm}
                onChange={(e) => setCalciumPpm(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Hardness output */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-1">
              <span className="text-neutral-400 block">קשיות כוללת (GH):</span>
              <span className="text-xl font-bold text-purple-400">{totalGhPpm} ppm CaCO3</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
              <span className="text-neutral-400 block">בופר בסיסי (KH):</span>
              <span className="text-xl font-bold text-emerald-400">{totalKhPpm} ppm CaCO3</span>
            </div>
          </div>
        </div>

        {/* Panel & Order */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span>המלצת אימוץ בריסטה</span>
            </h3>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 leading-relaxed space-y-2">
              <div className="font-bold text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> פרופיל טעם צפוי:
              </div>
              <p>
                הזרקת המגנזיום מעצימה מתיקות פירותית ומעדנת מרירות. המעקף המחושב יצר ספלים מאוזנים וצלולים במיוחד.
              </p>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-4 rounded-2xl bg-purple-500 hover:bg-purple-400 text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{addedToCart ? 'התווסף לסל!' : 'הזמן ערכת טפטפות מינרלים (₪79)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
