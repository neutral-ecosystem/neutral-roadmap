# Neutral language and IR: needed features

Status: discovery source for future version checklists

Scope: logical capabilities and documentation obligations only. This document
does not define `.neu` syntax, a concrete type system, an expression language,
an IR encoding, compiler implementation, or release allocation.

## 1. Purpose

Neutral is a domain-independent abstraction language and tool-building common
ground. `neutral-lang` compiles `.neu` source into Neutral IR. `neutral-flow`
and `neux` are separate applications that consume that IR and assign their own
domain meaning:

```text
.neu source -> neutral-lang -> Neutral IR -> neutral-flow -> CI/CD systems
                                      \
                                       -> neux -> GNU/Linux OS
```

A future Flow GUI transcribes to `.neu` and follows the same compiler path. It
does not emit Neutral IR itself and does not introduce a private Flow language.

This document derives the language, compiler, IR, and API capabilities needed
to support the eventual Neutral Flow problem space described by
[Neutral Flow requirements](../neutral-flow/REQUIREMENTS.md) and
[architecture](../neutral-flow/ARCHITECTURE.md). It deliberately asks what
information Flow needs to receive, not which CI/CD features should become
Neutral keywords.

The statements have stable discovery identifiers so later checklists can cite
them. They are not checkboxes and are not assigned to v0, v1, or v2 here.

## 2. Architectural boundary

### Neutral owns

- `.neu` source rules and compiler behavior;
- source discovery through explicit resolver contracts;
- names, scopes, declarations, references, values, composition, and symbolic
  structure that are justified across domains;
- compiler diagnostics and source provenance;
- generation, validation, versioning, and safe consumption of Neutral IR; and
- the derivation evidence connecting captured source to generated IR.

### Neutral Flow owns

- the interpretation of selected IR structures as CI/CD workflow intent;
- pipeline graph rules, readiness, conditions, result propagation, and planning;
- required target capabilities and portability decisions;
- provider bindings and provider extensions;
- execution requests, triggers, scheduling, attempts, retries, timeouts,
  cancellation, reconciliation, and tombstones;
- identity, policy, authorization, credential handover, and secret delivery;
- artifacts, evidence, deployment, audit, telemetry, and runtime history; and
- all remote effects.

### Neux owns

- the interpretation of selected IR structures as OS-specific operations;
- GNU/Linux command and environment behavior; and
- OS execution, observation, error, and compatibility rules.

### Boundary rules

- **NL-BND-001:** Neutral IR is compiler output, not a Flow logical plan, bound
  plan, provider configuration, runtime record, or Neux execution plan.
- **NL-BND-002:** Neutral core concepts require cross-domain justification.
  Flow-only or Neux-only concepts remain in a versioned domain vocabulary.
- **NL-BND-003:** Build, test, cache, retry, runner, artifact, deploy, shell,
  process, file descriptor, and package-manager behavior are not intrinsic
  Neutral operations.
- **NL-BND-004:** The compiler preserves vocabulary-owned typed declarations but does not assign
  their application behavior or prove their external effects.
- **NL-BND-005:** The compiler core and IR inspection perform no CI/CD, OS,
  credential, deployment, or other application effect and make no implicit
  network access. Source acquisition occurs only through the explicitly supplied
  resolver boundary.
- **NL-BND-006:** A consumer may normalize Neutral IR into a private domain
  model, but that model must not be presented as another ecosystem-wide IR.
- **NL-BND-007:** A consumer never reparses `.neu` to recover information the IR
  contract omitted. Required consumer information must be in the IR or its
  derivation/source-map records.
- **NL-BND-008:** Neutral does not promise that two consumers interpret a domain
  vocabulary identically unless that vocabulary has an explicit owner and
  conformance contract.

## 3. Required artifacts and identities

The API needs distinct records because each has a different meaning and
lifecycle.

| Artifact | Required meaning |
| --- | --- |
| Source unit | Immutable captured bytes, logical name, media/encoding facts, and origin supplied by a resolver. |
| Source closure | Complete set of source units and immutable dependencies used by one compilation. |
| Compilation request | Root source, selected domain profiles, compiler options, feature policy, and resolver configuration. |
| Diagnostic set | Structured findings tied to source and, when applicable, IR elements. |
| Source map | Relationship from IR elements and generated structure back to source spans and expansion origins. |
| Neutral IR document | Versioned, immutable compiler output containing core structure plus declared domain data. |
| Derivation manifest | Source closure, compiler identity, options, profiles, dependencies, source-map identity, and IR identity. |
| Capability declaration | Machine-readable statement of the compiler, IR, profile, or consumer features supported or required. |

- **NL-ID-001:** Every artifact type has an identity distinct from a path, URL,
  mutable tag, display name, or database identifier.
- **NL-ID-002:** Neutral IR identity binds the complete compiler derivation; two
  identical-looking IR payloads compiled from materially different derivations
  are not silently treated as the same historical claim.
- **NL-ID-003:** Content identity, structural equality, semantic equivalence,
  and record identity are separate contracts.
- **NL-ID-004:** Any reproducible content identity names its canonicalization
  rules, encoding version, and digest algorithm.
- **NL-ID-005:** A source closure records every decision-affecting source,
  imported declaration, profile/schema, compiler option, and resolver result by
  immutable content or immutable reference.
- **NL-ID-006:** Recompilation against mutable current dependencies is visibly
  different from replaying a captured derivation.
- **NL-ID-007:** Derived and generated elements have stable identities within an
  IR document and retain their origin chain.

## 4. Source acquisition and compilation inputs

- **NL-SRC-001:** Compilation starts from an explicit root source and resolver;
  it does not search ambient directories or networks by accident.
- **NL-SRC-002:** The resolver returns captured content plus origin and integrity
  facts, not only a mutable location.
- **NL-SRC-003:** Relative resolution, import precedence, aliasing, cycles, and
  duplicate-content behavior are deterministic and documented.
- **NL-SRC-004:** A compilation can operate entirely from a supplied captured
  source closure for reproducible and disconnected use.
- **NL-SRC-005:** The compiler reports the complete source closure it actually
  used, including transitive imports and domain-profile definitions.
