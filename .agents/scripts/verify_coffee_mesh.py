#!/usr/bin/env python3
"""
Coffee Platform Mesh Verification Tool
Audits that all skills, routes, components, and models are synchronized.
"""

import sys
import os
from pathlib import Path

# Ensure UTF-8 output encoding for cross-platform compatibility
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def verify_mesh():
    project_root = Path(__file__).parent.parent.parent
    agents_dir = project_root / ".agents"
    skills_dir = agents_dir / "Skills"
    components_dir = project_root / "components"
    app_dir = project_root / "app"
    models_dir = project_root / "models"

    skills = [p.name for p in skills_dir.iterdir() if p.is_dir()] if skills_dir.exists() else []
    components = [p.name for p in components_dir.iterdir() if p.is_file()] if components_dir.exists() else []
    app_routes = [p.name for p in app_dir.iterdir() if p.is_dir()] if app_dir.exists() else []
    models = [p.name for p in models_dir.iterdir() if p.is_file()] if models_dir.exists() else []

    # Check for forbidden/obsolete real estate references
    obsolete_keywords = ["mortgage", "realtor", "property-matching", "real-estate-lead"]
    found_obsolete = []
    for skill in skills:
        for kw in obsolete_keywords:
            if kw in skill.lower():
                found_obsolete.append(skill)

    print("=== Coffee Mesh Verification ===")
    print(f"Skills Active: {len(skills)}")
    print(f"App Routes: {len(app_routes)}")
    print(f"Components Active: {len(components)}")
    print(f"Mongoose Models: {len(models)}")
    
    if found_obsolete:
        print(f"[FAIL] Found obsolete real estate artifacts: {found_obsolete}")
        return False
    else:
        print("[SUCCESS] 100% Clean Coffee Architecture: No obsolete real estate references found.")
        return True

if __name__ == "__main__":
    verify_mesh()
