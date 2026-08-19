'use client';

import React, { useState } from 'react';
import { Coffee, Flame, Plus, Check, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useHorizontalScroll } from '@/lib/hooks/useHorizontalScroll';

export interface CatalogItem {
  id: string;
  name: string;
  hebrewName: string;
  description: string;
  category: 'BEANS' | 'ESPRESSO' | 'SPECIALTY_LATTE' | 'V60_KIT' | 'CAPSULES' | 'PASTRY';
  price: number;
  roastLevel: number;
  origin: string;
  flavorNotes: string[];
  imageUrl: string;
}

const ITEMS: CatalogItem[] = [
  {
    id: 'item-beans-1',
    name: 'Ethiopia Yirgacheffe Heirloom 250g',
    hebrewName: 'פולי קפה אתיופיה ירגשף היירלום (250 גרם)',
    description: 'פולי קפה חד-זניים בקלייה בהירה-בינונית (4/12). ארומה משכרת של פרחי יסמין, נגיעות הדרים, אפרסק וסיומת דבש זכה.',
    category: 'BEANS',
    price: 58,
    roastLevel: 4,
    origin: 'אתיופיה (Yirgacheffe 2,000m)',
    flavorNotes: ['פרחי יסמין', 'הדרים רעננים', 'דבש בר', 'אפרסק לבן'],
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-beans-2',
    name: 'Sumatra Mandheling Single Origin 250g',
    hebrewName: 'פולי קפה סומטרה מנדלינג גורמה (250 גרם)',
    description: 'קלייה כהה ועשירה (9/12) בעיבוד Wet-Hulled אינדונזי קלאסי. גוף מלא מאוד, טעמי שוקולד כהה, תבלינים חמים ועץ ארז.',
    category: 'BEANS',
    price: 62,
    roastLevel: 9,
    origin: 'אינדונזיה (Sumatra Mandheling)',
    flavorNotes: ['שוקולד כהה', 'תבלינים מעושנים', 'עץ ארז', 'גוף מלא'],
    imageUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-beans-3',
    name: 'Guatemala Antigua Volcanic Beans 250g',
    hebrewName: 'פולי קפה גואטמלה אנטיגואה הר געש (250 גרם)',
    description: 'פולי 100% ערביקה שגודלו באדמת הר געש עשירה במינרלים. קלייה בינונית 6/12 עם טעמי קקאו, תפוז שרוף ותבלין קינמון.',
    category: 'BEANS',
    price: 55,
    roastLevel: 6,
    origin: 'גואטמלה (Antigua Volcanic 1,600m)',
    flavorNotes: ['קקאו עשיר', 'תפוז שרוף', 'קינמון', 'חומציות מאוזנת'],
    imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-beans-4',
    name: 'Costa Rica Tarrazu Honey Process 250g',
    hebrewName: 'פולי קפה קוסטה ריקה טאראזו Honey (250 גרם)',
    description: 'עיבוד Honey ייחודי המשאר מעטפת סוכרים טבעית על הפול. קלייה בינונית (5/12) עם מתיקות דבש, פירות יער שחורים וטרטריות קלה.',
    category: 'BEANS',
    price: 64,
    roastLevel: 5,
    origin: 'קוסטה ריקה (Tarrazu Reserve)',
    flavorNotes: ['מתיקות דבש', 'פירות יער', 'שקדים קלויים', 'וניל'],
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-beans-5',
    name: 'Panama Geisha Specialty Reserve 250g',
    hebrewName: 'פולי קפה פנמה גיישה ספציאליטי (250 גרם)',
    description: 'זן ה-Geisha הנחשב ליוקרתי בעולם! קלייה בהירה עדינה 3/12 עם פרופיל ארומטי נדיר של ברגמוט, מנגו, יסמין ופירות הדר.',
    category: 'BEANS',
    price: 120,
    roastLevel: 3,
    origin: 'פנמה (Boquete Valley Geisha)',
    flavorNotes: ['ברגמוט', 'אפרסק לבן', 'פרחי יסמין', 'מנגו מלטף'],
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-beans-6',
    name: 'Italian Velvet Espresso Beans 1kg',
    hebrewName: 'תערובת פולי אספרסו ולווט איטלקי (1 ק"ג)',
    description: 'תערובת הבית המנצחת לאספרסו ומשקאות חלב! קלייה כהה עוצמתית 11/12 ליצירת קרמה סמיכה, טעמי אגוזי לוז ושוקולד מריר.',
    category: 'BEANS',
    price: 139,
    roastLevel: 11,
    origin: 'ברזיל, הודו ואתיופיה',
    flavorNotes: ['קרמה סמיכה', 'אגוזי לוז', 'שוקולד מריר', 'סיומת ארוכה'],
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-1',
    name: 'Midnight Espresso Blend',
    hebrewName: 'תערובת אספרסו חצות (Midnight)',
    description: 'קלייה כהה 10/12 בסגנון איטלקי קלאסי. פרופיל טעמים עוצמתי של שוקולד מריר, אגוזי לוז קלויים וסיומת קרמל.',
    category: 'ESPRESSO',
    price: 18,
    roastLevel: 10,
    origin: 'אתיופיה וברזיל',
    flavorNotes: ['שוקולד מריר', 'אגוזי לוז', 'קרמל'],
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-2',
    name: 'Honey Oak Cortado',
    hebrewName: 'קורטדו דבש ועץ אלון',
    description: 'מנות אספרסו קטיפתיות בשילוב דבש דבורים טהור, חלב שיבולת שועל חם וניתוח עץ אלון מעושן.',
    category: 'SPECIALTY_LATTE',
    price: 22,
    roastLevel: 7,
    origin: 'קולומביה ספציאליטי',
    flavorNotes: ['דבש בר', 'שקדים קלויים', 'עץ אלון'],
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-3',
    name: 'Lavender Fields Latte',
    hebrewName: 'לאטה שדות לבנדר וקרמל',
    description: 'לאטה עדין ופרחוני עם תמצית לבנדר צרפתי אורגני, וניל מדגסקר וחלב שקדים מוקצף.',
    category: 'SPECIALTY_LATTE',
    price: 24,
    roastLevel: 6,
    origin: 'גואטמלה אנטיגואה',
    flavorNotes: ['לבנדר פרחוני', 'וניל מדגסקר', 'קרמל עדין'],
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-4',
    name: 'Ceramic V60 Dripper Kit',
    hebrewName: 'ערכת חליטה V60 קרמית גורמה',
    description: 'ערכת חליטה מקצועית כולל טפטפת קרמיקה שחורה מט, קנקן זכוכית עמיד לחום ו-50 ניירות חליטה יפניים.',
    category: 'V60_KIT',
    price: 189,
    roastLevel: 4,
    origin: 'יפן (Hario Compatible)',
    flavorNotes: ['מיצוי אחיד', 'צלול ופרחוני'],
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-5',
    name: '50 Aluminum Nespresso Capsules Pack',
    hebrewName: 'מארז 50 קפסולות אלומיניום תואמות Nespresso',
    description: 'חיסכון גורמה: 50 קפסולות מאלומיניום אטום לחמצן. תערובת פרימיום 100% ערביקה בקלייה בינונית-כהה.',
    category: 'CAPSULES',
    price: 95,
    roastLevel: 8,
    origin: 'קניה וברזיל',
    flavorNotes: ['גוף מלא', 'קרמה מוזהבת', '50 יחידות'],
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-6',
    name: 'Gourmet Almond Croissant',
    hebrewName: 'קרואסון שקדים גורמה חם',
    description: 'מאפה חמאה צרפתי פריך במילוי קרם שקדים עשיר ושבבי שקדים קלויים בתנור אבן.',
    category: 'PASTRY',
    price: 19,
    roastLevel: 1,
    origin: 'מאפיית הבית',
    flavorNotes: ['חמאה צרפתית', 'קרם שקדים'],
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
  },
];