- **NL-SRC-006:** Source encoding, line-ending, Unicode normalization, and
  invalid-text handling are explicit.
- **NL-SRC-007:** Source and dependency size, depth, count, and expansion limits
  are configurable and fail with bounded diagnostics.
- **NL-SRC-008:** Resolver authentication and package acquisition, if provided,
  are separate tooling concerns; credentials never enter the IR or derivation
  manifest.
- **NL-SRC-009:** An editor or GUI may supply unsaved in-memory source units
  through the same resolver abstraction without changing compiler meaning.
- **NL-SRC-010:** Every unit in one v0 compilation closure declares the same
  exact language-behavior version. Multiple units may merge into one logical
  module deterministically only within one captured package identity; duplicate
  names are errors and unit order has no semantic meaning. Vocabulary uses
  remain unit-scoped, and equal use names in units of the same module must
  resolve to the same captured bundle.

## 5. Names, scopes, declarations, and references

- **NL-NAM-001:** Important declarations and generated elements have explicit,
  stable identities independent of display labels.
- **NL-NAM-002:** Scope, visibility, qualification, shadowing, and collision
  rules are deterministic. In v0 source, `::` is reserved for namespaces in the
  current module or vocabulary qualification; v0 `.` selects only a vocabulary-owned enum case
  or static member and is not general value member access.
- **NL-NAM-003:** `ref(...)` targets only value bindings and is represented as a
  resolved symbolic link to binding identity, never as text a consumer must
  parse heuristically. Types, records, namespaces, modules, and vocabulary
  namespaces are invalid targets.
- **NL-NAM-004:** Unresolved, ambiguous, inaccessible, and wrong-kind references
  produce distinct diagnostics; static ordinary-value dependency cycles are
  diagnosed separately from valid identity-reference-only cycles.
- **NL-NAM-004A:** Symbol collection precedes value and identity-reference
  resolution. An ordinary binding name uses its immutable logical value in any
  compatible field, list, or binding position; `ref(...)` instead links the
  declaration identity. Both may target later immutable bindings, while only
  ordinary value uses contribute to static dependency-cycle detection.
- **NL-NAM-005:** References can target value bindings in another captured
  source unit of the same merged module without losing the target's immutable
  identity. v0 has no module-qualified or cross-module source access.
- **NL-NAM-006:** Renaming and aliasing preserve an inspectable origin and never
  create two authoritative identities accidentally.
- **NL-NAM-007:** Consumers can enumerate declarations and relationships without
  implementing the language's name-resolution algorithm.
- **NL-NAM-008:** Human-readable names remain available for diagnostics and
  visualization even when stable machine identities differ.
- **NL-NAM-009:** Author-facing names use an intentional category split:
  `snake_case` for bindings, fields, namespaces, module names, and static
  values; `UpperCamelCase` style for record/types and vocabulary namespaces.
  The compiler enforces only an uppercase-leading lexical class for the latter,
  because machine recognition of word boundaries would be subjective. External
  display names and immutable package/schema identities are not rewritten to
  imitate source names.
- **NL-NAM-010:** Predeclared core type names are protected from declaration or
  shadowing in every scope.
- **NL-NAM-011:** Every nominal recursive record cycle is rejected unless each
  route around the cycle crosses `Ref<T>`; nullable and collection containment
  do not break recursion.
- **NL-NAM-012:** Static `.` selection resolves only when its left side is a
  vocabulary-owned type that declares the named inert static value. User-defined
  records cannot acquire static members in v0.
- **NL-NAM-013:** All v0 bindings are immutable and initialized once. v0 has no
  mutation or reassignment syntax, and declaration order is non-semantic after
  required headers. Mutation remains future-only unless real Flow and Neux
  evidence shows immutable composition or explicit overriding is insufficient.
- **NL-NAM-014:** v0 module headers contain one `snake_case` identifier. A
  compilation request contains units for one logical module/package identity;
  `::` never encodes a module path.
- **NL-NAM-015:** Records, bindings, and namespaces are private by default and
  may be exported with `pub`. Public nested declarations require public
  containers; public exposed type signatures and identity links cannot expose private
  declarations. Visibility controls the IR/documentation surface, not secrecy,
  authority, or execution permission.

These capabilities let Flow derive named work and dependency relationships, but
Neutral does not decide that a declaration is a job or that a reference is a
readiness edge.

## 6. General structural model

- **NL-STR-001:** IR can represent nested, ordered, and unordered structures
  without using source-text order as an accidental semantic dependency.
- **NL-STR-002:** IR can represent typed relationships between named elements,
  including one-to-one, one-to-many, and many-to-many relationships.
- **NL-STR-003:** Relationship identity and source provenance remain inspectable
  after compilation and composition.
- **NL-STR-004:** Consumers can distinguish containment, reference, data
  dependency, and domain-defined relationships without guessing from layout.
- **NL-STR-005:** The representation supports arbitrary fan-out and fan-in; it
  does not force a linear `build -> test -> deploy` sequence.
- **NL-STR-006:** A consumer can construct its own graph and detect domain-level
  cycles without the Neutral compiler claiming all references are execution
  edges.
- **NL-STR-007:** Source conveniences lowered by the compiler remain traceable to
  both their authoring origin and generated IR elements.
- **NL-STR-008:** Structural traversal is bounded and does not require arbitrary
  code execution or network access.
- **NL-STR-009:** Static ordinary-value dependency cycles are invalid. The graph
  ignores `ref(...)` edges, so cycles made exclusively through `Ref<T>` remain
  structurally valid for consumers to interpret under their own domain rules.

## 7. Values, types, and data contracts

- **NL-VAL-001:** IR distinguishes literal values, structured values,
  references, and symbolic/deferred values. Field presence and structural
  omission are recorded separately; omission is not a second source value.
- **NL-VAL-002:** Values can carry an explicit type or schema identity whose
  owner and version are known. The core source scalar types are `num`, `string`,
  and `bool`; `null` is admitted only by nullable positions. Source `num` is an
  exact normalized arbitrary-precision base-10 rational. Integer, decimal, and
  named IEEE formats are contract-owned lowering targets, not additional
  author-facing scalar declarations. Logical IR preserves the normalized value
  losslessly without assuming a host or JSON numeric representation.
