# Neutral language syntax decision checklist

Status: proposed master checklist through the fully fledged v2 language

Scope: questions the future `.neu` syntax specification must answer. This is
not a grammar, token proposal, semantic specification, or implementation plan.

The checklist derives from [needed-features.md](needed-features.md) and the
decisions in [choices.md](choices.md). It deliberately describes **what must be
decided**, not what punctuation or keywords the language must use.

## Version model

- **v0** establishes the smallest safe, effect-free `.neu -> Neutral IR ->
  consumer` authoring surface.
- **v1** adds multi-unit composition, richer data modeling, and structured
  symbolic authoring while preserving consumer ownership of domain behavior.
- **v2** completes the advanced authoring, evolution, and tooling surface needed
  by the eventual Neutral Flow and Neux profiles.
- The fully fledged v2 language is the union of v0, v1, and v2. Neutral remains
  a tool-abstraction language, not a general-purpose programming language.

Incremental views:

- [v0 syntax checklist](v0/syntax-checklist.md)
- [v1 syntax checklist](v1/syntax-checklist.md)
- [v2 syntax checklist](v2/syntax-checklist.md)

Every item has a stable identifier and exactly one first-delivery version.
Checking an item means the question has a normative answer, examples, invalid
cases, diagnostics, and conformance fixtures. It does not merely mean a parser
accepts one example.

## 1. Governing syntax boundaries

- [ ] **SYN-GOV-001 · v0** — Define the boundary between concrete `.neu` syntax, the compiler's private syntax tree, the public logical IR, and consumer-private models.
- [ ] **SYN-GOV-002 · v0** — Require every accepted surface construct to lower into a documented logical model with source provenance.
- [ ] **SYN-GOV-003 · v0** — Establish the two-corpus rule before adding a Flow- or Neux-shaped construct to Neutral core syntax.
- [ ] **SYN-GOV-004 · v0** — Specify which syntax is Neutral core and which syntax is introduced by an explicitly selected domain vocabulary.
- [ ] **SYN-GOV-005 · v0** — State that syntax acceptance never implies authorization, execution, provider support, or successful external effects.
- [ ] **SYN-GOV-006 · v0** — Define the normative-specification, examples, invalid-fixture, and diagnostic evidence required to call a syntax decision complete.

## 2. Lexical and source-text rules

- [ ] **SYN-LEX-001 · v0** — Specify accepted source encodings, byte-order-mark handling, invalid byte behavior, and line-ending normalization.
- [ ] **SYN-LEX-002 · v0** — Define whitespace, indentation significance or insignificance, statement separation, and permitted line continuation.
- [ ] **SYN-LEX-003 · v0** — Define line comments, block comments if present, nesting behavior, and unterminated-comment diagnostics.
- [ ] **SYN-LEX-004 · v0** — Define identifier spelling, Unicode policy, normalization, case sensitivity, and confusable-character diagnostics.
- [ ] **SYN-LEX-005 · v0** — Define reserved/contextual words; give `::` the sole meaning of namespace/module/vocabulary qualification and restrict `.` in v0 to vocabulary-owned enum cases or static members, excluding general value member access.
- [ ] **SYN-LEX-006 · v0** — Define delimiter pairs, separators, logical-newline and closing-brace termination, and trailing-separator rules; `.neu` has no semicolon terminator.
- [ ] **SYN-LEX-007 · v0** — Define ordinary text literals, escapes, invalid escape handling, and Unicode scalar behavior.
- [ ] **SYN-LEX-008 · v0** — Define `num`, `string`, `bool`, and `null` spellings without inheriting host-language range or precision rules; do not add a second `absent` source value.
- [ ] **SYN-LEX-009 · v1** — Decide whether raw and multiline text literals exist and specify indentation stripping, delimiter collision, and newline preservation.
- [ ] **SYN-LEX-010 · v1** — Decide whether binary literals exist in core or only through typed/domain constructors, including size and display rules.
- [ ] **SYN-LEX-011 · v2** — Decide whether text interpolation exists; if it does, define its boundary from symbolic expressions and domain escaping.
- [ ] **SYN-LEX-012 · v2** — Reserve and document lexical space for future versions without allowing unknown syntax to be accepted silently.

## 3. Documents, modules, imports, and profiles

