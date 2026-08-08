---
name: liquid-glass-3d-coffee
description: Specialized skill for Liquid Glass 4.0 Pro UI design, 3D animations, canvas steam particles, magnetic buttons, and Gemini 3.5 AI Coffee Platform.
---

# ☕ Liquid Glass 4.0 Pro & 3D Coffee Platform Skill

## 1. Overview & Core Mission
This skill governs the development and maintenance of **THE DIGITAL ROAST** — a gourmet coffee ordering platform featuring Liquid Glass 4.0 Pro UI, 3D animations, Canvas steam particles, Next.js 15 (App Router), React 19, MongoDB Auth, and Gemini 3.5 AI.

---

## 2. Liquid Glass 4.0 Pro & Animation Directives

### Glassmorphism Surface Parameters (`.liquid-glass`)
- **Background:** `linear-gradient(135deg, rgba(28, 25, 23, 0.65) 0%, rgba(15, 23, 42, 0.45) 100%)`
- **Backdrop Filter:** `blur(24px) saturate(180%)`
- **Refractive Border:** `1px solid rgba(245, 158, 11, 0.22)`
- **Inner Specular Sheen:** `inset 0 1px 1px rgba(255, 255, 255, 0.15)`

### 3D Animations & Micro-Interactions
1. **3D Tilt Glass Cards (`TiltGlassCard.tsx`):**
   - Apply 3D perspective rotation (`perspective(1000px) rotateX(deg) rotateY(deg)`) based on relative cursor position.
2. **Magnetic Micro-Buttons (`MagneticButton.tsx`):**
   - Apply spring-assisted cursor tracking attracting CTA buttons towards mouse movement (up to 25% offset).
3. **Canvas Steam Particles (`SteamParticlesCanvas.tsx`):**
   - Render continuous rising ambient steam specks via HTML5 Canvas and `requestAnimationFrame`.
4. **Haptic Pulse Feedback:**
   - Trigger `navigator.vibrate([30, 50, 30])` on item additions to cart.

---

## 3. Gemini 3.5 AI Modules & Technical Constraints

### Gemini Multimodal Barista
- Parse natural spoken Hebrew orders into structured `VoiceOrderEntities`.
- Analyze photos of coffee beans for Agtron roast index (1-12) and SCA Cupping Score.
- Analyze photos of Latte Art for bilateral symmetry % and micro-foam texture.

### Next.js 15 & React 19 Architecture
- Enforce App Router structure under `app/coffee/page.tsx` and `app/actions/`.
- Validate all inputs using Zod schemas (`lib/validations/`).
- Enforce native Hebrew RTL (`dir="rtl"`).
