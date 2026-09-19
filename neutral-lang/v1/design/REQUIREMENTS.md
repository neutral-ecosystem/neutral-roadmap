# Neutral language v1 design requirements

Status: accepted

## Purpose

These requirements define the accepted project-scale Neutral v1 design baseline
and do not alter the released v0.1 contract. Normative delta prose, grammar,
lowering, diagnostics, bounds, fixture obligations, and public-boundary probes
are fixed by the companion design contracts linked from `PLAN.md`.

The governing refinements are the accepted
[decision ledger](DECISIONS.md), [source contract](SOURCE-CONTRACT.md),
[project and identity contracts](PROJECT-CONTRACTS.md),
[vocabulary contracts](VOCABULARY-CONTRACT.md),
[authoring contract](AUTHORING-CONTRACT.md), and
[conformance design](CONFORMANCE.md).

## Relationship to v0

Neutral v1 uses the released
[v0 requirements](../../v0/portable/specs/REQUIREMENTS.md) as its normative
baseline. This document specifies only v1 deltas and new obligations.

- **NL-V1-BASE-001:** A v1 implementation satisfies the complete v0 contract
  by reference, except for v0 requirements explicitly superseded below.
- **NL-V1-BASE-002:** Every superseded v0 requirement maps to one or more named
  v1 requirements and an explicit compatibility or migration decision.
- **NL-V1-BASE-003:** The
  [v0 conformance corpus](../../v0/portable/conformance/README.md) remains the
  inherited baseline; v1 adds delta fixtures and adaptations only where a
  superseded rule makes a v0 source fixture inapplicable.
- **NL-V1-BASE-004:** Profile selection remains explicit. `neu "0.1"` continues
  to use the frozen v0 contract and is never reinterpreted as v1.

| Superseded or extended v0 requirement | Governing v1 delta |
| --- | --- |
| `NL-CAP-001` | `NL-V1-CAP-001..015` |
| `NL-SRC-007` | `NL-V1-MOD-002..004`, `NL-V1-VOC-003` |
| `NL-DOC-001..005` | `NL-V1-MOD-*`, `NL-V1-VOC-*`, `NL-V1-VIS-*` |
| `NL-REF-001`, `NL-REF-004..005` | `NL-V1-XMOD-003..005`, `NL-V1-IR-005`, `NL-V1-IR-009` |
| `NL-TYP-001`, `NL-VAL-001` | `NL-V1-LOC-*` |
| `NL-VOC-001`, `NL-VOC-003` | `NL-V1-VOC-*` |
| `NL-IR-002`, `NL-IR-004..005` | `NL-V1-IR-*` |
| `NL-PRO-001` | `NL-V1-IR-002..004`, `NL-V1-IR-009` |
| `NL-API-001..004` | `NL-V1-API-*` |
| `NL-DIA-002` | `NL-V1-DIA-002` |

Unlisted v0 requirements remain authoritative without being copied here. Any
additional change must first be added to this map.

## Product outcome

- **NL-V1-001:** A conforming implementation must compile a bounded captured
  project of multiple source units into one validated project-level Neutral IR.
- **NL-V1-002:** An independent consumer must enumerate modules, dependencies,
  public exports, values, types, references, vocabularies, source maps, and
  provenance without parsing source or using compiler-private models.
- **NL-V1-003:** A Neutral v1 release intended to support Editor conformance
  must publish a compatible authoring bridge that imports and deterministically
  projects the complete v1 surface without exposing a compiler-private AST.
  Core conformance alone does not require that bridge.
- **NL-V1-004:** v1 must assign no Flow, Editor, runtime, provider, command,
  secret, authorization, or external-effect meaning.

## Captured project

- **NL-V1-CAP-001:** A project contains a complete finite source-module set
  declared by one captured-project request.
- **NL-V1-CAP-002:** Each logical module maps to exactly one immutable captured
  source unit; duplicate claims are invalid.
