---
name: roast-volatiles-radar
description: Roast volatiles gas chromatography spectrometry, VOC aromatic compound modeling (Pyrazines, Furans, Esters), CO2 degassing half-life decay, and peak extraction flavor window optimization.
license: MIT
---

# 🔬 Roast Volatiles & Gas Chromatography Radar Skill

## 1. Overview
Models the volatile organic compound (VOC) generation during pyrolysis and Strecker degradation, predicting peak aroma intensity and degassing curves ($CO_2$).

## 2. Chemical Families & Sensory Mapping
- **Furans & Furanones:** Caramel, burnt sugar, sweet malty notes (Formed via Maillard reaction & sucrose caramelization).
- **Pyrazines:** Roasted hazelnut, cacao, toasted bread (Formed via $\alpha$-amino acid condensation).
- **Esters & Aldehydes:** Floral jasmine, bergamot, stone fruit (Abundant in high-altitude washed light roasts).
- **Phenols & Guaiacols:** Clove, smoky, spicy notes (Dominant in dark/Vienna roasts).

## 3. Degassing Kinetics Formula
$$V_{\text{CO}_2}(t) = V_{\text{total}} \cdot \left(1 - e^{-k_{\text{degas}} \cdot t}\right)$$
- **Peak Flavor Window (חלון הטעם האופטימלי):**
  $$t_{\text{peak}} \in [7, 21]\, \text{days post-roast (Light/Medium)}, \quad [4, 12]\, \text{days (Dark)}$$

## 4. Component & Route Mapping
- **Component:** `components/RoastVolatilesRadar.tsx`
- **App Route:** `app/volatiles-radar/page.tsx`
- **Visualization:** Recharts / HTML5 Canvas VOC Mass Spectrogram with interactive peak detection
