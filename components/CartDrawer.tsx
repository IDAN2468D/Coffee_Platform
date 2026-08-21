'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Loader2,
  CheckCircle2,
  PackageCheck,
  Mail,
  Send,
  Check,
  ExternalLink,
  History,
  Receipt as ReceiptIcon,
  Sparkles,
  Tag,
  Truck,
  Store,
  Zap,
  Info,
  Coffee,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Phone,
  User,
} from 'lucide-react';
import { useCartStore, DeliveryMethod } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { createStandardOrder, sendOrderEmailAction } from '@/app/actions/orderActions';
import { orderSchema } from '@/lib/validations/auth';
import { ThreeDCardPayment } from './ThreeDCardPayment';
import { ThermalReceiptModal } from './ThermalReceiptModal';
import { IsraelAddressAutocomplete, AddressSelection } from './IsraelAddressAutocomplete';

// Sample quick recommendations when cart is empty
const QUICK_RECOMMENDATIONS = [
  {
    coffeeItemId: 'ethiopia-yirgacheffe',
    name: 'Ethiopia Yirgacheffe G1',
    hebrewName: 'אתיופיה ייגרצ\'ף G1 (חליטת V60)',
    price: 22,
    shots: 1,
    milkType: 'ללא חלב (שחור)',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=300&auto=format&fit=crop',
  },
  {
    coffeeItemId: 'colombia-geisha-micro',
    name: 'Colombia Pink Bourbon Geisha',
    hebrewName: 'קולומביה פינק בורבון גיישה (דאבל שוט)',
    price: 26,
    shots: 2,
    milkType: 'חלב שיבולת שועל',
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=300&auto=format&fit=crop',
  },
  {
    coffeeItemId: 'nitro-cold-brew-reserve',
    name: 'Artisan Nitro Cold Brew',
    hebrewName: 'נייטרו קולד ברו Reserve במרקם קטיפתי',
    price: 24,
    shots: 1,
    milkType: 'ללא חלב (קטיפה טבעית)',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=300&auto=format&fit=crop',
  },
];

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    addItem,
    deliveryMethod,
    setDeliveryMethod,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    orderNotes,
    setOrderNotes,
    getSubtotal,
    getDeliveryCost,
    getDiscountAmount,
    getFinalTotalPrice,
    getVatAmount,
    getItemCount,
  } = useCartStore();

  const { user } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [structuredAddress, setStructuredAddress] = useState<AddressSelection | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  // Form Validation & Errors
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [showPaymentSim, setShowPaymentSim] = useState(false);
  const [showThermalReceipt, setShowThermalReceipt] = useState(false);

  // Custom email resend state
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccessMsg, setResendSuccessMsg] = useState('');
  const [resendErrorMsg, setResendErrorMsg] = useState('');

  // Auto-fill form details if user is logged in
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.fullName || '');
      if (!email || email === 'user.google@gmail.com') {
        setEmail(user.email && !user.email.includes('google@gmail.com') ? user.email : '');
      }
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const deliveryCost = getDeliveryCost();
  const discountAmount = getDiscountAmount();
  const finalTotal = getFinalTotalPrice();
  const vatAmount = getVatAmount();
  const totalItemsCount = getItemCount();

  // Validate fields in real-time
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'נא להזין שם מלא (לפחות 2 תווים)';
    }

    const cleanPhone = phone.replace(/[\s.-]/g, '');
    if (!cleanPhone || !/^(\+?972|0)[2-9]\d{7,8}$/.test(cleanPhone) && !/^0\d{8,9}$/.test(cleanPhone)) {
      errors.phone = 'מספר טלפון נייד/נייח ישראלי אינו תקין (לדוגמה 050-1234567)';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'כתובת אימייל אינה תקינה';
    }

    if (deliveryMethod !== 'pickup') {
      if (!address.trim() || address.trim().length < 4) {
        errors.address = 'נא להזין עיר, רחוב ומספר בית למשלוח';
      } else if (structuredAddress && (!structuredAddress.city || !structuredAddress.street || !structuredAddress.houseNumber)) {
        errors.address = 'נא להשלים עיר, רחוב ומספר בית מלאים';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    setCouponFeedback({ msg: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  const handleStandardCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setShowValidationErrors(true);

    const isValid = validateForm();
    if (!isValid) {
      setErrorMsg('אנא תקן את השדות המסומנים באדום לפני המעבר לתשלום');
      return;
    }

    const formattedItems = items.map((item) => ({
      coffeeItemId: item.coffeeItemId || item.id || 'custom-coffee',
      itemName: item.hebrewName || item.name || 'פריט קפה גורמה',
      quantity: item.quantity || 1,
      pricePerUnit: item.price || 0,
      shots: item.shots ?? 1,
      milkType: item.milkType || 'חלב רגיל',
    }));

    const finalAddress =
      deliveryMethod === 'pickup'
        ? 'איסוף עצמי מבית הקלייה הראשי (The Digital Roast Roastery Hub)'
        : address.trim();

    const validation = orderSchema.safeParse({
      fullName: fullName.trim(),
      email: email ? email.trim() : '',
      phone: phone.trim(),
      deliveryAddress: finalAddress || 'איסוף עצמי',
      items: formattedItems,
    });

    if (!validation.success) {
      setErrorMsg(validation.error.errors[0].message);
      return;
    }

    setShowPaymentSim(true);
  };

  const executeStandardCheckout = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const finalDeliveryAddress =
        deliveryMethod === 'pickup'
          ? 'איסוף עצמי מבית הקלייה הראשי (The Digital Roast Roastery Hub)'
          : address.trim();

      const orderPayload = {
        fullName: fullName.trim(),
        email: email ? email.trim() : '',
        phone: phone.trim(),
        deliveryAddress: finalDeliveryAddress,
        items: items.map((item) => ({
          coffeeItemId: item.coffeeItemId || item.id || 'custom-coffee',
          itemName: item.hebrewName || item.name || 'פריט קפה גורמה',
          quantity: item.quantity || 1,
          pricePerUnit: item.price || 0,
          shots: item.shots ?? 1,
          milkType: item.milkType || 'חלב רגיל',
        })),
      };

      const result = await createStandardOrder(orderPayload);

      if (result.success) {
        const orderData = {
          orderNumber: result.orderNumber,
          totalPrice: finalTotal || result.totalPrice,
          fullName: result.fullName,
          email: result.email,
          emailSent: result.emailSent,
          previewUrl: result.previewUrl,
          phone: result.phone,
          deliveryAddress: result.deliveryAddress,
          items: result.items,
          deliveryMethod,
          appliedCoupon: appliedCoupon?.code,
          orderNotes,
        };

        setCompletedOrder(orderData);
        setResendEmail(result.email || email);

        // Add to persistent user order history store
        useOrderStore.getState().addOrder({
          orderNumber: result.orderNumber || `DR-${Math.floor(100000 + Math.random() * 900000)}`,
          fullName: result.fullName || fullName || 'לקוח VIP',
          email: result.email || email || '',
          phone: result.phone || phone || '',
          deliveryAddress: result.deliveryAddress || finalDeliveryAddress,
          items: (result.items || []).map((i: any) => ({
            coffeeItemId: i.coffeeItemId || 'custom-item',
            itemName: i.itemName || 'פריט קפה',
            quantity: i.quantity || 1,
            pricePerUnit: i.pricePerUnit || 0,
            shots: i.shots || 1,
            milkType: i.milkType || 'חלב רגיל',
          })),
          totalPrice: finalTotal || result.totalPrice || 0,
          status: 'PENDING',
          createdAt: result.createdAt || new Date().toISOString(),
          paymentMethod: 'כרטיס אשראי מאובטח (Liquid Glass Pay)',
          trackingStep: 1,
        });

        clearCart();
      } else {
        setErrorMsg(result.error || 'שגיאה בביצוע ההזמנה');
      }
    } catch (err: any) {
      console.error('Order checkout error:', err);
      setErrorMsg(err?.message || 'אירעה שגיאה בעיבוד ההזמנה במערכת');
    } finally {
      setLoading(false);
      setShowPaymentSim(false);
    }
  };

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail || !completedOrder) return;

    setResending(true);
    setResendSuccessMsg('');
    setResendErrorMsg('');

    try {
      const res = await sendOrderEmailAction({
        orderNumber: completedOrder.orderNumber,
        fullName: completedOrder.fullName,
        email: resendEmail,
        phone: completedOrder.phone || phone,
        deliveryAddress: completedOrder.deliveryAddress,
        totalPrice: completedOrder.totalPrice,
        items: completedOrder.items || [],
      });

      if (res.success) {
        setResendSuccessMsg(`אישור ההזמנה נשלח בהצלחה ל-${resendEmail}!`);
        setCompletedOrder((prev: any) => ({
          ...prev,
          email: resendEmail,
          emailSent: true,
          previewUrl: res.previewUrl || prev?.previewUrl,
        }));
      } else {
        setResendErrorMsg(res.error || 'נכשלה שליחת המייל');
      }
    } catch (err) {
      setResendErrorMsg('שגיאה בתקשורת עם השרת');
    } finally {
      setResending(false);
    }
  };

  const handleCloseAndReset = () => {
    setCompletedOrder(null);
    setResendSuccessMsg('');
    setResendErrorMsg('');
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-md transition-all duration-300" dir="rtl">
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-lg liquid-glass border-r border-amber-500/30 p-5 flex flex-col justify-between shadow-2xl animate-slideInLeft overflow-y-auto max-h-screen">
          
          {/* Success Screen View */}
          {completedOrder ? (
            <div className="flex flex-col items-center justify-center text-center my-auto space-y-4 py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
                  הזמנה #{completedOrder.orderNumber}
                </span>
                <h3 className="text-xl font-black text-stone-100">ההזמנה נקלטה בהצלחה! ☕</h3>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  תודה {completedOrder.fullName}, הזמנתך נקלטה במערכת הקלייה ונשלחה לצוות הבראיסטה.
                </p>
              </div>

              {/* Email Delivery Badge & Live Preview Link */}
              {completedOrder.email && (
                <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-right text-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-amber-200 block">אישור הזמנה וקבלה במייל</span>
                      <span className="text-[11px] text-stone-300 truncate block dir-ltr text-right">
                        {completedOrder.emailSent ? 'נשלח ל-' : 'יישלח ל-'} {completedOrder.email}
                      </span>
                    </div>
                  </div>

                  {completedOrder.previewUrl && (
                    <a
                      href={completedOrder.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-300 font-bold text-xs transition-all border border-amber-500/40"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>פתח תצוגה מקדימה של המייל (Ethereal Preview)</span>
                    </a>
                  )}
                </div>
              )}

              {/* Order Info Card */}
              <div className="w-full bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 text-right space-y-2 text-xs">
                <div className="flex justify-between border-b border-stone-800/80 pb-2">
                  <span className="text-stone-400">אופן קבלת ההזמנה:</span>
                  <span className="text-amber-300 font-bold">
                    {completedOrder.deliveryMethod === 'express'
                      ? '⚡ שליח אקספרס תרמי תוך שעתיים'
                      : completedOrder.deliveryMethod === 'pickup'
                      ? '☕ איסוף עצמי מבית הקלייה'
                      : '🚚 משלוח סטנדרטי עד הבית'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-800/80 pb-2">
                  <span className="text-stone-400">כתובת:</span>
                  <span className="text-stone-200 font-bold truncate max-w-[200px]">
                    {completedOrder.deliveryAddress}
                  </span>
                </div>
                <div className="flex justify-between pt-0.5 items-center">
                  <span className="text-stone-400">סה"כ שולם (כולל מע"מ):</span>
                  <span className="text-amber-400 font-black text-base font-mono">
                    ₪{completedOrder.totalPrice}
                  </span>
                </div>
              </div>

              {/* Send Copy to Email Box */}
              <div className="w-full bg-stone-900/60 p-3 rounded-2xl border border-stone-800 space-y-2 text-right">
                <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>שליחת עותק נוסף של הקבלה למייל:</span>
                </label>

                <form onSubmit={handleResendEmail} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="הזן כתובת אימייל..."
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-right"
                    dir="ltr"
                  />
                  <button
                    type="submit"
                    disabled={resending}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-stone-950 font-bold text-xs transition-all flex items-center gap-1 disabled:opacity-50 flex-shrink-0"
                  >
                    {resending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>שלח</span>
                      </>
                    )}
                  </button>
                </form>

                {resendSuccessMsg && (
                  <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> {resendSuccessMsg}
                  </p>
                )}
                {resendErrorMsg && (
                  <p className="text-[11px] text-rose-400 font-bold">{resendErrorMsg}</p>
                )}
              </div>

              {/* Animated Thermal Receipt Launch Button */}
              <button
                onClick={() => setShowThermalReceipt(true)}
                className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/50 hover:border-amber-400 text-amber-300 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <ReceiptIcon className="w-4 h-4 text-amber-400" />
                <span>צפה בקבלה תרמית מונפשת (Thermal Receipt) ☕</span>
              </button>

              <div className="w-full grid grid-cols-2 gap-2">
                <Link
                  href="/orders"
                  onClick={handleCloseAndReset}
                  className="py-3 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md text-center"
                >
                  <History className="w-4 h-4" />
                  <span>היסטוריית הזמנות</span>
                </Link>

                <button
                  onClick={handleCloseAndReset}
                  className="py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-extrabold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>המשך בקניות</span>
                </button>
              </div>
            </div>
          ) : (
            /* Normal Cart Drawer View */
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
                <div className="flex items-center gap-2 text-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">עגלת הקניות שלך</h3>
                    <p className="text-[11px] text-stone-400">
                      {totalItemsCount > 0 ? `${totalItemsCount} פריטים נבחרו` : 'העגלה ריקה'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="px-2.5 py-1 rounded-lg bg-stone-900/80 hover:bg-rose-500/20 text-stone-400 hover:text-rose-300 text-[11px] font-bold transition-all border border-stone-800 hover:border-rose-500/40 flex items-center gap-1"
                      title="רוקן עגלה"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>רוקן</span>
                    </button>
                  )}

                  <button
                    onClick={closeCart}
                    className="p-1.5 rounded-xl bg-stone-900/60 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Free Shipping Progress Meter */}
              {items.length > 0 && deliveryMethod !== 'pickup' && (
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border border-amber-500/20 text-xs">
                  <div className="flex items-center justify-between mb-1 text-[11px]">
                    <span className="text-stone-300 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      {subtotal >= 150 ? (
                        <strong className="text-emerald-400">זכאי למשלוח חינם! 🚚✨</strong>
                      ) : (
                        <span>הוסף עוד <strong>₪{150 - subtotal}</strong> לקבלת משלוח חינם</span>
                      )}
                    </span>
                    <span className="font-mono text-[10px] text-amber-300 font-bold">
                      {Math.min(100, Math.round((subtotal / 150) * 100))}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-stone-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / 150) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Item List or Empty State */}
              {items.length === 0 ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-stone-200 font-bold text-sm">עגלת הקניות שלך ריקה</p>
                    <p className="text-stone-400 text-xs">
                      בחר משקאות או תערובות מותאמות אישית מהתפריט או הוסף מההמלצות למטה:
                    </p>
                  </div>

                  {/* Fast 1-Click Gourmet Recommendations */}
                  <div className="space-y-2 pt-2 text-right">
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1 px-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>המלצות הבריסטה להוספה מיידית:</span>
                    </div>

                    <div className="space-y-2">
                      {QUICK_RECOMMENDATIONS.map((rec) => (
                        <div
                          key={rec.coffeeItemId}
                          className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3 group"
                        >
                          <img
                            src={rec.imageUrl}
                            alt={rec.hebrewName}
                            className="w-10 h-10 rounded-lg object-cover border border-stone-700"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-xs text-stone-200 truncate">{rec.hebrewName}</h5>
                            <p className="text-[10px] text-stone-400">{rec.milkType}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addItem(rec)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-300 font-bold text-xs transition-all flex items-center gap-1 border border-amber-500/30 flex-shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                            <span>₪{rec.price}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[28vh] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/30 transition-all flex items-center gap-3"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.hebrewName}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-700 flex-shrink-0 shadow-sm"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-stone-100 truncate">{item.hebrewName}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-amber-400/90 mt-0.5">
                          <span>{item.shots} שוטים</span>
                          <span>•</span>
                          <span>{item.milkType}</span>
                          {item.grindType && (
                            <>
                              <span>•</span>
                              <span>{item.grindType}</span>
                            </>
                          )}
                        </div>
                        <span className="text-xs font-black text-amber-300 block mt-1 font-mono">
                          ₪{item.price * item.quantity}
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-stone-500 font-normal mr-1">
                              (₪{item.price} ליחידה)
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 bg-stone-950 rounded-lg p-0.5 border border-stone-800">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-stone-400 hover:text-stone-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold text-stone-200 px-1.5">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-stone-400 hover:text-stone-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-stone-500 hover:text-rose-400 p-0.5 transition-colors"
                          title="הסר"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Checkout Form & Live Validation Fields */}
              {items.length > 0 && (
                <form onSubmit={handleStandardCheckout} className="space-y-3 pt-3 border-t border-stone-800">
                  {errorMsg && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* 1. Delivery Method Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-stone-300">
                      שיטת משלוח וקבלה:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryMethod('standard');
                          setErrorMsg('');
                        }}
                        className={`p-2 rounded-xl border text-xs transition-all flex flex-col items-center gap-1 ${
                          deliveryMethod === 'standard'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-500/10'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        <span className="text-[11px]">משלוח רגיל</span>
                        <span className="text-[10px] font-mono opacity-80">
                          {subtotal >= 150 ? 'חינם' : '₪15'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryMethod('express');
                          setErrorMsg('');
                        }}
                        className={`p-2 rounded-xl border text-xs transition-all flex flex-col items-center gap-1 ${
                          deliveryMethod === 'express'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-500/10'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-[11px]">שליח אקספרס ⚡</span>
                        <span className="text-[10px] font-mono opacity-80">
                          {subtotal >= 150 ? 'חינם' : '₪25'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryMethod('pickup');
                          setErrorMsg('');
                        }}
                        className={`p-2 rounded-xl border text-xs transition-all flex flex-col items-center gap-1 ${
                          deliveryMethod === 'pickup'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-500/10'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <Store className="w-4 h-4" />
                        <span className="text-[11px]">איסוף עצמי</span>
                        <span className="text-[10px] font-mono text-emerald-400">חינם</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Customer Contact Details with Live Field Validation */}
                  <div className="space-y-2">
                    {/* Full Name */}
                    <div>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          required
                          placeholder="שם מלא למשלוח *"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (fieldErrors.fullName) {
                              setFieldErrors((prev) => ({ ...prev, fullName: '' }));
                            }
                          }}
                          className={`w-full px-3 py-2 pr-8 pl-8 rounded-xl bg-stone-950 border text-xs text-stone-100 placeholder-stone-500 focus:outline-none transition-all text-right ${
                            showValidationErrors && fieldErrors.fullName
                              ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                              : fullName.trim().length >= 2
                              ? 'border-emerald-500/60 focus:border-emerald-500'
                              : 'border-stone-800 focus:border-amber-500'
                          }`}
                          dir="rtl"
                        />
                        <User className="w-3.5 h-3.5 text-amber-500 absolute right-2.5 pointer-events-none" />
                        {fullName.trim().length >= 2 && (
                          <Check className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5" />
                        )}
                      </div>
                      {showValidationErrors && fieldErrors.fullName && (
                        <p className="text-[10px] text-rose-400 mt-0.5 mr-1 font-bold">
                          {fieldErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Phone */}
                      <div>
                        <div className="relative flex items-center">
                          <input
                            type="tel"
                            required
                            placeholder="טלפון נייד לתיאום *"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (fieldErrors.phone) {
                                setFieldErrors((prev) => ({ ...prev, phone: '' }));
                              }
                            }}
                            className={`w-full px-3 py-2 pr-8 pl-8 rounded-xl bg-stone-950 border text-xs text-stone-100 placeholder-stone-500 focus:outline-none transition-all text-right ${
                              showValidationErrors && fieldErrors.phone
                                ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                                : phone.replace(/\D/g, '').length >= 9
                                ? 'border-emerald-500/60 focus:border-emerald-500'
                                : 'border-stone-800 focus:border-amber-500'
                            }`}
                            dir="rtl"
                          />
                          <Phone className="w-3.5 h-3.5 text-amber-500 absolute right-2.5 pointer-events-none" />
                          {phone.replace(/\D/g, '').length >= 9 && (
                            <Check className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5" />
                          )}
                        </div>
                        {showValidationErrors && fieldErrors.phone && (
                          <p className="text-[10px] text-rose-400 mt-0.5 mr-1 font-bold">
                            {fieldErrors.phone}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <div className="relative flex items-center">
                          <input
                            type="email"
                            placeholder="אימייל לקבלה ואישור"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (fieldErrors.email) {
                                setFieldErrors((prev) => ({ ...prev, email: '' }));
                              }
                            }}
                            className={`w-full px-3 py-2 pr-8 pl-8 rounded-xl bg-stone-950 border text-xs text-stone-100 placeholder-stone-500 focus:outline-none transition-all text-right ${
                              showValidationErrors && fieldErrors.email
                                ? 'border-rose-500/80 focus:border-rose-500'
                                : email.includes('@') && email.includes('.')
                                ? 'border-emerald-500/60 focus:border-emerald-500'
                                : 'border-stone-800 focus:border-amber-500'
                            }`}
                            dir="rtl"
                          />
                          <Mail className="w-3.5 h-3.5 text-amber-500 absolute right-2.5 pointer-events-none" />
                          {email.includes('@') && email.includes('.') && (
                            <Check className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5" />
                          )}
                        </div>
                        {showValidationErrors && fieldErrors.email && (
                          <p className="text-[10px] text-rose-400 mt-0.5 mr-1 font-bold">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. Israel National Address Component */}
                  {deliveryMethod !== 'pickup' ? (
                    <div className="space-y-1.5 bg-stone-900/40 p-3 rounded-2xl border border-stone-800">
                      <IsraelAddressAutocomplete
                        value={address}
                        showValidationErrors={showValidationErrors}
                        onChange={(fullFormatted, structured) => {
                          setAddress(fullFormatted);
                          if (structured) {
                            setStructuredAddress(structured);
                          }
                          if (fieldErrors.address) {
                            setFieldErrors((prev) => ({ ...prev, address: '' }));
                          }
                        }}
                        placeholder="בחר עיר והקלד שם רחוב..."
                      />
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1 text-right">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Store className="w-4 h-4" />
                        <span>נקודת איסוף ראשית:</span>
                      </div>
                      <p className="text-stone-300 text-[11px]">
                        The Digital Roast Roastery Lab, שדרות רוטשילד 45, תל אביב-יפו
                      </p>
                      <p className="text-[10px] text-stone-400">
                        ההזמנה תהיה מוכנה לאיסוף תוך 20 דקות מרגע האישור.
                      </p>
                    </div>
                  )}

                  {/* 4. Barista / Roaster Notes */}
                  <div>
                    <input
                      type="text"
                      placeholder="הערות מיוחדות לבראיסטה (דרגת טחינה, הוראות מסירה)..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-right"
                      dir="rtl"
                    />
                  </div>

                  {/* 5. Promo Code / Coupon Engine */}
                  <div className="space-y-1.5">
                    {appliedCoupon ? (
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center justify-between text-emerald-300">
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-bold font-mono">{appliedCoupon.code}</span>
                          <span className="text-[11px] text-emerald-400/80">({appliedCoupon.description})</span>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-stone-950 transition-colors"
                        >
                          הסר
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="קוד קופון (למשל ROAST10 / FREESHIP)"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 uppercase font-mono text-right"
                            dir="ltr"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-stone-950 font-bold text-xs transition-all flex items-center gap-1"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span>החל</span>
                          </button>
                        </div>
                        {couponFeedback && (
                          <p
                            className={`text-[10px] mt-1 font-bold ${
                              couponFeedback.isError ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {couponFeedback.msg}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 6. Dynamic Pricing Summary */}
                  <div className="p-3 rounded-2xl bg-stone-950/90 border border-stone-800 space-y-1.5 text-xs text-right">
                    <div className="flex justify-between text-stone-400">
                      <span>סכום ביניים:</span>
                      <span className="font-mono">₪{subtotal}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>הנחת קופון ({appliedCoupon?.code}):</span>
                        <span className="font-mono">-₪{discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-stone-400">
                      <span>דמי משלוח:</span>
                      <span className="font-mono">
                        {deliveryCost === 0 ? (
                          <strong className="text-emerald-400 font-normal">חינם</strong>
                        ) : (
                          `₪${deliveryCost}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-[10px] text-stone-500 border-t border-stone-800/80 pt-1">
                      <span>מתוכו מע"מ 18%:</span>
                      <span className="font-mono">₪{vatAmount}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-800 pt-1.5 text-sm">
                      <span className="text-stone-200 font-bold">סה"כ לתשלום:</span>
                      <span className="text-2xl font-black text-gold-gradient font-mono">
                        ₪{finalTotal}
                      </span>
                    </div>
                  </div>

                  {/* Submit Order Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-black text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-[0.99]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>מעבד הזמנה מאובטחת...</span>
                      </>
                    ) : (
                      <>
                        <PackageCheck className="w-4 h-4" />
                        <span>המשך לתשלום מאובטח (₪{finalTotal})</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3D Credit Card Payment Simulation */}
      {showPaymentSim && (
        <ThreeDCardPayment
          amount={finalTotal}
          fullName={fullName}
          phone={phone}
          address={address || 'איסוף עצמי מבית הקלייה'}
          onPaymentComplete={executeStandardCheckout}
          onCancel={() => setShowPaymentSim(false)}
        />
      )}

      {/* Live Animated Thermal Receipt Modal */}
      {completedOrder && (
        <ThermalReceiptModal
          isOpen={showThermalReceipt}
          onClose={() => setShowThermalReceipt(false)}
          receiptData={{
            orderNumber: completedOrder.orderNumber,
            customerName: completedOrder.fullName,
            customerPhone: phone || '054-0000000',
            items: completedOrder.items?.map((it: any) => ({
              name: it.name || it.itemName,
              detail: it.roastLevel
                ? `קלייה: ${it.roastLevel} • ${it.grindType || 'פולים שלמים'}`
                : `${it.shots || 1} שוטים • ${it.milkType || 'רגיל'}`,
              quantity: it.quantity || 1,
              price: it.price || it.pricePerUnit || 0,
            })) || [
              { name: 'הזמנת קפה גורמה The Digital Roast', quantity: 1, price: completedOrder.totalPrice },
            ],
            subtotal: completedOrder.totalPrice,
            totalAmount: completedOrder.totalPrice,
            paymentMethod: 'כרטיס אשראי / Liquid Glass Pay',
            cardLastDigits: '9012',
          }}
        />
      )}
    </div>
  );
};
