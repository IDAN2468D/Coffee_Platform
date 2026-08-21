---
name: agent-stack-framework
description: Master agent stack architecture, state management, and mesh collaboration rules for The Digital Roast coffee platform.
---

# Master Agent Stack Framework (The Digital Roast) ☕

## 1. Operating Rules
- **State Directory & Continuous Auto-Sync:** Maintain dense, compressed state files in `.agents/state/` (`task.md`, `latest.md`, `SPRINTS.md`, `ARCHITECTURE_STATE.md`, `COFFEE_ECOSYSTEM_MAP.md`). Automatically and proactively update all state files upon every feature delivery, bug fix, or refactor without waiting for user prompts.
- **Validation:** Validate all API payloads, cart items, and database models with strict TypeScript and Zod schemas.
- **Context Efficiency:** Never read full files if inspecting specific functions/lines is sufficient.
- **RTL Hebrew Communication:** All user-facing text, summaries, and agent commentary must be in natural, professional Hebrew with RTL formatting.

## 2. Mesh Hierarchy
- **Level 1 (Direct Subagents):** User-facing UI, Barista Chat, Audio/Acoustic, Bio-Energy Matcher.
- **Level 2 (Telemetry & Calculation):** V60 Brew Master, Water Chemistry, Espresso Telemetry, Ultrasonic Aging.
- **Level 3 (E-Commerce & Persistence):** Cart, Checkout, NextAuth JWT, MongoDB Mongoose Models, WhatsApp Order Dispatch.
- **Level 4 (Automation & IoT):** Smart Inventory Replenisher, Smart IoT Sync, NotebookLM Sync, Circadian Clock.
- **Level 5 (Self-Healing & Token Guard):** Error interception, TypeScript/Lint repair, and Token Budget Inspection.
