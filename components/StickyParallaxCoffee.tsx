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
    bgGlow: 'from-amber-500/20 via-orange-500/10 to-transparent',
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
    bgGlow: 'from-cyan-500/20 via-blue-500/10 to-transparent',
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
    bgGlow: 'from-orange-500/25 via-amber-600/10 to-transparent',
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
    bgGlow: 'from-amber-400/20 via-cyan-400/10 to-transparent',
    mediaVisual: 'https://images.unsplash.com/photo-1534778191937-0dc0dd0de1fa?w=800&auto=format&fit=crop&q=80',
    accentColor: '#fbbf24',
  },
];

export const StickyParallaxCoffee: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  const currentStage = STAGES[activeStageIndex];

  // ScrollSpy to detect which stage is in viewport
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
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    stageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Handle stage jump click
  const handleStageJump = (idx: number) => {
    coffeeSound.playBaristaClick();
    setActiveStageIndex(idx);
    const targetRef = stageRefs.current[idx];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Quick Add Item from Stage 4
  const handleQuickAdd = () => {
    coffeeSound.playBaristaClick();
    coffeeSound.playSuccessChime();
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
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section id="parallax-coffee-journey" className="w-full py-6 relative dir-rtl">
      {/* Top Banner Header */}
      <div className="text-center space-y-3 mb-6 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>מסע החליטה והקלייה ב-4 שלבים • STICKY SCROLL & PARALLAX</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-stone-100 tracking-tight">
          הנדסת הקפה מגרגר לפול מושלם <br />
          <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            חוויית גלילה מוצמדת (Sticky Stage Transformer)
          </span>
        </h2>
        <p className="text-stone-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          גלול מטה וצפה בלוח הבקרה המוצמד המשתנה בזמן אמת לאורך 4 שלבי ההפקה:
          החל מגידול הפולים ב-2,100 מטר, דרך טחינה אקוסטית ומיצוי 9Bar, ועד לפיסול לאטה ארט AR תלת-ממדי.
        </p>

        {/* Step Scrubber Indicators */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {STAGES.map((s, i) => {
            const isActive = activeStageIndex === i;
            return (
              <button
                key={s.id}
                onClick={() => handleStageJump(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive ? 'w-12 bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'w-3 bg-stone-800 hover:bg-stone-700'
                }`}
                title={s.hebrewTitle}
              />
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Parallax Sticky Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* RIGHT (Sticky Pinned Stage Transformer) - 5 Cols */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 space-y-6">
            {/* Glassmorphic Pinned Showcase Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border-2 border-amber-500/30 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-5 relative overflow-hidden transition-all duration-500">
              
              {/* Dynamic Ambient Background Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${currentStage.bgGlow} pointer-events-none transition-all duration-700`}
              />

              {/* Ambient Rising Steam Particle Simulation */}
              <SteamParticlesCanvas
                particleCount={35}
                color="rgba(245, 158, 11, 0.22)"
                className="opacity-75"
              />

              {/* Pinned Card Top Bar */}
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-stone-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
                    0{currentStage.id}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 tracking-wider block">
                      {currentStage.badge}
                    </span>
                    <span className="text-xs font-black text-stone-200">STAGE TRANSFORMER</span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  LIVE SYNC
                </span>
              </div>

              {/* 3D Visual Stage Media Container */}
              <div className="relative z-10 h-56 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl group">
                <img
                  src={currentStage.mediaVisual}
                  alt={currentStage.hebrewTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Elevation / Telemetry Pill */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-stone-950/85 backdrop-blur-md border border-amber-500/40 text-[11px] font-mono font-bold text-amber-300 shadow-lg">
                  {currentStage.elevation}
                </div>

                {/* Stage Title Overlay Bottom */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent">
                  <h3 className="text-base font-black text-stone-100">{currentStage.hebrewTitle}</h3>
                  <p className="text-[11px] text-stone-300 truncate">{currentStage.subTitle}</p>
                </div>
              </div>

              {/* Live 3 Telemetry Metrics Grid */}
              <div className="relative z-10 grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-stone-950/90 border border-stone-800 space-y-0.5">
                  <span className="text-[9px] text-stone-400 block font-mono">{currentStage.metric1.label}</span>
                  <span className="text-xs font-black text-amber-300 font-mono">{currentStage.metric1.value}</span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-950/90 border border-stone-800 space-y-0.5">
                  <span className="text-[9px] text-stone-400 block font-mono">{currentStage.metric2.label}</span>
                  <span className="text-xs font-black text-cyan-300 font-mono">{currentStage.metric2.value}</span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-950/90 border border-stone-800 space-y-0.5">
                  <span className="text-[9px] text-stone-400 block font-mono">{currentStage.metric3.label}</span>
                  <span className="text-xs font-black text-emerald-400 font-mono">{currentStage.metric3.value}</span>
                </div>
              </div>

              {/* Sensory Notes Pills */}
              <div className="relative z-10 space-y-1.5">
                <span className="text-[10px] text-stone-400 font-semibold block">פרופיל תחושתי בשלב זה:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentStage.sensoryNotes.map((note) => (
                    <span
                      key={note}
                      className="px-2.5 py-0.5 rounded-lg bg-stone-950 text-[10px] font-bold text-amber-300 border border-amber-500/20"
                    >
                      ✦ {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive CTA Action Button */}
              <div className="relative z-10 pt-2">
                <button
                  onClick={handleQuickAdd}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xl ${
                    isAdded
                      ? 'bg-emerald-500 text-stone-950 shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 hover:brightness-110 shadow-amber-500/25'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>נוסף בהצלחה לעגלת הגורמה!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>הזמן פולי ירגשף שנבחרו בשלב זה (58 ₪)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LEFT (Scrollable Storyline Timeline Stages) - 7 Cols */}
        <div className="lg:col-span-7 space-y-6 pb-2">
          {STAGES.map((stage, index) => {
            const isCurrent = activeStageIndex === index;
            return (
              <div
                key={stage.id}
                ref={(el) => {
                  stageRefs.current[index] = el;
                }}
                data-stage-index={index}
                className={`p-8 rounded-3xl border-2 transition-all duration-500 space-y-6 ${
                  isCurrent
                    ? 'bg-slate-900/90 border-amber-500 shadow-[0_20px_50px_rgba(245,158,11,0.2)]'
                    : 'bg-[#120d0d]/80 border-stone-800 hover:border-amber-500/30 opacity-75'
                }`}
              >
                {/* Stage Badge & Step Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 font-black text-base flex items-center justify-center shadow-lg">
                      0{stage.id}
                    </span>
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-400">{stage.badge}</span>
                      <h3 className="text-xl sm:text-2xl font-black text-stone-100">{stage.hebrewTitle}</h3>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-stone-400 bg-stone-950 px-3 py-1 rounded-xl border border-stone-800">
                    {stage.metric1.value}
                  </span>
                </div>

                {/* Subtitle & Story Description */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-amber-300 font-mono">{stage.subTitle}</p>
                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">{stage.description}</p>
                </div>

                {/* Stage Specific Telemetry Grid */}
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

                {/* Interactive Action: Focus & Jump */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                  <button
                    onClick={() => handleStageJump(index)}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>התמקד בשלב זה בלוח המוצמד ➔</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-500 font-mono">STEP {index + 1} OF 4</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
