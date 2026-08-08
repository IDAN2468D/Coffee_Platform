'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  WifiOff,
  Bluetooth,
  Gauge,
  Activity,
  Sliders,
  Sparkles,
  CheckCircle2,
  Play,
  RotateCcw,
  Clock,
  Zap,
  Info,
  Layers,
  Thermometer,
  Droplets,
  Cpu,
  Send,
  Radio,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export interface SmartMachine {
  id: string;
  name: string;
  brand: string;
  hebrewBrand: string;
  connectionType: 'BLUETOOTH' | 'WIFI_REST_API';
  boilerType: 'DUAL_BOILER_PID' | 'THERMOCOIL_INDUCTION';
  maxPressureBar: number;
  flowProfilingSupport: boolean;
  status: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING';
  ipAddress: string;
}

export interface BrewProfileSyncPayload {
  id: string;
  profileName: string;
  hebrewName: string;
  targetTempCelsius: number; // e.g. 93.5°C
  preInfusionPressureBar: number; // e.g. 2.5 Bar
  preInfusionTimeSeconds: number; // e.g. 8s
  mainPressureBar: number; // e.g. 9.0 Bar
  targetFlowRateMls: number; // e.g. 2.0 ml/s
  shotTimerSeconds: number; // e.g. 28s
  targetYieldGrams: number; // e.g. 36g
  description: string;
}

const SUPPORTED_MACHINES: SmartMachine[] = [
  {
    id: 'decent-de1xl',
    name: 'Decent Espresso DE1XL Pro',
    brand: 'Decent Espresso',
    hebrewBrand: 'דיסנט אספרסו DE1XL (פרופיל לחץ וזרימה מלא)',
    connectionType: 'BLUETOOTH',
    boilerType: 'THERMOCOIL_INDUCTION',
    maxPressureBar: 12,
    flowProfilingSupport: true,
    status: 'CONNECTED',
    ipAddress: 'BLE: 00:1A:7D:DA:71:13',
  },
  {
    id: 'lamarzocco-micra',
    name: 'La Marzocco Linea Micra IoT',
    brand: 'La Marzocco',
    hebrewBrand: 'לה מרזוקו לינאה מיקרה IoT (Dual Boiler PID)',
    connectionType: 'WIFI_REST_API',
    boilerType: 'DUAL_BOILER_PID',
    maxPressureBar: 10,
    flowProfilingSupport: false,
    status: 'CONNECTED',
    ipAddress: '192.168.1.142:8080',
  },
  {
    id: 'sanremo-you',
    name: 'Sanremo YOU Multi-Boiler',
    brand: 'Sanremo Coffee',
    hebrewBrand: 'סנרמו YOU מולטי-בוילר עם מנוף דיגיטלי',
    connectionType: 'WIFI_REST_API',
    boilerType: 'DUAL_BOILER_PID',
    maxPressureBar: 12,
    flowProfilingSupport: true,
    status: 'CONNECTED',
    ipAddress: '192.168.1.189:8080',
  },
  {
    id: 'fellow-stagg-ekg',
    name: 'Fellow Stagg EKG+ Smart Kettle',
    brand: 'Fellow Products',
    hebrewBrand: 'קומקום חכם Fellow Stagg EKG+ Bluetooth',
    connectionType: 'BLUETOOTH',
    boilerType: 'THERMOCOIL_INDUCTION',
    maxPressureBar: 1,
    flowProfilingSupport: false,
    status: 'CONNECTED',
    ipAddress: 'BLE: FE:LL:OW:93:41:00',
  },
];