const CATEGORIES = [
  { id: 'ALL', name: 'כל המוצרים' },
  { id: 'BEANS', name: 'פולי קפה & תערובות' },
  { id: 'ESPRESSO', name: 'אספרסו' },
  { id: 'SPECIALTY_LATTE', name: 'משקאות ספציאליטי' },
  { id: 'V60_KIT', name: 'ערכות חליטה' },
  { id: 'CAPSULES', name: 'קפסולות אלומיניום' },
  { id: 'PASTRY', name: 'מאפי גורמה' },
];

export const CoffeeCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedShots, setSelectedShots] = useState<Record<string, number>>({});
  const [selectedMilk, setSelectedMilk] = useState<Record<string, string>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const categoryRef = useHorizontalScroll<HTMLDivElement>();

  const { addItem } = useCartStore();

  const filteredItems = selectedCategory === 'ALL'
    ? ITEMS
    : ITEMS.filter((i) => i.category === selectedCategory);

  const handleAddToCart = (item: CatalogItem) => {
    const shots = selectedShots[item.id] || (item.category === 'ESPRESSO' ? 2 : 1);
    const milkType = selectedMilk[item.id] || 'חלב שיבולת שועל';

    addItem({
      coffeeItemId: item.id,
      name: item.name,
      hebrewName: item.hebrewName,
      price: item.price,
      shots,
      milkType,
      imageUrl: item.imageUrl,
    });

    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <section id="catalog" className="w-full py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
            תפריט הגורמה הדיגיטלי
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100">
            תערובות קפה, <span className="text-gold-gradient">ערכות חליטה ומאפים</span>
          </h2>
        </div>

        {/* Category Bar */}
        <div
          ref={categoryRef}
          className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar scrollbar-none select-none cursor-grab active:cursor-grabbing"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                  : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const currentShots = selectedShots[item.id] || (item.category === 'ESPRESSO' ? 2 : 1);
            const currentMilk = selectedMilk[item.id] || 'חלב שיבולת שועל';
            const isAdded = addedIds[item.id];

            return (
              <div
                key={item.id}
                className="liquid-glass-card rounded-3xl p-5 border border-amber-500/20 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-stone-800">
                    <img
                      src={item.imageUrl}
                      alt={item.hebrewName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-400 text-[11px] font-bold border border-amber-500/30">
                      קלייה {item.roastLevel}/12
                    </div>
                  </div>

                  {/* Product Metadata */}
                  <div className="space-y-2 mb-4">
                    <h3 className="font-extrabold text-base text-stone-100 group-hover:text-amber-400 transition-colors">
                      {item.hebrewName}
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Flavor Notes */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.flavorNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] border border-amber-500/20"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Customizers (Only for coffee drinks) */}
                  {(item.category === 'ESPRESSO' || item.category === 'SPECIALTY_LATTE') && (
                    <div className="space-y-3 bg-stone-950/60 p-3 rounded-2xl border border-stone-800/80 mb-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 text-[11px]">מנות אספרסו:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((s) => (
                            <button
                              key={s}
                              onClick={() => setSelectedShots((prev) => ({ ...prev, [item.id]: s }))}
                              className={`w-6 h-6 rounded-md font-bold text-[11px] transition-all ${
                                currentShots === s
                                  ? 'bg-amber-500 text-stone-950'
                                  : 'bg-stone-800 text-stone-400'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 text-[11px]">סוג חלב:</span>
                        <select
                          value={currentMilk}
                          onChange={(e) => setSelectedMilk((prev) => ({ ...prev, [item.id]: e.target.value }))}
                          className="bg-stone-900 border border-stone-800 text-stone-200 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
                        >
                          <option value="חלב שיבולת שועל">שיבולת שועל (Oatly)</option>
                          <option value="חלב רגיל">חלב רגיל 3%</option>
                          <option value="חלב שקדים">חלב שקדים</option>
                          <option value="ללא חלב">ללא חלב (קפה שחור)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                  <div>
                    <span className="text-[10px] text-stone-500 block">מחיר יחידה</span>
                    <span className="text-xl font-extrabold text-amber-400">₪{item.price}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                      isAdded
                        ? 'bg-emerald-500 text-stone-950'
                        : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>נוסף לעגלה</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>הוסף להזמנה</span>
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
};
