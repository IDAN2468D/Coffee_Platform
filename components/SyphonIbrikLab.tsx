'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Beaker, Flame, Thermometer, Wind, ShoppingBag, Sparkles, Droplets, RotateCcw } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

export default function SyphonIbrikLab() {
  const { addItem } = useCartStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [method, setMethod] = useState<'syphon' | 'ibrik'>('syphon');
  const [sandTemp, setSandTemp] = useState<number>(240); // °C for Ibrik
  const [waterVolume, setWaterVolume] = useState<number>(300); // ml
  const [coffeeGram, setCoffeeGram] = useState<number>(20); // g
  const [isBrewing, setIsBrewing] = useState<boolean>(false);
  const [brewProgress, setBrewProgress] = useState<number>(0);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  // Brew timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBrewing) {
      interval = setInterval(() => {
        setBrewProgress((prev) => {
          if (prev >= 100) {
            setIsBrewing(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isBrewing]);

  // Bubbles & Steam Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];

    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 20,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isBrewing || brewProgress > 0) {
        particles.forEach((p) => {
          p.y -= p.speed;
          if (p.y < 0) {
            p.y = canvas.height;
            p.x = Math.random() * canvas.width;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = method === 'syphon' 
            ? `rgba(56, 189, 248, ${p.opacity})` 
            : `rgba(245, 158, 11, ${p.opacity})`;
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isBrewing, brewProgress, method]);

  const handleAddToCart = () => {
    addItem({
      coffeeItemId: method === 'syphon' ? 'panama-geisha-syphon' : 'yemen-mocha-ibrik',
      name: method === 'syphon' ? 'Panama Geisha Syphon Roast' : 'Yemen Mocha Cezve Roast',
      hebrewName: method === 'syphon' ? 'פנמה גיישה לחליטת סיפון וואקום' : 'תימן מוקה לבישול בג׳זווה',
      price: 95,
      shots: 1,
      milkType: 'NONE',
      imageUrl: '/images/syphon-ibrik.jpg',
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const ratio = (waterVolume / coffeeGram).toFixed(1);
  const pressureBar = (1.0 + (sandTemp - 100) * 0.002).toFixed(2);

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="relative p-6 md:p-8 rounded-3xl bg-neutral-950/80 backdrop-blur-2xl border border-cyan-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Beaker className="w-4 h-4" />
              <span>מעבדת חליטת עומק וג׳זווה v6.0</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Syphon & Ibrik Precision Lab
            </h1>
            <p className="text-neutral-400 max-w-xl text-sm md:text-base leading-relaxed">
              ניטור דינמיקת לחץ אדים (Vapor Pressure) בסיפון וואקום ודיפוזיית חום בחול ג׳זווה עות׳מאנית.
            </p>
          </div>

          {/* Switch Method */}
          <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => { setMethod('syphon'); setBrewProgress(0); setIsBrewing(false); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                method === 'syphon' ? 'bg-cyan-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              סיפון וואקום (Syphon)
            </button>
            <button
              onClick={() => { setMethod('ibrik'); setBrewProgress(0); setIsBrewing(false); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                method === 'ibrik' ? 'bg-amber-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              ג׳זווה בחול (Cezve Ibrik)
            </button>
          </div>
        </div>
      </div>

      {/* Main Simulation View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Chamber */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>תא החליטה והרתיחה הפיזיקלי</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
              לחץ מחושב: {pressureBar} Bar
            </span>
          </div>

          {/* Interactive Canvas Chamber */}
          <div className="relative h-64 md:h-80 rounded-2xl bg-neutral-950 border border-white/5 overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} width={600} height={300} className="absolute inset-0 w-full h-full" />
            
            {/* Visual Glass Bulb / Pot Simulation */}
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 flex items-center justify-center backdrop-blur-md transition-all duration-500 ${
                method === 'syphon' 
                  ? 'border-cyan-500/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/20' 
                  : 'border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/20'
              }`}>
                <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-extrabold font-mono text-white">
                    {brewProgress}%
                  </div>
                  <div className="text-xs text-neutral-300">
                    {isBrewing ? 'חליטה בפעולה...' : brewProgress === 100 ? 'החליטה הושלמה!' : 'מוכן להתחלה'}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-64 h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${method === 'syphon' ? 'bg-cyan-400' : 'bg-amber-400'}`}
                  style={{ width: `${brewProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setIsBrewing(!isBrewing)}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${
                isBrewing 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : method === 'syphon'
                    ? 'bg-cyan-400 hover:bg-cyan-300 text-neutral-950'
                    : 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
              }`}
            >
              <Droplets className="w-5 h-5" />
              <span>{isBrewing ? 'עצור חליטה' : 'התחל תהליך חליטה'}</span>
            </button>

            <button
              onClick={() => { setBrewProgress(0); setIsBrewing(false); }}
              className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Parameters & Order */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-cyan-400" />
              <span>משתני חליטה ומיצוי</span>
            </h3>

            {/* Water Volume Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">נפח מים (ml):</span>
                <span className="font-mono text-cyan-400 font-bold">{waterVolume} ml</span>
              </div>
              <input
                type="range"
                min={150}
                max={500}
                step={10}
                value={waterVolume}
                onChange={(e) => setWaterVolume(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Coffee Dose Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">מינון קפה (g):</span>
                <span className="font-mono text-amber-400 font-bold">{coffeeGram} g</span>
              </div>
              <input
                type="range"
                min={10}
                max={40}
                value={coffeeGram}
                onChange={(e) => setCoffeeGram(Number(e.target.value))}
                className="w-full accent-amber-400 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Temp Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">טמפרטורת מצע חול / מים:</span>
                <span className="font-mono text-emerald-400 font-bold">{sandTemp}°C</span>
              </div>
              <input
                type="range"
                min={90}
                max={280}
                value={sandTemp}
                onChange={(e) => setSandTemp(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Extraction Specs */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/5 text-xs font-mono space-y-2 text-neutral-300">
              <div className="flex justify-between">
                <span>יחס חליטה (Brew Ratio):</span>
                <span className="text-cyan-400 font-bold">1:{ratio}</span>
              </div>
              <div className="flex justify-between">
                <span>זמן מיצוי משוער:</span>
                <span className="text-amber-400 font-bold">{method === 'syphon' ? '2:15 דק' : '3:45 דק'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
              method === 'syphon'
                ? 'bg-cyan-400 hover:bg-cyan-300 text-neutral-950 shadow-cyan-400/20'
                : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/20'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{addedToCart ? 'התווסף לסל!' : `הזמן פולים מותאמים (₪95)`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
