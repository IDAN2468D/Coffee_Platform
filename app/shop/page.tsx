'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CoffeeCatalog } from '@/components/CoffeeCatalog';
import CoffeeFoodSommelier from '@/components/CoffeeFoodSommelier';
import { SensoryRadarWheel } from '@/components/SensoryRadarWheel';
import { SubscriptionCalculator } from '@/components/SubscriptionCalculator';
import { GeminiBaristaModal } from '@/components/GeminiBaristaModal';
import { CartDrawer } from '@/components/CartDrawer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { AuthGuard } from '@/components/AuthGuard';
import { useHashScroll } from '@/lib/hooks/useHashScroll';

export default function ShopPage() {
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
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            חנות פולי גורמה & סומלייר מאפים
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gold-gradient tracking-tight">
            קטלוג קפה גורמה & התאמת טעמים
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            גלה פולי קפה מזני נחלה יחידנים (Single Origin), תערובות אספרסו זוכות פרסים וזיווגי מאפים מותאמים אישית ע"י סומלייר AI.
          </p>
        </section>

        {/* Coffee Catalog Component */}
        <section id="catalog">
          <CoffeeCatalog />
        </section>

        {/* Sensory Radar Wheel */}
        <section id="sensory-radar">
          <SensoryRadarWheel />
        </section>

        {/* Coffee & Food Sommelier */}
        <section id="sommelier">
          <CoffeeFoodSommelier />
        </section>

        {/* Subscription Calculator */}
        <section id="subscription">
          <SubscriptionCalculator />
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
