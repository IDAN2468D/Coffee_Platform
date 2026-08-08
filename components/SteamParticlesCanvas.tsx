'use client';

import React, { useEffect, useRef } from 'react';

interface SteamParticlesCanvasProps {
  className?: string;
  particleCount?: number;
  color?: string; // e.g. 'rgba(245, 158, 11, 0.18)' or 'rgba(255, 255, 255, 0.12)'
  speedMultiplier?: number;
  blurAmount?: number;
}

export const SteamParticlesCanvas: React.FC<SteamParticlesCanvasProps> = ({
  className = '',
  particleCount = 45,
  color = 'rgba(245, 158, 11, 0.18)',
  speedMultiplier = 1,
  blurAmount = 8,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    interface SteamParticle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      alpha: number;
      maxAlpha: number;
      growthRate: number;
      wobbleSpeed: number;
      wobbleAmp: number;
      wobbleOffset: number;
    }

    const createParticle = (initialY?: number): SteamParticle => {
      const radius = Math.random() * 28 + 12;
      return {
        x: width * 0.2 + Math.random() * (width * 0.6),
        y: initialY !== undefined ? initialY : height + Math.random() * 30,
        radius,
        speedY: -(Math.random() * 0.9 + 0.4) * speedMultiplier,
        speedX: (Math.random() - 0.5) * 0.3 * speedMultiplier,
        alpha: 0,
        maxAlpha: Math.random() * 0.22 + 0.06,
        growthRate: Math.random() * 0.08 + 0.04,
        wobbleSpeed: Math.random() * 0.03 + 0.015,
        wobbleAmp: Math.random() * 18 + 6,
        wobbleOffset: Math.random() * Math.PI * 2,
      };
    };

    const particles: SteamParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(Math.random() * height));
    }

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      particles.forEach((p, idx) => {
        // Physics update: Rise with convective oscillation
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(frame * p.wobbleSpeed + p.wobbleOffset) * 0.4;
        p.radius += p.growthRate;

        // Opacity envelope: fade in at bottom, peak mid-way, disperse at top
        const heightRatio = p.y / height;
        if (heightRatio > 0.6) {
          p.alpha = Math.min(p.maxAlpha, p.alpha + 0.008);
        } else {
          p.alpha = Math.max(0, p.alpha - 0.004);
        }

        // Reset when dispersed or out of bounds
        if (p.alpha <= 0 || p.y < -p.radius * 2) {
          particles[idx] = createParticle();
        }

        // Draw soft radial steam puff
        ctx.save();
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        
        // Extract base color components
        const baseColor = color.replace(/[\d.]+\)$/g, `${p.alpha})`);
        grad.addColorStop(0, baseColor);
        grad.addColorStop(0.5, color.replace(/[\d.]+\)$/g, `${p.alpha * 0.4})`));
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [particleCount, color, speedMultiplier, blurAmount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-10 ${className}`}
      style={{ filter: `blur(${blurAmount}px)` }}
    />
  );
};