- **NL-V1-CAP-003:** The host owns all resolution and acquisition and completes
  them before calling Neutral. Imports name logical modules and cannot name
  paths, URLs, registries, versions, credentials, or resolver options.
  `captureProject` accepts no resolver or acquisition callback.
- **NL-V1-CAP-004:** `captureProject` validates and freezes the exact supplied
  source bytes, logical/content identities, complete import closure, exact
  vocabulary semantic contracts, and behavior profiles into an immutable
  `CapturedProject`.
- **NL-V1-CAP-005:** Capture and compilation perform no external I/O and fail
  closed when the supplied closure or required contract is incomplete.
- **NL-V1-CAP-006:** Capture and compilation enforce independent bounds for
  source units, total bytes, imports per module, total import edges, SCC size,
  SCC-condensation depth, vocabularies, declarations, references, diagnostics,
  and output size.
- **NL-V1-CAP-007:** Root/export selection is not a capture or compiler input.
  It belongs only to a later consumer `ViewRequest` over a validated complete
  project. Roots do not participate in captured closure identity, logical
  project identity, logical equality, or complete project IR.
- **NL-V1-CAP-008:** Hosts may supply captured source bytes from files, editor
  buffers, generated test inputs, or other authorized stores under the same
  logical source contract; language meaning never depends on storage origin.
- **NL-V1-CAP-009:** v1 publishes a versioned host-neutral
  `CapturedProjectRequest` data contract containing an optional non-semantic
  declared project key, exact core language profile, source units with logical
  module/source identities and bytes, exact vocabulary semantic locks, and
  capture-contract version. It contains no roots, compiler options, output
  policy, authoring metadata, or host acquisition state.
- **NL-V1-CAP-010:** Host path/URL locator metadata, workspace state,
  package-manager state, credentials, and acquisition metadata are excluded from
  the request's logical project model, IR, ordinary diagnostics, and derivation
  identity. This exclusion does not apply to source-level `path` or `url`
  values.
- **NL-V1-CAP-011:** Every source unit in a `CapturedProjectRequest` is an
  intentional project member, including a disconnected module. Candidate host
  inputs outside that exact set are excluded before the request is formed;
  “unreachable input” and strict candidate enumeration are host concerns, not
  Neutral capture semantics.
- **NL-V1-CAP-012:** Conflicting source mappings for one logical module are
  rejected. Equivalent canonical source content mapped by different hosts may
  produce the same logical project.
- **NL-V1-CAP-013:** Each source unit's declared `module` header must equal its
  request logical module identity exactly. Its `neu` header must equal the
  request core language profile, and logical source identities must be unique.
  Any mismatch fails capture before module resolution.
- **NL-V1-CAP-014:** Every import must resolve to exactly one source unit in the
  supplied set. Capture neither fetches a missing unit nor discards an
  unimported declared unit.
- **NL-V1-CAP-015:** Caller-selected resource ceilings, cancellation, request
  correlation, and diagnostic-output policy are processing controls carried
  separately from `CapturedProjectRequest`. They may affect acceptance or
  operational outcome but cannot silently alter successful project meaning.

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
  aliases, and self-imports are errors with source-linked diagnostics.
- **NL-V1-MOD-006:** Request source-unit order, import declaration order,
  filesystem order, and concurrent scheduling do not affect meaning or
  diagnostic ordering.
- **NL-V1-MOD-007:** Wildcard imports, relative imports, implicit imports,
  re-exports, partial modules, and source-selected dependency versions are not
  part of v1.
- **NL-V1-MOD-008:** Import cycles are captured and resolved by strongly
  connected components. Only inherited or explicitly specified semantic cycles,
  such as value-dependency or illegal embedded-record cycles, are errors.

## Visibility and names

- **NL-V1-VIS-001:** Root record and binding declarations are private by
  default and may be marked `public` explicitly.
- **NL-V1-VIS-002:** Only public declarations are accessible from another
  module or present in that module's public export index.
- **NL-V1-VIS-003:** Record fields have no independent visibility, and v1 has no
  `private`, protected, package, friend, or runtime-access modifier.
- **NL-V1-VIS-004:** A public declaration signature may reference only public,
  transitively reachable types.
