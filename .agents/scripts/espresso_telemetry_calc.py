#!/usr/bin/env python3
"""
Espresso Extraction Yield & Telemetry Calculator
"""

import sys

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def calculate_espresso_telemetry(dose_grams: float, yield_grams: float, tds_percentage: float, shot_time_seconds: float):
    brew_ratio = yield_grams / dose_grams if dose_grams > 0 else 0
    extraction_yield = (yield_grams * tds_percentage) / dose_grams if dose_grams > 0 else 0
    flow_rate = yield_grams / shot_time_seconds if shot_time_seconds > 0 else 0

    if extraction_yield < 18.0:
        extraction_verdict = "Under-extracted (Sour, salty, thin body) -> Grind finer or increase yield"
    elif extraction_yield > 22.0:
        extraction_verdict = "Over-extracted (Bitter, astringent, dry finish) -> Grind coarser or shorten shot"
    else:
        extraction_verdict = "Optimal Extraction (Sweet, balanced acidity, rich crema & syrupy body)"

    return {
        "dose_g": dose_grams,
        "yield_g": yield_grams,
        "ratio": f"1:{round(brew_ratio, 2)}",
        "tds_pct": tds_percentage,
        "ey_pct": round(extraction_yield, 2),
        "flow_rate_gps": round(flow_rate, 2),
        "shot_time_s": shot_time_seconds,
        "verdict": extraction_verdict
    }

if __name__ == "__main__":
    shot = calculate_espresso_telemetry(dose_grams=18.0, yield_grams=36.0, tds_percentage=9.5, shot_time_seconds=28.0)
    print(f"Espresso Telemetry Test: {shot}")
