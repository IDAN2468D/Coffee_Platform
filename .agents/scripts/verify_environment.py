#!/usr/bin/env python3
import sys
import os

def check_env():
    print("=== THE DIGITAL ROAST Environment Validator ===")
    print(f"Python Version: {sys.version.split()[0]}")
    print(f"Working Directory: {os.getcwd()}")
    
    required_dirs = [".agents/docs", ".agents/state", ".agents/templates", ".agents/Skills", "real-estate-landing-page"]
    for d in required_dirs:
        status = "EXISTS" if os.path.exists(d) else "MISSING"
        print(f"Directory '{d}': {status}")

if __name__ == "__main__":
    check_env()
