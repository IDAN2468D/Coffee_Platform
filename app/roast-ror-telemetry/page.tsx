import RoasterRoRTelemetry from '@/components/RoasterRoRTelemetry';

export const metadata = {
  title: 'סימולטור עקומת קלייה וקצב עליית טמפרטורה (RoR) | The Digital Roast',
  description: 'ניטור בזמן אמת של עקומת קליית קפה Cropster, חום פולים (BT) וחיזוי פיצוץ ראשון.',
};

export default function RoasterRoRPage() {
  return (
    <main className="min-h-screen bg-[#050404] py-12 px-4 sm:px-6 lg:px-8">
      <RoasterRoRTelemetry />
    </main>
  );
}
