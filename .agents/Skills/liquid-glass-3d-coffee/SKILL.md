---
name: liquid-glass-3d-coffee
description: Liquid Glass 4.0 Pro design system parameters, 3D tilt glass cards, canvas steam particles, and magnetic cursor attraction.
---

# 🧪 Liquid Glass 4.0 Pro & 3D Visual Effects Skill

## Core Design Tokens
- **Glassmorphic Surface (`.liquid-glass`):**
  - `background: linear-gradient(135deg, rgba(28, 25, 23, 0.65) 0%, rgba(15, 23, 42, 0.45) 100%)`
  - `backdrop-filter: blur(24px) saturate(180%)`
  - `border: 1px solid rgba(245, 158, 11, 0.22)`
  - `box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 20px 50px rgba(0, 0, 0, 0.6)`

## Interactive Components
1. **3D Tilt Glass Cards (`TiltGlassCard.tsx`):**
   - Perspective 1000px rotation on hover with mouse X/Y tracking.
2. **Canvas Steam Particles (`CanvasCoffeeSteam.tsx`):**
   - HTML5 Canvas ambient steam particles rising smoothly with alpha decay.
3. **Magnetic Buttons (`MagneticButton.tsx`):**
   - Cursor attraction effect for high-priority CTA actions.
4. **Haptic Feedback:**
   - Trigger `navigator.vibrate([30, 50, 30])` on item additions to cart where supported.
