'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Activity, Mic, MicOff, Volume2, Sparkles, Sliders } from 'lucide-react';

interface BrewAcousticWaveformProps {
  className?: string;
  autoPlay?: boolean;
  barsCount?: number;
  colorScheme?: 'amber' | 'cyan' | 'emerald';
  mode?: 'pump9bar' | 'grindBurr' | 'pourOver' | 'mic';
}

export function BrewAcousticWaveform({
  className = '',
  autoPlay = true,
  barsCount = 48,
  colorScheme = 'amber',
  mode: initialMode = 'pump9bar',
}: BrewAcousticWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [activeMode, setActiveMode] = useState<'pump9bar' | 'grindBurr' | 'pourOver' | 'mic'>(initialMode);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [peakFrequency, setPeakFrequency] = useState<number>(440);
  const [thdScore, setThdScore] = useState<number>(1.2);

  // Audio Context refs for real microphone FFT
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Toggle Microphone
  const toggleMic = async () => {
    if (micActive) {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setMicActive(false);
      setActiveMode('pump9bar');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        micStreamRef.current = stream;
        setMicActive(true);
        setActiveMode('mic');
      } catch (err) {
        console.error('Microphone access error:', err);
      }
    }
  };

  // Color Palette Mapper
  const getGradientColors = () => {
    if (colorScheme === 'cyan') {
      return { from: '#38bdf8', to: '#0284c7', glow: 'rgba(56, 189, 248, 0.4)' };
    }
    if (colorScheme === 'emerald') {
      return { from: '#34d399', to: '#059669', glow: 'rgba(52, 211, 153, 0.4)' };
    }
    return { from: '#fbbf24', to: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' };
  };

  // Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 180);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let frame = 0;
    const freqData = new Uint8Array(barsCount);

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const colors = getGradientColors();

      // Read real mic FFT or simulate
      if (micActive && analyserRef.current) {
        const rawData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(rawData);
        for (let i = 0; i < barsCount; i++) {
          freqData[i] = rawData[Math.floor((i / barsCount) * rawData.length)] || 0;
        }
      } else if (isPlaying) {
        // Mode Simulations
        for (let i = 0; i < barsCount; i++) {
          const ratio = i / barsCount;
          let val = 0;

          if (activeMode === 'pump9bar') {
            // 50Hz/60Hz ULKA Pump vibration harmonic + pressure peaks
            const baseWave = Math.sin(frame * 0.08 + ratio * 8) * 0.5 + 0.5;
            const harmonic = Math.sin(frame * 0.15 + ratio * 16) * 0.3;
            val = (baseWave + harmonic + Math.random() * 0.15) * 200;
          } else if (activeMode === 'grindBurr') {
            // High frequency acoustic bursts (3kHz - 8kHz)
            const burrNoise = Math.sin(frame * 0.2 + ratio * 24) * 0.4 + 0.5;
            val = (burrNoise + Math.random() * 0.4) * 220;
          } else {
            // Pour over gentle acoustic drops
            const droplet = Math.sin(frame * 0.04 + ratio * 4) * 0.6 + 0.4;
            val = droplet * 140;
          }

          freqData[i] = Math.min(255, Math.max(10, val));
        }
      }

      const barWidth = (width / barsCount) * 0.7;
      const gap = (width / barsCount) * 0.3;

      // 1. Draw Pulsing Background Sine Wave Line
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = colors.glow;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = colors.from;
      ctx.shadowBlur = 12;

      for (let i = 0; i < barsCount; i++) {
        const x = i * (barWidth + gap) + barWidth / 2;
        const normalized = freqData[i] / 255;
        const y = height / 2 - (normalized - 0.5) * (height * 0.7);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // 2. Draw Frequency Bars with Glow Cap
      for (let i = 0; i < barsCount; i++) {
        const x = i * (barWidth + gap);
        const normalized = freqData[i] / 255;
        const barHeight = Math.max(6, normalized * (height * 0.85));
        const y = height - barHeight;

        // Gradient Bar
        const barGrad = ctx.createLinearGradient(x, y, x, height);
        barGrad.addColorStop(0, colors.from);
        barGrad.addColorStop(1, 'rgba(28, 25, 23, 0.2)');

        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();

        // Glowing Cap Node
        if (normalized > 0.4) {
          ctx.save();
          ctx.shadowColor = colors.from;
          ctx.shadowBlur = 8;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y - 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Update telemetry state occasionally
      if (frame % 30 === 0) {
        const avg = freqData.reduce((a, b) => a + b, 0) / barsCount;
        setPeakFrequency(Math.floor(220 + avg * 4.5));
        setThdScore(parseFloat((0.8 + (avg / 255) * 1.4).toFixed(2)));
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, micActive, activeMode, colorScheme, barsCount]);

  return (
    <div
      className={`relative rounded-3xl p-5 bg-gradient-to-b from-stone-900/80 to-stone-950/95 border border-amber-500/25 backdrop-blur-2xl shadow-2xl overflow-hidden select-none ${className}`}
      dir="rtl"
    >
      {/* Header & Modes */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-100 flex items-center gap-1.5">
              <span>טלמטריית תדרי חליטה אקוסטית (Acoustic FFT)</span>
            </h4>
            <div className="flex items-center gap-3 text-[11px] text-stone-400 font-mono">
              <span>תדר ראשי: <strong className="text-amber-400">{peakFrequency} Hz</strong></span>
              <span>THD%: <strong className="text-emerald-400">{thdScore}%</strong></span>
            </div>
          </div>
        </div>

        {/* Mic & Mode Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMic}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              micActive
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30'
                : 'bg-stone-900/80 text-stone-300 border-white/10 hover:bg-stone-800'
            }`}
          >
            {micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{micActive ? 'מיקרופון פעיל' : 'הפעל מיקרופון'}</span>
          </button>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="relative w-full h-32 my-2">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Preset Mode Pills */}
      <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          {(['pump9bar', 'grindBurr', 'pourOver'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                if (micActive) toggleMic();
                setActiveMode(m);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-semibold border ${
                activeMode === m && !micActive
                  ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-stone-900/60 text-stone-400 border-white/5 hover:bg-stone-800'
              }`}
            >
              {m === 'pump9bar' && 'משאבת 9Bar'}
              {m === 'grindBurr' && 'סכיני מטחנה'}
              {m === 'pourOver' && 'טפטוף V60'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsPlaying((prev) => !prev)}
          className="text-stone-400 hover:text-amber-400 text-xs flex items-center gap-1"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isPlaying ? 'השהה גלים' : 'נגן גלים'}</span>
        </button>
      </div>
    </div>
  );
}
