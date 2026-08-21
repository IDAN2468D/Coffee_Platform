"use client";

import React, { useState } from "react";
import { Sparkles, Sliders, Printer, CheckCircle2, Award, Coffee, RefreshCw } from "lucide-react";

interface BeanOrigin {
  id: string;
  name: string;
  country: string;
  process: string;
  density: string;
  acidity: number; // 1-10
  body: number;    // 1-10
  sweetness: number; // 1-10
  notes: string[];
}

const ORIGINS: BeanOrigin[] = [
  { id: "ethiopia", name: "אתיופיה ירגשף (Anaerobic)", country: "אתיופיה", process: "אנאירובי טבעי", density: "גבוהה מאוד (2,100m)", acidity: 9.2, body: 6.5, sweetness: 9.0, notes: ["יסמין", "ברגמוט", "אפרסק"] },
  { id: "colombia", name: "קולומביה Huila (Pink Bourbon)", country: "קולומביה", process: "שטיפה כפולה", density: "גבוהה (1,850m)", acidity: 8.4, body: 7.8, sweetness: 9.4, notes: ["פפאיה", "סוכר קנים", "פרחי הדר"] },
  { id: "panama", name: "פנמה Boquete (Geisha)", country: "פנמה", process: "Natural", density: "גבוהה (1,900m)", acidity: 9.5, body: 6.0, sweetness: 9.8, notes: ["ורדים", "פירות יער", "מנגו"] },
  { id: "sumatra", name: "סומטרה Mandheling (Wet-Hulled)", country: "אינדונזיה", process: "Giling Basah", density: "בינונית (1,400m)", acidity: 4.5, body: 9.8, sweetness: 7.5, notes: ["שוקולד מריר", "עץ ארז", "תבלינים"] },
  { id: "kenya", name: "קניה Nyeri (SL28)", country: "קניה", process: "Washed", density: "גבוהה מאוד (1,950m)", acidity: 9.6, body: 8.0, sweetness: 8.8, notes: ["דמדמניות שחורות", "עגבנייה מתוקה", "ליים"] }
];

export default function CustomBlendCrafter() {
  const [blendName, setBlendName] = useState<string>("Boutique Masterpiece No. 7");
  const [roasterName, setRoasterName] = useState<string>("The Digital Roast Barista");
  const [ratios, setRatios] = useState<Record<string, number>>({
    ethiopia: 40,
    colombia: 35,
    panama: 25,
    sumatra: 0,
    kenya: 0
  });
  const [isLabelPrinted, setIsLabelPrinted] = useState<boolean>(false);

  const totalPercentage = Object.values(ratios).reduce((a, b) => a + b, 0);

  // Dynamic calculated sensory metrics
  const calculatedMetrics = () => {
    let totalAcidity = 0;
    let totalBody = 0;
    let totalSweetness = 0;

    ORIGINS.forEach((orig) => {
      const p = (ratios[orig.id] || 0) / (totalPercentage || 1);
      totalAcidity += orig.acidity * p;
      totalBody += orig.body * p;
      totalSweetness += orig.sweetness * p;
    });

    return {
      acidity: totalAcidity.toFixed(1),
      body: totalBody.toFixed(1),
      sweetness: totalSweetness.toFixed(1)
    };
  };

  const metrics = calculatedMetrics();

  const handleRatioChange = (id: string, val: number) => {
    setRatios((prev) => ({
      ...prev,
      [id]: val
    }));
  };

  const handlePrintLabel = () => {
    setIsLabelPrinted(true);
    setTimeout(() => setIsLabelPrinted(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6 text-right font-sans" dir="rtl">
      {/* Header */}
      <div className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl bg-black/60 border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs md:text-sm font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            אלכימיית בלנדים בוטיק AI • Sprint 12 Flagship
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white">
            יוצר התערובות והבלנדים האישיים
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            איזון אחוזי זנים, חישוב שיווי משקל סנסורי והדפסת תווית מותאמת אישית.
          </p>
        </div>

        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
          totalPercentage === 100
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
        }`}>
          סה&quot;כ הרכב: {totalPercentage}% {totalPercentage === 100 ? "✓ מאוזן" : "(יעד: 100%)"}
        </span>
      </div>

      {/* Origin Sliders */}
      <div className="rounded-3xl p-6 backdrop-blur-2xl bg-black/60 border border-white/10 space-y-5">
        <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-white/10 pb-3">
          <Sliders className="w-4 h-4 text-purple-400" />
          הרכב זני המקור בבלנד
        </h3>

        <div className="space-y-4">
          {ORIGINS.map((orig) => (
            <div key={orig.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs md:text-sm">
                <div>
                  <span className="font-bold text-white">{orig.name}</span>
                  <span className="text-zinc-400 mr-2">({orig.process})</span>
                </div>
                <span className="font-black text-purple-300 text-base">{ratios[orig.id] || 0}%</span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={ratios[orig.id] || 0}
                onChange={(e) => handleRatioChange(orig.id, parseInt(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-white/10 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>טעמים בולטים: {orig.notes.join(", ")}</span>
                <span>צפיפות: {orig.density}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sensory Radar & Personalized Label Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sensory Balance */}
        <div className="rounded-3xl p-6 backdrop-blur-2xl bg-black/60 border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-white/10 pb-3">
            <Award className="w-4 h-4 text-amber-400" />
            איזון טעמים משוקלל
          </h3>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20">
              <div className="text-zinc-400 text-xs">חמיצות פירותית</div>
              <div className="text-2xl font-black text-purple-300 mt-1">{metrics.acidity}/10</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20">
              <div className="text-zinc-400 text-xs">גוף וקרמיות</div>
              <div className="text-2xl font-black text-amber-300 mt-1">{metrics.body}/10</div>
            </div>
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20">
              <div className="text-zinc-400 text-xs">מתיקות טבעית</div>
              <div className="text-2xl font-black text-rose-300 mt-1">{metrics.sweetness}/10</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2 mt-4">
            <label className="text-xs font-bold text-zinc-300">שם התערובת האישית שלך:</label>
            <input
              type="text"
              value={blendName}
              onChange={(e) => setBlendName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>

        {/* Boutique Printable Bag Label */}
        <div className="rounded-3xl p-6 backdrop-blur-2xl bg-black/80 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
              <div className="text-amber-400 text-xs font-bold tracking-widest uppercase">
                THE DIGITAL ROAST • CUSTOM MICRO-ROAST
              </div>
              <Coffee className="w-4 h-4 text-amber-400" />
            </div>

            <div>
              <h2 className="text-xl font-black text-white">{blendName}</h2>
              <div className="text-xs text-zinc-400 mt-0.5">נוצר ע&quot;י {roasterName}</div>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1 text-xs text-zinc-300 font-mono">
              <div className="font-bold text-amber-300 mb-1">פרופיל זנים:</div>
              {ORIGINS.filter(o => (ratios[o.id] || 0) > 0).map(o => (
                <div key={o.id} className="flex justify-between">
                  <span>• {o.name.split(" ")[0]} ({o.country})</span>
                  <span>{ratios[o.id]}%</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handlePrintLabel}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            {isLabelPrinted ? "תווית בוטיק נשלחה להדפסה!" : "הדפס תווית לשקית הקפה"}
          </button>
        </div>
      </div>
    </div>
  );
}
