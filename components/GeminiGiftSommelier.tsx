'use client';

import React, { useState } from 'react';
import { Gift, Sparkles, Heart, Coffee, ShoppingBag, Check, ArrowLeft, RotateCcw, Package } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface RecipientOption {
  id: string;
  label: string;
  hebrewLabel: string;
  description: string;
}

const RECIPIENTS: RecipientOption[] = [
  { id: 'purist', label: 'Espresso Purist', hebrewLabel: 'חובב אספרסו מושבע', description: 'מעריך קלייה כהה, קרמה עשירה וגוף מלא' },
  { id: 'pourover', label: 'Filter & V60 Connoisseur', hebrewLabel: 'אשף חליטות פילטר ו-V60', description: 'אוהב חמיצות פירותית, תווים פרחוניים ובהירות' },
  { id: 'latte', label: 'Latte & Milk Art Enthusiast', hebrewLabel: 'חובב משקאות חלב וציורי קפוצ׳ינו', description: 'מעדיף תערובות מתוקות עם נוכחות אגוזית ושוקולדית' },
  { id: 'coldbrew', label: 'Cold Brew Adventurer', hebrewLabel: 'הרפתקן חליטות קרות', description: 'מחפש קפה מרענן, פירותי ובעל מתיקות טבעית גבוהה' },
];

export function GeminiGiftSommelier() {
  const { addItem } = useCartStore();

  const [step, setStep] = useState<number>(1);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('purist');
  const [personalMessage, setPersonalMessage] = useState<string>('יום הולדת שמח! שתשתה קפה גורמה מדהים בכל בוקר ☕✨');
  const [added, setAdded] = useState<boolean>(false);

  const currentRecipient = RECIPIENTS.find((r) => r.id === selectedRecipient) || RECIPIENTS[0];

  const handleAddToCart = () => {
    coffeeSound.playCoffeeSteam();
    coffeeSound.playSuccessChime();
    coffeeSound.speakHebrew(`מארז מתנה עבור ${currentRecipient.hebrewLabel} נוסף בהצלחה למגירת ההזמנות`);
    addItem({
      coffeeItemId: `gift-box-${selectedRecipient}-${Date.now()}`,
      name: `Gift Box: ${currentRecipient.label}`,
      hebrewName: `מארז מתנה גורמה: ${currentRecipient.hebrewLabel}`,
      price: 189,
      shots: 1,
      milkType: 'מארז מתנה מעוצב',
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=400&auto=format&fit=crop',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section id="gift-sommelier" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-rose-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-10 right-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
              <Gift className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              אשף המתנות האינטראקטיבי
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gold-gradient tracking-tight">
              Gemini AI Gift Sommelier
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              התאם מארז מתנה יוקרתי לקפה גורמה לפי סגנון המקבל, כולל ברכה אישית סרוקה ב-Liquid Glass.
            </p>
          </div>

          {step > 1 && (
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              התחל מחדש
            </button>
          )}
        </div>

        {/* Step 1: Select Recipient Archetype */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-sm font-extrabold text-stone-200">למי מיועדת המתנה? בחרו את פרופיל חובב הקפה:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RECIPIENTS.map((rec) => {
                const isSelected = selectedRecipient === rec.id;
                return (
                  <button
                    key={rec.id}
                    onClick={() => setSelectedRecipient(rec.id)}
                    className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-400 text-stone-100 shadow-xl shadow-rose-500/10'
                        : 'bg-stone-950/70 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-stone-100">{rec.hebrewLabel}</span>
                      <Coffee className="w-4 h-4 text-rose-400" />
                    </div>
                    <span className="text-xs text-stone-400">{rec.description}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-stone-950 font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20"
              >
                <span>המשך לבניית המארז והברכה</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Custom Card & Preview */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <label className="block text-xs font-semibold text-stone-300">
                טקסט לברכה האישית המצורפת למארז:
              </label>
              <textarea
                rows={4}
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-rose-400"
              />

              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
                <span className="text-xs font-extrabold text-rose-300 flex items-center gap-2">
                  <Package className="w-4 h-4 text-rose-400" />
                  מה כולל מארז המתנה ({currentRecipient.hebrewLabel}):
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
                  <li>2 שקיות פולי קפה גורמה טריים (250g כל אחת) בהתאמה אישית</li>
                  <li>כוס אספרסו / מאג זכוכית תרמית Liquid Glass יוקרתית</li>
                  <li>שוקולד מריר 70% עם פולי קפה גרוסים</li>
                  <li>כרטיס ברכה מעוצב עם המסר האישי שלך</li>
                </ul>
              </div>
            </div>

            {/* Gift Box Card Preview - 5 Cols */}
            <div className="lg:col-span-5 bg-gradient-to-b from-stone-900 to-stone-950 rounded-2xl p-6 border border-rose-500/30 shadow-2xl space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 mx-auto flex items-center justify-center shadow-lg shadow-rose-500/20">
                <Gift className="w-8 h-8 text-stone-950" />
              </div>

              <div>
                <h4 className="text-lg font-black text-stone-100 mb-1">
                  מארז גורמה: {currentRecipient.hebrewLabel}
                </h4>
                <p className="text-xs text-rose-300 italic">"{personalMessage}"</p>
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-400 block">מחיר מארז מתנה:</span>
                  <span className="text-2xl font-black text-rose-400 font-mono">₪189</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-stone-950 font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-80"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-stone-950" />
                      <span>התווסף למגירה!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-stone-950" />
                      <span>הזמן מארז זה</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
