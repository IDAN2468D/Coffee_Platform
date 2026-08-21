---
name: liquid-glass-ui
description: Liquid Glass 4.0 Pro design system rules, 3D card perspective, magnetic buttons, and ambient glowing glassmorphic surfaces.
---

# ☕ Liquid Glass 4.0 Pro Design System Skill

## 1. Overview & Aesthetic Philosophy
This skill governs the visual design and UX layer of **The Digital Roast AI Platform**. Built for Next.js 15 and React 19, Liquid Glass 4.0 Pro delivers multi-layered glassmorphic surfaces (`backdrop-blur-2xl`), ultra-dark `#050404` canvas, iridescent amber/cyan glows, refractive borders, and 120Hz GPU-accelerated micro-interactions.

---

## 2. Design System Tokens & CSS Parameters

### Glassmorphic Containers (`.liquid-glass`)
- **Background:** `linear-gradient(135deg, rgba(28, 25, 23, 0.65) 0%, rgba(15, 23, 42, 0.45) 100%)`
- **Backdrop Filter:** `backdrop-blur-2xl saturate(180%)`
- **Refractive Border:** `1px solid rgba(245, 158, 11, 0.22)`
- **Inner Specular Sheen:** `inset 0 1px 1px rgba(255, 255, 255, 0.15)`
- **Shadow Matrix:** `0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.08)`

### Ambient Lighting & Floating Orbs
- Ambient glowing background orbs with `filter: blur(120px)` and gentle float animations.
- Iridescent accents: Amber (`#f59e0b`), Cyan (`#06b6d4`), Emerald (`#10b981`), and Royal Purple (`#a855f7`).

### Typography & Colors
- Base Background: Ultra-dark Obsidian `#050404`.
- Text Gradients: `bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-500`.
- Secondary Text: High contrast muted `text-zinc-400` and `text-zinc-300`.

---

## 3. 3D Micro-Interactions & Hardware Acceleration
1. **3D Tilt Perspective Cards (`TiltGlassCard.tsx`):**
   - Perspective tracking (`perspective(1000px) rotateX(deg) rotateY(deg)`).
2. **Magnetic Micro-Buttons (`MagneticButton.tsx`):**
   - Cursor attraction with spring-assisted easing up to 25% boundary offset.
3. **Canvas Steam Particles (`SteamParticlesCanvas.tsx`):**
   - Lightweight rising ambient steam rendered via HTML5 Canvas and `requestAnimationFrame`.
4. **Haptic & Spatial Feedback:**
   - Subtle tactile pulse (`navigator.vibrate([30, 50, 30])`) upon cart modifications.
