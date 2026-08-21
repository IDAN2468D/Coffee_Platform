import { NextRequest, NextResponse } from 'next/server';

// Official data.gov.il Resource IDs
const RESOURCE_CITIES = '5c78e9fa-c2e2-4771-93ff-7f400a12f7ba';
const RESOURCE_STREETS = '9ad3862c-8391-4b2f-84a4-2d4c68625f4b';
const DATA_GOV_API = 'https://data.gov.il/api/3/action/datastore_search';

// Top curated Israeli Cities for instant 0ms fallback & fast search
const POPULAR_ISRAELI_CITIES = [
  { name: 'תל אביב - יפו', code: 5000, region: 'תל אביב' },
  { name: 'ירושלים', code: 3000, region: 'ירושלים' },
  { name: 'חיפה', code: 4000, region: 'חיפה' },
  { name: 'ראשון לציון', code: 8300, region: 'מרכז' },
  { name: 'פתח תקווה', code: 7900, region: 'מרכז' },
  { name: 'אשדוד', code: 70, region: 'דרום' },
  { name: 'נתניה', code: 7400, region: 'מרכז' },
  { name: 'באר שבע', code: 9000, region: 'דרום' },
  { name: 'חולון', code: 6600, region: 'תל אביב' },
  { name: 'בני ברק', code: 6100, region: 'תל אביב' },
  { name: 'רמת גן', code: 8600, region: 'תל אביב' },
  { name: 'בת ים', code: 6200, region: 'תל אביב' },
  { name: 'אשקלון', code: 7100, region: 'דרום' },
  { name: 'הרצליה', code: 6400, region: 'תל אביב' },
  { name: 'כפר סבא', code: 6900, region: 'מרכז' },
  { name: 'חדרה', code: 6500, region: 'חיפה' },
  { name: 'מודיעין-מכבים-רעות', code: 1200, region: 'מרכז' },
  { name: 'רעננה', code: 8700, region: 'מרכז' },
  { name: 'גבעתיים', code: 6300, region: 'תל אביב' },
  { name: 'הוד השרון', code: 9700, region: 'מרכז' },
  { name: 'רחובות', code: 8400, region: 'מרכז' },
  { name: 'רמת השרון', code: 2650, region: 'תל אביב' },
  { name: 'נהריה', code: 9100, region: 'צפון' },
  { name: 'עכו', code: 7600, region: 'צפון' },
  { name: 'טבריה', code: 6700, region: 'צפון' },
  { name: 'אילת', code: 2600, region: 'דרום' },
  { name: 'קריית אונו', code: 2620, region: 'תל אביב' },
  { name: 'נס ציונה', code: 7200, region: 'מרכז' },
  { name: 'יבנה', code: 2660, region: 'מרכז' },
  { name: 'קריית גת', code: 2630, region: 'דרום' },
  { name: 'קריית מוצקין', code: 8200, region: 'חיפה' },
  { name: 'קריית ביאליק', code: 6800, region: 'חיפה' },
  { name: 'קריית אתא', code: 680, region: 'חיפה' },
  { name: 'עפולה', code: 7700, region: 'צפון' },
  { name: 'נצרת', code: 7300, region: 'צפון' },
  { name: 'כרמיאל', code: 1139, region: 'צפון' },
  { name: 'אור יהודה', code: 2400, region: 'תל אביב' },
  { name: 'יהוד-מונוסון', code: 9400, region: 'מרכז' },
  { name: 'ראש העין', code: 2640, region: 'מרכז' },
  { name: 'גבעת שמואל', code: 681, region: 'מרכז' },
  { name: 'שוהם', code: 1304, region: 'מרכז' },
  { name: 'קיסריה', code: 1167, region: 'חיפה' },
  { name: 'זכרון יעקב', code: 9300, region: 'חיפה' },
  { name: 'בנימינה-גבעת עדה', code: 9800, region: 'חיפה' },
  { name: 'סביון', code: 5800, region: 'מרכז' },
  { name: 'כפר שמריהו', code: 267, region: 'מרכז' },
  { name: 'פרדס חנה-כרכור', code: 7800, region: 'חיפה' },
];

// Common streets database for fallback
const POPULAR_COMMON_STREETS = [
  'דיזנגוף',
  'בן יהודה',
  'הרצל',
  'רוטשילד',
  'אבן גבירול',
  'קינג ג\'ורג\'',
  'אלנבי',
  'שינקין',
  'הירקון',
  'ויצמן',
  'סוקולוב',
  'ז\'בוטינסקי',
  'יפו',
  'הנביאים',
  'עמק רפאים',
  'אחוזה',
  'הבנים',
  'העצמאות',
  'צה"ל',
  'הפלמ"ח',
  'ההגנה',
  'שדרות ירושלים',
  'שדרות מוריה',
  'הנשיא',
  'ביאליק',
  'ארלוזורוב',
  'בלפור',
  'רמב"ם',
  'העלייה',
  'יהודה הלוי',
  'קרליבך',
  'החשמונאים',
  'הארבעה',
  'פלורנטין',
  'שדרות בן גוריון',
  'דרך מנחם בגין',
  'דרך השלום',
  'המסגר',
  'יגאל אלון',
  'נחלת בנימין',
  'אחד העם',
  'שדרות נורדאו',
  'באזל',
  'ירמיהו',
  'פנקס',
  'יהודה המכבי',
  'שדרות לוי אשכול',
  'תגור',
  'ברודצקי',
  'איינשטיין',
  'קפלן',
  'דרך יפו',
  'שלמה המלך',
  'הנרייטה סולד',
  'דובנוב',
];

