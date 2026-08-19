'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Sliders, RefreshCw, Flame, Droplets, Zap, Eye, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isControlsExpanded, setIsControlsExpanded] = useState<boolean>(true);

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
      return ['#451a03', '#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b'];
    }
    if (activePreset === 'geisha') {
      // Light, floral golden crema
      return ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706'];
    }
    // Classic Golden Crema
    return ['#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b', '#fde68a'];
  }, [temperature, activePreset]);

  // Initialize and spawn particles
  const spawnParticle = useCallback((width: number, height: number, forceCenter = false): Particle => {
    const colors = getCremaColors();
    const color = colors[Math.floor(Math.random() * colors.length)];
    const types: ('bubble' | 'crema' | 'oil' | 'ember')[] = ['crema', 'crema', 'bubble', 'oil'];
    const type = types[Math.floor(Math.random() * types.length)];

    const centerX = width / 2;
    const centerY = height / 2;

    let x: number, y: number;
    if (forceCenter) {
      const radius = Math.random() * (Math.min(width, height) * 0.35);
      const angle = Math.random() * Math.PI * 2;
      x = centerX + Math.cos(angle) * radius;
      y = centerY + Math.sin(angle) * radius;
    } else {
      x = Math.random() * width;
      y = Math.random() * height;
    }

    const angle = Math.atan2(y - centerY, x - centerX);
    const speed = (0.3 + Math.random() * 0.8) * swirlIntensity;

    return {
      x,
      y,
      vx: Math.cos(angle + Math.PI / 2) * speed + (Math.random() - 0.5) * 0.3,
      vy: Math.sin(angle + Math.PI / 2) * speed + (Math.random() - 0.5) * 0.3,
      size: type === 'bubble' ? 1.5 + Math.random() * 3.5 : 2.5 + Math.random() * (cremaThickness * 1.5),
      color,
      alpha: 0,
      maxAlpha: 0.3 + Math.random() * 0.6,
      life: 0,
      maxLife: 150 + Math.random() * 200,
      type,
      swirlAngle: angle,
    };
  }, [getCremaColors, swirlIntensity, cremaThickness]);

  // Canvas render & physics loop
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

    // Initial Particle pool
    const targetParticleCount = Math.floor((width * height) / 3200);
    particlesRef.current = Array.from({ length: targetParticleCount }, () => spawnParticle(width, height, true));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.fillStyle = '#0a0807';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw Deep Espresso Base Radial Gradient
      const baseGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.max(width, height) * 0.65);
      baseGrad.addColorStop(0, '#1c130e');
      baseGrad.addColorStop(0.5, '#120c09');
      baseGrad.addColorStop(1, '#050404');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Vortex Crema Waves
      ctx.save();
      for (let ring = 1; ring <= 4; ring++) {
        const ringRadius = (ring * Math.min(width, height) * 0.12) + Math.sin(time * 2 + ring) * 8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(10, ringRadius), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.04 + ring * 0.02})`;
        ctx.lineWidth = cremaThickness * 2;
        ctx.stroke();
      }
      ctx.restore();

      // 3. Mouse Swirl & Force Fields
      const mouse = mouseRef.current;
      const mouseActive = mouse.x > 0 && mouse.y > 0;

      // 4. Update & Render Particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        // Fade in / Fade out
        if (p.life < 30) {
          p.alpha = (p.life / 30) * p.maxAlpha;
        } else if (p.life > p.maxLife - 40) {
          p.alpha = ((p.maxLife - p.life) / 40) * p.maxAlpha;
        }

        // Swirl Physics
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const currentAngle = Math.atan2(dy, dx);

        // Angular rotation velocity based on viscosity (lower viscosity = faster rotation)
        const angularVelocity = (0.012 / (viscosity * 0.6)) * swirlIntensity;
        const newAngle = currentAngle + angularVelocity;
        const pull = 0.15; // Centripetal pull towards vortex center

        p.x = centerX + Math.cos(newAngle) * (dist - pull) + p.vx;
        p.y = centerY + Math.sin(newAngle) * (dist - pull) + p.vy;

        // Interactive Mouse Force
        if (mouseActive) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < 120) {
            const force = (120 - mDist) / 120;
            if (mouse.isDown) {
              // Attraction pull on click
              p.x -= (mdx / mDist) * force * 5;
              p.y -= (mdy / mDist) * force * 5;
            } else {
              // Mouse movement vortex turbulence
              p.vx += mouse.vx * 0.05 * force;
              p.vy += mouse.vy * 0.05 * force;
            }
          }
        }

        // Drag friction based on viscosity
        p.vx *= 0.94 - (viscosity * 0.01);
        p.vy *= 0.94 - (viscosity * 0.01);

        // Render Particle
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

        if (p.type === 'bubble') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Bubble highlight
          ctx.beginPath();
          ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fill();
        } else {
          // Crema droplets with soft blur glow
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Respawn dead particles
        if (p.life >= p.maxLife || p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50) {
          particles[i] = spawnParticle(width, height, Math.random() > 0.3);
        }
      }

      // Reset mouse velocities
      mouse.vx *= 0.5;
      mouse.vy *= 0.5;

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [viscosity, cremaThickness, temperature, swirlIntensity, spawnParticle]);

  // Mouse & Touch Handlers
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

      {/* TOP HEADER DOCK - 100% Non-Overlapping Segmented Bar */}
      <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2.5 p-2 sm:p-2.5 rounded-2xl bg-stone-950/90 backdrop-blur-2xl border border-amber-500/30 shadow-2xl pointer-events-auto">
        {/* Preset Selector Segmented Controls */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-stone-900/90 rounded-xl border border-white/10 shrink-0">
          {(['classic', 'ristretto', 'geisha', 'nitro'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => applyPreset(p)}
              className={`px-2.5 py-1 text-[11px] sm:text-xs font-black rounded-lg transition-all text-center whitespace-nowrap ${
                activePreset === p
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30 scale-105'
                  : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/80'
              }`}
            >
              {p === 'classic' && 'קלאסי'}
              {p === 'ristretto' && 'ריסטרטו'}
              {p === 'geisha' && 'גיישה'}
              {p === 'nitro' && 'נייטרו'}
            </button>
          ))}
        </div>

        {/* Live Badges & Sliders Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-900/90 border border-amber-500/30 text-amber-300 text-[11px] font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>60FPS • {viscosity.toFixed(1)} cP</span>
          </div>

          {showControls && (
            <button
              type="button"
              onClick={() => setIsControlsExpanded(!isControlsExpanded)}
              className="p-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-white/10 text-stone-300 hover:text-amber-300 text-xs transition-colors flex items-center gap-1"
              title={isControlsExpanded ? 'צמצם לוח כיול' : 'הרחב לוח כיול'}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              {isControlsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>

      {/* BOTTOM CALIBRATION HUD DOCK */}
      {showControls && isControlsExpanded && (
        <div
          className={`absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 z-20 p-3 sm:p-4 rounded-2xl bg-stone-950/90 backdrop-blur-2xl border border-amber-500/25 shadow-2xl transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-90 sm:opacity-80 sm:hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between mb-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Sliders className="w-3.5 h-3.5" />
              <span>כיול פיזיקלי של זרימת הקרמה (Live Telemetry)</span>
            </div>
            <div className="text-stone-400 text-[10px] hidden sm:block">
              הזז את העכבר או לחץ וגרור לשליטה במערבולות הנוזל
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
            {/* Viscosity Slider */}
            <div className="bg-stone-900/80 p-2 rounded-xl border border-white/5">
              <div className="flex justify-between text-stone-300 mb-1 text-[11px]">
                <span>צמיגות:</span>
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
            <div className="bg-stone-900/80 p-2 rounded-xl border border-white/5">
              <div className="flex justify-between text-stone-300 mb-1 text-[11px]">
                <span>שכבת קרמה:</span>
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
            <div className="bg-stone-900/80 p-2 rounded-xl border border-white/5">
              <div className="flex justify-between text-stone-300 mb-1 text-[11px]">
                <span>טמפרטורה:</span>
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
            <div className="bg-stone-900/80 p-2 rounded-xl border border-white/5">
              <div className="flex justify-between text-stone-300 mb-1 text-[11px]">
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
