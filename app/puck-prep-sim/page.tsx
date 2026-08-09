import PuckPrepSimulator from '@/components/PuckPrepSimulator';

export const metadata = {
  title: 'סימולטור 3D להכנת פאק אספרסו ואיזון WDT | The Digital Roast',
  description: 'סימולטור פיזיקלי להכנת פאק קפה בידית האספרסו, מניעת תיעול מים וכוונון עוצמת הדחיסה.',
};

export default function PuckPrepPage() {
  return (
    <main className="min-h-screen bg-[#050404] py-12 px-4 sm:px-6 lg:px-8">
      <PuckPrepSimulator />
    </main>
  );
}
