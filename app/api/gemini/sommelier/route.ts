import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface SommelierPairingResult {
  foodItem: string;
  recommendedCoffee: string;
  origin: string;
  roastLevel: 'LIGHT' | 'MEDIUM' | 'DARK';
  brewMethod: 'V60' | 'ESPRESSO' | 'FRENCH_PRESS' | 'COLD_BREW';
  matchScore: number; // 0-100%
  flavorNotes: string[];
  pairingExplanation: string;
}

const PREFERRED_GEMINI_MODELS = ['gemini-3.5-flash-lite'];

async function generateContentWithFallback(genAI: GoogleGenerativeAI, prompt: string) {
  for (const modelName of PREFERRED_GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      if (result && result.response) {
        return result.response.text();
      }
    } catch (err: any) {
      console.warn(`[Sommelier API] Model '${modelName}' failed, trying next...`);
    }
  }
  throw new Error('Gemini models failed');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const foodItem = body.foodItem;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== '' && apiKey !== 'demo_key') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const prompt = `אתה סומלייה קפה גורמה מומחה. הלקוח אוכל או מעוניין לאכול: "${foodItem}".
מצא את פול הקפה, דרגת הקלייה ושיטת החליטה האידיאלים המעצימים את הטעמים.
החזר פורמט JSON בלבד במבנה מדויק הבא:
{
  "foodItem": "${foodItem}",
  "recommendedCoffee": "אתיופיה יירגאשף גרייד 1",
  "origin": "אתיופיה (1,900-2,200m)",
  "roastLevel": "LIGHT",
  "brewMethod": "V60",
  "matchScore": 96,
  "flavorNotes": ["יסמין", "הדרים", "דבש"],
  "pairingExplanation": "הסבר גורמה קצר בעברית המנמק את השילוב המושלם בין המאפה/האוכל לקפה"
}`;
        const responseText = await generateContentWithFallback(genAI, prompt);
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}') + 1;
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          try {
            const parsed = JSON.parse(responseText.substring(jsonStart, jsonEnd));
            return NextResponse.json({ success: true, data: parsed });
          } catch (e) {
            console.warn('[Sommelier API] Failed to parse JSON response from Gemini:', e);
          }
        }
      } catch (e) {
        console.warn('[Sommelier API] Gemini failed, falling back to smart heuristic');
      }
    }

    // Heuristic fallback
    const food = (foodItem || '').toLowerCase();
    let recommendedCoffee = 'אתיופיה יירגאשף נטורל';
    let origin = 'אתיופיה (Yirgacheffe 2,000m)';
    let roastLevel: 'LIGHT' | 'MEDIUM' | 'DARK' = 'LIGHT';
    let brewMethod: 'V60' | 'ESPRESSO' | 'FRENCH_PRESS' | 'COLD_BREW' = 'V60';
    let matchScore = 95;
    let flavorNotes = ['פרחי יסמין', 'ליים', 'דבש בר'];
    let pairingExplanation = `החומציות הציטרוסית והגוף הקל של אתיופיה יירגאשף חותכים את העושר של ${foodItem} ומעניקים סיומת נקייה ורעננה.`;

    if (food.includes('שוקולד') || food.includes('בראוניז') || food.includes('טירמיסו')) {
      recommendedCoffee = 'סומטרה מנדלינג קלייה כהה';
      origin = 'אינדונזיה (Sumatra 1,500m)';
      roastLevel = 'DARK';
      brewMethod = 'ESPRESSO';
      matchScore = 98;
      flavorNotes = ['שוקולד מריר', 'תבלינים', 'אדמתי עשיר'];
      pairingExplanation = `הגוף המלא והאדמתיות העמוקה של פולי סומטרה משלימים באופן מרהיב את עושר השוקולד של ${foodItem}.`;
    } else if (food.includes('קרואסון') || food.includes('חמאה') || food.includes('אגוזים')) {
      recommendedCoffee = 'קולומביה הואילה סופיריור';
      origin = 'קולומביה (Huila 1,800m)';
      roastLevel = 'MEDIUM';
      brewMethod = 'ESPRESSO';
      matchScore = 94;
      flavorNotes = ['אגוזי לוז', 'קרמל קלוי', 'תפוח אדום'];
      pairingExplanation = `נגיעות הקרמל ואגוזי הלוז בקולומביה הואילה מתחברים בצורה טבעית עם חמאתיות המאפה.`;
    }

    return NextResponse.json({
      success: true,
      data: {
        foodItem: foodItem || 'מאפה חמאה',
        recommendedCoffee,
        origin,
        roastLevel,
        brewMethod,
        matchScore,
        flavorNotes,
        pairingExplanation,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'שגיאה בעיבוד סומלייה' },
      { status: 500 }
    );
  }
}
