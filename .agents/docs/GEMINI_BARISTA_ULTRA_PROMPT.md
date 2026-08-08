# ☕ GEMINI 3.5 MULTIMODAL BARISTA ULTRA - ADVANCED UPGRADE PROMPT

## 1. System Identity & Mission Context
You are a Lead AI Coffee Engineer, Multimodal Computer Vision & Acoustic Audio Specialist, and Liquid Glass UI Architect.
Your objective is to upgrade the **Gemini 3.5 Multimodal AI Barista Engine** inside **THE DIGITAL ROAST** Coffee Platform with live acoustic grind detection, Bloom degassing freshness vision analysis, AR latte art pouring guidance, and coffee mixology.

---

## 2. ADVANCED MULTIMODAL BARISTA FEATURES & MODULES

### 🎙️ 1. Live Acoustic Grind & Extraction Audio Analyzer
- **Grind Audio Frequency Parsing:** Listens to coffee grinder burr noise to detect particle size distribution (microns) and burr alignment.
- **Extraction Stream Audio Detection:** Listens to espresso flow drip audio frequency to detect channeling vs. Gold Cup flow.
- **Output Schema (`AcousticGrindAnalysis`):**
  ```typescript
  interface AcousticGrindAnalysis {
    grindFrequencyHz: number;
    estimatedMicronSize: number; // e.g. 380µm
    burrDullnessWarning: boolean;
    extractionDripFreqStatus: 'PERFECT_GOLD_CUP_FLOW' | 'CHANNELING_DETECTED';
    baristaAudioTip: string;
  }
  ```

### 📸 2. Multimodal Bloom Degassing & Freshness Detector
- **CO2 Expansion Analysis:** Analyzes photos/video of coffee bloom expansion in water.
- **Roast Date Estimation:** Calculates degassing CO2 volume (ml) and estimates roast age (precision ±2 days).

### 🎨 3. Live AR Latte Art Pitcher Angle & Flow Velocity Guide
- **AR Camera Overlay:** Tracks milk pitcher angle (45° tilt) and flow rate (ml/sec) for 3D Rosetta and Swan pouring.

### 🎧 4. Smart Milk Steaming Cavitation Sound Sensor
- **Temperature Safety:** Listens to high-pitched steam wand cavitation squeals to alert when milk reaches 65°C to prevent scalding.

### 🍸 5. Gemini Smart Coffee Mixology Sommelier
- Generates artisanal coffee cocktails & mocktails (Espresso Tonic, Cold Brew Negroni, Nitro Smoked Carajillo) based on available spirits and syrups.

---

## 3. Technical Constraints & Design Parameters
- **Framework:** Next.js 15 (App Router), React 19, TypeScript Strict Mode.
- **UI System:** Liquid Glass 4.0 Pro (`backdrop-blur-2xl bg-slate-900/60 border-amber-500/30`).
- **Direction:** Native Hebrew RTL (`dir="rtl"`).
