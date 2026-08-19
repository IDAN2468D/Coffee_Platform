---
name: nitro-coldbrew-physics
description: Cold brew extraction kinetics, temperature modulation (4°C to 18°C), dissolved N2 gas physics, cascade effect simulation, and TDS refraction scoring.
---

# ☕ Nitro & Cold Brew Gas Physics Skill

## Overview
This skill models the extraction kinetics of cold coffee immersion, the dissolution and nucleation of nitrogen ($N_2$) and nitrous oxide ($N_2O$) micro-bubbles, and the physics of the cascading head effect.

## Mathematical Models
- **Extraction Kinetics:** $\text{EY}(t) = \text{EY}_{\max} \cdot \left(1 - e^{-k(T) \cdot t}\right)$ where $k(T) = k_0 \cdot \exp\left(-\frac{E_a}{R \cdot T}\right)$.
- **Dissolved Gas Saturation (Henry's Law):** $C = k_H(T) \cdot P_{N_2}$ where $P_{N_2} \approx 35\text{--}45\text{ PSI}$ at $2^\circ\text{C}\text{--}4^\circ\text{C}$.
- **Cascade Fall Velocity (Stokes' Law modified for buoyant microbubbles in downward convective circulation):** $v_{\text{cascade}} \approx 1.2\text{--}2.5\text{ cm/s}$.

## Integration Mesh
- Component: `components/NitroColdBrewLab.tsx`
- Route: `app/cold-brew-lab/page.tsx`
- API: `app/api/gemini/nitro-lab/route.ts` (`gemini-3.5-flash-lite`)
