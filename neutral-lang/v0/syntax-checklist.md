# Neutral language v0 syntax checklist

Status: proposed incremental checklist

Scope: v0 establishes the smallest safe, effect-free authoring surface that can compile into public Neutral IR and be consumed through the public reader API.

Authoritative master: [../syntax.md](../syntax.md)

Editable authoring proposal:
[proposed v0 syntax guide](proposed-syntax-guide.md).

Checking an item means the syntax question has a normative answer, examples,
invalid cases, diagnostics, and conformance fixtures—not merely one accepted
parser example.

## 1. Governing syntax boundaries

Proposed answers: [governing-boundary decisions](decisions/01-governing-boundaries.md).

- [ ] **SYN-GOV-001 · v0** — Define the boundary between concrete `.neu` syntax, the compiler's private syntax tree, the public logical IR, and consumer-private models.
- [ ] **SYN-GOV-002 · v0** — Require every accepted surface construct to lower into a documented logical model with source provenance.
- [ ] **SYN-GOV-003 · v0** — Establish the two-corpus rule before adding a Flow- or Neux-shaped construct to Neutral core syntax.
- [ ] **SYN-GOV-004 · v0** — Specify which syntax is Neutral core and which syntax is introduced by an explicitly selected domain vocabulary.
- [ ] **SYN-GOV-005 · v0** — State that syntax acceptance never implies authorization, execution, provider support, or successful external effects.
- [ ] **SYN-GOV-006 · v0** — Define the normative-specification, examples, invalid-fixture, and diagnostic evidence required to call a syntax decision complete.

## 2. Lexical and source-text rules

Proposed answers: [lexical and source-text decisions](decisions/02-lexical-source-text.md).

- [ ] **SYN-LEX-001 · v0** — Specify accepted source encodings, byte-order-mark handling, invalid byte behavior, and line-ending normalization.
- [ ] **SYN-LEX-002 · v0** — Define whitespace, indentation significance or insignificance, statement separation, and permitted line continuation.
- [ ] **SYN-LEX-003 · v0** — Define line comments, block comments if present, nesting behavior, and unterminated-comment diagnostics.
- [ ] **SYN-LEX-004 · v0** — Define ASCII identifiers; require strict `snake_case` for bindings, fields, namespace/module segments, and static values, and `UpperCamelCase` for record/types and vocabulary namespaces; define underscore placement, case, Unicode, and confusable diagnostics.
- [ ] **SYN-LEX-005 · v0** — Define reserved/contextual words; give `::` the sole meaning of namespace/module/vocabulary qualification and restrict `.` in v0 to vocabulary-owned enum cases or static members, excluding general value member access.
- [ ] **SYN-LEX-006 · v0** — Define delimiter pairs, separators, logical-newline and closing-brace termination, and trailing-separator rules; `.neu` has no semicolon terminator.
- [ ] **SYN-LEX-007 · v0** — Define ordinary text literals, escapes, invalid escape handling, and Unicode scalar behavior.
- [ ] **SYN-LEX-008 · v0** — Define `num`, `string`, `bool`, and `null` spellings without inheriting host-language range or precision rules; v0 has no second `absent` value.

## 3. Documents, modules, imports, and profiles

Proposed answers: [document and profile decisions](decisions/03-documents-modules-profiles.md).

- [ ] **SYN-DOC-001 · v0** — Require every source unit to declare its exact `.neu` language-behavior version and reject mixed versions in one v0 compilation closure.
- [ ] **SYN-DOC-002 · v0** — Define the top-level document shape and whether declarations, values, or both may appear at the root.
- [ ] **SYN-DOC-003 · v0** — Define `use Vocabulary` (for example, `use Flow`) as a vocabulary namespace import resolved only through the compilation request's exact captured lock manifest.
- [ ] **SYN-DOC-004 · v0** — Define module/package names independently from paths, URLs, mutable tags, and display labels; merge same-module units only within one captured package and reject cross-unit or cross-package collisions.

## 4. Declarations, bindings, and names

Proposed answers: [declaration and binding decisions](decisions/04-declarations-bindings-names.md).