- [ ] **SYN-DOC-001 · v0** — Require every source unit to declare its exact `.neu` language-behavior version and reject mixed versions in one v0 compilation closure.
- [ ] **SYN-DOC-002 · v0** — Define the top-level document shape and whether declarations, values, or both may appear at the root.
- [ ] **SYN-DOC-003 · v0** — Define `use Vocabulary` (for example, `use Flow`) as a vocabulary namespace import resolved only through the compilation request's exact captured lock manifest.
- [ ] **SYN-DOC-004 · v0** — Define module/package names independently from paths, URLs, mutable tags, and display labels; merge same-module units only within one captured package and reject cross-unit or cross-package collisions.
- [ ] **SYN-DOC-005 · v1** — Decide whether `use` extends to source modules/packages; define relative versus package resolution without ambient search.
- [ ] **SYN-DOC-006 · v1** — Define qualified, aliased, and selective `use` forms and their collision behavior.
- [ ] **SYN-DOC-007 · v1** — Define visibility and export declarations without making file layout an accidental visibility rule.
- [ ] **SYN-DOC-008 · v1** — Define how immutable dependency identity or version constraints are expressed without treating mutable tags as captured identity.
- [ ] **SYN-DOC-009 · v1** — Define syntax-level handling and diagnostics for missing, duplicate, cyclic, ambiguous, and disallowed module/package uses.
- [ ] **SYN-DOC-010 · v1** — Define vocabulary namespace renaming or multiple-version use, if justified, without weakening lock-manifest identity.
- [ ] **SYN-DOC-011 · v2** — Define package re-export and facade-module syntax, if justified, without hiding the complete source closure.
- [ ] **SYN-DOC-012 · v2** — Define source-level feature requests separately from compiler policy, so source cannot enable an unapproved privileged feature.

## 4. Declarations, bindings, and names

- [ ] **SYN-DEC-001 · v0** — Define the common shape of a named declaration and the distinction between stable machine identity and display name.
- [ ] **SYN-DEC-002 · v0** — Define variable/binding declaration syntax; keep `mut` provisional, and if retained restrict reassignment to the declaring source unit so merged modules do not acquire cross-file order.
- [ ] **SYN-DEC-003 · v0** — Define explicit type/schema annotations and the limited positions, if any, where type inference is permitted.
- [ ] **SYN-DEC-004 · v0** — Represent vocabulary-owned declarations as ordinary type-first bindings such as `Flow::Pipeline verify = { ... }`, without vocabulary names or a special declaration-kind production in Neutral core.
- [ ] **SYN-DEC-005 · v0** — Define namespace declaration and qualification syntax.
- [ ] **SYN-DEC-006 · v0** — Define duplicate declaration, shadowing, and reserved-name diagnostics.
- [ ] **SYN-DEC-007 · v0** — Define forward references and initialization cycles: reject direct value cycles, allow cycles consisting only of `Ref<T>` links, and ensure source order is not accidental execution order.
- [ ] **SYN-DEC-008 · v1** — Define parameter declarations, result declarations, and their ordering and naming rules.
- [ ] **SYN-DEC-009 · v1** — Define required versus defaulted/omittable parameters independently from nullability, with an inspectable distinction among omission, default application, and explicit `null`.
- [ ] **SYN-DEC-010 · v1** — Define nested declarations and local scope boundaries, if retained after corpus testing.
- [ ] **SYN-DEC-011 · v2** — Define declaration modifiers and annotations with deterministic ordering, duplication, and conflict rules.
- [ ] **SYN-DEC-012 · v2** — Decide whether declaration aliases exist and how alias origin remains distinguishable from authoritative identity.

## 5. Type and schema notation

