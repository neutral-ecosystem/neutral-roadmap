# Neutral Editor v0 compliance requirements

Status: proposed editor conformance contract

## 1. Purpose and authority

Neutral Editor v0 is conformant only when it can visually author the complete
accepted Neutral language v0 surface for exactly one captured `.neu` source
unit containing exactly one logical module.

The authoritative language requirements are
[`neutral-lang/REQUIREMENTS.md`](../../neutral-lang/REQUIREMENTS.md), the
accepted [v0 decisions](../../neutral-lang/v0/decisions/README.md), and the
[v0 syntax checklist](../../neutral-lang/v0/syntax-checklist.md), with evidence
from the [v0 fixtures](../../neutral-lang/v0/fixtures/README.md). This document
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
- **ED-CAP-003:** A discovered capability profile must identify its language
  version, profile version, supported document shape, authoring constructs,
  type constructors, value forms, validation/formatting operations, diagnostic
  mapping, captured-input requirements, structural limits, and optional
  vocabulary behavior.
- **ED-CAP-004:** The palette, inspector, connection preflight, source
  projection, and available commands must be built from the selected capability
  profile or delegated to its adapter.
- **ED-CAP-005:** A project selects one exact available language profile. An
  unavailable or incompatible profile opens in an explicit unresolved/read-only
  state and is never silently substituted.
- **ED-CAP-006:** Unknown required capabilities fail closed. Unknown optional UI
  hints may be preserved and ignored.
- **ED-CAP-007:** Capability changes invalidate derived descriptors and cached
  validation; they never rewrite the open project without an explicit,
  separately specified migration.

For the Neutral v0 profile, discovery must report one source unit and one module
as limits. Those values come from the adapter capability response, not generic
editor constants.

## 3. Document and navigation scope

- **ED-DOC-001:** The v0 workspace owns exactly one captured `.neu` source unit
  and one logical module because the selected language profile reports that
  shape.
- **ED-DOC-002:** The editor must author the exact language header, module
  header, zero or one vocabulary requirement, record declarations, and binding
  declarations allowed by the profile.
- **ED-DOC-003:** All declarations are module-root declarations and exported;
  the editor must not expose namespaces, visibility, module imports, multiple
  source units, or module merge controls for this profile.
- **ED-DOC-004:** The editor architecture may use a document-context stack and
  breadcrumbs so later profiles can expose nested documents, modules, or
  subgraphs. Neutral v0 exposes only the root context; dormant navigation must
  not create hidden v0 semantics.
- **ED-DOC-005:** Nested **values** are required now. Users must be able to edit
  contextual records and lists recursively to the nesting limit reported by
  the language profile. This is distinct from future nested document editing.

## 4. Complete Neutral v0 authoring surface

### Source and names

- **ED-AUT-001:** Source import must accept every encoding/newline form accepted
  by the selected profile through its adapter. Generated source must use UTF-8,
  canonical v0 headers, reference formatting, and original-byte span accounting
  supplied by that adapter.
- **ED-AUT-002:** The editor must import, visually represent, edit, and
  deterministically project line and non-nesting block comments at all legal v0
  positions. It must never treat comments as logical documentation or behavior.
- **ED-AUT-003:** Identifier controls must obtain category constraints and
  protected names from the capability profile and surface compiler diagnostics
  without inventing alternate normalization.
- **ED-AUT-004:** The generic UI must not offer semicolons, member access,
  module paths, or unadvertised qualification forms.

### Declarations and resolution

- **ED-AUT-005:** Users can create immutable, explicitly typed bindings without
  mutation, reassignment, override, or visibility controls.
- **ED-AUT-006:** Users can create nominal record declarations with ordered,
  uniquely named, explicitly typed fields and optional closed-constant defaults.
- **ED-AUT-007:** Declaration order must not restrict forward value reuse or
  forward `ref(name)` selection. The compiler remains authoritative for
  duplicates, protected names, wrong-kind targets, and cycles.
