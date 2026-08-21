---
name: direct-trade-fx-auditor
display_name: מבקר שקיפות מסחר ישיר ומטבעות (Direct Trade FX Auditor)
description: המרת שערי מטבע בזמן אמת דרך rapidapi_currency, פילוח שרשרת ערך וחישוב פרמיית חקלאי מעל C-Market.
category: economics-and-transparency
version: 1.0.0
tools:
  - rapidapi_currency
  - terroir-dna-passport
---

# מיומנות מבקר שקיפות מסחר ישיר ומטבעות (Direct Trade FX Auditor)

## ייעוד המיומנות
ניתוח כלכלי שקוף של מחירי פולי Specialty Coffee, המרת מטבעות חיה (USD, ILS, COP, ETB) והצגת מדד התגמול ההוגן לחקלאי (+350% מעל מחיר הבורסה).

## פרוטוקול פעולה
1. קבלת מחיר ה-Farm Gate ששולם לחקלאי.
2. משיכת שער בורסת ה-C-Market העדכני.
3. המרה לשקלים (₪) ומטבעות מקומיים (COP, ETB).
4. פילוח שרשרת הערך (שילוח, קלייה, תפעול, מסים).
