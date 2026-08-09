import React from 'react';
import GlobalFXCoffeeTicker from '@/components/GlobalFXCoffeeTicker';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'בורסת קפה וFX בזמן אמת | The Digital Roast',
  description: 'מעקב שערים בזמן אמת, מחירי פולי קפה בינלאומיים והמרת מטבעות דינמית.',
};

export default function GlobalFXPage() {
  return (
    <main className="min-h-screen bg-[#050404] text-stone-100 font-sans dir-rtl">
      <Header />
      <div className="pt-28 pb-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 mb-3">
            בורסת הקפה הבינלאומית & FX Ticker
          </h1>
          <p className="text-stone-400 text-sm md:text-base max-w-2xl mx-auto">
            מערכת מעקב מולטי-מטבעית מחוברת ל-`rapidapi_currency` המחשבת שערי חליפין בזמן אמת עבור ייבוא פולים ירוקים, מנויים אישיים ורכישות גלובליות.
          </p>
        </div>
        <GlobalFXCoffeeTicker />
      </div>
      <Footer />
    </main>
  );
}