- [ ] **SYN-TYP-001 · v0** — Define the primitive scalar set as `num`, `string`, and `bool`; define `null` as a nullable-position literal and `int`/`uint`/`float` as automatically selected numeric representations.
- [ ] **SYN-TYP-002 · v0** — Define record/structured-value type syntax, field names, field order, and duplicate-field diagnostics.
- [ ] **SYN-TYP-003 · v0** — Define homogeneous collection type syntax and whether collection order is part of the type contract.
- [ ] **SYN-TYP-004 · v0** — Define postfix type nullability (`T?`) including nested positions; make required/defaulted and nullable/non-nullable independent field axes; define omission without an optional-field modifier or `absent` value.
- [ ] **SYN-TYP-005 · v0** — Define named type and schema references with vocabulary/package qualification.
- [ ] **SYN-TYP-006 · v0** — Define opaque vocabulary-owned types that remain inspectable and versioned without exposing consumer semantics.
- [ ] **SYN-TYP-007 · v1** — Define tagged-alternative/union syntax with exhaustive tag identity and unknown-tag behavior.
- [ ] **SYN-TYP-008 · v1** — Decide whether tuple types add value beyond named records and define them only if the corpora justify positional data.
- [ ] **SYN-TYP-009 · v1** — Define map, set, and other keyed collection types, including key restrictions, ordering, and duplicate semantics.
- [ ] **SYN-TYP-010 · v1** — Define type aliases and ensure they do not create accidental new identity.
- [ ] **SYN-TYP-011 · v1** — Define typed parameterization/generic notation with explicit bounds and no implicit higher-kinded system.
- [ ] **SYN-TYP-012 · v2** — Define constrained numeric, text, collection, or record types and identify which constraints the compiler can decide.
- [ ] **SYN-TYP-013 · v2** — Define recursive-type notation only if bounded validation and real cross-domain examples justify it; otherwise reject it explicitly.
- [ ] **SYN-TYP-014 · v2** — Define operation-signature types separately from general-purpose first-class function types.

## 6. Literal values and value construction

- [ ] **SYN-VAL-001 · v0** — Define scalar literal construction and overflow, precision, and invalid-literal diagnostics.
- [ ] **SYN-VAL-002 · v0** — Define contextual record construction (`Type name = { ... }`), require exactly one expected nominal type, and define fields, trailing separators, and duplicate diagnostics.
- [ ] **SYN-VAL-003 · v0** — Define ordered collection value construction and empty-collection type disambiguation.
- [ ] **SYN-VAL-004 · v0** — Define `null` as the only explicit source null/empty literal and distinguish it from structural omission/default application and unavailable/deferred results.
- [ ] **SYN-VAL-005 · v0** — Define symbolic reference values as syntax distinct from ordinary text and restrict targets to value bindings.
- [ ] **SYN-VAL-006 · v0** — Define `.` selection of inert vocabulary-owned static values such as enum cases, without unscoped strings, functions, computed properties, or general value member access.
- [ ] **SYN-VAL-007 · v0** — Apply contextual construction to vocabulary-owned typed values and define schema-linked diagnostics.
- [ ] **SYN-VAL-008 · v0** — Define whether record-field shorthand exists and prevent it from obscuring the referenced binding.
- [ ] **SYN-VAL-009 · v1** — Define map and set value construction with deterministic duplicate and ordering behavior.
- [ ] **SYN-VAL-010 · v1** — Define `.` member selection and indexing on structured symbolic values without reusing `::` or implying runtime availability.
- [ ] **SYN-VAL-011 · v1** — Define collection/record spread or merge notation together with explicit conflict precedence.
- [ ] **SYN-VAL-012 · v1** — Define multiline structured values and delimiter elision rules without indentation ambiguity.
- [ ] **SYN-VAL-013 · v1** — Define duration, timestamp, path, URI, digest, and similar values as typed constructors or domain types rather than ambiguous magic strings.
- [ ] **SYN-VAL-014 · v2** — Define update/copy construction for immutable values and its provenance behavior.
- [ ] **SYN-VAL-015 · v2** — Decide whether comprehensions exist or whether bounded expansion syntax fully replaces them.
- [ ] **SYN-VAL-016 · v2** — Define source rendering for unknown or opaque schema-designated ignorable non-behavioral values without pretending the compiler understands them.

## 7. References and structural relationships

- [ ] **SYN-REF-001 · v0** — Define unambiguous `ref(...)` syntax that links value-binding identity rather than evaluating or snapshotting a value.
- [ ] **SYN-REF-002 · v0** — Define local, qualified, and cross-source reference resolution; reject types, records, namespaces, modules, and vocabularies as wrong-kind targets.
- [ ] **SYN-REF-003 · v0** — Define containment versus reference syntax so layout is not mistaken for ownership.
- [ ] **SYN-REF-004 · v0** — Define typed domain relationship declarations without assigning graph or execution meaning in core.
- [ ] **SYN-REF-005 · v1** — Define one-to-many and many-to-many relationship construction without string lists.
- [ ] **SYN-REF-006 · v1** — Define references to declared fields/results with static kind and availability diagnostics.
- [ ] **SYN-REF-007 · v1** — Define alias and re-export reference display while retaining the authoritative target identity.
- [ ] **SYN-REF-008 · v2** — Define immutable cross-document references, if supported, without accepting a mutable URL as identity.

