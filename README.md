# Neutral roadmap

This repository is the design and planning workspace for the Neutral ecosystem.
It contains architecture, requirements, language decisions, research, examples,
and staged roadmaps. It is not the implementation repository and does not yet
represent a stable released specification.

## Purpose

Neutral is being designed from the top down so that its shared boundaries are
understood before implementation choices become difficult to reverse.

The current priority is **Neutral language v0**: a small, typed, immutable,
effect-free language that compiles one captured `.neu` source unit into a public
Neutral IR. A generic probe must be able to inspect that IR without parsing the
source or depending on compiler-private models.

```text
captured .neu source
    -> neutral-lang compiler
    -> Neutral IR + source map + provenance
    -> generic effect-free consumer
```

The v0 work deliberately avoids application-specific behavior. Its purpose is
to prove the source, compiler, IR, diagnostics, provenance, and reader API
boundary first.

## Repository areas

- [Neutral language](neutral-lang/ARCHITECTURE.md) — the active language and IR
  project architecture, with versioned portable specifications.
- [Neutral Flow](neutral-flow/ARCHITECTURE.md) — earlier requirements and architecture
  exploration for workflow-oriented tooling.
- [Neutral Editor](neutral-editor/ARCHITECTURE.md) — the capability-driven Tauri/React/Rust
  visual authoring architecture and full Neutral language v0 editor-compliance
  requirements.
- `neux/` — reserved workspace for later operating-system abstraction research.
- [Repository rules](rules/README.md) — repository-wide documentation and
  publishing policies.
- `website/` — the Astro publishing layer for canonical repository
  documentation, with Wrangler configuration for Cloudflare deployment.

## Start here

For the current work, read these documents in order:

1. [Neutral language architecture](neutral-lang/ARCHITECTURE.md)
2. [Neutral language requirements](neutral-lang/REQUIREMENTS.md)
3. [Neutral language roadmap](neutral-lang/ROADMAP.md)
4. [Proposed syntax guide](neutral-lang/v0/portable/specs/contracts/proposed-syntax-guide.md)
5. [v0 decisions](neutral-lang/v0/portable/specs/decisions/README.md)
6. [v0 implementation roadmap](neutral-lang/v0/portable/ROADMAP.md)

For the visual editor workstream, continue with:

1. [Neutral Editor architecture](neutral-editor/ARCHITECTURE.md)
2. [Editor project requirements](neutral-editor/REQUIREMENTS.md)
3. [Editor project roadmap](neutral-editor/ROADMAP.md)

For public documentation publishing, read:

1. [Documentation rules](rules/DOCUMENTATION.md)
2. [Portable documentation rules](rules/PORTABLE-DOCUMENTATION.md)
3. [Documentation hosting rules](rules/HOSTING.md)
4. Review the website content map and implementation entry point in the
   repository when changing website code.

## License

This repository is licensed under the
[Apache License 2.0](LICENSE).
