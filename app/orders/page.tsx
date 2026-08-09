'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Coffee,
  Clock,
  ShieldCheck,
  Award,
  ChevronLeft,
} from 'lucide-react';
import { OrderHistoryView } from '@/components/OrderHistoryView';
import { CanvasCoffeeSteam } from '@/components/CanvasCoffeeSteam';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-[#050404] text-stone-100 pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden dir-rtl">
      
      {/* Background Ambience & Steam Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-600/10 via-orange-600/5 to-transparent blur-[120px] rounded-full" />
        <CanvasCoffeeSteam />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
            <Link
              href="/home"
              onClick={() => coffeeSound.playBaristaClick()}
              className="hover:text-amber-400 transition-colors"
            >
              ראשי
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <Link
              href="/profile"
              onClick={() => coffeeSound.playBaristaClick()}
              className="hover:text-amber-400 transition-colors"
            >
              אזור אישי
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-amber-400 font-bold">היסטוריית הזמנות וקניות</span>
          </div>

          <Link
            href="/shop"
            onClick={() => coffeeSound.playBaristaClick()}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-1.5 rounded-full transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>המשך בקניות</span>
          </Link>
        </div>

        {/* Page Hero Header */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-amber-500/30 relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-extrabold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>ARCHIVE & LIVE ORDERS LOUNGE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-100 tracking-tight">
                היסטוריית הקניות וההזמנות שלי
              </h1>
              <p className="text-sm sm:text-base text-stone-400 max-w-2xl font-light leading-relaxed">
                צפה בכל ההזמנות שביצעת, עקוב אחר שלבי החליטה והמשלוח בזמן אמת, הזמן שוב בלחיצת כפתור והפק חשבוניות מס דיגיטליות חתומות.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/shop"
                onClick={() => coffeeSound.playBaristaClick()}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-extrabold text-xs hover:brightness-110 transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2"
              >
                <Coffee className="w-4 h-4" />
                <span>הזמן קפה חדש</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Core Order History View Component */}
        <OrderHistoryView />

      </div>
    </main>
  );
}
