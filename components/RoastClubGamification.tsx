'use client';

import React, { useState } from 'react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export default function RoastClubGamification() {
  const [roastCoins, setRoastCoins] = useState(340);
  const [userTier, setUserTier] = useState('Roast Enthusiast');
  const [completedQuests, setCompletedQuests] = useState<number[]>([]);

  const QUESTS = [
    { id: 1, title: '☕ חליטת V60 יומית', reward: 25, desc: 'השלמת חליטת V60 עם טיימר ה-Brew Master' },
    { id: 2, title: '📸 סריקת פולי קפה', reward: 30, desc: 'סריקת פולים עם מודל Gemini Multimodal Barista' },
    { id: 3, title: '🍷 התאמת סומלייה', reward: 20, desc: 'ביצוע התאמת קפה ומאפה ב-Sommelier' },
    { id: 4, title: '📦 חידוש מלאי בוואטסאפ', reward: 100, desc: 'ביצוע הזמנה חודשית של פולים בקלייה טרייה' },
  ];

  const handleCompleteQuest = (questId: number, reward: number) => {
    if (!completedQuests.includes(questId)) {
      coffeeSound.playRoastCoinsChime();
      const newCoins = roastCoins + reward;
      setRoastCoins(newCoins);
      setCompletedQuests([...completedQuests, questId]);

      if (newCoins > 600) {
        setUserTier('Master Barista 🏆');
      } else if (newCoins > 200) {
        setUserTier('Roast Enthusiast 🌟');
      }
    }
  };

  return (
    <section className="relative w-full p-6 md:p-8 rounded-3xl bg-[#080606]/80 border border-amber-500/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(217,119,6,0.15)] text-white dir-rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 bg-amber-950/60 rounded-full border border-amber-500/30 mb-2">
            🏆 Roast Club Gamification
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            מועדון הבריסטות וההישגים
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            צבור RoastCoins והתקדם בדרגות הבריסטה המקצועיות
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
          🪙
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-neutral-900 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400">מאזן RoastCoins:</span>
            <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{roastCoins} 🪙</h3>
          </div>
          <span className="text-xs text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 font-semibold">
            +15% הנחה בחנות
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 to-neutral-900 border border-orange-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400">דרגת בריסטה נוכחית:</span>
            <h3 className="text-2xl font-extrabold text-orange-300 mt-1">{userTier}</h3>
          </div>
          <span className="text-xs text-neutral-400">דרגה הבאה: 600 Coins</span>
        </div>
      </div>

      {/* Quests List */}
      <h3 className="text-sm font-bold text-amber-200 mb-3">משימות בריסטה יומיות:</h3>
      <div className="space-y-3">
        {QUESTS.map((quest) => {
          const isDone = completedQuests.includes(quest.id);
          return (
            <div
              key={quest.id}
              className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between transition-all"
            >
              <div>
                <h4 className="text-xs md:text-sm font-bold text-white">{quest.title}</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">{quest.desc}</p>
              </div>

              <button
                onClick={() => handleCompleteQuest(quest.id, quest.reward)}
                disabled={isDone}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md'
                }`}
              >
                {isDone ? 'הושלם! ✓' : `+${quest.reward} 🪙`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
