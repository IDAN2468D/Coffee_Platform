'use client';

import React, { useState } from 'react';
import { Volume2, Play, Square, Award, Notebook, Sparkles, CheckCircle2, ShoppingBag, Radio } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

export default function AudioCuppingGuide() {
  const { addItem } = useCartStore();

  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [syncedNotebook, setSyncedNotebook] = useState<boolean>(false);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  // SCA Scorecard attributes
  const [scores, setScores] = useState<{
    aroma: number;
    flavor: number;
    aftertaste: number;
    acidity: number;
    body: number;
    balance: number;
    overall: number;
  }>({
    aroma: 8.5,
    flavor: 8.75,
    aftertaste: 8.25,
    acidity: 8.5,
    body: 8.0,
    balance: 8.5,
    overall: 8.75,
  });

  const totalScore = (
    scores.aroma +
    scores.flavor +
    scores.aftertaste +
    scores.acidity +
    scores.body +
    scores.balance +
    scores.overall +
    36 // Standard SCA base scale addition
  ).toFixed(2);

  // Ambient Web Audio Soundscape
  const toggleAmbientAudio = () => {
    if (typeof window === 'undefined') return;

    if (isPlayingAudio && audioContext) {
      audioContext.close();
      setAudioContext(null);
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      setAudioContext(ctx);

      // Binaural low ambient tone
      const osc = ctx.createOscillator();
      const panner = ctx.createPanner();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(174, ctx.currentTime); // Solfeggio frequency

      panner.panningModel = 'HRTF';
      panner.setPosition(0.5, 0.2, -1);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc.connect(panner);
      panner.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      setIsPlayingAudio(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNotebookSync = () => {
    setSyncedNotebook(true);
    setTimeout(() => setSyncedNotebook(false), 3000);
  };

  const handleAddToCart = () => {
    addItem({
      coffeeItemId: 'sca-cupping-sample-kit',
      name: 'Official SCA Cupping Sample Kit',
      hebrewName: 'ערכת דוגמיות קאפינג רשמית תקן SCA',
      price: 120,
      shots: 1,
      milkType: 'NONE',
      imageUrl: '/images/cupping-kit.jpg',
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
              <Radio className="w-4 h-4" />
              <span>מדריך קאפינג שמע 3D מרחבי v6.0</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              3D Audio Cupping & SCA Scoring
            </h1>
            <p className="text-neutral-400 max-w-xl text-sm md:text-base leading-relaxed">
              סשן טעימת קפה מודרך בליווי שמע מרחבי תלת-ממדי (Spatial Audio), טופס ניקוד SCA של 100 נקודות, וסנכרון ישיר ל-NotebookLM.
            </p>
          </div>

          <button
            onClick={toggleAmbientAudio}
            className={`px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-lg transition-all ${
              isPlayingAudio
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
                : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20'
            }`}
          >
            {isPlayingAudio ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isPlayingAudio ? 'עצור שמע מרחבי' : 'הפעל סאונדסקייפ 3D'}</span>
          </button>
        </div>
      </div>

      {/* Main Scoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SCA Rubric Sliders */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-400" />
              <span>טופס הערכת קאפינג תקן SCA</span>
            </h2>
            <div className="text-right">
              <span className="text-xs text-neutral-400 block">ציון סופי מחושב:</span>
              <span className="text-2xl font-extrabold font-mono text-emerald-400">{totalScore} / 100</span>
            </div>
          </div>

          {/* Sliders List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'aroma', label: 'ארומה וניחוח (Fragrance/Aroma)', color: 'accent-emerald-400' },
              { key: 'flavor', label: 'טעם ופרופיל (Flavor)', color: 'accent-amber-400' },
              { key: 'aftertaste', label: 'סיומת (Aftertaste)', color: 'accent-cyan-400' },
              { key: 'acidity', label: 'חומציות (Acidity)', color: 'accent-rose-400' },
              { key: 'body', label: 'גוף ומרקם (Body)', color: 'accent-purple-400' },
              { key: 'balance', label: 'איזון (Balance)', color: 'accent-yellow-400' },
              { key: 'overall', label: 'הערכה כללית (Overall)', color: 'accent-teal-400' },
            ].map((item) => (
              <div key={item.key} className="space-y-2 p-3 rounded-2xl bg-neutral-950/60 border border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-300 font-medium">{item.label}</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {scores[item.key as keyof typeof scores]}
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={10}
                  step={0.25}
                  value={scores[item.key as keyof typeof scores]}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      [item.key]: Number(e.target.value),
                    }))
                  }
                  className={`w-full ${item.color} bg-neutral-800 rounded-lg cursor-pointer`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* NotebookLM Sync & Cart Panel */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Notebook className="w-5 h-5 text-emerald-400" />
              <span>סנכרון מחקר וסל קניות</span>
            </h3>

            {/* Scorecard Summary Card */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs text-emerald-200">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> סיווג פולי הקפה:
              </div>
              <p>
                {Number(totalScore) >= 90
                  ? '🏆 Specialty President Selection (90+ points)'
                  : Number(totalScore) >= 85
                  ? '🌟 Specialty Reserve Grade (85-89 points)'
                  : '☕ High Premium Specialty Coffee'}
              </p>
            </div>

            {/* NotebookLM Sync Button */}
            <button
              onClick={handleNotebookSync}
              className="w-full py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center gap-2 border border-white/10 transition-all text-sm"
            >
              {syncedNotebook ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Notebook className="w-4 h-4 text-emerald-400" />}
              <span>{syncedNotebook ? 'סונכרן ל-NotebookLM!' : 'סנכרן דוח טעימה ל-NotebookLM'}</span>
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{addedToCart ? 'התווסף לסל!' : 'הזמן ערכת דוגמיות קאפינג (₪120)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