const PRESET_PROFILES: BrewProfileSyncPayload[] = [
  {
    id: 'blooming-espresso',
    profileName: 'Blooming Espresso 6Bar',
    hebrewName: 'בלומינג אספרסו 6Bar (חליטה רכה ומתוקה)',
    targetTempCelsius: 92.8,
    preInfusionPressureBar: 2.5,
    preInfusionTimeSeconds: 10,
    mainPressureBar: 6.0,
    targetFlowRateMls: 1.8,
    shotTimerSeconds: 32,
    targetYieldGrams: 38,
    description: 'השריית בלום של 10 שניות בלחץ עדין לשחרור CO2, ואחריה מיצוי רך ב-6Bar המדגיש מתיקות עילאית וחומציות נקייה.',
  },
  {
    id: 'classic-9bar',
    profileName: 'Classic 9Bar Italian Profile',
    hebrewName: 'פרופיל 9Bar איטלקי קלאסי',
    targetTempCelsius: 93.5,
    preInfusionPressureBar: 3.0,
    preInfusionTimeSeconds: 4,
    mainPressureBar: 9.0,
    targetFlowRateMls: 2.2,
    shotTimerSeconds: 27,
    targetYieldGrams: 36,
    description: 'עלייה מהירה ללחץ תקני של 9Bar עם טמפרטורה יציבה של 93.5°C לקבלת קרמה עשירה וגוף כבד ומאוזן.',
  },
  {
    id: 'slayer-slow-flow',
    profileName: 'Slayer Style Slow Infusion',
    hebrewName: 'סלייר סטייל - השרייה איטית בשסתום מחט',
    targetTempCelsius: 94.0,
    preInfusionPressureBar: 1.8,
    preInfusionTimeSeconds: 14,
    mainPressureBar: 9.0,
    targetFlowRateMls: 1.2,
    shotTimerSeconds: 40,
    targetYieldGrams: 42,
    description: 'טכניקת שסתום מחט עם זרימה איטית במיוחד (1.2 מ"ל/שנייה) המאפשרת טחינה דקה מאוד ומיצוי של 24% EY.',
  },
  {
    id: 'turbo-shot',
    profileName: 'Low Temp Turbo Shot 6Bar',
    hebrewName: 'טורבו שוט 6Bar מהיר (High Yield)',
    targetTempCelsius: 88.5,
    preInfusionPressureBar: 2.0,
    preInfusionTimeSeconds: 2,
    mainPressureBar: 6.0,
    targetFlowRateMls: 3.2,
    shotTimerSeconds: 15,
    targetYieldGrams: 40,
    description: 'חליטה מהירה של 15 שניות בטמפרטורה מתונה המנטרלת לחלוטין מרירות וממקסמת בהירות וטעמי פרי.',
  },
];

