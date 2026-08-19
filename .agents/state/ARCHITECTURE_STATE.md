# ☕ Coffee Platform Architecture State (v7.0 Ultra)

## Active Modules & Component Mapping (71 App Routes, 75 Components)
- **Israel & Municipal Science:** `IsraelWaterIntelligence` (`app/israel-water-radar/`), `IsraelRoasterDirectory` (`app/israel-roasters/`).
- **Commodity & Global FX:** `CoffeeCommodityFXTicker` (`app/coffee-fx-ticker/`), `GlobalFXCoffeeTicker` (`app/fx-ticker/`).
- **Research, Cloud & PKM:** `GoogleCalendarCoffeeHub` (`app/calendar-hub/`), `NotebookLMCloudHub` (`app/notebooklm-hub/`), `NotebookLMBrewSync` (`app/notebook-sync/`).
- **Optical & Vision AI:** `GemmaRoastVisionInspector` (`app/gemma-roast-vision/`), `OpticalRoastAnalyzer` (`app/optical-roast-analyzer/`), `GeminiBaristaModal` (`app/ai-barista/`).
- **Database & CLV Analytics:** `MongoRoastAnalyticsDashboard` (`app/mongo-telemetry/`).
- **Design Studio & Token Engine:** `StitchDesignThemeStudio` (`app/stitch-studio/`).
- **Thermal & Roast Science:** `RoastThermalSimulator` (`app/roast-thermal-sim/`), `RoastProfileRadar` (`app/roast-profile/`).
- **Fermentation, Terroir & Farm:** `TerroirClimateRadar` (`app/terroir-climate-radar/`), `CarbonFarmTracker` (`app/sustainability/`), `MolecularPairingRadar` (`app/molecular-pairing/`), `FermentationSimulator` (`app/fermentation-sim/`), `FarmToCupStoryteller` (`app/farm-story/`).
- **3D Physics & Extraction:** `SyphonIbrikLab` (`app/syphon-ibrik-lab/`), `ColdDripTelemetry` (`app/cold-drip-telemetry/`), `PuckPrepSimulator` (`app/puck-prep-sim/`), `V60BrewMaster` (`app/v60/`), `ColdBrewNitroCalculator` (`app/cold-brew-calculator/`), `EspressoExtractionTelemetry` (`app/extraction-telemetry/`), `ExtractionSimulator` (`app/extraction-sim/`).
- **Sensory, Water & Audio Science:** `AudioCuppingGuide` (`app/audio-cupping-guide/`), `MineralBypassEngine` (`app/mineral-bypass-engine/`), `NootropicWellnessMatcher` (`app/nootropic-matcher/`), `WaterChemistryProfiler` (`app/water-chemistry/`), `UltrasonicBeanAging` (`app/ultrasonic-aging/`), `SensoryRadarWheel` (`app/sensory-radar/`), `AromaScentProfiler` (`app/aroma-scent/`), `BioEnergyMatcher` (`app/bio-energy/`).
- **IoT & Automation:** `SmartIoTSync` (`app/smart-iot/`), `SmartInventoryManager` (`app/smart-inventory/`), `CircadianCaffeineClock` (`app/circadian-clock/`), `WhatsAppVoiceOrderModal` (`app/whatsapp-voice/`).

## Mongoose Schemas (`models/`)
- `User`: `{ name, email, passwordHash, phone, role, vipLevel, roastCoins, createdAt }`
- `Order`: `{ orderNumber, fullName, phone, deliveryAddress, items, totalPrice, status, createdAt }`
- `CoffeeItem`: `{ name, hebrewName, category, price, roastLevel, origin, flavorNotes, imageUrl }`
