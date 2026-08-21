import React from "react";
import BaristaResearchLabHub from "@/components/BaristaResearchLabHub";

export const metadata = {
  title: "מעבדת מחקר וסנכרון ידע | The Digital Roast",
  description: "סנכרון יומן קאפינג SCA, משוואות מיצוי ופרופילי טעם ל-Obsidian Vault ו-Google Docs."
};

export default function BaristaLabPage() {
  return (
    <main className="min-h-screen bg-[#050404] text-white pt-24 pb-16 px-4">
      <BaristaResearchLabHub />
    </main>
  );
}
