'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Printer,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  QrCode,
  Activity,
  Layers,
  CheckCircle2,
  Coffee,
  Sliders,
  Award,
  FileText,
  Volume2,
} from 'lucide-react';
import { ThermalReceiptAnimation } from '@/components/ThermalReceiptAnimation';
import { ReceiptData } from '@/components/Receipt';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const PRESET_ORDERS: { label: string; tag: string; data: Partial<ReceiptData> }[] = [
  {
    label: 'חליטת גורמה: פנמה גיישה אסמרלדה',
    tag: 'SINGLE ORIGIN',
    data: {
      orderNumber: 'GEISHA-9941',
      customerName: 'ד״ר אלון שפירו',
      customerPhone: '052-7891234',
      items: [
        { name: 'פנמה גיישה אסמרלדה (חבילת 250 גרם)', detail: 'קלייה בהירה • 550µm • SCA 94.5', quantity: 1, price: 98 },
        { name: 'בקבוק קולד ברו ניטרו אתיופיה 330 מ״ל', detail: '18 שעות מיצוי בחנקן נוזלי', quantity: 2, price: 25 },
      ],
      subtotal: 148,
      discount: 10,
      deliveryFee: 0,
      totalAmount: 138,
      scaScore: 94.5,
      paymentMethod: 'Obsidian Black VIP Card',
      cardLastDigits: '4491',
    },
  },
  {
    label: 'מארז בריסטה מקצועי & משקל חכם IoT',
    tag: 'BARISTA GEAR',
    data: {
      orderNumber: 'GEAR-5520',
      customerName: 'מיכל כהן',
      customerPhone: '050-1234567',
      items: [
        { name: 'משקל חכם Digital Roast BLE v2', detail: 'דיוק 0.01 גרם • סנכרון Bluetooth', quantity: 1, price: 320 },
        { name: 'טמפר לחץ קבוע 58.5 מ״מ עם מד כוח', detail: 'כיול קפיץ 15 ק״ג • טיטניום', quantity: 1, price: 140 },
        { name: 'פולי קולומביה פלמינגו אנאירובי (250 גרם)', detail: 'תסיסה מבוקרת 120 שעות', quantity: 1, price: 65 },
      ],
      subtotal: 525,
      discount: 35,
      deliveryFee: 0,
      totalAmount: 490,
      scaScore: 91.0,
      paymentMethod: 'Apple Pay • MasterCard',
      cardLastDigits: '8812',
    },
  },
  {
    label: 'מנוי קפה VIP חודשי (Roast Club Club Tier)',
    tag: 'SUBSCRIPTION',
    data: {
      orderNumber: 'SUB-3310',
      customerName: 'יונתן ברקוביץ׳',
      customerPhone: '054-4433221',
      items: [
        { name: 'מנוי Master Roaster חודשי (3 שקיות)', detail: 'פולי חודש עונתיים בקלייה אישית', quantity: 1, price: 195 },
        { name: 'דוגמית מיקרו-לוט גואטמלה אל פלאטנר', detail: 'בונוס חבר מועדון VIP', quantity: 1, price: 15 },
      ],
      subtotal: 210,
      discount: 20,
      deliveryFee: 0,
      totalAmount: 190,
      scaScore: 93.0,
      paymentMethod: 'Visa Infinite VIP',
      cardLastDigits: '7730',
    },
  },
];

