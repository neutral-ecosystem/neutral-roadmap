# Neutral Editor v0 compliance requirements

Status: proposed editor conformance contract

## 1. Purpose and authority

Neutral Editor v0 is conformant only when it can visually author the complete
Neutral language v1 surface exposed by an exact compatible Neutral authoring v1
profile, including a captured project with multiple `.neu` source units and one
logical module per source unit.

The authoritative language requirements are the proposed
[Neutral v1 requirements](../../neutral-lang/v1/design/REQUIREMENTS.md), which
inherit the released
[v0 requirements](../../neutral-lang/v0/portable/specs/REQUIREMENTS.md) by
reference. This document
defines what the editor must do to support and preserve those contracts. It
does not redefine Neutral syntax or semantics.

Language conformance and editor conformance are different claims:

- `neutral-lang` proves that source compiles to valid Neutral IR.
- Neutral Editor proves that its discovered language profile can represent,
  edit, project, validate, save, and reopen every accepted v0 construct without
  changing its meaning or accepting excluded behavior.

## 2. Capability discovery

- **ED-CAP-001:** On startup and when opening a project, the editor must query a
  versioned Neutral language adapter for installed language versions and
  capabilities.
- **ED-CAP-002:** The editor must not infer features from a version string or
  hard-code `0.1`, the v0 type set, grammar constructs, vocabulary support,
  document limits, or compatibility rules in the generic UI.
- **ED-CAP-003:** A discovered capability profile must identify exact core, IR,
  authoring, and descriptor-schema profiles, supported project shape, captured
  input requirements, operations, diagnostic mapping, structural limits, and
  required capability IDs.
- **ED-CAP-004:** The palette, inspector, connection preflight, source
  projection, and available commands must be built from the selected capability
  profile or delegated to its adapter.
- **ED-CAP-005:** A project selects one exact available language profile. An
  unavailable or incompatible profile opens in an explicit unresolved/read-only
  state and is never silently substituted.
- **ED-CAP-006:** Unknown required capabilities fail closed. Unknown optional UI
  hints may be preserved and ignored.
- **ED-CAP-007:** Any core, authoring, descriptor-schema, or captured-vocabulary
  profile change invalidates derived descriptors and cached
  validation; they never rewrite the open project without an explicit,
  separately specified migration.
- **ED-CAP-008:** The editor must request a bounded descriptor catalogue for the
  exact selected profile tuple and build its palette, cards, ports, properties,
  nesting controls, and commands from that catalogue.
- **ED-CAP-009:** Descriptor identities are qualified by canonical owner.
  Collisions, incompatible duplicates, and unknown required descriptor fields
  fail closed; optional non-semantic hints may be preserved and ignored.

## 3. Document and navigation scope

- **ED-DOC-001:** The workspace represents the complete finite set of `.neu`
  source units and logical modules reported by the selected profile.
- **ED-DOC-002:** The editor must author the exact language header, module
  header, vocabulary requirements, imports and aliases, visibility, record
  declarations, and binding declarations allowed by the profile.
- **ED-DOC-003:** Project and module navigation must use logical identities and
  must not derive language identity or import meaning from a host path, tab
  order, or canvas location.
- **ED-DOC-004:** A context stack and breadcrumbs expose project, module, and
  nested-value contexts without creating namespaces, partial modules, or other
  unadvertised language semantics.
- **ED-DOC-005:** Nested **values** are required now. Users must be able to edit
  contextual records and lists recursively to the nesting limit reported by
  the language profile. This is distinct from future nested document editing.

## 4. Complete selected Neutral authoring surface

### Source and names

- **ED-AUT-001:** Project import must accept every encoding/newline form accepted
  by the selected profile through its adapter. Generated source must use UTF-8,
  canonical headers, reference formatting, and original-byte span accounting
  supplied by that adapter.
- **ED-AUT-002:** The editor must import, visually represent, edit, and
  deterministically project line and non-nesting block comments at all legal v0
  positions. It must never treat comments as logical documentation or behavior.
- **ED-AUT-003:** Identifier controls must obtain category constraints and
  protected names from the capability profile and surface compiler diagnostics
  without inventing alternate normalization.
- **ED-AUT-004:** The generic UI must not offer semicolons, member access,
  filesystem import paths, or unadvertised qualification forms.

### Declarations and resolution

- **ED-AUT-005:** Users can create private-by-default or explicitly public,
  immutable, explicitly typed bindings without mutation, reassignment, or
  override.
- **ED-AUT-006:** Users can create nominal record declarations with ordered,
  uniquely named, explicitly typed fields and optional closed-constant defaults.
- **ED-AUT-007:** Declaration order must not restrict forward value reuse or
  forward `ref(name)` selection. The compiler remains authoritative for
  duplicates, protected names, wrong-kind targets, and cycles.
- **ED-AUT-008:** Ordinary value reuse and `ref(name)` must be distinct visual
  operations and distinct semantic connection kinds.
- **ED-AUT-025:** Users can create source units, logical modules, explicit
  imports and aliases, vocabulary requirements, and qualified cross-module
  reuse/reference edges wherever the selected profile permits them.
