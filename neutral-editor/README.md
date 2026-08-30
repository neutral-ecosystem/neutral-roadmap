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
4. [technology stack](v0/TECHNOLOGY-STACK.md)
5. [architectural decisions](v0/decisions/README.md)
6. [language integration contract](v0/LANGUAGE-INTEGRATION.md)
7. [implementation roadmap](v0/ROADMAP.md)
8. [node-editor research](docs/node-editor-research.md)

More specific accepted Neutral language contracts govern language syntax,
types, diagnostics, and IR. Editor documents may order implementation work but
must not silently extend those contracts.

## Proposed v0 outcome

```text
discovered Neutral language profile
        -> complete v0 visual authoring model
        -> one deterministic .neu source/module
        -> neutral-lang validation and conformance evidence
```

The first proof is intentionally non-executing, but it covers the complete
accepted Neutral language v0 surface. The generic editor discovers the language
version, document limits, constructs, types, validation operations, and
vocabulary capabilities through a versioned adapter rather than hard-coding
them. Nested record/list values are supported; nested documents and modules are
reserved for a later language profile.
