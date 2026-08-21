import React from "react";
import RoastVolatilesRadar from "@/components/RoastVolatilesRadar";

export const metadata = {
  title: "רדאר תרכובות נדיפות GC-MS & CO2 | The Digital Roast",
  description: "ספקטרומטריית גזים נדיפים, מעקב תרכובות טעם וחישוב חלון מיצוי השיא של פולי הקפה."
};

export default function VolatilesRadarPage() {
  return (
    <main className="min-h-screen bg-[#050404] text-white pt-24 pb-16 px-4">
      <RoastVolatilesRadar />
    </main>
  );
}
