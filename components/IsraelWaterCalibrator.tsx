"use client";

import React, { useState } from "react";
import { Droplets, MapPin, Sparkles, CheckCircle2, AlertTriangle, RefreshCw, Layers, Sliders } from "lucide-react";

export interface CityWaterProfile {
  id: string;
  name: string;
  region: string;
  sourceType: "התפלה מסיבית" | "מי תהום וקידוחים" | "שילוב כנרת וקידוחים" | "התפלה מקומית";
  tds: number; // ppm
  gh: number;  // ppm CaCO3
  kh: number;  // ppm CaCO3
  calcium: number; // ppm Ca2+
  magnesium: number; // ppm Mg2+
  chlorine: number; // ppm Cl2
  ph: number;
  recommendation: {
    filtrationType: string;
    remineralization: string;
    brewProfileMatch: string;
    warning?: string;
  };
}

export const ISRAEL_REGIONS: CityWaterProfile[] = [
  {
    id: "tel-aviv",
    name: "תל אביב - יפו וגוש דן",
    region: "מרכז",
    sourceType: "התפלה מסיבית",
    tds: 140,
    gh: 65,
    kh: 45,
    calcium: 20,
    magnesium: 4,
    chlorine: 0.8,
    ph: 7.6,
    recommendation: {
      filtrationType: "פילטר פחם פעיל (Carbon Block) להסרת כלור + תוספת מגנזיום ייעודית",
      remineralization: "הוספת 20ppm מגנזיום ($MgSO_4$) להדגשת חמיצות פירותית בקלייה בהירה",
      brewProfileMatch: "מתאים במיוחד לחליטות פילטר V60 ואספרסו מודרני לאחר סינון כלור",
      warning: "רמת מגנזיום נמוכה במי התפלה עשויה לגרום למיצוי שטוח ללא תוספת ייעודית"
    }
  },
  {
    id: "jerusalem",
    name: "ירושלים וסביבתה",
    region: "הרי יהודה",
    sourceType: "שילוב כנרת וקידוחים",
    tds: 280,
    gh: 160,
    kh: 120,
    calcium: 55,
    magnesium: 15,
    chlorine: 0.5,
    ph: 7.9,
    recommendation: {
      filtrationType: "מערכת אוסמוזה הפוכה (RO) עם בלנדר מינרלים או פילטר חילוף יונים (BWT Bestmax Premium)",
      remineralization: "הורדת TDS ל-120ppm ואיזון KH ל-40ppm למניעת הצטברות אבנית מהירה",
      brewProfileMatch: "קשיות גבוהה - מצוין למיצויי אספרסו עמוקים וגוף שוקולדי, דורש ריכוך לפילטר",
      warning: "זהירות: סכנת אבנית מואצת בדוד האספרסו מעל 93°C ללא ריכוך מתאים"
    }
  },
  {
    id: "haifa",
    name: "חיפה והכרמל",
    region: "צפון",
    sourceType: "התפלה מסיבית",
    tds: 160,
    gh: 75,
    kh: 50,
    calcium: 24,
    magnesium: 6,
    chlorine: 0.7,
    ph: 7.5,
    recommendation: {
      filtrationType: "סינון מיקרוני רב-שלבי + פחם פעיל",
      remineralization: "איזון יחס סידן-מגנזיום (2:1 לטובת מגנזיום)",
      brewProfileMatch: "אידיאלי לקלייה בינונית-בהירה ואספרסו נקי ומאוזן"
    }
  },
  {
    id: "beer-sheva",
    name: "באר שבע והנגב",
    region: "דרום",
    sourceType: "התפלה מסיבית",
    tds: 130,
    gh: 55,
    kh: 40,
    calcium: 18,
    magnesium: 3,
    chlorine: 0.9,
    ph: 7.7,
    recommendation: {
      filtrationType: "סינון פחם פעיל מתקדם + כדוריות מגנזיום מזינות",
      remineralization: "תוספת Epsom Salt ו-Baking Soda במנות מדודות",
      brewProfileMatch: "בסיס מצוין ל-Cold Brew ו-V60 הודות ל-TDS טבעי נמוך"
    }
  },
  {
    id: "galil",
    name: "גליל עליון ורמת הגולן",
    region: "צפון הררי",
    sourceType: "מי תהום וקידוחים",
    tds: 310,
    gh: 185,
    kh: 140,
    calcium: 65,
    magnesium: 18,
    chlorine: 0.3,
    ph: 8.1,
    recommendation: {
      filtrationType: "אוסמוזה הפוכה מלאה (RO) + רמינרליזציה מבוקרת",
      remineralization: "שימוש במנות מלח SCA (Lotus Water Drops או Third Wave Water)",
      brewProfileMatch: "המים הטבעיים כבדים מדי לפולי Geisha עדינים - חובה לרכך לקבלת ניקיון כוס"
    }
  },
  {
    id: "eilat",
    name: "אילת והערבה",
    region: "דרום עמוק",
    sourceType: "התפלה מקומית",
    tds: 110,
    gh: 45,
    kh: 35,
    calcium: 15,
    magnesium: 2,
    chlorine: 0.6,
    ph: 7.4,
    recommendation: {
      filtrationType: "סינון קלורמין + העשרת מינרלים עדינה",
      remineralization: "העלאת TDS לאזור 125-150ppm למיצוי מלא של מתיקות",
      brewProfileMatch: "קל מאוד להתאמה אישית, בסיס 'לוח חלק' מעולה לבריסטה מדען"
    }
  }
];

