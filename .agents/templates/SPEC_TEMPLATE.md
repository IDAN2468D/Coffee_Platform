# Technical Specification: [Coffee Module Name]

## 1. Architecture Overview
Technical architecture for [Module Name] within Next.js 15 App Router and React 19.

## 2. Data Models & API Contracts

```typescript
import { z } from 'zod';

export const CustomCoffeeOrderSchema = z.object({
  baseDrinkId: z.string().min(1, 'Drink ID is required'),
  baseDrinkName: z.string(),
  basePrice: z.number().positive(),
  shots: z.number().int().min(1).max(4).default(2),
  milkType: z.enum(['WHOLE', 'OATLY_OAT', 'ALMOND_UNSWEETENED', 'SOY_PREMIUM']),
  sweetnessPercent: z.number().min(0).max(100).default(50),
  isIced: z.boolean().default(false),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().regex(/^05\d{8}$/, 'Must be a valid Israeli mobile number (05XXXXXXXX)'),
  deliveryAddress: z.string().min(5, 'Address required')
});

export type CustomCoffeeOrder = z.infer<typeof CustomCoffeeOrderSchema>;
```

## 3. Component Architecture & Data Flow
1. **Client Interaction:** `CoffeeCustomizer.tsx` captures user modifier selections via local React 19 state.
2. **Zustand Cart Update:** Selections dispatch to `useCartStore`.
3. **Server Action:** `submitCoffeeOrderAction(orderData)` validates via Zod schema.
4. **WhatsApp URL Generation:** Server action returns a pre-formatted `https://wa.me/...` URL with the encoded order payload.
