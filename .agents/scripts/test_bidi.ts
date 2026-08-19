// Refined BiDi algorithm that preserves multi-word LTR phrases (e.g. "The Digital Roast", "Google Drive")

export function formatBidiText(str: string): string {
  if (!str) return '';

  // If no Hebrew characters, return strictly as is
  if (!/[\u0590-\u05FF]/.test(str)) {
    return str;
  }

  const mirrorChar = (c: string): string => {
    switch (c) {
      case '(': return ')';
      case ')': return '(';
      case '[': return ']';
      case ']': return '[';
      case '{': return '}';
      case '}': return '{';
      case '<': return '>';
      case '>': return '<';
      default: return c;
    }
  };

  // Group text into alternating chunks of:
  // 1. Hebrew words (with Hebrew punctuation)
  // 2. LTR chunks (English words, numbers, codes, math, emails, URLs, dates, and whitespace between LTR words)
  // 3. Neutral separators between Hebrew and LTR

  // First, identify LTR blocks: sequence of English letters, digits, symbols like #, $, %, @, +, -, /, ., :, and spaces between them if enclosed by LTR
  // We can segment the string into RTL segments and LTR segments.
  
  // Segment regex:
  // RTL block: sequence of Hebrew characters and intra-Hebrew punctuation (quotes, hyphens)
  // LTR block: sequence of ASCII letters/numbers and associated punctuation/spaces
  
  const tokens: { type: 'RTL' | 'LTR' | 'NEUTRAL'; text: string }[] = [];
  
  // Match:
  // 1) Hebrew words: [\u0590-\u05FF\u05B0-\u05C7]+(?:["'\-][\u0590-\u05FF\u05B0-\u05C7]+)*
  // 2) LTR phrases: [A-Za-z0-9#@_$%&+=][A-Za-z0-9#@_$%&+= \-./:<>]*[A-Za-z0-9#@_$%&+=]|[A-Za-z0-9#@_$%&+=]
  // 3) Neutral characters (spaces, bullets, parentheses, colons, commas)
  
  // Let's use a simpler and rock-solid parser:
  const isHebrewChar = (c: string) => /[\u0590-\u05FF]/.test(c);
  const isLatinOrDigit = (c: string) => /[A-Za-z0-9]/.test(c);
  
  let currentType: 'RTL' | 'LTR' | 'NEUTRAL' | null = null;
  let currentBuffer = '';

  const flush = () => {
    if (currentBuffer.length > 0 && currentType) {
      tokens.push({ type: currentType, text: currentBuffer });
      currentBuffer = '';
    }
  };

  let i = 0;
  while (i < str.length) {
    const char = str[i];

    if (isHebrewChar(char)) {
      if (currentType !== 'RTL') {
        flush();
        currentType = 'RTL';
      }
      currentBuffer += char;
      i++;
    } else if (isLatinOrDigit(char) || (currentType === 'LTR' && (char === ' ' || char === '-' || char === '.' || char === ':' || char === '/' || char === '#' || char === '@' || char === '%' || char === '+' || char === '_') && i + 1 < str.length && (isLatinOrDigit(str[i + 1]) || str[i + 1] === ' '))) {
      // Check if this space/symbol is within an LTR phrase or transition to RTL
      if (char === ' ' && i + 1 < str.length && isHebrewChar(str[i + 1])) {
        // Space followed by Hebrew -> this space is neutral
        flush();
        tokens.push({ type: 'NEUTRAL', text: ' ' });
        currentType = null;
        i++;
        continue;
      }
      if (currentType !== 'LTR') {
        flush();
        currentType = 'LTR';
      }
      currentBuffer += char;
      i++;
    } else {
      if (currentType !== 'NEUTRAL') {
        flush();
        currentType = 'NEUTRAL';
      }
      currentBuffer += char;
      i++;
    }
  }
  flush();

  // Reverse tokens array for RTL layout
  const result: string[] = [];
  for (let idx = tokens.length - 1; idx >= 0; idx--) {
    const token = tokens[idx];
    if (token.type === 'RTL') {
      // Reverse Hebrew characters so they draw correctly in LTR font rendering
      result.push(token.text.split('').reverse().join(''));
    } else if (token.type === 'LTR') {
      // Keep English words and numbers in their exact LTR reading order!
      result.push(token.text);
    } else {
      // Neutrals: mirror brackets/parentheses and reverse characters
      result.push(token.text.split('').map(mirrorChar).reverse().join(''));
    }
  }

  return result.join('');
}

// Test cases
const testCases = [
  'THE DIGITAL ROAST',
  'ח.פ. 519824601 • שדרות רוטשילד 45, תל אביב • טל: 03-6821900 • support@digitalroast.co.il',
  '✓ מסמך ממוחשב - מקור חתום דיגיטלית ומאושר',
  'חשבונית מס / קבלה דיגיטלית #DR-900112',
  'שם המזמין: עידן כזם',
  'תאריך ושעת הפקה: 19.08.2026, 13:25',
  'טלפון ליצירת קשר: 054-1234567',
  'כתובת יעד למשלוח: סירקין 10 ראשון לציון',
  'אמצעי תשלום: כרטיס אשראי מאובטח (SSL 256-bit)',
  'סטטוס תשלום: שולם במלואו (PAID) ✓',
  'תיאור פריט הקפה והתאמות בראיסטה',
  'פנמה גיישה ספציאליטי (2 שוטים • ללא חלב)',
  'סה"כ',
  'מחיר יח\'',
  'כמות',
  'סכום ביניים (לפני מע"מ):',
  'מע"מ כחוק (18%):',
  'דמי משלוח וטיפול: VIP חינם (הטבת מועדון)',
  'סה"כ לתשלום כולל מע"מ:',
  '☁ סונכרן ונשמר אוטומטית כ-PDF רשמי ומאובטח בענן Google Drive',
  'מסמך זה הינו קבלה / חשבונית מס דיגיטלית חוקית מבית The Digital Roast בע"מ.',
  'תודה שבחרת ב-The Digital Roast • חווית קפה ספציאליטי יוצאת דופן ☕',
];

console.log('=== ADVANCED BIDI RESULTS ===');
for (const tc of testCases) {
  const res = formatBidiText(tc);
  console.log(`ORIG:   ${tc}`);
  console.log(`VISUAL: ${res}`);
  console.log('-------------------------');
}