- **NL-V1-VIS-005:** Module aliases and vocabulary aliases occupy one alias
  namespace and cannot collide with each other or protected core names.
- **NL-V1-VIS-006:** Visibility changes affect the public API fingerprint even
  when a declaration's logical value is unchanged.
- **NL-V1-VIS-007:** A public reader view contains the public dependency closure
  needed to interpret each exposed declaration and excludes private
  implementation provenance. An invalid public signature fails compilation.

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
- **NL-V1-XMOD-005:** Moving a host file does not change language meaning.
  Changing only a logical source identity changes capture/evidence identity but
  not logical project meaning; changing a logical module identity changes
  meaning.

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
  domain-neutral decision specifies their identity, capture, cycle, and
  validation rules.
- **NL-V1-VOC-006:** v1 defines only generic vocabulary capture, resolution, and
  IR representation. It defines no Flow, provider, or integration vocabulary,
  and does not interpret vocabulary mappings or application behavior.
- **NL-V1-VOC-007:** A vocabulary semantic-contract identity is distinct from
  any authoring-metadata identity. Only the semantic schema, defaults, required
  features, and other compiler-observable facts participate in logical project
  meaning.
- **NL-V1-VOC-008:** Titles, documentation, categories, icon tokens, ordering,
  and other declared non-semantic presentation hints may change descriptor-
  catalogue identity but cannot change logical project identity or compiled IR.
  Presentation mode and initial visibility are independent closed fields;
  metadata cannot make an internal type source-authorable.
- **NL-V1-VOC-009:** One project resolves one canonical vocabulary identity to
  exactly one semantic-contract revision. All aliases and modules requiring
  that identity use the same revision; conflicting locks fail capture.
- **NL-V1-VOC-010:** A vocabulary semantic contract explicitly identifies its
  externally accessible schema types. Those types count as public reachable
  types for public-signature validation; non-exported vocabulary types cannot
  appear in source or public signatures.
- **NL-V1-VOC-011:** The request lock set is an exact cover of distinct canonical
  vocabulary identities required by source. Every requirement occurrence maps
  to exactly one covered identity and the project's one permitted revision;
  missing, extra, duplicate, conflicting, or unused locks fail capture.

## Opaque location data

- **NL-V1-LOC-001:** v1 adds distinct core scalar types `url` and `path`.
- **NL-V1-LOC-002:** `url` and `path` values use the existing string-literal
  spelling in a typed context, preserve exact typed text in logical IR, and have
  no implicit conversion to or from `string` or each other.
- **NL-V1-LOC-003:** Neutral does not fetch URLs, open paths, normalize paths,
  select an operating-system interpretation, validate reachability, or infer
  authority from a `url` or `path` value.
- **NL-V1-LOC-004:** `url` and `path` are ordinary values and cannot appear as
  import locators, resolver instructions, vocabulary locators, or acquisition
  authority.
- **NL-V1-LOC-005:** Project IR, reader validation, vocabulary schemas, source
  maps, provenance, diagnostics, resource accounting, and authoring descriptors
  represent `url` and `path` as bounded data-only types.

## Project IR and evidence

- **NL-V1-IR-001:** The logical payload envelope carries logical project identity,
  module graph, per-module declarations, export indexes, resolved cross-module
  edges, vocabulary identities, and required structural features. It contains
  no logical source identities or selected roots. Identity computation uses the
  canonical logical payload body with all self-identifying envelope fields and
  companion evidence removed.
- **NL-V1-IR-002:** Source maps identify both logical source unit and original
  half-open byte span.
- **NL-V1-IR-003:** Provenance distinguishes local source, imported reuse,
  local/imported reference, record default, and vocabulary default origins.
- **NL-V1-IR-004:** Derivation commits to the complete captured source and
  vocabulary closure while keeping meaning, acceptance/resource, and
  diagnostic/output-policy inputs separate.
