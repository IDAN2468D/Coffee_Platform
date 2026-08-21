import { create } from 'zustand';

export interface CartItem {
  id: string;
  coffeeItemId: string;
  name: string;
  hebrewName: string;
  price: number;
  quantity: number;
  shots: number;
  milkType: string;
  imageUrl: string;
  grindType?: string;
  notes?: string;
}

export type DeliveryMethod = 'express' | 'standard' | 'pickup';

export interface AppliedCoupon {
  code: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  freeShipping?: boolean;
}

const VALID_COUPONS: Record<string, AppliedCoupon> = {
  ROAST10: {
    code: 'ROAST10',
    description: '10% הנחת היכרות על כל הסל',
    discountPercent: 10,
  },
  VIPROAST: {
    code: 'VIPROAST',
    description: '15% הנחת מועדון הבראיסטה VIP',
    discountPercent: 15,
  },
  BARISTA20: {
    code: 'BARISTA20',
    description: '₪20 הנחה על הזמנות מעל ₪80',
    discountAmount: 20,
  },
  FREESHIP: {
    code: 'FREESHIP',
    description: 'משלוח אקספרס חינם ללא מינימום',
    freeShipping: true,
  },
  SPECIALTY: {
    code: 'SPECIALTY',
    description: '12% הנחה לחובבי Specialty Coffee',
    discountPercent: 12,
  },
};

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  deliveryMethod: DeliveryMethod;
  appliedCoupon: AppliedCoupon | null;
  orderNotes: string;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setOrderNotes: (notes: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDeliveryCost: () => number;
  getDiscountAmount: () => number;
  getTotalPrice: () => number;
  getFinalTotalPrice: () => number;
  getVatAmount: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  deliveryMethod: 'standard',
  appliedCoupon: null,
  orderNotes: '',

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (itemData) => {
    // Haptic vibration feedback on mobile/haptic supported devices
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate([30, 50, 30]);
      } catch (e) {
        // ignore
      }
    }

    const id = `${itemData.coffeeItemId}-${itemData.shots || 1}-${itemData.milkType || 'רגיל'}`;
    const existing = get().items.find((i) => i.id === id);
    const addedQty = itemData.quantity || 1;

    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + addedQty } : i
        ),
        isOpen: true,
      });
    } else {
      set({
        items: [...get().items, { ...itemData, id, quantity: addedQty }],
        isOpen: true,
      });
    }
  },

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, delta) =>
    set((state) => ({
      items: state.items
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[],
    })),

  clearCart: () => set({ items: [], appliedCoupon: null, orderNotes: '' }),

  setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
  setOrderNotes: (orderNotes) => set({ orderNotes }),

  applyCoupon: (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    const coupon = VALID_COUPONS[code];
    if (!coupon) {
      return { success: false, message: 'קוד קופון לא תקין או פג תוקף' };
    }

    const subtotal = get().getSubtotal();
    if (code === 'BARISTA20' && subtotal < 80) {
      return { success: false, message: 'קופון BARISTA20 תקף להזמנות מעל ₪80 בלבד' };
    }

    set({ appliedCoupon: coupon });
    return { success: true, message: `קופון ${coupon.code} הופעל בהצלחה: ${coupon.description}` };
  },

  removeCoupon: () => set({ appliedCoupon: null }),

  getSubtotal: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  getDeliveryCost: () => {
    const method = get().deliveryMethod;
    const subtotal = get().getSubtotal();
    const coupon = get().appliedCoupon;

    if (method === 'pickup') return 0;
    if (coupon?.freeShipping) return 0;

    // Free delivery on orders over ₪150
    if (subtotal >= 150) return 0;

    if (method === 'express') return 25; // ₪25 for 2-hour express fresh thermal courier
    return 15; // ₪15 for standard home delivery
  },

  getDiscountAmount: () => {
    const coupon = get().appliedCoupon;
    if (!coupon) return 0;

    const subtotal = get().getSubtotal();
    if (coupon.discountPercent) {
      return Math.round((subtotal * coupon.discountPercent) / 100);
    }
    if (coupon.discountAmount) {
      return Math.min(coupon.discountAmount, subtotal);
    }
    return 0;
  },

  // Base total (legacy compatibility)
  getTotalPrice: () => get().getFinalTotalPrice(),

  // Computed final total with shipping and discount
  getFinalTotalPrice: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    const discount = get().getDiscountAmount();
    const delivery = get().getDeliveryCost();
    return Math.max(0, subtotal - discount + delivery);
  },

  // 18% Israel VAT calculation breakdown
  getVatAmount: () => {
    const total = get().getFinalTotalPrice();
    return Math.round(total * (0.18 / 1.18));
  },

  getItemCount: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
