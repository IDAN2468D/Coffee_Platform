'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Activity,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Gauge,
  Wifi,
  Copy,
  Check,
  Coffee,
  Flame,
  Droplets,
  Layers,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface ProfilePreset {
  id: string;
  name: string;
  hebrewName: string;
  roastTarget: 'LIGHT' | 'MEDIUM' | 'DARK';
  preInfusionBar: number;
  preInfusionSec: number;
  peakBar: number;
  peakSec: number;
  endBar: number;
  endSec: number;
  flowRateMlS: number;
  targetRatio: string;
  description: string;
}

const PRESETS: ProfilePreset[] = [
  {
    id: 'slayer-bloom',
    name: 'Slayer Extended Bloom',
    hebrewName: 'פרופיל בלום מוארך (Slayer)',
    roastTarget: 'LIGHT',
    preInfusionBar: 2.5,
    preInfusionSec: 8,
    peakBar: 9.0,
    peakSec: 16,
    endBar: 5.5,
    endSec: 6,
    flowRateMlS: 1.8,
    targetRatio: '1:2.2 (18g in -> 40g out)',
    description: 'הרטבה איטית במיוחד בלחץ נמוך למיצוי פירותיות בהירה ומניעת צ׳אנלינג בקליית קינמון/סיטי.',
  },
  {
    id: 'lever-declining',
    name: 'Classic Spring Lever Emulation',
    hebrewName: 'אמולציית מנוף איטלקית דועכת',
    roastTarget: 'MEDIUM',
    preInfusionBar: 3.0,
    preInfusionSec: 4,
    peakBar: 9.0,
    peakSec: 14,
    endBar: 5.0,
    endSec: 8,
    flowRateMlS: 2.4,
    targetRatio: '1:2.0 (18g in -> 36g out)',
    description: 'עליית לחץ מהירה ל-9 בר עם ירידה הדרגתית המונעת חילוץ טאנינים ומרירות שרופה בסיום המיצוי.',
  },
  {
    id: 'turbo-shot',
    name: 'Modern Turbo Shot (6-Bar Fast)',
    hebrewName: 'טורבו שוט מהיר 6-Bar',
    roastTarget: 'LIGHT',
    preInfusionBar: 2.0,
    preInfusionSec: 2,
    peakBar: 6.0,
    peakSec: 12,
    endBar: 4.5,
    endSec: 3,
    flowRateMlS: 4.2,
    targetRatio: '1:2.8 (15g in -> 42g out)',
    description: 'טחינה גסה יותר וזרימה גבוהה בלחץ 6 בר קבוע לחילוץ חומצות פרי נקיות ב-16 שניות בלבד.',
  },
  {
    id: 'gentle-dark-roast',
    name: 'Gentle Low-Pressure Dark Roast',
    hebrewName: 'לחץ עדין לקלייה כהה',
    roastTarget: 'DARK',
    preInfusionBar: 2.0,
    preInfusionSec: 6,
    peakBar: 7.0,
    peakSec: 12,
    endBar: 4.0,
    endSec: 6,
    flowRateMlS: 2.0,
    targetRatio: '1:1.8 (20g in -> 36g out)',
    description: 'הגבלת שיא הלחץ ל-7 בר להפחתת טעמי אפר ועשן והבלטת שוקולד מריר וקרמה סמיכה.',
  },
];

