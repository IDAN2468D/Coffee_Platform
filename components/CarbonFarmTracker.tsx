'use client';

import React, { useState } from 'react';
import {
  Leaf,
  Globe2,
  TreePine,
  Droplets,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronLeft,
  Info,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Share2,
  Download,
  Flame,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface FarmData {
  id: string;
  name: string;
  hebrewName: string;
  region: string;
  country: string;
  flag: string;
  altitudeMeters: number;
  shadeTreeSpecies: string[];
  co2OffsetKgPerBag: number;
  directTradePremiumPct: number; // % above C-market
  waterRecycledLitersPerKg: number;
  biodiversityScore: number; // 0-100
  carbonStatus: 'NET_ZERO' | 'CARBON_NEGATIVE';
  farmerName: string;
  imageUrl: string;
  certifications: string[];
}

const FARMS: FarmData[] = [
  {
    id: 'yirgacheffe-idido',
    name: 'Idido Cooperative - Yirgacheffe',
    hebrewName: 'קואופרטיב אידידו - ירגשף',
    region: 'Gedeo Zone, Yirgacheffe',
    country: 'אתיופיה',
    flag: '🇪🇹',
    altitudeMeters: 2150,
    shadeTreeSpecies: ['עצי קורדיה אפריקאית', 'עצי אלביציה ילידיים', 'עצי אנסטה (בננה אתיופית)'],
    co2OffsetKgPerBag: 2.8,
    directTradePremiumPct: 165,
    waterRecycledLitersPerKg: 48,
    biodiversityScore: 98,
    carbonStatus: 'CARBON_NEGATIVE',
    farmerName: 'טדסה מנבר ותחנת אידידו',
    imageUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=800&auto=format&fit=crop&q=80',
    certifications: ['Direct Trade 100%', 'Rainforest Alliance', 'Shade-Grown Bird Friendly', 'Organic Bio-Dynamic'],
  },
  {
    id: 'huila-finca-el-paraiso',
    name: 'Finca El Paraiso - Huila',
    hebrewName: 'פינקה אל פראיסו - ווילה',
    region: 'Huila Micro-Basin',
    country: 'קולומביה',
    flag: '🇨🇴',
    altitudeMeters: 1950,
    shadeTreeSpecies: ['עצי אגוז קולומביאני', 'גואמו (Guamo)', 'עצי ארז ההרים'],
    co2OffsetKgPerBag: 2.4,
    directTradePremiumPct: 140,
    waterRecycledLitersPerKg: 52,
    biodiversityScore: 94,
    carbonStatus: 'NET_ZERO',
    farmerName: 'דייגו סמואל ברמודז',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    certifications: ['Eco-Wash Bio Reactor', 'Direct Farm Gate', 'Carbon Neutral Certified'],
  },
  {
    id: 'antigua-finca-medina',
    name: 'Finca Medina - Antigua Valley',
    hebrewName: 'פינקה מדינה - עמק אנטיגואה',
    region: 'Volcano Fuego Valley',
    country: 'גואטמלה',
    flag: '🇬🇹',
    altitudeMeters: 1700,
    shadeTreeSpecies: ['עצי גראביליה ירוקי-עד', 'עצי אינגה מצלים'],
    co2OffsetKgPerBag: 2.2,
    directTradePremiumPct: 135,
    waterRecycledLitersPerKg: 42,
    biodiversityScore: 91,
    carbonStatus: 'NET_ZERO',
    farmerName: 'משפחת פרננדז וצוות מדינה',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80',
    certifications: ['Volcanic Soil Protected', 'Zero Waste Milling', 'UTZ Certified'],
  },
  {
    id: 'boquete-geisha-estate',
    name: 'Boquete Valley Geisha Estate',
    hebrewName: 'חוות גיישה עמק בוקטה',
    region: 'Chiriqui Highlands',
    country: 'פנמה',
    flag: '🇵🇦',
    altitudeMeters: 2000,
    shadeTreeSpecies: ['יער עננים ילידי', 'עצי אלון פנמי', 'שרכים עתיקים'],
    co2OffsetKgPerBag: 3.1,
    directTradePremiumPct: 220,
    waterRecycledLitersPerKg: 60,
    biodiversityScore: 99,
    carbonStatus: 'CARBON_NEGATIVE',
    farmerName: 'רוברטו פיטרסון',
    imageUrl: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=800&auto=format&fit=crop&q=80',
    certifications: ['Cloud Forest Biosphere', 'Single Terroir Direct', 'Micro-Lot Sustainable'],
  },
];

export function CarbonFarmTracker() {
  const [selectedFarmId, setSelectedFarmId] = useState<string>(FARMS[0].id);
  const [monthlyBags, setMonthlyBags] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<'tracker' | 'scorecard' | 'lifecycle'>('tracker');

  const selectedFarm = FARMS.find((f) => f.id === selectedFarmId) || FARMS[0];

  // Calculations based on user consumption
  const netCo2OffsetAnnualKg = Number((monthlyBags * 12 * selectedFarm.co2OffsetKgPerBag).toFixed(1));
  const waterSavedAnnualLiters = Math.round(monthlyBags * 12 * selectedFarm.waterRecycledLitersPerKg * 0.25);
  const treesSupported = Number(((netCo2OffsetAnnualKg / 22) * 1.5).toFixed(1)); // 1 tree offsets ~22kg CO2/year

  const handleSelectFarm = (farm: FarmData) => {
    setSelectedFarmId(farm.id);
    coffeeSound.playBaristaClick();
  };

  return (
    <div dir="rtl" className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#06150e] via-[#091a13] to-[#040907] border border-emerald-500/30 p-6 sm:p-10 overflow-hidden shadow-[0_20px_60px_rgba(16,185,129,0.15)]">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono tracking-wide">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>AI CARBON-NEUTRAL & DIRECT TRADE SCORECARD</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              מעקב חוות אפס-פחמן & מדדי קיימות ישירה
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              ניטור שקוף ומאומת של שרשרת האספקה: מגידול בצל יערות ילידיים, תשלום הוגן מעל מדד הבורסה (+140%), ועד מיחזור מים בתחנות שטיפה ואריזות 100% מתכלות.
            </p>
          </div>

          {/* Quick Net Zero Badge Card */}
          <div className="shrink-0 p-5 rounded-2xl bg-black/50 border border-emerald-500/40 backdrop-blur-xl flex flex-col items-center justify-center text-center min-w-[200px]">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-2 shadow-lg shadow-emerald-500/20">
              <Globe2 className="w-8 h-8 animate-spin-slow" />
            </div>
            <div className="text-2xl font-black text-white font-mono">0.0 kg CO₂</div>
            <div className="text-xs text-emerald-400 font-bold tracking-wider mt-0.5">
              NET ZERO GUARANTEED
            </div>
            <div className="text-[10px] text-stone-400 mt-1">מאומת בטכנולוגיית IoT & Terroir</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 border-t border-emerald-500/20 pt-5 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('tracker');
              coffeeSound.playBaristaClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tracker'
                ? 'bg-emerald-500 text-stone-950 shadow-lg shadow-emerald-500/30'
                : 'bg-stone-900/80 text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            <TreePine className="w-4 h-4" />
            מחשבון קיזוז והשפעה אישית
          </button>

          <button
            onClick={() => {
              setActiveTab('scorecard');
              coffeeSound.playBaristaClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'scorecard'
                ? 'bg-emerald-500 text-stone-950 shadow-lg shadow-emerald-500/30'
                : 'bg-stone-900/80 text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            תעודת Direct Trade ומדדי חווה
          </button>

          <button
            onClick={() => {
              setActiveTab('lifecycle');
              coffeeSound.playBaristaClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'lifecycle'
                ? 'bg-emerald-500 text-stone-950 shadow-lg shadow-emerald-500/30'
                : 'bg-stone-900/80 text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            מחזור חיי הפול (Farm-to-Cup Lifecycle)
          </button>
        </div>
      </div>

      {/* Farm Selection Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            בחר חוות מקור לבחינת טביעת הרגל ומדדי הקיימות:
          </h3>
          <span className="text-xs text-stone-400 font-mono">4 חוות מאומתות בזמן אמת</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FARMS.map((farm) => {
            const isSelected = farm.id === selectedFarmId;
            return (
              <button
                key={farm.id}
                onClick={() => handleSelectFarm(farm)}
                className={`p-4 rounded-2xl text-right transition-all border flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                    : 'bg-stone-950/60 border-stone-800/80 hover:border-emerald-500/40 hover:bg-stone-900/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{farm.flag}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-extrabold ${
                      farm.carbonStatus === 'CARBON_NEGATIVE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    }`}
                  >
                    {farm.carbonStatus === 'CARBON_NEGATIVE' ? 'שלילי פחמן 🌱' : 'נטו אפס ⚡'}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-white text-sm">{farm.hebrewName}</div>
                  <div className="text-xs text-stone-400 font-mono mt-0.5">{farm.region}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-800/60 font-mono">
                  <span className="text-stone-400">גובה: {farm.altitudeMeters}m</span>
                  <span className="text-emerald-400 font-bold">+{farm.directTradePremiumPct}% פרמיה</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      {activeTab === 'tracker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main Calculator - 7 Cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090707]/90 border border-emerald-500/30 backdrop-blur-2xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <TreePine className="w-5 h-5 text-emerald-400" />
                    מחשבון השפעת הצריכה האישית
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    חשב כמה פחמן דו-חמצני אתה מקזז וכמה עצי יער צל נתמכים בזכות ההזמנות שלך
                  </p>
                </div>
              </div>

              {/* Slider for monthly bags */}
              <div className="space-y-3 bg-stone-950/60 p-5 rounded-2xl border border-stone-800">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-stone-300">כמות שקיות קפה (250g) שאתה שותה בחודש:</span>
                  <span className="text-emerald-400 font-mono font-black text-lg bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                    {monthlyBags} שקיות / חודש
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={monthlyBags}
                  onChange={(e) => setMonthlyBags(Number(e.target.value))}
                  className="w-full h-2.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                  <span>1 שקית (שותה יחיד)</span>
                  <span>4 שקיות (משפחה/זוג)</span>
                  <span>12 שקיות (משרד בוטיק)</span>
                </div>
              </div>

              {/* Annual Impact Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-emerald-400">
                    <Leaf className="w-5 h-5" />
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">
                      קיזוז נטו
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white font-mono">{netCo2OffsetAnnualKg} kg</div>
                    <div className="text-xs text-stone-300 font-medium">CO₂ קוזז בשנה</div>
                  </div>
                  <div className="text-[10px] text-emerald-400/80">שווה ערך לנסיעת 180 ק"מ ברכב חשמלי</div>
                </div>

                <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-teal-400">
                    <Droplets className="w-5 h-5" />
                    <span className="text-[10px] font-mono font-bold bg-teal-500/20 px-2 py-0.5 rounded-full">
                      חיסכון במים
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white font-mono">{waterSavedAnnualLiters} L</div>
                    <div className="text-xs text-stone-300 font-medium">מים ממוחזרים בחווה</div>
                  </div>
                  <div className="text-[10px] text-teal-400/80">מיחזור ביו-ראקטור אקולוגי</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-amber-400">
                    <TreePine className="w-5 h-5" />
                    <span className="text-[10px] font-mono font-bold bg-amber-500/20 px-2 py-0.5 rounded-full">
                      שיקום יער
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white font-mono">{treesSupported}</div>
                    <div className="text-xs text-stone-300 font-medium">עצי צל מוגנים ומטופחים</div>
                  </div>
                  <div className="text-[10px] text-amber-400/80">תמיכה במגוון ביולוגי וציפורים</div>
                </div>
              </div>

              {/* Shade Tree Species In Farm */}
              <div className="space-y-3 bg-stone-950/40 p-4 rounded-2xl border border-stone-800">
                <div className="text-xs font-bold text-stone-300 flex items-center gap-2">
                  <TreePine className="w-4 h-4 text-emerald-400" />
                  עצי צל ילידיים בחוות {selectedFarm.hebrewName}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedFarm.shadeTreeSpecies.map((species, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-stone-900 border border-stone-700 text-xs text-emerald-300 font-medium flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {species}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right / Farm Spotlight Card - 5 Cols */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#090707]/90 border border-emerald-500/30 backdrop-blur-2xl space-y-5 shadow-xl relative overflow-hidden">
              <div className="h-44 rounded-2xl overflow-hidden relative">
                <img
                  src={selectedFarm.imageUrl}
                  alt={selectedFarm.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white">
                  <div>
                    <div className="text-sm font-black">{selectedFarm.hebrewName}</div>
                    <div className="text-[11px] text-stone-300">{selectedFarm.country} • {selectedFarm.region}</div>
                  </div>
                  <span className="text-3xl">{selectedFarm.flag}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-stone-800">
                  <span className="text-stone-400">חקלאי מוביל ומנהל תחנה:</span>
                  <span className="text-white font-bold">{selectedFarm.farmerName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-800">
                  <span className="text-stone-400">גובה גידול טרואר:</span>
                  <span className="text-emerald-400 font-mono font-bold">{selectedFarm.altitudeMeters} מטרים</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-800">
                  <span className="text-stone-400">פרמיית סחר ישיר (Direct Trade):</span>
                  <span className="text-amber-400 font-mono font-bold">+{selectedFarm.directTradePremiumPct}% מעל מחיר הבורסה</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-800">
                  <span className="text-stone-400">ציון מגוון ביולוגי (Biodiversity):</span>
                  <span className="text-emerald-400 font-mono font-bold">{selectedFarm.biodiversityScore} / 100</span>
                </div>
              </div>

              {/* Certifications List */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-stone-400">הסמכות ותקני קיימות בינלאומיים:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFarm.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold"
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  coffeeSound.playSuccessChime();
                  coffeeSound.speakHebrew(`הורדת תעודת קיימות עבור חוות ${selectedFarm.hebrewName}`);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all"
              >
                <Download className="w-4 h-4" />
                הורד תעודת אימות פחמני (SCA Sustainability Certificate)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scorecard Tab */}
      {activeTab === 'scorecard' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090707]/90 border border-emerald-500/30 backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                לוח מדדי שקיפות וסחר ישיר (Direct Trade Scorecard)
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                השוואה מלאה של כל החוות השותפות מול מדדי הבורסה והמחיר העולמי
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 font-mono">
                  <th className="py-3 px-4">חוות מקור</th>
                  <th className="py-3 px-4">ארץ</th>
                  <th className="py-3 px-4">פרמיה מעל הבורסה</th>
                  <th className="py-3 px-4">מיחזור מים (L/kg)</th>
                  <th className="py-3 px-4">קיזוז פחמן לשקית</th>
                  <th className="py-3 px-4">ציון מגוון ביולוגי</th>
                  <th className="py-3 px-4">סטטוס פחמני</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-medium">
                {FARMS.map((f) => (
                  <tr
                    key={f.id}
                    className={`hover:bg-emerald-950/20 transition-colors ${
                      f.id === selectedFarmId ? 'bg-emerald-950/30 text-emerald-200' : 'text-stone-300'
                    }`}
                  >
                    <td className="py-4 px-4 font-bold flex items-center gap-2 text-white">
                      <span>{f.flag}</span>
                      <span>{f.hebrewName}</span>
                    </td>
                    <td className="py-4 px-4 font-mono">{f.country}</td>
                    <td className="py-4 px-4 font-mono text-amber-400 font-bold">+{f.directTradePremiumPct}%</td>
                    <td className="py-4 px-4 font-mono text-teal-300">{f.waterRecycledLitersPerKg} L</td>
                    <td className="py-4 px-4 font-mono text-emerald-300">{f.co2OffsetKgPerBag} kg</td>
                    <td className="py-4 px-4 font-mono">{f.biodiversityScore} / 100</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {f.carbonStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lifecycle Tab */}
      {activeTab === 'lifecycle' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090707]/90 border border-emerald-500/30 backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                מחזור חיי הפול (Net Zero Supply Chain Pipeline)
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                כיצד נשמרת טביעת רגל פחמנית אפסית (0.0kg CO2) בכל אחד מ-5 השלבים
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '1',
                title: 'גידול אורגני בצל',
                desc: 'ספיגת פחמן אקטיבית על ידי עצי יער ילידיים (3.2kg CO2 נספגים לכל ק"ג קפה).',
                co2: '-3.2 kg CO₂',
                icon: TreePine,
              },
              {
                step: '2',
                title: 'עיבוד רטוב אקולוגי',
                desc: 'מיחזור 95% ממי השטיפה באמצעות ביו-ריאקטורים טבעיים וקומפוסטציה.',
                co2: '-0.4 kg CO₂',
                icon: Droplets,
              },
              {
                step: '3',
                title: 'קלייה ירוקה בחשמל סולארי',
                desc: 'מכונות קלייה חשמליות מתקדמות עם לכידת עשן ו-100% אנרגיה סולארית.',
                co2: '0.0 kg CO₂',
                icon: Flame,
              },
              {
                step: '4',
                title: 'אריזה מתכלה 100%',
                desc: 'שקיות קפה מסיבי תירס ונייר ממוחזר ללא שאריות פלסטיק ואלומיניום.',
                co2: '-0.2 kg CO₂',
                icon: Leaf,
              },
              {
                step: '5',
                title: 'שליחות עירונית חשמלית',
                desc: 'הפצה באמצעות רכבים חשמליים ואופניים חשמליים ברחבי הארץ.',
                co2: '0.0 kg CO₂',
                icon: Globe2,
              },
            ].map((st, i) => {
              const IconComp = st.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-stone-950/60 border border-emerald-500/20 flex flex-col justify-between space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-black text-xs flex items-center justify-center">
                      {st.step}
                    </span>
                    <IconComp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{st.title}</div>
                    <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">{st.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-stone-800 text-[11px] font-mono font-bold text-emerald-400">
                    מאזן: {st.co2}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CarbonFarmTracker;