- **NL-VAL-003:** Required/defaulted, nullable/non-nullable, and repeated fields
  are distinguishable even though `null` is the only explicit source null/empty
  literal. A default makes a field omittable; `T?` makes its value nullable.
  Those axes are independent, and nullable containers remain distinct from
  containers of nullable elements. There is no separate optional-field modifier.
- **NL-VAL-004:** Records, collections, tagged alternatives, and opaque
  domain-owned values are representable without embedding application keywords
  in the Neutral core. Braced records are contextual values that require exactly
  one expected nominal or vocabulary-owned type; source does not repeat a
  constructor type on the right-hand side.
- **NL-VAL-005:** Numeric ranges, precision, text/binary distinction, ordering,
  duplicate-key behavior, and null/omission behavior are not left to an encoding
  library's defaults. Integer/decimal conversion is exact. Named IEEE formats
  use deterministic round-to-nearest, ties-to-even by default and a vocabulary
  may require exact conversion. Subnormals and signed-zero underflow are valid,
  while overflow, non-finite results, and host-dependent behavior fail.
- **NL-VAL-006:** A value retains its declaration, origin, and transformation
  provenance sufficiently for a consumer diagnostic.
- **NL-VAL-007:** Sensitive classification and contextually typed generic opaque
  `SecretRef<T>` values can represent a requested delivery shape without
  containing resolved secret material or claiming the compiler verified that
  material. `secret_ref("id")` obtains exactly one `T` from its expected type;
  the identifier text never determines `T`.
- **NL-VAL-008:** Unknown or unsupported domain value kinds fail according to
  must-understand rules; they are not coerced silently.
- **NL-VAL-009:** Constraints that can be checked without application state are
  reported during compilation; application-owned constraints remain clearly
  unevaluated for the consumer.
- **NL-VAL-010:** Structured outputs can be described and referenced without the
  compiler claiming that an execution will actually produce them.
- **NL-VAL-011:** User-record defaults are closed constants: recursively constant
  literals, lists, records, and explicitly constant-safe vocabulary static
  values. They cannot depend on bindings, declaration identities, or secrets;
  applying a default records provenance but creates no value-dependency edge.
- **NL-VAL-012:** Source value compatibility is exact identity plus only outer
  `T` to `T?` widening. Generic arguments are invariant, and nominal and
  vocabulary-owned types require identical resolved identity.
- **NL-VAL-013:** Every v0 vocabulary-owned value is immutable copyable data.
  Copy reuse creates a new declaration identity with the same logical value and
  recorded provenance; identity-bearing relationships use `Ref<T>`.

## 8. Symbolic computation and availability

Full Flow eventually needs conditions, values derived from earlier results,
matrices, policy inputs, and generated configuration. Neutral therefore needs a
safe way to preserve symbolic intent without becoming the Flow evaluator.

- **NL-EXP-001:** IR can represent a typed symbolic expression as structured
  nodes, not source text intended for consumer-specific reparsing.
- **NL-EXP-002:** Every operation or function reference identifies its owning
  core or domain vocabulary and behavior version.
- **NL-EXP-003:** Inputs and results declare when and by which domain component
  they may become available; the compiler does not invent a Flow-specific set of
  phases.
- **NL-EXP-004:** The representation distinguishes known, `null`, deferred,
  unavailable, failed-to-evaluate, and indeterminate results where the owning
  profile needs those states. Structural omission is field-presence metadata,
  not a result value.
- **NL-EXP-005:** Evaluation dependencies are explicit and inspectable.
- **NL-EXP-006:** Purity, determinism, possible external effects, and required
  capabilities are declared by the owning operation contract rather than
  inferred from its name.
- **NL-EXP-007:** Constant evaluation is limited to operations whose contracts
  permit compiler evaluation and whose complete inputs are captured.
- **NL-EXP-008:** Failure, short-circuit, comparison, coercion, and missing-value
  behavior must be defined by the selected vocabulary before a consumer claims
  behavioral conformance.
- **NL-EXP-009:** The compiler preserves unevaluated expressions losslessly for
  the responsible consumer and does not substitute an arbitrary host-language
  evaluation rule.
- **NL-EXP-010:** Nontermination, excessive expansion, and resource exhaustion
  are bounded even if future language features add richer computation.

This requirement does not define a Neutral expression language. It states the
information an eventual design must preserve.

## 9. Composition, parameterization, and expansion

- **NL-CMP-001:** Reusable declarations can accept typed parameters and expose
  typed results without textual copying.
- **NL-CMP-002:** Composition preserves declaration identity, parameter origin,
  source locations, and domain ownership.
- **NL-CMP-003:** Defaults and overrides have deterministic precedence and an
  inspectable provenance chain.
- **NL-CMP-004:** Imported and reusable components are versioned and captured in
  the source closure.
- **NL-CMP-005:** Generic collection-based expansion can express repeated
  structure needed by consumers such as Flow matrices without making “matrix” a
  Neutral CI/CD primitive.
- **NL-CMP-006:** Exclusions, additions, and combinations are representable as
  ordinary typed data and domain rules.
- **NL-CMP-007:** Expansion has explicit cardinality and depth limits and reports
  the source construct responsible for exceeding them.
- **NL-CMP-008:** The IR states whether a structure is fully expanded,
  symbolically retained, or consumer-expanded; consumers never guess.
- **NL-CMP-009:** Consumer-time expansion cannot silently alter already-issued
  IR. Its result belongs to the consumer's own immutable normalized record.
- **NL-CMP-010:** Recursive composition is either rejected or governed by a
  separately specified, bounded contract before it is accepted.

## 10. Domain vocabulary and extension contract

Neutral requires extensibility because Flow and Neux have different meanings.
Extensibility must not become unversioned arbitrary compiler plugins.

- **NL-DOM-001:** Every domain vocabulary has a collision-resistant identity,
  owner, schema version, behavior version, and compatibility range.
- **NL-DOM-002:** A compilation request explicitly selects permitted domain
  profiles. Source introduces a logical namespace with `use Vocabulary`, such
  as `use Flow` or `use Neux`; the captured lock manifest resolves it to one
  exact identity, digest, schema version, behavior version, and supported
  feature set. Source cannot activate an undeclared privileged profile
  implicitly.
