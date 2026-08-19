'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { CremaFluidAnimation } from '@/components/CremaFluidAnimation';
import { AromaHeatwaveCup3D } from '@/components/AromaHeatwaveCup3D';
import { RoastCrackBurst, RoastCrackBurstHandle } from '@/components/RoastCrackBurst';
import { GlassBorderBeam } from '@/components/GlassBorderBeam';
import { BrewAcousticWaveform } from '@/components/BrewAcousticWaveform';

import {
  Sparkles,
  Flame,
  Droplets,
  Activity,
  Zap,
  Sliders,
  Layers,
  Eye,
  Compass,
  ArrowLeft,
  Coffee,
  RotateCcw,
  Palette,
  Volume2,
  Check,
} from 'lucide-react';

export default function AnimationsStudioPage() {
  const burstRef = useRef<RoastCrackBurstHandle | null>(null);

  // Active showcase tabs
  const [activeTab, setActiveTab] = useState<'crema' | 'cup3d' | 'embers' | 'borderBeam' | 'acoustic'>('crema');

  // Border Beam Customizer
  const [beamColorFrom, setBeamColorFrom] = useState<string>('#f59e0b');
  const [beamColorTo, setBeamColorTo] = useState<string>('#fbbf24');
  const [beamDuration, setBeamDuration] = useState<number>(6);
  const [beamSize, setBeamSize] = useState<number>(240);

  // Stats from Crema
  const [cremaStats, setCremaStats] = useState<{ viscosity: number; cremaThickness: number; temp: number }>({
    viscosity: 3.5,
    cremaThickness: 4.5,
    temp: 93.5,
  });

  const handleTriggerBurst = () => {
    if (burstRef.current) {
      burstRef.current.burst();
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black dir-rtl" dir="rtl">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Hero Section */}
        <div className="relative text-center py-10 overflow-hidden mb-12">
          {/* Glass Aurora Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 glass-aurora pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4 shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
            <span>LIQUID GLASS 4.0 PRO • מנועי אנימציה ופיזיקת קפה</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            סטודיו האנימציות & <span className="text-gold-gradient">פיזיקת החליטה הדינמית</span>
          </h1>

          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base leading-relaxed">
            חוויית מולטימדיה אינטראקטיבית בזמן אמת: סימולציות הידרו-דינמיות של קרמה, גלי חום תרמיים, כוס זכוכית 3D, פיצוצי First Crack, קרני אור היקפיות ותדרי שמע אקוסטיים.
          </p>

          {/* Tab Navigation Pill Bar */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 z-20 relative">
            {[
              { id: 'crema', label: 'זרימת קרמה Fluid', icon: Droplets },
              { id: 'cup3d', label: 'כוס 3D & גלי ארומה', icon: Coffee },
              { id: 'embers', label: 'פיצוץ First Crack', icon: Flame },
              { id: 'borderBeam', label: 'קרן אור Border Beam', icon: Sparkles },
              { id: 'acoustic', label: 'ויזואליזטור אקוסטי', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all backdrop-blur-xl border ${
                    isActive
                      ? 'bg-amber-500 text-black border-amber-400 shadow-xl shadow-amber-500/25 scale-105'
                      : 'bg-stone-900/70 text-stone-300 border-white/10 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Interactive Showcases */}
        <div className="space-y-12">
          {/* TAB 1: Crema Fluid Dynamics */}
          {activeTab === 'crema' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 p-4 rounded-2xl border border-amber-500/20">
                <div>
                  <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    <span>סימולציית זרימת קרמה ואספרסו ב-Canvas (Hydro-Fluid 60FPS)</span>
                  </h2>
                  <p className="text-stone-400 text-xs mt-1">
                    מנוע פיזיקת נוזלים המדמה זרימה צמיגית, פסי נמר (Tiger Stripes), מיקרו-בועות קצף ושינוי צבע בהתאם לחום.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-stone-300">
                    צמיגות: <span className="text-amber-400 font-bold">{cremaStats.viscosity.toFixed(1)} cP</span>
                  </div>
                  <div className="text-stone-300">
                    שכבת קרמה: <span className="text-amber-400 font-bold">{cremaStats.cremaThickness.toFixed(1)} mm</span>
                  </div>
                  <div className="text-stone-300">
                    טמפרטורה: <span className="text-amber-400 font-bold">{cremaStats.temp.toFixed(1)}°C</span>
                  </div>
                </div>
              </div>

              {/* Main Fluid Canvas Component */}
              <div className="h-[480px] w-full">
                <CremaFluidAnimation
                  className="w-full h-full"
                  showControls={true}
                  onStatsChange={setCremaStats}
                />
              </div>
            </div>
          )}

          {/* TAB 2: 3D Aroma Heatwave Cup */}
          {activeTab === 'cup3d' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <AromaHeatwaveCup3D
                  className="h-[520px] w-full"
                  temperature={93.5}
                  roastNotes={['יסמין ופרחים', 'שוקולד מריר', 'הדרים וברגמוט', 'דבש בר', 'קרמל קלוי', 'פירות יער']}
                />
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-3xl bg-stone-900/70 border border-amber-500/20 backdrop-blur-xl space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                    <Sparkles className="w-5 h-5" />
                    <span>מאפייני כוס הזכוכית 3D</span>
                  </div>
                  <ul className="text-xs text-stone-300 space-y-2.5 leading-relaxed list-disc list-inside">
                    <li><strong className="text-white">Perspective 3D Tilt:</strong> הכוס עוקבת בדיוק אחר זוויות העכבר לחוויית עומק מציאותית.</li>
                    <li><strong className="text-white">Thermal Heatwave Canvas:</strong> שכבת אופטיקה המדמה שבירת קרני אור ועיוות חום מעל ספל האספרסו.</li>
                    <li><strong className="text-white">Aroma Rune Spawner:</strong> הקלקה על הכוס משחררת נחילי חלקיקי ארומה סנסוריים זוהרים.</li>
                    <li><strong className="text-white">Liquid Meniscus Sheen:</strong> הברק הפנימי מתעדכן לפי זווית ההטיה.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: First Crack Particle Burst */}
          {activeTab === 'embers' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-stone-900/60 border border-amber-500/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    <span>תא פיצוץ חלקיקי קלייה First Crack</span>
                  </h2>
                  <p className="text-stone-400 text-xs mt-1">
                    לחץ על כרטיס החלקיקים או על הכפתור למטה כדי להפעיל פיצוץ חלקיקי ניצוצות, גחלים ומוץ קפה מרחף.
                  </p>
                </div>

                <button
                  onClick={handleTriggerBurst}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <Flame className="w-4 h-4" />
                  <span>הפעל פיצוץ First Crack 🔥</span>
                </button>
              </div>

              {/* Particle Chamber Canvas */}
              <RoastCrackBurst
                ref={burstRef}
                className="h-96 w-full rounded-3xl border border-amber-500/30 bg-stone-950/90 flex items-center justify-center cursor-pointer"
                ambientEmbers={true}
                intensity={1.2}
              >
                <div className="text-center pointer-events-none p-6 bg-stone-900/60 rounded-2xl border border-white/10 backdrop-blur-md max-w-md">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3">
                    <Zap className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">לחץ בכל מקום להפעלת ניצוצות</h3>
                  <p className="text-stone-400 text-xs">פיזיקת חלקיקים בזמן אמת עם כבידה, סחיפה תרמית ודעיכת אלפא</p>
                </div>
              </RoastCrackBurst>
            </div>
          )}

          {/* TAB 4: Glass Border Beam */}
          {activeTab === 'borderBeam' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Customizer Controls */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-stone-900/70 border border-amber-500/20 backdrop-blur-xl space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                    <Palette className="w-5 h-5" />
                    <span>בקרת קרן אור Border Beam</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-300 mb-1">צבע התחלה של הקרן:</label>
                      <div className="flex items-center gap-2">
                        {['#f59e0b', '#06b6d4', '#10b981', '#ec4899', '#8b5cf6'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setBeamColorFrom(c)}
                            style={{ backgroundColor: c }}
                            className={`w-7 h-7 rounded-full transition-all ${
                              beamColorFrom === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">צבע סיום של הקרן:</label>
                      <div className="flex items-center gap-2">
                        {['#fbbf24', '#38bdf8', '#34d399', '#f472b6', '#a78bfa'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setBeamColorTo(c)}
                            style={{ backgroundColor: c }}
                            className={`w-7 h-7 rounded-full transition-all ${
                              beamColorTo === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-stone-300 mb-1">
                        <span>משך מחזור הקרן:</span>
                        <span className="text-amber-400 font-bold">{beamDuration}s</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="14"
                        step="1"
                        value={beamDuration}
                        onChange={(e) => setBeamDuration(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-stone-300 mb-1">
                        <span>אורך הקרן (Size):</span>
                        <span className="text-amber-400 font-bold">{beamSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="400"
                        step="20"
                        value={beamSize}
                        onChange={(e) => setBeamSize(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Card Preview with Border Beam */}
                <div className="lg:col-span-7 flex items-center justify-center">
                  <GlassBorderBeam
                    colorFrom={beamColorFrom}
                    colorTo={beamColorTo}
                    duration={beamDuration}
                    size={beamSize}
                    className="w-full max-w-md shadow-2xl"
                  >
                    <div className="p-8 rounded-3xl bg-stone-900/90 backdrop-blur-2xl border border-white/10 text-center space-y-4">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                        <Sparkles className="w-7 h-7 animate-pulse" />
                      </div>
                      <h3 className="text-xl font-bold text-white">כרטיס Liquid Glass 4.0 Pro</h3>
                      <p className="text-stone-300 text-xs leading-relaxed">
                        קרן האור נעה באופן חלק סביב קווי המתאר של הזכוכית. לחץ בכל מקום בכרטיס ליצירת אפקט גל מים (Liquid Ripple).
                      </p>
                      <div className="pt-2">
                        <button className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20">
                          אינטראקציה חיה
                        </button>
                      </div>
                    </div>
                  </GlassBorderBeam>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Acoustic Waveform Visualizer */}
          {activeTab === 'acoustic' && (
            <div className="space-y-6">
              <BrewAcousticWaveform
                className="w-full"
                autoPlay={true}
                barsCount={64}
                colorScheme="amber"
                mode="pump9bar"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-stone-900/60 border border-white/10">
                  <div className="text-amber-400 font-bold mb-1">משאבת לחץ ULKA 9Bar</div>
                  <div className="text-stone-400">ניטור תדרי 50Hz/60Hz עם סימולציית פעימות לחץ ורזוננס הידראולי.</div>
                </div>
                <div className="p-4 rounded-2xl bg-stone-900/60 border border-white/10">
                  <div className="text-cyan-400 font-bold mb-1">סכיני מטחנה שטוחות</div>
                  <div className="text-stone-400">תדרים גבוהים (3kHz-8kHz) המודדים חיכוך חלקיקים ואחידות טחינה.</div>
                </div>
                <div className="p-4 rounded-2xl bg-stone-900/60 border border-white/10">
                  <div className="text-emerald-400 font-bold mb-1">חיבור מיקרופון חי (Web Audio)</div>
                  <div className="text-stone-400">מדידת ספקטרום אקוסטי חי בזמן אמת ישירות ממיקרופון המכשיר.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Animation Suite Features Grid */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-2">ארסנל האנימציות הפעיל באתר</h3>
            <p className="text-stone-400 text-xs">כל הרכיבים מותאמים ל-120Hz ולמכשירי מובייל עם ביצועי GPU מלאים</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-stone-900/60 border border-amber-500/20 backdrop-blur-xl">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-3">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="font-bold text-white text-sm mb-1">Crema Fluid 60FPS</div>
              <div className="text-stone-400">סימולציית נוזלים וצמיגות אספרסו ב-HTML5 Canvas.</div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-900/60 border border-cyan-500/20 backdrop-blur-xl">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-3">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="font-bold text-white text-sm mb-1">3D Cup & Heatwaves</div>
              <div className="text-stone-400">עיוות אופטי תרמי, נחילי קיטור וחלקיקי ארומה מרחפים.</div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-900/60 border border-orange-500/20 backdrop-blur-xl">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-300 flex items-center justify-center mb-3">
                <Flame className="w-4 h-4" />
              </div>
              <div className="font-bold text-white text-sm mb-1">First Crack Burst</div>
              <div className="text-stone-400">פיצוץ גחלים, ניצוצות ומוץ קלייה באינטראקציה.</div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-900/60 border border-purple-500/20 backdrop-blur-xl">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="font-bold text-white text-sm mb-1">Glass Border Beam</div>
              <div className="text-stone-400">קרן אור היקפית ואפקט שבירה קאוסטי על כרטיסי זכוכית.</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
