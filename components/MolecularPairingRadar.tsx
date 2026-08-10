'use client';

import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  Thermometer,
  Clock,
  Droplets,
  Utensils,
  ChevronLeft,
  Info,
  Layers,
  Activity,
  Award,
  Share2,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export interface VolatileEster {
  compound: string;
  chemicalFormula: string;
  aromaNotes: string;
  hebrewNotes: string;
  intensity: number; // 0-100
  foodAffinity: string[];
}

export interface PastryPairing {
  id: string;
  name: string;
  hebrewName: string;
  pastryChef: string;
  resonanceScore: number; // 0-100%
  keyCompounds: string[];
  tasteSensory: string;
  imageUrl: string;
}

const ESTERS: VolatileEster[] = [
  {
    compound: 'Ethyl Butyrate & Isoamyl Acetate',
    chemicalFormula: 'C₆H₁₂O₂ / C₇H₁₄O₂',
    aromaNotes: 'Tropical Mango, Passionfruit & Ripe Banana',
    hebrewNotes: 'מנגו טרופי, פסיפלורה ובננה בשלה',
    intensity: 94,
    foodAffinity: ['קרם ברולה וניל מדגסקר', 'טארטלט פסיפלורה ויוזו', 'קרואסון חמאה שקדים'],
  },
  {
    compound: 'Linalool & Jasmine Lactone',
    chemicalFormula: 'C₁₀H₁₈O / C₁₀H₁₆O₂',
    aromaNotes: 'Floral Jasmine, Elderflower & Citrus Blossom',
    hebrewNotes: 'פרחי יסמין, פריחת הדרים ופרחי סמבוק',
    intensity: 88,
    foodAffinity: ['פיננסייר שקדים ודבש בר', 'אקלייר פטל ומי ורדים', 'מקרון לימון ולבנדר'],
  },
  {
    compound: 'Bergamotene & Citral',
    chemicalFormula: 'C₁₅H₂₄ / C₁₀H₁₆O',
    aromaNotes: 'Distilled Bergamot, Earl Grey & Meyer Lemon',
    hebrewNotes: 'ברגמוט מזוקק, ארל גריי ולימון מאייר',
    intensity: 82,
    foodAffinity: ['טארט לימון מרינג שרוף', 'עוגיית מדלן חמאה חומה', 'בריוש פיסטוק'],
  },
  {
    compound: 'Malic & Lactic Esters',
    chemicalFormula: 'C₄H₆O₅ / C₃H₆O₃',
    aromaNotes: 'Crisp Green Apple & Silky Greek Yogurt',
    hebrewNotes: 'חמיצות תפוח ירוק פריך ויוגורט משי',
    intensity: 90,
    foodAffinity: ['שטרודל תפוחים קרמלי', 'טארט טאטן פקאן', 'קוגלהוף הל וקינמון'],
  },
];

const PASTRY_PAIRINGS: PastryPairing[] = [
  {
    id: 'tartelette-yuzu',
    name: 'Tartelette Yuzu & Passion Fruit',
    hebrewName: 'טארטלט יוזו, פסיפלורה ושוקולד לבן',
    pastryChef: 'שף קונדיטור עילי',
    resonanceScore: 98,
    keyCompounds: ['Ethyl Butyrate', 'Citral'],
    tasteSensory: 'חמיצות הדרית תוססת המתמזגת עם האסטרים הטרופיים של התסיסה האנארובית.',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'croissant-pistachio',
    name: 'Pistachio Rose Ispahan Brioche',
    hebrewName: 'בריוש פיסטוק סיציליאני ומי ורדים',
    pastryChef: 'ארטיזן פטיסרי',
    resonanceScore: 94,
    keyCompounds: ['Linalool', 'Jasmine Lactone'],
    tasteSensory: 'פרחוניות יסמין עדינה המעצימה את שמני הפיסטוק הקלוי וחמאת הבריוש.',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'financier-caramel',
    name: 'Salted Caramel Hazelnut Financier',
    hebrewName: 'פיננסייר אגוזי לוז וקרמל מלוח',
    pastryChef: 'בוטיק שוקולד & קפה',
    resonanceScore: 91,
    keyCompounds: ['Isoamyl Acetate', 'Malic Acid'],
    tasteSensory: 'שומניות חמאה חומה ואגוזים המאזנת את החמיצות הפירותית הבוהקת של המיכל.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
  },
];

