'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Activity,
  Sliders,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Info,
  Layers,
  ArrowLeft,
  ChevronLeft,
  ShieldCheck,
  Disc,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export type GrindTargetMode = 'espresso' | 'v60' | 'aeropress' | 'french-press' | 'cold-brew';

interface GrindPresetConfig {
  id: GrindTargetMode;
  name: string;
  hebrewName: string;
  targetMicrons: number; // e.g. 380µm
  idealPitchHz: number; // e.g. 3850 Hz
  toleranceMicrons: number; // ±15µm
  dialSetting: string; // "2.4"
  flowRateTarget: string; // "1.8 - 2.2 ml/s"
  description: string;
}

const GRIND_PRESETS: Record<GrindTargetMode, GrindPresetConfig> = {
  espresso: {
    id: 'espresso',
    name: 'Espresso (9 Bar Portafilter)',
    hebrewName: 'אספרסו מדויק 9Bar',
    targetMicrons: 380,
    idealPitchHz: 3850,
    toleranceMicrons: 15,
    dialSetting: '2.4',
    flowRateTarget: '1.8 - 2.2 ml/s',
    description: 'טחינה דקה והומוגנית במיוחד ליצירת התנגדות אחידה כנגד לחץ 9Bar ללא פריצת תעלות (Channeling).',
  },
  v60: {
    id: 'v60',
    name: 'V60 Pour-Over / Chemex',
    hebrewName: 'חליטת פילטר V60 גורמה',
    targetMicrons: 620,
    idealPitchHz: 2600,
    toleranceMicrons: 25,
    dialSetting: '5.8',
    flowRateTarget: '4.5 - 5.5 ml/s',
    description: 'חלקיקים בגודל בינוני המאפשרים זרימה למינרית דרך נייר הפילטר למיצוי צלול של תווים פרחוניים.',
  },
  aeropress: {
    id: 'aeropress',
    name: 'AeroPress Inverted',
    hebrewName: 'אירופרס שיטה הפוכה',
    targetMicrons: 500,
    idealPitchHz: 3100,
    toleranceMicrons: 20,
    dialSetting: '4.2',
    flowRateTarget: '3.0 - 3.8 ml/s',
    description: 'טחינה בינונית-דקה הממקסמת מתיקות וגוף מלא בחליטת לחץ ידני מבוקרת.',
  },
  'french-press': {
    id: 'french-press',
    name: 'French Press Plunger',
    hebrewName: 'פלנג׳ר / פרנץ׳ פרס',
    targetMicrons: 850,
    idealPitchHz: 1800,
    toleranceMicrons: 40,
    dialSetting: '8.5',
    flowRateTarget: 'חליטת השריה מלאה',
    description: 'טחינה גסה ואחידה למניעת מעבר חלקיקי אבק קפה (Fines) דרך רשת הנירוסטה.',
  },
  'cold-brew': {
    id: 'cold-brew',
    name: 'Nitro & Cold Brew Immersion',
    hebrewName: 'חליטה קרה וניטרו 18h',
    targetMicrons: 1050,
    idealPitchHz: 1300,
    toleranceMicrons: 50,
    dialSetting: '10.0',
    flowRateTarget: 'מיצוי איטי בטמפרטורת חדר',
    description: 'טחינה גסה במיוחד לשחרור איטי והדרגתי של שמנים ארומטיים ללא שחרור חומצות מרירות.',
  },
};

