'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Play, Square, RefreshCw, Activity, Sparkles, AlertTriangle } from 'lucide-react';

export default function RoasterRoRTelemetry() {
  const [isRoasting, setIsRoasting] = useState<boolean>(false);
  const [roastTime, setRoastTime] = useState<number>(0); // seconds
  const [beanTemp, setBeanTemp] = useState<number>(20); // °C
  const [exhaustTemp, setExhaustTemp] = useState<number>(180); // °C
  const [ror, setRor] = useState<number>(18); // °C/min
  const [phase, setPhase] = useState<string>('Drying Phase (ייבוש)');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRoasting) {
      interval = setInterval(() => {
        setRoastTime((prev) => {
          const nextTime = prev + 1;

          // Roasting temperature curve physics
          if (nextTime < 60) {
            // Turning Point
            setBeanTemp((t) => Math.min(95, t + 1.2));
            setRor(14);
            setPhase('Turning Point (נקודת מפנה)');
          } else if (nextTime < 240) {
            // Yellowing / Maillard Reaction
            setBeanTemp((t) => Math.min(160, t + 0.65));
            setRor(11);
            setPhase('Yellowing & Maillard (תגובת מייאר)');
          } else if (nextTime < 420) {
            // First Crack
            setBeanTemp((t) => Math.min(205, t + 0.35));
            setRor(7);
            setPhase('First Crack 💥 (פיצוץ ראשון)');
          } else {
            // Development
            setBeanTemp((t) => Math.min(225, t + 0.15));
            setRor(3);
            setPhase('Development Phase (פיתוח פרופיל)');
          }

          return nextTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRoasting]);

  const toggleRoasting = () => {
    if (isRoasting) {
      setIsRoasting(false);
    } else {
      setRoastTime(0);
      setBeanTemp(20);
      setRor(18);
      setIsRoasting(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div dir="rtl" className="w-full max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium">
          <Flame className="w-4 h-4" />
          <span>Professional Roaster Telemetry & Cropster Engine</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          סימולטור עקומת קלייה וקצב עליית טמפרטורה (RoR)
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          ניטור בזמן אמת של חום פולים (BT), חום אוויר (ET), וקצב עליית טמפרטורה (RoR ב-°C/min) לזיהוי פיצוץ ראשון.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Telemetry Dashboard */}
        <div className="lg:col-span-8 space-y-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider">שלב קלייה פעיל</span>
              <h3 className="text-xl font-bold text-white mt-0.5">{phase}</h3>
            </div>
            <button
              onClick={toggleRoasting}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isRoasting
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isRoasting ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRoasting ? 'עצור קלייה' : 'התחל קלייה'}
            </button>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-xs text-gray-400">חום פולים (BT)</span>
              <div className="text-2xl font-bold text-orange-400">{beanTemp.toFixed(1)}°C</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-xs text-gray-400">קצב עלייה (RoR)</span>
              <div className="text-2xl font-bold text-amber-400">{ror.toFixed(1)}°C/min</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-xs text-gray-400">זמן קלייה שעבר</span>
              <div className="text-2xl font-bold text-white">{formatTime(roastTime)}</div>
            </div>
          </div>

          {/* Visual RoR Curve Graph representation */}
          <div className="h-48 rounded-xl bg-stone-950/80 border border-white/10 p-4 relative flex items-end justify-between overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] text-gray-500 uppercase tracking-widest">
              Live Cropster RoR Curve
            </div>
            <div
              className="w-full bg-gradient-to-t from-orange-500/20 to-amber-500/40 border-t-2 border-orange-400 transition-all duration-500 rounded-t-lg"
              style={{ height: `${Math.min(100, (beanTemp / 230) * 100)}%` }}
            />
          </div>
        </div>

        {/* Info & Parameters */}
        <div className="lg:col-span-4 space-y-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-400" />
            מדדי בקרת קלייה
          </h3>
          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>טמפרטורת יעד פיצוץ 1:</span>
              <span className="font-bold text-orange-400">202°C</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>יחס פיתוח יעד (DTR):</span>
              <span className="font-bold text-amber-400">15.5%</span>
            </div>
            <div className="flex justify-between">
              <span>זרימת אוויר (Airflow):</span>
              <span className="font-bold text-cyan-400">75%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
