---
name: live-co-cupping-mesh
description: Real-time collaborative SCA 100-point cupping sessions, WebRTC/BroadcastChannel sync, live consensus aroma cloud, and calibrated blind tasting comparison engine.
license: MIT
---

# 👥 Live Co-Cupping & Barista Synchronized Mesh Skill

## 1. Overview
Enables real-time collaborative sensory cupping across multiple baristas and coffee enthusiasts, aggregating 100-point SCA scorecards and flavor consensus tags in real-time.

## 2. SCA 100-Point Sensory Taxonomy
1. **Fragrance / Aroma:** Dry grounds & wet crust ($6.00 - 10.00$)
2. **Flavor:** Core gustatory impression ($6.00 - 10.00$)
3. **Aftertaste:** Length and quality of positive finish ($6.00 - 10.00$)
4. **Acidity:** Brightness, phosphoric/malic/citric structure ($6.00 - 10.00$)
5. **Body:** Tactile weight and viscosity ($6.00 - 10.00$)
6. **Balance:** Harmonious integration of all attributes ($6.00 - 10.00$)
7. **Uniformity:** Consistency across all 5 cups ($10.00$)
8. **Clean Cup:** Absence of defects ($10.00$)
9. **Sweetness:** Sucrose/fructose perception ($10.00$)
10. **Overall:** Q-Grader subjective synergy ($6.00 - 10.00$)

## 3. Real-Time Synchronization Protocol
- **Local Multi-Tab Channel:** `BroadcastChannel('digital-roast-cupping')`
- **Consensus Tag Cloud Algorithm:** Normalized frequency weighted by Q-Grader experience level.
- **Blind Cupping Mode:** Hides bean origins and roast dates until all participants submit scores.

## 4. Component & Route Mapping
- **Component:** `components/LiveCoCuppingRoom.tsx`
- **App Route:** `app/live-cupping-room/page.tsx`
