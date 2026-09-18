# Neutral language v1 syntax checklist

Status: proposed design checklist

Authoritative proposal: [REQUIREMENTS.md](REQUIREMENTS.md)

Checking an item requires normative prose, grammar, valid and invalid fixtures,
stable diagnostics, source-to-IR lowering, provenance, resource treatment, and
public-reader evidence. This checklist does not approve syntax by itself.

## Retained v0 surface

- [ ] **SYN-V1-BASE-001** — v0 conformance by reference
- [ ] **SYN-V1-BASE-002** — Complete v0-to-v1 delta disposition
- [ ] **SYN-V1-BASE-003** — Delta fixtures and explicit profile selection

## Project and document shape

- [ ] **SYN-V1-DOC-001** — Exact `neu "1.0"` header
- [ ] **SYN-V1-DOC-002** — Qualified logical module header
- [ ] **SYN-V1-DOC-003** — One source unit per logical module
- [ ] **SYN-V1-DOC-004** — Header, vocabulary, import, declaration ordering
- [ ] **SYN-V1-DOC-005** — Multiple bounded source units and host-selected derivation roots
- [ ] **SYN-V1-DOC-006** — Host-neutral captured-project request

## Imports and qualification

- [ ] **SYN-V1-IMP-001** — `import qualified::module as alias`
- [ ] **SYN-V1-IMP-002** — Mandatory unique `snake_case` alias
- [ ] **SYN-V1-IMP-003** — Qualified-only imported name access
- [ ] **SYN-V1-IMP-004** — Missing, duplicate, and self-import errors
- [ ] **SYN-V1-IMP-005** — SCC import collection and semantic-cycle rejection
- [ ] **SYN-V1-IMP-006** — No paths, URLs, ranges, wildcards, or implicit imports
- [ ] **SYN-V1-IMP-007** — Module versus vocabulary namespace resolution

## Visibility

- [ ] **SYN-V1-VIS-001** — Private-by-default root declarations
- [ ] **SYN-V1-VIS-002** — `public record Name` declaration
- [ ] **SYN-V1-VIS-003** — `public Type name = value` binding
- [ ] **SYN-V1-VIS-004** — Cross-module access to public declarations only
- [ ] **SYN-V1-VIS-005** — Public-surface accessibility validation
- [ ] **SYN-V1-VIS-006** — No field modifiers, `private`, tiers, or re-exports
- [ ] **SYN-V1-VIS-007** — Public dependency closure and private provenance

## Cross-module values and references

- [ ] **SYN-V1-XMOD-001** — Qualified record types
- [ ] **SYN-V1-XMOD-002** — Qualified immutable binding reuse
- [ ] **SYN-V1-XMOD-003** — `ref(alias::name)` identity reference
- [ ] **SYN-V1-XMOD-004** — Cross-module type compatibility
- [ ] **SYN-V1-XMOD-005** — Stable identities and cross-source provenance

## Vocabulary aliases

- [ ] **SYN-V1-VOC-001** — Repeated `use Vocabulary as alias`
- [ ] **SYN-V1-VOC-002** — Exact host-captured resolution for every use
- [ ] **SYN-V1-VOC-003** — Unique shared alias namespace
- [ ] **SYN-V1-VOC-004** — Data-only behavior retained
- [ ] **SYN-V1-VOC-005** — Cross-vocabulary dependencies excluded

## Opaque location data

- [ ] **SYN-V1-LOC-001** — `url` and `path` type spelling
- [ ] **SYN-V1-LOC-002** — Typed string-literal construction and exact IR values
- [ ] **SYN-V1-LOC-003** — No implicit conversion or source acquisition behavior

## Tooling and conformance

- [ ] **SYN-V1-TOL-001** — Deterministic reference formatting per source unit
- [ ] **SYN-V1-TOL-002** — Module-aware authoring import and source projection
- [ ] **SYN-V1-TOL-003** — Cross-file diagnostics and stale-result correlation
- [ ] **SYN-V1-TOL-004** — Data-only construct/type/value descriptor catalogue
- [ ] **SYN-V1-TOL-005** — Side-effect-free type compatibility preflight
- [ ] **SYN-V1-TOL-006** — Fine-grained authoring-element source mappings
- [ ] **SYN-V1-TOL-007** — Lossless promised-content round trip
- [ ] **SYN-V1-TOL-008** — Distinct validation and service failure outcomes
- [ ] **SYN-V1-TOL-009** — Separately versioned authoring bridge profile
- [ ] **SYN-V1-TOL-010** — Exact descriptor-catalogue identity and deterministic merge
- [ ] **SYN-V1-TOL-011** — Data-only card, port, property, nesting, and availability descriptors
- [ ] **SYN-V1-TOL-012** — Vocabulary-derived descriptors and non-semantic presentation hints
- [ ] **SYN-V1-TOL-013** — Project-to-source-to-capture authoritative Editor loop
- [ ] **SYN-V1-EVO-001** — Explicit v0/v1 coexistence and migration boundary
- [ ] **SYN-V1-EVO-002** — Multi-file source-to-IR/reader conformance
- [ ] **SYN-V1-EVO-003** — Flow and Editor public-boundary probes

## Proposed example

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
and its fields remain owned by an exact captured domain vocabulary; this proposal
does not define them.

## Completion rule

The checklist is complete only when every item is accepted or explicitly
removed, the normative v1 grammar and IR agree, the entire captured closure is
bounded and replayable, and independent Flow and Editor probes require no
private compiler model.
