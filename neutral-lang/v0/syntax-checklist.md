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
- [ ] **SYN-LEX-002 · v0** — Define whitespace, indentation, statement separation, and line continuation through explicit raw-lexer, newline/layout-normalization, and parser stages.
- [ ] **SYN-LEX-003 · v0** — Define line comments, block comments if present, nesting behavior, and unterminated-comment diagnostics.
- [ ] **SYN-LEX-004 · v0** — Define ASCII identifiers; require strict `snake_case` for bindings, fields, namespaces, module names, and static values; require uppercase-leading names with `UpperCamelCase` as the style for record/types and vocabulary namespaces; define underscore placement, case, Unicode, and confusable diagnostics.
- [ ] **SYN-LEX-005 · v0** — Define reserved/contextual words; use `::` only for namespaces in the current module and vocabulary qualification, never module paths, and restrict `.` to vocabulary-owned static values.
- [ ] **SYN-LEX-006 · v0** — Define delimiter pairs, separators, logical-newline and closing-brace termination, and trailing-separator rules; `.neu` has no semicolon terminator.
- [ ] **SYN-LEX-007 · v0** — Define ordinary text literals, escapes, invalid escape handling, and Unicode scalar behavior.
- [ ] **SYN-LEX-008 · v0** — Define `num`, `string`, `bool`, and `null` spellings without inheriting host-language range or precision rules; v0 has no second `absent` value.

## 3. Documents, modules, imports, and profiles

Proposed answers: [document and profile decisions](decisions/03-documents-modules-profiles.md).

- [ ] **SYN-DOC-001 · v0** — Require canonical `major.minor` language-version syntax, accept exactly `"0.1"` in v0, and reject escapes, alternate spellings, ranges, and mixed closure versions.
- [ ] **SYN-DOC-002 · v0** — Define the top-level document shape and whether declarations, values, or both may appear at the root.
- [ ] **SYN-DOC-003 · v0** — Define `use Vocabulary` as an exact captured vocabulary namespace import whose name is reserved across the merged module and whose repeated uses resolve identically.
- [ ] **SYN-DOC-004 · v0** — Use one `snake_case` module name, limit a v0 request to one module/package identity, merge units deterministically, prohibit module-qualified access, and reject namespace reopening across units.
- [ ] **SYN-DOC-007 · v0** — Define private-by-default `pub` visibility for records, bindings, and namespaces, public-container and public-signature validity, and exported IR/documentation without treating visibility as authorization.

## 4. Declarations, bindings, and names

Proposed answers: [declaration and binding decisions](decisions/04-declarations-bindings-names.md).

- [ ] **SYN-DEC-001 · v0** — Define the common shape of a named declaration and the distinction between stable machine identity and display name.
- [ ] **SYN-DEC-002 · v0** — Define immutable type-first binding syntax without `let`; exclude `mut` and every reassignment form from v0, and prioritize immutable derivation/composition and explicit override before investigating mutation.
- [ ] **SYN-DEC-003 · v0** — Define explicit type/schema annotations and the limited positions, if any, where type inference is permitted.
- [ ] **SYN-DEC-004 · v0** — Represent vocabulary-owned declarations as ordinary type-first bindings such as `Flow::Pipeline verify = { ... }`, without vocabulary names or a special declaration-kind production in Neutral core.
- [ ] **SYN-DEC-005 · v0** — Define namespace declaration and qualification syntax.
- [ ] **SYN-DEC-006 · v0** — Define duplicate declaration and shadowing diagnostics; protect predeclared core names in every scope.
- [ ] **SYN-DEC-007 · v0** — Allow forward ordinary immutable value uses and forward `ref(...)` identity links; reject static value-dependency cycles while excluding `ref(...)` edges, and require every recursive record cycle to cross `Ref<T>`.

## 5. Type and schema notation

Proposed answers: [type and schema decisions](decisions/05-type-schema-notation.md).

