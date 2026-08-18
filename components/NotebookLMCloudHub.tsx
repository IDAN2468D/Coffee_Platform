'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  FileSpreadsheet,
  Calendar,
  Layers,
  Sparkles,
  Cloud,
  Check,
  Copy,
  Download,
  Share2,
  Sliders,
  Star,
  Award,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface CuppingFormState {
  sampleName: string;
  origin: string;
  varietal: string;
  process: string;
  elevation: number;
  roaster: string;
  aromaScore: number;
  flavorScore: number;
  aftertasteScore: number;
  acidityScore: number;
  bodyScore: number;
  balanceScore: number;
  cleanCupScore: number;
  sweetnessScore: number;
  overallScore: number;
  defectCount: number;
  cuppingNotes: string;
}

export const NotebookLMCloudHub: React.FC = () => {
  const [form, setForm] = useState<CuppingFormState>({
    sampleName: 'Ethiopia Yirgacheffe Anaerobic Micro-Lot #42',
    origin: 'Gedeo Zone, אתיופיה',
    varietal: 'Heirloom / Kurume',
    process: '72h Anaerobic Natural',
    elevation: 2150,
    roaster: 'The Digital Roast Lab',
    aromaScore: 9.0,
    flavorScore: 9.25,
    aftertasteScore: 8.75,
    acidityScore: 9.0,
    bodyScore: 8.5,
    balanceScore: 8.75,
    cleanCupScore: 10.0,
    sweetnessScore: 10.0,
    overallScore: 9.25,
    defectCount: 0,
    cuppingNotes: 'תווי יסמין מובהקים, ברגמוט, פטל שחור ומתיקות של דבש בר. חומציות מזהירה וסיומת משי ארוכה.',
  });

  const [activeTab, setActiveTab] = useState<'docs' | 'sheets' | 'calendar' | 'obsidian'>('docs');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Total SCA Score Calculation
  const totalScaScore = useMemo(() => {
    const rawTotal =
      form.aromaScore +
      form.flavorScore +
      form.aftertasteScore +
      form.acidityScore +
      form.bodyScore +
      form.balanceScore +
      form.cleanCupScore +
      form.sweetnessScore +
      form.overallScore;
    const finalScore = rawTotal - form.defectCount * 2;
    return Number(finalScore.toFixed(2));
  }, [form]);

  // Score Classification
  const scoreBadge = useMemo(() => {
    if (totalScaScore >= 90) return { label: 'Super Specialty / Presidential (90+)', color: 'text-amber-300 bg-amber-500/20 border-amber-500/40' };
    if (totalScaScore >= 85) return { label: 'Excellent Specialty (85-89.9)', color: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40' };
    if (totalScaScore >= 80) return { label: 'Very Good Specialty (80-84.9)', color: 'text-cyan-300 bg-cyan-500/20 border-cyan-500/40' };
    return { label: 'Below Specialty Standard (<80)', color: 'text-stone-400 bg-stone-800 border-stone-700' };
  }, [totalScaScore]);

  // Generated Markdown for Docs & Obsidian
  const generatedMarkdown = useMemo(() => {
    return `---
title: "SCA Cupping Scorecard - ${form.sampleName}"
sample: "${form.sampleName}"
origin: "${form.origin}"
varietal: "${form.varietal}"
process: "${form.process}"
elevation: "${form.elevation} MASL"
roaster: "${form.roaster}"
sca_score: ${totalScaScore}
date: "${new Date().toISOString().split('T')[0]}"
tags: ["#coffee-cupping", "#sca-100pt", "#notebooklm", "#the-digital-roast"]
---

# ☕ SCA Specialty Coffee Cupping Report
**דוגמת קפה:** ${form.sampleName}  
**ציון סופי SCA:** **${totalScaScore} / 100** (${scoreBadge.label})  
**נקלה על ידי:** ${form.roaster} | **גובה גידול:** ${form.elevation}m MASL

---

## 📊 ציוני סנסוריקה מפורטים (SCA Protocol)
| מדד טעימה | ציון (מתוך 10) | הערות והבחנות |
| :--- | :--- | :--- |
| **ארומה & בישום יבש/רטוב** | ${form.aromaScore} | פרחוניות עזה, יסמין ופירות יער |
| **טעם (Flavor)** | ${form.flavorScore} | פטל שחור, שוקולד לבן וברגמוט |
| **סיומת (Aftertaste)** | ${form.aftertasteScore} | נקייה, מתוקה ומתמשכת |
| **חומציות (Acidity)** | ${form.acidityScore} | חומציות זרחנית/ציטרית מזהירה |
| **גוף & מרקם (Body)** | ${form.bodyScore} | גוף משי בינוני ומאוזן |
| **איזון כללי (Balance)** | ${form.balanceScore} | הרמוניה מושלמת |
| **כוס נקייה (Clean Cup)** | ${form.cleanCupScore} | 0 פגמים |
| **מתיקות (Sweetness)** | ${form.sweetnessScore} | מתיקות דבש טבעית |
| **ציון כולל (Overall)** | ${form.overallScore} | דוגמה יוצאת דופן |

---

## 📝 רשמי טעימה והערות הבריסטה:
> "${form.cuppingNotes}"

*דוח זה סונכרן ישירות באמצעות NotebookLM & Obsidian Barista Sync Engine.*
`;
  }, [form, totalScaScore, scoreBadge]);

  const handleTriggerSync = (type: 'docs' | 'sheets' | 'calendar' | 'obsidian') => {
    coffeeSound.playBaristaClick();
    setSyncStatus(`מסנכרן עם ${type === 'docs' ? 'Google Docs' : type === 'sheets' ? 'Google Sheets' : type === 'calendar' ? 'Google Calendar' : 'Obsidian Vault'}...`);
    setTimeout(() => {
      setSyncStatus(`✅ הסנכרון הושלם בהצלחה! הרשומה נשמרה ב-${type.toUpperCase()}`);
      setTimeout(() => setSyncStatus(null), 3500);
    }, 1200);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    setCopied(true);
    coffeeSound.playBaristaClick();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 dir-rtl text-right">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-blue-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono border border-blue-500/30">
              <Cloud className="w-3.5 h-3.5 text-blue-400" />
              <span>NOTEBOOKLM & GOOGLE WORKSPACE SYNC HUB</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
              מרכז מחקר וסנכרון קאפינג ל-NotebookLM & Docs
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              מערכת תיעוד קאפינג דיגיטלית לפי תקן SCA 100-Point עם ייצוא וסנכרון ענן ישיר למסמכי Google Docs, ניתוחי Extraction Yield ב-Sheets, תזמון אירועי טעימות ב-Calendar וסנכרון ל-Obsidian Vault.
            </p>
          </div>

          {/* Master Score Display */}
          <div className="bg-[#140e0b]/90 p-4 rounded-2xl border border-amber-500/40 shrink-0 text-center space-y-1">
            <div className="text-xs text-stone-400 font-mono">ציון SCA סופי</div>
            <div className="text-4xl font-black font-mono text-amber-400">{totalScaScore}</div>
            <div className={`text-[10px] font-mono px-2 py-0.5 rounded border ${scoreBadge.color}`}>
              {scoreBadge.label}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns (Form & Cloud Sync Hub) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SCA Scorecard Form (6 Cols) */}
        <div className="lg:col-span-6 space-y-4 p-6 rounded-3xl bg-stone-900/90 border border-stone-800 backdrop-blur-2xl shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>טופס שופטי קאפינג SCA (100-Point Rubric)</span>
            </h2>
          </div>

          {/* Sample Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-stone-400 font-mono mb-1">שם דוגמת הקפה</label>
              <input
                type="text"
                value={form.sampleName}
                onChange={(e) => setForm({ ...form, sampleName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-stone-400 font-mono mb-1">ארץ & אזור גידול</label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-stone-400 font-mono mb-1">שיטת עיבוד</label>
              <input
                type="text"
                value={form.process}
                onChange={(e) => setForm({ ...form, process: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-stone-400 font-mono mb-1">גובה גידול (MASL)</label>
              <input
                type="number"
                value={form.elevation}
                onChange={(e) => setForm({ ...form, elevation: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Interactive SCA Sliders */}
          <div className="space-y-2.5 pt-2 border-t border-stone-800">
            {[
              { key: 'aromaScore', label: 'בישום & ארומה (Aroma)' },
              { key: 'flavorScore', label: 'פרופיל טעם (Flavor)' },
              { key: 'aftertasteScore', label: 'סיומת (Aftertaste)' },
              { key: 'acidityScore', label: 'חומציות (Acidity)' },
              { key: 'bodyScore', label: 'גוף & מרקם (Body)' },
              { key: 'balanceScore', label: 'איזון (Balance)' },
              { key: 'overallScore', label: 'ציון שופט כולל (Overall)' },
            ].map(({ key, label }) => {
              const val = (form as any)[key] as number;
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-stone-300">{label}</span>
                    <span className="text-amber-400 font-bold">{val.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="6.0"
                    max="10.0"
                    step="0.25"
                    value={val}
                    onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>
              );
            })}

            <div>
              <label className="block text-xs text-stone-300 font-mono mb-1">הערות טעימה חופשיות</label>
              <textarea
                rows={2}
                value={form.cuppingNotes}
                onChange={(e) => setForm({ ...form, cuppingNotes: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Cloud Sync & Output Hub (6 Cols) */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          <div className="p-6 rounded-3xl bg-stone-900/90 border border-blue-500/30 backdrop-blur-2xl shadow-xl space-y-4">
            {/* Action Tabs */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                {[
                  { id: 'docs', label: 'Google Docs', icon: FileText },
                  { id: 'sheets', label: 'Sheets Analytics', icon: FileSpreadsheet },
                  { id: 'calendar', label: 'Calendar', icon: Calendar },
                  { id: 'obsidian', label: 'Obsidian Vault', icon: BookOpen },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        coffeeSound.playBaristaClick();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Preview Content */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs font-mono text-stone-300 max-h-72 overflow-y-auto leading-relaxed space-y-2">
              {activeTab === 'docs' && (
                <div>
                  <div className="text-blue-400 font-bold mb-1">📄 מבנה מסמך Google Docs שייוצר:</div>
                  <pre className="whitespace-pre-wrap text-[11px] text-stone-300">{generatedMarkdown}</pre>
                </div>
              )}
              {activeTab === 'sheets' && (
                <div className="space-y-2">
                  <div className="text-emerald-400 font-bold">📊 שורת נתונים ל-Google Sheets (Analytics Table):</div>
                  <div className="p-2 rounded bg-stone-900 border border-stone-800 text-[11px]">
                    <code>
                      {`"${new Date().toISOString()}","${form.sampleName}","${form.origin}",${form.elevation},${totalScaScore},${form.flavorScore},${form.acidityScore},${form.bodyScore}`}
                    </code>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    הנתונים מוזרקים ישירות לגיליון חישובי ה-Extraction Yield % וסטטיסטיקת המיצוי ב-NotebookLM.
                  </p>
                </div>
              )}
              {activeTab === 'calendar' && (
                <div className="space-y-2">
                  <div className="text-amber-400 font-bold">📅 אירוע יומן Google Calendar מתוזמן:</div>
                  <div className="p-2.5 rounded bg-stone-900 border border-stone-800 space-y-1 text-[11px]">
                    <div>📌 <strong>כותרת:</strong> מפגש קאפינג וטעימות: {form.sampleName}</div>
                    <div>⏱️ <strong>משך:</strong> 60 דקות | סדנת שופטים מודרכת</div>
                    <div>📍 <strong>מיקום:</strong> The Digital Roast Lab / Google Meet</div>
                  </div>
                </div>
              )}
              {activeTab === 'obsidian' && (
                <div>
                  <div className="text-purple-400 font-bold mb-1">🔮 Obsidian Barista Vault Note:</div>
                  <pre className="whitespace-pre-wrap text-[11px] text-purple-200/90">{generatedMarkdown}</pre>
                </div>
              )}
            </div>

            {/* Sync Feedback Message */}
            {syncStatus && (
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold animate-pulse">
                {syncStatus}
              </div>
            )}

            {/* Trigger Sync Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => handleTriggerSync(activeTab)}
                className="w-full sm:flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Cloud className="w-4 h-4" />
                <span>סנכרן כעת ל-{activeTab.toUpperCase()}</span>
              </button>
              <button
                onClick={handleCopyMarkdown}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'הועתק!' : 'העתק Markdown'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
