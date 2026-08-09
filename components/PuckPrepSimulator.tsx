'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Flame, RefreshCw, Sparkles, Layers } from 'lucide-react';

export default function PuckPrepSimulator() {
  const [wdtPasses, setWdtPasses] = useState<number>(4);
  const [levelingAngle, setLevelingAngle] = useState<number>(0); // degrees tilt
  const [tampingPressureKg, setTampingPressureKg] = useState<number>(15);

  // Channeling Risk Calculation
  // Optimal: WDT >= 3, tilt == 0, tamping 12-18kg
  const tiltPenalty = Math.abs(levelingAngle) * 12;
  const wdtBonus = Math.min(30, wdtPasses * 8);
  const tampingPenalty = Math.abs(tampingPressureKg - 15) * 2.5;

  const channelingIndex = Math.max(2, Math.min(98, Math.round(50 - wdtBonus + tiltPenalty + tampingPenalty)));

  const getChannelingSeverity = () => {
    if (channelingIndex < 15) return { text: 'מושלם - מיצוי אחיד ללא Channeling', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (channelingIndex < 40) return { text: 'טוב מאוד - סיכון נמוך לפריצת מים', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
    if (channelingIndex < 70) return { text: 'בינוני - תיעול חלקי (Channeling בינוני)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { text: 'קריטי - תיעול כבד ומיצוי יתר מריר', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
  };

  const status = getChannelingSeverity();

  return (
    <div dir="rtl" className="w-full max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
          <Layers className="w-4 h-4" />
          <span>Spatial Portafilter Physics & Dynamics</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          סימולטור 3D להכנת פאק אספרסו ודיחוס WDT
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          כוון את טכניקת פיזור המחטים (WDT), זווית הדיחוס ועוצמת הלחץ למניעת תיעול מים (Channeling) והבטחת מיצוי אחיד.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive Controls */}
        <div className="lg:col-span-6 space-y-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            שלבי הכנת הפאק בידית (Puck Preparation)
          </h2>

          {/* WDT Needle Passes */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300">
              <span>מספר סיבובי מחטי WDT (פיזור גושים):</span>
              <span className="font-bold text-cyan-400">{wdtPasses} סיבובים</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={wdtPasses}
              onChange={(e) => setWdtPasses(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Puck Tilt Angle */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300">
              <span>זווית הטיית הטמפר (Leveling Tilt Angle):</span>
              <span className={`font-bold ${levelingAngle === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {levelingAngle}° {levelingAngle === 0 ? '(ישר לחלוטין)' : ''}
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={levelingAngle}
              onChange={(e) => setLevelingAngle(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Tamping Force */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300">
              <span>עוצמת דחיסה (Tamping Pressure):</span>
              <span className="font-bold text-purple-400">{tampingPressureKg} ק״ג</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={tampingPressureKg}
              onChange={(e) => setTampingPressureKg(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <button
            onClick={() => {
              setWdtPasses(4);
              setLevelingAngle(0);
              setTampingPressureKg(15);
            }}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            איפוס לערכי זהב אופטימליים
          </button>
        </div>

        {/* Heatmap & Result */}
        <div className="lg:col-span-6 space-y-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">מדד תיעול מים צפוי</span>
              <h3 className="text-2xl font-bold text-white mt-0.5">Channeling Index</h3>
            </div>
            <div className="text-left bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-xl">
              <div className="text-2xl font-black text-cyan-400">{channelingIndex}%</div>
              <div className="text-[10px] text-gray-400">סיכון לתיעול</div>
            </div>
          </div>

          {/* Portafilter Heatmap Visual Simulation */}
          <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-amber-900/60 bg-stone-900 p-3 shadow-inner flex items-center justify-center overflow-hidden">
            <div
              className={`w-full h-full rounded-full transition-all duration-500 flex items-center justify-center text-center p-4 ${
                channelingIndex < 20
                  ? 'bg-gradient-to-tr from-amber-700 via-amber-800 to-amber-900 opacity-90'
                  : 'bg-gradient-to-tr from-rose-900 via-amber-800 to-stone-900'
              }`}
              style={{
                transform: `rotate(${levelingAngle * 5}deg)`,
              }}
            >
              {/* Channeling Hotspot Indicators */}
              {channelingIndex > 30 && (
                <div
                  className="absolute w-10 h-10 rounded-full bg-rose-500/80 blur-md animate-pulse"
                  style={{
                    top: `${40 + levelingAngle * 6}%`,
                    left: `${50 + levelingAngle * 4}%`,
                  }}
                />
              )}
              <span className="relative z-10 text-[11px] font-bold text-amber-200/80 uppercase">
                פני שטח הפאק
              </span>
            </div>
          </div>

          {/* Status Alert Box */}
          <div className={`p-4 rounded-xl border ${status.bg} ${status.color} text-xs leading-relaxed space-y-1`}>
            <div className="font-bold flex items-center gap-1.5 text-sm">
              <ShieldAlert className="w-4 h-4" />
              אבחון טכניקת הדחיסה:
            </div>
            <p>{status.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