- **NL-DOM-003:** Vocabulary-owned typed declarations use the same type-first
  binding and contextual-value grammar as local declarations. Their data
  contracts can be loaded and validated without executing provider or
  application code.
- **NL-DOM-004:** Core IR carries namespace-qualified vocabulary-owned typed
  declarations and values without assigning their external behavior.
- **NL-DOM-005:** Required and optional domain features are distinguishable.
  Each vocabulary member declares its feature dependencies; the compiler
  derives and records the required set from members actually used. Unknown or
  unsupported required behavior fails closed, while ignorable metadata must be
  explicitly declared non-behavioral.
- **NL-DOM-006:** Domain payloads have bounded size, depth, allowed value kinds,
  and reference targets.
- **NL-DOM-007:** An extension cannot redefine core identity, scoping, source
  provenance, or compatibility rules.
- **NL-DOM-008:** Domain vocabulary dependencies are explicit, versioned,
  acyclic under stated rules, and captured in the derivation.
- **NL-DOM-009:** Flow provider data is not promoted into Neutral core. When
  authoring explicitly carries a value of a Flow-owned extension type through
  an ordinary binding, the IR preserves it as Flow-owned domain data for Flow
  to classify and validate.
- **NL-DOM-010:** Domain schemas can describe declarations, relationships,
  operations, parameters, result shapes, annotations, and capability/effect
  contracts without requiring a new IR encoding.
- **NL-DOM-011:** Consumer-specific private fields are prohibited from the
  portable IR contract unless registered through the extension mechanism.
- **NL-DOM-012:** Installing a vocabulary grants no execution, filesystem,
  network, credential, signing, or provider authority.
- **NL-DOM-013:** Vocabulary fields use the same independent axes as Neutral
  record fields: required/defaulted, nullable/non-nullable, and
  behavioral/non-behavioral. A vocabulary cannot invent a second field-presence
  notion called “optional.”

## 11. Contracts, capabilities, and effects

Flow needs enough declared information to validate opaque work conservatively.
Neutral transports those declarations; Flow defines and enforces their CI/CD
meaning.

- **NL-CTR-001:** An operation contract can declare typed inputs, outputs,
  errors, availability, determinism, and observable-effect classes.
- **NL-CTR-002:** Required capabilities and optional preferences are represented
  distinctly and identify their owning vocabulary and version.
- **NL-CTR-003:** Quantitative limits and qualifiers are structured values, not
  boolean feature names.
- **NL-CTR-004:** Permission, confidentiality, resource, isolation, and effect
  requirements can be carried as domain-owned declarations without implying
  authorization or enforcement.
- **NL-CTR-005:** A consumer can distinguish author-declared, compiler-derived,
  domain-contract-derived, and unverified requirements.
- **NL-CTR-006:** Opaque operations do not acquire an empty-effect or
  no-permission assumption merely because the compiler cannot inspect them.
- **NL-CTR-007:** Contract references are immutable and included in the compiler
  derivation.
- **NL-CTR-008:** Conflicting contracts or requirements produce explicit
  diagnostics; precedence is never chosen from load order.
- **NL-CTR-009:** Capability declarations do not carry credentials and do not
  mean that a particular actor is authorized.
- **NL-CTR-010:** Trust, signatures, provenance, and policy acceptance remain
  separate dimensions; parsing a signed declaration does not make it trusted.

## 12. Source maps and diagnostics

- **NL-DIA-001:** Diagnostics are structured records with stable code, severity,
  message, primary span, related spans, responsible layer, and optional remedy.
- **NL-DIA-002:** Source spans identify a captured source unit and use documented
  byte/character and line/column conventions.
- **NL-DIA-003:** Generated or composed IR retains an origin stack so consumers
  can explain both the generated element and the authoring construct.
- **NL-DIA-004:** A consumer can attach a domain diagnostic to an IR element and
  map it back to `.neu` without reparsing source.
- **NL-DIA-005:** Diagnostics distinguish syntax, name/type, profile/schema,
  compatibility, and internal compiler failures.
- **NL-DIA-006:** Ordering and deduplication of diagnostics are deterministic for
  identical captured inputs.
- **NL-DIA-007:** Sensitive values are omitted or redacted before diagnostic
  persistence; source excerpts follow an explicit disclosure policy.
- **NL-DIA-008:** Diagnostics remain useful when source content is unavailable by
  retaining safe logical names, element identities, and bounded location data.
- **NL-DIA-009:** The source-map format is versioned independently when needed
  and has referential-integrity validation.
- **NL-DIA-010:** Machine-readable diagnostics are the primary integration
  surface; human rendering is a replaceable presentation concern.

## 13. Neutral IR document contract

- **NL-IR-001:** Every IR document declares its IR schema/version, required
  feature set, selected domain profiles, producer identity, and derivation
  manifest identity.
- **NL-IR-002:** The logical data model is specified independently from any JSON,
  binary, database, or in-memory encoding.
- **NL-IR-003:** Required fields, defaulted/omittable fields, nullable fields,
  unknown fields, ordering, duplicates, and invalid encodings have normative
  behavior; omission and explicit `null` remain distinct.
- **NL-IR-004:** The IR is immutable after issuance. Transformations produce a
  new IR document with an explicit derivation link.
- **NL-IR-005:** All internal references are validated for target existence,
  target kind, scope, and document/package boundary.
- **NL-IR-006:** Consumers can reject unsupported required features before
  interpreting domain behavior.
- **NL-IR-007:** Schema-designated ignorable non-behavioral data can be preserved
  through a read/write round trip where the compatibility policy promises
  preservation.
- **NL-IR-008:** Unknown behavioral data is never dropped, defaulted, or treated
  as metadata silently.
- **NL-IR-009:** Documents are self-describing enough to choose a compatible
  decoder without relying on filenames or transport headers.
- **NL-IR-010:** The format supports bounded validation before allocating memory
  proportional to attacker-controlled declared sizes.
- **NL-IR-011:** Cross-document references, if supported, bind immutable document
  and element identities; mutable URLs alone are insufficient.