// Simple in-memory response cache
const apiCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all'; // 'cities' | 'streets' | 'all'
    const query = (searchParams.get('q') || '').trim();
    const cityName = (searchParams.get('city') || '').trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 50);

    const cacheKey = `${type}:${query}:${cityName}:${limit}`;
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data, {
        headers: { 'Cache-Control': 'public, max-age=900, stale-while-revalidate=3600' },
      });
    }

    let citiesResult: Array<{ name: string; code: number; region?: string }> = [];
    let streetsResult: Array<{ name: string; code: number; cityName: string; cityCode?: number }> = [];

    // 1. Fetch / Search Cities
    if (type === 'cities' || (type === 'all' && query.length >= 1)) {
      try {
        const cityUrl = `${DATA_GOV_API}?resource_id=${RESOURCE_CITIES}&q=${encodeURIComponent(
          query
        )}&limit=${limit}`;
        const res = await fetch(cityUrl, {
          headers: { Accept: 'application/json' },
          next: { revalidate: 3600 },
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.result?.records) {
            citiesResult = json.result.records.map((r: any) => ({
              name: (r['שם_ישוב'] || '').trim(),
              code: parseInt(r['סמל_ישוב'], 10) || 0,
              region: (r['שם_נפה'] || r['לשכה'] || '').trim(),
            }));
          }
        }
      } catch (err) {
        console.warn('data.gov.il cities fetch fallback:', err);
      }

      // Merge / fallback with popular cities if empty or query matches
      if (citiesResult.length === 0) {
        citiesResult = POPULAR_ISRAELI_CITIES.filter((c) =>
          !query || c.name.includes(query) || (c.region && c.region.includes(query))
        ).slice(0, limit);
      }
    }

    // 2. Fetch / Search Streets (Clean Separation of street name from city)
    if (type === 'streets' || (type === 'all' && query.length >= 2)) {
      try {
        // Query the street name directly without concatenating city into query string
        const streetSearchTerm = query || (cityName ? '' : 'הרצל');
        const streetUrl = `${DATA_GOV_API}?resource_id=${RESOURCE_STREETS}&q=${encodeURIComponent(
          streetSearchTerm
        )}&limit=${limit * 2}`;
        const res = await fetch(streetUrl, {
          headers: { Accept: 'application/json' },
          next: { revalidate: 3600 },
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.result?.records) {
            const rawRecords = json.result.records.map((r: any) => ({
              name: (r['שם_רחוב'] || '').trim(),
              code: parseInt(r['סמל_רחוב'], 10) || 0,
              cityName: (r['שם_ישוב'] || '').trim(),
              cityCode: parseInt(r['סמל_ישוב'], 10) || 0,
            })).filter((s: any) => s.name && s.name.length > 0);

            if (cityName) {
              // Prioritize streets matching the selected city
              const cityMatches = rawRecords.filter(
                (s: any) => s.cityName === cityName || s.cityName.includes(cityName) || cityName.includes(s.cityName)
              );
              streetsResult = cityMatches.length > 0 ? cityMatches.slice(0, limit) : rawRecords.slice(0, limit);
            } else {
              streetsResult = rawRecords.slice(0, limit);
            }
          }
        }
      } catch (err) {
        console.warn('data.gov.il streets fetch fallback:', err);
      }

      // Fallback street generation if remote API returned no records
      if (streetsResult.length === 0 && (query.length >= 1 || cityName)) {
        const targetCity = cityName || 'תל אביב - יפו';
        const filtered = POPULAR_COMMON_STREETS.filter((street) =>
          !query || street.includes(query) || query.includes(street)
        );
        streetsResult = (filtered.length > 0 ? filtered : POPULAR_COMMON_STREETS.slice(0, 10)).map(
          (name, idx) => ({
            name,
            code: 100 + idx,
            cityName: targetCity,
          })
        );
      }
    }

    const responsePayload = {
      success: true,
      query,
      cityName,
      cities: citiesResult,
      streets: streetsResult,
      source: 'data.gov.il (National Open Data Portal of Israel)',
      totalCities: citiesResult.length,
      totalStreets: streetsResult.length,
    };

    apiCache.set(cacheKey, { timestamp: Date.now(), data: responsePayload });

    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'public, max-age=900, stale-while-revalidate=3600',
        'X-Data-Source': 'data.gov.il-Israel-Addresses-Engine',
      },
    });
  } catch (error: any) {
    console.error('Israel Addresses API route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'שגיאה בעיבוד בקשת כתובות ישראל',
        cities: POPULAR_ISRAELI_CITIES.slice(0, 15),
        streets: [],
      },
      { status: 500 }
    );
  }
}
