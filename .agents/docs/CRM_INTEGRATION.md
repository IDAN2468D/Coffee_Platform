# WhatsApp Business API & Order Automation Integration

## Integration Architecture
1. **User Checkout Trigger:** User submits form on landing page or Next.js app.
2. **Server Action Validation:** `lib/actions/orderActions.ts` parses payload using Zod.
3. **Payload Formatting:** Formats order details into a clean Hebrew WhatsApp message:
```text
☕ *הזמנת קפה חדשה - THE DIGITAL ROAST*
━━━━━━━━━━━━━━━━━━━━
👤 *שם הלקוח:* ישראל ישראלי
📱 *טלפון:* 050-1234567
📍 *כתובת למשלוח:* ראשון לציון, הרצל 10

📦 *פריטים בהזמנה:*
• Honey Oak Cortado (3 שוטים, חלב שיבולת שועל) - ₪25
• ערכת חליטה V60 קרמית - ₪189

💰 *סה"כ לתשלום:* ₪214
━━━━━━━━━━━━━━━━━━━━
🚀 *סטטוס:* ממתין להכנה בבר הקפה
```
4. **WhatsApp URL Redirection:** User is redirected to `https://wa.me/97235558888?text=...`.
