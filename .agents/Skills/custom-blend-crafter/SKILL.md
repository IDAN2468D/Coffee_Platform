---
name: custom-blend-crafter
description: AI custom boutique coffee blend alchemy, multi-origin percentage balancing, dynamic solubility/TDS equilibrium simulation, and personalized label printing.
license: MIT
---

# 🧬 AI Flavor DNA Matrix & Custom Blend Crafter Skill

## 1. Overview
Empowers users to formulate custom boutique coffee blends by mixing percentages of distinct single-origin beans, with dynamic real-time recalculation of solubility, body, acidity, and sensory radar notes.

## 2. Blend Alchemy Equations
- **Weighted Sensory Vector:**
  $$\vec{S}_{\text{blend}} = \sum_{i=1}^n w_i \cdot \vec{S}_i, \quad \text{where } \sum w_i = 1.0$$
- **Solubility & Extraction Balance:**
  - High-density washed beans (Acidity/Brightness anchor: $40\% - 60\%$)
  - Natural/Honey anaerobic beans (Sweetness/Fruit anchor: $20\% - 40\%$)
  - Wet-hulled / Monsooned beans (Body/Crema anchor: $10\% - 20\%$)
- **Target Brew Recipe Synthesis:** Automatically recalculates grind micron size, water temperature ($91^\circ\text{C} - 94^\circ\text{C}$), and optimal brew ratio ($1:15.5 - 1:16.5$).

## 3. Component & Route Mapping
- **Component:** `components/CustomBlendCrafter.tsx`
- **App Route:** `app/blend-crafter/page.tsx`
- **Cart Integration:** Direct addition of custom-formulated blend bag to Zustand Cart with generated blend metadata.
