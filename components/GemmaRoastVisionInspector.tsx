'use client';

import React, { useState, useMemo } from 'react';
import {
  Flame,
  Eye,
  Sparkles,
  Activity,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Cpu,
  Volume2,
  Download,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface DefectPreset {
  id: string;
  name: string;
  hebrewName: string;
  agtron: number;
  defectRate: number;
  dtrPercent: number;
  severity: 'OPTIMAL' | 'MODERATE' | 'CRITICAL';
  defectType: string;
  visualCharacteristics: string;
  tasteImpact: string;
}

const DEFECT_PRESETS: DefectPreset[] = [
  {
    id: 'optimal-light',
    name: 'Specialty Light Roast (Gold Standard)',
    hebrewName: 'קליית ספשלטי בהירה מושלמת',
    agtron: 76,
    defectRate: 0.3,
    dtrPercent: 16.5,
    severity: 'OPTIMAL',
    defectType: 'ללא פגמים מורגשים (Clean Cup)',
    visualCharacteristics: 'צבע קינמון בהיר ואחיד, קו תפר (Center Cut) לבן נקי, התנפחות פול של 1.62x.',
    tasteImpact: 'חומציות פרי מבריקה, יסמין, פטל שחור, מתיקות סוכר קנים וסיומת משי.',
  },
  {
    id: 'quakers',
    name: 'Quakers / Immature Unripe Cherries',
    hebrewName: 'פולים בוסריים (Quakers)',
    agtron: 89,
    defectRate: 7.8,
    dtrPercent: 14.0,
    severity: 'MODERATE',
    defectType: 'חוסר בשלות בסוכרים טבעיים',
    visualCharacteristics: 'פולים צהבהבים בהירים שלא השחימו בתגובת מייארד עקב מחסור בסוכרים.',
    tasteImpact: 'טעם בוטנים בוסריים, קרטון יבש, עפיצות וחוסר מתיקות מובהק בכוס.',
  },
  {
    id: 'scorching',
    name: 'Scorching / Direct Drum Contact Burn',
    hebrewName: 'חריכת תוף ישירה (Scorching)',
    agtron: 46,
    defectRate: 11.5,
    dtrPercent: 21.0,
    severity: 'CRITICAL',
    defectType: 'טמפרטורת כניסה (Charge Temp) גבוהה מדי',
    visualCharacteristics: 'כתמים שחורים חרוכים בצידי הפול כתוצאה ממגע בתוף לוהט ומהירות תוף נמוכה.',
    tasteImpact: 'טעם מעושן, אפר סיגריות, מרירות צורבת ופגיעה בארומה הפרחונית.',
  },
  {
    id: 'tipping',
    name: 'Tipping / Embryo Tip Charring',
    hebrewName: 'כוויות קצה העובר (Tipping)',
    agtron: 54,
    defectRate: 6.4,
    dtrPercent: 19.5,
    severity: 'MODERATE',
    defectType: 'העלאת חום חדה מדי בשלב הפיצוץ הראשון',
    visualCharacteristics: 'שריפה ממוקדת בקצוות הפול (Tip) שבהם העובר נחשף לחום אינטנסיבי.',
    tasteImpact: 'מרירות עשבונית לא מאוזנת וסיומת יבשה וחרוכה.',
  },
];

export const GemmaRoastVisionInspector: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('optimal-light');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [chargeTemp, setChargeTemp] = useState<number>(205);
  const [targetDtr, setTargetDtr] = useState<number>(16.5);
  const [copied, setCopied] = useState<boolean>(false);

  const activePreset = useMemo(() => {
    return DEFECT_PRESETS.find((p) => p.id === selectedPresetId) || DEFECT_PRESETS[0];
  }, [selectedPresetId]);

  const handleSelectPreset = (preset: DefectPreset) => {
    setSelectedPresetId(preset.id);
    setIsScanning(true);
    coffeeSound.playBaristaClick();
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  // Dynamic SVG RoR Curve Generation Coordinates
  const curvePoints = useMemo(() => {
    // 0 to 600s (10 min roast)
    // ET Curve (200°C -> 170°C -> 230°C)
    // BT Curve (Charge 205°C -> TP 95°C @ 80s -> FC 196°C @ 500s -> Drop 208°C @ 600s)
    // RoR Curve (30°C/min -> 18°C/min -> 8°C/min -> 4°C/min)
    const width = 640;
    const height = 240;

    const btPoints = `M 20,${height - (chargeTemp - 80)} Q 120,${height - 40} 280,${height - 130} T 520,${height - 195} 620,${height - 215}`;
    const etPoints = `M 20,${height - 200} Q 120,${height - 160} 280,${height - 210} T 520,${height - 235} 620,${height - 238}`;
    const rorPoints = `M 20,${height - 220} Q 100,${height - 180} 280,${height - 120} T 520,${height - 60} 620,${height - 30}`;

    return { btPoints, etPoints, rorPoints, width, height };
  }, [chargeTemp]);

  const handleCopyReport = () => {
    const text = `🔬 דוח ניתוח פגמי קלייה Gemma Vision & RoR - The Digital Roast
דגם שנבדק: ${activePreset.hebrewName} (${activePreset.name})
ציון Agtron משוער: #${activePreset.agtron}
שיעור פגמים אופטיים: ${activePreset.defectRate}%
יחס פיתוח DTR%: ${activePreset.dtrPercent}%
טמפרטורת כניסה (Charge Temp): ${chargeTemp}°C

מאפיינים חזותיים:
${activePreset.visualCharacteristics}

השפעה על הטעם:
${activePreset.tasteImpact}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    coffeeSound.playBaristaClick();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 dir-rtl text-right">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-purple-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono border border-purple-500/30">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>GEMMA 31B MULTIMODAL VISION & SVG RoR ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
              מנתח פגמי קלייה חזותי & מחולל עקומות RoR וקטוריות
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              סריקה אופטית מתקדמת של פולים קלויים לזיהוי Quakers, Scorching ו-Tipping באמצעות מודל Gemma Multimodal, וייצור עקומת קצב עליית טמפרטורה (Rate of Rise) אינטראקטיבית ב-SVG מלא.
            </p>
          </div>

          {/* Agtron Gauge Badge */}
          <div className="bg-[#140e0b]/90 p-4 rounded-2xl border border-amber-500/40 shrink-0 text-center space-y-1">
            <div className="text-xs text-stone-400 font-mono">סולם צבע Agtron</div>
            <div className="text-3xl font-black font-mono text-amber-400">#{activePreset.agtron}</div>
            <div
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                activePreset.severity === 'OPTIMAL'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : activePreset.severity === 'MODERATE'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {activePreset.severity}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Optical Preset Selector */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-stone-200 flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-400" />
          <span>בחר פרופיל בדיקה אופטי לניתוח Gemma Vision</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEFECT_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/30 ring-1 ring-purple-500/40'
                    : 'bg-stone-900/70 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-stone-100">{preset.hebrewName}</div>
                  <div className="text-[11px] text-purple-300/80 font-medium mt-0.5">{preset.name}</div>
                  <div className="text-[10px] text-stone-400 mt-2 line-clamp-2">{preset.defectType}</div>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-800/70 flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-400">Agtron #{preset.agtron}</span>
                  <span
                    className={
                      preset.defectRate < 2 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'
                    }
                  >
                    {preset.defectRate}% פגמים
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: RoR Interactive Vector Canvas & Scan Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dynamic SVG RoR Graph (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 p-6 rounded-3xl bg-stone-900/90 border border-stone-800 backdrop-blur-2xl shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-stone-100">עקומת קצב עליית חום (RoR SVG Telemetry)</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                ET (סביבה)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                BT (פולים)
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                RoR (°C/min)
              </span>
            </div>
          </div>

          {/* SVG Vector Canvas */}
          <div className="relative w-full rounded-2xl bg-stone-950 p-4 border border-stone-800 overflow-hidden">
            <svg
              viewBox={`0 0 ${curvePoints.width} ${curvePoints.height}`}
              className="w-full h-56 sm:h-64"
            >
              {/* Grid Lines */}
              <line x1="20" y1="40" x2="620" y2="40" stroke="#262626" strokeDasharray="4,4" />
              <line x1="20" y1="100" x2="620" y2="100" stroke="#262626" strokeDasharray="4,4" />
              <line x1="20" y1="160" x2="620" y2="160" stroke="#262626" strokeDasharray="4,4" />
              <line x1="20" y1="220" x2="620" y2="220" stroke="#262626" />

              {/* Turning Point Marker */}
              <line x1="120" y1="20" x2="120" y2="220" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2,2" />
              <text x="125" y="35" fill="#06b6d4" fontSize="10" fontFamily="monospace">
                TP (1:20)
              </text>

              {/* First Crack Marker */}
              <line x1="520" y1="20" x2="520" y2="220" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
              <text x="450" y="35" fill="#f59e0b" fontSize="10" fontFamily="monospace">
                First Crack (8:45)
              </text>

              {/* Curves */}
              <path d={curvePoints.etPoints} fill="none" stroke="#ef4444" strokeWidth="2.5" />
              <path d={curvePoints.btPoints} fill="none" stroke="#f59e0b" strokeWidth="3" />
              <path d={curvePoints.rorPoints} fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,3" />

              {/* Drop Dot */}
              <circle cx="620" cy={curvePoints.height - 215} r="5" fill="#10b981" />
              <text x="560" y="70" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Drop (208°C)
              </text>
            </svg>
          </div>

          {/* Interactive Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                <span>טמפרטורת כניסה (Charge Temp)</span>
                <span className="text-amber-400 font-bold">{chargeTemp}°C</span>
              </div>
              <input
                type="range"
                min="180"
                max="225"
                value={chargeTemp}
                onChange={(e) => setChargeTemp(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                <span>יחס פיתוח יעד (DTR %)</span>
                <span className="text-cyan-400 font-bold">{targetDtr}%</span>
              </div>
              <input
                type="range"
                min="12"
                max="25"
                step="0.5"
                value={targetDtr}
                onChange={(e) => setTargetDtr(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Gemma Vision AI Insights & Defect Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 p-6 rounded-3xl bg-stone-900/90 border border-purple-500/30 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-bold text-stone-100">ממצאי סריקת Gemma Multimodal</span>
              </div>
              {isScanning && (
                <span className="text-xs font-mono text-purple-300 animate-pulse">מעבד תמונה...</span>
              )}
            </div>

            {/* Findings Box */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1.5">
                <div className="text-purple-300 font-bold">🔍 מאפיינים אופטיים שזוהו:</div>
                <p className="text-stone-300">{activePreset.visualCharacteristics}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1.5">
                <div className="text-amber-300 font-bold">☕ השפעה סנסורית על הכוס:</div>
                <p className="text-stone-300">{activePreset.tasteImpact}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono pt-1">
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                  <div className="text-[10px] text-stone-400">אחוז פגמים</div>
                  <div className="text-base font-extrabold text-stone-100">{activePreset.defectRate}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                  <div className="text-[10px] text-stone-400">התנפחות פול</div>
                  <div className="text-base font-extrabold text-emerald-400">1.62x</div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="pt-3 border-t border-stone-800">
            <button
              onClick={handleCopyReport}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'הדוח הועתק!' : 'ייצוא דוח אופטי & עקומת RoR'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
