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
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { createStandardOrder, sendOrderEmailAction } from '@/app/actions/orderActions';
import { orderSchema } from '@/lib/validations/auth';
import { ThreeDCardPayment } from './ThreeDCardPayment';
import { ThermalReceiptModal } from './ThermalReceiptModal';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice, clearCart } =
    useCartStore();
  const { user } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
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

  const totalPrice = getTotalPrice();

  const handleStandardCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const formattedItems = items.map((item) => ({
      coffeeItemId: item.coffeeItemId || item.id || 'custom-coffee',
      itemName: item.hebrewName || item.name || 'פריט קפה גורמה',
      quantity: item.quantity || 1,
      pricePerUnit: item.price || 0,
      shots: item.shots ?? 1,
      milkType: item.milkType || 'חלב רגיל',
    }));

    const validation = orderSchema.safeParse({
      fullName: fullName.trim(),
      email: email ? email.trim() : '',
      phone: phone.trim(),
      deliveryAddress: address.trim(),
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
      const orderPayload = {
        fullName: fullName.trim(),
        email: email ? email.trim() : '',
        phone: phone.trim(),
        deliveryAddress: address.trim(),
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
          totalPrice: result.totalPrice,
          fullName: result.fullName,
          email: result.email,
          emailSent: result.emailSent,
          previewUrl: result.previewUrl,
          phone: result.phone,
          deliveryAddress: result.deliveryAddress,
          items: result.items,
        };

        setCompletedOrder(orderData);
        setResendEmail(result.email || email);

        // Add to persistent user order history store
        useOrderStore.getState().addOrder({
          orderNumber: result.orderNumber || `DR-${Math.floor(100000 + Math.random() * 900000)}`,
          fullName: result.fullName || fullName || 'לקוח VIP',
          email: result.email || email || '',
          phone: result.phone || phone || '',
          deliveryAddress: result.deliveryAddress || address || 'משלוח אקספרס',
          items: (result.items || []).map((i: any) => ({
            coffeeItemId: i.coffeeItemId || 'custom-item',
            itemName: i.itemName || 'פריט קפה',
            quantity: i.quantity || 1,
            pricePerUnit: i.pricePerUnit || 0,
            shots: i.shots || 1,
            milkType: i.milkType || 'חלב רגיל',
          })),
          totalPrice: result.totalPrice || 0,
          status: 'PENDING',
          createdAt: result.createdAt || new Date().toISOString(),
          paymentMethod: 'כרטיס אשראי מאובטח',
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-md">
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md liquid-glass border-r border-amber-500/30 p-6 flex flex-col justify-between shadow-2xl animate-slideInLeft">
          
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
                <h3 className="text-xl font-black text-stone-100">ההזמנה התקבלה בהצלחה!</h3>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  תודה {completedOrder.fullName}, הזמנתך נקלטה במערכת ונשלחה לצוות הבראיסטה.
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
                      <span>פתח תצוגה מקדימה של המייל שנשלח (Ethereal Preview)</span>
                    </a>
                  )}
                </div>
              )}

              {/* Order Info Card */}
              <div className="w-full bg-stone-950/80 p-3 rounded-2xl border border-stone-800 text-right space-y-1.5 text-xs">
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-400">כתובת למשלוח:</span>
                  <span className="text-stone-200 font-bold">{completedOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-stone-400">סה"כ שולם:</span>
                  <span className="text-amber-400 font-black text-sm">₪{completedOrder.totalPrice}</span>
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
            <>
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800">
                  <div className="flex items-center gap-2 text-stone-100">
                    <ShoppingBag className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-lg">עגלת הקניות שלך</h3>
                  </div>
                  <button
                    onClick={closeCart}
                    className="p-2 rounded-xl bg-stone-900/60 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Item List */}
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-stone-300 font-bold text-sm">עגלת הקניות שלך ריקה</p>
                    <p className="text-stone-500 text-xs">בחר משקאות או תערובות בתפריט כדי להוסיף</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center gap-3"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.hebrewName}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-700 flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-stone-100 truncate">{item.hebrewName}</h4>
                          <p className="text-[10px] text-amber-400 mt-0.5">
                            {item.shots} שוטים | {item.milkType}
                          </p>
                          <span className="text-xs font-black text-amber-300 block mt-0.5">
                            ₪{item.price * item.quantity}
                          </span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1 bg-stone-950 rounded-lg p-1 border border-stone-800">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 text-stone-400 hover:text-stone-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-bold text-stone-200 px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 text-stone-400 hover:text-stone-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-stone-500 hover:text-rose-400 p-0.5"
                            title="הסר"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Standard Checkout Form */}
              {items.length > 0 && (
                <form onSubmit={handleStandardCheckout} className="space-y-2.5 pt-3 border-t border-stone-800">
                  {errorMsg && (
                    <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="שם מלא למשלוח *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-right"
                      dir="rtl"
                    />
                    <input
                      type="email"
                      placeholder="כתובת אימייל לקבלת אישור הזמנה וקבלה"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-right"
                      dir="rtl"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="מספר טלפון לתיאום (למשל 050-1234567) *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-right"
                      dir="rtl"
                    />
                    <input
                      type="text"
                      required
                      placeholder="כתובת מלאה למשלוח *"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-right"
                      dir="rtl"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-stone-400 font-bold">סה"כ לתשלום:</span>
                    <span className="text-2xl font-black text-gold-gradient">₪{totalPrice}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-extrabold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>מבצע הזמנה ושולח קבלה למייל...</span>
                      </>
                    ) : (
                      <>
                        <PackageCheck className="w-4 h-4" />
                        <span>אישור וביצוע הזמנה</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      {showPaymentSim && (
        <ThreeDCardPayment
          amount={totalPrice}
          fullName={fullName}
          phone={phone}
          address={address}
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
              name: it.name,
              detail: it.roastLevel ? `קלייה: ${it.roastLevel} • ${it.grindType || 'פולים שלמים'}` : undefined,
              quantity: it.quantity || 1,
              price: it.price || 0,
            })) || [
              { name: 'הזמנת קפה גורמה The Digital Roast', quantity: 1, price: completedOrder.totalPrice },
            ],
            subtotal: completedOrder.totalPrice,
            totalAmount: completedOrder.totalPrice,
            paymentMethod: 'כרטיס אשראי / Digital Roast Pay',
            cardLastDigits: '9012',
          }}
        />
      )}
    </div>
  );
};

