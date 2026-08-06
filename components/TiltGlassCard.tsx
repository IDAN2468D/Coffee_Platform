'use client';

import React, { useRef } from 'react';

interface TiltGlassCardProps {
  children: React.ReactNode;
  className?: string;
  maxTiltDeg?: number;
  perspective?: number;
  glowColor?: string;
  interactive?: boolean;
}

export const TiltGlassCard: React.FC<TiltGlassCardProps> = ({
  children,
  className = '',
  maxTiltDeg = 10,
  perspective = 1000,
  glowColor = 'rgba(245, 158, 11, 0.25)',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cardRef.current) return;

    // Pause 3D tilt when cursor is over interactive elements (input, select, button, textarea, a)
    if (interactive && e.target) {
      const targetTag = (e.target as HTMLElement).tagName.toLowerCase();
      const isInteractive =
        ['input', 'select', 'textarea', 'button', 'a', 'label'].includes(targetTag) ||
        (e.target as HTMLElement).closest('input, select, textarea, button, a, label');

      if (isInteractive) {
        cardRef.current.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0px)`;
        if (glareRef.current) glareRef.current.style.opacity = '0';
        return;
      }
    }

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;

    const rotY = xPct * maxTiltDeg;
    const rotX = -yPct * maxTiltDeg;

    cardRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;

    if (glareRef.current) {
      const glareX = (mouseX / width) * 100;
      const glareY = (mouseY / height) * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, ${glowColor} 0%, transparent 60%)`;
      glareRef.current.style.opacity = '0.35';
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
      }}
      className="relative transition-transform duration-200 ease-out"
    >
      <div
        ref={cardRef}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
        }}
        className={`liquid-glass-card rounded-3xl p-5 relative overflow-hidden border border-amber-500/20 shadow-2xl ${className}`}
      >
        {/* Specular Refraction Overlay */}
        <div
          ref={glareRef}
          style={{
            opacity: 0,
            transition: 'opacity 0.2s ease',
          }}
          className="absolute inset-0 pointer-events-none z-10"
        />

        {/* Content Container */}
        <div className="relative z-20 pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
