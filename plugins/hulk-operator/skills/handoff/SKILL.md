---
name: hulk-handoff
description: Create compact durable checkpoints so Chat, Work and Codex can resume a project without replaying large histories.
---

# HULK Compact Handoff

Create/update a handoff after a meaningful work block, before quota exhaustion, or before switching Chat/Work/Codex.

Use only these sections when relevant:

# PROJECT / TASK
- one-line objective

# SOURCE OF TRUTH
- repo/branch
- handoff/spec files
- immutable decisions

# CURRENT STATE
- completed
- verified
- current blocker

# CHANGES
- files changed
- migrations/deployments/config changes

# VALIDATION
- tests/lint/build/checks and result

# NEXT ACTION
- exact next command/task
- acceptance criterion

# RISKS / APPROVALS
- only unresolved risks or actions requiring explicit user approval

Do not repeat long project history, generic explanations, or unchanged information.
