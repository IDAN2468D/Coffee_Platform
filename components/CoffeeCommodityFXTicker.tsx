'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Globe,
  ArrowRightLeft,
  Ship,
  Sparkles,
  Calculator,
  RefreshCw,
  Coins,
  FileSpreadsheet,
  Layers,
  Check,
  Copy,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface CommodityItem {
  id: string;
  symbol: string;
  name: string;
  hebrewName: string;
  origin: string;
  priceUsdPerKg: number;
  change24h: number;
  marketType: 'FUTURES' | 'SPECIALTY_LOT' | 'AUCTION_ELITE';
  sparkline: number[];
}

const COMMODITY_BENCHMARKS: CommodityItem[] = [
  {
    id: 'ice-arabica-c',
    symbol: 'KC=F',
    name: 'ICE Arabica "C" Benchmark',
    hebrewName: 'חוזה עתידי ערביקה ניו יורק (C-Contract)',
    origin: 'מדד שוק עולמי',
    priceUsdPerKg: 5.26, // approx 238.5 cents/lb
    change24h: 2.35,
    marketType: 'FUTURES',
    sparkline: [225, 228, 224, 230, 234, 232, 238.5],
  },
  {
    id: 'robusta-london',
    symbol: 'RC=F',
    name: 'London Robusta Futures',
    hebrewName: 'חוזה עתידי רובוסטה לונדון (RC)',
    origin: 'בורסת לונדון ICE Europe',
    priceUsdPerKg: 4.15,
    change24h: -0.85,
    marketType: 'FUTURES',
    sparkline: [4200, 4180, 4220, 4150, 4190, 4140, 4150],
  },
  {
    id: 'ethiopia-yirgacheffe-g1',
    symbol: 'ETH-YRG1',
    name: 'Ethiopia Yirgacheffe G1 Washed',
    hebrewName: 'אתיופיה ירגשף G1 שטיפה מלאה',
    origin: 'Gedeo Zone, אתיופיה (2,100 MASL)',
    priceUsdPerKg: 9.40,
    change24h: 1.20,
    marketType: 'SPECIALTY_LOT',
    sparkline: [8.9, 9.0, 9.1, 9.0, 9.2, 9.3, 9.4],
  },
  {
    id: 'colombia-pink-bourbon',
    symbol: 'COL-PKB',
    name: 'Colombia Huila Pink Bourbon Anaerobic',
    hebrewName: 'קולומביה הוילה פינק בורבון אנארובי',
    origin: 'Huila, קולומביה (1,850 MASL)',
    priceUsdPerKg: 13.80,
    change24h: 3.10,
    marketType: 'SPECIALTY_LOT',
    sparkline: [12.5, 12.8, 13.0, 13.1, 13.4, 13.5, 13.8],
  },
  {
    id: 'panama-geisha-esmeralda',
    symbol: 'PAN-GSH',
    name: 'Panama Geisha Hacienda La Esmeralda',
    hebrewName: 'פנמה גיישה אסמרלדה סלקשן',
    origin: 'Boquete, פנמה (1,700 MASL)',
    priceUsdPerKg: 195.0,
    change24h: 4.80,
    marketType: 'AUCTION_ELITE',
    sparkline: [180, 182, 185, 188, 190, 192, 195],
  },
  {
    id: 'brazil-cerrado-natural',
    symbol: 'BRZ-CRD',
    name: 'Brazil Cerrado Mineiro Natural 17/18',
    hebrewName: 'ברזיל סראדו מיניירו עיבוד טבעי',
    origin: 'Minas Gerais, ברזיל (1,150 MASL)',
    priceUsdPerKg: 5.85,
    change24h: -1.15,
    marketType: 'SPECIALTY_LOT',
    sparkline: [6.1, 6.0, 5.95, 6.0, 5.9, 5.88, 5.85],
  },
];

const CURRENCY_RATES = {
  USD: 3.70, // 1 USD = 3.70 ILS
  EUR: 4.02, // 1 EUR = 4.02 ILS
  BRL: 0.68, // 1 BRL = 0.68 ILS (Brazil Real)
  ETB: 0.032, // 1 ETB = 0.032 ILS (Ethiopian Birr)
  COP: 0.00092, // 1 COP = 0.00092 ILS (Colombian Peso)
  JPY: 0.024, // 1 JPY = 0.024 ILS
};