- **ED-AUT-008:** Ordinary value reuse and `ref(name)` must be distinct visual
  operations and distinct semantic connection kinds.

### Types

- **ED-AUT-009:** The discovered v0 type palette must represent `num`, `string`,
  `bool`, nominal user records, `T?`, `List<T>`, `Ref<T>`, and discovered
  `Vocabulary::Type` names.
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

- **ED-AUT-019:** The editor must discover zero or one exact captured
  vocabulary through the language adapter and must not search ambient paths or
  networks on behalf of source.
- **ED-AUT-020:** Discovered v0 vocabulary metadata may add nominal data types,
  fields, closed defaults, and required structural features only.
- **ED-AUT-021:** Vocabulary-owned values use the same generic record/value
  editors as core nominal data. No executable nodes, scripts, callbacks, custom
  validators, or native UI modules are loaded.
- **ED-AUT-022:** Missing, mismatched, invalid, or structurally unsupported
  vocabulary input is preserved and reported rather than replaced or dropped.

## 5. Projection, import, and validation

- **ED-VAL-001:** The selected language adapter must provide or identify a
  version-matched authoring projection. The generic editor must not contain a
  handwritten Neutral v0 parser or formatter.
- **ED-VAL-002:** Every graph state accepted for projection must produce one
  deterministic `.neu` source unit representing the same declarations, types,
  values, reuse edges, references, and vocabulary data.
- **ED-VAL-003:** Opening an existing valid Neutral v0 source file requires an
  adapter-provided editor projection or another public, versioned authoring API.
  Compiler-private AST/recovery types must not become persisted editor records.
- **ED-VAL-004:** If the selected adapter cannot import source, the editor may
  create and reopen editor projects but must advertise source import as
  unavailable; full Neutral Editor v0 conformance remains incomplete.
- **ED-VAL-005:** Each projected declaration, field, property, value, reuse
  edge, and reference must have an editor-element-to-generated-source mapping
  sufficient to place diagnostics at the narrowest stable owner.
- **ED-VAL-006:** Validation requests include the exact source bytes, logical
  source identity, exact optional vocabulary capture, behavior/profile
  versions, limits, cancellation, and editor revision required by the adapter.
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
  records the exact language capability profile, source identity, captured
  vocabulary requirement, semantic authoring model, and presentation metadata.
- **ED-PER-002:** Save/reopen preserves stable editor IDs, declaration order,
  values, reuse/reference distinctions, nested values, comments supported by
  the projection, presentation state, and unknown project fields.
- **ED-PER-003:** Save does not replace an existing project until encoding and
  validation of the new project document succeed.
- **ED-PER-004:** Unsupported project or language capability versions open
  read-only or fail without modifying the original input.

## 7. Quality, security, and limits

- **ED-QLT-001:** The editor must pass every positive Neutral v0 fixture through
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

## 8. Neutral language v0 coverage matrix

Every individual upstream ID in a listed range is covered by the row. A row is
not complete until its editor obligations have automated or recorded evidence.

