---
name: circadian-caffeine-engine
description: Biological adenosine receptor modeling, circadian sleep-wake cycle caffeine kinetics, and alertness curve scheduling.
---

# Circadian Caffeine Engine Skill ⏰

## 1. Domain Overview
Models plasma caffeine concentration kinetics ($C(t)$) in relation to endogenous cortisol rhythm and adenosine receptor saturation to recommend optimal coffee drinking windows.

## 2. Pharmacokinetic Mathematical Model
- **First-Order Elimination Curve:**
  $$C(t) = C_0 \cdot e^{-k_e \cdot t}$$
  Where $k_e = \frac{\ln(2)}{t_{1/2}}$, with mean elimination half-life $t_{1/2} \approx 5.0\text{ hours}$ (standard range: $3.5 - 7.0\text{ hours}$).
- **Circadian Cortisol Windows:**
  - **Morning Cortisol Peak (07:30 - 09:00):** Natural alertness high — avoid heavy caffeine to prevent tolerance.
  - **Optimal Morning Boost (09:30 - 11:30):** Cortisol dip — optimal window for high-caffeine single origins (200mg+).
  - **Afternoon Slump (13:30 - 15:00):** Second cortisol dip — recommended pour-over or flat white (100–140mg).
  - **Sleep Cutoff Boundary (16:30+):** Switch to decaf or low-caffeine species (Coffea Eugenioides / Arabica Laurina) to preserve Stage 3/4 Deep Slow-Wave Sleep (SWS).

## 3. System Mapping
- Component: `components/CircadianCaffeineClock.tsx`
- Route: `app/circadian-clock/page.tsx`
