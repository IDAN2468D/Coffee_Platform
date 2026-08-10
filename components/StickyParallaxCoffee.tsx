'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Coffee,
  Sparkles,
  Zap,
  Activity,
  Sliders,
  Droplets,
  Award,
  Layers,
  Flame,
  Clock,
  Compass,
  CheckCircle2,
  Plus,
  ShoppingBag,
  ArrowDown,
  Volume2,
  ChevronLeft,
  Gauge,
  Thermometer,
  ShieldCheck,
  Disc,
  Eye,
  RefreshCw,
  Play,
  VolumeX,
} from 'lucide-react';
import { SteamParticlesCanvas } from '@/components/SteamParticlesCanvas';
import { useCartStore } from '@/lib/store/useCartStore';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export interface CoffeeStage {
  id: number;
  stageKey: 'beans' | 'grind' | 'extraction' | 'latte-art';
  badge: string;
  hebrewTitle: string;
  subTitle: string;
  elevation: string;
  metric1: { label: string; value: string };
  metric2: { label: string; value: string };
  metric3: { label: string; value: string };
  description: string;
  sensoryNotes: string[];
  bgGlow: string;
  mediaVisual: string;
  accentColor: string;
}

const STAGES: CoffeeStage[] = [
  {
    id: 1,
    stageKey: 'beans',
    badge: 'STAGE 01 • TERROIR & HARVEST',
    hebrewTitle: '1. פולי מקור שלמים (Whole Beans)',
    subTitle: 'אתיופיה ירגשף היירלום • גידול גבהים 2,100 מטר',
    elevation: '2,100m MASL (ירגשף, אתיופיה)',
    metric1: { label: 'Agtron Gourmet', value: '#88 Light' },
    metric2: { label: 'צפיפות פול', value: '720 g/L' },
    metric3: { label: 'לחות גרעין', value: '10.8%' },
    description:
      'פולי Heirloom אורגניים שנאספו ידנית בחוות ירגשף הפראיות. הקלייה הבהירה משמרת את המולקולות הארומטיות והטרפנים הטבעיים ללא שריפת שמנים.',
    sensoryNotes: ['פרחי יסמין', 'ברגמוט ציטרוסי', 'דבש בר טבעי', 'משמש עדין'],
    bgGlow: 'from-amber-500/30 via-orange-500/15 to-transparent',
    mediaVisual: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    accentColor: '#f59e0b',
  },
  {
    id: 2,
    stageKey: 'grind',
    badge: 'STAGE 02 • ACOUSTIC TUNING',
    hebrewTitle: '2. טחינה מיקרומטרית הומוגנית',
    subTitle: 'סכינים שטוחות 64mm SSP Red Speed • דיוק 380µm',
    elevation: 'Micron Accuracy: 380µm ±15µm',
    metric1: { label: 'גודל חלקיק', value: '380 µm' },
    metric2: { label: 'תדר הרמוני', value: '3,850 Hz' },
    metric3: { label: 'אחידות פיזור', value: '98.4%' },
    description:
      'מערכת האזנה אקוסטית בתדר 3,850Hz מכוילת את מרווח הסכינים בדיוק של 15 מיקרון, ומבטיחה חלוקת חלקיקים מושלמת המונעת פריצת תעלות (Channeling).',
    sensoryNotes: ['אחידות מקסימלית', 'ללא אבק Fines', 'חסינות מ-Channeling', 'התנגדות 9Bar'],
    bgGlow: 'from-cyan-500/30 via-blue-500/15 to-transparent',
    mediaVisual: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    accentColor: '#06b6d4',
  },
  {
    id: 3,
    stageKey: 'extraction',
    badge: 'STAGE 03 • 9BAR PRESSURE FLOW',
    hebrewTitle: '3. מיצוי 9Bar וקרמה מוזהבת',
    subTitle: 'PID 93.5°C • יחס חליטה 1:2 (18g פולים ➔ 36g אספרסו)',
    elevation: 'Yield 36g • Time 27.5s • 9Bar Ramp',
    metric1: { label: 'לחץ חליטה', value: '9.0 Bar' },
    metric2: { label: 'טמפ׳ PID', value: '93.5 °C' },
    metric3: { label: 'מדד קרמה CDI', value: '94%' },
    description:
      'השריית פרה-אינפיוז׳ן ב-2.5Bar ואחריה עלייה ל-9Bar בטמפרטורה יציבה יוצרת מיצוי מבוקר (EY 21.8%) עם קרמה סמיכה, מתיקות קרמלית וגוף קטיפתי.',
    sensoryNotes: ['קרמה סמיכה ומוזהבת', 'מתיקות קרמל עמוקה', 'חומציות מאוזנת', 'סיומת ארוכה'],
    bgGlow: 'from-orange-500/30 via-amber-600/15 to-transparent',
    mediaVisual: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&auto=format&fit=crop&q=80',
    accentColor: '#ea580c',
  },
  {
    id: 4,
    stageKey: 'latte-art',
    badge: 'STAGE 04 • SILKY FOAM & AR 3D',
    hebrewTitle: '4. מזיגת לאטה ארט & וקטוריזטור קקאו',
    subTitle: 'מיקרו-פואם משי 65°C • הדפסת קקאו תלת-ממדית AR',
    elevation: 'Foam Depth 14mm • Symmetry 96%',
    metric1: { label: 'טמפ׳ הקצפה', value: '65.0 °C' },
    metric2: { label: 'קוטר בועות', value: '1.2 mm' },
    metric3: { label: 'סימטריה AR', value: '96.0%' },
    description:
      'הקצפת חלב קטיפתי במרקם משי עם בועות מיקרוסקופיות. וקטוריזטור ה-AI מפסל רוזטה מושלמת ומפזר אבקת קקאו טבעית במיקרו-דיוק תלת-ממדי.',
    sensoryNotes: ['מרקם משי קטיפתי', 'איזון חלבי מושלם', 'אבקת קקאו מובחרת', 'פיסול 3D'],
    bgGlow: 'from-amber-400/30 via-yellow-400/15 to-transparent',
    mediaVisual: 'https://images.unsplash.com/photo-1534778191937-0dc0dd0de1fa?w=800&auto=format&fit=crop&q=80',
    accentColor: '#fbbf24',
  },
];

