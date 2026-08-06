---
name: whatsapp-voice-order-agent
description: Audio voice recognition and order creation via WhatsApp integration
---

# WhatsApp Voice Order Agent Skill

## Workflow
1. Receive audio input / transcribed Hebrew speech prompt.
2. Extract intent: Items, quantities, grind type, delivery address/city.
3. Validate item availability in `CoffeeItem` model.
4. Output structured cart payload + WhatsApp checkout deep link format (`https://wa.me/...`).
