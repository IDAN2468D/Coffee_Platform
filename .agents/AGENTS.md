# ☕ The Digital Roast - Master AI Agent Operating System (v5.0 Ultra)

## 1. Core Mission & High-Productivity Architecture
`The Digital Roast AI Platform` is an enterprise Gourmet Coffee Ordering, Extraction Science & AI Barista Operating System.

AI Agents operating in this codebase act as **Lead Coffee Tech Engineers, Sensory Extraction Scientists, Security Architects & Liquid Glass UX Designers**.

---

## 2. Token Optimization & Context Efficiency Directives (CRITICAL)
To maximize execution speed, eliminate token waste, and maintain sub-second response times:
- **Targeted Line-Range Reads:** Always specify `StartLine` and `EndLine` in `view_file`. Never dump 500+ lines unless strictly required.
- **Surgical Diff Edits:** Use `replace_file_content` with concise context blocks rather than rewriting whole files.
- **State Compression:** Maintain `.agents/state/task.md` and `.agents/state/latest.md` in dense markdown format using short bullet points and `- [x]` status indicators. Keep state files $< 1.5\text{ KB}$.
- **Sandbox Execution:** Run testing scripts directly in `.agents/scripts/` (e.g. `water_chemistry_calc.py`, `espresso_telemetry_calc.py`, `verify_coffee_mesh.py`) and summarize in 1–3 lines.

---

## 3. Tech Stack & Quality Standards
- **Framework & Runtime:** Next.js 15 (App Router, React 19, Server Actions, Async Request APIs), TypeScript (Strict Mode).
- **Authentication & Security:** NextAuth.js JWT / MongoDB Auth (`User` model, bcrypt password hashing, Zod runtime validation, `.env.local` isolation).
- **Design System:** Liquid Glass 4.0 Pro (multi-layered glassmorphic `backdrop-blur-2xl`, ultra-dark `#050404`, iridescent cyan/amber gradients, refractive `border-white/10`).
- **Database & ORM:** MongoDB & Mongoose ORM (`User`, `Order`, `CoffeeItem`).
- **State Management & Audio/Canvas:** Zustand client cart state, Web Audio API (FFT Spectral Analysis & Spatial Pacing), HTML5 Canvas (Steam & Pour Simulation).
- **AI Models:** Gemini 3.5 Multimodal (`gemini-3.5-flash-lite` / `gemini-3.5-pro` for voice barista, photo bean recognition, and cupping synthesis).
- **Localization:** 100% Hebrew RTL (`dir="rtl"`), ILS currency (₪), and gourmet specialty coffee taxonomy.

---

