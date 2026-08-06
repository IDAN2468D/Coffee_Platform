'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CustomRoastStudio } from '@/components/CustomRoastStudio';
import PersonalBrewJournal from '@/components/PersonalBrewJournal';
import LatteArtVisualTrainer from '@/components/LatteArtVisualTrainer';
import RoastClubGamification from '@/components/RoastClubGamification';
import { LiveCuppingRoom } from '@/components/LiveCuppingRoom';
import { GeminiBaristaModal } from '@/components/GeminiBaristaModal';
import { CartDrawer } from '@/components/CartDrawer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Sliders, Award, BookOpen, Droplets, Star } from 'lucide-react';

import { AuthGuard } from '@/components/AuthGuard';
import { useHashScroll } from '@/lib/hooks/useHashScroll';

export default function StudioPage() {
  const [isBaristaOpen, setIsBaristaOpen] = useState(false);
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
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-orange-500/10 rounded-full filter blur-[100px] pointer-events-none animate-float" />

      {/* Navigation Header */}
      <Header
        onOpenBarista={() => setIsBaristaOpen(true)}
        onScrollToSection={scrollToSection}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
        {/* Page Hero Header */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sliders className="w-4 h-4 text-amber-400" />
            סטודיו קלייה אישית & מועדון חברים
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gold-gradient tracking-tight">
            סטודיו קלייה אישית & Roast Club
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            עצב תערובת קלייה מותאמת אישית, עקוב אחר יומן החליטות שלך, התאמן על יצירת Latte Art ולמד בדרגות מועדון ה-Roast Club.
          </p>
        </section>

        {/* Custom Roast Studio */}
        <section id="custom-roast-studio">
          <CustomRoastStudio />
        </section>

        {/* Personal Brew Journal */}
        <section id="personal-brew-journal">
          <PersonalBrewJournal />
        </section>

        {/* Latte Art Visual Trainer */}
        <section id="latte-art-trainer">
          <LatteArtVisualTrainer />
        </section>

        {/* Roast Club Gamification */}
        <section id="gamification">
          <RoastClubGamification />
        </section>

        {/* Live Cupping Room */}
        <section id="live-cupping-room">
          <LiveCuppingRoom />
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <GeminiBaristaModal isOpen={isBaristaOpen} onClose={() => setIsBaristaOpen(false)} />
      <ScrollToTop />
    </div>
    </AuthGuard>
  );
}
