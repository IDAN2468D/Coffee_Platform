'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    coffeeSound.playBaristaClick();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-fadeIn">
      <button
        onClick={scrollToTop}
        className="p-3.5 rounded-2xl bg-[#0d0a0a]/90 border border-amber-500/40 text-amber-400 hover:text-amber-200 hover:border-amber-400 hover:bg-amber-500/20 backdrop-blur-2xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:scale-110 flex items-center justify-center group"
        title="חזרה לראש העמוד"
        aria-label="חזרה לראש העמוד"
      >
        <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>
  );
};
