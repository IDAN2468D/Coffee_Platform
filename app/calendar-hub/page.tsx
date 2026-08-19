import React from 'react';
import { Metadata } from 'next';
import { GoogleCalendarCoffeeHub } from '@/components/GoogleCalendarCoffeeHub';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'יומן קפה חכם & סנכרון Google Calendar | The Digital Roast',
  description:
    'סנכרון רב-ממדי של סדנאות בריסטה ומעבדת קאפינג SCA (Google Meet), חלונות קפאין צירקדיים, דיגזינג פולי קפה ותזכורות מנויים ישירות ליומן Google Calendar האישי שלך.',
  keywords: [
    'Google Calendar',
    'Coffee Workshops',
    'SCA Cupping',
    'Circadian Rhythm',
    'Coffee Roasting Degas',
    'The Digital Roast',
  ],
};

export default function CalendarHubPage() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 flex flex-col relative selection:bg-amber-500/30 selection:text-amber-200">
      <Header />
      <div className="flex-1 pt-24 pb-16">
        <GoogleCalendarCoffeeHub />
      </div>
      <Footer />
    </main>
  );
}
