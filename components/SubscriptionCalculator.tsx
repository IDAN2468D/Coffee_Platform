'use client';

import React, { useState } from 'react';
import { Calendar, Percent, Coffee, Send, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export const SubscriptionCalculator: React.FC = () => {
  const [cupsPerDay, setCupsPerDay] = useState<number>(3);
  const [grindType, setGrindType] = useState<'BEANS' | 'ESPRESSO_FINE' | 'V60_MEDIUM' | 'CAPSULES'>('BEANS');
  const [roastPreference, setRoastPreference] = useState<'LIGHT' | 'MEDIUM' | 'DARK'>('MEDIUM');
  const [frequency, setFrequency] = useState<'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'>('MONTHLY');

  // Math logic: 15g coffee per cup. 30 days.
  const totalCupsMonth = cupsPerDay * 30;
  const gramsMonth = totalCupsMonth * 15;
  const bags250gNeeded = Math.ceil(gramsMonth / 250);
  const basePricePerBag = 55; // ₪55 per 250g bag
  const rawTotalPrice = bags250gNeeded * basePricePerBag;
  const discountAmount = Math.round(rawTotalPrice * 0.2); // 20% discount
  const finalSubscriptionPrice = rawTotalPrice - discountAmount;

  const handleWhatsAppSubscription = () => {
    const grindLabel = grindType === 'BEANS' ? 'פולים שלמים' : grindType === 'ESPRESSO_FINE' ? 'טחון לאספרסו' : grindType === 'V60_MEDIUM' ? 'טחון ל-V60' : 'קפסולות אלומיניום';
    const frequencyLabel = frequency === 'WEEKLY' ? 'שבועי' : frequency === 'BIWEEKLY' ? 'דו-שבועי' : 'חודשי';
    const text = `שלום The Digital Roast! ☕
ברצוני להצטרף למנוי הקפה החודשי האישי שלי:
• צריכה יומית: ${cupsPerDay} כוסות/יום (${bags250gNeeded} שקיות 250g בחודש)
• טחינה: ${grindLabel}
• קלייה: ${roastPreference}
• תדירות משלוח: ${frequencyLabel}
• מחיר מנוי מוזל (20% הנחה): ₪${finalSubscriptionPrice} לחודש (במקום ₪${rawTotalPrice})

אנא אשרו את המנוי ושלחו קשר לתשלום.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/97235558888?text=${encoded}`, '_blank');
  };

  return (
    <section id="subscription" className="w-full py-16 bg-stone-950/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Percent className="w-4 h-4 text-emerald-400" />
            מנוי קפה חודשי מותאם אישית - 20% הנחה קבועה
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 mb-3">
            מחשבון המנוי החודשי <span className="text-gold-gradient">ומשלוחי הגורמה</span>
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
            חשב את צריכת הפולים המדויקת של ביתך או משרדך, תהנה מקלייה טרייה מדי שבוע וקבל 20% הנחה קבועה ומשלוח חינם עד הבית!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Input Options Box */}
          <div className="lg:col-span-6 bg-stone-900/80 p-6 sm:p-8 rounded-3xl border border-stone-800 space-y-6">
            {/* Cups Per Day Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300 font-bold">כוסות קפה ביום:</span>
                <span className="text-amber-400 font-mono font-bold text-sm">{cupsPerDay} כוסות</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={cupsPerDay}
                onChange={(e) => setCupsPerDay(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Grind Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 block">סוג טחינה מבוקש:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'BEANS', label: 'פולים שלמים' },
                  { id: 'ESPRESSO_FINE', label: 'טחון לאספרסו' },
                  { id: 'V60_MEDIUM', label: 'טחון ל-V60' },
                  { id: 'CAPSULES', label: 'קפסולות אלומיניום' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGrindType(g.id as any)}
                    className={`py-2 px-3 rounded-xl font-semibold border transition-all ${
                      grindType === g.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Roast Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 block">פרופיל קלייה מועדף:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'LIGHT', label: 'קלייה בהירה 🌸' },
                  { id: 'MEDIUM', label: 'קלייה בינונית 🌰' },
                  { id: 'DARK', label: 'קלייה כהה 🍫' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRoastPreference(r.id as any)}
                    className={`py-2 px-2 rounded-xl font-semibold border text-center transition-all ${
                      roastPreference === r.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Frequency */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 block">תדירות המשלוחים:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'WEEKLY', label: 'כל שבוע' },
                  { id: 'BIWEEKLY', label: 'כל שבועיים' },
                  { id: 'MONTHLY', label: 'פעם בחודש' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFrequency(f.id as any)}
                    className={`py-2 px-2 rounded-xl font-semibold border text-center transition-all ${
                      frequency === f.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subscription Summary Card */}
          <div className="lg:col-span-6 liquid-glass rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs font-bold text-stone-300 flex items-center gap-2">
                <Coffee className="w-4 h-4 text-emerald-400" />
                סיכום חבילת המנוי החודשית
              </span>
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                20% DISCOUNT ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
                <span className="text-stone-400 text-[11px] block">סה"כ כוסות בחודש:</span>
                <span className="text-stone-100 font-bold font-mono text-base">{totalCupsMonth} כוסות</span>
              </div>

              <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
                <span className="text-stone-400 text-[11px] block">שקיות פולים (250g):</span>
                <span className="text-stone-100 font-bold font-mono text-base">{bags250gNeeded} שקיות</span>
              </div>
            </div>

            {/* Price Calculation Box */}
            <div className="bg-stone-950/80 p-5 rounded-2xl border border-emerald-500/40 text-center space-y-2">
              <span className="text-xs text-stone-400 block">מחיר מנוי חודשי סופי:</span>

              <div className="flex items-baseline justify-center gap-3">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                  ₪{finalSubscriptionPrice}
                </span>
                <span className="text-sm line-through text-stone-500 font-mono">
                  ₪{rawTotalPrice}
                </span>
              </div>

              <span className="inline-block text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-0.5 rounded-full">
                חיסכון של ₪{discountAmount} מדי חודש!
              </span>
            </div>

            {/* Features checkmarks */}
            <div className="space-y-1.5 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>משלוח חינם עד סף הדלת ברכב ממוזג</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>קלייה טרייה עד 48 שעות לפני השילוח</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>אפשרות לשינוי תדירות או ביטול בכל עת</span>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleWhatsAppSubscription}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-stone-950 font-extrabold text-xs sm:text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
              <span>הפעל מנוי גורמה ב-WhatsApp כעת</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
