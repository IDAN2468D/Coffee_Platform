'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Printer, Scissors } from 'lucide-react';

interface PrinterChassisProps {
  children: React.ReactNode;
  isPrinting?: boolean;
  isCutting?: boolean;
  isTorn?: boolean;
  modelName?: string;
  statusLabel?: string;
  className?: string;
}

const STUB_CLIP_PATH = `polygon(
  0% 0%, 100% 0%, 100% calc(100% - 4px),
  98% 100%, 96% calc(100% - 4px), 94% 100%, 92% calc(100% - 4px), 90% 100%, 88% calc(100% - 4px),
  86% 100%, 84% calc(100% - 4px), 82% 100%, 80% calc(100% - 4px), 78% 100%, 76% calc(100% - 4px),
  74% 100%, 72% calc(100% - 4px), 70% 100%, 68% calc(100% - 4px), 66% 100%, 64% calc(100% - 4px),
  62% 100%, 60% calc(100% - 4px), 58% 100%, 56% calc(100% - 4px), 54% 100%, 52% calc(100% - 4px),
  50% 100%, 48% calc(100% - 4px), 46% 100%, 44% calc(100% - 4px), 42% 100%, 40% calc(100% - 4px),
  38% 100%, 36% calc(100% - 4px), 34% 100%, 32% calc(100% - 4px), 30% 100%, 28% calc(100% - 4px),
  26% 100%, 24% calc(100% - 4px), 22% 100%, 20% calc(100% - 4px), 18% 100%, 16% calc(100% - 4px),
  14% 100%, 12% calc(100% - 4px), 10% 100%, 8% calc(100% - 4px), 6% 100%, 4% calc(100% - 4px),
  2% 100%, 0% calc(100% - 4px)
)`;

export const PrinterChassis: React.FC<PrinterChassisProps> = ({
  children,
  isPrinting = false,
  isCutting = false,
  isTorn = false,
  modelName = 'DIGITAL ROAST THERMAL-X1',
  statusLabel = 'READY',
  className = '',
}) => {
  return (
    <div className={`relative w-full max-w-[340px] sm:max-w-[350px] flex flex-col items-center select-none ${className}`}>
      {/* Upper Printer Housing */}
      <div className="w-full bg-gradient-to-b from-[#18181b] via-[#0f172a] to-[#090d16] rounded-t-3xl border-t border-x border-amber-500/30 p-4 shadow-2xl relative overflow-hidden">
        {/* Subtle Brushed Metal Accent Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        {/* Top Header Bar with Brand & Status LED */}
        <div className="flex items-center justify-between relative z-10 px-1">
          {/* Logo & Hardware Model */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Printer className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] font-black tracking-widest text-stone-200 uppercase font-mono">
                {modelName}
              </div>
              <div className="text-[9px] text-stone-400 font-mono flex items-center gap-1">
                <span>SCA CERTIFIED</span>
                <span className="text-amber-500">•</span>
                <span>203 DPI</span>
              </div>
            </div>
          </div>

          {/* Status Indicator & Pulsing LED */}
          <div className="flex items-center gap-2 bg-stone-950/70 border border-stone-800/90 rounded-full py-1 px-2.5">
            <span className="text-[9px] font-bold font-mono tracking-wider text-stone-300">
              {isCutting ? 'CUTTING' : isPrinting ? 'PRINTING' : isTorn ? 'TORN' : statusLabel}
            </span>
            <motion.div
              className={`w-2.5 h-2.5 rounded-full ${
                isCutting
                  ? 'bg-amber-300 shadow-[0_0_10px_#fde047]'
                  : isPrinting
                  ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                  : isTorn
                  ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'
                  : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
              }`}
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: isPrinting || isCutting ? 0.3 : 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Ventilation Slits / Texture Detail */}
        <div className="mt-3.5 flex justify-center gap-1.5 opacity-60">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-4 h-1 rounded-full bg-stone-800 shadow-inner" />
          ))}
        </div>
      </div>

      {/* Printer Paper Slot Section */}
      <div className="w-full relative z-20">
        {/* Thermal Slot Bar with Deep Recessed Shadow & Metal Cutting Blade */}
        <div
          className="w-full h-8 bg-[#05070c] border-x border-b border-stone-800/80 flex items-center justify-center relative overflow-hidden"
          style={{
            boxShadow: 'inset 0 8px 16px rgba(0, 0, 0, 0.95), 0 4px 12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Metal Blade Teeth Track */}
          <div className="absolute top-0 left-2 right-2 h-[2px] bg-stone-600/50 flex justify-between overflow-hidden">
            {[...Array(32)].map((_, i) => (
              <div key={i} className="w-[2px] h-[3px] bg-stone-400/80" />
            ))}
          </div>

          {/* Laser Heating Print Line Indicator during dispense */}
          {isPrinting && (
            <motion.div
              className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Guillotine Blade Gliding Animation across the slot during Cut */}
          {isCutting && (
            <motion.div
              initial={{ x: '120%' }}
              animate={{ x: '-120%' }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="absolute top-0 bottom-0 w-20 bg-gradient-to-l from-transparent via-amber-300 to-white shadow-[0_0_18px_#fbbf24] z-40 pointer-events-none flex items-center justify-center"
            >
              <div className="w-[3px] h-full bg-white shadow-[0_0_10px_#ffffff]" />
              <Scissors className="w-4 h-4 text-amber-300 transform -rotate-90 animate-pulse ml-1" />
            </motion.div>
          )}

          {/* Remaining White Paper Roll Stub when Receipt is Torn */}
          {isTorn && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 w-[92%] h-3 bg-[#F8FAFC] shadow-md origin-top z-10"
              style={{
                clipPath: STUB_CLIP_PATH,
                WebkitClipPath: STUB_CLIP_PATH,
              }}
            />
          )}

          {/* Slot Lip Shadow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-black/90" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-amber-500/20" />
        </div>

        {/* The Paper Output Port (overflow-hidden during dispense to clip paper behind slot, overflow-visible when torn) */}
        <div
          className={`w-full relative ${isTorn ? 'overflow-visible' : 'overflow-hidden'}`}
          style={{ margin: '-2px 0 0 0' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
