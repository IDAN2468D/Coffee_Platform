import type { Metadata } from 'next';
import './globals.css';
import { MobileNav } from '@/components/MobileNav';
import { GlobalVoiceNavigator } from '@/components/GlobalVoiceNavigator';
import { VoiceSearchModal } from '@/components/VoiceSearchModal';

export const metadata: Metadata = {
  title: 'THE DIGITAL ROAST | פלטפורמת קפה גורמה & Gemini AI',
  description:
    'פלטפורמת הקפה המתקדמת בישראל - הזמנות קוליות ב-Gemini 3.5 AI, ניווט קולי רב-עמודי, חיפוש קולי חכם, טיימר V60 ושליחה ל-WhatsApp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className="dark">
      <body className="bg-obsidian text-stone-100 min-h-screen flex flex-col selection:bg-amber-500 selection:text-stone-950 pb-16 lg:pb-0">
        {children}
        <GlobalVoiceNavigator />
        <VoiceSearchModal />
        <MobileNav />
      </body>
    </html>
  );
}
