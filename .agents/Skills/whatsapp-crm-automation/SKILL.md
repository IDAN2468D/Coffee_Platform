---
name: whatsapp-crm-automation
description: Automated WhatsApp coffee order dispatch, smart inventory replenishment triggers, and Roast Club VIP CRM messaging.
---

# WhatsApp Coffee CRM & Order Dispatch Skill 📱

## 1. Domain Overview
Automates the formatting, verification, and dispatch of gourmet coffee orders, VIP loyalty tier updates, and proactive replenishment alerts via WhatsApp API deep links and webhooks.

## 2. Order Message Template (Hebrew RTL)
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

## 3. Automation Triggers
- **Instant Order Dispatch:** Triggered upon checkout completion in `components/CartDrawer.tsx` and `app/actions/`.
- **Smart Inventory Reorder:** Auto-triggered when customer bean stock reaches $\le 3$ days remaining.
- **Roast Club VIP Upgrade:** Auto-triggered when customer reaches Level 5 (Roast Grandmaster).