export const StickyParallaxCoffee: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Interactive Stage Telemetry State
  const [agtronValue, setAgtronValue] = useState<number>(88);
  const [micronValue, setMicronValue] = useState<number>(380);
  const [pressureValue, setPressureValue] = useState<number>(9.0);
  const [lattePattern, setLattePattern] = useState<string>('רוזטה קלאסית');

  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  const currentStage = STAGES[activeStageIndex];

  // ScrollSpy to detect which stage card is in viewport
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-stage-index'));
          if (!isNaN(index)) {
            setActiveStageIndex(index);
          }
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-25% 0px -40% 0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    stageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Handle stage jump click
  const handleStageJump = (idx: number) => {
    if (soundEnabled) coffeeSound.playBaristaClick();
    setActiveStageIndex(idx);
    const targetRef = stageRefs.current[idx];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Quick Add Item
  const handleQuickAdd = () => {
    if (soundEnabled) {
      coffeeSound.playBaristaClick();
      coffeeSound.playSuccessChime();
    }
    addItem({
      coffeeItemId: 'ethiopia-yirgacheffe-specialty',
      name: 'Ethiopia Yirgacheffe Heirloom 250g',
      hebrewName: 'אתיופיה ירגשף היירלום (קליית ספציאליטי)',
      price: 58,
      shots: 2,
      milkType: 'ללא חלב',
      imageUrl: currentStage.mediaVisual,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <section id="parallax-coffee-journey" className="w-full py-8 relative dir-rtl">
      {/* Header Banner & Title */}
      <div className="text-center space-y-3 mb-8 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shadow-inner backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>מסע החליטה והקלייה ב-4 שלבים • FULL-WIDTH CINEMATIC STICKY HERO</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-stone-100 tracking-tight">
          הנדסת הקפה מגרגר לפול מושלם <br />
          <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            תצוגת Hero מרכזית מוצמדת & בקרות טלמטריה
          </span>
        </h2>
        <p className="text-stone-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          גלישה רציפה בציר הזמן מעדכנת בלייב את לוח ה-Hero המרכזי המוצמד בראש המסך,
          עם בקרות טלמטריה אינטראקטיביות, אקוסטיקה ומדדי איכות.
        </p>

        {/* Step Scrubber Indicators Navigation Bar */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1 font-mono ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-500'
            }`}
            title="הפעל/כבה אפקטים קוליים"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'AUDIO ON' : 'AUDIO MUTE'}</span>
          </button>

          <div className="h-6 w-[1px] bg-stone-800 mx-1" />

          {STAGES.map((s, i) => {
            const isActive = activeStageIndex === i;
            return (
              <button
                key={s.id}
                onClick={() => handleStageJump(i)}
                className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border-amber-500 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105'
                    : 'bg-stone-950/80 border-stone-800 text-stone-400 hover:border-amber-500/40 hover:text-stone-200'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center transition-colors ${
                    isActive ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-stone-300 group-hover:bg-amber-500/20'
                  }`}
                >
                  0{s.id}
                </span>
                <span className="text-xs font-bold font-sans hidden md:inline">{s.stageKey.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FULL-WIDTH CINEMATIC STICKY HERO CONTAINER */}
      <div className="sticky top-20 z-40 max-w-6xl mx-auto px-4 sm:px-6 mb-12">
        <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-950/90 border-2 border-amber-500/35 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden transition-all duration-500">
          
          {/* Dynamic Ambient Color Background Glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${currentStage.bgGlow} pointer-events-none transition-all duration-700`}
          />

          {/* HTML5 Canvas Ambient Steam Particle Simulation */}
          <SteamParticlesCanvas
            particleCount={45}
            color={currentStage.accentColor + '40'}
            className="opacity-80 pointer-events-none"
          />

          {/* Top Stage Header Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between pb-4 border-b border-stone-800/80 gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-black text-sm text-stone-950 shadow-lg transition-colors duration-500"
                style={{ backgroundColor: currentStage.accentColor }}
              >
                0{currentStage.id}
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold tracking-wider block" style={{ color: currentStage.accentColor }}>
                  {currentStage.badge}
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-stone-100">{currentStage.hebrewTitle}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-stone-900/90 border border-stone-800 text-xs font-mono text-emerald-400 flex items-center gap-1.5 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                HERO STAGE LIVE SYNC
              </span>
            </div>
          </div>

          {/* Main Hero Content Layout Grid (Visual Left / Telemetry & Controls Right) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-center">
            
            {/* Visual Media Showcase (5 Cols) */}
            <div className="lg:col-span-5 relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl group">
              <img
                src={currentStage.mediaVisual}
                alt={currentStage.hebrewTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              {/* Floating Elevation Badge */}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-stone-950/85 backdrop-blur-md border border-amber-500/40 text-[11px] font-mono font-bold text-amber-300 shadow-lg">
                {currentStage.elevation}
              </div>

              {/* Subtitle Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-xs font-bold text-amber-300 font-mono mb-1">{currentStage.subTitle}</p>
                <p className="text-stone-300 text-xs line-clamp-2 leading-relaxed">{currentStage.description}</p>
              </div>
            </div>

            {/* Interactive Telemetry & Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* STAGE SPECIFIC INTERACTIVE TELEMETRY CONTROLS */}
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>בקרות טלמטריה אינטראקטיביות בלייב:</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    REALTIME TUNING
                  </span>
                </div>

                {/* Stage 1: Agtron Roast Level Slider */}
                {currentStage.stageKey === 'beans' && (
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-stone-400">רמת קלייה Agtron:</span>
                      <span className="text-amber-300 font-bold">#{agtronValue} Light Specialty</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="95"
                      value={agtronValue}
                      onChange={(e) => setAgtronValue(Number(e.target.value))}
                      className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-stone-500">
                      <span>#70 Dark Roast</span>
                      <span>#88 Gold Medium</span>
                      <span>#95 Light Nordic</span>
                    </div>
                  </div>
                )}

                {/* Stage 2: Acoustic Micron Tuner Dial */}
                {currentStage.stageKey === 'grind' && (
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-stone-400">מרווח סכינים שטוחות Micron:</span>
                      <span className="text-cyan-300 font-bold">{micronValue} µm (±15µm)</span>
                    </div>
                    <input
                      type="range"
                      min="320"
                      max="450"
                      step="5"
                      value={micronValue}
                      onChange={(e) => setMicronValue(Number(e.target.value))}
                      className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-stone-500">
                      <span>320µm Ristretto</span>
                      <span>380µm Espresso</span>
                      <span>450µm Aeropress</span>
                    </div>
                  </div>
                )}

                {/* Stage 3: Pressure Ramp Selector */}
                {currentStage.stageKey === 'extraction' && (
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-stone-400">לחץ משאבה PID Ramp:</span>
                      <span className="text-orange-400 font-bold">{pressureValue.toFixed(1)} Bar (93.5°C)</span>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="11.0"
                      step="0.5"
                      value={pressureValue}
                      onChange={(e) => setPressureValue(Number(e.target.value))}
                      className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-stone-500">
                      <span>6.0 Bar Soft</span>
                      <span>9.0 Bar Perfect Gold</span>
                      <span>11.0 Bar Intense</span>
                    </div>
                  </div>
                )}

                {/* Stage 4: Latte Art Pattern Selector */}
                {currentStage.stageKey === 'latte-art' && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-mono text-stone-400 block">תמונת וקטוריזטור AI ללאטה ארט:</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['רוזטה קלאסית', 'טוליפ 5 שכבות', 'לב כפול', 'ברבור 3D'].map((pat) => (
                        <button
                          key={pat}
                          onClick={() => setLattePattern(pat)}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all ${
                            lattePattern === pat
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                          }`}
                        >
                          {pat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3 Telemetry Live Metric Boxes */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-stone-950/90 border border-stone-800/90 space-y-0.5 shadow-inner">
                  <span className="text-[9px] text-stone-400 block font-mono">{currentStage.metric1.label}</span>
                  <span className="text-xs font-black text-amber-300 font-mono">
                    {currentStage.stageKey === 'beans' ? `#${agtronValue}` : currentStage.metric1.value}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-950/90 border border-stone-800/90 space-y-0.5 shadow-inner">
                  <span className="text-[9px] text-stone-400 block font-mono">{currentStage.metric2.label}</span>
                  <span className="text-xs font-black text-cyan-300 font-mono">
                    {currentStage.stageKey === 'grind' ? `${micronValue} µm` : currentStage.metric2.value}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-950/90 border border-stone-800/90 space-y-0.5 shadow-inner">
                  <span className="text-[9px] text-stone-400 block font-mono">{currentStage.metric3.label}</span>
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    {currentStage.stageKey === 'extraction' ? `${pressureValue.toFixed(1)} Bar` : currentStage.metric3.value}
                  </span>
                </div>
              </div>

              {/* Action Quick Order Button */}
              <div className="pt-1">
                <button
                  onClick={handleQuickAdd}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
                    isAdded
                      ? 'bg-emerald-500 text-stone-950 shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 hover:brightness-110 shadow-amber-500/30 hover:scale-[1.01]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 animate-bounce" />
                      <span>נוסף בהצלחה לעגלת הגורמה!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>הזמן פולי ירגשף שנבחרו בשלב זה (58 ₪)</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* SCROLLABLE STAGE TIMELINE CARDS UNDERNEATH HERO */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">SCROLL TIMELINE STAGES</span>
          <h3 className="text-xl sm:text-2xl font-black text-stone-200">ציר הזמן והפירוט המורחב לחליטה</h3>
        </div>

        {STAGES.map((stage, index) => {
          const isCurrent = activeStageIndex === index;
          return (
            <div
              key={stage.id}
              ref={(el) => {
                stageRefs.current[index] = el;
              }}
              data-stage-index={index}
              className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-500 space-y-6 ${
                isCurrent
                  ? 'bg-slate-900/90 border-amber-500 shadow-[0_20px_50px_rgba(245,158,11,0.25)] scale-[1.01]'
                  : 'bg-[#120d0d]/80 border-stone-800 hover:border-amber-500/30 opacity-80'
              }`}
            >
              {/* Stage Badge & Title */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 font-black text-base flex items-center justify-center shadow-lg">
                    0{stage.id}
                  </span>
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">{stage.badge}</span>
                    <h4 className="text-xl sm:text-2xl font-black text-stone-100">{stage.hebrewTitle}</h4>
                  </div>
                </div>

                <span className="text-xs font-mono text-amber-300 bg-stone-950 px-3.5 py-1.5 rounded-xl border border-stone-800">
                  {stage.metric1.value}
                </span>
              </div>

              {/* Subtitle & Story */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-amber-300 font-mono">{stage.subTitle}</p>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">{stage.description}</p>
              </div>

              {/* Sensory Notes Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-stone-400 font-semibold block">פרופיל תחושתי בשלב זה:</span>
                <div className="flex flex-wrap gap-2">
                  {stage.sensoryNotes.map((note) => (
                    <span
                      key={note}
                      className="px-3 py-1 rounded-xl bg-stone-950 text-xs font-bold text-amber-300 border border-amber-500/25 shadow-sm"
                    >
                      ✦ {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-mono">{stage.metric1.label}</span>
                  <span className="text-sm font-black text-amber-400 font-mono">{stage.metric1.value}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-mono">{stage.metric2.label}</span>
                  <span className="text-sm font-black text-cyan-400 font-mono">{stage.metric2.value}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-mono">{stage.metric3.label}</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">{stage.metric3.value}</span>
                </div>
              </div>

              {/* Focus Button */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                <button
                  onClick={() => handleStageJump(index)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>התמקד בשלב זה בלוח ה-Hero המוצמד ➔</span>
                </button>

                <span className="text-[10px] text-stone-500 font-mono">STAGE {index + 1} OF 4</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
