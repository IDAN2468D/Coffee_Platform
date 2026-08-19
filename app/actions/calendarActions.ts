'use server';

import {
  CoffeeCalendarEventSchema,
  CoffeeCalendarEventInput,
  CalendarSyncResponse,
} from '@/lib/schemas/calendarSchema';
import { createGoogleCalendarEvent, isGoogleCalendarConfigured } from '@/lib/googleCalendarService';

/**
 * Server Action: Schedules a coffee event to Google Calendar
 */
export async function scheduleCoffeeCalendarEventAction(
  rawInput: CoffeeCalendarEventInput
): Promise<CalendarSyncResponse> {
  try {
    const validated = CoffeeCalendarEventSchema.safeParse(rawInput);
    if (!validated.success) {
      const errorMsg = validated.error.issues.map((i) => i.message).join(', ');
      return {
        success: false,
        message: `נתונים שגויים: ${errorMsg}`,
        calendarUrl: '',
        eventTitle: rawInput.title || 'שגיאה',
        startTime: '',
        endTime: '',
        isLiveSynced: false,
      };
    }

    const response = await createGoogleCalendarEvent(validated.data);
    return response;
  } catch (error: any) {
    console.error('Error in scheduleCoffeeCalendarEventAction:', error);
    return {
      success: false,
      message: error.message || 'שגיאה בלתי צפויה בעת יצירת אירוע ביומן Google Calendar',
      calendarUrl: '',
      eventTitle: rawInput.title || 'שגיאה',
      startTime: '',
      endTime: '',
      isLiveSynced: false,
    };
  }
}

/**
 * Server Action: Checks if Google Calendar integration is fully configured
 */
export async function checkCalendarConfigAction(): Promise<{ isConfigured: boolean }> {
  try {
    const configured = await isGoogleCalendarConfigured();
    return { isConfigured: configured };
  } catch {
    return { isConfigured: false };
  }
}
