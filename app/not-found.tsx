'use client';

import React from 'react';
import Link from 'next/link';
import { Coffee, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian text-stone-100 flex flex-col items-center justify-center p-6 text-center dir-rtl relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full p-8 rounded-3xl liquid-glass border border-amber-500/30 space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-lg">
          <Coffee className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-amber-400 bg-stone-900 px-3 py-1 rounded-full border border-stone-800">
            ERROR 404 • EXTRACTION STOPPED
          </span>
          <h1 className="text-3xl font-black text-stone-100">העמוד לא נמצא</h1>
          <p className="text-stone-400 text-xs leading-relaxed">
            נראה שהחליטה נקטעה או שהקישור שחיפשת אינו קיים. אנא חזור לעמוד הראשי של הפלטפורמה.
          </p>
        </div>

        <Link
          href="/home"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Home className="w-4 h-4 text-black" />
          <span>חזרה לדף הבית של פלטפורמת הקפה</span>
        </Link>
      </div>
    </div>
  );
}
