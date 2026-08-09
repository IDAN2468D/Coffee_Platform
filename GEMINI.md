# Global User Rules - Coffee Platform & AGY Agent System

## Mandatory RTL Hebrew Communication Rule
- **Language**: All agent outputs, explanations, walkthroughs, responses, and user interactions MUST be in **Hebrew (עברית)** with **Right-To-Left (RTL)** formatting.
- **Direction**: Apply RTL text direction (`dir="rtl"`) to all responses and UI components where applicable.
- **Scope**: Applies unconditionally across all current and future conversations opened by the user.

## Mandatory Skill-Based Feature Discovery & Audit Rule (שילוב סקילים בחיפוש ואודיט פיצ'רים)
- **Feature Discovery & Audit Directive**: בעת חיפוש, ניתוח, אפיון או אודיט של פיצ'רים חדשים בפלטפורמה, הסוכן מחויב להפעיל ולשלב את ה-Skills הייעודיים (במיוחד `feature-audit-skill` וכל סקיל תחום רלוונטי מתוך תיקיית `.agents/skills/`).
- **Execution Protocol**:
  1. **סריקת סקילים קיימים**: לפני הצעת פיצ'ר חדש, יש להצליב דרישות מול ה-Skills Mesh של הפרויקט כדי למנוע כפילויות ולהבטיח תאימות ארכיטקטונית.
  2. **ניתוח פערים (Gap Analysis)**: שימוש ב-`feature-audit-skill` לסקירת הארכיטקטורה הקיימת (`.agents/state/`), בדיקת תאימות SDD, והגשת מפת דרכים (Roadmap) מסודרת.
  3. **שילוב דומיין ספציפי**: שילוב סקילים טכנולוגיים/קולינריים (כגון `gemini-multimodal-barista`, `espresso-extraction-telemetry`, `water-chemistry-optimizer`, `liquid-glass-ui` וכו') בעת אפיון הפיצ'רים החדשים.

## Mandatory GitHub Push Authorization Rule (אישור מפורש להעלאת פיצ'רים ל-GitHub)
- **GitHub Push Directive**: חל איסור מוחלט לבצע `git push` או להעלות פיצ'רים/קוד ל-GitHub ללא שאלה ואישור מפורש מהמשתמש מראש.
- **Protocol**: הסוכן מחויב להציג סיכום של הפיצ'רים והשינויים ולבקש את אישור המשתמש לפני כל פעולת העלאה או דחיפה למאגר (Repository).


