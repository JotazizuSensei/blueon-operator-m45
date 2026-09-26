---
name: quota-guard
description: Reduce token and shared Work/Codex usage, detect avoidable premium-model use, and prepare safe overflow without automatically spending money.
---

# HULK Quota Guard

Apply before or during long Work/Codex jobs.

## Context discipline
- Search/find first, then read only relevant ranges/files.
- Do not reread unchanged files.
- Do not paste full chat histories into Work/Codex.
- Prefer one compact source-of-truth handoff over repeated background prose.
- Split independent large jobs into checkpointed stages only when doing so reduces replay/context.
- Keep system/project instructions concise and stable.

## Model discipline
- Repetitive/bulk -> Luna.
- Normal build/research -> Sol low.
- Increase reasoning only if the task fails or complexity proves it necessary.
- Astra is the last escalation, not a default.
- Fast mode is off unless latency is worth higher usage.

## Overflow
If plan quota is exhausted or dangerously low:
1. Preserve current state in a compact handoff.
2. Check whether a configured API fallback exists.
3. Check the HULK monthly API budget/telemetry.
4. Ask for explicit approval before any paid API execution.
5. If no paid fallback is approved, stop cleanly with the exact next action instead of repeatedly retrying.

## Telemetry
When the execution layer supports it, log:
- project/task class
- provider/model
- input/output/cache tokens
- cost
- duration
- retries/escalation
- result status
Do not log secrets or sensitive client data.