export const SmartIoTSync: React.FC = () => {
  const [selectedMachine, setSelectedMachine] = useState<SmartMachine>(SUPPORTED_MACHINES[0]);
  const [selectedProfile, setSelectedProfile] = useState<BrewProfileSyncPayload>(PRESET_PROFILES[0]);
  
  // Custom Live Sliders
  const [customTemp, setCustomTemp] = useState<number>(selectedProfile.targetTempCelsius);
  const [customPressure, setCustomPressure] = useState<number>(selectedProfile.mainPressureBar);
  const [customShotTime, setCustomShotTime] = useState<number>(selectedProfile.shotTimerSeconds);
  const [customYield, setCustomYield] = useState<number>(selectedProfile.targetYieldGrams);

  // Connection & Push states
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [isBrewingLive, setIsBrewingLive] = useState<boolean>(false);
  
  // Live Telemetry Stream
  const [liveTemp, setLiveTemp] = useState<number>(customTemp);
  const [livePressure, setLivePressure] = useState<number>(0);
  const [liveFlowRate, setLiveFlowRate] = useState<number>(0);
  const [liveWeightGrams, setLiveWeightGrams] = useState<number>(0);
  const [liveSeconds, setLiveSeconds] = useState<number>(0);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    'System ready. Bluetooth BLE handshake active with Decent Espresso DE1XL.',
    'PID Water Boiler steady at 93.2°C (Deviation: ±0.1°C).',
  ]);

  const telemetryIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync profile selection with custom values
  const handleSelectProfile = (p: BrewProfileSyncPayload) => {
    coffeeSound.playBaristaClick();
    setSelectedProfile(p);
    setCustomTemp(p.targetTempCelsius);
    setCustomPressure(p.mainPressureBar);
    setCustomShotTime(p.shotTimerSeconds);
    setCustomYield(p.targetYieldGrams);
    setSyncSuccess(false);
  };

  // Push Profile to Machine via IoT Handshake
  const handlePushProfileToMachine = async () => {
    coffeeSound.playBaristaClick();
    coffeeSound.playCoffeeSteam();
    setIsSyncing(true);
    setSyncSuccess(false);

    const logEntry = `[${new Date().toLocaleTimeString()}] Pushing profile "${selectedProfile.profileName}" to ${selectedMachine.name} via ${selectedMachine.connectionType}...`;
    setTelemetryLogs((prev) => [logEntry, ...prev.slice(0, 8)]);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      coffeeSound.playSuccessChime();

      const successLog = `[${new Date().toLocaleTimeString()}] SYNC CONFIRMED: Target Temp=${customTemp}°C, Main Pressure=${customPressure}Bar, Shot Timer=${customShotTime}s, Yield=${customYield}g.`;
      setTelemetryLogs((prev) => [successLog, ...prev.slice(0, 8)]);
    }, 1200);
  };

  // Start Live Brewing IoT Telemetry Stream
  const handleToggleLiveBrew = () => {
    coffeeSound.playBaristaClick();

    if (isBrewingLive) {
      // Stop
      if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
      setIsBrewingLive(false);
      setLivePressure(0);
      setLiveFlowRate(0);
      coffeeSound.playSuccessChime();
      return;
    }

    // Start Live Shot
    setIsBrewingLive(true);
    setLiveSeconds(0);
    setLiveWeightGrams(0);
    setLivePressure(selectedProfile.preInfusionPressureBar);
    setLiveFlowRate(1.0);
    coffeeSound.playPourSound();

    let sec = 0;
    telemetryIntervalRef.current = setInterval(() => {
      sec += 0.5;
      setLiveSeconds(Number(sec.toFixed(1)));

      if (sec <= selectedProfile.preInfusionTimeSeconds) {
        // Pre-infusion stage
        setLivePressure(selectedProfile.preInfusionPressureBar);
        setLiveFlowRate(Number((selectedProfile.targetFlowRateMls * 0.5).toFixed(1)));
        setLiveWeightGrams(Number((sec * 0.4).toFixed(1)));
      } else if (sec <= customShotTime) {
        // Main extraction stage
        setLivePressure(Number((customPressure + (Math.random() * 0.2 - 0.1)).toFixed(1)));
        setLiveFlowRate(Number((selectedProfile.targetFlowRateMls + (Math.random() * 0.2 - 0.1)).toFixed(1)));
        const weight = (sec - selectedProfile.preInfusionTimeSeconds) * 1.5 + 4;
        setLiveWeightGrams(Number(Math.min(customYield, weight).toFixed(1)));
      } else {
        // Shot completed auto stop
        if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
        setIsBrewingLive(false);
        setLivePressure(0);
        setLiveFlowRate(0);
        coffeeSound.playSuccessChime();
        const finishLog = `[${new Date().toLocaleTimeString()}] SHOT COMPLETED: ${customYield}g extracted in ${customShotTime}s. Flow profiling perfect.`;
        setTelemetryLogs((prev) => [finishLog, ...prev.slice(0, 8)]);
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
    };
  }, []);

  return (
    <section id="smart-iot-sync" className="w-full space-y-10 dir-rtl">
      {/* 1. Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>One-Touch Smart Home IoT Coffee Machine Sync & Live Telemetry</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-100 tracking-tight">
          סנכרון מכונת קפה חכמה <span className="text-gold-gradient">& פרופיל לחץ IoT</span>
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          דחיפת פרמטרי חליטה בנגיעה אחת (טמפרטורת PID, גרף לחץ 1-9Bar, זרימת מים וטיימר) ישירות
          למכונות אספרסו חכמות (Decent DE1, La Marzocco Linea Micra IoT, Sanremo YOU, Fellow Stagg).
        </p>
      </div>

      {/* 2. Connected Machines Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUPPORTED_MACHINES.map((machine) => {
          const isSelected = selectedMachine.id === machine.id;
          return (
            <button
              key={machine.id}
              onClick={() => {
                coffeeSound.playBaristaClick();
                setSelectedMachine(machine);
                setSyncSuccess(false);
              }}
              className={`p-4 rounded-2xl border text-right transition-all group ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                  : 'bg-[#141010] border-stone-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {machine.connectionType === 'BLUETOOTH' ? (
                    <Bluetooth className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Wifi className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="text-[10px] font-mono text-stone-300">
                    {machine.connectionType === 'BLUETOOTH' ? 'Bluetooth BLE' : 'WiFi REST API'}
                  </span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-xs font-black text-stone-100 group-hover:text-cyan-300">
                {machine.hebrewBrand}
              </div>
              <div className="text-[10px] text-stone-400 mt-1 font-mono">
                {machine.ipAddress} • {machine.maxPressureBar}Bar Max
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Main Dashboard Grid: Profile Presets (Left) + Live Telemetry & Push (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Preset Brew Profiles (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl liquid-glass border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-black text-stone-100">פרופילי חליטה מוכנים (Presets)</h3>
                  <p className="text-[10px] text-stone-400">בחר פרופיל ולחץ לדחיפה מיידית למכונה</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {PRESET_PROFILES.map((p) => {
                const isSelected = selectedProfile.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProfile(p)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-md'
                        : 'bg-stone-950/80 border-stone-800 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-stone-100">{p.hebrewName}</span>
                      <span className="text-[11px] font-mono font-bold text-amber-400 bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800">
                        {p.targetTempCelsius}°C • {p.mainPressureBar}Bar
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed">{p.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-cyan-300 font-mono pt-2">
                      <span>השרייה: {p.preInfusionTimeSeconds}s @ {p.preInfusionPressureBar}Bar</span>
                      <span>•</span>
                      <span>זמן: {p.shotTimerSeconds}s</span>
                      <span>•</span>
                      <span>משקל יעד: {p.targetYieldGrams}g</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Slider Overrides */}
          <div className="p-6 rounded-3xl liquid-glass border border-cyan-500/30 space-y-4">
            <h3 className="text-sm font-black text-stone-100 border-b border-stone-800 pb-2">
              התאמה אישית של פרמטרים (Manual Calibration)
            </h3>

            {/* Target Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>טמפרטורת מים PID Boiler</span>
                </span>
                <span className="text-amber-400 font-mono">{customTemp}°C</span>
              </div>
              <input
                type="range"
                min="85.0"
                max="96.5"
                step="0.1"
                value={customTemp}
                onChange={(e) => {
                  coffeeSound.playSliderTick();
                  setCustomTemp(Number(e.target.value));
                  setSyncSuccess(false);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Main Pressure Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span>לחץ משאבה ראשי (Main Pressure)</span>
                </span>
                <span className="text-cyan-400 font-mono">{customPressure} Bar</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="11.0"
                step="0.5"
                value={customPressure}
                onChange={(e) => {
                  coffeeSound.playSliderTick();
                  setCustomPressure(Number(e.target.value));
                  setSyncSuccess(false);
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Shot Timer Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-stone-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>טיימר חליטה ועצירה אוטומטית</span>
                </span>
                <span className="text-emerald-400 font-mono">{customShotTime} שניות</span>
              </div>
              <input
                type="range"
                min="12"
                max="45"
                value={customShotTime}
                onChange={(e) => {
                  coffeeSound.playSliderTick();
                  setCustomShotTime(Number(e.target.value));
                  setSyncSuccess(false);
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* One-Touch Push Button */}
            <button
              onClick={handlePushProfileToMachine}
              disabled={isSyncing}
              className={`w-full py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xl ${
                syncSuccess
                  ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-stone-950 hover:brightness-110 shadow-cyan-500/25'
              }`}
            >
              {isSyncing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-black" />
                  <span>דוחף פרופיל למכונה ב-IoT Handshake...</span>
                </>
              ) : syncSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>פרופיל נשלח וסונכרן בהצלחה למכונה!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-black" />
                  <span>סנכרן ודחף פרופיל ל-{selectedMachine.brand}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live IoT Telemetry Dashboard & Shot Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Telemetry Gauges Card */}
          <div className="p-6 rounded-3xl liquid-glass border border-cyan-500/30 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-black text-stone-100">טלמטריה חיה בזמן אמת (Live Stream)</h3>
                  <p className="text-[10px] text-stone-400">חיישני טמפרטורה, מד לחץ דיגיטלי ומשקל משולב Bluetooth</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  LIVE TELEMETRY
                </span>
              </div>
            </div>

            {/* 4 Main Gauges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Gauge 1: Group Head Pressure */}
              <div className="p-4 rounded-2xl bg-stone-950/90 border border-stone-800 text-center space-y-1">
                <span className="text-[10px] text-stone-400 block font-semibold">לחץ ראש חליטה</span>
                <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono block">
                  {livePressure.toFixed(1)} <span className="text-xs text-stone-400">Bar</span>
                </span>
                <span className="text-[9px] text-stone-500 font-mono">Target: {customPressure}Bar</span>
              </div>

              {/* Gauge 2: PID Boiler Temp */}
              <div className="p-4 rounded-2xl bg-stone-950/90 border border-stone-800 text-center space-y-1">
                <span className="text-[10px] text-stone-400 block font-semibold">טמפ' דוד PID</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono block">
                  {customTemp.toFixed(1)} <span className="text-xs text-stone-400">°C</span>
                </span>
                <span className="text-[9px] text-emerald-400 font-mono">Stable ±0.05°C</span>
              </div>

              {/* Gauge 3: Flow Rate */}
              <div className="p-4 rounded-2xl bg-stone-950/90 border border-stone-800 text-center space-y-1">
                <span className="text-[10px] text-stone-400 block font-semibold">קצב זרימה (Flow)</span>
                <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono block">
                  {liveFlowRate.toFixed(1)} <span className="text-xs text-stone-400">ml/s</span>
                </span>
                <span className="text-[9px] text-stone-500 font-mono">Laminar Stream</span>
              </div>

              {/* Gauge 4: Live Shot Weight */}
              <div className="p-4 rounded-2xl bg-stone-950/90 border border-stone-800 text-center space-y-1">
                <span className="text-[10px] text-stone-400 block font-semibold">משקל חליטה (Scale)</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block">
                  {liveWeightGrams.toFixed(1)} <span className="text-xs text-stone-400">g</span>
                </span>
                <span className="text-[9px] text-stone-500 font-mono">Timer: {liveSeconds}s</span>
              </div>
            </div>

            {/* Live Shot Trigger Action */}
            <div className="p-4 rounded-2xl bg-[#0e0a0a] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-right">
                <div className="text-xs font-black text-stone-100">
                  {isBrewingLive ? 'חליטה פעילה ברגע זה במכונה...' : 'מכונה מוכנה לחליטה (Ready to Brew)'}
                </div>
                <p className="text-[10px] text-stone-400">
                  הפעלת זרימה אוטומטית עם עצירה מבוססת משקל יעד ({customYield}g)
                </p>
              </div>

              <button
                onClick={handleToggleLiveBrew}
                className={`px-6 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-lg ${
                  isBrewingLive
                    ? 'bg-rose-500 text-white shadow-rose-500/30 animate-pulse'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-stone-950 hover:brightness-110 shadow-emerald-500/20'
                }`}
              >
                {isBrewingLive ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>עצור חליטה ידנית</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>התחל חליטת אספרסו חיה ב-IoT</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* IoT Telemetry System Logs Console */}
          <div className="p-6 rounded-3xl liquid-glass border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-stone-400 border-b border-stone-800 pb-2">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>יומן פקודות IoT & Handshake Console</span>
              </span>
              <span>BUFFER: 8/8</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/90 border border-stone-900 font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto">
              {telemetryLogs.map((log, i) => (
                <div key={i} className="text-stone-300 flex items-start gap-2">
                  <span className="text-cyan-400 select-none">❯</span>
                  <span className="leading-tight">{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
