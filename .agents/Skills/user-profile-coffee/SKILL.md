---
name: user-profile-coffee
description: VIP passbook, SCA taste radar, monthly subscription management, and MongoDB user profile guidelines.
---

# 👤 User Profile & VIP Lounge Skill

## Overview
Guidelines for maintaining the User Profile & VIP Lounge page (`app/profile/page.tsx`) in THE DIGITAL ROAST platform.

## Key Guidelines
1. **Holographic VIP Passbook Card:**
   - Supports tiers: `BLACK_DIAMOND_VIP`, `ROAST_MASTER_VIP`, `BARISTA_GOLD_VIP`.
   - Displays live RoastCoins points, QR code for order pickup, and member join date.
2. **SCA Taste Radar & Gemini AI Flavor DNA:**
   - Visualizes user taste preference vectors (Sweetness, Acidity, Body, Bitterness, Floral Aroma).
3. **Live Order Tracking:**
   - Real-time status pipeline: `RECEIVED` ➔ `BREWING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`.
4. **Subscription Management:**
   - Active bean subscription controls: pause, resume, change roast level or delivery frequency.
5. **MongoDB Security:**
   - Sensitive user fields (password hash, JWT tokens) must remain isolated in server-side execution context.
