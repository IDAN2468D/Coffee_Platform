'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Sparkles, Coffee, Sliders, CheckCircle, AlertCircle, Scale, Thermometer, Clock, Star } from 'lucide-react';

interface BrewLog {
  id: string;
  date: string;
  beanName: string;
  method: string;
  grindSetting: string;
  doseGrams: number;
  waterMl: number;
  tempCelsius: number;
  brewTimeSec: number;
  flavorProfile: 'sour' | 'bitter' | 'balanced' | 'sweet';
  rating: number;
  notes: string;
  aiFeedback: string;
}

export function PersonalBrewJournal() {
  const [logs, setLogs] = useState<BrewLog[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [beanName, setBeanName] = useState('אתיופיה יורגשף G1 (קליה בהירה)');
  const [method, setMethod] = useState('V60 Pour-Over');
  const [grindSetting, setGrindSetting] = useState('18 קליקים (Comandante C40)');
  const [doseGrams, setDoseGrams] = useState(18);
  const [waterMl, setWaterMl] = useState(300);
  const [tempCelsius, setTempCelsius] = useState(93);
  const [brewTimeSec, setBrewTimeSec] = useState(165);
  const [flavorProfile, setFlavorProfile] = useState<'sour' | 'bitter' | 'balanced' | 'sweet'>('balanced');
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('פרחוניות בולטת, חומציות הדרים מאוזנת וסיומת יסמין נקי');

  useEffect(() => {
    const saved = localStorage.getItem('digital_roast_brew_logs');
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default sample logs
      const samples: BrewLog[] = [
        {
          id: '1',
          date: '2026-08-04',
          beanName: 'אתיופיה יורגשף G1',
          method: 'V60 Pour-Over',
          grindSetting: '18 Clicks',
          doseGrams: 18,
          waterMl: 300,
          tempCelsius: 93,
          brewTimeSec: 165,
          flavorProfile: 'balanced',
          rating: 5,
          notes: 'סיומת הדרים מתוקה, גוף נקי וקליל',
          aiFeedback: 'חליטה אופטימלית! יחס 1:16.6 מדויק בתקן SCA Gold Cup.'
        },
        {
          id: '2',
          date: '2026-08-03',
          beanName: 'קולומבייה סופרמו חבית אלון',
          method: 'Espresso (9Bar)',
          grindSetting: '8 Clicks',
          doseGrams: 19,
          waterMl: 42,
          tempCelsius: 94,
          brewTimeSec: 22,
          flavorProfile: 'sour',
          rating: 3,
          notes: 'חמוץ מעט בשניות הראשונות, זרימה מהירה מדי',
          aiFeedback: 'תת-החלצה (Under-extracted): מומלץ לכוונן טחינה 1-2 קליקים דק יותר או להאריך זמן חליטה ל-27 שניות.'
        }
      ];
      setLogs(samples);
    }
  }, []);

  const saveLogs = (newLogs: BrewLog[]) => {
    setLogs(newLogs);
    localStorage.setItem('digital_roast_brew_logs', JSON.stringify(newLogs));
  };

  const generateAiFeedback = (profile: string, time: number, dose: number, water: number): string => {
    const ratio = (water / dose).toFixed(1);
    if (profile === 'sour') {
      return `תת-החלצה (Under-extracted) ביחס 1:${ratio}: הקפה חמוץ מדי. מומלץ לטחון דק יותר, להעלות טמפרטורה ב-2°C או להאריך את זמן החליטה.`;
    }
    if (profile === 'bitter') {
      return `יתר-החלצה (Over-extracted) ביחס 1:${ratio}: מורגשת מרירות יתרה. מומלץ לטחון גס יותר, להוריד טמפרטורה ל-90°C-92°C או לקצר את המים.`;
    }
    if (profile === 'sweet') {
      return `החלצה מצוינת! מתיקות טבעית גבוהה ביחס 1:${ratio}. שמור על פרמטרים אלו עבור זן קפה זה.`;
    }
    return `איזון מושלם! יחס חליטה של 1:${ratio} העניק מיצוי מאוזן בין חומציות למתיקות.`;
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const feedback = generateAiFeedback(flavorProfile, brewTimeSec, doseGrams, waterMl);
    const newEntry: BrewLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      beanName,
      method,
      grindSetting,
      doseGrams,
      waterMl,
      tempCelsius,
      brewTimeSec,
      flavorProfile,
      rating,
      notes,
      aiFeedback: feedback
    };
    const updated = [newEntry, ...logs];
    saveLogs(updated);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = logs.filter(l => l.id !== id);
    saveLogs(updated);
  };

  return (
    <div className="w-full liquid-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden my-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 border-b border-stone-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-semibold mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              AI Brew Logbook & Dial-In Assistant
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
              יומן חליטה אישי <span className="text-gold-gradient">& סייען Dial-in</span>
            </h2>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? 'סגור טופס' : 'תיעוד חליטה חדשה'}</span>
        </button>
      </div>

      {/* New Log Form Modal / Collapse */}
      {isFormOpen && (
        <form onSubmit={handleAddLog} className="mb-8 p-6 rounded-2xl bg-stone-950/80 border border-amber-500/30 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            פרמטרים לחליטה חדשה
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-stone-400 block mb-1">שם זן הקפה / הקלייה</label>
              <input
                type="text"
                required
                value={beanName}
                onChange={e => setBeanName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">שיטת חליטה</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option>V60 Pour-Over</option>
                <option>Espresso (9Bar)</option>
                <option>AeroPress</option>
                <option>French Press</option>
                <option>Cold Brew</option>
                <option>Chemex</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">דרגת טחינה (קליקים)</label>
              <input
                type="text"
                required
                value={grindSetting}
                onChange={e => setGrindSetting(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">מינון קפה (גרם)</label>
              <input
                type="number"
                step="0.5"
                required
                value={doseGrams}
                onChange={e => setDoseGrams(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">כמות מים (מ"ל)</label>
              <input
                type="number"
                required
                value={waterMl}
                onChange={e => setWaterMl(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">טמפרטורת מים (°C)</label>
              <input
                type="number"
                required
                value={tempCelsius}
                onChange={e => setTempCelsius(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">זמן חליטה (שניות)</label>
              <input
                type="number"
                required
                value={brewTimeSec}
                onChange={e => setBrewTimeSec(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">פרופיל הטעם שהתקבל</label>
              <select
                value={flavorProfile}
                onChange={e => setFlavorProfile(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="balanced">מאוזן ושלם (Balanced)</option>
                <option value="sweet">מתוק ופירותי (Sweet & Fruity)</option>
                <option value="sour">חמוץ / תת-החלצה (Sour / Under-extracted)</option>
                <option value="bitter">מר / יתר-החלצה (Bitter / Over-extracted)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">דירוג חוויה (1-5)</label>
              <div className="flex items-center gap-1 py-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-amber-400 focus:outline-none hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-stone-700'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-stone-400 block mb-1">הערות טעימה אישיות</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-stone-900 text-stone-400 text-xs hover:text-stone-200"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs hover:brightness-110 shadow-md shadow-amber-500/20"
            >
              שמור חליטה וקבל ניתוח Dial-In
            </button>
          </div>
        </form>
      )}

      {/* Logs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {logs.map(log => (
          <div key={log.id} className="liquid-glass-card rounded-2xl p-5 border border-stone-800/80 hover:border-amber-500/40 relative group">
            <button
              onClick={() => handleDelete(log.id)}
              className="absolute top-4 left-4 text-stone-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
              title="מחק חליטה"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] text-stone-400 font-mono">{log.date}</span>
              <div className="flex items-center gap-1">
                {[...Array(log.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <h3 className="text-base font-bold text-amber-300 mb-1 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-400" />
              {log.beanName}
            </h3>

            <div className="flex flex-wrap gap-2 text-[11px] text-stone-300 my-3 font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-stone-900/90 border border-stone-800 flex items-center gap-1">
                <Coffee className="w-3 h-3 text-amber-400" />
                {log.method}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-900/90 border border-stone-800 flex items-center gap-1">
                <Scale className="w-3 h-3 text-cyan-400" />
                {log.doseGrams}g : {log.waterMl}ml
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-900/90 border border-stone-800 flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-rose-400" />
                {log.tempCelsius}°C
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-900/90 border border-stone-800 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                {log.brewTimeSec} ש'
              </span>
            </div>

            {log.notes && (
              <p className="text-xs text-stone-400 italic mb-3 bg-stone-950/40 p-2.5 rounded-xl border border-stone-800/50">
                "{log.notes}"
              </p>
            )}

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">ניתוח Dial-in של AI:</span>
                <span>{log.aiFeedback}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PersonalBrewJournal;
