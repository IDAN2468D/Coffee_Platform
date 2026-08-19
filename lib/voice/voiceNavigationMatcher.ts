export interface VoiceRouteTarget {
  id: string;
  path: string;
  label: string;
  description: string;
  category: 'shop' | 'ai' | 'lab' | 'roast' | 'b2b' | 'calendar';
  keywords: string[];
  spokenConfirmation: string;
}

export const VOICE_NAV_ROUTES: VoiceRouteTarget[] = [
  // Shop & Catalog
  {
    id: 'catalog',
    path: '/catalog',
    label: 'תפריט פולים וגורמה',
    description: 'קטלוג פולים, תערובות מיוחדות וציוד',
    category: 'shop',
    keywords: ['קטלוג', 'פולים', 'תפריט', 'חנות', 'לקנות קפה', 'מוצרים', 'קפה לקנייה', 'catalog', 'shop'],
    spokenConfirmation: 'מעביר אותך לקטלוג פולי הקפה והגורמה',
  },
  {
    id: 'home',
    path: '/home',
    label: 'דף הבית הראשי',
    description: 'מסך הבית של The Digital Roast',
    category: 'shop',
    keywords: ['בית', 'דף הבית', 'ראשי', 'התחלה', 'חזור לבית', 'home', 'main'],
    spokenConfirmation: 'חוזר לדף הבית הראשי',
  },
  {
    id: 'nootropic',
    path: '/nootropic-matcher',
    label: 'נואוטרופיקה ואדפטוגנים',
    description: "Lion's Mane, Cordyceps ו-Reishi",
    category: 'shop',
    keywords: ['נואוטרופיקה', 'פטריות', 'אדפטוגנים', 'ריישי', 'קורדיספס', 'ריכוז', 'nootropic'],
    spokenConfirmation: 'מעביר אותך למעבדת הנואוטרופיקה והאדפטוגנים',
  },
  {
    id: 'orders',
    path: '/orders',
    label: 'הזמנות ומעקב משלוח חי',
    description: 'מעקב משלוח חי, קבלות דיגיטליות והזמנה חוזרת',
    category: 'shop',
    keywords: ['הזמנות', 'משלוח', 'מעקב משלוח', 'ההזמנות שלי', 'orders', 'tracking'],
    spokenConfirmation: 'פותח את מסך מעקב ההזמנות והמשלוחים',
  },
  {
    id: 'profile',
    path: '/profile',
    label: 'פרופיל אישי ו-DNA טעמים',
    description: 'הגדרות חשבון, היסטוריה וכרטיס VIP',
    category: 'shop',
    keywords: ['פרופיל', 'חשבון', 'החשבון שלי', 'הגדרות', 'profile', 'vip'],
    spokenConfirmation: 'פותח את עמוד הפרופיל האישי שלך',
  },
  {
    id: 'subscription',
    path: '/subscription',
    label: 'מנוי קפה VIP חודשי',
    description: 'משלוח פולים טריים בקלייה אישית לבית',
    category: 'shop',
    keywords: ['מנוי', 'מנויים', 'סאבסקריפשן', 'משלוח חודשי', 'subscription'],
    spokenConfirmation: 'מעביר אותך לעמוד מנוי ה-VIP החודשי',
  },

  // AI & Physics
  {
    id: 'ai-barista',
    path: '/ai-barista',
    label: 'בריסטה Gemini 3.5 AI',
    description: 'הזמנה קולית, זיהוי פולים בצילום והמלצות',
    category: 'ai',
    keywords: ['בריסטה', 'ג\'מיני', 'עוזר אישי', 'הזמנה קולית', 'צילום פולים', 'barista', 'ai'],
    spokenConfirmation: 'פותח את בריסטה Gemini AI לזיהוי והזמנה',
  },
  {
    id: 'circadian',
    path: '/circadian-clock',
    label: 'שעון קפאין סירקדיאני',
    description: 'סנכרון רמות קורטיזול ומניעת התרסקות אנרגיה',
    category: 'ai',
    keywords: ['שעון קפאין', 'סירקדיאני', 'צירקדי', 'מתי לשתות', 'אדנוזין', 'קורטיזול', 'circadian'],
    spokenConfirmation: 'מעביר אותך לשעון הקפאין הסירקדיאני',
  },
  {
    id: 'cryo-grind',
    path: '/cryo-grind',
    label: 'טחינה קריוגנית & PSD AI',
    description: 'שבירת תאים ב-18°C- ופיזור מיקרוני אחיד',
    category: 'ai',
    keywords: ['קריוגני', 'קריו', 'טחינה קפואה', 'חנקן נוזלי', 'cryo'],
    spokenConfirmation: 'פותח את מעבדת הטחינה הקריוגנית',
  },
  {
    id: 'acoustic-tuner',
    path: '/acoustic-tuner',
    label: 'מכוונן טחינה אקוסטי FFT',
    description: 'ניתוח תדרי סכינים וגלאי Channeling',
    category: 'ai',
    keywords: ['אקוסטי', 'טחינה אקוסטית', 'כיול סכינים', 'ספקטרום', 'fft', 'acoustic'],
    spokenConfirmation: 'מעביר אותך למכוונן הטחינה האקוסטי',
  },
  {
    id: 'ultrasonic-aging',
    path: '/ultrasonic-aging',
    label: 'תא יישון אולטרסוני & ואקום',
    description: 'הפחתת חומציות טאנית ודיגזינג מהיר',
    category: 'ai',
    keywords: ['אולטרסוני', 'יישון פולים', 'דיגזינג אולטרסוני', 'ואקום', 'ultrasonic'],
    spokenConfirmation: 'פותח את תא היישון האולטרסוני',
  },
  {
    id: 'ar-latte-art',
    path: '/ar-latte-art',
    label: 'מדפסת 3D ללאטה ארט AR',
    description: 'פיסול קצף מוגבה ווקטוריזטור קקאו',
    category: 'ai',
    keywords: ['לאטה ארט', 'מדפסת תלת מימד', 'מציאות רבודה', 'ar', 'latte art'],
    spokenConfirmation: 'פותח את מדפסת הלאטה ארט ב-AR',
  },
  {
    id: 'animations',
    path: '/animations',
    label: 'סטודיו אנימציות & פיזיקה 3D',
    description: 'סימולציית קרמה, גלי חום, 3D Cup ופיצוץ קלייה',
    category: 'ai',
    keywords: ['אנימציות', 'פיזיקה', 'קרמה 3D', 'גלי חום', 'animations'],
    spokenConfirmation: 'פותח את סטודיו האנימציות ופיזיקת הקפה',
  },

  // Brew Labs & Water
  {
    id: 'israel-water',
    path: '/israel-water-radar',
    label: 'איכות מים בישראל & SCA',
    description: 'נתוני רשות המים לפי ערים ומתכון איזון',
    category: 'lab',
    keywords: ['מים', 'איכות מים', 'רשות המים', 'סידן', 'מגנזיום', 'tds מים', 'israel water'],
    spokenConfirmation: 'מעביר אותך לרדאר איכות המים בישראל ותקן SCA',
  },
  {
    id: 'water-chemistry',
    path: '/water-chemistry',
    label: 'מחשב כימיית מים SCA',
    description: 'מינרלים, קשיות GH/KH ואיזון pH מושלם',
    category: 'lab',
    keywords: ['כימיית מים', 'איזון מים', 'קשיות מים', 'ph', 'gh', 'kh'],
    spokenConfirmation: 'פותח את מחשבון כימיית המים SCA',
  },
  {
    id: 'v60',
    path: '/v60',
    label: 'V60 Master Timer',
    description: 'טיימר חליטה חיה עם Bloom ומד מזיגה',
    category: 'lab',
    keywords: ['v60', 'טיימר חליטה', 'פור אובר', 'טיימר', 'בלום', 'pour over'],
    spokenConfirmation: 'פותח את טיימר החליטה V60 Master',
  },
  {
    id: 'extraction-telemetry',
    path: '/extraction-telemetry',
    label: 'טלמטריית TDS & EY%',
    description: 'מדידת אחוז מיצוי אספרסו Gold Cup',
    category: 'lab',
    keywords: ['טלמטריה', 'tds', 'אחוז מיצוי', 'ey', 'gold cup', 'extraction'],
    spokenConfirmation: 'מעביר אותך למסך טלמטריית המיצוי וה-TDS',
  },
  {
    id: 'pressure-profiler',
    path: '/pressure-profiler',
    label: 'פרופילר לחץ וזרימה Live',
    description: 'כיול עקומות לחץ וזרימה למכונות אספרסו',
    category: 'lab',
    keywords: ['לחץ', 'פרופילר לחץ', 'זרימה', '9 בר', 'flow profiling'],
    spokenConfirmation: 'פותח את פרופילר הלחץ והזרימה',
  },
  {
    id: 'cold-brew',
    path: '/cold-brew-calculator',
    label: 'Cold & Nitro Brew',
    description: 'רפרקטומטר TDS, מודולטור טמפ׳ וניטרו',
    category: 'lab',
    keywords: ['קולד ברו', 'קפה קר', 'ניטרו', 'חליטה קרה', 'cold brew'],
    spokenConfirmation: 'מעביר אותך למחשבון הקולד ברו והנייטרו',
  },
  {
    id: 'smart-iot',
    path: '/smart-iot',
    label: 'סנכרון מכונה חכמה IoT',
    description: 'דחיפת פרופיל לחץ 9Bar וטמפ׳ PID',
    category: 'lab',
    keywords: ['אינטרנט של הדברים', 'iot', 'מכונה חכמה', 'משקל חכם', 'בלוטות', 'mqtt'],
    spokenConfirmation: 'פותח את מרכז סנכרון ה-IoT והמכונה החכמה',
  },

  // Studio, Roasting & Google Calendar Hub
  {
    id: 'calendar-hub',
    path: '/calendar-hub',
    label: 'יומן קפה & Google Calendar Hub',
    description: 'תזמון סדנאות, שעון צירקדי ודיגזינג פולים',
    category: 'calendar',
    keywords: ['יומן', 'גוגל קלנדר', 'לוח שנה', 'סדנאות', 'תזמון', 'calendar', 'gcal'],
    spokenConfirmation: 'מעביר אותך ליומן הקפה החכם וסנכרון Google Calendar',
  },
  {
    id: 'stitch-studio',
    path: '/stitch-studio',
    label: 'סטודיו עיצוב StitchMCP & Liquid Glass',
    description: 'כיוונון טוקנים של Liquid Glass בזמן אמת',
    category: 'roast',
    keywords: ['סטודיו עיצוב', 'סטיץ', 'טוקנים', 'ערכת נושא', 'liquid glass', 'stitch'],
    spokenConfirmation: 'פותח את סטודיו העיצוב Liquid Glass וסנכרון StitchMCP',
  },
  {
    id: 'roast-analyzer',
    path: '/roast-analyzer',
    label: 'מנתח קלייה אופטי & Agtron AI',
    description: 'דגימת צבע, סקאלת Agtron ו-ΔAgtron ליבה',
    category: 'roast',
    keywords: ['מנתח קלייה', 'אגטרון', 'צבע קלייה', 'agtron', 'roast analyzer'],
    spokenConfirmation: 'מעביר אותך למנתח הקלייה האופטי Agtron',
  },
  {
    id: 'cupping-radar',
    path: '/cupping-radar',
    label: 'גלגל טעמים 3D & ציון SCA',
    description: 'הערכת 100 נקודות ורדאר סנסורי אינטראקטיבי',
    category: 'roast',
    keywords: ['גלגל טעמים', 'קאפינג', 'ציון sca', 'רדאר סנסורי', 'flavor wheel'],
    spokenConfirmation: 'פותח את גלגל הטעמים התלת ממדי וציון ה-SCA',
  },
  {
    id: 'live-cupping',
    path: '/live-cupping-room',
    label: 'Cupping Room שיתופי חי & Meet',
    description: 'חדר טעימות שיתופי וירטואלי בזמן אמת',
    category: 'roast',
    keywords: ['חדר קאפינג', 'קאפינג חי', 'טעימות בלייב', 'מיט', 'סלון טעימות', 'live cupping'],
    spokenConfirmation: 'מעביר אותך לחדר הקאפינג השיתופי החי',
  },
  {
    id: 'gamification',
    path: '/gamification',
    label: 'מועדון Roast Club VIP',
    description: 'אתגרים, משימות יומיות ודרגות בריסטה',
    category: 'roast',
    keywords: ['מועדון', 'אתגרים', 'משימות', 'רואסט קלאב', 'נקודות', 'gamification'],
    spokenConfirmation: 'פותח את מועדון ה-Roast Club והמשימות היומיות',
  },

  // B2B & Terroir
  {
    id: 'coffee-fx',
    path: '/coffee-fx-ticker',
    label: 'אינדקס קפה ירוק & שער מט״ח',
    description: 'מחירי חוזים עולמיים ועלויות יבוא בש״ח',
    category: 'b2b',
    keywords: ['מטח', 'בורסה', 'דולר', 'מחיר קפה ירוק', 'חוזים', 'fx'],
    spokenConfirmation: 'מעביר אותך לאינדקס הקפה העולמי ושערי המט״ח',
  },
  {
    id: 'israel-roasters',
    path: '/israel-roasters',
    label: 'אינדקס בתי קלייה בישראל',
    description: 'רישיונות יצרן משרד הבריאות וכשרות',
    category: 'b2b',
    keywords: ['בתי קלייה', 'קולים בישראל', 'רישיון יצרן', 'כשרות', 'roasters'],
    spokenConfirmation: 'פותח את אינדקס בתי הקלייה בישראל',
  },
  {
    id: 'smart-inventory',
    path: '/smart-inventory',
    label: 'ניהול מלאי חכם AI',
    description: 'חיזוי צריכה והזמנות מלאי אוטומטיות',
    category: 'b2b',
    keywords: ['מלאי', 'ניהול מלאי', 'חיזוי צריכה', 'הזמנת מלאי', 'inventory'],
    spokenConfirmation: 'מעביר אותך למערכת ניהול המלאי החכמה',
  },
  {
    id: 'corporate',
    path: '/corporate-lounge',
    label: 'B2B לאונג׳ משרדים וחברות',
    description: 'פתרונות קפה גורמה אקסקלוסיביים לחברות',
    category: 'b2b',
    keywords: ['חברות', 'משרדים', 'עסקים', 'b2b', 'corporate'],
    spokenConfirmation: 'מעביר אותך ללאונג׳ החברות והעסקים B2B',
  },
];

/**
 * Intelligent Voice Matcher: Analyzes speech transcript and matches the best route target
 */
export function matchVoiceNavigationCommand(transcript: string): VoiceRouteTarget | null {
  if (!transcript || !transcript.trim()) return null;
  const clean = transcript.toLowerCase().trim();

  // 1. Direct Keyword Match
  for (const route of VOICE_NAV_ROUTES) {
    for (const kw of route.keywords) {
      if (clean.includes(kw.toLowerCase())) {
        return route;
      }
    }
  }

  // 2. Fuzzy / Word-level Match
  const spokenWords = clean.split(/\s+/);
  let bestMatch: { route: VoiceRouteTarget; score: number } | null = null;

  for (const route of VOICE_NAV_ROUTES) {
    let score = 0;
    for (const word of spokenWords) {
      if (word.length < 2) continue;
      for (const kw of route.keywords) {
        if (kw.includes(word) || word.includes(kw)) {
          score += 2;
        }
      }
      if (route.label.toLowerCase().includes(word)) {
        score += 3;
      }
      if (route.description.toLowerCase().includes(word)) {
        score += 1;
      }
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { route, score };
    }
  }

  return bestMatch && bestMatch.score >= 2 ? bestMatch.route : null;
}
