'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Printer,
  Upload,
  RotateCcw,
  Play,
  CheckCircle2,
  Sliders,
  Maximize2,
  Brush,
  Download,
  Info,
  Droplets,
  Box,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface PresetArt {
  id: string;
  name: string;
  hebrewName: string;
  category: string;
  foamHeight: number; // mm (1-25)
  density: number; // % cocoa
  svgPaths: string[];
}

const PRESET_ARTS: PresetArt[] = [
  {
    id: 'rosetta-3d',
    name: 'Classic 3D Rosetta',
    hebrewName: 'רוזטה 3D פיסולית',
    category: 'קלאסיקה',
    foamHeight: 14,
    density: 85,
    svgPaths: [
      'M 150 240 Q 150 100 150 50',
      'M 150 180 C 100 160 80 130 150 140 C 220 130 200 160 150 180',
      'M 150 140 C 110 120 90 90 150 100 C 210 90 190 120 150 140',
      'M 150 100 C 120 80 100 60 150 70 C 200 60 180 80 150 100',
    ],
  },
  {
    id: 'tulip-multi-layer',
    name: 'Multi-Layered 3D Tulip',
    hebrewName: 'טוליפ תלת-מימדי מרובה שכבות',
    category: 'מתקדם',
    foamHeight: 18,
    density: 90,
    svgPaths: [
      'M 150 230 C 90 180 90 120 150 160 C 210 120 210 180 150 230',
      'M 150 170 C 100 130 100 80 150 120 C 200 80 200 130 150 170',
      'M 150 120 C 110 90 110 50 150 80 C 190 50 190 90 150 120',
    ],
  },
  {
    id: 'bear-sculpture',
    name: 'Cute 3D Teddy Bear',
    hebrewName: 'דובי קצף תלת-מימדי בולט',
    category: 'פיסול תלת מימד',
    foamHeight: 22,
    density: 95,
    svgPaths: [
      'M 150 170 A 50 50 0 1 0 150 70 A 50 50 0 1 0 150 170', // Head
      'M 105 85 A 18 18 0 1 0 95 60', // Left Ear
      'M 195 85 A 18 18 0 1 1 205 60', // Right Ear
      'M 150 140 A 20 15 0 1 0 150 110 A 20 15 0 1 0 150 140', // Snout
    ],
  },
];

