---
name: cryo-milk-science
description: Freeze-distilled milk concentration physics, microfoam bubble size distribution (50-100μm), acoustic steaming wand cavitation, and plant-based protein denaturation thresholds.
license: MIT
---

# 🥛 Cryo-Freeze-Distilled Milk & Ultrasonic Microfoam Skill

## 1. Overview & Physics Engine
This skill models the thermodynamics, lipid/protein concentration, and microfoam texturing for specialty coffee milk science, based on World Barista Championship standards.

## 2. Mathematical Models & Constants
- **Freeze-Distillation (אידוי בהקפאה):**
  $$C_{\text{solids}} = C_0 \cdot \frac{V_0}{V_0 - V_{\text{ice}}} \approx 20\% \text{ total solids}$$
  - Fat content increases from $3.8\%$ to $5.5\%$
  - Protein content increases from $3.2\%$ to $4.8\%$
  - Lactose sweetness concentration multiplier: $\times 1.65$
- **Microfoam Bubble Matrix:**
  $$D_{\text{bubble}} \in [50, 100]\, \mu\text{m} \quad (\text{Velvet microfoam texture})$$
  - Surface tension $\gamma = 0.045\,\text{N/m}$
  - Acoustic Cavitation frequency: $2.4\,\text{kHz}$
- **Plant-Based Denaturation Thresholds:**
  - Oat Milk (*Avena sativa*): $58^\circ\text{C} - 62^\circ\text{C}$ (Above $65^\circ\text{C}$ causes starch gelation)
  - Almond Milk: $55^\circ\text{C} - 60^\circ\text{C}$ (Curdling risk if $\text{pH} < 5.2$)
  - Soy Milk: $60^\circ\text{C} - 65^\circ\text{C}$ (Isoelectric precipitation threshold)

## 3. Component & Route Architecture
- **Component:** `components/CryoMilkSynthesizer.tsx`
- **App Route:** `app/milk-science/page.tsx`
- **Web Audio:** Wand cavitation sound synthesizer via `BiquadFilterNode`
- **UI:** Liquid Glass 4.0 Pro with iridescent pearl & foam canvas simulation
