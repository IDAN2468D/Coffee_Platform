---
name: whatsapp-crm-automation
description: Automated WhatsApp coffee order dispatch, voice note transcription ordering, smart inventory replenishment triggers, and Roast Club VIP CRM messaging.
---

# 📱 WhatsApp Coffee CRM, Voice Ordering & Dispatch Skill

## 1. Domain Overview
Automates the formatting, verification, voice order extraction, and instant dispatch of gourmet coffee orders, VIP loyalty tier updates, and proactive stock replenishment alerts via WhatsApp API deep links and webhooks.

---

## 2. Voice Note & Audio Order Pipeline
1. **Audio Ingestion:** Receive voice note or transcribed Hebrew audio prompt from user.
2. **Entity Extraction:** Extract coffee origin, quantity, grind type (Beans / Espresso / V60 / French Press), and shipping address.
3. **Availability Validation:** Verify stock in `CoffeeItem` collection and calculate pricing + shipping in ILS (₪).
4. **Deep-Link Generation:** Produce 1-click WhatsApp order dispatch link (`https://wa.me/...`).

---

## 3. Order Message Template (Hebrew RTL)
```text
☕ *הזמנת קפה גורמה חדשה - The Digital Roast*
━━━━━━━━━━━━━━━━━━━━
📦 *מספר הזמנה:* #ROAST-{{orderNumber}}
👤 *שם הלקוח:* {{fullName}}
📞 *טלפון:* {{phone}}
📍 *כתובת למשלוח:* {{deliveryAddress}}

🛒 *פירוט הפריטים:*
{{#items}}
• {{name}} ({{quantity}}x) - ₪{{totalItemPrice}}
  _{{roastLevel}} | טחינה: {{grindType}}_
{{/items}}

💳 *סה"כ לתשלום:* ₪{{totalPrice}}
🎁 *נקודות RoastCoins שנצברו:* +{{earnedRoastCoins}}
━━━━━━━━━━━━━━━━━━━━
_תודה שבחרת בחוויית הקפה המתקדמת בישראל!_
```

---

## 4. Automation Triggers
- **Instant Order Dispatch:** Triggered upon checkout in `components/CartDrawer.tsx`.
- **Smart Inventory Auto-Replenish:** Triggered when customer bean stock reaches $\le 3$ days remaining ($(\text{Total grams}) / (\text{Daily cups} \times 18\text{g}) \le 3$).
- **VIP Level Upgrade:** Triggered on tier transition to Roast Grandmaster (Level 5).
