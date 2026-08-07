'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GeminiBaristaModal } from '@/components/GeminiBaristaModal';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useCartStore } from '@/lib/store/useCartStore';
import {
  Sparkles,
  Coffee,
  ArrowLeft,
  User,
  ShieldCheck,
  Flame,
  Globe,
  Clock,
  TestTube,
  Activity,
  Snowflake,
  Sliders,
  BookOpen,
  Droplets,
  Award,
  Star,
  Building2,
  Gift,
  Store,
  Zap,
  Check,
  Plus,
  ChevronLeft,
} from 'lucide-react';

export default function HomePage() {
  const [isBaristaOpen, setIsBaristaOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Top Featured Coffee Beans Showcase
  const featuredBeans = [
    {
      id: 'item-beans-1',
      name: 'Ethiopia Yirgacheffe Heirloom 250g',
      hebrewName: 'אתיופיה ירגשף היירלום',
      price: 58,
      origin: 'אתיופיה (Yirgacheffe 2,000m)',
      notes: ['פרחי יסמין', 'הדרים', 'דבש בר'],
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'item-beans-5',
      name: 'Panama Geisha Reserve 250g',
      hebrewName: 'פנמה גיישה ספציאליטי',
      price: 120,
      origin: 'פנמה (Boquete Valley Geisha)',
      notes: ['ברגמוט', 'אפרסק לבן', 'יסמין'],
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'item-beans-2',
      name: 'Sumatra Mandheling 250g',
      hebrewName: 'סומטרה מנדלינג גורמה',
      price: 62,
      origin: 'אינדונזיה (Mandheling)',
      notes: ['שוקולד כהה', 'תבלינים', 'עץ ארז'],
      imageUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleQuickAdd = (item: typeof featuredBeans[0]) => {
    addItem({
      coffeeItemId: item.id,
      name: item.name,
      hebrewName: item.hebrewName,
      price: item.price,
      shots: 2,
      milkType: 'ללא חלב',
      imageUrl: item.imageUrl,
    });
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-obsidian text-stone-100 flex flex-col relative overflow-hidden dir-rtl">
        {/* Ambient Glows */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none animate-float" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow" />

        {/* Header */}
        <Header onOpenBarista={() => setIsBaristaOpen(true)} />

        {/* Main Body */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
          {/* 1. HERO SECTION */}
          <section className="text-center relative pt-6 pb-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner animate-fadeIn">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              פלטפורמת קפה גורמה בבינה מלאכותית Gemini 3.5
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-stone-100 tracking-tight leading-tight">
              חוויית הקפה הבאה שלך <br />
              <span className="text-gold-gradient">מבוססת דיוק אלגוריתמי</span>
            </h1>

            <p className="max-w-2xl mx-auto text-stone-400 text-sm sm:text-base leading-relaxed">
              ברוכים הבאים ל-**THE DIGITAL ROAST**. ניתוח קולי וחזותי של פולי קפה, התאמת קפאין ביולוגית,
              סימולטור לחץ 9Bar, אשף ארומה מולקולרי ואקדמיית בריסטה – כולם מוגשים בעמודים ייעודיים ונקיים.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsBaristaOpen(true)}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-extrabold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-xl shadow-amber-500/25 group"
              >
                <Sparkles className="w-5 h-5 text-stone-950" />
                <span>הפעל בריסטה קולי AI</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>

              <Link
                href="/catalog"
                className="px-7 py-4 rounded-2xl liquid-glass border border-amber-500/30 text-stone-200 font-extrabold text-sm hover:border-amber-500/60 transition-all flex items-center gap-2"
              >
                <Coffee className="w-5 h-5 text-amber-400" />
                <span>לצפייה בקטלוג המוצרים</span>
              </Link>

              {isAuthenticated && (
                <div className="px-6 py-3.5 rounded-2xl bg-stone-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-inner">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>שלום {user?.fullName}</span>
                </div>
              )}
            </div>
          </section>

          {/* 2. AI BARISTA SPOTLIGHT BANNER */}
          <section className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-stone-900/90 to-cyan-500/10 border border-amber-500/30 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-right">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Gemini 3.5 Multimodal Barista</span>
              </div>
              <h2 className="text-2xl font-black text-stone-100">
                רוצה המלצה מותאמת אישית או ניתוח צילום פולים?
              </h2>
              <p className="text-xs text-stone-400 max-w-lg">
                דבר עם הבריסטה הקולי בעברית, צלם שקית פולים לניתוח Agtron index, או בקש התאמה לרמת העייפות שלך.
              </p>
            </div>

            <button
              onClick={() => setIsBaristaOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-xs hover:brightness-110 transition-all shrink-0 shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>פתח את הברמאי AI כעת</span>
            </button>
          </section>

          {/* 3. FEATURE CATEGORY EXPLORER GRID */}
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-stone-100 tracking-tight">
                מרכז הכלים והפיצ'רים העצמאיים
              </h2>
              <p className="text-stone-400 text-xs">
                בחר קטגוריה וגש ישירות לעמוד הייעודי של הפיצ'ר
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Shop & Catalog */}
              <div className="p-6 rounded-3xl liquid-glass border border-amber-500/30 space-y-4 hover:border-amber-500/60 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-100">חנות & תערובות פולים</h3>
                  <p className="text-xs text-stone-400 mt-1">קטלוג פולים, מאפים ומנוי חודשי</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-stone-800/80">
                  <Link href="/catalog" className="flex items-center justify-between text-xs text-amber-300 font-bold hover:underline">
                    <span>תפריט הגורמה והפולים</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                  <Link href="/subscription" className="flex items-center justify-between text-xs text-stone-400 hover:text-stone-200">
                    <span>מחשבון מנוי חודשי</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                  <Link href="/sommelier" className="flex items-center justify-between text-xs text-stone-400 hover:text-stone-200">
                    <span>סומלייה מאפים וקפה</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Brew Lab & Chemistry */}
              <div className="p-6 rounded-3xl liquid-glass border border-blue-500/30 space-y-4 hover:border-blue-500/60 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <TestTube className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-100">מעבדת חליטה & כימיה</h3>
                  <p className="text-xs text-stone-400 mt-1">טיימר V60, כימיית מים וטכנולוגיית TDS</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-stone-800/80">
                  <Link href="/v60" className="flex items-center justify-between text-xs text-blue-300 font-bold hover:underline">
                    <span>V60 Master Timer</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                  <Link href="/water-chemistry" className="flex items-center justify-between text-xs text-stone-400 hover:text-stone-200">
                    <span>מחשב כימיית מים SCA</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                  <Link href="/extraction-sim" className="flex items-center justify-between text-xs text-stone-400 hover:text-stone-200">
                    <span>סימולטור לחץ 9Bar</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Card 3: AI Bio & Aroma */}
              <div className="p-6 rounded-3xl liquid-glass border border-cyan-500/30 space-y-4 hover:border-cyan-500/60 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-100">טכנולוגיות עתידניות AI</h3>
                  <p className="text-xs text-stone-400 mt-1">יישון קולי, מדפסת 3D ושעון צירקדיאני</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-stone-800/80">
                  <Link href="/ultrasonic-aging" className="flex items-center justify-between text-xs text-amber-300 font-bold hover:underline">
                    <span>תא יישון אולטרסוני & ואקום</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                  <Link href="/ar-latte-art" className="flex items-center justify-between text-xs text-cyan-300 font-bold hover:underline">
                    <span>מדפסת AR 3D ללאטה ארט</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                  <Link href="/circadian-clock" className="flex items-center justify-between text-xs text-emerald-300 font-bold hover:underline">
                    <span>שעון קפאין סירקדיאני</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Card 4: Academy & Roasting */}
              <div className="p-6 rounded-3xl liquid-glass border border-emerald-500/30 space-y-4 hover:border-emerald-500/60 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-100">אקדמיה & מעבדת קלייה</h3>
                  <p className="text-xs text-stone-400 mt-1">מבחני הסמכה, RoastCoins וגרפי RoR</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-stone-800/80">
                  <Link href="/barista-academy" className="flex items-center justify-between text-xs text-emerald-300 font-bold hover:underline">
                    <span>אקדמיית הבריסטה AI</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                  <Link href="/roast-profile" className="flex items-center justify-between text-xs text-stone-400 hover:text-stone-200">
                    <span>גרף קלייה RoR Designer</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                  <Link href="/gamification" className="flex items-center justify-between text-xs text-stone-400 hover:text-stone-200">
                    <span>מועדון Roast Club</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 4. FEATURED SINGLE-ORIGIN COFFEE BEANS */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-stone-100">פולי קפה ספציאליטי נבחרים</h2>
                <p className="text-xs text-stone-400">קלייה טרייה שבועית מח חוות גידול מובילות בעולם</p>
              </div>
              <Link href="/catalog" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                <span>לכל הקטלוג ➔</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBeans.map((item) => {
                const isAdded = addedIds[item.id];
                return (
                  <div key={item.id} className="p-5 rounded-3xl liquid-glass border border-stone-800 space-y-4 hover:border-amber-500/40 transition-all">
                    <div className="h-44 rounded-2xl overflow-hidden relative">
                      <img src={item.imageUrl} alt={item.hebrewName} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-amber-500/30">
                        {item.price} ₪
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-stone-100">{item.hebrewName}</h3>
                      <p className="text-xs text-stone-400">{item.origin}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.notes.map((n) => (
                        <span key={n} className="px-2 py-0.5 rounded-md bg-stone-950 text-[10px] text-amber-300 font-semibold border border-stone-800">
                          {n}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleQuickAdd(item)}
                      className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                        isAdded
                          ? 'bg-emerald-500 text-black'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:brightness-110 shadow-md shadow-amber-500/20'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>נוסף לעגלה!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>הוסף לעגלת הקניות</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. TRUST METRICS BAR */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#0a0808]/95 border border-stone-800/80 text-center">
            <div className="space-y-1">
              <span className="text-amber-400 font-black text-xl font-mono block">100% Arabica</span>
              <span className="text-stone-400 text-xs">פולי ערביקה אורגניים</span>
            </div>
            <div className="space-y-1">
              <span className="text-amber-400 font-black text-xl font-mono block">9Bar Flow</span>
              <span className="text-stone-400 text-xs">מיצוי מדויק בלחץ תקני</span>
            </div>
            <div className="space-y-1">
              <span className="text-amber-400 font-black text-xl font-mono block">4.9★ Rating</span>
              <span className="text-stone-400 text-xs">דירוג חובבי קפה</span>
            </div>
            <div className="space-y-1">
              <span className="text-amber-400 font-black text-xl font-mono block">20-Min Express</span>
              <span className="text-stone-400 text-xs">משלוח מהיר ב-WhatsApp</span>
            </div>
          </section>
        </main>

        {/* Modals & Drawer */}
        <GeminiBaristaModal isOpen={isBaristaOpen} onClose={() => setIsBaristaOpen(false)} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <CartDrawer />
        <ScrollToTop />
        <Footer />
      </div>
    </AuthGuard>
  );
}
