'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Eye,
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  Flame,
  Activity,
  Award,
  Layers,
  Sliders,
  Download,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Volume2,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

// Preset Specialty Coffee Samples
interface CoffeeSamplePreset {
  id: string;
  name: string;
  hebrewName: string;
  origin: string;
  expectedAgtron: number;
  rgb: { r: number; g: number; b: number };
  sampleMode: 'WHOLE_BEAN' | 'GROUND_BEAN';
  imageUrl: string;
  flavorNotes: string[];
}

const PRESET_SAMPLES: CoffeeSamplePreset[] = [
  {
    id: 'panama-geisha-light',
    name: 'Panama Geisha Boquete (Ultra Light #86)',
    hebrewName: 'פנמה גיישה בוקטה - קליית קינמון בהירה',
    origin: 'Boquete, Panama (1,750m)',
    expectedAgtron: 86,
    rgb: { r: 168, g: 112, b: 68 },
    sampleMode: 'WHOLE_BEAN',
    imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80',
    flavorNotes: ['יסמין', 'ברגמוט', 'אפרסק לבן', 'סוכר קנים'],
  },
  {
    id: 'ethiopia-yirgacheffe-city',
    name: 'Ethiopia Yirgacheffe G1 (City #78)',
    hebrewName: 'אתיופיה יירגאשף גרייד 1 - קליית סיטי',
    origin: 'Yirgacheffe, Ethiopia (2,050m)',
    expectedAgtron: 78,
    rgb: { r: 142, g: 88, b: 52 },
    sampleMode: 'WHOLE_BEAN',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    flavorNotes: ['פרחי הדרים', 'פטל', 'תה שחור', 'דבש'],
  },
  {
    id: 'colombia-huila-cityplus',
    name: 'Colombia Huila Supremo (City+ #68)',
    hebrewName: 'קולומביה ווילה סופרמו - קליית סיטי+',
    origin: 'Huila, Colombia (1,650m)',
    expectedAgtron: 68,
    rgb: { r: 118, g: 68, b: 38 },
    sampleMode: 'WHOLE_BEAN',
    imageUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&auto=format&fit=crop&q=80',
    flavorNotes: ['קרמל', 'תפוח אדום', 'שקדים קלויים', 'שוקולד חלב'],
  },
  {
    id: 'guatemala-antigua-fullcity',
    name: 'Guatemala Antigua (Full City #58)',
    hebrewName: 'גואטמלה אנטיגואה - קלייה בינונית מאוזנת',
    origin: 'Antigua, Guatemala (1,500m)',
    expectedAgtron: 58,
    rgb: { r: 94, g: 50, b: 28 },
    sampleMode: 'WHOLE_BEAN',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    flavorNotes: ['שוקולד מריר 70%', 'אגוזי לוז', 'תבלינים', 'תפוז מיובש'],
  },
  {
    id: 'brazil-cerrado-vienna',
    name: 'Brazil Cerrado Mineiro (Vienna #48)',
    hebrewName: 'ברזיל סראדו מיניירו - קלייה בינונית-כהה',
    origin: 'Cerrado, Brazil (1,100m)',
    expectedAgtron: 48,
    rgb: { r: 72, g: 36, b: 18 },
    sampleMode: 'WHOLE_BEAN',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80',
    flavorNotes: ['קקאו עמוק', 'חמאת בוטנים', 'קרמל כהה', 'מולסה'],
  },
  {
    id: 'italian-roast-ground',
    name: 'Naples Dark Espresso Ground (Ground #38)',
    hebrewName: 'תערובת אספרסו נפוליטני טחון',
    origin: 'Blend (Santos & India Monsooned)',
    expectedAgtron: 38,
    rgb: { r: 52, g: 26, b: 14 },
    sampleMode: 'GROUND_BEAN',
    imageUrl: 'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?w=600&auto=format&fit=crop&q=80',
    flavorNotes: ['אספרסו עשיר', 'שוקולד 85%', 'עשן עץ אלון', 'קרמה סמיכה'],
  },
];