## 8. Composition, reuse, and expansion

- [ ] **SYN-CMP-001 · v1** — Define reusable component declaration syntax independently from Flow templates or Neux scripts.
- [ ] **SYN-CMP-002 · v1** — Define component application with named typed arguments and explicit missing/extra argument diagnostics.
- [ ] **SYN-CMP-003 · v1** — Define result exposure from a component without leaking compiler-internal generated names.
- [ ] **SYN-CMP-004 · v1** — Define default and override syntax with deterministic precedence and origin tracking.
- [ ] **SYN-CMP-005 · v1** — Define explicit inclusion/composition rather than textual macro substitution.
- [ ] **SYN-CMP-006 · v1** — Define bounded collection-based expansion that is not named after a Flow matrix.
- [ ] **SYN-CMP-007 · v1** — Define expansion additions, exclusions, and filters as typed data/expressions with deterministic ordering.
- [ ] **SYN-CMP-008 · v1** — Define how syntax reveals whether expansion occurs in the compiler or is retained for a named consumer.
- [ ] **SYN-CMP-009 · v2** — Define composition conflict resolution without hidden import-order or traversal-order precedence.
- [ ] **SYN-CMP-010 · v2** — Decide whether recursive composition exists; if it does, expose termination/depth constraints, otherwise reject it explicitly.
- [ ] **SYN-CMP-011 · v2** — Define stable author-facing handles for generated elements without promising stability across behavior-changing derivations.
- [ ] **SYN-CMP-012 · v2** — Define conditional structural inclusion separately from runtime execution conditions.

## 9. Structured symbolic expressions

- [ ] **SYN-EXP-001 · v1** — Define expressions as structured syntax that lowers to typed IR nodes, never opaque source strings for reparsing.
- [ ] **SYN-EXP-002 · v1** — Define namespace-owned operation/function references with `::`, member calls with `.`, and captured vocabulary owner/behavior version.
- [ ] **SYN-EXP-003 · v1** — Define call/application syntax and named versus positional argument policy.
- [ ] **SYN-EXP-004 · v1** — Define grouping and precedence so no expression meaning depends on parser folklore.
- [ ] **SYN-EXP-005 · v1** — Define boolean, comparison, and conditional-expression forms together with owning behavior contracts.
- [ ] **SYN-EXP-006 · v1** — Define how known, `null`, deferred, unavailable, failed, and indeterminate values can be distinguished where a vocabulary supports them.
- [ ] **SYN-EXP-007 · v1** — Define explicit references to earlier/domain-produced results without claiming the result exists at compile time.
- [ ] **SYN-EXP-008 · v1** — Define the syntax boundary between compiler-evaluable pure core operations and consumer-evaluated domain operations.
- [ ] **SYN-EXP-009 · v2** — Define short-circuit behavior notation or make it entirely part of an identified operation contract.
- [ ] **SYN-EXP-010 · v2** — Define tagged-pattern selection/matching only if it improves exhaustive handling of typed alternatives.
- [ ] **SYN-EXP-011 · v2** — Define bounded collection transformation operations without adding unbounded general-purpose loops.
- [ ] **SYN-EXP-012 · v2** — Decide whether anonymous functions/closures are excluded or admit only a bounded, serializable form justified by both domains.
- [ ] **SYN-EXP-013 · v2** — Define explicit coercion/conversion syntax; prohibit silent host-language coercion.
- [ ] **SYN-EXP-014 · v2** — Define expression failure and missing-value handling without adding general-purpose exceptions.

## 10. Domain vocabulary surface

