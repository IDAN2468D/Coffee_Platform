'use client';

import React, { useState } from 'react';

interface GlassBorderBeamProps {
  className?: string;
  size?: number;
  duration?: number; // seconds
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  interactiveRipple?: boolean;
  children: React.ReactNode;
}

export function GlassBorderBeam({
  className = '',
  size = 200,
  duration = 8,
  borderWidth = 1.5,
  colorFrom = '#f59e0b',
  colorTo = '#fbbf24',
  delay = 0,
  interactiveRipple = true,
  children,
}: GlassBorderBeamProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveRipple) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);
  };

  return (
    <div
      onClick={handleCardClick}
      style={
        {
          '--size': `${size}px`,
          '--duration': `${duration}s`,
          '--delay': `-${delay}s`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--border-width': `${borderWidth}px`,
        } as React.CSSProperties
      }
      className={`relative overflow-hidden rounded-3xl p-[1px] ${className}`}
    >
      {/* Moving Border Beam Ray */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width))_solid_transparent] 
        ![mask-clip:padding-box,border-box] ![mask-composite:intersect] 
        [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]
        after:absolute after:aspect-square after:w-[var(--size)] after:animate-border-beam after:[animation-delay:var(--delay)] 
        after:[animation-duration:var(--duration)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] 
        after:[offset-anchor:calc(var(--size)/2)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)))]"
      />

      {/* Subtle Specular Glow Flare */}
      <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-30 bg-gradient-to-r from-amber-500/10 via-transparent to-cyan-500/10 blur-sm" />

      {/* Interactive Click Ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
          className="pointer-events-none absolute w-6 h-6 rounded-full bg-amber-400/30 blur-[2px] animate-ping"
        />
      ))}

      {/* Card Content Wrapper */}
      <div className="relative w-full h-full rounded-[inherit] z-10">{children}</div>
    </div>
  );
}
