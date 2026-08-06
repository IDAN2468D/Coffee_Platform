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
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
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

    const id = `${itemData.coffeeItemId}-${itemData.shots}-${itemData.milkType}`;
    const existing = get().items.find((i) => i.id === id);

    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        ),
        isOpen: true,
      });
    } else {
      set({
        items: [...get().items, { ...itemData, id, quantity: 1 }],
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
  clearCart: () => set({ items: [] }),
  getTotalPrice: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  getItemCount: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
