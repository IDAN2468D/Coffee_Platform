# Feature Implementation Plan: [Coffee Platform Feature Name]

## 1. Overview & Business Objective
Provide a concise overview of the new feature or enhancement for **THE DIGITAL ROAST** Coffee Platform.
- **Problem Statement:** Describe the customer pain point or feature request (e.g., custom milk selection, V60 brew timer).
- **Target Value:** Explain how this feature increases order conversion, average order value (AOV), or user retention.

## 2. Technical Scope & Affected Files
List all files, API routes, database schemas, and components affected by this implementation.
- **Components:** `components/coffee/...`
- **Pages & App Router:** `app/coffee/...`
- **API Routes / Server Actions:** `app/api/coffee/...` / `app/actions/coffee.ts`
- **Schemas & Models:** `lib/models/CoffeeItem.ts`, `lib/validations/coffee.ts`
- **Zustand Stores:** `lib/store/coffeeStore.ts`

## 3. Step-by-Step Implementation Roadmap
1. [ ] **Data Model & Zod Schema Definition:**
   - Define TypeScript interfaces and Zod validation schemas for input sanitization.
   - Update or create Mongoose schemas with indexed fields.
2. [ ] **Core Business Logic & Helper Functions:**
   - Implement price calculation, nutrition estimation, or AI prompt handlers.
   - Write unit tests in `lib/__tests__/`.
3. [ ] **UI Component Construction (Liquid Glass 4.0 Pro):**
   - Build responsive React 19 components using `backdrop-blur-2xl`, glassmorphic cards, and iridescent gradients.
   - Ensure full Hebrew RTL compatibility (`dir="rtl"`, logical Tailwind spacing `ms-*`, `me-*`).
4. [ ] **Integration & State Synchronization:**
   - Wire UI components to Zustand cart store and Next.js 15 Server Actions.
5. [ ] **Verification & Testing:**
   - Run type checks (`npx tsc --noEmit`).
   - Run Node.js audit script in `.agents/scratch/architectural-audit.js`.

## 4. Verification & Acceptance Criteria
- [ ] TypeScript strict mode compiles without errors or `any` type casting.
- [ ] UI renders correctly across mobile (375px) and desktop (1440px) viewports in RTL mode.
- [ ] Zod schema rejects malformed or malicious payloads.
- [ ] Order details sync cleanly to WhatsApp API payload.
