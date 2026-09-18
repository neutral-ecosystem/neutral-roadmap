# Neutral language v1 design plan

Status: accepted

## Purpose

This directory defines the accepted Neutral v1 design baseline built on the
working Neutral v0.1 contract. It is ready to be transformed into a standalone
portable implementation seed. It does not alter the separately selectable v0.1
profile.

The accepted outcome is deliberately narrow:

```text
captured multi-file Neutral project
    -> deterministic module graph and visibility checks
    -> validated project-level Neutral IR
    -> public reader and authoring services
    -> independent multi-file consumer and editor probes
```

The design adds language-scale composition and tooling contracts. It does not
add workflow execution, commands, secrets, functions, control flow, mutation,
or application-specific types.

## Reading order

1. [Architecture](ARCHITECTURE.md) defines the boundaries and model.
2. [Requirements](REQUIREMENTS.md) gives stable requirement IDs.
3. [Accepted decisions](DECISIONS.md) records the closed architectural choices.
4. [Source contract](SOURCE-CONTRACT.md) fixes grammar, resolution, visibility,
   lowering, and source diagnostics.
5. [Project contracts](PROJECT-CONTRACTS.md) fixes capture, identity, IR delta,
   views, diagnostics, and limits.
6. [Authoring contract](AUTHORING-CONTRACT.md) fixes the dynamic Editor bridge.
7. [Vocabulary contracts](VOCABULARY-CONTRACT.md) fix semantic visibility,
   location types, and inert authoring metadata.
8. [Conformance design](CONFORMANCE.md) defines the delta corpus and public
   probes to materialize in the portable seed.
9. [Syntax checklist](syntax-checklist.md) records design closure.
10. [Design roadmap](ROADMAP.md) identifies portable promotion as the next stage.
11. [Portable-readiness record](PORTABLE-READINESS.md) maps accepted design
    sources into the standalone seed and defines the remaining claims boundary.

## Resolved design choices

The design closes one source unit per qualified logical module, explicit aliased
imports, SCC processing, private-by-default visibility, multiple exactly locked
data-only vocabularies, inert `url` and `path`, host-completed capture, separate
consumer views, bounded NHT/SHA-256 project identity, and a separately versioned
data-only authoring bridge. [DECISIONS.md](DECISIONS.md) is the authoritative
decision ledger.

The baseline uses one source unit per module, qualified logical module
names, explicit aliased imports, private-by-default declarations, no re-exports,
and generic data-only vocabulary infrastructure. It permits import cycles and
resolves them through strongly connected components.

The accepted authoring answer is an exact profile tuple plus a deterministic
descriptor catalogue. The catalogue drives generic UI, while adapter-owned
source projection and ordinary core compilation remain authoritative. Future
Flow cards are projections of Flow vocabulary data and conventions; Flow-owned
mappers, not Neutral or the Editor, assign CI/CD behavior.

The accepted host boundary is likewise explicit: hosts finish acquisition and
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

## Promotion boundary

The design decisions and public contracts are closed. The next authorized stage
is to create `v1/portable/`, copy these contracts into the required standalone
layout, materialize the named fixtures and literal identity vectors, add the
development pipeline and conformance manifest, and validate standalone links.

Portable promotion must not claim implementation conformance. Passing the
corpus, producing independent identity vectors, and running the Reader, Editor,
and Flow probes are implementation/release gates after the seed exists.
