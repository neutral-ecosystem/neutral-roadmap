# Neutral Flow roadmap

This is a basic direction map, not a schedule. Each optional execution layer
requires evidence and a separate architecture decision.

```mermaid
flowchart TD
    A[Architecture baseline<br/>requirements, boundaries, threats] --> B[Neutral IR consumer contract]

    L[neutral-lang<br/>.neu → Neutral IR] --> B
    G[Future Flow GUI] -->|transcribes to .neu| L

    B --> C[Flow Core v0<br/>validate, plan, diagnose]
    C --> D[Simulator + first static CI/CD target]
    D --> E[Flow v1<br/>second target + bounded portability]

    E --> F{Delegated execution justified?}
    F -- No --> S[Continue static provider integrations]
    F -- Yes --> H[Delegated execution adapter<br/>provider owns execution]

    H --> R{Flow-owned Runtime justified?}
    S -->|future evidence| R
    R -- No --> S
    R -- Yes --> T[Optional Flow Runtime<br/>Flow owns orchestration]

    S --> X[Later evidence-gated capabilities]
    H --> X
    T --> X
```

## Current focus

Architecture baseline and the smallest Neutral IR contract required by
neutral-flow.

## Rules

- Public input follows `.neu → neutral-lang → Neutral IR → neutral-flow`.
- Static export, delegated execution, and a Flow-owned Runtime are different
  product commitments.
- Unsupported provider guarantees fail visibly; they are never silently
  degraded.
- The future GUI produces `.neu` and does not bypass neutral-lang.
