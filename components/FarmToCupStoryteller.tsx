'use client';

import React, { useState } from 'react';
import type { FarmStoryResult } from '@/app/api/gemini/farm-story/route';

const ORIGINS = [
  { name: 'אתיופיה יירגאשף', flag: '🇪🇹' },
  { name: 'קולומביה הואילה', flag: '🇨🇴' },
  { name: 'גואטמלה אנטיגואה', flag: '🇬🇹' },
  { name: 'סומטרה מנדלינג', flag: '🇮🇩' },
];

export default function FarmToCupStoryteller() {
  const [selectedOrigin, setSelectedOrigin] = useState(ORIGINS[0].name);
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<FarmStoryResult | null>(null);

  const fetchStory = async (originName: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/farm-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originName }),
      });
      const json = await res.json().catch(() => ({ success: false }));
      if (json && json.success) {
        setStory(json.data);
      }
    } catch (err) {
      console.error('Farm story error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full p-6 md:p-8 rounded-3xl bg-[#080606]/80 border border-amber-500/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(217,119,6,0.15)] text-white dir-rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 bg-amber-950/60 rounded-full border border-amber-500/30 mb-2">
            🌍 Farm-to-Cup Storyteller
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            מפת המקור ותרואר החקלאים
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            גלה את סיפורי החוות, גובה הגידול והחקלאים שמאחורי כל פול קפה
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
          🌱
        </div>
      </div>

      {/* Origin Selector Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ORIGINS.map((o) => (
          <button
            key={o.name}
            onClick={() => {
              setSelectedOrigin(o.name);
              fetchStory(o.name);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
              selectedOrigin === o.name
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold scale-105 shadow-lg'
                : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
            }`}
          >
            {o.flag} {o.name}
          </button>
        ))}
      </div>

      {loading && (
        <div className="p-8 text-center text-amber-400 text-sm animate-pulse">
          טוען טלמטריית חווה וסיפור תרואר... 🏔️
        </div>
      )}

      {/* Story Display Card */}
      {story && !loading && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 via-neutral-900/90 to-black border border-amber-500/30 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-amber-500/20">
            <div>
              <span className="text-xs text-amber-400 font-bold">חווה: {story.farmName}</span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">{story.farmerName}</h3>
              <p className="text-xs text-neutral-400">{story.region}, {story.country}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ⛰️ גובה: {story.altitudeMasl}m MASL
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ⭐ ניקוד SCA: {story.scaScore}
              </span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed mb-4">
            {story.farmerStory}
          </p>

          <div>
            <span className="text-xs text-amber-400 font-bold block mb-2">דגשי תרואר (Terroir Highlights):</span>
            <div className="flex flex-wrap gap-2">
              {story.terroirHighlights.map((h, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl text-xs bg-neutral-800/90 text-amber-200 border border-amber-500/20"
                >
                  ✓ {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
