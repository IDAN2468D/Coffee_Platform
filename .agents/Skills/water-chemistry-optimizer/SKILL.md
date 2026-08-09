---
name: water-chemistry-optimizer
description: SCA water mineral optimization, general & carbonate hardness (GH/KH), buffer alkalinity, and extraction chemistry algorithms.
---

# Water Chemistry Optimizer Skill 💧

## 1. Domain Overview
Water accounts for 98.5% of drip coffee and 90% of espresso. This skill regulates mineral ion concentrations ($Ca^{2+}$, $Mg^{2+}$, $Na^{+}$, $HCO_3^-$) according to SCA Water Quality Standards to maximize sweet volatiles and prevent astringent over-extraction.

## 2. SCA Golden Water Standards
- **Total Dissolved Solids (TDS):** Target 150 ppm (Acceptable: 75–250 ppm).
- **General Hardness (GH):** 68 ppm $CaCO_3$ equivalent (Range: 50–175 ppm).
  - $Mg^{2+}$ (Magnesium): Enhances bright, vibrant, fruity notes (oxygen-rich aromatics).
  - $Ca^{2+}$ (Calcium): Enhances heavy body, creamy sweetness, chocolate/caramel notes.
- **Carbonate Hardness (KH / Buffer Alkalinity):** 40 ppm $CaCO_3$ equivalent (Range: 30–50 ppm).
  - High KH (>60 ppm): Flat, chalky taste, kills acidity.
  - Low KH (<20 ppm): Sour, unbuffered sharp vinegar taste, corrosive to brass boilers.
- **Target pH:** 7.0 (Acceptable: 6.5 – 7.5).

## 3. Component & Action Mapping
- Component: `components/WaterChemistryProfiler.tsx`
- Route: `app/water-chemistry/page.tsx`
- Calculation Script: `.agents/scripts/water_chemistry_calc.py`
