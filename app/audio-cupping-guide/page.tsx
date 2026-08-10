import React from 'react';
import AudioCuppingGuide from '@/components/AudioCuppingGuide';

export const metadata = {
  title: '3D Audio Cupping & SCA Guide | The Digital Roast',
  description: 'מדריך קאפינג שמע מרחבי תלת-ממדי ומערכת ניקוד 100 נקודות תקן SCA',
};

export default function AudioCuppingGuidePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white py-12">
      <AudioCuppingGuide />
    </main>
  );
}