- **NL-V1-IR-005:** Logical project equality is equality of the normative
  `CanonicalLogicalForm` defined below. Graph-local element IDs, source-unit
  identities, aliases, import order, and encoded map order are non-semantic and
  require no general graph-isomorphism comparison.
- **NL-V1-IR-006:** External encoded project IR is validated as untrusted input,
  including export accessibility and every cross-module edge.
- **NL-V1-IR-007:** A root/export projection cannot silently omit a dependency
  required to interpret an exposed declaration.
- **NL-V1-IR-008:** Project IR artifact identity binds an IR-specific derivation
  identity formed from logical project identity, exact IR profile, and only the
  inputs capable of changing that IR artifact. Diagnostic policy, diagnostic
  limits, source-map policy, and unrelated view settings do not participate.
- **NL-V1-IR-009:** A public reader can resolve any exposed type, value, or
  reference to its stable module-symbol identity and can map any exposed IR
  element to its source unit and source span when mapping evidence is present.
- **NL-V1-IR-010:** A public binding may depend on private declarations. Its
  public view exposes the binding's resolved value and public interpretive type
  closure but omits private symbol identities, source spans, and implementation
  provenance. Visibility is encapsulation, not confidentiality or authority.
- **NL-V1-IR-011:** A versioned `ViewRequest` selects roots or exports from a
  validated complete project. A materialized view is a derived artifact with
  its own derivation and artifact identities; it never changes or masquerades
  as the complete project IR.
- **NL-V1-IR-012:** Every identity reference transitively exposed through a
  public binding value, including references nested in records and lists, must
  target a public binding. Private ordinary value reuse may be resolved and
  redacted as specified above; a private `Ref<T>` target cannot be redacted
  without changing the public value and therefore makes the public declaration
  invalid.

## Canonical logical form

- **NL-V1-CAN-001:** v1 defines a versioned `CanonicalLogicalForm` solely for
  logical equality and identity input. It is distinct from source formatting
  and from any public project-IR serialization.
- **NL-V1-CAN-002:** The form orders modules by canonical logical module
  identity and addresses declarations by stable module-symbol identity.
  Declaration order is omitted where inherited semantics make it non-semantic;
  record-field and list order are retained where semantically significant.
- **NL-V1-CAN-003:** Resolved type, value-reuse, and identity-reference edges
  use canonical type or module-symbol identities. Graph-local IDs, source-unit
  identities, aliases, source spans, comments, provenance, diagnostics,
  presentation data, and host data are absent.
- **NL-V1-CAN-004:** Any logically unordered collection has one specified
  canonical key ordering. Text, exact numbers, `url`, and `path` have one
  specified byte representation; no locale, platform, or insertion order may
  affect it.
- **NL-V1-CAN-005:** The exact canonical-form version, encoding rules, digest
  algorithm, and domain tags are fixed by the core identity profile. Identity
  verification fails when that exact profile is unavailable.
- **NL-V1-CAN-006:** Canonical-form construction is deterministic and bounded
  by direct ordering and stable identities. It must not require general graph
  isomorphism, permutation search, or unbounded normalization.

## Project identities

- **NL-V1-ID-001:** Logical project identity is a domain-separated digest of
  the canonical logical payload body excluding the identity field itself,
  source maps, provenance, diagnostics, derivation records, and external artifact
  encoding. The
  body includes the canonical logical
  module graph, semantic content, and exact resolved vocabulary semantic
  contracts. Host
  paths, logical source identities, aliases, capture order, selected roots, and
  derivation settings do not participate.
- **NL-V1-ID-002:** Captured closure identity is a domain-separated digest of
  the capture-contract version, exact core profile, canonical source-unit set
  with identities and bytes, and exact vocabulary semantic locks. It excludes
  the closure identity field itself and all processing controls.
- **NL-V1-ID-003:** Two captured closures may have different closure identities
  while producing the same logical project identity.
- **NL-V1-ID-004:** Compilation-result derivation identity derives from captured
  closure identity, logical project identity, exact compiler/IR behavior
  profiles, acceptance limits, exact artifact requests, the closed compiler
  options record, and diagnostic policy. It contains no selected roots and may identify the
  complete result envelope without becoming every contained artifact's
  derivation identity.
