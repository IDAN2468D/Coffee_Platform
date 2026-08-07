'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BioEnergyMatcher } from '@/components/BioEnergyMatcher';
import WhatsAppVoiceOrderModal from '@/components/WhatsAppVoiceOrderModal';
import { GeminiBaristaModal } from '@/components/GeminiBaristaModal';
import { CartDrawer } from '@/components/CartDrawer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Sparkles, Mic, Camera, Volume2, Droplets, Compass, Wine, Bot, ShieldCheck } from 'lucide-react';

import { AuthGuard } from '@/components/AuthGuard';
import { useHashScroll } from '@/lib/hooks/useHashScroll';

export default function AiBaristaPage() {
  const [isBaristaOpen, setIsBaristaOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  useHashScroll();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-obsidian text-stone-100 flex flex-col relative overflow-hidden dir-rtl" style={{ direction: 'rtl' }}>
      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none animate-float" />

      {/* Navigation Header */}
      <Header
        onOpenBarista={() => setIsBaristaOpen(true)}
        onScrollToSection={scrollToSection}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
        {/* Page Hero Header */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Bot className="w-4 h-4 text-cyan-400" />
            Gemini 3.5 Multimodal Barista AI Ultra
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gold-gradient tracking-tight">
            בריסטה קולי & מנוע מולטי-מודאלי Ultra AI
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            מערכת בינה מלאכותית מקיפה לקפה: ניתוח אקוסטי של תדר סכיני הטחינה, זיהוי בעבוע Bloom וטריות, הדרכת לאטה ארט AR, וסטודיו מיקסולוגיית קפה.
          </p>

          <div id="whatsapp-voice" className="flex flex-wrap items-center justify-center gap-4 pt-4 scroll-mt-28">
            <button
              onClick={() => setIsBaristaOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-cyan-500 text-stone-950 font-black text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-xl shadow-amber-500/20 scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>הפעל Gemini 3.5 Multimodal Ultra</span>
            </button>

            <button
              onClick={() => setIsWhatsAppOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-600/30 transition-all flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>הזמנה ב-WhatsApp Voice</span>
            </button>
          </div>
        </section>

        {/* 6 Multimodal Features Showcase Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            onClick={() => setIsBaristaOpen(true)}
            className="p-4 rounded-2xl liquid-glass border border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer text-center space-y-2 group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-200">הזמנה קולית</h4>
            <p className="text-[10px] text-stone-400">חילוץ ישויות הזמנה בעברית מלאה</p>
          </div>

          <div
            onClick={() => setIsBaristaOpen(true)}
            className="p-4 rounded-2xl liquid-glass border border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer text-center space-y-2 group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-200">זיהוי פולים</h4>
            <p className="text-[10px] text-stone-400">Agtron index וסיווג ניקוד Cupping</p>
          </div>

          <div
            onClick={() => setIsBaristaOpen(true)}
            className="p-4 rounded-2xl liquid-glass border border-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer text-center space-y-2 group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Volume2 className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-200">ניתוח אקוסטי</h4>
            <p className="text-[10px] text-stone-400">דגימת תדר Hz של סכיני טחינה</p>
          </div>

          <div
            onClick={() => setIsBaristaOpen(true)}
            className="p-4 rounded-2xl liquid-glass border border-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer text-center space-y-2 group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-200">בעבוע Bloom</h4>
            <p className="text-[10px] text-stone-400">נפח בועות $CO_2$ ומדד טריות</p>
          </div>

          <div
            onClick={() => setIsBaristaOpen(true)}
            className="p-4 rounded-2xl liquid-glass border border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer text-center space-y-2 group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-200">לאטה ארט AR</h4>
            <p className="text-[10px] text-stone-400">הדרכת זווית מזיגה ומהירות</p>
          </div>

          <div
            onClick={() => setIsBaristaOpen(true)}
            className="p-4 rounded-2xl liquid-glass border border-rose-500/20 hover:border-rose-500/50 transition-all cursor-pointer text-center space-y-2 group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wine className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-200">מיקסולוגיה AI</h4>
            <p className="text-[10px] text-stone-400">קוקטיילים ומוקטיילים מבוססי קפה</p>
          </div>
        </section>

        {/* Bio Energy Matcher Component */}
        <section id="bio-energy">
          <BioEnergyMatcher />
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <GeminiBaristaModal isOpen={isBaristaOpen} onClose={() => setIsBaristaOpen(false)} />
      {isWhatsAppOpen && <WhatsAppVoiceOrderModal onClose={() => setIsWhatsAppOpen(false)} />}
      <ScrollToTop />
    </div>
    </AuthGuard>
  );
}

