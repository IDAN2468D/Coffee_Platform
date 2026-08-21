import React from "react";
import CryoMilkSynthesizer from "@/components/CryoMilkSynthesizer";

export const metadata = {
  title: "מדע חלב קריוגני ומיקרו-קצף 50µm | The Digital Roast",
  description: "תרמודינמיקת זיקוק חלב בהקפאה, מודל פיזור בועות אולטרסוניות ודנטורציית חלבונים."
};

export default function MilkSciencePage() {
  return (
    <main className="min-h-screen bg-[#050404] text-white pt-24 pb-16 px-4">
      <CryoMilkSynthesizer />
    </main>
  );
}
