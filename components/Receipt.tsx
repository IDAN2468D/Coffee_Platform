'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  CheckCircle2,
  Coffee,
  QrCode,
  Sparkles,
  Scissors,
  GripHorizontal,
  FileCheck2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export interface ReceiptItem {
  name: string;
  detail?: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  orderNumber?: string;
  merchantName?: string;
  merchantSubtext?: string;
  customerName?: string;
  customerPhone?: string;
  items?: ReceiptItem[];
  subtotal?: number;
  discount?: number;
  deliveryFee?: number;
  totalAmount?: number;
  date?: string;
  time?: string;
  paymentMethod?: string;
  cardLastDigits?: string;
  authCode?: string;
  scaScore?: number;
  verifyUrl?: string;
}

interface ReceiptProps {
  data?: ReceiptData;
  badgeAnimateDelay?: number;
  isTorn?: boolean;
  canTear?: boolean;
  onTear?: () => void;
  className?: string;
}

// Realistic 48-tooth micro-serrated edge clip-path (Top & Bottom)
const SERRATED_CLIP_PATH = `polygon(
  0% 5px, 1% 0px, 2% 5px, 3% 0px, 4% 5px, 5% 0px, 6% 5px, 7% 0px, 8% 5px, 9% 0px, 10% 5px,
  11% 0px, 12% 5px, 13% 0px, 14% 5px, 15% 0px, 16% 5px, 17% 0px, 18% 5px, 19% 0px, 20% 5px,
  21% 0px, 22% 5px, 23% 0px, 24% 5px, 25% 0px, 26% 5px, 27% 0px, 28% 5px, 29% 0px, 30% 5px,
  31% 0px, 32% 5px, 33% 0px, 34% 5px, 35% 0px, 36% 5px, 37% 0px, 38% 5px, 39% 0px, 40% 5px,
  41% 0px, 42% 5px, 43% 0px, 44% 5px, 45% 0px, 46% 5px, 47% 0px, 48% 5px, 49% 0px, 50% 5px,
  51% 0px, 52% 5px, 53% 0px, 54% 5px, 55% 0px, 56% 5px, 57% 0px, 58% 5px, 59% 0px, 60% 5px,
  61% 0px, 62% 5px, 63% 0px, 64% 5px, 65% 0px, 66% 5px, 67% 0px, 68% 5px, 69% 0px, 70% 5px,
  71% 0px, 72% 5px, 73% 0px, 74% 5px, 75% 0px, 76% 5px, 77% 0px, 78% 5px, 79% 0px, 80% 5px,
  81% 0px, 82% 5px, 83% 0px, 84% 5px, 85% 0px, 86% 5px, 87% 0px, 88% 5px, 89% 0px, 90% 5px,
  91% 0px, 92% 5px, 93% 0px, 94% 5px, 95% 0px, 96% 5px, 97% 0px, 98% 5px, 99% 0px, 100% 5px,
  100% calc(100% - 5px),
  99% 100%, 98% calc(100% - 5px), 97% 100%, 96% calc(100% - 5px), 95% 100%, 94% calc(100% - 5px), 93% 100%, 92% calc(100% - 5px), 91% 100%, 90% calc(100% - 5px),
  89% 100%, 88% calc(100% - 5px), 87% 100%, 86% calc(100% - 5px), 85% 100%, 84% calc(100% - 5px), 83% 100%, 82% calc(100% - 5px), 81% 100%, 80% calc(100% - 5px),
  79% 100%, 78% calc(100% - 5px), 77% 100%, 76% calc(100% - 5px), 75% 100%, 74% calc(100% - 5px), 73% 100%, 72% calc(100% - 5px), 71% 100%, 70% calc(100% - 5px),
  69% 100%, 68% calc(100% - 5px), 67% 100%, 66% calc(100% - 5px), 65% 100%, 64% calc(100% - 5px), 63% 100%, 62% calc(100% - 5px), 61% 100%, 60% calc(100% - 5px),
  59% 100%, 58% calc(100% - 5px), 57% 100%, 56% calc(100% - 5px), 55% 100%, 54% calc(100% - 5px), 53% 100%, 52% calc(100% - 5px), 51% 100%, 50% calc(100% - 5px),
  49% 100%, 48% calc(100% - 5px), 47% 100%, 46% calc(100% - 5px), 45% 100%, 44% calc(100% - 5px), 43% 100%, 42% calc(100% - 5px), 41% 100%, 40% calc(100% - 5px),
  39% 100%, 38% calc(100% - 5px), 37% 100%, 36% calc(100% - 5px), 35% 100%, 34% calc(100% - 5px), 33% 100%, 32% calc(100% - 5px), 31% 100%, 30% calc(100% - 5px),
  29% 100%, 28% calc(100% - 5px), 27% 100%, 26% calc(100% - 5px), 25% 100%, 24% calc(100% - 5px), 23% 100%, 22% calc(100% - 5px), 21% 100%, 20% calc(100% - 5px),
  19% 100%, 18% calc(100% - 5px), 17% 100%, 16% calc(100% - 5px), 15% 100%, 14% calc(100% - 5px), 13% 100%, 12% calc(100% - 5px), 11% 100%, 10% calc(100% - 5px),
  9% 100%, 8% calc(100% - 5px), 7% 100%, 6% calc(100% - 5px), 5% 100%, 4% calc(100% - 5px), 3% 100%, 2% calc(100% - 5px), 1% 100%, 0% calc(100% - 5px)
)`;