- [ ] **SYN-DOM-001 · v0** — Define vocabulary-owned declarations through ordinary type-first bindings whose types use a namespace introduced by `use`; do not add a special domain-declaration production.
- [ ] **SYN-DOM-002 · v0** — Define how `use Vocabulary` names a logical vocabulary while the captured lock manifest pins its exact identity, digest, schema version, behavior version, and supported features; derive required features from the vocabulary members actually used.
- [ ] **SYN-DOM-003 · v0** — Separate `use` requirements from caller lock/policy so source cannot fetch, select “latest,” or activate an unapproved vocabulary.
- [ ] **SYN-DOM-004 · v0** — Require vocabulary fields to use the same independent presence/default, nullability, and behavioral-classification axes as Neutral record fields; do not create a second “optional field” notion.
- [ ] **SYN-DOM-005 · v0** — Define domain fields, nodes, and values using core typed forms rather than a schema-less extension bag.
- [ ] **SYN-DOM-006 · v0** — Define diagnostics for unknown vocabulary use names/types, lock-resolution failures, unsupported used features, invalid contextual payloads, and types used in disallowed scopes.
- [ ] **SYN-DOM-007 · v1** — Define domain operation construction/invocation without granting it compiler execution authority.
- [ ] **SYN-DOM-008 · v1** — Define vocabulary-qualified relationships, annotations, and result shapes.
- [ ] **SYN-DOM-009 · v1** — Define preservation of explicitly ignorable opaque non-behavioral payloads, if supported, and prohibit opaque required behavior.
- [ ] **SYN-DOM-010 · v1** — Define vocabulary dependency and compatibility declarations without implicit network resolution.
- [ ] **SYN-DOM-011 · v2** — Define syntax for controlled vocabulary deprecation and migration hints without silently rewriting meaning.
- [ ] **SYN-DOM-012 · v2** — Define how provider-specific Flow extensions remain visibly Flow-owned and never appear as Neutral core constructs.

## 11. Contracts, capabilities, and effects

- [ ] **SYN-CTR-001 · v1** — Define operation input, output, and declared error-shape syntax.
- [ ] **SYN-CTR-002 · v1** — Define required capabilities separately from optional preferences.
- [ ] **SYN-CTR-003 · v1** — Define quantitative capability qualifiers as typed values rather than feature-name strings.
- [ ] **SYN-CTR-004 · v1** — Define availability-stage declarations without embedding Flow-specific stage names in core syntax.
- [ ] **SYN-CTR-005 · v1** — Define determinism, purity, and declared-effect annotations with explicit vocabulary ownership.
- [ ] **SYN-CTR-006 · v1** — Define opaque-operation syntax so missing inspectability never means “no effects” or “no permissions.”
- [ ] **SYN-CTR-007 · v2** — Define permission, confidentiality, isolation, and resource-requirement declarations as domain-owned contracts, not authority grants.
- [ ] **SYN-CTR-008 · v2** — Define author-declared versus compiler-derived versus vocabulary-derived requirement provenance.
- [ ] **SYN-CTR-009 · v2** — Define contract conflict and override notation without resolving conflicts by textual order.
- [ ] **SYN-CTR-010 · v2** — Define result availability and failure contracts needed by consumers without defining their runtime lifecycle in Neutral.

## 12. Security-sensitive syntax

- [ ] **SYN-SEC-001 · v0** — Define contextually typed opaque `secret_ref(...)`, require exactly one expected `SecretRef<T>` delivery shape, and prohibit resolved secret material from Neutral IR and derivation records.
- [ ] **SYN-SEC-002 · v0** — Ensure secret references are not ordinary strings that can be interpolated or printed accidentally.
- [ ] **SYN-SEC-003 · v0** — Prohibit source constructs that execute native code, shell code, provider code, or vocabulary plugins during parsing or validation.
- [ ] **SYN-SEC-004 · v0** — Make all import/profile acquisition explicit through the supplied resolver; define no ambient network or filesystem include syntax.
- [ ] **SYN-SEC-005 · v0** — Define safe diagnostics for sensitive literals, annotations, paths, and source excerpts.
- [ ] **SYN-SEC-006 · v0** — Define deterministic lexical/structural limits so pathological source fails predictably, while keeping hardware-dependent deadlines and memory ceilings in named implementation profiles.
- [ ] **SYN-SEC-007 · v1** — Define raw command, shell, template, or foreign-text blocks only as typed domain data with no compiler execution or universal escaping claim.
- [ ] **SYN-SEC-008 · v1** — State that capability, trust, signer, or policy annotations express claims and never grant authority by syntax alone.
- [ ] **SYN-SEC-009 · v1** — Define safe handling of bidirectional controls, invisible characters, and confusable identifiers in tools and diagnostics.
- [ ] **SYN-SEC-010 · v2** — Define syntax-level redaction and disclosure annotations without allowing authors to weaken mandatory host security policy.

## 13. Diagnostics and invalid/incomplete syntax

