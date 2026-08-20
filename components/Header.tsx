'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  User,
  Wifi,
  Brain,
  FlaskConical,
  Leaf,
  Eye,
  Check,
  ChevronLeft,
  Compass,
  Calendar,
  Mic,
  Receipt as ReceiptIcon,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useVoiceAssistantStore } from '@/lib/store/useVoiceAssistantStore';
import { AuthModal } from '@/components/AuthModal';
import { coffeeSound } from '@/lib/audio/coffeeSounds';
import { useHorizontalScroll } from '@/lib/hooks/useHorizontalScroll';

interface HeaderProps {
  onOpenBarista?: () => void;
  onScrollToSection?: (id: string) => void;
}

export interface FeatureItem {
  id: string;
  page: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  category: string;
}

export interface CategoryGroup {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
  items: FeatureItem[];
}

/* =========================================================================
   FEATURE DEFINITIONS & CATEGORIES (5 Domains, 25+ Specialized Tools)
   ========================================================================= */
const FEATURE_CATEGORIES: CategoryGroup[] = [
  {
    id: 'shop_taste',
    title: 'חנות, טעמים וגורמה',
    shortTitle: 'חנות וטעמים',
    icon: ShoppingBag,
    color: 'border-amber-500/40 from-amber-500/20 to-orange-500/10 text-amber-300',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    items: [
      { id: 'catalog', page: '/catalog', label: 'תפריט פולים וגורמה', desc: 'קטלוג פולים, תערובות מיוחדות וציוד', icon: Coffee, tag: 'CATALOG', category: 'shop_taste' },
      { id: 'thermal-receipt', page: '/thermal-receipt', label: 'מדפסת קבלות תרמית & קונפטי', desc: 'אנימציית הדפסת קבלה תרמית בזמן אמת עם פיזיקת פליטה', icon: ReceiptIcon, tag: 'NEW FX', category: 'shop_taste' },
      { id: 'nootropic-matcher', page: '/nootropic-matcher', label: 'נואוטרופיקה ואדפטוגנים', desc: "Lion's Mane, Cordyceps ו-Reishi", icon: Brain, tag: 'NOOTROPIC', category: 'shop_taste' },
      { id: 'orders', page: '/orders', label: 'הזמנות ומעקב משלוח חי', desc: 'מעקב משלוח חי, קבלות דיגיטליות והזמנה חוזרת', icon: Clock, tag: 'LIVE', category: 'shop_taste' },
      { id: 'aroma-scent', page: '/aroma-scent', label: 'ניתוח ארומה וטרפנים AI', desc: 'ניתוח מולקולרי ומדד VAI% רב-ממדי', icon: Sparkles, tag: 'AI 5D', category: 'shop_taste' },
      { id: 'sensory-radar', page: '/sensory-radar', label: 'גלגל טעמים 5D סנסורי', desc: 'מיפוי עפיצות, מתיקות ופרופיל טעם', icon: Sparkles, category: 'shop_taste' },
      { id: 'sommelier', page: '/sommelier', label: 'סומלייה מאפים וקפה', desc: 'התאמת זני קפה למאפי שף וקינוחים', icon: Utensils, category: 'shop_taste' },
      { id: 'subscription', page: '/subscription', label: 'מנוי קפה VIP חודשי', desc: 'משלוח פולים טריים בקלייה אישית לבית', icon: Globe, tag: 'VIP', category: 'shop_taste' },
    ],
  },
  {
    id: 'ai_barista',
    title: 'בריסטה AI ופיזיקה חכמה',
    shortTitle: 'AI ובריסטה',
    icon: Sparkles,
    color: 'border-cyan-500/40 from-cyan-500/20 to-blue-500/10 text-cyan-300',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    items: [
      { id: 'ai-barista', page: '/ai-barista', label: 'בריסטה Gemini 3.5 AI', desc: 'הזמנה קולית, זיהוי פולים בצילום והמלצות', icon: Sparkles, tag: 'VOICE', category: 'ai_barista' },
      { id: 'cryo-grind', page: '/cryo-grind', label: 'טחינה קריוגנית & PSD AI', desc: 'שבירת תאים ב-18°C- ופיזור מיקרוני אחיד', icon: Snowflake, tag: 'CRYO', category: 'ai_barista' },
      { id: 'gemma-roast-vision', page: '/gemma-roast-vision', label: 'ניתוח פגמי קלייה Gemma', desc: 'זיהוי אופטי של פגמים ועקומת RoR ב-SVG', icon: Sparkles, tag: 'GEMMA', category: 'ai_barista' },
      { id: 'instagram-reel', page: '/instagram-reel', label: 'קונספט אינסטגרם Reel 3D', desc: 'אדים, מזיגת חלב, קרח 3D ופולים צפים', icon: Sparkles, tag: '3D', category: 'ai_barista' },
      { id: 'parallax-experience', page: '/parallax-experience', label: 'חוויית פרלקס חליטה 3D', desc: 'מסע Sticky Scroll ושלבי פיתוח חליטה', icon: Layers, category: 'ai_barista' },
      { id: 'acoustic-tuner', page: '/acoustic-tuner', label: 'מכוונן טחינה אקוסטי FFT', desc: 'ניתוח תדרי סכינים וגלאי Channeling', icon: Activity, tag: 'FFT', category: 'ai_barista' },
      { id: 'ultrasonic-aging', page: '/ultrasonic-aging', label: 'תא יישון אולטרסוני & ואקום', desc: 'הפחתת חומציות טאנית ב-45% ואיטום', icon: Zap, tag: 'AGING', category: 'ai_barista' },
      { id: 'ar-latte-art', page: '/ar-latte-art', label: 'מדפסת 3D ללאטה ארט AR', desc: 'פיסול קצף מוגבה ווקטוריזטור קקאו', icon: Sparkles, tag: 'AR', category: 'ai_barista' },
      { id: 'circadian-clock', page: '/circadian-clock', label: 'שעון קפאין סירקדיאני', desc: 'סנכרון רמות קורטיזול ומניעת התרסקות', icon: Clock, tag: 'BIO', category: 'ai_barista' },
      { id: 'animations', page: '/animations', label: 'סטודיו אנימציות & פיזיקה 3D', desc: 'סימולציית קרמה, גלי חום, 3D Cup ופיצוץ קלייה', icon: Sparkles, tag: '3D FX', category: 'ai_barista' },
      { id: 'whatsapp-voice', page: '/whatsapp-voice', label: 'הזמנה ב-WhatsApp Voice', desc: 'הודעות קוליות להזמנה ואוטומציית CRM', icon: MessageSquare, tag: 'VOICE', category: 'ai_barista' },
    ],
  },
  {
    id: 'brew_lab',
    title: 'מעבדת חליטה, מים וכימיה',
    shortTitle: 'מעבדה ומדע',
    icon: TestTube,
    color: 'border-blue-500/40 from-blue-500/20 to-indigo-500/10 text-blue-300',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    items: [
      { id: 'pressure-profiler', page: '/pressure-profiler', label: 'פרופילר לחץ וזרימה Live', desc: 'כיול עקומות לחץ וזרימה למכונות אספרסו', icon: Activity, tag: 'FLOW', category: 'brew_lab' },
      { id: 'cold-brew-lab', page: '/cold-brew-lab', label: 'מעבדת נייטרו & גזים N2', desc: 'אפקט מפל, רוויית חנקן וקינטיקת חליטה', icon: Snowflake, tag: 'NITRO', category: 'brew_lab' },
      { id: 'israel-water-radar', page: '/israel-water-radar', label: 'איכות מים בישראל & SCA', desc: 'נתוני רשות המים לפי ערים ומתכון איזון', icon: Droplets, tag: 'GOV.IL', category: 'brew_lab' },
      { id: 'mongo-telemetry', page: '/mongo-telemetry', label: 'דשבורד טלמטריה MongoDB', desc: 'אגרגציית נתוני שחיקת מלאי ו-CLV', icon: Activity, tag: 'MONGO', category: 'brew_lab' },
      { id: 'smart-iot', page: '/smart-iot', label: 'סנכרון מכונה חכמה IoT', desc: 'דחיפת פרופיל לחץ 9Bar וטמפ׳ PID', icon: Wifi, tag: 'MQTT', category: 'brew_lab' },
      { id: 'v60', page: '/v60', label: 'V60 Master Timer', desc: 'טיימר חליטה חיה עם Bloom ומד מזיגה', icon: Clock, tag: 'TIMER', category: 'brew_lab' },
      { id: 'molecular-pairing', page: '/molecular-pairing', label: 'תסיסה אנארובית & אסתרים', desc: 'מעקב 72h וצימוד מאפים מולקולרי', icon: FlaskConical, tag: 'ESTERS', category: 'brew_lab' },
      { id: 'water-chemistry', page: '/water-chemistry', label: 'מחשב כימיית מים SCA', desc: 'מינרלים, קשיות GH/KH ואיזון pH מושלם', icon: TestTube, tag: 'CHEM', category: 'brew_lab' },
      { id: 'extraction-telemetry', page: '/extraction-telemetry', label: 'טלמטריית TDS & EY%', desc: 'מדידת אחוז מיצוי אספרסו Gold Cup', icon: Activity, tag: 'EY%', category: 'brew_lab' },
      { id: 'extraction-sim', page: '/extraction-sim', label: 'סימולטור 9Bar לחץ', desc: 'סימולציית לחץ, זרימה וערוצים בחליטה', icon: Activity, category: 'brew_lab' },
      { id: 'cold-brew-calculator', page: '/cold-brew-calculator', label: 'Cold & Nitro Brew', desc: 'רפרקטומטר TDS, מודולטור טמפ׳ וניטרו', icon: Snowflake, tag: 'TDS', category: 'brew_lab' },
      { id: 'puck-prep-sim', page: '/puck-prep-sim', label: 'סימולטור Puck Prep', desc: 'דיפיוזר WDT, פיזור אחיד ודחיסה אופטימלית', icon: Layers, tag: 'PUCK', category: 'brew_lab' },
    ],
  },
  {
    id: 'studio_roast',
    title: 'סטודיו, קלייה ומועדון VIP',
    shortTitle: 'קלייה וסטודיו',
    icon: Flame,
    color: 'border-orange-500/40 from-orange-500/20 to-amber-500/10 text-orange-300',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    items: [
      { id: 'roast-analyzer', page: '/roast-analyzer', label: 'מנתח קלייה אופטי & Agtron AI', desc: 'דגימת צבע, סקאלת Agtron ו-ΔAgtron ליבה', icon: Eye, tag: 'AGTRON', category: 'studio_roast' },
      { id: 'cupping-radar', page: '/cupping-radar', label: 'גלגל טעמים 3D & ציון SCA', desc: 'הערכת 100 נקודות ורדאר סנסורי אינטראקטיבי', icon: Star, tag: 'SCA 100', category: 'studio_roast' },
      { id: 'notebooklm-hub', page: '/notebooklm-hub', label: 'מרכז קאפינג NotebookLM', desc: 'דוחות SCA 100pt, סנכרון Docs & Obsidian', icon: BookOpen, tag: 'CLOUD', category: 'studio_roast' },
      { id: 'stitch-studio', page: '/stitch-studio', label: 'סטודיו עיצוב StitchMCP', desc: 'כיוונון טוקנים של Liquid Glass בזמן אמת', icon: Sliders, tag: 'STITCH', category: 'studio_roast' },
      { id: 'roast-profile', page: '/roast-profile', label: 'רדאר קלייה RoR & SCA', desc: 'ניטור First Crack, עקומת RoR וסקאלת צבע', icon: Flame, tag: 'RoR', category: 'studio_roast' },
      { id: 'custom-roast-studio', page: '/custom-roast-studio', label: 'מעבדת קלייה אישית', desc: 'עיצוב פרופילי קלייה מותאמים אישית', icon: Sliders, category: 'studio_roast' },
      { id: 'personal-brew-journal', page: '/personal-brew-journal', label: 'יומן חליטה Dial-in', desc: 'תיעוד, דירוג ומעקב אחרי כל כוס', icon: BookOpen, category: 'studio_roast' },
      { id: 'latte-art-trainer', page: '/latte-art-trainer', label: 'מאמן לאטה ארט ויזואלי', desc: 'אימון ויזואלי במזיגות ודוגמאות', icon: Droplets, category: 'studio_roast' },
      { id: 'gamification', page: '/gamification', label: 'מועדון Roast Club VIP', desc: 'אתגרים, משימות יומיות ודרגות בריסטה', icon: Award, tag: 'QUESTS', category: 'studio_roast' },
      { id: 'live-cupping-room', page: '/live-cupping-room', label: 'Cupping Room שיתופי חי', desc: 'חדר טעימות שיתופי וירטואלי בזמן אמת', icon: Star, tag: 'LIVE', category: 'studio_roast' },
      { id: 'calendar-hub', page: '/calendar-hub', label: 'יומן קפה Google Calendar', desc: 'תזמון סדנאות, שעון צירקדי ודיגזינג פולים', icon: Calendar, tag: 'GCAL', category: 'studio_roast' },
      { id: 'barista-academy', page: '/barista-academy', label: 'אקדמיית הבריסטה AI', desc: 'מבחני הסמכה, מסלולי למידה ותגי מומחה', icon: Award, tag: 'ACADEMY', category: 'studio_roast' },
    ],
  },
  {
    id: 'b2b_terroir',
    title: 'עסקים, B2B וטרואר עולמי',
    shortTitle: 'טרואר ו-B2B',
    icon: Globe,
    color: 'border-emerald-500/40 from-emerald-500/20 to-teal-500/10 text-emerald-300',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    items: [
      { id: 'coffee-fx-ticker', page: '/coffee-fx-ticker', label: 'אינדקס קפה ירוק & שער מט״ח', desc: 'מחירי חוזים עולמיים ועלויות יבוא בש״ח', icon: Globe, tag: 'FX ILS', category: 'b2b_terroir' },
      { id: 'israel-roasters', page: '/israel-roasters', label: 'אינדקס בתי קלייה בישראל', desc: 'רישיונות יצרן משרד הבריאות וכשרות', icon: Store, tag: 'ROASTERS', category: 'b2b_terroir' },
      { id: 'sustainability', page: '/sustainability', label: 'מעקב חוות אפס-פחמן', desc: '0.0kg CO2 וסחר ישיר Direct Trade', icon: Leaf, tag: 'NET-ZERO', category: 'b2b_terroir' },
      { id: 'corporate-lounge', page: '/corporate-lounge', label: 'B2B לאונג׳ משרדים וחברות', desc: 'פתרונות קפה גורמה אקסקלוסיביים לחברות', icon: Building2, tag: 'B2B', category: 'b2b_terroir' },
      { id: 'gift-sommelier', page: '/gift-sommelier', label: 'אשף מתנות AI גורמה', desc: 'מארזי שי מותאמים אישית לחגים ועובדים', icon: Gift, category: 'b2b_terroir' },
      { id: 'multi-roaster-marketplace', page: '/multi-roaster-marketplace', label: 'שוק קולים עצמאיים בישראל', desc: 'פולי קפה ממיטב הקולים המובילים בארץ', icon: Store, category: 'b2b_terroir' },
      { id: 'smart-inventory', page: '/smart-inventory', label: 'ניהול מלאי חכם AI', desc: 'חיזוי צריכה והזמנות מלאי אוטומטיות', icon: Zap, tag: 'AI', category: 'b2b_terroir' },
      { id: 'farm-story', page: '/farm-story', label: 'סיפור החווה והטרואר', desc: 'מקורות הפולים, גבהים וחקלאים מרחבי העולם', icon: BookOpen, category: 'b2b_terroir' },
    ],
  },
];

