'use client';

import React, { useState } from 'react';
import { Globe, CloudRain, Mountain, ShieldCheck, ShoppingBag, Sparkles, Sun, Compass } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

interface TerroirData {
  id: string;
  name: string;
  hebrewName: string;
  region: string;
  altitude: number; // masl
  rainfall: number; // mm/yr
  soilType: string;
  soilPh: number;
  shadePercent: number;
  flavorNotes: string[];
  price: number;
}

const origins: TerroirData[] = [
  {
    id: 'ethiopia-yirgacheffe',
    name: 'Ethiopia Yirgacheffe G1',
    hebrewName: 'אתיופיה ירגשף גרייד 1',
    region: 'Gedeo Zone, Southern Ethiopia',
    altitude: 2100,
    rainfall: 1850,
    soilType: 'אדמת חימר געשית עשירה לטרייט',
    soilPh: 5.8,
    shadePercent: 85,
    flavorNotes: ['פרחי יסמין', 'למונגראס', 'אפרסק לבן'],
    price: 92,
  },
  {
    id: 'panama-geisha-boquete',
    name: 'Panama Boquete Geisha',
    hebrewName: 'פנמה בוקטה גיישה',
    region: 'Chiriquí Province, Volcán Barú',
    altitude: 1950,
    rainfall: 2400,
    soilType: 'אפר געשי אנדוסול נקבוב',
    soilPh: 6.1,
    shadePercent: 90,
    flavorNotes: ['ברגמוט', 'דבש הדרים', 'מי ורדים'],
    price: 145,
  },
  {
    id: 'colombia-huila-pink',
    name: 'Colombia Huila Pink Bourbon',
    hebrewName: 'קולומביה ווילה פינק בורבון',
    region: 'San Adolfo, Huila',
    altitude: 1800,
    rainfall: 1600,
    soilType: 'סלע געשי עשיר באשלגן',
    soilPh: 5.9,
    shadePercent: 75,
    flavorNotes: ['פסיפלורה', 'שזיף אדום', 'סוכר חום'],
    price: 86,
  },
];

export default function TerroirClimateRadar() {
  const { addItem } = useCartStore();
  const [selectedOrigin, setSelectedOrigin] = useState<TerroirData>(origins[0]);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  const handleAddToCart = () => {
    addItem({
      coffeeItemId: selectedOrigin.id,
      name: selectedOrigin.name,
      hebrewName: selectedOrigin.hebrewName,
      price: selectedOrigin.price,
      shots: 2,
      milkType: 'NONE',
      imageUrl: '/images/origin-beans.jpg',
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="relative p-6 md:p-8 rounded-3xl bg-neutral-950/80 backdrop-blur-2xl border border-emerald-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Globe className="w-4 h-4" />
              <span>ראדאר טרואר ואקלים גידול v6.0</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Terroir & Climate Radar
            </h1>
            <p className="text-neutral-400 max-w-xl text-sm md:text-base leading-relaxed">
              ניתוח אקלים גיאוגרפי, גובה טופוגרפי (MASL), הרכב קרקע וולקנית וסנכרון סחר ישיר (Direct Trade) מחוות הקפה.
            </p>
          </div>

          {/* Select origin */}
          <div className="flex flex-wrap gap-2">
            {origins.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedOrigin(o)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedOrigin.id === o.id
                    ? 'bg-emerald-500 text-neutral-950 shadow-md'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-white/10'
                }`}
              >
                {o.hebrewName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Origin Climate Radar View */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedOrigin.hebrewName}</h2>
              <span className="text-xs text-neutral-400 font-mono">{selectedOrigin.region}</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
              100% Direct Trade Verified
            </span>
          </div>

          {/* Climate Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs">
                <Mountain className="w-4 h-4" /> גובה (MASL)
              </div>
              <div className="text-xl font-extrabold text-white font-mono">{selectedOrigin.altitude}m</div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs">
                <CloudRain className="w-4 h-4" /> משקעים
              </div>
              <div className="text-xl font-extrabold text-white font-mono">{selectedOrigin.rainfall}mm/yr</div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs">
                <Sun className="w-4 h-4" /> גידול בצל
              </div>
              <div className="text-xl font-extrabold text-white font-mono">{selectedOrigin.shadePercent}%</div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 text-xs">
                <Compass className="w-4 h-4" /> חומציות קרקע
              </div>
              <div className="text-xl font-extrabold text-white font-mono">pH {selectedOrigin.soilPh}</div>
            </div>
          </div>

          {/* Terroir Notes */}
          <div className="p-5 rounded-2xl bg-neutral-950 border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>תווי טעם מאפיינים לטרואר זה:</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedOrigin.flavorNotes.map((note, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  {note}
                </span>
              ))}
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed pt-2">
              סוג הקרקע: <span className="text-neutral-200 font-semibold">{selectedOrigin.soilType}</span>. שילוב הגובה והלחות מעניקים לפולים ארומטיות פרחונית וגוף משיל.
            </p>
          </div>
        </div>

        {/* Purchase Card */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>הזמנת זן מיקרו-לוט</span>
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed space-y-1">
              <div className="font-bold text-emerald-400">תשלום הוגן לחקלאי (Fair Trade):</div>
              <p>+320% מעל מחיר השוק העולמי (C-Market Price) לביטחון החוואי.</p>
            </div>

            <div className="text-center py-4">
              <span className="text-xs text-neutral-400 block">מחיר מארז 250 גרם:</span>
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">₪{selectedOrigin.price}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{addedToCart ? 'התווסף לסל!' : `הזמן מיקרו-לוט זה (₪${selectedOrigin.price})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