- [ ] **SYN-TYP-001 · v0** — Define the primitive scalar set as `num`, `string`, and `bool`; represent source `num` as an exact host-independent base-10 rational, and require numeric contracts to define exact or deterministic IEEE rounding behavior.
- [ ] **SYN-TYP-002 · v0** — Define record syntax, field names/order/duplicates, and that fields have no independent visibility: every field of an accessible record is visible contract structure.
- [ ] **SYN-TYP-003 · v0** — Define homogeneous collection type syntax and whether collection order is part of the type contract.
- [ ] **SYN-TYP-004 · v0** — Define postfix type nullability (`T?`) including nested positions; make required/defaulted and nullable/non-nullable independent field axes; restrict user-record defaults to closed constants, and define omission without an optional-field modifier or `absent` value.
- [ ] **SYN-TYP-005 · v0** — Define local/namespace/vocabulary named types and exact type compatibility with only outer `T` to `T?` widening; keep generic arguments invariant and exclude source-module qualification.
- [ ] **SYN-TYP-006 · v0** — Define opaque vocabulary-owned types that remain inspectable and versioned without exposing consumer semantics.

## 6. Literal values and value construction

Proposed answers: [literal and value decisions](decisions/06-literal-values.md).

- [ ] **SYN-VAL-001 · v0** — Define scalar construction and separate exact logical `num`, contract lowering, and encoded target representation so rounding never replaces the IR value.
- [ ] **SYN-VAL-002 · v0** — Define contextual record construction (`Type name = { ... }`), require exactly one expected nominal type, and define fields, trailing separators, and duplicate diagnostics.
- [ ] **SYN-VAL-003 · v0** — Define ordered collection value construction and empty-collection type disambiguation.
- [ ] **SYN-VAL-004 · v0** — Define `null` as the only explicit source null/empty literal and distinguish it from structural omission/default application and unavailable/deferred results.
- [ ] **SYN-VAL-005 · v0** — Define ordinary binding names as immutable value uses in compatible value positions and `ref(...)` as a distinct symbolic identity link; restrict both target forms to value bindings.
- [ ] **SYN-VAL-006 · v0** — Define `.` selection only when its left side resolves to a vocabulary-owned type declaring the named inert static value; exclude user-record statics, unscoped strings, functions, computed properties, and general value member access.
- [ ] **SYN-VAL-007 · v0** — Apply contextual construction to immutable copyable vocabulary-owned data; define distinct copied declaration identity, reuse provenance, constant-safe static defaults, and schema-linked diagnostics.
- [ ] **SYN-VAL-008 · v0** — Define whether record-field shorthand exists and prevent it from obscuring the referenced binding.

## 7. References and structural relationships

Proposed answers: [reference and relationship decisions](decisions/07-references-relationships.md).

- [ ] **SYN-REF-001 · v0** — Define unambiguous `ref(...)` syntax that links value-binding identity rather than evaluating or snapshotting a value.
- [ ] **SYN-REF-002 · v0** — Define local and current-module namespace reference resolution across merged units; prohibit module-qualified and cross-module targets, and reject types, records, namespaces, modules, and vocabularies as wrong-kind targets.
- [ ] **SYN-REF-003 · v0** — Define `Ref<T>` as identity-only IR; prohibit inferred containment, ownership, dependency, or order without an explicit domain-owned relationship.
- [ ] **SYN-REF-004 · v0** — Define typed domain relationship declarations without assigning graph or execution meaning in core.

## 10. Domain vocabulary surface

Proposed answers: [domain-vocabulary decisions](decisions/10-domain-vocabulary.md).

