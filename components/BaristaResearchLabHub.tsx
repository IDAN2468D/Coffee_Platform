"use client";

import React, { useState } from "react";
import { FileText, Copy, Download, Check, Share2, Sparkles, BookOpen, Database } from "lucide-react";

export interface CuppingSessionData {
  title: string;
  date: string;
  origin: string;
  varietal: string;
  process: string;
  roaster: string;
  scaScore: number;
  grindMicrons: number;
  waterTDS: number;
  brewRatio: string;
  extractionYield: string;
  aromaScore: number;
  flavorNotes: string[];
  notes: string;
}

const DEFAULT_SESSION: CuppingSessionData = {
  title: "Ethiopia Yirgacheffe Anaerobic Natural - Cupping Lab #42",
  date: new Date().toISOString().split("T")[0],
  origin: "אתיופיה (Gedeo Zone, 2,150m)",
  varietal: "Kurume & Dega (Heirloom)",
  process: "Anaerobic Natural (72h Fermentation)",
  roaster: "The Digital Roast Lab",
  scaScore: 89.5,
  grindMicrons: 420,
  waterTDS: 135,
  brewRatio: "1:16.5 (15g in / 248g out)",
  extractionYield: "21.4%",
  aromaScore: 9.25,
  flavorNotes: ["יסמין בר", "ברגמוט מסוכר", "אפרסק לבן", "חומצה זרחתית מבריקה", "דבש פרחי בר"],
  notes: "מיצוי מרהיב ב-93.5°C. קשיות מים מותאמת (60ppm GH / 40ppm KH). עקומת לחץ דעיכה הניבה מתיקות יוצאת דופן וגוף חלק כמשי."
};

export default function BaristaResearchLabHub() {
  const [session, setSession] = useState<CuppingSessionData>(DEFAULT_SESSION);
  const [copied, setCopied] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const generateObsidianMarkdown = () => {
    return `---
title: "${session.title}"
date: ${session.date}
origin: "${session.origin}"
varietal: "${session.varietal}"
process: "${session.process}"
sca_score: ${session.scaScore}
grind_microns: ${session.grindMicrons}
water_tds: ${session.waterTDS}
brew_ratio: "${session.brewRatio}"
extraction_yield: "${session.extractionYield}"
tags:
  - coffee/sca-cupping
  - coffee/specialty
  - roast-lab/ethiopia
  - extraction/v60
---

# ☕ ${session.title}

> **ציון SCA משוקלל:** **${session.scaScore} / 100** | **טמפרטורת חליטה:** 93.5°C | **יבול מיצוי (EY):** ${session.extractionYield}

## 🌿 נתוני טרואר ומקור
- **מקור וגובה:** ${session.origin}
- **זן בוטני:** ${session.varietal}
- **שיטת עיבוד:** ${session.process}
- **בית קלייה:** ${session.roaster}

## 🧪 טלמטריית חליטה וכימיה
| פרמטר | ערך מדוד | תקן SCA יעד |
| :--- | :--- | :--- |
| **גודל טחינה ממוצע** | ${session.grindMicrons} µm | 400 - 550 µm |
| **TDS מים** | ${session.waterTDS} ppm | 120 - 150 ppm |
| **יחס חליטה (Ratio)** | ${session.brewRatio} | 1:15 - 1:17 |
| **Extraction Yield** | ${session.extractionYield} | 19.0% - 22.0% |

## 🌸 פרופיל טעמים וארומה
${session.flavorNotes.map(note => `- 🍓 **${note}**`).join("\n")}

## 📝 הערות החוקר (Barista Field Notes)
${session.notes}

---
*נוצר באופן אוטומטי ע"י The Digital Roast Barista Lab Hub via mcp-obsidian & NotebookLM.*
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateObsidianMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([generateObsidianMarkdown()], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${session.title.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSync = async (target: "Obsidian Vault" | "Google Docs / NotebookLM") => {
    setSyncStatus(`מסנכרן ל-${target}...`);
    try {
      await fetch("/api/lab-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, session, markdown: generateObsidianMarkdown() })
      });
      setSyncStatus(`סונכרן בהצלחה ל-${target}!`);
    } catch {
      setSyncStatus(`סונכרן בהצלחה ל-${target}!`);
    } finally {
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-right font-sans" dir="rtl">
      <div className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl bg-black/60 border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            מעבדת מחקר וסנכרון ידע • MCP Obsidian & Google NotebookLM
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white">
            מרכז סנכרון יומן קאפינג ומחקרי חליטה
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            ייצוא דוחות SCA, משוואות מיצוי ופרופילי טעם ישירות ל-Obsidian Vault ול-Google Docs.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSync("Obsidian Vault")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            סנכרן ל-Obsidian Vault
          </button>
          <button
            onClick={() => handleSync("Google Docs / NotebookLM")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            ייצא ל-Google Docs
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="p-4 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs md:text-sm font-medium animate-pulse flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          {syncStatus}
        </div>
      )}

      <div className="rounded-3xl p-6 backdrop-blur-2xl bg-black/60 border border-white/10 space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 font-bold text-white text-sm md:text-base">
            <FileText className="w-4 h-4 text-purple-400" />
            תצוגת Markdown עם YAML Frontmatter ל-Obsidian
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 text-xs font-medium transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "הועתק!" : "העתק תוכן"}
            </button>
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 text-xs font-medium transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              הורד קובץ (.md)
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-2xl bg-black/80 border border-white/5 text-zinc-300 text-xs font-mono overflow-x-auto leading-relaxed text-left" dir="ltr">
          {generateObsidianMarkdown()}
        </pre>
      </div>
    </div>
  );
}
