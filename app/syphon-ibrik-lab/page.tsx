import React from 'react';
import SyphonIbrikLab from '@/components/SyphonIbrikLab';

export const metadata = {
  title: 'Syphon & Ibrik Lab | The Digital Roast',
  description: 'מעבדת חליטת סיפון וואקום וג׳זווה עות׳מאנית בחול חם',
};

export default function SyphonIbrikLabPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white py-12">
      <SyphonIbrikLab />
    </main>
  );
}
