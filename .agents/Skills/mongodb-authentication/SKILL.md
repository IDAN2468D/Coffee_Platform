---
name: mongodb-authentication
description: MongoDB Authentication, NextAuth.js JWT, and .env Environment Isolation Rules
---

# MongoDB Authentication Skill

## Core Directives
1. **Environment Variable Isolation:**
   - NEVER commit `.env` or `.env.local` to git repositories.
   - Always reference `process.env.MONGODB_URI` and `process.env.JWT_SECRET`.
2. **Password Security:**
   - Always hash passwords using HMAC SHA-256 or bcrypt. Never store plaintext passwords.
3. **Validation:**
   - Validate all login and registration inputs using `lib/validations/auth.ts` Zod schemas.
