import { z } from 'zod';

export const CalendarEventTypeSchema = z.enum([
  'cupping_workshop',
  'circadian_caffeine',
  'roast_degassing',
  'subscription_delivery',
  'machine_maintenance',
  'custom_event',
]);

export type CalendarEventType = z.infer<typeof CalendarEventTypeSchema>;

export const CoffeeCalendarEventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'כותרת האירוע חייבת להכיל לפחות 2 תווים'),
  description: z.string().min(5, 'תיאור האירוע חייב להכיל לפחות 5 תווים'),
  location: z.string().default('The Digital Roast Lab / Virtual Google Meet'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'תאריך חייב להיות בפורמט YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'שעה חייבת להיות בפורמט HH:MM'),
  durationMinutes: z.number().int().positive().default(60),
  eventType: CalendarEventTypeSchema,
  attendeeEmail: z.string().email('כתובת אימייל לא תקינה').optional().or(z.literal('')),
  isGoogleMeet: z.boolean().default(true),
  reminderMinutes: z.number().int().nonnegative().default(30),
  recurrenceRule: z.string().optional(),
  metadata: z
    .object({
      beanOrigin: z.string().optional(),
      roastDate: z.string().optional(),
      cuppingScore: z.number().optional(),
      targetAdenosineHour: z.string().optional(),
      subscriptionId: z.string().optional(),
    })
    .optional(),
});

export type CoffeeCalendarEventInput = z.infer<typeof CoffeeCalendarEventSchema>;

export const CalendarSyncResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  calendarUrl: z.string(),
  icsContent: z.string().optional(),
  eventTitle: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  meetUrl: z.string().optional(),
  isLiveSynced: z.boolean().default(false),
  eventId: z.string().optional(),
});

export type CalendarSyncResponse = z.infer<typeof CalendarSyncResponseSchema>;
