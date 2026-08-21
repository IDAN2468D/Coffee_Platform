"use client";

import React, { useState } from "react";
import { Snowflake, Sparkles, Thermometer, ShieldCheck, RefreshCw, Layers, CheckCircle2, Zap } from "lucide-react";

interface MilkProfile {
  id: string;
  name: string;
  type: "חלב מרוכז בהקפאה (Freeze-Distilled)" | "חלב מלא סטנדרטי (3%)" | "חלב שיבולת שועל בריסטה" | "חלב שקדים ללא סוכר";
  totalSolids: number; // %
  proteinPercent: number; // %
  lactosePercent: number; // %
  fatPercent: number; // %
  sweetnessIndex: number; // 1-10
  idealSteamingTemp: number; // °C
  bubbleDiameterMicrons: number; // µm
  microfoamStabilitySeconds: number; // seconds
  scientificNote: string;
}

const MILK_PROFILES: MilkProfile[] = [
  {
    id: "cryo-distilled",
    name: "Cryo-Distilled Whole Milk (מזוקק הקפאה)",
    type: "חלב מרוכז בהקפאה (Freeze-Distilled)",
    totalSolids: 22.5,
    proteinPercent: 6.8,
    lactosePercent: 9.4,
    fatPercent: 7.2,
    sweetnessIndex: 9.8,
    idealSteamingTemp: 62.5,
    bubbleDiameterMicrons: 55,
    microfoamStabilitySeconds: 520,
    scientificNote: "הקפאה מבוקרת ב-18°C- והפשרה איטית של 50% מנפח המים מייצרות ריכוז כפול של חלבוני קזאין ולקטוז טבעי ללא תוספת סוכר. מרקם משי מובהק."
  },
  {
    id: "standard-whole",
    name: "חלב פרה מלא טרי (3.8% שומן)",
    type: "חלב מלא סטנדרטי (3%)",
    totalSolids: 12.5,
    proteinPercent: 3.3,
    lactosePercent: 4.8,
    fatPercent: 3.8,
    sweetnessIndex: 6.5,
    idealSteamingTemp: 65.0,
    bubbleDiameterMicrons: 85,
    microfoamStabilitySeconds: 240,
    scientificNote: "בסיס סטנדרטי למשקאות קפוצ'ינו. דנטורציית חלבון Whey מתחילה ב-65°C. מעל 70°C החלב נשרף ומאבד את המתיקות הטבעית."
  },
  {
    id: "oat-barista",
    name: "Oatly Barista Edition (שיבולת שועל)",
    type: "חלב שיבולת שועל בריסטה",
    totalSolids: 14.0,
    proteinPercent: 1.2,
    lactosePercent: 0.0,
    fatPercent: 3.0,
    sweetnessIndex: 7.8,
    idealSteamingTemp: 60.0,
    bubbleDiameterMicrons: 95,
    microfoamStabilitySeconds: 310,
    scientificNote: "מועשר בשמן לפתית לייצוב שומנים ופוספטים די-אשלגניים לאיזון חומציות האספרסו (מניעת קרישה בחליטות בהירות)."
  },
  {
    id: "almond-zero",
    name: "חלב שקדים בריסטה ללא סוכר",
    type: "חלב שקדים ללא סוכר",
    totalSolids: 7.5,
    proteinPercent: 1.5,
    lactosePercent: 0.0,
    fatPercent: 2.2,
    sweetnessIndex: 4.0,
    idealSteamingTemp: 58.0,
    bubbleDiameterMicrons: 120,
    microfoamStabilitySeconds: 160,
    scientificNote: "דל במוצקים ובחלבונים מקציפים. דורש טכניקת מזיגה מהירה וקיטור עדין למניעת הפרדת פאזות (Curdling)."
  }
];

