'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BioEnergyMatcher } from '@/components/BioEnergyMatcher';
import WhatsAppVoiceOrderModal from '@/components/WhatsAppVoiceOrderModal';
import { GeminiBaristaModal } from '@/components/GeminiBaristaModal';
import { CartDrawer } from '@/components/CartDrawer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Sparkles, Mic, Flame, Bot } from 'lucide-react';

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
      <div className="min-h-screen bg-obsidian text-stone-100 flex flex-col relative overflow-hidden dir-rtl">
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
            Gemini 3.5 Multimodal Barista AI
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gold-gradient tracking-tight">
            בריסטה קולי & התאמה ביולוגית AI
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            שוחח בקולך עם בריסטה Gemini 3.5, התאם את זן הקפה לרמת האנרגיה והמצב רוח שלך, או בצע הזמנה מהירה בהודעה קולית ב-WhatsApp.
          </p>

          <div id="whatsapp-voice" className="flex items-center justify-center gap-4 pt-4 scroll-mt-28">
            <button
              onClick={() => setIsBaristaOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>פתח בריסטה קולי Gemini</span>
            </button>

            <button
              onClick={() => setIsWhatsAppOpen(true)}
              className="px-6 py-3 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 font-bold text-xs hover:bg-emerald-600/40 transition-all flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>הזמנה ב-WhatsApp Voice</span>
            </button>
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