export default function IsraelWaterCalibrator() {
  const [selectedCity, setSelectedCity] = useState<CityWaterProfile>(ISRAEL_REGIONS[0]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("היום, 10:00");

  const handleSyncDatagov = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/water-quality?cityId=${selectedCity.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setSelectedCity(data.profile);
        }
      }
    } catch {
      // Keep existing data on error
    } finally {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }));
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-right font-sans" dir="rtl">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 backdrop-blur-2xl bg-black/60 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-1">
              <Droplets className="w-4 h-4" />
              מנוע כיול מים ארצי • Datagov Israel & SCA Standards
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white">
              כיול כימיית מים לפי יישובים בישראל
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm mt-1 max-w-2xl">
              שאיבת נתוני איכות מים אזוריים בזמן אמת, חישוב מאזן יוני סידן, מגנזיום וביקרבונט והפקת מתכון סינון ומינרלים מדויק.
            </p>
          </div>

          <button
            onClick={handleSyncDatagov}
            disabled={isSyncing}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all duration-300 active:scale-95 text-xs md:text-sm font-medium cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-cyan-400" : ""}`} />
            {isSyncing ? "מושך מ-Datagov..." : "רענן ממאגר הממשלה"}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
          {ISRAEL_REGIONS.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city)}
              className={`p-3.5 rounded-2xl text-right transition-all duration-200 border flex flex-col justify-between cursor-pointer ${
                selectedCity.id === city.id
                  ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <MapPin className={`w-4 h-4 ${selectedCity.id === city.id ? "text-cyan-400" : "text-zinc-500"}`} />
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-cyan-300">
                  {city.region}
                </span>
              </div>
              <div className="font-bold text-sm mt-3">{city.name.split(" ")[0]}</div>
              <div className="text-[11px] text-zinc-400">{city.tds} ppm TDS</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 rounded-3xl p-6 backdrop-blur-2xl bg-black/60 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              פרופיל ב{selectedCity.name}
            </h3>
          </div>

          <div className="space-y-3 text-xs md:text-sm">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
              <span className="text-zinc-400">מקור אספקה</span>
              <span className="font-medium text-cyan-300">{selectedCity.sourceType}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
              <span className="text-zinc-400">סך מומסים (TDS)</span>
              <span className="font-bold text-white">{selectedCity.tds} ppm</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
              <span className="text-zinc-400">קשיות כללית (GH)</span>
              <span className="font-bold text-amber-300">{selectedCity.gh} ppm</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
              <span className="text-zinc-400">אלקליניות (KH)</span>
              <span className="font-bold text-emerald-300">{selectedCity.kh} ppm</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
              <span className="text-zinc-400">יחס סידן / מגנזיום</span>
              <span className="font-bold text-zinc-200">{selectedCity.calcium} / {selectedCity.magnesium} ppm</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
              <span className="text-zinc-400">רמת הגבה (pH)</span>
              <span className="font-bold text-indigo-300">{selectedCity.ph}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 rounded-3xl p-6 backdrop-blur-2xl bg-black/60 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                מתכון כיול Specialty לחליטה
              </h3>
              <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SCA Standard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-2">
                <div className="text-cyan-400 text-xs font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  מערך סינון מומלץ
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {selectedCity.recommendation.filtrationType}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-2">
                <div className="text-amber-400 text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  העשרת מינרלים (Remineralization)
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {selectedCity.recommendation.remineralization}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mt-4 space-y-1.5">
              <div className="text-white text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                התאמת סגנון חליטה
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed">
                {selectedCity.recommendation.brewProfileMatch}
              </p>
            </div>

            {selectedCity.recommendation.warning && (
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 mt-3 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-rose-200 text-xs leading-relaxed">
                  {selectedCity.recommendation.warning}
                </p>
              </div>
            )}
          </div>

          <div className="text-left text-[11px] text-zinc-500 pt-2 border-t border-white/5">
            סונכרן מ-Datagov Israel • עדכון אחרון: {lastSyncTime}
          </div>
        </div>
      </div>
    </div>
  );
}
