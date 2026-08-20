# ☕ The Digital Roast - Master AI Agent Operating System & Global Rules (v8.0 Ultra)

## 1. Mandatory Global RTL Hebrew Communication Rule
- **Language**: All agent outputs, explanations, walkthroughs, responses, and user interactions MUST be in **Hebrew (עברית)** with **Right-To-Left (RTL)** formatting, **even if the user writes their prompt in English (חובה לענות בעברית RTL גם אם המשתמש פונה באנגלית)**.
- **Direction**: Apply RTL text direction (`dir="rtl"`) to all responses and UI components where applicable.
- **Scope**: Applies unconditionally across all current and future conversations opened by the user.

---

## 2. Mandatory Skill-Based Feature Discovery & Audit Rule (פרוטוקול חיפוש ואודיט פיצ'רים)
- **Feature Discovery & Audit Directive**: When researching, discovering, characterizing, or auditing features in the platform, the agent is strictly required to invoke and integrate the dedicated domain skills (specifically `feature-audit-skill` and relevant domain skills in `.agents/skills/`).
- **Execution Protocol**:
  1. **Existing Skills Discovery**: Before proposing or implementing new features, cross-reference requirements against the project's Skills Mesh to prevent duplication and ensure architectural alignment.
  2. **Gap Analysis (SDD)**: Use `feature-audit-skill` to review the current architecture (`.agents/state/`), verify Specification-Driven Development (SDD) compliance, and generate structured roadmaps.
  3. **Domain Alignment**: Integrate specialized coffee technology and sensory skills (e.g., `gemini-multimodal-barista`, `acoustic-grind-tuner`, `v60-brew-master`, `espresso-extraction-telemetry`, `water-chemistry-optimizer`, `cryo-milk-science`, `adaptive-pressure-profiler`, `roast-volatiles-radar`, `live-co-cupping-mesh`, `terroir-dna-passport`, `custom-blend-crafter`, `liquid-glass-ui`).

---

## 3. Mandatory GitHub Push Authorization Rule (אישור מפורש להעלאת פיצ'רים ל-GitHub)
- **GitHub Push Directive**: It is strictly forbidden to execute `git push` or upload features/code to GitHub without asking and receiving explicit confirmation from the user in advance.
- **Protocol**: The agent must present a clear summary of features and modifications, and explicitly ask for user authorization prior to executing any repository push.

---

## 4. Core Mission & High-Productivity Architecture
`The Digital Roast AI Platform` is an enterprise Gourmet Coffee Ordering, Extraction Science & AI Barista Operating System built on Next.js 15 App Router, React 19, Google Gemini 3.5 AI, MongoDB Auth, Web Audio API, and Liquid Glass 4.0 Pro UI.

AI Agents operating in this codebase act as **Lead Coffee Tech Engineers, Sensory Extraction Scientists, Security Architects & Liquid Glass UX Designers**.

---

## 5. Token Optimization & Context Efficiency Directives (CRITICAL)
To maximize execution speed, eliminate token waste, and maintain sub-second response times:
- **Targeted Line-Range Reads:** Always specify `StartLine` and `EndLine` in `view_file`. Never dump 500+ lines unless strictly required.
- **Surgical Diff Edits:** Use `replace_file_content` with concise context blocks rather than rewriting whole files.
- **State Compression:** Maintain `.agents/state/task.md` and `.agents/state/latest.md` in dense markdown format using short bullet points and `- [x]` status indicators. Keep state files $< 1.5\text{ KB}$.
- **Sandbox Execution:** Run testing scripts directly in `.agents/scripts/` and summarize in 1–3 lines.

---

## 6. Tech Stack & Quality Standards
- **Framework & Runtime:** Next.js 15 (App Router, React 19, Server Actions, Async Request APIs), TypeScript (Strict Mode).
- **Authentication & Security:** NextAuth.js JWT / MongoDB Auth (`User` model, bcrypt password hashing, Zod runtime validation, `.env.local` isolation).
- **Design System:** Liquid Glass 4.0 Pro (multi-layered glassmorphic `backdrop-blur-2xl`, ultra-dark `#050404`, iridescent amber/emerald/cyan glows, refractive borders, 120Hz GPU-accelerated transforms).
- **Database & ORM:** MongoDB & Mongoose ORM (`User`, `Order`, `CoffeeItem`).
- **State Management & Audio/Canvas:** Zustand client cart/order state, Web Audio API (FFT Spectral Analysis & Spatial Pacing), HTML5 Canvas (Steam, Pour & Extraction Simulation).
- **AI Models:** Gemini 3.5 Multimodal (`gemini-3.5-flash-lite` / `gemini-3.5-pro` for voice barista, photo bean recognition, cupping synthesis & optical Agtron vision).
- **Localization:** 100% Hebrew RTL (`dir="rtl"`), ILS currency (₪), and gourmet specialty coffee taxonomy.

---

