# Chat / Work / Codex — HULK synchronization

## Goal
Keep ChatGPT Chat, Work and Codex aligned without replaying full histories or burning shared quota.

## Shared operating model
1. **Chat** = decision layer, conversation, project direction, approvals and concise handoffs.
2. **Work** = substantial browser/file/app workflows.
3. **Codex** = real repository/terminal execution.
4. **HULK router** = central model/cost/quota policy.
5. **Supabase** = machine-readable registry for routing rules and usage telemetry.
6. **GitHub** = durable source of truth for code, AGENTS.md and project handoffs.

## Context rule
Do not paste full chat histories into Work/Codex. Pass only:
- current objective;
- relevant handoff;
- exact files/repo;
- constraints;
- acceptance criteria.

## Checkpoint rule
At the end of a meaningful work block, leave a compact handoff:
- status;
- files changed;
- tests run;
- unresolved blocker;
- exact next action.

## Shared quota protection
Work and Codex share the included plan allowance. Therefore:
- use GPT-6 Sol/low by default;
- use GPT-6 Luna for routine/subagent work;
- reserve Astra for actual hard cases;
- keep Fast off unless latency matters enough to justify higher usage;
- use API overflow only after included quota is exhausted/near exhaustion and within the configured budget.

## Central router
Supabase project:
- project ref: vfwkxlcamtcrmdsuxmyz
- Edge Function: hulk-ai-router
- endpoint base: https://vfwkxlcamtcrmdsuxmyz.supabase.co/functions/v1/hulk-ai-router
- JWT verification: enabled

The function returns current routing configuration and accepts usage telemetry. Do not place Supabase secrets or OpenAI API keys in this repository.

## Approval gate
Automatic: read, search, analyse, draft, test in sandbox, prepare reversible changes.
Requires explicit approval: spending, publishing, sending, deleting, production deployment, irreversible external changes.
