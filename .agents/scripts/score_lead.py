#!/usr/bin/env python3
"""
Simple helper script to calculate Lead Score for Real Estate leads.
"""

def calculate_lead_score(budget_ils, timeline_months, has_phone, has_email):
    score = 0
    if budget_ils >= 10_000_000:
        score += 40
    elif budget_ils >= 5_000_000:
        score += 25
    else:
        score += 15

    if timeline_months <= 3:
        score += 30
    elif timeline_months <= 6:
        score += 20
    else:
        score += 10

    if has_phone and has_email:
        score += 30
    elif has_phone:
        score += 20

    return score

if __name__ == "__main__":
    sample_score = calculate_lead_score(budget_ils=12000000, timeline_months=1, has_phone=True, has_email=True)
    print(f"Sample Hot Lead Score: {sample_score}/100")
