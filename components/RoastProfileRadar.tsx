'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Activity,
  Sliders,
  Sparkles,
  Compass,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Zap,
  Info,
  Layers,
  Download,
  Share2,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export interface ScaCuppingScores {
  fragranceAroma: number; // 6-10
  flavor: number; // 6-10
  aftertaste: number; // 6-10
  acidity: number; // 6-10
  body: number; // 6-10
  balance: number; // 6-10
  uniformity: number; // 6-10
  cleanCup: number; // 6-10
  sweetness: number; // 6-10
  overall: number; // 6-10
}

export interface RoastPreset {
  id: 'light-city' | 'medium-city' | 'full-city' | 'french-dark';
  name: string;
  hebrewName: string;
  agtronGourmet: number;
  agtronCommercial: number;
  colorHex: string;
  chargeTemp: number; // °C
  firstCrackTemp: number; // °C
  firstCrackTime: string; // "08:45"
  dropTemp: number; // °C
  dropTime: string; // "10:15"
  dtrPercent: number; // Development Time Ratio %
  rorSlope: number; // °C/min
  originMatch: string;
  notes: string[];
  scaScores: ScaCuppingScores;
  description: string;
}

const ROAST_PRESETS: RoastPreset[] = [
  {
    id: 'light-city',
    name: 'Light City / Cinnamon Roast',
    hebrewName: 'קלייה בהירה גורמה (Light City)',
    agtronGourmet: 88,
    agtronCommercial: 78,
    colorHex: '#c68a4c',
    chargeTemp: 195,
    firstCrackTemp: 198,
    firstCrackTime: '08:15',
    dropTemp: 205,
    dropTime: '09:45',
    dtrPercent: 14.5,
    rorSlope: 11.8,
    originMatch: 'אתיופיה ירגשף, פנמה גיישה, קניה AA',
    notes: ['פרחי יסמין', 'ברגמוט ציטרוסי', 'חומציות תפוח ירוק', 'דבש בר'],
    scaScores: {
      fragranceAroma: 9.5,
      flavor: 9.2,
      aftertaste: 8.8,
      acidity: 9.6,
      body: 7.2,
      balance: 8.9,
      uniformity: 9.8,
      cleanCup: 9.9,
      sweetness: 9.3,
      overall: 9.4,
    },
    description: 'קלייה קצרה המשמרת את הטרפנים המקוריים, החומציות הפרחונית והסוכרים הטבעיים של פולי Specialty בגידול גבהים מעל 2,000 מטר.',
  },
  {
    id: 'medium-city',
    name: 'Medium / City+ Roast',
    hebrewName: 'קלייה בינונית מאוזנת (City+)',
    agtronGourmet: 72,
    agtronCommercial: 64,
    colorHex: '#9b5d29',
    chargeTemp: 202,
    firstCrackTemp: 200,
    firstCrackTime: '08:40',
    dropTemp: 216,
    dropTime: '10:30',
    dtrPercent: 17.8,
    rorSlope: 9.2,
    originMatch: 'קולומביה סופרמו, קוסטה ריקה טראזו, גואטמלה',
    notes: ['קרמל מלוח', 'אגוזי לוז קלויים', 'משמש מיובש', 'שוקולד חלב'],
    scaScores: {
      fragranceAroma: 9.0,
      flavor: 9.1,
      aftertaste: 9.0,
      acidity: 8.4,
      body: 8.6,
      balance: 9.4,
      uniformity: 9.6,
      cleanCup: 9.5,
      sweetness: 9.2,
      overall: 9.2,
    },
    description: 'איזון מושלם בין פיתוח סוכרי מיילארד לבין חומציות פירותית עדינה. אידיאלי לאספרסו מודרני ולחליטות V60 מתקדמות.',
  },
  {
    id: 'full-city',
    name: 'Full City / Espresso Roast',
    hebrewName: 'קלייה כהה-בינונית לאספרסו (Full City)',
    agtronGourmet: 56,
    agtronCommercial: 50,
    colorHex: '#6a3818',
    chargeTemp: 208,
    firstCrackTemp: 202,
    firstCrackTime: '09:00',
    dropTemp: 224,
    dropTime: '11:15',
    dtrPercent: 20.2,
    rorSlope: 7.4,
    originMatch: 'ברזיל סנטוס, סומטרה מנדלינג, הודו מונסונד מלבר',
    notes: ['שוקולד מריר 70%', 'עץ ארז', 'קרמה סמיכה', 'אגוז מוסקט'],
    scaScores: {
      fragranceAroma: 8.6,
      flavor: 8.8,
      aftertaste: 9.3,
      acidity: 6.8,
      body: 9.5,
      balance: 8.8,
      uniformity: 9.4,
      cleanCup: 9.0,
      sweetness: 8.4,
      overall: 8.8,
    },
    description: 'פיתוח מיילארד וסוכרים עמוק, עם שמנים ארומטיים הניכרים על פני הפול. מעניק גוף כבד, קרמה מוזהבת ועמידות מושלמת בחלב.',
  },
  {
    id: 'french-dark',
    name: 'French / Dark Italian Roast',
    hebrewName: 'קלייה כהה איטלקית (French Roast)',
    agtronGourmet: 40,
    agtronCommercial: 36,
    colorHex: '#3a1f10',
    chargeTemp: 215,
    firstCrackTemp: 204,
    firstCrackTime: '09:15',
    dropTemp: 235,
    dropTime: '12:00',
    dtrPercent: 23.5,
    rorSlope: 5.1,
    originMatch: 'תערובות אספרסו איטלקיות, וייטנאם רובוסטה פרימיום',
    notes: ['קקאו מעושן', 'תבלינים חריפים', 'טבק עשיר', 'מרירות עמוקה'],
    scaScores: {
      fragranceAroma: 7.8,
      flavor: 8.0,
      aftertaste: 9.4,
      acidity: 5.2,
      body: 9.8,
      balance: 7.9,
      uniformity: 9.0,
      cleanCup: 8.2,
      sweetness: 7.0,
      overall: 8.1,
    },
    description: 'קלייה מסורתית אינטנסיבית המבליטה טעמי קלייה, עשן וקרמל שרוף, עם חומציות מופחתת ונוכחות דומיננטית.',
  },
];

