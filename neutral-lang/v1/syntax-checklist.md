# Neutral language v1 syntax checklist

Status: proposed incremental checklist

Scope: v1 is an incremental slice over completed v0 syntax. It adds multi-unit composition, richer data modeling, structured symbolic authoring, domain contracts, and practical tooling.

Authoritative master: [../syntax.md](../syntax.md)

Checking an item means the syntax question has a normative answer, examples,
invalid cases, diagnostics, and conformance fixtures—not merely one accepted
parser example.

## 2. Lexical and source-text rules

- [ ] **SYN-LEX-009 · v1** — Decide whether raw and multiline text literals exist and specify indentation stripping, delimiter collision, and newline preservation.
- [ ] **SYN-LEX-010 · v1** — Decide whether binary literals exist in core or only through typed/domain constructors, including size and display rules.

## 3. Documents, modules, imports, and profiles

- [ ] **SYN-DOC-005 · v1** — Define import declarations, relative versus package resolution syntax, and the absence of ambient search behavior.
- [ ] **SYN-DOC-006 · v1** — Define qualified, aliased, and selective imports and their collision behavior.
- [ ] **SYN-DOC-007 · v1** — Define visibility and export declarations without making file layout an accidental visibility rule.
- [ ] **SYN-DOC-008 · v1** — Define how immutable dependency identity or version constraints are expressed without treating mutable tags as captured identity.
- [ ] **SYN-DOC-009 · v1** — Define syntax-level handling and diagnostics for missing, duplicate, cyclic, ambiguous, and disallowed imports.
- [ ] **SYN-DOC-010 · v1** — Define whether one source unit may use multiple domain vocabularies and how qualification prevents collisions.

## 4. Declarations, bindings, and names

- [ ] **SYN-DEC-008 · v1** — Define parameter declarations, result declarations, and their ordering and naming rules.
- [ ] **SYN-DEC-009 · v1** — Define default values and required/schema-optional parameters with an inspectable distinction among omission, default application, and explicit `null`.
- [ ] **SYN-DEC-010 · v1** — Define nested declarations and local scope boundaries, if retained after corpus testing.

## 5. Type and schema notation

- [ ] **SYN-TYP-007 · v1** — Define tagged-alternative/union syntax with exhaustive tag identity and unknown-tag behavior.
- [ ] **SYN-TYP-008 · v1** — Decide whether tuple types add value beyond named records and define them only if the corpora justify positional data.
- [ ] **SYN-TYP-009 · v1** — Define map, set, and other keyed collection types, including key restrictions, ordering, and duplicate semantics.
- [ ] **SYN-TYP-010 · v1** — Define type aliases and ensure they do not create accidental new identity.
- [ ] **SYN-TYP-011 · v1** — Define typed parameterization/generic notation with explicit bounds and no implicit higher-kinded system.

## 6. Literal values and value construction

- [ ] **SYN-VAL-009 · v1** — Define map and set value construction with deterministic duplicate and ordering behavior.
- [ ] **SYN-VAL-010 · v1** — Define `.` member selection and indexing on structured symbolic values without reusing `::` or implying runtime availability.
- [ ] **SYN-VAL-011 · v1** — Define collection/record spread or merge notation together with explicit conflict precedence.
- [ ] **SYN-VAL-012 · v1** — Define multiline structured values and delimiter elision rules without indentation ambiguity.
- [ ] **SYN-VAL-013 · v1** — Define duration, timestamp, path, URI, digest, and similar values as typed constructors or domain types rather than ambiguous magic strings.

## 7. References and structural relationships

- [ ] **SYN-REF-005 · v1** — Define one-to-many and many-to-many relationship construction without string lists.
- [ ] **SYN-REF-006 · v1** — Define references to declared fields/results with static kind and availability diagnostics.
- [ ] **SYN-REF-007 · v1** — Define alias and re-export reference display while retaining the authoritative target identity.

## 8. Composition, reuse, and expansion

- [ ] **SYN-CMP-001 · v1** — Define reusable component declaration syntax independently from Flow templates or Neux scripts.
- [ ] **SYN-CMP-002 · v1** — Define component application with named typed arguments and explicit missing/extra argument diagnostics.
- [ ] **SYN-CMP-003 · v1** — Define result exposure from a component without leaking compiler-internal generated names.
- [ ] **SYN-CMP-004 · v1** — Define default and override syntax with deterministic precedence and origin tracking.
- [ ] **SYN-CMP-005 · v1** — Define explicit inclusion/composition rather than textual macro substitution.
- [ ] **SYN-CMP-006 · v1** — Define bounded collection-based expansion that is not named after a Flow matrix.
- [ ] **SYN-CMP-007 · v1** — Define expansion additions, exclusions, and filters as typed data/expressions with deterministic ordering.
- [ ] **SYN-CMP-008 · v1** — Define how syntax reveals whether expansion occurs in the compiler or is retained for a named consumer.

