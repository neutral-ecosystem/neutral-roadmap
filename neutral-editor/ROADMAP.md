# Neutral Editor roadmap

Status: proposed project roadmap

## Current milestone

The first release target is a complete capability-driven Editor v0 authoring
path over Neutral language v1 core and Neutral authoring v1:

```text
discover profile
    -> resolve exact core/vocabulary descriptor catalogue
    -> import or author a multi-module Neutral v1 project
    -> project deterministic .neu source units
    -> form CapturedProjectRequest
    -> compile and map diagnostics
    -> save and reopen without semantic drift
```

## Delivery order

1. Freeze the language registry, profile tuple, descriptor catalogue, editor
   document, source projection, compatibility, and diagnostic contracts.
2. Prove the framework-independent model against the inherited v0 surface and
   every Neutral v1 delta, including modules, visibility, `url`, and `path`.
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

The Editor v0 milestone is complete when the inherited v0 corpus and v1 delta
fixtures can move through import, visual editing, multi-source projection,
capture, compilation, save, and reopen with equivalent logical IR, while every
negative fixture remains rejected with stable mapped diagnostics.
