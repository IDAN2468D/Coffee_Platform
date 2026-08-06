'use client';

import React, { useState } from 'react';
import { Globe, Award, Mountain, Droplets, Compass, Sparkles } from 'lucide-react';

interface OriginRecord {
  id: string;
  country: string;
  region: string;
  hebrewName: string;
  altitude: string;
  process: string;
  scaScore: number;
  flavorNotes: string[];
  description: string;
  imageUrl: string;
}

const ORIGINS: OriginRecord[] = [
  {
    id: 'ethiopia',
    country: 'אתיופיה (Ethiopia)',
    region: 'יירגאשף (Yirgacheffe)',
    hebrewName: 'אתיופיה יירגאשף - 2,100m MASL',
    altitude: '2,100m MASL',
    process: 'Washed (שטיפה מלאה)',
    scaScore: 91.5,
    flavorNotes: ['פרחי יסמין', 'ציטרוס ברגמוט', 'דבש בר'],
    description: 'מגדלי ספציאליטי בגובה 2,100 מטר מעל פני הים. פולים שטופים בעלי חמיצות הדרית עדינה וארומה פרחונית מהפנטת.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'colombia',
    country: 'קולומביה (Colombia)',
    region: 'הוילה (Huila)',
    hebrewName: 'קולומביה הוילה - Anaerobic Fermentation',
    altitude: '1,850m MASL',
    process: 'Anaerobic Fermentation (תסיסה אנאירובית 72 שעות)',
    scaScore: 89.0,
    flavorNotes: ['תפוח ירוק', 'שוקולד חלב', 'קרמל דבורים'],
    description: 'תהליך תסיסה אנאירובית מתקדם במיכלי נירוסטה אטומים. מעניק מתיקות פירותית עמוקה וגוף קטיפתי עשיר.',
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'brazil',
    country: 'ברזיל (Brazil)',
    region: 'מוג\'יאנה (Mogiana)',
    hebrewName: 'ברזיל מוג\'יאנה - Natural Process',
    altitude: '1,200m MASL',
    process: 'Natural (ייבוש טבעי בשמש)',
    scaScore: 87.5,
    flavorNotes: ['אגוזי לוז קלויים', 'קקאו כהה', 'סירופ מייפל'],
    description: 'ייבוש טבעי תחת שמש ברזילאית חמה. פולים בעלי גוף מלא, מרירות שוקולדית עשירה וקרמה עבה ויציבה.',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
  },
];

export const CropsterOriginMap: React.FC = () => {
  const [selectedOrigin, setSelectedOrigin] = useState<OriginRecord>(ORIGINS[0]);

  return (
    <section id="origin-map" className="w-full py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Globe className="w-3.5 h-3.5" />
            Cropster Origin Story & Direct-Trade Traceability
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 mb-4">
            מפת המקור וסיפורי <span className="text-gold-gradient">פולי הקפה Direct-Trade</span>
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            עקוב אחר מסלול הפולים מהמטעים הגבוהים באתיופיה, קולומביה וברזיל: נתוני גובה (MASL), שיטות עיבוד מתקדמות ודירוג SCA קפדני.
          </p>
        </div>

        {/* Origin Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {ORIGINS.map((origin) => {
            const isSelected = selectedOrigin.id === origin.id;
            return (
              <button
                key={origin.id}
                onClick={() => setSelectedOrigin(origin)}
                className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'liquid-glass border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/50'
                    : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5" />
                    {origin.region}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    SCA {origin.scaScore}
                  </span>
                </div>

                <div>
                  <h4 className={`font-extrabold text-sm mb-1 ${isSelected ? 'text-stone-100' : 'text-stone-300'}`}>
                    {origin.country}
                  </h4>
                  <span className="text-[11px] text-stone-400 font-mono block">
                    {origin.altitude} | {origin.process}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Origin Story Showcase Card */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-5 relative group">
            <div className="aspect-square rounded-2xl overflow-hidden border border-stone-700/60 shadow-xl">
              <img
                src={selectedOrigin.imageUrl}
                alt={selectedOrigin.hebrewName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              SCA Score: {selectedOrigin.scaScore} / 100
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block mb-1">
                מקור Direct-Trade מאומת (Cropster Spec)
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
                {selectedOrigin.hebrewName}
              </h3>
              <p className="text-xs text-stone-400 mt-1 font-mono">{selectedOrigin.country} - {selectedOrigin.region}</p>
            </div>

            <p className="text-stone-300 text-sm leading-relaxed">{selectedOrigin.description}</p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800 flex items-center gap-2">
                <Mountain className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-[10px] text-stone-400 block">גובה גידול למעלה מים:</span>
                  <span className="font-bold text-stone-200 font-mono">{selectedOrigin.altitude}</span>
                </div>
              </div>

              <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-stone-400 block">שיטת עיבוד הפולים:</span>
                  <span className="font-bold text-stone-200">{selectedOrigin.process}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs text-stone-400 block mb-2 font-semibold">פרופיל טעמים אופייני לחבל הארץ:</span>
              <div className="flex flex-wrap gap-2">
                {selectedOrigin.flavorNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/30"
                  >
                    ✨ {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
