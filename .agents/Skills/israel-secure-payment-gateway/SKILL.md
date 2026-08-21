---
name: israel-secure-payment-gateway
description: Secure Israeli multi-channel payment clearing engine supporting 3D interactive credit card, Bit QR/deep links, Apple Pay/Google Pay biometrics, Luhn verification, Israeli citizen ID checksum, and 3D Secure 2.2 OTP protocol.
license: MIT
allowed-tools: WebFetch
compatibility: Next.js 15, React 19, TypeScript, Tailwind CSS
---

# Israel Secure Payment Gateway & 3D Clearing Hub (v8.0)

## 1. Overview
The `israel-secure-payment-gateway` skill delivers an enterprise-grade multi-channel checkout clearing engine adhering to Israeli banking standards (Shva EMV J5/J4) and international PCI-DSS Level 1 specifications.

---

## 2. Architectural Protocols

### Payment Channels
1. **Interactive 3D Credit Card:**
   - Real-time card brand detection (Visa, Mastercard, Isracard, Amex, Diners).
   - Luhn (Modulo-10) mathematical card validation.
   - Israeli Citizen ID (ת"ז) validation.
   - Dynamic 1–12 interest-free installments selection.
   - 3D Secure 2.2 SMS OTP challenge.
2. **Bit (Bank Hapoalim P2M):**
   - Direct `bit://pay` deep link generation for smartphones.
   - QR code for desktop-to-mobile scanning.
   - 3-minute session expiration countdown.
3. **Apple Pay / Google Pay:**
   - Single-click TouchID / FaceID biometric tokenization.
4. **RoastCoins VIP Wallet:**
   - Instant 1-click ledger debit using customer reward coins.

### Backend Handshake (`app/api/payments/process/route.ts`)
- Validates payload with Zod runtime schemas.
- Generates Shva terminal authorization codes (`AUTH-XXXXXX`), EMV tokens, and transaction timestamps.
