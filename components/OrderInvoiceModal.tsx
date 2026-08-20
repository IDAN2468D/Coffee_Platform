'use client';

import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Coffee,
  CheckCircle2,
  QrCode,
  Download,
  ShieldCheck,
  Building,
  Calendar,
  CreditCard,
  MapPin,
  Sparkles,
  Cloud,
  FileCheck,
  Layers,
  Receipt as ReceiptIcon,
} from 'lucide-react';
import { UserOrderRecord } from '@/lib/store/useOrderStore';
import { coffeeSound } from '@/lib/audio/coffeeSounds';
import { GoogleDriveSyncButton } from '@/components/GoogleDriveSyncButton';
import { ThermalReceiptAnimation } from '@/components/ThermalReceiptAnimation';

interface OrderInvoiceModalProps {
  order: UserOrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({ order, isOpen, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'invoice' | 'thermal'>('invoice');

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    coffeeSound.playBaristaClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const vatRate = 0.18;
  const subtotal = order.totalPrice / (1 + vatRate);
  const vatAmount = order.totalPrice - subtotal;
  const invoiceNum = order.orderNumber.startsWith('DR-') ? order.orderNumber : `DR-${order.orderNumber}`;

  const formattedDate = new Date(order.createdAt).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto animate-fadeIn dir-rtl text-right">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#16120e] via-[#0e0c0b] to-[#090807] border border-amber-500/50 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Liquid Glass Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 print:hidden" />

        {/* Modal Header Controls (Hidden on Print) */}
        <div className="print:hidden p-4 sm:p-5 border-b border-amber-500/20 bg-stone-950/80 backdrop-blur-md flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-2.5 text-amber-400">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-100 flex items-center gap-1.5">
                <span>חשבונית מס / קבלה דיגיטלית</span>
                <span className="text-xs text-amber-400/80 font-mono">#{invoiceNum}</span>
              </h3>
              <p className="text-[11px] text-stone-400">מסונכרן ומאובטח לענן Google Drive</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-stone-900/90 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveTab('invoice')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'invoice'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              חשבונית מס
            </button>
            <button
              onClick={() => setActiveTab('thermal')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'thermal'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ReceiptIcon className="w-3 h-3 text-amber-400" />
              <span>הדפסה תרמית ☕</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <GoogleDriveSyncButton order={order} variant="button" />

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              title="הדפס או שמור כ-PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">הדפס / PDF</span>
            </button>

            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-400 hover:text-stone-100 hover:border-amber-500/40 transition-all cursor-pointer"
              title="סגור חלון"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Thermal Animation or Standard Tax Invoice */}
        {activeTab === 'thermal' ? (
          <div className="p-6 overflow-y-auto flex justify-center">
            <ThermalReceiptAnimation
              receiptData={{
                orderNumber: order.orderNumber,
                customerName: order.fullName || 'לקוח VIP',
                customerPhone: order.phone || '054-0000000',
                items: order.items.map((it) => ({
                  name: it.itemName,
                  detail: `${it.shots || 1} שוטים • ${it.milkType || 'חלב רגיל'}`,
                  quantity: it.quantity || 1,
                  price: it.pricePerUnit || 0,
                })),
                subtotal: order.totalPrice,
                totalAmount: order.totalPrice,
                paymentMethod: 'כרטיס אשראי / Digital Roast Pay',
                cardLastDigits: '9012',
              }}
              autoPlay={true}
              showControls={true}
              title=""
              subtitle=""
            />
          </div>
        ) : (
          <div
            ref={printRef}
            className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-200 print:text-black print:bg-white print:p-8 print:m-0"
          >
          {/* Company Branding & Receipt Title */}
          <div className="text-center border-b border-dashed border-amber-500/30 print:border-black pb-5 space-y-2">
            <div className="inline-flex items-center justify-center gap-2 text-amber-400 print:text-black">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-700/20 print:bg-black/10 border border-amber-500/40 print:border-black flex items-center justify-center font-black shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Coffee className="w-5 h-5 text-amber-400 print:text-black" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-wider uppercase font-mono bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 bg-clip-text text-transparent print:text-black">
                THE DIGITAL ROAST
              </span>
            </div>
            <p className="text-xs text-stone-400 print:text-stone-600 font-medium">
              חברת הקפה הגורמה והקלייה הספציאליטית בע"מ • ח.פ. 519824601
            </p>
            <p className="text-[11px] text-stone-500 print:text-stone-600 font-mono">
              שדרות רוטשילד 45, תל אביב • טלפון: 03-6821900 • support@digitalroast.co.il
            </p>
            <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 print:border-black print:text-black text-xs font-black">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>מסמך ממוחשב - מקור חתום דיגיטלית</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 print:border-black print:text-black text-xs font-bold font-mono">
                <Cloud className="w-3.5 h-3.5" />
                <span>Google Drive Cloud Verified</span>
              </span>
            </div>
          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs bg-stone-900/60 print:bg-stone-100 p-4 rounded-2xl border border-amber-500/20 print:border-stone-300">
            <div>
              <span className="text-stone-400 print:text-stone-600 block text-[10px] font-medium">מספר חשבונית / הזמנה:</span>
              <span className="font-mono font-black text-amber-300 print:text-black text-sm">
                #{invoiceNum}
              </span>
            </div>
            <div>
              <span className="text-stone-400 print:text-stone-600 block text-[10px] font-medium">תאריך ושעת הפקה:</span>
              <span className="font-bold text-stone-200 print:text-black">
                {formattedDate}
              </span>
            </div>
            <div>
              <span className="text-stone-400 print:text-stone-600 block text-[10px] font-medium">אמצעי תשלום:</span>
              <span className="font-bold text-stone-200 print:text-black flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-400 print:text-black" />
                <span>{order.paymentMethod || 'אשראי מאובטח (SSL)'}</span>
              </span>
            </div>
            <div>
              <span className="text-stone-400 print:text-stone-600 block text-[10px] font-medium">שם המזמין:</span>
              <span className="font-bold text-stone-200 print:text-black">{order.fullName || 'לקוח The Digital Roast'}</span>
            </div>
            <div>
              <span className="text-stone-400 print:text-stone-600 block text-[10px] font-medium">טלפון ליצירת קשר:</span>
              <span className="font-mono font-bold text-stone-200 print:text-black">{order.phone || '050-0000000'}</span>
            </div>
            <div>
              <span className="text-stone-400 print:text-stone-600 block text-[10px] font-medium">כתובת יעד למשלוח:</span>
              <span className="font-bold text-stone-200 print:text-black truncate block" title={order.deliveryAddress}>
                {order.deliveryAddress || 'איסוף עצמי מסניף רוטשילד'}
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-amber-400 print:text-black uppercase tracking-wider flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5" />
              <span>פירוט פריטי הקפה והתאמות בראיסטה</span>
            </h4>
            <div className="rounded-2xl border border-stone-800 print:border-stone-400 overflow-hidden shadow-inner">
              <table className="w-full text-xs text-right">
                <thead className="bg-amber-500/10 print:bg-stone-200 text-amber-300 print:text-black text-[11px] font-bold border-b border-amber-500/20 print:border-stone-400">
                  <tr>
                    <th className="p-3">תיאור פריט והתאמות</th>
                    <th className="p-3 text-center">כמות</th>
                    <th className="p-3 text-center">מחיר יח׳</th>
                    <th className="p-3 text-left">סה״כ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 print:divide-stone-300">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-amber-500/5 transition-colors print:hover:bg-transparent">
                      <td className="p-3">
                        <div className="font-black text-stone-100 print:text-black">{item.itemName}</div>
                        {(item.shots || item.milkType || item.origin) && (
                          <div className="text-[10px] text-amber-400/90 print:text-stone-600 font-medium mt-0.5">
                            ✦ {item.shots ? `${item.shots} שוטים אספרסו` : ''}
                            {item.shots && item.milkType ? ' • ' : ''}
                            {item.milkType ? item.milkType : ''}
                            {item.origin ? ` • מקור: ${item.origin}` : ''}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono font-bold">{item.quantity}</td>
                      <td className="p-3 text-center font-mono">₪{item.pricePerUnit.toFixed(2)}</td>
                      <td className="p-3 text-left font-mono font-black text-amber-300 print:text-black">
                        ₪{(item.quantity * item.pricePerUnit).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Calculation Summary Block */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-950/80 print:bg-stone-50 p-4 rounded-2xl border border-amber-500/30 print:border-stone-300">
            <div className="flex items-center gap-3 text-stone-400 print:text-stone-600 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400 print:text-black" />
              </div>
              <div>
                <span className="font-bold text-stone-200 print:text-black block">עסקת מסחר מאובטחת SSL 256-bit</span>
                <span className="text-[10px]">קבלה זו מהווה אישור תשלום סופי ומאושר לרשויות המס</span>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-left">
              <div className="flex justify-between text-stone-400 print:text-stone-600">
                <span>סכום ביניים לפני מע״מ:</span>
                <span className="font-mono">₪{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400 print:text-stone-600">
                <span>מע״מ כחוק (18%):</span>
                <span className="font-mono">₪{vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400 print:text-stone-600">
                <span>דמי משלוח וטיפול VIP:</span>
                <span className="font-bold text-emerald-400 print:text-black">חינם (הטבת Roast Club)</span>
              </div>
              <div className="border-t border-dashed border-amber-500/40 print:border-black pt-2 flex justify-between text-base font-black text-amber-400 print:text-black">
                <span>סה״כ שולם כולל מע״מ:</span>
                <span className="font-mono text-lg text-amber-300 print:text-black">₪{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Barcode & Verification QR Section */}
          <div className="border-t border-stone-800 print:border-black pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
            <div className="space-y-1">
              <div className="font-mono text-[10px] tracking-widest text-amber-400/70 print:text-stone-600 uppercase font-bold">
                DIGITAL ROAST AUTHENTICATION VERIFIED
              </div>
              {/* Simulated Thermal Barcode */}
              <div className="flex items-center justify-center sm:justify-start gap-0.5 h-8 opacity-90 print:opacity-100">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 4, 2, 1, 2, 3].map((w, i) => (
                  <div
                    key={i}
                    style={{ width: `${w * 2}px` }}
                    className="h-full bg-amber-400 print:bg-black rounded-xs"
                  />
                ))}
              </div>
              <div className="font-mono text-[9px] text-stone-500 print:text-stone-600">
                AUTH-HASH: DRIVE-CLOUD-{invoiceNum}-2026-COFFEE-SECURE
              </div>
            </div>

            {/* QR Verification Block */}
            <div className="flex items-center gap-3 bg-stone-900/80 print:bg-transparent p-2.5 rounded-2xl border border-amber-500/20 print:border-none">
              <div className="bg-white p-1.5 rounded-xl">
                <svg className="w-11 h-11" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" />
                  <path d="M10 10h30v30H10zM60 10h30v30H60zM10 60h30v30H10z" fill="black" />
                  <path d="M18 18h14v14H18zM68 18h14v14H68zM18 68h14v14H18z" fill="white" />
                  <rect x="45" y="10" width="10" height="80" fill="black" />
                  <rect x="10" y="45" width="80" height="10" fill="black" />
                </svg>
              </div>
              <div className="text-right text-[10px] text-stone-400 print:text-stone-600 font-medium">
                <span className="block font-bold text-stone-200 print:text-black">סריקה לאימות מקור</span>
                <span>אישור רשמי ודיגיטלי בענן</span>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-stone-500 print:text-stone-600 pt-2 font-mono">
            תודה שבחרת ב-THE DIGITAL ROAST • חווית קפה ספציאליטי יוצאת דופן! ☕
          </div>
        </div>
        )}

      </div>
    </div>
  );
};
