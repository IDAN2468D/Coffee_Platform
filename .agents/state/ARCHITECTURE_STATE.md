# ☕ Coffee Platform Architecture State (v8.0 Ultra)

## Active Modules & Component Mapping (95 App Routes, 91 Components)
- **Multi-Channel Secure Payment Gateway (Sprint 15):** `ThreeDCardPayment 2.0` (`components/ThreeDCardPayment.tsx`), `Payment Processor API` (`app/api/payments/process/route.ts`), `Payment Validations` (`lib/validations/payment.ts`).
- **Cart & Israel Address System (Sprint 14):** `CartDrawer` (`components/CartDrawer.tsx`), `IsraelAddressAutocomplete` (`components/IsraelAddressAutocomplete.tsx`), `Israel Address API` (`app/api/israel-addresses/route.ts`), `useCartStore` (`lib/store/useCartStore.ts`).
- **Skills-IL & AI Mesh Hub:** `SkillsILInteractiveHub` (`app/skills-hub/`), `GeminiBaristaModal` (`app/ai-barista/`), `GlobalVoiceNavigator` (`components/GlobalVoiceNavigator.tsx`).
- **Israel & Municipal Science:** `IsraelWaterCalibrator` (`app/israel-water/`), `IsraelWaterIntelligence` (`app/israel-water-radar/`), `IsraelRoasterDirectory` (`app/israel-roasters/`).
- **Commodity, Direct Trade & DNA Passport:** `MicroLotPassport` (`app/terroir-passport/`), `DirectTradeTransparencyCalculator` (`app/direct-trade/`), `CoffeeCommodityFXTicker` (`app/coffee-fx-ticker/`), `GlobalFXCoffeeTicker` (`app/fx-ticker/`).
- **Research, PKM & Lab Sync:** `BaristaResearchLabHub` (`app/barista-lab/`), `GoogleCalendarCoffeeHub` (`app/calendar-hub/`), `NotebookLMCloudHub` (`app/notebooklm-hub/`), `NotebookLMBrewSync` (`app/notebook-sync/`).
- **Receipt & Checkout Micro-Interactions:** `ThermalReceiptAnimation` (`app/thermal-receipt/`), `ThreeDCardPayment` (`components/ThreeDCardPayment.tsx`), `OrderInvoiceModal` (`components/OrderInvoiceModal.tsx`), `GoogleDriveReceiptSync` (`components/OrderHistoryView.tsx`).
- **Optical & Vision AI:** `GemmaRoastVisionInspector` (`app/gemma-roast-vision/`), `OpticalRoastAnalyzer` (`app/optical-roast-analyzer/`).
- **Design Studio & Token Engine:** `StitchDesignThemeStudio` (`app/stitch-studio/`).
- **Thermal, Volatiles & Roast Science:** `RoastVolatilesRadar` (`app/volatiles-radar/`), `RoastThermalSimulator` (`app/roast-thermal-sim/`), `RoastProfileRadar` (`app/roast-profile/`).
- **Fermentation, Terroir & Custom Blend:** `CustomBlendCrafter` (`app/blend-crafter/`), `TerroirClimateRadar` (`app/terroir-climate-radar/`), `CarbonFarmTracker` (`app/sustainability/`), `MolecularPairingRadar` (`app/molecular-pairing/`), `FermentationSimulator` (`app/fermentation-sim/`), `FarmToCupStoryteller` (`app/farm-story/`).
- **3D Physics & Extraction:** `SyphonIbrikLab` (`app/syphon-ibrik-lab/`), `ColdDripTelemetry` (`app/cold-drip-telemetry/`), `PuckPrepSimulator` (`app/puck-prep-sim/`), `V60BrewMaster` (`app/v60/`), `ColdBrewNitroCalculator` (`app/cold-brew-calculator/`), `EspressoExtractionTelemetry` (`app/extraction-telemetry/`), `ExtractionSimulator` (`app/extraction-sim/`), `PressureFlowProfiler` (`app/pressure-profiler/`).
- **Sensory, Water, Cryo-Milk & Audio Science:** `CryoMilkSynthesizer` (`app/milk-science/`), `AudioCuppingGuide` (`app/audio-cupping-guide/`), `LiveCoCuppingRoom` (`app/live-cupping-room/`), `MineralBypassEngine` (`app/mineral-bypass-engine/`), `NootropicWellnessMatcher` (`app/nootropic-matcher/`), `WaterChemistryProfiler` (`app/water-chemistry/`), `UltrasonicBeanAging` (`app/ultrasonic-aging/`), `SensoryRadarWheel` (`app/sensory-radar/`), `AromaScentProfiler` (`app/aroma-scent/`), `BioEnergyMatcher` (`app/bio-energy/`).
- **IoT & Automation:** `SmartIoTSync` (`app/smart-iot/`), `SmartInventoryManager` (`app/smart-inventory/`), `CircadianCaffeineClock` (`app/circadian-clock/`), `WhatsAppVoiceOrderModal` (`app/whatsapp-voice/`).

## Mongoose Schemas (`models/`)
- `User`: `{ name, email, passwordHash, phone, role, vipLevel, roastCoins, createdAt }`
- `Order`: `{ orderNumber, fullName, phone, deliveryAddress, items, totalPrice, status, driveReceiptId, driveReceiptUrl, driveSyncedAt, createdAt }`
- `CoffeeItem`: `{ name, hebrewName, category, price, roastLevel, origin, flavorNotes, imageUrl }`
