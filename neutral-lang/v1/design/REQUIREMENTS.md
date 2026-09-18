# Neutral language v1 proposed requirements

Status: proposed design requirements

## Purpose

These candidate requirements define a possible project-scale Neutral v1. They
are not accepted semantics and do not alter the released v0.1 contract. Each
accepted item will require normative prose, grammar where applicable, lowering,
diagnostics, resource bounds, fixtures, and public-reader evidence.

## Product outcome

- **NL-V1-001:** A conforming implementation must compile a bounded captured
  project of multiple source units into one validated project-level Neutral IR.
- **NL-V1-002:** An independent consumer must enumerate root modules, module
  dependencies, public exports, values, types, references, vocabularies, source
  maps, and provenance without parsing source or using compiler-private models.
- **NL-V1-003:** A public authoring service must import and deterministically
  project the complete v1 surface without exposing a compiler-private AST.
- **NL-V1-004:** v1 must assign no Flow, Editor, runtime, provider, command,
  secret, authorization, or external-effect meaning.

## Captured project

- **NL-V1-CAP-001:** A project contains one or more host-selected root modules
  and the complete finite closure of their source imports.
- **NL-V1-CAP-002:** Each logical module maps to exactly one immutable captured
  source unit; duplicate claims are invalid.
- **NL-V1-CAP-003:** The host supplies the only resolver and all acquisition
  policy. Imports name logical modules and cannot name paths, URLs, registries,
  versions, credentials, or resolver options.
- **NL-V1-CAP-004:** `captureProject` records exact source bytes, logical/content
  identities, import closure, exact vocabulary inputs, behavior versions,
  semantic options, and deterministic budgets.
- **NL-V1-CAP-005:** `compileCapturedProject` performs no external I/O and fails
  closed when the captured closure or required contract is incomplete.
- **NL-V1-CAP-006:** Capture and compilation enforce independent bounds for
  source units, total bytes, imports per module, graph depth, vocabularies,
  declarations, references, diagnostics, and output size.

## Modules and imports

- **NL-V1-MOD-001:** Every source unit begins with exact v1 language and logical
  module headers.
- **NL-V1-MOD-002:** A logical module name is independent of its filesystem
  location and has a canonical qualified identity.
- **NL-V1-MOD-003:** Each import names one logical module and declares one
  mandatory, module-local `snake_case` alias.
- **NL-V1-MOD-004:** Imported declarations are accessible only through their
  alias; imports never inject unqualified names.
- **NL-V1-MOD-005:** Missing imports, duplicate module identities, duplicate
  aliases, self-imports, and import cycles are errors with source-linked
  diagnostics.
- **NL-V1-MOD-006:** Import resolution order, resolver delivery order,
  filesystem order, and concurrent scheduling do not affect meaning or
  diagnostic ordering.
- **NL-V1-MOD-007:** Wildcard imports, relative imports, implicit imports,
  re-exports, partial modules, and source-selected dependency versions are not
  part of v1.

## Visibility and names

- **NL-V1-VIS-001:** Root record and binding declarations are private by
  default and may be marked `public` explicitly.
- **NL-V1-VIS-002:** Only public declarations are accessible from another
  module or present in that module's public export index.
- **NL-V1-VIS-003:** Record fields have no independent visibility, and v1 has no
  `private`, protected, package, friend, or runtime-access modifier.
- **NL-V1-VIS-004:** A public declaration must not expose an inaccessible type
  or an uninterpretable private dependency.
- **NL-V1-VIS-005:** Module aliases and vocabulary aliases occupy one alias
  namespace and cannot collide with each other or protected core names.
- **NL-V1-VIS-006:** Visibility changes affect the public API fingerprint even
  when a declaration's logical value is unchanged.

## Cross-module semantics

- **NL-V1-XMOD-001:** Qualified public records and bindings may appear wherever
  the corresponding local declaration kind is valid.
- **NL-V1-XMOD-002:** Qualified immutable value reuse preserves the final value
  and records cross-module provenance.
- **NL-V1-XMOD-003:** `ref(alias::name)` may target a type-compatible public
  binding and records stable module-symbol identity rather than a durable
  graph-local element ID.
- **NL-V1-XMOD-004:** Import edges participate in project dependency analysis;
  identity-reference edges retain v0's non-value, non-execution semantics.
- **NL-V1-XMOD-005:** Moving a source file without changing its logical source
  and module identities does not change language meaning.

## Vocabularies

- **NL-V1-VOC-001:** A module may declare zero or more data-only vocabulary
  requirements, each under an explicit unique alias.
