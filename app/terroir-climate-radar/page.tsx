import React from 'react';
import TerroirClimateRadar from '@/components/TerroirClimateRadar';

export const metadata = {
  title: 'Terroir & Climate Radar | The Digital Roast',
  description: 'ראדאר ניתוח אקלים גיאוגרפי, גובה טופוגרפי וקרקע וולקנית לחוות קפה',
};

export default function TerroirClimateRadarPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white py-12">
      <TerroirClimateRadar />
    </main>
  );
}
