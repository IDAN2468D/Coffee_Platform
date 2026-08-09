#!/usr/bin/env python3
"""
Token Budget Inspector & Context Minifier
Monitors file sizes and token density across the .agents ecosystem.
"""

import sys
import os
from pathlib import Path

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def inspect_agents_directory(base_dir: str):
    root = Path(base_dir)
    report = []
    total_bytes = 0
    file_count = 0

    for path in root.rglob("*"):
        if path.is_file() and not path.name.startswith("."):
            size = path.stat().st_size
            total_bytes += size
            file_count += 1
            estimated_tokens = size // 4
            status = "OK" if size < 15000 else "WARNING (Large File)"
            if "state" in str(path) and size > 4000:
                status = "COMPRESSION RECOMMENDED"
            report.append((str(path.relative_to(root)), size, estimated_tokens, status))

    total_estimated_tokens = total_bytes // 4
    return {
        "file_count": file_count,
        "total_bytes": total_bytes,
        "total_estimated_tokens": total_estimated_tokens,
        "files": sorted(report, key=lambda x: x[1], reverse=True)
    }

if __name__ == "__main__":
    agents_path = Path(__file__).parent.parent
    result = inspect_agents_directory(str(agents_path))
    print("--- .agents Token & Size Audit ---")
    print(f"Total Files: {result['file_count']} | Total Size: {result['total_bytes']} bytes (~{result['total_estimated_tokens']} tokens)")
    print("Top 5 largest files:")
    for f, sz, tok, stat in result['files'][:5]:
        print(f"  - {f}: {sz} B (~{tok} tok) [{stat}]")
