'use client';

import React, { useState, useMemo, useRef } from 'react';
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
  TrendingUp,
  Activity,
  Flame,
  Brain,
  Sliders,
  RotateCcw,
  Volume2,
  Share2,
  Trash2,
  Compass,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface CoffeeDose {
  id: string;
  name: string;
  hebrewName: string;
  caffeineMg: number;
  timeTaken: string; // "HH:MM" e.g. "09:00"
}

type MetabolismRate = 'FAST' | 'AVERAGE' | 'SLOW';

export const CircadianCaffeineClock: React.FC = () => {
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [sleepTime, setSleepTime] = useState<string>('23:00');
  const [metabolism, setMetabolism] = useState<MetabolismRate>('AVERAGE');
  const [userWeightKg, setUserWeightKg] = useState<number>(75);
  const [hoverHour, setHoverHour] = useState<number | null>(null);

  const [doses, setDoses] = useState<CoffeeDose[]>([
    { id: 'dose-1', name: 'Double Espresso', hebrewName: 'אספרסו כפול', caffeineMg: 126, timeTaken: '09:00' },
    { id: 'dose-2', name: 'V60 Pour-Over', hebrewName: 'חליטת V60 בהירה', caffeineMg: 145, timeTaken: '14:00' },
  ]);

  // Half-life based on liver CYP1A2 enzyme rate
  const halfLifeHours = useMemo(() => {
    switch (metabolism) {
      case 'FAST':
        return 3.8;
      case 'SLOW':
        return 7.2;
      case 'AVERAGE':
      default:
        return 5.2;
    }
  }, [metabolism]);

  // Calculate circadian critical windows
  const scheduleTimes = useMemo(() => {
    const [wH, wM] = wakeTime.split(':').map(Number);
    const [sH, sM] = sleepTime.split(':').map(Number);

    // 1. Cortisol Peak window: 0 to +60 min post wake
    const peakStart = `${String(wH).padStart(2, '0')}:${String(wM).padStart(2, '0')}`;
    const peakEndH = (wH + 1) % 24;
    const peakEnd = `${String(peakEndH).padStart(2, '0')}:${String(wM).padStart(2, '0')}`;

    // 2. Optimal Coffee Window: +90 min to +3.5h post wake
    const optStartH = (wH + Math.floor((wM + 90) / 60)) % 24;
    const optStartM = (wM + 90) % 60;
    const optimalTimeStr = `${String(optStartH).padStart(2, '0')}:${String(optStartM).padStart(2, '0')}`;

    // 3. Afternoon Slump Window: +6.5h to +8.5h post wake
    const slumpH = (wH + 7) % 24;
    const slumpTimeStr = `${String(slumpH).padStart(2, '0')}:${String(wM).padStart(2, '0')}`;

    // 4. Caffeine Cutoff: 9-10h prior to sleep
    const cutoffTotalMins = sH * 60 + sM - (metabolism === 'SLOW' ? 600 : 540);
    const normalizedCutoff = (cutoffTotalMins + 1440) % 1440;
    const cutH = Math.floor(normalizedCutoff / 60);
    const cutM = normalizedCutoff % 60;
    const cutoffTimeStr = `${String(cutH).padStart(2, '0')}:${String(cutM).padStart(2, '0')}`;

    return {
      peakStart,
      peakEnd,
      optimalTimeStr,
      slumpTimeStr,
      cutoffTimeStr,
      wakeHourDec: wH + wM / 60,
      sleepHourDec: sH + sM / 60,
    };
  }, [wakeTime, sleepTime, metabolism]);

  const totalDailyCaffeineMg = useMemo(() => {
    return doses.reduce((sum, d) => sum + d.caffeineMg, 0);
  }, [doses]);

  // Current active caffeine in bloodstream at this very moment
  const currentPlasmaCaffeine = useMemo(() => {
    const now = new Date();
    const currentHourDec = now.getHours() + now.getMinutes() / 60;

    let active = 0;
    doses.forEach((d) => {
      const [dH, dM] = d.timeTaken.split(':').map(Number);
      const doseHourDec = dH + dM / 60;
      if (currentHourDec >= doseHourDec) {
        const hoursPassed = currentHourDec - doseHourDec;
        // Two-phase model: Absorption Tmax ~ 0.5h, then 1st order decay
        const absorption = 1 - Math.exp(-hoursPassed / 0.35);
        const elimination = Math.pow(0.5, hoursPassed / halfLifeHours);
        active += d.caffeineMg * absorption * elimination;
      }
    });
    return Math.round(active);
  }, [doses, halfLifeHours]);

  // Generate 24-Hour Pharmacokinetic Vector Paths (Cortisol, Plasma Caffeine, Sleep Pressure)
  const chartTelemetry = useMemo(() => {
    const width = 640;
    const height = 240;
    const paddingX = 24;
    const plotWidth = width - paddingX * 2;

    const cortisolPoints: { x: number; y: number; val: number }[] = [];
    const caffeinePoints: { x: number; y: number; val: number }[] = [];
    const adenosinePoints: { x: number; y: number; val: number }[] = [];

    const wDec = scheduleTimes.wakeHourDec;

    for (let i = 0; i <= 48; i++) {
      const hour = i * 0.5; // Every 30 mins
      const x = paddingX + (hour / 24) * plotWidth;

      // 1. Natural Endogenous Cortisol Rhythm % (CAR peak + circadian troughs)
      const hoursSinceWake = (hour - wDec + 24) % 24;
      let cortisol = 15;
      if (hoursSinceWake >= 0 && hoursSinceWake <= 1.5) {
        // Awakening Cortisol Surge (CAR)
        cortisol = 30 + (hoursSinceWake / 0.75) * 65;
        if (hoursSinceWake > 0.75) {
          cortisol = 95 - ((hoursSinceWake - 0.75) / 0.75) * 35;
        }
      } else if (hoursSinceWake > 1.5 && hoursSinceWake <= 5.5) {
        // Mid-morning stabilization
        cortisol = 60 - ((hoursSinceWake - 1.5) / 4) * 25;
      } else if (hoursSinceWake > 5.5 && hoursSinceWake <= 8.5) {
        // Afternoon dip (13:30 - 15:30)
        cortisol = 35 - Math.sin(((hoursSinceWake - 5.5) / 3) * Math.PI) * 12;
      } else if (hoursSinceWake > 8.5 && hoursSinceWake <= 16) {
        // Evening baseline drop
        cortisol = Math.max(8, 25 - ((hoursSinceWake - 8.5) / 7.5) * 18);
      } else {
        // Sleep state nadir
        cortisol = 8;
      }

      const yCortisol = height - 20 - (cortisol / 100) * (height - 50);
      cortisolPoints.push({ x, y: yCortisol, val: Math.round(cortisol) });

      // 2. Plasma Caffeine Accumulation & Elimination Curve (mg)
      let plasma = 0;
      doses.forEach((d) => {
        const [dH, dM] = d.timeTaken.split(':').map(Number);
        const doseHour = dH + dM / 60;
        if (hour >= doseHour) {
          const deltaH = hour - doseHour;
          const absorptionFactor = 1 - Math.exp(-deltaH / 0.35);
          const eliminationFactor = Math.pow(0.5, deltaH / halfLifeHours);
          plasma += d.caffeineMg * absorptionFactor * eliminationFactor;
        }
      });

      const yCaffeine = height - 20 - (Math.min(320, plasma) / 320) * (height - 50);
      caffeinePoints.push({ x, y: yCaffeine, val: Math.round(plasma) });

      // 3. Adenosine Receptor Saturation %
      const adenosineSaturation = Math.min(98, (plasma / (plasma + 40)) * 100);
      const yAdenosine = height - 20 - (adenosineSaturation / 100) * (height - 50);
      adenosinePoints.push({ x, y: yAdenosine, val: Math.round(adenosineSaturation) });
    }

    const cortisolPath = `M ${cortisolPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;
    const caffeinePath = `M ${caffeinePoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;
    const adenosinePath = `M ${adenosinePoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;

    return {
      width,
      height,
      paddingX,
      plotWidth,
      cortisolPath,
      caffeinePath,
      adenosinePath,
      cortisolPoints,
      caffeinePoints,
      adenosinePoints,
    };
  }, [scheduleTimes, doses, halfLifeHours]);

  const handleAddDose = (name: string, hebrewName: string, mg: number) => {
    coffeeSound.playBaristaClick();
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');

    const newDose: CoffeeDose = {
      id: `dose-${Date.now()}`,
      name,
      hebrewName,
      caffeineMg: mg,
      timeTaken: `${h}:${m}`,
    };
    setDoses((prev) => [...prev, newDose]);
  };

  const handleRemoveDose = (id: string) => {
    coffeeSound.playBaristaClick();
    setDoses((prev) => prev.filter((d) => d.id !== id));
  };

  const handleUpdateTime = (id: string, newTime: string) => {
    setDoses((prev) => prev.map((d) => (d.id === id ? { ...d, timeTaken: newTime } : d)));
  };

  // Scrubber hovered values
  const hoveredMetrics = useMemo(() => {
    if (hoverHour === null) return null;
    const idx = Math.min(48, Math.max(0, Math.round(hoverHour * 2)));
    const cPoint = chartTelemetry.cortisolPoints[idx];
    const kPoint = chartTelemetry.caffeinePoints[idx];
    const aPoint = chartTelemetry.adenosinePoints[idx];

    const h = Math.floor(hoverHour);
    const m = Math.round((hoverHour - h) * 60);
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    return {
      timeStr,
      cortisol: cPoint ? cPoint.val : 0,
      caffeine: kPoint ? kPoint.val : 0,
      adenosine: aPoint ? aPoint.val : 0,
    };
  }, [hoverHour, chartTelemetry]);

  return (
    <div className="space-y-8 dir-rtl text-right">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-amber-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>CIRCADIAN CORTISOL & PHARMACOKINETIC ENGINE • V7.0 ULTRA</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
              שעון קפאין צירקדיאני & סנכרון קורטיזול ביולוגי 24 שעות
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              מודל פרמקוקינטי מדויק המשלב את עקומת הקורטיזול האנדוגנית הטבעית, קצב פירוק הקפאין בכבד (זמן מחצית חיים של {halfLifeHours} שעות), וחסימת קולטני אדנוזין למניעת התרסקות אנרגיה ושמירה על שנת REM עמוקה.
            </p>
          </div>

          {/* Real-time Plasma Badge */}
          <div className="flex items-center gap-4 bg-[#140e0b]/90 p-4 rounded-2xl border border-amber-500/40 shrink-0">
            <div className="text-center">
              <div className="text-xs text-stone-400 font-mono">קפאין פעיל בדם כעת</div>
              <div className="text-3xl font-black font-mono text-cyan-400 mt-0.5">
                {currentPlasmaCaffeine} <span className="text-xs font-normal text-stone-400">mg</span>
              </div>
            </div>
            <div className="h-10 w-px bg-stone-800" />
            <div className="text-xs text-stone-300 space-y-1 font-mono">
              <div className="text-emerald-400 font-bold">שעת שיא מומלצת: {scheduleTimes.optimalTimeStr}</div>
              <div className="text-rose-400 font-bold">סף קפאין אחרון: {scheduleTimes.cutoffTimeStr}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 24-Hour Interactive High-Fidelity Vector Graph */}
      <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 backdrop-blur-2xl shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-stone-100">
              גרף צירקדיאני 24 שעות: קורטיזול vs רמת קפאין בדם & רוויית אדנוזין
            </h2>
          </div>

          {/* Interactive Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              עקומת קורטיזול טבעית (%)
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              קפאין בפלזמה בדם (mg)
            </span>
            <span className="flex items-center gap-1.5 text-purple-300">
              <span className="w-3 h-3 rounded-full bg-purple-400" />
              חסימת אדנוזין (%)
            </span>
          </div>
        </div>

        {/* SVG Canvas with Scrubbing / Hover */}
        <div
          className="relative w-full rounded-2xl bg-stone-950 p-4 border border-stone-800 overflow-hidden cursor-crosshair"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const posX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
            // Convert to 0-24 hour
            const hour = (posX / rect.width) * 24;
            setHoverHour(Number(hour.toFixed(1)));
          }}
          onMouseLeave={() => setHoverHour(null)}
        >
          {/* Background Biological Windows */}
          <div className="absolute inset-0 pointer-events-none flex opacity-20">
            {/* Awakening Cortisol Spike Zone */}
            <div
              className="h-full bg-amber-500"
              style={{
                width: `${(1.5 / 24) * 100}%`,
                marginRight: `${(scheduleTimes.wakeHourDec / 24) * 100}%`,
              }}
            />
          </div>

          <svg viewBox={`0 0 ${chartTelemetry.width} ${chartTelemetry.height}`} className="w-full h-64 sm:h-72">
            {/* Horizontal Grid */}
            <line x1="24" y1="40" x2="616" y2="40" stroke="#262626" strokeDasharray="3,3" />
            <line x1="24" y1="100" x2="616" y2="100" stroke="#262626" strokeDasharray="3,3" />
            <line x1="24" y1="160" x2="616" y2="160" stroke="#262626" strokeDasharray="3,3" />
            <line x1="24" y1="220" x2="616" y2="220" stroke="#404040" />

            {/* Hour Markers on X Axis */}
            {[0, 4, 8, 12, 16, 20, 24].map((h) => {
              const x = 24 + (h / 24) * 592;
              return (
                <g key={h}>
                  <line x1={x} y1="220" x2={x} y2="225" stroke="#737373" />
                  <text x={x} y="236" fill="#737373" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    {String(h).padStart(2, '0')}:00
                  </text>
                </g>
              );
            })}

            {/* Wake Line Indicator */}
            {(() => {
              const xWake = 24 + (scheduleTimes.wakeHourDec / 24) * 592;
              return (
                <g>
                  <line x1={xWake} y1="20" x2={xWake} y2="220" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,4" />
                  <text x={xWake + 4} y="32" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    יקיצה ({wakeTime})
                  </text>
                </g>
              );
            })()}

            {/* Cutoff Line Indicator */}
            {(() => {
              const [sH, sM] = scheduleTimes.cutoffTimeStr.split(':').map(Number);
              const cutDec = (sH + sM / 60) % 24;
              const xCut = 24 + (cutDec / 24) * 592;
              return (
                <g>
                  <line x1={xCut} y1="20" x2={xCut} y2="220" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,4" />
                  <text x={xCut - 65} y="32" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    סף שינה ({scheduleTimes.cutoffTimeStr})
                  </text>
                </g>
              );
            })()}

            {/* Curves */}
            {/* Cortisol (Amber) */}
            <path d={chartTelemetry.cortisolPath} fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
            {/* Adenosine Blockade (Purple) */}
            <path d={chartTelemetry.adenosinePath} fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,4" />
            {/* Caffeine in Blood (Cyan) */}
            <path d={chartTelemetry.caffeinePath} fill="none" stroke="#06b6d4" strokeWidth="3" />

            {/* Hover Scrubber Line */}
            {hoverHour !== null && (
              <line
                x1={24 + (hoverHour / 24) * 592}
                y1="20"
                x2={24 + (hoverHour / 24) * 592}
                y2="220"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            )}
          </svg>

          {/* Hover Real-Time Inspection HUD */}
          {hoveredMetrics && (
            <div className="absolute top-4 left-4 p-3 rounded-xl bg-stone-900/95 border border-amber-500/50 backdrop-blur-xl text-xs font-mono shadow-2xl space-y-1">
              <div className="text-stone-100 font-bold border-b border-stone-800 pb-1">
                ⏱️ שעה בגרף: {hoveredMetrics.timeStr}
              </div>
              <div className="text-amber-400">קורטיזול טבעי: {hoveredMetrics.cortisol}%</div>
              <div className="text-cyan-400">קפאין בפלזמה: {hoveredMetrics.caffeine} mg</div>
              <div className="text-purple-400">חסימת אדנוזין: {hoveredMetrics.adenosine}%</div>
            </div>
          )}
        </div>

        {/* Biological Zones Advice Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sun className="w-4 h-4" />
              <span>0-90 דקות מהיקיצה ({scheduleTimes.peakStart} - {scheduleTimes.optimalTimeStr})</span>
            </div>
            <p className="text-stone-300">
              שיא קורטיזול טבעי (CAR). שתיית קפאין כעת יוצרת סבילות ומגבירה התרסקות בשעות הצהריים.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>חלון הזהב האופטימלי ({scheduleTimes.optimalTimeStr} - {scheduleTimes.slumpTimeStr})</span>
            </div>
            <p className="text-stone-300">
              הקורטיזול יורד. זהו הזמן המושלם ללגימת אספרסו כפול או פילטר V60 לחידוד מקסימלי.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-1">
            <div className="font-bold text-rose-300 flex items-center gap-1.5">
              <Moon className="w-4 h-4" />
              <span>לאחר סף השינה ({scheduleTimes.cutoffTimeStr}+)</span>
            </div>
            <p className="text-stone-300">
              חסימת קפאין לשמירה על שלב שנת גלים איטיים (SWS) וסירקולציית מלטונין תקינה.
            </p>
          </div>
        </div>
      </div>

      {/* Controls & Dose Logger Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dose Logger & Quick Add Presets (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 p-6 rounded-3xl bg-stone-900/90 border border-stone-800 backdrop-blur-2xl shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-stone-100">תיעוד והוספת מנות קפאין להיום</span>
            </div>
            <span className="text-xs font-mono text-stone-400">סה״כ: {totalDailyCaffeineMg} / 400 mg</span>
          </div>

          {/* Quick Add Presets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { name: 'Single Espresso', hebrew: 'אספרסו קצר', mg: 63 },
              { name: 'Double Espresso', hebrew: 'אספרסו כפול', mg: 126 },
              { name: 'V60 Pour-Over', hebrew: 'פילטר V60', mg: 145 },
              { name: 'Cold Brew Nitro', hebrew: 'קולד ברו ניטרו', mg: 210 },
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleAddDose(preset.name, preset.hebrew, preset.mg)}
                className="p-3 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 text-right transition-all group active:scale-95"
              >
                <div className="text-xs font-bold text-stone-200 group-hover:text-amber-400">{preset.hebrew}</div>
                <div className="text-[10px] text-stone-400 font-mono mt-0.5">{preset.mg} mg קפאין</div>
              </button>
            ))}
          </div>

          {/* Doses List */}
          <div className="space-y-2 pt-2">
            <span className="text-xs text-stone-400 font-bold block">מנות מתועדות בגרף:</span>
            {doses.map((dose) => (
              <div
                key={dose.id}
                className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Coffee className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-stone-100">{dose.hebrewName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {dose.caffeineMg} mg
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <input
                    type="time"
                    value={dose.timeTaken}
                    onChange={(e) => handleUpdateTime(dose.id, e.target.value)}
                    className="px-2 py-1 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => handleRemoveDose(dose.id)}
                    className="p-1 rounded-lg hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Bio-Schedule & CYP1A2 Metabolic Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 p-6 rounded-3xl bg-stone-900/90 border border-cyan-500/30 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-stone-100">הגדרות ביולוגיות & קצב מטבוליזם</span>
            </div>

            {/* Wake / Sleep Time Pickers */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-400 font-mono mb-1">שעת יקיצה</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-amber-500/40 text-amber-300 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-400 font-mono mb-1">שעת שינה מתוכננת</label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* CYP1A2 Rate Selector */}
            <div className="space-y-1.5 text-xs font-mono">
              <label className="text-stone-300 block">קצב פירוק קפאין בכבד (אנזים CYP1A2):</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'FAST', label: 'מהיר (3.8h)' },
                  { id: 'AVERAGE', label: 'ממוצע (5.2h)' },
                  { id: 'SLOW', label: 'איטי (7.2h)' },
                ].map((rate) => (
                  <button
                    key={rate.id}
                    onClick={() => {
                      setMetabolism(rate.id as MetabolismRate);
                      coffeeSound.playBaristaClick();
                    }}
                    className={`py-2 rounded-xl font-bold transition-all text-center ${
                      metabolism === rate.id
                        ? 'bg-cyan-500 text-stone-950 shadow-sm'
                        : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {rate.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Body Weight Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                <span>משקל גוף (לחישוב ספיגת קפאין)</span>
                <span className="text-emerald-400 font-bold">{userWeightKg} ק״ג</span>
              </div>
              <input
                type="range"
                min="45"
                max="130"
                value={userWeightKg}
                onChange={(e) => setUserWeightKg(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          {/* Recommendation Summary */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1 text-xs">
            <div className="text-stone-300 font-bold">סיכום התאמה אישית:</div>
            <p className="text-stone-400">
              מומלץ ללגום את הקפה הבא עד <span className="text-rose-400 font-bold font-mono">{scheduleTimes.cutoffTimeStr}</span> כדי להבטיח שרמת הקפאין בדם תרד מתחת ל-30mg לפני שעת השינה שלך ב-{sleepTime}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
