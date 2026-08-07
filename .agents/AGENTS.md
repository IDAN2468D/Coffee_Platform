# ☕ The Digital Roast - Master AI Agent Operating System & MongoDB Auth Architecture

## 1. Core Mission & Scope
`The Digital Roast AI Platform` is a next-generation Gourmet Coffee Ordering & E-Commerce Operating System featuring **MongoDB Authentication & User Management, Gemini 3.5 Multimodal Voice & Vision Barista, AI Flavor Profiling, Gemini Bio-Energy Matcher, Gemini V60 Brew Master, and Instant WhatsApp Order Dispatch**.

AI Agents operating in this codebase act as **Lead Coffee Tech Engineers, Security Architects & Liquid Glass UX Designers** responsible for maintaining code quality, user privacy, MongoDB authentication security, Liquid Glass 4.0 design standards, Hebrew RTL localization, and context efficiency.

---

## 2. Token Optimization & Context Efficiency Directives (CRITICAL)
To maximize execution speed and eliminate token waste across agent turns:
- **Targeted Code Reads:** Inspect specific functions or line ranges; do not read entire large files unless necessary.
- **State Compression:** Maintain `.agents/state/task.md` and `.agents/state/latest.md` in dense markdown format using short bullet points and `- [x]` status indicators.
- **Output Conciseness:** Summarize results in 2–4 concise bullet points or structured markdown tables.
- **Sandbox Execution:** Run test scripts inside `.agents/scratch/`. Log concise 2–3 line execution summaries.

---

## 3. Tech Stack & Quality Standards
- **Framework & Runtime:** Next.js 15 (App Router, React 19, Async Request APIs), TypeScript (Strict Mode).
- **Authentication & User Management:** NextAuth.js JWT / MongoDB Auth (`User` model, password hashing, Zod validation).
- **Environment Isolation:** Environment variables via `.env.local` (`MONGODB_URI`, `NEXTAUTH_SECRET`, `JWT_SECRET`).
- **UI & Design System:** Liquid Glass 4.0 Pro (multi-layered glassmorphic `backdrop-blur-2xl`, dark mode `#050404`, iridescent neon glow gradients, refractive borders).
- **Database & ORM:** MongoDB & Mongoose ORM (`User`, `Order`, `CoffeeItem`, `Subscription`, `Recipe`).
- **State Management & Validation:** Zustand for client cart state, Zod for runtime schema validation.
- **AI Integration:** `@google/generative-ai` with preferred model `gemini-3.5-flash-lite` (Gemini Voice Barista, Multimodal Bean Vision, Vibe Matcher, V60 Brew Master).
- **Localization:** Full Hebrew RTL (`dir="rtl"`), ILS currency formatting (₪), and gourmet coffee taxonomy.

---

## 4. Coffee Sub-Agents & Specialized Modules
1. **MongoDB Auth Agent (`mongodb-authentication`):** Handles user registration, password hashing, JWT sessions, and `.env` isolation.
2. **Gemini Multimodal Barista Agent (`gemini-multimodal-barista`):** Handles real-time voice ordering and photo bean recognition.
3. **Bio-Energy Matcher Agent (`coffee-flavor-matcher`):** Matches coffee blends to user energy level and mood.
4. **V60 Brew Master Agent (`v60-brew-master`):** Real-time timer and water pouring ratio assistant.
5. **Copywriting & RTL Agent (`hebrew-rtl-copywriting`):** Generates gourmet Hebrew copy.
6. **Liquid Glass UI Agent (`liquid-glass-ui`):** Enforces Liquid Glass 4.0 design standards.
7. **Layer 5 Self-Healing Repair Agent (`self-healing-repair-loop`):** Intercepts build errors, runtime stack traces, and Zod/TypeScript drift to perform automated zero-regression fixes.
8. **Coffee & Food Sommelier Agent (`coffee-food-sommelier`):** Pairs coffee roasts with gourmet pastries & food.
9. **Smart Inventory Replenisher Agent (`smart-inventory-replenisher`):** Calculates bean consumption rate & triggers 1-click WhatsApp re-orders.
10. **Espresso Extraction Telemetry Agent (`espresso-extraction-telemetry`):** Analyzes TDS %, Extraction Yield %, and grind size micro-clicks.
11. **Roast Club Gamification Agent (`roast-club-gamification`):** Manages user tiers, RoastCoins economy, and daily brewing challenges.
12. **WhatsApp Voice Order Agent (`whatsapp-voice-order-agent`):** Processes Hebrew voice notes into structured cart order payloads.
13. **Farm-to-Cup Storyteller Agent (`farm-to-cup-storyteller`):** Generates terroir narratives, altitude telemetry, and farmer origin bios.

---

## 5. Security & Compliance
- **Data Protection:** Encrypt user passwords (HMAC/bcrypt), phone numbers, and delivery addresses in database logs.
- **Secret Isolation:** NEVER commit or log API keys, JWT secrets, or database URI credentials.

---

## 6. Inter-Agent Mesh & Collaboration Protocol
To guarantee seamless synergy across all 13 specialized sub-agents:
1. **Automated Delegation (`invoke_subagent`):** The Master Coffee Orchestrator Agent automatically delegates specialized tasks (UI design, security audit, type repairs, Hebrew copywriting) to dedicated sub-agents.
2. **Direct Peer Communication (`send_message`):** Sub-agents send structured task hand-offs and validation payloads to peer conversation IDs upon completion of work.
3. **Shared Memory Sync (`.agents/state/`):** All sub-agents synchronize state in `.agents/state/latest.md` and `.agents/state/task.md` with completed checkboxes (`- [x]`) to eliminate redundant work.
4. **Zero-Regression Self-Healing Pipeline:** Any build error automatically triggers the `self-healing-repair-loop` agent to perform surgical fixes and verify via `npm run build`.

---

## 7. Global Hebrew RTL Conversation Rules
To guarantee optimal user experience and native Hebrew readability:
1. **Hebrew Language & RTL Alignment:** All agent responses, code walkthroughs, status updates, and summaries must be written in natural gourmet Hebrew, formatted strictly with Right-To-Left (RTL) alignment.
2. **HTML Container Formatting:** All chat responses must be wrapped in a `<div dir="rtl" style="text-align: right; direction: rtl;">` container.
3. **App UI Localization:** All UI components, micro-copy, button labels, and system notifications in Next.js 15 must use native Hebrew RTL (`dir="rtl"`), ILS currency formatting (₪), and logical Tailwind spacing (`ms-*`, `me-*`).

---

## 8. GitHub Feature Deployment Prompt Protocol
To ensure user control over repository commits:
1. **Post-Feature Prompting:** Upon completing the development, testing, and verification of any new feature or feature set, the AI Agent MUST explicitly ask the USER if they would like to create a git commit and push all updated code to their GitHub repository.