const badgeVariants: Variants = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: {
    scale: [0.85, 1.08, 1],
    opacity: 1,
    transition: { delay: 1.1, duration: 0.35, ease: 'easeOut' },
  },
};

export const Receipt: React.FC<ReceiptProps> = ({
  data = {},
  badgeAnimateDelay = 1.1,
  isTorn = false,
  canTear = false,
  onTear,
  className = '',
}) => {
  const {
    orderNumber = 'ROAST-88241',
    merchantName = 'THE DIGITAL ROAST',
    merchantSubtext = 'מעבדת קליית גורמה ומדע חליטה • תל אביב',
    customerName = 'ישראל ישראלי',
    customerPhone = '054-9876543',
    items = [
      { name: 'פנמה גיישה אסמרלדה (חבילת 250 גרם)', detail: 'קלייה בהירה • טחינה ל-V60 (550µm)', quantity: 1, price: 88 },
      { name: 'קולד ברו ניטרו כפול (פחית 330 מ״ל)', detail: 'חליטה קרה 18 שעות בחנקן', quantity: 2, price: 36 },
      { name: 'קרואסון שקדים וקרם אספרסו שף', detail: 'טרי מהתנור • התאמת סומלייה', quantity: 1, price: 24 },
    ],
    subtotal = 148,
    discount = 0,
    deliveryFee = 0,
    totalAmount = 148,
    date = new Date().toLocaleDateString('he-IL'),
    time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
    paymentMethod = 'Apple Pay / Obsidian Card',
    cardLastDigits = '9012',
    authCode = 'AUTH-94021-OK',
    scaScore = 92.5,
    verifyUrl = `https://coffee.digitalroast.io/verify/${orderNumber || 'ROAST-88241'}`,
  } = data;

  return (
    <div
      className={`relative w-full max-w-[340px] sm:max-w-[360px] mx-auto transition-all duration-300 ${className}`}
      dir="rtl"
      style={{
        filter: isTorn
          ? 'drop-shadow(0 25px 35px rgba(0, 0, 0, 0.65)) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.4))'
          : 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.45))',
      }}
    >
      {/* Physical Paper Card with Serrated Micro-Teeth (No black borders!) */}
      <div
        className="w-full bg-[#F8FAFC] text-stone-900 select-none font-sans pt-3 pb-4 px-5 sm:px-6 relative overflow-hidden"
        style={{
          clipPath: SERRATED_CLIP_PATH,
          WebkitClipPath: SERRATED_CLIP_PATH,
        }}
      >
        {/* Interactive Top Tear Cutting Line Guide when ready to tear */}
        {canTear && !isTorn && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onTear}
            className="group cursor-pointer mb-3 py-1.5 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-dashed border-amber-400/80 flex items-center justify-between text-[11px] font-bold text-amber-900 transition-all shadow-sm"
            title="לחץ או משוך מטה כדי לגזור/לתלוש את הקבלה"
          >
            <div className="flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-45 transition-transform" />
              <span>לחץ כאן לגזירת הקבלה</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-amber-700">
              <GripHorizontal className="w-3.5 h-3.5 animate-pulse" />
              <span>CUT ✂️</span>
            </div>
          </motion.div>
        )}

        {/* Torn Paper Header Status Badge */}
        {isTorn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-3 py-1 px-2.5 rounded-md bg-emerald-50 border border-emerald-300 text-[10px] text-emerald-900 font-bold flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>קבלה נגזרה ונשמרה בהצלחה</span>
            </span>
            <span className="font-mono text-[9px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
              VERIFIED
            </span>
          </motion.div>
        )}

        {/* Main Thermal Receipt Content */}
        <div className="space-y-4 pt-1">
          {/* Merchant Branding Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-stone-900 text-amber-400 mb-1 shadow-md">
              <Coffee className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-wider text-stone-900 font-mono">
              {merchantName}
            </h2>
            <p className="text-[10px] text-stone-500 font-medium leading-tight">
              {merchantSubtext}
            </p>
            <div className="pt-1 flex items-center justify-center gap-2 text-[10px] font-mono text-stone-600">
              <span>הזמנה #{orderNumber}</span>
              <span>•</span>
              <span>ציון SCA {scaScore}</span>
            </div>
          </div>

          {/* Dotted Divider */}
          <div className="border-b-2 border-dashed border-stone-300" />

          {/* Customer & Timestamp Info */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 font-mono">
            <div>
              <span className="text-stone-400 block text-[9px]">לקוח</span>
              <span className="font-bold text-stone-800">{customerName}</span>
            </div>
            <div className="text-left" dir="ltr">
              <span className="text-stone-400 block text-[9px] text-right">תאריך ושעה</span>
              <span className="font-bold text-stone-800 text-right block">{date} {time}</span>
            </div>
            {customerPhone && (
              <div>
                <span className="text-stone-400 block text-[9px]">טלפון</span>
                <span className="text-stone-700">{customerPhone}</span>
              </div>
            )}
            <div className="text-left" dir="ltr">
              <span className="text-stone-400 block text-[9px] text-right">אמצעי תשלום</span>
              <span className="text-stone-700 text-right block">{paymentMethod} (••{cardLastDigits})</span>
            </div>
          </div>

          {/* Dotted Divider */}
          <div className="border-b border-stone-200" />

          {/* Order Items Table */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider pb-1 border-b border-stone-200">
              <span>פריט וכמות</span>
              <span>מחיר</span>
            </div>

            <div className="space-y-2.5">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs">
                  <div className="flex-1 pr-1">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span className="text-amber-700 font-mono font-black">{item.quantity}×</span>
                      <span>{item.name}</span>
                    </div>
                    {item.detail && (
                      <div className="text-[10px] text-stone-500 font-sans mt-0.5 leading-tight">
                        {item.detail}
                      </div>
                    )}
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-xs whitespace-nowrap pt-0.5">
                    ₪{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dotted Divider */}
          <div className="border-b-2 border-dashed border-stone-300" />

          {/* Financial Breakdown */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600 font-mono text-[11px]">
              <span>סכום ביניים</span>
              <span>₪{subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-mono text-[11px]">
                <span>הנחת מועדון קלייה</span>
                <span>-₪{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600 font-mono text-[11px]">
              <span>דמי משלוח אקספרס</span>
              <span>{deliveryFee === 0 ? 'חינם (0.00 ₪)' : `₪${deliveryFee.toFixed(2)}`}</span>
            </div>

            <div className="border-b border-stone-300 pt-1" />

            <div className="flex justify-between items-baseline pt-1">
              <span className="font-bold text-stone-900 text-sm">סה״כ לתשלום (כולל מע״מ)</span>
              <span className="font-black font-mono text-stone-950 text-lg">
                ₪{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Status Stamp */}
          <div className="pt-2 flex justify-center">
            <motion.div
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span className="text-xs font-black tracking-wide font-sans">
                שולם במלואו • עסקה מאושרת
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </motion.div>
          </div>

          {/* Dotted Divider */}
          <div className="border-b-2 border-dashed border-stone-300" />

          {/* Verification QR Code & Auth Metadata */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col text-[9px] font-mono text-stone-500 space-y-0.5">
              <span className="font-bold text-stone-700">קוד אישור: {authCode}</span>
              <span>תקן הצפנה: TLS 1.3 / AES-256</span>
              <span>סריקה לצפייה בחשבונית מקור</span>
              <span className="text-amber-700 font-bold">digitalroast.io/verify</span>
            </div>
            <div className="p-1.5 bg-white border border-stone-300 rounded-lg shadow-sm">
              <QRCodeSVG
                value={verifyUrl}
                size={58}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#1C1917"
              />
            </div>
          </div>

          {/* Simulated Barcode */}
          <div className="pt-1 flex flex-col items-center">
            <div className="w-full h-8 flex justify-center items-center opacity-85">
              <svg viewBox="0 0 240 32" className="w-4/5 h-full" fill="#1C1917">
                <rect x="0" y="0" width="3" height="32" />
                <rect x="5" y="0" width="1" height="32" />
                <rect x="8" y="0" width="4" height="32" />
                <rect x="15" y="0" width="2" height="32" />
                <rect x="19" y="0" width="5" height="32" />
                <rect x="27" y="0" width="1" height="32" />
                <rect x="31" y="0" width="3" height="32" />
                <rect x="36" y="0" width="6" height="32" />
                <rect x="45" y="0" width="2" height="32" />
                <rect x="50" y="0" width="4" height="32" />
                <rect x="56" y="0" width="1" height="32" />
                <rect x="60" y="0" width="3" height="32" />
                <rect x="66" y="0" width="5" height="32" />
                <rect x="74" y="0" width="2" height="32" />
                <rect x="79" y="0" width="4" height="32" />
                <rect x="85" y="0" width="2" height="32" />
                <rect x="90" y="0" width="6" height="32" />
                <rect x="99" y="0" width="1" height="32" />
                <rect x="103" y="0" width="4" height="32" />
                <rect x="110" y="0" width="3" height="32" />
                <rect x="115" y="0" width="2" height="32" />
                <rect x="120" y="0" width="5" height="32" />
                <rect x="128" y="0" width="1" height="32" />
                <rect x="132" y="0" width="4" height="32" />
                <rect x="138" y="0" width="2" height="32" />
                <rect x="143" y="0" width="6" height="32" />
                <rect x="152" y="0" width="3" height="32" />
                <rect x="158" y="0" width="1" height="32" />
                <rect x="162" y="0" width="4" height="32" />
                <rect x="168" y="0" width="2" height="32" />
                <rect x="173" y="0" width="5" height="32" />
                <rect x="180" y="0" width="4" height="32" />
                <rect x="187" y="0" width="1" height="32" />
                <rect x="191" y="0" width="3" height="32" />
                <rect x="197" y="0" width="6" height="32" />
                <rect x="206" y="0" width="2" height="32" />
                <rect x="211" y="0" width="4" height="32" />
                <rect x="218" y="0" width="3" height="32" />
                <rect x="224" y="0" width="5" height="32" />
                <rect x="232" y="0" width="2" height="32" />
                <rect x="237" y="0" width="3" height="32" />
              </svg>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-1 border-t border-stone-200">
            <p className="text-[9px] text-stone-500 font-medium">
              תודה שבחרתם באיכות של The Digital Roast. תיהנו מהקפה שלכם! ☕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
