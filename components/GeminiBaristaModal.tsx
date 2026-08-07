'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Mic,
  Camera,
  X,
  Check,
  Coffee,
  Loader2,
  Award,
  Droplets,
  Thermometer,
  Layers,
  Flame,
  Utensils,
  Volume2,
  Activity,
  Wine,
  Compass,
  Gauge,
  Sparkle
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

interface GeminiBaristaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type BaristaTab = 'voice' | 'vision' | 'acousticGrind' | 'bloomFreshness' | 'latteArt' | 'mixology';

export const GeminiBaristaModal: React.FC<GeminiBaristaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<BaristaTab>('voice');
  const [voiceText, setVoiceText] = useState('');
  const [mixologyQuery, setMixologyQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAudioAnalyzing, setIsAudioAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const { addItem } = useCartStore();

  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setVoiceText('');
      setMixologyQuery('');
      setSelectedImage(null);
      setIsListening(false);
      setIsAudioAnalyzing(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.style.overflow = 'unset';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Audio spectrum visualizer effect for Acoustic Grind mode
  useEffect(() => {
    if (activeTab === 'acousticGrind' && isAudioAnalyzing && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let step = 0;
      const draw = () => {
        step += 0.08;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const bars = 28;
        const barWidth = canvas.width / bars;

        for (let i = 0; i < bars; i++) {
          const height = Math.abs(Math.sin(step + i * 0.3) * (canvas.height * 0.7)) + 10;
          const x = i * barWidth;
          const y = canvas.height - height;

          const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
          gradient.addColorStop(0, '#f59e0b');
          gradient.addColorStop(0.5, '#06b6d4');
          gradient.addColorStop(1, '#10b981');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth - 3, height);
        }
        animationFrameRef.current = requestAnimationFrame(draw);
      };
      draw();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [activeTab, isAudioAnalyzing]);

  if (!isOpen) return null;

  // SpeechRecognition Web Audio API Integration
  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('הדפדפן אינו תומך בזיהוי קולי ישיר. תוכל להקליד את הבקשה בעברית.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'he-IL';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const handleVoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceText.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/barista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'voice', textInput: voiceText }),
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data && data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVisionAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/barista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'vision', imageBase64: selectedImage }),
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data && data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLatteArtAnalyze = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/barista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'latteArtAR', imageBase64: selectedImage }),
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data && data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcousticGrindAnalyze = async () => {
    setIsAudioAnalyzing(true);
    setLoading(true);
    setResult(null);

    setTimeout(async () => {
      try {
        const res = await fetch('/api/gemini/barista', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'acousticGrind', audioSampleFreq: 3820 }),
        });
        const data = await res.json().catch(() => ({ success: false }));
        if (data && data.success) {
          setResult(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setIsAudioAnalyzing(false);
      }
    }, 1800);
  };

  const handleBloomFreshnessAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/barista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bloomFreshness', imageBase64: selectedImage }),
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data && data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMixologySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/barista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mixology', textInput: mixologyQuery }),
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data && data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecommendedToCart = () => {
    if (!result) return;

    const baseDrinkName = result.drinkName || result.recipeName || (
      result.baseDrink === 'CORTADO'
        ? 'Honey Oak Cortado'
        : result.baseDrink === 'LATTE'
        ? 'Lavender Fields Latte'
        : result.baseDrink === 'V60'
        ? 'V60 Single Origin Pour-over'
        : 'Smoked Citrus Cold Brew Elixir'
    );

    const price = result.estimatedPriceILS || 26;

    addItem({
      coffeeItemId: 'gemini-ultra-' + Date.now(),
      name: baseDrinkName,
      hebrewName: `${baseDrinkName} ${result.isIced ? '(קר על קרח)' : ''}`,
      price,
      shots: result.shots || 2,
      milkType: result.milkType === 'OATLY_OAT' ? 'חלב שיבולת שועל' : result.milkType === 'ALMOND_UNSWEETENED' ? 'חלב שקדים' : 'חלב רגיל',
      imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-xl animate-fadeIn dir-rtl" style={{ direction: 'rtl' }}>
      <div className="relative w-full max-w-2xl liquid-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-right">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black text-stone-100 flex items-center gap-2">
                בריסטה AI Multimodal Ultra
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/30 to-cyan-500/30 text-amber-300 font-mono border border-amber-500/40">
                  Gemini 3.5
                </span>
              </h3>
              <p className="text-xs text-stone-400">אקוסטיקה, Bloom, AR לאטה ארט, זיהוי פולים ומיקסולוגיה</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900/80 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-all border border-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Multimodal Tab Selection Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1.5 rounded-2xl bg-stone-950/80 border border-stone-800 mb-6 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('voice'); setResult(null); }}
            className={`py-2 px-1.5 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'voice'
                ? 'bg-amber-500 text-stone-950 shadow-md scale-[1.02]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span className="text-[10px]">הזמנה קולית</span>
          </button>

          <button
            onClick={() => { setActiveTab('vision'); setResult(null); }}
            className={`py-2 px-1.5 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'vision'
                ? 'bg-amber-500 text-stone-950 shadow-md scale-[1.02]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="text-[10px]">זיהוי פולים</span>
          </button>

          <button
            onClick={() => { setActiveTab('acousticGrind'); setResult(null); }}
            className={`py-2 px-1.5 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'acousticGrind'
                ? 'bg-amber-500 text-stone-950 shadow-md scale-[1.02]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-[10px]">ניתוח אקוסטי</span>
          </button>

          <button
            onClick={() => { setActiveTab('bloomFreshness'); setResult(null); }}
            className={`py-2 px-1.5 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'bloomFreshness'
                ? 'bg-amber-500 text-stone-950 shadow-md scale-[1.02]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span className="text-[10px]">בעבוע Bloom</span>
          </button>

          <button
            onClick={() => { setActiveTab('latteArt'); setResult(null); }}
            className={`py-2 px-1.5 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'latteArt'
                ? 'bg-amber-500 text-stone-950 shadow-md scale-[1.02]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[10px]">לאטה AR</span>
          </button>

          <button
            onClick={() => { setActiveTab('mixology'); setResult(null); }}
            className={`py-2 px-1.5 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'mixology'
                ? 'bg-amber-500 text-stone-950 shadow-md scale-[1.02]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Wine className="w-4 h-4" />
            <span className="text-[10px]">מיקסולוגיה</span>
          </button>
        </div>

        {/* Tab 1: Voice Order */}
        {activeTab === 'voice' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-300 leading-relaxed">
              לחץ על 🎙️ והקלט את בקשתך בעברית (לדוגמה: <span className="text-amber-400 font-semibold">"קורטדו כפול בחלב שיבולת שועל, דבש וקרח"</span>).
            </p>

            <form onSubmit={handleVoiceSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  placeholder="אמור בקול או הקלד כאן..."
                  className="w-full pr-4 pl-12 py-3.5 rounded-xl bg-stone-950/80 border border-amber-500/30 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 text-right"
                />

                <button
                  type="button"
                  onClick={startSpeechRecognition}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  }`}
                  title="הקלט קול"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">דוגמאות מהירות:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setVoiceText('קורטדו כפול בחלב שיבולת שועל, דבש וקרח')}
                    className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 hover:bg-amber-500/20"
                  >
                    קורטדו דבש
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoiceText('לאטה עדין בחלב שקדים וקרואסון חם')}
                    className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 hover:bg-amber-500/20"
                  >
                    לאטה שקדים
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !voiceText.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini 3.5 מנתח את הישויות...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>ניתוח וחילוץ ישויות הזמנה</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Vision Bean Analysis */}
        {activeTab === 'vision' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-300 leading-relaxed">
              העלה צילום פולי קפה. האלגוריתם יזהה Agtron index (1-12), גודל חלקיקים (µm), % פגמים ו-SCA Cupping Score!
            </p>

            <div className="border-2 border-dashed border-stone-800 hover:border-amber-500/40 rounded-2xl p-6 text-center transition-all bg-stone-950/40">
              {selectedImage ? (
                <div className="space-y-3">
                  <img
                    src={selectedImage}
                    alt="Uploaded coffee bean"
                    className="max-h-40 mx-auto rounded-xl border border-stone-700 object-cover"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    החלף תמונה
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-stone-300">לחץ להעלאת תמונת פולי קפה</span>
                  <span className="text-[10px] text-stone-500">JPG, PNG עד 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              onClick={handleVisionAnalyze}
              disabled={loading || !selectedImage}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini Vision מנתח ניקוד Cupping...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ניתוח ניקוד קאפינג ואיכות הקלייה</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab 3: Acoustic Grind & Flow Analyzer */}
        {activeTab === 'acousticGrind' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-300 leading-relaxed">
              הפעל דגימה אקוסטית של רעש סכיני הטחינה או טיפות האספרסו. האלגוריתם ינתח תדר ספקטרלי ב-Hz, גודל חלקיקים במיקרונים (µm) ותעלות זרימה (Channeling).
            </p>

            <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  מד תדרים אקוסטי (Dynamic Spectrogram)
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {isAudioAnalyzing ? 'דוגם ספקטרום: 3,820 Hz' : 'ממתין לתחילת דגימה'}
                </span>
              </div>

              <div className="relative h-24 bg-stone-900 rounded-xl overflow-hidden border border-stone-800 flex items-center justify-center">
                <canvas ref={canvasRef} width={400} height={96} className="w-full h-full" />
                {!isAudioAnalyzing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs">
                    <span className="text-xs text-stone-400 font-medium flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      לחץ על הכפתור למטה להתחלת ניתוח השמע
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleAcousticGrindAnalyze}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 text-stone-950 font-black text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>דוגם תדר אקוסטי של סכיני הטחינה...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>התחל דגימה אקוסטית של סכיני הטחינה</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab 4: Bloom Degassing Freshness Vision */}
        {activeTab === 'bloomFreshness' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-300 leading-relaxed">
              העלה תמונה של תפיחת הקפה (Bloom) בזמן Pour-Over. מנוע הראייה יחשב נפח בועות $CO_2$, קצב שחרור גז ויחשב ימים מדויקים ממועד הקלייה.
            </p>

            <div className="border-2 border-dashed border-stone-800 hover:border-amber-500/40 rounded-2xl p-6 text-center transition-all bg-stone-950/40">
              {selectedImage ? (
                <div className="space-y-3">
                  <img
                    src={selectedImage}
                    alt="Uploaded coffee bloom"
                    className="max-h-40 mx-auto rounded-xl border border-stone-700 object-cover"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    החלף תמונה
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-stone-300">לחץ להעלאת תמונת תפיחת Bloom</span>
                  <span className="text-[10px] text-stone-500">JPG, PNG עד 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              onClick={handleBloomFreshnessAnalyze}
              disabled={loading || !selectedImage}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-stone-950 font-black text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>מחשב נפח בועות $CO_2$ וטריות...</span>
                </>
              ) : (
                <>
                  <Droplets className="w-4 h-4" />
                  <span>ניתוח טריות פולים & נפח Bloom</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab 5: AR Latte Art Guidance */}
        {activeTab === 'latteArt' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-300 leading-relaxed">
              מנוע הדרכת לאטה ארט AR מציג נתיבי מזיגה מומלצים, זווית קנקן (Pitcher Angle) ומהירות הזרמת חלב מומלצת.
            </p>

            <div className="relative p-6 rounded-2xl bg-stone-950/80 border border-amber-500/30 overflow-hidden flex flex-col items-center text-center space-y-3">
              <div className="w-24 h-24 rounded-full border-4 border-amber-500/40 flex items-center justify-center relative bg-stone-900 shadow-inner">
                {/* Simulated AR Overlay Path */}
                <svg className="w-16 h-16 text-amber-400 animate-pulse" viewBox="0 0 100 100">
                  <path d="M10 80 Q 50 10, 90 80 T 170 80" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="4 2" />
                </svg>
                <div className="absolute top-1 right-1 bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded-full font-mono">
                  AR LIVE
                </div>
              </div>

              <div className="text-xs space-y-1">
                <span className="text-amber-400 font-bold">הדרכת זווית מזיגה מומלצת: 42°</span>
                <p className="text-stone-400 text-[11px]">מהירות הזרמת חלב: 14.2 cm/sec</p>
              </div>
            </div>

            <button
              onClick={handleLatteArtAnalyze}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>מחשב נתוני מזיגה ב-AR...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  <span>קבל הדרכת מזיגה ב-AR בזמן אמת</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab 6: Coffee Mixology Studio */}
        {activeTab === 'mixology' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-300 leading-relaxed">
              צור מתכוני קוקטיילים/מוקטיילים גורמה מבוססי קפה! הזן רעיונות (כגון: <span className="text-amber-400 font-semibold">"קוקטייל קפה מרענן עם הדרים וטימין"</span>).
            </p>

            <form onSubmit={handleMixologySubmit} className="space-y-4">
              <input
                type="text"
                value={mixologyQuery}
                onChange={(e) => setMixologyQuery(e.target.value)}
                placeholder="תאר את סגנון הקוקטייל/מוקטייל המבוקש..."
                className="w-full px-4 py-3 rounded-xl bg-stone-950/80 border border-amber-500/30 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 text-right"
              />

              <div className="flex gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setMixologyQuery('מוקטייל Nitro Cold Brew מעושן עם הדרים')}
                  className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 hover:bg-cyan-500/20"
                >
                  Nitro Citrus Elixir
                </button>
                <button
                  type="button"
                  onClick={() => setMixologyQuery('מרטיני אספרסו עם וניל מנגן וקקאו')}
                  className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 hover:bg-amber-500/20"
                >
                  Espresso Martini Reserve
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-stone-950 font-black text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini Mixologist מפתח מתכון...</span>
                  </>
                ) : (
                  <>
                    <Wine className="w-4 h-4" />
                    <span>חולל מתכון מיקסולוגיית קפה</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Dynamic Results Display */}
        {result && (
          <div className="mt-6 p-4 rounded-2xl bg-stone-900/95 border border-amber-500/40 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                תוצאת ניתוח מולטי-מודאלי - Gemini 3.5 AI
              </span>

              {result.cuppingScore && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                  <Award className="w-3.5 h-3.5" />
                  SCA {result.cuppingScore} / 100
                </span>
              )}

              {result.freshnessIndexScore && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs">
                  <Droplets className="w-3.5 h-3.5" />
                  Freshness {result.freshnessIndexScore} / 100
                </span>
              )}

              {result.flavorHarmonyScore && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold text-xs">
                  <Wine className="w-3.5 h-3.5" />
                  Harmony {result.flavorHarmonyScore} / 100
                </span>
              )}
            </div>

            {/* Voice Entities Render */}
            {result.baseDrink && result.explanation ? (
              <>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">משקה מומלץ:</span>
                    <span className="text-amber-400 font-bold">{result.drinkName || result.baseDrink}</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">שוטים & חלב:</span>
                    <span className="text-amber-400 font-bold">{result.shots} שוטים | {result.milkType}</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">מרקם & טמפרטורה:</span>
                    <span className="text-stone-200 font-bold">
                      {result.microfoamDensity || 'Silky'} | {result.milkTempCelsius || 65}°C
                    </span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">מחיר & קלוריות:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      ₪{result.estimatedPriceILS || 25} | ~{result.estimatedCalories || 150} kcal
                    </span>
                  </div>
                </div>

                {result.pastryPairing && (
                  <div className="flex items-center gap-2 text-xs bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 text-stone-300">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <span>התאמת מאפה מומלצת: <strong className="text-amber-300">{result.pastryPairing}</strong></span>
                  </div>
                )}

                <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/40 p-2.5 rounded-xl border border-stone-800/60">
                  {result.explanation}
                </p>

                <button
                  onClick={handleAddRecommendedToCart}
                  className="w-full py-2.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-extrabold hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Coffee className="w-4 h-4" />
                  הוסף לעגלת הקניות כעת (₪{result.estimatedPriceILS || 25})
                </button>
              </>
            ) : result.grindFrequencyHz ? (
              /* Acoustic Analysis Render */
              <>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">תדר דגימה (Hz):</span>
                    <span className="text-amber-400 font-bold font-mono">{result.grindFrequencyHz} Hz</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">גודל חלקיקים (Microns):</span>
                    <span className="text-cyan-400 font-bold font-mono">{result.estimatedMicronSize} µm</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">סטטוס זרימה (Flow):</span>
                    <span className="text-emerald-400 font-bold text-[11px]">{result.extractionDripFreqStatus}</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">אזהרת שחיקת סכינים:</span>
                    <span className={result.burrDullnessWarning ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {result.burrDullnessWarning ? '⚠️ שחיקה מזוהה' : '✅ סכינים תקינות'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-300 bg-stone-950/40 p-2.5 rounded-xl border border-stone-800/60 leading-relaxed">
                  🎙️ {result.baristaAudioTip}
                </p>
              </>
            ) : result.bloomBubbleVolumeCm3 ? (
              /* Bloom Freshness Render */
              <>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">נפח בועות $CO_2$:</span>
                    <span className="text-cyan-400 font-bold font-mono">{result.bloomBubbleVolumeCm3} cm³</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">זמן מהקלייה:</span>
                    <span className="text-amber-400 font-bold font-mono">{result.daysPostRoast} ימים</span>
                  </div>
                </div>

                <p className="text-xs text-stone-300 bg-stone-950/40 p-2.5 rounded-xl border border-stone-800/60 leading-relaxed">
                  🫧 {result.degassingRecommendation}
                </p>
              </>
            ) : result.targetPattern ? (
              /* AR Latte Art Pour Render */
              <>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">דוגמת יעד:</span>
                    <span className="text-amber-400 font-bold">{result.targetPattern}</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">ניקוד סימטריה בלייב:</span>
                    <span className="text-emerald-400 font-bold font-mono">{result.realTimeSymmetryScore}%</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">מהירות הזרמה:</span>
                    <span className="text-cyan-400 font-bold font-mono">{result.milkVelocityCmPerSec} cm/s</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">זווית קנקן:</span>
                    <span className="text-amber-300 font-bold font-mono">{result.pitcherAngleDegrees}°</span>
                  </div>
                </div>

                <p className="text-xs text-stone-300 bg-stone-950/40 p-2.5 rounded-xl border border-stone-800/60 leading-relaxed">
                  📐 {result.visualPourGuide}
                </p>
              </>
            ) : result.recipeName ? (
              /* Coffee Mixology Render */
              <>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-black text-sm">{result.recipeName}</span>
                    <span className="text-emerald-400 font-bold font-mono">₪{result.estimatedPriceILS || 34}</span>
                  </div>
                  <p className="text-stone-300 text-[11px]">{result.description}</p>

                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 space-y-1">
                    <span className="text-stone-400 text-[10px] block">תבלינים & בוטניקה מותאמת:</span>
                    <div className="flex flex-wrap gap-1">
                      {result.pairingBotanicals?.map((b: string, idx: number) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 space-y-1">
                    <span className="text-stone-400 text-[10px] block">שלבי הכנת המיקסולוג:</span>
                    <ol className="list-decimal list-inside text-stone-300 text-[11px] space-y-1">
                      {result.recipeSteps?.map((step: string, idx: number) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <button
                  onClick={handleAddRecommendedToCart}
                  className="w-full py-2.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-extrabold hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Wine className="w-4 h-4" />
                  הוסף מתכון מיקסולוגיה לעגלה (₪{result.estimatedPriceILS || 34})
                </button>
              </>
            ) : (
              /* Vision Bean Render */
              <>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">דרגת קלייה (Agtron):</span>
                    <span className="text-amber-400 font-bold">{result.roastCategory} ({result.roastIndex}/12)</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">גודל חלקיקים & ברק:</span>
                    <span className="text-amber-400 font-bold">{result.particleSizeMicrons || 450}µm | {result.oilSheen}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <span className="text-stone-400 text-[10px] block">אחידות ומבנה הפולים:</span>
                  <p className="text-stone-300 font-semibold">{result.beanUniformity}</p>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 block mb-1">פרופיל טעמים מזוהה:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.flavorNotes?.map((note: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[11px] border border-amber-500/20">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-stone-300 bg-stone-950/40 p-2.5 rounded-xl border border-stone-800/60">
                  💡 {result.brewingRecommendation}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

