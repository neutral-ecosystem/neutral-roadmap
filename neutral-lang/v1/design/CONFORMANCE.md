# Neutral language v1 conformance design

Status: accepted

This document freezes the v1 delta corpus and oracle obligations that the
portable seed must materialize. It reuses the complete accepted v0 corpus by
reference and adds only v1 cases. A portable manifest may choose file names and
runner encoding, but it must preserve every named case and expected observation.

## Conformance rule

A v1 implementation conforms only when:

1. the complete v0 corpus passes under explicit `0.1` profile selection;
2. every v1 positive project produces the specified public observations;
3. every v1 negative project produces the specified stable primary diagnostic;
4. repeated, reordered, incremental, and concurrent runs satisfy determinism;
5. malformed project IR and authoring data fail closed;
6. public reader, Editor, and Flow probes use only public contracts; and
7. all resource and cancellation outcomes remain non-authoritative.

## Fixture package shape

```text
fixtures/v1/
  manifest.toml
  positive/
  negative/
  identity/
  vocabulary/
  authoring/
  resources/
  malformed-ir/
oracles/v1/
  logical/
  diagnostics/
  source-map/
  provenance/
  identity/
```

Multi-file projects are fixture directories. Their manifest entry supplies the
exact logical module/source identities, source files, core profile, vocabulary
locks, processing controls, requested artifacts, and expected oracle IDs.

## Positive source projects

| Case ID | Required observation |
| --- | --- |
| `v1-positive-two-modules` | Qualified imported type and value reuse compile; export indexes and import edge are readable. |
| `v1-positive-qualified-ref` | `ref(alias::name)` lowers to the target module-symbol identity. |
| `v1-positive-private-reuse` | Public binding may resolve a private ordinary value; public view redacts its private provenance. |
| `v1-positive-scc-types` | Two modules in an import SCC may reference public record types without an illegal embedded cycle. |
| `v1-positive-scc-ref` | Cross-module identity-reference cycle is accepted and remains non-value/non-execution semantics. |
| `v1-positive-disconnected-module` | A declared unimported module remains in complete project IR and project identity. |
| `v1-positive-multiple-vocabularies` | Two exact independent vocabularies resolve under different aliases. |
| `v1-positive-shared-vocabulary` | Multiple modules/aliases share one exact semantic revision and one canonical type identity. |
| `v1-positive-url-path` | Exact decoded `url` and `path` tagged values appear in reader output. |
| `v1-positive-public-vocabulary-type` | A vocabulary-exported type is legal in a public signature. |
| `v1-positive-view` | Selected exports produce a view with complete public interpretive closure and unchanged project identity. |

## Negative capture and module projects

| Case ID | Primary diagnostic |
| --- | --- |
| `v1-negative-request-invalid` | `v1-request-invalid` |
| `v1-negative-profile-mismatch` | `v1-profile-mismatch` |
| `v1-negative-source-id-duplicate` | `v1-source-identity-duplicate` |
| `v1-negative-module-id-duplicate` | `v1-module-identity-duplicate` |
| `v1-negative-module-header-mismatch` | `v1-module-identity-mismatch` |
| `v1-negative-import-missing` | `v1-import-missing` |
| `v1-negative-self-import` | `v1-import-self` |
| `v1-negative-alias-module-module` | `v1-alias-duplicate` |
| `v1-negative-alias-module-vocabulary` | `v1-alias-duplicate` |
| `v1-negative-path-import` | `v1-import-syntax` |
| `v1-negative-url-import` | `v1-import-syntax` |
| `v1-negative-relative-import` | `v1-import-syntax` |
| `v1-negative-wildcard-import` | `v1-import-syntax` |
| `v1-negative-versioned-import` | `v1-import-syntax` |
| `v1-negative-import-before-use` | `v1-import-syntax` |
| `v1-negative-private-import-type` | `v1-symbol-inaccessible` |
| `v1-negative-private-import-value` | `v1-symbol-inaccessible` |
| `v1-negative-public-private-type` | `v1-public-type-inaccessible` |
| `v1-negative-public-private-ref` | `v1-public-ref-inaccessible` |
| `v1-negative-public-nested-private-ref` | `v1-public-ref-inaccessible` |
| `v1-negative-cross-module-value-cycle` | inherited value-cycle diagnostic class |
| `v1-negative-cross-module-record-cycle` | inherited record-cycle diagnostic class |
| `v1-negative-location-conversion` | inherited type-mismatch diagnostic class |
| `v1-negative-scc-limit` | `v1-scc-limit` |
| `v1-negative-project-limit` | `v1-project-limit` |
| `v1-negative-view-root` | `v1-view-root-invalid` |
| `v1-negative-view-private-evidence` | `v1-view-private-evidence` |
| `v1-negative-canonical-profile` | `v1-canonical-form-profile-unsupported` |
| `v1-negative-project-identity` | `v1-project-identity-mismatch` |

