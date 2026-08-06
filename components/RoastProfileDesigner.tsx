'use client';

import React, { useState } from 'react';
import { Sliders, Flame, Activity, Zap, Play, RotateCcw, Clock } from 'lucide-react';

export function RoastProfileDesigner() {
  const [chargeTemp, setChargeTemp] = useState(200);
  const [firstCrackTime, setFirstCrackTime] = useState('8:45');
  const [targetRoast, setTargetRoast] = useState<'CITY' | 'FULL_CITY' | 'FRENCH'>('FULL_CITY');
  const [isSimulating, setIsSimulating] = useState(false);

  const profiles = {
    CITY: {
      name: 'City Roast (קלייה בהירה גורמה)',
      temp: '205°C',
      ror: '12°C/min',
      development: '14%',
      flavor: 'חומציות פירותית גבוהה, תווים פרחוניים וגוף קל',
      color: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    },
    FULL_CITY: {
      name: 'Full City Roast (קלייה בינונית-כהה)',
      temp: '225°C',
      ror: '8°C/min',
      development: '19%',
      flavor: 'מתיקות קרמל עמוקה, קקאו כהה וגוף מלא ומאוזן',
      color: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
    },
    FRENCH: {
      name: 'French Roast (קלייה כהה איטלקית)',
      temp: '240°C',
      ror: '4°C/min',
      development: '24%',
      flavor: 'גוף כבד ומעושן, שוקולד מריר עז וקרמה סמיכה',
      color: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
    },
  };

  const current = profiles[targetRoast];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 dir-rtl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-semibold">
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          מעבדת קלייה מתקדמת
        </div>
        <h2 className="text-3xl font-black text-gold-gradient tracking-tight">
          מעבדת גרף קלייה אינטראקטיבית (Roast Profile Designer)
        </h2>
        <p className="text-stone-400 text-xs sm:text-base max-w-xl mx-auto">
          תכנון וניטור דינמי של קו קלייה (RoR Curve), טמפרטורת Charge Temp, First Crack וזמן Development Time
        </p>
      </div>

      {/* Simulator Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-3xl bg-[#0a0808]/95 border border-amber-500/40 shadow-2xl backdrop-blur-2xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-300 flex justify-between">
            <span>טמפרטורת כניסה (Charge Temp)</span>
            <span className="text-amber-400 font-mono">{chargeTemp}°C</span>
          </label>
          <input
            type="range"
            min="180"
            max="230"
            value={chargeTemp}
            onChange={(e) => setChargeTemp(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-300 block">זמן פיצוץ ראשון (First Crack)</label>
          <div className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-amber-300 text-center">
            {firstCrackTime} min
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-300 block">דרגת קלייה יעד</label>
          <select
            value={targetRoast}
            onChange={(e: any) => setTargetRoast(e.target.value)}
            className="w-full py-2 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="CITY">City Roast (בהירה)</option>
            <option value="FULL_CITY">Full City Roast (בינונית-כהה)</option>
            <option value="FRENCH">French Roast (כהה)</option>
          </select>
        </div>
      </div>

      {/* Live Curve Profile Card */}
      <div className={`p-6 rounded-3xl ${current.color} border backdrop-blur-2xl space-y-4 shadow-xl`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-stone-100">{current.name}</h3>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-md"
          >
            {isSimulating ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'עצור סימולציה' : 'הפעל סימולציית RoR'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 text-center">
            <span className="text-[10px] text-stone-400 block">טמפרטורה מירבית</span>
            <span className="text-lg font-black text-amber-400 font-mono">{current.temp}</span>
          </div>
          <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 text-center">
            <span className="text-[10px] text-stone-400 block">קצב עלייה (RoR)</span>
            <span className="text-lg font-black text-cyan-400 font-mono">{current.ror}</span>
          </div>
          <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 text-center">
            <span className="text-[10px] text-stone-400 block">יחס פיתוח (Dev Ratio)</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{current.development}</span>
          </div>
          <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 text-center">
            <span className="text-[10px] text-stone-400 block">מצב קלייה</span>
            <span className="text-xs font-bold text-amber-300 mt-1 block">
              {isSimulating ? 'קלייה בפועל 🔥' : 'מוכן לקלייה'}
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-300 pt-2 border-t border-stone-800/60">
          <strong>פרופיל טעם צפוי:</strong> {current.flavor}
        </p>
      </div>
    </div>
  );
}
