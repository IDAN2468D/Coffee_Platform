'use client';

import React, { useState } from 'react';
import { TestTube, Sparkles, Beaker, Zap, Check, RotateCcw, Droplet, ShieldAlert } from 'lucide-react';

interface MineralPreset {
  name: string;
  gh: number;
  kh: number;
  calcium: number;
  magnesium: number;
  description: string;
}

export function WaterChemistryProfiler() {
  const presets: MineralPreset[] = [
    {
      name: 'תקן SCA Gold Cup Target',
      gh: 68,
      kh: 40,
      calcium: 45,
      magnesium: 23,
      description: 'תקן המים הרשמי של ארגון הקפה העולמי לחליטה מאוזנת ונקייה.'
    },
    {
      name: 'פרופיל Lotus - הדגשת חומציות ופרחים',
      gh: 50,
      kh: 25,
      calcium: 35,
      magnesium: 15,
      description: 'רמת באפר נמוכה המאפשרת לחומציות ההדרים והפרחים של קפה אתיופי לזרוח.'
    },
    {
      name: 'פרופיל Lotus - הדגשת גוף ומתיקות',
      gh: 90,
      kh: 55,
      calcium: 60,
      magnesium: 30,
      description: 'קשיות גבוהה יותר המעצימה גוף קרמי ומתיקות שוקולדית בקלייה בינונית-כהה.'
    }
  ];

  const [gh, setGh] = useState(68);
  const [kh, setKh] = useState(40);
  const [calcium, setCalcium] = useState(45);
  const [magnesium, setMagnesium] = useState(23);

  const applyPreset = (p: MineralPreset) => {
    setGh(p.gh);
    setKh(p.kh);
    setCalcium(p.calcium);
    setMagnesium(p.magnesium);
  };

  const calculateECI = () => {
    const ratio = (gh / (kh || 1)).toFixed(2);
    let status = 'מאוזן אידיאלי';
    let color = 'text-emerald-400';

    if (parseFloat(ratio) > 2.2) {
      status = 'חומציות חריפה / באפר נמוך';
      color = 'text-amber-400';
    } else if (parseFloat(ratio) < 1.2) {
      status = 'קפה שטוח / באפר גבוה מדי';
      color = 'text-rose-400';
    }

    const calciumDropsPerLiter = Math.round(calcium / 10);
    const mgDropsPerLiter = Math.round(magnesium / 8);
    const bicarbDropsPerLiter = Math.round(kh / 10);

    return { ratio, status, color, calciumDropsPerLiter, mgDropsPerLiter, bicarbDropsPerLiter };
  };

  const eci = calculateECI();

  return (
    <div className="w-full liquid-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden my-8">
      {/* Title */}
      <div className="mb-8 border-b border-stone-800/80 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TestTube className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold mb-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              SCA Water Quality & Chemistry Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
              מחשב כימיית מים <span className="text-emerald-glow">& מתכוני אלקטרוליטים</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(p)}
            className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-emerald-500/50 text-right transition-all group"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                {p.name}
              </span>
              <Beaker className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-400" />
            </div>
            <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed">
              {p.description}
            </p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders */}
        <div className="space-y-5 bg-stone-950/60 p-6 rounded-2xl border border-stone-800">
          <h3 className="text-sm font-bold text-amber-400 border-b border-stone-800 pb-2">
            פרמטרים מינרליים (PPM CaCO3)
          </h3>

          <div>
            <div className="flex justify-between text-xs text-stone-300 mb-1">
              <span>קשיות כללית (GH - General Hardness):</span>
              <span className="font-bold text-emerald-400 font-mono">{gh} ppm</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              value={gh}
              onChange={e => setGh(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-stone-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300 mb-1">
              <span>בסיסיות / באפר (KH - Alkalinity):</span>
              <span className="font-bold text-amber-400 font-mono">{kh} ppm</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={kh}
              onChange={e => setKh(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-stone-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300 mb-1">
              <span>סידן (Calcium Ca²⁺):</span>
              <span className="font-bold text-cyan-400 font-mono">{calcium} ppm</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={calcium}
              onChange={e => setCalcium(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-stone-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300 mb-1">
              <span>מגנזיום (Magnesium Mg²⁺):</span>
              <span className="font-bold text-purple-400 font-mono">{magnesium} ppm</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={magnesium}
              onChange={e => setMagnesium(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-stone-900"
            />
          </div>
        </div>

        {/* Results */}
        <div className="liquid-glass-card rounded-2xl p-6 border border-stone-800/80 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 border-b border-stone-800 pb-2">
              פלט אנליזת מים & מתכון טיפות לליטר
            </h3>

            <div className="p-4 rounded-xl bg-stone-950/90 border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">יחס GH/KH Extraction Index:</span>
                <span className="font-bold text-stone-100 font-mono">{eci.ratio}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">איפיון פרופיל המים:</span>
                <span className={`font-extrabold ${eci.color}`}>{eci.status}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-300 block">
                מתכון טיפות Lotus Water ל-1 ליטר מים מזוקקים (RO):
              </span>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block mb-1">Calcium</span>
                  <span className="font-bold text-cyan-300 font-mono text-sm">{eci.calciumDropsPerLiter} טיפות</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block mb-1">Magnesium</span>
                  <span className="font-bold text-purple-300 font-mono text-sm">{eci.mgDropsPerLiter} טיפות</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block mb-1">Bicarbonate</span>
                  <span className="font-bold text-amber-300 font-mono text-sm">{eci.bicarbDropsPerLiter} טיפות</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 italic bg-stone-950/40 p-3 rounded-xl border border-stone-800/50">
            💡 טיפ מקצועי: מגנזיום מעצים טעמים פירותיים ופרחוניים, בעוד סידן מעצים גוף ומתיקות.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WaterChemistryProfiler;
