# ☕ Coffee Platform - Complete Architecture State

## 1. Active Client & UI Components (`components/`)
- `Header.tsx`: Glassmorphic navigation header with live cart count and user auth state.
- `Footer.tsx`: Gourmet coffee footer with links, RTL support, and brand identity.
- `CartDrawer.tsx`: Slide-over cart drawer powered by Zustand (`useCartStore`).
- `CoffeeCatalog.tsx`: Interactive filterable coffee catalog (Espresso, V60, Pastry, Cold Brew).
- `GeminiBaristaModal.tsx`: Multimodal voice & vision AI assistant modal.
- `BioEnergyMatcher.tsx`: Bio-energy level and mood coffee matching engine.
- `V60BrewMaster.tsx`: Live step-by-step pouring ratio timer & brew controller.
- `CropsterOriginMap.tsx`: Interactive origin map showing bean altitude, farm, and process.
- `ExtractionSimulator.tsx`: Real-time extraction physics simulator (grind, pressure, flow rate).

## 2. Authentication & Server Routes (`app/`)
- `app/page.tsx`: Core homepage bringing together all components.
- `app/login/page.tsx`: Liquid Glass 4.0 Login page with Zod validation.
- `app/register/page.tsx`: Registration page with password hashing.
- `app/actions/authActions.ts`: Next.js 15 Server Actions for registration & authentication.
- `app/actions/whatsappActions.ts`: Instant WhatsApp message formatter and dispatcher.

## 3. Mongoose Schemas & Database (`models/` & `lib/`)
- `lib/mongodb.ts`: Cached Mongoose connection helper with failover logic.
- `models/User.ts`: User schema with bcrypt password hashing & roles.
- `models/CoffeeItem.ts`: Coffee schema with origin, roast level, caffeine content.
- `models/Order.ts`: Order schema supporting items, delivery address, WhatsApp status.
