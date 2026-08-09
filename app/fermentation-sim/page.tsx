import FermentationSimulator from '@/components/FermentationSimulator';

export const metadata = {
  title: 'סימולטור תסיסה ואקלים חווה | The Digital Roast',
  description: 'סימולציה מדעית של תסיסת פולי קפה במכלים אנארוביים, שוק תרמי וערכי Brix ו-pH.',
};

export default function FermentationPage() {
  return (
    <main className="min-h-screen bg-[#050404] py-12 px-4 sm:px-6 lg:px-8">
      <FermentationSimulator />
    </main>
  );
}
