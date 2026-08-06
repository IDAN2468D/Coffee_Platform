'use client';

import React from 'react';
import { Coffee, ShieldCheck, Heart, Headset } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-obsidian border-t border-stone-800/80 pt-12 pb-8 mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-gold-gradient">THE DIGITAL ROAST</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              פלטפורמת קפה הגורמה המתקדמת בישראל. שילוב של טכנולוגיית Gemini 3.5 Multimodal AI,
              חליטות מדויקות ומערכת הזמנות אונליין מהירה.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-stone-200 font-bold text-sm mb-4">תפריט ומוצרים</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#catalog" className="hover:text-amber-400 transition-colors">תערובות אספרסו גורמה</a></li>
              <li><a href="#catalog" className="hover:text-amber-400 transition-colors">משקאות ספציאליטי</a></li>
              <li><a href="#catalog" className="hover:text-amber-400 transition-colors">ערכות חליטה V60</a></li>
              <li><a href="#catalog" className="hover:text-amber-400 transition-colors">קפסולות אלומיניום מוזהבות</a></li>
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="text-stone-200 font-bold text-sm mb-4">טכנולוגיית AI</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>ברמאי קולי וחזותי (Gemini 3.5)</li>
              <li>אלגוריתם התאמת קפה לפי אנרגיה</li>
              <li>מחשבון טיימר חליטת V60</li>
              <li>מערכת הזמנות אונליין ואישור אלקטרוני</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-stone-200 font-bold text-sm mb-4">שירות וסיוע</h4>
            <p className="text-stone-400 text-xs mb-3">צריכים עזרה או ייעוץ אישי מהברמאי שלנו?</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Headset className="w-4 h-4 text-amber-400" />
              <span>תמיכה ושירות אונליין 24/7</span>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex items-center gap-1">
            <span>© 2026 THE DIGITAL ROAST. נוצר באהבה לקפה גורמה</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              אבטחת MongoDB SSL / JWT
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