export default function ThermalReceiptPage() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customData, setCustomData] = useState<Partial<ReceiptData>>(PRESET_ORDERS[0].data);
  const [animationKey, setAnimationKey] = useState(0);

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setCustomData(PRESET_ORDERS[index].data);
    setAnimationKey((prev) => prev + 1);
  };

  const handleUpdateField = (field: keyof ReceiptData, value: string | number) => {
    setCustomData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#050404] text-stone-100 font-sans selection:bg-amber-500/30 selection:text-amber-200" dir="rtl">
      <Header />

      {/* Hero Atmosphere Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/6 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-20 right-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
        {/* Page Breadcrumb & Tag */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              ראשי
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-bold">מדפסת קבלות תרמית & מיקרו-אינטראקציית תשלום</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SCA 203-DPI READY
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-bold">
              FRAMER MOTION + CANVAS CONFETTI
            </span>
          </div>
        </div>

        {/* Hero Title & Description */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-100">
            הדפסת קבלה תרמית <span className="text-gold-gradient">בזמן אמת</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
            מיקרו-אינטראקציה עשירה לאישור תשלום: גוף מדפסת יוקרתי, חריץ יציאת נייר עם פיזיקת קפיץ,
            פיצוץ קונפטי רב-צבעוני, תג אישור תשלום קופץ וקוד QR לאימות דיגיטלי מוצפן.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
          {PRESET_ORDERS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                selectedPresetIndex === idx
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-lg shadow-amber-500/10 scale-105'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>{preset.label}</span>
              <span className="text-[10px] font-mono bg-stone-950 px-2 py-0.5 rounded-full border border-stone-800 text-stone-300">
                ₪{preset.data.totalAmount}
              </span>
            </button>
          ))}
        </div>

        {/* Main Stage Grid: Interactive Receipt Dispenser & Live Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center Column: The Animated Thermal Printer Assembly */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl liquid-glass border border-amber-500/30 shadow-2xl relative">
            <div className="absolute top-4 right-4 flex items-center gap-2 text-[11px] font-mono text-stone-400">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>LIVE PHYSICS DISPENSE</span>
            </div>

            <div className="w-full flex justify-center py-4">
              <ThermalReceiptAnimation
                key={animationKey}
                receiptData={customData}
                autoPlay={true}
                showControls={true}
                title=""
                subtitle=""
              />
            </div>
          </div>

          {/* Right Column: Live Customizer & Parameter Studio */}
          <div className="lg:col-span-5 space-y-6">
            {/* Customizer Box */}
            <div className="p-6 rounded-3xl liquid-glass border border-stone-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Sliders className="w-4 h-4" />
                  <span>התאמת פרמטרים בזמן אמת</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">REACTIVE CONTROLS</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-400 mb-1 font-medium">שם הלקוח:</label>
                  <input
                    type="text"
                    value={customData.customerName || ''}
                    onChange={(e) => handleUpdateField('customerName', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-400 mb-1 font-medium">מספר הזמנה:</label>
                    <input
                      type="text"
                      value={customData.orderNumber || ''}
                      onChange={(e) => handleUpdateField('orderNumber', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-medium">סכום סופי (₪):</label>
                    <input
                      type="number"
                      value={customData.totalAmount || 0}
                      onChange={(e) => handleUpdateField('totalAmount', Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1 font-medium">אמצעי תשלום & 4 ספרות אחרונות:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={customData.paymentMethod || ''}
                      onChange={(e) => handleUpdateField('paymentMethod', e.target.value)}
                      className="col-span-2 px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500"
                      placeholder="שם כרטיס"
                    />
                    <input
                      type="text"
                      maxLength={4}
                      value={customData.cardLastDigits || ''}
                      onChange={(e) => handleUpdateField('cardLastDigits', e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono text-center focus:outline-none focus:border-amber-500"
                      placeholder="9012"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800/80">
                  <button
                    onClick={() => setAnimationKey((prev) => prev + 1)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-stone-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>הפעל מחדש עם הנתונים המעודכנים</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Architecture & Engineering Highlights */}
            <div className="p-6 rounded-3xl bg-stone-950/80 border border-stone-800/90 shadow-xl space-y-3.5">
              <h3 className="text-xs font-black uppercase font-mono tracking-wider text-stone-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>מפרט הנדסי וארכיטקטורת האנימציה</span>
              </h3>

              <div className="space-y-2.5 text-[11px] text-stone-400">
                <div className="flex items-start gap-2 bg-stone-900/50 p-2.5 rounded-xl border border-stone-800/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-200 block">גוף מדפסת עם חריץ Overflow-Hidden:</strong>
                    הקבלה ממוקמת בתחילה ב-`y: -100%` מאחורי שפתי החריץ ונפלטת מטה בצורה חלקה.
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-stone-900/50 p-2.5 rounded-xl border border-stone-800/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-200 block">עקומת קפיץ פיזיקלית (Cubic-Bezier):</strong>
                    ריסון מכני עדין `[0.22, 1, 0.36, 1]` המדמה חיכוך והאטה אמיתית של נייר תרמי.
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-stone-900/50 p-2.5 rounded-xl border border-stone-800/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-200 block">תזמון קונפטי וצליל מנוע צעד:</strong>
                    פיצוץ קונפטי ב-0.7s ממוקד לחריץ, בליווי סינתוז שמע של מנוע צעד ב-Web Audio API.
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-stone-900/50 p-2.5 rounded-xl border border-stone-800/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-200 block">מנגנון תלישת קבלה (Physical Tear-Off ✂️):</strong>
                    מחוות גרירה מטה (`drag="y"`) או לחיצה לתלישת הקבלה עם סאונד קריעת נייר אותנטי ב-Web Audio API, ניתוק מהלהב והשארת סדק נייר במדפסת.
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-stone-900/50 p-2.5 rounded-xl border border-stone-800/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-200 block">קוד אימות QR ושיני חיתוך SVG:</strong>
                    קצוות Sawtooth מדויקים וקוד QR הניתן לסריקה ישירה לאימות חתימה דיגיטלית.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Snippet & Integration Guide */}
        <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-stone-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2 text-stone-200 font-bold text-sm">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>כיצד להשתמש ברכיב בכל מקום באפליקציה</span>
            </div>
            <span className="text-[10px] font-mono bg-stone-950 px-2.5 py-1 rounded-full border border-stone-800 text-stone-400">
              NEXT.JS 15 + REACT 19 COMPATIBLE
            </span>
          </div>

          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 font-mono text-xs text-amber-200/90 overflow-x-auto" dir="ltr">
            <pre>{`import { ThermalReceiptAnimation } from '@/components/ThermalReceiptAnimation';

// בדף הצלחת תשלום או מודל אישור הזמנה:
<ThermalReceiptAnimation
  receiptData={{
    orderNumber: "ORD-99120",
    customerName: "ישראל ישראלי",
    items: [
      { name: "פנמה גיישה אסמרלדה", quantity: 1, price: 98 },
      { name: "קולד ברו ניטרו כפול", quantity: 2, price: 25 },
    ],
    totalAmount: 148,
    paymentMethod: "Apple Pay",
    cardLastDigits: "9012"
  }}
  autoPlay={true}
  onComplete={() => console.log("ההדפסה הסתיימה!")}
/>`}</pre>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
