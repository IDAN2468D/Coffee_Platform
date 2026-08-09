'use client';

import React, { useState } from 'react';
import { FlaskConical, Thermometer, Clock, Sparkles, Droplets, Info } from 'lucide-react';

export default function FermentationSimulator() {
  const [fermentationType, setFermentationType] = useState<'anaerobic' | 'carbonic' | 'thermal'>('anaerobic');
  const [tankTemp, setTankTemp] = useState<number>(22);
  const [durationHours, setDurationHours] = useState<number>(72);
  const [brixSugar, setBrixSugar] = useState<number>(21);

  // Calculations
  const phDrop = Math.max(3.6, Number((5.8 - (durationHours / 120) * (tankTemp / 20) * 2.1).toFixed(2)));
  const lacticAcidPct = Math.min(4.5, Number(((durationHours / 72) * 2.2 * (tankTemp / 22)).toFixed(2)));
  const aceticAcidPct = Math.min(2.1, Number(((durationHours / 96) * 1.1).toFixed(2)));

  const getFlavorDescriptor = () => {
    if (fermentationType === 'anaerobic') {
      return {
        notes: 'מנגו טרופי, פסיפלורה, יין בורדו ותווים קקאו עמוקים',
        hebrewType: 'תסיסה אנארובית (Anaerobic Tank)',
        acidity: 'חומציות אגם יין תוססת',
        sweetness: 'מתיקות דבש דבורים וסוכר חום',
      };
    } else if (fermentationType === 'carbonic') {
      return {
        notes: 'דובדבן שחור, תות שדה, שזיף מיובש ותבלינים מתוקים',
        hebrewType: 'תסיסת פחמן דו-חמצני (Carbonic Maceration)',
        acidity: 'חומציות תפוח ירוק נקייה',
        sweetness: 'מתיקות מרציפן וקרמל',
      };
    } else {
      return {
        notes: 'יסמין, ליצ׳י, אפרסק לבן וברגמוט מזוקק',
        hebrewType: 'שוק תרמי (Thermal Shock Processing)',
        acidity: 'חומציות ציטרית בהירה ופריכה',
        sweetness: 'מתיקות צוף פרחים זכה',
      };
    }
  };

  const flavorInfo = getFlavorDescriptor();

  return (
    <div dir="rtl" className="w-full max-w-5xl mx-auto p-6 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          <FlaskConical className="w-4 h-4" />
          <span>Farm Processing & Micro-Climate Science</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          סימולטור תסיסה ואקלים חווה אינטראקטיבי
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          שלוט בטמפרטורת המכל, משך התסיסה ורמת הסוכרים ליצירת פרופילי טעם ייחודיים של תסיסה אנארובית ושוק תרמי.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Card */}
        <div className="lg:col-span-6 space-y-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
            פרמטרי תסיסה במכל החווה
          </h2>

          {/* Fermentation Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">שיטת התסיסה:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFermentationType('anaerobic')}
                className={`p-3 rounded-xl text-xs font-medium border transition-all ${
                  fermentationType === 'anaerobic'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                אנארובית
              </button>
              <button
                onClick={() => setFermentationType('carbonic')}
                className={`p-3 rounded-xl text-xs font-medium border transition-all ${
                  fermentationType === 'carbonic'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                Carbonic
              </button>
              <button
                onClick={() => setFermentationType('thermal')}
                className={`p-3 rounded-xl text-xs font-medium border transition-all ${
                  fermentationType === 'thermal'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                Thermal Shock
              </button>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                טמפרטורת מכל התסיסה:
              </span>
              <span className="font-bold text-amber-400">{tankTemp}°C</span>
            </div>
            <input
              type="range"
              min="14"
              max="35"
              value={tankTemp}
              onChange={(e) => setTankTemp(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                משך תסיסה במכל:
              </span>
              <span className="font-bold text-emerald-400">{durationHours} שעות</span>
            </div>
            <input
              type="range"
              min="24"
              max="144"
              step="6"
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Brix Scale Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-purple-400" />
                רמת סוכר ראשונית (Brix°):
              </span>
              <span className="font-bold text-purple-400">{brixSugar} Brix°</span>
            </div>
            <input
              type="range"
              min="16"
              max="26"
              value={brixSugar}
              onChange={(e) => setBrixSugar(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Real-time Chemical Output */}
        <div className="lg:col-span-6 space-y-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">פרופיל כימי צפוי</span>
              <h3 className="text-xl font-bold text-white mt-0.5">{flavorInfo.hebrewType}</h3>
            </div>
            <div className="text-left bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <div className="text-lg font-black text-emerald-400">pH {phDrop}</div>
              <div className="text-[10px] text-gray-400">דרגת חומציות</div>
            </div>
          </div>

          {/* Acids Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-xs text-gray-400">חומצה לקטית (Lactic Acid)</span>
              <div className="text-2xl font-bold text-emerald-400">{lacticAcidPct}%</div>
              <span className="text-[10px] text-gray-500">מעניקה מירקם חמאתי וקרמי</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-xs text-gray-400">חומצה אצטית (Acetic Acid)</span>
              <div className="text-2xl font-bold text-purple-400">{aceticAcidPct}%</div>
              <span className="text-[10px] text-gray-500">תווי פרי תוססים ויין</span>
            </div>
          </div>

          {/* Flavor Notes Card */}
          <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              פרופיל טעמים ארומטי נוצר:
            </div>
            <p className="text-white font-semibold text-sm">{flavorInfo.notes}</p>
            <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-gray-300 border-t border-emerald-500/20">
              <div><span className="text-emerald-400 font-semibold">אופי חומציות:</span> {flavorInfo.acidity}</div>
              <div><span className="text-purple-400 font-semibold">אופי מתיקות:</span> {flavorInfo.sweetness}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