- **NL-V1-ID-005:** Artifact identity derives from its artifact-specific
  derivation identity and exact artifact request. v1 artifact requests contain
  kind, format profile, and the sole transformation token `none`, using a
  domain-separated canonical form that excludes the artifact
  identity field itself.
- **NL-V1-ID-006:** Logical module identity is independent of host mapping.
  Equivalent canonical module content from different hosts preserves project
  identity; conflicting mappings for one module fail capture.
- **NL-V1-ID-007:** Vocabulary aliases are local source bindings only. Multiple
  modules may use one vocabulary under different aliases without changing its
  canonical vocabulary identity or version in IR.
- **NL-V1-ID-008:** Every option is classified before use. Inputs that can
  change logical meaning participate in the logical payload and project
  identity; acceptance/diagnostic controls participate only in compiler
  derivation; serialization or view inputs participate only in the relevant
  artifact derivation. No unclassified semantic-options bag is permitted.
- **NL-V1-ID-009:** A view derivation identity derives from the complete logical
  project identity, exact `ViewRequest`, view-schema version, and view-specific
  policy. Selected roots participate here only.
- **NL-V1-ID-010:** Acceptance limits and diagnostic-output policy participate
  in compiler derivation identity when they govern that derivation. Cancellation
  handles, request revisions, scheduling, and timing are operational correlation
  state and never participate in project, derivation, view, or artifact identity.
- **NL-V1-ID-011:** Each artifact kind declares its own derivation input set.
  Project IR derivation depends on logical project identity and IR-producing
  compiler/IR profiles; source-map/provenance derivations additionally depend
  on captured closure and their evidence artifact kind; diagnostic derivation
  depends on captured closure, compiler behavior, limits, and diagnostic policy;
  resource-fact derivation depends on captured closure, compiler behavior, and
  limits; a compilation-
  result envelope may bind every requested output and deterministic completed
  outcome. Cancellation, unavailable service, and internal defects have no
  authoritative result-envelope identity. An
  input cannot enter a derivation for an artifact it cannot change.

## Public services and tooling

- **NL-V1-API-001:** Public operations include project capture, captured-project
  compilation, a convenience compile operation, complete-project IR decode and
  validation, and separate view derivation.
- **NL-V1-API-002:** Core capability discovery reports exact language/IR
  profiles, project shape, limits, vocabulary cardinality, core operations, and
  stable required capability IDs.
- **NL-V1-API-003:** Unknown required capabilities, unavailable exact profiles,
  and mismatched captured contracts fail closed.
- **NL-V1-API-006:** Full and incremental processing of the same complete
  captured project produce equal logical results and diagnostic projections;
  incremental state is never required to interpret public IR.
- **NL-V1-API-007:** APIs remain reentrant, concurrency-safe, cancellable,
  bounded, and explicit about partial operational outcomes.
- **NL-V1-API-016:** The core operation shapes are
  `captureProject(CapturedProjectRequest, ProcessingControls)`,
  `compileCapturedProject(CapturedProject, CompilerDerivationRequest,
  ProcessingControls)`, `decodeAndValidateProject(ArtifactEnvelope,
  CapturedProject,
  ProcessingControls)`, and `deriveView(ValidatedProject, ViewRequest,
  ProcessingControls)`. Processing controls are never stored as project semantics.

## Neutral authoring v1 bridge

- **NL-V1-BRG-001:** Neutral authoring v1 is separately versioned from Neutral
  v1 core and advertises its own profile identity and compatibility window.
- **NL-V1-BRG-002:** An authoring profile identifies the compatible core
  language/IR profiles it requires. Descriptor, formatting, adapter, and
  editor-metadata changes do not create a new core language version.
- **NL-V1-BRG-003:** Editor conformance requires a compatible core and authoring
  profile. Headless consumers require no authoring bridge unless they explicitly
  request one.
