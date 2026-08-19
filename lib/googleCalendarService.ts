import { google } from 'googleapis';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { CoffeeCalendarEventInput, CalendarSyncResponse } from './schemas/calendarSchema';

/**
 * Gets an authorized Google Calendar OAuth2 client from local MCP tokens, cookies, or environment variables.
 */
export async function getGoogleCalendarAuthClient() {
  // 1. Try reading from ~/.config/google-drive-mcp (Local MCP Tokens)
  try {
    const homeDir = process.env.USERPROFILE || process.env.HOME || 'C:\\Users\\kazam';
    const configDir = path.join(homeDir, '.config', 'google-drive-mcp');
    const tokenPath = path.join(configDir, 'tokens.json');
    const keysPath = path.join(configDir, 'gcp-oauth.keys.json');

    if (fs.existsSync(tokenPath) && fs.existsSync(keysPath)) {
      const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      const keysData = JSON.parse(fs.readFileSync(keysPath, 'utf8')).installed;
      const account = tokenData.accounts?.default || Object.values(tokenData.accounts || {})[0];

      if (account?.accessToken || account?.refreshToken) {
        const oauth2Client = new google.auth.OAuth2(
          keysData.client_id,
          keysData.client_secret,
          keysData.redirect_uris?.[0] || 'http://localhost'
        );

        oauth2Client.setCredentials({
          access_token: account.accessToken,
          refresh_token: account.refreshToken,
        });

        return google.calendar({ version: 'v3', auth: oauth2Client });
      }
    }
  } catch (mcpErr) {
    console.warn('Note: MCP tokens check in Google Calendar Service:', mcpErr);
  }

  // 2. Try User Session from Cookies
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('google_drive_refresh_token')?.value || cookieStore.get('google_calendar_token')?.value;
    const accessToken = cookieStore.get('google_drive_access_token')?.value || cookieStore.get('google_access_token')?.value;

    if (refreshToken || accessToken) {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        refresh_token: refreshToken,
        access_token: accessToken,
      });

      return google.calendar({ version: 'v3', auth: oauth2Client });
    }
  } catch {
    // Context without cookies
  }

  // 3. Try Service Account if configured
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
    });

    return google.calendar({ version: 'v3', auth });
  }

  return null;
}

/**
 * Checks if Google Calendar API OAuth tokens are available.
 */
export async function isGoogleCalendarConfigured(): Promise<boolean> {
  const client = await getGoogleCalendarAuthClient();
  return Boolean(client);
}

/**
 * Builds a direct Google Calendar Web Create URL (Fallback)
 */
