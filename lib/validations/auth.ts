import { z } from 'zod';

// 1. Credit Card Schema
export const creditCardSchema = z.object({
  cardNo: z
    .string()
    .min(1, 'אנא הזן מספר כרטיס אשראי')
    .refine((val) => {
      const clean = val.replace(/[\s-]/g, '');
      return /^\d{16}$/.test(clean);
    }, 'מספר כרטיס אשראי חייב להכיל בדיוק 16 ספרות'),
  cardHolder: z
    .string()
    .min(2, 'שם מחזיק הכרטיס חייב להכיל לפחות 2 תווים'),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'תוקף הכרטיס חייב להיות בפורמט תקין (MM/YY)'),
  cardCvv: z
    .string()
    .regex(/^\d{3,4}$/, 'קוד אבטחה (CVV) חייב להכיל 3 או 4 ספרות'),
});

// 2. User Profile & Security Schema
export const profileSchema = z
  .object({
    fullName: z.string().min(2, 'שם מלא חייב להכיל לפחות 2 תווים'),
    email: z.string().email('כתובת אימייל לא תקינה'),
    phone: z
      .string()
      .regex(/^0\d{1,2}[-]?\d{7}$/, 'מספר טלפון נייד/נייח ישראלי לא תקין (למשל 050-1234567)'),
    image: z.string().optional().or(z.literal('')),
    newPassword: z
      .string()
      .min(6, 'סיסמה חדשה חייבת להכיל לפחות 6 תווים')
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'הסיסמאות אינן תואמות!',
      path: ['confirmPassword'],
    }
  );

// 3. Register Schema
export const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'שם מלא חייב להכיל לפחות 2 תווים' }),
  email: z.string().email({ message: 'כתובת אימייל לא תקינה' }),
  phone: z
    .string()
    .regex(/^0\d{1,2}[-]?\d{7}$/, { message: 'מספר טלפון תקין נדרש (לדוגמה 050-1234567)' }),
  password: z.string().min(6, { message: 'סיסמה חייבת להכיל לפחות 6 תווים' }),
});

// 4. Login Schema
export const loginSchema = z.object({
  email: z.string().email({ message: 'כתובת אימייל לא תקינה' }),
  password: z.string().min(1, { message: 'אנא הזן סיסמה' }),
});

// 5. Order Schema
export const orderSchema = z.object({
  fullName: z.string().min(2, 'שם מלא נדרש (לפחות 2 תווים)'),
  email: z
    .string()
    .transform((val) => (val ? val.trim() : ''))
    .pipe(z.string().email('כתובת אימייל לא תקינה').optional().or(z.literal(''))),
  phone: z
    .string()
    .transform((val) => val.replace(/[\s.-]/g, ''))
    .refine((val) => /^(\+?972|0)[2-9]\d{7,8}$/.test(val) || /^0\d{8,9}$/.test(val), {
      message: 'מספר טלפון תקין נדרש (לדוגמה 050-1234567)',
    }),
  deliveryAddress: z.string().min(2, 'כתובת משלוח מלאה נדרשת'),
  items: z
    .array(
      z.object({
        coffeeItemId: z.string().optional().default('custom-item'),
        itemName: z.string().min(1, 'שם פריט נדרש'),
        quantity: z.number().min(1).default(1),
        pricePerUnit: z.number().default(0),
        shots: z.number().optional().default(1),
        milkType: z.string().optional().default('חלב רגיל'),
      })
    )
    .min(1, 'סל הקניות ריק'),
});

export type CreditCardInput = z.infer<typeof creditCardSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