- **NL-V1-VOC-002:** Host-supplied lock data maps every requirement to one exact
  captured identity, content digest, schema version, and feature set.
- **NL-V1-VOC-003:** Vocabulary aliases and module aliases use the same
  qualified-name syntax but remain distinct resolved namespace kinds.
- **NL-V1-VOC-004:** Multiple vocabularies do not permit code, callbacks,
  scripts, native modules, hidden imports, custom validators, ambient lookup,
  or external effects.
- **NL-V1-VOC-005:** Cross-vocabulary dependencies are rejected unless a later
  accepted decision specifies their identity, capture, cycle, and validation
  rules.

## Project IR and evidence

- **NL-V1-IR-001:** The logical payload contains project/root identities,
  module graph, per-module declarations, export indexes, resolved cross-module
  edges, vocabulary identities, and required structural features.
- **NL-V1-IR-002:** Source maps identify both logical source unit and original
  half-open byte span.
- **NL-V1-IR-003:** Provenance distinguishes local source, imported reuse,
  local/imported reference, record default, and vocabulary default origins.
- **NL-V1-IR-004:** Derivation commits to the complete captured source and
  vocabulary closure while keeping meaning, acceptance/resource, and
  diagnostic/output-policy inputs separate.
- **NL-V1-IR-005:** Logical project equality is graph equality modulo one
  consistent renaming of graph-local element IDs; import order and encoded map
  order are non-semantic.
- **NL-V1-IR-006:** External encoded project IR is validated as untrusted input,
  including export accessibility and every cross-module edge.
- **NL-V1-IR-007:** A root/export projection cannot silently omit a dependency
  required to interpret an exposed declaration.

## Public services and tooling

- **NL-V1-API-001:** Public operations include project capture, captured-project
  compilation, a convenience compile operation, and project IR decode and
  validation.
- **NL-V1-API-002:** Capability discovery reports exact language/IR/authoring
  profiles, project shape, limits, vocabulary cardinality, operations, and
  stable required capability IDs.
- **NL-V1-API-003:** Unknown required capabilities, unavailable exact profiles,
  and mismatched captured contracts fail closed.
- **NL-V1-API-004:** The public authoring projection represents modules,
  imports, visibility, declarations, source value forms, supported comments,
  stable source anchors, and opaque extension fields without becoming the
  authoritative semantic model.
- **NL-V1-API-005:** Deterministic source projection is owned by the selected
  language adapter and returns an element-to-source mapping.
- **NL-V1-API-006:** Full and incremental processing of the same complete
  captured project produce equal logical results and diagnostic projections;
  incremental state is never required to interpret public IR.
- **NL-V1-API-007:** APIs remain reentrant, concurrency-safe, cancellable,
  bounded, and explicit about partial operational outcomes.

## Diagnostics and editor support

- **NL-V1-DIA-001:** Diagnostics include logical source identity, stable code,
  layer, severity, safe parameters, primary and related spans, optional remedy,
  and truncation state.
- **NL-V1-DIA-002:** Canonical ordering extends v0 ordering across source units
  using logical source identity before byte range and diagnostic code.
- **NL-V1-DIA-003:** Parser recovery or an incomplete module graph never
  produces authoritative IR or an authoritative authoring document.
- **NL-V1-DIA-004:** A request revision or equivalent correlation identity lets
  editors discard stale asynchronous validation results.
- **NL-V1-DIA-005:** Project and module fingerprints expose enough dependency
  facts for safe cache invalidation without making cache strategy semantic.

## Compatibility and conformance

- **NL-V1-EVO-001:** v0.1 and v1.0 are distinct explicit profiles. A v1
  compiler does not reinterpret `neu "0.1"` source under v1 rules.
- **NL-V1-EVO-002:** Any migration service is explicit, versioned, and returns
  a reviewable source-to-source result; compilation never migrates implicitly.
- **NL-V1-EVO-003:** Conformance includes positive, negative, ambiguity,
  multi-file, visibility, cycle, determinism, resource, malformed-IR,
  authoring-round-trip, and adversarial fixtures.
- **NL-V1-EVO-004:** At least one generic multi-file probe, one Flow boundary
  probe, and one Editor authoring probe use only public contracts.

## Explicit exclusions

v1 does not include package management, filesystem imports, version solving,
partial modules, wildcard imports, re-exports, visibility tiers, expressions,
functions, control flow, mutation, macros, templates, secrets, commands,
workflow primitives, runtime effects, executable plugins, or automatic
migration.
