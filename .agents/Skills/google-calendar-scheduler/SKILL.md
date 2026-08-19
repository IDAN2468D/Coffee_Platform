---
name: google-calendar-scheduler
description: Google Calendar API scheduling, live masterclasses with Google Meet, circadian rhythm caffeine sync, roast degassing peak windows, and .ics export.
---

# Google Calendar AI Scheduling & Coffee Sync 📅☕

## 1. Domain & Purpose
The `google-calendar-scheduler` module connects *The Digital Roast* platform with Google Calendar API, Google Meet video conferencing, and universal iCalendar (`.ics`) formats. It allows baristas, roasters, and specialty coffee lovers to orchestrate tasting schedules, caffeine biological windows, bean resting degassing timelines, and subscription deliveries.

## 2. Core Capabilities & Integration Pillars
1. **Live Masterclasses & SCA Cupping Room (Google Meet Integration):**
   - Schedules live interactive cupping sessions and V60/Espresso brewing masterclasses.
   - Automatically generates Google Meet video conference links and passes structured SCA scoring guidelines.
2. **Circadian Rhythm & Caffeine Blocks (Pharmacokinetic Sync):**
   - Pushes optimal caffeine intake windows directly to the user's calendar.
   - Integrates morning cortisol wake dip (90m post-wake), peak focus blocks (10:00-12:00), and the strict 14:00 Adenosine sleep protection cutoff.
3. **Roast Degassing & Peak Extraction Windows:**
   - Automatically schedules peak flavor extraction windows (Days 7–21 post-roast) and replenishment alerts (Day 28).
4. **Subscription & Machine Maintenance Schedules:**
   - Regular alerts for espresso machine chemical backflushes, water filter ion exchanges, and burr alignment calibration.

## 3. Architecture & Components
- **Zod Schema:** `lib/schemas/calendarSchema.ts` (`CoffeeCalendarEventSchema`, `CalendarSyncResponseSchema`)
- **Service Layer:** `lib/googleCalendarService.ts` (`generateGoogleCalendarWebUrl`, `generateICalendarString`, `createGoogleCalendarEvent`)
- **Server Action:** `app/actions/calendarActions.ts` (`scheduleCoffeeCalendarEventAction`)
- **UI Hub Component:** `components/GoogleCalendarCoffeeHub.tsx`
- **Route:** `app/calendar-hub/page.tsx` (and `app/google-calendar-hub/page.tsx`)
- **Design Language:** Liquid Glass 4.0 Pro (120Hz GPU render, Web Audio acoustic spatial sound, dark obsidian background `#050404`).