- [ ] **SYN-DEC-001 · v0** — Define the common shape of a named declaration and the distinction between stable machine identity and display name.
- [ ] **SYN-DEC-002 · v0** — Define type-first binding syntax without `let`; keep `mut` provisional, and if retained restrict reassignment to the declaring source unit so merged modules do not acquire cross-file order.
- [ ] **SYN-DEC-003 · v0** — Define explicit type/schema annotations and the limited positions, if any, where type inference is permitted.
- [ ] **SYN-DEC-004 · v0** — Represent vocabulary-owned declarations as ordinary type-first bindings such as `Flow::Pipeline verify = { ... }`, without vocabulary names or a special declaration-kind production in Neutral core.
- [ ] **SYN-DEC-005 · v0** — Define namespace declaration and qualification syntax.
- [ ] **SYN-DEC-006 · v0** — Define duplicate declaration, shadowing, and reserved-name diagnostics.
- [ ] **SYN-DEC-007 · v0** — Define forward references and initialization cycles: reject direct value cycles, allow cycles consisting only of `Ref<T>` links, and ensure source order is not accidental execution order.

## 5. Type and schema notation

Proposed answers: [type and schema decisions](decisions/05-type-schema-notation.md).

- [ ] **SYN-TYP-001 · v0** — Define the primitive scalar set as `num`, `string`, and `bool`; define `null` as a nullable-position literal and `int`/`uint`/`float` as automatically selected numeric representations.
- [ ] **SYN-TYP-002 · v0** — Define record/structured-value type syntax, field names, field order, and duplicate-field diagnostics.
- [ ] **SYN-TYP-003 · v0** — Define homogeneous collection type syntax and whether collection order is part of the type contract.
- [ ] **SYN-TYP-004 · v0** — Define postfix type nullability (`T?`) including nested positions; make required/defaulted and nullable/non-nullable independent field axes; define omission without an optional-field modifier or `absent` value.
- [ ] **SYN-TYP-005 · v0** — Define named type and schema references with vocabulary/package qualification.
- [ ] **SYN-TYP-006 · v0** — Define opaque vocabulary-owned types that remain inspectable and versioned without exposing consumer semantics.

## 6. Literal values and value construction

Proposed answers: [literal and value decisions](decisions/06-literal-values.md).

- [ ] **SYN-VAL-001 · v0** — Define scalar literal construction and overflow, precision, and invalid-literal diagnostics.
- [ ] **SYN-VAL-002 · v0** — Define contextual record construction (`Type name = { ... }`), require exactly one expected nominal type, and define fields, trailing separators, and duplicate diagnostics.
- [ ] **SYN-VAL-003 · v0** — Define ordered collection value construction and empty-collection type disambiguation.
- [ ] **SYN-VAL-004 · v0** — Define `null` as the only explicit source null/empty literal and distinguish it from structural omission/default application and unavailable/deferred results.
- [ ] **SYN-VAL-005 · v0** — Define symbolic reference values as syntax distinct from ordinary text and restrict targets to value bindings.
- [ ] **SYN-VAL-006 · v0** — Define `.` selection of inert vocabulary-owned static values such as enum cases, without unscoped strings, functions, computed properties, or general value member access.
- [ ] **SYN-VAL-007 · v0** — Apply contextual construction to vocabulary-owned typed values and define schema-linked diagnostics.
- [ ] **SYN-VAL-008 · v0** — Define whether record-field shorthand exists and prevent it from obscuring the referenced binding.

## 7. References and structural relationships

Proposed answers: [reference and relationship decisions](decisions/07-references-relationships.md).

- [ ] **SYN-REF-001 · v0** — Define unambiguous `ref(...)` syntax that links value-binding identity rather than evaluating or snapshotting a value.
- [ ] **SYN-REF-002 · v0** — Define local, qualified, and cross-source reference resolution; reject types, records, namespaces, modules, and vocabularies as wrong-kind targets.
- [ ] **SYN-REF-003 · v0** — Define containment versus reference syntax so layout is not mistaken for ownership.
- [ ] **SYN-REF-004 · v0** — Define typed domain relationship declarations without assigning graph or execution meaning in core.

## 10. Domain vocabulary surface

Proposed answers: [domain-vocabulary decisions](decisions/10-domain-vocabulary.md).

