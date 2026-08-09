'use client';

import React, { useEffect, useRef } from 'react';

interface CoffeeSpillCanvasProps {
  className?: string;
  beanCount?: number;
  enableSpill?: boolean;
}

interface FallingBean {
  x: number;
  y: number;
  size: number;
  vy: number;
  vx: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  creaseColor: string;
  specularColor: string;
  opacity: number;
  layer: 'bg' | 'mid' | 'fg';
}

interface LiquidParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export const CoffeeSpillCanvas: React.FC<CoffeeSpillCanvasProps> = ({
  className = '',
  beanCount = 35,
  enableSpill = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let scrollY = window.scrollY || 0;
    let lastScrollY = scrollY;
    let scrollSpeed = 0;

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY || 0;
      scrollSpeed = Math.abs(currentScroll - lastScrollY);
      lastScrollY = currentScroll;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Initialize Falling Coffee Beans
    const beans: FallingBean[] = [];
    for (let i = 0; i < beanCount; i++) {
      const isFg = Math.random() > 0.6;
      const isMid = !isFg && Math.random() > 0.3;

      const size = isFg ? Math.random() * 14 + 20 : isMid ? Math.random() * 8 + 14 : Math.random() * 6 + 8;
      const layer = isFg ? 'fg' : isMid ? 'mid' : 'bg';

      beans.push({
        x: Math.random() * width,
        y: Math.random() * height * 1.5 - height * 0.5,
        size,
        vy: Math.random() * 1.5 + (isFg ? 1.2 : 0.6),
        vx: (Math.random() - 0.5) * 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        color: isFg ? '#5c2d12' : isMid ? '#42200e' : '#2a1408',
        creaseColor: isFg ? '#241005' : '#170b04',
        specularColor: isFg ? 'rgba(251, 191, 36, 0.35)' : 'rgba(245, 158, 11, 0.15)',
        opacity: isFg ? 0.95 : isMid ? 0.75 : 0.45,
        layer,
      });
    }

    // Initialize Liquid Splash Particles (קפה נישפך)
    const splashParticles: LiquidParticle[] = [];

    const createSplashDrop = (x: number, y: number, force: number) => {
      const count = Math.floor(Math.random() * 4 + 3);
      for (let i = 0; i < count; i++) {
        splashParticles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * (force * 0.6 + 2),
          vy: -(Math.random() * (force * 0.8 + 3) + 1),
          radius: Math.random() * 4 + 2,
          color: Math.random() > 0.4 ? '#d97706' : '#7c3f13',
          alpha: 0.9,
          life: 0,
          maxLife: Math.random() * 30 + 30,
        });
      }
    };

    // Draw 3D Procedural Coffee Bean
    const drawBean = (b: FallingBean) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation);
      ctx.globalAlpha = b.opacity;

      const a = b.size;
      const bRad = b.size * 0.65;

      // Bean Outer Body
      ctx.beginPath();
      ctx.ellipse(0, 0, a, bRad, 0, 0, Math.PI * 2);

      const grad = ctx.createRadialGradient(-a * 0.2, -bRad * 0.2, 0, 0, 0, a);
      grad.addColorStop(0, b.color);
      grad.addColorStop(0.7, b.color);
      grad.addColorStop(1, '#120703');

      ctx.fillStyle = grad;
      ctx.shadowColor = b.layer === 'fg' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = b.layer === 'fg' ? 14 : 6;
      ctx.shadowOffsetY = 5;
      ctx.fill();

      // Specular Light Sheen
      ctx.beginPath();
      ctx.ellipse(-a * 0.3, -bRad * 0.25, a * 0.45, bRad * 0.25, -Math.PI / 8, 0, Math.PI * 2);
      ctx.fillStyle = b.specularColor;
      ctx.fill();

      // Signature Center Crease Slit
      ctx.beginPath();
      ctx.moveTo(-a * 0.8, 0);
      ctx.bezierCurveTo(-a * 0.3, -bRad * 0.35, a * 0.3, bRad * 0.35, a * 0.8, 0);
      ctx.strokeStyle = b.creaseColor;
      ctx.lineWidth = Math.max(1.5, b.size * 0.12);
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.restore();
    };

    let wavePhase = 0;
    let frame = 0;

    // Render Animation Loop
    const render = () => {
      frame++;
      wavePhase += 0.025;

      // Decay scroll speed effect
      scrollSpeed *= 0.92;

      ctx.clearRect(0, 0, width, height);

      // --- LAYER 1: FALLING COFFEE BEANS ---
      beans.forEach((b) => {
        // Accelerate falling speed based on scroll speed
        const speedBoost = Math.min(scrollSpeed * 0.2, 8);
        b.y += b.vy + speedBoost;
        b.x += b.vx + Math.sin(frame * 0.02 + b.size) * 0.3;
        b.rotation += b.rotSpeed + speedBoost * 0.005;

        // Loop bean back to top when it reaches bottom
        if (b.y > height + b.size * 2) {
          b.y = -b.size * 2;
          b.x = Math.random() * width;
          // Trigger splash when foreground bean hits bottom
          if (b.layer === 'fg' && enableSpill) {
            createSplashDrop(b.x, height - 20, 4);
          }
        }

        drawBean(b);
      });

      // --- LAYER 2: LIQUID COFFEE SPILL & WAVE AT BOTTOM (קפה נישפך) ---
      if (enableSpill) {
        ctx.save();

        // Wave heights dynamically expand with scroll speed
        const baseHeight = 45 + Math.min(scrollSpeed * 1.5, 35);
        const amplitude = 12 + Math.sin(wavePhase) * 6;

        // Draw Liquid Coffee Wave Gradient
        const spillGrad = ctx.createLinearGradient(0, height - baseHeight - 40, 0, height);
        spillGrad.addColorStop(0, 'rgba(217, 119, 6, 0.0)');
        spillGrad.addColorStop(0.25, 'rgba(217, 119, 6, 0.3)');
        spillGrad.addColorStop(0.6, 'rgba(124, 63, 19, 0.85)');
        spillGrad.addColorStop(1, 'rgba(28, 13, 4, 0.98)');

        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 20) {
          const y =
            height -
            baseHeight +
            Math.sin(x * 0.008 + wavePhase) * amplitude +
            Math.cos(x * 0.015 - wavePhase * 0.7) * (amplitude * 0.5);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        ctx.fillStyle = spillGrad;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
        ctx.shadowBlur = 20;
        ctx.fill();

        // Glowing Liquid Surface Rim Line
        ctx.beginPath();
        for (let x = 0; x <= width; x += 20) {
          const y =
            height -
            baseHeight +
            Math.sin(x * 0.008 + wavePhase) * amplitude +
            Math.cos(x * 0.015 - wavePhase * 0.7) * (amplitude * 0.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.restore();

        // --- LAYER 3: SPLASH DROPLETS PHYSICS ---
        for (let i = splashParticles.length - 1; i >= 0; i--) {
          const p = splashParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.25; // Gravity
          p.life++;
          p.alpha = 1 - p.life / p.maxLife;

          if (p.life >= p.maxLife || p.y > height + 10) {
            splashParticles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [beanCount, enableSpill]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.9 }}
    />
  );
};
