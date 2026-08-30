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

The current product boundary is Neutral Editor v0. It supports the complete
Neutral language v0 surface for one source unit and one logical module because
the discovered v0 profile reports those limits. Recursive records and lists are
editable now; nested documents or modules remain capability-driven future
contexts.

Detailed component ownership, data flow, security boundaries, and technology
constraints remain implementation design material. This public project contract
defines the stable boundary until an Editor portable seed is published.

## Non-goals

- an editor-owned Neutral parser or intermediate representation;
- hard-coded language version features in React or Rust;
- direct execution of authoring graphs;
- multiple source units or modules when the selected profile does not expose
  them; or
- framework serialization as the canonical project format.
