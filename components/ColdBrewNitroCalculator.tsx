'use client';

import React, { useState, useEffect } from 'react';
import { Snowflake, Timer, Gauge, Zap, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export function ColdBrewNitroCalculator() {
  const [steepHours, setSteepHours] = useState<number>(16);
  const [coffeeGrams, setCoffeeGrams] = useState<number>(100);
  const [ratioType, setRatioType] = useState<'concentrate' | 'ready'>('concentrate');
  const [isNitro, setIsNitro] = useState<boolean>(true);
  const [nitroPsi, setNitroPsi] = useState<number>(38);

  // Timer logic
  const [secondsRemaining, setSecondsRemaining] = useState<number>(16 * 3600);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // When steeping hours change, reset initial seconds
  const ratioMultiplier = ratioType === 'concentrate' ? 8 : 12;
  const totalWaterMl = coffeeGrams * ratioMultiplier;

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
    <section id="cold-brew-calculator" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <Snowflake className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              מחשבון חליטה קרה ומיצוי בחנקן
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-cyan-gradient tracking-tight">
              מחשבון Cold Brew & Nitro Infusion
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              חשב יחסי השריה מדויקים, טמפרטורה ולחץ חנקן למיצוי קר קטיפתי ועשיר בבועות.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls - 7 Cols */}
          <div className="lg:col-span-7 space-y-6">
            {/* Coffee Amount & Ratio */}
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
                    onClick={() => setRatioType('concentrate')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      ratioType === 'concentrate'
                        ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                        : 'bg-stone-900 border border-stone-800 text-stone-400'
                    }`}
                  >
                    רכז (1:8)
                  </button>
                  <button
                    onClick={() => setRatioType('ready')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      ratioType === 'ready'
                        ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                        : 'bg-stone-900 border border-stone-800 text-stone-400'
                    }`}
                  >
                    לשתייה (1:12)
                  </button>
                </div>
              </div>
            </div>

            {/* Steeping Hours Slider */}
            <div className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-cyan-400" />
                  זמן השריה במקרר (שעות):
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

            {/* Nitro Gas Toggle */}
            <div className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  הזרקת חנקן (Nitro Cascade)
                </span>
                <button
                  onClick={() => setIsNitro(!isNitro)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isNitro
                      ? 'bg-cyan-500 text-stone-950'
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

          {/* Outputs & Live Timer - 5 Cols */}
          <div className="lg:col-span-5 bg-gradient-to-b from-stone-900/90 to-stone-950/90 rounded-2xl p-6 border border-cyan-500/20 shadow-xl space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-[11px] text-stone-400 uppercase tracking-widest block font-bold">
                כמות המים הנדרשת (מים מסוננים קרים):
              </span>
              <span className="text-3xl font-black text-cyan-300 font-mono">
                {totalWaterMl} מ"ל
              </span>
            </div>

            {/* Countdown Display */}
            <div className="p-6 rounded-2xl bg-stone-950 border border-cyan-500/30 space-y-3 relative">
              <span className="text-xs font-semibold text-stone-400 block">
                טיימר השריה בלייב:
              </span>
              <div className="text-4xl sm:text-5xl font-black font-mono text-cyan-400 tracking-wider">
                {formatTime(secondsRemaining)}
              </div>

              {/* Timer Buttons */}
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
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-stone-950 font-black text-xs hover:bg-cyan-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>השהה</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>התחל טיימר</span>
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
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              * מומלץ להשתמש בטחינה גסה מאוד (Extra Coarse) ולסנן פעמיים עם פילטר נייר בסיום ההשריה.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
