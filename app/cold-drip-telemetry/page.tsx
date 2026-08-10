import React from 'react';
import ColdDripTelemetry from '@/components/ColdDripTelemetry';

export const metadata = {
  title: 'Kyoto Cold Drip Telemetry | The Digital Roast',
  description: 'טלמטריית מגדל טפטוף קר יפני לחישוב קצב טיפות ודינמיקת קרח',
};

export default function ColdDripTelemetryPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white py-12">
      <ColdDripTelemetry />
    </main>
  );
}
