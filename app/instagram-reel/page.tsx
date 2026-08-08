'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollParallaxCoffeeShowcase } from '@/components/ScrollParallaxCoffeeShowcase';
import { ParallaxBeanCanvas } from '@/components/ParallaxBeanCanvas';
import { GeminiBaristaModal } from '@/components/GeminiBaristaModal';
import { CartDrawer } from '@/components/CartDrawer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AuthGuard } from '@/components/AuthGuard';

export default function InstagramReelCoffeePage() {
  const [isBaristaOpen, setIsBaristaOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#070504] text-stone-100 flex flex-col relative overflow-hidden dir-rtl">
        {/* Parallax Floating Roasted Beans Canvas */}
        <ParallaxBeanCanvas beanCount={48} interactiveMouse={true} />

        {/* Warm Bokeh Ambiance Glows */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-amber-500/12 rounded-full filter blur-[140px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 left-10 w-[420px] h-[420px] bg-orange-600/10 rounded-full filter blur-[120px] pointer-events-none animate-float" />
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-[#3d2114]/25 rounded-full filter blur-[150px] pointer-events-none" />

        {/* Top Header */}
        <Header onOpenBarista={() => setIsBaristaOpen(true)} />

        {/* Main Reel Parallax Container */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
          <ScrollParallaxCoffeeShowcase />
        </main>

        {/* Footer & Modals */}
        <Footer />
        <CartDrawer />
        <GeminiBaristaModal isOpen={isBaristaOpen} onClose={() => setIsBaristaOpen(false)} />
        <ScrollToTop />
      </div>
    </AuthGuard>
  );
}
