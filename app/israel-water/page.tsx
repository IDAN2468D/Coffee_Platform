import React from "react";
import IsraelWaterCalibrator from "@/components/IsraelWaterCalibrator";

export const metadata = {
  title: "כיול איכות מים לקפה בישראל | The Digital Roast",
  description: "אופטימיזציית כימיית מים לפי יישובים בישראל, SCA Water Standard ונתוני Datagov Israel."
};

export default function IsraelWaterPage() {
  return (
    <main className="min-h-screen bg-[#050404] text-white pt-24 pb-16 px-4">
      <IsraelWaterCalibrator />
    </main>
  );
}
