# MongoDB Authentication & Environment Isolation Guide

## 1. Overview
Full authentication & user management pipeline powered by MongoDB, NextAuth.js/JWT, Zod input validation, and environment isolation via `.env`.

## 2. Environment Variables (`.env.example` / `.env.local`)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/digital_roast?retryWrites=true&w=majority
NEXTAUTH_SECRET=a8f9c2d1e3b4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=digital_roast_jwt_secret_key_2026_super_secure
```

## 3. Mongoose User Model (`lib/models/User.ts`)
- `email`: String (Unique, Indexed)
- `fullName`: String
- `phone`: String (E.164)
- `passwordHash`: String (SHA-256 / bcrypt)
- `role`: Enum ['CUSTOMER', 'BARISTA', 'ADMIN']

## 4. Next.js 15 Server Actions (`app/actions/authActions.ts`)
- `registerUserAction(formData)`: Validates input with Zod, hashes password, saves user in MongoDB.
- `loginUserAction(formData)`: Authenticates credentials, creates JWT session token.
