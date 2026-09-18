# Neutral Editor architecture

Status: proposed project contract

## Purpose

Neutral Editor is a capability-driven visual authoring surface for Neutral
programs. It owns interaction state, a framework-independent editor document,
visual projection, project persistence, and native desktop integration. It does
not own Neutral parsing, language semantics, IR generation, or runtime behavior.

## Architectural boundary

```text
discovered language capability profile
    -> generic editor document and commands
    -> visual projection and nested-value editing
    -> deterministic .neu source projection
    -> neutral-lang validation and diagnostics
```

The language bridge is authoritative for supported versions, constructs,
limits, validation, and formatting. The generic UI must not infer capability
from a version string or contain a private copy of the Neutral grammar.

The editor document keeps semantic graph data separate from presentation data.
React Flow is a view adapter, Zustand stores application state, Radix provides
accessible interaction primitives, and Tauri/Rust owns trusted host services.

## Current version

The current product boundary is Neutral Editor v0. Its reference conformance
target is Neutral language v1 core plus a compatible Neutral authoring v1
profile. The selected descriptor catalogue dynamically supplies the complete
core and captured-vocabulary authoring surface, including multi-source projects,
modules, imports, visibility, recursive values, `url`, and `path`.

Future Flow visual authoring is an Editor extension built from Flow vocabulary
schemas and conventions. The generic Editor still produces `.neu`; Flow Core
and its system/provider mappers consume compiled IR outside the Editor.

Detailed component ownership, data flow, security boundaries, and technology
constraints remain implementation design material. This public project contract
defines the stable boundary until an Editor portable seed is published.

## Non-goals

- an editor-owned Neutral parser or intermediate representation;
- hard-coded language version features in React or Rust;
- direct execution of authoring graphs;
- project or module shapes not exposed by the selected profile; or
- framework serialization as the canonical project format.
