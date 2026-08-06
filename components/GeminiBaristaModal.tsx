'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Mic, Camera, X, Check, Coffee, Loader2, Award, Droplets, Thermometer, Layers, Flame, Utensils } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

interface GeminiBaristaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiBaristaModal: React.FC<GeminiBaristaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'vision' | 'latteArt'>('voice');
  const [voiceText, setVoiceText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { addItem } = useCartStore();

  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setVoiceText('');
      setSelectedImage(null);
      setIsListening(false);
    }
  }, [isOpen]);

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
    if (!selectedImage) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/barista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'latteArt', imageBase64: selectedImage }),
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

    const baseDrinkName = result.drinkName || (
      result.baseDrink === 'CORTADO'
        ? 'Honey Oak Cortado'
        : result.baseDrink === 'LATTE'
        ? 'Lavender Fields Latte'
        : result.baseDrink === 'V60'
        ? 'V60 Single Origin Pour-over'
        : 'Midnight Espresso Blend'
    );

    const price = result.estimatedPriceILS || 26;

    addItem({
      coffeeItemId: 'gemini-voice-' + Date.now(),
      name: baseDrinkName,
      hebrewName: `${baseDrinkName} ${result.isIced ? '(קר על קרח)' : ''}`,
      price,
      shots: result.shots || 2,
      milkType: result.milkType === 'OATLY_OAT' ? 'חלב שיבולת שועל' : result.milkType === 'ALMOND_UNSWEETENED' ? 'חלב שקדים' : 'חלב רגיל',
      imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl liquid-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Decorative background orb */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                ברמאי AI Multimodal
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  Gemini 3.5
                </span>
              </h3>
              <p className="text-xs text-stone-400">חילוץ ישויות הזמנה בעברית, ניתוח פולים ולאטה ארט</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900/60 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Tab Selection */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-stone-900/80 border border-stone-800 mb-6 text-xs">
          <button
            onClick={() => { setActiveTab('voice'); setResult(null); }}
            className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'voice'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>הזמנה קולית</span>
          </button>

          <button
            onClick={() => { setActiveTab('vision'); setResult(null); }}
            className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'vision'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>זיהוי פולים</span>
          </button>

          <button
            onClick={() => { setActiveTab('latteArt'); setResult(null); }}
            className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'latteArt'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>לאטה ארט AI</span>
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
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-stone-950/80 border border-amber-500/30 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400"
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
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

        {/* Tab 3: Latte Art Evaluator */}
        {activeTab === 'latteArt' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-300 leading-relaxed">
              העלה תמונה של הקצפת הלאטה ארט שקיבלת! מנוע הבינה המלאכותית יזהה דוגמה (Rosetta, Tulip, Heart, Swan) וידרג סימטריה וברק קצף.
            </p>

            <div className="border-2 border-dashed border-stone-800 hover:border-amber-500/40 rounded-2xl p-6 text-center transition-all bg-stone-950/40">
              {selectedImage ? (
                <div className="space-y-3">
                  <img
                    src={selectedImage}
                    alt="Uploaded latte art"
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
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-stone-300">לחץ להעלאת תמונת לאטה ארט</span>
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
              onClick={handleLatteArtAnalyze}
              disabled={loading || !selectedImage}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini מנתח סימטריה וברק קצף...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ניתוח דירוג לאטה ארט SCA</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="mt-6 p-4 rounded-2xl bg-stone-900/90 border border-amber-500/40 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                תוצאת הניתוח - Gemini 3.5 AI
              </span>
              {result.cuppingScore && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                  <Award className="w-3.5 h-3.5" />
                  SCA {result.cuppingScore} / 100
                </span>
              )}
              {result.overallScore && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                  <Award className="w-3.5 h-3.5" />
                  Latte Score {result.overallScore} / 100
                </span>
              )}
            </div>

            {/* Voice Entities Render */}
            {result.baseDrink ? (
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
                      ₪{result.estimatedPriceILS || 26} | ~{result.estimatedCalories || 150} kcal
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
                  הוסף לעגלת הקניות כעת (₪{result.estimatedPriceILS || 26})
                </button>
              </>
            ) : result.pattern ? (
              /* Latte Art Render */
              <>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">דוגמה מזוהה:</span>
                    <span className="text-amber-400 font-bold">{result.pattern}</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">סימטריה דו-צדדית:</span>
                    <span className="text-emerald-400 font-mono font-bold">{result.bilateralSymmetryPercent}%</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">ברק קצף (Microfoam Gloss):</span>
                    <span className="text-cyan-400 font-mono font-bold">{result.microFoamGlossPercent}%</span>
                  </div>
                  <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-[10px] block">עובי שכבת הקצף:</span>
                    <span className="text-amber-300 font-mono font-bold">{result.foamThicknessMm} mm</span>
                  </div>
                </div>

                <p className="text-xs text-stone-300 bg-stone-950/40 p-2.5 rounded-xl border border-stone-800/60">
                  💬 {result.critique}
                </p>
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
