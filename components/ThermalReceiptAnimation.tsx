'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimationControls, type Variants } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Printer,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Coffee,
  Scissors,
  Receipt as ReceiptIcon,
  Hand,
} from 'lucide-react';
import { PrinterChassis } from './PrinterChassis';
import { Receipt, ReceiptData } from './Receipt';

interface ThermalReceiptAnimationProps {
  receiptData?: Partial<ReceiptData>;
  autoPlay?: boolean;
  onComplete?: () => void;
  onTearComplete?: () => void;
  showControls?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

const dispenseVariants: Variants = {
  hidden: {
    y: '-100%',
    opacity: 0,
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1], // Custom spring cubic-bezier for physical mechanical bounce
      delay: 0,
    },
  },
};

export const ThermalReceiptAnimation: React.FC<ThermalReceiptAnimationProps> = ({
  receiptData,
  autoPlay = true,
  onComplete,
  onTearComplete,
  showControls = true,
  title = 'הדפסת קבלה תרמית מאומתת',
  subtitle = 'מיקרו-אינטראקציית תשלום עם פיזיקת פליטה, תלישה וקונפטי',
  className = '',
}) => {
  const controls = useAnimationControls();
  const [isPrinting, setIsPrinting] = useState(false);
  const [isCutting, setIsCutting] = useState(false);
  const [isTorn, setIsTorn] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [dragPromptVisible, setDragPromptVisible] = useState(false);

  const printCountRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Synthesize realistic thermal printer stepper-motor sound using Web Audio API
  const playPrinterSound = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const duration = 1.1;

      // 1. Stepper Motor Noise (Filtered White Noise)
      const bufferSize = ctx.sampleRate * duration;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1400, now);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.04, now + 0.1);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      // 2. High Frequency Micro-stepper Ticks (Mechanical Gear Pulsing)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.linearRampToValueAtTime(420, now + duration);

      oscGain.gain.setValueAtTime(0.015, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext error suppressed
    }
  }, [soundEnabled]);

  // Synthesize realistic physical guillotine cutter blade & paper shear sound (גזירה ותלישה אותנטית)
  const playTearSound = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const duration = 0.32;

      // 1. Metallic Guillotine Blade Snip & Slide (חדות להב מתכתי)
      const bladeOsc = ctx.createOscillator();
      const bladeFilter = ctx.createBiquadFilter();
      const bladeGain = ctx.createGain();

      bladeOsc.type = 'sawtooth';
      bladeOsc.frequency.setValueAtTime(2400, now);
      bladeOsc.frequency.exponentialRampToValueAtTime(650, now + 0.18);

      bladeFilter.type = 'highpass';
      bladeFilter.frequency.setValueAtTime(1200, now);

      bladeGain.gain.setValueAtTime(0.08, now);
      bladeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      bladeOsc.connect(bladeFilter);
      bladeFilter.connect(bladeGain);
      bladeGain.connect(ctx.destination);

      bladeOsc.start(now);
      bladeOsc.stop(now + 0.18);

      // 2. High-frequency paper fiber rip & shear friction (קריעת סיבי נייר)
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const grain = Math.sin(i * 0.12) > 0 ? 1 : 0.35;
        output[i] = (Math.random() * 2 - 1) * grain;
      }

      const tearNoise = ctx.createBufferSource();
      tearNoise.buffer = noiseBuffer;

      const ripFilter = ctx.createBiquadFilter();
      ripFilter.type = 'bandpass';
      ripFilter.frequency.setValueAtTime(3600, now);
      ripFilter.frequency.exponentialRampToValueAtTime(600, now + duration);
      ripFilter.Q.setValueAtTime(2.5, now);

      const ripGain = ctx.createGain();
      ripGain.gain.setValueAtTime(0.03, now);
      ripGain.gain.linearRampToValueAtTime(0.14, now + 0.05);
      ripGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      tearNoise.connect(ripFilter);
      ripFilter.connect(ripGain);
      ripGain.connect(ctx.destination);

      // 3. Physical Paper Snap / Release Impulse
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(480, now + 0.04);
      snapOsc.frequency.exponentialRampToValueAtTime(110, now + 0.14);

      snapGain.gain.setValueAtTime(0.0, now);
      snapGain.gain.setValueAtTime(0.1, now + 0.04);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);

      tearNoise.start(now);
      tearNoise.stop(now + duration);
      snapOsc.start(now + 0.04);
      snapOsc.stop(now + 0.14);
    } catch {
      // AudioContext error suppressed
    }
  }, [soundEnabled]);

  // Confetti explosion timed at 700ms after dispense begins
  const triggerConfetti = useCallback(() => {
    setTimeout(() => {
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { x: 0.5, y: 0.42 }, // Targeted at printer mouth
        colors: ['#F59E0B', '#10B981', '#F8FAFC', '#6366F1', '#D97706', '#38BDF8'],
        gravity: 1.1,
        ticks: 200,
        scalar: 0.9,
        zIndex: 9999,
      });
    }, 700);
  }, []);

  // Small celebratory sparkle burst on receipt tear
  const triggerTearConfetti = useCallback(() => {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { x: 0.5, y: 0.48 },
      colors: ['#F59E0B', '#F8FAFC', '#38BDF8', '#34D399'],
      gravity: 0.9,
      ticks: 120,
      scalar: 0.7,
      zIndex: 9999,
    });
  }, []);

  // Run the full dispense sequence
  const startDispense = useCallback(async () => {
    setIsPrinting(true);
    setIsCutting(false);
    setHasCompleted(false);
    setIsTorn(false);
    setDragPromptVisible(false);
    printCountRef.current += 1;

    // Start mechanical audio
    playPrinterSound();

    // Trigger visual animations
    await controls.start('visible');
    triggerConfetti();

    // Complete printing state after animation completes
    setTimeout(() => {
      setIsPrinting(false);
      setHasCompleted(true);
      setDragPromptVisible(true);
      if (onComplete) onComplete();
    }, 1200);
  }, [controls, onComplete, playPrinterSound, triggerConfetti]);

  // Realistic Guillotine Cut & Tear action (גזירה ותלישה)
  const handleTear = useCallback(() => {
    if (isPrinting || isTorn || isCutting) return;

    setIsCutting(true);
    playTearSound();
    triggerTearConfetti();

    // After mechanical cutter blade sweeps across slot (280ms)
    setTimeout(() => {
      setIsTorn(true);
      setIsCutting(false);
      setDragPromptVisible(false);
      if (onTearComplete) onTearComplete();
    }, 280);
  }, [isPrinting, isTorn, isCutting, onTearComplete, playTearSound, triggerTearConfetti]);

  // Handle clean replay
  const handleReplay = async () => {
    if (isPrinting) return;
    controls.set('hidden');
    confetti.reset();
    setHasCompleted(false);
    setIsTorn(false);
    setIsPrinting(false);
    setDragPromptVisible(false);

    // Debounce tick so React DOM commits the reset position before starting visible animation
    await new Promise((resolve) => setTimeout(resolve, 140));
    startDispense();
  };

  // Auto-start on mount if autoPlay is enabled
  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        startDispense();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, startDispense]);

  // Print or Download standard browser print
  const handlePrint = () => {
    window.print();
  };

  // Copy shareable link or order ID
  const handleShare = () => {
    const orderNum = receiptData?.orderNumber || 'ROAST-88241';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://coffee.digitalroast.io/verify/${orderNum}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-2 sm:p-6 w-full ${className}`}>
      {/* Title & Micro-badges Header (if provided) */}
      {(title || subtitle) && (
        <div className="text-center mb-6 space-y-1.5 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>THERMAL RECEIPT & TEAR INTERACTION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-100 tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-stone-400">
            {subtitle}
          </p>
        </div>
      )}

      {/* Printer Chassis & Dispensing / Torn Animated Receipt Paper */}
      <div className="relative flex flex-col items-center">
        <PrinterChassis
          isPrinting={isPrinting}
          isCutting={isCutting}
          isTorn={isTorn}
          statusLabel={isCutting ? 'CUTTING' : isTorn ? 'TORN' : hasCompleted ? 'DISPENSED' : 'READY'}
        >
          {/* Animated Receipt Container with Physics Dispense and Tear-Off Drag */}
          <motion.div
            variants={dispenseVariants}
            initial="hidden"
            animate={
              isTorn
                ? {
                    y: 24,
                    rotate: -2,
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 240, damping: 15 },
                  }
                : controls
            }
            drag={hasCompleted ? (isTorn ? true : 'y') : false}
            dragConstraints={
              isTorn
                ? { top: -60, bottom: 250, left: -120, right: 120 }
                : { top: 0, bottom: 70 }
            }
            dragElastic={isTorn ? 0.2 : 0.35}
            onDragEnd={(_, info) => {
              if (!isTorn && hasCompleted) {
                // If dragged down past 30px or flicked down, trigger tear!
                if (info.offset.y > 30 || info.velocity.y > 120) {
                  handleTear();
                }
              }
            }}
            className={`w-full flex justify-center transform-gpu transition-shadow cursor-grab active:cursor-grabbing ${
              isTorn ? 'relative z-30 pt-3' : ''
            }`}
          >
            <Receipt
              data={receiptData}
              isTorn={isTorn}
              canTear={hasCompleted && !isTorn}
              onTear={handleTear}
            />
          </motion.div>
        </PrinterChassis>

        {/* Floating Tear Cue / Drag Down Helper Hint */}
        {hasCompleted && !isTorn && dragPromptVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-amber-500/20 border border-amber-500/40 rounded-full px-3.5 py-1 text-[11px] text-amber-300 font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-bounce cursor-pointer select-none"
            onClick={handleTear}
          >
            <Scissors className="w-3.5 h-3.5 text-amber-400" />
            <span>משוך מטה או לחץ כאן כדי לתלוש את הקבלה ✂️</span>
          </motion.div>
        )}

        {/* Torn Confirmation Status */}
        {isTorn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-3.5 py-1 text-[11px] text-emerald-300 font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>הקבלה נתלשה בהצלחה! באפשרותך להזיזה בחופשיות 📄</span>
          </motion.div>
        )}
      </div>

      {/* Interactive Control Toolbar */}
      {showControls && (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 z-30 max-w-lg">
          {/* Tear Button (Active when printed and not yet torn) */}
          {hasCompleted && !isTorn && (
            <button
              onClick={handleTear}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer animate-pulse"
              title="תלוש את הקבלה מפתח המדפסת"
            >
              <Scissors className="w-3.5 h-3.5 text-stone-950" />
              <span>תלוש קבלה (Tear Off) ✂️</span>
            </button>
          )}

          {/* Replay / New Print Button */}
          <button
            onClick={handleReplay}
            disabled={isPrinting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-200 border border-amber-500/30 hover:border-amber-500 text-xs font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
            title="הדפס מחדש את הקבלה והפעל קונפטי"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-amber-400 ${isPrinting ? 'animate-spin' : ''}`} />
            <span>{isTorn ? 'הדפס קבלה חדשה 🖨️' : 'הדפס מחדש (Replay)'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-medium border transition-all ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-stone-950 text-stone-400 border-stone-800'
            }`}
            title="הפעל או כבה סאונד מכני של המדפסת"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>צליל מנוע & תלישה: פעיל</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                <span>צליל: מושתק</span>
              </>
            )}
          </button>

          {/* Print / Save */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-medium transition-all"
            title="הדפס לקובץ או מדפסת מקומית"
          >
            <Download className="w-3.5 h-3.5 text-stone-400" />
            <span>הורד / הדפס</span>
          </button>

          {/* Share / Copy Link */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-medium transition-all"
            title="העתק קישור לאימות קבלה"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">הועתק!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-stone-400" />
                <span>שתף אימות</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
