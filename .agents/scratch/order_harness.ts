/**
 * Working TypeScript Harness for Coffee Orders & Validation
 */
import { z } from 'zod';

const OrderTestSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9),
  totalPrice: z.number().positive(),
  drinkName: z.string()
});

const sampleOrder = {
  fullName: "ישראל ישראלי",
  phone: "0505558888",
  totalPrice: 22,
  drinkName: "Honey Oak Cortado"
};

const result = OrderTestSchema.safeParse(sampleOrder);
console.log("Order Validation Test Result:", result.success ? "PASSED" : "FAILED");
