'use client';

import React, { useState } from 'react';
import { Award, Star, MessageSquarePlus, Sparkles, Layers, Globe, TrendingUp, Heart } from 'lucide-react';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface TastingNote {
  id: string;
  author: string;
  avatar: string;
  coffeeName: string;
  origin: string;
  scaScore: number;
  tags: string[];
  comment: string;
  likes: number;
  timeAgo: string;
}

const INITIAL_NOTES: TastingNote[] = [
  {
    id: '1',
    author: 'אריאל כהן (Q-Grader)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    coffeeName: 'Ethiopia Yirgacheffe G1 Wash',
    origin: 'אתיופיה',
    scaScore: 89.5,
    tags: ['פרחוני', 'יסמין', 'חמיצות הדרים', 'מתיקות דבש'],
    comment: 'חליטת V60 מדהימה! חמיצות נקייה מאוד שמזכירה ליים וברגמוט עם סיומת מתוקה של יסמין.',
    likes: 24,
    timeAgo: 'לפני שעתיים',
  },
  {
    id: '2',
    author: 'רוני בריסטה',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    coffeeName: 'Panama Geisha Hacienda La Esmeralda',
    origin: 'פנמה',
    scaScore: 94.0,
    tags: ['אפרסק', 'תה שחור', 'משמש', 'גוף קל משי'],
    comment: 'קפה חלומי. פרופיל טעמים מורכב להפליא, תווים בולטים של משמש בשל ותה פירות.',
    likes: 42,
    timeAgo: 'לפני 5 שעות',
  },
  {
    id: '3',
    author: 'דניאל לוי',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    coffeeName: 'Colombia Geisha Natural',
    origin: 'קולומביה',
    scaScore: 88.0,
    tags: ['שוקולד מריר', 'דובדבן', 'יין אדום'],
    comment: 'מיצוי אספרסו בלחץ 9 בר. גוף מלא מאוד עם תווים עמוקים של שוקולד ודובדבנים שחורים.',
    likes: 18,
    timeAgo: 'לפני יום',
  },
];

const ROAST_CARDS = [
  {
    id: 'c1',
    name: 'Panama Geisha Esmeralda',
    hebrewName: 'פנמה גיישה אסמרלדה G1',
    altitude: '1,800m',
    process: 'Natural Anaerobic',
    sca: 94.5,
    gradient: 'from-amber-500/20 to-rose-500/20',
    borderColor: 'border-amber-400/40',
  },
  {
    id: 'c2',
    name: 'Ethiopia Yirgacheffe Washed',
    hebrewName: 'אתיופיה ירגשף וואשד',
    altitude: '2,100m',
    process: 'Washed Heirloom',
    sca: 89.5,
    gradient: 'from-emerald-500/20 to-amber-500/20',
    borderColor: 'border-emerald-400/40',
  },
  {
    id: 'c3',
    name: 'Kenya Nyeri Peaberry',
    hebrewName: 'קניה ניארי פיברי AA',
    altitude: '1,950m',
    process: 'Double Washed',
    sca: 91.0,
    gradient: 'from-purple-500/20 to-cyan-500/20',
    borderColor: 'border-purple-400/40',
  },
];