- **NL-IR-012:** IR transport framing, compression, and chunking cannot change
  the logical document identity unnoticed.
- **NL-IR-013:** Canonical bytes, if offered, are a versioned optional contract;
  ordinary serializer output is not assumed canonical.
- **NL-IR-014:** The IR contains no compiler process handles, memory addresses,
  host paths accidentally exposed as portable identity, or resolved credentials.
- **NL-IR-015:** An ordinary source binding-value use lowers to the target's
  immutable logical value with provenance for both use and origin; it does not
  become a `Ref<T>` identity edge. Implementations may share storage internally,
  but that sharing is not public IR meaning.

## 14. Compiler and IR API capabilities

The API is a language boundary, not just a serializer library.

### Compilation API

- **NL-API-001:** Accept an explicit compilation request containing root,
  resolver, profiles, feature policy, options, and resource limits.
- **NL-API-002:** Return a result containing IR when successful, diagnostics,
  source map, derivation manifest, and actual capability versions used.
- **NL-API-003:** Define whether partial IR may be returned after errors and mark
  it unambiguously as non-authoritative so domain consumers cannot accept it as
  a valid submission.
- **NL-API-004:** Support cancellation and deadlines without returning an
  apparently successful incomplete derivation.
- **NL-API-005:** Be reentrant and safe for concurrent independent compilations,
  with no hidden process-global source or profile state.
- **NL-API-006:** Make nondeterministic inputs such as current time, randomness,
  locale, host environment, and mutable resolution unavailable or explicit.
- **NL-API-007:** Report compiler version, build identity where relevant,
  selected behavior versions, and feature flags.
- **NL-API-008:** Provide incremental compilation only as an optimization; its
  accepted output must match full compilation under the same captured inputs.

### Consumer API

- **NL-API-009:** Decode and validate an untrusted IR envelope before exposing
  domain nodes to a consumer.
- **NL-API-010:** Negotiate required IR and domain-profile features explicitly.
- **NL-API-011:** Expose immutable typed views for documents, declarations,
  values, references, expressions, provenance, and domain payloads.
- **NL-API-012:** Provide indexed lookup and bounded traversal without requiring
  consumers to depend on storage layout or field ordering.
- **NL-API-013:** Preserve opaque schema-designated ignorable non-behavioral data
  only under documented round-trip rules and prevent consumers from accidentally
  treating it as understood.
- **NL-API-014:** Let consumers create diagnostics against IR elements using the
  standard source-map mechanism.
- **NL-API-015:** Distinguish malformed encoding, invalid core IR, unsupported
  version, unsupported required feature, invalid domain payload, and consumer
  interpretation errors.
- **NL-API-016:** Expose resource accounting and enforce limits for bytes,
  elements, nesting, references, strings, diagnostics, and traversal.
- **NL-API-017:** Avoid implicit source, package, network, environment, plugin,
  or credential access while reading IR.
- **NL-API-018:** Allow safe concurrent reads and make ownership and lifetime of
  returned data explicit.

### Transformation and inspection API

- **NL-API-019:** If transformation is supported, use builders or immutable
  rewrites that emit a new document and derivation; never mutate issued IR.
- **NL-API-020:** Validate transformed documents with the same rules as compiler
  output and identify the transformer and behavior version.
- **NL-API-021:** Provide structural inspection and comparison over a named
  projection without claiming semantic equivalence.
- **NL-API-022:** Expose a stable query/traversal model for IDEs, documentation,
  visualization, Flow, and Neux without making the compiler's internal AST a
  public compatibility commitment.
- **NL-API-023:** Keep the source AST, compiler-internal lowered forms, public
  Neutral IR, and consumer-private models explicitly separate.
- **NL-API-024:** Generated textual `.neu`, if ever supported, is a distinct
  formatting/decompilation product and is not assumed to reproduce original
  source.

## 15. Compatibility and evolution

- **NL-EVO-001:** `.neu` language behavior, compiler API, Neutral IR, source-map
  format, domain profiles, and library bindings have independently stated
  compatibility policies.
- **NL-EVO-002:** Producer and consumer version ranges are negotiated; version
  numbers alone do not replace required-feature checks.
- **NL-EVO-003:** Backward-compatible additions, behavior changes, removals, and
  security revocations are defined separately.
- **NL-EVO-004:** Unknown required behavior fails closed with a precise
  diagnostic.
- **NL-EVO-005:** Migrations identify source and target versions, information
  loss, changed behavior, and the tool that performed the migration.
- **NL-EVO-006:** A migration that cannot preserve required meaning refuses
  automatic conversion rather than approximating it.
- **NL-EVO-007:** Supported consumers can retain and inspect historical IR and
  derivations across the documented archival window.
- **NL-EVO-008:** Deprecation includes detection, replacement guidance, support
  horizon, and conformance fixtures.
- **NL-EVO-009:** Experimental features use explicit namespaces/feature flags and
  cannot appear in stable output unnoticed.
- **NL-EVO-010:** Security fixes may invalidate previously accepted artifacts;
  revocation and rejection behavior is documented rather than disguised as
  ordinary compatibility.

## 16. Security and robustness

- **NL-SEC-001:** `.neu`, imported packages, domain schemas, and Neutral IR are
  treated as untrusted inputs.
- **NL-SEC-002:** Parsing, validation, name resolution, type/schema checking,
  expansion, canonicalization, and diagnostics have resource bounds.
- **NL-SEC-003:** Cycles, deeply nested data, oversized lengths, duplicate IDs,
  malicious Unicode, reference bombs, and expansion bombs have negative tests.
- **NL-SEC-004:** Compiler and reader APIs do not execute embedded native code or
  deserialize arbitrary host-language objects.
- **NL-SEC-005:** Data-only domain profiles cannot gain filesystem, network,
  environment, process, credential, or signing access.
- **NL-SEC-006:** If executable compiler extensions are ever introduced, they
  require a separate threat model, isolation boundary, capability grant, package
  identity, and deterministic-behavior policy.
- **NL-SEC-007:** Secrets are represented by opaque references and sensitivity
  metadata where needed; the compiler is not a secret resolver or broker.