- **NL-V1-BRG-004:** The bridge exposes one bounded, immutable profile
  descriptor catalogue for every profile-owned construct, type constructor,
  value form, project action, and captured vocabulary data shape available
  under the selected profiles. Editors must not derive this surface from a
  version string.
- **NL-V1-BRG-005:** Every descriptor has a stable qualified identity, schema
  version, owner (`core` or canonical vocabulary identity), required capability
  IDs, availability conditions, and deterministic catalogue order. Colliding
  qualified identities or incompatible duplicate meanings fail closed.
- **NL-V1-BRG-006:** An authorable-card descriptor declares its semantic
  projection kind, source slot, ports, properties, permitted child contexts,
  and constraints. A card is an authoring projection of Neutral data; it does
  not imply a Neutral function, invocation, control flow, or execution step.
- **NL-V1-BRG-007:** Port descriptors declare stable port identity, direction,
  semantic edge kind, exact type expression, cardinality, and requiredness.
  Value reuse and identity reference are different edge kinds. Compatibility is
  supplied by immutable profile data or the side-effect-free compatibility
  service and remains subordinate to compilation.
- **NL-V1-BRG-008:** Property descriptors declare their authoring/source slot,
  type or value-form identity, required/defaulted/nullability state,
  cardinality, and nesting behavior. Presentation hints cannot change any of
  those facts.
- **NL-V1-BRG-009:** Vocabulary authoring descriptors are derived
  deterministically from the exact captured vocabulary semantic schema plus an
  independently identified authoring-metadata profile. That profile may add
  bounded non-semantic hints such as title, category, documentation, ordering,
  and icon token, but cannot replace or contradict the semantic schema.
- **NL-V1-BRG-010:** Core and vocabulary descriptors merge by qualified
  identity into a deterministic catalogue. Source aliases affect labels and
  source projection only; they do not create descriptor or vocabulary identity.
- **NL-V1-BRG-011:** Descriptor payloads are data only. They contain no
  callbacks, scripts, components, native modules, validators, network lookup,
  filesystem lookup, or authority grant.
- **NL-V1-BRG-012:** The catalogue identity commits to the exact core,
  authoring, descriptor-schema, vocabulary semantic-contract, and vocabulary
  authoring-metadata profiles from which it was produced. Cached controls and
  compatibility results are invalidated when any member of that tuple changes.
- **NL-V1-BRG-013:** Unknown required descriptor fields or capabilities fail
  closed. Unknown fields explicitly marked optional and non-semantic may be
  preserved and ignored.
- **NL-V1-BRG-014:** Catalogue discovery, project import, source projection,
  compatibility preflight, formatting, and validation are independently
  advertised operations; absence of one is reported rather than emulated with
  a private parser or grammar table.
- **NL-V1-BRG-015:** Project-local records, imported records, bindings, aliases,
  and action availability are exposed through a deterministic project
  descriptor overlay keyed by catalogue identity and authoring revision. They
  are not fabricated in the profile catalogue, which has no project input.
- **NL-V1-BRG-016:** The public authoring document is a bounded closed data
  model of modules, descriptor-owned elements, typed slot values, ordered
  nesting, and value-reuse/reference connections. A generic Editor can create
  and edit it without callbacks or a private grammar table.
- **NL-V1-BRG-017:** Projection kinds, contexts, conditions, constraints, type
  expressions, value forms, project actions, comments, overlays, mappings, and
  failure envelopes use closed versioned schemas with baseline supported
  ceilings. Calling a payload closed or bounded without defining those schemas
  and ceilings is insufficient.
- **NL-V1-BRG-018:** Authoring connections are the sole representation of value
  reuse and identity-reference edges. A connected target slot has no competing
  symbol-valued property; duplicates or a simultaneous literal value fail with
  a stable authoring diagnostic.
- **NL-V1-BRG-019:** Promised comments use bounded module/element/slot anchors,
  and opaque optional metadata is keyed, size-bounded, and accepted only when
  the selected capability profile declares the key optional and non-semantic.