export function LiveCuppingRoom() {
  const [notes, setNotes] = useState<TastingNote[]>(INITIAL_NOTES);
  const [activeTab, setActiveTab] = useState<'feed' | 'cards' | 'evaluator'>('feed');

  // Form states
  const [coffeeInput, setCoffeeInput] = useState('');
  const [originInput, setOriginInput] = useState('אתיופיה');
  const [commentInput, setCommentInput] = useState('');
  const [scaScoreInput, setScaScoreInput] = useState(88.0);
  const [tagInput, setTagInput] = useState('פרחוני, מתוק');

  const handleLike = (id: string) => {
    coffeeSound.playRoastCoinsChime();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n))
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coffeeInput || !commentInput) return;

    coffeeSound.playRoastCoinsChime();
    coffeeSound.speakHebrew(`חוות הדעת עבור ${coffeeInput} פורסמה ב-Cupping Room בהצלחה`);

    const newNote: TastingNote = {
      id: Date.now().toString(),
      author: 'חובב קפה (אתה)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      coffeeName: coffeeInput,
      origin: originInput,
      scaScore: Number(scaScoreInput),
      tags: tagInput.split(',').map((t) => t.trim()),
      comment: commentInput,
      likes: 1,
      timeAgo: 'עכשיו',
    };

    setNotes([newNote, ...notes]);
    setCoffeeInput('');
    setCommentInput('');
    setActiveTab('feed');
  };

  return (
    <section id="live-cupping-room" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-purple-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              סלון טעימות חברתי וקלפי אספנות
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gold-gradient tracking-tight">
              Live Cupping Room & RoastCards
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              שתף רשימות טעימה (Tasting Notes) לפי תקן SCA, אוספי קלפים דיגרטליים וחוויות קהילתיות.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-950 border border-stone-800">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'feed'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              פיד טעימות (Feed)
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'cards'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              קלפי אספנות (RoastCards)
            </button>
            <button
              onClick={() => setActiveTab('evaluator')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'evaluator'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              הוסף חוות דעת SCA
            </button>
          </div>
        </div>

        {/* TAB 1: Feed */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-stone-950/70 rounded-2xl p-5 border border-stone-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={note.avatar}
                        alt={note.author}
                        className="w-10 h-10 rounded-full object-cover border border-purple-400/30"
                      />
                      <div>
                        <span className="text-xs font-bold text-stone-200 block">{note.author}</span>
                        <span className="text-[10px] text-stone-500">{note.timeAgo}</span>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {note.scaScore}
                    </div>
                  </div>

                  <h4 className="text-sm font-extrabold text-purple-300 mb-1">{note.coffeeName}</h4>
                  <p className="text-xs text-stone-300 leading-relaxed mb-3">"{note.comment}"</p>

                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-[10px] text-stone-400 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-mono">מקור: {note.origin}</span>
                  <button
                    onClick={() => handleLike(note.id)}
                    className="flex items-center gap-1 text-stone-400 hover:text-rose-400 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-rose-500/20 text-rose-400" />
                    <span>{note.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: RoastCards Showcase */}
        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROAST_CARDS.map((card) => (
              <div
                key={card.id}
                className={`rounded-2xl p-6 border ${card.borderColor} bg-gradient-to-br ${card.gradient} liquid-glass relative overflow-hidden space-y-5 shadow-xl hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-stone-950/80 border border-stone-700 text-stone-300 font-mono text-[11px] font-bold">
                    {card.altitude}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-mono font-black text-sm">
                    <Award className="w-4 h-4" />
                    {card.sca} SCA
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-stone-100 mb-1">{card.hebrewName}</h3>
                  <p className="text-xs text-stone-400 font-mono">{card.name}</p>
                </div>

                <div className="pt-3 border-t border-stone-800/60 flex items-center justify-between text-xs font-semibold text-stone-300">
                  <span>שיטת עיבוד:</span>
                  <span className="text-purple-300 font-mono">{card.process}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Add Note Evaluator */}
        {activeTab === 'evaluator' && (
          <form onSubmit={handleAddNote} className="max-w-2xl mx-auto space-y-4 bg-stone-950/80 p-6 rounded-2xl border border-stone-800">
            <h3 className="text-sm font-extrabold text-purple-300 flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-purple-400" />
              הוספת חוות דעת סנסורית חדשה
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-300 mb-1 font-semibold">שם זן הקפה:</label>
                <input
                  type="text"
                  required
                  value={coffeeInput}
                  onChange={(e) => setCoffeeInput(e.target.value)}
                  placeholder="לדוגמה: Colombia Huila Supremo"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1 font-semibold">מדינה / מקור:</label>
                <input
                  type="text"
                  required
                  value={originInput}
                  onChange={(e) => setOriginInput(e.target.value)}
                  placeholder="קולומביה"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-300 mb-1 font-semibold">ציון SCA (0-100):</label>
                <input
                  type="number"
                  step="0.5"
                  min="70"
                  max="100"
                  value={scaScoreInput}
                  onChange={(e) => setScaScoreInput(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs font-bold focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1 font-semibold">תווי טעם (מופרדים בפסיק):</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="שוקולד, אגוזים, דבש"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1 font-semibold">תיאור החוויה והמיצוי:</label>
              <textarea
                required
                rows={3}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="תאר את החמיצות, הגוף, והארומה של הקפה..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-stone-950 font-black text-xs hover:brightness-110 transition-all shadow-lg shadow-purple-500/20"
            >
              פרסם חוות דעת ב-Cupping Room
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