export function MolecularPairingRadar() {
  const [tankHours, setTankHours] = useState<number>(72); // 12-96 hours
  const [tankTemp, setTankTemp] = useState<number>(19); // 15-26 °C
  const [tankPressureBar, setTankPressureBar] = useState<number>(1.8); // 0.5-3.5 Bar
  const [selectedEsterIndex, setSelectedEsterIndex] = useState<number>(0);

  // Biological kinetics calculations
  const phLevel = Math.max(3.6, Number((5.8 - (tankHours / 96) * (tankTemp / 20) * 1.95).toFixed(2)));
  const brixSugar = Math.max(7.5, Number((22.5 - (tankHours / 96) * 14.2).toFixed(1)));
  const lacticAcidPct = Number(((tankHours / 72) * 2.8 * (tankTemp / 20)).toFixed(2));
  const aromaticIntensityPct = Math.min(100, Math.round((tankHours / 72) * 88 + (tankPressureBar / 2) * 12));

  const selectedEster = ESTERS[selectedEsterIndex];

  return (
    <div dir="rtl" className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c0d1c] via-[#101226] to-[#080914] border border-indigo-500/30 p-6 sm:p-10 overflow-hidden shadow-[0_20px_60px_rgba(99,102,241,0.15)]">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono tracking-wide">
              <FlaskConical className="w-4 h-4 text-indigo-400" />
              <span>ANAEROBIC FERMENTATION & MOLECULAR PAIRING RADAR</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              תסיסה אנארובית & רדאר צימוד מולקולרי
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              מעקב חי אחר 72 שעות תסיסה במיכלים אטומים נטולי חמצן בלחץ $CO_2$ מבוקר, ניתוח אסטרים נדיפים (Esters), והתאמה מדויקת של פרופילי הטעם למאפי שף בוטיק.
            </p>
          </div>

          {/* Real-time Tank Stats */}
          <div className="shrink-0 p-5 rounded-2xl bg-black/50 border border-indigo-500/40 backdrop-blur-xl flex flex-col items-center justify-center text-center min-w-[210px]">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 mb-2 shadow-lg shadow-indigo-500/20">
              <FlaskConical className="w-8 h-8 animate-bounce" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{phLevel} pH</div>
            <div className="text-xs text-indigo-400 font-bold tracking-wider mt-0.5">
              מדד חומציות יין תוססת
            </div>
            <div className="text-[10px] text-stone-400 mt-1">בריקס סוכר פרי: {brixSugar}°Bx</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 72h Anaerobic Tank Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#080812]/90 border border-indigo-500/30 backdrop-blur-2xl space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  טלמטריית מיכל תסיסה אטום (Anaerobic Tank Chamber)
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  כוונן את משך התסיסה, הטמפרטורה והלחץ במיכל לצפייה בזמן אמת בשינויי ה-pH והאסטרים
                </p>
              </div>
            </div>

            {/* Slider 1: Fermentation Duration */}
            <div className="space-y-2 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  משך זמן במיכל אטום נטול חמצן:
                </span>
                <span className="text-indigo-400 font-mono font-bold text-sm">{tankHours} שעות</span>
              </div>
              <input
                type="range"
                min="12"
                max="96"
                step="4"
                value={tankHours}
                onChange={(e) => setTankHours(Number(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>12h (מיצוי קל)</span>
                <span>72h (נקודת זהב - Gold Sweetspot)</span>
                <span>96h (אולטרה יין & שוקולד)</span>
              </div>
            </div>

            {/* Slider 2: Tank Temperature */}
            <div className="space-y-2 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-pink-400" />
                  טמפרטורת בקרת המיכל:
                </span>
                <span className="text-pink-400 font-mono font-bold text-sm">{tankTemp}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="26"
                step="1"
                value={tankTemp}
                onChange={(e) => setTankTemp(Number(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
            </div>

            {/* Slider 3: Tank Pressure */}
            <div className="space-y-2 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-cyan-400" />
                  לחץ פחמן דו-חמצני במיכל ($CO_2$ Pressure):
                </span>
                <span className="text-cyan-400 font-mono font-bold text-sm">{tankPressureBar} Bar</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.5"
                step="0.1"
                value={tankPressureBar}
                onChange={(e) => setTankPressureBar(Number(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 4 Key Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-center">
                <div className="text-[10px] text-stone-400">חומציות pH</div>
                <div className="text-lg font-black text-indigo-300 font-mono mt-0.5">{phLevel}</div>
              </div>
              <div className="p-3 rounded-2xl bg-pink-950/30 border border-pink-500/20 text-center">
                <div className="text-[10px] text-stone-400">סוכרי בריקס</div>
                <div className="text-lg font-black text-pink-300 font-mono mt-0.5">{brixSugar}°Bx</div>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-center">
                <div className="text-[10px] text-stone-400">חומצה לקטית</div>
                <div className="text-lg font-black text-cyan-300 font-mono mt-0.5">{lacticAcidPct}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-center">
                <div className="text-[10px] text-stone-400">עוצמת ארומה</div>
                <div className="text-lg font-black text-amber-300 font-mono mt-0.5">{aromaticIntensityPct}%</div>
              </div>
            </div>
          </div>

          {/* Volatile Esters Radar Selector */}
          <div className="p-6 rounded-3xl bg-[#080812]/90 border border-indigo-500/30 backdrop-blur-2xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              רדאר תרכובות נדיפות פעילות (Volatile Esters Profile):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ESTERS.map((ester, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedEsterIndex(idx);
                    coffeeSound.playBaristaClick();
                  }}
                  className={`p-3.5 rounded-2xl text-right transition-all border space-y-2 ${
                    idx === selectedEsterIndex
                      ? 'bg-indigo-950/50 border-indigo-400 shadow-md shadow-indigo-500/20'
                      : 'bg-stone-950/60 border-stone-800 hover:bg-stone-900/40 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{ester.compound}</span>
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                      {ester.intensity}% עוצמה
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400">{ester.hebrewNotes}</div>
                  <div className="text-[10px] text-indigo-400 font-mono">{ester.chemicalFormula}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Artisanal Pastry Molecular Pairing (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#080812]/90 border border-indigo-500/30 backdrop-blur-2xl space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-pink-400" />
                צימוד מאפים מולקולרי (Resonance Pairings)
              </h3>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              התרכובות המולקולריות שנוצרות במיכל התסיסה מתחברות בדיוק פיזיקו-כימי עם שומני חמאה, סוכרים קרמליים וטעמי פירות של מאפי שף:
            </p>

            <div className="space-y-4">
              {PASTRY_PAIRINGS.map((pastry) => (
                <div
                  key={pastry.id}
                  className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80 hover:border-pink-500/40 transition-all space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={pastry.imageUrl}
                      alt={pastry.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-700"
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-white truncate">{pastry.hebrewName}</div>
                        <span className="text-xs font-mono font-black text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/30 shrink-0">
                          {pastry.resonanceScore}% תאימות
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">{pastry.pastryChef}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-300 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-stone-800/60">
                    {pastry.tasteSensory}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pastry.keyCompounds.map((comp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                      >
                        🧬 {comp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MolecularPairingRadar;