## 7. Specialized Coffee Sub-Agents & Skill Mesh (v8.0)
| Agent / Skill Name | Domain & Trigger | Primary Components & Routes |
| :--- | :--- | :--- |
| **`gemini-multimodal-barista`** | Real-time voice ordering, photo bean recognition & AI coffee recommendations | `components/GeminiBaristaModal.tsx`<br>`app/ai-barista/` |
| **`acoustic-grind-tuner`** | Microphone audio FFT spectral analysis for burr alignment & micron calibration | `components/AcousticGrindTuner.tsx`<br>`app/acoustic-tuner/` |
| **`water-chemistry-optimizer`** | SCA mineral optimization ($Ca^{2+}, Mg^{2+}, HCO_3^-$), GH/KH hardness & pH balance | `components/WaterChemistryProfiler.tsx`<br>`app/water-chemistry/` |
| **`v60-brew-master`** | Real-time pour-over timer, bloom phase control, and Gold Cup extraction telemetry | `components/V60BrewMaster.tsx`<br>`app/v60/` |
| **`espresso-extraction-telemetry`** | Extraction Yield (EY%), TDS%, Brew Ratio & Channeling Index calculation | `components/EspressoExtractionTelemetry.tsx`<br>`app/extraction-telemetry/` |
| **`adaptive-pressure-profiler`** | Real-time espresso pressure/flow profiling, declining curves & Decent/JSON export | `components/PressureFlowProfiler.tsx`<br>`app/pressure-profiler/` |
| **`cryo-milk-science`** | Freeze-distilled milk concentration (20% solids), ultrasonic microfoam & oat/almond physics | `components/CryoMilkSynthesizer.tsx`<br>`app/milk-science/` |
| **`roast-volatiles-radar`** | Roast volatiles GC-MS spectrometry, VOC compound tracking & CO2 peak window | `components/RoastVolatilesRadar.tsx`<br>`app/volatiles-radar/` |
| **`live-co-cupping-mesh`** | Collaborative multi-user SCA 100-point cupping, live consensus cloud & blind tasting | `components/LiveCoCuppingRoom.tsx`<br>`app/live-cupping-room/` |
| **`terroir-dna-passport`** | Micro-lot direct trade transparent economics, farmer premium (+350%) & varietal DNA | `components/MicroLotPassport.tsx`<br>`app/terroir-passport/` |
| **`custom-blend-crafter`** | AI boutique coffee blend alchemy, origin ratio balancing, dynamic solubility & custom label | `components/CustomBlendCrafter.tsx`<br>`app/blend-crafter/` |
| **`smart-iot-coffee-sync`** | BLE/MQTT smart scale, IoT kettle, and connected espresso machine sync | `components/SmartIoTSync.tsx`<br>`app/smart-iot/` |
| **`ultrasonic-bean-aging`** | Acoustic cavitation degassing formulas and accelerated bean development | `components/UltrasonicBeanAging.tsx`<br>`app/ultrasonic-aging/` |
| **`circadian-caffeine-engine`** | Pharmacokinetic adenosine receptor modeling & optimal caffeine scheduling | `components/CircadianCaffeineClock.tsx`<br>`app/circadian-clock/` |
| **`google-calendar-scheduler`** | Google Calendar & Meet masterclass scheduling, circadian sync & .ics export | `components/GoogleCalendarCoffeeHub.tsx`<br>`app/calendar-hub/` |
| **`thermal-receipt-payment-animation`** | Thermal receipt printer dispense animation, paper tear physics & confetti burst | `components/ThermalReceiptAnimation.tsx`<br>`app/thermal-receipt/` |
| **`notebooklm-coffee-research`** | Cupping notes, sensory radar scorecards & terroir sync to Google Docs/NotebookLM | `components/NotebookLMBrewSync.tsx`<br>`app/notebook-sync/` |
| **`coffee-flavor-matcher`** | Bio-energy flavor matcher, mood-based bean pairings & sensory wheel | `components/BioEnergyMatcher.tsx`<br>`app/bio-energy/` |
| **`coffee-food-sommelier`** | Gourmet pastry & culinary pairing engine for specialty roasts | `components/CoffeeFoodSommelier.tsx`<br>`app/sommelier/` |
| **`roast-club-gamification`** | RoastCoins reward economy, barista academy quests & VIP loyalty tiers | `components/RoastClubGamification.tsx`<br>`app/gamification/` |
| **`whatsapp-crm-automation`** | Automated WhatsApp coffee order dispatch & smart inventory reordering | `components/WhatsAppVoiceOrderModal.tsx`<br>`app/whatsapp-voice/` |
| **`liquid-glass-ui`** | Liquid Glass 4.0 Pro UI aesthetics, 3D card payment, and sticky parallax reels | `components/ScrollParallaxCoffeeShowcase.tsx`<br>`app/parallax-experience/` |
| **`mongodb-authentication`** | NextAuth JWT sessions, user registration, and secure profile dashboard | `components/AuthModal.tsx`<br>`app/auth/`, `app/profile/` |
| **`token-optimization`** | AST code reading, state minification, and token preservation guardian | `.agents/state/`, `.agents/scripts/` |
