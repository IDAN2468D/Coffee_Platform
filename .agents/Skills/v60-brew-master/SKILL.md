---
name: v60-brew-master
description: V60 pour-over timer, bloom phase kinetics, 4:6 method profiles, Gold Cup extraction telemetry, and Web Audio API audio pacing.
---

# ☕ V60 Brew Master & Extraction Kinetics Skill

## 1. Domain Overview
Governs precision pour-over extraction, live phase timing, bloom degassing kinetics, and SCA Gold Cup standard adherence for specialty pour-over coffee.

---

## 2. Brewing Algorithms & Parameters

### Standard Golden Ratio Profile
- **Coffee Dose:** 15.0g (Medium-Fine grind, ~450–550 µm).
- **Total Water:** 248g (Brew Ratio: 1:16.5).
- **Water Temperature:** 92.0°C – 94.5°C.
- **Total Contact Time (TCT):** 2:45 – 3:15 minutes.

### Phase Breakdown
1. **Bloom Phase (0:00 – 0:45s):**
   - Pour: 50g hot water (approx 3x dry dose).
   - Degassing: $CO_2$ expansion and bed saturation.
2. **First Pulse / Sweetness Pour (0:45 – 1:30):**
   - Pour to 120g in concentric spirals.
3. **Second Pulse / Body & Acidity (1:30 – 2:15):**
   - Pour to 190g maintaining constant water head.
4. **Final Drawdown (2:15 – 3:00):**
   - Pour to 248g total. Drawdown finish with flat bed.

---

## 3. Web Audio & Sensory Feedback
- Web Audio API spatial frequency pulses (`BiquadFilterNode` at 440Hz/880Hz) signaling phase transitions.
- Real-time TDS% estimation: 1.25% – 1.45% (Gold Cup Extraction Yield: 19.5% – 21.5%).
