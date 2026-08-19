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
  Zap,
  RefreshCw,
  Maximize2,
  Share2,
  Terminal,
  FileJson,
  FileCode,
  Gauge,
  Flame,
  Droplets,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface StitchProjectPreset {
  id: string;
  name: string;
  stitchProjectName: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  blur: number;
  refraction: number;
  borderOpacity: number;
  borderRadius: number;
  ambientGlow: number;
  specularEdge: boolean;
  headlineFont: string;
  bodyFont: string;
  labelFont: string;
  namedColors: {
    espressoGold: string;
    cyanGlow: string;
    emeraldNeon: string;
    deepObsidian: string;
    surfaceGlass: string;
  };
}

const STITCH_PRESETS: StitchProjectPreset[] = [
  {
    id: 'liquid-glass-4-pro',
    name: 'Liquid Glass 4.0 Pro (Default Master)',
    stitchProjectName: 'projects/16230554345880339094',
    description: 'מערכת העיצוב הרשמית של The Digital Roast: זכוכית נוקטורנלית, רפרקציה עמוקה, גבולות זהב אספרסו זוהרים וטיפוגרפיית Plus Jakarta Sans.',
    primary: '#f59e0b',
    secondary: '#06b6d4',
    accent: '#10b981',
    bg: '#050404',
    blur: 28,
    refraction: 190,
    borderOpacity: 30,
    borderRadius: 20,
    ambientGlow: 45,
    specularEdge: true,
    headlineFont: 'Plus Jakarta Sans',
    bodyFont: 'Plus Jakarta Sans',
    labelFont: 'Space Grotesk',
    namedColors: {
      espressoGold: '#f59e0b',
      cyanGlow: '#06b6d4',
      emeraldNeon: '#10b981',
      deepObsidian: '#050404',
      surfaceGlass: 'rgba(28, 25, 23, 0.75)',
    },
  },
  {
    id: 'obsidian-brew',
    name: 'Obsidian Brew Telemetry System',
    stitchProjectName: 'projects/17203112776221743122',
    description: 'עיצוב כהה מטאלי עם דגש על טלמטריה מדעית, פונט Manrope ו-JetBrains Mono עם תאורת קרמה בגווני זהב חמים.',
    primary: '#ffc174',
    secondary: '#4cd7f6',
    accent: '#56e5a9',
    bg: '#151313',
    blur: 24,
    refraction: 175,
    borderOpacity: 25,
    borderRadius: 16,
    ambientGlow: 35,
    specularEdge: true,
    headlineFont: 'Manrope',
    bodyFont: 'Work Sans',
    labelFont: 'JetBrains Mono',
    namedColors: {
      espressoGold: '#ffc174',
      cyanGlow: '#4cd7f6',
      emeraldNeon: '#56e5a9',
      deepObsidian: '#151313',
      surfaceGlass: 'rgba(21, 19, 19, 0.85)',
    },
  },
  {
    id: 'quantum-glass-4',
    name: 'Quantum Glass 4.0 Financial Terminal',
    stitchProjectName: 'projects/9265025983283146482',
    description: 'ממשק קוונטי בהיר על גבי חלל שחור טהור (#020203), זוהר נאון ירוק וסגול AI, מותאם לקצבי רענון של 120Hz.',
    primary: '#ffffff',
    secondary: '#00ffa3',
    accent: '#8a5cff',
    bg: '#020203',
    blur: 32,
    refraction: 210,
    borderOpacity: 20,
    borderRadius: 12,
    ambientGlow: 60,
    specularEdge: true,
    headlineFont: 'Outfit',
    bodyFont: 'Inter',
    labelFont: 'Inter',
    namedColors: {
      espressoGold: '#ffffff',
      cyanGlow: '#00d1ff',
      emeraldNeon: '#00ffa3',
      deepObsidian: '#020203',
      surfaceGlass: 'rgba(255, 255, 255, 0.05)',
    },
  },
  {
    id: 'amethyst-velvet',
    name: 'Amethyst Velvet Nocturne',
    stitchProjectName: 'projects/custom-amethyst',
    description: 'גווני סגול אציליים בשילוב ענבר עמוק, זכוכית מעושנת ואווירת בר קפה יוקרתי בשעות הלילה המאוחרות.',
    primary: '#c084fc',
    secondary: '#38bdf8',
    accent: '#fbbf24',
    bg: '#090514',
    blur: 36,
    refraction: 200,
    borderOpacity: 35,
    borderRadius: 24,
    ambientGlow: 50,
    specularEdge: true,
    headlineFont: 'Plus Jakarta Sans',
    bodyFont: 'Work Sans',
    labelFont: 'Space Grotesk',
    namedColors: {
      espressoGold: '#c084fc',
      cyanGlow: '#38bdf8',
      emeraldNeon: '#fbbf24',
      deepObsidian: '#090514',
      surfaceGlass: 'rgba(25, 15, 38, 0.75)',
    },
  },
];

