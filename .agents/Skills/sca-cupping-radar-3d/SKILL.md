---
name: sca-cupping-radar-3d
description: 3D Interactive SCA Flavor Wheel, 100-Point Cupping Score calculation, sensory radar visualization, and Gemini 3.5 Flash Lite tasting note synthesis.
---

# ☕ 3D SCA Cupping Radar & Score Predictor Skill

## Overview
This skill computes official SCA 100-Point Cupping Scores based on the 8 sensory attributes: Fragrance/Aroma, Flavor, Aftertaste, Acidity, Body, Balance, Uniformity, Clean Cup, Sweetness, and Overall.

## Mathematical Model
$$\text{Score}_{\text{SCA}} = \sum_{i=1}^{8} A_i - \text{Defects}$$
- 90 - 100: **Outstanding** (Presidential Specialty)
- 85 - 89.99: **Excellent** (Specialty Top Tier)
- 80 - 84.99: **Very Good** (Specialty Grade)
- < 80: **Below Specialty Grade** (Commercial / Off-grade)

## Integration Mesh
- Component: `components/SCACuppingRadar3D.tsx`
- Route: `app/cupping-radar/page.tsx`
- API: `app/api/gemini/cupping-radar/route.ts` (`gemini-3.5-flash-lite`)
