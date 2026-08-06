import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'שם מלא חייב להכיל לפחות 2 תווים' }),
  email: z.string().email({ message: 'כתובת אימייל לא תקינה' }),
  phone: z.string().min(9, { message: 'מספר טלפון תקין נדרש (לדוגמה 050-1234567)' }),
  password: z.string().min(6, { message: 'סיסמה חייבת להכיל לפחות 6 תווים' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'כתובת אימייל לא תקינה' }),
  password: z.string().min(1, { message: 'אנא הזן סיסמה' }),
});

export const orderSchema = z.object({
  fullName: z.string().min(2, 'שם מלא נדרש'),
  email: z.string().email('כתובת אימייל לא תקינה').optional().or(z.literal('')),
  phone: z.string().min(9, 'מספר טלפון תקין נדרש'),
  deliveryAddress: z.string().min(5, 'כתובת משלוח מלאה נדרשת'),
  items: z.array(
    z.object({
      coffeeItemId: z.string(),
      itemName: z.string(),
      quantity: z.number().min(1),
      pricePerUnit: z.number(),
      shots: z.number().default(1),
      milkType: z.string().default('חלב רגיל'),
    })
  ).min(1, 'סל הקניות ריק'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