- **NL-SEC-008:** Source maps, diagnostics, derivations, caches, and crash reports
  follow explicit data-minimization and redaction rules.
- **NL-SEC-009:** A signature verifies bytes under key material; signer identity,
  intent, authority, compromise, revocation, and policy acceptance remain
  separate decisions.
- **NL-SEC-010:** Compiler caches are content- and behavior-version keyed and
  cannot allow one tenant or project to inject trusted results into another.
- **NL-SEC-011:** Invalid or unsupported input produces a controlled error and
  never a partially trusted success.
- **NL-SEC-012:** The threat model covers source confusion, dependency
  substitution, path traversal, parser differentials, canonicalization
  collisions, schema confusion, downgrade attacks, and diagnostic exfiltration.

## 17. Tooling and authoring support

- **NL-TOL-001:** Formatting, parsing, compilation, diagnostics, and source-map
  behavior are reusable by command-line, editor, and GUI tooling.
- **NL-TOL-002:** IDE support can query symbols, references, types/schemas,
  profiles, provenance, and diagnostics without invoking Flow or Neux.
- **NL-TOL-003:** A future GUI emits `.neu` that is inspectable and compilable by
  ordinary neutral-lang tooling.
- **NL-TOL-004:** GUI round-tripping, if promised, uses explicit stable element
  metadata and formatting rules; it is not inferred from arbitrary IR.
- **NL-TOL-005:** Documentation generation can traverse public declarations and
  domain contracts without executing them.
- **NL-TOL-006:** Human-readable IR inspection is available for debugging even
  if the canonical transport is binary.
- **NL-TOL-007:** Tooling can explain which compiler, profile, dependency, and
  feature version produced an element.
- **NL-TOL-008:** Test fixtures can be compiled without network access or mutable
  global package state.

## 18. Conformance and quality evidence

- **NL-CON-001:** A versioned conformance corpus covers valid source, invalid
  source, name/reference resolution, types/schemas, composition, source maps,
  IR validation, and feature negotiation.
- **NL-CON-002:** Golden fixtures bind source closure, compilation request,
  diagnostics, logical IR projection, and derivation manifest.
- **NL-CON-003:** Determinism tests compare defined logical or canonical
  projections, not incidental map ordering or pretty-print layout.
- **NL-CON-004:** Consumer fixtures include unknown schema-designated ignorable
  data, unknown required behavior, malformed payloads, incompatible versions,
  dangling references, and adversarial resource use.
- **NL-CON-005:** Cross-language library bindings, if offered, pass the same
  logical conformance corpus.
- **NL-CON-006:** Flow and Neux maintain separate consumer conformance suites.
  Passing one does not prove the other.
- **NL-CON-007:** The Flow corpus proves that source mappings, symbolic
  relationships, domain contracts, and derivation identity survive compilation;
  Flow itself proves pipeline behavior.
- **NL-CON-008:** Compatibility promises have tests spanning every supported
  producer/consumer version pair or an explicitly bounded representative matrix.
- **NL-CON-009:** Fuzzing and property tests cover parsers, decoders,
  canonicalizers, migrations, reference resolution, and expansion limits.
- **NL-CON-010:** Performance budgets are set for source bytes, closure size,
  declaration/reference count, nesting, expansion, diagnostics, compile latency,
  memory, IR size, decode latency, and indexed lookup before a stable release.

## 19. Flow capability traceability

The following table explains how the full Flow catalogue constrains Neutral
without moving Flow behavior into the language.

| Flow capability cluster | Neutral/IR obligation | Flow-owned meaning |
| --- | --- | --- |
| Source and workflow identity | Captured source closure, compiler derivation, immutable IR identity, source map | Workload/source snapshot and normalized Flow definition |
| Workflow structure and dependencies | Named declarations, explicit typed relationships, composition provenance | Which relationships form the pipeline DAG and readiness rules |
| Inputs, outputs, and configuration | Typed declarations, defaults, references, symbolic values, origin | Configuration precedence, runtime materialization, missing-output behavior |
| Conditions and data-dependent behavior | Structured symbolic expressions, evaluation dependencies, availability contract | Truth model, result propagation, skip/failure behavior, joins |
| Reusable components, templates, matrices | Parameterized composition and bounded generic expansion | Flow component contracts, matrix aggregation, pipeline limits |
| Execution units and software-delivery work | Domain-owned operation declarations and contracts | Command/integration behavior, environments, execution, observation |
| Capabilities, permissions, resources, and effects | Structured domain-owned requirements and provenance | Capability inference, compatibility, authorization, allocation, enforcement |
| Provider independence and extensions | Namespaced, versioned, must-understand domain data | Binding, extension layers, portability degradation, provider conformance |
| Events and execution requests | Typed data shapes and references | Ingress authentication, deduplication, causation, run creation |
| Attempts, retry, timeout, cancellation, and recovery | No core lifecycle feature required; vocabulary-owned typed declarations may carry requested policy | Durable state machines, fencing, reconciliation, tombstones |
| Secrets and trust handover | Opaque references and sensitivity metadata; no secret values | Authorization, brokers, destination credentials, trust-zone policy |
| Artifacts, evidence, logs, audit, and history | Typed domain values and immutable references | Storage, integrity verification, retention, trust evaluation, observation |
| Deployment, promotion, gates, and rollback | Domain operation/evidence declarations | Protected effects, approval, exact artifact binding, verification |
| Reporting, notifications, metrics, and visualization | Inspectable structure, types, source map, stable identities | Read models, rendering, transport, telemetry policy |
| Optimization, prediction, simulation, formal analysis, and generation | Stable inspectable IR and declared behavior contracts only | Algorithms, evidence, safety gates, and product authority |

No row implies a same-named Neutral keyword. If a Flow feature can be expressed
through existing declarations, relationships, values, contracts, and domain
data, Neutral needs no new core concept.

## 20. Explicit non-features

The following do not belong in neutral-lang merely because full Neutral Flow may
need them:

- a CI/CD provider adapter or provider capability database;
- a scheduler, queue, worker protocol, runner, or execution sandbox;
- workflow lifecycle or result aggregation owned by Flow;
- retry, timeout, cancellation, cleanup, reconciliation, or tombstone engines;
- source-control event listeners, webhooks, schedules, or deduplication stores;
- identity provider, policy engine, secret vault, credential broker, or token
  exchange;
