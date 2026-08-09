# ☕ Coffee Platform Architecture State (v5.0 Pro)

## Active Modules & Component Mapping
- **AI Barista & Sensory:** `GeminiBaristaModal` (`app/ai-barista/`), `BioEnergyMatcher` (`app/bio-energy/`), `SensoryRadarWheel` (`app/sensory-radar/`), `AromaScentProfiler` (`app/aroma-scent/`), `CoffeeFoodSommelier` (`app/sommelier/`).
- **Telemetry & Science:** `V60BrewMaster` (`app/v60/`), `EspressoExtractionTelemetry` (`app/extraction-telemetry/`), `ExtractionSimulator` (`app/extraction-sim/`), `AcousticGrindTuner` (`app/acoustic-tuner/`), `WaterChemistryProfiler` (`app/water-chemistry/`), `UltrasonicBeanAging` (`app/ultrasonic-aging/`).
- **IoT & Automation:** `SmartIoTSync` (`app/smart-iot/`), `SmartInventoryManager` (`app/smart-inventory/`), `CircadianCaffeineClock` (`app/circadian-clock/`), `NotebookLMBrewSync` (`app/notebook-sync/`), `WhatsAppVoiceOrderModal` (`app/whatsapp-voice/`).
- **E-Commerce & Liquid Glass 4.0:** `CoffeeCatalog` (`app/shop/`, `app/catalog/`), `CartDrawer`, `ThreeDCardPayment`, `SubscriptionCalculator` (`app/subscription/`), `ScrollParallaxCoffeeShowcase` (`app/parallax-experience/`), `MultiRoasterMarketplace` (`app/multi-roaster-marketplace/`), `CorporateCoffeeLounge` (`app/corporate-lounge/`).
- **Gamification & Academy:** `RoastClubGamification` (`app/gamification/`), `BaristaSkillAcademy` (`app/barista-academy/`), `ArLatteArtPrinter` (`app/ar-latte-art/`), `PersonalBrewJournal` (`app/personal-brew-journal/`), `LiveCuppingRoom` (`app/live-cupping-room/`).
- **Auth & User Management:** `AuthModal` / `AuthContent` (`app/login/`, `app/register/`, `app/auth/`), `UserProfileClient` (`app/profile/`).

## Mongoose Schemas (`models/`)
- `User`: `{ name, email, passwordHash, phone, role, vipLevel, roastCoins, createdAt }`
- `Order`: `{ orderNumber, fullName, phone, deliveryAddress, items, totalPrice, status, createdAt }`
- `CoffeeItem`: `{ name, hebrewName, category, price, roastLevel, origin, flavorNotes, imageUrl }`
