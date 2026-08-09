'use client';

import React, { useState } from 'react';
import { syncBrewRecipeToWorkspace } from '@/app/actions/notebookAction';
import { BrewMethod } from '@/lib/schemas/notebookSchema';

export default function NotebookLMBrewSync() {
  const [recipeTitle, setRecipeTitle] = useState('V60 Honey Process Geisha');
  const [method, setMethod] = useState<BrewMethod>('V60');
  const [coffeeGrams, setCoffeeGrams] = useState(15);
  const [waterGrams, setWaterGrams] = useState(250);
  const [waterTempC, setWaterTempC] = useState(93);
  const [grindSize, setGrindSize] = useState('בינונית-דקה (EK43 #6.5)');
  const [notes, setNotes] = useState('חליטה ב-3 פעימות: 50g Bloom למשך 45 שניות');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string; eventUrl?: string } | null>(null);

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await syncBrewRecipeToWorkspace({
      recipeTitle,
      method,
      coffeeGrams,
      waterGrams,
      waterTempC,
      grindSize,
      flavorNotes: ['יסמין', 'דבש בר', 'אפרסק שקוף'],
      targetDocName: 'V60_Master_Recipes',
      notes,
    });

    setLoading(false);
    setStatus({ success: res.success, message: res.message, eventUrl: res.calendarEventUrl });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-6 rounded-2xl bg-[#080604]/85 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_35px_rgba(6,182,212,0.15)] transform-gpu transition-all duration-300">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_#06b6d4]" />
          <h2 className="text-xl font-bold text-cyan-100 font-sans tracking-tight">
            סנכרון מתכוני חליטה ל-Google Workspace <span className="text-xs text-amber-400 font-mono">(NotebookLM MCP)</span>
          </h2>
        </div>
      </div>

      <form onSubmit={handleSync} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-stone-300 mb-1">שם המתכון</label>
            <input
              type="text"
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-stone-300 mb-1">שיטת חליטה</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as BrewMethod)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="V60">V60 Pour Over</option>
              <option value="AEROPRESS">Aeropress</option>
              <option value="ESPRESSO">Espresso Extraction</option>
              <option value="CHEMEX">Chemex</option>
              <option value="COLD_BREW">Cold Brew Nitro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-stone-300 mb-1">קפה (גרם): {coffeeGrams}g</label>
            <input
              type="range"
              min="5"
              max="60"
              value={coffeeGrams}
              onChange={(e) => setCoffeeGrams(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-stone-300 mb-1">מים (מ״ל): {waterGrams}ml (יחס 1:{(waterGrams / coffeeGrams).toFixed(1)})</label>
            <input
              type="range"
              min="50"
              max="1000"
              step="10"
              value={waterGrams}
              onChange={(e) => setWaterGrams(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-stone-300 mb-1">הערות חליטה ופרופיל קלייה</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-black bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform-gpu active:scale-98 disabled:opacity-50"
        >
          {loading ? 'מסנכרן ל-NotebookLM Workspace...' : '🚀 סנכרן מתכון ל-Google Workspace / Docs'}
        </button>
      </form>

      {status && (
        <div className={`mt-4 p-4 rounded-xl border text-xs font-mono ${status.success ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' : 'bg-red-950/60 border-red-500/40 text-red-200'}`}>
          <p>{status.message}</p>
          {status.eventUrl && (
            <a href={status.eventUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-amber-300 underline font-bold">
              📅 קבע סדנת חליטה ב-Google Calendar
            </a>
          )}
        </div>
      )}
    </div>
  );
}