export const AcousticGrindTuner: React.FC = () => {
  const [selectedTarget, setSelectedTarget] = useState<GrindTargetMode>('espresso');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSimulatedAudio, setIsSimulatedAudio] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);

  // Real-time acoustic telemetry metrics
  const [detectedPitchHz, setDetectedPitchHz] = useState<number>(3850);
  const [estimatedMicrons, setEstimatedMicrons] = useState<number>(380);
  const [channelingRiskPercent, setChannelingRiskPercent] = useState<number>(8); // 0-100%
  const [burrAlignmentScore, setBurrAlignmentScore] = useState<number>(97); // 0-100%
  const [recommendedAdjustmentUm, setRecommendedAdjustmentUm] = useState<number>(0); // e.g. -15 or +20
  const [recommendedDialShift, setRecommendedDialShift] = useState<string>('2.4 (מכויל פיקס)');
  const [flowStatus, setFlowStatus] = useState<'PERFECT' | 'CHANNELING' | 'CHOKED' | 'FAST_STREAM'>('PERFECT');

  // Canvas visualizer refs
  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const waterfallCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Web Audio API refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const waterfallHistoryRef = useRef<number[][]>([]);

  const activeConfig = GRIND_PRESETS[selectedTarget];

  // Switch Target Preset
  const handleSelectPreset = (target: GrindTargetMode) => {
    coffeeSound.playBaristaClick();
    setSelectedTarget(target);
    const cfg = GRIND_PRESETS[target];
    setEstimatedMicrons(cfg.targetMicrons);
    setDetectedPitchHz(cfg.idealPitchHz);
    setChannelingRiskPercent(5);
    setRecommendedAdjustmentUm(0);
    setRecommendedDialShift(`${cfg.dialSetting} (מכויל)`);
    setFlowStatus('PERFECT');
  };

  // Start / Stop Microphone Audio Listener
  const toggleAudioListening = async () => {
    coffeeSound.playBaristaClick();

    if (isListening) {
      // Stop listening
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsListening(false);
      setIsSimulatedAudio(false);
      return;
    }

    try {
      setMicError(null);
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;
      analyserRef.current = analyser;

      // Try user microphone stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        mediaStreamRef.current = stream;
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);
        setIsSimulatedAudio(false);
      } catch (err) {
        console.warn('Microphone permission denied or unavailable, launching synthetic acoustic synthesizer:', err);
        // Fallback to synthetic oscillator + white noise to simulate grinder sound
        const osc = ctx.createOscillator();
        const noiseGen = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        noiseGen.buffer = buffer;
        noiseGen.loop = true;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(activeConfig.idealPitchHz, ctx.currentTime);
        bandpass.Q.setValueAtTime(4, ctx.currentTime);

        noiseGen.connect(bandpass);
        bandpass.connect(analyser);
        noiseGen.start();

        setIsSimulatedAudio(true);
      }

      setIsListening(true);
      coffeeSound.playCoffeeSteam();
    } catch (e: any) {
      console.error('Audio initialization failed:', e);
      setMicError('לא ניתן לגשת למיקרופון. מפעיל מצב סימולציה אוטומטי.');
      setIsSimulatedAudio(true);
      setIsListening(true);
    }
  };

  // Real-time Audio Spectrum & Waterfall Canvas Animation
  useEffect(() => {
    if (!isListening) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const scopeCanvas = scopeCanvasRef.current;
    const waterfallCanvas = waterfallCanvasRef.current;
    if (!scopeCanvas || !waterfallCanvas) return;

    const scopeCtx = scopeCanvas.getContext('2d');
    const waterfallCtx = waterfallCanvas.getContext('2d');
    if (!scopeCtx || !waterfallCtx) return;

    const bufferLength = analyserRef.current?.frequencyBinCount || 128;
    const dataArray = new Uint8Array(bufferLength);
    const timeDataArray = new Uint8Array(bufferLength);

    const renderLoop = () => {
      animFrameRef.current = requestAnimationFrame(renderLoop);

      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        analyserRef.current.getByteTimeDomainData(timeDataArray);
      } else {
        // Fallback synthetic data
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.floor(Math.random() * 120 + 80);
          timeDataArray[i] = Math.floor(Math.sin(i + Date.now() / 100) * 60 + 128);
        }
      }

      // 1. Render Oscilloscope Waveform (scopeCanvas)
      const sw = scopeCanvas.width;
      const sh = scopeCanvas.height;
      scopeCtx.fillStyle = '#0a0808';
      scopeCtx.fillRect(0, 0, sw, sh);

      // Grid Lines
      scopeCtx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
      scopeCtx.lineWidth = 1;
      for (let x = 0; x < sw; x += 40) {
        scopeCtx.beginPath();
        scopeCtx.moveTo(x, 0);
        scopeCtx.lineTo(x, sh);
        scopeCtx.stroke();
      }

      // Draw Waveform Line
      scopeCtx.lineWidth = 2.5;
      scopeCtx.strokeStyle = '#f59e0b';
      scopeCtx.shadowColor = '#f59e0b';
      scopeCtx.shadowBlur = 8;
      scopeCtx.beginPath();

      const sliceWidth = sw / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = timeDataArray[i] / 128.0;
        const y = (v * sh) / 2;
        if (i === 0) scopeCtx.moveTo(x, y);
        else scopeCtx.lineTo(x, y);
        x += sliceWidth;
      }
      scopeCtx.stroke();
      scopeCtx.shadowBlur = 0;

      // 2. Render FFT Waterfall Heat Spectrum (waterfallCanvas)
      const ww = waterfallCanvas.width;
      const wh = waterfallCanvas.height;
      waterfallCtx.fillStyle = '#0a0808';
      waterfallCtx.fillRect(0, 0, ww, wh);

      const barWidth = (ww / bufferLength) * 1.8;
      let bx = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * wh;

        // Gradient color from amber to cyan based on frequency height
        const gradient = waterfallCtx.createLinearGradient(0, wh, 0, wh - barHeight);
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(0.6, '#06b6d4');
        gradient.addColorStop(1, '#ec4899');

        waterfallCtx.fillStyle = gradient;
        waterfallCtx.fillRect(bx, wh - barHeight, barWidth, barHeight);
        bx += barWidth + 1.5;
      }

      // 3. Audio Frequency & Channeling Telemetry Math
      let maxVal = 0;
      let maxIdx = 0;
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
        if (dataArray[i] > maxVal) {
          maxVal = dataArray[i];
          maxIdx = i;
        }
      }

      const avgEnergy = sum / bufferLength;
      const dominantFreq = Math.round((maxIdx / bufferLength) * 8000 + 400);

      if (dominantFreq > 100) {
        setDetectedPitchHz(dominantFreq);

        // Calculate micron estimation based on dominant pitch
        // Higher pitch (>4500Hz) = finer grind / excess fines; Lower pitch (<2500Hz) = coarser
        const deltaFreq = dominantFreq - activeConfig.idealPitchHz;
        const calculatedMicrons = Math.max(
          150,
          Math.min(1200, Math.round(activeConfig.targetMicrons - deltaFreq * 0.08))
        );
        setEstimatedMicrons(calculatedMicrons);

        // Channeling Risk Analysis
        const micronDiff = Math.abs(calculatedMicrons - activeConfig.targetMicrons);
        const risk = Math.min(95, Math.round((micronDiff / activeConfig.toleranceMicrons) * 20));
        setChannelingRiskPercent(risk);

        // Burr alignment & wear
        const alignScore = Math.max(70, Math.min(99, Math.round(100 - avgEnergy * 0.1)));
        setBurrAlignmentScore(alignScore);

        // Calibration recommendations
        const neededShiftUm = activeConfig.targetMicrons - calculatedMicrons;
        setRecommendedAdjustmentUm(neededShiftUm);

        if (Math.abs(neededShiftUm) <= activeConfig.toleranceMicrons) {
          setFlowStatus('PERFECT');
          setRecommendedDialShift(`${activeConfig.dialSetting} (מכויל אידיאלי)`);
        } else if (neededShiftUm > 0) {
          // Grind too fine -> recommend opening gap
          setFlowStatus(risk > 60 ? 'CHOKED' : 'PERFECT');
          setRecommendedDialShift(`פתח סכינים ל-${(parseFloat(activeConfig.dialSetting) + 0.3).toFixed(1)}`);
        } else {
          // Grind too coarse -> recommend tightening gap
          setFlowStatus(risk > 50 ? 'CHANNELING' : 'FAST_STREAM');
          setRecommendedDialShift(`הדק סכינים ל-${(parseFloat(activeConfig.dialSetting) - 0.3).toFixed(1)}`);
        }
      }
    };

    renderLoop();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isListening, activeConfig]);

  return (
    <section id="acoustic-grind-tuner" className="w-full space-y-10 dir-rtl">
      {/* 1. Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
          <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Web Audio API Acoustic Spectrum Parsing & Burr Calibration</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-100 tracking-tight">
          מכוונן טחינה אקוסטי <span className="text-gold-gradient">& גלאי פריצת תעלות (Channeling)</span>
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          מערכת האזנה בזמן אמת לרעש סכיני המטחנה (Burr Noise) ותדרי נטיפת האספרסו.
          האלגוריתם מזהה פיזור חלקיקים לא אחיד, מעריך את גודל החלקיקים במיקרונים (µm), וממליץ על כיול מדויק של מרווח הסכינים.
        </p>
      </div>

      {/* 2. Target Brew Method Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.keys(GRIND_PRESETS) as GrindTargetMode[]).map((key) => {
          const cfg = GRIND_PRESETS[key];
          const isSelected = selectedTarget === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`p-4 rounded-2xl border text-right transition-all group ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-[#141010] border-stone-800 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800">
                  {cfg.targetMicrons}µm
                </span>
                <Disc className={`w-4 h-4 ${isSelected ? 'text-amber-400 animate-spin-slow' : 'text-stone-600'}`} />
              </div>
              <div className="text-xs font-black text-stone-100 group-hover:text-amber-300">
                {cfg.hebrewName}
              </div>
              <div className="text-[10px] text-stone-400 mt-1 truncate">
                תדר יעד: {cfg.idealPitchHz}Hz • חוגה: {cfg.dialSetting}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Main Acoustic Dashboard (Live Spectrum + Burr Calibration) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Audio Oscilloscope & Waterfall (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl liquid-glass border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-black text-stone-100">ספקטרוגרף אקוסטי & גלי שמע חיים</h3>
                  <p className="text-[10px] text-stone-400">דגימת תדרי Grinder FFT מ-100Hz עד 8kHz</p>
                </div>
              </div>

              <button
                onClick={toggleAudioListening}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-lg ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-rose-500/30 animate-pulse'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 hover:brightness-110 shadow-amber-500/20'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>עצור האזנה</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>הפעל האזנת מיקרופון AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulated Audio Mode Notice if mic fallback */}
            {isSimulatedAudio && isListening && (
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>מצב סינתיסייזר אקוסטי פעיל (Audio Simulation Stream)</span>
              </div>
            )}

            {/* Scope Waveform Canvas */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-stone-400 px-1 font-mono">
                <span>Oscilloscope Waveform</span>
                <span>{detectedPitchHz} Hz Peak</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-stone-800 bg-[#0a0808]">
                <canvas
                  ref={scopeCanvasRef}
                  width={560}
                  height={130}
                  className="w-full h-32 block"
                />
              </div>
            </div>

            {/* FFT Frequency Waterfall Canvas */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-stone-400 px-1 font-mono">
                <span>FFT Frequency Waterfall (100Hz - 8kHz)</span>
                <span>Energy: {isListening ? 'STREAMING' : 'IDLE'}</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-stone-800 bg-[#0a0808]">
                <canvas
                  ref={waterfallCanvasRef}
                  width={560}
                  height={110}
                  className="w-full h-28 block"
                />
              </div>
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-0.5">
                <span className="text-[10px] text-stone-400 block">גודל חלקיק משוער</span>
                <span className="text-sm font-black text-amber-300 font-mono">{estimatedMicrons}µm</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-0.5">
                <span className="text-[10px] text-stone-400 block">סיכון לפריצת תעלות</span>
                <span className={`text-sm font-black font-mono ${channelingRiskPercent > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {channelingRiskPercent}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-0.5">
                <span className="text-[10px] text-stone-400 block">איזון סכינים (Alignment)</span>
                <span className="text-sm font-black text-cyan-400 font-mono">{burrAlignmentScore}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-0.5">
                <span className="text-[10px] text-stone-400 block">סטטוס זרימה</span>
                <span className="text-xs font-bold text-amber-400 block truncate">
                  {flowStatus === 'PERFECT' ? 'זרימה למינרית מושלמת' : flowStatus === 'CHANNELING' ? 'התזות Channeling' : 'זרימה חנוקה'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Burr Gap Calibration & Tuning Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl liquid-glass border border-amber-500/30 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-black text-stone-100">כיול מיקרומטרי לסכינים (Burr Gap)</h3>
                  <p className="text-[10px] text-stone-400">המלצות כוונון לטחינה הומוגנית</p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                יעד: {activeConfig.targetMicrons}µm
              </span>
            </div>

            {/* Adjustment Recommendation Card */}
            <div className={`p-4 rounded-2xl border space-y-3 ${
              Math.abs(recommendedAdjustmentUm) <= activeConfig.toleranceMicrons
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black">המלצת אלגוריתם האקוסטיקה:</span>
                </div>
                <span className="text-xs font-mono font-bold">{recommendedDialShift}</span>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                {Math.abs(recommendedAdjustmentUm) <= activeConfig.toleranceMicrons ? (
                  <>ספקטרום הרעש מצביע על התאמה מדויקת (Harmonic Sweet Spot)! פיזור החלקיקים אחיד לחלוטין ואין צורך בשינוי חוגה.</>
                ) : recommendedAdjustmentUm > 0 ? (
                  <>הטחינה דקה מדי ({estimatedMicrons}µm) ויוצרת אבק קפה (Fines) העלול לחנוק את המיצוי. מומלץ לפתוח את מרווח הסכינים ב-{Math.abs(recommendedAdjustmentUm)}µm.</>
                ) : (
                  <>הטחינה גסה מדי ({estimatedMicrons}µm) ומאפשרת למים לפרוץ נתיבים מהירים (Channeling). מומלץ להדק את מרווח הסכינים ב-{Math.abs(recommendedAdjustmentUm)}µm.</>
                )}
              </p>
            </div>

            {/* Grinder Burr Specs & Target Parameters */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950/80 border border-stone-800">
                <span className="text-stone-400">סוג סכינים מכויל:</span>
                <span className="text-stone-200 font-bold">Flat Burrs 64mm SSP Red Speed</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950/80 border border-stone-800">
                <span className="text-stone-400">קצב זרימה יעד (Flow Rate):</span>
                <span className="text-amber-300 font-mono font-bold">{activeConfig.flowRateTarget}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950/80 border border-stone-800">
                <span className="text-stone-400">סבילות מקסימלית (Tolerance):</span>
                <span className="text-cyan-300 font-mono font-bold">±{activeConfig.toleranceMicrons}µm</span>
              </div>
            </div>

            {/* Hebrew Voice Barista Guidance Button */}
            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                coffeeSound.speakHebrew(
                  `ניתוח אקוסטי הושלם עבור ${activeConfig.hebrewName}. גודל החלקיקים המשוער הוא ${estimatedMicrons} מיקרון. ${
                    Math.abs(recommendedAdjustmentUm) <= activeConfig.toleranceMicrons
                      ? 'הטחינה מכוילת באופן אידיאלי.'
                      : `מומלץ לשנות את החוגה ל-${recommendedDialShift}.`
                  }`
                );
              }}
              className="w-full py-3.5 rounded-2xl bg-[#1a1412] border border-amber-500/40 text-amber-300 font-extrabold text-xs hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>השמע הנחיית בריסטה קולית בעברית</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
