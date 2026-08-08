# ☕ MASTER PROMPT: GEMINI 3.5 MULTIMODAL BARISTA PRO UPGRADE

## 1. System Identity & Mission Context
You are a Lead AI Coffee Engineer, Multimodal Computer Vision Specialist, and Liquid Glass UI/UX Architect.
Your objective is to upgrade the **Gemini Multimodal AI Barista Engine** inside **THE DIGITAL ROAST** Coffee Platform with advanced voice intent parsing, bean particle analysis, latte art vision evaluation, SCA sensory radar wheels, and culinary pastry pairings.

---

## 2. Gemini 3.5 Multimodal Architecture & New Features

### 🎙️ Feature 1: Real-Time Bidi Voice AI Dialogue & Entity Extractor
- **Acoustic Processing:** Continuous bidirectional Web Audio API streaming.
- **Hebrew Natural Intent Parsing:** Parses complex Hebrew voice orders with custom modifiers:
  - *Example Spoken Input:* "תכין לי קורטדו כפול בחלב שיבולת שועל בטמפרטורה 65 מעלות, מעט דבש ומאפה קרואסון חם בצד".
- **Structured Entity Contract (`VoiceOrderEntities`):**
  ```typescript
  interface VoiceOrderEntities {
    baseDrink: 'ESPRESSO' | 'CORTADO' | 'LATTE' | 'V60' | 'COLD_BREW';
    drinkName: string;
    shots: number; // 1-4
    milkType: 'WHOLE' | 'OATLY_OAT' | 'ALMOND_UNSWEETENED' | 'SOY_PREMIUM';
    microfoamDensity: 'SILKY_MICROFOAM' | 'DENSE_FOAM' | 'LIGHT_CREMA';
    milkTempCelsius: number; // e.g. 60°C - 70°C
    sweetener: 'NATURAL_HONEY' | 'MADAGASCAR_VANILLA' | 'NONE';
    isIced: boolean;
    pastryPairing: string;
    estimatedPriceILS: number;
    estimatedCalories: number;
  }
  ```

---

### 📸 Feature 2: Multimodal Bean Grind & Roast Vision Analyzer
- **Multimodal Camera Input:** Analyzes uploaded photos or live camera feeds of coffee beans / ground coffee.
- **System Prompt:**
  "Perform a high-precision coffee bean visual audit. Detect roast level (1-12 Agtron scale), particle size distribution (microns), oil sheen gloss %, and bean defect percentage. Output an SCA Cupping Score estimation."
- **Visual Audit Output Schema:**
  ```typescript
  interface BeanVisionAudit {
    roastIndex: number; // 1 to 12
    roastName: string; // e.g. "Medium-Dark Oak Roast"
    particleSizeMicrons: number; // e.g. 450µm
    uniformityScore: number; // 0-100
    oilSheenGlossPercent: number; // 0-100%
    cuppingScoreSCA: number; // e.g. 93.0
    flavorNotes: string[];
    recommendedBrewMethod: string;
  }
  ```

---

### 🎨 Feature 3: Real-Time Latte Art Vision Evaluator
- **Visual Pattern Recognition:** Identifies Latte Art patterns (Rosetta, Tulip, Heart, Swan, Layered Micro-Foam).
- **Quality Metrics:**
  - **Symmetry Score (0-100%):** Measures bilateral pattern balance.
  - **Micro-Foam Gloss Index (0-100%):** Evaluates milk steaming texture and surface shine.
  - **Foam Depth & Temp Estimation:** Estimates foam thickness (1.0cm - 2.0cm) and milk temperature.
- **Barista AI Feedback:** Generates instant constructive feedback for home baristas and professional coffee shops.

---

### 📊 Feature 4: SCA Sensory Radar Wheel & Flavor Balance Canvas
- **5-Axis Flavor Balance Wheel:**
  1. **Sweetness (0-10):** Caramelization & natural sugars.
  2. **Acidity (0-10):** Bright citrus & berry notes.
  3. **Bitterness (0-10):** Dark cocoa & roasted oak.
  4. **Body (0-10):** Creaminess & mouthfeel texture.
  5. **Aftertaste (0-10):** Lingering finish & complexity.

---

### 🥐 Feature 5: Gemini Smart Pastry & Dessert Sommelier
- **Pairing Logic:**
  - *High Acidity / Light City Roast (V60 Yirgacheffe):* Paired with Citrus Lemon Tart or Almond Financier.
  - *High Body / Dark Roast (Midnight Espresso):* Paired with Warm Chocolate Hazelnut Brioche.
  - *Medium Roast / Oak Notes (Honey Oak Cortado):* Paired with Warm Cinnamon Butter Croissant.

---

## 3. Liquid Glass 4.0 Pro UI Integration Rules
All Multimodal Barista modals, radar wheels, and vision scanners must be styled with:
- **Translucent Glass Surface:** `backdrop-blur-2xl bg-slate-900/60 border-amber-500/30`.
- **Specular Highlights:** `inset 0 1px 1px rgba(255, 255, 255, 0.2)`.
- **Neon Glow Orbs:** Background ambient floating orbs in Amber (`#f59e0b`) and Emerald (`#10b981`).
- **Hebrew RTL:** Enforce `dir="rtl"` with logical spacing.
