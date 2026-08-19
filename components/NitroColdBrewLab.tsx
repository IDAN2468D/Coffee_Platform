'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Snowflake,
  Flame,
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
  Droplets,
  Copy,
  Check,
  FlaskConical,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export const NitroColdBrewLab: React.FC = () => {
  const [steepHours, setSteepHours] = useState<number>(16);
  const [waterTempC, setWaterTempC] = useState<number>(4);
  const [coffeeGrams, setCoffeeGrams] = useState<number>(200);
  const [waterLiters, setWaterLiters] = useState<number>(1.6);
  const [nitroPsi, setNitroPsi] = useState<number>(40);

  // Simulation
  const [isCascading, setIsCascading] = useState<boolean>(false);
  const [copiedRecipe, setCopiedRecipe] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; speed: number; size: number; opacity: number }>>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Ratio
  const brewRatio = useMemo(() => {
    return Number(((waterLiters * 1000) / coffeeGrams).toFixed(1));
  }, [waterLiters, coffeeGrams]);

  // Extraction kinetics
  const estimatedTds = useMemo(() => {
    const tempFactor = 1 + (waterTempC - 4) * 0.03;
    const timeFactor = 1 - Math.exp(-steepHours / 7);
    return Number((((coffeeGrams / (waterLiters * 1000)) * 24 * timeFactor * tempFactor)).toFixed(2));
  }, [steepHours, waterTempC, coffeeGrams, waterLiters]);

  const estimatedEy = useMemo(() => {
    return Number(((estimatedTds * (waterLiters * 1000)) / coffeeGrams).toFixed(1));
  }, [estimatedTds, waterLiters, coffeeGrams]);

  // Init Cascade Particles
  const initParticles = useCallback((w: number, h: number) => {
    const count = 180;
    const pArr = [];
    for (let i = 0; i < count; i++) {
      pArr.push({
        x: Math.random() * (w - 40) + 20,
        y: Math.random() * (h - 80) + 60,
        speed: (Math.random() * 1.5 + 0.8) * (nitroPsi / 35),
        size: Math.random() * 2.2 + 0.8,
        opacity: Math.random() * 0.6 + 0.3,
      });
    }
    particlesRef.current = pArr;
  }, [nitroPsi]);

  // Draw Cascade Animation in Pint Glass
  const renderCascade = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 1. Draw Glass Body Silhouette
    ctx.beginPath();
    ctx.moveTo(w * 0.22, 40);
    ctx.lineTo(w * 0.78, 40);
    ctx.lineTo(w * 0.72, h - 30);
    ctx.quadraticCurveTo(w * 0.7, h - 15, w * 0.5, h - 15);
    ctx.quadraticCurveTo(w * 0.3, h - 15, w * 0.28, h - 30);
    ctx.closePath();

    // Fill Liquid Background (Dark Nitro Amber)
    const liquidGrad = ctx.createLinearGradient(0, 40, 0, h);
    liquidGrad.addColorStop(0, '#36180a');
    liquidGrad.addColorStop(0.5, '#1e0c04');
    liquidGrad.addColorStop(1, '#0e0502');
    ctx.fillStyle = liquidGrad;
    ctx.fill();

    // Clip to glass interior
    ctx.save();
    ctx.clip();

    // 2. Animate Descending Cascade Micro-bubbles
    if (isCascading) {
      particlesRef.current.forEach((p) => {
        // Downward cascade currents
        p.y += p.speed;
        if (p.y > h - 30) {
          p.y = 60;
          p.x = Math.random() * (w - 80) + 40;
        }

        ctx.fillStyle = `rgba(245, 218, 175, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 3. Thick Velvet Crema Head (Top Foam Layer)
    const foamHeight = Math.min(35, 12 + (nitroPsi / 40) * 16);
    const foamGrad = ctx.createLinearGradient(0, 40, 0, 40 + foamHeight);
    foamGrad.addColorStop(0, '#fde68a');
    foamGrad.addColorStop(0.7, '#d97706');
    foamGrad.addColorStop(1, 'rgba(180, 83, 9, 0.4)');
    ctx.fillStyle = foamGrad;
    ctx.fillRect(w * 0.2, 40, w * 0.6, foamHeight);

    ctx.restore();

    // 4. Glass Reflection Overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3;
    ctx.stroke();

    if (isCascading) {
      animFrameIdRef.current = requestAnimationFrame(renderCascade);
    }
  }, [isCascading, nitroPsi]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initParticles(canvas.width, canvas.height);
      renderCascade();
    }
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [initParticles, renderCascade]);

  // Fetch AI Analysis
  const fetchAiNitroAnalysis = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/nitro-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          steepHours,
          waterTempC,
          coffeeGrams,
          waterLiters,
          nitroPsi,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiResult(data.data);
      }
    } catch (err) {
      console.warn('AI Nitro fetch error', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiNitroAnalysis();
  }, []);

  const handleToggleCascade = () => {
    if (!isCascading) {
      coffeeSound.playPourSound();
      coffeeSound.playCoffeeSteam();
    } else {
      coffeeSound.playBaristaClick();
    }
    setIsCascading(!isCascading);
  };

  const handleCopyRecipe = () => {
    const recipeText = `=== מתכון חליטה קרה & נייטרו מדעית (THE DIGITAL ROAST AI) ===
קפה: ${coffeeGrams} גרם טחינה גסה (850µm)
מים: ${waterLiters} ליטר (יחס 1:${brewRatio})
טמפרטורת השריה: ${waterTempC}°C
זמן השריה: ${steepHours} שעות
לחץ חנקן N2: ${nitroPsi} PSI
צפי TDS: ${estimatedTds}% | צפי EY%: ${estimatedEy}%
אפקט מפל צפוי: ${aiResult?.cascadeDurationSeconds || 45} שניות
המלצה מדעית: ${aiResult?.physicsExplanation || 'חליטה אופטימלית ללא טאנינים'}`;

    navigator.clipboard.writeText(recipeText);
    setCopiedRecipe(true);
    coffeeSound.playBaristaClick();
    setTimeout(() => setCopiedRecipe(false), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 dir-rtl text-right font-sans">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#120d0a] via-[#1a120c] to-[#0a0705] border border-blue-500/30 p-6 sm:p-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold tracking-wide">
              <Snowflake className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>NITRO & COLD BREW GAS PHYSICS LAB 4.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-100 tracking-tight leading-tight">
              מעבדת חליטה קרה & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-amber-400">פיזיקת נייטרו</span>
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              סימולציה של קינטיקת מיצוי קרה (4°C עד 18°C), חישוב רוויית גז חנקן (N2) בלחץ 40 PSI, הדמיית אפקט המפל (Cascade Effect) ואופטימיזציית מתכוני באצ׳.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-4 bg-stone-950/80 backdrop-blur-xl border-2 border-blue-500/40 p-5 rounded-2xl shadow-xl shrink-0 font-mono">
            <div className="text-center">
              <div className="text-[10px] text-stone-400">TDS %</div>
              <div className="text-3xl font-black text-blue-400">{estimatedTds}%</div>
            </div>
            <div className="w-px h-10 bg-stone-800" />
            <div className="text-center">
              <div className="text-[10px] text-stone-400">EXTRACTION EY%</div>
              <div className="text-3xl font-black text-amber-300">{estimatedEy}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cockpit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cascade Simulation Canvas Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-[#0e0a08] border border-blue-500/30 p-6 space-y-6 shadow-xl backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-stone-200">הדמיית אפקט המפל (Nitro Cascade Pint):</span>
              </div>
              
              <button
                onClick={handleToggleCascade}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                  isCascading
                    ? 'bg-blue-500 text-stone-950 shadow-lg shadow-blue-500/30'
                    : 'bg-stone-900 border border-blue-500/40 text-blue-300 hover:bg-blue-500/20'
                }`}
              >
                {isCascading ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isCascading ? 'עצור מפל' : 'מזוג נייטרו לכוס'}</span>
              </button>
            </div>

            {/* Canvas Viewfinder */}
            <div className="w-full aspect-[4/3] max-w-[420px] mx-auto rounded-2xl bg-stone-950 border border-stone-800/80 p-2 flex items-center justify-center relative shadow-inner">
              <canvas
                ref={canvasRef}
                width={400}
                height={320}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Cascade Telemetry Badges */}
            <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="text-stone-400 text-[10px]">יחס חליטה (Ratio)</div>
                <div className="text-base font-bold text-blue-300 mt-0.5">1:{brewRatio}</div>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="text-stone-400 text-[10px]">לחץ רוויה (N2 PSI)</div>
                <div className="text-base font-bold text-amber-300 mt-0.5">{nitroPsi} PSI</div>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="text-stone-400 text-[10px]">עובי קרמה (Crema)</div>
                <div className="text-base font-bold text-stone-200 mt-0.5">{aiResult?.cremaThicknessMm || 8.5}mm</div>
              </div>
            </div>
          </div>
        </div>

        {/* Extraction Parameters & Recipe (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#0e0a08] border border-blue-500/30 p-6 space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              <span>כיול פרמטרי השריה והמסת חנקן</span>
            </h3>

            {/* Slider 1: Steep Hours */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-stone-300">
                <span>זמן השריה (Steep Time):</span>
                <span className="font-mono text-blue-400">{steepHours} שעות</span>
              </div>
              <input
                type="range"
                min="8"
                max="24"
                value={steepHours}
                onChange={(e) => setSteepHours(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Slider 2: Water Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-stone-300">
                <span>טמפרטורת מים (Water Temp):</span>
                <span className="font-mono text-amber-400">{waterTempC}&deg;C</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                value={waterTempC}
                onChange={(e) => setWaterTempC(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Slider 3: Nitrogen PSI */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-stone-300">
                <span>לחץ חנקן (N2 Saturation):</span>
                <span className="font-mono text-teal-400">{nitroPsi} PSI</span>
              </div>
              <input
                type="range"
                min="25"
                max="50"
                value={nitroPsi}
                onChange={(e) => setNitroPsi(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            {/* Gemini Physics Explanation */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-blue-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                <span>ניתוח פיזיקלי (Gemini 3.5 Flash Lite):</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {aiResult?.physicsExplanation ||
                  'השריה ב-4°C בצירוף לחץ חנקן של 40 PSI מייצרת רוויית מיקרו-בועות אידיאלית וטעם מתוק ללא מרירות.'}
              </p>
              <div className="text-[11px] font-mono text-amber-300 pt-2 border-t border-stone-800">
                מתכון באצ׳ מומלץ: {aiResult?.recommendedBatchRecipe || 'יחס 1:8, השריה 16h וטעינת N2'}
              </div>
            </div>

            {/* Export Recipe Button */}
            <button
              onClick={handleCopyRecipe}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-teal-400 to-amber-500 hover:from-blue-400 hover:to-amber-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all transform active:scale-95"
            >
              {copiedRecipe ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{copiedRecipe ? 'המתכון הועתק!' : 'ייצא מתכון מעבדה & באצ׳ חנקן'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NitroColdBrewLab;
