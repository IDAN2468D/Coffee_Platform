'use client';

import React, { useState } from 'react';
import { Store, MapPin, Flame, Sparkles, ShoppingBag, Check, Clock, ShieldCheck, Star } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface RoasterItem {
  id: string;
  roasterName: string;
  location: string;
  coffeeTitle: string;
  hebrewTitle: string;
  roastDateDaysAgo: number;
  origin: string;
  roastLevel: string;
  price: number;
  rating: number;
  imageUrl: string;
}

const ROASTER_ITEMS: RoasterItem[] = [
  {
    id: 'roaster-1',
    roasterName: 'תל אביב Artisan Roasters',
    location: 'תל אביב-יפו',
    coffeeTitle: 'Ethiopia Sidama Bombe Natural',
    hebrewTitle: 'אתיופיה סידמה בומבה - ניטורל',
    roastDateDaysAgo: 2,
    origin: 'אתיופיה (1,900m)',
    roastLevel: 'קלייה בהירה (Light)',
    price: 76,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'roaster-2',
    roasterName: 'בית הקלייה ירושלים עתיקה',
    location: 'ירושלים',
    coffeeTitle: 'Colombia Pink Bourbon Anaerobic',
    hebrewTitle: 'קולומביה פינק בורבון אנאירובי',
    roastDateDaysAgo: 1,
    origin: 'קולומביה (1,850m)',
    roastLevel: 'קלייה בינונית (Medium)',
    price: 84,
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'roaster-3',
    roasterName: 'מעבדת הקפה של הגליל העליון',
    location: 'ראש פינה',
    coffeeTitle: 'Costa Rica Tarrazu Honey',
    hebrewTitle: 'קוסטה ריקה טראזו האני',
    roastDateDaysAgo: 3,
    origin: 'קוסטה ריקה (1,700m)',
    roastLevel: 'קלייה בהירה (Light/Medium)',
    price: 72,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&auto=format&fit=crop',
  },
];

export function MultiRoasterMarketplace() {
  const { addItem } = useCartStore();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (item: RoasterItem) => {
    coffeeSound.playCoffeeSteam();
    coffeeSound.playSuccessChime();
    coffeeSound.speakHebrew(`פולי הקפה ${item.hebrewTitle} מבית ${item.roasterName} נוספו בהצלחה למגירת ההזמנות`);
    addItem({
      coffeeItemId: item.id,
      name: item.coffeeTitle,
      hebrewName: `${item.hebrewTitle} (${item.roasterName})`,
      price: item.price,
      shots: 1,
      milkType: item.roastLevel,
      imageUrl: item.imageUrl,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section id="multi-roaster-marketplace" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-amber-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Store className="w-3.5 h-3.5 text-amber-400" />
              שוק קולים בוטיק עצמאיים בישראל
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gold-gradient tracking-tight">
              Artisanal Multi-Roaster Marketplace
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              הזמנה ישירה מבתי קלייה עצמאיים מובילים, כולל מדגש טריות מיום הקלייה (Roast Date Gauge).
            </p>
          </div>
        </div>

        {/* Grid of Roaster Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROASTER_ITEMS.map((item) => {
            const isJustRoasted = item.roastDateDaysAgo <= 2;
            return (
              <div
                key={item.id}
                className="bg-stone-950/80 rounded-2xl border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-xl space-y-4 p-5"
              >
                <div>
                  <div className="relative h-44 rounded-xl overflow-hidden mb-4">
                    <img
                      src={item.imageUrl}
                      alt={item.hebrewTitle}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />

                    {/* Freshness Badge Overlay */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-400/50 backdrop-blur-md text-amber-300 font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>נקלה לפני {item.roastDateDaysAgo} ימים!</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                    <span className="flex items-center gap-1 font-semibold text-stone-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {item.roasterName} ({item.location})
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {item.rating}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-stone-100 mb-1">{item.hebrewTitle}</h3>
                  <p className="text-xs text-stone-400 font-mono mb-3">{item.coffeeTitle}</p>

                  <div className="space-y-1.5 pt-3 border-t border-stone-800/80 text-xs font-semibold text-stone-300">
                    <div className="flex justify-between">
                      <span className="text-stone-400">מקור וגובה:</span>
                      <span className="text-amber-300 font-mono">{item.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">רמת קלייה:</span>
                      <span className="text-stone-200">{item.roastLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">מחיר למארז:</span>
                    <span className="text-xl font-black text-amber-400 font-mono">₪{item.price}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={addedId === item.id}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-80"
                  >
                    {addedId === item.id ? (
                      <>
                        <Check className="w-4 h-4 text-stone-950" />
                        <span>נוסף!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-stone-950" />
                        <span>הוסף לסל</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