| Neutral requirements | Editor compliance obligation |
| --- | --- |
| `NL-V0-001..003` | Present all declarations, types, values, references, vocabulary data, provenance, and mapped diagnostics without assigning application or runtime meaning. |
| `NL-BND-001..005` | Keep source, editor model, compiler-private models, Neutral IR, and view state distinct; never emit or transform IR. |
| `NL-CAP-001..006` | Edit one discovered source/module profile; pass explicit captured inputs and resolver decisions through the adapter without ambient lookup or disclosure. |
| `NL-SRC-001..007` | Import/project UTF-8, spans, layout, comments, identifiers, qualification, delimiters, and literals through versioned adapter behavior; expose no excluded syntax. |
| `NL-DOC-001..005` | Represent exact headers, optional vocabulary use, root records/bindings, universal export, and the absence of namespaces/imports/multi-unit merge. |
| `NL-DEC-001..007` | Represent immutable typed declarations, forward reuse/reference selection, duplicate/protected-name diagnostics, and value-cycle rejection. |
| `NL-TYP-001..008` | Represent every v0 scalar/composite/nominal/reference/vocabulary type and preserve exact compatibility, nullability, invariance, and exclusions. |
| `NL-VAL-001..008` | Represent fields, contextual nested records, ordered homogeneous lists, defaults, omission, nullability, exact literals, and ordinary immutable reuse. |
| `NL-REF-001..005` | Represent only `ref(name)` identity links, preserve target kind/type checks, and never treat graph-local element IDs as durable or behavioral. |
| `NL-VOC-001..007` | Use the exact captured data-only vocabulary contract, generic data editors, required-feature checks, and no executable extension behavior. |
| `NL-IR-001..006` | Treat successful immutable IR as compiler output only; preserve distinctions among logical meaning, envelopes, identities, and encoded bytes. |
| `NL-PRO-001..005` | Map source spans; present explicit/reuse/default provenance; preserve derivation input partitions; and invalidate stale source maps after formatting or projection changes. |
| `NL-API-001..005` | Integrate only through documented capture/compile/reader/validation or editor-authoring APIs; respect cancellation, bounds, and the absence of public AST/IR rewriting. |
| `NL-DIA-001..006` | Render stable bounded diagnostics safely, preserve canonical ordering, distinguish recovery from success, and enforce advertised resource limits. |
| Required documentation/evidence | Run the upstream positive, negative, ambiguity, numeric, vocabulary, resource, determinism, source-map, provenance, and adversarial corpus through the editor compliance harness. |
| Explicit v0 non-features | Do not expose namespaces, visibility, multiple units, imports, secrets, member/static selection, operators, functions, mutation, macros, unsupported collections, executable plugins, effects, or IR migration. |

The accepted syntax decision/checklist coverage is independently traceable:

| Neutral syntax decisions | Editor compliance obligation |
| --- | --- |
| `SYN-GOV-001..004` | Preserve representation/lowering boundaries, acceptance-without-authority, and end-to-end editor evidence. |
| `SYN-LEX-001..006` | Import and project accepted encoding, spans, layout, comments, identifier categories, qualification, delimiters, strings, scalars, and `null`. |
| `SYN-DOC-001..004` | Represent the discovered exact header, one source/module, optional captured vocabulary, and root declarations/universal export. |
| `SYN-DEC-001..005` | Represent immutable explicit declarations, exclude mutation, preserve duplicates/protected-name diagnostics, and allow forward resolution while detecting cycles. |
| `SYN-TYP-001..007` | Represent exact scalars/numbers, nominal recursion, lists, nullability/defaults, references/compatibility, and vocabulary-owned nominal types. |
| `SYN-VAL-001..006` | Represent all literal/nested/list/reuse value forms and provenance while excluding shorthand/member/static access. |
| `SYN-REF-001..004` | Represent `ref(name)`, target/type validation, identity-only semantics, and document-local IDs. |
| `SYN-VOC-001..005` | Discover and preserve the exact closed data-only vocabulary and its diagnostics without execution. |
| `SYN-DIA-001..002` | Render stable bounded diagnostics and satisfy complete-example obligations. |
| `SYN-TOL-001` | Preserve non-semantic comments and use adapter-owned stable formatting. |
| `SYN-EVO-001..002` | Select versioned grammar/token capabilities and prove source-to-IR/reader conformance through the editor harness. |

## 9. Completion rule

Neutral Editor v0 is complete only when:

1. every `ED-*` requirement has evidence;
2. every upstream `NL-*` requirement maps to passing editor evidence or an
   explicit boundary test proving it remains compiler-owned;
3. the complete Neutral v0 fixture corpus passes through the editor compliance
   harness;
4. capability discovery, rather than generic UI constants, determines the
   active language surface; and
5. unsupported future nested documents/modules remain preserved architectural
   capacity, not accepted v0 behavior.