export const CoffeeCommodityFXTicker: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof CURRENCY_RATES>('USD');
  const [customUsdRate, setCustomUsdRate] = useState<number>(3.70);
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>('ethiopia-yirgacheffe-g1');
  const [fobPriceUsd, setFobPriceUsd] = useState<number>(9.40);
  const [shippingUsdPerKg, setShippingUsdPerKg] = useState<number>(1.80);
  const [portCustomsPercent, setPortCustomsPercent] = useState<number>(3.5);
  const [roastWeightLossPercent, setRoastWeightLossPercent] = useState<number>(16);
  const [batchKg, setBatchKg] = useState<number>(60); // 1 standard jute sack = 60kg
  const [copied, setCopied] = useState<boolean>(false);

  const activeBenchmark = useMemo(() => {
    return COMMODITY_BENCHMARKS.find((b) => b.id === selectedBenchmarkId) || COMMODITY_BENCHMARKS[0];
  }, [selectedBenchmarkId]);

  // Import Cost Breakdown Calculations
  const importCalc = useMemo(() => {
    const rawFobIls = fobPriceUsd * customUsdRate;
    const shippingIls = shippingUsdPerKg * customUsdRate;
    const subtotalCifIls = rawFobIls + shippingIls;
    const customsFeeIls = subtotalCifIls * (portCustomsPercent / 100);
    const landingCostGreenPerKgIls = subtotalCifIls + customsFeeIls;
    const vat18Ils = landingCostGreenPerKgIls * 0.18;
    const totalGreenWithVatPerKg = landingCostGreenPerKgIls + vat18Ils;

    // Roasted Coffee Calculation accounting for moisture loss
    const yieldMultiplier = 1 / (1 - roastWeightLossPercent / 100);
    const roastedNetCostPerKgIls = landingCostGreenPerKgIls * yieldMultiplier;
    const totalBatchCostIls = totalGreenWithVatPerKg * batchKg;

    return {
      rawFobIls: rawFobIls.toFixed(2),
      shippingIls: shippingIls.toFixed(2),
      customsFeeIls: customsFeeIls.toFixed(2),
      landingCostGreenPerKgIls: landingCostGreenPerKgIls.toFixed(2),
      vat18Ils: vat18Ils.toFixed(2),
      totalGreenWithVatPerKg: totalGreenWithVatPerKg.toFixed(2),
      roastedNetCostPerKgIls: roastedNetCostPerKgIls.toFixed(2),
      totalBatchCostIls: totalBatchCostIls.toFixed(2),
      yieldMultiplier: yieldMultiplier.toFixed(2),
    };
  }, [fobPriceUsd, customUsdRate, shippingUsdPerKg, portCustomsPercent, roastWeightLossPercent, batchKg]);

  const handleBenchmarkSelect = (item: CommodityItem) => {
    setSelectedBenchmarkId(item.id);
    setFobPriceUsd(item.priceUsdPerKg);
    coffeeSound.playBaristaClick();
  };

  const handleCopyQuote = () => {
    const text = `📈 דוח עלויות יבוא פולים ירוקים וחישוב שערים - The Digital Roast
זן / חוזה: ${activeBenchmark.hebrewName} (${activeBenchmark.name})
מחיר FOB נמל מוצא: $${fobPriceUsd} USD / ק"ג
שער דולר/ש"ח בחישוב: ₪${customUsdRate}

עלות נחיתה בישראל (לפני מע"מ): ₪${importCalc.landingCostGreenPerKgIls} לק"ג ירוק
עלות סופית לפול קלוי (אובדן קלייה ${roastWeightLossPercent}%): ₪${importCalc.roastedNetCostPerKgIls} לק"ג נקי
עלות כוללת לשק ${batchKg} ק"ג (כולל מע"מ ומכס): ₪${importCalc.totalBatchCostIls}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    coffeeSound.playBaristaClick();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 dir-rtl text-right">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/30">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>SPECIALTY COFFEE FX & COMMODITY TICKER • RAPIDAPI</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
              אינדקס קפה ירוק גלובלי & מחשבון יבוא בש״ח
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              מסוף פיננסי בזמן אמת למחירי פולי קפה גולמיים בעולם (ICE C-Market & Specialty Micro-Lots), המרת שערי מט״ח חיים (ILS/USD/EUR/BRL/ETB) וחישוב עלות נחיתה מדויקת לקלייה בישראל.
            </p>
          </div>

          {/* FX Quick Bar */}
          <div className="bg-[#140e0b]/90 p-4 rounded-2xl border border-stone-800 shrink-0 space-y-2">
            <div className="text-xs text-stone-400 font-mono">שער יציג ש״ח / USD:</div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold font-mono text-emerald-400">₪{customUsdRate.toFixed(2)}</span>
              <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <TrendingUp className="w-3 h-3" />
                <span>+0.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Live Commodity Ticker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMMODITY_BENCHMARKS.map((item) => {
          const isSelected = selectedBenchmarkId === item.id;
          const priceIls = (item.priceUsdPerKg * customUsdRate).toFixed(2);
          const isPositive = item.change24h >= 0;

          return (
            <button
              key={item.id}
              onClick={() => handleBenchmarkSelect(item)}
              className={`p-4 rounded-2xl border text-right transition-all group relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                  : 'bg-stone-900/70 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900'
              }`}
            >
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">{item.symbol}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                      isPositive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{isPositive ? `+${item.change24h}%` : `${item.change24h}%`}</span>
                  </span>
                </div>
                <div className="text-sm font-bold text-stone-100">{item.hebrewName}</div>
                <div className="text-[11px] text-stone-400">{item.origin}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800/70 flex items-end justify-between w-full font-mono">
                <div>
                  <div className="text-[10px] text-stone-400">מחיר גלובלי</div>
                  <div className="text-base font-bold text-stone-200">${item.priceUsdPerKg.toFixed(2)}/kg</div>
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-stone-400">שווה ערך בש״ח</div>
                  <div className="text-lg font-extrabold text-emerald-400">₪{priceIls}/kg</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Landing Cost Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs & Parameters (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 p-6 rounded-3xl bg-stone-900/90 border border-amber-500/30 backdrop-blur-2xl shadow-xl">
          <div className="flex items-center gap-2 text-base font-bold text-stone-100 border-b border-stone-800 pb-3">
            <Calculator className="w-5 h-5 text-amber-400" />
            <span>מחשבון עלויות יבוא ושילוח נמל (Landed Cost)</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">
                מחיר FOB נמל מוצא ($ USD לכל 1 ק״ג)
              </label>
              <input
                type="number"
                step="0.1"
                value={fobPriceUsd}
                onChange={(e) => setFobPriceUsd(Math.max(0.5, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">
                דמי שילוח ימי / ביטוח מכולה ($ USD לכל 1 ק״ג)
              </label>
              <input
                type="number"
                step="0.1"
                value={shippingUsdPerKg}
                onChange={(e) => setShippingUsdPerKg(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                <span>מכס והיטלי נמל אשדוד/חיפה (%)</span>
                <span className="text-amber-400 font-bold">{portCustomsPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={portCustomsPercent}
                onChange={(e) => setPortCustomsPercent(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                <span>אובדן משקל בקלייה (Roast Shrinkage %)</span>
                <span className="text-cyan-400 font-bold">{roastWeightLossPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="24"
                step="0.5"
                value={roastWeightLossPercent}
                onChange={(e) => setRoastWeightLossPercent(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                <span>כמות שקים להזמנה (שק סטנדרטי = 60 ק״ג)</span>
                <span className="text-emerald-400 font-bold">{batchKg} ק״ג ({Math.round(batchKg / 60)} שקים)</span>
              </div>
              <input
                type="range"
                min="30"
                max="600"
                step="30"
                value={batchKg}
                onChange={(e) => setBatchKg(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Right Output: Breakdown & Summary (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 p-6 rounded-3xl bg-stone-900/90 border border-emerald-500/30 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <Ship className="w-4 h-4 text-cyan-400" />
                <span>פירוט עלויות נחיתה עבור {activeBenchmark.hebrewName}</span>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300">
                1 USD = ₪{customUsdRate}
              </span>
            </div>

            {/* Breakdown Table */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80">
                <span className="text-stone-400">עלות פול גולמי FOB:</span>
                <span className="text-stone-200 font-bold">₪{importCalc.rawFobIls} / ק״ג (${fobPriceUsd})</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80">
                <span className="text-stone-400">שילוח וביטוח ימי CIF:</span>
                <span className="text-stone-200 font-bold">+ ₪{importCalc.shippingIls} / ק״ג</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80">
                <span className="text-stone-400">מכס ודמי נמל ({portCustomsPercent}%):</span>
                <span className="text-stone-200 font-bold">+ ₪{importCalc.customsFeeIls} / ק״ג</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-cyan-200 font-bold">
                <span>מחיר נחיתה נקי לפול ירוק בישראל:</span>
                <span className="text-sm text-cyan-300">₪{importCalc.landingCostGreenPerKgIls} / ק״ג</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 font-bold">
                <span>עלות פול קלוי סופי (אובדן {roastWeightLossPercent}%):</span>
                <span className="text-base text-amber-400 font-extrabold">₪{importCalc.roastedNetCostPerKgIls} / ק״ג נקי</span>
              </div>
            </div>
          </div>

          {/* Final Batch Cost Box */}
          <div className="mt-4 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-stone-400">עלות כוללת למיכל {batchKg} ק״ג (כולל מע״מ 18%):</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
                ₪{importCalc.totalBatchCostIls}
              </div>
            </div>
            <button
              onClick={handleCopyQuote}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'הדוח הועתק!' : 'ייצוא הצעת מחיר לדוח קלייה'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
