#!/usr/bin/env python3
"""
Comprehensive Nutrition & Price Calculator Script
"""
import json
import sys

def calculate_coffee_details(base_drink, base_price, shots, milk_type, syrup_shots=0):
    caffeine_mg = shots * 75
    
    milk_calories = {
        "whole": 120,
        "oat": 110,
        "almond": 35,
        "soy": 80,
        "none": 0
    }
    
    base_cal = 10 if base_drink.lower() in ["espresso", "cortado"] else 30
    total_calories = base_cal + milk_calories.get(milk_type.lower(), 80) + (syrup_shots * 40)
    
    extra_shots = max(0, shots - 2)
    extra_price = extra_shots * 3.0
    total_price = base_price + extra_price + (syrup_shots * 2.0)
    
    return {
        "base_drink": base_drink,
        "total_price_ils": total_price,
        "caffeine_mg": caffeine_mg,
        "calories_est": total_calories,
        "milk_used": milk_type
    }

if __name__ == "__main__":
    result = calculate_coffee_details("Honey Oak Cortado", 22.0, 3, "oat", 1)
    print(json.dumps(result, indent=2, ensure_ascii=False))
