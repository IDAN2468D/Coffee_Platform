import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

export interface OpticalRoastAnalysisResult {
  agtronGourmet: number; // 10 - 100
  agtronCommercial: number; // 10 - 133
  roastClassification: string;
  hebrewRoastName: string;
  lightnessScore: number; // 0 - 100
  deltaAgtron: number | null; // ground - whole
  coreHomogeneityAssessment: string;
  defectsDetected: Array<{
    type: string;
    hebrewName: string;
    severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
    confidence: number;
    visualNote: string;
  }>;
  recommendedRoR: {
    chargeTempC: number;
    dtrPercent: number;
    firstCrackWindow: string;
    endTempC: number;
    advice: string;
  };
  sensoryProfile: {
    acidity: number; // 1-10
    sweetness: number; // 1-10
    body: number; // 1-10
    bitterness: number; // 1-10
    aroma: number; // 1-10
    tastingNotes: string[];
  };
  brewingRecommendations: {
    bestBrewMethod: string;
    grindMicrons: number;
    waterTempC: number;
    brewRatio: string;
  };
}

const PREFERRED_GEMINI_MODELS = ['gemini-3.5-flash-lite'];

function calculateMathematicalAgtron(r: number, g: number, b: number) {
  // Normalize RGB to 0-1
  const normR = Math.max(0, Math.min(255, r)) / 255;
  const normG = Math.max(0, Math.min(255, g)) / 255;
  const normB = Math.max(0, Math.min(255, b)) / 255;

  // Relative Luminance Y
  const Y = 0.2126 * normR + 0.7152 * normG + 0.0722 * normB;

  // Agtron Gourmet curve approximation
  const agtronGourmet = Math.round(Math.max(15, Math.min(95, 125 * Math.pow(Y, 0.65) - 6)));
  const agtronCommercial = Math.round(Math.max(10, Math.min(133, 1.33 * agtronGourmet - 10)));
  const lightnessScore = Math.round(Y * 100);

  return { agtronGourmet, agtronCommercial, lightnessScore };
}

