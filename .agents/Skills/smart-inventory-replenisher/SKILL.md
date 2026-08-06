---
name: smart-inventory-replenisher
description: AI consumption rate estimation and automated WhatsApp replenishment triggers
---

# Smart Inventory Replenisher Skill

## Calculation Logic
- Standard bag size = 250g.
- Average espresso dose = 18g per cup.
- Cups per bag = ~13.8 cups.
- Days remaining = `(Total grams in stock) / (Daily cups * 18g)`.
- If Days remaining <= 3, trigger low stock alert and generate 1-click WhatsApp order dispatch payload.
