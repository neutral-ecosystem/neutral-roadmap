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

- [`neutral-lang/`](neutral-lang/) — the active language and IR architecture,
  v0 syntax decisions, fixtures, research, and implementation roadmap.
- [`neutral-flow/`](neutral-flow/) — earlier requirements and architecture
  exploration for workflow-oriented tooling.
- [`neutral-editor/`](neutral-editor/) — the capability-driven Tauri/React/Rust
  visual authoring architecture and full Neutral language v0 editor-compliance
  requirements.
- [`neux/`](neux/) — reserved workspace for later operating-system abstraction
  research.

## Start here

For the current work, read these documents in order:

1. [Neutral v0 architecture](neutral-lang/ARCHITECTURE.md)
2. [Needed v0 features](neutral-lang/needed-features.md)
3. [Architectural choices](neutral-lang/choices.md)
4. [Proposed syntax guide](neutral-lang/v0/proposed-syntax-guide.md)
5. [v0 decisions](neutral-lang/v0/decisions/README.md)
6. [v0 implementation roadmap](neutral-lang/v0/ROADMAP.md)
7. [Language showcase](neutral-lang/LANGUAGE-SHOWCASE.md)

For the visual editor workstream, continue with:

1. [Neutral Editor overview](neutral-editor/v0/README.md)
2. [Editor compliance requirements](neutral-editor/v0/REQUIREMENTS.md)
3. [Editor architecture](neutral-editor/v0/ARCHITECTURE.md)
4. [Editor technology stack](neutral-editor/v0/TECHNOLOGY-STACK.md)
5. [Language integration contract](neutral-editor/v0/LANGUAGE-INTEGRATION.md)
6. [Editor implementation roadmap](neutral-editor/v0/ROADMAP.md)

## License

This repository is licensed under the
[Apache License 2.0](LICENSE).
