<!-- SPDX-License-Identifier: Apache-2.0 -->

# Neutral v1 implementation release plan

Status: accepted

## Goal

Evolve the working Neutral compiler from `v0.1.0` to `v1.0.0` without breaking
the frozen `neu "0.1"` language profile. v1 is the portable, multi-file,
data-only language substrate required before a generic Neutral Editor and a
Flow vocabulary can be built on top of it.

The compiler remains responsible for source, capture, semantic validation,
project IR, reader, and the data-only authoring bridge. Hosts acquire files,
URLs, registries, and credentials; vocabularies may interpret `url` and `path`
values but Neutral never acquires through them. Flow owns any CI/CD mapping and
execution semantics.

## Version rule

There are exactly nine stages:

```text
stage 1  v0.1.0 -> v0.2.0
stage 2  v0.2.0 -> v0.3.0
stage 3  v0.3.0 -> v0.4.0
stage 4  v0.4.0 -> v0.5.0
stage 5  v0.5.0 -> v0.6.0
stage 6  v0.6.0 -> v0.7.0
stage 7  v0.7.0 -> v0.8.0
stage 8  v0.8.0 -> v0.9.0
stage 9  v0.9.0 -> v1.0.0
```

Within every stage, releases are made in this exact order:

```text
v0.n.0 -> v0.n.1 -> v0.n.2 -> v0.n.3 -> v0.n.4 -> next-stage .0
```

No stage is skipped. A `.1` release contains closed contracts, migration notes,
and executable fixture/oracle design. A `.2` release contains the stage's core
implementation behind explicit profile/capability selection. A `.3` release
adds public reader and, where relevant, authoring integration plus independent
consumer probes. A `.4` release contains conformance evidence, compatibility
evidence, limits/fuzz/regression coverage, and release notes. Only a passing
`.4` may become the next stage's `.0`. For stage 9, `v0.9.4` becomes `v1.0.0`
only after the whole v1 contract passes; there is no `v0.10.0`.

Package releases do not silently change source-profile semantics. `neu "0.1"`
continues to select v0.1; `neu "1.0"` is accepted only once the relevant v1
behavior has been implemented and gated.

## Nine stages

| Stage | Release transition | Capability completed at the stage gate |
| --- | --- | --- |
| 1 | `v0.1.0` -> `v0.2.0` | Version/profile dispatch, v1 delta scaffolding, shared limits and diagnostic infrastructure, and inherited-v0 regression preservation. |
| 2 | `v0.2.0` -> `v0.3.0` | Host-neutral `CapturedProjectRequest`, complete supplied source closure, logical module identity, and no-I/O capture. |
| 3 | `v0.3.0` -> `v0.4.0` | One-unit-per-module syntax, explicit aliased imports, deterministic graph construction, SCC processing, and multi-file diagnostics. |
| 4 | `v0.4.0` -> `v0.5.0` | Private-by-default APIs, public closure validation, qualified cross-module reuse and `Ref<T>`, and semantic-cycle checks. |
| 5 | `v0.5.0` -> `v0.6.0` | Multiple exact data-only vocabulary locks, public vocabulary types, inert `url`/`path` scalars, and exact lock coverage. |
| 6 | `v0.6.0` -> `v0.7.0` | Complete project-level IR, source maps, provenance, reader validation, resource facts, and consumer-selected views. |
| 7 | `v0.7.0` -> `v0.8.0` | Canonical logical-project identity, captured-closure and artifact identity separation, deterministic derivations, and reviewed identity vectors. |
| 8 | `v0.8.0` -> `v0.9.0` | Separately versioned authoring bridge: descriptor catalogue, project overlay, editable model, deterministic source projection, formatting, and generic Editor probe. |
| 9 | `v0.9.0` -> `v1.0.0` | Full v1 conformance corpus, public Reader/Editor/Flow-boundary probes, migration evidence, release hardening, and v1.0.0 publication gate. |

## Stage gates

Every stage must satisfy all of the following before its next `.0` release:

1. The frozen v0.1 corpus still passes for `neu "0.1"`.
2. The stage's portable contract, fixtures, expected diagnostics, and identity
   vectors are reviewed before implementation is accepted.
3. Public APIs use only validated IR/reader or authoring services; no consumer
   depends on compiler-private syntax trees or ambient resolution.
4. Equivalent clean and incremental paths, when incremental processing is
   offered, produce equivalent accepted outcomes.
5. Resource ceilings, cancellation behavior, deterministic ordering, and
   malformed-input behavior have regression coverage.
6. The next stage depends only on completed public contracts, never a private
   implementation shortcut.

## Migration discipline

The v1 work is additive at the implementation-package level, but not an
implicit extension of v0 source. Existing v0 source remains valid under its
explicit profile. A v1 source project is captured as a complete logical module
set and cannot rely on paths, URLs, workspace layout, resolver callbacks, or
ambient vocabulary discovery. Host mappings and source evidence may differ
between captures without changing logical project meaning.

The final release is permitted only when the repository contains a standalone
portable specification tree, exact conformance inputs and oracles, a public
reader probe, a generic authoring probe, and a Flow boundary probe. Those probes
verify infrastructure only: neither Neutral core nor the authoring bridge
assigns Flow runtime or CI/CD meaning.
