# Neutral Editor roadmap

Status: proposed project roadmap

## Current milestone

The first release target is a complete capability-driven Neutral v0 authoring
path:

```text
discover profile
    -> import or author one-file/one-module Neutral v0
    -> project deterministic .neu source
    -> compile and map diagnostics
    -> save and reopen without semantic drift
```

## Delivery order

1. Freeze the language registry, capability profile, editor document, source
   projection, compatibility, and diagnostic contracts.
2. Prove the framework-independent model against all accepted Neutral v0
   constructs and explicit exclusions.
3. Add the React Flow canvas adapter, generic inspectors, typed connections,
   and nested-value navigation.
4. Integrate import, deterministic source generation, compiler validation,
   cancellation, and mapped diagnostics.
5. Add command-based undo/redo, atomic project persistence, and incompatible
   profile handling.
6. Complete the minimally privileged Tauri host and editor conformance suite.

## Version plan

Detailed v0 stages, exit criteria, evidence, and implementation sequencing
remain implementation design material. Later editor versions remain undefined
until a language capability profile or product requirement creates a concrete
boundary.

## Exit condition

The v0 milestone is complete when every accepted Neutral v0 fixture can move
through import, visual editing, projection, compilation, save, and reopen with
equivalent logical IR, while every negative fixture remains rejected with
stable mapped diagnostics.
