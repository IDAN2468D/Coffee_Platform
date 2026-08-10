'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { V60BrewMaster } from '@/components/V60BrewMaster';
import EspressoExtractionTelemetry from '@/components/EspressoExtractionTelemetry';
import { ExtractionSimulator } from '@/components/ExtractionSimulator';
import WaterChemistryProfiler from '@/components/WaterChemistryProfiler';
import { ColdBrewNitroCalculator } from '@/components/ColdBrewNitroCalculator';
import { MolecularPairingRadar } from '@/components/MolecularPairingRadar';
import { GeminiBaristaModal } from '@/components/GeminiBaristaModal';
import { CartDrawer } from '@/components/CartDrawer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { TestTube, Flame, Activity, Clock, Snowflake, FlaskConical } from 'lucide-react';

import { AuthGuard } from '@/components/AuthGuard';
import { useHashScroll } from '@/lib/hooks/useHashScroll';

export default function BrewLabPage() {
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
            <TestTube className="w-4 h-4 text-cyan-400" />
            מעבדת הטכנולוגיה & טלמטריית חליטה
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gold-gradient tracking-tight">
            מעבדת החליטה & מדדי מיצוי
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            טיימר V60 בזמן אמת, מודל כימיית מי חליטה (PPM / Gh / Kh), חישוב מדדי TDS ומיצוי אספרסו (EY%), ומחשבון חליטה קרה Nitro Cold Brew.
          </p>
        </section>

        {/* V60 Brew Master Timer */}
        <section id="v60">
          <V60BrewMaster />
        </section>

        {/* Water Chemistry Profiler */}
        <section id="water-chemistry">
          <WaterChemistryProfiler />
        </section>

        {/* Espresso Extraction Telemetry */}
        <section id="extraction-telemetry">
          <EspressoExtractionTelemetry />
        </section>

        {/* Extraction Simulator */}
        <section id="extraction-sim">
          <ExtractionSimulator />
        </section>

        {/* Cold Brew Nitro Calculator */}
        <section id="cold-brew-calculator">
          <ColdBrewNitroCalculator />
        </section>

        {/* Anaerobic Fermentation & Molecular Pairing Radar */}
        <section id="molecular-pairing">
          <MolecularPairingRadar />
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
