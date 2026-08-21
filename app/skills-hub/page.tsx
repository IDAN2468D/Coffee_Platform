import React from "react";
import SkillsILInteractiveHub from "@/components/SkillsILInteractiveHub";

export const metadata = {
  title: "פורטל מיומנויות Skills-IL & Agent Mesh | The Digital Roast",
  description: "מרכז המיומנויות ורשת ה-AI Agent Mesh של The Digital Roast - חקור והרץ מיומנויות קפה ו-MCP בזמן אמת."
};

export default function SkillsHubPage() {
  return (
    <main className="min-h-screen bg-[#050404] text-white pt-24 pb-16 px-4">
      <SkillsILInteractiveHub />
    </main>
  );
}
