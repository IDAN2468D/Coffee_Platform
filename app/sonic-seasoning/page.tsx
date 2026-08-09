import SonicSeasoningPairing from '@/components/SonicSeasoningPairing';

export const metadata = {
  title: 'Sonic Seasoning – סנכרון תחושתי סאונד ותאורה | The Digital Roast',
  description: 'מנוע פסיכואקוסטי להתאמת תדרי שמע ותאורה לחוויית השתייה והגברת מתיקות הקפה.',
};

export default function SonicSeasoningPage() {
  return (
    <main className="min-h-screen bg-[#050404] py-12 px-4 sm:px-6 lg:px-8">
      <SonicSeasoningPairing />
    </main>
  );
}
