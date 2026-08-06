'use client';

import React, { useState } from 'react';
import { Zap, Feather, BookOpen, Dumbbell, Sparkles, Coffee, Sun, Moon, Sparkle } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

interface EnergyPreset {
  id: string;
  name: string;
  icon: any;
  energyRange: [number, number];
  description: string;
  caffeineMg: number;
  glycemicNotes: string;
  lTheanineNotes: string;
  recommendedCoffee: string;
  hebrewCoffeeName: string;
  shots: number;
  milkType: string;
  roastLevel: number;
  price: number;
  imageUrl: string;
}

const PRESETS: EnergyPreset[] = [
  {
    id: 'morning-focus',
    name: 'Morning Focus (8-10)',
    icon: Zap,
    energyRange: [8, 10],
    description: 'מנת קפאין עוצמתית להגברת הריכוז וחדות מחשבתית בשעות הבוקר המוקדמות.',
    caffeineMg: 225,
    glycemicNotes: 'חלב שקדים דל גליקמי לשמירה על רמת סוכר יציבה ללא נפילות אנרגיה.',
    lTheanineNotes: 'איזון דופמינרגי גבוה לפוקוס ממושך.',
    recommendedCoffee: 'Midnight Espresso Triple',
    hebrewCoffeeName: 'תערובת חצות אספרסו משולש',
    shots: 3,
    milkType: 'חלב שקדים דל גליקמי',
    roastLevel: 10,
    price: 22,
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'afternoon-slump',
    name: 'Afternoon Slump (5-7)',
    icon: Sun,
    energyRange: [5, 7],
    description: 'התאוששות מעייפות אחה"צ עם זריקת גלוקוז טבעית מדבש בר טהור.',
    caffeineMg: 150,
    glycemicNotes: 'דבש בר טבעי המספק גלוקוז זמין למוח בזמן ירידת עירנות.',
    lTheanineNotes: 'חיזוק ממוקד של 150mg קפאין.',
    recommendedCoffee: 'Honey Oak Cortado',
    hebrewCoffeeName: 'קורטדו דבש ועץ אלון',
    shots: 2,
    milkType: 'חלב שיבולת שועל',
    roastLevel: 7,
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'creative-flow',
    name: 'Creative Flow (6-8)',
    icon: Sparkle,
    energyRange: [6, 8],
    description: 'חליטה זנית נקייה מאתיופיה המעוררת חשיבה יצירתית ללא כבדות.',
    caffeineMg: 180,
    glycemicNotes: 'ללא סוכר או חלב – 0 קלוריות לחשיבה צלולה.',
    lTheanineNotes: 'חמיצות אתיופית טבעית הממריצה את קליפת המוח.',
    recommendedCoffee: 'V60 Single Origin Ethiopian',
    hebrewCoffeeName: 'חליטת V60 חד-זנית אתיופית',
    shots: 1,
    milkType: 'ללא חלב (Pure Extraction)',
    roastLevel: 4,
    price: 24,
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'post-workout',
    name: 'Post-Workout (8-10)',
    icon: Dumbbell,
    energyRange: [8, 10],
    description: 'מינון קפאין גבוה בחליטה קרה להגברת קצב חילוף החומרים והתאוששות.',
    caffeineMg: 300,
    glycemicNotes: 'ספיגה מהירה של 300mg קפאין pre/post workout.',
    lTheanineNotes: 'מקסום זרימת דם ואספקת חמצן לשרירים.',
    recommendedCoffee: 'Nitro Cold Brew Extraction',
    hebrewCoffeeName: 'חליטת נייטרו קרה 300mg',
    shots: 3,
    milkType: 'קרח צלול בלבד',
    roastLevel: 5,
    price: 28,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'evening-chill',
    name: 'Evening Chill (1-4)',
    icon: Moon,
    energyRange: [1, 4],
    description: 'משקה ערב מרגיע עם מעט קפאין, לבנדר אורגני ומקדמי L-theanine לרגיעה.',
    caffeineMg: 40,
    glycemicNotes: 'חלב שיבולת שועל עשיר במקדמי L-theanine לאיזון מערכת העצבים.',
    lTheanineNotes: 'תמיכה בשינה איכותית ורגיעה עמוקה.',
    recommendedCoffee: 'Lavender Fields Decaf Latte',
    hebrewCoffeeName: 'לאטה לבנדר וקרמל עדין',
    shots: 1,
    milkType: 'חלב שיבולת שועל מרגיע',
    roastLevel: 6,
    price: 26,
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80',
  },
];

