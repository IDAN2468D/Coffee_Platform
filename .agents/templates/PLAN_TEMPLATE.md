# 🛠️ Feature Implementation Plan: [Feature Name]

## 1. Executive Summary & Objectives
Provide a concise technical summary of the proposed feature or architectural enhancement for **THE DIGITAL ROAST** Coffee Platform.

- **Problem & Goal:** Briefly state what is being implemented and why.
- **Key Architectural Touchpoints:** Next.js 15 App Router, React 19, MongoDB Mongoose, Gemini 3.5 API, Liquid Glass 4.0 Pro, Web Audio & Speech Engine.

---

## 2. User Review & Architectural Decoupling

> [!IMPORTANT]
> - **Type Import Isolation:** ALWAYS use `import type { ... }` when referencing interface types from Next.js server API routes (`/app/api/.../route.ts`) inside `'use client'` components to prevent Webpack runtime bundle errors (`TypeError: Cannot read properties of undefined (reading 'call')`).
> - **Design System Alignment:** Enforce Liquid Glass 4.0 Pro design system (`backdrop-blur-2xl`, `#050404` obsidian background, iridescent neon glow gradients, refractive borders).
> - **Hebrew RTL:** Enforce full Right-To-Left (`dir="rtl"`) layout and ILS (₪) currency formatting across all components.

---

## 3. Technical Scope & Affected File Matrix

| Component / Layer | Action | Target Path | Responsibility |
| :--- | :--- | :--- | :--- |
| **Data Schema** | `[NEW / MODIFY]` | `models/[ModelName].ts` | Mongoose document schema & Zod runtime validation |
| **API Route** | `[NEW / MODIFY]` | `app/api/gemini/[feature]/route.ts` | Gemini 3.5 API route handler with fallback logic |
| **UI Component** | `[NEW]` | `components/[FeatureName].tsx` | Client React 19 component with Liquid Glass UI & Web Audio |
| **Audio Engine** | `[MODIFY]` | `lib/audio/coffeeSounds.ts` | Sound effects & Hebrew Speech Synthesis (TTS) triggers |
| **State Store** | `[MODIFY]` | `lib/store/useCartStore.ts` | Zustand client state & cart management |
| **Header Nav** | `[MODIFY]` | `components/Header.tsx` | Navigation link & icon integration |
| **Page Layout** | `[MODIFY]` | `app/home/page.tsx` | Component rendering & smooth anchor scroll section |

---

## 4. Step-by-Step Implementation Roadmap

### Phase 1: Data Model & API Infrastructure
- [ ] Define Mongoose schema in `models/` with TypeScript types and Zod schemas.
- [ ] Create or update Next.js 15 API route in `app/api/gemini/` with `@google/generative-ai` fallback handling (`gemini-3.5-flash-lite`).

### Phase 2: UI Component Construction (Liquid Glass 4.0 Pro)
- [ ] Create `'use client'` React 19 component in `components/`.
- [ ] Implement responsive layout with Liquid Glass styling (`backdrop-blur-2xl`, glassmorphic cards, neon glows).
- [ ] Wire Web Audio sound effects (`coffeeSound.playSliderTick()`, `playCoffeeSteam()`) and Hebrew Speech Synthesis (`coffeeSound.speakHebrew()`).
- [ ] Ensure strict type imports (`import type { ... }`) for API contracts.

### Phase 3: Home Page & Navigation Integration
- [ ] Add navigation icon and link in `components/Header.tsx`.
- [ ] Render section container in `app/home/page.tsx` with smooth anchor scroll ID (`scroll-mt-28`).

### Phase 4: Build Verification & Testing
- [ ] Execute production build verification (`npm run build`).
- [ ] Ensure 0 TypeScript errors, 0 lint warnings, and 0 Webpack runtime import leaks.

---

## 5. Acceptance Criteria Checklist

- [ ] Production build (`npm run build`) passes cleanly with exit code 0.
- [ ] Interface renders in native Hebrew RTL (`dir="rtl"`) with ILS (₪) currency.
- [ ] Web Audio sound effects and Hebrew TTS execute without console errors.
- [ ] 1-Click addition to Zustand cart store (`useCartStore`) and WhatsApp dispatch work seamlessly.
