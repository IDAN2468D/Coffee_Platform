'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Printer,
  Sparkles,
  Coffee,
  Search,
  Filter,
  Calendar,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronUp,
  Star,
  ExternalLink,
  MessageSquare,
  Flame,
  Award,
  RefreshCw,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Copy,
  Cloud,
  Loader2,
} from 'lucide-react';
import { useOrderStore, UserOrderRecord, OrderItemDetail } from '@/lib/store/useOrderStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { coffeeSound } from '@/lib/audio/coffeeSounds';
import { TiltGlassCard } from '@/components/TiltGlassCard';
import { OrderInvoiceModal } from '@/components/OrderInvoiceModal';
import { getUserOrdersAction } from '@/app/actions/orderActions';
import { GoogleDriveSyncButton } from '@/components/GoogleDriveSyncButton';
import { bulkSyncAllOrdersAction } from '@/app/actions/driveActions';

export const OrderHistoryView: React.FC = () => {
  const {
    orders,
    activeFilter,
    searchQuery,
    selectedOrderForInvoice,
    addOrder,
    setOrders,
    updateOrderDriveSync,
    rateOrder,
    setActiveFilter,
    setSearchQuery,
    setSelectedOrderForInvoice,
    getTotalSpent,
    getTotalOrdersCount,
  } = useOrderStore();

  const { addItem, openCart } = useCartStore();
  const { user } = useAuthStore();

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState<string>('');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBulkSyncing, setIsBulkSyncing] = useState(false);
  const [bulkSyncResultMsg, setBulkSyncResultMsg] = useState<string | null>(null);
  const [ratingOrderNum, setRatingOrderNum] = useState<string | null>(null);
  const [tempRating, setTempRating] = useState<number>(5);
  const [tempNotes, setTempNotes] = useState<string>('');

  // Initial fetch from MongoDB on mount if user is logged in
  useEffect(() => {
    const fetchMongoOrders = async () => {
      if (user?.email || user?.phone) {
        try {
          const res = await getUserOrdersAction(user.email, user.phone);
          if (res.success && res.orders.length > 0) {
            // Merge with existing orders in store
            res.orders.forEach((o: any) => {
              addOrder({
                orderNumber: o.orderNumber,
                fullName: o.fullName,
                email: o.email,
                phone: o.phone,
                deliveryAddress: o.deliveryAddress,
                items: o.items,
                totalPrice: o.totalPrice,
                status: o.status,
                createdAt: o.createdAt,
                paymentMethod: 'כרטיס אשראי מאובטח',
                driveReceiptId: o.driveReceiptId,
                driveReceiptUrl: o.driveReceiptUrl,
                trackingStep:
                  o.status === 'COMPLETED'
                    ? 4
                    : o.status === 'OUT_FOR_DELIVERY'
                    ? 3
                    : o.status === 'BREWING'
                    ? 2
                    : 1,
              });
            });
          }
        } catch (e) {
          // ignore error and rely on local store
        }
      }
    };
    fetchMongoOrders();
  }, [user?.email, user?.phone]);

  const handleRefresh = async () => {
    coffeeSound.playBaristaClick();
    setIsRefreshing(true);
    try {
      const res = await getUserOrdersAction(user?.email, user?.phone);
      if (res.success && res.orders.length > 0) {
        res.orders.forEach((o: any) => {
          addOrder({
            orderNumber: o.orderNumber,
            fullName: o.fullName,
            email: o.email,
            phone: o.phone,
            deliveryAddress: o.deliveryAddress,
            items: o.items,
            totalPrice: o.totalPrice,
            status: o.status,
            createdAt: o.createdAt,
            paymentMethod: 'כרטיס אשראי מאובטח',
            driveReceiptId: o.driveReceiptId,
            driveReceiptUrl: o.driveReceiptUrl,
            trackingStep:
              o.status === 'COMPLETED'
                ? 4
                : o.status === 'OUT_FOR_DELIVERY'
                ? 3
                : o.status === 'BREWING'
                ? 2
                : 1,
          });
        });
      }
    } catch (e) {
      // ignore
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Bulk sync all orders to Google Drive
  const handleBulkSyncAll = async () => {
    if (isBulkSyncing || orders.length === 0) return;
    coffeeSound.playBaristaClick();
    setIsBulkSyncing(true);
    setBulkSyncResultMsg(null);

    try {
      const ordersPayload = orders.map((o) => ({
        orderNumber: o.orderNumber,
        fullName: o.fullName,
        email: o.email,
        phone: o.phone,
        deliveryAddress: o.deliveryAddress,
        items: o.items.map((i) => ({
          itemName: i.itemName,
          quantity: i.quantity,
          pricePerUnit: i.pricePerUnit,
          shots: i.shots,
          milkType: i.milkType,
          origin: i.origin,
        })),
        totalPrice: o.totalPrice,
        createdAt: o.createdAt,
        paymentMethod: o.paymentMethod,
        status: o.status,
      }));

      const res = await bulkSyncAllOrdersAction(ordersPayload);

      if (res.success) {
        // Update local store for all synced orders
        res.results.forEach((item) => {
          if (item.result.success && item.result.fileId && item.result.webViewLink) {
            updateOrderDriveSync(item.orderNumber, item.result.fileId, item.result.webViewLink);
          }
        });
        setBulkSyncResultMsg(res.message);
      } else {
        setBulkSyncResultMsg(res.message || 'שגיאה בביצוע סנכרון גורף');
      }
    } catch (err: any) {
      console.error('Bulk Drive sync error:', err);
      setBulkSyncResultMsg('אירעה שגיאה בביצוע הסנכרון ל-Google Drive');
    } finally {
      setIsBulkSyncing(false);
    }
  };

  // Re-Order Handler: Pushes all items of this order into the cart & opens the cart drawer
  const handleReorder = (order: UserOrderRecord) => {
    coffeeSound.playPourSound();
    order.items.forEach((item) => {
      addItem({
        coffeeItemId: item.coffeeItemId || `reorder-${Date.now()}`,
        name: item.itemName,
        hebrewName: item.itemName,
        price: item.pricePerUnit,
        shots: item.shots || 1,
        milkType: item.milkType || 'חלב רגיל',
        imageUrl:
          item.imageUrl ||
          'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
      });
    });

    setReorderSuccessMsg(`ההזמנה #${order.orderNumber} הועתקה לעגלת הקניות בהצלחה!`);
    openCart();

    setTimeout(() => {
      setReorderSuccessMsg('');
    }, 4000);
  };

  const handleCopyOrderNumber = (orderNum: string) => {
    coffeeSound.playBaristaClick();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(orderNum);
      setCopiedOrderId(orderNum);
      setTimeout(() => setCopiedOrderId(null), 2000);
    }
  };

  const toggleExpand = (orderId: string) => {
    coffeeSound.playBaristaClick();
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleOpenRating = (order: UserOrderRecord) => {
    coffeeSound.playBaristaClick();
    setRatingOrderNum(order.orderNumber);
    setTempRating(order.rating || 5);
    setTempNotes(order.reviewNotes || '');
  };

  const handleSaveRating = (orderNum: string) => {
    coffeeSound.playBeanCrunch();
    rateOrder(orderNum, tempRating, tempNotes);
    setRatingOrderNum(null);
  };

  // Filter and search logic
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === 'ALL'
        ? true
        : activeFilter === 'ACTIVE'
        ? order.status === 'PENDING' || order.status === 'BREWING' || order.status === 'OUT_FOR_DELIVERY'
        : activeFilter === 'COMPLETED'
        ? order.status === 'COMPLETED'
        : activeFilter === 'CANCELLED'
        ? order.status === 'CANCELLED'
        : true;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.deliveryAddress.toLowerCase().includes(query) ||
      order.items.some((item) => item.itemName.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const totalSpent = getTotalSpent();
  const totalOrders = getTotalOrdersCount();
  const roastCoinsEarned = Math.round(totalSpent * 10);
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'BREWING' || o.status === 'OUT_FOR_DELIVERY'
  ).length;

  const getStatusBadge = (status: UserOrderRecord['status']) => {
    switch (status) {
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            <Truck className="w-3.5 h-3.5" />
            <span>שליח בדרך אליך 🛵</span>
          </span>
        );
      case 'BREWING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Coffee className="w-3.5 h-3.5 animate-spin-slow" />
            <span>בחליטה וקלייה טרייה</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <Clock className="w-3.5 h-3.5" />
            <span>ההזמנה נקלטה במערכת</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>נמסרה בהצלחה</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <span>בוטלה</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 dir-rtl text-right">
      
      {/* Toast feedback banner */}
      {reorderSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-sm font-extrabold flex items-center justify-between shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{reorderSuccessMsg}</span>
          </div>
          <button
            onClick={() => openCart()}
            className="px-3 py-1 rounded-xl bg-emerald-500 text-black font-black text-xs hover:bg-emerald-400 transition-all"
          >
            צפה בעגלה
          </button>
        </div>
      )}

      {/* METRICS & TELEMETRY SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Orders */}
        <TiltGlassCard maxTiltDeg={6} className="bg-stone-900/70 border-amber-500/20 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-stone-400">סה״כ הזמנות</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-100 font-mono">
            {totalOrders}
          </div>
          <div className="text-[11px] text-amber-400/80 font-medium mt-1">
            {activeOrdersCount > 0 ? `● ${activeOrdersCount} בהכנה ומשלוח כעת` : 'כל ההזמנות הושלמו'}
          </div>
        </TiltGlassCard>

        {/* Card 2: Total Spent in ILS */}
        <TiltGlassCard maxTiltDeg={6} className="bg-stone-900/70 border-amber-500/20 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-stone-400">סך הוצאות כולל</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ₪{totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 font-medium mt-1">
            כולל מע״מ ומשלוח VIP חינם
          </div>
        </TiltGlassCard>

        {/* Card 3: RoastCoins Club Points */}
        <TiltGlassCard maxTiltDeg={6} className="bg-stone-900/70 border-amber-500/20 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-stone-400">נקודות RoastCoins</span>
            <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center border border-yellow-500/30">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-yellow-400 font-mono">
            {roastCoinsEarned.toLocaleString()}
          </div>
          <div className="text-[11px] text-yellow-400/80 font-medium mt-1">
            מעמד VIP: Gold Barista
          </div>
        </TiltGlassCard>

        {/* Card 4: Top Roast Choice */}
        <TiltGlassCard maxTiltDeg={6} className="bg-stone-900/70 border-amber-500/20 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-stone-400">הזן המועדף עליך</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm sm:text-base font-black text-stone-100 truncate" title="Ethiopia Yirgacheffe">
            אתיופיה ירגשף היירלום
          </div>
          <div className="text-[11px] text-cyan-300/80 font-medium mt-1">
            חומציות הדרים • פרחי יסמין
          </div>
        </TiltGlassCard>

      </div>

      {/* GOOGLE DRIVE RECEIPTS CLOUD BACKUP BANNER */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-stone-950/80 to-amber-950/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
              <Cloud className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-stone-100">
                  גיבוי וסנכרון קבלות ל-Google Drive
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {orders.filter((o) => Boolean(o.driveReceiptUrl)).length} מתוך {orders.length} מסונכרנות
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                כל קבלה נשמרת אוטומטית כמסמך דיגיטלי ממוחשב ב-Google Drive עם פירוט פולים, חישוב מע״מ ואימות מסחר.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkSyncAll}
              disabled={isBulkSyncing || orders.length === 0}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-60 shrink-0"
            >
              {isBulkSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Cloud className="w-4 h-4 text-emerald-200" />
              )}
              <span>{isBulkSyncing ? 'מבצע סנכרון גורף...' : 'סנכרן את כל הקבלות (Bulk Sync)'}</span>
            </button>
          </div>
        </div>

        {/* Bulk Sync Feedback Banner */}
        {bulkSyncResultMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{bulkSyncResultMsg}</span>
            </div>
            <button
              onClick={() => setBulkSyncResultMsg(null)}
              className="text-stone-400 hover:text-stone-100 text-xs px-2"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* FILTER TABS & SEARCH BAR CONTROLS */}
      <div className="liquid-glass rounded-3xl p-4 sm:p-5 border border-amber-500/30 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                setActiveFilter('ALL');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              כל ההזמנות ({orders.length})
            </button>

            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                setActiveFilter('ACTIVE');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeFilter === 'ACTIVE'
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>פעילות ומשלוחים ({activeOrdersCount})</span>
            </button>

            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                setActiveFilter('COMPLETED');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeFilter === 'COMPLETED'
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>הושלמו בהצלחה</span>
            </button>
          </div>

          {/* Search Input & Refresh from MongoDB Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="חפש לפי מס׳ הזמנה, פול קפה או כתובת..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-2 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-500 text-xs focus:outline-none focus:border-amber-500 text-right"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={handleRefresh}
              className={`p-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-500/50 transition-all ${
                isRefreshing ? 'animate-spin text-amber-400' : ''
              }`}
              title="רענן מול מסד הנתונים"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ORDERS LIST */}
      {filteredOrders.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-12 border border-stone-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Coffee className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-stone-200">לא נמצאו הזמנות תואמות לחיפוש</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            נסה לשנות את מילות החיפוש או הסינון, או פתח את קטלוג הגורמה והזמן כוס קפה טרייה.
          </p>
          <Link
            href="/shop"
            onClick={() => coffeeSound.playBaristaClick()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>מעבר לקטלוג הקפה</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.orderNumber;
            const orderDate = new Date(order.createdAt).toLocaleDateString('he-IL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            const isActiveOrder =
              order.status === 'PENDING' ||
              order.status === 'BREWING' ||
              order.status === 'OUT_FOR_DELIVERY';

            return (
              <div
                key={order.orderNumber}
                className="liquid-glass rounded-3xl border border-amber-500/25 overflow-hidden transition-all duration-300 hover:border-amber-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
              >
                {/* Order Header Summary Bar */}
                <div className="p-5 sm:p-6 bg-stone-950/60 border-b border-stone-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-black text-sm shrink-0">
                      <Coffee className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg text-stone-100">
                          #{order.orderNumber}
                        </span>
                        <button
                          onClick={() => handleCopyOrderNumber(order.orderNumber)}
                          className="p-1 rounded-lg text-stone-500 hover:text-amber-300 transition-colors"
                          title="העתק מספר הזמנה"
                        >
                          {copiedOrderId === order.orderNumber ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {getStatusBadge(order.status)}
                        <GoogleDriveSyncButton order={order} variant="badge" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{orderDate}</span>
                        <span>•</span>
                        <span>{order.items.reduce((s, i) => s + i.quantity, 0)} פריטים</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Primary Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-800">
                    <div className="text-right">
                      <div className="text-xs text-stone-400">סה״כ לתשלום</div>
                      <div className="text-xl font-black text-amber-400 font-mono">
                        ₪{order.totalPrice.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* 1-Click Re-Order Button */}
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95"
                        title="הזמן מחדש את כל הפריטים בהזמנה זו"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">הזמן שוב</span>
                      </button>

                      {/* Invoice Modal Trigger */}
                      <button
                        onClick={() => {
                          coffeeSound.playBaristaClick();
                          setSelectedOrderForInvoice(order);
                        }}
                        className="p-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-500/40 transition-all"
                        title="צפה בחשבונית וקבלה דיגיטלית"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* Expand Details Trigger */}
                      <button
                        onClick={() => toggleExpand(order.orderNumber)}
                        className="p-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-500/40 transition-all"
                        title={isExpanded ? 'צמצם פירוט' : 'הרחב פירוט'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                </div>

                {/* LIVE TRACKING TIMELINE (Shown on active orders or when expanded) */}
                {isActiveOrder && (
                  <div className="p-5 sm:p-6 bg-stone-900/40 border-b border-stone-800/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                        <Truck className="w-4 h-4 animate-bounce" />
                        <span>סטטוס משלוח פעיל בלייב</span>
                      </div>
                      {order.estimatedDelivery && (
                        <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                          <span>{order.estimatedDelivery}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar Steps */}
                    <div className="grid grid-cols-4 gap-2 text-center relative pt-2">
                      {/* Step 1: Received */}
                      <div className="space-y-1.5 relative z-10">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 text-black font-black mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <Check className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-stone-200 block">נקלטה</span>
                      </div>

                      {/* Step 2: Brewing */}
                      <div className="space-y-1.5 relative z-10">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black mx-auto flex items-center justify-center shadow-lg transition-all ${
                            (order.trackingStep || 1) >= 2
                              ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                              : 'bg-stone-800 text-stone-500 border border-stone-700'
                          }`}
                        >
                          <Coffee className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[11px] font-bold block ${
                            (order.trackingStep || 1) >= 2 ? 'text-stone-200' : 'text-stone-500'
                          }`}
                        >
                          בחליטה וקלייה
                        </span>
                      </div>

                      {/* Step 3: Out for Delivery */}
                      <div className="space-y-1.5 relative z-10">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black mx-auto flex items-center justify-center shadow-lg transition-all ${
                            (order.trackingStep || 1) >= 3
                              ? 'bg-amber-500 text-black shadow-amber-500/40 ring-4 ring-amber-500/20'
                              : 'bg-stone-800 text-stone-500 border border-stone-700'
                          }`}
                        >
                          <Truck className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[11px] font-bold block ${
                            (order.trackingStep || 1) >= 3 ? 'text-amber-300' : 'text-stone-500'
                          }`}
                        >
                          שליח בדרך
                        </span>
                      </div>

                      {/* Step 4: Delivered */}
                      <div className="space-y-1.5 relative z-10">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black mx-auto flex items-center justify-center shadow-lg transition-all ${
                            (order.trackingStep || 1) >= 4
                              ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                              : 'bg-stone-800 text-stone-500 border border-stone-700'
                          }`}
                        >
                          <Package className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[11px] font-bold block ${
                            (order.trackingStep || 1) >= 4 ? 'text-stone-200' : 'text-stone-500'
                          }`}
                        >
                          נמסרה
                        </span>
                      </div>

                      {/* Progress Line */}
                      <div className="absolute top-5 sm:top-6 left-[12%] right-[12%] h-1 bg-stone-800 -z-0">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-400 transition-all duration-700"
                          style={{
                            width: `${
                              ((order.trackingStep || 1) - 1) * 33.33 +
                              ((order.trackingStep || 1) === 3 ? 15 : 0)
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ITEM BREAKDOWN LIST */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-900/50 border border-stone-800/80 hover:border-amber-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-950 border border-amber-500/30 shrink-0 shadow-md">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.itemName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-amber-400">
                                <Coffee className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="font-extrabold text-sm text-stone-100">
                              {item.itemName}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-400">
                              <span className="font-mono font-bold text-amber-300">
                                כמות: {item.quantity}
                              </span>
                              {(item.shots || item.milkType) && (
                                <>
                                  <span>•</span>
                                  <span>{item.shots ? `${item.shots} שוטים` : ''}</span>
                                  <span>{item.milkType ? `(${item.milkType})` : ''}</span>
                                </>
                              )}
                              {item.origin && (
                                <>
                                  <span>•</span>
                                  <span className="text-cyan-300">טרואר: {item.origin}</span>
                                </>
                              )}
                            </div>

                            {item.flavorNotes && item.flavorNotes.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.flavorNotes.map((note, nIdx) => (
                                  <span
                                    key={nIdx}
                                    className="text-[9px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium"
                                  >
                                    {note}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-left sm:text-left font-mono font-black text-sm text-amber-400 self-end sm:self-center">
                          ₪{(item.quantity * item.pricePerUnit).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* EXPANDABLE EXTRA DETAILS: DELIVERY ADDRESS, RATING & SUPPORT */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-stone-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-fadeIn">
                      {/* Delivery Address & Customer Info */}
                      <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                        <div className="font-bold text-amber-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>כתובת ופרטי אספקה:</span>
                        </div>
                        <div className="text-stone-300 font-medium">{order.deliveryAddress}</div>
                        <div className="text-stone-400 text-[11px]">
                          נמסר ל: {order.fullName} • טלפון: {order.phone}
                        </div>
                        <div className="text-stone-400 text-[11px] flex items-center gap-1 pt-1">
                          <CreditCard className="w-3 h-3 text-stone-500" />
                          <span>אמצעי תשלום: {order.paymentMethod || 'כרטיס אשראי'}</span>
                        </div>
                      </div>

                      {/* Tasting Rating & Feedback */}
                      <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-amber-400 flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5" />
                            <span>דירוג חוויית הקפה:</span>
                          </div>
                          {order.rating && (
                            <div className="flex items-center gap-1 text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < (order.rating || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-stone-600'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {order.reviewNotes ? (
                          <div className="text-stone-300 text-[11px] italic bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                            "{order.reviewNotes}"
                          </div>
                        ) : (
                          <p className="text-stone-500 text-[11px]">
                            טרם הוספת הערת טעימה להזמנה זו.
                          </p>
                        )}

                        <button
                          onClick={() => handleOpenRating(order)}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
                        >
                          <span>{order.rating ? 'ערוך דירוג והערות' : 'דרג את הקפה כעת'}</span>
                        </button>
                      </div>

                      {/* WhatsApp Barista Query Button */}
                      <div className="md:col-span-2 pt-2 flex flex-wrap items-center justify-between gap-3">
                        <a
                          href={`https://wa.me/972501234567?text=${encodeURIComponent(
                            `שלום בריסטה דיגיטלי, ברצוני לברר בנוגע להזמנה #${order.orderNumber}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold text-xs transition-all flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>פנה לתמיכת בריסטה ב-WhatsApp</span>
                        </a>

                        <button
                          onClick={() => {
                            coffeeSound.playBaristaClick();
                            setSelectedOrderForInvoice(order);
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black font-bold text-xs transition-all flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>הפק חשבונית מס דיגיטלית</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Inline Rating Modal / Form */}
                {ratingOrderNum === order.orderNumber && (
                  <div className="p-5 bg-stone-900 border-t border-amber-500/30 space-y-3 animate-fadeIn">
                    <div className="font-extrabold text-sm text-stone-100 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>דירוג הזמנה #{order.orderNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400">ציון איכות:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setTempRating(star)}
                            className="p-1 text-yellow-400 hover:scale-125 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= tempRating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-stone-700'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="הוסף הערות על הארומה, מיצוי הטעמים, הקרמה או שירות המשלוח..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500 text-right"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setRatingOrderNum(null)}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                      >
                        ביטול
                      </button>
                      <button
                        onClick={() => handleSaveRating(order.orderNumber)}
                        className="px-4 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-black hover:bg-amber-400 transition-all"
                      >
                        שמור דירוג
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* RENDER INVOICE MODAL */}
      <OrderInvoiceModal
        order={selectedOrderForInvoice}
        isOpen={!!selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
      />

    </div>
  );
};
