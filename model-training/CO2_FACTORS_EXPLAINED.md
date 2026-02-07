# CO2 Conversion Factors - Reference Guide

This document explains how the CO2 savings are calculated in the dataset. All values are based on real-world research from EPA, Carbon Trust, and academic studies.

## How to Read the Dataset

Each row represents one day of eco-friendly activities. The CO2 saved is calculated by:

**CO2 Saved = (Action Quantity) × (CO2 Factor)**

Then all actions are added together for the total daily CO2 saved.

---

## Conversion Factors Used

### 🔄 RECYCLING

| Action | CO2 Factor | Explanation |
|--------|------------|-------------|
| **Plastic Bottle** | 0.082 kg CO2 | Recycling 1 plastic bottle saves 0.082 kg CO2 compared to making a new bottle from virgin plastic |
| **Aluminum Can** | 0.166 kg CO2 | Recycling aluminum saves 95% of energy vs. new production. 1 can = 0.166 kg CO2 saved |
| **Paper (per kg)** | 0.9 kg CO2 | Recycling 1 kg of paper saves energy and avoids methane from landfill decomposition |
| **Cardboard (per kg)** | 0.75 kg CO2 | Recycling cardboard reduces manufacturing emissions |
| **Glass Bottle** | 0.15 kg CO2 | Glass recycling saves energy in production process |

### ♻️ REUSABLE ITEMS

| Action | CO2 Factor | Explanation |
|--------|------------|-------------|
| **Reusable Bag (per use)** | 0.04 kg CO2 | Each use avoids producing/disposing 1 plastic bag (~0.04 kg CO2) |
| **Reusable Water Bottle (per use)** | 0.082 kg CO2 | Avoids buying 1 plastic water bottle (production + transportation) |

### 🚴 TRANSPORTATION (vs. Driving Alone)

| Action | CO2 Factor | Explanation |
|--------|------------|-------------|
| **Mile Biked** | 0.411 kg CO2 | Average car emits 0.411 kg CO2 per mile. Biking saves 100% |
| **Mile Walked** | 0.411 kg CO2 | Same as biking - avoids car emissions completely |
| **Mile Public Transit** | 0.255 kg CO2 | Buses/trains emit less per person than cars. Saves ~62% of car emissions |
| **Mile Carpooled** | 0.206 kg CO2 | Carpooling (2 people) cuts emissions in half per person |

*Note: Based on average passenger vehicle (404g CO2/mile)*

### 🥗 FOOD CHOICES (vs. Meat-Based Meals)

| Action | CO2 Factor | Explanation |
|--------|------------|-------------|
| **Vegetarian Meal** | 2.5 kg CO2 | Beef production is carbon-intensive (methane, feed, land use). Vegetarian meal saves ~2.5 kg vs. beef meal |
| **Vegan Meal** | 3.5 kg CO2 | No animal products = even lower emissions. Saves ~3.5 kg vs. meat meal |
| **Local Food (per kg)** | 0.2 kg CO2 | Local food reduces transportation emissions (~20% reduction) |

*Note: Beef meals have highest emissions (~7.2 kg CO2). Chicken ~1.2 kg. Plant-based ~0.9 kg*

### 💡 ENERGY SAVING

| Action | CO2 Factor | Explanation |
|--------|------------|-------------|
| **LED Bulb Hour** | 0.045 kg CO2 | LED uses ~80% less energy than incandescent. Per hour of use saves ~0.045 kg CO2 |
| **Cold Water Laundry (per load)** | 0.9 kg CO2 | ~90% of washer energy heats water. Cold water saves ~0.9 kg per load |
| **Line Dried Laundry (per load)** | 2.3 kg CO2 | Electric dryers use ~3 kWh per load. Line drying avoids this completely |

*Note: Based on average US electricity grid emissions (~0.42 kg CO2/kWh)*

### 🌱 COMPOSTING

| Action | CO2 Factor | Explanation |
|--------|------------|-------------|
| **Composting (per kg)** | 0.5 kg CO2 | Food waste in landfills produces methane (28× worse than CO2). Composting avoids this |

---

## Example Calculation

Let's say you did these actions in one day:

- Recycled 5 plastic bottles
- Biked 4 miles (instead of driving)
- Ate 2 vegetarian meals
- Used reusable bag 3 times

**Calculation:**
```
Plastic bottles: 5 × 0.082 = 0.41 kg CO2
Miles biked:     4 × 0.411 = 1.64 kg CO2
Vegetarian meals: 2 × 2.5  = 5.00 kg CO2
Reusable bags:   3 × 0.04  = 0.12 kg CO2
                           ___________
TOTAL:                     7.17 kg CO2 saved
```

**Annual Impact (if maintained):**
- 7.17 kg/day × 365 days = 2,617 kg CO2/year
- That's equivalent to planting ~125 trees! 🌳

---

## Data Sources

1. **EPA (Environmental Protection Agency)**
   - Waste reduction model (WARM)
   - Greenhouse gas equivalencies calculator

2. **Carbon Trust**
   - Product carbon footprint research
   - Transportation emissions data

3. **Academic Research**
   - Lifecycle assessment studies
   - Food production emissions (Poore & Nemecek, 2018)

4. **IPCC (Intergovernmental Panel on Climate Change)**
   - Global warming potential values
   - Methane conversion factors

---

## Important Notes

⚠️ **These are AVERAGE values:**
- Actual savings vary by region (electricity grid mix, transportation distance, etc.)
- Conservative estimates used where ranges exist
- Values represent "avoided emissions" compared to baseline alternatives

✅ **All calculations in the dataset are mathematically correct:**
- No random numbers for CO2 saved
- Each row's CO2 value = sum of (action × factor)
- You can verify any row by hand!

---

## Using This Dataset

This dataset is perfect for:
- Training machine learning models to predict CO2 savings
- Building eco-tracking apps/websites
- Educational projects about climate action
- Gamifying sustainable behavior

**The key insight:** Small daily actions add up! Someone saving 20 kg CO2/day = 7,300 kg/year = planting 350 trees! 🌍

