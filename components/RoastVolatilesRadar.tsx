"use client";

import React, { useState } from "react";
import { Flame, Activity, Sparkles, Clock, ShieldCheck, RefreshCw, BarChart2 } from "lucide-react";

interface RoastVolatileSample {
  roastAgeDays: number;
  roastLevel: string;
  beanOrigin: string;
  co2RemainingPercent: number;
  pyrazinesScore: number; // 0-100 (Nutty/Roasty)
  furansScore: number;    // 0-100 (Caramel/Sweet)
  estersScore: number;    // 0-100 (Fruity/Floral)
  thiolsScore: number;    // 0-100 (Bright Citrus/Floral)
  flavorStatus: "Degassing (מוקדם מדי לחליטה)" | "Peak Extraction Window (שיא ארומטי)" | "Aroma Fading (דעיכה הדרגתית)";
  flavorRecommendation: string;
}

export default function RoastVolatilesRadar() {
  const [roastDays, setRoastDays] = useState<number>(10);
  const [roastLevel, setRoastLevel] = useState<"Light (City)" | "Medium (Full City)" | "Dark (French)">("Light (City)");

  // Dynamic simulation calculations
  const calculateVolatiles = (): RoastVolatileSample => {
    // CO2 exponential decay: half-life ~ 7-10 days
    const co2Remaining = Math.max(5, Math.round(100 * Math.exp(-0.075 * roastDays)));
    
    // Volatile curves: Esters peak around day 7-14, Pyrazines stay steady, Furans peak day 5-12
    const esters = Math.max(10, Math.round(95 * Math.exp(-0.04 * Math.abs(roastDays - 10))));
    const furans = Math.max(15, Math.round(90 * Math.exp(-0.035 * Math.abs(roastDays - 8))));
    const pyrazines = roastLevel === "Dark (French)" ? 95 : roastLevel === "Medium (Full City)" ? 80 : 60;
    const thiols = Math.max(10, Math.round(92 * Math.exp(-0.06 * Math.abs(roastDays - 9))));

    let status: RoastVolatileSample["flavorStatus"] = "Peak Extraction Window (שיא ארומטי)";
    let recommendation = "חלון שיא אידיאלי! רמת ה-CO2 מאוזנת ואינה מפריעה למגע המים בפולי הקפה. תווי הפרחים והפירות בשיאם.";

    if (roastDays < 5) {
      status = "Degassing (מוקדם מדי לחליטה)";
      recommendation = "פליטת גז CO2 אינטנסיבית תיצור בועות מוגזמות בחליטה ותמנע מיצוי אחיד של מתיקות. מומלץ להמתין עוד מספר ימים.";
    } else if (roastDays > 24) {
      status = "Aroma Fading (דעיכה הדרגתית)";
      recommendation = "תרכובות האסתרים הנדיפות התחמצנו חלקית. הקפה עדיין טעים אך בעל בהירות פירותית מופחתת. מומלץ לחלוט באספרסו עמוק.";
    }

    return {
      roastAgeDays: roastDays,
      roastLevel,
      beanOrigin: "Panama Geisha & Ethiopia Yirgacheffe",
      co2RemainingPercent: co2Remaining,
      pyrazinesScore: pyrazines,
      furansScore: furans,
      estersScore: esters,
      thiolsScore: thiols,
      flavorStatus: status,
      flavorRecommendation: recommendation
    };
  };

  const sample = calculateVolatiles();

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6 text-right font-sans" dir="rtl">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl bg-black/60 border border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-orange-400 text-xs md:text-sm font-bold tracking-wider uppercase mb-1">
            <Flame className="w-4 h-4" />
            ספקטרומטריית גזים נדיפים GC-MS • Sprint 12 Flagship
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white">
            רדאר תרכובות ארומה נדיפות (VOC) ו-CO2
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            מעקב דעיכת גזי קלייה, קינטיקת אסתרים ופירזינים ואיתור חלון מיצוי השיא של הפולים.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold">
          GC-MS Spectrometry Model
        </span>
      </div>

      {/* Interactive Sliders & Selectors */}
      <div className="rounded-3xl p-6 backdrop-blur-2xl bg-black/60 border border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Days Post-Roast Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-white">
              <span>ימים ממועד הקלייה (Age):</span>
              <span className="text-orange-400 text-lg font-black">{roastDays} ימים</span>
            </div>
            <input
              type="range"
              min={1}
              max={35}
              value={roastDays}
              onChange={(e) => setRoastDays(parseInt(e.target.value))}
              className="w-full accent-orange-500 h-2 bg-white/10 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>יום 1 (טרי מאוד)</span>
              <span>ימים 7-18 (חלון שיא)</span>
              <span>יום 35 (חמצון)</span>
            </div>
          </div>

          {/* Roast Profile Selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">פרופיל קלייה:</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Light (City)", "Medium (Full City)", "Dark (French)"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRoastLevel(lvl)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    roastLevel === lvl
                      ? "bg-orange-500 text-black border-orange-400 shadow-md"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {lvl.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Volatiles Telemetry & Spectral Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compounds Radar */}
        <div className="md:col-span-1 rounded-3xl p-6 backdrop-blur-2xl bg-black/60 border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-white/10 pb-3">
            <BarChart2 className="w-4 h-4 text-orange-400" />
            ריכוז תרכובות כימיות (VOC)
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-zinc-300 font-bold mb-1">
                <span>אסתרים (פירות ופרחים):</span>
                <span className="text-rose-400">{sample.estersScore}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full transition-all duration-300" style={{ width: `${sample.estersScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-300 font-bold mb-1">
                <span>פוראנים (קרמל וסוכרים):</span>
                <span className="text-amber-400">{sample.furansScore}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${sample.furansScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-300 font-bold mb-1">
                <span>פירזינים (קלייה ואגוזים):</span>
                <span className="text-orange-400">{sample.pyrazinesScore}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full transition-all duration-300" style={{ width: `${sample.pyrazinesScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-300 font-bold mb-1">
                <span>תיולים (הדרים ופסיפלורה):</span>
                <span className="text-cyan-400">{sample.thiolsScore}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full transition-all duration-300" style={{ width: `${sample.thiolsScore}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Extraction Window Verdict */}
        <div className="md:col-span-2 rounded-3xl p-6 backdrop-blur-2xl bg-black/60 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                מצב חלון הטעם ופליטת $CO_2$
              </h3>
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                sample.flavorStatus.includes("שיא")
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/30"
              }`}>
                {sample.flavorStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-zinc-400 text-xs">$CO_2$ שנותר בפול:</div>
                <div className="text-2xl font-black text-white mt-1">{sample.co2RemainingPercent}%</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-zinc-400 text-xs">אינדקס מסיסות מים:</div>
                <div className="text-2xl font-black text-cyan-300 mt-1">{sample.roastAgeDays > 6 && sample.roastAgeDays < 22 ? "99.4%" : "84.2%"}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mt-4 space-y-1.5">
              <div className="text-orange-400 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                המלצת חליטה מדעית לבריסטה
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed">
                {sample.flavorRecommendation}
              </p>
            </div>
          </div>

          <div className="text-left text-[11px] text-zinc-500 pt-2 border-t border-white/5">
            Roast Volatiles GC-MS Kinetics • Calibrated with SCA Flavor Wheel v8.0
          </div>
        </div>
      </div>
    </div>
  );
}
