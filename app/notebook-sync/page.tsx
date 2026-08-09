import React from 'react';
import NotebookLMBrewSync from '@/components/NotebookLMBrewSync';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'סנכרון מתכוני חליטה ל-Workspace | The Digital Roast',
  description: 'סנכרון אוטומטי של מתכוני V60 וניתוחי Cupping ל-Google Docs ו-NotebookLM.',
};

export default function NotebookSyncPage() {
  return (
    <main className="min-h-screen bg-[#050404] text-stone-100 font-sans dir-rtl">
      <Header />
      <div className="pt-28 pb-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-cyan-400 to-emerald-400 mb-3">
            NotebookLM Workspace Sync Engine
          </h1>
          <p className="text-stone-400 text-sm md:text-base max-w-2xl mx-auto">
            מערכת סנכרון אוטומטית המעבירה מתכוני חליטה, פרופילי טעמים ויומני Cupping ישירות ל-Google Docs ולצוות ה-Brewing ב-NotebookLM.
          </p>
        </div>
        <NotebookLMBrewSync />
      </div>
      <Footer />
    </main>
  );
}
