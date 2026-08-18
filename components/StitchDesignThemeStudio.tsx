'use client';

import React, { useState, useMemo } from 'react';
import {
  Palette,
  Layers,
  Sparkles,
  Sliders,
  Code2,
  Copy,
  Check,
  Download,
  Eye,
  Coffee,
  Activity,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export const StitchDesignThemeStudio: React.FC = () => {
  const [blurAmount, setBlurAmount] = useState<number>(28);
  const [primaryColor, setPrimaryColor] = useState<string>('#f59e0b');
  const [secondaryColor, setSecondaryColor] = useState<string>('#06b6d4');
  const [accentColor, setAccentColor] = useState<string>('#10b981');
  const [backgroundColor, setBackgroundColor] = useState<string>('#050404');
  const [borderOpacity, setBorderOpacity] = useState<number>(30);
  const [borderRadius, setBorderRadius] = useState<number>(20);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeExportTab, setActiveExportTab] = useState<'stitch' | 'css'>('stitch');

  const presetThemes = [
    {
      name: 'Liquid Glass 4.0 Pro (Default)',
      primary: '#f59e0b',
      secondary: '#06b6d4',
      accent: '#10b981',
      bg: '#050404',
      blur: 28,
      border: 30,
    },
    {
      name: 'Obsidian Crema Noir',
      primary: '#d97706',
      secondary: '#38bdf8',
      accent: '#34d399',
      bg: '#020617',
      blur: 36,
      border: 20,
    },
    {
      name: 'Quantum Roast Emerald',
      primary: '#10b981',
      secondary: '#f59e0b',
      accent: '#06b6d4',
      bg: '#04100c',
      blur: 24,
      border: 35,
    },
    {
      name: 'Amethyst Velvet Midnight',
      primary: '#a855f7',
      secondary: '#06b6d4',
      accent: '#f59e0b',
      bg: '#090514',
      blur: 32,
      border: 25,
    },
  ];

  // Generated StitchMCP designMd YAML
  const stitchDesignMd = useMemo(() => {
    return `---
name: Liquid Glass 4.0 Pro (Stitch Edition)
colors:
  surface: '${backgroundColor}'
  primary: '${primaryColor}'
  secondary: '${secondaryColor}'
  tertiary: '${accentColor}'
  glass-border: 'rgba(245, 158, 11, ${borderOpacity / 100})'
  deep-obsidian: '${backgroundColor}'
typography:
  headlineFont: Plus Jakarta Sans
  bodyFont: Work Sans
  labelFont: JetBrains Mono
effects:
  backdrop-blur: '${blurAmount}px'
  border-radius: '${borderRadius}px'
  refraction: 'saturate(190%)'
---
# Liquid Glass 4.0 Design Tokens exported from Stitch Theme Studio.
`;
  }, [backgroundColor, primaryColor, secondaryColor, accentColor, borderOpacity, blurAmount, borderRadius]);

  // Generated CSS Variables
  const cssVariables = useMemo(() => {
    return `:root {
  --theme-bg: ${backgroundColor};
  --theme-primary: ${primaryColor};
  --theme-secondary: ${secondaryColor};
  --theme-accent: ${accentColor};
  --glass-blur: ${blurAmount}px;
  --glass-border-opacity: ${borderOpacity / 100};
  --glass-border-radius: ${borderRadius}px;
}`;
  }, [backgroundColor, primaryColor, secondaryColor, accentColor, blurAmount, borderOpacity, borderRadius]);

  const handleApplyPreset = (preset: typeof presetThemes[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setAccentColor(preset.accent);
    setBackgroundColor(preset.bg);
    setBlurAmount(preset.blur);
    setBorderOpacity(preset.border);
    coffeeSound.playBaristaClick();
  };

  const handleCopy = () => {
    const text = activeExportTab === 'stitch' ? stitchDesignMd : cssVariables;
    navigator.clipboard.writeText(text);
    setCopied(true);
    coffeeSound.playBaristaClick();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 dir-rtl text-right">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-amber-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>STITCHMCP DESIGN SYSTEM & THEME STUDIO</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
              סטודיו עיצוב Liquid Glass 4.0 & סנכרון StitchMCP
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              סביבת כיוונון אינטראקטיבית בזמן אמת לכל טוקני העיצוב (Backdrop Blur, Crema Gold, שקיפות מסגרות ורדיוס פינות) עם ייצוא ישיר למפרט StitchMCP ולמשתני CSS של Next.js.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#140e0b]/90 p-4 rounded-2xl border border-stone-800 shrink-0 text-center space-y-1">
            <div className="text-xs text-stone-400 font-mono">עוצמת טשטוש Blur</div>
            <div className="text-3xl font-black font-mono text-amber-400">{blurAmount}px</div>
            <div className="text-[10px] text-cyan-400 font-mono">120Hz GPU Active</div>
          </div>
        </div>
      </div>

      {/* Preset Themes Selector */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-stone-300 font-mono">ערכות נושא מוכנות (Presets):</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presetThemes.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 text-right transition-all flex items-center justify-between group"
            >
              <span className="text-xs font-bold text-stone-200 group-hover:text-amber-300">{preset.name}</span>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.primary }} />
                <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.secondary }} />
                <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.bg }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls & Live Component Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Token Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 p-6 rounded-3xl bg-stone-900/90 border border-stone-800 backdrop-blur-2xl shadow-xl">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-stone-100">טוקני שפת עיצוב (Design Tokens)</span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Blur Slider */}
            <div>
              <div className="flex justify-between text-stone-300 mb-1">
                <span>עוצמת שבירת אור (Backdrop Blur)</span>
                <span className="text-amber-400 font-bold">{blurAmount}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="48"
                value={blurAmount}
                onChange={(e) => setBlurAmount(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Border Opacity Slider */}
            <div>
              <div className="flex justify-between text-stone-300 mb-1">
                <span>שקיפות מסגרת Hairline 1px</span>
                <span className="text-cyan-400 font-bold">{borderOpacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={borderOpacity}
                onChange={(e) => setBorderOpacity(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Border Radius Slider */}
            <div>
              <div className="flex justify-between text-stone-300 mb-1">
                <span>רדיוס פינות (Border Radius)</span>
                <span className="text-emerald-400 font-bold">{borderRadius}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="36"
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-stone-400 text-[11px] mb-1">צבע ראשי (Crema Gold)</label>
                <div className="flex items-center gap-2 bg-stone-950 p-2 rounded-xl border border-stone-800">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-stone-200">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 text-[11px] mb-1">צבע טלמטריה (Cyan Glow)</label>
                <div className="flex items-center gap-2 bg-stone-950 p-2 rounded-xl border border-stone-800">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-stone-200">{secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Card Preview & Code Export (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Live Component Preview */}
          <div className="p-6 rounded-3xl bg-stone-950 border border-stone-800 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
              <span className="flex items-center gap-1.5 text-stone-200">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>תצוגה מקדימה חיה של רכיב Liquid Glass</span>
              </span>
              <span>120Hz GPU Active</span>
            </div>

            {/* Sample Liquid Glass Coffee Card with active tokens */}
            <div
              className="p-6 transition-all duration-200 relative overflow-hidden"
              style={{
                backdropFilter: `blur(${blurAmount}px) saturate(190%)`,
                backgroundColor: 'rgba(28, 25, 23, 0.75)',
                border: `1px solid rgba(245, 158, 11, ${borderOpacity / 100})`,
                borderRadius: `${borderRadius}px`,
                boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${primaryColor}22`,
              }}
            >
              {/* Background ambient glow */}
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl pointer-events-none opacity-40"
                style={{ backgroundColor: primaryColor }}
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${secondaryColor}20`,
                      color: secondaryColor,
                      borderColor: `${secondaryColor}50`,
                    }}
                  >
                    TDS 1.42% • 9.2 BAR
                  </span>
                  <span className="text-xs font-mono text-stone-400">#ROAST-42</span>
                </div>

                <div>
                  <h3
                    className="text-xl font-extrabold"
                    style={{ color: primaryColor }}
                  >
                    Midnight Geisha Reserve 3D
                  </h3>
                  <p className="text-xs text-stone-300 mt-1">
                    דוגמה חיה לכרטיס מוצר עם משטח זכוכית נוזלית, מסגרת שבירת אור וצבעי Crema מותאמים אישית.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xl font-black font-mono text-stone-100">₪84.00</span>
                  <button
                    onClick={() => coffeeSound.playBaristaClick()}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-stone-950 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, #d97706)`,
                    }}
                  >
                    <Coffee className="w-4 h-4" />
                    <span>הוסף לסל הקפה</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Export Code Box */}
          <div className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveExportTab('stitch');
                    coffeeSound.playBaristaClick();
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                    activeExportTab === 'stitch'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-stone-400'
                  }`}
                >
                  StitchMCP (designMd YAML)
                </button>
                <button
                  onClick={() => {
                    setActiveExportTab('css');
                    coffeeSound.playBaristaClick();
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                    activeExportTab === 'css'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-stone-400'
                  }`}
                >
                  Next.js CSS Variables
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'הועתק!' : 'העתק טוקנים'}</span>
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-stone-950 font-mono text-[11px] text-amber-300/90 max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {activeExportTab === 'stitch' ? stitchDesignMd : cssVariables}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
