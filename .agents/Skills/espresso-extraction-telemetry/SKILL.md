---
name: espresso-extraction-telemetry
description: Espresso extraction yield calculation, TDS scoring, and grind adjustment engine
---

# Espresso Extraction Telemetry Skill

## Formulas & Metrics
- **Brew Ratio:** `Yield Weight (g) / Dose Weight (g)` (Standard Espresso target: 1:2 to 1:2.5).
- **TDS (Total Dissolved Solids):** Standard espresso target = 8.5% - 12.0%.
- **Extraction Yield (%):** `(Yield Weight * TDS %) / Dose Weight`. Ideal target = 18.0% - 22.0%.
- **Grind Adjustment Rules:**
  - Fast flow (< 22s) / Sour taste: Under-extracted -> Fine grind adjustment needed (+1 to +3 micro-clicks finer).
  - Slow flow (> 35s) / Bitter taste: Over-extracted -> Coarse grind adjustment needed (+1 to +3 micro-clicks coarser).
