'use client';

import React, { useState, useMemo } from 'react';
import {
  Database,
  Activity,
  TrendingUp,
  Coins,
  Clock,
  Sparkles,
  ShoppingBag,
  Send,
  Sliders,
  Code2,
  Check,
  Copy,
  Layers,
  Zap,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export const MongoRoastAnalyticsDashboard: React.FC = () => {
  const [dailyConsumptionGrams, setDailyConsumptionGrams] = useState<number>(45);
  const [currentStockGrams, setCurrentStockGrams] = useState<number>(320);
  const [selectedPipelineStage, setSelectedPipelineStage] = useState<string>('group-clv');
  const [copied, setCopied] = useState<boolean>(false);

  // Depletion calculations
  const depletionDaysRemaining = useMemo(() => {
    if (dailyConsumptionGrams <= 0) return 999;
    return Math.max(0, Math.round(currentStockGrams / dailyConsumptionGrams));
  }, [dailyConsumptionGrams, currentStockGrams]);

  // MongoDB Aggregation MQL Pipelines
  const aggregationPipelines: Record<string, { title: string; query: string; result: any }> = {
    'group-clv': {
      title: 'אגרגציית שווי לקוח (Customer Lifetime Value & RoastCoins)',
      query: `db.orders.aggregate([
  { $match: { status: "DELIVERED" } },
  { $group: {
      _id: "$userId",
      totalSpentIls: { $sum: "$totalPrice" },
      totalOrders: { $sum: 1 },
      avgOrderValue: { $avg: "$totalPrice" },
      accumulatedRoastCoins: { $sum: { $multiply: ["$totalPrice", 0.1] } }
  }},
  { $project: {
      clvTier: {
        $cond: { if: { $gte: ["$totalSpentIls", 1200] }, then: "VIP_BLACK", else: "GOLD_ROAST" }
      },
      totalSpentIls: 1,
      totalOrders: 1,
      avgOrderValue: { $round: ["$avgOrderValue", 2] }
  }},
  { $sort: { totalSpentIls: -1 } },
  { $limit: 5 }
])`,
      result: [
        { _id: 'usr_789412', totalSpentIls: 2450, totalOrders: 18, avgOrderValue: 136.11, clvTier: 'VIP_BLACK' },
        { _id: 'usr_334190', totalSpentIls: 1820, totalOrders: 12, avgOrderValue: 151.67, clvTier: 'VIP_BLACK' },
        { _id: 'usr_902144', totalSpentIls: 980, totalOrders: 7, avgOrderValue: 140.0, clvTier: 'GOLD_ROAST' },
      ],
    },
    'extraction-telemetry': {
      title: 'טלמטריית מיצוי ואיכות קלייה (Extraction Yield EY% Telemetry)',
      query: `db.roast_telemetry.aggregate([
  { $match: { roastDate: { $gte: ISODate("2026-08-01") } } },
  { $group: {
      _id: "$beanOrigin",
      avgAgtron: { $avg: "$agtronNumber" },
      avgExtractionYield: { $avg: "$measuredEyPercent" },
      avgTds: { $avg: "$measuredTds" },
      totalBatches: { $sum: 1 }
  }},
  { $project: {
      origin: "$_id",
      avgAgtron: { $round: ["$avgAgtron", 1] },
      avgExtractionYield: { $concat: [{ $toString: { $round: ["$avgExtractionYield", 2] } }, "%"] },
      avgTds: { $concat: [{ $toString: { $round: ["$avgTds", 2] } }, "%"] },
      totalBatches: 1
  }},
  { $sort: { avgExtractionYield: -1 } }
])`,
      result: [
        { origin: 'Ethiopia Yirgacheffe G1', avgAgtron: 76.2, avgExtractionYield: '20.85%', avgTds: '1.42%', totalBatches: 34 },
        { origin: 'Colombia Pink Bourbon', avgAgtron: 72.8, avgExtractionYield: '20.40%', avgTds: '1.39%', totalBatches: 28 },
        { origin: 'Panama Geisha', avgAgtron: 80.1, avgExtractionYield: '21.15%', avgTds: '1.46%', totalBatches: 12 },
      ],
    },
    'depletion-forecast': {
      title: 'חיזוי קצב שחיקת מלאי לקוחות (Automated WhatsApp Reorder Trigger)',
      query: `db.user_inventory.aggregate([
  { $project: {
      userId: 1,
      favoriteBean: 1,
      currentGrams: 1,
      dailyGramsRate: 1,
      daysLeft: { $floor: { $divide: ["$currentGrams", "$dailyGramsRate"] } }
  }},
  { $match: { daysLeft: { $lte: 5 } } },
  { $sort: { daysLeft: 1 } }
])`,
      result: [
        { userId: 'usr_789412', favoriteBean: 'Ethiopia Yirgacheffe', currentGrams: 90, dailyGramsRate: 45, daysLeft: 2 },
        { userId: 'usr_665201', favoriteBean: 'Colombia Huila', currentGrams: 140, dailyGramsRate: 35, daysLeft: 4 },
      ],
    },
  };

  const handleWhatsAppReorder = () => {
    const text = `היי The Digital Roast, נותרו לי כ-${currentStockGrams} גרם פולים (מספיק ל-${depletionDaysRemaining} ימים). אשמח להזמין מחדש 500 גרם אתיופיה ירגשף אנארובי!`;
    const url = `https://wa.me/972500000000?text=${encodeURIComponent(text)}`;
    coffeeSound.playBaristaClick();
    window.open(url, '_blank');
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(aggregationPipelines[selectedPipelineStage].query);
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
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>MONGODB AGGREGATION & ROAST TELEMETRY PIPELINE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
              דשבורד טלמטריית קלייה & אגרגציית CLV ב-MongoDB
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              צינורות אגרגציה חיים של MongoDB לניתוח ביצועי קלייה, חישוב שווי מחזור חיים של הלקוח (CLV), מעקב תפוקת מיצוי (EY%) וחיזוי מועדי חידוש מלאי אוטומטיים ב-WhatsApp.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-[#140e0b]/90 p-4 rounded-2xl border border-stone-800 shrink-0">
            <div className="text-center">
              <div className="text-xs text-stone-400 font-mono">ממוצע EY%</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">20.8%</div>
            </div>
            <div className="h-10 w-px bg-stone-800" />
            <div className="text-center">
              <div className="text-xs text-stone-400 font-mono">CLV ממוצע</div>
              <div className="text-2xl font-extrabold font-mono text-amber-400">₪1,420</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'סה״כ פולים שנקלו החודש', value: '420 kg', change: '+14.2%', icon: Activity, color: 'text-amber-400' },
          { label: 'תפוקת מיצוי ממוצעת (EY%)', value: '20.65%', change: 'Gold Cup', icon: Zap, color: 'text-cyan-400' },
          { label: 'יתרת RoastCoins פעילה', value: '48,500 RC', change: '84.2% שימוש', icon: Coins, color: 'text-yellow-400' },
          { label: 'חידושי מלאי אוטומטיים', value: '184 הזמנות', change: '96% המרה', icon: ShoppingBag, color: 'text-emerald-400' },
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400 font-mono">{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-2xl font-black text-stone-100">{m.value}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300">{m.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Pipeline Code & Depletion Forecaster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: MongoDB Aggregation Pipeline Viewer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 p-6 rounded-3xl bg-stone-900/90 border border-stone-800 backdrop-blur-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-stone-100">שאילתת אגרגציה MQL חיה (Pipeline)</span>
            </div>

            {/* Pipeline Stage Tabs */}
            <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
              {[
                { id: 'group-clv', label: 'CLV & VIP' },
                { id: 'extraction-telemetry', label: 'EY% Telemetry' },
                { id: 'depletion-forecast', label: 'שחיקת מלאי' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedPipelineStage(tab.id);
                    coffeeSound.playBaristaClick();
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedPipelineStage === tab.id
                      ? 'bg-emerald-500 text-stone-950 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* MQL Code Box */}
          <div className="relative p-4 rounded-2xl bg-stone-950 border border-stone-800 font-mono text-xs text-emerald-300/90 overflow-x-auto max-h-64 leading-relaxed">
            <button
              onClick={handleCopyQuery}
              className="absolute top-3 left-3 p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-[10px] flex items-center gap-1 border border-stone-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'הועתק!' : 'העתק MQL'}</span>
            </button>
            <pre className="text-[11px]">{aggregationPipelines[selectedPipelineStage].query}</pre>
          </div>

          {/* Aggregated Output Preview */}
          <div className="space-y-2">
            <div className="text-xs text-stone-400 font-mono">תוצאת צינור האגרגציה (JSON Records):</div>
            <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 font-mono text-[11px] text-stone-300 overflow-x-auto">
              <pre>{JSON.stringify(aggregationPipelines[selectedPipelineStage].result, null, 2)}</pre>
            </div>
          </div>
        </div>

        {/* Right: Automated Depletion Forecaster & WhatsApp Trigger (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 p-6 rounded-3xl bg-stone-900/90 border border-amber-500/30 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-stone-100">חיזוי שחיקת מלאי אישי</span>
              </div>
              <span
                className={`text-xs font-mono px-2.5 py-1 rounded-lg border font-bold ${
                  depletionDaysRemaining <= 4
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {depletionDaysRemaining <= 4 ? '⚠️ מלאי אוזל בקרוב' : '✅ מלאי תקין'}
              </span>
            </div>

            {/* Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                  <span>צריכה יומית ממוצעת</span>
                  <span className="text-amber-400 font-bold">{dailyConsumptionGrams} גרם (כ-{(dailyConsumptionGrams / 18).toFixed(1)} כוסות)</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={dailyConsumptionGrams}
                  onChange={(e) => setDailyConsumptionGrams(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                  <span>יתרת פולים נוכחית בשקית</span>
                  <span className="text-cyan-400 font-bold">{currentStockGrams} גרם</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="20"
                  value={currentStockGrams}
                  onChange={(e) => setCurrentStockGrams(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            {/* Days Left Highlight Card */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-center space-y-1">
              <div className="text-xs text-stone-400">מועד צפוי לסיום המלאי:</div>
              <div className="text-4xl font-black font-mono text-amber-400">
                {depletionDaysRemaining} <span className="text-sm font-normal text-stone-400">ימים</span>
              </div>
              <div className="text-[11px] text-stone-400">
                צפי לסיום: {new Date(Date.now() + depletionDaysRemaining * 86400000).toLocaleDateString('he-IL')}
              </div>
            </div>
          </div>

          {/* 1-Click WhatsApp Replenish Button */}
          <div className="pt-3 border-t border-stone-800">
            <button
              onClick={handleWhatsAppReorder}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>הזמן מחדש ב-WhatsApp בלחיצה אחת</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
