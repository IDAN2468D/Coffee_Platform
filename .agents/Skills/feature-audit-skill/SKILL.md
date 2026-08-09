---
name: "Feature Audit & Roadmap Generator"
description: "Analyze current project status, audit implemented capabilities, and generate next-generation premium product roadmaps."
---

# Skill: Feature Audit & Roadmap Generator (v9.5 SDD)

## Objective
Analyze the current project state (`.agents/state/ARCHITECTURE_STATE.md`, `.agents/state/SPRINTS.md`, `.agents/templates/`) and architect next-generation, hyper-premium features that strictly adhere to Specification-Driven Development (SDD), "Liquid Glass 4.0" design system, "Acoustic Wavefront Spatializer", and "Agent Stack" rules.

## Execution Protocol
1. **Context Loading:**
   - Read `.agents/state/ARCHITECTURE_STATE.md` (Master State), `.agents/state/SPRINTS.md` (Active Sprints), and `.agents/templates/` (PRD & SPEC standards).
   - Query **StitchMCP** (`list_projects`, `list_screens`, `get_project`) to retrieve screens, design tokens, and components from related workspaces as benchmarks for new features.
2. **Deep-Dive Gap Analysis & SDD Audit:**
   - Review implemented features against PRD and SPEC criteria.
   - Cross-reference with hyper-premium Cinema/Booking Enterprise trends (e.g., Co-Viewing, Haptic feedback, Spatial UI).
   - Identify missing logical layers while strictly preventing system bloat (Lean execution).
3. **Architectural Feasibility & Spec Check:** 
   - **Visuals:** Must utilize 120Hz Zero-Reflow GPU rendering (`transform-gpu`, `opacity`).
   - **Audio:** Must incorporate the Web Audio API (`PannerNode`/`BiquadFilterNode`) for spatial feedback.
   - **Security:** Ensure zero MongoDB client exposure and strict Zod boundary validation.
   - **File Isolation:** Guarantee 200 LOC maximum per component/file.
4. **Output Generation:** 
   - Present a Markdown table: [Feature Name] | [Target Sprint] | [PRD/SPEC Ready] | [Tech Stack/API].
   - Generate PRD & SPEC draft using `.agents/templates/PRD_TEMPLATE.md` and `SPEC_TEMPLATE.md`.

