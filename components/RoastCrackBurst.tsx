'use client';

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Flame, Sparkles, Zap, RefreshCw } from 'lucide-react';

export interface RoastCrackBurstHandle {
  burst: (x?: number, y?: number, count?: number) => void;
}

interface RoastCrackBurstProps {
  className?: string;
  ambientEmbers?: boolean;
  intensity?: number;
  triggerOnClick?: boolean;
  interactive?: boolean;
  children?: React.ReactNode;
}

interface EmberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  gravity: number;
  type: 'spark' | 'ember' | 'chaff' | 'smoke';
  rotation: number;
  vRot: number;
}

export const RoastCrackBurst = forwardRef<RoastCrackBurstHandle, RoastCrackBurstProps>(
  (
    {
      className = '',
      ambientEmbers = true,
      intensity = 1.0,
      triggerOnClick = true,
      interactive = true,
      children,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const particlesRef = useRef<EmberParticle[]>([]);
    const [crackCount, setCrackCount] = useState<number>(0);

    const emberColors = [
      '#f59e0b', // Amber 500
      '#fbbf24', // Amber 400
      '#fef08a', // Yellow 200
      '#ef4444', // Red 500
      '#f97316', // Orange 500
      '#ea580c', // Dark Orange
    ];

    const chaffColors = [
      '#78350f', // Amber brown
      '#92400e', // Roasted brown
      '#b45309', // Chaff gold
    ];

    // Trigger explosive burst
    const triggerBurst = (originX?: number, originY?: number, count = 45) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = canvas.width;
      const height = canvas.height;
      const x = originX ?? width / 2;
      const y = originY ?? height / 2;

      setCrackCount((prev) => prev + 1);

      const actualCount = Math.floor(count * intensity);
      for (let i = 0; i < actualCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 8.5;
        const isChaff = Math.random() < 0.25;
        const isSmoke = Math.random() < 0.2;

        const maxLife = isSmoke ? 60 + Math.random() * 50 : 40 + Math.random() * 70;

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
          vy: Math.sin(angle) * speed - (1.5 + Math.random() * 2), // upward bias
          size: isSmoke ? 12 + Math.random() * 18 : isChaff ? 4 + Math.random() * 5 : 2 + Math.random() * 4,
          color: isSmoke
            ? 'rgba(120, 113, 108, 0.4)'
            : isChaff
            ? chaffColors[Math.floor(Math.random() * chaffColors.length)]
            : emberColors[Math.floor(Math.random() * emberColors.length)],
          alpha: 1,
          life: 0,
          maxLife,
          gravity: isSmoke ? -0.04 : 0.12,
          type: isSmoke ? 'smoke' : isChaff ? 'chaff' : 'ember',
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
        });
      }
    };

    useImperativeHandle(ref, () => ({
      burst: triggerBurst,
    }));

    // Particle Animation Loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
      let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

      const handleResize = () => {
        if (!canvas || !canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      };
      window.addEventListener('resize', handleResize);

      let frame = 0;

      const render = () => {
        frame++;
        ctx.clearRect(0, 0, width, height);

        // Ambient rising embers
        if (ambientEmbers && frame % 12 === 0 && particlesRef.current.length < 70) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: height + 10,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -1.2 - Math.random() * 1.8,
            size: 1.5 + Math.random() * 3,
            color: emberColors[Math.floor(Math.random() * emberColors.length)],
            alpha: 0.8,
            life: 0,
            maxLife: 90 + Math.random() * 60,
            gravity: -0.02,
            type: 'ember',
            rotation: 0,
            vRot: 0,
          });
        }

        // Draw & Update Particles
        const parts = particlesRef.current;
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          p.life++;
          if (p.life >= p.maxLife) {
            parts.splice(i, 1);
            continue;
          }

          p.vy += p.gravity;
          p.vx *= 0.98;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;

          const progress = p.life / p.maxLife;
          const currentAlpha = Math.sin(progress * Math.PI) * p.alpha;

          ctx.save();
          ctx.globalAlpha = currentAlpha;

          if (p.type === 'smoke') {
            p.size += 0.25;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
          } else if (p.type === 'chaff') {
            // Roasted bean chaff flake
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Fiery Glowing Ember
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Inner intense white spark core
            if (p.size > 2.5) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.fill();
            }
          }

          ctx.restore();
        }

        animFrameRef.current = requestAnimationFrame(render);
      };

      render();

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }, [ambientEmbers, intensity]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!triggerOnClick || !interactive) return;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        triggerBurst(x, y, 40);
      }
    };

    return (
      <div
        ref={containerRef}
        onClick={handleClick}
        className={`relative overflow-hidden ${className}`}
      >
        {/* Particle Canvas Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Children (if wrapping existing elements) */}
        {children}
      </div>
    );
  }
);

RoastCrackBurst.displayName = 'RoastCrackBurst';
