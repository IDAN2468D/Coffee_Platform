'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Sparkles,
  Star,
  Award,
  Activity,
  Layers,
  Sliders,
  Download,
  Copy,
  Check,
  Coffee,
  Globe,
  Tag,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface CuppingOriginPreset {
  id: string;
  name: string;
  hebrewName: string;
  origin: string;
  process: string;
  altitudeMeters: number;
  expectedScore: number;
  scores: {
    fragranceAroma: number;
    flavor: number;
    aftertaste: number;
    acidity: number;
    body: number;
    balance: number;
    overall: number;
  };
  descriptors: string[];
}

const CUPPING_PRESETS: CuppingOriginPreset[] = [
  {
    id: 'panama-geisha-washed',
    name: 'Panama Hacienda La Esmeralda Geisha',
    hebrewName: 'פנמה גיישה לה אסמרלדה',
    origin: 'Boquete, Panama',
    process: 'Washed',
    altitudeMeters: 1850,
    expectedScore: 94.5,
    scores: { fragranceAroma: 9.75, flavor: 9.5, aftertaste: 9.25, acidity: 9.5, body: 8.75, balance: 9.5, overall: 9.5 },
    descriptors: ['יסמין', 'ברגמוט', 'אפרסק לבן', 'דבש פרחים', 'סיומת משי'],
  },
  {
    id: 'ethiopia-yirgacheffe-anaerobic',
    name: 'Ethiopia Yirgacheffe Anaerobic Natural',
    hebrewName: 'אתיופיה יירגאשף אנאירובי טבעי',
    origin: 'Yirgacheffe, Gedeo',
    process: 'Anaerobic Natural (72h)',
    altitudeMeters: 2100,
    expectedScore: 91.0,
    scores: { fragranceAroma: 9.25, flavor: 9.25, aftertaste: 8.75, acidity: 9.0, body: 8.75, balance: 9.0, overall: 9.0 },
    descriptors: ['תות שדה בר', 'פאפיה', 'יין אדום', 'שוקולד רובי'],
  },
  {
    id: 'kenya-sl28-washed',
    name: 'Kenya Nyeri Hill SL28 / SL34',
    hebrewName: 'קניה ניירי היל SL28',
    origin: 'Nyeri, Kenya',
    process: 'Double Washed',
    altitudeMeters: 1950,
    expectedScore: 89.5,
    scores: { fragranceAroma: 9.0, flavor: 9.0, aftertaste: 8.5, acidity: 9.5, body: 8.5, balance: 8.75, overall: 8.75 },
    descriptors: ['דומדמניות שחורות', 'אשכולית אדומה', 'עגבניה מתוקה', 'קנה סוכר'],
  },
  {
    id: 'colombia-pink-bourbon',
    name: 'Colombia Huila Pink Bourbon Honey',
    hebrewName: 'קולומביה פינק בורבון האני',
    origin: 'Huila, Colombia',
    process: 'Honey Process',
    altitudeMeters: 1750,
    expectedScore: 88.5,
    scores: { fragranceAroma: 8.75, flavor: 8.75, aftertaste: 8.5, acidity: 8.75, body: 8.75, balance: 8.75, overall: 8.75 },
    descriptors: ['פסיפלורה', 'מנגו', 'קרמל דבש', 'פרחי הדר'],
  },
];

const FLAVOR_CATEGORIES = [
  { name: 'פרחוני (Floral)', items: ['יסמין', 'פרחי הדרים', 'ורדים', 'קמומיל'] },
  { name: 'פירותי (Fruity)', items: ['ברגמוט', 'אפרסק לבן', 'פטל שחור', 'תות בר', 'פאפיה'] },
  { name: 'מתוק & קרמל (Sweet)', items: ['דבש פרחים', 'סוכר קנים', 'קרמל מלוח', 'מייפל'] },
  { name: 'קקאו & אגוזים (Nutty/Cocoa)', items: ['שוקולד מריר 85%', 'קקאו עשיר', 'שקדים קלויים', 'פקאן'] },
  { name: 'תבלינים & עץ (Spices)', items: ['קינמון ציילוני', 'הל', 'עץ אלון', 'פלפל אנגלי'] },
];