export default function CryoMilkSynthesizer() {
  const [selectedMilk, setSelectedMilk] = useState<MilkProfile>(MILK_PROFILES[0]);
  const [currentTemp, setCurrentTemp] = useState<number>(selectedMilk.idealSteamingTemp);

  const isTempOptimal = Math.abs(currentTemp - selectedMilk.idealSteamingTemp) <= 2;
  const isOverheated = currentTemp > 68;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6 text-right font-sans" dir="rtl">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl bg-black/60 border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs md:text-sm font-bold tracking-wider uppercase mb-1">
            <Snowflake className="w-4 h-4" />
            מדע הקצפה ותרמודינמיקה קריוגנית • Sprint 12 Flagship
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white">
            סינתיסייזר חלב קריוגני ומיקרו-קצף 50µm
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            זיקוק חלב בהקפאה, מודל דנטורציית חלבונים ופיזור קוטר בועות אולטרסוניות.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold">
          20% Total Solids • WBC Standard
        </span>
      </div>

      {/* Milk Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MILK_PROFILES.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setSelectedMilk(m);
              setCurrentTemp(m.idealSteamingTemp);
            }}
            className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
              selectedMilk.id === m.id
                ? "bg-blue-500/20 border-blue-400 text-white shadow-[0_0_25px_rgba(59,130,246,0.25)]"
                : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <div className="text-xs text-blue-400 font-bold">{m.type.split(" ")[0]}</div>
            <div className="font-bold text-sm text-white mt-1">{m.name}</div>
            <div className="text-[11px] text-zinc-400 mt-2">{m.totalSolids}% מוצקים • מתיקות {m.sweetnessIndex}/10</div>
          </button>
        ))}
      </div>

      {/* Main Physics & Steaming Simulator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Gauges */}
        <div className="md:col-span-1 rounded-3xl p-6 backdrop-blur-2xl bg-black/60 border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-white/10 pb-3">
            <Zap className="w-4 h-4 text-blue-400" />
            ערכים מולקולריים נמדדים
          </h3>

          <div className="space-y-3 text-xs md:text-sm">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
              <span className="text-zinc-400">ריכוז מוצקים (Total Solids)</span>
              <span className="font-bold text-blue-300">{selectedMilk.totalSolids}%</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
              <span className="text-zinc-400">חלבונים (קזאין ו-Whey)</span>
              <span className="font-bold text-emerald-300">{selectedMilk.proteinPercent}%</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
              <span className="text-zinc-400">לקטוז מרוכז (סוכר טבעי)</span>
              <span className="font-bold text-amber-300">{selectedMilk.lactosePercent}%</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
              <span className="text-zinc-400">קוטר בועות מיקרו-קצף</span>
              <span className="font-bold text-indigo-300">{selectedMilk.bubbleDiameterMicrons} µm</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
              <span className="text-zinc-400">יציבות מיקרו-קצף</span>
              <span className="font-bold text-zinc-200">{selectedMilk.microfoamStabilitySeconds} שניות</span>
            </div>
          </div>
        </div>

        {/* Steaming Temperature & Science Explanation */}
        <div className="md:col-span-2 rounded-3xl p-6 backdrop-blur-2xl bg-black/60 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-amber-400" />
                בקרת טמפרטורת קיטור ודנטורציה
              </h3>
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                isTempOptimal
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : isOverheated
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/30"
              }`}>
                {isTempOptimal ? "טמפרטורת שיא מושלמת" : isOverheated ? "אזהרה: שריפת סוכרים" : "הקצפה קרה / בינונית"}
              </span>
            </div>

            {/* Slider */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-bold text-zinc-300">
                <span>טמפרטורת חלב נוכחית: {currentTemp.toFixed(1)}°C</span>
                <span className="text-blue-400">יעד אידיאלי: {selectedMilk.idealSteamingTemp}°C</span>
              </div>
              <input
                type="range"
                min={45}
                max={75}
                step={0.5}
                value={currentTemp}
                onChange={(e) => setCurrentTemp(parseFloat(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>45°C (קר)</span>
                <span>62.5°C (שיא מתיקות)</span>
                <span>75°C (חרוך)</span>
              </div>
            </div>

            {/* Scientific Note */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mt-5 space-y-1.5">
              <div className="text-blue-400 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                מנגנון ביוכימי ומבנה קצף
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed">
                {selectedMilk.scientificNote}
              </p>
            </div>
          </div>

          <div className="text-left text-[11px] text-zinc-500 pt-2 border-t border-white/5">
            Cryo-Milk Thermodynamics Engine • Calibrated for SCA Latte Art Championships
          </div>
        </div>
      </div>
    </div>
  );
}
