'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Volume2,
  ShieldCheck,
  Gauge,
  Sparkles,
  Clock,
  Flame,
  CheckCircle2,
  RefreshCw,
  Info,
  Layers,
  ArrowLeft,
  Sliders,
  Wind,
  Coffee,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface CoffeeBeanPreset {
  id: string;
  name: string;
  hebrewName: string;
  origin: string;
  initialAcidity: number; // pH or Tannic score (e.g. 8.4 harsh)
  roastDate: string;
  aromaNotes: string[];
}

const BEAN_PRESETS: CoffeeBeanPreset[] = [
  {
    id: 'ethiopia-yirgacheffe',
    name: 'Ethiopia Yirgacheffe Organic',
    hebrewName: 'אתיופיה ירגשף אורגני',
    origin: 'ארץ מקור: אתיופיה (2,100 מטר)',
    initialAcidity: 8.4,
    roastDate: 'לפני יומיים',
    aromaNotes: ['פרחי יסמין', 'הדרים תוססים', 'חומציות טאנית גבוהה'],
  },
  {
    id: 'colombia-supremo',
    name: 'Colombia Supremo Huila',
    hebrewName: 'קולומביה סופרמו וילה',
    origin: 'ארץ מקור: קולומביה (1,800 מטר)',
    initialAcidity: 7.2,
    roastDate: 'אתמול',
    aromaNotes: ['פירות יער', 'חומציות תפוח ירוק', 'קרמל מתוק'],
  },
  {
    id: 'panama-geisha',
    name: 'Panama Geisha Reserve',
    hebrewName: 'פנמה גיישה רזרב',
    origin: 'ארץ מקור: פנמה (1,950 מטר)',
    initialAcidity: 8.8,
    roastDate: 'היום בבוקר',
    aromaNotes: ['ברגמוט עדין', 'משמש', 'חומציות פירותית גבוהה'],
  },
];