- artifact registry, evidence signer, audit database, telemetry backend, or log
  store;
- deployment, promotion, rollback, progressive delivery, or environment
  controller;
- shell parsing, GNU command semantics, process management, or OS abstraction;
- provider-specific portability grades as Neutral core semantics;
- machine-learning prediction, automatic remediation, or automatic workflow
  generation; and
- proof that opaque external operations have the effects they claim.

Neutral may transport versioned declarations used by these systems. Transport is
not interpretation, authorization, execution, or proof.

## 21. Required documentation set

The following documents are needed before calling the Neutral IR layer a stable
public API. They should be written progressively; this file does not create them.

1. **Product charter and boundaries** — purpose, users, three-application model,
   non-goals, and terminology.
2. **Language behavior specification** — normative `.neu` behavior independent
   of one parser implementation, once design work begins.
3. **Core logical model** — declarations, scopes, references, value categories,
   composition, symbolic structure, and invariants without encoding details.
4. **Neutral IR specification** — envelope, logical schema, validation,
   references, required features, immutability, limits, and encodings.
5. **Compiler API specification** — request/result model, resolver, options,
   cancellation, limits, determinism, diagnostics, and failure behavior.
6. **IR consumer API specification** — decoding, validation, negotiation, typed
   access, traversal, ownership, concurrency, and error taxonomy.
7. **Derivation and identity specification** — source closure, compiler identity,
   source maps, canonicalization, digests, replay, and comparison.
8. **Domain vocabulary guide** — ownership, schemas, operation contracts,
   must-understand rules, dependency capture, and data-only security boundary.
9. **Compatibility and migration policy** — independent version surfaces,
   support windows, feature negotiation, deprecation, archival reading, and
   loss-reporting rules.
10. **Diagnostics and source-map specification** — stable codes, spans, expansion
    origins, consumer diagnostics, rendering, and redaction.
11. **Security and threat model** — untrusted inputs, resolver/package risks,
    resource exhaustion, extension isolation, secret handling, signing limits,
    and cache separation.
12. **Conformance specification and corpus** — positive, negative, historical,
    adversarial, deterministic, compatibility, and performance evidence.
13. **Neutral Flow consumer profile** — the exact vocabulary and IR obligations
    Flow consumes, owned and versioned by Flow rather than Neutral core.
14. **Neux consumer profile** — an independently researched OS-domain contract;
    overlap with Flow is evidence for generalization, not an assumption.
15. **Tooling integration guide** — CLI, editor, GUI transcription, documentation,
    human inspection, and offline fixture workflows.
16. **Decision log** — accepted, rejected, experimental, and deferred choices,
    including the evidence used to promote a domain concept into Neutral core.

## 22. Decisions before version checklists

The following recommended answers are the planning baseline. Their alternatives,
trade-offs, evidence requirements, and fuller rationale are recorded in
[choices.md](choices.md). “Recommended” does not mean permanently frozen: the
Neux corpus, resource measurements, and real release cadence still have to test
the provisional decisions.

---

### 1. What is Neutral's smallest cross-domain user journey, independent of Flow?

Prove one small, effect-free vertical slice in this order:

```text
.neu -> parser -> semantic analysis -> Neutral IR -> probe consumer
```

The first implementation accepts one explicitly captured `.neu` source unit and
one tiny in-memory/captured vocabulary fixture; resolves declarations, immutable
value dependencies, structured values, and typed identity references; and emits
the minimum immutable Neutral IR needed by an effect-free probe using only the
public consumer API. Start with one minimal Flow fixture. Then add one
independently designed Neux fixture through the same IR API and use disagreements
to remove accidental Flow assumptions from core.

The complete resolver, provenance, derivation, compatibility, and encoding
architecture remains the target contract, but the compiler proof does not wait
for production package acquisition, migration, or canonical-byte machinery.

This journey performs no command execution, scheduling, provider access, secret
resolution, or domain-condition evaluation. It is complete because it crosses
the compiler/IR/consumer boundaries, not because it implements Flow.

### 2. Which structures are demonstrated by both the Flow and Neux problem corpora?

Use a two-corpus promotion rule: a structure enters Neutral core only after one
real Flow case and one independently derived Neux case demonstrate the same
invariant and explain why a domain vocabulary cannot safely own it.

The current provisional candidates are stable declaration identity and names;
namespaces, scopes, and typed references; typed scalar and structured values;
containment and typed relationships without execution meaning; immutable
documents; source provenance; structured diagnostics; required-feature
negotiation; and namespace-qualified vocabulary-owned typed declarations. They
are not yet a frozen core because the Neux corpus has not been established.

Flow graphs, jobs, conditions, retries, runners, artifacts, and deployments stay
outside core. Neux commands, processes, files, and packages also stay outside
core. Symbolic computation, composition, and expansion remain provisional until
equivalent needs are demonstrated in both domains.

### 3. What is core IR versus a versioned Flow domain vocabulary?

Use a small fixed core plus versioned, namespaced, data-described domain
vocabularies. The core owns document identity, declarations, scopes, references,
common value forms, provenance, source maps, diagnostics, feature negotiation,
resource limits, and safe extension framing.

The Flow vocabulary owns the `Pipeline` type, dependency meaning, operation
contracts, conditions, outputs, requirements, and other CI/CD behavior. Neux
owns OS- and command-specific declarations. Every domain item identifies its
vocabulary, owner assertion, schema version, behavior version, and
must-understand classification. Unknown required behavior fails closed; only
explicitly ignorable non-behavioral metadata may be skipped or preserved
opaquely.

A Flow normalized definition or logical plan remains a private Flow record. It
is not Neutral IR and does not belong to `neutral-lang`.

### 4. Which symbolic behavior must the compiler understand, and which behavior is preserved for a consumer?

The compiler understands bounded symbolic structure, operation identity and
owner, behavior version, static input and result types, resolved references,
evaluation dependencies, declared availability, purity, determinism, effects,
capabilities, and source origin.

