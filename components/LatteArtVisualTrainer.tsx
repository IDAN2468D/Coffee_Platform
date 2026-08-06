'use client';

import React, { useState } from 'react';
import { Flame, Sparkles, Droplets, Compass, Layers, CheckCircle2, ChevronLeft, Award, Play } from 'lucide-react';

interface PatternStep {
  title: string;
  angle: string;
  flowRate: string;
  description: string;
}

interface Pattern {
  id: string;
  nameHebrew: string;
  difficulty: 'קל' | 'בינוני' | 'מתקדם' | 'אמן';
  canvasColor: string;
  steps: PatternStep[];
}

export function LatteArtVisualTrainer() {
  const patterns: Pattern[] = [
    {
      id: 'heart',
      nameHebrew: 'לב קלאסי (Classic Heart)',
      difficulty: 'קל',
      canvasColor: 'from-amber-700/40 to-stone-900',
      steps: [
        {
          title: 'שלב 1: שבירת הקרמה והקנבס',
          angle: '45 מעלות ספל',
          flowRate: 'זרם דק וגבוה (10 ס"מ)',
          description: 'מזג במרכז הספל ממרחק גבוה כדי ליצור בסיס חום ואחיד של קרמה מבלי לצוף.'
        },
        {
          title: 'שלב 2: ירידה למרכז והקצפה',
          angle: 'הטיה הדרגתית של הספל לקו ישר',
          flowRate: 'זרם עבה ומהיר קרוב למשטח',
          description: 'קרב את פיית הקנקן ממש קרוב לקפה (1 ס"מ) והגבר את הקצב כדי להציף קצף לבן עגול.'
        },
        {
          title: 'שלב 3: חיתוך ויצירת הלב',
          angle: 'ספל ישר לחלוטין',
          flowRate: 'הרמה מהירה וציור קו דק קדימה',
          description: 'הארם את הקנקן לגובה וחתוך את מרכז העיגול קדימה ליצירת קימור הלב המושלם.'
        }
      ]
    },
    {
      id: 'rosetta',
      nameHebrew: 'רוזטה אלגנטית (Classic Rosetta)',
      difficulty: 'בינוני',
      canvasColor: 'from-emerald-700/40 to-stone-900',
      steps: [
        {
          title: 'שלב 1: יצירת בסיס עלה',
          angle: 'הטיה חזקה 45°',
          flowRate: 'זרם מהיר בבסיס הספל',
          description: 'התחל למזוג בחלק האחורי של הספל תוך כדי נענוע עדין מצד לצד (Wiggle).'
        },
        {
          title: 'שלב 2: נסיגה לאחור (Wiggle Back)',
          angle: 'יישור הדרגתי של הספל',
          flowRate: 'זרם אחיד במקצב קצבי',
          description: 'המשך לנענע את מפרק כף היד ונסוג לאט לאחור לכיוון שפת הספל הקדמית.'
        },
        {
          title: 'שלב 3: חיתוך הציור למעלה',
          angle: 'ספל ישר',
          flowRate: 'הרמה דקה ממרכז הציור קדימה',
          description: 'הארם את הזרם ומשוך קו דק דרך מרכז הציור מהקצה אל הבסיס ליצירת העלים.'
        }
      ]
    },
    {
      id: 'tulip',
      nameHebrew: 'טוליפ שכבות (Multi-Layer Tulip)',
      difficulty: 'מתקדם',
      canvasColor: 'from-amber-600/40 to-stone-900',
      steps: [
        {
          title: 'שלב 1: שכבת בסיס ראשונה',
          angle: 'הטיה 40°',
          flowRate: 'פעימת מזיגה קצרה ומהירה',
          description: 'קרב את הקנקן, תן דחיפה של קצף לבן ועצור את המזיגה מפתע.'
        },
        {
          title: 'שלב 2: דחיפת השכבות הבאות',
          angle: 'יישור הדרגתי',
          flowRate: '3-5 פעימות מזיגה בטור',
          description: 'מזג שכבה נוספת מעט מעל הראשונה ודחוף אותה פנימה ליצירת גביע הצבעוני.'
        },
        {
          title: 'שלב 3: חיתוך סופי עדין',
          angle: 'ספל ישר 90°',
          flowRate: 'הרמה לגובה וחיתוך מרכזי',
          description: 'הארם את הזרם ועבור בחדות דרך כל השכבות שנוצרו.'
        }
      ]
    },
    {
      id: 'swan',
      nameHebrew: 'ברזילאי / ברז אצילי (Noble Swan)',
      difficulty: 'אמן',
      canvasColor: 'from-cyan-700/40 to-stone-900',
      steps: [
        {
          title: 'שלב 1: יצירת כנף הברז',
          angle: 'הטיה קלה',
          flowRate: 'נענוע רוזטה צדי',
          description: 'מזג רוזטה נטויה בצד שמאל של הספל שמשמשת ככנף הנוצות של הברז.'
        },
        {
          title: 'שלב 2: שרטוט צוואר הברז',
          angle: 'יישור הספל',
          flowRate: 'זרם דק ורציף כלפי מעלה',
          description: 'משוך זרם דק מימין לכנף כלפי השפה העליונה ליצירת קימור הצוואר.'
        },
        {
          title: 'שלב 3: ראש הברז וחיתוך',
          angle: 'ספל ישר',
          flowRate: 'פעימת לב קטנה בראש',
          description: 'צור לב מיניאטורי בראש הצוואר וחתוך אותו אחורה ליצירת מקור הברז.'
        }
      ]
    }
  ];

  const [activePattern, setActivePattern] = useState<Pattern>(patterns[0]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Milk Physics Calculator state
  const [milkType, setMilkType] = useState<'whole' | 'oat' | 'almond' | 'soy'>('oat');
  const [targetTemp, setTargetTemp] = useState(62);
  const [steamBar, setSteamBar] = useState(1.4);

  const calculateMilkPhysics = () => {
    let stretchSec = 3.5;
    let vortexSec = 12.0;
    let score = 96;

    if (milkType === 'oat') {
      stretchSec = 4.2;
      vortexSec = 14.5;
      score = 98;
    } else if (milkType === 'almond') {
      stretchSec = 2.8;
      vortexSec = 10.0;
      score = 88;
    } else if (milkType === 'soy') {
      stretchSec = 3.0;
      vortexSec = 11.0;
      score = 90;
    }

    if (steamBar > 1.6) {
      stretchSec -= 0.8;
      vortexSec -= 2.5;
    }

    return { stretchSec: stretchSec.toFixed(1), vortexSec: vortexSec.toFixed(1), score };
  };

  const physics = calculateMilkPhysics();

  return (
    <div className="w-full liquid-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden my-8">
      {/* Title */}
      <div className="mb-8 border-b border-stone-800/80 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[11px] font-semibold mb-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Latte Art Visual Trainer & Microfoam Physics
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
              גלריית לאטה ארט <span className="text-cyan-glow">& מאמן טקסטורת חלב</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Pattern Selector & Visual Trainer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pattern Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {patterns.map(p => {
              const isActive = activePattern.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePattern(p);
                    setActiveStepIndex(0);
                  }}
                  className={`p-3.5 rounded-2xl transition-all border text-right ${
                    isActive
                      ? 'bg-amber-500 border-2 border-amber-300 shadow-lg shadow-amber-500/30'
                      : 'bg-stone-900/90 border-stone-800 hover:border-amber-500/60 hover:bg-stone-800'
                  }`}
                >
                  <div className={`text-[11px] mb-1 font-semibold ${isActive ? 'text-stone-950 font-extrabold' : 'text-amber-400'}`}>
                    רמה: {p.difficulty}
                  </div>
                  <div className={`text-sm font-black ${isActive ? 'text-stone-950' : 'text-stone-100'}`}>
                    {p.nameHebrew.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Pattern Card Visualizer */}
          <div className={`rounded-3xl bg-gradient-to-b ${activePattern.canvasColor} p-6 border border-stone-800 relative overflow-hidden shadow-inner`}>
            <div className="flex items-center justify-between gap-2 mb-6">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  תבנית נבחרת: {activePattern.difficulty}
                </span>
                <h3 className="text-xl font-black text-stone-100">{activePattern.nameHebrew}</h3>
              </div>

              <div className="flex items-center gap-1 bg-stone-950/80 px-3 py-1.5 rounded-full border border-stone-800 text-xs text-stone-300">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>שלב {activeStepIndex + 1} מתוך {activePattern.steps.length}</span>
              </div>
            </div>

            {/* Current Step Focus */}
            <div className="bg-stone-950/90 rounded-2xl p-6 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-amber-300">
                  {activePattern.steps[activeStepIndex].title}
                </h4>
                <div className="flex gap-2">
                  <button
                    disabled={activeStepIndex === 0}
                    onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-xl bg-stone-900 text-stone-300 text-xs font-bold disabled:opacity-30 hover:bg-stone-800"
                  >
                    הקודם
                  </button>
                  <button
                    disabled={activeStepIndex === activePattern.steps.length - 1}
                    onClick={() => setActiveStepIndex(prev => Math.min(activePattern.steps.length - 1, prev + 1))}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold disabled:opacity-30 hover:brightness-110"
                  >
                    הבא
                  </button>
                </div>
              </div>

              <p className="text-sm text-stone-300 leading-relaxed">
                {activePattern.steps[activeStepIndex].description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
                  <span className="text-[11px] text-stone-400 block mb-0.5">זווית ספל מומלצת:</span>
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5" />
                    {activePattern.steps[activeStepIndex].angle}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
                  <span className="text-[11px] text-stone-400 block mb-0.5">קצב וגובה המזיגה:</span>
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5" />
                    {activePattern.steps[activeStepIndex].flowRate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Milk Steaming Physics Calculator */}
        <div className="liquid-glass-card rounded-3xl p-6 border border-stone-800/80 space-y-6">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-4">
            <Flame className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-stone-100">מחשב פיזיקת הקצפת חלב</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-stone-400 block mb-1.5">סוג החלב / משקה צמחי</label>
              <select
                value={milkType}
                onChange={e => setMilkType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="oat">חלב שיבולת שועל (Oat Milk Barista Edition)</option>
                <option value="whole">חלב בקר מלא (Whole Milk 3% Fat)</option>
                <option value="almond">חלב שקדים (Almond Milk Barista)</option>
                <option value="soy">חלב סויה (Soy Barista)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs text-stone-300 mb-1">
                <span>טמפרטורת יעד:</span>
                <span className="font-bold text-rose-400 font-mono">{targetTemp}°C</span>
              </div>
              <input
                type="range"
                min="55"
                max="70"
                value={targetTemp}
                onChange={e => setTargetTemp(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-stone-900"
              />
              <span className="text-[10px] text-stone-500">מומלץ לאטה ארט: 60°C - 65°C</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-stone-300 mb-1">
                <span>לחץ סטימר קיטור:</span>
                <span className="font-bold text-amber-400 font-mono">{steamBar} Bar</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.1"
                value={steamBar}
                onChange={e => setSteamBar(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-stone-900"
              />
            </div>
          </div>

          {/* Results Box */}
          <div className="p-4 rounded-2xl bg-stone-950/90 border border-amber-500/20 space-y-3">
            <span className="text-xs font-bold text-amber-400 block border-b border-stone-800 pb-2">
              זמני עבודה מומלצים למילק-פואם משי:
            </span>

            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">שלב המתיחה (Stretch Phase):</span>
              <span className="font-bold text-amber-300 font-mono">{physics.stretchSec} שניות</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">שלב המערבולת (Vortex Phase):</span>
              <span className="font-bold text-cyan-300 font-mono">{physics.vortexSec} שניות</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-800">
              <span className="text-stone-300 font-semibold">מדד משיות וברק קצף:</span>
              <span className="font-extrabold text-emerald-400 font-mono">{physics.score} / 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatteArtVisualTrainer;
