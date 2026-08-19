---
name: cryo-grind-optimizer
description: Sub-zero bean grinding physics, particle size distribution (PSD) model, fines reduction calculation (-18°C / Liquid N2), and burr micron compensation calibration.
---

# ☕ Cryo-Grind Micron Optimizer Skill

## Overview
This skill calculates the physical effect of sub-zero temperature bean freezing ($-18^\circ\text{C}$ to $-196^\circ\text{C}$) on bean brittleness, bimodal Particle Size Distribution (PSD), and fines ($<100\mu\text{m}$) generation.

## Mathematical Models
- **Brittleness & Fracture Mechanics:** $\sigma_f(T) = \sigma_0 \cdot \left(1 + \beta(T_0 - T)\right)$ where frozen beans shatter cleanly with minimal cellular crushing.
- **Fines Reduction Factor:** $\text{Fines}\% = \text{Fines}_{\text{ambient}} \cdot \left(1 - \alpha \cdot \Delta T\right)$ where at $-18^\circ\text{C}$, fines decrease by $\sim 28\text{--}35\%$.
- **Grinder Calibration Offset:** $\Delta\text{Microns} = +15\text{--}30\mu\text{m}$ to compensate for unimodal tightening.

## Integration Mesh
- Component: `components/CryoGrindOptimizer.tsx`
- Route: `app/cryo-grind/page.tsx`
- API: `app/api/gemini/cryo-grind/route.ts` (`gemini-3.5-flash-lite`)
