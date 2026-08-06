'use client';

import React, { useState } from 'react';
import { Compass, Cookie, Sparkles, Award } from 'lucide-react';

interface FlavorProfile {
  sweetness: number; // 1-10
  acidity: number;   // 1-10
  bitterness: number;// 1-10
  body: number;      // 1-10
  aftertaste: number;// 1-10
}

export const SensoryRadarWheel: React.FC = () => {
  const [profile, setProfile] = useState<FlavorProfile>({
    sweetness: 8,
    acidity: 7,
    bitterness: 4,
    body: 8,
    aftertaste: 9,
  });

  const updateAxis = (axis: keyof FlavorProfile, value: number) => {
    setProfile((prev) => ({ ...prev, [axis]: value }));
  };

  // Pastry Sommelier Recommendation Algorithm based on body & acidity
  const getSommelierPairing = () => {
    if (profile.acidity >= 7 && profile.body <= 6) {
      return {
        name: 'קרואסון חמאה צרפתי פריך',
        description: 'החמאה העשירה של המאפה מאזנת באופן נהדר את החומציות הציטרוסית הגבוהה של החליטה.',
        matchPercent: 98,
      };
    }
    if (profile.bitterness >= 7 || profile.body >= 8) {
      return {
        name: 'טארט שוקולד מריר 70% ואגוזי לוז',
        description: 'הגוף המלא והמרירות העשירה של הקפה מתחברים בהרמוניה לעומק השוקולד הכהה.',
        matchPercent: 96,
      };
    }
    if (profile.sweetness >= 7) {
      return {
        name: 'קרואסון שקדים גורמה בתנור אבן',
        description: 'המתיקות הטבעית של הדבש והשקדים מעצימה את הארומה הפרחונית של המשקה.',
        matchPercent: 97,
      };
    }
    return {
      name: 'בריוש וניל מדגסקר ודבש',
      description: 'מאפה מאוזן ועדין המתאים במדויק לפרופיל טעמים הרמוני וחלבי.',
      matchPercent: 94,
    };
  };

  const pairing = getSommelierPairing();

  // SVG Radar Wheel Points Calculation
  const center = 120;
  const radius = 90;
  const axes = [
    { label: 'מתיקות', key: 'sweetness' as const, angle: -90 },
    { label: 'חומציות', key: 'acidity' as const, angle: -18 },
    { label: 'גוף (Body)', key: 'body' as const, angle: 54 },
    { label: 'סיומת', key: 'aftertaste' as const, angle: 126 },
    { label: 'מרירות', key: 'bitterness' as const, angle: 198 },
  ];

  const getCoordinates = (value: number, angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (value / 10) * radius;
    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);
    return { x, y };
  };

  const polygonPoints = axes
    .map((axis) => {
      const val = profile[axis.key];
      const { x, y } = getCoordinates(val, axis.angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <section id="sensory-radar" className="w-full py-16 bg-stone-950/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Compass className="w-4 h-4 text-amber-400" />
            SCA 5-Axis Sensory Radar & Pastry Sommelier
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 mb-3">
            גלגל הטעמים הריחי 5-צירים <span className="text-gold-gradient">וסומלייה המאפים</span>
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
            כוונן את 5 צירי הטעם לפי העדפתך האישית וקבל התאמת מאפה גורמה קולינרית מבוססת ניתוח חומציות וגוף הקפה.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Radar Canvas Card */}
          <div className="lg:col-span-6 liquid-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 flex flex-col items-center shadow-2xl">
            <div className="flex items-center justify-between w-full mb-4 pb-2 border-b border-stone-800">
              <span className="text-xs font-bold text-stone-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                מפה סנסורית (SCA Cupping Radar)
              </span>
              <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Score: 92.8
              </span>
            </div>

            {/* SVG Radar Graphic */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4">
              <svg viewBox="0 0 240 240" className="w-full h-full">
                {/* Concentric Web Rings (20%, 40%, 60%, 80%, 100%) */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, idx) => {
                  const r = radius * level;
                  const ringPoints = axes
                    .map((axis) => {
                      const angleRad = (axis.angle * Math.PI) / 180;
                      return `${center + r * Math.cos(angleRad)},${center + r * Math.sin(angleRad)}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={idx}
                      points={ringPoints}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Axis Radial Lines */}
                {axes.map((axis, idx) => {
                  const { x, y } = getCoordinates(10, axis.angle);
                  return (
                    <line
                      key={idx}
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke="rgba(245, 158, 11, 0.25)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Active Flavor Polygon Area */}
                <polygon
                  points={polygonPoints}
                  fill="rgba(245, 158, 11, 0.35)"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Data Points */}
                {axes.map((axis, idx) => {
                  const val = profile[axis.key];
                  const { x, y } = getCoordinates(val, axis.angle);
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="4"
                      className="fill-amber-400 stroke-stone-950 stroke-2 transition-all duration-300"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Axes Labels */}
            <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs">
              {axes.map((a) => (
                <span
                  key={a.key}
                  className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 font-semibold"
                >
                  {a.label}: <strong className="text-amber-400">{profile[a.key]}</strong>/10
                </span>
              ))}
            </div>
          </div>

          {/* Controls & Pastry Sommelier Output */}
          <div className="lg:col-span-6 space-y-6">
            {/* Sliders Box */}
            <div className="bg-stone-900/80 p-6 rounded-3xl border border-stone-800 space-y-4">
              <h3 className="text-sm font-bold text-stone-200 border-b border-stone-800 pb-2">
                כיוונון צירי הטעם בזמן אמת:
              </h3>

              {axes.map((axis) => (
                <div key={axis.key} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-300 font-semibold">{axis.label}:</span>
                    <span className="text-amber-400 font-mono font-bold">{profile[axis.key]} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={profile[axis.key]}
                    onChange={(e) => updateAxis(axis.key, Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Sommelier Pairing Recommendation Card */}
            <div className="liquid-glass rounded-3xl p-6 border border-emerald-500/40 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <Cookie className="w-4 h-4" />
                  התאמת סומלייה המאפים (Pastry Sommelier)
                </span>
                <span className="text-xs font-bold font-mono bg-emerald-500/20 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-500/30">
                  {pairing.matchPercent}% התאמה
                </span>
              </div>

              <h4 className="text-base font-black text-stone-100">{pairing.name}</h4>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                {pairing.description}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold pt-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>מומלץ להגיש בטמפרטורה של 65°C לצד הקפה שנבחר</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
