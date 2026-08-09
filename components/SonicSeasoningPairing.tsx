'use client';

import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Music, Sparkles, Sliders, Sun, Moon } from 'lucide-react';

export default function SonicSeasoningPairing() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [profileType, setProfileType] = useState<'sweetness' | 'bitterness' | 'acidity'>('sweetness');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const toggleSound = () => {
    if (isPlaying) {
      oscRef.current?.stop();
      setIsPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Sonic seasoning frequency mapping:
        // Sweetness enhancement: High frequency chime (4.5 kHz)
        // Bitterness / Chocolate depth: Low frequency bass (110 Hz)
        // Acidity enhancement: Crisp high harmonic (2.8 kHz)
        if (profileType === 'sweetness') {
          osc.frequency.setValueAtTime(4500, ctx.currentTime);
          osc.type = 'sine';
        } else if (profileType === 'bitterness') {
          osc.frequency.setValueAtTime(110, ctx.currentTime);
          osc.type = 'triangle';
        } else {
          osc.frequency.setValueAtTime(2800, ctx.currentTime);
          osc.type = 'sine';
        }

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        setIsPlaying(true);
      } catch (err) {
        console.error('Web Audio error:', err);
      }
    }
  };

  const getProfileDescription = () => {
    if (profileType === 'sweetness') {
      return {
        title: 'תדרי הגברת מתיקות (High Chime - 4.5 kHz)',
        effect: 'מגביר את תפיסת המתיקות והקרמל בפה ב-15%',
        themeBg: 'from-amber-900/40 via-yellow-900/20 to-black',
        textColor: 'text-amber-400',
        border: 'border-amber-500/30',
      };
    } else if (profileType === 'bitterness') {
      return {
        title: 'תדרי עומק שוקולדי (Low Bass - 110 Hz)',
        effect: 'מעמיק את תפיסת השוקולד המריר והגוף הסמיך',
        themeBg: 'from-amber-950/60 via-stone-900/30 to-black',
        textColor: 'text-amber-200',
        border: 'border-amber-700/40',
      };
    } else {
      return {
        title: 'תדרי חומציות תתוססת (High Crisp - 2.8 kHz)',
        effect: 'מדגיש תווים פרחוניים וחומציות ציטרית בהירה',
        themeBg: 'from-cyan-950/40 via-emerald-950/20 to-black',
        textColor: 'text-cyan-400',
        border: 'border-cyan-500/30',
      };
    }
  };

  const activeProfile = getProfileDescription();

  return (
    <div dir="rtl" className="w-full max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
          <Music className="w-4 h-4" />
          <span>Psychoacoustic Sensory Pairing</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Sonic Seasoning – סנכרון תחושתי סאונד ותאורה לטעם הקפה
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          מחקרים פסיכואקוסטיים מוכיחים כי תדרי שמע ותאורה משנים את תפיסת הטעם של הקפה בפה. נסה את התדרים בלייב בזמן השתייה.
        </p>
      </div>

      <div className={`rounded-3xl border ${activeProfile.border} bg-gradient-to-br ${activeProfile.themeBg} backdrop-blur-2xl p-8 space-y-8 transition-all duration-700`}>
        {/* Profile Selector */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => {
              if (isPlaying) toggleSound();
              setProfileType('sweetness');
            }}
            className={`p-4 rounded-2xl border transition-all text-right space-y-1 ${
              profileType === 'sweetness'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <div className="text-sm font-bold">הגברת מתיקות 🍯</div>
            <div className="text-[11px] opacity-80">תדרי גובה 4.5 kHz</div>
          </button>

          <button
            onClick={() => {
              if (isPlaying) toggleSound();
              setProfileType('bitterness');
            }}
            className={`p-4 rounded-2xl border transition-all text-right space-y-1 ${
              profileType === 'bitterness'
                ? 'bg-stone-800/40 border-stone-600 text-stone-200'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <div className="text-sm font-bold">עומק שוקולד 🍫</div>
            <div className="text-[11px] opacity-80">תדרי בס 110 Hz</div>
          </button>

          <button
            onClick={() => {
              if (isPlaying) toggleSound();
              setProfileType('acidity');
            }}
            className={`p-4 rounded-2xl border transition-all text-right space-y-1 ${
              profileType === 'acidity'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <div className="text-sm font-bold">חומציות ציטרית 🍋</div>
            <div className="text-[11px] opacity-80">תדרי 2.8 kHz</div>
          </button>
        </div>

        {/* Audio Player Core */}
        <div className="flex flex-col items-center justify-center space-y-6 py-6 border-y border-white/10">
          <button
            onClick={toggleSound}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-2xl ${
              isPlaying
                ? 'bg-purple-500 text-white animate-pulse'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {isPlaying ? <Volume2 className="w-10 h-10" /> : <VolumeX className="w-10 h-10" />}
          </button>
          <div className="text-center space-y-1">
            <h3 className={`text-xl font-bold ${activeProfile.textColor}`}>{activeProfile.title}</h3>
            <p className="text-gray-300 text-sm max-w-md">{activeProfile.effect}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
