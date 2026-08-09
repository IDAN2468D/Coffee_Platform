---
name: acoustic-grind-tuner
description: Real-time microphone FFT spectral analysis for coffee grinder burr calibration, acoustic frequency telemetry, and micron distribution scoring.
---

# Acoustic Grind Tuner Skill 🎧

## 1. Domain Overview
The Acoustic Grind Tuner analyzes audio frequencies emitted during the coffee bean grinding cycle via Web Audio API FFT analyzer to estimate particle size distribution (microns) and burr alignment.

## 2. Core Acoustic Metrics & Telemetry
- **Spectral Frequency Peaks:**
  - **Fine / Espresso (200–400µm):** Dominant peak at 4.2 kHz – 6.5 kHz (High-pitch friction chirp).
  - **Medium / V60 (400–700µm):** Dominant peak at 2.5 kHz – 4.0 kHz (Resonant bean fracture).
  - **Coarse / French Press (700–1200µm):** Dominant peak at 1.0 kHz – 2.2 kHz (Low-pitch crunch).
- **Harmonic Distortion & Burr Wobble (THD%):**
  - `< 4.5%`: Perfectly aligned flat/conical burrs.
  - `> 8.0%`: Burr misalignment or worn burr teeth — recommend shimming/re-zeroing.

## 3. Integration Directives
- Corresponds to `components/AcousticGrindTuner.tsx` and `app/acoustic-tuner/page.tsx`.
- Connects to Web Audio API `AudioContext`, `AnalyserNode` (FFT size: 2048, smoothingTimeConstant: 0.85).
- Output recommendations in Hebrew RTL with precise click/step adjustments for popular grinders (Comandante, Timemore, DF64, Niche, Fellow Ode).