- [ ] **SYN-DOM-001 · v0** — Define vocabulary declarations plus a fixed Neutral-owned closed declarative bundle schema; prohibit scripts, callbacks, arbitrary expressions, custom validators, and executable code.
- [ ] **SYN-DOM-002 · v0** — Pin exact vocabulary identity/version and compute a transitive feature closure through members, fields, nested types, defaults, static values, constraints, behaviors, and feature dependencies.
- [ ] **SYN-DOM-003 · v0** — Separate `use` requirements from caller lock/policy so source cannot fetch, select “latest,” or activate an unapproved vocabulary.
- [ ] **SYN-DOM-004 · v0** — Define vocabulary presence/nullability/behavior axes and provenance distinguishing source values, record defaults, vocabulary defaults, and behavior introduced by defaults.
- [ ] **SYN-DOM-005 · v0** — Define domain fields, nodes, and values using core typed forms rather than a schema-less extension bag.
- [ ] **SYN-DOM-006 · v0** — Define diagnostics for unknown vocabulary use names/types, lock-resolution failures, unsupported used features, invalid contextual payloads, and types used in disallowed scopes.

## 12. Security-sensitive syntax

Proposed answers: [security-sensitive syntax decisions](decisions/12-security-sensitive-syntax.md).

- [ ] **SYN-SEC-001 · v0** — Define opaque `SecretRef<T>`, separate well-formed type arguments from profile/broker deliverability, and prohibit resolved secret material from Neutral IR.
- [ ] **SYN-SEC-002 · v0** — Ensure secret references are not ordinary strings that can be interpolated or printed accidentally.
- [ ] **SYN-SEC-003 · v0** — Prohibit source constructs that execute native code, shell code, provider code, or vocabulary plugins during parsing or validation.
- [ ] **SYN-SEC-004 · v0** — Make all import/profile acquisition explicit through the supplied resolver; define no ambient network or filesystem include syntax.
- [ ] **SYN-SEC-005 · v0** — Define safe diagnostics for sensitive literals, annotations, paths, and source excerpts.
- [ ] **SYN-SEC-006 · v0** — Define profile-controlled lexical, numeric-significant-digit, decimal-scale, and structural limits checked before expensive work, while keeping hardware-dependent deadlines and memory ceilings in named implementation profiles.

## 13. Diagnostics and invalid/incomplete syntax

Proposed answers: [diagnostic decisions](decisions/13-diagnostics-invalid-syntax.md).

- [ ] **SYN-DIA-001 · v0** — Assign direct `NL-<CLASS>-<ID>` diagnostic categories for encoding, syntax, names, kinds, types, vocabularies, features, limits, and internal defects.
- [ ] **SYN-DIA-002 · v0** — Define source-span units and behavior for Unicode, tabs, line endings, and invalid text.
- [ ] **SYN-DIA-003 · v0** — Define parser recovery boundaries so one error does not silently reinterpret following declarations.
- [ ] **SYN-DIA-004 · v0** — Define deterministic diagnostic ordering and a bounded “too many errors” result.
- [ ] **SYN-DIA-005 · v0** — Define diagnostics for ambiguous parses rather than choosing meaning from whitespace or recovery heuristics.
- [ ] **SYN-DIA-006 · v0** — Require every syntax feature to include valid, invalid, boundary, and misleading-lookalike examples.

## 14. Documentation, formatting, and tools

Proposed answers: [documentation and formatter decisions](decisions/14-documentation-formatting-tools.md).

- [ ] **SYN-TOL-001 · v0** — State that `//` and `/* ... */` are non-semantic comments and that v0 has no documentation-attachment syntax.
- [ ] **SYN-TOL-002 · v0** — Define a single formatter's stable output policy without claiming formatted source is canonical IR identity.

## 15. Evolution and conformance

Proposed answers: [evolution and conformance decisions](decisions/15-evolution-conformance.md).

- [ ] **SYN-EVO-001 · v0** — Publish unambiguous grammar and token boundaries, state trivia placement, and separate raw lexing, layout normalization, and parsing from one parser implementation.
- [ ] **SYN-EVO-002 · v0** — Create positive, negative, ambiguity, and resource-limit fixtures for every v0 syntax decision.
- [ ] **SYN-EVO-003 · v0** — Require source-to-IR provenance and public-reader conformance for accepted v0 syntax.

## Version completion rule

v0 syntax is complete only when every checked decision has normative prose, valid and invalid fixtures, deterministic diagnostics, source-to-IR provenance, and one effect-free consumer case.