- **NL-V1-BRG-020:** Core and authoring diagnostics share a bounded structural
  envelope but have separate layer and code registries. Authoring metadata or
  Editor protocol changes cannot add requirements to the core v1 registry.
- **NL-V1-API-004:** The public authoring projection represents modules,
  imports, visibility, declarations, source value forms, supported comments,
  stable source anchors, and opaque extension fields without becoming the
  authoritative semantic model.
- **NL-V1-API-005:** Deterministic source projection is owned by the selected
  language adapter and returns an element-to-source mapping.
- **NL-V1-API-008:** The authoring bridge registry enumerates host-supplied
  language installations, adapter protocol versions, and exact supported
  language, IR, and authoring profiles without searching because of source
  content.
- **NL-V1-API-009:** An authoring capability profile describes document/project shape,
  construct descriptors, identifier categories and protected names, type
  constructors, value forms, compatibility behavior, captured-input
  requirements, vocabulary behavior, supported operations, diagnostic mapping,
  formatting behavior, structural limits, and explicit exclusions.
- **NL-V1-API-010:** Authoring compatibility preflight is available through immutable
  profile data or a side-effect-free query keyed by exact profile and type
  identities. The compiler remains authoritative when preflight and compilation
  disagree.
- **NL-V1-API-011:** Authoring capability and descriptor data are bounded. They
  cannot contain executable callbacks, scripts, native modules, UI components,
  ambient resource lookups, or authority grants.
- **NL-V1-API-012:** Bridge validation accepts exact authoring profile, captured project,
  behavior versions, limits, cancellation, and request-revision inputs and
  distinguishes success, invalid source, cancellation, unavailable service,
  unsupported profile/capability, resource exhaustion, and internal failure.
- **NL-V1-API-013:** Successful bridge validation may return a validated IR handle,
  source map, provenance, derivation, and resource facts. Non-success outcomes
  cannot expose recovered data as authoritative IR.
- **NL-V1-API-014:** `describeAuthoring` accepts the exact authoring profile
  tuple, including core/IR/descriptor profiles plus exact vocabulary semantic
  contracts and authoring-metadata profiles, and returns the descriptor
  catalogue and its identity without performing external I/O.
- **NL-V1-API-015:** Project source projection returns the complete ordered set
  of source units, element-to-source mappings, and canonical source-used
  vocabulary identities needed to form a `CapturedProjectRequest`; the host
  selects the matching exact semantic locks without parsing source. Host-owned
  identities and lock bytes remain explicit inputs. Root selection occurs only
  when an Editor or another consumer requests a view.
- **NL-V1-API-017:** `newProject` creates an empty authoring project from exact
  host-selected module/source identities, and `describeProject` derives the
  revision-bound project descriptor overlay. Neither operation performs
  acquisition or infers a module identity from a host path.
- **NL-V1-API-018:** Capture, compilation, IR validation, and view derivation use
  closed success/failure envelopes. Resource-exhausted, cancelled,
  unavailable-service, and internal-defect outcomes expose no authoritative
  partial object or envelope identity; requested artifacts appear only on a
  valid completed compilation.

## Authoring round trip

- **NL-V1-AUT-001:** The authoring profile describes and represents the complete
  retained v0 surface plus v1 modules, imports, aliases, visibility, qualified
  types, qualified value reuse, qualified references, repeated vocabulary
  requirements, `url`, and `path`.
- **NL-V1-AUT-002:** The authoring projection preserves every authoring-relevant
  distinction required by the inherited `NL-SRC-*`, `NL-DEC-*`, `NL-TYP-*`,
  `NL-VAL-*`, `NL-REF-*`, and `NL-PRO-*` contracts, plus declaration order and
  every comment position promised by the selected authoring profile.
- **NL-V1-AUT-003:** Importing a valid captured project and projecting it without
  semantic edits must produce source that recompiles to logically equal project
  IR, while preserving all authoring content the selected profile promises to
  round-trip.
- **NL-V1-AUT-004:** Source projection returns mappings for source units,
  headers, vocabulary requirements, imports, declarations, fields, properties,
  values, reuse edges, and reference edges at the narrowest stable authoring
  owner supported by the profile.
