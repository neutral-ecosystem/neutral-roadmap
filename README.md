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

## Current status

The project is in specification and discovery. The next goal is to complete the
v0 normative contracts and then implement the smallest end-to-end path:

```text
capture -> compileCaptured -> validated IR -> public reader -> generic probe
```

Features outside the documented v0 scope are deferred until this boundary has
implementation and conformance evidence.
