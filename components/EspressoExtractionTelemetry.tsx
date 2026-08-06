'use client';

import React, { useState } from 'react';
import type { ExtractionTelemetryResult } from '@/app/api/gemini/telemetry/route';

export default function EspressoExtractionTelemetry() {
  const [doseGrams, setDoseGrams] = useState(18.0);
  const [yieldGrams, setYieldGrams] = useState(36.0);
  const [shotTime, setShotTime] = useState(28);
  const [grindSetting, setGrindSetting] = useState(12);
  const [taste, setTaste] = useState<'UNDER_EXTRACTED_SOUR' | 'BALANCED_SWEET' | 'OVER_EXTRACTED_BITTER'>('BALANCED_SWEET');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractionTelemetryResult | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doseGrams,
          yieldGrams,
          shotTimeSeconds: shotTime,
          grindSetting,
          tasteFeedback: taste,
        }),
      });
      const json = await res.json().catch(() => ({ success: false }));
      if (json && json.success) {
        setResult(json.data);
      }
    } catch (err) {
      console.error('Telemetry error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full p-6 md:p-8 rounded-3xl bg-[#080606]/80 border border-amber-500/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(217,119,6,0.15)] text-white dir-rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 bg-amber-950/60 rounded-full border border-amber-500/30 mb-2">
            🔬 AI Espresso Extraction Telemetry
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            טלמטריה ואנליטיקת חליטה
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            חישוב מדויק של TDS%, אחוז מיצוי (Extraction Yield) וכיוונון מיקרו-קליקים במטחנה
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
          ⏱️
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Dose Input */}
        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <label className="text-xs text-neutral-400 mb-1 block">מינון קפה (Dose):</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.5"
              value={doseGrams}
              onChange={(e) => setDoseGrams(Number(e.target.value))}
              className="w-full bg-black/60 border border-neutral-700 rounded-lg p-2 text-amber-300 font-bold text-lg"
            />
            <span className="text-xs text-neutral-500">גרם</span>
          </div>
        </div>

        {/* Yield Input */}
        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <label className="text-xs text-neutral-400 mb-1 block">משקל חליטה (Yield):</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="1"
              value={yieldGrams}
              onChange={(e) => setYieldGrams(Number(e.target.value))}
              className="w-full bg-black/60 border border-neutral-700 rounded-lg p-2 text-amber-300 font-bold text-lg"
            />
            <span className="text-xs text-neutral-500">גרם</span>
          </div>
        </div>

        {/* Shot Time */}
        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <label className="text-xs text-neutral-400 mb-1 block">זמן חליטה (Time):</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={shotTime}
              onChange={(e) => setShotTime(Number(e.target.value))}
              className="w-full bg-black/60 border border-neutral-700 rounded-lg p-2 text-amber-300 font-bold text-lg"
            />
            <span className="text-xs text-neutral-500">שניות</span>
          </div>
        </div>

        {/* Grind Setting */}
        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <label className="text-xs text-neutral-400 mb-1 block">דרגת טחינה נוכחית:</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={grindSetting}
              onChange={(e) => setGrindSetting(Number(e.target.value))}
              className="w-full bg-black/60 border border-neutral-700 rounded-lg p-2 text-amber-300 font-bold text-lg"
            />
            <span className="text-xs text-neutral-500">קליק</span>
          </div>
        </div>
      </div>

      {/* Taste Feedback selector */}
      <div className="mb-6">
        <label className="text-xs text-neutral-300 mb-2 block font-medium">פרופיל טעם שהתקבל בכוס:</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setTaste('UNDER_EXTRACTED_SOUR')}
            className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
              taste === 'UNDER_EXTRACTED_SOUR'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
            }`}
          >
            🍋 חמוץ / תתי-חליטה (Under-extracted)
          </button>
          <button
            onClick={() => setTaste('BALANCED_SWEET')}
            className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
              taste === 'BALANCED_SWEET'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
            }`}
          >
            🍯 מתוק ומאוזן (Balanced Sweet)
          </button>
          <button
            onClick={() => setTaste('OVER_EXTRACTED_BITTER')}
            className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
              taste === 'OVER_EXTRACTED_BITTER'
                ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
            }`}
          >
            ☕ מריר / חליטת יתר (Over-extracted)
          </button>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-sm shadow-lg transition-all duration-300 disabled:opacity-50 mb-6"
      >
        {loading ? 'מחשב טלמטריה...' : 'חשב טלמטריה וכיוונון מטחנה ⚙️'}
      </button>

      {/* Results Telemetry Panel */}
      {result && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 via-neutral-900/90 to-black border border-amber-500/30">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 pb-4 border-b border-amber-500/20">
            <div>
              <span className="text-xs text-neutral-400">אחוז מוצקים מומסים (TDS):</span>
              <p className="text-xl font-bold text-amber-300">{result.tdsPercent}%</p>
            </div>
            <div>
              <span className="text-xs text-neutral-400">אחוז מיצוי (Yield):</span>
              <p className="text-xl font-bold text-amber-300">{result.extractionYieldPercent}%</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-xs text-neutral-400">כיוונון מטחנה מוצע:</span>
              <p className="text-sm font-bold text-orange-400">{result.recommendedGrindAdjustment}</p>
            </div>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">{result.baristaAdvice}</p>
        </div>
      )}
    </section>
  );
}
