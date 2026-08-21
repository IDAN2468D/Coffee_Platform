---
name: il-water-quality-coffee-calibrator
display_name: כיול איכות מים לקפה בישראל (IL Water Quality Coffee Calibrator)
description: אינטגרציה עם datagov-israel לכיול קשיות מים, מינרלים ומתכוני סינון Specialty Coffee לפי ישובים בישראל.
category: domain-specialty
version: 1.0.0
tools:
  - datagov-israel
  - water-chemistry-optimizer
---

# מיומנות כיול איכות מים לקפה בישראל (IL Water Quality Coffee Calibrator)

## ייעוד המיומנות
מיומנות זו מתממשקת למאגרי המידע הממשלתיים (`datagov-israel`) כדי לשאוב נתוני TDS, GH, KH, כלור ומינרלים של חברות המים והרשויות המקומיות בישראל.
המיומנות מחשבת את הסטייה מתקן SCA ומספקת מתכון סינון (RO, פחם, BWT) ורמינרליזציה ($CaSO_4, MgSO_4, NaHCO_3$).

## פרוטוקול פעולה
1. קבלת שם עיר או קואורדינטות בישראל.
2. איתור מקור המים (התפלה, קידוח, כנרת).
3. חישוב יחסי $Ca^{2+} / Mg^{2+}$ ו-Alkalinity ($HCO_3^-$).
4. הפקת המלצה לבריסטה (סוג מסנן מומלץ והרכב מלחים).
