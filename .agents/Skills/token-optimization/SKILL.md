---
name: token-optimization
description: Hyper-efficient token preservation, AST targeted reads, diff patching, state minification, and context pruning directives.
---

# Token Optimization & Hyper-Efficiency Protocol ⚡

## 1. Golden Directives for Context Preservation
1. **Targeted Inspections Over Bulk Reads:**
   - Always specify `StartLine` and `EndLine` in `view_file` calls.
   - Use `grep_search` to pinpoint exact function signatures before reading code blocks.
2. **Surgical Patching:**
   - Use `replace_file_content` with concise chunks. Never re-write entire files unless creating new modules.
3. **Dense State Persistence:**
   - Store status in `.agents/state/task.md` using tight `- [x]` bullet points and ASCII/markdown tables.
   - Strip verbose commentary and redundant logs from memory.
4. **Execution Sandbox:**
   - Run verification and computation scripts inside `.agents/scripts/` and output 1-3 line results.

## 2. Token Budget Thresholds
- Subagent Turn Output: Max 150–250 tokens per conversational turn.
- State Files: Keep under 1.5 KB per file.
- Artifacts: Use structured markdown tables, alerts, and clickable links instead of wordy prose.
