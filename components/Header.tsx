'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Coffee,
  ShoppingBag,
  Flame,
  User,
  Clock,
  Sparkles,
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
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { AuthModal } from '@/components/AuthModal';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface HeaderProps {
  onOpenBarista: () => void;
  onScrollToSection?: (id: string) => void;
}

interface FeatureItem {
  id: string;
  page: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CategoryGroup {
  title: string;
  color: string;
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

  return createPortal(
    <div className="lg:hidden fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-[#070505]/98 backdrop-blur-3xl p-5 overflow-y-auto animate-fadeIn dir-rtl flex flex-col space-y-5">
      {/* Mobile Header Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-black shadow-lg">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-amber-300">תפריט ניווט ראשי</h3>
            <p className="text-[10px] text-stone-400 font-mono">THE DIGITAL ROAST AI</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 transition-all active:scale-95"
          title="סגור תפריט"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Primary Pages Links Grid for Mobile */}
      <div className="grid grid-cols-2 gap-2.5">
        {primaryPages.map((page) => {
          const Icon = page.icon;
          const isActive = pathname === page.href;
          return (
            <Link
              key={page.href}
              href={page.href}
              onClick={onClose}
              className={`p-3.5 rounded-2xl text-xs font-black flex items-center gap-3 transition-all ${
                isActive
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-[#141010] text-stone-200 border border-stone-800 hover:border-amber-500/40'
              }`}
            >
              <div className={`p-2 rounded-xl ${isActive ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-amber-400'}`}>
                <Icon className="w-4 h-4 shrink-0" />
              </div>
              <span>{page.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Search Filter Input */}
      <div className="relative pt-1">
        <Search className="w-4 h-4 text-amber-400 absolute right-3.5 top-4" />
        <input
          type="text"
          placeholder="חפש פיצ'ר או כלי חליטה..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-10 pl-3.5 py-3 text-xs bg-[#1a1515] border border-amber-500/40 rounded-2xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Categorized Features List */}
      <div className="space-y-3 flex-1 pb-16">
        <div className="text-xs font-black text-amber-300 flex items-center gap-2 border-b border-stone-800 pb-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>כל הכלים והפיצ'רים הקוליים (21 רכיבים)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {allFeatures
            .filter(
              (item) =>
                item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.desc.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleFeatureClick(item.page, item.id)}
                  className="p-3 rounded-2xl bg-[#141010] border border-stone-800 hover:border-amber-500/50 text-neutral-200 text-xs font-semibold flex items-center justify-between transition-all group text-right active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-400 group-hover:border-amber-500/50">
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-200 group-hover:text-amber-300">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-stone-400 font-light truncate">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#1e1510] border border-amber-500/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-200 font-bold">סוכן ה-AI פעיל ברקע</span>
        </div>
        <span className="text-[10px] text-amber-400 bg-amber-500/30 px-2 py-0.5 rounded-md border border-amber-500/40 font-mono">
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleMute = () => {
    const newMuted = coffeeSound.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      coffeeSound.playBaristaClick();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary top-level navigation pages
  const primaryPages = [
    { href: '/home', label: 'ראשי', icon: Coffee },
    { href: '/shop', label: 'חנות וקטלוג', icon: ShoppingBag },
    { href: '/ai-barista', label: 'בריסטה AI', icon: Sparkles },
    { href: '/brew-lab', label: 'מעבדת חליטה', icon: TestTube },
    { href: '/studio', label: 'סטודיו וקלייה', icon: Sliders },
    { href: '/corporate', label: 'עסקים ומתנות', icon: Building2 },
  ];

  // Categorized feature tools for the Dropdown menu
  const featureCategories: CategoryGroup[] = [
    {
      title: 'חנות & טעמים',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
      items: [
        { id: 'catalog', page: '/catalog', label: 'תפריט גורמה', desc: 'קטלוג פולים ומוצרי קפה', icon: Coffee },
        { id: 'aroma-scent', page: '/aroma-scent', label: 'ניתוח ארומה וטרפנים AI', desc: 'ניתוח מולקולרי ומדד VAI%', icon: Sparkles },
        { id: 'sensory-radar', page: '/sensory-radar', label: 'גלגל טעמים 5D', desc: 'ניתוח ארומה ופרופיל טעם', icon: Sparkles },
        { id: 'sommelier', page: '/sommelier', label: 'סומלייה מאפים', desc: 'התאמת קפה למאפי שף', icon: Utensils },
        { id: 'subscription', page: '/subscription', label: 'מנוי חודשי', desc: 'אספקת פולים חודשית לבית', icon: Globe },
      ],
    },
    {
      title: 'בריסטה & AI',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300',
      items: [
        { id: 'bio-energy', page: '/bio-energy', label: 'תאימות אנרגיה Bio-Match', desc: 'התאמת קפה לרמת עייפות', icon: Flame },
        { id: 'barista-academy', page: '/barista-academy', label: 'אקדמיית הבריסטה AI', desc: 'מבחני הסמכה ותגי מומחה', icon: Award },
        { id: 'whatsapp-voice', page: '/whatsapp-voice', label: 'הזמנה ב-WhatsApp Voice', desc: 'הודעות קוליות להזמנה', icon: MessageSquare },
      ],
    },
    {
      title: 'מעבדת חליטה',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-300',
      items: [
        { id: 'v60', page: '/v60', label: 'V60 Master Timer', desc: 'טיימר חליטה חיה עם Bloom', icon: Clock },
        { id: 'water-chemistry', page: '/water-chemistry', label: 'מחשב כימיית מים', desc: 'מינרלים ותקן SCA', icon: TestTube },
        { id: 'extraction-telemetry', page: '/extraction-telemetry', label: 'טלמטריית TDS', desc: 'אחוז מיצוי אספרסו (EY%)', icon: Activity },
        { id: 'extraction-sim', page: '/extraction-sim', label: 'סימולטור 9Bar', desc: 'סימולציית לחץ וחליטה', icon: Activity },
        { id: 'cold-brew-calculator', page: '/cold-brew-calculator', label: 'Cold & Nitro Brew', desc: 'מחשבון חליטות קרות', icon: Snowflake },
      ],
    },
    {
      title: 'סטודיו & מועדון',
      color: 'from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-300',
      items: [
        { id: 'roast-profile', page: '/roast-profile', label: 'גרף קלייה RoR Designer', desc: 'ניטור וסימולציית First Crack', icon: Flame },
        { id: 'custom-roast-studio', page: '/custom-roast-studio', label: 'מעבדת קלייה', desc: 'עיצוב דרגות קלייה אישיות', icon: Sliders },
        { id: 'personal-brew-journal', page: '/personal-brew-journal', label: 'יומן חליטה Dial-in', desc: 'תיעוד וניטור חליטות', icon: BookOpen },
        { id: 'latte-art-trainer', page: '/latte-art-trainer', label: 'מאמן לאטה ארט', desc: 'אימון ויזואלי ומזיגות', icon: Droplets },
        { id: 'gamification', page: '/gamification', label: 'מועדון Roast Club', desc: 'אתגרים ודרגות בריסטה', icon: Award },
        { id: 'live-cupping-room', page: '/live-cupping-room', label: 'Cupping Room', desc: 'חדר טעימות שיתופי', icon: Star },
      ],
    },
    {
      title: 'עסקים & מלאי',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
      items: [
        { id: 'corporate-lounge', page: '/corporate-lounge', label: 'B2B משרדים', desc: 'לאונג קפה לחברות', icon: Building2 },
        { id: 'gift-sommelier', page: '/gift-sommelier', label: 'אשף מתנות AI', desc: 'מארזים מותאמים אישית', icon: Gift },
        { id: 'multi-roaster-marketplace', page: '/multi-roaster-marketplace', label: 'שוק קולים', desc: 'פולי קפה מקולים עצמאיים', icon: Store },
        { id: 'smart-inventory', page: '/smart-inventory', label: 'ניהול מלאי', desc: 'חיזוי צריכה והזמנות', icon: Zap },
        { id: 'farm-story', page: '/farm-story', label: 'סיפור החווה', desc: 'מקורות הפולים וטרואר', icon: BookOpen },
      ],
    },
  ];

  // Flattened list for mobile search
  const allFeatures = featureCategories.flatMap((cat) => cat.items);

  // Navigate to feature page + scroll smoothly to section
  const handleFeatureClick = (pageUrl: string, sectionId: string) => {
    coffeeSound.playBaristaClick();
    setIsDropdownOpen(false);
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

  return (
    <>
      <header className="sticky top-2 z-50 w-full max-w-[98%] mx-auto px-2 sm:px-4">
        {/* Liquid Glass Header Container */}
        <div className="relative rounded-3xl bg-[#0a0808]/95 backdrop-blur-xl border border-amber-500/40 shadow-[0_10px_45px_rgba(0,0,0,0.85)] transition-all duration-300">
          <div className="h-20 px-3 sm:px-5 flex items-center justify-between gap-3">
            
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/home"
                onClick={() => coffeeSound.playBaristaClick()}
                className="flex items-center gap-3 group"
              >
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300">
                  <Coffee className="w-6 h-6 text-black" />
                  <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-black"></span>
                  </span>
                </div>
                <div className="hidden xl:block">
                  <span className="text-base font-black tracking-wide bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent whitespace-nowrap">
                    THE DIGITAL ROAST
                  </span>
                  <div className="flex items-center gap-1.5 -mt-1">
                    <span className="text-[9px] tracking-widest text-amber-400 font-mono">
                      GEMINI 3.5 BARISTA
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Deck: Primary Pages + Feature Dropdown */}
            <nav className="hidden lg:flex items-center gap-2 p-1.5 rounded-2xl bg-[#141010]/90 border border-amber-500/30 flex-1 justify-center max-w-4xl">
              {/* Primary Main Pages Links */}
              {primaryPages.map((page) => {
                const Icon = page.icon;
                const isActive = pathname === page.href;
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    onClick={() => coffeeSound.playBaristaClick()}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'text-stone-300 hover:text-amber-300 hover:bg-amber-500/15 border border-transparent hover:border-amber-500/30'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-amber-500/80'}`} />
                    <span>{page.label}</span>
                  </Link>
                );
              })}

              {/* Separator Divider */}
              <div className="w-[1px] h-6 bg-amber-500/20 mx-1 shrink-0" />

              {/* Dropdown Trigger Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => {
                    coffeeSound.playBaristaClick();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border shrink-0 whitespace-nowrap shadow-md ${
                    isDropdownOpen
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                      : 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 text-amber-300 border-amber-500/50 hover:bg-amber-500/25 hover:border-amber-400'
                  }`}
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>כל הכלים והפיצ'רים</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-black' : 'text-amber-400'}`} />
                </button>

                {/* Categorized Dropdown Floating Panel */}
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 md:-right-20 mt-3 w-[92vw] max-w-[720px] p-5 rounded-3xl bg-[#0d0a0a]/98 border border-amber-500/50 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl animate-fadeIn z-50 dir-rtl grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <div className="col-span-2 pb-2 mb-1 border-b border-amber-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black text-amber-300 tracking-wider">
                          מרכז הכלים והאקו-סיסטם הקולי (21 רכיבים)
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono bg-stone-900 px-2 py-0.5 rounded-full border border-stone-800">
                        Liquid Glass 4.0
                      </span>
                    </div>

                    {featureCategories.map((category) => (
                      <div
                        key={category.title}
                        className="p-3.5 rounded-2xl bg-[#141010] border border-stone-800/80 hover:border-amber-500/40 transition-all space-y-2"
                      >
                        <div className="text-[11px] font-black text-amber-400 tracking-wide border-b border-stone-800/60 pb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          <span>{category.title}</span>
                        </div>
                        <div className="space-y-1">
                          {category.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleFeatureClick(item.page, item.id)}
                                className="w-full p-2 rounded-xl hover:bg-amber-500/15 text-stone-200 hover:text-amber-300 transition-all flex items-center gap-2.5 text-right group"
                              >
                                <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-amber-400 group-hover:border-amber-500/50 group-hover:scale-105 transition-all shrink-0">
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="overflow-hidden">
                                  <div className="text-xs font-bold leading-tight group-hover:text-amber-300">
                                    {item.label}
                                  </div>
                                  <div className="text-[10px] text-stone-400 truncate font-light">
                                    {item.desc}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Control Actions Center */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Audio Sound Effects Toggle */}
              <button
                onClick={handleToggleMute}
                className={`p-2.5 rounded-2xl border transition-all duration-300 ${
                  isMuted
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-400'
                    : 'bg-amber-950 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                }`}
                title={isMuted ? 'הפעל אפקטי קול' : 'השתק אפקטי קול'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
              </button>

              {/* AI Barista Voice Modal Launcher */}
              <button
                onClick={() => {
                  coffeeSound.playCoffeeSteam();
                  onOpenBarista();
                }}
                className="relative px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-black animate-spin-slow" />
                <span className="hidden sm:inline">בריסטה Gemini</span>
              </button>

              {/* Auth User Profile or Login Button */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2 bg-stone-900 border border-amber-500/30 rounded-2xl px-3 py-1.5 shadow-md">
                  <Link
                    href="/profile"
                    onClick={() => coffeeSound.playBaristaClick()}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    title="לאונג' ה-VIP והפרופיל שלי"
                  >
                    <div className="w-7 h-7 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center overflow-hidden shrink-0 border border-amber-500/50 shadow-sm">
                      {user.image ? (
                        <img src={user.image} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        user.fullName.charAt(0)
                      )}
                    </div>
                    <div className="hidden sm:block text-right">
                      <div className="text-[11px] font-bold text-amber-300 leading-tight">
                        {user.fullName}
                      </div>
                      <div className="text-[9px] text-stone-400 font-mono">
                        {user.role} • VIP
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      coffeeSound.playBaristaClick();
                      logout();
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 transition-colors ms-1 border-r border-stone-800 pr-1.5"
                    title="התנתק מהחשבון"
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
                  className="px-3.5 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-amber-400 hover:border-amber-500/50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                  title="התחברות / הרשמה"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">התחברות / הרשמה</span>
                </button>
              )}

              {/* Shopping Cart Drawer Trigger */}
              <button
                onClick={() => {
                  coffeeSound.playBaristaClick();
                  toggleCart();
                }}
                className="relative p-2.5 rounded-2xl bg-amber-950 border border-amber-500/50 text-amber-300 hover:bg-amber-900 transition-all shadow-md"
                title="עגלת קניות"
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold text-[10px] flex items-center justify-center shadow-lg border border-black">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => {
                  coffeeSound.playBaristaClick();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="lg:hidden p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-400 transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Standalone External Full Screen Mobile Overlay Portal */}
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => {
          coffeeSound.playBaristaClick();
          setIsMobileMenuOpen(false);
        }}
        primaryPages={primaryPages}
        allFeatures={allFeatures}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleFeatureClick={handleFeatureClick}
        pathname={pathname}
      />
    </>
  );
};
