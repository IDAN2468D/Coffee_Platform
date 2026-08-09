import { z } from 'zod';

export const BrewMethodEnum = z.enum(['V60', 'AEROPRESS', 'ESPRESSO', 'CHEMEX', 'COLD_BREW']);
export type BrewMethod = z.infer<typeof BrewMethodEnum>;

export const BrewRecipeSyncSchema = z.object({
  recipeTitle: z.string().min(2, 'כותרת המתכון חייבת להכיל לפחות 2 תווים'),
  method: BrewMethodEnum.default('V60'),
  coffeeGrams: z.number().min(5).max(100),
  waterGrams: z.number().min(50).max(1500),
  waterTempC: z.number().min(80).max(100),
  grindSize: z.string().min(1, 'גודל הטחינה נדרש'),
  flavorNotes: z.array(z.string()).default([]),
  targetDocName: z.string().optional().default('V60_Master_Recipes'),
  notes: z.string().optional(),
});

export type BrewRecipeSync = z.infer<typeof BrewRecipeSyncSchema>;

export const SyncResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  docId: z.string().optional(),
  calendarEventUrl: z.string().optional(),
});

export type SyncResponse = z.infer<typeof SyncResponseSchema>;
