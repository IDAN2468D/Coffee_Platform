import React from "react";
import DirectTradeTransparencyCalculator from "@/components/DirectTradeTransparencyCalculator";

export const metadata = {
  title: "שקיפות מסחר ישיר ומטבעות | The Digital Roast",
  description: "מחשבון שרשרת ערך שקופה, פרמיית חקלאי מעל מחיר הבורסה ושערי מטבע חיים."
};

export default function DirectTradePage() {
  return (
    <main className="min-h-screen bg-[#050404] text-white pt-24 pb-16 px-4">
      <DirectTradeTransparencyCalculator />
    </main>
  );
}
