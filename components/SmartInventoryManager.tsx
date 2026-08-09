'use client';

import React, { useState } from 'react';
import { Package, MessageCircle, AlertTriangle, Sparkles, Plus, Minus, Calendar, ShoppingBag } from 'lucide-react';

export default function SmartInventoryManager() {
  const [dailyCups, setDailyCups] = useState(2);
  const [bagsInStock, setBagsInStock] = useState(1);
  const [selectedBlend, setSelectedBlend] = useState('Midnight Espresso (100% Arabica)');
  const gramsPerBag = 250;
  const gramsPerCup = 18;

  const totalGrams = bagsInStock * gramsPerBag;
  const totalCupsRemaining = Math.floor(totalGrams / gramsPerCup);
  const daysRemaining = Math.max(1, Math.floor(totalCupsRemaining / dailyCups));

  const isLowStock = daysRemaining <= 3;

  const generateWhatsAppLink = () => {
    const msg = encodeURIComponent(
      `היי digital roast! ☕\nנותרו לי עוד ${daysRemaining} ימי קפה במלאי הביתי עבור תערובת: *${selectedBlend}*.\nאשמח להזמין חידוש מלאי אוטומטי של 2 שקיות טריות (500 גרם סה"כ)!`
    );
    return `https://wa.me/972500000000?text=${msg}`;
  };

  return (
    <section className="relative w-full p-6 md:p-8 rounded-3xl bg-[#080606]/80 border border-amber-500/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(217,119,6,0.15)] text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 bg-amber-950/60 rounded-full border border-amber-500/30 mb-2">
            <Package className="w-3.5 h-3.5" />
            AI Smart Inventory Replenisher v3.5
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            ניהול מלאי קפה חכם וחידוש אוטומטי
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            מעקב אוטומטי אחר צריכת הקפה הביתית, חיזוי ימי מלאי וחידוש מהיר ב-WhatsApp.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
          📦
        </div>
      </div>

      {/* Blend Selection Dropdown */}
      <div className="mb-6 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <label className="text-xs text-neutral-300 font-bold flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>תערובת הקפה הנוכחית בבית:</span>
        </label>
        <select
          value={selectedBlend}
          onChange={(e) => setSelectedBlend(e.target.value)}
          className="bg-neutral-950 text-amber-300 border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer w-full sm:w-auto"
        >
          <option value="Midnight Espresso (100% Arabica)">Midnight Espresso (100% Arabica)</option>
          <option value="Honey Oak Cortado Blend">Honey Oak Cortado Blend</option>
          <option value="Ethiopia Yirgacheffe Single Origin">Ethiopia Yirgacheffe Single Origin</option>
          <option value="Colombia Huila Pink Bourbon">Colombia Huila Pink Bourbon</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Days Left Card */}
        <div
          className={`p-6 rounded-2xl border backdrop-blur-xl flex flex-col justify-between ${
            isLowStock
              ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
              : 'bg-amber-950/20 border-amber-500/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
            <span>נותרו עוד</span>
            {isLowStock && (
              <span className="flex items-center gap-1 text-rose-400 font-bold animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> מלאי נמוך!
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className={`text-4xl font-extrabold ${isLowStock ? 'text-rose-400' : 'text-amber-400'}`}>
              {daysRemaining}
            </span>
            <span className="text-sm font-semibold text-neutral-300">ימים לקפה במלאי</span>
          </div>
          <span className="text-xs text-neutral-400">({totalCupsRemaining} כוסות קפה מבוססות 18g)</span>
        </div>

        {/* Daily Cups Slider */}
        <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
          <label className="text-xs text-neutral-300 font-medium mb-2 flex justify-between">
            <span>כוסות קפה ביום:</span>
            <span className="text-amber-400 font-bold font-mono">{dailyCups} כוסות</span>
          </label>
          <input
            type="range"
            min="1"
            max="6"
            value={dailyCups}
            onChange={(e) => setDailyCups(Number(e.target.value))}
            className="w-full accent-amber-500 bg-neutral-800 rounded-lg cursor-pointer"
          />
          <span className="text-[11px] text-neutral-500 mt-2">18g פולים לכל כוס אספרסו</span>
        </div>

        {/* Bags in Stock Controller */}
        <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
          <span className="text-xs text-neutral-300 font-medium mb-2">שקיות במלאי (250g):</span>
          <div className="flex items-center justify-between my-1">
            <button
              onClick={() => setBagsInStock(Math.max(1, bagsInStock - 1))}
              className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center border border-neutral-700"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl font-bold text-amber-400 font-mono">{bagsInStock} שקיות</span>
            <button
              onClick={() => setBagsInStock(bagsInStock + 1)}
              className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center border border-neutral-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[11px] text-neutral-500">סך הכל משקל: {totalGrams}g</span>
        </div>
      </div>

      {/* WhatsApp Replenish Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-200">חידוש מלאי מהיר ב-WhatsApp</h4>
            <p className="text-xs text-emerald-400/80">שליחת הודעת תזכורת אוטומטית לקלייה והזמנה בקליק אחד</p>
          </div>
        </div>

        <a
          href={generateWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold text-xs md:text-sm text-center shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>חידוש מלאי בוואטסאפ</span>
          <span>🚀</span>
        </a>
      </div>
    </section>
  );
}

