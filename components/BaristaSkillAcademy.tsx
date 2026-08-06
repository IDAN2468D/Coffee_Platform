'use client';

import React, { useState } from 'react';
import { Award, CheckCircle2, Trophy, Star, BookOpen, Zap, Sparkles } from 'lucide-react';

export function BaristaSkillAcademy() {
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({
    mod1: true,
  });
  const [coins, setCoins] = useState(250);

  const modules = [
    {
      id: 'mod1',
      title: 'יסודות החליטה וכיול טחינה (Grind Dial-in)',
      desc: 'למד לכוונן את עובי הטחינה לפי זמן מיצוי של 25-30 שניות ויחס 1:2 אספרסו.',
      reward: 100,
      level: 'מתחיל (Home Barista)',
    },
    {
      id: 'mod2',
      title: 'טכניקת הקצפת חלב & לאטה ארט',
      desc: 'יצירת מיקרו-פום במרקם קטיפתי (Micro-foam) ומזיגת צורת רוזטה וסוואן.',
      reward: 150,
      level: 'מתקדם (Pro Barista)',
    },
    {
      id: 'mod3',
      title: 'טעימות סנסוריות & ניתוח Cupping',
      desc: 'זיהוי חומציות ציטרית מול מאלית, גוף קפה, ארומה וניתוח 5D SCA Sensory.',
      reward: 200,
      level: 'מומחה (Sensory Judge)',
    },
    {
      id: 'mod4',
      title: 'תחזוקה וכימיית מים SCA',
      desc: 'איזון כלורידים, PPM מינרלי ותחזוקת ראש חליטה E61 וסליל חימום.',
      reward: 250,
      level: 'מאסטר (Roast Master)',
    },
  ];

  const toggleComplete = (id: string, reward: number) => {
    const next = !completedModules[id];
    setCompletedModules((prev) => ({ ...prev, [id]: next }));
    setCoins((prev) => (next ? prev + reward : prev - reward));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 dir-rtl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Trophy className="w-4 h-4 text-emerald-400 animate-pulse" />
          אקדמיית הבריסטה המוסמכת AI
        </div>
        <h2 className="text-3xl font-black text-gold-gradient tracking-tight">
          אקדמיית הבריסטה והסמכות AI (Barista Skill Academy)
        </h2>
        <p className="text-stone-400 text-xs sm:text-base max-w-xl mx-auto">
          עבור מבחני הסמכה אינטראקטיביים, צבור נקודות RoastCoins והשג תגי מומחה קפה בינלאומיים
        </p>
      </div>

      {/* Rewards & Rank Bar */}
      <div className="p-5 rounded-3xl bg-[#0a0808]/95 border border-amber-500/40 shadow-xl backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black font-black flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Award className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="text-sm font-bold text-stone-100">דרגת בריסטה נוכחית</div>
            <div className="text-xs text-amber-400 font-extrabold">Senior Home Barista (דרגה 3)</div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-950 border border-stone-800">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-xs text-stone-400">מאזן RoastCoins:</span>
          <span className="text-lg font-black text-amber-400 font-mono">{coins} 🪙</span>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((m) => {
          const isDone = completedModules[m.id];
          return (
            <div
              key={m.id}
              className={`p-6 rounded-3xl border backdrop-blur-2xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/50'
                  : 'bg-stone-900/40 border-stone-800/80 hover:border-amber-500/40'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {m.level}
                  </span>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <h3 className="text-base font-black text-stone-100">{m.title}</h3>
                <p className="text-xs text-stone-400 leading-relaxed">{m.desc}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-stone-800 pt-3 sm:pt-0">
                <span className="text-xs font-mono text-amber-400 font-bold">+{m.reward} 🪙</span>
                <button
                  onClick={() => toggleComplete(m.id, m.reward)}
                  className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all shadow-md ${
                    isDone
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:brightness-110'
                  }`}
                >
                  {isDone ? 'מבחן הושלם ✓' : 'התחל מבחן הסמכה ➔'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
