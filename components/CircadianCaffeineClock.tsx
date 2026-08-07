'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sun,
  Moon,
  Zap,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Plus,
  Coffee,
  Sparkles,
  TrendingDown,
  Activity,
  Flame,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface CoffeeDose {
  id: string;
  name: string;
  hebrewName: string;
  caffeineMg: number;
  timeTaken: string; // "09:30"
}

export const CircadianCaffeineClock: React.FC = () => {
  const [wakeTime, setWakeTime] = useState<string>('07:00'); // e.g. 07:00
  const [sleepTime, setSleepTime] = useState<string>('23:00'); // e.g. 23:00
  const [optimalCoffeeTime, setOptimalCoffeeTime] = useState<string>('08:30');
  const [caffeineCutoffTime, setCaffeineCutoffTime] = useState<string>('14:00');
  const [doses, setDoses] = useState<CoffeeDose[]>([
    { id: 'dose-1', name: 'Double Espresso', hebrewName: 'אספרסו כפול', caffeineMg: 126, timeTaken: '09:00' },
  ]);

  // Recalculate optimal coffee time (+90 min post wake) & caffeine cutoff (9-10h before sleep)
  useEffect(() => {
    const [wHours, wMins] = wakeTime.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(wHours, wMins + 90, 0);

    const optH = String(wakeDate.getHours()).padStart(2, '0');
    const optM = String(wakeDate.getMinutes()).padStart(2, '0');
    setOptimalCoffeeTime(`${optH}:${optM}`);

    const [sHours, sMins] = sleepTime.split(':').map(Number);
    const cutoffDate = new Date();
    cutoffDate.setHours(sHours - 9, sMins, 0);

    const cutH = String(cutoffDate.getHours()).padStart(2, '0');
    const cutM = String(cutoffDate.getMinutes()).padStart(2, '0');
    setCaffeineCutoffTime(`${cutH}:${cutM}`);
  }, [wakeTime, sleepTime]);

  const totalCaffeineMg = doses.reduce((sum, d) => sum + d.caffeineMg, 0);

  const handleAddDose = (presetName: string, hebrewName: string, mg: number) => {
    coffeeSound.playBaristaClick();
    const now = new Date();
    const currentH = String(now.getHours()).padStart(2, '0');
    const currentM = String(now.getMinutes()).padStart(2, '0');

    const newDose: CoffeeDose = {
      id: `dose-${Date.now()}`,
      name: presetName,
      hebrewName,
      caffeineMg: mg,
      timeTaken: `${currentH}:${currentM}`,
    };
    setDoses((prev) => [...prev, newDose]);
  };

  const handleRemoveDose = (id: string) => {
    coffeeSound.playBaristaClick();
    setDoses((prev) => prev.filter((d) => d.id !== id));
  };

  // Generate 24-hour SVG path data for Cortisol curve & Plasma Caffeine Level
  const generateChartPoints = () => {
    const pointsCortisol: string[] = [];
    const pointsCaffeine: string[] = [];

    const [wHours] = wakeTime.split(':').map(Number);

    for (let hour = 0; hour < 24; hour++) {
      const x = (hour / 23) * 580 + 10;

      // Cortisol peaks 30-45 mins after waking (around wHours + 0.75), and decays gradually
      const hoursSinceWake = (hour - wHours + 24) % 24;
      let cortisolVal = 20;
      if (hoursSinceWake >= 0 && hoursSinceWake <= 4) {
        cortisolVal = 80 - Math.pow(hoursSinceWake - 0.75, 2) * 8;
      } else if (hoursSinceWake > 4 && hoursSinceWake <= 16) {
        cortisolVal = Math.max(15, 60 - hoursSinceWake * 3);
      } else {
        cortisolVal = 10;
      }

      const yCortisol = 160 - (Math.max(10, Math.min(90, cortisolVal)) / 100) * 130;
      pointsCortisol.push(`${x.toFixed(1)},${yCortisol.toFixed(1)}`);

      // Caffeine Plasma Concentration based on logged doses with 5.7h half-life
      let totalPlasmaCaffeine = 0;
      doses.forEach((d) => {
        const [dH] = d.timeTaken.split(':').map(Number);
        const hoursPassed = (hour - dH + 24) % 24;
        if (hour >= dH) {
          totalPlasmaCaffeine += d.caffeineMg * Math.pow(0.5, hoursPassed / 5.7);
        }
      });

      const yCaffeine = 160 - (Math.min(300, totalPlasmaCaffeine) / 300) * 130;
      pointsCaffeine.push(`${x.toFixed(1)},${yCaffeine.toFixed(1)}`);
    }

    return {
      cortisolPath: `M ${pointsCortisol.join(' L ')}`,
      caffeinePath: `M ${pointsCaffeine.join(' L ')}`,
    };
  };

  const chartData = generateChartPoints();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 dir-rtl text-stone-100">
      {/* Top Banner Header */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>שעון צירקדיאני & סנכרון רמת קורטיזול ביולוגית</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-100 tracking-tight">
              Circadian Caffeine Clock <br />
              <span className="bg-gradient-to-r from-amber-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                התאמת זמני שתיית קפה למניעת התרסקות עייפות
              </span>
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              דחיית הקפה הראשון ב-90 דקות מרגע ההתעוררות מונעת התנגשות עם שיא הקורטיזול הטבעי,
              ומבטלת לחלוטין את התרסקות האנרגיה בשעות אחה"צ.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-emerald-500/30 text-center min-w-[140px]">
              <span className="text-[10px] text-stone-400 font-mono block">שעת קפה אופטימלית</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{optimalCoffeeTime}</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-rose-500/30 text-center min-w-[140px]">
              <span className="text-[10px] text-stone-400 font-mono block">סף קפאין אחרון להיום</span>
              <span className="text-2xl font-black text-rose-400 font-mono">{caffeineCutoffTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Circadian Chart & Time Picker (7 cols + 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 24-Hour SVG Dynamic Chart Visualizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-stone-100">
                  גרף צירקדיאני 24 שעות: קורטיזול vs רמת קפאין בדם
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">HALF-LIFE 5.7h</span>
            </div>

            {/* SVG 24-Hour Chart */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-amber-500/20 p-4">
              <svg viewBox="0 0 600 180" className="w-full h-48 overflow-visible">
                {/* Horizontal Grid lines */}
                <line x1="10" y1="30" x2="590" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="10" y1="90" x2="590" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="10" y1="150" x2="590" y2="150" stroke="rgba(255,255,255,0.08)" />

                {/* Cortisol Natural Rhythm Path (Amber / Orange) */}
                <path
                  d={chartData.cortisolPath}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Caffeine Concentration Path (Cyan / Emerald) */}
                <path
                  d={chartData.caffeinePath}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                />
              </svg>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 pt-2 border-t border-stone-800 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="text-amber-300">עקומת קורטיזול טבעית (Cortisol Spike)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                  <span className="text-cyan-300">רמת קפאין פעילה בדם (mg)</span>
                </div>
              </div>
            </div>

            {/* Key Insights & Cortisol Advice */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>המלצה ביולוגית מבוססת Gemini Bio-Sync:</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                שתיית קפה בשעה <strong>{optimalCoffeeTime}</strong> (בדיוק 90 דקות לאחר שעת היקיצה שלך {wakeTime})
                תמקסם את רמת העירנות ותמנע תחושת דכדוך או נפילת אנרגיה בשעות אחה"צ.
              </p>
            </div>
          </div>

          {/* Quick Dose Logger */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-2xl space-y-4">
            <h3 className="text-base font-black text-stone-100 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-cyan-400" />
              <span>תיעוד והוספת מנות קפאין להיום</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleAddDose('Single Espresso', 'אספרסו יחיד', 63)}
                className="p-3 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 text-right transition-all group"
              >
                <span className="text-xs font-bold block text-stone-100 group-hover:text-amber-400">אספרסו קצר</span>
                <span className="text-[10px] text-stone-400 font-mono">63 mg קפאין</span>
              </button>

              <button
                onClick={() => handleAddDose('Double Espresso', 'אספרסו כפול', 126)}
                className="p-3 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 text-right transition-all group"
              >
                <span className="text-xs font-bold block text-stone-100 group-hover:text-amber-400">אספרסו כפול</span>
                <span className="text-[10px] text-stone-400 font-mono">126 mg קפאין</span>
              </button>

              <button
                onClick={() => handleAddDose('V60 Filter', 'חליטת V60', 150)}
                className="p-3 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 text-right transition-all group"
              >
                <span className="text-xs font-bold block text-stone-100 group-hover:text-amber-400">פילטר V60</span>
                <span className="text-[10px] text-stone-400 font-mono">150 mg קפאין</span>
              </button>

              <button
                onClick={() => handleAddDose('Cold Brew', 'קולד ברו נגטיב', 200)}
                className="p-3 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 text-right transition-all group"
              >
                <span className="text-xs font-bold block text-stone-100 group-hover:text-amber-400">Cold Brew</span>
                <span className="text-[10px] text-stone-400 font-mono">200 mg קפאין</span>
              </button>
            </div>

            {/* Logged Doses List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs text-stone-400 block font-bold">מנות שנלגמו היום ({doses.length}):</span>
              {doses.map((dose) => (
                <div
                  key={dose.id}
                  className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-stone-200">{dose.hebrewName}</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                      {dose.caffeineMg} mg
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-stone-500 font-mono text-[10px]">{dose.timeTaken}</span>
                    <button
                      onClick={() => handleRemoveDose(dose.id)}
                      className="text-stone-500 hover:text-rose-400 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Wake/Sleep Schedule Pickers & Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* User Circadian Schedule Inputs */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-2xl space-y-6">
            <h3 className="text-base font-black text-stone-100 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              <span>הגדרת שעות היקיצה והשינה שלך</span>
            </h3>

            {/* Morning Wake Hour */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 block">
                שעת יקיצה בבוקר (Wake Up Time):
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => {
                  coffeeSound.playSliderTick();
                  setWakeTime(e.target.value);
                }}
                className="w-full p-3 rounded-2xl bg-stone-950 border border-amber-500/40 text-amber-300 font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Bedtime Sleep Hour */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 block">
                שעת שינה מתוכננת (Bedtime):
              </label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => {
                  coffeeSound.playSliderTick();
                  setSleepTime(e.target.value);
                }}
                className="w-full p-3 rounded-2xl bg-stone-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Daily Total Summary */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">צריכת קפאין יומית מצטברת:</span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  {totalCaffeineMg} / 400 mg
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-900 overflow-hidden border border-stone-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    totalCaffeineMg > 400 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (totalCaffeineMg / 400) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sleep Threshold Alert Box */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-rose-500/30 backdrop-blur-2xl space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <ShieldAlert className="w-5 h-5" />
              <span>אזהרת איכות שינה וסירקולציית מלטונין</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              נא להימנע מצריכת קפאין לאחר השעה <strong className="text-rose-400 font-mono">{caffeineCutoffTime}</strong>.
              לקפאין זמן מחצית חיים של 5.7 שעות בדם, וצריכה מאוחרת פוגעת בשינת REM עמוקה.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