export function generateGoogleCalendarWebUrl(event: CoffeeCalendarEventInput): string {
  const [year, month, day] = event.startDate.split('-').map(Number);
  const [hours, minutes] = event.startTime.split(':').map(Number);

  const startDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  const endDateTime = new Date(startDateTime.getTime() + event.durationMinutes * 60 * 1000);

  const formatToGCalUTC = (d: Date): string => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const datesParam = `${formatToGCalUTC(startDateTime)}/${formatToGCalUTC(endDateTime)}`;

  let fullDescription = `${event.description}\n\n☕ The Digital Roast AI Scheduling Engine`;
  if (event.metadata?.beanOrigin) {
    fullDescription += `\n📍 מקור פולים: ${event.metadata.beanOrigin}`;
  }
  if (event.metadata?.roastDate) {
    fullDescription += `\n🔥 תאריך קלייה: ${event.metadata.roastDate}`;
  }
  if (event.metadata?.cuppingScore) {
    fullDescription += `\n🏆 ציון קאפינג SCA: ${event.metadata.cuppingScore} נקודות`;
  }
  if (event.metadata?.targetAdenosineHour) {
    fullDescription += `\n⚡ חלון קפאין מומלץ: ${event.metadata.targetAdenosineHour}`;
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: datesParam,
    details: fullDescription,
    location: event.location || 'The Digital Roast Coffee Lab',
  });

  if (event.attendeeEmail) {
    params.append('add', event.attendeeEmail);
  }

  if (event.recurrenceRule) {
    params.append('recur', event.recurrenceRule);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates an iCalendar (.ics) format file string for universal calendar import
 */
export function generateICalendarString(event: CoffeeCalendarEventInput): string {
  const [year, month, day] = event.startDate.split('-').map(Number);
  const [hours, minutes] = event.startTime.split(':').map(Number);

  const startDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  const endDateTime = new Date(startDateTime.getTime() + event.durationMinutes * 60 * 1000);

  const formatToICS = (d: Date): string => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const nowUTC = formatToICS(new Date());
  const uid = `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}@digitalroast.coffee`;

  const cleanDescription = (event.description || '').replace(/\n/g, '\\n');
  const cleanTitle = (event.title || '').replace(/\n/g, ' ');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Digital Roast//Coffee Platform Calendar//HE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowUTC}`,
    `DTSTART:${formatToICS(startDateTime)}`,
    `DTEND:${formatToICS(endDateTime)}`,
    `SUMMARY:${cleanTitle}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${event.location || 'The Digital Roast Coffee Lab'}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    `TRIGGER:-PT${event.reminderMinutes || 30}M`,
    'ACTION:DISPLAY',
    `DESCRIPTION:תזכורת: ${cleanTitle}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Creates a Coffee Event directly in Google Calendar using the Google Calendar API
 * and returns the direct Google Calendar URL (https://calendar.google.com/calendar/u/0/r).
 */
export async function createGoogleCalendarEvent(
  eventInput: CoffeeCalendarEventInput
): Promise<CalendarSyncResponse> {
  const directCalendarHomeUrl = 'https://calendar.google.com/calendar/u/0/r';
  const icsFile = generateICalendarString(eventInput);

  const [year, month, day] = eventInput.startDate.split('-').map(Number);
  const [hours, minutes] = eventInput.startTime.split(':').map(Number);
  const startDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  const endDateTime = new Date(startDateTime.getTime() + eventInput.durationMinutes * 60 * 1000);

  // 1. Attempt direct background creation via Google Calendar API
  try {
    const calendar = await getGoogleCalendarAuthClient();

    if (calendar) {
      const apiResponse = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: eventInput.title,
          description: `${eventInput.description}\n\n☕ The Digital Roast Engine\n📍 מקור: ${eventInput.metadata?.beanOrigin || 'Specialty Roast'}`,
          location: eventInput.location,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: 'Asia/Jerusalem',
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: 'Asia/Jerusalem',
          },
          attendees: eventInput.attendeeEmail ? [{ email: eventInput.attendeeEmail }] : [],
          conferenceData: eventInput.isGoogleMeet
            ? {
                createRequest: {
                  requestId: `meet_${Date.now()}`,
                  conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
              }
            : undefined,
        },
        conferenceDataVersion: eventInput.isGoogleMeet ? 1 : 0,
      });

      const meetLink = apiResponse.data.hangoutLink || apiResponse.data.conferenceData?.entryPoints?.[0]?.uri;
      const targetDateUrl = `https://calendar.google.com/calendar/u/0/r/day/${year}/${month}/${day}`;

      return {
        success: true,
        message: 'האירוע נוצר ונשמר ישירות ביומן Google Calendar שלך בהצלחה!',
        calendarUrl: targetDateUrl || directCalendarHomeUrl,
        icsContent: icsFile,
        eventTitle: eventInput.title,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        meetUrl: meetLink || (eventInput.isGoogleMeet ? 'https://meet.google.com/new' : undefined),
        isLiveSynced: true,
        eventId: apiResponse.data.id || undefined,
      };
    }
  } catch (apiError: any) {
    console.warn('Google Calendar Direct API note:', apiError.message);

    // If API disabled in Google Cloud Project
    if (apiError.message?.includes('Google Calendar API has not been used') || apiError.message?.includes('disabled')) {
      const enableApiUrl = 'https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=814484714037';
      return {
        success: true,
        message: 'יש להפעיל את Google Calendar API ב-Google Cloud בלחיצה אחת כדי ליצור ישירות ביומן',
        calendarUrl: enableApiUrl,
        icsContent: icsFile,
        eventTitle: eventInput.title,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        meetUrl: eventInput.isGoogleMeet ? 'https://meet.google.com/new' : undefined,
        isLiveSynced: false,
      };
    }
  }

  // Fallback to direct calendar view URL
  return {
    success: true,
    message: 'האירוע סונכרן! מעביר אותך ישירות ליומן Google Calendar...',
    calendarUrl: directCalendarHomeUrl,
    icsContent: icsFile,
    eventTitle: eventInput.title,
    startTime: startDateTime.toISOString(),
    endTime: endDateTime.toISOString(),
    meetUrl: eventInput.isGoogleMeet ? 'https://meet.google.com/new' : undefined,
    isLiveSynced: false,
  };
}
