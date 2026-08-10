'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CarbonFarmTracker } from '@/components/CarbonFarmTracker';
import { GeminiBaristaModal } from '@/components/GeminiBaristaModal';
import { CartDrawer } from '@/components/CartDrawer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AuthGuard } from '@/components/AuthGuard';
import { useHashScroll } from '@/lib/hooks/useHashScroll';

export default function SustainabilityPage() {
  const [isBaristaOpen, setIsBaristaOpen] = useState(false);
  useHashScroll();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-obsidian text-stone-100 flex flex-col relative overflow-hidden dir-rtl">
        {/* Ambient Glows */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-teal-500/10 rounded-full filter blur-[100px] pointer-events-none animate-float" />

        {/* Navigation Header */}
        <Header onOpenBarista={() => setIsBaristaOpen(true)} />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
          <CarbonFarmTracker />
        </main>

        <Footer />
        <ScrollToTop />
        <GeminiBaristaModal isOpen={isBaristaOpen} onClose={() => setIsBaristaOpen(false)} />
        <CartDrawer />
      </div>
    </AuthGuard>
  );
}
