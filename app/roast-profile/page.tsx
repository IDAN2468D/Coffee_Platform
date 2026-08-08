'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RoastProfileRadar } from '@/components/RoastProfileRadar';
import { RoastProfileDesigner } from '@/components/RoastProfileDesigner';
import { GeminiBaristaModal } from '@/components/GeminiBaristaModal';
import { CartDrawer } from '@/components/CartDrawer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AuthGuard } from '@/components/AuthGuard';

export default function RoastProfilePage() {
  const [isBaristaOpen, setIsBaristaOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-obsidian text-stone-100 flex flex-col relative overflow-hidden dir-rtl">
        {/* Ambient Glows */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-orange-500/10 rounded-full filter blur-[100px] pointer-events-none animate-float" />

        <Header onOpenBarista={() => setIsBaristaOpen(true)} />
        
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
          <RoastProfileRadar />
          <RoastProfileDesigner />
        </main>

        <Footer />
        <CartDrawer />
        <GeminiBaristaModal isOpen={isBaristaOpen} onClose={() => setIsBaristaOpen(false)} />
        <ScrollToTop />
      </div>
    </AuthGuard>
  );
}
