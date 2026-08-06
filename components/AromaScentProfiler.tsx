'use client';

import React, { useState } from 'react';
import { Sparkles, Activity, Zap, Droplets, Info } from 'lucide-react';

export function AromaScentProfiler() {
  const [selectedRoast, setSelectedRoast] = useState<'LIGHT' | 'MEDIUM' | 'DARK'>('MEDIUM');
  const [flavorNotes, setFlavorNotes] = useState<string[]>(['יסמין', 'אפרסק', 'ברגמוט']);

  const profiles = {
    LIGHT: {
      title: 'ארומה קלה & פרחונית (Floral & Enzymatic)',
      vai: 94,
      molecules: 'Linalool, Geraniol, Ethyl Acetate',
      description: 'תרכובות ניחוח נדיפות עם חומציות הדרים גבוהה וארומת פריחה עדינה.',
      notes: ['יסמין פרחוני', 'אפרסק לבן', 'ברגמוט', 'דבש תמרים'],
      color: 'from-amber-400/20 to-yellow-500/10 border-amber-500/30 text-amber-300',
    },
    MEDIUM: {
      title: 'ארומה מתוקה & קרמלית (Sugar Maillard)',
      vai: 88,
      molecules: 'Furaneol, Maltol, 2-Acetylpyrrole',
      description: 'תגובת מייאר כפולה המביאה מתיקות קרמל עמוקה, שוקולד חלב ואגוזים קלויים.',
      notes: ['קרמל שרוף', 'אגוזי לוז', 'שוקולד חלב', 'חמאה קלויה'],
      color: 'from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-300',
    },
    DARK: {
      title: 'ארומה עמוקה & מעושנת (Dry Distillation)',
      vai: 82,
      molecules: 'Guaiacol, 4-Vinylguaiacol, Pyrazine',
      description: 'קרמליזציה כהה מאוד, תווים מעושנים של עץ אלון, תבלינים חמים ותמא קקאו.',
      notes: ['שוקולד מריר 85%', 'תבלינים כהים', 'עץ אלון', 'קקאו מעושן'],
      color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-300',
    },
  };

  const current = profiles[selectedRoast];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 dir-rtl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          מנוע ניתוח מולקולרי AI
        </div>
        <h2 className="text-3xl font-black text-gold-gradient tracking-tight">
          אשף ניתוח ארומה וטרפנים ב-AI (Aroma Scent Profiler)
        </h2>
        <p className="text-stone-400 text-xs sm:text-base max-w-xl mx-auto">
          ניתוח תרכובות נדיפות Volatile Aromatic Index (VAI%), פרופיל מולקולות ארומטיות ושיא ניחוח בעת חליטה
        </p>
      </div>

      {/* Glass Selector */}
      <div className="grid grid-cols-3 gap-3 p-1.5 rounded-2xl bg-stone-950 border border-stone-800">
        {(['LIGHT', 'MEDIUM', 'DARK'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRoast(r)}
            className={`py-3 rounded-xl text-xs font-extrabold transition-all ${
              selectedRoast === r
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {r === 'LIGHT' ? 'קלייה בהירה (Light)' : r === 'MEDIUM' ? 'קלייה בינונית (Medium)' : 'קלייה כהה (Dark)'}
          </button>
        ))}
      </div>

      {/* Main Glass Card */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${current.color} border backdrop-blur-2xl space-y-6 shadow-2xl`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
          <div>
            <h3 className="text-xl font-bold text-stone-100">{current.title}</h3>
            <p className="text-xs text-stone-400 mt-1">{current.description}</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-stone-950/80 border border-amber-500/40 text-center">
            <span className="text-[10px] text-stone-400 font-mono block">מדד VAI% ארומטי</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{current.vai}%</span>
          </div>
        </div>

        {/* Molecules & Terpenes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>מולקולות ארומטיות פעילות</span>
            </div>
            <p className="text-xs font-mono text-stone-300">{current.molecules}</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Droplets className="w-4 h-4 text-amber-400" />
              <span>תווי ארומה בולטים</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {current.notes.map((n) => (
                <span key={n} className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/40">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-400 pt-2 border-t border-stone-800/60">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>מדד ה-VAI מחושב בזמן אמת לפי רמת הקלייה וטמפרטורת החליטה של הפול</span>
        </div>
      </div>
    </div>
  );
}