export const RoastProfileRadar: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<RoastPreset>(ROAST_PRESETS[0]);
  const [comparisonPreset, setComparisonPreset] = useState<RoastPreset>(ROAST_PRESETS[2]);
  const [customAgtron, setCustomAgtron] = useState<number>(selectedPreset.agtronGourmet);
  const [isSimulatingRoast, setIsSimulatingRoast] = useState<boolean>(false);
  const [simTimeSeconds, setSimTimeSeconds] = useState<number>(0);
  const [simTemp, setSimTemp] = useState<number>(selectedPreset.chargeTemp);
  const [simRor, setSimRor] = useState<number>(selectedPreset.rorSlope);
  const [showComparison, setShowComparison] = useState<boolean>(true);

  const roastCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Calculate Total SCA Cupping Score
  const calculateTotalSca = (scores: ScaCuppingScores): number => {
    const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
    return Number(total.toFixed(1));
  };

  // Switch Preset Handler
  const handleSelectPreset = (preset: RoastPreset) => {
    coffeeSound.playBaristaClick();
    setSelectedPreset(preset);
    setCustomAgtron(preset.agtronGourmet);
    setSimTemp(preset.chargeTemp);
    setSimRor(preset.rorSlope);
    setSimTimeSeconds(0);
    setIsSimulatingRoast(false);
  };

  // Thermal RoR Curve Simulator
  useEffect(() => {
    if (!isSimulatingRoast) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const interval = setInterval(() => {
      setSimTimeSeconds((prev) => {
        const nextTime = prev + 5;
        if (nextTime >= 720) {
          setIsSimulatingRoast(false);
          coffeeSound.playSuccessChime();
          return 720;
        }

        // Realistic RoR curve physics
        const progress = nextTime / 720;
        const targetDrop = selectedPreset.dropTemp;
        const currentT = selectedPreset.chargeTemp + (targetDrop - selectedPreset.chargeTemp) * Math.sin(progress * (Math.PI / 2));
        const currentRor = Math.max(2, selectedPreset.rorSlope * (1 - progress * 0.7));

        setSimTemp(Number(currentT.toFixed(1)));
        setSimRor(Number(currentRor.toFixed(1)));

        return nextTime;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isSimulatingRoast, selectedPreset]);

  // Render RoR Thermal Canvas Graph
  useEffect(() => {
    const canvas = roastCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#0a0808';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.lineWidth = 1;

    for (let x = 40; x < width - 20; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 30);
      ctx.stroke();
    }

    for (let y = 30; y < height - 30; y += 40) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Phase Highlights: Drying (0-4m), Maillard (4-8m), Development (8m+)
    const dryX = 40 + (width - 60) * (240 / 720);
    const maillardX = 40 + (width - 60) * (500 / 720);

    // Drying Zone
    ctx.fillStyle = 'rgba(234, 179, 8, 0.05)';
    ctx.fillRect(40, 20, dryX - 40, height - 50);

    // Maillard Zone
    ctx.fillStyle = 'rgba(249, 115, 22, 0.08)';
    ctx.fillRect(dryX, 20, maillardX - dryX, height - 50);

    // Development Zone
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
    ctx.fillRect(maillardX, 20, width - 20 - maillardX, height - 50);

    // Phase Labels
    ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.font = '10px monospace';
    ctx.fillText('ייבוש (Drying)', 45, 35);
    ctx.fillText('מיילארד (Maillard)', dryX + 10, 35);
    ctx.fillText('פיתוח (First Crack)', maillardX + 10, 35);

    // Draw Selected Preset Temperature Curve (Bean Temp - BT)
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;

    const pointsCount = 60;
    for (let i = 0; i <= pointsCount; i++) {
      const tNorm = i / pointsCount;
      const x = 40 + tNorm * (width - 60);
      const tempVal =
        selectedPreset.chargeTemp +
        (selectedPreset.dropTemp - selectedPreset.chargeTemp) * Math.sin(tNorm * (Math.PI / 2));
      // Map temp 150-250 to canvas height
      const y = height - 40 - ((tempVal - 150) / 100) * (height - 80);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Rate of Rise (RoR) Curve
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    for (let i = 0; i <= pointsCount; i++) {
      const tNorm = i / pointsCount;
      const x = 40 + tNorm * (width - 60);
      const rorVal = selectedPreset.rorSlope * (1 - tNorm * 0.7);
      const y = height - 40 - (rorVal / 18) * (height - 120);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Live Simulator Cursor
    if (simTimeSeconds > 0) {
      const curX = 40 + (simTimeSeconds / 720) * (width - 60);
      const curY = height - 40 - ((simTemp - 150) / 100) * (height - 80);

      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vertical marker line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.moveTo(curX, 20);
      ctx.lineTo(curX, height - 30);
      ctx.stroke();
    }
  }, [selectedPreset, simTimeSeconds, simTemp, simRor]);

  // SCA 10-Axis Spider Radar SVG Calculations
  const radarRadius = 110;
  const radarCenter = 135;

  const scaAttributes: Array<{ label: string; key: keyof ScaCuppingScores; angle: number }> = [
    { label: 'ארומה (Fragrance)', key: 'fragranceAroma', angle: -90 },
    { label: 'טעם (Flavor)', key: 'flavor', angle: -54 },
    { label: 'סיומת (Aftertaste)', key: 'aftertaste', angle: -18 },
    { label: 'חומציות (Acidity)', key: 'acidity', angle: 18 },
    { label: 'גוף (Body)', key: 'body', angle: 54 },
    { label: 'איזון (Balance)', key: 'balance', angle: 90 },
    { label: 'אחידות (Uniformity)', key: 'uniformity', angle: 126 },
    { label: 'ספל נקי (Clean Cup)', key: 'cleanCup', angle: 162 },
    { label: 'מתיקות (Sweetness)', key: 'sweetness', angle: 198 },
    { label: 'כללי (Overall)', key: 'overall', angle: 234 },
  ];

  const getCoordinates = (value: number, angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    // Map value 5-10 to radius
    const normalized = Math.max(0, (value - 5) / 5);
    const r = normalized * radarRadius;
    const x = radarCenter + r * Math.cos(angleRad);
    const y = radarCenter + r * Math.sin(angleRad);
    return { x, y };
  };

  const selectedRadarPoints = scaAttributes
    .map((attr) => {
      const val = selectedPreset.scaScores[attr.key];
      const { x, y } = getCoordinates(val, attr.angle);
      return `${x},${y}`;
    })
    .join(' ');

  const comparisonRadarPoints = scaAttributes
    .map((attr) => {
      const val = comparisonPreset.scaScores[attr.key];
      const { x, y } = getCoordinates(val, attr.angle);
      return `${x},${y}`;
    })
    .join(' ');

  const totalSelectedScore = calculateTotalSca(selectedPreset.scaScores);
  const totalCompScore = calculateTotalSca(comparisonPreset.scaScores);

  return (
    <section id="roast-profile-radar" className="w-full space-y-10 dir-rtl">
      {/* 1. Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>AI Roast Curve Analytics & SCA Cupping Radar</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-100 tracking-tight">
          רדאר קלייה בבינה מלאכותית <span className="text-gold-gradient">& מדד Agtron SCA</span>
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          ניתוח קו קלייה תרמי בזמן אמת, השוואת ציוני Cupping לפי פרוטוקול SCA הבינלאומי (10 פרמטרים),
          והתאמת סקאלת הצבעים של Agtron Gourmet לפולי מקור נבחרים.
        </p>
      </div>

      {/* 2. Preset Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ROAST_PRESETS.map((preset) => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-4 rounded-2xl border text-right transition-all group ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-[#141010] border-stone-800 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-5 h-5 rounded-full border border-stone-700 shadow-sm"
                  style={{ backgroundColor: preset.colorHex }}
                />
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800">
                  Agtron #{preset.agtronGourmet}
                </span>
              </div>
              <div className="text-xs font-black text-stone-100 group-hover:text-amber-300">
                {preset.hebrewName}
              </div>
              <div className="text-[10px] text-stone-400 mt-1 truncate">
                DTR: {preset.dtrPercent}% • RoR: {preset.rorSlope}°C/min
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Main Dashboard: Radar Cupping (Left) + Thermal Curve RoR (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: SCA 10-Axis Spider Radar (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl liquid-glass border border-amber-500/30 space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-black text-stone-100">רדאר ציוני SCA Cupping</h3>
                <p className="text-[10px] text-stone-400">10 מדדי איכות טעימה מקצועיים (קנה מידה 6-10)</p>
              </div>
            </div>

            <div className="text-left">
              <span className="text-xs text-stone-400 block font-mono">ציון SCA משוער</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {totalSelectedScore}/100
              </span>
            </div>
          </div>

          {/* Interactive Radar SVG */}
          <div className="relative flex items-center justify-center py-2">
            <svg width="270" height="270" viewBox="0 0 270 270" className="overflow-visible">
              {/* Concentric Guide Circles (6, 7, 8, 9, 10) */}
              {[1, 2, 3, 4, 5].map((level) => {
                const r = (level / 5) * radarRadius;
                return (
                  <circle
                    key={level}
                    cx={radarCenter}
                    cy={radarCenter}
                    r={r}
                    fill="none"
                    stroke="rgba(245, 158, 11, 0.15)"
                    strokeDasharray="3 3"
                  />
                );
              })}

              {/* Radial Spokes */}
              {scaAttributes.map((attr) => {
                const { x, y } = getCoordinates(10, attr.angle);
                return (
                  <line
                    key={attr.key}
                    x1={radarCenter}
                    y1={radarCenter}
                    x2={x}
                    y2={y}
                    stroke="rgba(245, 158, 11, 0.2)"
                  />
                );
              })}

              {/* Comparison Polygon (Dark/Reference) */}
              {showComparison && (
                <polygon
                  points={comparisonRadarPoints}
                  fill="rgba(56, 189, 248, 0.15)"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              )}

              {/* Selected Preset Polygon */}
              <polygon
                points={selectedRadarPoints}
                fill="rgba(245, 158, 11, 0.35)"
                stroke="#f59e0b"
                strokeWidth="2.5"
                className="transition-all duration-500"
              />

              {/* Attribute Vertex Labels */}
              {scaAttributes.map((attr) => {
                const { x, y } = getCoordinates(10.8, attr.angle);
                const val = selectedPreset.scaScores[attr.key];
                return (
                  <text
                    key={attr.key}
                    x={x}
                    y={y}
                    fontSize="9"
                    fontWeight="bold"
                    fill="#e7e5e4"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {attr.label.split(' ')[0]} ({val})
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Comparison Legend & Selector */}
          <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="text-amber-300 font-bold">{selectedPreset.name.split('/')[0]}</span>
              </div>
              {showComparison && (
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
                  <span className="text-cyan-300 font-bold">{comparisonPreset.name.split('/')[0]} ({totalCompScore})</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-[11px] text-stone-400 hover:text-stone-200 underline font-mono"
            >
              {showComparison ? 'הסתר השוואה' : 'הצג השוואת Dark'}
            </button>
          </div>

          {/* Cupping Attribute Highlights Table */}
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-950/80 p-3 rounded-2xl border border-stone-800">
            <div className="flex justify-between">
              <span className="text-stone-400">חומציות (Acidity):</span>
              <span className="text-amber-400 font-bold font-mono">{selectedPreset.scaScores.acidity}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">גוף (Body):</span>
              <span className="text-amber-400 font-bold font-mono">{selectedPreset.scaScores.body}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">ארומה (Fragrance):</span>
              <span className="text-amber-400 font-bold font-mono">{selectedPreset.scaScores.fragranceAroma}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">מתיקות (Sweetness):</span>
              <span className="text-amber-400 font-bold font-mono">{selectedPreset.scaScores.sweetness}/10</span>
            </div>
          </div>
        </div>

        {/* Right Column: Thermal RoR Curve & Agtron Index (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Thermal Canvas Card */}
          <div className="p-6 rounded-3xl liquid-glass border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-black text-stone-100">גרף קלייה תרמי וקצב עלייה (RoR Curve)</h3>
                  <p className="text-[10px] text-stone-400">מעקב אחר פאזות הייבוש, תגובת מיילארד ו-First Crack</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    coffeeSound.playBaristaClick();
                    setIsSimulatingRoast(!isSimulatingRoast);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                    isSimulatingRoast
                      ? 'bg-rose-500 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 hover:brightness-110 shadow-md shadow-amber-500/20'
                  }`}
                >
                  {isSimulatingRoast ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>עצור סימולציה</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>הפעל סימולציית RoR</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Canvas Graph View */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-[#0a0808]">
              <canvas
                ref={roastCanvasRef}
                width={540}
                height={220}
                className="w-full h-56 block"
              />
            </div>

            {/* RoR Telemetry Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-0.5">
                <span className="text-[10px] text-stone-400 block">טמפ' כניסה (Charge)</span>
                <span className="text-sm font-black text-amber-300 font-mono">{selectedPreset.chargeTemp}°C</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-0.5">
                <span className="text-[10px] text-stone-400 block">First Crack Time</span>
                <span className="text-sm font-black text-amber-300 font-mono">{selectedPreset.firstCrackTime} min</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-0.5">
                <span className="text-[10px] text-stone-400 block">יחס פיתוח (DTR)</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{selectedPreset.dtrPercent}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-0.5">
                <span className="text-[10px] text-stone-400 block">טמפ' הוצאה (Drop)</span>
                <span className="text-sm font-black text-orange-400 font-mono">{selectedPreset.dropTemp}°C</span>
              </div>
            </div>
          </div>

          {/* Agtron Color Scale & Origin Bean Matching Card */}
          <div className="p-6 rounded-3xl liquid-glass border border-amber-500/30 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-black text-stone-100">מדד סקאלת Agtron לקביעת דרגת קלייה</h3>
                  <p className="text-[10px] text-stone-400">התאמת צבע ספקטרומטרית לפי תקן Agtron Gourmet (25-95)</p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                Gourmet: {customAgtron} • Commercial: {Math.round(customAgtron * 0.88)}
              </span>
            </div>

            {/* Agtron Slider & Color Gradient Bar */}
            <div className="space-y-2">
              <div className="h-6 rounded-xl overflow-hidden border border-stone-700 flex shadow-inner">
                <div className="flex-1 bg-[#d7934d] flex items-center justify-center text-[9px] font-bold text-black font-mono">90 Light</div>
                <div className="flex-1 bg-[#a96830] flex items-center justify-center text-[9px] font-bold text-black font-mono">75 Med</div>
                <div className="flex-1 bg-[#723e1b] flex items-center justify-center text-[9px] font-bold text-white font-mono">55 Dark</div>
                <div className="flex-1 bg-[#3a1d0f] flex items-center justify-center text-[9px] font-bold text-white font-mono">35 Italian</div>
              </div>

              <input
                type="range"
                min="35"
                max="95"
                value={customAgtron}
                onChange={(e) => {
                  coffeeSound.playSliderTick();
                  setCustomAgtron(Number(e.target.value));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Origin Compatibility & Flavor Notes */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400 font-medium">פולי מקור אידיאליים לפרופיל:</span>
                <span className="text-amber-300 font-bold">{selectedPreset.originMatch}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedPreset.notes.map((note) => (
                  <span
                    key={note}
                    className="px-2.5 py-1 rounded-lg bg-stone-900 text-[10px] text-amber-400 font-bold border border-amber-500/20"
                  >
                    ✦ {note}
                  </span>
                ))}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed pt-1">
                {selectedPreset.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
