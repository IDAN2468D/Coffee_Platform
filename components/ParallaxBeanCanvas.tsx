'use client';

import React, { useEffect, useRef } from 'react';

interface ParallaxBeanCanvasProps {
  className?: string;
  beanCount?: number;
  interactiveMouse?: boolean;
}

interface FloatingBean {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  parallaxFactor: number; // 0.2 (background), 0.35 (midground), 0.5 (foreground)
  layer: 'bg' | 'mid' | 'fg';
  color: string;
  creaseColor: string;
  specularColor: string;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobbleOffset: number;
}

export const ParallaxBeanCanvas: React.FC<ParallaxBeanCanvasProps> = ({
  className = '',
  beanCount = 38,
  interactiveMouse = true,
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
    let targetScrollY = scrollY;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY || 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactiveMouse) return;
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (interactiveMouse) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Initialize 3-Layer Procedural Beans
    const beans: FloatingBean[] = [];

    for (let i = 0; i < beanCount; i++) {
      const randLayer = Math.random();
      let layer: 'bg' | 'mid' | 'fg' = 'bg';
      let parallaxFactor = 0.2;
      let size = Math.random() * 12 + 10;
      let color = '#2e160a';
      let creaseColor = '#170b05';
      let specularColor = 'rgba(245, 158, 11, 0.08)';

      if (randLayer > 0.65) {
        // Foreground Layer
        layer = 'fg';
        parallaxFactor = 0.5;
        size = Math.random() * 16 + 22; // 22-38px
        color = '#5a2d12';
        creaseColor = '#241005';
        specularColor = 'rgba(251, 191, 36, 0.35)';
      } else if (randLayer > 0.3) {
        // Midground Layer
        layer = 'mid';
        parallaxFactor = 0.35;
        size = Math.random() * 10 + 16; // 16-26px
        color = '#42200e';
        creaseColor = '#1d0c04';
        specularColor = 'rgba(245, 158, 11, 0.2)';
      }

      const baseX = Math.random() * width;
      const baseY = Math.random() * height * 2.5 - height * 0.5;

      beans.push({
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        size,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.012,
        parallaxFactor,
        layer,
        color,
        creaseColor,
        specularColor,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleAmp: Math.random() * 20 + 8,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }

    let frame = 0;

    // Helper: Draw 3D Procedural Coffee Bean with Center Organic Crease & Highlights
    const drawCoffeeBean = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      bean: FloatingBean
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      const a = size; // Semi-major axis (length)
      const b = size * 0.65; // Semi-minor axis (width)

      // Outer Bean Body with subtle radial depth
      ctx.beginPath();
      ctx.ellipse(0, 0, a, b, 0, 0, Math.PI * 2);

      const bodyGrad = ctx.createRadialGradient(-a * 0.2, -b * 0.2, 0, 0, 0, a);
      bodyGrad.addColorStop(0, bean.color);
      bodyGrad.addColorStop(0.7, bean.color);
      bodyGrad.addColorStop(1, '#150803');

      ctx.fillStyle = bodyGrad;
      ctx.shadowColor = bean.layer === 'fg' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = bean.layer === 'fg' ? 12 : 4;
      ctx.shadowOffsetY = 4;
      ctx.fill();

      // Specular Sunlight / Roast Sheen
      ctx.beginPath();
      ctx.ellipse(-a * 0.3, -b * 0.25, a * 0.45, b * 0.25, -Math.PI / 8, 0, Math.PI * 2);
      ctx.fillStyle = bean.specularColor;
      ctx.fill();

      // Center Curved Crease / Crack (Signature Coffee Bean Slit)
      ctx.beginPath();
      ctx.moveTo(-a * 0.82, 0);
      ctx.bezierCurveTo(-a * 0.3, -b * 0.35, a * 0.3, b * 0.35, a * 0.82, 0);
      ctx.strokeStyle = bean.creaseColor;
      ctx.lineWidth = Math.max(1.5, size * 0.12);
      ctx.lineCap = 'round';
      ctx.stroke();

      // Subtle golden parchment inner rim on foreground beans
      if (bean.layer === 'fg') {
        ctx.beginPath();
        ctx.moveTo(-a * 0.75, 0.5);
        ctx.bezierCurveTo(-a * 0.28, -b * 0.32, a * 0.28, b * 0.32, a * 0.75, 0.5);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    };

    // Render Animation Loop
    const render = () => {
      frame++;

      // Smooth interpolation for scroll and mouse
      scrollY += (targetScrollY - scrollY) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Sort beans by layer so bg renders first, fg renders on top
      beans.forEach((b) => {
        // Continuous organic floating wobble
        const wobbleX = Math.sin(frame * b.wobbleSpeed + b.wobbleOffset) * b.wobbleAmp;
        const wobbleY = Math.cos(frame * b.wobbleSpeed * 0.8 + b.wobbleOffset) * (b.wobbleAmp * 0.6);

        // Parallax scroll displacement
        const parallaxY = b.baseY - scrollY * b.parallaxFactor;

        // Subtle mouse repulsion / tilt
        const dx = (mouseX - width / 2) * (b.parallaxFactor * 0.04);
        const dy = (mouseY - height / 2) * (b.parallaxFactor * 0.04);

        b.x = b.baseX + wobbleX + dx;
        // Wrap beans vertically in endless loop as user scrolls
        const totalHeight = height * 2.5;
        b.y = ((parallaxY + wobbleY + dy + totalHeight * 10) % totalHeight) - height * 0.5;

        b.rotation += b.rotSpeed;

        // Only draw if visible on viewport
        if (b.y > -b.size * 2 && b.y < height + b.size * 2) {
          drawCoffeeBean(ctx, b.x, b.y, b.size, b.rotation, b);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (interactiveMouse) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animId);
    };
  }, [beanCount, interactiveMouse]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.85 }}
    />
  );
};
