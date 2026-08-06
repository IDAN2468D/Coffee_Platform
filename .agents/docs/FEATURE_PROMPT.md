# ☕ THE DIGITAL ROAST - Feature & Design Upgrade Prompt Guide

## 1. Executive Summary & Intent
This document serves as the master structured prompt guide for ongoing AI-driven upgrades to **THE DIGITAL ROAST** Coffee Ordering Platform. The objective is to incrementally enhance the existing codebase with cutting-edge Gemini 3.5 AI capabilities, Liquid Glass 4.0 Pro UI design standards, and Hebrew RTL user flows without overwriting core functionalities.

---

## 2. Liquid Glass 4.0 Pro UI & Design Guidelines
When generating or modifying UI components, strictly enforce the following visual parameters:

- **Glassmorphic Surface (`.liquid-glass`):**
  - Background: `linear-gradient(135deg, rgba(28, 25, 23, 0.65) 0%, rgba(15, 23, 42, 0.45) 100%)`
  - Backdrop Filter: `blur(24px) saturate(180%)`
  - Refractive Border: `1px solid rgba(245, 158, 11, 0.22)`
  - Inner Glow: `inset 0 1px 1px rgba(255, 255, 255, 0.15)`
- **Color Palette:**
  - Base Background: Deep Obsidian `#050404` / Slate `#020617`
  - Accent Colors: Espresso Gold `#f59e0b`, Emerald Neon `#10b981`, Cyan Glow `#06b6d4`
  - Text Gradients: `from-yellow-200 via-amber-400 to-amber-500`
- **Ambient Lighting:**
  - Floating background glowing orbs with `filter: blur(100px)` and smooth CSS animations (`animate-pulse-slow`, `animate-float`).

---

## 3. Gemini 3.5 AI Feature Integration Matrix

### Feature 1: Gemini Multimodal Voice & Vision Barista
- **Voice Agent:** Real-time speech-to-intent parsing for natural Hebrew orders (e.g. "קורטדו כפול בחלב שיבולת שועל").
- **Vision Agent:** Image classification of coffee bean photos to extract roast level, origin notes, and brewing recommendations.

### Feature 2: Gemini Bio-Energy & Mood Matcher
- **Inputs:** User energy state (Focus, Relax, Study, Exercise).
- **Output:** Matches caffeine mg, espresso shot count, and syrup harmony.

### Feature 3: Gemini Live V60 Brew Master
- **Interactive Timer:** Real-time pouring alerts for Bloom phase (0-45s) and 1:15 water-to-coffee ratio guidance.

### Feature 4: Agentic WhatsApp Order Dispatcher
- **Action:** 1-Click payload generation sending structured order details directly to WhatsApp Business API.

---

## 4. Hebrew RTL & Technical Stack Constraints
- **Framework:** Next.js 15 (App Router), React 19, TypeScript Strict Mode.
- **Direction:** Enforce `dir="rtl"` on containers and logical spacing (`ms-*`, `me-*`).
- **Data Validation:** Zod schemas for all order and item models.
