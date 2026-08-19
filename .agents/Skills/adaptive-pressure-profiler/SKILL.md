---
name: adaptive-pressure-profiler
description: Real-time espresso pressure profiling, flow profiling kinetics, declining extraction curves, and BLE/JSON export for smart espresso machines.
---

# ☕ Adaptive Pressure & Flow Profiler Skill

## Overview
This skill calculates dynamic pressure profiles ($0\text{--}12\text{ bar}$) and water flow rates ($0\text{--}8\text{ ml/s}$) across the 4 extraction phases (Pre-infusion, Ramp-up, Peak extraction, Declining finish).

## Mathematical Models
- **Pre-Infusion Soak:** $P_{\text{pre}} \in [2.0, 3.5]\text{ bar}$, Duration: $4\text{--}10\text{ s}$ to saturate puck and prevent channeling.
- **Ramp-Up Rate:** $\frac{dP}{dt} \approx 2.5\text{ bar/s}$ until target extraction pressure ($9.0\text{ bar}$).
- **Declining Pressure (Lever Emulation):** $P(t) = P_{\text{peak}} \cdot e^{-k(t - t_{\text{peak}})}$ down to $5.5\text{ bar}$ to prevent over-extraction of bitter tannins.
- **Flow Restriction & Resistance:** $R_{\text{puck}} = \frac{\Delta P}{Q_{\text{flow}}}$ where $Q$ is flow in $\text{ml/s}$.

## Integration Mesh
- Component: `components/PressureFlowProfiler.tsx`
- Route: `app/pressure-profiler/page.tsx`
- API: `app/api/gemini/pressure-profiler/route.ts` (`gemini-3.5-flash-lite`)