export const PressureFlowProfiler: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('slayer-bloom');
  const [doseGrams, setDoseGrams] = useState<number>(18.5);
  const [targetYieldGrams, setTargetYieldGrams] = useState<number>(38);
  const [preInfusionBar, setPreInfusionBar] = useState<number>(2.5);
  const [preInfusionSec, setPreInfusionSec] = useState<number>(8);
  const [peakBar, setPeakBar] = useState<number>(9.0);
  const [peakSec, setPeakSec] = useState<number>(16);
  const [endBar, setEndBar] = useState<number>(5.5);
  const [endSec, setEndSec] = useState<number>(6);

  // Live Simulation state
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [currentExtractionTime, setCurrentExtractionTime] = useState<number>(0);
  const [copiedProfile, setCopiedProfile] = useState<boolean>(false);
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const totalDuration = preInfusionSec + peakSec + endSec;

  const currentPreset = useMemo(() => {
    return PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
  }, [selectedPresetId]);

  // Load Preset
  const handleSelectPreset = (preset: ProfilePreset) => {
    setSelectedPresetId(preset.id);
    setPreInfusionBar(preset.preInfusionBar);
    setPreInfusionSec(preset.preInfusionSec);
    setPeakBar(preset.peakBar);
    setPeakSec(preset.peakSec);
    setEndBar(preset.endBar);
    setEndSec(preset.endSec);
    setIsExtracting(false);
    setCurrentExtractionTime(0);
    coffeeSound.playBaristaClick();
    fetchAiProfileAdvice(preset);
  };

  // Compute instantaneous pressure at time t
  const getPressureAtTime = useCallback(
    (t: number) => {
      if (t <= preInfusionSec) {
        return preInfusionBar;
      }
      const tAfterPre = t - preInfusionSec;
      if (tAfterPre <= 2) {
        // Ramp up to peak
        const ratio = tAfterPre / 2;
        return preInfusionBar + (peakBar - preInfusionBar) * ratio;
      }
      if (tAfterPre <= peakSec) {
        return peakBar;
      }
      const tInEnd = tAfterPre - peakSec;
      if (tInEnd <= endSec) {
        // Declining
        const ratio = tInEnd / endSec;
        return peakBar - (peakBar - endBar) * ratio;
      }
      return 0;
    },
    [preInfusionBar, preInfusionSec, peakBar, peakSec, endBar, endSec]
  );

  // Compute instantaneous flow rate (ml/s) at time t
  const getFlowAtTime = useCallback(
    (t: number) => {
      const p = getPressureAtTime(t);
      if (t <= preInfusionSec) return 1.5;
      if (t <= preInfusionSec + 4) return 2.0;
      // As puck erodes, flow increases unless pressure drops
      const erosionFactor = 1 + (t / totalDuration) * 0.6;
      return Math.min(5.5, (p / 9.0) * 2.8 * erosionFactor);
    },
    [getPressureAtTime, preInfusionSec, totalDuration]
  );

  // Draw Graph on Canvas
  const drawProfilerCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let bar = 0; bar <= 12; bar += 2) {
      const y = h - (bar / 12) * (h - 40) - 20;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();

      // Bar labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${bar}b`, 32, y + 3);
    }

    // Time Vertical Grid
    for (let s = 0; s <= totalDuration; s += 5) {
      const x = 40 + (s / totalDuration) * (w - 60);
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, h - 20);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${s}s`, x, h - 5);
    }

    // 1. Draw Flow Curve (Cyan)
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);
    for (let t = 0; t <= totalDuration; t += 0.2) {
      const flow = getFlowAtTime(t);
      const x = 40 + (t / totalDuration) * (w - 60);
      const y = h - ((flow * 2) / 12) * (h - 40) - 20;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Draw Pressure Curve (Amber Gradient)
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.5;
    for (let t = 0; t <= totalDuration; t += 0.2) {
      const p = getPressureAtTime(t);
      const x = 40 + (t / totalDuration) * (w - 60);
      const y = h - (p / 12) * (h - 40) - 20;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. Current Live Playhead Marker
    if (currentExtractionTime > 0) {
      const liveX = 40 + (Math.min(currentExtractionTime, totalDuration) / totalDuration) * (w - 60);
      const liveP = getPressureAtTime(currentExtractionTime);
      const liveY = h - (liveP / 12) * (h - 40) - 20;

      // Vertical cursor line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(liveX, 20);
      ctx.lineTo(liveX, h - 20);
      ctx.stroke();

      // Glowing dot
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(liveX, liveY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [totalDuration, getPressureAtTime, getFlowAtTime, currentExtractionTime]);

  // Live Extraction Timer Loop
  useEffect(() => {
    let interval: any = null;
    if (isExtracting) {
      interval = setInterval(() => {
        setCurrentExtractionTime((prev) => {
          if (prev >= totalDuration) {
            setIsExtracting(false);
            coffeeSound.playCoffeeSteam();
            return totalDuration;
          }
          return prev + 0.2;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isExtracting, totalDuration]);

  // Redraw canvas on state changes
  useEffect(() => {
    drawProfilerCanvas();
  }, [drawProfilerCanvas, preInfusionBar, preInfusionSec, peakBar, peakSec, endBar, endSec, currentExtractionTime]);

  // Fetch AI advice
  const fetchAiProfileAdvice = async (preset = currentPreset) => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/pressure-profiler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roastLevel: preset.roastTarget,
          doseGrams,
          targetYieldGrams,
          profilePreset: preset.id,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiAdvice(data.data);
      }
    } catch (err) {
      console.warn('AI advice fetch failed', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiProfileAdvice();
  }, []);

  const handleCopyJson = () => {
    const profileJson = {
      name: currentPreset.name,
      hebrewName: currentPreset.hebrewName,
      author: 'The Digital Roast AI 4.0',
      totalDurationSeconds: totalDuration,
      preInfusion: { bar: preInfusionBar, durationSeconds: preInfusionSec },
      peakExtraction: { bar: peakBar, durationSeconds: peakSec },
      decliningFinish: { endBar, durationSeconds: endSec },
      doseGrams,
      targetYieldGrams,
      calculatedEY: aiAdvice?.expectedEyPercent || 21.5,
    };
    navigator.clipboard.writeText(JSON.stringify(profileJson, null, 2));
    setCopiedProfile(true);
    coffeeSound.playBaristaClick();
    setTimeout(() => setCopiedProfile(false), 3000);
  };

  const activePressure = getPressureAtTime(currentExtractionTime);
  const activeFlow = getFlowAtTime(currentExtractionTime);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 dir-rtl text-right font-sans">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#120d0a] via-[#1a120c] to-[#0a0705] border border-cyan-500/30 p-6 sm:p-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-wide">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>REAL-TIME PRESSURE & FLOW PROFILER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-100 tracking-tight leading-tight">
              פרופילר לחץ וזרימה <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">בזמן אמת</span>
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              הדמיה, בנייה וכיול של עקומות לחץ (0-12 bar) וזרימת מים (ml/s) לאספרסו מתקדם (Decent Espresso, Slayer, Sanremo, Synesso), עם מניעת צ׳אנלינג ואופטימיזציית EY% ב-Gemini 3.5 Flash Lite.
            </p>
          </div>

          {/* Quick Gauge telemetry badge */}
          <div className="flex items-center gap-4 bg-stone-950/80 backdrop-blur-xl border-2 border-cyan-500/40 p-5 rounded-2xl shadow-xl shrink-0 font-mono">
            <div className="text-center">
              <div className="text-[10px] text-stone-400">LIVE PRESSURE</div>
              <div className="text-3xl font-black text-amber-400">{activePressure.toFixed(1)} <span className="text-xs">bar</span></div>
            </div>
            <div className="w-px h-10 bg-stone-800" />
            <div className="text-center">
              <div className="text-[10px] text-stone-400">FLOW RATE</div>
              <div className="text-3xl font-black text-cyan-400">{activeFlow.toFixed(1)} <span className="text-xs">ml/s</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-stone-200 font-bold text-sm">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>בחר פרופיל חליטה מקצועי:</span>
          </div>
          <span className="text-xs text-stone-400 font-mono">4 עקומות מכונה</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-mono font-bold text-cyan-300">{preset.roastTarget} ROAST</span>
                  <span className="text-xs font-mono text-stone-400">{preset.targetRatio.split(' ')[0]}</span>
                </div>
                <div className="text-sm font-black text-stone-100">{preset.hebrewName}</div>
                <p className="text-xs text-stone-400 line-clamp-2">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Cockpit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Canvas Visualizer Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-[#0e0a08] border border-cyan-500/30 p-6 space-y-6 shadow-xl backdrop-blur-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>לחץ (Bar)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                  <div className="w-3 h-3 rounded-full bg-cyan-400" />
                  <span>זרימה (ml/s)</span>
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsExtracting(!isExtracting);
                    coffeeSound.playBaristaClick();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                    isExtracting
                      ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30'
                      : 'bg-cyan-500 text-stone-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
                  }`}
                >
                  {isExtracting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isExtracting ? 'עצור חליטה' : 'הפעל סימולציה'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsExtracting(false);
                    setCurrentExtractionTime(0);
                    coffeeSound.playBaristaClick();
                  }}
                  className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-stone-100"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Canvas Graph */}
            <div className="w-full aspect-[16/9] rounded-2xl bg-stone-950 border border-stone-800 p-2 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="w-full h-full object-fill"
              />
            </div>

            {/* Time Telemetry Bar */}
            <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="text-stone-400 text-[10px]">שלב 1: Pre-Infusion</div>
                <div className="text-base font-bold text-amber-300 mt-0.5">{preInfusionSec}s @ {preInfusionBar}b</div>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="text-stone-400 text-[10px]">שלב 2: Peak Extraction</div>
                <div className="text-base font-bold text-cyan-300 mt-0.5">{peakSec}s @ {peakBar}b</div>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="text-stone-400 text-[10px]">שלב 3: Declining Finish</div>
                <div className="text-base font-bold text-stone-200 mt-0.5">{endSec}s @ {endBar}b</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sliders & Parameters Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#0e0a08] border border-cyan-500/30 p-6 space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span>כיול פרמטרי לחץ וזמנים</span>
            </h3>

            {/* Slider 1: Pre-Infusion Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-stone-300">
                <span>לחץ פרה-אינפיוז'ן (Pre-Infusion):</span>
                <span className="font-mono text-cyan-400">{preInfusionBar.toFixed(1)} bar ({preInfusionSec}s)</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="4.0"
                step="0.1"
                value={preInfusionBar}
                onChange={(e) => setPreInfusionBar(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Slider 2: Peak Extraction Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-stone-300">
                <span>שיא לחץ מיצוי (Peak Pressure):</span>
                <span className="font-mono text-amber-400">{peakBar.toFixed(1)} bar ({peakSec}s)</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="11.0"
                step="0.2"
                value={peakBar}
                onChange={(e) => setPeakBar(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Slider 3: Declining Finish Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-stone-300">
                <span>לחץ דעיכה בסיום (Declining Bar):</span>
                <span className="font-mono text-teal-400">{endBar.toFixed(1)} bar ({endSec}s)</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="8.0"
                step="0.2"
                value={endBar}
                onChange={(e) => setEndBar(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            {/* Gemini AI Advice Box */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>ניתוח Gemini 3.5 Flash Lite:</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {aiAdvice?.baristaNotes || 'פרופיל הלחץ מייצר איזון מושלם בין גוף סמיך לשימור חומציות מבריקה.'}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 pt-2 border-t border-stone-800">
                <span>ציון סיכון צ'אנלינג: {aiAdvice?.channelingRiskScore || 12}% (נמוך)</span>
                <span>צפי EY%: {aiAdvice?.expectedEyPercent || 21.8}%</span>
              </div>
            </div>

            {/* Export JSON / BLE Button */}
            <button
              onClick={handleCopyJson}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all transform active:scale-95"
            >
              {copiedProfile ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{copiedProfile ? 'קובץ הפרופיל הועתק!' : 'ייצא פרופיל למכונה חכמה (JSON/BLE)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressureFlowProfiler;
