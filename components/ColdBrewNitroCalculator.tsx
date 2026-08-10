'use client';

import React, { useState, useEffect } from 'react';
import {
  Snowflake,
  Timer,
  Gauge,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Thermometer,
  Activity,
  CheckCircle2,
  Sliders,
  Info,
  Droplets,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export function ColdBrewNitroCalculator() {
  const [steepHours, setSteepHours] = useState<number>(16);
  const [coffeeGrams, setCoffeeGrams] = useState<number>(100);
  const [steepTempCelsius, setSteepTempCelsius] = useState<number>(4); // 2°C to 18°C
  const [targetTdsPct, setTargetTdsPct] = useState<number>(1.40); // 1.10% to 1.80%
  const [ratioType, setRatioType] = useState<'concentrate' | 'ready'>('concentrate');
  const [isNitro, setIsNitro] = useState<boolean>(true);
  const [nitroPsi, setNitroPsi] = useState<number>(38);

  // Timer logic
  const [secondsRemaining, setSecondsRemaining] = useState<number>(16 * 3600);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const ratioMultiplier = ratioType === 'concentrate' ? 8 : 12;
  const totalWaterMl = coffeeGrams * ratioMultiplier;

  // Refractometer extraction calculations
  // Extraction Yield EY% = (TDS% * Water Mass g) / Coffee Mass g
  const calculatedEyPct = Number(((targetTdsPct * totalWaterMl) / coffeeGrams).toFixed(1));
  const brixSugarDegree = Number((targetTdsPct * 0.85).toFixed(2));

  // Temperature effect feedback
  const getTempProfileDesc = (temp: number) => {
    if (temp <= 4) {
      return {
        label: 'מקרר אולטרה-קר (2°C-4°C)',
        notes: 'חליטה איטית, מיצוי חלק ונטול מרירות לחלוטין, מתיקות צלולה.',
        speedMultiplier: '1.0x',
      };
    } else if (temp <= 10) {
      return {
        label: 'מקרר יינות / מרתף (5°C-10°C)',
        notes: 'איזון מעולה בין שמנים ארומטיים עדינים לחמיצות תפוח קלה.',
        speedMultiplier: '1.25x',
      };
    } else {
      return {
        label: 'טמפרטורת חדר מבוקרת (11°C-18°C)',
        notes: 'מיצוי מהיר ועוצמתי של גוף הקפה, שוקולד מריר ותבלינים חמים.',
        speedMultiplier: '1.6x',
      };
    }
  };

  const tempProfile = getTempProfileDesc(steepTempCelsius);

  // Status for TDS Gold Standard (1.35% - 1.45% for Cold Brew)
  const isTdsGoldCup = targetTdsPct >= 1.35 && targetTdsPct <= 1.45;

  useEffect(() => {
    if (!isRunning) {
      setSecondsRemaining(steepHours * 3600);
    }
  }, [steepHours, isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            coffeeSound.playTimerAlertSound();
            coffeeSound.speakHebrew('חליטת הקולד ברו מוכנה להגשה! בתיאבון');
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="cold-brew-calculator" dir="rtl" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#06151c] via-[#091f2a] to-[#040c12] border border-cyan-500/30 p-6 sm:p-10 overflow-hidden shadow-[0_20px_60px_rgba(6,182,212,0.15)]">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono tracking-wide">
              <Snowflake className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span>PRECISION COLD BREW REFRACTOMETER & TEMP MODULATOR</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              רפרקטומטר Cold Brew & מודולטור טמפרטורה
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              חישוב מדויק של אחוז מוצקים מומסים (TDS 1.35%-1.45%), ניטור אחוז מיצוי (EY%), בקרת טמפרטורת השריה מדויקת (2°C - 18°C), והזרקת חנקן Nitro Cascade.
            </p>
          </div>

          {/* Gold Cup Indicator Badge */}
          <div className="shrink-0 p-5 rounded-2xl bg-black/50 border border-cyan-500/40 backdrop-blur-xl flex flex-col items-center justify-center text-center min-w-[210px]">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2 shadow-lg shadow-cyan-500/20">
              <Activity className="w-8 h-8" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{targetTdsPct.toFixed(2)}% TDS</div>
            <div
              className={`text-xs font-bold tracking-wider mt-0.5 ${
                isTdsGoldCup ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isTdsGoldCup ? '★ GOLD SWEET SPOT ★' : 'CUSTOM TDS LEVEL'}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">יחס מיצוי EY: {calculatedEyPct}%</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls - 7 Cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Coffee Grams & Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800 space-y-2">
              <label className="block text-xs font-semibold text-stone-300">
                משקל פולי קפה (גרם):
              </label>
              <input
                type="number"
                min="20"
                max="500"
                step="10"
                value={coffeeGrams}
                onChange={(e) => setCoffeeGrams(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 font-mono text-sm font-bold focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800 space-y-2">
              <label className="block text-xs font-semibold text-stone-300">
                סוג המיצוי והיחס:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setRatioType('concentrate');
                    coffeeSound.playBaristaClick();
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    ratioType === 'concentrate'
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-stone-900 border border-stone-800 text-stone-400'
                  }`}
                >
                  רכז עוצמתי (1:8)
                </button>
                <button
                  onClick={() => {
                    setRatioType('ready');
                    coffeeSound.playBaristaClick();
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    ratioType === 'ready'
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-stone-900 border border-stone-800 text-stone-400'
                  }`}
                >
                  מוכן לשתייה (1:12)
                </button>
              </div>
            </div>
          </div>

          {/* Steeping Hours Slider */}
          <div className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-300 flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-cyan-400" />
                זמן השריה (שעות):
              </span>
              <span className="text-cyan-400 font-mono font-bold text-sm">{steepHours} שעות</span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              step="1"
              value={steepHours}
              onChange={(e) => setSteepHours(Number(e.target.value))}
              className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Temperature Modulator Slider (2°C - 18°C) */}
          <div className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-300 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                טמפרטורת השריה ומודולציה תרמית:
              </span>
              <span className="text-cyan-400 font-mono font-bold text-sm">{steepTempCelsius}°C</span>
            </div>
            <input
              type="range"
              min="2"
              max="18"
              step="1"
              value={steepTempCelsius}
              onChange={(e) => setSteepTempCelsius(Number(e.target.value))}
              className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="p-3 rounded-xl bg-black/40 border border-stone-800/80 text-xs text-stone-300 space-y-1">
              <div className="font-bold text-cyan-300">{tempProfile.label}</div>
              <div className="text-[11px] text-stone-400">{tempProfile.notes}</div>
            </div>
          </div>

          {/* TDS Optical Refractometer Slider (1.10% - 1.80%) */}
          <div className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                רפרקטומטר אופטי - יעד מוצקים מומסים (TDS%):
              </span>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                {targetTdsPct.toFixed(2)}% TDS ({brixSugarDegree}° Brix)
              </span>
            </div>
            <input
              type="range"
              min="1.10"
              max="1.80"
              step="0.01"
              value={targetTdsPct}
              onChange={(e) => setTargetTdsPct(Number(e.target.value))}
              className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span>1.10% (קל/בהיר)</span>
              <span className="text-emerald-400 font-bold">1.35% - 1.45% (SCA Gold Standard)</span>
              <span>1.80% (רכז עמוק)</span>
            </div>
          </div>

          {/* Nitro Gas Toggle */}
          <div className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                הזרקת חנקן מיקרוסקופית (Nitro Infusion Cascade)
              </span>
              <button
                onClick={() => {
                  setIsNitro(!isNitro);
                  coffeeSound.playBaristaClick();
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isNitro
                    ? 'bg-cyan-500 text-stone-950 shadow-md shadow-cyan-500/25'
                    : 'bg-stone-800 text-stone-400'
                }`}
              >
                {isNitro ? 'פעיל (Nitro On)' : 'כבוי (Cold Brew רגיל)'}
              </button>
            </div>

            {isNitro && (
              <div className="space-y-2 pt-2 border-t border-stone-800/80">
                <div className="flex justify-between text-xs text-stone-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    לחץ הזרקה (PSI):
                  </span>
                  <span className="text-cyan-400 font-mono font-bold">{nitroPsi} PSI</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="50"
                  step="1"
                  value={nitroPsi}
                  onChange={(e) => setNitroPsi(Number(e.target.value))}
                  className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Live Timer & Telemetry Card - 5 Cols */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#07131b] via-[#091b26] to-[#050e14] rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl space-y-6 text-center">
          <div className="space-y-1 pb-4 border-b border-stone-800">
            <span className="text-[11px] text-stone-400 uppercase tracking-widest block font-bold">
              נפח מים מזוקקים / מסוננים:
            </span>
            <span className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono">
              {totalWaterMl} מ"ל
            </span>
            <div className="text-xs text-stone-400">יחס השריה 1:{ratioMultiplier}</div>
          </div>

          {/* Live Countdown Clock */}
          <div className="p-6 rounded-2xl bg-black/60 border border-cyan-500/40 space-y-3 relative shadow-inner">
            <span className="text-xs font-semibold text-cyan-300 block flex items-center justify-center gap-1.5">
              <Timer className="w-4 h-4 text-cyan-400" />
              טיימר השריה אלקטרוני:
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-cyan-400 tracking-wider">
              {formatTime(secondsRemaining)}
            </div>

            {/* Timer Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  const nextState = !isRunning;
                  setIsRunning(nextState);
                  if (nextState) {
                    coffeeSound.playCoffeeSteam();
                    coffeeSound.speakHebrew('טיימר חליטה קרה הופעל');
                  } else {
                    coffeeSound.playBaristaClick();
                    coffeeSound.speakHebrew('השהיית טיימר');
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-stone-950 font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>השהה</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>התחל השריה</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  coffeeSound.playBaristaClick();
                  coffeeSound.speakHebrew('איפוס טיימר');
                  setIsRunning(false);
                  setSecondsRemaining(steepHours * 3600);
                }}
                className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
                title="איפוס טיימר"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Precision Yield Telemetry Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-stone-800 text-right">
              <div className="text-stone-400 text-[11px]">אחוז מיצוי (EY%):</div>
              <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">{calculatedEyPct}%</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-stone-800 text-right">
              <div className="text-stone-400 text-[11px]">רמת מתיקות Brix:</div>
              <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">{brixSugarDegree}° Bx</div>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 leading-relaxed bg-black/30 p-3 rounded-xl border border-stone-800/60">
            💡 <strong>טיפ חליטה מקצועי:</strong> טחינה גסה מאוד (Extra Coarse 1000µm) וטמפרטורת {steepTempCelsius}°C שומרת על שמנים נדיפים ללא מיצוי חומצות שומן כבדות.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ColdBrewNitroCalculator;
