# Neutral language v1 design plan

Status: proposed design entry point

## Purpose

This directory explores a possible Neutral v1 foundation built on the working
Neutral v0.1 contract, before Neutral Flow and Neutral Editor commit to
project-scale assumptions. It is a proposal, not an accepted language contract.
Nothing here changes Neutral v0.1 behavior.

The proposed outcome is deliberately narrow:

```text
captured multi-file Neutral project
    -> deterministic module graph and visibility checks
    -> validated project-level Neutral IR
    -> public reader and authoring services
    -> independent multi-file consumer and editor probes
```

The proposal adds language-scale composition and tooling contracts. It does not
add workflow execution, commands, secrets, functions, control flow, mutation,
or application-specific types.

## Reading order

1. [Architecture proposal](ARCHITECTURE.md) defines the boundaries and model.
2. [Proposed requirements](REQUIREMENTS.md) gives stable candidate IDs.
3. [Syntax checklist](syntax-checklist.md) records surface decisions still to
   close.
4. [Design roadmap](ROADMAP.md) orders evidence and specification work.

## Design questions to resolve first

1. Can one logical module be represented by exactly one source unit in v1, or
   is partial-module merging already justified?
2. Is a private-by-default `public` modifier sufficient once public dependency
   closure has a precise rule?
3. Should module names remain one `snake_case` identifier or become qualified
   logical names such as `acme::delivery::shared`?
4. Can one project use multiple exact data-only vocabularies without creating
   ambiguous namespaces or an executable plugin mechanism?
5. Which core identity and captured-project-request rules make the same project
   reproducible across hosts?
6. Which authoring projection is the smallest stable public contract that lets
   Neutral Editor import and project v1 without using a compiler-private AST?
7. Are `url` and `path` sufficiently useful as opaque data types to justify
   their core vocabulary-schema support, without granting acquisition authority?
8. Which minimal data-only descriptor schema lets an Editor generate every
   core and vocabulary card, port, property, and command without encoding the
   grammar or accepting executable UI extensions?

This proposal recommends one source unit per module, qualified logical module
names, explicit aliased imports, private-by-default declarations, no re-exports,
and generic data-only vocabulary infrastructure. It permits import cycles and
resolves them through strongly connected components. Each choice still needs
fixtures, lowering rules, resource treatment, and review before it can become
accepted.

The proposed authoring answer is an exact profile tuple plus a deterministic
descriptor catalogue. The catalogue drives generic UI, while adapter-owned
source projection and ordinary core compilation remain authoritative. Future
Flow cards are projections of Flow vocabulary data and conventions; Flow-owned
mappers, not Neutral or the Editor, assign CI/CD behavior.

The proposed host boundary is likewise explicit: hosts finish acquisition and
submit a complete `CapturedProjectRequest`; Neutral only validates, freezes, and
compiles it. Root/export selection happens later through `ViewRequest`. Request
module identities must match source headers, and one canonical vocabulary has
one semantic revision throughout a project. These constraints give Editor and
headless consumers the same deterministic compilation path.

Cross-host logical identity uses a bounded, identity-only
`CanonicalLogicalForm`: stable module, type, and module-symbol identities replace
graph-local IDs, while source identities and evidence remain outside meaning.
Public values may resolve private ordinary values, but any transitively exposed
`Ref<T>` must target a public binding. Vocabulary locks exactly cover source
requirements, and authoring catalogue discovery receives vocabulary semantic
contracts and authoring metadata as separate explicit inputs.

## Approval boundary

A portable v1 seed must not be created merely from this proposal. Promotion
requires accepted answers to the open questions, a v0-to-v1 compatibility
decision, complete observable examples, and agreement that both Flow and Editor
can use the public contracts without private compiler access.