export const UltrasonicBeanAging: React.FC = () => {
  const [selectedBean, setSelectedBean] = useState<CoffeeBeanPreset>(BEAN_PRESETS[0]);
  const [frequency, setFrequency] = useState<number>(38); // kHz (20-50 kHz)
  const [chamberHours, setChamberHours] = useState<number>(36); // 12-48h simulation
  const [isUltrasoundActive, setIsUltrasoundActive] = useState<boolean>(false);
  const [vacuumPressure, setVacuumPressure] = useState<number>(94); // % vacuum (0-100)
  const [isPumpActive, setIsPumpActive] = useState<boolean>(false);
  const [agedAcidity, setAgedAcidity] = useState<number>(selectedBean.initialAcidity);
  const [acidityReductionPercent, setAcidityReductionPercent] = useState<number>(0);
  const [preservationMonths, setPreservationMonths] = useState<number>(6);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Recalculate acidity reduction on parameter changes
  useEffect(() => {
    // Ultrasonic formula: High frequency (35-42kHz optimal) + Chamber Hours (24-48h) reduces harsh tannic acid by up to 45%
    const freqFactor = Math.sin(((frequency - 20) / 30) * Math.PI) * 0.25 + 0.75;
    const timeFactor = (chamberHours / 48) * 0.45;
    const maxReduction = Math.min(0.45, freqFactor * timeFactor);

    const calculatedReduction = Math.round(maxReduction * 100);
    const newAcidity = Number((selectedBean.initialAcidity * (1 - maxReduction)).toFixed(1));

    setAcidityReductionPercent(calculatedReduction);
    setAgedAcidity(newAcidity);

    // Vacuum seal integrity effect on aroma preservation months
    const calculatedMonths = Number(((vacuumPressure / 100) * 6.5).toFixed(1));
    setPreservationMonths(calculatedMonths);
  }, [frequency, chamberHours, selectedBean, vacuumPressure]);

  // Ultrasonic Canvas Acoustic Wave Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw acoustic wave grid
      ctx.strokeStyle = isUltrasoundActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw primary ultrasonic frequency wave
      const waveAmplitude = isUltrasoundActive ? 25 + Math.sin(step * 0.1) * 8 : 6;
      const waveSpeed = isUltrasoundActive ? frequency * 0.08 : 0.02;

      ctx.beginPath();
      ctx.lineWidth = isUltrasoundActive ? 3 : 1.5;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#f59e0b');
      gradient.addColorStop(0.5, '#10b981');
      gradient.addColorStop(1, '#06b6d4');
      ctx.strokeStyle = gradient;

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * (frequency * 0.003) + step * waveSpeed) * waveAmplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw harmonic resonance wave
      if (isUltrasoundActive) {
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.cos(x * (frequency * 0.005) - step * waveSpeed * 1.5) * (waveAmplitude * 0.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      step += 1;
      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [frequency, isUltrasoundActive]);

  const toggleUltrasound = () => {
    coffeeSound.playBaristaClick();
    if (!isUltrasoundActive) {
      coffeeSound.playCoffeeSteam();
    }
    setIsUltrasoundActive(!isUltrasoundActive);
  };

  const handlePumpVacuum = () => {
    coffeeSound.playBaristaClick();
    setIsPumpActive(true);
    let currentP = vacuumPressure;
    const interval = setInterval(() => {
      currentP = Math.min(100, currentP + 2);
      setVacuumPressure(currentP);
      if (currentP >= 99) {
        clearInterval(interval);
        setIsPumpActive(false);
        coffeeSound.playSuccessChime();
      }
    }, 100);
  };

  const handleReleaseVacuum = () => {
    coffeeSound.playBaristaClick();
    setVacuumPressure(25);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 dir-rtl text-stone-100">
      {/* Top Banner Header */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>תא יישון אולטרסוני & ואקום ווקאלי</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-100 tracking-tight">
              AI Ultrasonic Bean Aging <br />
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                תא יישון אולטרסוני & חיישן ואקום מתקדם
              </span>
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              טכנולוגיית גלי קול בתדר גבוה (20kHz-50kHz) המפרקת חומציות טאנית חריפה בפולי קפה טריים
              בשיעור של עד 45% תוך 24-48 שעות בלבד, לצד חיישן ואקום מבוקר לשמירה על ארומה עד 6 חודשים.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-500/30 text-center min-w-[130px]">
              <span className="text-[10px] text-stone-400 font-mono block">הפחתת חומציות</span>
              <span className="text-2xl font-black text-amber-400 font-mono">-{acidityReductionPercent}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-cyan-500/30 text-center min-w-[130px]">
              <span className="text-[10px] text-stone-400 font-mono block">איטום ואקום</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">{vacuumPressure}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Deck + Canvas Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Ultrasonic Chamber Visualizer & Acoustic Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Canvas Wave Visualizer Card */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-2xl space-y-5 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className={`w-5 h-5 ${isUltrasoundActive ? 'text-amber-400 animate-bounce' : 'text-stone-500'}`} />
                <h3 className="text-base font-black text-stone-100">
                  סימולטור גלי קול אולטרסוניים (Acoustic Chamber)
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold ${
                isUltrasoundActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse'
                  : 'bg-stone-800 text-stone-400'
              }`}>
                {isUltrasoundActive ? 'ULTRASONIC ACTIVE' : 'CHAMBER IDLE'}
              </span>
            </div>

            {/* Visualizer Canvas */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-amber-500/20 p-2">
              <canvas
                ref={canvasRef}
                width={600}
                height={180}
                className="w-full h-44 rounded-xl object-cover"
              />
              <div className="absolute top-4 right-4 text-[10px] font-mono text-amber-400 bg-stone-900/90 px-2.5 py-1 rounded-lg border border-amber-500/30">
                תדר קולי: {frequency} kHz
              </div>
              <div className="absolute bottom-4 left-4 text-[10px] font-mono text-cyan-400 bg-stone-900/90 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                זמן יישון בתא: {chamberHours} שעות
              </div>
            </div>

            {/* Acidity Reduction Dynamic Metric Bar */}
            <div className="p-5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-300 font-bold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>מדד חומציות טאנית (pH / Acidity Index)</span>
                </span>
                <span className="text-stone-400 font-mono">
                  {selectedBean.initialAcidity} pH ➔{' '}
                  <strong className="text-amber-400">{agedAcidity} pH</strong>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-stone-900 overflow-hidden p-0.5 border border-stone-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, acidityReductionPercent * 2.2)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>חומציות חריפה מקורית: {selectedBean.initialAcidity}</span>
                <span className="text-emerald-400 font-bold">
                  התרככות טעמים: -{acidityReductionPercent}%
                </span>
              </div>
            </div>

            {/* Ultrasonic Chamber Trigger Button */}
            <button
              onClick={toggleUltrasound}
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${
                isUltrasoundActive
                  ? 'bg-gradient-to-r from-rose-500 to-amber-600 text-white shadow-rose-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:brightness-110 shadow-amber-500/25'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>
                {isUltrasoundActive ? 'עצור הקרנה אולטרסונית' : 'הפעל הקרנת תדר קולי ליישון מהיר'}
              </span>
            </button>
          </div>

          {/* Vacuum Sensor & Integrity Chamber Card */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-stone-100">
                  חיישן ואקום & תאימות שמיטות ארומטית (Vacuum Seal)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {vacuumPressure >= 90 ? 'SEAL PERFECT' : 'PARTIAL SEAL'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
                <span className="text-[11px] text-stone-400 block">עוצמת תא הוואקום</span>
                <div className="text-3xl font-black text-cyan-400 font-mono">
                  {vacuumPressure}%
                </div>
                <p className="text-[10px] text-stone-500">
                  ניקוי חמצן מלא מונע חמצון שמנים אתריים.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
                <span className="text-[11px] text-stone-400 block">משך שימור ארומה מובטח</span>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  {preservationMonths} חודשים
                </div>
                <p className="text-[10px] text-stone-500">
                  שמירה על 98% מטרפני הארומה המקוריים.
                </p>
              </div>
            </div>

            {/* Vacuum Pump Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePumpVacuum}
                disabled={isPumpActive || vacuumPressure >= 99}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-stone-950 font-bold text-xs hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Wind className="w-4 h-4" />
                <span>{isPumpActive ? 'שואב אוויר כעת...' : 'הפעל משאבת ואקום (100%)'}</span>
              </button>

              <button
                onClick={handleReleaseVacuum}
                className="py-3 px-4 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 font-bold text-xs hover:bg-stone-700 transition-all"
              >
                שחרר שסתום לחץ
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Preset Bean Selection & Slider Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preset Bean Selector */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-2xl space-y-4">
            <h3 className="text-base font-black text-stone-100 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-amber-400" />
              <span>בחירת זן פולי קפה ליישון</span>
            </h3>

            <div className="space-y-3">
              {BEAN_PRESETS.map((bean) => {
                const isSelected = selectedBean.id === bean.id;
                return (
                  <button
                    key={bean.id}
                    onClick={() => {
                      coffeeSound.playBaristaClick();
                      setSelectedBean(bean);
                    }}
                    className={`w-full p-4 rounded-2xl border text-right transition-all duration-300 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/70 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                        : 'bg-stone-950/60 border-stone-800 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-stone-100">{bean.hebrewName}</span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        {bean.initialAcidity} pH
                      </span>
                    </div>
                    <p className="text-xs text-stone-400">{bean.origin}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {bean.aromaNotes.map((n) => (
                        <span
                          key={n}
                          className="text-[9px] px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chamber Parameter Sliders */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-2xl space-y-6">
            <h3 className="text-base font-black text-stone-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>הגדרות תדר וזמן יישון</span>
            </h3>

            {/* Ultrasonic Frequency Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-300 font-bold">תדר הקרנה קולית (Ultrasonic Freq)</span>
                <span className="font-mono text-amber-400 font-black">{frequency} kHz</span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                step="1"
                value={frequency}
                onChange={(e) => {
                  coffeeSound.playSliderTick();
                  setFrequency(Number(e.target.value));
                }}
                className="w-full accent-amber-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>20 kHz (תדר נמוך)</span>
                <span className="text-amber-400 font-bold">38 kHz (אופטימלי)</span>
                <span>50 kHz (מקסימלי)</span>
              </div>
            </div>

            {/* Aging Time Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-300 font-bold">משך זמן בתא האולטרסוני</span>
                <span className="font-mono text-amber-400 font-black">{chamberHours} שעות</span>
              </div>
              <input
                type="range"
                min="12"
                max="48"
                step="2"
                value={chamberHours}
                onChange={(e) => {
                  coffeeSound.playSliderTick();
                  setChamberHours(Number(e.target.value));
                }}
                className="w-full accent-amber-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>12 שעות</span>
                <span>24 שעות</span>
                <span>48 שעות (שווי ערך לשבועיים)</span>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/90 leading-relaxed">
                <strong>איך זה עובד?</strong> הגלים האולטרסוניים יוצרים מיקרו-תנודות מבלי לחמם את הפולים,
                ומשחררים גז פחמן דו-חמצני (CO₂) לכוד בצורה מאוזנת ומהירה.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
