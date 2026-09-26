# blueon-operator-m45 — HULK Command Center

Central orchestration repository for HULK.

## Current operational setup
- Token-efficient Codex defaults in `.codex/config.toml`
- Global/project execution policy in `AGENTS.md`
- Multi-model routing policy in `hulk/model-router.yaml`
- Chat / Work / Codex synchronization rules in `docs/CHAT_WORK_CODEX_SYNC.md`
- Windows installer in `scripts/INSTALL_HULK_AI_WINDOWS.ps1`
- Supabase-backed routing/telemetry endpoint: `hulk-ai-router`

## Default AI policy
- GPT-6 Luna: routine/high-volume work
- GPT-6 Sol: normal coding and analysis
- stronger reasoning only on evidence of need
- Astra: final escalation, not default
- Codex: real repository execution
- Work/Codex shared quota is protected by targeted context, low reasoning defaults and API overflow strategy

## Windows setup
Clone/pull this repository, then run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\INSTALL_HULK_AI_WINDOWS.ps1
```

The installer backs up existing Codex user instructions/config before applying HULK defaults.

## Approval gate
Read/analyse/prepare/test automatically. Explicit approval remains required for spending, publishing, sending external messages, production deployment, deletion or other irreversible/high-impact external changes.

## Secrets
Never commit API keys or tokens. Use environment variables or provider secret stores.