- [ ] **SYN-DIA-001 · v0** — Assign stable diagnostic categories for invalid tokens, malformed constructs, unresolved names, wrong kinds, and invalid domain payloads.
- [ ] **SYN-DIA-002 · v0** — Define source-span units and behavior for Unicode, tabs, line endings, and invalid text.
- [ ] **SYN-DIA-003 · v0** — Define parser recovery boundaries so one error does not silently reinterpret following declarations.
- [ ] **SYN-DIA-004 · v0** — Define deterministic diagnostic ordering and a bounded “too many errors” result.
- [ ] **SYN-DIA-005 · v0** — Define diagnostics for ambiguous parses rather than choosing meaning from whitespace or recovery heuristics.
- [ ] **SYN-DIA-006 · v0** — Require every syntax feature to include valid, invalid, boundary, and misleading-lookalike examples.
- [ ] **SYN-DIA-007 · v1** — Define origin stacks for imported, composed, defaulted, overridden, and expanded syntax.
- [ ] **SYN-DIA-008 · v1** — Define how a consumer diagnostic names an IR element and maps back to the responsible `.neu` construct.
- [ ] **SYN-DIA-009 · v1** — Define scoped diagnostic/lint suppression, if supported, and prohibit suppression of validity or security failures.
- [ ] **SYN-DIA-010 · v2** — Define incomplete-document behavior for editors separately from authoritative compilation acceptance.

## 14. Documentation, formatting, and tools

- [ ] **SYN-TOL-001 · v0** — State that `//` and `/// ... ///` are non-semantic comments and that v0 has no documentation-attachment syntax.
- [ ] **SYN-TOL-002 · v0** — Define a single formatter's stable output policy without claiming formatted source is canonical IR identity.
- [ ] **SYN-TOL-003 · v1** — Define comment preservation and stable placement across formatting and source-to-source migrations without making comments semantic attachments.
- [ ] **SYN-TOL-004 · v1** — Define syntax-tree ranges and identities needed by editors without exposing compiler-private tree layout as public IR.
- [ ] **SYN-TOL-005 · v1** — Define completion and hover boundaries for core versus domain-vocabulary constructs.
- [ ] **SYN-TOL-006 · v1** — Define how a future GUI emits readable `.neu` and preserves only valid, non-authoritative presentation metadata.
- [ ] **SYN-TOL-007 · v2** — Define generated-source markers and provenance without allowing generated text to bypass ordinary compilation.
- [ ] **SYN-TOL-008 · v2** — Define loss-reporting and human-review requirements for automated syntax migrations.

## 15. Evolution and conformance

- [ ] **SYN-EVO-001 · v0** — Publish an unambiguous grammar notation and precedence specification independent from one parser implementation.
- [ ] **SYN-EVO-002 · v0** — Create positive, negative, ambiguity, and resource-limit fixtures for every v0 syntax decision.
- [ ] **SYN-EVO-003 · v0** — Require source-to-IR provenance and public-reader conformance for accepted v0 syntax.
- [ ] **SYN-EVO-004 · v1** — Define feature negotiation for additive syntax and ensure old compilers reject unsupported required features.
- [ ] **SYN-EVO-005 · v1** — Define deprecation annotations, warnings, removal policy, and migration guidance.
- [ ] **SYN-EVO-006 · v1** — Maintain cross-version fixtures showing when old source is accepted, rejected, or migrated with loss.
- [ ] **SYN-EVO-007 · v1** — Test parser and formatter idempotence and ensure formatting does not change logical IR.
- [ ] **SYN-EVO-008 · v2** — Define the reserved grammar and namespace strategy for post-v2 evolution.
- [ ] **SYN-EVO-009 · v2** — Require differential/fuzz testing for lexer, parser, formatter, and source-map behavior across independent implementations where available.
- [ ] **SYN-EVO-010 · v2** — Define the v2 syntax stability promise independently from IR, encoding, compiler API, consumer API, and vocabulary version promises.

## Explicit syntax non-goals

The fully fledged checklist does not presume that Neutral needs mutable state,
general-purpose loops, exceptions, threads, arbitrary I/O, native foreign
functions, a shell evaluator, provider credentials, runtime scheduling, or
deployment control. If any such feature is ever proposed, it requires a new
cross-domain problem statement, security analysis, ownership decision, and
rejection of safer domain-owned alternatives before syntax design begins.