export const BioEnergyMatcher: React.FC = () => {
  const [energyLevel, setEnergyLevel] = useState<number>(7);
  const [selectedPreset, setSelectedPreset] = useState<EnergyPreset>(PRESETS[1]);
  const { addItem } = useCartStore();

  const handleSliderChange = (val: number) => {
    setEnergyLevel(val);
    const matched = PRESETS.find(
      (p) => val >= p.energyRange[0] && val <= p.energyRange[1]
    ) || PRESETS[0];
    setSelectedPreset(matched);
  };

  const handleAddToCart = () => {
    addItem({
      coffeeItemId: selectedPreset.id,
      name: selectedPreset.recommendedCoffee,
      hebrewName: selectedPreset.hebrewCoffeeName,
      price: selectedPreset.price,
      shots: selectedPreset.shots,
      milkType: selectedPreset.milkType,
      imageUrl: selectedPreset.imageUrl,
    });
  };

  return (
    <section id="bio-energy" className="w-full py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini Bio-Energy Matcher Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 mb-4">
            התאמת קפה לפי <span className="text-gold-gradient">רמת אנרגיה ומצב ביולוגי</span>
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            השתמש בסליידר רמת האנרגיה (1-10) או בחר מקצב ביולוגי. המנוע יתאים את מינון הקפאין (mg),
            האינדקס הגליקמי ומקדמי ה-L-theanine המדויקים עבורך.
          </p>
        </div>

        {/* Energy Level Slider (1-10) */}
        <div className="liquid-glass rounded-3xl p-6 mb-10 border border-amber-500/30 max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-300">סליידר רמת אנרגיה מבוקשת:</span>
            <span className="text-amber-400 font-mono font-extrabold text-base bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
              רמה {energyLevel} / 10
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={energyLevel}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-900 rounded-lg"
          />

          <div className="flex justify-between text-[11px] text-stone-500 font-mono">
            <span>1 (רגיעה וערב)</span>
            <span>5 (אנרגיה בינונית)</span>
            <span>10 (פוקוס מקסימלי)</span>
          </div>
        </div>

        {/* Quick Bio-Rhythm Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          {PRESETS.map((preset) => {
            const IconComp = preset.icon;
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset);
                  setEnergyLevel(Math.round((preset.energyRange[0] + preset.energyRange[1]) / 2));
                }}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'liquid-glass border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/50'
                    : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-950/60 text-amber-400">
                    {preset.caffeineMg}mg
                  </span>
                </div>

                <div>
                  <h4 className={`font-bold text-xs ${isSelected ? 'text-stone-100' : 'text-stone-300'}`}>
                    {preset.name}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Recommendation Card */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative group">
            <div className="aspect-square rounded-2xl overflow-hidden border border-stone-700/60 shadow-xl">
              <img
                src={selectedPreset.imageUrl}
                alt={selectedPreset.hebrewCoffeeName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-amber-500/30">
              קלייה {selectedPreset.roastLevel}/12
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block mb-1">
                התאמה ביולוגית שנבחרה
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
                {selectedPreset.hebrewCoffeeName}
              </h3>
              <p className="text-xs text-stone-400 mt-1 font-mono">{selectedPreset.recommendedCoffee}</p>
            </div>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">{selectedPreset.description}</p>

            {/* Scientific Biological Metadata */}
            <div className="space-y-2 bg-stone-950/60 p-4 rounded-2xl border border-stone-800 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold whitespace-nowrap">אינדקס גליקמי:</span>
                <span className="text-stone-300">{selectedPreset.glycemicNotes}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold whitespace-nowrap">איזון נוירולוגי (L-theanine):</span>
                <span className="text-stone-300">{selectedPreset.lTheanineNotes}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block">קפאין משוער</span>
                <span className="text-sm font-extrabold text-amber-400">{selectedPreset.caffeineMg} mg</span>
              </div>
              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block">מספר שוטים</span>
                <span className="text-sm font-extrabold text-amber-400">{selectedPreset.shots} אספרסו</span>
              </div>
              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block">חלב / בסיס</span>
                <span className="text-xs font-extrabold text-stone-200 truncate block">{selectedPreset.milkType}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-800">
              <div>
                <span className="text-stone-400 text-xs block">מחיר</span>
                <span className="text-2xl font-black text-amber-400">₪{selectedPreset.price}</span>
              </div>

              <button
                onClick={handleAddToCart}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Coffee className="w-4 h-4" />
                <span>הוסף להזמנה</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
