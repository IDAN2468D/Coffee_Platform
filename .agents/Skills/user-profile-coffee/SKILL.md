---
name: user-profile-coffee
description: Specialized skill for Liquid Glass 4.0 Pro User Profile Page, VIP Loyalty Cards, AI Flavor DNA, Order History Tracking, and Next.js 15 / React 19 architecture.
---

# ☕ User Profile & VIP Lounge Skill - Liquid Glass 4.0 Pro

## 1. Overview & Core Mission
This skill governs the construction and maintenance of the **User Profile & VIP Lounge Page** (`app/profile/page.tsx`) for **THE DIGITAL ROAST** Coffee Platform.

---

## 2. Profile Page Feature Matrix & Architecture

### 1. Holographic VIP Membership Card (`BiometricVIPPass.tsx`)
- **Tiers:** `MEMBER`, `SILVER_ROAST`, `GOLD_BARISTA`, `BLACK_DIAMOND_VIP`.
- **Styling:** Holographic glass glare, golden/emerald neon glow, QR code scanner for in-store pickup, loyalty points counter (1,450 pts).

### 2. AI Flavor DNA & SCA Taste Radar
- 5-axis flavor preference wheel (Acidity, Sweetness, Bitterness, Body, Roast Depth).
- Saved favorite blends (Midnight Espresso, Honey Oak Cortado).

### 3. Live Order Tracking & History
- Real-time order status progress bar (`RECEIVED` -> `BREWING` -> `OUT_FOR_DELIVERY` -> `DELIVERED`).
- Re-order with 1-Click WhatsApp integration.

### 4. Coffee Subscription Manager
- Manage active monthly bean delivery frequency, quantity, and pause/resume controls.

### 5. MongoDB Auth & Account Security
- Password change handler, phone number verification, 2FA toggle, `.env` isolation.

---

## 3. Design System (Liquid Glass 4.0 Pro)
- **Container Styling:** `liquid-glass` (`backdrop-blur-2xl`, `bg-slate-900/60`, `border-amber-500/22`).
- **Typography:** Hebrew RTL (`dir="rtl"`), ILS currency formatting (`₪`).
- **Framework:** Next.js 15 App Router, React 19 Client/Server Components.
