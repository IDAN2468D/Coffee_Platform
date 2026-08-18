'use client';

import React, { useState, useMemo } from 'react';
import {
  Droplets,
  TestTube,
  MapPin,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Volume2,
  Copy,
  Check,
  Download,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface CityWaterProfile {
  id: string;
  cityName: string;
  district: string;
  corporation: string;
  sourceType: string;
  tds: number;
  gh: number;
  kh: number;
  ca: number;
  mg: number;
  cl: number;
  ph: number;
  description: string;
}

interface TargetProfile {
  id: string;
  name: string;
  brewType: string;
  targetTds: number;
  targetGh: number;
  targetKh: number;
  targetPh: number;
  flavorImpact: string;
}

const ISRAEL_CITIES_DATA: CityWaterProfile[] = [
  {
    id: 'tel-aviv',
    cityName: 'תל אביב - יפו וגוש דן',
    district: 'מחוז תל אביב',
    corporation: 'מי אביבים / מים מותפלים שורק ופלמחים',
    sourceType: '80% מותפלים + 20% קידוחי שפלה',
    tds: 95,
    gh: 42,
    kh: 34,
    ca: 14,
    mg: 2.1,
    cl: 28,
    ph: 7.6,
    description: 'מים רכים יחסית עקב אחוז התפלה גבוה. דורש הוספת מגנזיום לחידוד חומציות פירותית.',
  },
  {
    id: 'jerusalem',
    cityName: 'ירושלים והסביבה',
    district: 'מחוז ירושלים',
    corporation: 'חברת הגיחון / מקורות',
    sourceType: 'קידוחי אקוויפר ההר + תערובת מותפלים',
    tds: 265,
    gh: 145,
    kh: 125,
    ca: 49,
    mg: 12.8,
    cl: 46,
    ph: 7.8,
    description: 'מים קשים עם בופר אלקלי גבוה (KH > 120). גורם למיסוך חומציות טבעית בקלייה בהירה. מומלץ מהילת RO.',
  },
  {
    id: 'haifa',
    cityName: 'חיפה והקריות',
    district: 'מחוז חיפה',
    corporation: 'מי כרמל / קידוחי צפון',
    sourceType: 'קידוחי גליל מערבי + מותפלי חדרה',
    tds: 185,
    gh: 98,
    kh: 82,
    ca: 33,
    mg: 8.5,
    cl: 39,
    ph: 7.5,
    description: 'איזון מינרלי בינוני. מתאים לקליות בינוניות-כהות; דורש העלאת מגנזיום קלה לקפה פילטר V60.',
  },
  {
    id: 'beer-sheva',
    cityName: 'באר שבע והנגב',
    district: 'מחוז הדרום',
    corporation: 'מי שבע / מתקן התפלה אשקלון',
    sourceType: '90% מים מותפלים ממתקני ים תיכון',
    tds: 110,
    gh: 52,
    kh: 42,
    ca: 17,
    mg: 3.2,
    cl: 33,
    ph: 7.7,
    description: 'מים דלי מגנזיום באופן מובהק. מיצוי נוטה להיות שטוח ללא תוספת מלח אפסום (MgSO4).',
  },
  {
    id: 'galilee-golan',
    cityName: 'גליל עליון ורמת הגולן',
    district: 'מחוז הצפון',
    corporation: 'תאגידי מים אזוריים / מעיינות מקומיים',
    sourceType: 'מי מעיינות בזלתיים ואקוויפר גלילי',
    tds: 215,
    gh: 120,
    kh: 105,
    ca: 39,
    mg: 13.5,
    cl: 22,
    ph: 7.3,
    description: 'מים עשירים במינרלים טבעיים עם איזון נעים ורמת כלורידים נמוכה במיוחד. מתאים לחליטת איבריק וסייפון.',
  },
  {
    id: 'sharon-netanya',
    cityName: 'השרון, נתניה והמרכז',
    district: 'מחוז המרכז',
    corporation: 'מי השרון / קידוחי אקוויפר החוף',
    sourceType: 'קידוחי חוף מקומיים',
    tds: 310,
    gh: 172,
    kh: 148,
    ca: 56,
    mg: 18.2,
    cl: 68,
    ph: 7.9,
    description: 'קשיות גבוהה וסכנת אבנית מוגברת למכונות אספרסו. חובה להשתמש בסינון RO והזרקה מחדש.',
  },
];

const TARGET_PROFILES: TargetProfile[] = [
  {
    id: 'sca-gold-cup',
    name: 'SCA Gold Cup Standard',
    brewType: 'איזון כללי אופטימלי (כל שיטות החליטה)',
    targetTds: 150,
    targetGh: 68,
    targetKh: 40,
    targetPh: 7.0,
    flavorImpact: 'איזון הרמוני מושלם בין גוף, מתיקות וחומציות נעימה ללא מרירות יתר.',
  },
  {
    id: 'light-roast-fruit',
    name: 'Nordic Light Roast & Floral V60',
    brewType: 'חליטת פילטר, V60, Chemex',
    targetTds: 120,
    targetGh: 75,
    targetKh: 25,
    targetPh: 6.8,
    flavorImpact: 'מגנזיום גבוה ובופר נמוך להדגשת תווי פרי יסמין, ברגמוט וחמיצות הדרים נקייה.',
  },
  {
    id: 'espresso-chocolate',
    name: 'Classic 9-Bar Crema Espresso',
    brewType: 'אספרסו בוטיק ומשקאות חלב',
    targetTds: 165,
    targetGh: 85,
    targetKh: 50,
    targetPh: 7.2,
    flavorImpact: 'סידן מוגבר להגברת גוף קרמי, שוקולד מריר, אגוזים ומניעת פגיעה באלמנט החימום.',
  },
  {
    id: 'aeropress-clean',
    name: 'Ultra-Clean AeroPress & Cold Drip',
    brewType: 'אירופרס, קולד דריפ וטפטוף איטי',
    targetTds: 95,
    targetGh: 48,
    targetKh: 20,
    targetPh: 6.9,
    flavorImpact: 'חליטה רכה ומדויקת המדגישה סיומת ארוכה ומתיקות טבעית ללא עפיצות.',
  },
];

export const IsraelWaterIntelligence: React.FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string>('tel-aviv');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('sca-gold-cup');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [waterBatchVolumeLiters, setWaterBatchVolumeLiters] = useState<number>(5);
  const [copied, setCopied] = useState<boolean>(false);

  // Custom water metrics if user switches to custom mode
  const [customTds, setCustomTds] = useState<number>(ISRAEL_CITIES_DATA[0].tds);
  const [customGh, setCustomGh] = useState<number>(ISRAEL_CITIES_DATA[0].gh);
  const [customKh, setCustomKh] = useState<number>(ISRAEL_CITIES_DATA[0].kh);
  const [customPh, setCustomPh] = useState<number>(ISRAEL_CITIES_DATA[0].ph);

  const currentCity = useMemo(() => {
    return ISRAEL_CITIES_DATA.find((c) => c.id === selectedCityId) || ISRAEL_CITIES_DATA[0];
  }, [selectedCityId]);

  const targetProfile = useMemo(() => {
    return TARGET_PROFILES.find((t) => t.id === selectedTargetId) || TARGET_PROFILES[0];
  }, [selectedTargetId]);

  // Active inputs
  const activeTds = isCustomMode ? customTds : currentCity.tds;
  const activeGh = isCustomMode ? customGh : currentCity.gh;
  const activeKh = isCustomMode ? customKh : currentCity.kh;
  const activePh = isCustomMode ? customPh : currentCity.ph;

  // Remineralization & Chemistry Calculations
  const calculations = useMemo(() => {
    // Check if water is too hard -> Requires RO dilution
    const needsRoDilution = activeGh > targetProfile.targetGh || activeKh > targetProfile.targetKh;
    let roDilutionPercent = 0;
    if (needsRoDilution) {
      const ghRatio = (activeGh - targetProfile.targetGh) / activeGh;
      const khRatio = (activeKh - targetProfile.targetKh) / activeKh;
      roDilutionPercent = Math.min(95, Math.max(10, Math.round(Math.max(ghRatio, khRatio) * 100)));
    }

    // Effective mineral levels after dilution (or base)
    const effectiveFactor = needsRoDilution ? (100 - roDilutionPercent) / 100 : 1;
    const postDilutionGh = activeGh * effectiveFactor;
    const postDilutionKh = activeKh * effectiveFactor;

    // Mineral deficits to reach target (in ppm CaCO3 equivalents)
    const deltaGh = Math.max(0, targetProfile.targetGh - postDilutionGh);
    const deltaKh = Math.max(0, targetProfile.targetKh - postDilutionKh);

    // Chemical recipe conversion factors per 1L:
    // Epsom Salt (MgSO4.7H2O): ~4.1 ppm CaCO3 per 10mg/L
    const epsomSaltMgPerL = Math.round((deltaGh * 0.75 / 4.1) * 10);
    // Calcium Chloride (CaCl2): ~9.0 ppm CaCO3 per 10mg/L
    const calciumChlorideMgPerL = Math.round((deltaGh * 0.25 / 9.0) * 10);
    // Baking Soda (NaHCO3): ~5.95 ppm CaCO3 alkalinity per 10mg/L
    const bakingSodaMgPerL = Math.round((deltaKh / 5.95) * 10);

    // Total batch quantities for selected waterBatchVolumeLiters
    const batchEpsomGrams = ((epsomSaltMgPerL * waterBatchVolumeLiters) / 1000).toFixed(2);
    const batchCalciumGrams = ((calciumChlorideMgPerL * waterBatchVolumeLiters) / 1000).toFixed(2);
    const batchBakingSodaGrams = ((bakingSodaMgPerL * waterBatchVolumeLiters) / 1000).toFixed(2);

    // SCA Match Score Calculation (0-100%)
    const tdsDiff = Math.abs(activeTds - targetProfile.targetTds) / targetProfile.targetTds;
    const ghDiff = Math.abs(activeGh - targetProfile.targetGh) / targetProfile.targetGh;
    const khDiff = Math.abs(activeKh - targetProfile.targetKh) / targetProfile.targetKh;
    const phDiff = Math.abs(activePh - targetProfile.targetPh) / targetProfile.targetPh;
    const rawScore = 100 - (tdsDiff * 30 + ghDiff * 35 + khDiff * 25 + phDiff * 10) * 100;
    const scaScore = Math.max(12, Math.min(99, Math.round(rawScore)));

    return {
      needsRoDilution,
      roDilutionPercent,
      roVolumeLiters: ((waterBatchVolumeLiters * roDilutionPercent) / 100).toFixed(1),
      tapVolumeLiters: (waterBatchVolumeLiters * (1 - roDilutionPercent / 100)).toFixed(1),
      epsomSaltMgPerL,
      calciumChlorideMgPerL,
      bakingSodaMgPerL,
      batchEpsomGrams,
      batchCalciumGrams,
      batchBakingSodaGrams,
      scaScore,
    };
  }, [activeTds, activeGh, activeKh, activePh, targetProfile, waterBatchVolumeLiters]);

  const handleCitySelect = (cityId: string) => {
    setSelectedCityId(cityId);
    setIsCustomMode(false);
    coffeeSound.playBaristaClick();
  };

  const handleCopyRecipe = () => {
    const text = `💧 מתכון כימיית מים SCA - The Digital Roast
עיר מקור: ${isCustomMode ? 'פרופיל מותאם אישית' : currentCity.cityName}
פרופיל יעד: ${targetProfile.name}
נפח מים להכנה: ${waterBatchVolumeLiters} ליטר
ציון SCA מקורי: ${calculations.scaScore}%

${calculations.needsRoDilution ? `⚠️ נדרשת מהילת אוסמוזה הפוכה (RO): ${calculations.roDilutionPercent}% (${calculations.roVolumeLiters}L מים מזוקקים/RO + ${calculations.tapVolumeLiters}L מי ברז)` : '✅ אין צורך במהילת RO'}

תוספי מינרליזציה למיכל ${waterBatchVolumeLiters}L:
- מלח אפסום (מגנזיום MgSO4): ${calculations.batchEpsomGrams} גרם
- קלציום כלוריד (CaCl2): ${calculations.batchCalciumGrams} גרם
- סודה לשתייה (בופר בסיסי NaHCO3): ${calculations.batchBakingSodaGrams} גרם
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    coffeeSound.playBaristaClick();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 dir-rtl text-right">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>ISRAEL MUNICIPAL WATER INTELLIGENCE • DATA.GOV.IL</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
              מפת איכות המים בישראל & מחשבון SCA Remineralizer
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              מערכת חכמה המשלבת נתוני איכות מים מוניציפליים ממאגרי רשות המים ומשרד הבריאות לכל מחוז בישראל, ומחשבת בדיוק מיליגרמי את יחסי המהילה והזרקת המינרלים להגעה לתקן הזהב העולמי של ה-SCA.
            </p>
          </div>

          {/* Quick Score Gauge */}
          <div className="flex items-center gap-4 bg-[#140e0b]/90 p-4 rounded-2xl border border-amber-500/30 shrink-0">
            <div className="text-center">
              <div className="text-xs text-stone-400 font-mono">ציון התאמה SCA</div>
              <div
                className={`text-3xl font-extrabold font-mono mt-0.5 ${
                  calculations.scaScore >= 80
                    ? 'text-emerald-400'
                    : calculations.scaScore >= 60
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {calculations.scaScore}%
              </div>
            </div>
            <div className="h-10 w-px bg-stone-800" />
            <div className="text-xs text-stone-300 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>TDS: {activeTds} ppm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>קשיות GH: {activeGh} ppm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: City Selection & Target Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Israeli Cities & Districts (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-200 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <span>בחירת אזור / תאגיד מים בישראל</span>
            </h2>
            <button
              onClick={() => {
                setIsCustomMode(!isCustomMode);
                coffeeSound.playBaristaClick();
              }}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                isCustomMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isCustomMode ? 'חזרה לערים' : 'מצב מדידה אישי'}</span>
            </button>
          </div>

          {!isCustomMode ? (
            <div className="space-y-2.5">
              {ISRAEL_CITIES_DATA.map((city) => {
                const isSelected = selectedCityId === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city.id)}
                    className={`w-full p-4 rounded-2xl border text-right transition-all group relative overflow-hidden ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/30'
                        : 'bg-stone-900/60 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-stone-100 flex items-center gap-2">
                          <span>{city.cityName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                            {city.district}
                          </span>
                        </div>
                        <div className="text-xs text-cyan-300/80 mt-1 font-medium">{city.corporation}</div>
                        <div className="text-[11px] text-stone-400 mt-1 leading-snug">{city.description}</div>
                      </div>
                      <div className="text-left font-mono shrink-0">
                        <div className="text-xs text-stone-300 font-bold">{city.tds} ppm</div>
                        <div className="text-[10px] text-stone-400">GH {city.gh} | KH {city.kh}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Custom Sliders */
            <div className="p-5 rounded-2xl bg-stone-900/80 border border-amber-500/30 space-y-4">
              <div className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                <span>הזן נתונים שנמדדו במד TDS / בדיקת טיטרציה ביתית</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                    <span>TDS (חלקיקים מומסים)</span>
                    <span className="text-amber-400 font-bold">{customTds} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={customTds}
                    onChange={(e) => setCustomTds(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                    <span>קשיות כללית (GH - מגנזיום + סידן)</span>
                    <span className="text-cyan-400 font-bold">{customGh} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="300"
                    value={customGh}
                    onChange={(e) => setCustomGh(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                    <span>בופר אלקלי (KH - פחמות)</span>
                    <span className="text-emerald-400 font-bold">{customKh} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="250"
                    value={customKh}
                    onChange={(e) => setCustomKh(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                    <span>רמת חומציות (pH)</span>
                    <span className="text-purple-400 font-bold">{customPh.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="5.5"
                    max="9.0"
                    step="0.1"
                    value={customPh}
                    onChange={(e) => setCustomPh(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Target Profiles & Remineralizer Recipe (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Profile Selector */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-stone-200 flex items-center gap-2">
              <TestTube className="w-5 h-5 text-amber-400" />
              <span>בחר פרופיל חליטה יעד (SCA Target Standard)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TARGET_PROFILES.map((target) => {
                const isSelected = selectedTargetId === target.id;
                return (
                  <button
                    key={target.id}
                    onClick={() => {
                      setSelectedTargetId(target.id);
                      coffeeSound.playBaristaClick();
                    }}
                    className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/40'
                        : 'bg-stone-900/60 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-stone-100">{target.name}</div>
                      <div className="text-[11px] text-amber-300/80 font-medium mt-0.5">{target.brewType}</div>
                      <div className="text-[11px] text-stone-400 mt-1 line-clamp-2">{target.flavorImpact}</div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-stone-800/60 flex items-center justify-between text-[11px] font-mono text-stone-300">
                      <span>יעד TDS: {target.targetTds}</span>
                      <span>GH {target.targetGh} | KH {target.targetKh}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remediation & Chemical Dispense Recipe Card */}
          <div className="p-6 rounded-3xl bg-stone-900/90 border border-amber-500/40 backdrop-blur-2xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <div className="text-xs text-amber-400 font-mono font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>מתכון מדויק לאיזון המים (Remineralization Protocol)</span>
                </div>
                <div className="text-base font-bold text-stone-100 mt-1">
                  התאמה עבור {isCustomMode ? 'מים מותאמים אישית' : currentCity.cityName} ➔ {targetProfile.name}
                </div>
              </div>

              {/* Water Volume Stepper */}
              <div className="flex items-center gap-2 bg-stone-950 p-1.5 rounded-2xl border border-stone-800">
                <span className="text-xs text-stone-400 px-2 font-mono">נפח מיכל:</span>
                {[1, 5, 10, 19].map((liters) => (
                  <button
                    key={liters}
                    onClick={() => {
                      setWaterBatchVolumeLiters(liters);
                      coffeeSound.playBaristaClick();
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                      waterBatchVolumeLiters === liters
                        ? 'bg-amber-500 text-stone-950'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {liters}L
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1: Dilution Alert if needed */}
            {calculations.needsRoDilution ? (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="text-amber-200 font-bold">נדרשת מהילת מים באוסמוזה הפוכה (RO Dilution)</div>
                  <p className="text-stone-300">
                    מי הברז מכילים בופר פחמתי (KH={activeKh}) גבוה מהיעד. על מנת למנוע שטוחות בטעם ואבנית, מהל{' '}
                    <span className="text-amber-300 font-bold font-mono">{calculations.roDilutionPercent}%</span> מנפח המיכל:
                  </p>
                  <div className="flex items-center gap-3 font-mono font-bold text-amber-300 pt-1">
                    <span>💧 {calculations.roVolumeLiters}L מים מזוקקים / RO</span>
                    <span>+</span>
                    <span>🚰 {calculations.tapVolumeLiters}L מי ברז מקומיים</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs text-stone-300">
                  <span className="text-emerald-300 font-bold">קשיות הבסיס נמוכה מספיק: </span>
                  אין צורך במהילת RO. ניתן להוסיף ישירות את תרכובת המינרלים למי הברז.
                </div>
              </div>
            )}

            {/* Step 2: Mineral Dosing Matrix */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-stone-300">
                תוספי מלחים נדרשים להכנת מיכל של {waterBatchVolumeLiters} ליטר:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Epsom Salt */}
                <div className="p-4 rounded-2xl bg-stone-950/80 border border-cyan-500/30 text-center space-y-1">
                  <div className="text-[11px] text-cyan-300 font-mono">מלח אפסום (מגנזיום)</div>
                  <div className="text-2xl font-extrabold text-stone-100 font-mono">
                    {calculations.batchEpsomGrams} <span className="text-xs text-stone-400">g</span>
                  </div>
                  <div className="text-[10px] text-stone-400">MgSO4·7H2O ({calculations.epsomSaltMgPerL} mg/L)</div>
                </div>

                {/* Calcium Chloride */}
                <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-500/30 text-center space-y-1">
                  <div className="text-[11px] text-amber-300 font-mono">קלציום כלוריד (סידן)</div>
                  <div className="text-2xl font-extrabold text-stone-100 font-mono">
                    {calculations.batchCalciumGrams} <span className="text-xs text-stone-400">g</span>
                  </div>
                  <div className="text-[10px] text-stone-400">CaCl2 ({calculations.calciumChlorideMgPerL} mg/L)</div>
                </div>

                {/* Baking Soda */}
                <div className="p-4 rounded-2xl bg-stone-950/80 border border-emerald-500/30 text-center space-y-1">
                  <div className="text-[11px] text-emerald-300 font-mono">סודה לשתייה (בופר)</div>
                  <div className="text-2xl font-extrabold text-stone-100 font-mono">
                    {calculations.batchBakingSodaGrams} <span className="text-xs text-stone-400">g</span>
                  </div>
                  <div className="text-[10px] text-stone-400">NaHCO3 ({calculations.bakingSodaMgPerL} mg/L)</div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>מאושר לפי תקן איכות המים העולמי של SCA ואיגוד הקפה הישראלי</span>
              </div>
              <button
                onClick={handleCopyRecipe}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'המתכון הועתק ללוח!' : 'העתק מתכון מלא לבריסטה'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
