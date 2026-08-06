'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CorporateCoffeeLounge } from '@/components/CorporateCoffeeLounge';
import { GeminiGiftSommelier } from '@/components/GeminiGiftSommelier';
import { MultiRoasterMarketplace } from '@/components/MultiRoasterMarketplace';
import FarmToCupStoryteller from '@/components/FarmToCupStoryteller';
import SmartInventoryManager from '@/components/SmartInventoryManager';
import { GeminiBaristaModal } from '@/components/GeminiBaristaModal';
import { CartDrawer } from '@/components/CartDrawer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Building2, Gift, Store, BookOpen, Zap } from 'lucide-react';

import { AuthGuard } from '@/components/AuthGuard';
import { useHashScroll } from '@/lib/hooks/useHashScroll';

export default function CorporatePage() {
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
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-[100px] pointer-events-none animate-float" />

      {/* Navigation Header */}
      <Header
        onOpenBarista={() => setIsBaristaOpen(true)}
        onScrollToSection={scrollToSection}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
        {/* Page Hero Header */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Building2 className="w-4 h-4 text-amber-400" />
            פתרונות B2B למשרדים, מתנות ושוק היבואנים
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gold-gradient tracking-tight">
            פתרונות עסקיים & אשף מתנות AI
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            ציוד קפה מתקדם למשרדי הייטק, מארזי מתנה מותאמים אישית על ידי Gemini, ושוק קולים עצמאיים בינלאומי.
          </p>
        </section>

        {/* Corporate Coffee Lounge */}
        <section id="corporate-lounge">
          <CorporateCoffeeLounge />
        </section>

        {/* Gemini Gift Sommelier */}
        <section id="gift-sommelier">
          <GeminiGiftSommelier />
        </section>

        {/* Multi-Roaster Marketplace */}
        <section id="multi-roaster-marketplace">
          <MultiRoasterMarketplace />
        </section>

        {/* Smart Inventory Replenisher */}
        <section id="smart-inventory">
          <SmartInventoryManager />
        </section>

        {/* Farm to Cup Storyteller */}
        <section id="farm-story">
          <FarmToCupStoryteller />
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