export const ArLatteArtPrinter: React.FC = () => {
  const [selectedArt, setSelectedArt] = useState<PresetArt>(PRESET_ARTS[0]);
  const [foamDepth, setFoamDepth] = useState<number>(selectedArt.foamHeight); // 1 - 25 mm
  const [cocoaDensity, setCocoaDensity] = useState<number>(selectedArt.density); // 10 - 100 %
  const [nozzleSpeed, setNozzleSpeed] = useState<number>(45); // mm/s
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printProgress, setPrintProgress] = useState<number>(0);
  const [gcodeOutput, setGcodeOutput] = useState<string>('');

  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const userStrokesRef = useRef<Array<Array<{ x: number; y: number }>>>([]);

  // Canvas interactive drawing setup
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and set background grid
    ctx.fillStyle = '#0a0808';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw circular coffee cup rim boundary guide
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 120, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    if (!isDrawingMode) {
      // Draw selected preset SVG paths
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;

      selectedArt.svgPaths.forEach((pathStr) => {
        const p = new Path2D(pathStr);
        ctx.stroke(p);
      });
      ctx.shadowBlur = 0;
    } else {
      // Render user drawn strokes
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      userStrokesRef.current.forEach((stroke) => {
        if (stroke.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
    }
  }, [selectedArt, isDrawingMode]);

  // Generate G-Code vector instructions whenever parameters change
  useEffect(() => {
    const lines = [
      '; --- GEMINI AR LATTE ART 3D PRINTER G-CODE ---',
      '; Target: Natural Cocoa Micro-Foam Nozzle v4.0',
      `G21 ; Set units to millimeters`,
      `G90 ; Absolute positioning`,
      `M104 S38 ; Micro-foam chamber temp 38°C`,
      `G0 Z${foamDepth}.0 F${nozzleSpeed * 10} ; Set 3D Foam Elevation (${foamDepth}mm)`,
      `M200 D1.75 ; Cocoa density modulation (${cocoaDensity}%)`,
      '; Beginning Nozzle Vector Path Execution...',
    ];

    if (!isDrawingMode) {
      selectedArt.svgPaths.forEach((pathStr, i) => {
        lines.push(`; Layer Path ${i + 1}`);
        lines.push(`G1 X${(120 + i * 15).toFixed(1)} Y${(140 + i * 10).toFixed(1)} E${(i * 1.5).toFixed(2)}`);
      });
    } else {
      userStrokesRef.current.forEach((stroke, i) => {
        lines.push(`; User Vector Stroke ${i + 1}`);
        stroke.forEach((pt) => {
          lines.push(`G1 X${pt.x.toFixed(1)} Y${pt.y.toFixed(1)} Z${foamDepth}.0 E0.85`);
        });
      });
    }

    lines.push('G0 Z30.0 ; Retract Nozzle');
    lines.push('M84 ; Stepper Motors Off');
    lines.push('; --- END OF VECTOR INSTRUCTIONS ---');

    setGcodeOutput(lines.join('\n'));
  }, [selectedArt, foamDepth, cocoaDensity, nozzleSpeed, isDrawingMode]);

  // Drawing event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode || !drawCanvasRef.current) return;
    const rect = drawCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    userStrokesRef.current.push([{ x, y }]);
    coffeeSound.playSliderTick();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode || !isDrawingRef.current || !drawCanvasRef.current) return;
    const rect = drawCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const currentStroke = userStrokesRef.current[userStrokesRef.current.length - 1];
    if (currentStroke) {
      currentStroke.push({ x, y });
    }

    // Trigger canvas re-render
    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      const prev = currentStroke[currentStroke.length - 2];
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const clearDrawing = () => {
    coffeeSound.playBaristaClick();
    userStrokesRef.current = [];
    const canvas = drawCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0a0808';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 120, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  };

  const handleStartPrint = () => {
    coffeeSound.playBaristaClick();
    coffeeSound.playCoffeeSteam();
    setIsPrinting(true);
    setPrintProgress(0);

    const interval = setInterval(() => {
      setPrintProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPrinting(false);
          coffeeSound.playSuccessChime();
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 dir-rtl text-stone-100">
      {/* Top Banner Header */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>Gemini AR 3D Vectorizer & Cocoa Nozzle Printer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-100 tracking-tight">
              Gemini AR Latte Art 3D Printer <br />
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-cyan-400 bg-clip-text text-transparent">
                מדפסת תלת-ממד לקצף מיקרו-פואם & וקטוריזטור קקאו
              </span>
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              המרת איורים וסקיצות בזמן אמת להוראות מדפסת G-Code לפיסול קצף בתלת-ממד (עד 25 מ"מ גובה)
              ולפיזור מבוקר של אבקת קקאו טבעית במיקרו-דיוק.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-500/30 text-center min-w-[130px]">
              <span className="text-[10px] text-stone-400 font-mono block">גובה פיסול קצף 3D</span>
              <span className="text-2xl font-black text-amber-400 font-mono">{foamDepth} mm</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-cyan-500/30 text-center min-w-[130px]">
              <span className="text-[10px] text-stone-400 font-mono block">צפיפות קקאו</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">{cocoaDensity}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Drawing & Vectorizer Canvas + 3D Cup Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-2xl space-y-5">
            {/* Canvas Header & Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Brush className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-stone-100">
                  קנווס וקטוריזטור AR & משטח שרטוט
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    coffeeSound.playBaristaClick();
                    setIsDrawingMode(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    !isDrawingMode
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  תבניות קלאסיות
                </button>
                <button
                  onClick={() => {
                    coffeeSound.playBaristaClick();
                    setIsDrawingMode(true);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isDrawingMode
                      ? 'bg-cyan-500 text-stone-950 shadow-md'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  שרטוט חופשי (Draw)
                </button>
              </div>
            </div>

            {/* Drawing Canvas Container */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-amber-500/30 flex items-center justify-center p-4">
              <canvas
                ref={drawCanvasRef}
                width={300}
                height={300}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-[300px] h-[300px] rounded-full cursor-crosshair shadow-[0_0_30px_rgba(0,0,0,0.9)]"
              />

              <div className="absolute top-4 right-4 text-[10px] font-mono text-amber-400 bg-stone-900/90 px-2.5 py-1 rounded-lg border border-amber-500/30">
                {isDrawingMode ? 'מצב שרטוט ידני פעיל' : selectedArt.hebrewName}
              </div>

              {isDrawingMode && (
                <button
                  onClick={clearDrawing}
                  className="absolute bottom-4 right-4 p-2 rounded-xl bg-stone-900/90 text-stone-300 hover:text-rose-400 border border-stone-800 text-xs font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>נקה משטח</span>
                </button>
              )}
            </div>

            {/* 3D Foam Depth Height Sculpture Render Preview */}
            <div className="p-5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-300 font-bold flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-cyan-400" />
                  <span>תצוגת פיסול קצף 3D (Cup Foam Elevation)</span>
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  שכבה מוגבהת: {foamDepth}mm
                </span>
              </div>

              {/* Simulated 3D Layer Stack Visual */}
              <div className="h-16 rounded-xl bg-stone-900 border border-stone-800 flex items-end justify-center p-3 relative overflow-hidden">
                <div
                  className="w-48 rounded-t-xl bg-gradient-to-t from-amber-900/80 via-amber-600/90 to-amber-200 transition-all duration-300 flex items-center justify-center text-[10px] font-black text-stone-950 border-t-2 border-amber-300 shadow-[0_-5px_15px_rgba(245,158,11,0.4)]"
                  style={{ height: `${Math.min(100, (foamDepth / 25) * 100)}%` }}
                >
                  3D FOAM HEIGHT ({foamDepth}mm)
                </div>
              </div>
            </div>

            {/* Printing Progress Bar & Action Button */}
            {isPrinting && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                  <span>מפזר קקאו ומפסל קצף ברזולוציית מיקרון...</span>
                  <span>{printProgress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-950 overflow-hidden p-0.5 border border-amber-500/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-cyan-400 transition-all duration-200"
                    style={{ width: `${printProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleStartPrint}
              disabled={isPrinting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 font-black text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 disabled:opacity-50"
            >
              <Printer className="w-5 h-5" />
              <span>{isPrinting ? 'הדפסה בתהליך...' : 'שדר דיוקטור וקטורי למדפסת ה-3D'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Parameters & G-Code Instructions Code Block (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preset Art Selector */}
          {!isDrawingMode && (
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-2xl space-y-4">
              <h3 className="text-base font-black text-stone-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>תבניות אומנות קפה 3D מובחרות</span>
              </h3>

              <div className="space-y-3">
                {PRESET_ARTS.map((art) => {
                  const isSelected = selectedArt.id === art.id;
                  return (
                    <button
                      key={art.id}
                      onClick={() => {
                        coffeeSound.playBaristaClick();
                        setSelectedArt(art);
                        setFoamDepth(art.foamHeight);
                        setCocoaDensity(art.density);
                      }}
                      className={`w-full p-4 rounded-2xl border text-right transition-all duration-300 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/70 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                          : 'bg-stone-950/60 border-stone-800 hover:border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-stone-100">{art.hebrewName}</span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                          {art.foamHeight}mm 3D
                        </span>
                      </div>
                      <p className="text-xs text-stone-400">קטגוריה: {art.category}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3D Depth & Nozzle Speed Sliders */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-2xl space-y-6">
            <h3 className="text-base font-black text-stone-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>פרמטרי פיסול וקקאו</span>
            </h3>

            {/* Foam Depth Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-300 font-bold">גובה פיסול קצף 3D (Foam Depth)</span>
                <span className="font-mono text-amber-400 font-black">{foamDepth} mm</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={foamDepth}
                onChange={(e) => {
                  coffeeSound.playSliderTick();
                  setFoamDepth(Number(e.target.value));
                }}
                className="w-full accent-amber-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>1mm (שטוח 2D)</span>
                <span className="text-amber-400 font-bold">12mm (בולט)</span>
                <span>25mm (פיסול גבוה)</span>
              </div>
            </div>

            {/* Cocoa Density Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-300 font-bold">צפיפות אבקת קקאו (Cocoa Density)</span>
                <span className="font-mono text-cyan-400 font-black">{cocoaDensity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={cocoaDensity}
                onChange={(e) => {
                  coffeeSound.playSliderTick();
                  setCocoaDensity(Number(e.target.value));
                }}
                className="w-full accent-cyan-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>10% (עדין)</span>
                <span>50% (מאוזן)</span>
                <span>100% (שוקולדי כהה)</span>
              </div>
            </div>
          </div>

          {/* Generated G-Code Instructions Inspector */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-stone-800 backdrop-blur-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">
                קוד הוראות CNC / G-Code Vector
              </span>
              <span className="text-[10px] text-stone-500 font-mono">AUTO-GENERATED</span>
            </div>

            <pre className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-[10px] font-mono text-emerald-400 max-h-40 overflow-y-auto custom-scrollbar dir-ltr text-left">
              {gcodeOutput}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
