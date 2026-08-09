---
name: notebooklm-coffee-research
description: Sync coffee cupping scores, research papers, roasting logs, and origin harvest terroir with NotebookLM & Google Docs.
---

# NotebookLM Coffee Research Skill 📚

## 1. Domain Overview
Synchronizes sensory cupping scorecards (SCA 100-point scale), roasting curve telemetry, bean chemical analysis, and farm terroir logs directly with Google Workspace and NotebookLM knowledge bases.

## 2. Research & Cupping Attributes
- **SCA 100-Point Sensory Protocol:** Fragrance/Aroma, Flavor, Aftertaste, Acidity, Body, Balance, Uniformity, Clean Cup, Sweetness, Defects, Overall Score.
- **Roasting Telemetry Export:** Rate of Rise ($RoR$ $^\circ\text{C}/\text{min}$), Turning Point ($TP$), Yellowing Phase ($Y$), First Crack ($FC$), Development Time Ratio ($DTR\%$).
- **Terroir Metadata:** Elevation (MASL), Varietal (Typica, Bourbon, SL28, Gesha, Pink Bourbon), Processing Method (Washed, Natural, Anaerobic Fermentation, Carbonic Maceration).

## 3. Integration Directives
- Component: `components/NotebookLMBrewSync.tsx`
- Route: `app/notebook-sync/page.tsx`
- MCP Server: `notebooklm` tools (`createGoogleDoc`, `updateGoogleDoc`, `search`)
