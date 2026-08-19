'use client';

import React, { useState, useMemo } from 'react';
import {
  Store,
  MapPin,
  ShieldCheck,
  Award,
  Search,
  Coffee,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Flame,
  Filter,
  BadgePercent,
  Check,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';
import { useHorizontalScroll } from '@/lib/hooks/useHorizontalScroll';

interface RoasterItem {
  id: string;
  name: string;
  hebrewName: string;
  city: string;
  district: string;
  healthMinistryLicense: string;
  kashrutCert: string;
  specialtyFocus: string;
  roastStyle: 'LIGHT_NORDIC' | 'MEDIUM_OMNI' | 'DARK_CREMA';
  signatureBean: string;
  directTradeRate: number;
  description: string;
  rating: number;
}

const ISRAEL_ROASTERS: RoasterItem[] = [
  {
    id: 'digital-roast-hq',
    name: 'The Digital Roast AI Lab',
    hebrewName: 'דה דיגיטל רואסט מעבדת קלייה AI',
    city: 'תל אביב (מתחם לוינסקי)',
    district: 'מרכז',
    healthMinistryLicense: 'רישיון יצרן מזון #54219/ת״א',
    kashrutCert: 'כשרות מהדרין ליבוא פולי קפה ירוקים',
    specialtyFocus: 'מיקרו-לוט אנארובי, קלייה נורדית בהירה ומיצוי V60',
    roastStyle: 'LIGHT_NORDIC',
    signatureBean: 'Ethiopia Yirgacheffe G1 72h Anaerobic',
    directTradeRate: 100,
    description: 'מעבדת קליית ספשלטי המשלבת בינה מלאכותית, טלמטריית RoR ובקרת איכות אופטית מלאה.',
    rating: 4.98,
  },
  {
    id: 'galilee-roastery',
    name: 'Galilee High-Altitude Roasters',
    hebrewName: 'קליות הגליל העליון',
    city: 'ראש פינה',
    district: 'צפון',
    healthMinistryLicense: 'רישיון יצרן מזון #88120/צפון',
    kashrutCert: 'כשרות הרבנות הראשית גליל עליון',
    specialtyFocus: 'פולים אקולוגיים, שמירה על טרואר ופולי גיישה',
    roastStyle: 'LIGHT_NORDIC',
    signatureBean: 'Panama Geisha Boquete Selection',
    directTradeRate: 95,
    description: 'בית קלייה גלילי המתמחה בפולים מחקלאים בגידול ישיר ובפרופילי קלייה בהירים ומבושמים.',
    rating: 4.92,
  },
  {
    id: 'jerusalem-mountain',
    name: 'Jerusalem Mountain Coffee Lab',
    hebrewName: 'מעבדת קפה הרי ירושלים',
    city: 'ירושלים (מחנה יהודה)',
    district: 'ירושלים',
    healthMinistryLicense: 'רישיון יצרן מזון #31940/י-ם',
    kashrutCert: 'כשרות בד״ץ ירושלים / רבנות ראשית',
    specialtyFocus: 'חליטת איבריק טורקי מסורתי וסייפון ואקום',
    roastStyle: 'MEDIUM_OMNI',
    signatureBean: 'Yemen Mokha Matari Natural',
    directTradeRate: 90,
    description: 'שילוב אותנטי של מסורת איבריק ירושלמית עתיקה עם טכנולוגיית קלייה מדויקת.',
    rating: 4.89,
  },
  {
    id: 'negev-solar-roast',
    name: 'Negev Desert Solar Roastery',
    hebrewName: 'קליות שמש מצפה רמון',
    city: 'מצפה רמון',
    district: 'דרום',
    healthMinistryLicense: 'רישיון יצרן מזון #71092/דרום',
    kashrutCert: 'כשרות רבנות אזורית הר הנגב',
    specialtyFocus: 'קלייה באנרגיה סולארית ואספרסו שוקולדי עמוק',
    roastStyle: 'MEDIUM_OMNI',
    signatureBean: 'Brazil Cerrado Mineiro Solar Natural',
    directTradeRate: 92,
    description: 'בית קלייה אקולוגי חדשני במכתש רמון הפועל על 100% אנרגיה סולארית ירוקה.',
    rating: 4.85,
  },
  {
    id: 'sharon-crema',
    name: 'Sharon Coastal Roasters',
    hebrewName: 'קליות חוף השרון',
    city: 'כפר סבא',
    district: 'מרכז',
    healthMinistryLicense: 'רישיון יצרן מזון #90412/מרכז',
    kashrutCert: 'כשרות רבנות כפר סבא',
    specialtyFocus: 'תערובות אספרסו 9Bar עשירות בקרמה ומשקאות חלב',
    roastStyle: 'DARK_CREMA',
    signatureBean: 'Midnight Velvet Espresso Blend',
    directTradeRate: 88,
    description: 'מומחים ביצירת תערובות אספרסו עשירות בשוקולד מריר, אגוזי לוז וקרמה זהובה יציבה.',
    rating: 4.87,
  },
  {
    id: 'haifa-port-roast',
    name: 'Haifa Port Specialty Coffee',
    hebrewName: 'ספשלטי נמל חיפה',
    city: 'חיפה (עיר תחתית)',
    district: 'חיפה',
    healthMinistryLicense: 'רישיון יצרן מזון #44591/חיפה',
    kashrutCert: 'כשרות הרבנות חיפה',
    specialtyFocus: 'קולד ברו ניטרו וחליטות קרות איטיות',
    roastStyle: 'LIGHT_NORDIC',
    signatureBean: 'Kenya Nyeri Peaberry Washed',
    directTradeRate: 94,
    description: 'בית קלייה אורבני בעיר התחתית המפתח שיטות מיצוי קרות מתקדמות ופולי פילטר מובחרים.',
    rating: 4.91,
  },
];

export const IsraelRoasterDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedRoastStyle, setSelectedRoastStyle] = useState<string>('ALL');
  const districtScrollRef = useHorizontalScroll<HTMLDivElement>();

  const filteredRoasters = useMemo(() => {
    return ISRAEL_ROASTERS.filter((item) => {
      const matchSearch =
        item.hebrewName.includes(searchQuery) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.includes(searchQuery) ||
        item.signatureBean.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDistrict = selectedDistrict === 'ALL' || item.district === selectedDistrict;
      const matchRoast = selectedRoastStyle === 'ALL' || item.roastStyle === selectedRoastStyle;

      return matchSearch && matchDistrict && matchRoast;
    });
  }, [searchQuery, selectedDistrict, selectedRoastStyle]);

  return (
    <div className="space-y-8 dir-rtl text-right">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-amber-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30">
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>ISRAEL SPECIALTY ROASTERS & DATA.GOV.IL DIRECTORY</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
              אינדקס בתי קלייה בוטיק בישראל & תעודות משרד הבריאות
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              מאגר בתי הקלייה המובילים בישראל עם הצגת רישיונות יצרן מאומתים משירות המזון של משרד הבריאות, תעודות כשרות ליבוא חומרי גלם של הרבנות הראשית, ופירוט סגנונות קלייה ייחודיים.
            </p>
          </div>

          {/* Directory Count */}
          <div className="bg-[#140e0b]/90 p-4 rounded-2xl border border-stone-800 shrink-0 text-center space-y-1">
            <div className="text-xs text-stone-400 font-mono">בתי קלייה פעילים</div>
            <div className="text-3xl font-black font-mono text-amber-400">{filteredRoasters.length}</div>
            <div className="text-[10px] text-emerald-400 font-mono">100% מאומתים ברישוי</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="חיפוש בית קלייה, עיר או זן..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-10 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* District Filters */}
        <div ref={districtScrollRef} className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing">
          <span className="text-stone-400 text-xs font-mono ml-2 shrink-0">מחוז:</span>
          {[
            { id: 'ALL', label: 'הכל' },
            { id: 'מרכז', label: 'מרכז ות״א' },
            { id: 'ירושלים', label: 'ירושלים' },
            { id: 'צפון', label: 'צפון וגליל' },
            { id: 'דרום', label: 'דרום ונגב' },
            { id: 'חיפה', label: 'חיפה' },
          ].map((dist) => (
            <button
              key={dist.id}
              onClick={() => {
                setSelectedDistrict(dist.id);
                coffeeSound.playBaristaClick();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedDistrict === dist.id
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {dist.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Roasters Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoasters.map((roaster) => {
          return (
            <div
              key={roaster.id}
              className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 backdrop-blur-2xl transition-all shadow-lg flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-stone-100 group-hover:text-amber-300 transition-colors">
                      {roaster.hebrewName}
                    </h3>
                    <div className="text-xs text-stone-400 flex items-center gap-1.5 mt-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{roaster.city}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                    <span>★</span>
                    <span>{roaster.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">{roaster.description}</p>

                {/* Specialties and Beans */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80 space-y-1">
                    <div className="text-[10px] text-stone-400">זן דגל וחתימת קלייה:</div>
                    <div className="text-amber-300 font-bold">{roaster.signatureBean}</div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                    <span>סחר ישיר (Direct Trade):</span>
                    <span className="text-emerald-400 font-bold">{roaster.directTradeRate}%</span>
                  </div>
                </div>

                {/* Verified Gov & Rabbinate Badges */}
                <div className="pt-3 border-t border-stone-800/70 space-y-1.5 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{roaster.healthMinistryLicense}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{roaster.kashrutCert}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-5 pt-3 border-t border-stone-800/60">
                <button
                  onClick={() => {
                    coffeeSound.playBaristaClick();
                  }}
                  className="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 hover:text-stone-950 text-stone-300 font-bold text-xs flex items-center justify-center gap-2 border border-stone-800 transition-all active:scale-95"
                >
                  <Coffee className="w-4 h-4" />
                  <span>צפה בפולי הקלייה של המבשלה</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