const ALL_FEATURES: FeatureItem[] = FEATURE_CATEGORIES.flatMap((c) => c.items);

/* =========================================================================
   MOBILE MENU DRAWER COMPONENT (Slide-over RTL with Smooth Blur & Tabs)
   ========================================================================= */
interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  primaryPages: Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
  allFeatures: FeatureItem[];
  categories: CategoryGroup[];
  pathname: string;
  onOpenBarista?: () => void;
  onOpenAuth: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  primaryPages,
  allFeatures,
  categories,
  pathname,
  onOpenBarista,
  onOpenAuth,
  isMuted,
  onToggleMute,
}) => {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categoryScrollRef = useHorizontalScroll<HTMLDivElement>();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchQuery('');
      setSelectedCategory('all');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Filtered tools based on search and category
  const filteredTools = useMemo(() => {
    return allFeatures.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allFeatures, searchQuery, selectedCategory]);

  if (!mounted || typeof window === 'undefined') return null;

  return createPortal(
    <div
      className={`lg:hidden fixed inset-0 z-[99999] transition-all duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={() => {
          coffeeSound.playBaristaClick();
          onClose();
        }}
        className={`absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Slide-over Drawer (RTL from Right) */}
      <div
        className={`absolute inset-y-0 right-0 w-[92vw] max-w-[420px] bg-[#0c0909] border-l border-amber-500/30 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col z-10 dir-rtl text-right transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 1. Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800/90 bg-[#100c0c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/25 border border-amber-300/40">
              <Coffee className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-300 leading-tight">THE DIGITAL ROAST</h3>
              <p className="text-[10px] text-stone-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>מערכת קפה & AI פעילה</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              coffeeSound.playBaristaClick();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-400 hover:border-amber-500/40 transition-all active:scale-95"
            aria-label="סגור תפריט"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. User VIP Status Banner / Quick Login */}
        <div className="px-4 pt-3 pb-1 shrink-0">
          {isAuthenticated && user ? (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 flex items-center justify-between">
              <Link
                href="/profile"
                onClick={() => {
                  coffeeSound.playBaristaClick();
                  onClose();
                }}
                className="flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center overflow-hidden border border-amber-400/50">
                  {user.image && !user.image.includes('photo-1534528741775') ? (
                    <img src={user.image} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <img src="/idan-profile-circle.png" alt={user.fullName} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-black text-stone-100 leading-none">{user.fullName}</div>
                  <div className="text-[10px] font-mono text-amber-400 mt-0.5 font-bold">חבר מועדון VIP 💎</div>
                </div>
              </Link>

              <button
                onClick={() => {
                  coffeeSound.playBaristaClick();
                  logout();
                }}
                className="p-1.5 rounded-lg bg-stone-900/80 text-stone-400 hover:text-rose-400 transition-colors border border-stone-800 text-[11px] flex items-center gap-1"
                title="התנתק"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                onClose();
                onOpenAuth();
              }}
              className="w-full p-2.5 rounded-2xl bg-stone-900/90 border border-amber-500/40 text-amber-300 hover:bg-amber-500/15 text-xs font-black flex items-center justify-center gap-2 transition-all"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>התחברות למועדון Roast Club VIP</span>
            </button>
          )}
        </div>

        {/* 3. Search Input */}
        <div className="px-4 py-2 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="חפש כלי, עמוד, מעבדה או פקודה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-900/95 border border-stone-700/80 focus:border-amber-400 text-stone-100 placeholder-stone-400 text-xs focus:outline-none shadow-inner transition-colors"
            />
            <Search className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-md text-stone-400 hover:text-stone-200 absolute left-2.5 top-1/2 -translate-y-1/2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4. Horizontal Category Filter Chips Slider */}
        <div className="px-4 py-1.5 shrink-0">
          <div ref={categoryScrollRef} className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing">
            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-black'
                  : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-amber-300'
              }`}
            >
              <span>הכל</span>
              <span className="text-[10px] opacity-75 font-mono">({allFeatures.length})</span>
            </button>

            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    coffeeSound.playBaristaClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-black'
                      : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-amber-300'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Scrollable Main Content (Primary Pages + Filtered Tools) */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 [scrollbar-width:thin] [scrollbar-color:#d97706_#100c0c] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#100c0c] [&::-webkit-scrollbar-thumb]:bg-amber-500/40 [&::-webkit-scrollbar-thumb]:rounded-full">
          {/* Primary Quick Links */}
          {selectedCategory === 'all' && !searchQuery && (
            <div className="space-y-2">
              <div className="text-[11px] font-black text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>עמודי ליבה מרכזיים</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                          : 'bg-[#15100f] border-stone-800 text-stone-300 hover:text-amber-300 hover:bg-[#1e1715] hover:border-amber-500/40'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-amber-500 text-stone-950' : 'bg-[#1e1715] text-amber-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{page.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tools List */}
          <div className="space-y-2">
            <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>כלי הפלטפורמה והמעבדות ({filteredTools.length})</span>
              </span>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-[10px] text-stone-400 hover:text-amber-300 underline font-normal"
                >
                  איפוס סינון
                </button>
              )}
            </div>

            {filteredTools.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#120d0c] border border-stone-800 text-center space-y-2">
                <Coffee className="w-8 h-8 text-stone-600 mx-auto" />
                <p className="text-xs text-stone-400 font-bold">לא נמצאו כלים התואמים לחיפוש</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs text-amber-400 underline font-bold"
                >
                  הצג את כל הכלים
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredTools.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.page;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        coffeeSound.playBaristaClick();
                        onClose();
                        router.push(item.page);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-right transition-all flex items-center gap-3 group ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                          : 'bg-[#15100f] border-stone-800 hover:border-amber-500/70 hover:bg-[#1e1715] text-stone-300'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-[#1e1715] border border-stone-700/80 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-stone-100 group-hover:text-amber-300 truncate">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-stone-400 truncate mt-0.5 font-light">
                          {item.desc}
                        </div>
                      </div>

                      {item.tag && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#241a18] text-amber-300 font-mono border border-amber-500/20 shrink-0">
                          {item.tag}
                        </span>
                      )}
                      <ChevronLeft className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-300 transition-transform group-hover:-translate-x-0.5 shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 6. Drawer Bottom Fixed Action Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-800/90 bg-[#100c0c] flex items-center justify-between gap-2 shrink-0">
          {/* Audio Sound FX Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
              isMuted
                ? 'bg-stone-900 border-stone-800 text-stone-500'
                : 'bg-amber-950/80 border-amber-500/50 text-amber-400 shadow-sm shadow-amber-500/20'
            }`}
            title={isMuted ? 'הפעל צלילים' : 'השתק צלילים'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* AI Barista Launcher */}
          <button
            onClick={() => {
              coffeeSound.playCoffeeSteam();
              onClose();
              onOpenBarista?.();
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-stone-950 animate-spin-slow" />
            <span>בריסטה AI קולי</span>
          </button>

          {/* Shopping Cart Trigger */}
          <button
            onClick={() => {
              coffeeSound.playBaristaClick();
              onClose();
              toggleCart();
            }}
            className="relative p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center shrink-0"
            title="עגלת קניות"
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-amber-500 text-stone-950 font-black text-[9px] flex items-center justify-center border border-stone-950">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* =========================================================================
   MAIN HEADER COMPONENT (Liquid Glass 4.0 Pro & Responsive Navigation)
   ========================================================================= */
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
  const [activeMegaCategory, setActiveMegaCategory] = useState<string>('all');
  const megaCategoryScrollRef = useHorizontalScroll<HTMLDivElement>();

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      // Keyboard shortcut: ⌘K or Ctrl+K to toggle Mega Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsMegaMenuOpen((prev) => {
          const next = !prev;
          if (next) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
          }
          return next;
        });
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

  // Core Primary Routes (High value navigation links)
  const primaryPages = [
    { href: '/home', label: 'ראשי', icon: Coffee },
    { href: '/shop', label: 'חנות', icon: ShoppingBag },
    { href: '/orders', label: 'הזמנות', icon: Clock },
    { href: '/brew-lab', label: 'מעבדה', icon: TestTube },
    { href: '/studio', label: 'סטודיו', icon: Flame },
  ];

  // Filtered mega menu items
  const filteredMegaItems = useMemo(() => {
    return ALL_FEATURES.filter((item) => {
      const matchesSearch =
        !megaSearchQuery.trim() ||
        item.label.toLowerCase().includes(megaSearchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(megaSearchQuery.toLowerCase()) ||
        (item.tag && item.tag.toLowerCase().includes(megaSearchQuery.toLowerCase()));

      const matchesCategory =
        activeMegaCategory === 'all' || item.category === activeMegaCategory;

      return matchesSearch && matchesCategory;
    });
  }, [megaSearchQuery, activeMegaCategory]);

  const handleFeatureClick = (pageUrl: string, sectionId: string) => {
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
      router.push(pageUrl);
    }
  };

  return (
    <>
      <header className="sticky top-3 sm:top-5 z-50 w-full max-w-[99%] 2xl:max-w-[1850px] mx-auto px-2 sm:px-6 dir-rtl">
        {/* Liquid Glass 4.0 Pro Grand Floating Capsule Deck */}
        <div className="relative rounded-3xl sm:rounded-[32px] bg-[#090707]/95 backdrop-blur-3xl border-2 border-amber-500/40 hover:border-amber-500/60 shadow-[0_16px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(245,158,11,0.18)] ring-1 ring-white/10 h-20 sm:h-22 lg:h-24 px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-3 sm:gap-6 lg:gap-10 w-full transition-all duration-300">
          
          {/* ================= 1. BRAND LOGO (Right in RTL) ================= */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link
              href="/home"
              onClick={() => coffeeSound.playBaristaClick()}
              className="flex items-center gap-3 sm:gap-3.5 group select-none"
            >
              <div className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-2xl sm:rounded-[22px] bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30 group-hover:scale-105 group-hover:shadow-amber-500/50 transition-all shrink-0 border-2 border-amber-300/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                <Coffee className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-stone-950 relative z-10 transition-transform group-hover:rotate-6" />
              </div>

              <div className="text-right">
                <div className="text-sm sm:text-base lg:text-lg font-black tracking-wide text-stone-100 whitespace-nowrap flex items-center gap-2">
                  <span>THE DIGITAL ROAST</span>
                  <span className="hidden xl:inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    AI LIVE
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-amber-400 font-extrabold tracking-wider -mt-0.5">
                  SPECIALTY COFFEE & AI
                </div>
              </div>
            </Link>
          </div>

          {/* ================= 2. CENTER DESKTOP NAVIGATION DECK ================= */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
            {primaryPages.map((page) => {
              const Icon = page.icon;
              const isActive = pathname === page.href;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  onClick={() => coffeeSound.playBaristaClick()}
                  className={`h-11 xl:h-12 px-3.5 xl:px-5 rounded-2xl text-xs xl:text-sm font-black transition-all flex items-center gap-2.5 shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                      : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900/80 border-2 border-transparent hover:border-stone-800'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span className="whitespace-nowrap">{page.label}</span>
                </Link>
              );
            })}

            {/* Mega-Menu Dropdown Button ("כל הכלים") */}
            <div className="relative shrink-0" ref={megaMenuRef}>
              <button
                onClick={() => {
                  coffeeSound.playBaristaClick();
                  setIsMegaMenuOpen(!isMegaMenuOpen);
                  if (!isMegaMenuOpen) {
                    setTimeout(() => searchInputRef.current?.focus(), 150);
                  }
                }}
                className={`h-11 xl:h-12 px-3.5 xl:px-5 rounded-2xl text-xs xl:text-sm font-black transition-all flex items-center gap-2.5 shrink-0 whitespace-nowrap border-2 cursor-pointer select-none active:scale-95 ${
                  isMegaMenuOpen
                    ? 'bg-amber-500/25 text-amber-300 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                    : 'bg-stone-900/90 text-stone-200 border-stone-800 hover:border-amber-500/50 hover:bg-amber-500/15 hover:text-amber-300 shadow-sm'
                }`}
              >
                <div className="p-1.5 rounded-xl bg-stone-950 border border-amber-500/30 text-amber-400 shrink-0 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>

                <span className="whitespace-nowrap font-black text-stone-100">
                  מרכז הכלים
                </span>

                <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px] xl:text-xs border border-amber-500/30 shrink-0">
                  {ALL_FEATURES.length}
                </span>

                <ChevronDown
                  className={`w-4 h-4 text-amber-400 transition-transform duration-300 shrink-0 ${
                    isMegaMenuOpen ? 'rotate-180 text-amber-300' : ''
                  }`}
                />
              </button>

              {/* MEGA MENU FLOATING DROPDOWN PANEL */}
              {isMegaMenuOpen && (
                <>
                  {/* Solid Backdrop Overlay */}
                  <div
                    className="fixed inset-0 bg-black/80 z-40 animate-fadeIn cursor-pointer"
                    onClick={() => setIsMegaMenuOpen(false)}
                    aria-label="סגור תפריט"
                  />

                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[95vw] max-w-[1020px] p-5 sm:p-7 rounded-3xl bg-[#0a0706] border-2 border-amber-500/80 shadow-[0_30px_100px_rgba(0,0,0,1)] ring-1 ring-amber-500/30 animate-fadeIn z-50 dir-rtl text-right space-y-4">
                    
                    {/* Top Bar: Title + Quick Search + Close Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-stone-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/30 shrink-0">
                          <Coffee className="w-5 h-5 text-stone-950" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm sm:text-base font-black text-stone-100 tracking-wide">
                              מרכז האקו-סיסטם והכלים
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-[10px]">
                              {ALL_FEATURES.length} מודולים פעילים
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            כל כלי המעבדה, ה-AI, חיישני החליטה והקלייה במקום אחד
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quick Search Input */}
                        <div className="relative w-full sm:w-72">
                          <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="חיפוש מהיר בין כל הכלים..."
                            value={megaSearchQuery}
                            onChange={(e) => setMegaSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-9 py-2.5 rounded-xl bg-[#140f0e] border border-stone-700/80 text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                          />
                          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                          {megaSearchQuery && (
                            <button
                              onClick={() => setMegaSearchQuery('')}
                              className="p-1 rounded text-stone-400 hover:text-stone-200 absolute left-2 top-1/2 -translate-y-1/2"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Close Modal Button */}
                        <button
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="p-2 rounded-xl bg-[#140f0e] border border-stone-700/80 text-stone-400 hover:text-amber-400 hover:border-amber-500/50 transition-all shrink-0"
                          title="סגור תפריט"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Category Filter Chips Bar */}
                    <div
                      ref={megaCategoryScrollRef}
                      className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
                    >
                      <button
                        onClick={() => setActiveMegaCategory('all')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                          activeMegaCategory === 'all'
                            ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/25 scale-105'
                            : 'bg-[#15100f] text-stone-300 border border-stone-800 hover:text-amber-300 hover:border-amber-500/40'
                        }`}
                      >
                        <span>הכל ({ALL_FEATURES.length})</span>
                      </button>

                      {FEATURE_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = activeMegaCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setActiveMegaCategory(cat.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                              isSelected
                                ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/25 scale-105'
                                : 'bg-[#15100f] text-stone-300 border border-stone-800 hover:text-amber-300 hover:border-amber-500/40'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{cat.shortTitle}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Scrollable Tool Cards Grid */}
                    <div className="max-h-[56vh] overflow-y-auto pr-1 pl-1 [scrollbar-width:thin] [scrollbar-color:#d97706_#100c0c] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#100c0c] [&::-webkit-scrollbar-thumb]:bg-amber-500/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-amber-500/70 space-y-3">
                      {filteredMegaItems.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-[#120d0c] border border-stone-800">
                          <p className="text-xs text-stone-300 font-bold">לא נמצאו כלים התואמים לחיפוש הנוכחי</p>
                          <button
                            onClick={() => {
                              setMegaSearchQuery('');
                              setActiveMegaCategory('all');
                            }}
                            className="mt-2 text-xs text-amber-400 underline font-bold"
                          >
                            נקה חיפוש וסינון
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {filteredMegaItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleFeatureClick(item.page, item.id)}
                                className="p-3.5 rounded-2xl bg-[#140f0e] border border-stone-800 hover:border-amber-500/70 hover:bg-[#1f1715] hover:shadow-[0_6px_20px_rgba(245,158,11,0.15)] hover:-translate-y-0.5 text-right transition-all duration-200 flex items-start gap-3 group"
                              >
                                <div className="p-2.5 rounded-xl bg-[#1d1614] border border-stone-700/80 text-amber-400 group-hover:scale-110 group-hover:border-amber-500 group-hover:text-amber-300 transition-all shrink-0 mt-0.5 shadow-sm">
                                  <Icon className="w-4 h-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className="text-xs font-bold text-stone-100 group-hover:text-amber-300 truncate transition-colors">
                                      {item.label}
                                    </span>
                                    {item.tag && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#251b18] text-amber-300 font-mono font-bold border border-amber-500/25 shrink-0">
                                        {item.tag}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-stone-400 group-hover:text-stone-300 line-clamp-2 mt-1 leading-snug font-normal transition-colors">
                                    {item.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Mega Menu Footer */}
                    <div className="pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>קיצור דרך מקלדת: <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-300">Ctrl + K</kbd></span>
                      </span>
                      <span className="text-amber-400 font-bold">The Digital Roast Ecosystem</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* ================= 3. RIGHT ACTION CONTROLS CLUSTER ================= */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Audio Sound FX Toggle with Animated Sound Bars */}
            <button
              onClick={handleToggleMute}
              className={`h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 rounded-2xl border-2 transition-all flex items-center justify-center shrink-0 ${
                isMuted
                  ? 'bg-stone-900/80 border-stone-800 text-stone-500 hover:text-stone-300'
                  : 'bg-amber-950/80 border-amber-500/60 text-amber-400 shadow-md shadow-amber-500/20'
              }`}
              title={isMuted ? 'הפעל צלילי ממשק' : 'השתק צלילים'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <div className="flex items-end justify-center gap-0.5 h-5 w-5">
                  <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3"></span>
                  <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-5"></span>
                  <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.75s_ease-in-out_infinite] h-4"></span>
                </div>
              )}
            </button>

            {/* Global Voice Search & Navigation Trigger */}
            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                useVoiceAssistantStore.getState().openSearchModal();
              }}
              className="h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 rounded-2xl bg-stone-900/90 hover:bg-amber-500/20 border-2 border-stone-800 hover:border-amber-500/50 text-amber-400 hover:text-amber-300 flex items-center justify-center transition-all active:scale-95 shrink-0 shadow-lg"
              title="חיפוש קולי וניווט מהיר (Ctrl+K / Alt+V)"
            >
              <Mic className="w-5 h-5 sm:w-5.5 sm:h-5.5 animate-pulse" />
            </button>

            {/* AI Barista Hero Button */}
            <button
              onClick={() => {
                coffeeSound.playCoffeeSteam();
                onOpenBarista?.();
              }}
              className="h-11 sm:h-12 lg:h-13 px-3.5 sm:px-5 lg:px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:brightness-110 text-stone-950 font-black text-xs sm:text-sm lg:text-base transition-all flex items-center gap-2 sm:gap-2.5 shadow-xl shadow-amber-500/30 active:scale-95 shrink-0 whitespace-nowrap"
              title="פתח את בריסטה הבינה המלאכותית"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950 animate-spin-slow" />
              <span className="hidden xs:inline">בריסטה AI</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                toggleCart();
              }}
              className="relative h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 rounded-2xl bg-stone-900/90 hover:bg-amber-500/20 border-2 border-stone-800 hover:border-amber-500/50 text-stone-300 hover:text-amber-300 flex items-center justify-center transition-all active:scale-95 shrink-0"
              title="עגלת קניות"
            >
              <ShoppingBag className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 sm:h-5.5 sm:w-5.5 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] sm:text-xs flex items-center justify-center shadow-md border-2 border-stone-950 animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* VIP User Profile Capsule */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 sm:gap-2.5 bg-stone-900/90 border-2 border-stone-800 hover:border-amber-500/40 rounded-2xl px-2.5 sm:px-3.5 h-11 sm:h-12 lg:h-13 transition-all shrink-0">
                <Link
                  href="/profile"
                  onClick={() => coffeeSound.playBaristaClick()}
                  className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
                  title="לאונג' הפרופיל וה-VIP שלי"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500 text-stone-950 font-extrabold text-xs flex items-center justify-center overflow-hidden shrink-0 border border-amber-500/50">
                    {user.image && !user.image.includes('photo-1534528741775') ? (
                      <img src={user.image} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <img src="/idan-profile-circle.png" alt={user.fullName} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <span className="hidden 2xl:inline text-xs sm:text-sm font-bold text-stone-200 truncate max-w-[95px]">
                    {user.fullName}
                  </span>
                </Link>

                <button
                  onClick={() => {
                    coffeeSound.playBaristaClick();
                    logout();
                  }}
                  className="p-1 rounded-md text-stone-500 hover:text-rose-400 transition-colors border-r border-stone-800 pr-1.5 mr-0.5"
                  title="התנתק"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  coffeeSound.playBaristaClick();
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:flex h-11 sm:h-12 lg:h-13 px-4 sm:px-5 rounded-2xl bg-stone-900/90 border-2 border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-500/40 text-xs sm:text-sm font-black transition-all items-center gap-2 shrink-0"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>התחברות</span>
              </button>
            )}

            {/* Mobile Hamburger Trigger (Visible on < lg) */}
            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="lg:hidden h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-stone-900 border-2 border-stone-800 text-stone-300 hover:text-amber-400 hover:border-amber-500/40 flex items-center justify-center transition-all active:scale-95 shrink-0"
              aria-label="פתח תפריט ניווט"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </header>

      {/* Auth Modal Portal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Mobile Slide-over Drawer Portal */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        primaryPages={primaryPages}
        allFeatures={ALL_FEATURES}
        categories={FEATURE_CATEGORIES}
        pathname={pathname}
        onOpenBarista={onOpenBarista}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    </>
  );
};
