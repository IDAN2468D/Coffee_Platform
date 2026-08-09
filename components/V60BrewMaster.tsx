'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flame, Droplets, Clock, Award, Volume2, VolumeX, Smartphone, Activity } from 'lucide-react';

export const V60BrewMaster: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'v60' | 'coldbrew'>('v60');

  // V60 State
  const [coffeeGrams, setCoffeeGrams] = useState<number>(15);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);

  // Cold Brew Calculator State
  const [targetVolumeMl, setTargetVolumeMl] = useState<number>(500);
  const [steepHours, setSteepHours] = useState<number>(14);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const pannerRef = useRef<StereoPannerNode | PannerNode | null>(null);
  const prevStageRef = useRef<number>(-1);

  const waterTotal = coffeeGrams * 15; // 1:15 ratio
  const maxSeconds = 150; // 2:30 minutes

  // Initialize Web Audio Synthesizer for Spatial Pour Pacing
  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playPhaseSound = (freq: number, durationSec: number = 0.3) => {
    if (!audioEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationSec);
    } catch (e) {
      console.warn('Web Audio Playback error:', e);
    }
  };

  const triggerHaptic = (pattern: number | number[]) => {
    if (!hapticEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Haptics not supported or blocked
    }
  };

  // Stage Determination & Triggers
  let currentStageIndex = 0;
  if (seconds > 0 && seconds <= 45) currentStageIndex = 1; // Bloom
  else if (seconds > 45 && seconds <= 75) currentStageIndex = 2; // Pour 1
  else if (seconds > 75 && seconds <= 135) currentStageIndex = 3; // Pour 2
  else if (seconds > 135 && seconds <= 150) currentStageIndex = 4; // Drawdown
  else if (seconds >= 150) currentStageIndex = 5; // Complete

  // Detect Phase Changes for Sound & Haptics
  useEffect(() => {
    if (isActive && currentStageIndex !== prevStageRef.current) {
      prevStageRef.current = currentStageIndex;
      if (currentStageIndex === 1) {
        playPhaseSound(523.25, 0.4); // C5 - Bloom
        triggerHaptic([100, 50, 100]);
      } else if (currentStageIndex === 2) {
        playPhaseSound(659.25, 0.4); // E5 - Pour 1
        triggerHaptic([80, 40, 80]);
      } else if (currentStageIndex === 3) {
        playPhaseSound(783.99, 0.4); // G5 - Pour 2
        triggerHaptic([80, 40, 80]);
      } else if (currentStageIndex === 4) {
        playPhaseSound(880.00, 0.4); // A5 - Drawdown
        triggerHaptic(150);
      } else if (currentStageIndex === 5) {
        playPhaseSound(1046.50, 0.8); // C6 - Gold Cup Complete
        triggerHaptic([200, 100, 200, 100, 300]);
      }
    }
  }, [currentStageIndex, isActive]);

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

  const toggleTimer = () => {
    initAudio();
    if (!isActive && seconds === 0) {
      triggerHaptic(50);
      playPhaseSound(440, 0.2);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    prevStageRef.current = -1;
    triggerHaptic(30);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // V60 4-Phase Calculations & Dynamic Gold Cup TDS Yield Simulator
  let stageTitle = 'מוכן להתחלת V60 Gold Cup';
  let stageDescription = 'לחץ על Play כדי להתחיל את טיימר 4 הפאזות המשודרג.';
  let stageWaterTarget = 0;
  let progressPercent = Math.min((seconds / maxSeconds) * 100, 100);

  // Dynamic TDS Estimated Yield (Target 1.35% Gold Cup)
  const currentTDS = Math.min(1.35, ((seconds / maxSeconds) * 1.35)).toFixed(2);
  const currentExtractionYield = Math.min(20.0, ((seconds / maxSeconds) * 20.0)).toFixed(1);

  if (seconds > 0 && seconds <= 45) {
    stageTitle = '🌸 פאזה 1: פריחה ודגאסינג (0s - 45s)';
    stageDescription = 'מזוג 50 גרם מים ב-93°C בתנועה מעגלית. תפיחת פולי הקפה ושחרור CO2.';
    stageWaterTarget = 50;
  } else if (seconds > 45 && seconds <= 75) {
    stageTitle = '💧 פאזה 2: מזיגה ראשונה במעגלים (45s - 1m 15s)';
    stageDescription = 'מזוג מים בהתמדה ממרכז הפילטר כלפי חוץ עד ל-125 גרם מים.';
    stageWaterTarget = 125;
  } else if (seconds > 75 && seconds <= 135) {
    stageTitle = '✨ פאזה 3: מזיגה שנייה ומרכזית (1m 15s - 2m 15s)';
    stageDescription = 'השלם את המזיגה ל-225 גרם מים (יעד TDS 1.35% במיצוי הזהב).';
    stageWaterTarget = waterTotal;
  } else if (seconds > 135 && seconds <= 150) {
    stageTitle = '⏳ פאזה 4: חלחול סופי (Drawdown 2m 15s - 2m 30s)';
    stageDescription = 'חלחול סופי דרך הנייר היפני המוזהב עד לטיפה האחרונה.';
    stageWaterTarget = waterTotal;
  } else if (seconds >= 150) {
    stageTitle = '☕ חליטת V60 Gold Cup הושלמה!';
    stageDescription = 'הסר את הפילטר, ערבב בעדינות את הקנקן ותהנה מקפה צלול!';
    stageWaterTarget = waterTotal;
  }

  // Cold Brew Drip Rate Formula
  const totalSecondsColdBrew = steepHours * 3600;
  const dropsPerSecond = (targetVolumeMl / totalSecondsColdBrew) * 20;
  const dropsPerMinute = Math.round(dropsPerSecond * 60);
  const secondsBetweenDrops = (1 / dropsPerSecond).toFixed(1);

  return (
    <section id="v60" className="w-full py-16 bg-stone-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Clock className="w-4 h-4 text-amber-400" />
            Gemini Acoustic V60 & Cold Brew Drip Engine v3.5
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 mb-3">
            טיימר חליטת V60 <span className="text-gold-gradient">ומחשבון Cold Brew Drip</span>
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
            טיימר 4 פאזות חכם הכולל סאונד סביבתי (Web Audio API), משוב רטט במעברים (Web Haptics) וסימולטור TDS דינמי.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-stone-900 border border-stone-800 max-w-md w-full">
            <button
              onClick={() => setActiveTab('v60')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'v60'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              טיימר V60 (סאונד & Haptics)
            </button>

            <button
              onClick={() => setActiveTab('coldbrew')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'coldbrew'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Droplets className="w-4 h-4" />
              מחשבון Cold Brew Drip
            </button>
          </div>
        </div>

        {/* Tab 1: V60 Pour-Over Timer */}
        {activeTab === 'v60' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Info & Calculator */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-stone-900/80 p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-bold">משקל הקפה:</span>
                  <span className="text-amber-400 font-mono font-bold text-sm">{coffeeGrams} גרם</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="30"
                  step="1"
                  value={coffeeGrams}
                  onChange={(e) => setCoffeeGrams(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-800/80 text-xs">
                  <div className="flex items-center gap-2 text-stone-300">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span>סה"כ מים (1:15):</span>
                    <span className="text-cyan-400 font-bold font-mono">{waterTotal}g</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>טמפרטורה:</span>
                    <span className="text-amber-400 font-bold font-mono">93°C</span>
                  </div>
                </div>

                {/* Real-Time Extraction & TDS Simulator */}
                <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                      חישוב מיצוי TDS בזמן אמת:
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {currentTDS}% TDS ({currentExtractionYield}% EY)
                    </span>
                  </div>
                  <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500"
                      style={{ width: `${(parseFloat(currentTDS) / 1.35) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Audio & Haptic Controls */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      audioEnabled
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-stone-950/40 border-stone-800 text-stone-500'
                    }`}
                  >
                    {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>סאונד {audioEnabled ? 'פעיל' : 'מושתק'}</span>
                  </button>

                  <button
                    onClick={() => setHapticEnabled(!hapticEnabled)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      hapticEnabled
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-stone-950/40 border-stone-800 text-stone-500'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>רטט {hapticEnabled ? 'פעיל' : 'כבוי'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Timer Display Card */}
            <div className="lg:col-span-7">
              <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 text-center space-y-6 shadow-2xl relative">
                {/* Timer Seconds Circle */}
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      className="text-stone-800"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      className="text-amber-500 transition-all duration-300"
                      strokeWidth="10"
                      strokeDasharray={527}
                      strokeDashoffset={527 - (527 * progressPercent) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl sm:text-5xl font-black font-mono text-gold-gradient tracking-tight">
                      {formatTime(seconds)}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono mt-1">מתוך 2:30 דקות</span>
                  </div>
                </div>

                {/* Current Stage Instruction */}
                <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800/80 space-y-1.5">
                  <h4 className="text-sm font-bold text-amber-400">{stageTitle}</h4>
                  <p className="text-xs text-stone-300 leading-relaxed max-w-md mx-auto">
                    {stageDescription}
                  </p>
                  {stageWaterTarget > 0 && (
                    <span className="inline-block mt-2 text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full">
                      יעד מים נוכחי: {stageWaterTarget}g מים
                    </span>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={toggleTimer}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    {isActive ? (
                      <>
                        <Pause className="w-4 h-4 fill-stone-950" />
                        <span>השהה טיימר</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-stone-950" />
                        <span>התחל 4 פאזות</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetTimer}
                    className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-100 hover:border-stone-700 transition-all"
                    title="איפוס"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cold Brew Drip Rate Calculator */}
        {activeTab === 'coldbrew' && (
          <div className="max-w-3xl mx-auto liquid-glass rounded-3xl p-6 sm:p-8 border border-cyan-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                  מחשבון קצב טיפות Cold Brew Drip
                </h3>
                <p className="text-xs text-stone-400">חישוב לפי נוסחת `Drip Rate = (Target ml) / (Hours * 3600) * 20 drops/ml`</p>
              </div>
              <span className="text-xs font-mono bg-cyan-500/10 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30">
                Coarse 800µm
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Volume Slider */}
              <div className="space-y-2 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-300 font-bold">נפח קפה מבוקש (ml):</span>
                  <span className="text-cyan-400 font-mono font-bold">{targetVolumeMl} מ"ל</span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="1000"
                  step="50"
                  value={targetVolumeMl}
                  onChange={(e) => setTargetVolumeMl(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Hours Slider */}
              <div className="space-y-2 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-300 font-bold">זמן חליטה כולל (שעות):</span>
                  <span className="text-cyan-400 font-mono font-bold">{steepHours} שעות</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="1"
                  value={steepHours}
                  onChange={(e) => setSteepHours(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="bg-stone-950/80 p-6 rounded-2xl border border-cyan-500/40 text-center space-y-4">
              <span className="text-xs text-stone-400 uppercase tracking-widest block font-mono">
                קצב הטיפות המומלץ למתקן החליטה
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800">
                  <span className="text-xs text-stone-400 block mb-1">טיפות לדקה (Drops/min)</span>
                  <span className="text-3xl font-black text-cyan-400 font-mono">{dropsPerMinute}</span>
                </div>

                <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800">
                  <span className="text-xs text-stone-400 block mb-1">מרווח זמן בין טיפות</span>
                  <span className="text-3xl font-black text-amber-400 font-mono">כל {secondsBetweenDrops}s</span>
                </div>
              </div>

              <p className="text-xs text-stone-300 bg-stone-900/40 p-3 rounded-xl border border-stone-800">
                💡 **טיפ ברמאי:** בחליטה קרה של {targetVolumeMl} מ"ל למשך {steepHours} שעות, כוונן את שסתום הטפטוף לטיפה אחת כל {secondsBetweenDrops} שניות לקבלת מרקם קטיפתי ומתיקות טבעית.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

