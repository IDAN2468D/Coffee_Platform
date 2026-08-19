'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Snowflake,
  Activity,
  Sliders,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Coffee,
  Check,
  RotateCcw,
  Layers,
  Thermometer,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface BurrPreset {
  id: string;
  name: string;
  hebrewName: string;
  burrSizeMm: number;
  geometry: 'FLAT_SSP' | 'CONICAL' | 'ULTRA_FLAT_98';
}

const BURR_PRESETS: BurrPreset[] = [
  { id: 'ssp-64', name: 'SSP 64mm Cast Red Speed', hebrewName: 'סכינים שטוחות 64mm (SSP Sweet Lab)', burrSizeMm: 64, geometry: 'FLAT_SSP' },
  { id: 'ek43-98', name: 'Mahlkönig EK43 98mm Cast', hebrewName: 'סכיני ענק 98mm (Mahlkönig EK43)', burrSizeMm: 98, geometry: 'ULTRA_FLAT_98' },
  { id: 'conical-48', name: 'Niche Zero 63mm Conical', hebrewName: 'סכינים קוניות 63mm (Mazzer Kony)', burrSizeMm: 63, geometry: 'CONICAL' },
];

export const CryoGrindOptimizer: React.FC = () => {
  const [beanTempC, setBeanTempC] = useState<number>(-18);
  const [baseGrindMicrons, setBaseGrindMicrons] = useState<number>(320);
  const [selectedBurrId, setSelectedBurrId] = useState<string>('ssp-64');
  const [roastLevel, setRoastLevel] = useState<'LIGHT' | 'MEDIUM' | 'DARK'>('LIGHT');

  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [aiData, setAiData] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeBurr = useMemo(() => {
    return BURR_PRESETS.find((b) => b.id === selectedBurrId) || BURR_PRESETS[0];
  }, [selectedBurrId]);

  // Calculations
  const finesReduction = useMemo(() => {
    const deltaT = Math.max(0, 22 - beanTempC);
    return Math.min(48, Math.round(deltaT * 0.82));
  }, [beanTempC]);

  const burrOffset = useMemo(() => {
    const deltaT = Math.max(0, 22 - beanTempC);
    return Math.round(deltaT * 0.55);
  }, [beanTempC]);

  // Draw PSD Curves on Canvas
  const drawPsdCurves = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 40; x < w - 20; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, h - 25);
      ctx.stroke();
    }

    // 1. Ambient Curve (Room Temp - Red/Orange Bimodal with high Fines peak)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    for (let x = 40; x <= w - 20; x += 2) {
      const micron = ((x - 40) / (w - 60)) * 900; // 0 to 900 µm
      // Fines peak at 80µm
      const finesPeak = 55 * Math.exp(-Math.pow((micron - 80) / 45, 2));
      // Main peak at baseGrindMicrons
      const mainPeak = 95 * Math.exp(-Math.pow((micron - baseGrindMicrons) / 95, 2));
      const totalY = h - 30 - (finesPeak + mainPeak) * (h / 160);
      if (x === 40) ctx.moveTo(x, totalY);
      else ctx.lineTo(x, totalY);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Cryo Frozen Curve (Sub-Zero - Bright Cyan Unimodal, Fines crushed)
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3.5;

    for (let x = 40; x <= w - 20; x += 2) {
      const micron = ((x - 40) / (w - 60)) * 900;
      // Reduced Fines peak
      const finesFactor = 1 - finesReduction / 100;
      const finesPeak = 55 * finesFactor * Math.exp(-Math.pow((micron - 80) / 40, 2));
      // Sharper Main peak shifted slightly
      const mainPeak = 125 * Math.exp(-Math.pow((micron - (baseGrindMicrons + burrOffset)) / 75, 2));
      const totalY = h - 30 - (finesPeak + mainPeak) * (h / 160);
      if (x === 40) ctx.moveTo(x, totalY);
      else ctx.lineTo(x, totalY);
    }
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('0µm (Fines)', 60, h - 8);
    ctx.fillText('400µm (Medium)', w / 2, h - 8);
    ctx.fillText('900µm (Coarse)', w - 40, h - 8);
  }, [baseGrindMicrons, beanTempC, finesReduction, burrOffset]);

  // Fetch AI Analysis
  const fetchAiCryoReport = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/cryo-grind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beanTempC,
          baseGrindMicrons,
          grinderBurrType: activeBurr.geometry,
          roastLevel,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiData(data.data);
      }
    } catch (err) {
      console.warn('AI Cryo fetch failed', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    drawPsdCurves();
  }, [drawPsdCurves, beanTempC, baseGrindMicrons, selectedBurrId]);

  useEffect(() => {
    fetchAiCryoReport();
  }, [selectedBurrId, roastLevel]);

  const handleCopyReport = () => {
    const reportText = `=== דוח כיול טחינה קריוגנית (THE DIGITAL ROAST AI) ===
טמפרטורת פולים: ${beanTempC}°C
סכיני מטחנה: ${activeBurr.hebrewName}
גודל טחינה מכויל: ${baseGrindMicrons}µm + פיצוי קור (${burrOffset}µm) = ${baseGrindMicrons + burrOffset}µm
אחוז צמצום Fines: ${finesReduction}%
ציון חדות חלקיקים (Unimodal): ${aiData?.unimodalScore || 94}/100
הסבר מדעי: ${aiData?.baristaPhysicsReport || 'שבירה נקייה ללא אבק קפה'}`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    coffeeSound.playBaristaClick();
    setTimeout(() => setCopiedReport(false), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 dir-rtl text-right font-sans">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#120d0a] via-[#1a120c] to-[#0a0705] border border-cyan-500/30 p-6 sm:p-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-wide">
              <Snowflake className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>CRYO-GRIND MICRON & PSD OPTIMIZER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-100 tracking-tight leading-tight">
              מחשבון טחינה קריוגנית & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">פיזור מיקרוני PSD</span>
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              מודל פיזיקלי לחישוב השפעת הקפאת פולי קפה (-18°C עד חנקן נוזלי -196°C) על שבירת התאים, צמצום כמות ה-Fines (אבק קפה) וחישוב פיצוי קליבר בסכיני המטחנה.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-4 bg-stone-950/80 backdrop-blur-xl border-2 border-cyan-500/40 p-5 rounded-2xl shadow-xl shrink-0 font-mono">
            <div className="text-center">
              <div className="text-[10px] text-stone-400">FINES REDUCTION</div>
              <div className="text-3xl font-black text-cyan-400">-{finesReduction}%</div>
            </div>
            <div className="w-px h-10 bg-stone-800" />
            <div className="text-center">
              <div className="text-[10px] text-stone-400">BURR OFFSET</div>
              <div className="text-3xl font-black text-amber-300">+{burrOffset}µm</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cockpit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PSD Graph Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-[#0e0a08] border border-cyan-500/30 p-6 space-y-6 shadow-xl backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono">
                  <div className="w-3 h-3 rounded-full bg-cyan-400" />
                  <span>טחינה קפואה ({beanTempC}&deg;C)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 font-mono">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span>טמפ׳ חדר (22&deg;C)</span>
                </div>
              </div>
              <span className="text-xs font-mono text-stone-400">Particle Size (µm)</span>
            </div>

            {/* PSD Canvas */}
            <div className="w-full aspect-[16/9] rounded-2xl bg-stone-950 border border-stone-800/80 p-2 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="w-full h-full object-fill"
              />
            </div>

            {/* Quick Presets for Temperature */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { label: 'חנקן נוזלי', temp: -196 },
                { label: 'מקפיא ביתי', temp: -18 },
                { label: 'מקרר יין', temp: 4 },
                { label: 'טמפ׳ חדר', temp: 22 },
              ].map((item) => (
                <button
                  key={item.temp}
                  onClick={() => {
                    setBeanTempC(item.temp);
                    coffeeSound.playBeanCrunch();
                  }}
                  className={`p-2.5 rounded-xl border font-bold transition-all ${
                    beanTempC === item.temp
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div>{item.label}</div>
                  <div className="font-mono text-[11px] mt-0.5">{item.temp}&deg;C</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Burr Calibration & Physics Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#0e0a08] border border-cyan-500/30 p-6 space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span>כיול סכינים וטמפרטורת פולים</span>
            </h3>

            {/* Burr Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300">סוג סכיני מטחנה:</label>
              <div className="space-y-2">
                {BURR_PRESETS.map((burr) => (
                  <button
                    key={burr.id}
                    onClick={() => {
                      setSelectedBurrId(burr.id);
                      coffeeSound.playBaristaClick();
                    }}
                    className={`w-full p-3 rounded-xl border text-right text-xs font-bold transition-all flex items-center justify-between ${
                      selectedBurrId === burr.id
                        ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>{burr.hebrewName}</span>
                    <span className="font-mono">{burr.burrSizeMm}mm</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Bean Temperature */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-bold text-stone-300">
                <span>טמפרטורת פול (Bean Temp):</span>
                <span className="font-mono text-cyan-400">{beanTempC}&deg;C</span>
              </div>
              <input
                type="range"
                min="-50"
                max="25"
                value={beanTempC}
                onChange={(e) => setBeanTempC(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Slider 2: Base Grind Microns */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-stone-300">
                <span>גודל טחינה בסיסי (Base Microns):</span>
                <span className="font-mono text-amber-400">{baseGrindMicrons}µm</span>
              </div>
              <input
                type="range"
                min="180"
                max="650"
                step="10"
                value={baseGrindMicrons}
                onChange={(e) => setBaseGrindMicrons(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Gemini Physics Box */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>ניתוח פיזיקה ומבנה תאי (Gemini 3.5 Flash Lite):</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {aiData?.baristaPhysicsReport ||
                  'הקפאת פולים מונעת חימום סכינים ומייצרת חלקיקים אחידים שאינם נסתמים בחליטה.'}
              </p>
              <div className="text-[11px] font-mono text-amber-300 pt-2 border-t border-stone-800">
                המלצת כיול: כוון את המטחנה ל-{baseGrindMicrons + burrOffset}µm (פיצוי +{burrOffset}µm)
              </div>
            </div>

            {/* Export Report Button */}
            <button
              onClick={handleCopyReport}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all transform active:scale-95"
            >
              {copiedReport ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{copiedReport ? 'דוח הכיול הועתק!' : 'ייצא דוח כיול טחינה קריוגנית'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryoGrindOptimizer;