export const StitchDesignThemeStudio: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(STITCH_PRESETS[0].id);

  // Active Physical Token State
  const [primaryColor, setPrimaryColor] = useState<string>(STITCH_PRESETS[0].primary);
  const [secondaryColor, setSecondaryColor] = useState<string>(STITCH_PRESETS[0].secondary);
  const [accentColor, setAccentColor] = useState<string>(STITCH_PRESETS[0].accent);
  const [backgroundColor, setBackgroundColor] = useState<string>(STITCH_PRESETS[0].bg);
  const [blurAmount, setBlurAmount] = useState<number>(STITCH_PRESETS[0].blur);
  const [refractionSaturation, setRefractionSaturation] = useState<number>(STITCH_PRESETS[0].refraction);
  const [borderOpacity, setBorderOpacity] = useState<number>(STITCH_PRESETS[0].borderOpacity);
  const [borderRadius, setBorderRadius] = useState<number>(STITCH_PRESETS[0].borderRadius);
  const [ambientGlow, setAmbientGlow] = useState<number>(STITCH_PRESETS[0].ambientGlow);
  const [specularEdge, setSpecularEdge] = useState<boolean>(STITCH_PRESETS[0].specularEdge);

  // Code & Tab State
  const [activeExportTab, setActiveExportTab] = useState<'stitch' | 'css' | 'tailwind' | 'json'>('stitch');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSandboxTab, setActiveSandboxTab] = useState<'card' | 'telemetry' | 'buttons'>('card');

  // Dynamic Style Injection for Sandbox
  const sandboxGlassStyle: React.CSSProperties = useMemo(() => {
    return {
      backgroundColor: 'rgba(28, 25, 23, 0.75)',
      backdropFilter: `blur(${blurAmount}px) saturate(${refractionSaturation}%)`,
      WebkitBackdropFilter: `blur(${blurAmount}px) saturate(${refractionSaturation}%)`,
      borderColor: `${primaryColor}${Math.round((borderOpacity / 100) * 255).toString(16).padStart(2, '0')}`,
      borderRadius: `${borderRadius}px`,
      boxShadow: specularEdge
        ? `inset 0 1px 1px 0 rgba(255, 255, 255, 0.2), 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 ${ambientGlow}px ${primaryColor}20`
        : `0 20px 50px rgba(0, 0, 0, 0.8), 0 0 ${ambientGlow}px ${primaryColor}20`,
    };
  }, [blurAmount, refractionSaturation, primaryColor, borderOpacity, borderRadius, ambientGlow, specularEdge]);

  // Load Preset
  const handleSelectPreset = (preset: StitchProjectPreset) => {
    coffeeSound.playBaristaClick();
    setSelectedPresetId(preset.id);
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setAccentColor(preset.accent);
    setBackgroundColor(preset.bg);
    setBlurAmount(preset.blur);
    setRefractionSaturation(preset.refraction);
    setBorderOpacity(preset.borderOpacity);
    setBorderRadius(preset.borderRadius);
    setAmbientGlow(preset.ambientGlow);
    setSpecularEdge(preset.specularEdge);
  };

  // Reset to current preset default
  const handleResetToDefault = () => {
    const current = STITCH_PRESETS.find((p) => p.id === selectedPresetId) || STITCH_PRESETS[0];
    handleSelectPreset(current);
  };

  // Generated StitchMCP designMd YAML
  const stitchDesignMd = useMemo(() => {
    return `---
name: Liquid Glass 4.0 Pro (Stitch Edition)
colors:
  surface: '${backgroundColor}'
  surface-dim: '${backgroundColor}'
  surface-bright: '#2c2929'
  on-surface: '#e7e1e0'
  primary: '${primaryColor}'
  primary-container: '${primaryColor}'
  secondary: '${secondaryColor}'
  secondary-container: '${secondaryColor}'
  tertiary: '${accentColor}'
  tertiary-container: '${accentColor}'
  glass-border: 'rgba(${parseInt(primaryColor.slice(1, 3), 16) || 245}, ${parseInt(primaryColor.slice(3, 5), 16) || 158}, ${parseInt(primaryColor.slice(5, 7), 16) || 11}, ${borderOpacity / 100})'
  deep-obsidian: '${backgroundColor}'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
  body-base:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
  telemetry-mono:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
effects:
  backdrop-blur: '${blurAmount}px'
  refraction-saturation: 'saturate(${refractionSaturation}%)'
  border-radius: '${borderRadius}px'
  ambient-glow: '${ambientGlow}px'
  specular-edge: ${specularEdge}
---

# Liquid Glass 4.0 Design Tokens exported from Stitch Theme Studio.
# Connected with StitchMCP project: ${STITCH_PRESETS.find((p) => p.id === selectedPresetId)?.stitchProjectName || 'projects/16230554345880339094'}
`;
  }, [
    backgroundColor,
    primaryColor,
    secondaryColor,
    accentColor,
    borderOpacity,
    blurAmount,
    refractionSaturation,
    borderRadius,
    ambientGlow,
    specularEdge,
    selectedPresetId,
  ]);

  // Generated CSS Variables
  const cssVariables = useMemo(() => {
    return `:root {
  /* Liquid Glass 4.0 Physical Tokens */
  --theme-bg: ${backgroundColor};
  --theme-primary: ${primaryColor};
  --theme-secondary: ${secondaryColor};
  --theme-accent: ${accentColor};
  --theme-glass-blur: ${blurAmount}px;
  --theme-glass-refraction: saturate(${refractionSaturation}%);
  --theme-glass-border-opacity: ${borderOpacity}%;
  --theme-glass-border: ${primaryColor}${Math.round((borderOpacity / 100) * 255).toString(16).padStart(2, '0')};
  --theme-border-radius: ${borderRadius}px;
  --theme-ambient-glow: 0 0 ${ambientGlow}px ${primaryColor}30;
  --theme-specular-edge: ${specularEdge ? 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)' : 'none'};
}`;
  }, [
    backgroundColor,
    primaryColor,
    secondaryColor,
    accentColor,
    blurAmount,
    refractionSaturation,
    borderOpacity,
    borderRadius,
    ambientGlow,
    specularEdge,
  ]);

  // Generated Tailwind Config
  const tailwindConfig = useMemo(() => {
    return `// tailwind.config.js - Liquid Glass 4.0 Theme Extension
module.exports = {
  theme: {
    extend: {
      colors: {
        'espresso-gold': '${primaryColor}',
        'cyan-glow': '${secondaryColor}',
        'emerald-neon': '${accentColor}',
        'deep-obsidian': '${backgroundColor}',
      },
      backdropBlur: {
        'liquid-glass': '${blurAmount}px',
      },
      borderRadius: {
        'liquid-glass': '${borderRadius}px',
      },
    },
  },
};`;
  }, [primaryColor, secondaryColor, accentColor, backgroundColor, blurAmount, borderRadius]);

  // Generated JSON Spec
  const jsonThemeSpec = useMemo(() => {
    return JSON.stringify(
      {
        themeName: 'Liquid Glass 4.0 Pro',
        version: '4.0.0',
        projectId: STITCH_PRESETS.find((p) => p.id === selectedPresetId)?.stitchProjectName,
        tokens: {
          primaryColor,
          secondaryColor,
          accentColor,
          backgroundColor,
          blurAmount,
          refractionSaturation,
          borderOpacity,
          borderRadius,
          ambientGlow,
          specularEdge,
        },
      },
      null,
      2
    );
  }, [
    selectedPresetId,
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    blurAmount,
    refractionSaturation,
    borderOpacity,
    borderRadius,
    ambientGlow,
    specularEdge,
  ]);

  const handleCopyCode = () => {
    coffeeSound.playBaristaClick();
    let textToCopy = stitchDesignMd;
    if (activeExportTab === 'css') textToCopy = cssVariables;
    if (activeExportTab === 'tailwind') textToCopy = tailwindConfig;
    if (activeExportTab === 'json') textToCopy = jsonThemeSpec;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    coffeeSound.playBaristaClick();
    let content = stitchDesignMd;
    let fileName = 'design.md';
    let mime = 'text/markdown';

    if (activeExportTab === 'css') {
      content = cssVariables;
      fileName = 'theme-variables.css';
      mime = 'text/css';
    } else if (activeExportTab === 'tailwind') {
      content = tailwindConfig;
      fileName = 'tailwind.config.js';
      mime = 'application/javascript';
    } else if (activeExportTab === 'json') {
      content = jsonThemeSpec;
      fileName = 'liquid-glass-theme.json';
      mime = 'application/json';
    }

    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full text-stone-100 font-sans space-y-8" dir="rtl">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-stone-900/80 border border-amber-500/20 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ background: `radial-gradient(circle, ${primaryColor}, transparent)` }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ background: `radial-gradient(circle, ${secondaryColor}, transparent)` }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wider mb-4 shadow-sm">
              <Sliders className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>LIQUID GLASS 4.0 PRO & STITCHMCP STUDIO</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-stone-100 to-amber-400 tracking-tight leading-tight mb-3">
              סטודיו עיצוב Liquid Glass 4.0 & סנכרון StitchMCP
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              מנוע כיוונון טוקנים מתקדם בזמן אמת, סימולציית רכיבי 120Hz (כרטיסי קפה 3D, טלמטריית מיצוי, כפתורים מגנטיים), וסנכרון ישיר של קובצי `design.md` ומשתני CSS עם פרויקטי StitchMCP.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-white/10 text-xs font-bold text-stone-300 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>איפוס ערכים</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span>StitchMCP Connected</span>
            </div>
          </div>
        </div>

        {/* Project Presets Selector */}
        <div className="relative z-10 pt-8 border-t border-white/5 mt-8">
          <div className="text-xs font-bold text-stone-400 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <span>בחר פרויקט StitchMCP / ערכת נושא מוכנה:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STITCH_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border backdrop-blur-xl ${
                    isSelected
                      ? 'bg-stone-800/90 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30 -translate-y-0.5'
                      : 'bg-stone-900/60 hover:bg-stone-800/60 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-xs font-extrabold text-stone-100 truncate">{preset.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: preset.primary }} />
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: preset.secondary }} />
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed mb-2">{preset.description}</p>
                  <div className="text-[10px] font-mono text-amber-400/80 truncate">{preset.stitchProjectName}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Controls & Real-Time Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Physical Token Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-stone-900/80 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>בקרי טוקנים פיזיקליים</span>
              </h2>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-stone-800 border border-white/10 text-stone-300">
                120Hz Live Engine
              </span>
            </div>

            {/* Color Pickers Matrix */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">פלטת צבעי בסיס ונאון</h3>

              <div className="grid grid-cols-2 gap-3">
                {/* Primary Accent */}
                <div className="p-3 rounded-2xl bg-stone-800/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-200">Primary (Gold)</label>
                    <span className="text-[11px] font-mono text-amber-400">{primaryColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg bg-stone-900 border border-white/10 text-xs font-mono text-stone-200"
                    />
                  </div>
                </div>

                {/* Secondary */}
                <div className="p-3 rounded-2xl bg-stone-800/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-200">Secondary (Cyan)</label>
                    <span className="text-[11px] font-mono text-cyan-400">{secondaryColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg bg-stone-900 border border-white/10 text-xs font-mono text-stone-200"
                    />
                  </div>
                </div>

                {/* Accent */}
                <div className="p-3 rounded-2xl bg-stone-800/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-200">Accent (Emerald)</label>
                    <span className="text-[11px] font-mono text-emerald-400">{accentColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg bg-stone-900 border border-white/10 text-xs font-mono text-stone-200"
                    />
                  </div>
                </div>

                {/* Background */}
                <div className="p-3 rounded-2xl bg-stone-800/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-200">Base Canvas</label>
                    <span className="text-[11px] font-mono text-stone-400">{backgroundColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg bg-stone-900 border border-white/10 text-xs font-mono text-stone-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sliders: Glass Physical Parameters */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">פיזיקת זכוכית ורפרקציה</h3>

              {/* Backdrop Blur */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-300">טשטוש זכוכית (Backdrop Blur)</span>
                  <span className="font-mono text-amber-400">{blurAmount}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="64"
                  value={blurAmount}
                  onChange={(e) => setBlurAmount(Number(e.target.value))}
                  className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Refraction Saturation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-300">רוויית שבירת אור (Refraction Saturation)</span>
                  <span className="font-mono text-amber-400">{refractionSaturation}%</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="250"
                  value={refractionSaturation}
                  onChange={(e) => setRefractionSaturation(Number(e.target.value))}
                  className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Border Opacity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-300">שקיפות מסגרת (Border Opacity)</span>
                  <span className="font-mono text-amber-400">{borderOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={borderOpacity}
                  onChange={(e) => setBorderOpacity(Number(e.target.value))}
                  className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Border Radius */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-300">רדיוס פינות (Border Radius)</span>
                  <span className="font-mono text-amber-400">{borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="36"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Ambient Glow */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-300">עוצמת זוהר אמביינטי (Ambient Outer Glow)</span>
                  <span className="font-mono text-amber-400">{ambientGlow}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={ambientGlow}
                  onChange={(e) => setAmbientGlow(Number(e.target.value))}
                  className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Specular Edge Highlight Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-800/40 border border-white/5">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-stone-200">ברק זכוכית עליון (Specular Highlight)</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={specularEdge}
                    onChange={(e) => {
                      coffeeSound.playBaristaClick();
                      setSpecularEdge(e.target.checked);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live 120Hz Real-Time Visualizer Sandbox (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-stone-950 border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Dynamic Background Mesh */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none transition-colors duration-500"
              style={{
                background: `radial-gradient(circle at 80% 20%, ${primaryColor}25, transparent 50%), radial-gradient(circle at 20% 80%, ${secondaryColor}20, transparent 50%), ${backgroundColor}`,
              }}
            />

            <div className="relative z-10 space-y-6">
              {/* Sandbox Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-stone-100">ארגז חול חי (Live Component Sandbox)</h2>
                    <p className="text-xs text-stone-400">תצוגה מקדימה ברינדור 120Hz של רכיבי Liquid Glass</p>
                  </div>
                </div>

                {/* Sandbox Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-white/10">
                  {[
                    { id: 'card', label: 'כרטיס קפה 3D' },
                    { id: 'telemetry', label: 'טלמטריית חליטה' },
                    { id: 'buttons', label: 'כפתורים ושבבים' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        coffeeSound.playBaristaClick();
                        setActiveSandboxTab(tab.id as any);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeSandboxTab === tab.id
                          ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TAB 1: 3D Coffee Card Preview */}
              {activeSandboxTab === 'card' && (
                <div className="py-4">
                  <div
                    style={sandboxGlassStyle}
                    className="p-6 sm:p-8 border transition-all duration-300 relative group overflow-hidden max-w-md mx-auto hover:scale-[1.02] transform-gpu"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold border"
                        style={{
                          backgroundColor: `${primaryColor}15`,
                          borderColor: `${primaryColor}40`,
                          color: primaryColor,
                        }}
                      >
                        🌟 SPECIALTY MICRO-LOT #42
                      </span>
                      <span className="text-xs font-mono text-stone-400">2,150 MASL</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-stone-100 mb-1 leading-snug">
                      אתיופיה ירגשף אנאירובי (Ethiopia Yirgacheffe)
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed mb-4">
                      תהליך תסיסה אנאירובי 72 שעות. תווי יסמין, פירות יער שחורים, ברגמוט ומתיקות דבש פראי.
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 mb-4 text-center">
                      <div>
                        <div className="text-[10px] text-stone-400">ציון SCA</div>
                        <div className="text-sm font-bold font-mono" style={{ color: primaryColor }}>
                          92.5
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-400">פרופיל קלייה</div>
                        <div className="text-sm font-bold font-mono" style={{ color: secondaryColor }}>
                          Light+
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-400">מיצוי מומלץ</div>
                        <div className="text-sm font-bold font-mono" style={{ color: accentColor }}>
                          V60 / 9Bar
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => coffeeSound.playBaristaClick()}
                      className="w-full py-3 rounded-xl font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95 text-stone-950"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                        boxShadow: `0 8px 25px ${primaryColor}40`,
                      }}
                    >
                      <Coffee className="w-4 h-4" />
                      <span>הזמן עכשיו עם המלצת בריסטה AI</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Extraction Telemetry Preview */}
              {activeSandboxTab === 'telemetry' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                  <div style={sandboxGlassStyle} className="p-5 border transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                        <Gauge className="w-4 h-4" style={{ color: secondaryColor }} />
                        <span>לחץ חליטה אספרסו</span>
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400">OPTIMAL</span>
                    </div>
                    <div className="text-2xl font-mono font-black mb-1" style={{ color: secondaryColor }}>
                      9.02 BAR
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full w-[90%]" style={{ backgroundColor: secondaryColor }} />
                    </div>
                  </div>

                  <div style={sandboxGlassStyle} className="p-5 border transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                        <Droplets className="w-4 h-4" style={{ color: primaryColor }} />
                        <span>רפרקטומטר TDS & EY%</span>
                      </span>
                      <span className="text-[11px] font-mono text-amber-400">GOLD CUP</span>
                    </div>
                    <div className="text-2xl font-mono font-black mb-1" style={{ color: primaryColor }}>
                      1.38% TDS / 21.4% EY
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full w-[78%]" style={{ backgroundColor: primaryColor }} />
                    </div>
                  </div>

                  <div style={sandboxGlassStyle} className="p-5 border transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                        <Flame className="w-4 h-4" style={{ color: accentColor }} />
                        <span>בקרת טמפרטורת PID</span>
                      </span>
                      <span className="text-[11px] font-mono" style={{ color: accentColor }}>
                        ±0.1°C
                      </span>
                    </div>
                    <div className="text-2xl font-mono font-black mb-1" style={{ color: accentColor }}>
                      93.5°C
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full w-[85%]" style={{ backgroundColor: accentColor }} />
                    </div>
                  </div>

                  <div style={sandboxGlassStyle} className="p-5 border transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span>מצב רפרקציה סנסורית</span>
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">{refractionSaturation}%</span>
                    </div>
                    <div className="text-2xl font-mono font-black text-stone-100 mb-1">
                      120Hz GPU Active
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">רינדור ללא השהיות (Zero-Reflow CLS Shield)</p>
                  </div>
                </div>
              )}

              {/* TAB 3: Buttons & Interactive Badges */}
              {activeSandboxTab === 'buttons' && (
                <div className="space-y-6 py-4">
                  <div style={sandboxGlassStyle} className="p-6 border space-y-4">
                    <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">סגנונות כפתורים ומחוות</h4>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => coffeeSound.playBaristaClick()}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs text-stone-950 transition-all shadow-md transform active:scale-95"
                        style={{
                          backgroundColor: primaryColor,
                          boxShadow: `0 4px 15px ${primaryColor}40`,
                        }}
                      >
                        Primary Action Button
                      </button>

                      <button
                        onClick={() => coffeeSound.playBaristaClick()}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-md transform active:scale-95"
                        style={{
                          backgroundColor: secondaryColor,
                          boxShadow: `0 4px 15px ${secondaryColor}40`,
                        }}
                      >
                        Secondary Telemetry CTA
                      </button>

                      <button
                        onClick={() => coffeeSound.playBaristaClick()}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs text-stone-950 transition-all shadow-md transform active:scale-95"
                        style={{
                          backgroundColor: accentColor,
                          boxShadow: `0 4px 15px ${accentColor}40`,
                        }}
                      >
                        Accent Success CTA
                      </button>

                      <button
                        onClick={() => coffeeSound.playBaristaClick()}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs text-stone-200 border transition-all hover:bg-white/5"
                        style={{
                          borderColor: `${primaryColor}60`,
                          color: primaryColor,
                        }}
                      >
                        Ghost Glass Button
                      </button>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold border"
                        style={{
                          backgroundColor: `${primaryColor}15`,
                          borderColor: `${primaryColor}40`,
                          color: primaryColor,
                        }}
                      >
                        #espresso-gold
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold border"
                        style={{
                          backgroundColor: `${secondaryColor}15`,
                          borderColor: `${secondaryColor}40`,
                          color: secondaryColor,
                        }}
                      >
                        #cyan-glow
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold border"
                        style={{
                          backgroundColor: `${accentColor}15`,
                          borderColor: `${accentColor}40`,
                          color: accentColor,
                        }}
                      >
                        #emerald-neon
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Export Code Section */}
          <div className="rounded-3xl bg-stone-900/80 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-stone-100">ייצוא טוקנים וקונפיגורציה לפרויקטים</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 transition-colors shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'הועתק ללוח!' : 'העתק קוד'}</span>
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-white/10 text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>הורד קובץ</span>
                </button>
              </div>
            </div>

            {/* Export Tabs */}
            <div className="flex items-center gap-2">
              {[
                { id: 'stitch', label: 'Stitch design.md', icon: FileCode },
                { id: 'css', label: 'CSS :root Variables', icon: Terminal },
                { id: 'tailwind', label: 'Tailwind Config', icon: FileCode },
                { id: 'json', label: 'JSON Theme Spec', icon: FileJson },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      coffeeSound.playBaristaClick();
                      setActiveExportTab(tab.id as any);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeExportTab === tab.id
                        ? 'bg-stone-800 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-stone-400 hover:text-stone-200 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Code Output Box */}
            <div className="relative">
              <pre className="p-4 rounded-2xl bg-stone-950/90 border border-white/10 text-xs font-mono text-stone-300 overflow-x-auto max-h-64 leading-relaxed dir-ltr text-left selection:bg-amber-500/30">
                {activeExportTab === 'stitch' && stitchDesignMd}
                {activeExportTab === 'css' && cssVariables}
                {activeExportTab === 'tailwind' && tailwindConfig}
                {activeExportTab === 'json' && jsonThemeSpec}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
