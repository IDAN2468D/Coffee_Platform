import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItemDetail {
  coffeeItemId: string;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  shots?: number;
  milkType?: string;
  imageUrl?: string;
  origin?: string;
  flavorNotes?: string[];
}

export interface UserOrderRecord {
  orderNumber: string;
  fullName: string;
  email?: string;
  phone: string;
  deliveryAddress: string;
  items: OrderItemDetail[];
  totalPrice: number;
  status: 'PENDING' | 'BREWING' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  paymentMethod?: string;
  rating?: number;
  reviewNotes?: string;
  trackingStep?: number; // 1: Received, 2: Brewing, 3: In Transit, 4: Delivered
  estimatedDelivery?: string;
}

interface OrderStore {
  orders: UserOrderRecord[];
  activeFilter: string;
  searchQuery: string;
  selectedOrderForInvoice: UserOrderRecord | null;
  addOrder: (order: UserOrderRecord) => void;
  setOrders: (orders: UserOrderRecord[]) => void;
  rateOrder: (orderNumber: string, rating: number, reviewNotes?: string) => void;
  setActiveFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedOrderForInvoice: (order: UserOrderRecord | null) => void;
  clearOrders: () => void;
  getTotalSpent: () => number;
  getTotalOrdersCount: () => number;
}

const DEFAULT_SAMPLE_ORDERS: UserOrderRecord[] = [
  {
    orderNumber: 'DR-489210',
    fullName: 'עידן קזם',
    email: 'idankzm@gmail.com',
    phone: '050-1234567',
    deliveryAddress: 'שדרות רוטשילד 45, תל אביב-יפו',
    items: [
      {
        coffeeItemId: 'item-beans-1',
        itemName: 'פולי קפה אתיופיה ירגשף היירלום (250 גרם)',
        quantity: 2,
        pricePerUnit: 58,
        origin: 'אתיופיה (Yirgacheffe 2,000m)',
        flavorNotes: ['פרחי יסמין', 'הדרים רעננים', 'דבש בר'],
        imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
      },
      {
        coffeeItemId: 'item-espresso-1',
        itemName: 'קפוצ׳ינו גורמה שיבולת שועל',
        quantity: 1,
        pricePerUnit: 18,
        shots: 2,
        milkType: 'חלב שיבולת שועל Oatly',
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80',
      },
    ],
    totalPrice: 134,
    status: 'OUT_FOR_DELIVERY',
    trackingStep: 3,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    paymentMethod: 'כרטיס אשראי (•••• 4242)',
    estimatedDelivery: 'עוד כ-12 דקות (שליח אקספרס)',
  },
  {
    orderNumber: 'DR-391084',
    fullName: 'עידן קזם',
    email: 'idankzm@gmail.com',
    phone: '050-1234567',
    deliveryAddress: 'שדרות רוטשילד 45, תל אביב-יפו',
    items: [
      {
        coffeeItemId: 'item-beans-5',
        itemName: 'פולי קפה פנמה גיישה ספציאליטי (250 גרם)',
        quantity: 1,
        pricePerUnit: 120,
        origin: 'פנמה (Boquete Valley Geisha)',
        flavorNotes: ['ברגמוט', 'אפרסק לבן', 'יסמין'],
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      },
      {
        coffeeItemId: 'item-beans-4',
        itemName: 'פולי קפה קוסטה ריקה טאראזו Honey (250 גרם)',
        quantity: 1,
        pricePerUnit: 64,
        origin: 'קוסטה ריקה (Tarrazu Reserve)',
        flavorNotes: ['מתיקות דבש', 'פירות יער', 'וניל'],
        imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80',
      },
    ],
    totalPrice: 184,
    status: 'COMPLETED',
    trackingStep: 4,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'כרטיס אשראי (•••• 4242)',
    rating: 5,
    reviewNotes: 'הפנמה גיישה יוצאת מן הכלל, חומציות מלטפת ואיזון מושלם ב-V60!',
  },
  {
    orderNumber: 'DR-284912',
    fullName: 'עידן קזם',
    email: 'idankzm@gmail.com',
    phone: '050-1234567',
    deliveryAddress: 'שדרות רוטשילד 45, תל אביב-יפו',
    items: [
      {
        coffeeItemId: 'item-beans-2',
        itemName: 'פולי קפה סומטרה מנדלינג גורמה (250 גרם)',
        quantity: 2,
        pricePerUnit: 62,
        origin: 'אינדונזיה (Sumatra Mandheling)',
        flavorNotes: ['שוקולד כהה', 'תבלינים מעושנים', 'גוף מלא'],
        imageUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&auto=format&fit=crop&q=80',
      },
    ],
    totalPrice: 124,
    status: 'COMPLETED',
    trackingStep: 4,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'כרטיס אשראי (•••• 4242)',
    rating: 5,
    reviewNotes: 'קלייה כהה משובחת לאספרסו עם קרמה עשירה וסמיכה.',
  },
];

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: DEFAULT_SAMPLE_ORDERS,
      activeFilter: 'ALL',
      searchQuery: '',
      selectedOrderForInvoice: null,

      addOrder: (order) =>
        set((state) => {
          const exists = state.orders.some((o) => o.orderNumber === order.orderNumber);
          if (exists) {
            return {
              orders: state.orders.map((o) => (o.orderNumber === order.orderNumber ? order : o)),
            };
          }
          return {
            orders: [order, ...state.orders],
          };
        }),

      setOrders: (orders) => set({ orders }),

      rateOrder: (orderNumber, rating, reviewNotes) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.orderNumber === orderNumber
              ? { ...o, rating, reviewNotes: reviewNotes || o.reviewNotes }
              : o
          ),
        })),

      setActiveFilter: (filter) => set({ activeFilter: filter }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedOrderForInvoice: (order) => set({ selectedOrderForInvoice: order }),
      clearOrders: () => set({ orders: [] }),

      getTotalSpent: () =>
        get().orders.reduce((sum, o) => (o.status !== 'CANCELLED' ? sum + o.totalPrice : sum), 0),

      getTotalOrdersCount: () => get().orders.length,
    }),
    {
      name: 'digital_roast_order_history_v2',
    }
  )
);
