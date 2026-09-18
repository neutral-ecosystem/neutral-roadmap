# Neutral language v1 accepted design decisions

Status: accepted

This ledger closes the architectural choices required before producing the v1
portable implementation seed. It governs the v1 delta only; the accepted v0.1
portable contract remains authoritative where it is not explicitly superseded.

## Decision summary

| ID | Decision |
| --- | --- |
| `V1-DEC-001` | One immutable source unit defines one logical module. |
| `V1-DEC-002` | Logical module names are qualified `snake_case` paths independent of host paths. |
| `V1-DEC-003` | Imports require explicit aliases and never inject unqualified names. |
| `V1-DEC-004` | Imports may cycle; semantic analysis operates on SCCs and rejects only illegal semantic cycles. |
| `V1-DEC-005` | Root declarations are private by default; only explicit `public` declarations cross modules. |
| `V1-DEC-006` | Public signatures and transitively exposed identity references may use only public targets. |
| `V1-DEC-007` | Hosts fully resolve source and vocabulary inputs before Neutral capture. |
| `V1-DEC-008` | Every supplied source unit is an intentional project member; disconnected modules are valid. |
| `V1-DEC-009` | Root/export selection is a post-compilation view operation, never project meaning. |
| `V1-DEC-010` | A project may use multiple data-only vocabularies under aliases, with one semantic revision per canonical vocabulary identity. |
| `V1-DEC-011` | `url` and `path` are distinct inert scalar data types. |
| `V1-DEC-012` | Project identity uses SHA-256 over NHT-v1 `CanonicalLogicalForm`; source identities and graph-local IDs are excluded. |
| `V1-DEC-013` | Core, authoring bridge, descriptor schema, vocabulary semantics, and vocabulary authoring metadata are separately versioned. |
| `V1-DEC-014` | The Editor generates `.neu` source through the authoring bridge; the compiler never consumes a canvas graph. |
| `V1-DEC-015` | Flow authoring is an Editor vocabulary/convention package; Flow interpretation and provider mapping remain Flow-owned. |
| `V1-DEC-016` | Static profile/vocabulary descriptors, project-derived descriptors, and editable authoring state are separate data contracts. |

## Source and module choices

One source unit per module is retained because partial-module merging would make
identity, diagnostic ownership, incremental invalidation, and Editor navigation
ambiguous. A module name is a semantic identity supplied in source and repeated
in the capture request for verification. It is never inferred from a path.

Qualified module names use one or more `snake_case` segments separated by
`::`. Every import has a module-local `snake_case` alias. Module and vocabulary
aliases share one collision namespace, but resolution records their distinct
namespace kinds.

Import cycles are not errors by themselves. Collection first computes the SCC
condensation graph, then collects declarations for each SCC, resolves types, and
finally evaluates value dependencies. Embedded-record and value-dependency
cycles remain invalid under inherited v0 rules; `Ref<T>` edges remain
non-value identity edges.

## Visibility choices

Root records and bindings are private unless marked `public`. Fields have no
independent visibility. A public type surface may name local public records,
imported public records, core types, and vocabulary types explicitly exported by
their semantic contract.

A public binding may reuse a private ordinary value because the resolved value
can be exposed without its private provenance. A `Ref<T>` value cannot be
redacted without changing it, so every reference transitively exposed through a
public value must target a public binding. Visibility remains encapsulation, not
secrecy or execution authority.

## Capture and view choices

Hosts acquire and resolve all inputs before calling Neutral. The exact
`CapturedProjectRequest` contains source bytes, logical source/module identities,
the core profile, and vocabulary semantic locks. Capture performs bounded
validation and freezing only and has no resolver callback.

The source set itself defines project membership. Imports must close within it;
unimported/disconnected declared modules remain members. Candidate workspace
files that are not project members never enter the request.

Roots and exports select a consumer view after complete compilation. They do not
change capture identity, logical equality, complete project IR, or project
identity. Materialized views have their own derivation and artifact identities.

## Vocabulary choices

Vocabulary contracts remain closed data. They contain no callbacks, scripts,
native modules, validators, acquisition behavior, or UI components. Each
canonical vocabulary identity resolves to exactly one semantic revision within
a project. The supplied lock set exactly covers the distinct vocabulary
identities required by source; extra, missing, duplicate, unused, and conflicting
locks are invalid.

Vocabulary semantic contracts and authoring metadata are different inputs.
Semantic schema, defaults, exported types, and required structural features can
change logical meaning. Titles, documentation, categories, ordering, and icon
tokens change only the descriptor catalogue.

## Identity choices

v1 reuses v0's SHA-256, exact-byte digests, and Neutral Hash Transcript v1
(`NHT-v1`). Project identity adds the domain
`neutral/logical-project-identity/v1` over the project
`CanonicalLogicalForm`. Stable module, module-symbol, type, and vocabulary
identities replace graph-local IDs. Construction uses direct bounded ordering,
not graph-isomorphism search.

Logical source identities remain capture/evidence facts. Changing one can alter
captured closure identity, source maps, provenance, or diagnostic ordering, but
cannot alter logical project identity.

Artifact derivations are dependency-minimal. IR, evidence, diagnostics, views,
and the overall compilation-result envelope each bind only inputs that can
change that result.

## Authoring choices

Neutral authoring v1 is a separately versioned protocol compatible with an exact
core profile. It exposes immutable data-only descriptors and versioned import,
projection, compatibility, formatting, and validation operations. Descriptor
catalogue discovery takes the core authoring profile, vocabulary semantic
contracts, and vocabulary authoring-metadata profiles explicitly.

The generic Editor owns presentation and interaction. Adapter-owned projection
owns Neutral spelling. Projected source is captured and compiled through the
same core APIs as hand-authored source. Cards describe authorable data shapes;
they do not introduce Neutral functions or executable operations.

The static descriptor catalogue has only profile and vocabulary inputs, so it
cannot contain local or imported project symbols. A revision-bound project
overlay supplies those choices. The authoring project itself is a closed,
bounded, directly editable graph/tree data model; neither catalogue needs
callbacks, and the compiler still receives only projected source.

## Deferred choices

Package distribution, dependency solving, partial modules, re-exports,
expressions, functions, mutation, executable extensions, secrets, workflow
semantics, provider behavior, and runtime execution remain outside v1.
