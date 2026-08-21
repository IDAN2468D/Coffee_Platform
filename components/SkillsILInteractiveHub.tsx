"use client";

import React, { useState } from "react";
import { Sparkles, Terminal, Cpu, CheckCircle2, Play, Search, Code2, Layers, BookOpen, Droplets, Flame, Globe, Activity, ShieldCheck, Zap } from "lucide-react";

interface SkillItem {
  id: string;
  name: string;
  displayName: string;
  category: "domain-specialty" | "physics-and-extraction" | "sensory-and-roast" | "economics-and-pkm" | "ai-multimodal";
  description: string;
  icon: any;
  tools: string[];
  mcpServer?: string;
  sampleInput: string;
  sampleOutput: string;
}

const SKILLS_REGISTRY: SkillItem[] = [
  {
    id: "il-water-quality-coffee-calibrator",
    name: "il-water-quality-coffee-calibrator",
    displayName: "כיול מים בישראל • Datagov Israel",
    category: "domain-specialty",
    description: "אינטגרציה עם מאגרי הממשלה לכיול קשיות מים, מינרלים ומתכוני סינון Specialty Coffee לפי ישובים בישראל.",
    icon: Droplets,
    tools: ["datagov-israel", "water-chemistry-optimizer"],
    mcpServer: "datagov-israel",
    sampleInput: '{"city": "תל אביב", "targetStyle": "V60 Light Roast"}',
    sampleOutput: '{"tds": 140, "gh": 65, "kh": 45, "recommendation": "הוספת 20ppm מגנזיום (MgSO4) וסינון פחם פעיל להסרת כלור."}'
  },
  {
    id: "direct-trade-fx-auditor",
    name: "direct-trade-fx-auditor",
    displayName: "מבקר שקיפות מסחר ישיר ומטבעות",
    category: "economics-and-pkm",
    description: "המרת שערי מטבע בזמן אמת דרך rapidapi_currency, פילוח שרשרת ערך וחישוב פרמיית חקלאי מעל C-Market.",
    icon: Globe,
    tools: ["rapidapi_currency", "terroir-dna-passport"],
    mcpServer: "rapidapi_currency",
    sampleInput: '{"farmGatePriceUSD": 28.5, "cMarketUSD": 5.2, "currency": "ILS"}',
    sampleOutput: '{"farmerPremium": "+448%", "farmGateILS": "₪104.9/kg", "totalTransparencyScore": "100/100"}'
  },
  {
    id: "barista-obsidian-lab-sync",
    name: "barista-obsidian-lab-sync",
    displayName: "סנכרון מעבדת קפה ל-Obsidian & Google Docs",
    category: "economics-and-pkm",
    description: "סנכרון אוטומטי של דוחות קאפינג SCA 100pt, עקומות מיצוי ומחקרי חליטה ל-Obsidian Vault ו-Google Workspace.",
    icon: BookOpen,
    tools: ["mcp-obsidian", "notebooklm"],
    mcpServer: "mcp-obsidian",
    sampleInput: '{"title": "Ethiopia Yirgacheffe", "scaScore": 89.5, "target": "Obsidian"}',
    sampleOutput: '{"status": "Synced", "filename": "Ethiopia_Yirgacheffe_Cupping.md", "frontmatter": "Valid YAML"}'
  },
  {
    id: "cryo-milk-science",
    name: "cryo-milk-science",
    displayName: "מדע חלב קריוגני & מיקרו-קצף",
    category: "physics-and-extraction",
    description: "ריכוז חלב בהקפאה (Freeze-Distilled 20% מוצקים), פיזור בועות ב-100-50 מיקרון ודנטורציית חלבונים.",
    icon: Zap,
    tools: ["cryo-milk-synthesizer", "liquid-glass-ui"],
    sampleInput: '{"milkType": "Freeze-Distilled Whole Milk", "temp": "63.5°C"}',
    sampleOutput: '{"sweetnessIndex": "9.8/10", "microfoamStability": "420s", "denaturationStatus": "Optimal"}'
  },
  {
    id: "roast-volatiles-radar",
    name: "roast-volatiles-radar",
    displayName: "רדאר תרכובות נדיפות GC-MS & CO2",
    category: "sensory-and-roast",
    description: "ספקטרומטריית גזים נדיפים (GC-MS VOC Spectrometry), מעקב תרכובות טעם וחישוב חלון מיצוי שיא.",
    icon: Flame,
    tools: ["roast-volatiles-radar", "visualization"],
    sampleInput: '{"roastAgeDays": 12, "roastLevel": "City Plus Light"}',
    sampleOutput: '{"co2DegasRate": "88%", "peakFlavorWindow": "ימים 8-18 (פעיל כעת)", "dominantEsters": "Hexyl Acetate, Furaneol"}'
  },
  {
    id: "custom-blend-crafter",
    name: "custom-blend-crafter",
    displayName: "אלכימיית בלנדים בוטיק AI",
    category: "ai-multimodal",
    description: "יצירת תערובות מותאמות אישית, איזון אחוזי זנים, חישוב מסיסות ו-TDS והדפסת תווית בוטיק אישית.",
    icon: Sparkles,
    tools: ["custom-blend-crafter", "gemini-3.5"],
    sampleInput: '{"ethiopia": 40, "colombia": 35, "panamaGeisha": 25}',
    sampleOutput: '{"blendName": "Velvet Aurora Reserve", "acidityBalance": "8.9/10", "bodyScore": "9.1/10"}'
  }
];