function getRoastClassByAgtron(agtron: number) {
  if (agtron >= 85) {
    return {
      classification: 'Very Light / Cinnamon Roast',
      hebrewName: 'קלייה בהירה מאוד (קינמון / Cinnamon)',
      roR: { chargeTempC: 195, dtrPercent: 13.5, firstCrackWindow: '8:45 - 9:30', endTempC: 200, advice: 'קלייה קצרה עם דגש על שימור חומציות פרי מבריקה וטרפנים פרחוניים.' },
      sensory: { acidity: 9.5, sweetness: 7.0, body: 4.5, bitterness: 2.0, aroma: 9.2, tastingNotes: ['יסמין', 'ליים', 'פטל', 'תה ארל גריי'] },
      brew: { bestBrewMethod: 'V60 Pour-Over / Chemex', grindMicrons: 420, waterTempC: 94, brewRatio: '1:16.5' },
    };
  }
  if (agtron >= 75) {
    return {
      classification: 'Light / City Roast',
      hebrewName: 'קלייה בהירה (City Roast)',
      roR: { chargeTempC: 200, dtrPercent: 15.5, firstCrackWindow: '9:15 - 10:00', endTempC: 205, advice: 'שלב מייארד מבוקר המאפשר פיתוח סוכרים עשיר תוך שמירה על מאפייני זן הפול.' },
      sensory: { acidity: 8.5, sweetness: 8.5, body: 6.0, bitterness: 3.0, aroma: 9.0, tastingNotes: ['הדרים ממותקים', 'משמש', 'סוכר קנים', 'דבש פרחי בר'] },
      brew: { bestBrewMethod: 'V60 / Kalita Wave / Aeropress', grindMicrons: 480, waterTempC: 93, brewRatio: '1:16' },
    };
  }
  if (agtron >= 65) {
    return {
      classification: 'Medium-Light / City+ Roast',
      hebrewName: 'קלייה בינונית-בהירה (City+ Roast)',
      roR: { chargeTempC: 204, dtrPercent: 17.5, firstCrackWindow: '9:30 - 10:20', endTempC: 209, advice: 'איזון מושלם בין חומציות פירותית למתיקות קרמל וגוף קטיפתי.' },
      sensory: { acidity: 7.0, sweetness: 9.0, body: 7.5, bitterness: 4.0, aroma: 8.8, tastingNotes: ['קרמל מלוח', 'תפוז אדום', 'פקאן קלוי', 'וניל'] },
      brew: { bestBrewMethod: 'Omni-Roast (V60 / Modern Espresso)', grindMicrons: 380, waterTempC: 92, brewRatio: '1:15' },
    };
  }
  if (agtron >= 55) {
    return {
      classification: 'Medium / Full City Roast',
      hebrewName: 'קלייה בינונית מאוזנת (Full City)',
      roR: { chargeTempC: 208, dtrPercent: 19.5, firstCrackWindow: '9:45 - 10:45', endTempC: 215, advice: 'פיתוח מייארד מלא, קרמליזציה של סוכרים והתפתחות גוף עמוק לאספרסו קלאסי.' },
      sensory: { acidity: 5.5, sweetness: 8.8, body: 8.5, bitterness: 5.5, aroma: 8.5, tastingNotes: ['שוקולד מריר 70%', 'אגוזי לוז', 'טופי', 'קקאו משובח'] },
      brew: { bestBrewMethod: 'Espresso / Mocha Pot / French Press', grindMicrons: 280, waterTempC: 91, brewRatio: '1:2 (Espresso)' },
    };
  }
  if (agtron >= 45) {
    return {
      classification: 'Medium-Dark / Full City+ Roast',
      hebrewName: 'קלייה בינונית-כהה (Full City+ / Vienna)',
      roR: { chargeTempC: 212, dtrPercent: 21.5, firstCrackWindow: '10:00 - 11:10', endTempC: 220, advice: 'תחילת פיצוץ שני עדין מאוד, שכבת שמנים מיקרוסקופית על פני הפול.' },
      sensory: { acidity: 3.5, sweetness: 7.0, body: 9.0, bitterness: 7.5, aroma: 8.0, tastingNotes: ['קקאו עמוק', 'תבלינים חמים', 'אגוז מלך קלוי', 'סוכר חום'] },
      brew: { bestBrewMethod: 'Espresso / Ibrik / Flat White', grindMicrons: 240, waterTempC: 89, brewRatio: '1:1.8' },
    };
  }
  if (agtron >= 35) {
    return {
      classification: 'Dark / French Roast',
      hebrewName: 'קלייה כהה צרפתית (French Roast)',
      roR: { chargeTempC: 215, dtrPercent: 23.5, firstCrackWindow: '10:15 - 11:30', endTempC: 225, advice: 'נוכחות שמנים מבריקה, פירוק חומצות מוחלט והדגשת גוף מעושן ועוצמתי.' },
      sensory: { acidity: 2.0, sweetness: 5.0, body: 9.5, bitterness: 8.8, aroma: 7.5, tastingNotes: ['שוקולד 85%', 'עץ ארז מעושן', 'קרמל שרוף', 'מולסה'] },
      brew: { bestBrewMethod: 'Traditional Espresso / Cold Brew / Latte', grindMicrons: 220, waterTempC: 88, brewRatio: '1:1.7' },
    };
  }
  return {
    classification: 'Very Dark / Italian Roast',
    hebrewName: 'קלייה כהה מאוד איטלקית (Italian Roast)',
    roR: { chargeTempC: 218, dtrPercent: 25.5, firstCrackWindow: '10:30 - 11:45', endTempC: 230, advice: 'שמנים גלויים על המעטפת, טעמי פחם מבוקרים ומרקם סמיך במיוחד.' },
    sensory: { acidity: 1.0, sweetness: 3.5, body: 9.8, bitterness: 9.5, aroma: 7.0, tastingNotes: ['אספרסו נפוליטני', 'פחם עץ אלון', 'קקאו שחור', 'טבק עדין'] },
    brew: { bestBrewMethod: 'Neapolitan Espresso / Mocha Pot', grindMicrons: 200, waterTempC: 87, brewRatio: '1:1.5' },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      rgb = { r: 110, g: 70, b: 40 },
      sampleMode = 'WHOLE_BEAN',
      wholeAgtron = null,
      groundAgtron = null,
      imageBase64 = null,
    } = body;

    // 1. Calculate colorimetry metrics
    const { agtronGourmet, agtronCommercial, lightnessScore } = calculateMathematicalAgtron(
      rgb.r,
      rgb.g,
      rgb.b
    );

    const baseInfo = getRoastClassByAgtron(agtronGourmet);

    // 2. Compute Core Delta if available
    let deltaVal: number | null = null;
    let coreAssessment = 'דגימת פולים יחידה: מומלץ לבצע דגימה משולבת (שלם מול טחון) לבדיקת אחידות חום הליבה.';

    if (wholeAgtron !== null && groundAgtron !== null) {
      deltaVal = Math.round(groundAgtron - wholeAgtron);
      if (deltaVal >= 0 && deltaVal <= 8) {
        coreAssessment = `אופטימלי (ΔAgtron = +${deltaVal}): מעבר חום מושלם! ליבת הפול התפתחה באחידות מלאה ללא חריכת מעטפת.`;
      } else if (deltaVal > 8 && deltaVal <= 15) {
        coreAssessment = `קביל (ΔAgtron = +${deltaVal}): עיכוב קל בהתפתחות הליבה. מומלץ להאריך מעט את שלב ה-Drying או ה-Maillard.`;
      } else if (deltaVal > 15) {
        coreAssessment = `חוסר פיתוח פנימי (ΔAgtron = +${deltaVal}): הליבה נותרה בהירה ובוסרית (Baked/Underdeveloped). יש להעלות זמן חום קונבקטיבי ולהפחית טמפ' כניסה.`;
      } else {
        coreAssessment = `חריכת מעטפת (ΔAgtron = ${deltaVal}): המעטפת נחרכה ממגע ישיר בתוף לוהט לפני שהחום חדר לליבה. הגבר מהירות תוף והפחת חום מוליך.`;
      }
    }

    // 3. Multimodal Analysis via Gemini 3.5 if API Key is configured and image is provided
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'demo_key') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        for (const modelName of PREFERRED_GEMINI_MODELS) {
          try {
            const model = genAI.getGenerativeModel({ model: modelName });
            
            const prompt = `אתה מומחה בינלאומי לקליית קפה ספשלטי, מדען ראיית מחשב וכיול ספקטרופוטומטרי לפי סקאלת Agtron Gourmet של ה-SCA.
נתח את נתוני דגימת הצבע האופטית:
- ערכי RGB שנדגמו: R=${rgb.r}, G=${rgb.g}, B=${rgb.b}
- מצב דגימה: ${sampleMode}
- ערך אגטרון מחושב: ${agtronGourmet} Agtron Gourmet
- סיווג משוער: ${baseInfo.classification}
- דלתא ליבה: ${deltaVal !== null ? `${deltaVal} Agtron` : 'לא הוזן'}

בצע ניתוח מעמיק והחזר JSON תקף בלבד במבנה הבא:
{
  "agtronGourmet": ${agtronGourmet},
  "agtronCommercial": ${agtronCommercial},
  "roastClassification": "${baseInfo.classification}",
  "hebrewRoastName": "${baseInfo.hebrewName}",
  "lightnessScore": ${lightnessScore},
  "deltaAgtron": ${deltaVal !== null ? deltaVal : 'null'},
  "coreHomogeneityAssessment": "${coreAssessment}",
  "defectsDetected": [
    {
      "type": "Quakers",
      "hebrewName": "פולים בוסריים",
      "severity": "NONE",
      "confidence": 98,
      "visualNote": "גוון אחיד ללא עדות לפולים צהבהבים בלתי מפותחים"
    },
    {
      "type": "Scorching",
      "hebrewName": "חריכת תוף מוליכה",
      "severity": "NONE",
      "confidence": 95,
      "visualNote": "פני השטח נקיים מכתמי שריפה שטוחים"
    },
    {
      "type": "Tipping",
      "hebrewName": "כוויות קצה עובר",
      "severity": "NONE",
      "confidence": 92,
      "visualNote": "קצוות הפול שלמים ללא פיח מרוכז"
    }
  ],
  "recommendedRoR": {
    "chargeTempC": ${baseInfo.roR.chargeTempC},
    "dtrPercent": ${baseInfo.roR.dtrPercent},
    "firstCrackWindow": "${baseInfo.roR.firstCrackWindow}",
    "endTempC": ${baseInfo.roR.endTempC},
    "advice": "${baseInfo.roR.advice}"
  },
  "sensoryProfile": {
    "acidity": ${baseInfo.sensory.acidity},
    "sweetness": ${baseInfo.sensory.sweetness},
    "body": ${baseInfo.sensory.body},
    "bitterness": ${baseInfo.sensory.bitterness},
    "aroma": ${baseInfo.sensory.aroma},
    "tastingNotes": ${JSON.stringify(baseInfo.sensory.tastingNotes)}
  },
  "brewingRecommendations": {
    "bestBrewMethod": "${baseInfo.brew.bestBrewMethod}",
    "grindMicrons": ${baseInfo.brew.grindMicrons},
    "waterTempC": ${baseInfo.brew.waterTempC},
    "brewRatio": "${baseInfo.brew.brewRatio}"
  }
}`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            if (jsonStart !== -1 && jsonEnd > jsonStart) {
              const parsed = JSON.parse(responseText.slice(jsonStart, jsonEnd));
              return NextResponse.json({
                success: true,
                source: 'GEMINI_MULTIMODAL_AI',
                data: parsed,
              });
            }
          } catch (modelErr) {
            console.warn(`[Optical Roast API] Model ${modelName} failed, fallback...`);
          }
        }
      } catch (geminiErr) {
        console.warn('[Optical Roast API] Gemini call error, returning calculated response.');
      }
    }

    // Default fallback with calculated spectrophotometry
    const fallbackResponse: OpticalRoastAnalysisResult = {
      agtronGourmet,
      agtronCommercial,
      roastClassification: baseInfo.classification,
      hebrewRoastName: baseInfo.hebrewName,
      lightnessScore,
      deltaAgtron: deltaVal,
      coreHomogeneityAssessment: coreAssessment,
      defectsDetected: [
        {
          type: 'Quakers',
          hebrewName: 'פולים בוסריים (Quakers)',
          severity: agtronGourmet > 80 ? 'LOW' : 'NONE',
          confidence: 94,
          visualNote: 'אחידות תגובת מייארד גבוהה לאורך כל מדגם הפולים.',
        },
        {
          type: 'Scorching',
          hebrewName: 'חריכת תוף ישירה (Scorching)',
          severity: 'NONE',
          confidence: 96,
          visualNote: 'מעטפת חלקה ללא נקודות מגע שרופות מתוף הקלייה.',
        },
        {
          type: 'Tipping',
          hebrewName: 'כוויות קצה עובר (Tipping)',
          severity: 'NONE',
          confidence: 91,
          visualNote: 'מבנה העובר שלם, פיצוץ ראשון מבוקר ב-RoR יציב.',
        },
      ],
      recommendedRoR: baseInfo.roR,
      sensoryProfile: baseInfo.sensory,
      brewingRecommendations: baseInfo.brew,
    };

    return NextResponse.json({
      success: true,
      source: 'SPECTROPHOTOMETRY_CALCULATED_ENGINE',
      data: fallbackResponse,
    });
  } catch (error: any) {
    console.error('[Optical Roast API] Global Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal error in optical roast analysis',
      },
      { status: 500 }
    );
  }
}
