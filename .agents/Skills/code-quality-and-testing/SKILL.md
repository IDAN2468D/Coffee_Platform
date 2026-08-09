---
name: code-quality-and-testing
description: Strict TypeScript quality standards, Next.js 15 App Router conventions, React 19 async patterns, and Mongoose validation rules.
---

# Code Quality & Testing Skill 🛡️

## 1. Quality Standards
- **TypeScript Strict Mode:** Zero `any` types. All props and return values must be explicitly typed or strictly inferred.
- **Next.js 15 & React 19:**
  - Client components must declare `'use client'` at line 1.
  - Dynamic route parameters (`params`, `searchParams`) must be handled according to Next.js 15 async rules.
  - Server actions must validate all arguments with Zod schemas.
- **Tailwind & Liquid Glass 4.0 Pro:**
  - Enforce `backdrop-blur-2xl`, ultra-dark dark mode `#050404`, iridescent cyan/amber gradients, and crisp 1px borders with `border-white/10`.
  - Maintain bidirectional support with RTL `dir="rtl"` layout correctness.
- **MongoDB / Mongoose:**
  - Ensure connection caching with `global._mongooseClientPromise` in `lib/mongodb.ts`.
  - Validate schema keys with default fallbacks to prevent runtime `undefined` errors.
