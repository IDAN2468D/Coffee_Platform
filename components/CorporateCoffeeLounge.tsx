'use client';

import React, { useState } from 'react';
import { Building2, Users, Coffee, PackageCheck, Send, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export function CorporateCoffeeLounge() {
  const [employees, setEmployees] = useState<number>(25);
  const [cupsPerEmployee, setCupsPerEmployee] = useState<number>(2.5);
  const [deliveryFrequency, setDeliveryFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('biweekly');
  const [companyName, setCompanyName] = useState<string>('חברת הייטק בע"מ');
  const [ordered, setOrdered] = useState<boolean>(false);

  // Calculations
  // Total cups per working day (22 working days per month)
  const cupsPerDay = Math.round(employees * cupsPerEmployee);
  const monthlyCups = cupsPerDay * 22;

  // 18g coffee per cup -> kg per month
  const monthlyBeansKg = Math.round((monthlyCups * 18) / 1000);

  // 150ml milk per cup -> cartons (1L) per month
  const monthlyMilkCartons = Math.round((monthlyCups * 0.15));

  // Cleaning tabs & filters
  const cleaningTabs = Math.max(2, Math.ceil(monthlyCups / 150));

  // Estimate price (Approx 90 ILS per kg gourmet bean B2B price)
  const estimatedPrice = Math.round(monthlyBeansKg * 90 + monthlyMilkCartons * 12 + cleaningTabs * 25);

  const handleWhatsAppOrder = () => {
    coffeeSound.playSuccessChime();
    coffeeSound.speakHebrew(`הזמנת הקפה המשרדית עבור ${companyName} נשלחה בהצלחה בווטסאפ`);
    const text = encodeURIComponent(
      `שלום THE DIGITAL ROAST B2B! 👋\nמעוניין בביצוע הזמנה משרדית עבור: ${companyName}\n` +
      `מספר עובדים: ${employees}\n` +
      `פולי קפה מבוקשים: ${monthlyBeansKg} ק"ג\n` +
      `קרטוני חלב: ${monthlyMilkCartons} יח'\n` +
      `טבליות ניקוי: ${cleaningTabs} יח'\n` +
      `תקדירות אספקה: ${deliveryFrequency}\n` +
      `מחיר משוער: ₪${estimatedPrice}`
    );
    window.open(`https://wa.me/972500000000?text=${text}`, '_blank');
    setOrdered(true);
    setTimeout(() => setOrdered(false), 3000);
  };

  return (
    <section id="corporate-lounge" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              דשבורד קפה משרדי וניהול מלאי B2B
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gold-gradient tracking-tight">
              Corporate Coffee Lounge & Auto-Replenish
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              ניהול צריכת הקפה במשרד, תכנון מלאי חכם והזמנה מחזורית בלחיצה אחת ב-WhatsApp.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls - 7 Cols */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                שם החברה / המשרד:
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-900/80 border border-stone-700 text-stone-100 text-sm font-semibold focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Employee Count Slider */}
            <div className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  מספר עובדים במשרד:
                </span>
                <span className="text-emerald-400 font-mono font-bold text-sm">{employees} עובדים</span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Cups per Employee Slider */}
            <div className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-300 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-emerald-400" />
                  ממוצע כוסות קפה לעובד ביום:
                </span>
                <span className="text-emerald-400 font-mono font-bold text-sm">{cupsPerEmployee} כוסות</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={cupsPerEmployee}
                onChange={(e) => setCupsPerEmployee(Number(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Delivery Frequency */}
            <div className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 space-y-2">
              <span className="text-xs font-semibold text-stone-300 flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                תדירות אספקה מומלצת למשרד:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'weekly', label: 'שבועי' },
                  { id: 'biweekly', label: 'דו-שבועי' },
                  { id: 'monthly', label: 'חודשי' },
                ].map((freq) => (
                  <button
                    key={freq.id}
                    onClick={() => setDeliveryFrequency(freq.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      deliveryFrequency === freq.id
                        ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                        : 'bg-stone-900 border border-stone-800 text-stone-400'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Consumption Summary & Order Trigger - 5 Cols */}
          <div className="lg:col-span-5 bg-gradient-to-b from-stone-900/90 to-stone-950/90 rounded-2xl p-6 border border-emerald-500/20 shadow-xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider pb-3 border-b border-stone-800">
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              תחזית מלאי וצריכה חודשית
            </div>

            <div className="grid grid-cols-2 gap-3 text-right">
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-semibold">פולי קפה מבוקשים</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{monthlyBeansKg} ק"ג</span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-semibold">קרטוני חלב (1ל')</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{monthlyMilkCartons} יח'</span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-semibold">טבליות ניקוי למכונה</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{cleaningTabs} יח'</span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-semibold">סה"כ כוסות בחודש</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{monthlyCups}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-400 block">מחיר משוער לחודש:</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">₪{estimatedPrice}</span>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-stone-950 font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                {ordered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-stone-950" />
                    <span>נשלח ב-WhatsApp!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-stone-950" />
                    <span>הזמן ב-WhatsApp B2B</span>
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