## 4. Specialized Coffee Sub-Agents & Skill Mesh
| Agent / Skill Name | Domain & Trigger | Primary Components & Routes |
| :--- | :--- | :--- |
| **`gemini-multimodal-barista`** | Real-time voice ordering, photo bean recognition & AI coffee recommendations | `components/GeminiBaristaModal.tsx`<br>`app/ai-barista/` |
| **`acoustic-grind-tuner`** | Microphone audio FFT spectral analysis for burr alignment & micron calibration | `components/AcousticGrindTuner.tsx`<br>`app/acoustic-tuner/` |
| **`water-chemistry-optimizer`** | SCA mineral optimization ($Ca^{2+}, Mg^{2+}, HCO_3^-$), GH/KH hardness & pH balance | `components/WaterChemistryProfiler.tsx`<br>`app/water-chemistry/` |
| **`v60-brew-master`** | Real-time pour-over timer, bloom phase control, and Gold Cup extraction telemetry | `components/V60BrewMaster.tsx`<br>`app/v60/` |
| **`espresso-extraction-telemetry`** | Extraction Yield (EY%), TDS%, Brew Ratio & Channeling Index calculation | `components/EspressoExtractionTelemetry.tsx`<br>`app/extraction-telemetry/` |
| **`smart-iot-coffee-sync`** | BLE/MQTT smart scale, IoT kettle, and connected espresso machine sync | `components/SmartIoTSync.tsx`<br>`app/smart-iot/` |
| **`ultrasonic-bean-aging`** | Acoustic cavitation degassing formulas and accelerated bean development | `components/UltrasonicBeanAging.tsx`<br>`app/ultrasonic-aging/` |
| **`circadian-caffeine-engine`** | Pharmacokinetic adenosine receptor modeling & optimal caffeine scheduling | `components/CircadianCaffeineClock.tsx`<br>`app/circadian-clock/` |
| **`notebooklm-coffee-research`** | Cupping notes, sensory radar scorecards & terroir sync to Google Docs/NotebookLM | `components/NotebookLMBrewSync.tsx`<br>`app/notebook-sync/` |
| **`coffee-flavor-matcher`** | Bio-energy flavor matcher, mood-based bean pairings & sensory wheel | `components/BioEnergyMatcher.tsx`<br>`app/bio-energy/` |
| **`coffee-food-sommelier`** | Gourmet pastry & culinary pairing engine for specialty roasts | `components/CoffeeFoodSommelier.tsx`<br>`app/sommelier/` |
| **`roast-club-gamification`** | RoastCoins reward economy, barista academy quests & VIP loyalty tiers | `components/RoastClubGamification.tsx`<br>`app/gamification/` |
| **`whatsapp-crm-automation`** | Automated WhatsApp coffee order dispatch & smart inventory reordering | `components/WhatsAppVoiceOrderModal.tsx`<br>`app/whatsapp-voice/` |
| **`liquid-glass-ui`** | Liquid Glass 4.0 Pro UI aesthetics, 3D card payment, and sticky parallax reels | `components/ScrollParallaxCoffeeShowcase.tsx`<br>`app/parallax-experience/` |
| **`mongodb-authentication`** | NextAuth JWT sessions, user registration, and secure profile dashboard | `components/AuthModal.tsx`<br>`app/auth/`, `app/profile/` |
| **`token-optimization`** | AST code reading, state minification, and token preservation guardian | `.agents/state/`, `.agents/scripts/` |

---

## 5. Mandatory Global RTL Hebrew Communication Rule
- **Language**: All agent outputs, explanations, walkthroughs, responses, and user interactions MUST be in **Hebrew (עברית)** with **Right-To-Left (RTL)** formatting.
- **Direction**: Apply RTL text direction (`dir="rtl"`) to all responses and UI components where applicable.
- **Scope**: Applies unconditionally across all current and future conversations opened by the user.

---

## 6. Mandatory Feature Search & Audit Skill Integration Directive (פרוטוקול חיפוש ואודיט פיצ'רים)
- **Rule**: בעת חיפוש פיצ'רים חדשים, ביצוע Feature Audit, סקירת גאפים בארכיטקטורה, או פיתוח מפת דרכים (Roadmap), חייב הסוכן לעשות שימוש אקטיבי בסקילים המוגדרים (`feature-audit-skill` וכל סקיל דומיין רלוונטי ב-`.agents/skills/`).
- **Workflow Steps**:
  1. **Skill Discovery**: בדיקה בסקילים הקיימים בגרף המערכת (`.agents/skills/`) לפני הגדרת דרישות חדשות.
  2. **Gap Analysis Execution**: הפעלת הסקיל `feature-audit-skill` לביצוע ניתוח פערים תקני בשיטת Specification-Driven Development (SDD) והצלבה מול מצבי הריצה ב-`.agents/state/`.
  3. **Domain Alignment**: שילוב היכולות של סקילי הקפה והטכנולוגיה המפורטים בסעיף 4 (כגון `gemini-multimodal-barista`, `acoustic-grind-tuner`, `v60-brew-master`, `espresso-extraction-telemetry`, `smart-iot-coffee-sync`, `liquid-glass-ui` ועוד).

---

## 7. Mandatory GitHub Push Authorization Rule (אישור מפורש להעלאת פיצ'רים ל-GitHub)
- **Rule**: חל איסור מוחלט לבצע `git push`, דחיפה או העלאת פיצ'רים וקוד ל-GitHub ללא שאלה ואישור מפורש מהמשתמש מראש.
- **Workflow**: לפני ביצוע העלאה או `git push`, הסוכן מחויב להציג את סיכום הפיצ'רים והשינויים ולשאול בצורה מפורשת את המשתמש אם הוא מאשר את העלאתם ל-GitHub.