## Vocabulary lock projects

| Case ID | Expected result |
| --- | --- |
| `v1-vocabulary-lock-exact-cover` | Capture succeeds. |
| `v1-vocabulary-lock-missing` | `v1-vocabulary-lock-missing` |
| `v1-vocabulary-lock-extra` | `v1-vocabulary-lock-extra` |
| `v1-vocabulary-lock-duplicate` | `v1-vocabulary-lock-duplicate` |
| `v1-vocabulary-lock-conflicting-revision` | `v1-vocabulary-lock-conflict` |
| `v1-vocabulary-lock-unused` | `v1-vocabulary-lock-extra` |
| `v1-vocabulary-type-not-exported` | `v1-vocabulary-type-inaccessible` |
| `v1-vocabulary-encoding-unsupported` | `v1-vocabulary-encoding-unsupported` |
| `v1-vocabulary-visibility-invalid` | `v1-vocabulary-visibility-invalid` |
| `v1-vocabulary-public-closure-invalid` | `v1-vocabulary-public-closure-invalid` |
| `v1-vocabulary-cross-dependency` | `v1-vocabulary-cross-dependency` |
| `v1-vocabulary-authoring-only-change` | Logical project identity unchanged; descriptor catalogue identity changed. |
| `v1-vocabulary-authoring-formatting-only` | Metadata and catalogue identities unchanged. |

## Authoring contract projects

These cases run only against the exact Neutral authoring v1 profile. They are
not core-conformance dependencies.

| Case ID | Primary diagnostic or observation |
| --- | --- |
| `v1-authoring-model-parent-child-disagreement` | `v1-authoring-model-invalid` |
| `v1-authoring-edge-value-conflict` | `v1-authoring-edge-conflict` |
| `v1-authoring-edge-cardinality-conflict` | `v1-authoring-edge-conflict` |
| `v1-authoring-overlay-stale` | `v1-authoring-overlay-stale` |
| `v1-authoring-limit` | `v1-authoring-limit` |
| `v1-authoring-metadata-encoding` | `v1-vocabulary-authoring-encoding-unsupported` |
| `v1-authoring-metadata-semantic-mismatch` | `v1-vocabulary-authoring-semantic-mismatch` |
| `v1-authoring-metadata-entry-unknown` | `v1-vocabulary-authoring-entry-unknown` |
| `v1-authoring-metadata-entry-duplicate` | `v1-vocabulary-authoring-entry-duplicate` |
| `v1-authoring-metadata-hint-invalid` | `v1-vocabulary-authoring-hint-invalid` |
| `v1-authoring-presentation-visibility-independent` | A `port` may independently be `hidden-when-defaulted`; compiled meaning is unchanged. |
| `v1-authoring-internal-type-hint` | `v1-vocabulary-authoring-entry-unknown` |
| `v1-authoring-comment-anchor-invalid` | `v1-authoring-model-invalid` |
| `v1-authoring-opaque-key-undeclared` | `v1-authoring-model-invalid` |

## Identity vectors

The portable seed must freeze exact NHT transcript bytes and SHA-256 values for:

- empty/minimal one-module project;
- two modules supplied in both request orders;
- imports declared in different source orders where semantics are equal;
- equivalent source formatting/comments and different logical source IDs;
- changed logical module identity;
- changed public visibility;
- changed resolved value;
- changed vocabulary semantic revision;
- authoring metadata-only change;
- authoring metadata formatting-only change;
- changed view roots;
- changed view format profile;
- changed diagnostic policy; and
- changed compiler behavior profile;
- changed artifact format profile and reordered artifact requests; and
- each artifact-specific derivation family.

Required equalities:

```text
format/comment/source-identity change
    => same logical project identity

request/map/import order change with equal meaning
    => same logical project identity

module identity / visibility / logical value / vocabulary semantics change
    => different logical project identity

view-root change
    => same logical project identity, different view derivation identity

diagnostic-policy change
    => same IR artifact identity, different diagnostic derivation identity

artifact-request order change
    => same derivation and artifact identities

artifact format-profile change
    => same logical project and artifact derivation, different artifact identity

authoring-metadata-only change
    => same logical project identity, different catalogue identity

authoring-metadata formatting-only change
    => same metadata and catalogue identities
```

Two independent implementations must agree on all transcript and digest vectors
before the identity profile is declared implemented.

## Source-map and provenance oracles

Every positive syntax form introduced by v1 has a source-map oracle covering:

- language and module headers;
- vocabulary requirement and alias;
- import module name and alias;
- `public` modifier;
- qualified type/value/reference segments;
- `url` and `path` type/literal spans; and
- primary plus related cross-source diagnostic locations.

