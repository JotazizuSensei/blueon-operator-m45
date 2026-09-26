---
name: model-router
description: Route HULK tasks to the cheapest capable model while protecting Work/Codex quota.
---

Use the HULK routing policy:
- routine/bulk -> FAST_MODEL
- normal coding/analysis -> VALUE_MODEL
- difficult -> REASONING_MODEL
- hardest end-to-end -> PREMIUM_MODEL only after escalation
- real repository execution -> CODING_AGENT

Keep context targeted, avoid full-history replay, prefer low reasoning first, and use deterministic validation before another LLM review.