- **ED-AUT-026:** Public-surface preflight must distinguish ordinary private
  value reuse from an exposed identity reference. A `Ref<T>` nested anywhere in
  a public value may target only a public binding, subject to authoritative
  compiler validation.

### Types

- **ED-AUT-009:** The discovered v1 type palette must represent `num`, `string`,
  `bool`, `url`, `path`, local and qualified nominal records, `T?`, `List<T>`,
  `Ref<T>`, and discovered vocabulary-owned types.
- **ED-AUT-010:** Nested type constructors must preserve exact argument identity
  and invariance. The editor must not apply implicit conversions beyond
  compatibility advertised by the language adapter.
- **ED-AUT-011:** Record-recursion feedback must distinguish a direct nominal
  cycle from a cycle crossing `Ref<T>` and defer the final result to the
  compiler.
- **ED-AUT-012:** Maps, sets, tuples, unions, enums, user generics, functions,
  and other unadvertised types must not appear as available v0 constructs.

### Values

- **ED-AUT-013:** The editor must represent exact `num` text without converting
  through a JavaScript or Rust floating-point value.
- **ED-AUT-014:** The editor must represent strings with adapter-compatible
  escaping, Booleans, and `null` only under a nullable expected type.
- **ED-AUT-015:** The editor must recursively represent contextual nominal
  record values, explicit field/value pairs, ordered homogeneous lists, and
  typed empty lists.
- **ED-AUT-016:** Required/defaulted and nullable/non-nullable fields remain
  independent states. Omitting a defaulted field is not represented as an
  explicit `null`.
- **ED-AUT-017:** Record defaults support only the closed constant value forms
  advertised by the profile. Binding reuse and references are unavailable in a
  default editor and rejected authoritatively by the compiler.
- **ED-AUT-018:** The editor must preserve the difference between an explicit
  value, ordinary value reuse, a record default, and a vocabulary default so
  compiler provenance can be presented without changing the logical value.

### Captured vocabulary data

- **ED-AUT-019:** The editor must discover zero or more exact captured
  vocabularies through the language adapter and must not search ambient paths
  or networks on behalf of source.
- **ED-AUT-020:** Captured vocabulary schemas may add nominal data shapes,
  closed defaults, required structural features, and bounded non-semantic
  presentation hints only.
- **ED-AUT-021:** Vocabulary-owned values use the same generic record/value
  editors as core nominal data. No executable nodes, scripts, callbacks, custom
  validators, or native UI modules are loaded.
- **ED-AUT-022:** Missing, mismatched, invalid, or structurally unsupported
  vocabulary input is preserved and reported rather than replaced or dropped.
- **ED-AUT-023:** A generated card is an authoring projection of language or
  vocabulary data. The Editor must not present its existence as proof of a
  Neutral function, command, event, workflow step, or executable behavior.
- **ED-AUT-024:** Future Flow cards are supplied through ordinary vocabulary
  schemas and conventions. Flow interpretation and system/provider mapping are
  outside the generic Editor and Neutral language.

## 5. Projection, import, and validation

- **ED-VAL-001:** The selected language adapter must provide or identify a
  version-matched authoring projection. The generic editor must not contain a
  handwritten Neutral parser or formatter.
- **ED-VAL-002:** Every graph state accepted for projection must produce the
  complete deterministic set of `.neu` source units representing the same
  modules, imports, declarations, types, values, reuse edges, references, and
  vocabulary data.
- **ED-VAL-003:** Opening an existing valid Neutral v1 captured project requires an
  adapter-provided editor projection or another public, versioned authoring API.
  Compiler-private AST/recovery types must not become persisted editor records.
- **ED-VAL-004:** If the selected adapter cannot import source, the editor may
  create and reopen editor projects but must advertise source import as
  unavailable; full Neutral Editor v0 conformance remains incomplete.
- **ED-VAL-005:** Each projected declaration, field, property, value, reuse
  edge, and reference must have an editor-element-to-generated-source mapping
  sufficient to place diagnostics at the narrowest stable owner.
- **ED-VAL-006:** Validation forms a versioned `CapturedProjectRequest` from the
  exact projected source bytes, logical source/module identities, exact
  vocabulary semantic locks, exact core profile, and capture-contract version.
  Limits, cancellation, and editor revision accompany processing separately;
  root/export selection is a later view request.
- **ED-VAL-007:** Validation is authoritative only on complete compiler success.
  Invalid, cancelled, unavailable, and internal-failure outcomes remain distinct.
- **ED-VAL-008:** Stale results must not replace diagnostics or validated state
  for a newer editor revision.
- **ED-VAL-009:** Frontend connection and form checks are interaction preflight
  derived from discovered capabilities; compiler diagnostics always govern.
- **ED-VAL-010:** The editor must display stable diagnostic code, severity,
  message, primary/related locations, remedy, and truncation state when supplied.
- **ED-VAL-011:** The editor must never execute source, treat successful
  validation as authorization, or infer runtime behavior from references.
- **ED-VAL-012:** The compiler receives projected source units, never the editor
  graph. Source projection and UI preflight are non-authoritative until normal
  v1 capture and compilation succeed.
