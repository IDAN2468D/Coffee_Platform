#!/usr/bin/env python3
"""
Customer VIP Tier & Loyalty Scoring Script
"""

def calculate_vip_tier(orders_count, total_spent_ils):
    if total_spent_ils >= 1000 or orders_count >= 20:
        return "BLACK_DIAMOND_VIP"
    elif total_spent_ils >= 500 or orders_count >= 10:
        return "GOLD_BARISTA"
    elif total_spent_ils >= 200:
        return "SILVER_ROAST"
    return "MEMBER"

if __name__ == "__main__":
    tier = calculate_vip_tier(12, 650)
    print(f"Customer Loyalty Tier: {tier}")
