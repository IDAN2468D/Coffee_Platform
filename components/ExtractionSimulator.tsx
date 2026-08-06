'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity, Gauge, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

export const ExtractionSimulator: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  const maxSeconds = 28;

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds < maxSeconds) {
      interval = setInterval(() => {
        setSeconds((sec) => sec + 1);
      }, 1000);
    } else if (seconds >= maxSeconds) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleSim = () => setIsActive(!isActive);
  const resetSim = () => {
    setIsActive(false);
    setSeconds(0);
  };

  // Calculate current pressure (Bar) based on time curve
  let currentPressure = 0;
  let currentPhase = 'מוכן להתחלה';
  let phaseColor = 'text-stone-400';

  if (seconds > 0 && seconds <= 5) {
    // Pre-infusion 0-5s -> 2.0 Bar
    currentPressure = 2.0;
    currentPhase = '💧 Pre-Infusion (רטיבות ראשונית ב-2.0 Bar)';
    phaseColor = 'text-cyan-400';
  } else if (seconds > 5 && seconds <= 12) {
    // Ramp up 5-12s -> 2.0 to 9.0 Bar
    currentPressure = Number((2.0 + ((seconds - 5) / 7) * 7.0).toFixed(1));
    currentPhase = '📈 Ramp Up (עלייה הדרגתית מ-2.0 ל-9.0 Bar)';
    phaseColor = 'text-amber-400';
  } else if (seconds > 12 && seconds <= 22) {
    // Flat 12-22s -> 9.0 Bar
    currentPressure = 9.0;
    currentPhase = '⚡ Flat 9Bar Extraction (מיצוי שיא אחיד)';
    phaseColor = 'text-emerald-400';
  } else if (seconds > 22 && seconds <= 28) {
    // Taper 22-28s -> 9.0 down to 6.0 Bar
    currentPressure = Number((9.0 - ((seconds - 22) / 6) * 3.0).toFixed(1));
    currentPhase = '📉 Taper Down (הורדת לחץ ל-6.0 Bar למניעת מרירות)';
    phaseColor = 'text-amber-300';
  } else if (seconds >= 28) {
    currentPressure = 0;
    currentPhase = '☕ מיצוי האספרסו הושלם בהצלחה!';
    phaseColor = 'text-emerald-400';
  }

  // Calculate Crema Density Index (CDI): CDI = 100 - (|Actual Pressure - 9.0| * 8) - (|Brew Time - 28| * 2)
  const timeDiff = Math.abs(seconds - 28);
  const pressureDiff = Math.abs(currentPressure - 9.0);
  const rawCDI = 100 - (pressureDiff * 8) - (timeDiff * 1.5);
  const cdiIndex = seconds > 0 ? Math.max(0, Math.min(100, Math.round(rawCDI))) : 98;

  return (
    <section id="extraction-sim" className="w-full py-16 bg-stone-950/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Activity className="w-3.5 h-3.5" />
            Flow Profiling 9Bar Pressure Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 mb-4">
            סימולטור חליטת אספרסו <span className="text-gold-gradient">בלחץ משתנה 9Bar</span>
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            עקומת הלחץ המדויקת למניעת מיצוי יתר (Over-extraction) ומרירות. חווה את פאזת ה-Pre-infusion, ה-Ramp Up, וחישוב **מדד דחיסות הקרמה (CDI)** בזמן אמת.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Pressure & CDI Gauges Display */}
          <div className="lg:col-span-6 liquid-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <span className="text-xs font-bold text-stone-300 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-500" />
                מד לחץ חליטה (Bar Pressure Gauge)
              </span>
              <span className="text-xs font-mono bg-stone-900 text-amber-400 px-3 py-1 rounded-full border border-stone-800">
                זמן: {seconds}s / 28s
              </span>
            </div>

            {/* Pressure Numerical Gauge */}
            <div className="text-center py-4 space-y-2">
              <span className="text-6xl sm:text-7xl font-black font-mono text-gold-gradient tracking-tight">
                {currentPressure.toFixed(1)}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                BAR PRESSURE
              </span>
            </div>

            {/* Live Phase Indicator */}
            <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 text-center space-y-1">
              <span className="text-xs text-stone-400 block">סטטוס פאזה נוכחית:</span>
              <h4 className={`text-sm font-extrabold ${phaseColor}`}>{currentPhase}</h4>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={toggleSim}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4 fill-stone-950" />
                    <span>השהה סימולטור</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-stone-950" />
                    <span>התחל סימולציית 9Bar</span>
                  </>
                )}
              </button>

              <button
                onClick={resetSim}
                className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-100 hover:border-stone-700 transition-all"
                title="איפוס"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Crema Density Index (CDI) & Curve Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            {/* CDI Card */}
            <div className="liquid-glass rounded-3xl p-6 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-300">מדד דחיסות הקרמה (CDI - Crema Density Index):</span>
                <span className="text-emerald-400 font-mono font-black text-xl">
                  {cdiIndex} / 100
                </span>
              </div>

              <div className="w-full bg-stone-900 h-3 rounded-full overflow-hidden border border-stone-800">
                <div
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${cdiIndex}%` }}
                />
              </div>

              <p className="text-xs text-stone-400 leading-relaxed">
                נוסחת ה-CDI מחושבת בזמן אמת לפי הסטייה מלחץ השיא (9.0 Bar) ומזמן החליטה האופטימלי (28 שניות).
              </p>
            </div>

            {/* Pressure Phases Info List */}
            <div className="space-y-3">
              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 flex items-start gap-3">
                <span className="text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded">0s-5s</span>
                <div>
                  <h4 className="text-xs font-bold text-stone-200">Pre-Infusion בלחץ 2.0 Bar</h4>
                  <p className="text-[11px] text-stone-400">הרטבת עוגת הקפה בלחץ נמוך למניעת Channeling והבטחת מיצוי אחיד.</p>
                </div>
              </div>

              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 flex items-start gap-3">
                <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-1 rounded">5s-12s</span>
                <div>
                  <h4 className="text-xs font-bold text-stone-200">Ramp Up לשיא של 9.0 Bar</h4>
                  <p className="text-[11px] text-stone-400">עלייה הדרגתית בלחץ לפתיחת השמנים הארומטיים וייצור הקרמה המוזהבת.</p>
                </div>
              </div>

              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 flex items-start gap-3">
                <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">12s-22s</span>
                <div>
                  <h4 className="text-xs font-bold text-stone-200">Flat 9Bar Peak Extraction</h4>
                  <p className="text-[11px] text-stone-400">חליטה יציבה בלחץ השיא למיצוי הטעמים העמוקים והמתוקים של הפול.</p>
                </div>
              </div>

              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 flex items-start gap-3">
                <span className="text-xs font-mono font-bold bg-amber-300/10 text-amber-300 px-2 py-1 rounded">22s-28s</span>
                <div>
                  <h4 className="text-xs font-bold text-stone-200">Taper Down ל-6.0 Bar</h4>
                  <p className="text-[11px] text-stone-400">הורדת לחץ בסיום החליטה כדי למנוע מרירות יתר בסוף המנה.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
