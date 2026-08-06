'use client';

import React, { useState } from 'react';
import type { SommelierPairingResult } from '@/app/api/gemini/sommelier/route';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

const PRESET_FOODS = [
  { id: 'croissant', label: '🥐 קרואסון שקדים חמאה', category: 'מאפים' },
  { id: 'brownie', label: '🍫 בראוניז שוקולד מריר 70%', category: 'קינוחים' },
  { id: 'lemon_tart', label: '🍋 טארט לימון פריזאי', category: 'קינוחים' },
  { id: 'avocado_toast', label: '🥑 טוסט אבוקדו וביצה עלומה', category: 'בראנץ׳' },
  { id: 'cheesecake', label: '🍰 עוגת גבינה ניו יורק', category: 'קינוחים' },
];

export default function CoffeeFoodSommelier() {
  const [selectedFood, setSelectedFood] = useState(PRESET_FOODS[0].label);
  const [customInput, setCustomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SommelierPairingResult | null>(null);

  const handlePairing = async (foodName: string) => {
    coffeeSound.playCoffeeSteam();
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodItem: foodName }),
      });
      const json = await res.json().catch(() => ({ success: false }));
      if (json && json.success) {
        setResult(json.data);
      }
    } catch (err) {
      console.error('Sommelier error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full p-6 md:p-8 rounded-3xl bg-[#080606]/80 border border-amber-500/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(217,119,6,0.15)] text-white dir-rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 bg-amber-950/60 rounded-full border border-amber-500/30 mb-2">
            🍷 AI Coffee & Food Sommelier
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            סומלייה קפה ומאפים
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            בחר את המאפה או הארוחה שלך, וה-AI יתאים לך את פול הקפה והחליטה המושלמים
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
          ✨
        </div>
      </div>

      {/* Preset Food Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRESET_FOODS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedFood(item.label);
              handlePairing(item.label);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
              selectedFood === item.label
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Custom Food Input */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="או הקלד מאפה / ארוחה מותאמת אישית..."
          className="flex-1 px-4 py-3 text-xs md:text-sm rounded-xl bg-black/60 border border-amber-500/20 text-amber-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
        />
        <button
          onClick={() => {
            if (customInput.trim()) {
              setSelectedFood(customInput);
              handlePairing(customInput);
            }
          }}
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs md:text-sm shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'מנתח...' : 'מצא התאמה ✨'}
        </button>
      </div>

      {/* Pairing Result Card */}
      {result && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-neutral-900/90 to-black border border-amber-500/30 backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-amber-500/20">
            <div>
              <span className="text-xs text-amber-400 font-medium">התאמת סומלייה מושלמת ({result.matchScore}%)</span>
              <h3 className="text-xl font-bold text-amber-100 mt-1">{result.recommendedCoffee}</h3>
              <p className="text-xs text-neutral-400">מקור: {result.origin}</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                קלייה: {result.roastLevel}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                חליטה: {result.brewMethod}
              </span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed mb-4">
            {result.pairingExplanation}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-400 font-bold">תווי טעם דומיננטיים:</span>
            <div className="flex flex-wrap gap-1.5">
              {result.flavorNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 text-[11px] rounded-full bg-neutral-800 text-amber-200 border border-amber-500/20"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
