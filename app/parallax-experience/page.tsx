'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StickyParallaxCoffee } from '@/components/StickyParallaxCoffee';
import { ParallaxBeanCanvas } from '@/components/ParallaxBeanCanvas';
import { GeminiBaristaModal } from '@/components/GeminiBaristaModal';
import { CartDrawer } from '@/components/CartDrawer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AuthGuard } from '@/components/AuthGuard';

export default function ParallaxExperiencePage() {
  const [isBaristaOpen, setIsBaristaOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-obsidian text-stone-100 flex flex-col relative overflow-hidden dir-rtl">
        {/* Multi-Layer 3D Floating Coffee Beans Parallax Canvas */}
        <ParallaxBeanCanvas beanCount={42} interactiveMouse={true} />

        {/* Ambient Glows */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none animate-float" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow" />

        {/* Header */}
        <Header onOpenBarista={() => setIsBaristaOpen(true)} />

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">
          <StickyParallaxCoffee />
        </main>

        {/* Modals & Footer */}
        <Footer />
        <CartDrawer />
        <GeminiBaristaModal isOpen={isBaristaOpen} onClose={() => setIsBaristaOpen(false)} />
        <ScrollToTop />
      </div>
    </AuthGuard>
  );
}
