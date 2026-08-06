'use client';

import React, { useRef } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  strength?: number;
  haptic?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  strength = 0.25,
  haptic = true,
  type = 'button',
  disabled = false,
}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current || disabled) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    btnRef.current.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
  };

  const handleMouseLeave = () => {
    if (btnRef.current) {
      btnRef.current.style.transform = `translate3d(0px, 0px, 0)`;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (haptic && typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate([30, 50, 30]);
      } catch (err) {
        // Ignore vibration errors
      }
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transition: 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
      }}
      className={`relative inline-flex items-center justify-center font-extrabold transition-all active:scale-95 disabled:opacity-50 pointer-events-auto cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
};
