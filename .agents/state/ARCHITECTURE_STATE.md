# ☕ Coffee Platform Architecture State (v6.0 Next-Gen)

## Active Modules & Component Mapping (51 App Routes, 57 Components)
- **Optical & Vision AI:** `OpticalRoastAnalyzer` (`app/optical-roast-analyzer/`), `GeminiBaristaModal` (`app/ai-barista/`).
- **Fermentation & Farm Science:** `CarbonFarmTracker` (`app/sustainability/`), `MolecularPairingRadar` (`app/molecular-pairing/`), `FermentationSimulator` (`app/fermentation-sim/`), `FarmToCupStoryteller` (`app/farm-story/`).
- **3D Physics & Extraction:** `PuckPrepSimulator` (`app/puck-prep-sim/`), `V60BrewMaster` (`app/v60/`), `ColdBrewNitroCalculator` (`app/cold-brew-calculator/`), `EspressoExtractionTelemetry` (`app/extraction-telemetry/`), `ExtractionSimulator` (`app/extraction-sim/`).
- **Sensory & Wellness Science:** `NootropicWellnessMatcher` (`app/nootropic-matcher/`), `WaterChemistryProfiler` (`app/water-chemistry/`), `UltrasonicBeanAging` (`app/ultrasonic-aging/`), `SensoryRadarWheel` (`app/sensory-radar/`), `AromaScentProfiler` (`app/aroma-scent/`), `BioEnergyMatcher` (`app/bio-energy/`).
- **IoT & Automation:** `SmartIoTSync` (`app/smart-iot/`), `SmartInventoryManager` (`app/smart-inventory/`), `CircadianCaffeineClock` (`app/circadian-clock/`), `NotebookLMBrewSync` (`app/notebook-sync/`), `WhatsAppVoiceOrderModal` (`app/whatsapp-voice/`).

## Mongoose Schemas (`models/`)
- `User`: `{ name, email, passwordHash, phone, role, vipLevel, roastCoins, createdAt }`
- `Order`: `{ orderNumber, fullName, phone, deliveryAddress, items, totalPrice, status, createdAt }`
- `CoffeeItem`: `{ name, hebrewName, category, price, roastLevel, origin, flavorNotes, imageUrl }`