- **ED-VAL-013:** The vocabulary semantic locks must exactly cover the distinct
  vocabulary identities required by projected source. The Editor must not add
  unused locks or silently repair missing, duplicate, or conflicting locks.

## 6. Editor behavior and persistence

- **ED-UX-001:** Add, remove, connect, disconnect, reorder, property edit,
  nested-value edit, and completed move operations are undoable and redoable.
- **ED-UX-002:** One drag or one committed nested-value edit creates at most one
  undo entry.
- **ED-UX-003:** Core actions are available without drag-and-drop alone.
- **ED-UX-004:** Nodes, connections, nested editors, and Problems entries expose
  accessible names, selection state, visible focus, and keyboard operation.
- **ED-UX-005:** The root graph supports pan, zoom, box selection,
  multi-selection, fit view, and zoom to a diagnostic owner.
- **ED-PER-001:** The editor project format is versioned independently and
  records the exact core/authoring/descriptor profile tuple, logical source and
  module identities, captured vocabulary requirements, semantic authoring
  model, and presentation metadata.
- **ED-PER-002:** Save/reopen preserves stable editor IDs, declaration order,
  values, reuse/reference distinctions, nested values, comments supported by
  the projection, presentation state, and unknown project fields.
- **ED-PER-003:** Save does not replace an existing project until encoding and
  validation of the new project document succeed.
- **ED-PER-004:** Unsupported project or language capability versions open
  read-only or fail without modifying the original input.

## 7. Quality, security, and limits

- **ED-QLT-001:** The editor must pass every inherited v0 and positive v1 delta fixture through
  source import, visual representation, no-op projection, compilation, and
  logical-IR equivalence where the required adapter APIs exist.
- **ED-QLT-002:** Every negative and misleading-lookalike fixture must remain
  rejected with its expected compiler diagnostic; the editor must not repair it
  silently into a different valid program.
- **ED-QLT-003:** Formatting-only and presentation-only changes preserve logical
  IR while refreshing source mappings as required.
- **ED-QLT-004:** The reference workload covers nested records/lists and at
  least 50 visible nodes and 100 connections, with recorded interaction,
  projection, import, and validation timings on named hardware.
- **ED-QLT-005:** Pointer movement, pan, zoom, and node drag do not invoke the
  desktop host or language adapter.
- **ED-SEC-001:** Project, capability, descriptor, source, vocabulary,
  diagnostic, and adapter messages are untrusted and decoded under explicit
  byte, nesting, declaration, node, connection, list, numeric, string, and
  diagnostic limits.
- **ED-SEC-002:** Descriptor and diagnostic text cannot execute script, inject
  unsanitized HTML, disclose captured credentials, or grant host authority.
- **ED-SEC-003:** Desktop capabilities grant only the project-file and
  language-adapter operations required by the active window.

## 8. Neutral language v1 coverage matrix

The v1 requirements inherit v0 by reference, so this matrix maps only the v1
delta and the bridge boundary instead of copying the v0 surface.

| Neutral v1 requirements | Editor compliance obligation |
| --- | --- |
| `NL-V1-BASE-*`, `NL-V1-EVO-*` | Select exact profiles, reuse the inherited v0 corpus, add v1 delta evidence, and never migrate implicitly. |
| `NL-V1-CAP-*`, `NL-V1-ID-*` | Build an explicit captured-project request; keep host locations, logical identities, roots, derivations, and artifacts distinct. |
| `NL-V1-MOD-*`, `NL-V1-VIS-*`, `NL-V1-XMOD-*` | Author and navigate modules, aliases, visibility, qualified types/reuse/references, SCC imports, and public-surface diagnostics. |
| `NL-V1-VOC-*`, `NL-V1-LOC-*` | Represent multiple exact data-only vocabularies and inert `url`/`path` values without acquisition or execution. |
| `NL-V1-IR-*`, `NL-V1-DIA-*` | Never emit IR; consume authoritative results and map cross-source diagnostics/evidence without changing meaning. |
| `NL-V1-BRG-*`, `NL-V1-API-*`, `NL-V1-AUT-*` | Discover the exact descriptor catalogue, generate generic UI, round-trip all source units, and compile projected source through public APIs. |
| `NL-V1-CNS-*` | Prove the generic vocabulary and Editor boundary fixtures; keep Flow meaning and provider mapping outside Neutral and the Editor engine. |
| Explicit v1 exclusions | Do not expose unadvertised functions, control flow, mutation, effects, executable plugins, filesystem/URL imports, package solving, or IR rewriting. |

## 9. Completion rule

Neutral Editor v0 is complete only when:

1. every `ED-*` requirement has evidence;
2. every upstream `NL-*` requirement maps to passing editor evidence or an
   explicit boundary test proving it remains compiler-owned;
3. the inherited Neutral v0 corpus and complete v1 delta/authoring corpus pass
   through the editor compliance harness;
4. capability discovery, rather than generic UI constants, determines the
   active language surface; and
5. a future Flow vocabulary can generate generic data cards while Flow
   interpretation and provider mapping remain outside the Editor engine.
