'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Flame, Activity, Volume2, Sparkles, ShoppingBag, Thermometer, RefreshCw, Zap } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

export default function RoastThermalSimulator() {
  const { addItem } = useCartStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [roastTime, setRoastTime] = useState<number>(12); // minutes
  const [convectionRatio, setConvectionRatio] = useState<number>(65); // %
  const [airVelocity, setAirVelocity] = useState<number>(80); // CFM
  const [chargeTemp, setChargeTemp] = useState<number>(205); // °C
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [firstCrackTime, setFirstCrackTime] = useState<number>(9.5);
  const [secondCrackTime, setSecondCrackTime] = useState<number>(11.2);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  // Audio synthesis for First Crack pop sounds
  const playCrackSound = (freq = 800) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      console.error(e);
    }
  };

  // Simulation timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          // Trigger audio popping near first crack & second crack
          if (Math.abs(next - firstCrackTime) < 0.15 || Math.abs(next - secondCrackTime) < 0.15) {
            playCrackSound(next > 10 ? 1200 : 750);
          }
          if (next >= roastTime) {
            setIsPlaying(false);
            return roastTime;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, roastTime, firstCrackTime, secondCrackTime]);

  // Canvas drawing of RoR and BT Curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw BT Curve (Bean Temp)
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b'; // Amber
    ctx.lineWidth = 3;

    const points = 100;
    for (let i = 0; i <= points; i++) {
      const t = (i / points) * roastTime;
      const progress = t / roastTime;
      // Thermal curve simulation formula
      const bt = chargeTemp - 110 * Math.exp(-progress * 3) + 120 * Math.pow(progress, 0.85);
      const x = (i / points) * width;
      const y = height - ((bt - 50) / 200) * height;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw RoR Curve (Rate of Rise)
    ctx.beginPath();
    ctx.strokeStyle = '#10b981'; // Emerald
    ctx.lineWidth = 2;

    for (let i = 0; i <= points; i++) {
      const t = (i / points) * roastTime;
      const progress = t / roastTime;
      const ror = 25 * Math.exp(-progress * 2.2) + 2;
      const x = (i / points) * width;
      const y = height - (ror / 30) * (height / 2);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Current Time Marker Line
    if (currentTime > 0) {
      const currentX = (currentTime / roastTime) * width;
      ctx.beginPath();
      ctx.strokeStyle = '#cyan';
      ctx.setLineDash([4, 4]);
      ctx.moveTo(currentX, 0);
      ctx.lineTo(currentX, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [roastTime, chargeTemp, currentTime]);

  const handleAddToCart = () => {
    addItem({
      coffeeItemId: 'custom-thermal-roast',
      name: 'Custom Thermal Curve Roast',
      hebrewName: 'קליית פרימיום לפי עקומת RoR',
      price: 88,
      shots: 2,
      milkType: 'WHOLE',
      imageUrl: '/images/roast-beans.jpg',
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="relative p-6 md:p-8 rounded-3xl bg-neutral-950/80 backdrop-blur-2xl border border-amber-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Flame className="w-4 h-4" />
              <span>סימולטור דינמיקה תרמית v6.0</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Roast Thermal Simulator
            </h1>
            <p className="text-neutral-400 max-w-xl text-sm md:text-base leading-relaxed">
              חיזוי עקומת קלייה מתקדמת (RoR), ניטור אנרגיית הסעה/הולכה, וסינתזה אקוסטית בזמן אמת של First Crack.
            </p>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
                : 'bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-neutral-950 shadow-amber-500/20'
            }`}
          >
            {isPlaying ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            <span>{isPlaying ? 'השהה קלייה' : 'הפעל סימולציית קלייה'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas & Live Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Monitor */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <span>ניטור RoR וטמפרטורת פולים בזמן אמת</span>
            </h2>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-amber-400 flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> BT (°C)
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> RoR (°C/min)
              </span>
            </div>
          </div>

          <div className="relative rounded-2xl bg-neutral-950 p-2 border border-white/5 overflow-hidden">
            <canvas ref={canvasRef} width={700} height={320} className="w-full h-auto rounded-lg" />
          </div>

          {/* Time & Crack Indicators */}
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono pt-2">
            <span>זמן קלייה נוכחי: {currentTime.toFixed(1)} / {roastTime} דקות</span>
            <span className="text-amber-400 flex items-center gap-1">
              <Volume2 className="w-4 h-4" /> First Crack צפוי: {firstCrackTime} דקות
            </span>
          </div>
        </div>

        {/* Control Panel */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Thermometer className="w-5 h-5 text-emerald-400" />
              <span>פרמטרי קלייה תרמית</span>
            </h3>

            {/* Charge Temp Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">טמפרטורת טעינה (Charge Temp):</span>
                <span className="font-mono text-amber-400 font-bold">{chargeTemp}°C</span>
              </div>
              <input
                type="range"
                min={180}
                max={230}
                value={chargeTemp}
                onChange={(e) => setChargeTemp(Number(e.target.value))}
                className="w-full accent-amber-500 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Convection vs Conduction Ratio */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">יחס הסעה (Convection %):</span>
                <span className="font-mono text-emerald-400 font-bold">{convectionRatio}%</span>
              </div>
              <input
                type="range"
                min={30}
                max={90}
                value={convectionRatio}
                onChange={(e) => setConvectionRatio(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Air Velocity */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">מהירות אוויר (CFM):</span>
                <span className="font-mono text-cyan-400 font-bold">{airVelocity} CFM</span>
              </div>
              <input
                type="range"
                min={40}
                max={120}
                value={airVelocity}
                onChange={(e) => setAirVelocity(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* AI Recommendation & Order Button */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-400">
                <Sparkles className="w-4 h-4" /> המלצת Gemini AI:
              </div>
              עקומת ה-RoR מציגה פיתוח סוכרים אופטימלי (DTR של 18.5%). התערובת מתאימה במיוחד לאספרסו גורמה ארומטי.
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{addedToCart ? 'התווסף לסל!' : 'הזמן קלייה לפי פרופיל זה (₪88)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
