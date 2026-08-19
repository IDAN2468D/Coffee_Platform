'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Sliders, RefreshCw, Flame, Droplets, Zap, Eye } from 'lucide-react';

interface CremaFluidAnimationProps {
  interactive?: boolean;
  showControls?: boolean;
  className?: string;
  preset?: 'ristretto' | 'geisha' | 'nitro' | 'classic';
  onStatsChange?: (stats: { viscosity: number; cremaThickness: number; temp: number }) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  type: 'bubble' | 'crema' | 'oil' | 'ember';
  swirlAngle: number;
}

export function CremaFluidAnimation({
  interactive = true,
  showControls = true,
  className = '',
  preset = 'classic',
  onStatsChange,
}: CremaFluidAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Simulation Parameters
  const [viscosity, setViscosity] = useState<number>(preset === 'ristretto' ? 4.8 : preset === 'nitro' ? 2.1 : 3.5); // cP
  const [cremaThickness, setCremaThickness] = useState<number>(preset === 'ristretto' ? 6.5 : preset === 'geisha' ? 3.0 : 4.5); // mm
  const [temperature, setTemperature] = useState<number>(preset === 'nitro' ? 4 : 93.5); // °C
  const [swirlIntensity, setSwirlIntensity] = useState<number>(1.2);
  const [activePreset, setActivePreset] = useState<string>(preset);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Mouse interaction state
  const mouseRef = useRef<{ x: number; y: number; px: number; py: number; isDown: boolean; vx: number; vy: number }>({
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    isDown: false,
    vx: 0,
    vy: 0,
  });

  const particlesRef = useRef<Particle[]>([]);

  // Apply Presets
  const applyPreset = (name: 'ristretto' | 'geisha' | 'nitro' | 'classic') => {
    setActivePreset(name);
    if (name === 'ristretto') {
      setViscosity(4.8);
      setCremaThickness(6.5);
      setTemperature(94);
      setSwirlIntensity(1.5);
    } else if (name === 'geisha') {
      setViscosity(2.6);
      setCremaThickness(3.2);
      setTemperature(92);
      setSwirlIntensity(1.0);
    } else if (name === 'nitro') {
      setViscosity(1.9);
      setCremaThickness(5.8);
      setTemperature(4);
      setSwirlIntensity(2.0);
    } else {
      setViscosity(3.5);
      setCremaThickness(4.5);
      setTemperature(93.5);
      setSwirlIntensity(1.2);
    }
  };

  useEffect(() => {
    if (onStatsChange) {
      onStatsChange({ viscosity, cremaThickness, temp: temperature });
    }
  }, [viscosity, cremaThickness, temperature, onStatsChange]);

  // Color palettes based on temperature and roast
  const getCremaColors = useCallback(() => {
    if (temperature < 15) {
      // Nitro cold
      return ['#f59e0b', '#d97706', '#92400e', '#fef3c7', '#78350f', '#3b82f6'];
    }
    if (activePreset === 'ristretto') {
      // Dark, intense, tiger stripes
      return ['#b45309', '#78350f', '#451a03', '#d97706', '#fbbf24', '#fef08a'];
    }
    if (activePreset === 'geisha') {
      // Golden, silky, lighter amber
      return ['#fbbf24', '#f59e0b', '#d97706', '#fef08a', '#fde047', '#fffbeb'];
    }
    // Classic Golden Crema
    return ['#d97706', '#b45309', '#78350f', '#f59e0b', '#fbbf24', '#fef3c7'];
  }, [temperature, activePreset]);

  // Canvas & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = getCremaColors();
    const particleCount = Math.min(180, Math.floor((width * height) / 2500));

    // Initialize particles
    const initParticles = () => {
      const parts: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        const types: ('bubble' | 'crema' | 'oil' | 'ember')[] = ['crema', 'crema', 'bubble', 'oil'];
        if (temperature > 90) types.push('ember');
        const type = types[Math.floor(Math.random() * types.length)];
        const maxLife = 120 + Math.random() * 200;

        parts.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: type === 'bubble' ? 1.5 + Math.random() * 3.5 : type === 'oil' ? 6 + Math.random() * 12 : 3 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.7 + 0.2,
          maxAlpha: Math.random() * 0.7 + 0.3,
          life: Math.random() * maxLife,
          maxLife,
          type,
          swirlAngle: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = parts;
    };

    initParticles();

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Base rich liquid gradient
      const bgGrad = ctx.createRadialGradient(
        centerX + Math.sin(frame * 0.01) * 30,
        centerY + Math.cos(frame * 0.01) * 20,
        10,
        centerX,
        centerY,
        Math.max(width, height) * 0.75
      );

      if (temperature < 15) {
        bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
        bgGrad.addColorStop(0.5, 'rgba(30, 27, 75, 0.85)');
        bgGrad.addColorStop(1, 'rgba(5, 4, 4, 0.98)');
      } else {
        bgGrad.addColorStop(0, 'rgba(41, 18, 5, 0.92)');
        bgGrad.addColorStop(0.4, 'rgba(28, 13, 4, 0.95)');
        bgGrad.addColorStop(1, 'rgba(5, 4, 4, 0.98)');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Crema Viscosity Streamlines / Tiger Stripe Rings
      ctx.save();
      for (let ring = 1; ring <= 4; ring++) {
        const radius = (Math.min(width, height) * 0.18 * ring) / 1.5;
        const ringOffset = frame * 0.008 * (ring % 2 === 0 ? 1 : -1) * swirlIntensity;

        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          const wave = Math.sin(a * (ring + 2) + ringOffset) * (8 * (viscosity / 3));
          const r = radius + wave;
          const rx = centerX + Math.cos(a) * r;
          const ry = centerY + Math.sin(a) * (r * 0.85); // Isometric squash

          if (a === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.closePath();
        ctx.strokeStyle = ring % 2 === 0 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(217, 119, 6, 0.08)';
        ctx.lineWidth = 2.5 + (cremaThickness / 2);
        ctx.stroke();
      }
      ctx.restore();

      // Mouse velocity decaying
      mouseRef.current.vx *= 0.92;
      mouseRef.current.vy *= 0.92;

      // Update & Draw Particles (Crema, Bubbles, Oils, Embers)
      const parts = particlesRef.current;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.life++;
        if (p.life > p.maxLife) {
          p.life = 0;
          p.x = Math.random() * width;
          p.y = Math.random() * height;
        }

        // Swirl physics towards center + mouse influence
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const angle = Math.atan2(dy, dx);

        // Viscosity damping
        const speed = (2.2 / (viscosity * 0.6)) * swirlIntensity;
        p.swirlAngle += 0.015 * speed;

        // Centripetal + tangential velocity
        p.vx += Math.cos(p.swirlAngle + Math.PI / 2) * 0.08 * speed - (dx / dist) * 0.02;
        p.vy += Math.sin(p.swirlAngle + Math.PI / 2) * 0.08 * speed - (dy / dist) * 0.02;

        // Interaction with mouse cursor
        if (interactive) {
          const mdx = p.x - mouseRef.current.x;
          const mdy = p.y - mouseRef.current.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140) {
            const force = (1 - mdist / 140) * (mouseRef.current.isDown ? 3.5 : 1.8);
            p.vx += (mdx / mdist) * force + mouseRef.current.vx * 0.15;
            p.vy += (mdy / mdist) * force + mouseRef.current.vy * 0.15;
          }
        }

        // Apply friction
        p.vx *= 0.94;
        p.vy *= 0.94;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Calculate opacity fade in/out
        const lifeRatio = p.life / p.maxLife;
        const currentAlpha = Math.sin(lifeRatio * Math.PI) * p.maxAlpha;

        // Render particle by type
        ctx.save();
        ctx.globalAlpha = currentAlpha;

        if (p.type === 'bubble') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(254, 243, 199, 0.8)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.9)';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Micro highlight on bubble
          ctx.beginPath();
          ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fill();
        } else if (p.type === 'ember') {
          // Fiery gold glowing ember
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = '#fef08a';
          ctx.fill();
        } else if (p.type === 'oil') {
          // Glossy Crema Emulsion patch
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, p.color);
          grad.addColorStop(0.7, 'rgba(217, 119, 6, 0.2)');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * 1.4, p.size * 0.9, p.swirlAngle, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Golden crema filament
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Specular golden refraction sheen on top
      ctx.save();
      const sheenGrad = ctx.createLinearGradient(0, 0, width, height);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
      sheenGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.08)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [viscosity, cremaThickness, temperature, swirlIntensity, getCremaColors, interactive, activePreset]);

  // Mouse & Touch listeners
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    const ny = e.clientY - rect.top;

    mouseRef.current.vx = nx - mouseRef.current.px;
    mouseRef.current.vy = ny - mouseRef.current.py;
    mouseRef.current.px = mouseRef.current.x;
    mouseRef.current.py = mouseRef.current.y;
    mouseRef.current.x = nx;
    mouseRef.current.y = ny;
  };

  const handleMouseDown = () => {
    mouseRef.current.isDown = true;
  };

  const handleMouseUp = () => {
    mouseRef.current.isDown = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const nx = touch.clientX - rect.left;
    const ny = touch.clientY - rect.top;

    mouseRef.current.vx = nx - mouseRef.current.px;
    mouseRef.current.vy = ny - mouseRef.current.py;
    mouseRef.current.px = mouseRef.current.x;
    mouseRef.current.py = mouseRef.current.y;
    mouseRef.current.x = nx;
    mouseRef.current.y = ny;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseRef.current.isDown = false;
      }}
      className={`relative overflow-hidden rounded-3xl border border-amber-500/20 shadow-2xl bg-obsidian select-none ${className}`}
      dir="rtl"
    >
      {/* HTML5 Dynamic Fluid Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* Top Controls Header Bar - Unified, Responsive Liquid Glass */}
      <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2.5 p-2 sm:p-2.5 rounded-2xl bg-stone-950/85 backdrop-blur-xl border border-amber-500/30 shadow-xl pointer-events-auto">
        {/* Preset Selector Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['classic', 'ristretto', 'geisha', 'nitro'] as const).map((p) => (
            <button
              key={p}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activePreset === p
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black shadow-md shadow-amber-500/30 scale-105'
                  : 'bg-stone-900/90 text-stone-300 hover:text-amber-300 hover:bg-stone-800 border border-white/5'
              }`}
            >
              {p === 'classic' && '☕ קלאסי'}
              {p === 'ristretto' && '⚡ ריסטרטו אינטנסיבי'}
              {p === 'geisha' && '🌸 גיישה פלוראלית'}
              {p === 'nitro' && '🌊 נייטרו סילק'}
            </button>
          ))}
        </div>

        {/* Live Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900/90 border border-amber-500/40 text-amber-300 text-xs font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>CREMA DYNAMICS 60FPS</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-stone-900/90 border border-white/10 text-stone-300 text-xs font-mono">
            <span>צמיגות: {viscosity.toFixed(1)} cP</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Overlay Panel */}
      {showControls && (
        <div
          className={`absolute bottom-4 left-4 right-4 z-20 p-4 rounded-2xl bg-stone-950/85 backdrop-blur-xl border border-amber-500/25 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-90 sm:opacity-75 sm:hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Sliders className="w-4 h-4" />
              <span>כיול פיזיקלי של זרימת הקרמה (Live Telemetry)</span>
            </div>
            <div className="text-stone-400 text-[11px] hidden sm:block">
              הזז את העכבר או לחץ וגרור לשליטה במערבולות הנוזל
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* Viscosity Slider */}
            <div className="bg-stone-900/60 p-2.5 rounded-xl border border-white/5">
              <div className="flex justify-between text-stone-300 mb-1">
                <span>צמיגות אספרסו:</span>
                <span className="font-mono text-amber-400 font-bold">{viscosity.toFixed(1)} cP</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.1"
                value={viscosity}
                onChange={(e) => setViscosity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Crema Thickness Slider */}
            <div className="bg-stone-900/60 p-2.5 rounded-xl border border-white/5">
              <div className="flex justify-between text-stone-300 mb-1">
                <span>עובי שכבת קרמה:</span>
                <span className="font-mono text-amber-400 font-bold">{cremaThickness.toFixed(1)} מ״מ</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.2"
                value={cremaThickness}
                onChange={(e) => setCremaThickness(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Extraction Temperature */}
            <div className="bg-stone-900/60 p-2.5 rounded-xl border border-white/5">
              <div className="flex justify-between text-stone-300 mb-1">
                <span>טמפרטורת חליטה:</span>
                <span className="font-mono text-amber-400 font-bold">{temperature.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="4"
                max="98"
                step="0.5"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Swirl Velocity */}
            <div className="bg-stone-900/60 p-2.5 rounded-xl border border-white/5">
              <div className="flex justify-between text-stone-300 mb-1">
                <span>עוצמת מערבולת:</span>
                <span className="font-mono text-amber-400 font-bold">{swirlIntensity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={swirlIntensity}
                onChange={(e) => setSwirlIntensity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
