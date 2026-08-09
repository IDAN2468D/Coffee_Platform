import OpticalRoastAnalyzer from '@/components/OpticalRoastAnalyzer';

export const metadata = {
  title: 'ניתוח קלייה אופטי Agtron & צפיפות קרמה | The Digital Roast',
  description: 'סורק אופטי בלייב לניתוח דרגת קליית פולי קפה וצפיפות קרמה באספרסו לפי סולם Agtron.',
};

export default function OpticalRoastPage() {
  return (
    <main className="min-h-screen bg-[#050404] py-12 px-4 sm:px-6 lg:px-8">
      <OpticalRoastAnalyzer />
    </main>
  );
}
