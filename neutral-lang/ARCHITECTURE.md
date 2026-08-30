# Neutral language architecture

Status: project architecture

## Purpose

Neutral is a versioned authoring-language project. It defines a stable path
from captured source to public, validated Neutral IR, which independent tools
can read without depending on a compiler's private models or runtime behavior.

This document owns architecture shared across language versions. It does not
define source syntax, types, grammar, diagnostics, or conformance cases for any
single version.

## Shared boundaries

Every Neutral version preserves these boundaries:

```text
captured source and declared inputs
    -> version-selected compiler
    -> public Neutral IR and companion evidence
    -> validated reader and independent consumers
```

- The host owns acquisition, policy, credentials, and external effects.
- A compiler owns acceptance and lowering for one selected language version.
- Public IR and reader contracts are the only consumer boundary.
- Consumers do not depend on source parsing, compiler-private trees, or
  application-specific execution behavior.
- Successful compilation proves structural conformance only; it does not grant
  authority or trigger an external effect.

## Version architecture

Project-level contracts define the enduring language direction. Each `vN`
directory contains two views:

```text
vN/
|-- design/                 repository design and working material
`-- portable/               standalone implementation documentation
    |-- README.md           version overview
    |-- PLAN.md             implementation entry point
    |-- ROADMAP.md          version delivery plan
    `-- spec/vN/            normative version contract
```

`portable/` is copied into the corresponding implementation repository. Its
`spec/vN/` documents are authoritative for that version. The website publishes
only the portable view; `design/` remains private repository material.

## Evolution and compatibility

Versions may add or revise language behavior only through an explicit version
contract, migration/compatibility policy, and conformance evidence. A later
version must not silently change an earlier version's accepted source or public
IR meaning.

Shared public APIs expose the selected language version and capability profile.
Tools discover supported behavior from those contracts rather than hard-coding a
version's syntax or feature list.

## Current version

The current implementation target is [Neutral language v0](v0/portable/README.md).
Its architecture, requirements, syntax, decisions, fixtures, and implementation
roadmap live in its portable package.