- **NL-V1-AUT-005:** Invalid or recovered source may produce bounded diagnostics
  and explicitly non-authoritative recovery information, but never an
  authoritative authoring project or IR.
- **NL-V1-AUT-006:** Unknown required authoring capabilities fail closed.
  Unknown optional opaque authoring metadata may be preserved without
  interpretation only when the profile marks it non-semantic.
- **NL-V1-AUT-007:** Adapter-owned projection and formatting determine Neutral
  spelling. Generic editors and consumers do not reconstruct tokens or grammar
  from display descriptors.
- **NL-V1-AUT-008:** The supported edit loop is catalogue discovery, authoring
  project creation or import, project-overlay derivation, direct editing of the
  public authoring data model, deterministic projection of `.neu` source units,
  construction of a captured-project request, core compilation, and mapping of
  returned diagnostics/evidence to authoring elements. The compiler never
  accepts the editor graph as semantic input.
- **NL-V1-AUT-009:** A generated project is authoritative only after its
  projected source units pass ordinary v1 capture and compilation. Successful
  UI preflight or source projection alone does not establish validity.

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
- **NL-V1-DIA-006:** Diagnostic messages, descriptor text, source excerpts, and
  remedies are untrusted bounded text and cannot disclose resolver credentials
  or unapproved host paths. Such host acquisition data is not supplied to core
  capture or compilation in the first place.
- **NL-V1-DIA-007:** Every required core and authoring diagnostic family has a
  named negative conformance case. Core cases never require installation of an
  authoring bridge; authoring cases name the exact compatible authoring profile.

## Consumer boundary evidence

- **NL-V1-CNS-001:** A generic data-vocabulary fixture proves that the core
  resolves exact captured vocabulary contracts and exposes their data through
  public reader APIs without interpreting application behavior.
- **NL-V1-CNS-002:** Future Flow vocabularies are ordinary data-only inputs to
  this core mechanism. Their mapping, graph validation, normalization, planning,
  provider compatibility, authorization, binding, execution, and runtime state
  remain Flow-owned behavior.
- **NL-V1-CNS-003:** An Editor boundary fixture discovers the profile and
  descriptors, imports a multi-module project, edits every retained and new
  construct, projects all source units, validates them, maps diagnostics, and
  reopens the result using only public language services.
- **NL-V1-CNS-004:** The Editor fixture reuses the inherited v0 editor corpus and
  adds v1 cases for imports, visibility, qualification, missing project
  dependencies, stale validation results, and unknown required capabilities.
- **NL-V1-CNS-005:** A future Flow authoring package may use ordinary
  vocabulary schemas, conventions, and non-semantic presentation hints to
  produce Editor cards. Flow interpretation and system/provider mapping consume
  compiled IR outside Neutral language and outside the generic Editor engine.

## Compatibility and conformance

- **NL-V1-EVO-001:** v0.1 and v1.0 are distinct explicit profiles. A v1
  compiler does not reinterpret `neu "0.1"` source under v1 rules.
- **NL-V1-EVO-002:** Any migration service is explicit, versioned, and returns
  a reviewable source-to-source result; compilation never migrates implicitly.
- **NL-V1-EVO-003:** Conformance includes positive, negative, ambiguity,
  multi-file, visibility, cycle, determinism, resource, malformed-IR,
  authoring-round-trip, and adversarial fixtures.
- **NL-V1-EVO-004:** At least one generic multi-file/core-vocabulary probe and
  one Editor authoring probe use only public contracts.
- **NL-V1-EVO-005:** Compiler, reader, IR, authoring, and adapter protocol
  compatibility windows are advertised independently. Unsupported old or future
  profiles fail explicitly rather than being guessed from a language version.

## Explicit exclusions

v1 does not include package management, filesystem imports, version solving,
partial modules, wildcard imports, re-exports, visibility tiers, expressions,
functions, control flow, mutation, macros, templates, secrets, commands,
workflow primitives, runtime effects, executable plugins, or automatic
migration.