export const SCACuppingRadar3D: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('panama-geisha-washed');
  const [scores, setScores] = useState(CUPPING_PRESETS[0].scores);
  const [selectedDescriptors, setSelectedDescriptors] = useState<string[]>(CUPPING_PRESETS[0].descriptors);
  const [copiedSheet, setCopiedSheet] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentPreset = useMemo(() => {
    return CUPPING_PRESETS.find((p) => p.id === selectedPresetId) || CUPPING_PRESETS[0];
  }, [selectedPresetId]);

  // Compute 100-Point SCA Score
  const calculatedScaScore = useMemo(() => {
    // 8 categories: Fragrance, Flavor, Aftertaste, Acidity, Body, Balance, Overall + Clean Cup (10) + Uniformity (10) + Sweetness (10)
    // SCA Form standard: Sum of attributes (out of 10) + 30 base points
    const sum =
      scores.fragranceAroma +
      scores.flavor +
      scores.aftertaste +
      scores.acidity +
      scores.body +
      scores.balance +
      scores.overall;
    // Standard baseline adds 10 (Clean) + 10 (Uniformity) + 10 (Sweetness)
    return Number((sum + 30).toFixed(2));
  }, [scores]);

  const scoreTier = useMemo(() => {
    if (calculatedScaScore >= 90) return { label: 'Outstanding (דרגת נשיאותית)', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' };
    if (calculatedScaScore >= 85) return { label: 'Excellent (ספשלטי מובחר)', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' };
    if (calculatedScaScore >= 80) return { label: 'Very Good (ספשלטי תקני)', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' };
    return { label: 'Commercial Grade (מסחרי)', color: 'text-stone-400 border-stone-500/40 bg-stone-500/10' };
  }, [calculatedScaScore]);

  // Select Preset
  const handleSelectPreset = (preset: CuppingOriginPreset) => {
    setSelectedPresetId(preset.id);
    setScores(preset.scores);
    setSelectedDescriptors(preset.descriptors);
    coffeeSound.playBaristaClick();
    fetchAiCuppingReview(preset);
  };

  // Toggle Descriptor
  const toggleDescriptor = (desc: string) => {
    coffeeSound.playBaristaClick();
    setSelectedDescriptors((prev) =>
      prev.includes(desc) ? prev.filter((d) => d !== desc) : [...prev, desc]
    );
  };

  // Draw 3D-styled Radar on Canvas
  const drawRadarChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(w, h) * 0.38;

    const axes = [
      { key: 'fragranceAroma', label: 'Aroma (ארומה)' },
      { key: 'flavor', label: 'Flavor (טעם)' },
      { key: 'aftertaste', label: 'Aftertaste (סיומת)' },
      { key: 'acidity', label: 'Acidity (חומציות)' },
      { key: 'body', label: 'Body (גוף)' },
      { key: 'balance', label: 'Balance (איזון)' },
      { key: 'overall', label: 'Overall (כללי)' },
    ];

    const totalAxes = axes.length;
    const angleStep = (Math.PI * 2) / totalAxes;

    // 1. Draw Concentric Grid Rings
    for (let r = 0.2; r <= 1.0; r += 0.2) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= totalAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius * r;
        const y = centerY + Math.sin(angle) * radius * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 2. Draw Spokes and Labels
    axes.forEach((axis, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const endX = centerX + Math.cos(angle) * radius;
      const endY = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Text Labels
      const labelX = centerX + Math.cos(angle) * (radius + 24);
      const labelY = centerY + Math.sin(angle) * (radius + 24);
      ctx.fillStyle = '#f3f4f6';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(axis.label, labelX, labelY);
    });

    // 3. Draw Radar Area Polygon (Gradient Liquid Glass)
    ctx.beginPath();
    axes.forEach((axis, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const val = (scores as any)[axis.key] || 8.0; // 6 to 10 scale
      const normalized = Math.max(0.1, (val - 5.0) / 5.0); // 0 to 1
      const x = centerX + Math.cos(angle) * radius * normalized;
      const y = centerY + Math.sin(angle) * radius * normalized;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    // Fill with glossy radial gradient
    const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
    grad.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
    grad.addColorStop(1, 'rgba(217, 119, 6, 0.15)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Data Point Nodes
    axes.forEach((axis, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const val = (scores as any)[axis.key] || 8.0;
      const normalized = Math.max(0.1, (val - 5.0) / 5.0);
      const x = centerX + Math.cos(angle) * radius * normalized;
      const y = centerY + Math.sin(angle) * radius * normalized;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [scores]);

  // Fetch AI Cupping Review
  const fetchAiCuppingReview = async (preset = currentPreset) => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/cupping-radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: preset.name,
          process: preset.process,
          altitudeMeters: preset.altitudeMeters,
          selectedDescriptors,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiAnalysis(data.data);
      }
    } catch (err) {
      console.warn('Cupping review failed', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    drawRadarChart();
  }, [drawRadarChart, scores]);

  useEffect(() => {
    fetchAiCuppingReview();
  }, []);

  const handleCopySheet = () => {
    const sheet = `=== תעודת קאפינג SCA 100-POINT RADAR (THE DIGITAL ROAST) ===
מדגם: ${currentPreset.hebrewName} (${currentPreset.origin})
תהליך: ${currentPreset.process} | גובה: ${currentPreset.altitudeMeters}m
ציון SCA רשמי: ${calculatedScaScore} (${scoreTier.label})
פירוט סנסורי:
- ארומה: ${scores.fragranceAroma}
- טעם: ${scores.flavor}
- סיומת: ${scores.aftertaste}
- חומציות: ${scores.acidity}
- גוף: ${scores.body}
- איזון: ${scores.balance}
- כללי: ${scores.overall}
תווי טעם מאושרים: ${selectedDescriptors.join(', ')}
סיכום Q-Grader: ${aiAnalysis?.cuppingSummary || 'קפה ספשלטי יוצא דופן'}
המלצת קלייה: ${aiAnalysis?.recommendedRoastProfile || 'Light City'}`;

    navigator.clipboard.writeText(sheet);
    setCopiedSheet(true);
    coffeeSound.playBaristaClick();
    setTimeout(() => setCopiedSheet(false), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 dir-rtl text-right font-sans">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#120d0a] via-[#1a120c] to-[#0a0705] border border-amber-500/30 p-6 sm:p-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold tracking-wide">
              <Star className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>3D SCA CUPPING RADAR & 100-PT PREDICTOR</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-100 tracking-tight leading-tight">
              גלגל טעמים תלת-ממדי & ציון <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-300 to-orange-400">SCA 100-Point</span>
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              מערכת קאפינג וירטואלית להערכת איכות ספשלטי לפי הפרוטוקול הרשמי של Specialty Coffee Association, חישוב ציון 100 נקודות וסינתזת תווי טעם ב-Gemini 3.5 Flash Lite.
            </p>
          </div>

          {/* Quick Score Badge */}
          <div className="flex items-center gap-4 bg-stone-950/80 backdrop-blur-xl border-2 border-pink-500/40 p-5 rounded-2xl shadow-xl shrink-0 font-mono">
            <div className="text-center">
              <div className="text-[10px] text-stone-400">SCA 100-PT SCORE</div>
              <div className="text-4xl font-black text-amber-300">{calculatedScaScore}</div>
              <div className="text-[10px] text-pink-400 font-bold mt-0.5">{scoreTier.label.split(' ')[0]}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Origin Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-stone-200 font-bold text-sm">
            <Globe className="w-4 h-4 text-pink-400" />
            <span>בחר מדגם קאפינג מהעולם:</span>
          </div>
          <span className="text-xs text-stone-400 font-mono">4 זני עילית</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CUPPING_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-pink-500/15 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.25)] ring-1 ring-pink-400/50'
                    : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-mono font-bold text-pink-400">{preset.altitudeMeters}m</span>
                  <span className="text-xs font-mono font-black text-amber-300">SCA {preset.expectedScore}</span>
                </div>
                <div className="text-sm font-black text-stone-100">{preset.hebrewName}</div>
                <div className="text-xs text-stone-400">{preset.process}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Cockpit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Radar Canvas Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-[#0e0a08] border border-pink-500/30 p-6 space-y-6 shadow-xl backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-bold text-stone-200">רדאר סנסורי 7 ממדים (Sensory Radar):</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${scoreTier.color}`}>
                {scoreTier.label}
              </span>
            </div>

            {/* Radar Canvas */}
            <div className="w-full aspect-square max-w-[480px] mx-auto rounded-2xl bg-stone-950/60 border border-stone-800/80 p-3 relative flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={480}
                height={480}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Selected Flavor Descriptors Cloud */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-stone-300">תווי טעם פעילים (Flavor Descriptors):</div>
              <div className="flex flex-wrap gap-2">
                {selectedDescriptors.map((desc) => (
                  <span
                    key={desc}
                    className="px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-200 border border-pink-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Tag className="w-3 h-3 text-pink-400" />
                    <span>{desc}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sensory Sliders & Q-Grader Review (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#0e0a08] border border-pink-500/30 p-6 space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-pink-400" />
              <span>כיול ציוני קאפינג (6.0 - 10.0)</span>
            </h3>

            {/* Sliders for 7 axes */}
            <div className="space-y-3">
              {[
                { key: 'fragranceAroma', label: 'ארומה & בישום (Fragrance/Aroma)' },
                { key: 'flavor', label: 'עושר טעם (Flavor)' },
                { key: 'aftertaste', label: 'סיומת & אפטרטייסט (Aftertaste)' },
                { key: 'acidity', label: 'חומציות פרי מבריקה (Acidity)' },
                { key: 'body', label: 'גוף ומרקם (Body)' },
                { key: 'balance', label: 'איזון והרמוניה (Balance)' },
                { key: 'overall', label: 'הערכה כללית (Overall)' },
              ].map(({ key, label }) => {
                const val = (scores as any)[key];
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-stone-300">
                      <span>{label}:</span>
                      <span className="font-mono text-pink-400">{val.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="10.0"
                      step="0.25"
                      value={val}
                      onChange={(e) => {
                        const newVal = Number(e.target.value);
                        setScores((prev) => ({ ...prev, [key]: newVal }));
                      }}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            {/* Gemini Q-Grader Review Box */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-pink-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-300">
                <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
                <span>הערכת שופט Q-Grader (Gemini 3.5 Flash Lite):</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {aiAnalysis?.cuppingSummary || 'מורכבות פירותית יוצאת דופן עם חומציות ליים מבריקה ואיזון מופתי.'}
              </p>
              <div className="text-[11px] font-mono text-amber-300 pt-2 border-t border-stone-800">
                קלייה מומלצת: {aiAnalysis?.recommendedRoastProfile || 'Light City (Agtron #82)'}
              </div>
            </div>

            {/* Export Cupping Sheet */}
            <button
              onClick={handleCopySheet}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 transition-all transform active:scale-95"
            >
              {copiedSheet ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{copiedSheet ? 'דוח הקאפינג הועתק!' : 'הפק תעודת קאפינג SCA 100-Point'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SCACuppingRadar3D;
