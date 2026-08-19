'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Flame, Droplets, Wind, RotateCw, Thermometer } from 'lucide-react';

interface AromaHeatwaveCup3DProps {
  className?: string;
  cupSize?: 'small' | 'medium' | 'large';
  temperature?: number; // °C
  roastNotes?: string[];
  interactive?: boolean;
}

interface AromaRune {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  scale: number;
  rotation: number;
  color: string;
  life: number;
  maxLife: number;
}

export function AromaHeatwaveCup3D({
  className = '',
  cupSize = 'medium',
  temperature: initialTemp = 93.5,
  roastNotes = ['יסמין ופרחים', 'שוקולד מריר', 'הדרים וברגמוט', 'דבש בר', 'קרמל קלוי'],
  interactive = true,
}: AromaHeatwaveCup3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [temperature, setTemperature] = useState<number>(initialTemp);
  const [steamIntensity, setSteamIntensity] = useState<number>(1.2);
  const [activeAroma, setActiveAroma] = useState<string>('יסמין ופרחים');
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [isPouring, setIsPouring] = useState<boolean>(false);

  const runesRef = useRef<AromaRune[]>([]);

  // Spawn Aroma Note Runes
  const spawnRune = (x: number, y: number, customText?: string) => {
    const text = customText || roastNotes[Math.floor(Math.random() * roastNotes.length)];
    const colors = ['#f59e0b', '#fbbf24', '#38bdf8', '#34d399', '#f472b6', '#a78bfa'];
    const rune: AromaRune = {
      id: Date.now() + Math.random(),
      text,
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -1.2 - Math.random() * 1.5 * (temperature / 80),
      alpha: 1,
      scale: 0.8 + Math.random() * 0.4,
      rotation: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: 100 + Math.random() * 80,
    };
    runesRef.current.push(rune);
    if (runesRef.current.length > 25) {
      runesRef.current.shift();
    }
  };

  // 3D Perspective Tilt on Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !interactive) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rx = -(y / (rect.height / 2)) * 14;
    const ry = (x / (rect.width / 2)) * 14;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const handleCupClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsPouring(true);
    setTimeout(() => setIsPouring(false), 800);

    // Burst 5 aroma runes
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      for (let i = 0; i < 5; i++) {
        spawnRune(clickX, clickY);
      }
    }
  };

  // Canvas Steam & Thermal Waves Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let frame = 0;

    // Steam particle array
    const steamParticles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
    }[] = [];

    const cupCenterX = width / 2;
    const cupCenterY = height * 0.68;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Emit new Steam Particles from cup surface
      if (frame % 2 === 0 && steamParticles.length < 90) {
        steamParticles.push({
          x: cupCenterX + (Math.random() - 0.5) * 80,
          y: cupCenterY - 35,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -0.8 - Math.random() * 1.6 * (temperature / 85) * steamIntensity,
          size: 10 + Math.random() * 18,
          alpha: 0.45 * (temperature / 90),
          life: 0,
          maxLife: 90 + Math.random() * 60,
        });
      }

      // Periodically spawn Aroma rune
      if (frame % 45 === 0) {
        spawnRune(cupCenterX, cupCenterY - 40);
      }

      // 2. Render Thermal Heatwave Distortion Shimmer
      ctx.save();
      const waveCount = 5;
      for (let i = 0; i < waveCount; i++) {
        const offset = frame * 0.04 + i * 1.5;
        const waveX = cupCenterX + Math.sin(offset) * (20 + i * 6);
        const waveY = cupCenterY - 40 - (frame * 1.5 + i * 35) % (height * 0.65);
        const waveAlpha = Math.max(0, 1 - (cupCenterY - waveY) / (height * 0.6));

        const heatGrad = ctx.createRadialGradient(waveX, waveY, 2, waveX, waveY, 35 + i * 10);
        heatGrad.addColorStop(0, `rgba(245, 158, 11, ${0.12 * waveAlpha})`);
        heatGrad.addColorStop(0.5, `rgba(251, 191, 36, ${0.05 * waveAlpha})`);
        heatGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = heatGrad;
        ctx.beginPath();
        ctx.arc(waveX, waveY, 35 + i * 10, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Render Steam Particles with Gaussian Blend
      ctx.save();
      for (let i = steamParticles.length - 1; i >= 0; i--) {
        const p = steamParticles[i];
        p.life++;
        if (p.life >= p.maxLife) {
          steamParticles.splice(i, 1);
          continue;
        }

        // Swirling drift
        p.x += p.vx + Math.sin(p.life * 0.05 + i) * 0.6;
        p.y += p.vy;
        p.size += 0.25;

        const progress = p.life / p.maxLife;
        const currentAlpha = Math.sin(progress * Math.PI) * p.alpha;

        const steamGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        steamGrad.addColorStop(0, `rgba(254, 243, 199, ${currentAlpha * 0.8})`);
        steamGrad.addColorStop(0.6, `rgba(245, 158, 11, ${currentAlpha * 0.3})`);
        steamGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = steamGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Render Floating Aroma Runes (Tasting Notes)
      ctx.save();
      for (let i = runesRef.current.length - 1; i >= 0; i--) {
        const rune = runesRef.current[i];
        rune.life++;
        if (rune.life >= rune.maxLife) {
          runesRef.current.splice(i, 1);
          continue;
        }

        rune.x += rune.vx + Math.cos(rune.life * 0.04) * 0.5;
        rune.y += rune.vy;
        rune.rotation += 0.003;

        const progress = rune.life / rune.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.95;

        ctx.save();
        ctx.translate(rune.x, rune.y);
        ctx.rotate(rune.rotation);
        ctx.scale(rune.scale, rune.scale);

        // Glow tag pill
        ctx.shadowColor = rune.color;
        ctx.shadowBlur = 12;

        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        const textWidth = ctx.measureText(rune.text).width;
        const padX = 8;
        const padY = 4;

        // Background pill
        ctx.fillStyle = `rgba(12, 10, 9, ${alpha * 0.85})`;
        ctx.strokeStyle = rune.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-textWidth / 2 - padX, -10 - padY, textWidth + padX * 2, 20 + padY, 10);
        ctx.fill();
        ctx.stroke();

        // Text
        ctx.fillStyle = rune.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(rune.text, 0, 0);

        ctx.restore();
      }
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [temperature, steamIntensity, roastNotes]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCupClick}
      style={{
        perspective: '1200px',
      }}
      className={`relative flex flex-col items-center justify-center rounded-3xl p-6 bg-gradient-to-b from-stone-900/70 to-stone-950/90 border border-amber-500/20 backdrop-blur-2xl shadow-2xl overflow-hidden cursor-pointer select-none ${className}`}
      dir="rtl"
    >
      {/* Dynamic Canvas for Steam & Heatwaves */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* Top Header Badge */}
      <div className="w-full flex items-center justify-between z-20 mb-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>כוס זכוכית 3D & גלי ארומה</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/80 border border-white/10 text-stone-300 text-xs font-mono">
          <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          <span>{temperature.toFixed(1)}°C</span>
        </div>
      </div>

      {/* 3D Glass Coffee Cup Container */}
      <div
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${isPouring ? 1.04 : 1})`,
          transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-64 h-64 flex items-center justify-center my-4 z-20"
      >
        {/* Glow Pedestal */}
        <div className="absolute bottom-2 w-48 h-12 bg-amber-500/20 rounded-full blur-xl animate-pulse" />

        {/* 3D Glass Cup Outer Body */}
        <div className="relative w-44 h-48 rounded-b-[48px] rounded-t-lg bg-gradient-to-b from-white/15 via-amber-500/5 to-amber-950/40 border-2 border-white/30 backdrop-blur-3xl shadow-[0_20px_50px_rgba(245,158,11,0.25),inset_0_2px_8px_rgba(255,255,255,0.4)] overflow-hidden flex flex-col justify-end p-2">
          {/* Glass Specular Highlights */}
          <div className="absolute top-0 left-3 w-4 h-full bg-gradient-to-r from-white/30 to-transparent blur-[1px] pointer-events-none" />
          <div className="absolute top-0 right-3 w-2 h-full bg-gradient-to-l from-white/20 to-transparent blur-[1px] pointer-events-none" />

          {/* Liquid Espresso Level */}
          <div className="relative w-full h-36 rounded-b-[40px] bg-gradient-to-b from-amber-600 via-amber-900 to-stone-950 overflow-hidden shadow-inner border-t-2 border-amber-400/60">
            {/* Crema Surface & Swirl Ring */}
            <div className="absolute top-0 inset-x-0 h-7 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600 rounded-full opacity-90 blur-[0.5px] flex items-center justify-center shadow-md">
              {/* Golden Micro-Foam Swirls */}
              <div className="w-12 h-3 rounded-full border border-amber-800/60 rotate-12 animate-spin" style={{ animationDuration: '10s' }} />
              <div className="w-20 h-4 rounded-full border border-amber-200/40 -rotate-6 animate-pulse" />
            </div>

            {/* Liquid Depth Shimmer */}
            <div className="absolute inset-0 bg-radial from-amber-500/20 via-transparent to-black/60 pointer-events-none" />
          </div>
        </div>

        {/* 3D Glass Handle */}
        <div className="absolute -right-6 top-16 w-12 h-24 rounded-r-3xl border-4 border-l-0 border-white/30 bg-white/5 backdrop-blur-md shadow-lg pointer-events-none" />

        {/* Glass Plate / Saucer */}
        <div className="absolute -bottom-4 w-60 h-8 rounded-[50%] bg-gradient-to-b from-white/20 to-stone-900/60 border-2 border-white/25 backdrop-blur-2xl shadow-2xl -z-10" />
      </div>

      {/* Interactive Controls & Aroma Note Tags */}
      <div className="w-full z-20 mt-2">
        <div className="flex items-center justify-between text-xs text-stone-300 mb-2">
          <span>פרופיל ארומה סנסורי:</span>
          <span className="text-amber-400 font-bold">לחץ על הכוס להפצת אדים</span>
        </div>

        <div className="flex flex-wrap gap-1.5 justify-center">
          {roastNotes.map((note) => (
            <button
              key={note}
              onClick={(e) => {
                e.stopPropagation();
                setActiveAroma(note);
                if (canvasRef.current) {
                  const rect = canvasRef.current.getBoundingClientRect();
                  spawnRune(rect.width / 2, rect.height * 0.6, note);
                }
              }}
              className={`px-2.5 py-1 text-xs rounded-xl transition-all border ${
                activeAroma === note
                  ? 'bg-amber-500 text-black border-amber-400 font-bold scale-105 shadow-md shadow-amber-500/20'
                  : 'bg-stone-900/80 text-stone-300 border-white/10 hover:bg-stone-800'
              }`}
            >
              {note}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
