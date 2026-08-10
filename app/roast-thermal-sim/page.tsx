import React from 'react';
import RoastThermalSimulator from '@/components/RoastThermalSimulator';

export const metadata = {
  title: 'Roast Thermal Simulator | The Digital Roast',
  description: 'סימולטור דינמיקה תרמית ועקומת RoR מתקדמת לקליית פולי קפה גורמה',
};

export default function RoastThermalSimPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white py-12">
      <RoastThermalSimulator />
    </main>
  );
}