It may evaluate only a deliberately small set of pure core operations whose
complete inputs are captured and whose behavior Neutral defines normatively.
All domain-owned operations are preserved as structured typed IR for the
responsible consumer. They are never stored as source strings for consumer
reparsing and never inherit host-language behavior accidentally.

Flow owns condition truth, skip/failure propagation, missing outputs, result
aggregation, and provider/runtime values. Neux owns OS lookup and command
behavior.

### 5. What complete source closure and derivation identity can neutral-lang guarantee?

Every authoritative successful compilation binds a complete captured closure:
the root and transitive source units, vocabulary/schema bundles, reusable
packages, decision-affecting resolver results, compiler behavior identity,
options, feature policy, and explicit nondeterministic inputs. It also identifies
the resulting IR, source map, and diagnostic contract.

Acquisition occurs only through the caller-supplied resolver. Captured content
must support offline replay, and mutable paths, URLs, or tags remain provenance
rather than identity. Credentials and secret values are excluded.

Derivation identity and logical IR content identity remain distinct because two
different captured derivations can produce logically equal IR. If the complete
decision-affecting closure cannot be identified, output may be exploratory and
explicitly non-authoritative, but it cannot be called reproducible.

### 6. What logical equality and optional canonical-byte guarantees are required?

Define record identity, derivation identity, logical equality, and byte equality
as separate contracts. Normative logical equality under a named IR version is
the primary conformance rule. The same captured derivation must produce
deterministic logical IR and diagnostics, but permitted encoders may produce
different bytes for logically equal documents.

Do not require canonical bytes until a named need such as cross-tool signing or
content-addressed exchange justifies the compatibility cost. At that point,
define a separately versioned canonical encoding with explicit ordering,
duplicates, Unicode, numeric, and unknown-field rules. Ordinary serializer or
JSON output is never canonical by assumption. Domain semantic equivalence
remains owned by the relevant vocabulary or consumer.

### 7. Which IR and API compatibility window is credible before 1.0?

Version `.neu` behavior, logical IR, concrete encodings, compiler API, consumer
API, and each vocabulary's schema and behavior independently. Unpublished
experiments may break freely. After the first intentionally published IR
schema, producers write the current schema and readers support the current and
immediately previous published schema for at least one release overlap.

Unknown required behavior is rejected before interpretation. Migrations create
a new immutable IR with a derivation link and explicit loss report; downgrade,
data loss, and behavior-changing defaults are never silent. This rolling window
is provisional until the actual upgrade cadence of neutral-lang, Flow, and Neux
supports a longer time-based policy.

### 8. How are domain vocabularies resolved and validated without executing untrusted plugins?

Resolve versioned, data-only vocabulary bundles through the explicit compilation
resolver and capture their exact content in the source closure. A bundle
declares its identity, owner assertion, schema and behavior versions,
compatibility range, dependencies, allowed structures and values, reference
targets, operation contracts, static constraints, and resource bounds.

The compiler validates bundles using built-in bounded machinery. Source cannot
activate an unapproved profile or cause ambient network access. Signatures are
policy evidence about bytes, not automatic proof of identity, safety, or intent.
Checks requiring Flow or Neux meaning run in that consumer. Executable compiler
plugins are excluded from the initial design and would require a separate
security and determinism decision.

Implement this boundary incrementally. The first compiler uses one tiny captured
vocabulary supplied directly by the test harness; it performs no package
resolution. Add resolver/version selection, compatibility migration, and richer
bundle infrastructure only when the next concrete use case needs them. The
temporary delivery mechanism must not weaken the final rules: no ambient fetch,
no executable plugin, and unknown required behavior still fails closed.

### 9. What are the initial structural and diagnostic limits?

Put a versioned resource-budget object in the first compiler and reader APIs.
Named safe baselines apply by default; callers may choose stricter limits and a
host may impose a documented ceiling. Decision-affecting limits are recorded in
the derivation. Exceeding one produces a bounded diagnostic and no apparently
complete authoritative IR.

Use these only as initial desktop/CI measurement values, not stable promises:

| Budget | Provisional measurement value |
| --- | ---: |
| Source units | 256 |
| Bytes per source unit | 2 MiB |
| Complete source closure | 16 MiB |
| Import or composition depth | 64 |
| Structural nesting depth | 128 |
| Significant decimal digits per numeric literal | 4,096 |
| Absolute decimal scale per numeric literal | 4,096 |
| Expanded IR elements | 10,000 |
| Decoded IR size | 32 MiB |
| Emitted diagnostics | 200, then one truncation diagnostic |

Before any stable release, replace or confirm the numbers using representative,
near-limit, and adversarial Flow and Neux corpora. Wall-clock and memory ceilings
belong to a named implementation/deployment profile, as described in
[implementation resource budgets](docs/implementation-resource-budgets.md).
Numeric digit and scale limits are checked before constructing an
arbitrary-precision coefficient or starting decimal-to-binary conversion.

### 10. Which consumer conformance case proves the boundary without implementing Flow or Neux inside the compiler?

Build the probes sequentially. First, a minimal Flow-profile probe proves the
compiler path. Next, an independently designed Neux-profile probe uses the same
public IR API. Each probe validates required vocabulary support, traverses
declarations and typed references, and emits a deterministic private summary or
domain diagnostic.
They do not parse `.neu`, evaluate domain operations, share a private model,
invoke a shell, or contact a CI provider.

The cases must cover successful reading, rejection of unknown required
behavior, safe handling of ignorable non-behavioral metadata, typed traversal,
mapping a consumer diagnostic back to `.neu`, bounded malformed-input rejection,
and deterministic results. Flow graph semantics and Neux OS semantics retain
separate consumer conformance suites.

### Remaining gates

Version checklists may allocate coherent vertical slices from these answers,
but must retain three open evidence gates:

1. Build the minimal Flow vertical slice, then the independent Neux corpus,
   before freezing any proposed common core.
2. Measure the resource profile before treating its values as compatibility
   commitments.
3. Observe real release cadence before extending the provisional compatibility
   window.

The checklists must not equate “needed eventually” with “belongs in v0,” and
must preserve the separation between neutral-lang, neutral-flow, and neux.
