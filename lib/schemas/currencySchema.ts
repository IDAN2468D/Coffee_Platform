import { z } from 'zod';

export const SupportedCurrencyEnum = z.enum(['ILS', 'USD', 'EUR', 'GBP', 'JPY']);
export type SupportedCurrency = z.infer<typeof SupportedCurrencyEnum>;

export const FXConversionRequestSchema = z.object({
  fromCurrency: SupportedCurrencyEnum.default('USD'),
  toCurrency: SupportedCurrencyEnum.default('ILS'),
  amount: z.number().positive('הסכום חייב להיות חיובי'),
});

export type FXConversionRequest = z.infer<typeof FXConversionRequestSchema>;

export const FXRateResponseSchema = z.object({
  base: SupportedCurrencyEnum,
  rates: z.record(z.string(), z.number()),
  timestamp: z.number(),
  source: z.string(),
});

export type FXRateResponse = z.infer<typeof FXRateResponseSchema>;
