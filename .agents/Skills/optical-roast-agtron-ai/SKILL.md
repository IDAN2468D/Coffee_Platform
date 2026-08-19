---
name: optical-roast-agtron-ai
description: Real-time optical colorimetry, Agtron Gourmet & Commercial scale calculation, whole vs ground bean delta analysis, and Gemini 3.5 Flash Lite Vision roast defect detection.
---

# ☕ Optical Roast Agtron & Vision AI Skill

## Overview
This skill governs the optical spectrophotometry, color space transformation ($L^*a^*b^*$ and RGB to Agtron), whole-to-ground roast delta calculations ($\Delta\text{Agtron}$), and multimodal AI roast defect detection for specialty coffee roasters.

## Core Mathematical & Physics Models

### 1. RGB / $L^*a^*b^*$ to Agtron Gourmet Conversion
Given color reflectance lightness $L^*$ ($0\text{--}100$) and normalized RGB values ($R, G, B \in [0, 1]$):
$$\text{Luminance } Y = 0.2126 \cdot R + 0.7152 \cdot G + 0.0722 \cdot B$$
$$\text{Agtron}_{\text{Gourmet}} = \text{clamp}\left(120 \cdot (Y)^{0.62} - 5, 10, 100\right)$$
$$\text{Agtron}_{\text{Commercial}} = 1.33 \cdot \text{Agtron}_{\text{Gourmet}} - 10$$

### 2. Agtron Roast Classifications (SCA Standard)
| Agtron Gourmet | Agtron Commercial | Roast Level Name | Hebrew Classification | RoR Profile |
| :--- | :--- | :--- | :--- | :--- |
| **95 – 85** | 115 – 100 | Very Light / Cinnamon | קלייה בהירה מאוד (קינמון) | DTR 12-14%, High Acidity |
| **85 – 75** | 100 – 90 | Light / City | קלייה בהירה (City) | DTR 14-16%, Bright Floral |
| **75 – 65** | 90 – 80 | Medium-Light / City+ | קלייה בינונית-בהירה (City+) | DTR 16-18%, Balanced Sweetness |
| **65 – 55** | 80 – 70 | Medium / Full City | קלייה בינונית (Full City) | DTR 18-20%, Caramel/Nuts |
| **55 – 45** | 70 – 55 | Medium-Dark / Full City+ | קלייה בינונית-כהה (Full City+) | DTR 20-22%, Dark Chocolate |
| **45 – 35** | 55 – 40 | Dark / French | קלייה כהה צרפתית (French) | DTR 22-25%, Heavy Body/Smoke |
| **< 35** | < 40 | Very Dark / Italian | קלייה כהה מאוד איטלקית | DTR > 25%, High Roasty Oils |

### 3. Roasting Core Differential ($\Delta\text{Agtron}$)
$$\Delta\text{Agtron} = \text{Agtron}_{\text{Ground}} - \text{Agtron}_{\text{Whole}}$$
- **$\Delta\text{Agtron} \in [0, 8]$**: Sweet Spot (Optimal Heat Transfer & Uniformity).
- **$\Delta\text{Agtron} \in [9, 15]$**: Acceptable (Slight Core Lag).
- **$\Delta\text{Agtron} > 15$**: Underdeveloped Core (Sour / Baked / Grassiness).
- **$\Delta\text{Agtron} < 0$**: Scorched Shell (Excessive drum conductive heat).

### 4. Multimodal Roast Defect Taxonomy
- **Quakers**: Immature beans lacking reducing sugars, fail Maillard reaction ($\text{Agtron} > 85$ inside medium batch).
- **Scorching**: Dark charred patches on bean flat surfaces from overheated drum contact.
- **Tipping**: Charring on the embryo tip of the bean from abrupt convective heat spikes during 1st crack.
- **Facing**: Dark burn marks on flat ventral bean sides from stalled drum rotation.
- **Chipping**: Outer shell fragments peeling off during violent expansion.

## Component & API Mesh
- **API Endpoint:** `/api/gemini/optical-roast/route.ts`
- **Main Component:** `components/OpticalRoastAnalyzer.tsx`
- **App Route:** `app/roast-analyzer/page.tsx`
- **Design Standard:** Liquid Glass 4.0 Pro, 100% Hebrew RTL, Web Audio API feedback.
