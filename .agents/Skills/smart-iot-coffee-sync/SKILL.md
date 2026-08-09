---
name: smart-iot-coffee-sync
description: Telemetry synchronization with BLE/MQTT smart scales, IoT precision kettles, and connected espresso machines.
---

# Smart IoT Coffee Sync Skill 📡

## 1. Domain Overview
Provides real-time bi-directional telemetry and device pairing with smart coffee equipment over Web Bluetooth API and WebSockets/MQTT.

## 2. Supported Devices & Protocols
- **Smart Scales (Acaia Lunar/Pearl, Felicita, Hiroia Jimmy, Decent Scale):**
  - Flow rate telemetry (g/s), auto-tare trigger, real-time weight broadcasting (0.01g precision).
- **Variable Temperature Kettles (Fellow Stagg EKG+, Timemore Smart Fish):**
  - Target temperature setpoint ($85^\circ\text{C} - 96^\circ\text{C}$), hold-temp status, heating ramp curve.
- **Espresso Pressure Profilers (Decent DE1, La Marzocco Linea Micra/Mini IoT):**
  - Pressure profile curves (1–9 bar), pre-infusion duration, boiler temperature telemetry ($93.5^\circ\text{C} \pm 0.2^\circ\text{C}$).

## 3. System Mapping
- Component: `components/SmartIoTSync.tsx`
- Route: `app/smart-iot/page.tsx`
- Auto-syncs live brew metrics with `PersonalBrewJournal` and `V60BrewMaster`.
