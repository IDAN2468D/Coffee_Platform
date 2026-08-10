import React from 'react';
import MineralBypassEngine from '@/components/MineralBypassEngine';

export const metadata = {
  title: 'Mineral Bypass Engine | The Digital Roast',
  description: 'מחשב מהילת מים טהורים (RO Bypass) והזרקת יוני מגנזיום פוסט-חליטה',
};

export default function MineralBypassEnginePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white py-12">
      <MineralBypassEngine />
    </main>
  );
}
