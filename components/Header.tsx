'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Coffee,
  ShoppingBag,
  Clock,
  Sparkles,
  Flame,
  Activity,
  Globe,
  Volume2,
  VolumeX,
  Menu,
  X,
  Award,
  Zap,
  Utensils,
  BookOpen,
  MessageSquare,
  Sliders,
  Snowflake,
  Star,
  Building2,
  Gift,
  Store,
  Droplets,
  TestTube,
  ChevronDown,
  Layers,
  Search,
  LogOut,
  Wifi,
  User,
  MousePointer,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { AuthModal } from '@/components/AuthModal';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface HeaderProps {
  onOpenBarista?: () => void;
  onScrollToSection?: (id: string) => void;
}

interface FeatureItem {
  id: string;
  page: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

interface CategoryGroup {
  title: string;
  color: string;
  badgeBg: string;
  items: FeatureItem[];
}

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  primaryPages: Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
  allFeatures: FeatureItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleFeatureClick: (pageUrl: string, sectionId: string) => void;
  pathname: string;
}

const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({
  isOpen,
  onClose,
  primaryPages,
  allFeatures,
  searchQuery,
  setSearchQuery,
  handleFeatureClick,
  pathname,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen || typeof window === 'undefined') return null;

  const filteredFeatures = allFeatures.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return createPortal(
    <div className="lg:hidden fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-[#070505] p-5 sm:p-7 overflow-y-auto animate-fadeIn dir-rtl flex flex-col space-y-6 text-right">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/25">
            <Coffee className="w-6 h-6 text-stone-950" />
          </div>
          <div>
            <h3 className="text-base font-black text-amber-300">תפריט ניווט ראשי</h3>
            <p className="text-xs text-stone-400 font-mono">THE DIGITAL ROAST AI</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 transition-all active:scale-95"
          title="סגור תפריט"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="חפש כלי, עמוד או פיצ'ר במערכת..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-stone-900 border border-amber-500/40 text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 shadow-inner"
        />
        <Search className="w-5 h-5 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Primary Links Grid */}
      <div className="space-y-2.5">
        <div className="text-xs font-black text-stone-400 px-1">עמודים מרכזיים:</div>
        <div className="grid grid-cols-2 gap-2.5">
          {primaryPages.map((page) => {
            const Icon = page.icon;
            const isActive = pathname === page.href;
            return (
              <Link
                key={page.href}
                href={page.href}
                onClick={() => {
                  coffeeSound.playBaristaClick();
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border text-sm font-bold transition-all flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md'
                    : 'bg-stone-900/90 border-stone-800 text-stone-300 hover:text-amber-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${isActive ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-amber-400'}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span>{page.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filtered Feature Cards */}
      <div className="space-y-2.5 flex-1">
        <div className="text-xs font-black text-amber-400 px-1 flex items-center justify-between">
          <span>כל כלי הפלטפורמה ({filteredFeatures.length}):</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-stone-400 hover:text-amber-300 underline"
            >
              נקה חיפוש
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-[44vh] overflow-y-auto pr-1">
          {filteredFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleFeatureClick(item.page, item.id)}
                className="w-full p-3 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 hover:bg-amber-500/10 text-right transition-all flex items-center gap-3.5 group"
              >
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-bold text-stone-100 group-hover:text-amber-300">
                    {item.label}
                  </div>
                  <div className="text-xs text-stone-400 truncate mt-0.5">
                    {item.desc}
                  </div>
                </div>
                {item.tag && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Status Badge */}
      <div className="p-4 rounded-2xl bg-[#140e0b] border border-amber-500/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-sm text-amber-200 font-bold">סוכן ה-AI פעיל ומחובר ברקע</span>
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/40 font-mono">
          ONLINE
        </span>
      </div>
    </div>,
    document.body
  );
};

export const Header: React.FC<HeaderProps> = ({ onOpenBarista, onScrollToSection }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { toggleCart, getItemCount } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemCount = getItemCount();
  const [isMuted, setIsMuted] = useState(coffeeSound.getMutedState());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [megaSearchQuery, setMegaSearchQuery] = useState('');

  // Mouse Drag Scroll States for Mega Menu
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const dropdownScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragScrollTop, setDragScrollTop] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dropdownScrollRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setDragStartY(e.clientY);
    setDragScrollTop(dropdownScrollRef.current.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dropdownScrollRef.current) return;
    const dy = e.clientY - dragStartY;
    if (Math.abs(dy) > 4) {
      setHasDragged(true);
    }
    dropdownScrollRef.current.scrollTop = dragScrollTop - dy;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Close mega-menu on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMegaMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggleMute = () => {
    const newMuted = coffeeSound.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      coffeeSound.playBaristaClick();
    }
  };

  // Primary Clean Core Pages (4 key routes)
  const primaryPages = [
    { href: '/home', label: 'ראשי', icon: Coffee },
    { href: '/shop', label: 'חנות', icon: ShoppingBag },
    { href: '/orders', label: 'הזמנות', icon: Clock },
    { href: '/brew-lab', label: 'מעבדה', icon: TestTube },
  ];

  // Categorized feature tools for the Mega Menu
  const featureCategories: CategoryGroup[] = [
    {
      title: 'חנות & טעמים',
      color: 'border-amber-500/40 from-amber-500/20 to-orange-500/10 text-amber-300',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      items: [
        { id: 'catalog', page: '/catalog', label: 'תפריט גורמה', desc: 'קטלוג פולים ומוצרי קפה', icon: Coffee, tag: 'SHOP' },
        { id: 'orders', page: '/orders', label: 'היסטוריית הזמנות & קבלות', desc: 'מעקב משלוח חי, חשבוניות והזמנה חוזרת', icon: Clock, tag: 'LIVE' },
        { id: 'aroma-scent', page: '/aroma-scent', label: 'ניתוח ארומה וטרפנים AI', desc: 'ניתוח מולקולרי ומדד VAI%', icon: Sparkles, tag: 'AI 5D' },
        { id: 'sensory-radar', page: '/sensory-radar', label: 'גלגל טעמים 5D', desc: 'ניתוח ארומה ופרופיל טעם', icon: Sparkles },
        { id: 'sommelier', page: '/sommelier', label: 'סומלייה מאפים', desc: 'התאמת קפה למאפי שף', icon: Utensils },
        { id: 'subscription', page: '/subscription', label: 'מנוי חודשי', desc: 'אספקת פולים חודשית לבית', icon: Globe, tag: 'VIP' },
      ],
    },
    {
      title: 'בריסטה & AI',
      color: 'border-cyan-500/40 from-cyan-500/20 to-blue-500/10 text-cyan-300',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      items: [
        { id: 'ai-barista', page: '/ai-barista', label: 'בריסטה Gemini 3.5 AI', desc: 'הזמנה קולית, זיהוי פולים והמלצות', icon: Sparkles, tag: 'VOICE' },
        { id: 'instagram-reel', page: '/instagram-reel', label: 'קונספט אינסטגרם Reel 3D', desc: 'אדים, חלב, קרח 3D ופולים צפים', icon: Sparkles },
        { id: 'parallax-experience', page: '/parallax-experience', label: 'חוויית פרלקס & שלבי חליטה', desc: 'מסע Sticky Scroll ושלבי פיתוח 3D', icon: Layers },
        { id: 'acoustic-tuner', page: '/acoustic-tuner', label: 'מכוונן טחינה אקוסטי', desc: 'ניתוח תדרי סכינים וגלאי Channeling', icon: Activity, tag: 'FFT' },
        { id: 'ultrasonic-aging', page: '/ultrasonic-aging', label: 'תא יישון אולטרסוני & ואקום', desc: 'פירוק חומציות טאנית ב-45% & איטום', icon: Zap },
        { id: 'ar-latte-art', page: '/ar-latte-art', label: 'מדפסת 3D ללאטה ארט AR', desc: 'פיסול קצף מוגבה & וקטוריזטור קקאו', icon: Sparkles },
        { id: 'circadian-clock', page: '/circadian-clock', label: 'שעון קפאין סירקדיאני', desc: 'סנכרון קורטיזול & מניעת התרסקות', icon: Clock },
        { id: 'bio-energy', page: '/bio-energy', label: 'תאימות אנרגיה Bio-Match', desc: 'התאמת קפה לרמת עייפות', icon: Flame },
        { id: 'whatsapp-voice', page: '/whatsapp-voice', label: 'הזמנה ב-WhatsApp Voice', desc: 'הודעות קוליות להזמנה', icon: MessageSquare },
      ],
    },
    {
      title: 'מעבדת חליטה & מדע',
      color: 'border-blue-500/40 from-blue-500/20 to-indigo-500/10 text-blue-300',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      items: [
        { id: 'smart-iot', page: '/smart-iot', label: 'סנכרון מכונה חכמה IoT', desc: 'דחיפת פרופיל לחץ 9Bar וטמפ׳ PID', icon: Wifi, tag: 'MQTT' },
        { id: 'v60', page: '/v60', label: 'V60 Master Timer', desc: 'טיימר חליטה חיה עם Bloom', icon: Clock },
        { id: 'water-chemistry', page: '/water-chemistry', label: 'מחשב כימיית מים SCA', desc: 'מינרלים, קשיות GH/KH ואיזון pH', icon: TestTube, tag: 'CHEM' },
        { id: 'extraction-telemetry', page: '/extraction-telemetry', label: 'טלמטריית TDS & EY%', desc: 'אחוז מיצוי אספרסו מדויק', icon: Activity },
        { id: 'extraction-sim', page: '/extraction-sim', label: 'סימולטור 9Bar לחץ', desc: 'סימולציית לחץ וחליטה', icon: Activity },
        { id: 'cold-brew-calculator', page: '/cold-brew-calculator', label: 'Cold & Nitro Brew', desc: 'מחשבון חליטות קרות וניטרו', icon: Snowflake },
      ],
    },
    {
      title: 'סטודיו, קלייה & מועדון',
      color: 'border-orange-500/40 from-orange-500/20 to-amber-500/10 text-orange-300',
      badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      items: [
        { id: 'roast-profile', page: '/roast-profile', label: 'רדאר קלייה RoR & SCA', desc: 'ניטור First Crack וסקאלת Agtron', icon: Flame, tag: 'RoR' },
        { id: 'custom-roast-studio', page: '/custom-roast-studio', label: 'מעבדת קלייה אישית', desc: 'עיצוב דרגות קלייה אישיות', icon: Sliders },
        { id: 'personal-brew-journal', page: '/personal-brew-journal', label: 'יומן חליטה Dial-in', desc: 'תיעוד וניטור חליטות', icon: BookOpen },
        { id: 'latte-art-trainer', page: '/latte-art-trainer', label: 'מאמן לאטה ארט', desc: 'אימון ויזואלי ומזיגות', icon: Droplets },
        { id: 'gamification', page: '/gamification', label: 'מועדון Roast Club VIP', desc: 'אתגרים, משימות ודרגות בריסטה', icon: Award, tag: 'QUESTS' },
        { id: 'live-cupping-room', page: '/live-cupping-room', label: 'Cupping Room שיתופי', desc: 'חדר טעימות שיתופי וירטואלי', icon: Star },
        { id: 'barista-academy', page: '/barista-academy', label: 'אקדמיית הבריסטה AI', desc: 'מבחני הסמכה ותגי מומחה', icon: Award },
      ],
    },
    {
      title: 'עסקים, B2B & טרואר',
      color: 'border-emerald-500/40 from-emerald-500/20 to-teal-500/10 text-emerald-300',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      items: [
        { id: 'corporate-lounge', page: '/corporate-lounge', label: 'B2B משרדים וחברות', desc: 'לאונג קפה אקסקלוסיבי לחברות', icon: Building2, tag: 'B2B' },
        { id: 'gift-sommelier', page: '/gift-sommelier', label: 'אשף מתנות AI', desc: 'מארזים מותאמים אישית', icon: Gift },
        { id: 'multi-roaster-marketplace', page: '/multi-roaster-marketplace', label: 'שוק קולים עצמאיים', desc: 'פולי קפה מקולים עצמאיים בישראל', icon: Store },
        { id: 'smart-inventory', page: '/smart-inventory', label: 'ניהול מלאי חכם AI', desc: 'חיזוי צריכה והזמנות אוטומטיות', icon: Zap },
        { id: 'farm-story', page: '/farm-story', label: 'סיפור החווה והטרואר', desc: 'מקורות הפולים, גבהים וחקלאים', icon: BookOpen },
      ],
    },
  ];

  const allFeatures = featureCategories.flatMap((cat) => cat.items);

  const handleFeatureClick = (pageUrl: string, sectionId: string) => {
    if (hasDragged) return;
    coffeeSound.playBaristaClick();
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);

    if (pathname === pageUrl) {
      if (onScrollToSection) {
        onScrollToSection(sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      router.push(`${pageUrl}#${sectionId}`);
    }
  };

  const filteredMegaItems = allFeatures.filter(
    (item) =>
      item.label.toLowerCase().includes(megaSearchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(megaSearchQuery.toLowerCase())
  );

  return (
    <>
      <header className="sticky top-3 sm:top-4 z-50 w-full max-w-[98%] 2xl:max-w-[1750px] mx-auto px-2 sm:px-4 dir-rtl">
        {/* Unified Solid Luxury Navigation Bar - Expanded Full Width */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#0c0a09] border-2 border-amber-500/30 shadow-[0_12px_45px_rgba(0,0,0,0.95)] h-18 sm:h-20 px-4 sm:px-8 flex items-center justify-between gap-4 lg:gap-8 w-full transition-all">
          
          {/* 1. BRAND LOGO (Right in RTL) */}
          <div className="flex items-center gap-3.5 shrink-0">
            <Link
              href="/home"
              onClick={() => coffeeSound.playBaristaClick()}
              className="flex items-center gap-3 group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform shrink-0 border border-amber-300/40">
                <Coffee className="w-6 h-6 text-stone-950" />
              </div>

              <div className="hidden sm:block text-right">
                <div className="text-sm sm:text-base font-black tracking-wide text-stone-100 whitespace-nowrap">
                  THE DIGITAL ROAST
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-extrabold tracking-wider -mt-0.5">
                  SPECIALTY COFFEE & AI
                </div>
              </div>
            </Link>
          </div>

          {/* 2. CENTER SPACIOUS NAVIGATION DECK */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            {primaryPages.map((page) => {
              const Icon = page.icon;
              const isActive = pathname === page.href;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  onClick={() => coffeeSound.playBaristaClick()}
                  className={`h-11 px-3.5 lg:px-4 rounded-xl sm:rounded-2xl text-sm font-extrabold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                      : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900/80 border border-transparent hover:border-stone-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span className="whitespace-nowrap">{page.label}</span>
                </Link>
              );
            })}

            {/* Mega-Menu Dropdown Button */}
            <div className="relative shrink-0" ref={megaMenuRef}>
              <button
                onClick={() => {
                  coffeeSound.playBaristaClick();
                  setIsMegaMenuOpen(!isMegaMenuOpen);
                }}
                className={`h-11 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl text-sm font-extrabold transition-all flex flex-row items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap border cursor-pointer select-none active:scale-95 ${
                  isMegaMenuOpen
                    ? 'bg-amber-500/25 text-amber-300 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : 'bg-stone-900/90 text-stone-200 border-stone-800 hover:border-amber-500/50 hover:bg-amber-500/15 hover:text-amber-300 shadow-sm'
                }`}
              >
                <div className="p-1 rounded-lg bg-stone-950 border border-amber-500/30 text-amber-400 shrink-0 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>

                <span className="whitespace-nowrap text-xs sm:text-sm font-bold text-stone-100">
                  כל הכלים
                </span>

                <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] sm:text-[11px] border border-amber-500/30 shrink-0">
                  21
                </span>

                <ChevronDown
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 transition-transform duration-300 shrink-0 ${
                    isMegaMenuOpen ? 'rotate-180 text-amber-300' : ''
                  }`}
                />
              </button>

              {/* MEGA MENU FLOATING DROPDOWN - SOLID OPAQUE BACKGROUND & NO VISIBLE SCROLLBAR */}
              {isMegaMenuOpen && (
                <div className="absolute top-full -left-28 sm:-left-40 md:-left-56 mt-4 w-[95vw] max-w-[920px] p-6 rounded-3xl bg-[#0c0a09] border-2 border-amber-500/50 shadow-[0_25px_80px_rgba(0,0,0,1)] animate-fadeIn z-50 dir-rtl text-right space-y-5">
                  
                  {/* Top Bar: Search + Drag Notice */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                    <div className="flex items-center gap-2.5 text-amber-400">
                      <Sparkles className="w-5 h-5 animate-spin-slow" />
                      <div>
                        <h4 className="text-sm font-black tracking-wider uppercase text-stone-100">
                          מרכז האקו-סיסטם והכלים (21 מודולים פעילים)
                        </h4>
                        <p className="text-[11px] text-stone-400">
                          גלול עם גלגלת העכבר או גרור בחופשיות
                        </p>
                      </div>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        placeholder="חיפוש מהיר בין כל הכלים..."
                        value={megaSearchQuery}
                        onChange={(e) => setMegaSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:border-amber-400 shadow-inner"
                      />
                      <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Scrollable Container without visible scrollbar + Mouse Drag Support */}
                  <div
                    ref={dropdownScrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`max-h-[65vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                      isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
                    }`}
                  >
                    {/* Filtered Search Results or Categorized Cards */}
                    {megaSearchQuery.trim() ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-2">
                        {filteredMegaItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleFeatureClick(item.page, item.id)}
                              className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 hover:bg-amber-500/10 text-right transition-all flex items-center gap-3.5 group"
                            >
                              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <div className="text-sm font-bold text-stone-100 group-hover:text-amber-300">
                                  {item.label}
                                </div>
                                <div className="text-xs text-stone-400 truncate mt-0.5">
                                  {item.desc}
                                </div>
                              </div>
                              {item.tag && (
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                                  {item.tag}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                        {featureCategories.map((cat) => (
                          <div
                            key={cat.title}
                            className="p-4 rounded-2xl bg-[#13100f] border border-stone-800/90 hover:border-amber-500/40 transition-all space-y-2.5"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                              <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                {cat.title}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800">
                                {cat.items.length} כלים
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-1.5">
                              {cat.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => handleFeatureClick(item.page, item.id)}
                                    className="w-full p-2 rounded-xl hover:bg-amber-500/15 text-stone-300 hover:text-amber-300 transition-all flex items-center justify-between text-right group"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-amber-400 group-hover:border-amber-500/50 shrink-0">
                                        <Icon className="w-4 h-4" />
                                      </div>
                                      <div className="truncate">
                                        <div className="text-xs sm:text-sm font-bold leading-tight group-hover:text-amber-300 truncate">
                                          {item.label}
                                        </div>
                                        <div className="text-[11px] text-stone-400 truncate font-light mt-0.5">
                                          {item.desc}
                                        </div>
                                      </div>
                                    </div>
                                    {item.tag && (
                                      <span className="text-[9px] px-2 py-0.5 rounded-md bg-stone-900 text-amber-400 font-mono border border-stone-800 shrink-0 ml-1">
                                        {item.tag}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* 3. RIGHT CONTROLS CLUSTER (Audio, AI Barista, Profile, Cart, Mobile Menu) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Audio Sound FX Toggle */}
            <button
              onClick={handleToggleMute}
              className={`h-11 w-11 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-center ${
                isMuted
                  ? 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300'
                  : 'bg-amber-950 border-amber-500/60 text-amber-400 shadow-md shadow-amber-500/20'
              }`}
              title={isMuted ? 'הפעל צלילי ממשק' : 'השתק צלילים'}
            >
              {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5 animate-pulse" />}
            </button>

            {/* AI Barista Button - Clean, Prominent & Sized Well */}
            <button
              onClick={() => {
                coffeeSound.playCoffeeSteam();
                onOpenBarista?.();
              }}
              className="h-11 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-stone-950 font-black text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 whitespace-nowrap"
              title="פתח את בריסטה הבינה המלאכותית"
            >
              <Sparkles className="w-4 h-4 text-stone-950 animate-spin-slow" />
              <span>בריסטה AI</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                toggleCart();
              }}
              className="relative h-11 w-11 rounded-xl sm:rounded-2xl bg-stone-900 hover:bg-amber-500/20 border border-stone-800 hover:border-amber-500/50 text-stone-300 hover:text-amber-300 flex items-center justify-center transition-all active:scale-95"
              title="עגלת קניות"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] flex items-center justify-center shadow-md border border-stone-950 animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* VIP User Profile Capsule */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-xl sm:rounded-2xl px-3 h-11 transition-all">
                <Link
                  href="/profile"
                  onClick={() => coffeeSound.playBaristaClick()}
                  className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
                  title="לאונג' הפרופיל וה-VIP שלי"
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 font-extrabold text-xs flex items-center justify-center overflow-hidden shrink-0 border border-amber-500/50">
                    {user.image && !user.image.includes('photo-1534528741775') ? (
                      <img src={user.image} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <img src="/idan-profile-circle.png" alt={user.fullName} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <span className="hidden xl:inline text-xs sm:text-sm font-bold text-stone-200 truncate max-w-[90px]">
                    {user.fullName}
                  </span>
                </Link>

                <button
                  onClick={() => {
                    coffeeSound.playBaristaClick();
                    logout();
                  }}
                  className="p-1 rounded-md text-stone-500 hover:text-rose-400 transition-colors border-r border-stone-800 pr-1.5 mr-1"
                  title="התנתק"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  coffeeSound.playBaristaClick();
                  setIsAuthModalOpen(true);
                }}
                className="h-11 px-4 rounded-xl sm:rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-500/40 text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">התחברות</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Trigger */}
            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="md:hidden h-11 w-11 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-all"
              title="פתח תפריט מובייל"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Mobile Drawer Overlay */}
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => {
          coffeeSound.playBaristaClick();
          setIsMobileMenuOpen(false);
        }}
        primaryPages={primaryPages}
        allFeatures={allFeatures}
        searchQuery={megaSearchQuery}
        setSearchQuery={setMegaSearchQuery}
        handleFeatureClick={handleFeatureClick}
        pathname={pathname}
      />
    </>
  );
};
