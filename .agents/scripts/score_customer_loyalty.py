import sys
import json

def calculate_loyalty_score(order_val, is_subscriber, has_custom_profile, used_bio_matcher):
    score = 0
    # Order Value
    if order_val >= 250:
        score += 40
    elif order_val >= 100:
        score += 25
    else:
        score += 15

    # Subscription
    if is_subscriber:
        score += 30
    else:
        score += 10

    # Engagement
    if has_custom_profile:
        score += 15
    if used_bio_matcher:
        score += 15

    tier = "Silver Enthusiast"
    if score >= 80:
        tier = "Platinum VIP"
    elif score >= 50:
        tier = "Gold Connoisseur"

    return {"score": score, "tier": tier}

if __name__ == "__main__":
    result = calculate_loyalty_score(280, True, True, True)
    print(json.dumps(result))
