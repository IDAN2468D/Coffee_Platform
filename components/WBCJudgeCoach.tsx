'use client';

import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, Trophy, Sparkles, Star } from 'lucide-react';

export default function WBCJudgeCoach() {
  const [espressoScore, setEspressoScore] = useState<number>(26); // max 30
  const [milkBevScore, setMilkBevScore] = useState<number>(25); // max 30
  const [signatureDrinkScore, setSignatureDrinkScore] = useState<number>(27); // max 30
  const [techWorkflowScore, setTechWorkflowScore] = useState<number>(9); // max 10

  const totalScore = espressoScore + milkBevScore + signatureDrinkScore + techWorkflowScore;

  const getRankTitle = () => {
    if (totalScore >= 92) return { title: 'WBC World Champion (אלוף העולם)', color: 'text-amber-400', badge: 'זהב' };
    if (totalScore >= 80) return { title: 'WBC Finalist (פיינליסט בינלאומי)', color: 'text-cyan-400', badge: 'כסף' };
    if (totalScore >= 65) return { title: 'National Champion (אלוף ישראל)', color: 'text-emerald-400', badge: 'ארד' };
    return { title: 'Certified Senior Barista (בריסטה מוסמך)', color: 'text-gray-300', badge: 'תעודה' };
  };

  const rank = getRankTitle();

  return (
    <div dir="rtl" className="w-full max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
          <Trophy className="w-4 h-4" />
          <span>Official SCA / WBC Judge Standard</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          מאמן שופטי תחרות הבריסטה העולמית (WBC Judge Coach)
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          סימולטור שפיטה רשמי לפי 100 נקודות תקן תחרות הבריסטה העולמית. דרג את מנות האספרסו, משקאות החלב ומנה הדגל.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Score Card Controls */}
        <div className="lg:col-span-7 space-y-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            טופס ניקוד שופט חומרי וטקטילי (WBC Scorecard)
          </h2>

          {/* Espresso Course */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300">
              <span>1. מנת אספרסו (Espresso Course - 30 נק׳):</span>
              <span className="font-bold text-amber-400">{espressoScore} / 30</span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              value={espressoScore}
              onChange={(e) => setEspressoScore(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Milk Beverage */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300">
              <span>2. משקה חלב (Milk Beverage Course - 30 נק׳):</span>
              <span className="font-bold text-amber-400">{milkBevScore} / 30</span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              value={milkBevScore}
              onChange={(e) => setMilkBevScore(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Signature Drink */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300">
              <span>3. משקה דגל אישי (Signature Drink Course - 30 נק׳):</span>
              <span className="font-bold text-purple-400">{signatureDrinkScore} / 30</span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              value={signatureDrinkScore}
              onChange={(e) => setSignatureDrinkScore(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Technical Workflow */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300">
              <span>4. זרימת עבודה טכנית וניקיון (Technical Workflow - 10 נק׳):</span>
              <span className="font-bold text-cyan-400">{techWorkflowScore} / 10</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              value={techWorkflowScore}
              onChange={(e) => setTechWorkflowScore(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Final Rank & Summary */}
        <div className="lg:col-span-5 space-y-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6 text-center">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">ציון שופטים כולל</span>
          <div className="text-6xl font-black text-amber-400 my-2">{totalScore}</div>
          <span className="text-xs text-gray-400">מתוך 100 נקודות WBC</span>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="text-xs text-gray-400">דרגה והסמכה שהושגה:</div>
            <div className={`text-xl font-bold ${rank.color}`}>{rank.title}</div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[10px] font-semibold text-white">
              מדליית {rank.badge}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
