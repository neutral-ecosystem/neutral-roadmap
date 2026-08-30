# Neutral Editor

Status: architecture and discovery

Neutral Editor is the proposed visual authoring surface for Neutral programs.
It should let a user assemble a typed graph, project that graph to `.neu`
source, and validate the result with `neutral-lang` without introducing a
second programming language or a private ecosystem IR.

This directory currently contains a deliberately small v0 documentation seed.
It is not an application implementation or a stable product specification.

## Read in this order

1. [v0 overview](v0/README.md)
2. [v0 architecture](v0/ARCHITECTURE.md)
3. [v0 requirements](v0/REQUIREMENTS.md)
4. [architectural decisions](v0/decisions/README.md)
5. [language integration contract](v0/LANGUAGE-INTEGRATION.md)
6. [implementation roadmap](v0/ROADMAP.md)
7. [node-editor research](docs/node-editor-research.md)

More specific accepted Neutral language contracts govern language syntax,
types, diagnostics, and IR. Editor documents may order implementation work but
must not silently extend those contracts.

## Proposed v0 outcome

```text
pinned authoring descriptors
        -> typed visual graph
        -> deterministic .neu projection
        -> neutral-lang validation
        -> diagnostics mapped back to the graph
```

The first proof is intentionally non-executing. It establishes the authoring
model and the language boundary before desktop packaging, runtime integration,
or an open-ended vocabulary node catalogue become release promises.
