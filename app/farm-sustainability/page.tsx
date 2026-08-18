'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CarbonFarmTracker } from '@/components/CarbonFarmTracker';
import { GeminiBaristaModal } from '@/components/GeminiBaristaModal';
import { CartDrawer } from '@/components/CartDrawer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AuthGuard } from '@/components/AuthGuard';

export default function FarmSustainabilityPage() {
  const [isBaristaOpen, setIsBaristaOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-obsidian text-stone-100 flex flex-col relative overflow-hidden dir-rtl">
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