- [ ] **SYN-DOM-001 · v0** — Define vocabulary-owned declarations through ordinary type-first bindings whose types use a namespace introduced by `use`; do not add a special domain-declaration production.
- [ ] **SYN-DOM-002 · v0** — Define how `use Vocabulary` names a logical vocabulary while the captured lock manifest pins its exact identity, digest, schema version, behavior version, and supported features; derive required features from the vocabulary members actually used.
- [ ] **SYN-DOM-003 · v0** — Separate `use` requirements from caller lock/policy so source cannot fetch, select “latest,” or activate an unapproved vocabulary.
- [ ] **SYN-DOM-004 · v0** — Require vocabulary fields to use the same independent presence/default, nullability, and behavioral-classification axes as Neutral record fields; do not create a second “optional field” notion.
- [ ] **SYN-DOM-005 · v0** — Define domain fields, nodes, and values using core typed forms rather than a schema-less extension bag.
- [ ] **SYN-DOM-006 · v0** — Define diagnostics for unknown vocabulary use names/types, lock-resolution failures, unsupported used features, invalid contextual payloads, and types used in disallowed scopes.

## 12. Security-sensitive syntax

Proposed answers: [security-sensitive syntax decisions](decisions/12-security-sensitive-syntax.md).

- [ ] **SYN-SEC-001 · v0** — Define contextually typed opaque `secret_ref(...)`, require exactly one expected `SecretRef<T>` delivery shape, and prohibit resolved secret material from Neutral IR and derivation records.
- [ ] **SYN-SEC-002 · v0** — Ensure secret references are not ordinary strings that can be interpolated or printed accidentally.
- [ ] **SYN-SEC-003 · v0** — Prohibit source constructs that execute native code, shell code, provider code, or vocabulary plugins during parsing or validation.
- [ ] **SYN-SEC-004 · v0** — Make all import/profile acquisition explicit through the supplied resolver; define no ambient network or filesystem include syntax.
- [ ] **SYN-SEC-005 · v0** — Define safe diagnostics for sensitive literals, annotations, paths, and source excerpts.
- [ ] **SYN-SEC-006 · v0** — Define deterministic lexical/structural limits so pathological source fails predictably, while keeping hardware-dependent deadlines and memory ceilings in named implementation profiles.

## 13. Diagnostics and invalid/incomplete syntax

Proposed answers: [diagnostic decisions](decisions/13-diagnostics-invalid-syntax.md).

- [ ] **SYN-DIA-001 · v0** — Assign stable diagnostic categories for invalid tokens, malformed constructs, unresolved names, wrong kinds, and invalid domain payloads.
- [ ] **SYN-DIA-002 · v0** — Define source-span units and behavior for Unicode, tabs, line endings, and invalid text.
- [ ] **SYN-DIA-003 · v0** — Define parser recovery boundaries so one error does not silently reinterpret following declarations.
- [ ] **SYN-DIA-004 · v0** — Define deterministic diagnostic ordering and a bounded “too many errors” result.
- [ ] **SYN-DIA-005 · v0** — Define diagnostics for ambiguous parses rather than choosing meaning from whitespace or recovery heuristics.
- [ ] **SYN-DIA-006 · v0** — Require every syntax feature to include valid, invalid, boundary, and misleading-lookalike examples.

## 14. Documentation, formatting, and tools

Proposed answers: [documentation and formatter decisions](decisions/14-documentation-formatting-tools.md).

- [ ] **SYN-TOL-001 · v0** — State that `//` and `/// ... ///` are non-semantic comments and that v0 has no documentation-attachment syntax.
- [ ] **SYN-TOL-002 · v0** — Define a single formatter's stable output policy without claiming formatted source is canonical IR identity.

## 15. Evolution and conformance

Proposed answers: [evolution and conformance decisions](decisions/15-evolution-conformance.md).

- [ ] **SYN-EVO-001 · v0** — Publish an unambiguous grammar notation and precedence specification independent from one parser implementation.
- [ ] **SYN-EVO-002 · v0** — Create positive, negative, ambiguity, and resource-limit fixtures for every v0 syntax decision.
- [ ] **SYN-EVO-003 · v0** — Require source-to-IR provenance and public-reader conformance for accepted v0 syntax.

## Version completion rule

v0 syntax is complete only when every checked decision has normative prose, valid and invalid fixtures, deterministic diagnostics, source-to-IR provenance, and one effect-free consumer case.
