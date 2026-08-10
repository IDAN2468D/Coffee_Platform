'use client';

import React, { useState } from 'react';
import {
  Brain,
  Zap,
  Moon,
  Shield,
  Sparkles,
  Flame,
  CheckCircle2,
  Plus,
  Coffee,
  Activity,
  Sliders,
  Award,
  ChevronLeft,
  Info,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export interface NootropicIngredient {
  id: string;
  name: string;
  hebrewName: string;
  category: 'FOCUS' | 'STAMINA' | 'STRESS_RELIEF' | 'IMMUNITY';
  scientificName: string;
  activeBioactives: string;
  doseMg: number;
  description: string;
  benefits: string[];
  recommendedRoast: string;
  flavorProfile: string;
  colorTheme: string;
  icon: any;
  priceDelta: number;
}

const NOOTROPICS: NootropicIngredient[] = [
  {
    id: 'lions-mane',
    name: "Lion's Mane (Hericium erinaceus)",
    hebrewName: "רעמת האריה (Lion's Mane)",
    category: 'FOCUS',
    scientificName: 'Hericium erinaceus 10:1 Extract',
    activeBioactives: 'Hericenones & Erinacines (NGF Boost)',
    doseMg: 500,
    description: 'ממריץ את פקטור הגדילה העצבי (NGF), משפר זיכרון עבודה, חדות מחשבתית וצלילות נוירולוגית.',
    benefits: ['זיכרון עבודה מוגבר', 'חדות פוקוס ממושכת ללא נפילות', 'חידוש סינפסות עצביות'],
    recommendedRoast: 'קלייה בהירה Light City (ירגשף/פנמה)',
    flavorProfile: 'אגוזי עדין, תווים קלים של פטריות יער וקקאו',
    colorTheme: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300',
    icon: Brain,
    priceDelta: 8,
  },
  {
    id: 'cordyceps',
    name: 'Cordyceps Militaris',
    hebrewName: 'קורדיספס מיליטריס (Cordyceps)',
    category: 'STAMINA',
    scientificName: 'Cordyceps Militaris Beta-Glucans',
    activeBioactives: 'Cordycepin & Adenosine (ATP Boost)',
    doseMg: 600,
    description: 'משפר את ניצול החמצן התאי (VO2 Max) וממריץ ייצור אנרגיית ATP לביצועים גופניים וערנות שיא.',
    benefits: ['הגברת סיבולת ו-ATP תאי', 'שיפור זרימת חמצן למוח', 'אנרגיה יציבה ללא דפיקות לב'],
    recommendedRoast: 'קלייה בינונית Medium Roast (קולומביה/גואטמלה)',
    flavorProfile: 'אדמתי עשיר, תווי מאלט ותבלינים חמים',
    colorTheme: 'from-red-500/20 to-orange-500/10 border-red-500/40 text-red-300',
    icon: Zap,
    priceDelta: 9,
  },
  {
    id: 'reishi',
    name: 'Red Reishi (Ganoderma lucidum)',
    hebrewName: 'ריישי אדום (Red Reishi)',
    category: 'STRESS_RELIEF',
    scientificName: 'Ganoderma lucidum Triterpenes',
    activeBioactives: 'Ganoderic Acids & Polysaccharides',
    doseMg: 450,
    description: 'מכונה "פטריית האלמוות". מווסת רמות קורטיזול, מפחית חרדה ומונע את תופעת ה-Jitters מקפאין.',
    benefits: ['ויסות קורטיזול וסטרס', 'הרגעה נוירולוגית ומניעת עוררות יתר', 'שיפור איכות שנת הלילה'],
    recommendedRoast: 'קלייה כהה Dark Roast / נטול קפאין שוויצרי',
    flavorProfile: 'מרירות קקאו אלגנטית, עץ אלון ווניל',
    colorTheme: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-300',
    icon: Moon,
    priceDelta: 8,
  },
  {
    id: 'chaga-theanine',
    name: 'Chaga & L-Theanine Elixir',
    hebrewName: 'צ׳אגה & אל-תיאנין (Chaga + L-Theanine)',
    category: 'IMMUNITY',
    scientificName: 'Inonotus obliquus + Green Tea Theanine',
    activeBioactives: 'Betulinic Acid, Melanin & 150mg L-Theanine',
    doseMg: 400,
    description: 'נוגדי חמצון בריכוז על עם גלי אלפא מוחיים לרגיעה ממוקדת ומערכת חיסון חזקה.',
    benefits: ['נוגדי חמצון ORAC הגבוהים בטבע', 'השראת גלי אלפא (Zen Focus)', 'איזון רדיקלים חופשיים'],
    recommendedRoast: 'קליית אספרסו חצות Midnight Espresso',
    flavorProfile: 'שוקולד מריר, וניל טבעי ותה ירוק עדין',
    colorTheme: 'from-teal-500/20 to-emerald-500/10 border-teal-500/40 text-teal-300',
    icon: Shield,
    priceDelta: 7,
  },
];

export function NootropicWellnessMatcher() {
  const [selectedNootropicId, setSelectedNootropicId] = useState<string>(NOOTROPICS[0].id);
  const [fatigueLevel, setFatigueLevel] = useState<number>(4); // 1-10
  const [mentalLoad, setMentalLoad] = useState<number>(8); // 1-10
  const [targetGoal, setTargetGoal] = useState<'deep-work' | 'workout' | 'stress-calm' | 'immunity'>('deep-work');
  const [shotsCount, setShotsCount] = useState<number>(2);
  const [milkOption, setMilkOption] = useState<string>('חלב שיבולת שועל אורגני');
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const activeNootropic = NOOTROPICS.find((n) => n.id === selectedNootropicId) || NOOTROPICS[0];

  const baseCoffeePrice = 24;
  const totalPrice = baseCoffeePrice + activeNootropic.priceDelta;

  const handleGoalChange = (goal: typeof targetGoal) => {
    setTargetGoal(goal);
    if (goal === 'deep-work') setSelectedNootropicId('lions-mane');
    else if (goal === 'workout') setSelectedNootropicId('cordyceps');
    else if (goal === 'stress-calm') setSelectedNootropicId('reishi');
    else if (goal === 'immunity') setSelectedNootropicId('chaga-theanine');
    coffeeSound.playBaristaClick();
  };

  const handleAddToCart = () => {
    coffeeSound.playSuccessChime();
    addItem({
      coffeeItemId: `nootropic-${activeNootropic.id}`,
      name: `Specialty Espresso + ${activeNootropic.name}`,
      hebrewName: `אספרסו בוטיק מועשר ב-${activeNootropic.hebrewName}`,
      price: totalPrice,
      shots: shotsCount,
      milkType: milkOption,
      imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80',
    });

    setIsAdded(true);
    coffeeSound.speakHebrew(`התווסף לעגלה: אספרסו מועשר ב${activeNootropic.hebrewName}`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div dir="rtl" className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#12080a] via-[#1a0f12] to-[#0a0506] border border-amber-500/30 p-6 sm:p-10 overflow-hidden shadow-[0_20px_60px_rgba(245,158,11,0.15)]">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono tracking-wide">
              <Brain className="w-4 h-4 text-amber-400" />
              <span>ADAPTOGEN & FUNCTIONAL NOOTROPIC WELLNESS MATCHER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              התאמת פטריות נואוטרופיות ואדפטוגנים לאספרסו
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              שילוב מדעי של מיצויי פטריות מרפא אדפטוגניות בריכוז 10:1 (Lion's Mane, Cordyceps, Reishi, Chaga) עם קליית בוטיק טרייה לשיפור קוגניטיבי, סיבולת תאית ומניעת שחיקת סטרס.
            </p>
          </div>

          {/* Bio Score Radar Badge */}
          <div className="shrink-0 p-5 rounded-2xl bg-black/50 border border-amber-500/40 backdrop-blur-xl flex flex-col items-center justify-center text-center min-w-[210px]">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-2 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{activeNootropic.doseMg} mg</div>
            <div className="text-xs text-amber-400 font-bold tracking-wider mt-0.5">
              מינון פעיל בכוס
            </div>
            <div className="text-[10px] text-stone-400 mt-1">תמצית סטנדרטית 100% טבעית</div>
          </div>
        </div>

        {/* Goal Quick Switcher Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-8 border-t border-amber-500/20 pt-5">
          <button
            onClick={() => handleGoalChange('deep-work')}
            className={`p-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
              targetGoal === 'deep-work'
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/30'
                : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4 shrink-0" />
            <span>פוקוס עמוק & זיכרון</span>
          </button>

          <button
            onClick={() => handleGoalChange('workout')}
            className={`p-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
              targetGoal === 'workout'
                ? 'bg-red-500 text-stone-950 border-red-400 shadow-lg shadow-red-500/30'
                : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span>סיבולת ואימון (ATP)</span>
          </button>

          <button
            onClick={() => handleGoalChange('stress-calm')}
            className={`p-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
              targetGoal === 'stress-calm'
                ? 'bg-purple-500 text-stone-950 border-purple-400 shadow-lg shadow-purple-500/30'
                : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4 shrink-0" />
            <span>איזון סטרס וקורטיזול</span>
          </button>

          <button
            onClick={() => handleGoalChange('immunity')}
            className={`p-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
              targetGoal === 'immunity'
                ? 'bg-teal-500 text-stone-950 border-teal-400 shadow-lg shadow-teal-500/30'
                : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>חיסון & נוגדי חמצון</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bio-Sliders & Nootropic Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Nootropics Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NOOTROPICS.map((noot) => {
              const IconComp = noot.icon;
              const isSelected = noot.id === selectedNootropicId;
              return (
                <button
                  key={noot.id}
                  onClick={() => {
                    setSelectedNootropicId(noot.id);
                    coffeeSound.playBaristaClick();
                  }}
                  className={`p-4 rounded-2xl text-right transition-all border flex flex-col justify-between space-y-3 relative overflow-hidden ${
                    isSelected
                      ? `bg-gradient-to-br ${noot.colorTheme} shadow-lg shadow-black/40 ring-1 ring-amber-400/50`
                      : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-900/40 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-stone-700 flex items-center justify-center text-amber-400">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                      +{noot.priceDelta} ₪
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-white text-sm">{noot.hebrewName}</div>
                    <div className="text-[11px] text-stone-400 font-mono mt-0.5">{noot.activeBioactives}</div>
                  </div>

                  <div className="text-[10px] text-stone-400 font-medium pt-2 border-t border-stone-800/60 line-clamp-2">
                    {noot.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Biological Sliders */}
          <div className="p-6 rounded-3xl bg-[#0a0708]/90 border border-amber-500/30 backdrop-blur-2xl space-y-5 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              כיול ביולוגי מותאם אישית (Bio-State Diagnostics)
            </h3>

            {/* Fatigue Level Slider */}
            <div className="space-y-2 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-300">רמת עייפות פיזית / מחסור בשינה:</span>
                <span className="text-amber-400 font-mono font-bold">{fatigueLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={fatigueLevel}
                onChange={(e) => setFatigueLevel(Number(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Mental Load Slider */}
            <div className="space-y-2 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-300">עומס מנטלי ומשימות פוקוס נדרשות:</span>
                <span className="text-cyan-400 font-mono font-bold">{mentalLoad} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={mentalLoad}
                onChange={(e) => setMentalLoad(Number(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Dose & Milk customization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300 block">מנות אספרסו בסיס:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((s) => (
                    <button
                      key={s}
                      onClick={() => setShotsCount(s)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        shotsCount === s
                          ? 'bg-amber-500 text-stone-950 border-amber-400'
                          : 'bg-stone-900 text-stone-300 border-stone-800'
                      }`}
                    >
                      {s === 1 ? 'סינגל (1)' : s === 2 ? 'דאבל (2)' : 'טריפל (3)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300 block">סוג חלב / תחליף פרימיום:</label>
                <select
                  value={milkOption}
                  onChange={(e) => setMilkOption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white font-medium focus:outline-none focus:border-amber-400"
                >
                  <option value="חלב שיבולת שועל אורגני">חלב שיבולת שועל אורגני (קטיפתי)</option>
                  <option value="חלב שקדים ללא סוכר">חלב שקדים ללא סוכר (דל גליקמי)</option>
                  <option value="חלב קוקוס עשיר ב-MCT">חלב קוקוס עשיר ב-MCT (קטו)</option>
                  <option value="ללא חלב (אספרסו טהור / אמריקנו)">ללא חלב (אספרסו טהור)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Nootropic Details & Add to Cart (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0a0708]/90 border border-amber-500/30 backdrop-blur-2xl space-y-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl">
                  🍄
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{activeNootropic.hebrewName}</h3>
                  <div className="text-xs text-stone-400 font-mono">{activeNootropic.scientificName}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-stone-300">יתרונות קוגניטיביים ופיזיולוגיים מאומתים:</div>
              <div className="space-y-2">
                {activeNootropic.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 text-xs text-stone-200 flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
              <div className="flex justify-between py-1 border-b border-stone-800/60">
                <span className="text-stone-400">חומרים פעילים:</span>
                <span className="text-amber-400 font-mono font-bold">{activeNootropic.activeBioactives}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800/60">
                <span className="text-stone-400">קלייה מומלצת:</span>
                <span className="text-white font-medium">{activeNootropic.recommendedRoast}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-400">פרופיל טעם סינרגטי:</span>
                <span className="text-stone-300">{activeNootropic.flavorProfile}</span>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="pt-3 border-t border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-stone-400">מחיר מנה משולבת:</div>
                  <div className="text-2xl font-black text-white font-mono">{totalPrice} ₪</div>
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-emerald-400 font-mono font-bold">מיצוי 10:1 נטול טעמי לוואי</div>
                  <div className="text-[11px] text-stone-400">{shotsCount} שוטים • {milkOption.split(' ')[0]}</div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-stone-950" />
                    <span>נוסף לעגלת ההזמנה בהצלחה!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-stone-950" />
                    <span>הזמן אספרסו מועשר בנואוטרופיקה ({totalPrice} ₪)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NootropicWellnessMatcher;