const CATEGORIES = [
  { id: "all", label: "כל המיומנויות (Mesh All)" },
  { id: "domain-specialty", label: "איכות מים ומקומיות בישראל" },
  { id: "physics-and-extraction", label: "פיזיקה, חלב ומיצוי" },
  { id: "sensory-and-roast", label: "קלייה, ארומה וקאפינג" },
  { id: "economics-and-pkm", label: "כלכלה, שקיפות ו-PKM" },
  { id: "ai-multimodal", label: "בינה מלאכותית ומולטימודליות" }
];

export default function SkillsILInteractiveHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSkill, setActiveSkill] = useState<SkillItem>(SKILLS_REGISTRY[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simOutput, setSimOutput] = useState<string | null>(null);

  const filteredSkills = SKILLS_REGISTRY.filter((skill) => {
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    const matchesSearch =
      skill.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRunSkill = () => {
    setIsRunning(true);
    setSimOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      setSimOutput(activeSkill.sampleOutput);
    }, 850);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 text-right font-sans" dir="rtl">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-10 backdrop-blur-2xl bg-black/60 border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.15)]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs md:text-sm font-bold tracking-wider uppercase mb-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              Skills-IL Architecture Mesh • The Digital Roast Agent Stack
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              פורטל המיומנויות ורשת ה-AI Agent Mesh
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-3xl leading-relaxed">
              חקור, הפעל ובחן בזמן אמת את כל 41 מיומנויות הקפה, הפיזיקה, כימיית המים, שקיפות המסחר הישיר וסנכרון הידע של פלטפורמת The Digital Roast.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              41 Active Domain Skills
            </span>
            <span className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              9 Live MCP Servers
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="md:col-span-1 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="חפש מיומנות, כלי או שרת MCP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pr-11 pl-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                    : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skills Explorer */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">
            רשימת המיומנויות ({filteredSkills.length})
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredSkills.map((skill) => {
              const Icon = skill.icon;
              const isSelected = activeSkill.id === skill.id;
              return (
                <div
                  key={skill.id}
                  onClick={() => {
                    setActiveSkill(skill);
                    setSimOutput(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-right flex items-start gap-4 ${
                    isSelected
                      ? "bg-amber-500/15 border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.2)] text-white"
                      : "bg-black/40 border-white/10 hover:bg-white/5 text-zinc-300"
                  }`}
                >
                  <div className={`p-3 rounded-xl shrink-0 ${isSelected ? "bg-amber-500 text-black" : "bg-white/5 text-amber-400"}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm truncate">{skill.displayName}</h4>
                      {skill.mcpServer && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {skill.mcpServer}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Interactive Runner & Inspector */}
        <div className="lg:col-span-7 rounded-3xl p-6 md:p-8 backdrop-blur-2xl bg-black/60 border border-white/10 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Skill Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1" dir="ltr">
                  <Terminal className="w-4 h-4" />
                  .agents/skills/{activeSkill.name}/SKILL.md
                </div>
                <h2 className="text-2xl font-extrabold text-white">{activeSkill.displayName}</h2>
                <p className="text-zinc-400 text-xs md:text-sm mt-1">{activeSkill.description}</p>
              </div>

              <button
                onClick={handleRunSkill}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs md:text-sm transition-all shadow-lg shadow-amber-500/30 active:scale-95 cursor-pointer shrink-0"
              >
                <Play className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
                {isRunning ? "מריץ מיומנות..." : "הרץ סימולציה Live"}
              </button>
            </div>

            {/* Tools & MCP Badges */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400">כלים וממשקים משולבים (Tool Mesh):</span>
              <div className="flex flex-wrap gap-2">
                {activeSkill.tools.map((tool) => (
                  <span key={tool} className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
                    ⚙️ {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Input Payload */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                <span>מבנה קלט מבוקש (JSON Input Schema):</span>
                <span className="font-mono text-zinc-500">UTF-8 • Strict Zod</span>
              </div>
              <pre className="p-4 rounded-2xl bg-black/80 border border-white/10 text-amber-300 text-xs font-mono overflow-x-auto text-left" dir="ltr">
                {activeSkill.sampleInput}
              </pre>
            </div>

            {/* Output Telemetry */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                <span>תוצאת פלט וטלמטריה (Live Execution Result):</span>
                {simOutput && (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    200 OK • Processed in 42ms
                  </span>
                )}
              </div>
              <pre className="p-4 rounded-2xl bg-black/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono min-h-[90px] overflow-x-auto text-left flex items-center" dir="ltr">
                {isRunning
                  ? "// מאחזר נתונים ומפעיל אלגוריתם מיומנות..."
                  : simOutput || "// לחץ על 'הרץ סימולציה Live' כדי לבחון את פלט המיומנות"}
              </pre>
            </div>
          </div>

          <div className="text-left text-[11px] text-zinc-500 pt-4 border-t border-white/5">
            Skills-IL Architecture v8.0 • Synchronized with Master Skills Mesh & MCP Runtime
          </div>
        </div>
      </div>
    </div>
  );
}