export const OpticalRoastAnalyzer: React.FC = () => {
  // State variables
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ethiopia-yirgacheffe-city');
  const [sampleMode, setSampleMode] = useState<'WHOLE_BEAN' | 'GROUND_BEAN'>('WHOLE_BEAN');
  const [currentRgb, setCurrentRgb] = useState<{ r: number; g: number; b: number }>({ r: 142, g: 88, b: 52 });
  const [sampleRadius, setSampleRadius] = useState<number>(20); // px
  
  // Dual Sample Mode for Delta Agtron
  const [wholeBeanAgtron, setWholeBeanAgtron] = useState<number>(78);
  const [groundBeanAgtron, setGroundBeanAgtron] = useState<number>(83);
  const [isDualSampleActive, setIsDualSampleActive] = useState<boolean>(false);

  // Camera & Image Upload State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedCert, setCopiedCert] = useState<boolean>(false);

  // AI Response Analysis State
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  // Canvas Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const histogramCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Current Preset
  const activePreset = useMemo(() => {
    return PRESET_SAMPLES.find((p) => p.id === selectedPresetId) || PRESET_SAMPLES[1];
  }, [selectedPresetId]);

  // Derived Agtron calculations
  const calculatedAgtron = useMemo(() => {
    const normR = Math.max(0, Math.min(255, currentRgb.r)) / 255;
    const normG = Math.max(0, Math.min(255, currentRgb.g)) / 255;
    const normB = Math.max(0, Math.min(255, currentRgb.b)) / 255;
    const Y = 0.2126 * normR + 0.7152 * normG + 0.0722 * normB;
    const agtronGourmet = Math.round(Math.max(15, Math.min(98, 125 * Math.pow(Y, 0.65) - 6)));
    const agtronCommercial = Math.round(Math.max(10, Math.min(133, 1.33 * agtronGourmet - 10)));
    const lightness = Math.round(Y * 100);
    return { gourmet: agtronGourmet, commercial: agtronCommercial, lightness };
  }, [currentRgb]);

  // Delta Agtron calculation
  const deltaAgtronValue = useMemo(() => {
    return groundBeanAgtron - wholeBeanAgtron;
  }, [groundBeanAgtron, wholeBeanAgtron]);

  const coreEvaluation = useMemo(() => {
    if (deltaAgtronValue >= 0 && deltaAgtronValue <= 8) {
      return {
        status: 'OPTIMAL',
        badge: 'חום ליבה אידיאלי (Sweet Spot)',
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
        desc: `מעבר חום מעולה (+${deltaAgtronValue} Agtron). הליבה התפתחה בהרמוניה מוחלטת עם המעטפת, המאפשרת מיצוי טעמים פירותי ונקי.`,
      };
    }
    if (deltaAgtronValue > 8 && deltaAgtronValue <= 15) {
      return {
        status: 'ACCEPTABLE',
        badge: 'התפתחות ליבה קבילה',
        color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
        desc: `עיכוב קל בחדירת החום לליבה (+${deltaAgtronValue} Agtron). מומלץ להאריך מעט את שלב ה-Maillard לקבלת מתיקות מקסימלית.`,
      };
    }
    if (deltaAgtronValue > 15) {
      return {
        status: 'UNDERDEVELOPED',
        badge: 'חוסר התפתחות פנימי (Baked/Underdeveloped)',
        color: 'text-red-400 border-red-500/40 bg-red-500/10',
        desc: `הליבה בהירה משמעותית (+${deltaAgtronValue} Agtron). הדבר גורם לטעמי עשב, עפיצות וחומציות בוסרית בכוס. הגבר זמן קלייה או חום קונבקטיבי.`,
      };
    }
    return {
      status: 'SCORCHED',
      badge: 'חריכת מעטפת (Scorched Shell)',
      color: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
      desc: `מעטפת כהה מהליבה (${deltaAgtronValue} Agtron). מגע ישיר וחם מדי בתוף הקלייה לפני התפתחות המרכז. הגבר מהירות סיבוב תוף.`,
    };
  }, [deltaAgtronValue]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: CoffeeSamplePreset) => {
    setSelectedPresetId(preset.id);
    setCurrentRgb(preset.rgb);
    setSampleMode(preset.sampleMode);
    setCustomImageSrc(null);
    if (isCameraActive) stopCamera();

    if (preset.sampleMode === 'WHOLE_BEAN') {
      setWholeBeanAgtron(preset.expectedAgtron);
      setGroundBeanAgtron(preset.expectedAgtron + 5);
    } else {
      setGroundBeanAgtron(preset.expectedAgtron);
      setWholeBeanAgtron(Math.max(15, preset.expectedAgtron - 6));
    }

    coffeeSound.playBaristaClick();
    triggerOpticalAnalysis(preset.rgb, preset.sampleMode);
  };

  // Draw Histogram on Canvas
  const drawHistogram = useCallback(
    (r: number, g: number, b: number) => {
      const canvas = histogramCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Bell Curves for Red, Green, Blue
      const channels = [
        { val: r, color: '#ef4444', label: 'R' },
        { val: g, color: '#22c55e', label: 'G' },
        { val: b, color: '#3b82f6', label: 'B' },
      ];

      channels.forEach((ch) => {
        ctx.beginPath();
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 2.5;
        const peakX = (ch.val / 255) * width;
        const peakY = height * 0.2;
        const spread = 35;

        for (let x = 0; x < width; x += 2) {
          const dist = x - peakX;
          const y = height - (height - peakY) * Math.exp(-(dist * dist) / (2 * spread * spread));
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Draw Luminosity Peak
      const lumX = (((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * width);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(lumX, 0);
      ctx.lineTo(lumX, height);
      ctx.stroke();
      ctx.setLineDash([]);
    },
    []
  );

  // Trigger Optical & Gemini 3.5 Analysis
  const triggerOpticalAnalysis = async (
    rgb = currentRgb,
    mode = sampleMode,
    whole = wholeBeanAgtron,
    ground = groundBeanAgtron
  ) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemini/optical-roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rgb,
          sampleMode: mode,
          wholeAgtron: isDualSampleActive ? whole : null,
          groundAgtron: isDualSampleActive ? ground : null,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setAiAnalysisResult(resData.data);
      }
    } catch (err) {
      console.error('Failed to analyze roast optical properties:', err);
    } finally {
      setIsAnalyzing(false);
      drawHistogram(rgb.r, rgb.g, rgb.b);
    }
  };

  // Start Webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        coffeeSound.playBaristaClick();
      }
    } catch (err) {
      alert('לא ניתן לגשת למצלמה. ודא כי ניתנה הרשאת גישה בדפדפן.');
    }
  };

  // Stop Webcam
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Capture frame from camera or sample from canvas
  const captureCameraSample = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Sample center box
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    const rSize = sampleRadius;
    const imgData = ctx.getImageData(centerX - rSize, centerY - rSize, rSize * 2, rSize * 2);
    const data = imgData.data;

    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    const count = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      totalR += data[i];
      totalG += data[i + 1];
      totalB += data[i + 2];
    }

    const avgRgb = {
      r: Math.round(totalR / count),
      g: Math.round(totalG / count),
      b: Math.round(totalB / count),
    };

    setCurrentRgb(avgRgb);
    coffeeSound.playPourSound();
    triggerOpticalAnalysis(avgRgb, sampleMode);
  };

  // Handle Custom File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCustomImageSrc(result);
      if (isCameraActive) stopCamera();

      // Sample color from uploaded image
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const centerX = Math.floor(canvas.width / 2);
        const centerY = Math.floor(canvas.height / 2);
        const rSize = 30;
        const imgData = ctx.getImageData(
          Math.max(0, centerX - rSize),
          Math.max(0, centerY - rSize),
          rSize * 2,
          rSize * 2
        );
        const data = imgData.data;
        let totalR = 0, totalG = 0, totalB = 0;
        const count = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          totalR += data[i];
          totalG += data[i + 1];
          totalB += data[i + 2];
        }
        const sampledRgb = {
          r: Math.round(totalR / count),
          g: Math.round(totalG / count),
          b: Math.round(totalB / count),
        };
        setCurrentRgb(sampledRgb);
        coffeeSound.playPourSound();
        triggerOpticalAnalysis(sampledRgb, sampleMode);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Copy Certificate to Clipboard
  const handleCopyCertificate = () => {
    const certText = `=== תעודת כיול ובקרת איכות קלייה (THE DIGITAL ROAST) ===
מדגם: ${activePreset.hebrewName} (${activePreset.origin})
מצב דגימה: ${sampleMode === 'WHOLE_BEAN' ? 'פולים שלמים' : 'קפה טחון'}
Agtron Gourmet: #${calculatedAgtron.gourmet}
Agtron Commercial: #${calculatedAgtron.commercial}
סיווג SCA: ${aiAnalysisResult?.roastClassification || 'Medium Light'}
עומק אחידות ליבה (ΔAgtron): ${isDualSampleActive ? `${deltaAgtronValue} (${coreEvaluation.badge})` : 'דגימה בודדת'}
המלצת RoR & DTR: טמפ' כניסה ${aiAnalysisResult?.recommendedRoR?.chargeTempC || 204}°C | DTR ${aiAnalysisResult?.recommendedRoR?.dtrPercent || 16.5}%
תווי טעם: ${activePreset.flavorNotes.join(', ')}
אימות מעבדה: תקן SCA Roaster Guild Certified
תאריך הנפקה: ${new Date().toLocaleDateString('he-IL')}`;

    navigator.clipboard.writeText(certText);
    setCopiedCert(true);
    coffeeSound.playBaristaClick();
    setTimeout(() => setCopiedCert(false), 3000);
  };

  // Initial Run
  useEffect(() => {
    drawHistogram(currentRgb.r, currentRgb.g, currentRgb.b);
    triggerOpticalAnalysis(currentRgb, sampleMode);
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 dir-rtl text-right font-sans">
      {/* Hidden Canvas for computation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 1. Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#120d0a] via-[#1a120c] to-[#0a0705] border border-amber-500/30 p-6 sm:p-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>SPECTROPHOTOMETRY & AGTRON VISION AI 4.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-100 tracking-tight leading-tight">
              מנתח קלייה אופטי & מדד <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400">Agtron Gourmet</span>
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              מערכת ספקטרופוטומטריה ממוחשבת לכיול דרגות קלייה, חישוב סקאלת Agtron לפי תקן ה-SCA, ניתוח אחידות חום הליבה (ΔAgtron) וזיהוי פגמי קלייה בראיית מחשב ו-Gemini 3.5 Flash Lite Vision.
            </p>
          </div>

          {/* Quick Agtron Badge */}
          <div className="flex items-center gap-4 bg-stone-950/80 backdrop-blur-xl border-2 border-amber-500/40 p-5 rounded-2xl shadow-xl shrink-0">
            <div
              className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-inner flex items-center justify-center font-mono font-black text-2xl text-white shadow-black/80"
              style={{ backgroundColor: `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})` }}
            >
              #{calculatedAgtron.gourmet}
            </div>
            <div>
              <div className="text-xs text-stone-400 font-mono">AGTRON GOURMET</div>
              <div className="text-xl font-black text-amber-300">
                {aiAnalysisResult?.roastClassification?.split('/')[0] || 'City Roast'}
              </div>
              <div className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SCA Precision &plusmn;1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Preset Bean Selector Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-stone-200 font-bold text-sm">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>בחר מדגם כיול מוכן מראש (Specialty Standards):</span>
          </div>
          <span className="text-xs text-stone-400 font-mono">6 דוגמיות מעבדה</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PRESET_SAMPLES.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 group relative overflow-hidden ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                    : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className="w-6 h-6 rounded-lg border border-white/20 shadow"
                    style={{ backgroundColor: `rgb(${preset.rgb.r}, ${preset.rgb.g}, ${preset.rgb.b})` }}
                  />
                  <span className="text-xs font-mono font-bold text-amber-400">
                    #{preset.expectedAgtron}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-black text-stone-100 line-clamp-1 group-hover:text-amber-300">
                    {preset.hebrewName.split('-')[0]}
                  </div>
                  <div className="text-[10px] text-stone-400 line-clamp-1 font-mono mt-0.5">
                    {preset.origin.split(',')[0]}
                  </div>
                </div>

                <div className="text-[10px] px-2 py-0.5 rounded bg-stone-950/80 text-stone-300 border border-stone-800 w-fit">
                  {preset.sampleMode === 'WHOLE_BEAN' ? 'פול שלם' : 'טחון'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Two-Column Analysis Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left/Main Column: Optical Capture, Reticle & Colorimetry (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-[#0e0a08] border border-amber-500/30 p-6 space-y-6 shadow-xl backdrop-blur-2xl">
            
            {/* Capture Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isCameraActive) stopCamera();
                    else startCamera();
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                    isCameraActive
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{isCameraActive ? 'כבה מצלמה' : 'הפעל מצלמה חיה'}</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-stone-900 border border-stone-800 text-stone-200 hover:text-amber-300 hover:border-amber-500/40 flex items-center gap-2 transition-all"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>העלה תמונה</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Sample Mode Switcher */}
              <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
                <button
                  onClick={() => {
                    setSampleMode('WHOLE_BEAN');
                    coffeeSound.playBaristaClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    sampleMode === 'WHOLE_BEAN'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  פול שלם (Whole)
                </button>
                <button
                  onClick={() => {
                    setSampleMode('GROUND_BEAN');
                    coffeeSound.playBaristaClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    sampleMode === 'GROUND_BEAN'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  קפה טחון (Ground)
                </button>
              </div>
            </div>

            {/* Viewfinder / Reticle Canvas Area */}
            <div className="relative w-full aspect-video rounded-2xl bg-stone-950 border-2 border-stone-800 overflow-hidden flex items-center justify-center group shadow-inner">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : customImageSrc ? (
                <img
                  src={customImageSrc}
                  alt="Custom Coffee Sample"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activePreset.imageUrl}
                  alt={activePreset.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {/* Reticle Overlay Crosshair */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Outer Reticle Ring */}
                <div
                  className="rounded-full border-2 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center justify-center transition-all animate-pulse"
                  style={{ width: `${sampleRadius * 4}px`, height: `${sampleRadius * 4}px` }}
                >
                  {/* Center Dot */}
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md" />
                </div>

                {/* Crosshair Horizontal & Vertical Lines */}
                <div className="absolute w-24 h-px bg-amber-400/40" />
                <div className="absolute h-24 w-px bg-amber-400/40" />
              </div>

              {/* Action Button inside Viewfinder */}
              {isCameraActive && (
                <div className="absolute bottom-4 z-20">
                  <button
                    onClick={captureCameraSample}
                    className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-2xl shadow-amber-500/50 flex items-center gap-2 transform active:scale-95 transition-all"
                  >
                    <Eye className="w-5 h-5" />
                    <span>דגום צבע מהמצלמה</span>
                  </button>
                </div>
              )}

              {/* Live Color Swatch Tag */}
              <div className="absolute top-4 left-4 bg-stone-950/90 backdrop-blur-md border border-white/20 p-2 rounded-xl flex items-center gap-2.5 text-xs text-stone-200 font-mono shadow-xl">
                <div
                  className="w-4 h-4 rounded-full border border-white/40"
                  style={{ backgroundColor: `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})` }}
                />
                <span>RGB({currentRgb.r}, {currentRgb.g}, {currentRgb.b})</span>
              </div>
            </div>

            {/* Reticle Radius Slider */}
            <div className="flex items-center justify-between gap-4 bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/80">
              <div className="flex items-center gap-2 text-xs text-stone-300 font-bold">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>רדיוס דגימת כוונת אופטית:</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="10"
                  max="45"
                  value={sampleRadius}
                  onChange={(e) => setSampleRadius(Number(e.target.value))}
                  className="w-32 accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-amber-400 w-12 text-left">
                  {sampleRadius}px
                </span>
              </div>
            </div>

            {/* Real-Time Color Channels & Histogram Canvas */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-300">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>היסטוגרמת ערוצי ספקטרום (RGB & Luminosity):</span>
                </span>
                <span className="text-[11px] font-mono text-stone-400">
                  Luminance: {calculatedAgtron.lightness}%
                </span>
              </div>

              <div className="w-full h-28 rounded-2xl bg-stone-950 border border-stone-800 p-2 relative overflow-hidden">
                <canvas
                  ref={histogramCanvasRef}
                  width={500}
                  height={100}
                  className="w-full h-full object-fill"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="p-2 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300">
                  R: <span className="font-bold text-white">{currentRgb.r}</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                  G: <span className="font-bold text-white">{currentRgb.g}</span>
                </div>
                <div className="p-2 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-300">
                  B: <span className="font-bold text-white">{currentRgb.b}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dual Sample & Delta Agtron Box */}
          <div className="rounded-3xl bg-[#0e0a08] border border-amber-500/30 p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-100">
                    ניתוח עומק ואחידות ליבה (&Delta;Agtron Core Homogeneity)
                  </h3>
                  <p className="text-xs text-stone-400">השוואת פול שלם מול קפה טחון לזיהוי חדירת החום</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsDualSampleActive(!isDualSampleActive);
                  coffeeSound.playBaristaClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isDualSampleActive
                    ? 'bg-amber-500 text-stone-950 border-amber-400'
                    : 'bg-stone-900 text-stone-300 border-stone-800 hover:text-amber-300'
                }`}
              >
                {isDualSampleActive ? 'מצב פעיל' : 'הפעל השוואה'}
              </button>
            </div>

            {isDualSampleActive && (
              <div className="space-y-4 pt-2 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Whole Bean Slider */}
                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-300">1. פול שלם (מעטפת):</span>
                      <span className="font-mono font-black text-amber-400">#{wholeBeanAgtron}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="95"
                      value={wholeBeanAgtron}
                      onChange={(e) => setWholeBeanAgtron(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Ground Bean Slider */}
                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-300">2. קפה טחון (ליבה):</span>
                      <span className="font-mono font-black text-amber-400">#{groundBeanAgtron}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="95"
                      value={groundBeanAgtron}
                      onChange={(e) => setGroundBeanAgtron(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Delta Result Card */}
                <div className={`p-4 rounded-2xl border ${coreEvaluation.color} flex items-start gap-3.5`}>
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-100">{coreEvaluation.badge}</span>
                      <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-black/40 border border-white/10">
                        &Delta;Agtron: {deltaAgtronValue > 0 ? `+${deltaAgtronValue}` : deltaAgtronValue}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">{coreEvaluation.desc}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Agtron Meter, Defect Radar, RoR & Certificate (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Agtron Gauge & Scale Card */}
          <div className="rounded-3xl bg-[#0e0a08] border border-amber-500/30 p-6 space-y-5 shadow-xl backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>מדד Agtron & סיווג קלייה</span>
              </h3>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SCA CERTIFIED
              </span>
            </div>

            {/* Dual Agtron Numbers */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/30 shadow-inner">
                <div className="text-[11px] text-stone-400 font-mono">AGTRON GOURMET</div>
                <div className="text-4xl font-black text-amber-300 font-mono mt-1">
                  #{calculatedAgtron.gourmet}
                </div>
                <div className="text-[10px] text-stone-400 mt-1">סקאלת ספשלטי (0-100)</div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 shadow-inner">
                <div className="text-[11px] text-stone-400 font-mono">COMMERCIAL SCALE</div>
                <div className="text-4xl font-black text-stone-200 font-mono mt-1">
                  #{calculatedAgtron.commercial}
                </div>
                <div className="text-[10px] text-stone-400 mt-1">סקאלה מסחרית (0-133)</div>
              </div>
            </div>

            {/* Visual Color Gradient Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>Dark #25</span>
                <span>Medium #60</span>
                <span>Light #90</span>
              </div>
              <div className="relative w-full h-4 rounded-full bg-gradient-to-r from-[#241208] via-[#7d4824] to-[#d69f6e] border border-stone-700 overflow-hidden">
                {/* Pointer marker */}
                <div
                  className="absolute top-0 bottom-0 w-2.5 bg-white shadow-[0_0_10px_#fff] rounded-full transform -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${Math.max(5, Math.min(95, ((calculatedAgtron.gourmet - 15) / 80) * 100))}%` }}
                />
              </div>
            </div>

            {/* Classification Description */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
              <div className="text-xs font-bold text-amber-300">
                {aiAnalysisResult?.hebrewRoastName || 'קלייה בינונית מאוזנת (City+ Roast)'}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {aiAnalysisResult?.recommendedRoR?.advice ||
                  'פרופיל אופטימלי להדגשת מתיקות סוכר קנים, חומציות הדרים מתונה וסיומת קרמל עשירה.'}
              </p>
            </div>
          </div>

          {/* Gemini 3.5 Multimodal Defect Inspector */}
          <div className="rounded-3xl bg-[#0e0a08] border border-amber-500/30 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="text-base font-bold text-stone-100">רדאר פגמי קלייה Gemini AI</h3>
              </div>
              <button
                onClick={() => triggerOpticalAnalysis()}
                disabled={isAnalyzing}
                className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'מנתח...' : 'סרוק שוב'}</span>
              </button>
            </div>

            {/* Defect Badges List */}
            <div className="space-y-2.5">
              {(aiAnalysisResult?.defectsDetected || [
                { type: 'Quakers', hebrewName: 'פולים בוסריים (Quakers)', severity: 'NONE', visualNote: 'תגובת מייארד מלאה ללא פולים צהובים' },
                { type: 'Scorching', hebrewName: 'חריכת תוף מוליכה (Scorching)', severity: 'NONE', visualNote: 'פני שטח נקיים מכתמים שחורים שטוחים' },
                { type: 'Tipping', hebrewName: 'כוויות קצה עובר (Tipping)', severity: 'NONE', visualNote: 'קצוות שלמים ללא שריפת עובר' },
              ]).map((defect: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-stone-950 border border-stone-800/90 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${defect.severity === 'NONE' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <div>
                      <span className="font-bold text-stone-200">{defect.hebrewName}</span>
                      <div className="text-[10px] text-stone-400 mt-0.5">{defect.visualNote}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    defect.severity === 'NONE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {defect.severity === 'NONE' ? 'נקי (Clean)' : defect.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RoR Recommendation & Roasting Parameters */}
          <div className="rounded-3xl bg-[#0e0a08] border border-amber-500/30 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <span>המלצות כיול RoR & פרמטרי קלייה</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-stone-400">טמפ' כניסה (Charge Temp):</span>
                <div className="text-base font-black text-amber-300 font-mono">
                  {aiAnalysisResult?.recommendedRoR?.chargeTempC || 204}&deg;C
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-stone-400">יחס פיתוח (DTR%):</span>
                <div className="text-base font-black text-amber-300 font-mono">
                  {aiAnalysisResult?.recommendedRoR?.dtrPercent || 16.5}%
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-stone-400">חלון פיצוץ ראשון (1st Crack):</span>
                <div className="text-sm font-bold text-stone-200 font-mono">
                  {aiAnalysisResult?.recommendedRoR?.firstCrackWindow || '9:30 - 10:20'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-stone-400">שיטת חליטה מומלצת:</span>
                <div className="text-sm font-bold text-stone-200">
                  {aiAnalysisResult?.brewingRecommendations?.bestBrewMethod || 'V60 Pour-Over'}
                </div>
              </div>
            </div>

            {/* Certificate Copy / Export Button */}
            <button
              onClick={handleCopyCertificate}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all transform active:scale-95"
            >
              {copiedCert ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              <span>{copiedCert ? 'תעודת האיכות הועתקה!' : 'העתק תעודת כיול ובקרת איכות'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpticalRoastAnalyzer;
