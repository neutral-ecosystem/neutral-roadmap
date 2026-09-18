# Neutral language v1 syntax checklist

Status: accepted

Authoritative requirements: [REQUIREMENTS.md](REQUIREMENTS.md)

Checking an item means the portable-ready design defines normative prose,
grammar where applicable, positive and negative fixture obligations, stable
diagnostics, source-to-IR lowering, provenance, resource treatment, and public
probe evidence. Execution results remain implementation conformance work.

## Retained v0 surface

- [x] **SYN-V1-BASE-001** — v0 conformance by reference
- [x] **SYN-V1-BASE-002** — Complete v0-to-v1 delta disposition
- [x] **SYN-V1-BASE-003** — Delta fixtures and explicit profile selection

## Project and document shape

- [x] **SYN-V1-DOC-001** — Exact `neu "1.0"` header
- [x] **SYN-V1-DOC-002** — Qualified logical module header
- [x] **SYN-V1-DOC-003** — One source unit per logical module
- [x] **SYN-V1-DOC-004** — Header, vocabulary, import, declaration ordering
- [x] **SYN-V1-DOC-005** — Multiple bounded source units and separate consumer views
- [x] **SYN-V1-DOC-006** — Pre-resolved host-neutral captured-project request
- [x] **SYN-V1-DOC-007** — Request/profile/module-header identity binding

## Imports and qualification

- [x] **SYN-V1-IMP-001** — `import qualified::module as alias`
- [x] **SYN-V1-IMP-002** — Mandatory unique `snake_case` alias
- [x] **SYN-V1-IMP-003** — Qualified-only imported name access
- [x] **SYN-V1-IMP-004** — Missing, duplicate, and self-import errors
- [x] **SYN-V1-IMP-005** — SCC import collection and semantic-cycle rejection
- [x] **SYN-V1-IMP-006** — No paths, URLs, ranges, wildcards, or implicit imports
- [x] **SYN-V1-IMP-007** — Module versus vocabulary namespace resolution
- [x] **SYN-V1-IMP-008** — SCC size and condensation-graph depth limits

## Visibility

- [x] **SYN-V1-VIS-001** — Private-by-default root declarations
- [x] **SYN-V1-VIS-002** — `public record Name` declaration
- [x] **SYN-V1-VIS-003** — `public Type name = value` binding
- [x] **SYN-V1-VIS-004** — Cross-module access to public declarations only
- [x] **SYN-V1-VIS-005** — Public-surface accessibility validation
- [x] **SYN-V1-VIS-006** — No field modifiers, `private`, tiers, or re-exports
- [x] **SYN-V1-VIS-007** — Public dependency closure and private provenance
- [x] **SYN-V1-VIS-008** — Recursive public `Ref<T>` targets must be public

## Cross-module values and references

- [x] **SYN-V1-XMOD-001** — Qualified record types
- [x] **SYN-V1-XMOD-002** — Qualified immutable binding reuse
- [x] **SYN-V1-XMOD-003** — `ref(alias::name)` identity reference
- [x] **SYN-V1-XMOD-004** — Cross-module type compatibility
- [x] **SYN-V1-XMOD-005** — Stable identities and cross-source provenance

## Vocabulary aliases

- [x] **SYN-V1-VOC-001** — Repeated `use Vocabulary as alias`
- [x] **SYN-V1-VOC-002** — Exact host-captured resolution for every use
- [x] **SYN-V1-VOC-003** — Unique shared alias namespace
- [x] **SYN-V1-VOC-004** — Data-only behavior retained
- [x] **SYN-V1-VOC-005** — Cross-vocabulary dependencies excluded
- [x] **SYN-V1-VOC-006** — One semantic vocabulary revision per project identity
- [x] **SYN-V1-VOC-007** — Externally accessible vocabulary schema types
- [x] **SYN-V1-VOC-008** — Exact source-requirement/vocabulary-lock cover

## Opaque location data

- [x] **SYN-V1-LOC-001** — `url` and `path` type spelling
- [x] **SYN-V1-LOC-002** — Typed string-literal construction and exact IR values
- [x] **SYN-V1-LOC-003** — No implicit conversion or source acquisition behavior

## Tooling and conformance

- [x] **SYN-V1-TOL-001** — Deterministic reference formatting per source unit
- [x] **SYN-V1-TOL-002** — Module-aware authoring import and source projection
- [x] **SYN-V1-TOL-003** — Cross-file diagnostics and stale-result correlation
- [x] **SYN-V1-TOL-004** — Data-only construct/type/value descriptor catalogue
- [x] **SYN-V1-TOL-005** — Side-effect-free type compatibility preflight
- [x] **SYN-V1-TOL-006** — Fine-grained authoring-element source mappings
- [x] **SYN-V1-TOL-007** — Lossless promised-content round trip
- [x] **SYN-V1-TOL-008** — Distinct validation and service failure outcomes
- [x] **SYN-V1-TOL-009** — Separately versioned authoring bridge profile
- [x] **SYN-V1-TOL-010** — Exact descriptor-catalogue identity and deterministic merge
- [x] **SYN-V1-TOL-011** — Data-only card, port, property, nesting, and availability descriptors
- [x] **SYN-V1-TOL-012** — Vocabulary-derived descriptors and non-semantic presentation hints
- [x] **SYN-V1-TOL-013** — Project-to-source-to-capture authoritative Editor loop
- [x] **SYN-V1-TOL-014** — Separate capture, compiler derivation, view, and artifact requests
- [x] **SYN-V1-TOL-015** — Domain-separated non-self-referential identities
- [x] **SYN-V1-TOL-016** — Bounded `CanonicalLogicalForm` without graph isomorphism
- [x] **SYN-V1-TOL-017** — Artifact-specific minimal identity dependencies
- [x] **SYN-V1-TOL-018** — Explicit vocabulary authoring-metadata catalogue input
- [x] **SYN-V1-TOL-019** — Revision-bound project descriptor overlay
- [x] **SYN-V1-TOL-020** — Closed directly editable authoring project data model
- [x] **SYN-V1-EVO-001** — Explicit v0/v1 coexistence and migration boundary
- [x] **SYN-V1-EVO-002** — Multi-file source-to-IR/reader conformance
- [x] **SYN-V1-EVO-003** — Flow and Editor public-boundary probes

## Example

Shared module:

```neu
neu "1.0"
module example::shared

public record Image {
    string reference,
}

public Image default_image = {
    reference: "example.invalid/tool:1",
}
```

Root module:

```neu
neu "1.0"
module example::pipeline

use ExampleDomain as domain
import example::shared as shared

public domain::Pipeline pipeline = {
    image: shared::default_image,
}

url source_url = "https://example.invalid/source"
path config_file = "config/pipeline.neu"
```

The example demonstrates namespace and visibility shape only. `domain::Pipeline`
and its fields remain owned by an exact captured domain vocabulary; this design
does not define them.

## Completion rule

This design checklist is complete. `SOURCE-CONTRACT.md`,
`PROJECT-CONTRACTS.md`, `AUTHORING-CONTRACT.md`, and `CONFORMANCE.md` define the
portable-ready obligations. The portable seed must materialize their fixture
bytes, literal identity vectors, manifests, and runner-facing probe contracts;
an implementation must later supply passing execution evidence.
