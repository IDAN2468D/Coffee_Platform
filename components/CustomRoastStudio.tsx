'use client';

import React, { useState } from 'react';
import { Flame, Sliders, Sparkles, ShoppingBag, Check, RefreshCw, Award, Volume2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface BeanOrigin {
  id: string;
  name: string;
  hebrewName: string;
  region: string;
  baseAcidity: number;
  baseBody: number;
  baseSweetness: number;
  baseAroma: number;
  baseFruitiness: number;
}

const BEAN_ORIGINS: BeanOrigin[] = [
  { id: 'ethiopia', name: 'Ethiopia Yirgacheffe', hebrewName: 'אתיופיה ירגשף', region: 'Yirgacheffe', baseAcidity: 92, baseBody: 65, baseSweetness: 85, baseAroma: 95, baseFruitiness: 90 },
  { id: 'colombia', name: 'Colombia Supremo', hebrewName: 'קולומביה סופרמו', region: 'Huila', baseAcidity: 75, baseBody: 80, baseSweetness: 88, baseAroma: 82, baseFruitiness: 70 },
  { id: 'brazil', name: 'Brazil Santos', hebrewName: 'ברזיל סנטוס', region: 'Cerrado', baseAcidity: 50, baseBody: 92, baseSweetness: 80, baseAroma: 75, baseFruitiness: 45 },
  { id: 'guatemala', name: 'Guatemala Huehuetenango', hebrewName: 'גואטמלה הואהואטננגו', region: 'Highlands', baseAcidity: 82, baseBody: 85, baseSweetness: 90, baseAroma: 88, baseFruitiness: 78 },
];

const ROAST_LEVELS = [
  { id: 'light', name: 'Light Roast (Cinnamon)', hebrewName: 'קלייה בהירה (Cinnamon)', acidityMod: 1.15, bodyMod: 0.85, bitternessMod: 0.7 },
  { id: 'medium', name: 'Medium Roast (City+)', hebrewName: 'קלייה בינונית (City+)', acidityMod: 1.0, bodyMod: 1.0, bitternessMod: 0.9 },
  { id: 'dark', name: 'Dark Roast (Full City)', hebrewName: 'קלייה כהה (Full City)', acidityMod: 0.75, bodyMod: 1.15, bitternessMod: 1.2 },
  { id: 'italian', name: 'Italian Roast (Dark Espresso)', hebrewName: 'קלייה איטלקית עמוקה', acidityMod: 0.5, bodyMod: 1.3, bitternessMod: 1.4 },
];

export function CustomRoastStudio() {
  const { addItem } = useCartStore();

  const [ratios, setRatios] = useState<{ [key: string]: number }>({
    ethiopia: 40,
    colombia: 30,
    brazil: 30,
    guatemala: 0,
  });

  const [roastLevel, setRoastLevel] = useState<string>('medium');
  const [blendName, setBlendName] = useState<string>('התערובת האישית שלי');
  const [added, setAdded] = useState(false);

  const totalPercent = Object.values(ratios).reduce((acc, curr) => acc + curr, 0);

  const handleRatioChange = (id: string, val: number) => {
    coffeeSound.playSliderTick();
    setRatios((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const resetRatios = () => {
    coffeeSound.playBaristaClick();
    coffeeSound.speakHebrew('איפוס אחוזי הפולים בתערובת');
    setRatios({
      ethiopia: 40,
      colombia: 30,
      brazil: 30,
      guatemala: 0,
    });
  };

  const selectedRoast = ROAST_LEVELS.find((r) => r.id === roastLevel) || ROAST_LEVELS[1];

  const calculateFlavorProfile = () => {
    let totalAcidity = 0;
    let totalBody = 0;
    let totalSweetness = 0;
    let totalAroma = 0;
    let totalFruitiness = 0;

    const divisor = totalPercent > 0 ? totalPercent : 100;

    BEAN_ORIGINS.forEach((b) => {
      const pct = (ratios[b.id] || 0) / divisor;
      totalAcidity += b.baseAcidity * pct;
      totalBody += b.baseBody * pct;
      totalSweetness += b.baseSweetness * pct;
      totalAroma += b.baseAroma * pct;
      totalFruitiness += b.baseFruitiness * pct;
    });

    return {
      acidity: Math.min(100, Math.round(totalAcidity * selectedRoast.acidityMod)),
      body: Math.min(100, Math.round(totalBody * selectedRoast.bodyMod)),
      sweetness: Math.min(100, Math.round(totalSweetness)),
      aroma: Math.min(100, Math.round(totalAroma)),
      fruitiness: Math.min(100, Math.round(totalFruitiness * selectedRoast.acidityMod)),
    };
  };

  const flavors = calculateFlavorProfile();

  const handleAddToCart = () => {
    coffeeSound.playCoffeeSteam();
    coffeeSound.playSuccessChime();
    coffeeSound.speakHebrew(`תערובת ${blendName} נוספה בהצלחה למגירת ההזמנות`);
    addItem({
      coffeeItemId: `custom-blend-${Date.now()}`,
      name: blendName || 'Custom Blend 250g',
      hebrewName: `${blendName || 'תערובת מותאמת אישית'} (250 גרם)`,
      price: 78,
      shots: 1,
      milkType: selectedRoast.hebrewName,
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&auto=format&fit=crop',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section id="custom-roast-studio" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-amber-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              מעבדת קלייה ומיקסר פולים בלייב
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gold-gradient tracking-tight">
              עיצוב תערובת פולים ופרופיל קלייה אישי
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              בחר את אחוזי הפולים מכל פלטו גידול, הגדר רמת קלייה וקבל ניתוח סנסורי AI בזמן אמת.
            </p>
          </div>

          <button
            onClick={resetRatios}
            className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            איפוס אחוזים
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                שם התערובת הייחודית שלך:
              </label>
              <input
                type="text"
                value={blendName}
                onChange={(e) => setBlendName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-900/80 border border-amber-500/30 text-stone-100 text-sm font-semibold focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="הכנס שם לתערובת הקפה שלך..."
              />
            </div>

            <div className="space-y-4 bg-stone-950/60 p-5 rounded-2xl border border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  הרכב הפולים בתערובת
                </span>
                <span className={`text-xs font-mono font-bold ${totalPercent === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  סה"כ: {totalPercent}% {totalPercent !== 100 && '(מומלץ להגיע ל-100%)'}
                </span>
              </div>

              {BEAN_ORIGINS.map((b) => (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-200 font-medium">{b.hebrewName} ({b.region})</span>
                    <span className="text-amber-400 font-mono font-bold">{ratios[b.id] || 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={ratios[b.id] || 0}
                    onChange={(e) => handleRatioChange(b.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3 bg-stone-950/60 p-5 rounded-2xl border border-stone-800">
              <span className="text-xs font-extrabold text-amber-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                רמת קליית הפולים
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {ROAST_LEVELS.map((r) => {
                  const isSelected = roastLevel === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        coffeeSound.playBeanCrunch();
                        coffeeSound.speakHebrew(`נבחרה ${r.hebrewName}`);
                        setRoastLevel(r.id);
                      }}
                      className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between text-xs ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-stone-100 shadow-md shadow-amber-500/10'
                          : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <span className="font-bold text-stone-100">{r.hebrewName}</span>
                      <span className="text-[10px] text-stone-400 mt-1">{r.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-b from-stone-900/90 to-stone-950/90 rounded-2xl p-6 border border-amber-500/20 shadow-xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400 uppercase tracking-wider pb-3 border-b border-stone-800">
              <Award className="w-4 h-4 text-amber-400" />
              פרופיל סנסורי AI משוער (250 גרם)
            </div>

            <div className="space-y-3.5">
              {[
                { label: 'חמיצות (Acidity)', value: flavors.acidity, color: 'from-amber-400 to-amber-500' },
                { label: 'גוף ומרקם (Body)', value: flavors.body, color: 'from-amber-600 to-amber-700' },
                { label: 'מתיקות טבעית (Sweetness)', value: flavors.sweetness, color: 'from-yellow-400 to-amber-400' },
                { label: 'עוצמת ארומה (Aroma)', value: flavors.aroma, color: 'from-orange-400 to-amber-500' },
                { label: 'פירותיות (Fruitiness)', value: flavors.fruitiness, color: 'from-rose-400 to-amber-400' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-stone-300">
                    <span>{item.label}</span>
                    <span className="font-mono text-amber-400 font-bold">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-800">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-400 block">מחיר למארז 250 גרם:</span>
                <span className="text-2xl font-black text-amber-400 font-mono">₪78</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={added}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-80"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-stone-950" />
                    <span>נוסף למגירה!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-stone-950" />
                    <span>הזמן תערובת זו</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