## 9. Structured symbolic expressions

- [ ] **SYN-EXP-001 · v1** — Define expressions as structured syntax that lowers to typed IR nodes, never opaque source strings for reparsing.
- [ ] **SYN-EXP-002 · v1** — Define namespace-owned operation/function references with `::`, member calls with `.`, and captured vocabulary owner/behavior version.
- [ ] **SYN-EXP-003 · v1** — Define call/application syntax and named versus positional argument policy.
- [ ] **SYN-EXP-004 · v1** — Define grouping and precedence so no expression meaning depends on parser folklore.
- [ ] **SYN-EXP-005 · v1** — Define boolean, comparison, and conditional-expression forms together with owning behavior contracts.
- [ ] **SYN-EXP-006 · v1** — Define how known, `null`, deferred, unavailable, failed, and indeterminate values can be distinguished where a vocabulary supports them.
- [ ] **SYN-EXP-007 · v1** — Define explicit references to earlier/domain-produced results without claiming the result exists at compile time.
- [ ] **SYN-EXP-008 · v1** — Define the syntax boundary between compiler-evaluable pure core operations and consumer-evaluated domain operations.

## 10. Domain vocabulary surface

- [ ] **SYN-DOM-007 · v1** — Define domain operation construction/invocation without granting it compiler execution authority.
- [ ] **SYN-DOM-008 · v1** — Define vocabulary-qualified relationships, annotations, and result shapes.
- [ ] **SYN-DOM-009 · v1** — Define explicit opaque optional payload preservation, if supported, and prohibit opaque required behavior.
- [ ] **SYN-DOM-010 · v1** — Define vocabulary dependency and compatibility declarations without implicit network resolution.

## 11. Contracts, capabilities, and effects

- [ ] **SYN-CTR-001 · v1** — Define operation input, output, and declared error-shape syntax.
- [ ] **SYN-CTR-002 · v1** — Define required capabilities separately from optional preferences.
- [ ] **SYN-CTR-003 · v1** — Define quantitative capability qualifiers as typed values rather than feature-name strings.
- [ ] **SYN-CTR-004 · v1** — Define availability-stage declarations without embedding Flow-specific stage names in core syntax.
- [ ] **SYN-CTR-005 · v1** — Define determinism, purity, and declared-effect annotations with explicit vocabulary ownership.
- [ ] **SYN-CTR-006 · v1** — Define opaque-operation syntax so missing inspectability never means “no effects” or “no permissions.”

## 12. Security-sensitive syntax

- [ ] **SYN-SEC-007 · v1** — Define raw command, shell, template, or foreign-text blocks only as typed domain data with no compiler execution or universal escaping claim.
- [ ] **SYN-SEC-008 · v1** — State that capability, trust, signer, or policy annotations express claims and never grant authority by syntax alone.
- [ ] **SYN-SEC-009 · v1** — Define safe handling of bidirectional controls, invisible characters, and confusable identifiers in tools and diagnostics.

## 13. Diagnostics and invalid/incomplete syntax

- [ ] **SYN-DIA-007 · v1** — Define origin stacks for imported, composed, defaulted, overridden, and expanded syntax.
- [ ] **SYN-DIA-008 · v1** — Define how a consumer diagnostic names an IR element and maps back to the responsible `.neu` construct.
- [ ] **SYN-DIA-009 · v1** — Define scoped diagnostic/lint suppression, if supported, and prohibit suppression of validity or security failures.

## 14. Documentation, formatting, and tools

- [ ] **SYN-TOL-003 · v1** — Define comment preservation and stable placement across formatting and source-to-source migrations without making comments semantic attachments.
- [ ] **SYN-TOL-004 · v1** — Define syntax-tree ranges and identities needed by editors without exposing compiler-private tree layout as public IR.
- [ ] **SYN-TOL-005 · v1** — Define completion and hover boundaries for core versus domain-vocabulary constructs.
- [ ] **SYN-TOL-006 · v1** — Define how a future GUI emits readable `.neu` and preserves only valid, non-authoritative presentation metadata.

## 15. Evolution and conformance

- [ ] **SYN-EVO-004 · v1** — Define feature negotiation for additive syntax and ensure old compilers reject unsupported required features.
- [ ] **SYN-EVO-005 · v1** — Define deprecation annotations, warnings, removal policy, and migration guidance.
- [ ] **SYN-EVO-006 · v1** — Maintain cross-version fixtures showing when old source is accepted, rejected, or migrated with loss.
- [ ] **SYN-EVO-007 · v1** — Test parser and formatter idempotence and ensure formatting does not change logical IR.

## Version completion rule

v1 syntax is complete only when v0 remains conformant, every new construct preserves provenance and bounded validation, and domain behavior remains owned by Flow or Neux rather than the compiler.
