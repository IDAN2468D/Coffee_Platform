"use client";

import React, { useState } from "react";
import { Globe, Award, TrendingUp, ArrowRightLeft, ShieldCheck, HeartHandshake } from "lucide-react";

export interface LotEconomics {
  lotName: string;
  originCountry: string;
  farmerName: string;
  farmAltitude: string;
  varietal: string;
  rawPriceUSDPerKg: number;
  cMarketPriceUSDPerKg: number;
  shippingAndExportUSD: number;
  roastingAndPackagingUSD: number;
  platformAndTaxesUSD: number;
}

const SAMPLE_LOT: LotEconomics = {
  lotName: "Finca El Paraíso - Pink Bourbon Anaerobic",
  originCountry: "קולומביה (Huila)",
  farmerName: "דייגו סמואל ברמודז",
  farmAltitude: "1,950 מטר",
  varietal: "Pink Bourbon",
  rawPriceUSDPerKg: 28.5,
  cMarketPriceUSDPerKg: 5.2,
  shippingAndExportUSD: 4.8,
  roastingAndPackagingUSD: 6.2,
  platformAndTaxesUSD: 5.5
};

const FX_RATES: Record<string, { symbol: string; rateFromUSD: number; name: string }> = {
  ILS: { symbol: "₪", rateFromUSD: 3.68, name: "שקל ישראלי" },
  USD: { symbol: "$", rateFromUSD: 1.0, name: "דולר אמריקאי" },
  EUR: { symbol: "€", rateFromUSD: 0.92, name: "אירו" },
  COP: { symbol: "COP$", rateFromUSD: 3950, name: "פסו קולומביאני" },
  ETB: { symbol: "Br", rateFromUSD: 57.5, name: "ביר אתיופי" }
};

export default function DirectTradeTransparencyCalculator() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("ILS");
  const lot = SAMPLE_LOT;

  const currentRate = FX_RATES[selectedCurrency].rateFromUSD;
  const currSym = FX_RATES[selectedCurrency].symbol;

  const formatPrice = (usd: number) => {
    const val = usd * currentRate;
    return selectedCurrency === "COP"
      ? `${Math.round(val).toLocaleString()} ${currSym}`
      : `${currSym}${val.toFixed(1)}`;
  };

  const farmerPremiumPercent = Math.round(
    ((lot.rawPriceUSDPerKg - lot.cMarketPriceUSDPerKg) / lot.cMarketPriceUSDPerKg) * 100
  );

  const totalCostUSD =
    lot.rawPriceUSDPerKg +
    lot.shippingAndExportUSD +
    lot.roastingAndPackagingUSD +
    lot.platformAndTaxesUSD;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-right font-sans" dir="rtl">
      <div className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl bg-black/60 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4" />
              שקיפות מסחר ישיר ושערי מטבע חיים • RapidAPI Currency
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white">
              מחשבון שרשרת ערך ופרמיית החקלאי
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm mt-1">
              {lot.lotName} • {lot.farmerName} ({lot.originCountry})
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <span className="text-xs text-zinc-400 px-2 flex items-center gap-1">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              מטבע:
            </span>
            {Object.keys(FX_RATES).map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCurrency === curr
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30"
                    : "text-zinc-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col justify-between">
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              מחיר ששולם ישירות לחקלאי
            </span>
            <div className="text-2xl md:text-3xl font-black text-white mt-2">
              {formatPrice(lot.rawPriceUSDPerKg)}
              <span className="text-xs text-zinc-400 font-normal mr-1.5">/ לק&quot;ג ירוק</span>
            </div>
            <div className="text-xs text-emerald-300/80 mt-1">
              שולם ישירות לחשבון החווה ב-Huila
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <span className="text-zinc-400 text-xs font-bold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              מחיר בורסת הסחורות (C-Market)
            </span>
            <div className="text-2xl md:text-3xl font-black text-zinc-300 mt-2">
              {formatPrice(lot.cMarketPriceUSDPerKg)}
              <span className="text-xs text-zinc-500 font-normal mr-1.5">/ לק&quot;ג מסחרי</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              מחיר בורסה עולמי לפולים תעשייתיים
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col justify-between">
            <span className="text-amber-400 text-xs font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              פרמיית איכות חברתית
            </span>
            <div className="text-2xl md:text-3xl font-black text-amber-300 mt-2">
              +{farmerPremiumPercent}%
            </div>
            <div className="text-xs text-amber-300/80 mt-1">
              פי {(lot.rawPriceUSDPerKg / lot.cMarketPriceUSDPerKg).toFixed(1)} מעל מחיר הבורסה העולמי!
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl p-6 backdrop-blur-2xl bg-black/60 border border-white/10 space-y-4">
        <h3 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          פילוח שקיפות מלא של שרשרת הערך (לכל ק&quot;ג קלוי)
        </h3>

        <div className="space-y-3 text-xs md:text-sm">
          <div className="flex justify-between items-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div>
              <div className="font-bold text-emerald-300">תשלום ישיר לחקלאי (Direct Farm Gate)</div>
              <div className="text-xs text-zinc-400">תגמול על עיבוד אנאירובי מוקפד ואיכות קטיף ידני</div>
            </div>
            <div className="text-right">
              <div className="font-black text-white text-base">{formatPrice(lot.rawPriceUSDPerKg)}</div>
              <div className="text-[11px] text-emerald-400">{Math.round((lot.rawPriceUSDPerKg / totalCostUSD) * 100)}% מעלות הכוללת</div>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5">
            <div>
              <div className="font-bold text-zinc-200">שילוח בקירור וביטוח סחר הוגן</div>
              <div className="text-xs text-zinc-400">אריזות GrainPro אטומות לחמצן ושינוע אקולוגי</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-white text-base">{formatPrice(lot.shippingAndExportUSD)}</div>
              <div className="text-[11px] text-zinc-400">{Math.round((lot.shippingAndExportUSD / totalCostUSD) * 100)}%</div>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5">
            <div>
              <div className="font-bold text-zinc-200">קלייה מקומית, בקרה אופטית ואריזה</div>
              <div className="text-xs text-zinc-400">קליית אוויר חם (Loring), דה-גאסינג ואריזות שסתום חד-כיווני</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-white text-base">{formatPrice(lot.roastingAndPackagingUSD)}</div>
              <div className="text-[11px] text-zinc-400">{Math.round((lot.roastingAndPackagingUSD / totalCostUSD) * 100)}%</div>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5">
            <div>
              <div className="font-bold text-zinc-200">תפעול פלטפורמה, AI Barista ומסים</div>
              <div className="text-xs text-zinc-400">תשתיות ענן, פיתוח מודלים ומע״מ כחוק</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-white text-base">{formatPrice(lot.platformAndTaxesUSD)}</div>
              <div className="text-[11px] text-zinc-400">{Math.round((lot.platformAndTaxesUSD / totalCostUSD) * 100)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
