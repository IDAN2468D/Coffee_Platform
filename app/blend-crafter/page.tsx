import React from "react";
import CustomBlendCrafter from "@/components/CustomBlendCrafter";

export const metadata = {
  title: "אלכימיית בלנדים בוטיק AI | The Digital Roast",
  description: "יצירת תערובות מותאמות אישית, איזון אחוזי זנים, חישוב מסיסות ו-TDS והדפסת תווית בוטיק אישית."
};

export default function BlendCrafterPage() {
  return (
    <main className="min-h-screen bg-[#050404] text-white pt-24 pb-16 px-4">
      <CustomBlendCrafter />
    </main>
  );
}