Provenance oracles cover local explicit values, local reuse, imported reuse,
local/imported references, record defaults, and vocabulary defaults. Public-view
oracles prove private symbol/span/provenance redaction without changing exposed
values.

## Determinism matrix

Each reference project is compiled under:

- original and reversed request source-unit order;
- original and shuffled captured map insertion order;
- sequential and concurrent clean compilation;
- clean full and warm incremental compilation;
- repeated compilation in separate processes; and
- formatting-only source changes where logical meaning is preserved.

Logical IR, logical project identity, public reader observations, and canonical
diagnostics must satisfy their declared equality rules. Source maps and captured
closure identity may differ when exact source bytes or source identities differ.

## Resource and adversarial cases

Each v1 collection bound has below-limit, exact-limit, and one-over-limit cases:

- source units and total bytes;
- imports per module and total edges;
- SCC size and condensation depth;
- vocabularies and semantic-contract bytes;
- declarations and resolved edges;
- view roots;
- diagnostics and related locations; and
- artifact output size.

The authoring collection repeats this boundary pattern for modules, elements,
connections, descriptors, ports/properties, conditions/constraints, value
depth, child lists, comments and total comment bytes, opaque metadata and total
opaque bytes, and element/source mappings.

Additional cases include integer overflow in framed lengths, duplicate keys,
unknown required fields/capabilities, invalid UTF-8, digest mismatch, malicious
descriptor text, cancellation at every public stage, malformed cross-module IR
edges, private-public export corruption, and canonical project identity mismatch.

No resource, cancellation, recovery, unavailable-service, or malformed-input
outcome may expose authoritative IR, authoring project, or view.
Resource-exhausted, cancellation, unavailable-service, and internal-defect
outcomes also have no result-envelope identity or artifact envelopes. A
completed invalid outcome has a reproducible result-envelope identity but no
logical project identity or artifacts.

## Public reader probe

The reader probe uses only validated public APIs to:

1. enumerate modules and SCC/import relationships;
2. enumerate public exports and resolve their stable module-symbol identities;
3. read core, module, and vocabulary type identities;
4. distinguish value reuse from identity-reference edges;
5. read tagged `url` and `path` values;
6. read source maps and provenance when companion artifacts are supplied;
7. derive and inspect a public view; and
8. reject a malformed encoded cross-module edge.

It imports no parser, resolver, compiler-private AST, or implementation-private
IR model.

## Editor boundary probe

The Editor probe must:

1. discover exact core/IR/authoring/descriptor profiles;
2. build a catalogue from core descriptors, vocabulary semantic contracts, and
   vocabulary authoring metadata;
3. generate palette cards, ports, properties, and module actions without a
   handwritten v1 construct table;
4. create an empty project with host-selected source/module identities and
   project a compiling `.neu` source unit;
5. import the reference multi-module project and derive its revision-bound
   project descriptor overlay;
6. create/edit modules, imports, visibility, qualified reuse/references,
   repeated vocabularies, `url`, and `path`;
7. prove local/imported/vocabulary type bindings, symbol choices, and exact
   source spellings come from the project overlay, not the static catalogue or
   a handwritten table;
8. project all `.neu` units, complete element/source mappings, and the canonical
   source-used vocabulary identity list;
9. form an exact captured-project request without reparsing source and compile it;
10. map cross-source diagnostics and discard a stale revision; and
11. save/reopen and reproduce equal logical project identity.

The probe additionally proves that metadata-only vocabulary changes alter UI
catalogue identity without altering compiled meaning.

## Flow boundary probe

The Flow probe receives only validated complete project IR or a public view. It
must read Flow-owned vocabulary records by canonical semantic identity and map
them into a Flow-private normalized model. It must not parse `.neu`, resolve
imports, implement visibility, access Editor state, generate Neutral IR, or
perform provider effects during the probe.

## Traceability

| v1 checklist area | Governing contract and evidence |
| --- | --- |
| Base/v0 | v0 portable requirements and complete v0 corpus |
| Document/imports/visibility | `SOURCE-CONTRACT.md`, positive/negative projects |
| Vocabulary/location types | `SOURCE-CONTRACT.md`, `VOCABULARY-CONTRACT.md`, vocabulary cases |
| Capture/identity/IR | `PROJECT-CONTRACTS.md`, identity/malformed/resource oracles |
| Authoring/tooling | `AUTHORING-CONTRACT.md`, Editor boundary probe |
| Consumer separation | Reader, Editor, and Flow probes in this document |

## Promotion evidence

The design is ready for portable promotion when these accepted contract files
are copied into the required portable layout, every named fixture receives
actual source/request bytes and reviewed oracles, the identity vectors contain
literal transcript/digest values, and the standalone link/build checks pass.
Implementation conformance is a later gate; portable promotion must not claim
that the compiler already passes the corpus.
