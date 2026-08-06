---
name: self-healing-repair-loop
description: Layer 5 Self-Healing & Auto-Repair Loop for error interception, root cause analysis, sandbox harness testing, surgical fixes, and zero-regression verification.
---

# 🛠️ Layer 5 Self-Healing & Auto-Repair Loop Skill

## Overview
This skill provides the mandatory protocol for intercepting, diagnosing, and surgically fixing code errors, TypeScript compilation failures, and runtime exceptions without swallowing errors or using superficial masking.

---

## 5-Step Execution Workflow

### 1. Error Interception & Full Log Inspection
- When a build, test, or runtime command fails, read the full un-truncated error log.
- Do NOT guess or hypothesize before seeing the actual stack trace.

### 2. Root Cause Classification (RCA)
- **TypeScript Mismatch:** Mismatched prop types, missing exports, or async function signature drift.
- **Null / Undefined Dereference:** Unchecked optional properties or missing initial state.
- **Validation Failure:** Zod schema mismatch between front-end payloads and server actions.
- **Database / Mongoose Error:** Missing required schema fields or unhandled promise rejections.

### 3. Harness Isolation (`.agents/scratch/`)
- Write a minimal 10-line reproducer script in `.agents/scratch/` to verify the failure in isolation.

### 4. Surgical Fix Application
- Fix the root cause in the exact source file.
- Avoid using `any`, suppressions (`@ts-ignore`), or returning empty fallback stubs (`return []` or `catch(e) {}`).

### 5. Zero-Regression Verification
- Re-run `npx tsc --noEmit` and confirm exit code 0.
- Re-run the scratch harness script to confirm the issue is 100% resolved.
