# Gemini Coffee Flavor Profiler & Nutrition Engine

## Overview
The Coffee Flavor Profiler calculates flavor harmony, caffeine levels, and caloric estimates based on ingredient choices.

## Formulas & Logic
1. **Caffeine Calculation:**
   - Base espresso shot = 75 mg caffeine.
   - Total Caffeine = `shots * 75` mg.
2. **Calorie Estimation:**
   - Base Espresso (2 shots) = 10 kcal.
   - Whole Milk (200ml) = +120 kcal.
   - Oat Milk Oatly (200ml) = +110 kcal.
   - Almond Milk Unsweetened = +35 kcal.
   - Syrup shot (Honey/Madagascar Vanilla) = +40 kcal.
3. **Price Calculation:**
   - Base Price: Configured per drink (e.g. Midnight Espresso = ₪18, Honey Oak Cortado = ₪22).
   - Extra Shots: ₪3 per shot above 2 shots.
