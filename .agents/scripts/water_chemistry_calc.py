#!/usr/bin/env python3
"""
SCA Water Chemistry & Mineral Balance Calculator
"""

import sys

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def calculate_water_profile(calcium_ppm: float, magnesium_ppm: float, bicarbonate_ppm: float, sodium_ppm: float = 5.0):
    gh_ca = calcium_ppm * 2.50
    gh_mg = magnesium_ppm * 4.12
    total_gh = gh_ca + gh_mg
    total_kh = bicarbonate_ppm * 0.82
    estimated_tds = calcium_ppm + magnesium_ppm + bicarbonate_ppm + sodium_ppm

    gh_status = "Optimal" if 50 <= total_gh <= 175 else ("Too Soft" if total_gh < 50 else "Too Hard")
    kh_status = "Optimal (Balanced Acidity)" if 30 <= total_kh <= 50 else ("Low Buffer (Sour/Acidic)" if total_kh < 30 else "High Buffer (Flat/Chalky)")

    return {
        "calcium_ppm": calcium_ppm,
        "magnesium_ppm": magnesium_ppm,
        "bicarbonate_ppm": bicarbonate_ppm,
        "total_gh_caco3": round(total_gh, 2),
        "total_kh_caco3": round(total_kh, 2),
        "estimated_tds": round(estimated_tds, 2),
        "gh_status": gh_status,
        "kh_status": kh_status,
        "flavor_profile": "Bright & Fruity" if magnesium_ppm > calcium_ppm else "Sweet & Creamy Body"
    }

if __name__ == "__main__":
    profile = calculate_water_profile(calcium_ppm=16.0, magnesium_ppm=6.8, bicarbonate_ppm=48.8, sodium_ppm=5.0)
    print(f"Water Profile Test: {profile}")
