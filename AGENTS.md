# HULK Command Center — Codex/Work Instructions

## Role
This repository is the HULK orchestration layer. HULK routes work; BLUECORE, BLUE GROW OS, BLUE Class Engine, BLUE SYMBIOTE and JFunkLab keep their own domain logic.

## Cost and quota discipline
- Use the cheapest capable route first.
- Default normal coding/analysis to GPT-6 Sol with low reasoning.
- Use GPT-6 Luna for repetitive, extraction, formatting, tagging, bulk transforms and simple subagents.
- Escalate to stronger reasoning only after a concrete failure, genuine ambiguity or high-risk requirement.
- Do not use Astra by default.
- Do not use Fast mode by default.
- Keep context targeted. Search first; open only files relevant to the task.
- Do not reread unchanged files or replay project history already captured in handoffs.
- Keep AGENTS.md and reusable prompts short.
- At milestones, create/update a compact handoff instead of carrying a huge chat history forward.

## Repository execution
- Inspect before editing.
- Prefer the smallest safe diff.
- Reuse existing utilities and modules.
- Run the narrowest relevant test/lint/build first, then expand only if justified.
- Do not perform speculative refactors.

## Approval gate
Reading, analysis, drafting and reversible preparation may proceed automatically.
Ask before actions that publish, spend money, delete data, alter external production state, send messages, deploy to production, or perform another irreversible/high-impact action.

## Secrets and privacy
- Never commit passwords, API keys, tokens or client-sensitive data.
- Use environment variables / secret managers.
- Do not put secrets in prompts, logs, handoffs or telemetry.

## HULK routing
- routine -> FAST_MODEL
- normal -> VALUE_MODEL
- difficult -> REASONING_MODEL, then PREMIUM_MODEL only if needed
- real repo execution -> CODING_AGENT
- critical/high-risk -> deterministic checks + human approval + independent review when useful
- maximum: 2 attempts on one route, 1 escalation, 1 review, then stop and report the real blocker.

## OpenAI questions
Use the OpenAI developer documentation MCP server for current OpenAI API/Codex/Work configuration details instead of relying on stale assumptions.
