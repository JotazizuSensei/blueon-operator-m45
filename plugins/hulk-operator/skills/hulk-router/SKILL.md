---
name: hulk-router
description: Route HULK work to the cheapest capable model or agent while protecting Work/Codex quota and preserving domain-engine boundaries.
---

# HULK Router

Use this skill whenever a request can materially consume model quota, API tokens, Work/Codex allowance, or several tools.

## Routing order
1. Identify domain and required business engine.
2. Identify whether real repo/terminal execution is required.
3. Classify task as routine, normal, difficult, repo_execution, or critical.
4. Use the cheapest capable route:
   - routine -> FAST_MODEL
   - normal -> VALUE_MODEL
   - difficult -> REASONING_MODEL
   - repo_execution -> CODING_AGENT
   - critical -> REASONING_MODEL + deterministic checks + approval/review
5. Escalate only after evidence that the cheaper route is insufficient.

## Current aliases
Read the durable policy from `hulk/model-router.yaml` when available.
Current OpenAI defaults:
- FAST_MODEL: GPT-6 Luna, low reasoning
- VALUE_MODEL: GPT-6 Sol, low reasoning
- REASONING_MODEL: GPT-5.6 Sol, medium reasoning
- PREMIUM_MODEL: GPT-6 Astra, medium reasoning, final escalation only
- CODING_AGENT: Codex

## Quota guard
- Work and Codex share plan allowance: protect it.
- Do not use Astra or Fast by default.
- Do not load full project/chat history when a focused handoff or targeted retrieval is enough.
- Reuse existing handoffs and unchanged context.
- Use deterministic validators before a second LLM review.
- Stop after 2 attempts on one route + 1 escalation + 1 review.

## External spending
Never start paid API overflow, buy credits, reset quota, or change a paid plan without explicit user approval.

## Output
Keep routing narration minimal. Record a concise checkpoint only when it helps the next execution resume without replaying context.
