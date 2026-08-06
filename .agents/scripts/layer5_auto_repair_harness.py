import subprocess
import sys
import os

# Ensure UTF-8 output encoding for Windows terminals
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

def run_layer5_diagnostics():
    print("=== [Layer 5 Auto-Repair Loop Diagnostic Run] ===")
    
    # 1. TypeScript Compilation Test
    print("Step 1: Running TypeScript static type check...")
    res = subprocess.run(["npx.cmd", "tsc", "--noEmit"], capture_output=True, text=True, shell=True)
    if res.returncode == 0:
        print("[OK] Layer 5 Check 1: TypeScript compilation clean (0 errors).")
    else:
        print("[FAIL] Layer 5 Check 1 Failed: TypeScript errors detected.")
        print(res.stderr or res.stdout)
        return False

    # 2. Environment Variables Verification
    print("Step 2: Checking environment configuration...")
    env_local_exists = os.path.exists(".env.local")
    if env_local_exists:
        print("[OK] Layer 5 Check 2: .env.local file present.")
    else:
        print("[WARN] Layer 5 Check 2 Warning: .env.local missing.")

    print("=== [Layer 5 Verification Successful: All Systems Nominal] ===")
    return True

if __name__ == "__main__":
    success = run_layer5_diagnostics()
    sys.exit(0 if success else 1)
