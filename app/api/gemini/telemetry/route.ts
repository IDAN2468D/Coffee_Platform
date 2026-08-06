import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ExtractionTelemetryInput {
  doseGrams: number;
  yieldGrams: number;
  shotTimeSeconds: number;
  grindSetting: number;
  tasteFeedback: 'UNDER_EXTRACTED_SOUR' | 'BALANCED_SWEET' | 'OVER_EXTRACTED_BITTER';
}

export interface ExtractionTelemetryResult {
  tdsPercent: number; // e.g. 9.5%
  extractionYieldPercent: number; // e.g. 19.8%
  status: 'OPTIMAL' | 'UNDER_EXTRACTED' | 'OVER_EXTRACTED';
  recommendedGrindAdjustment: string; // e.g. "+1.5 קליקים דק יותר"
  recommendedYieldTarget: number;
  baristaAdvice: string;
}

const PREFERRED_GEMINI_MODELS = ['gemini-3.5-flash-lite'];

export async function POST(req: NextRequest) {
  try {
    const body: Partial<ExtractionTelemetryInput> = await req.json().catch(() => ({}));
    const doseGrams = body.doseGrams ?? 18.0;
    const yieldGrams = body.yieldGrams ?? 36.0;
    const shotTimeSeconds = body.shotTimeSeconds ?? 28;
    const grindSetting = body.grindSetting ?? 12;
    const tasteFeedback = body.tasteFeedback ?? 'BALANCED_SWEET';

    const apiKey = process.env.GEMINI_API_KEY;

    // Calculate baseline math
    let tdsPercent = 9.5;
    if (tasteFeedback === 'UNDER_EXTRACTED_SOUR') tdsPercent = 7.8;
    if (tasteFeedback === 'OVER_EXTRACTED_BITTER') tdsPercent = 11.4;

    const extractionYieldPercent = Number(((yieldGrams * tdsPercent) / doseGrams).toFixed(1));

    if (apiKey && apiKey.trim() !== '' && apiKey !== 'demo_key') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const prompt = `נתח את טלמטריית האספרסו הזו:
מנונון: ${doseGrams}g, משקל מיצוי: ${yieldGrams}g, זמן חליטה: ${shotTimeSeconds} שניות, דרגת טחינה: ${grindSetting}, טעם: ${tasteFeedback}.
חשב TDS, אחוז מיצוי (Extraction Yield Target 18-22%), והמלץ על כיוונון טחינה במיקרו-קליקים.
החזר פורמט JSON בלבד:
{
  "tdsPercent": ${tdsPercent},
  "extractionYieldPercent": ${extractionYieldPercent},
  "status": "${shotTimeSeconds < 22 ? 'UNDER_EXTRACTED' : shotTimeSeconds > 34 ? 'OVER_EXTRACTED' : 'OPTIMAL'}",
  "recommendedGrindAdjustment": "+2 קליקים דק יותר",
  "recommendedYieldTarget": ${doseGrams * 2},
  "baristaAdvice": "הסבר מקצועי קצר בעברית על כיוונון הזרימה והחילוץ"
}`;
        const model = genAI.getGenerativeModel({ model: PREFERRED_GEMINI_MODELS[0] });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          try {
            const parsed = JSON.parse(text.substring(jsonStart, jsonEnd));
            return NextResponse.json({ success: true, data: parsed });
          } catch (jsonErr) {
            console.warn('[Telemetry API] Failed parsing Gemini JSON, using fallback', jsonErr);
          }
        }
      } catch (e) {
        console.warn('[Telemetry API] Gemini failed, using smart telemetry engine');
      }
    }

    // Mathematical Smart Engine Fallback
    let status: 'OPTIMAL' | 'UNDER_EXTRACTED' | 'OVER_EXTRACTED' = 'OPTIMAL';
    let recommendedGrindAdjustment = 'שמור על דרגת טחינה נוכחית';
    let baristaAdvice = 'המיצוי באיזון מופלא! מתקבלת כוס מתוקה עם גוף קטיפתי.';

    if (shotTimeSeconds < 23 || tasteFeedback === 'UNDER_EXTRACTED_SOUR') {
      status = 'UNDER_EXTRACTED';
      recommendedGrindAdjustment = '+2.0 קליקים דק יותר (Fine)';
      baristaAdvice = 'הזרימה מהירה מדי והמיצוי חומצי/חמוץ. סגור את דרגת הטחינה ב-2 קליקים כדי להאריך את זמן המגע בין המים לקפה.';
    } else if (shotTimeSeconds > 33 || tasteFeedback === 'OVER_EXTRACTED_BITTER') {
      status = 'OVER_EXTRACTED';
      recommendedGrindAdjustment = '+1.5 קליקים גס יותר (Coarse)';
      baristaAdvice = 'הזרימה איטית מדי והחליטה סובלת ממרירות יתר. פתח את המטחנה ב-1.5 קליקים כדי לאפשר זרימה חלקה יותר.';
    }

    return NextResponse.json({
      success: true,
      data: {
        tdsPercent,
        extractionYieldPercent,
        status,
        recommendedGrindAdjustment,
        recommendedYieldTarget: doseGrams * 2,
        baristaAdvice,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'שגיאה בחישוב טלמטריה' },
      { status: 500 }
    );
  }
}
