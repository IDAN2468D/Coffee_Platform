# Comprehensive Coffee Platform Data Schemas

## 1. CoffeeItem Schema (`models/CoffeeItem.ts`)
```typescript
import { Schema, model, models } from 'mongoose';

export interface ICoffeeItem {
  _id: string;
  name: string;
  hebrewName: string;
  description: string;
  category: 'ESPRESSO' | 'SPECIALTY_LATTE' | 'V60_KIT' | 'CAPSULES' | 'PASTRY';
  price: number;
  roastLevel: number; // 1 to 12
  origin: string;
  flavorNotes: string[];
  imageUrl: string;
  isAvailable: boolean;
  caffeineMgPerServing: number;
  caloriesBase: number;
}

const CoffeeItemSchema = new Schema<ICoffeeItem>({
  name: { type: String, required: true },
  hebrewName: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['ESPRESSO', 'SPECIALTY_LATTE', 'V60_KIT', 'CAPSULES', 'PASTRY'], required: true },
  price: { type: Number, required: true },
  roastLevel: { type: Number, min: 1, max: 12, default: 8 },
  origin: { type: String, default: 'Ethiopia Yirgacheffe' },
  flavorNotes: [{ type: String }],
  imageUrl: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  caffeineMgPerServing: { type: Number, default: 150 },
  caloriesBase: { type: Number, default: 80 }
}, { timestamps: true });

export const CoffeeItem = models.CoffeeItem || model<ICoffeeItem>('CoffeeItem', CoffeeItemSchema);
```

## 2. Order Schema (`models/Order.ts`)
```typescript
export interface IOrder {
  _id: string;
  orderNumber: string;
  fullName: string;
  phone: string;
  deliveryAddress: string;
  items: Array<{
    coffeeItemId: string;
    itemName: string;
    quantity: number;
    pricePerUnit: number;
    shots: number;
    milkType: string;
  }>;
  totalPrice: number;
  status: 'PENDING' | 'BREWING' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED';
  whatsappSent: boolean;
  createdAt: Date;
}
```
