---
name: ultrasonic-bean-aging
description: Ultrasonic acoustic cavitation, accelerated bean degassing formulas, and rapid green/roasted coffee aging mechanics.
---

# Ultrasonic Bean Aging Skill ⚡

## 1. Domain Overview
Applies high-frequency acoustic ultrasound waves (28 kHz – 40 kHz) to induce micro-cavitation within roasted coffee bean cellular structures, accelerating internal $CO_2$ degassing from 14 days down to 8 minutes while locking in volatile aromatic esters.

## 2. Acoustic Parameters & Equations
- **Acoustic Cavitation Intensity:**
  $$I = \frac{P^2}{2 \rho c}$$
  Where $P$ is acoustic pressure amplitude, $\rho$ is air/medium density, and $c$ is speed of sound.
- **Optimal Ultrasonic Resonance:**
  - **Light Roasts (Ethiopia, Kenya, Geisha):** $35\text{ kHz} - 40\text{ kHz}$ at $60\text{W}$ for $360\text{s}$ (preserves delicate florals, linalool, jasmine notes).
  - **Medium Roasts (Colombia, Costa Rica):** $28\text{ kHz} - 32\text{ kHz}$ at $80\text{W}$ for $480\text{s}$ (accelerates sugar browning aromatics, maltol).
  - **Dark / Espresso Roasts:** $25\text{ kHz} - 28\text{ kHz}$ at $100\text{W}$ for $300\text{s}$ (releases excess crema gas without oxidizing oils).

## 3. System Mapping
- Component: `components/UltrasonicBeanAging.tsx`
- Route: `app/ultrasonic-aging/page.tsx`
