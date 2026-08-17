# Neutral language v2 syntax checklist

Status: proposed incremental checklist

Scope: v2 is the final incremental slice. A fully fledged Neutral language means v0 + v1 + v2 together; it does not turn Neutral into a general-purpose programming language.

Authoritative master: [../syntax.md](../syntax.md)

Checking an item means the syntax question has a normative answer, examples,
invalid cases, diagnostics, and conformance fixtures—not merely one accepted
parser example.

## 2. Lexical and source-text rules

- [ ] **SYN-LEX-011 · v2** — Decide whether text interpolation exists; if it does, define its boundary from symbolic expressions and domain escaping.
- [ ] **SYN-LEX-012 · v2** — Reserve and document lexical space for future versions without allowing unknown syntax to be accepted silently.

## 3. Documents, modules, imports, and profiles

- [ ] **SYN-DOC-011 · v2** — Define package re-export and facade-module syntax, if justified, without hiding the complete source closure.
- [ ] **SYN-DOC-012 · v2** — Define source-level feature requests separately from compiler policy, so source cannot enable an unapproved privileged feature.

## 4. Declarations, bindings, and names

- [ ] **SYN-DEC-011 · v2** — Define declaration modifiers and annotations with deterministic ordering, duplication, and conflict rules.
- [ ] **SYN-DEC-012 · v2** — Decide whether declaration aliases exist and how alias origin remains distinguishable from authoritative identity.

## 5. Type and schema notation

- [ ] **SYN-TYP-012 · v2** — Define constrained numeric, text, collection, or record types and identify which constraints the compiler can decide.
- [ ] **SYN-TYP-013 · v2** — Define recursive-type notation only if bounded validation and real cross-domain examples justify it; otherwise reject it explicitly.
- [ ] **SYN-TYP-014 · v2** — Define operation-signature types separately from general-purpose first-class function types.

## 6. Literal values and value construction

- [ ] **SYN-VAL-014 · v2** — Define update/copy construction for immutable values and its provenance behavior.
- [ ] **SYN-VAL-015 · v2** — Decide whether comprehensions exist or whether bounded expansion syntax fully replaces them.
- [ ] **SYN-VAL-016 · v2** — Define source rendering for unknown or opaque optional values without pretending the compiler understands them.

## 7. References and structural relationships

- [ ] **SYN-REF-008 · v2** — Define immutable cross-document references, if supported, without accepting a mutable URL as identity.

## 8. Composition, reuse, and expansion

- [ ] **SYN-CMP-009 · v2** — Define composition conflict resolution without hidden import-order or traversal-order precedence.
- [ ] **SYN-CMP-010 · v2** — Decide whether recursive composition exists; if it does, expose termination/depth constraints, otherwise reject it explicitly.
- [ ] **SYN-CMP-011 · v2** — Define stable author-facing handles for generated elements without promising stability across behavior-changing derivations.
- [ ] **SYN-CMP-012 · v2** — Define conditional structural inclusion separately from runtime execution conditions.

## 9. Structured symbolic expressions

- [ ] **SYN-EXP-009 · v2** — Define short-circuit behavior notation or make it entirely part of an identified operation contract.
- [ ] **SYN-EXP-010 · v2** — Define tagged-pattern selection/matching only if it improves exhaustive handling of typed alternatives.
- [ ] **SYN-EXP-011 · v2** — Define bounded collection transformation operations without adding unbounded general-purpose loops.
- [ ] **SYN-EXP-012 · v2** — Decide whether anonymous functions/closures are excluded or admit only a bounded, serializable form justified by both domains.
- [ ] **SYN-EXP-013 · v2** — Define explicit coercion/conversion syntax; prohibit silent host-language coercion.
- [ ] **SYN-EXP-014 · v2** — Define expression failure and missing-value handling without adding general-purpose exceptions.

## 10. Domain vocabulary surface

- [ ] **SYN-DOM-011 · v2** — Define syntax for controlled vocabulary deprecation and migration hints without silently rewriting meaning.
- [ ] **SYN-DOM-012 · v2** — Define how provider-specific Flow extensions remain visibly Flow-owned and never appear as Neutral core constructs.

## 11. Contracts, capabilities, and effects

- [ ] **SYN-CTR-007 · v2** — Define permission, confidentiality, isolation, and resource-requirement declarations as domain-owned contracts, not authority grants.
- [ ] **SYN-CTR-008 · v2** — Define author-declared versus compiler-derived versus vocabulary-derived requirement provenance.
- [ ] **SYN-CTR-009 · v2** — Define contract conflict and override notation without resolving conflicts by textual order.
- [ ] **SYN-CTR-010 · v2** — Define result availability and failure contracts needed by consumers without defining their runtime lifecycle in Neutral.

## 12. Security-sensitive syntax

- [ ] **SYN-SEC-010 · v2** — Define syntax-level redaction and disclosure annotations without allowing authors to weaken mandatory host security policy.

## 13. Diagnostics and invalid/incomplete syntax

- [ ] **SYN-DIA-010 · v2** — Define incomplete-document behavior for editors separately from authoritative compilation acceptance.

## 14. Documentation, formatting, and tools

- [ ] **SYN-TOL-007 · v2** — Define generated-source markers and provenance without allowing generated text to bypass ordinary compilation.
- [ ] **SYN-TOL-008 · v2** — Define loss-reporting and human-review requirements for automated syntax migrations.

## 15. Evolution and conformance

- [ ] **SYN-EVO-008 · v2** — Define the reserved grammar and namespace strategy for post-v2 evolution.
- [ ] **SYN-EVO-009 · v2** — Require differential/fuzz testing for lexer, parser, formatter, and source-map behavior across independent implementations where available.
- [ ] **SYN-EVO-010 · v2** — Define the v2 syntax stability promise independently from IR, encoding, compiler API, consumer API, and vocabulary version promises.

## Version completion rule

v2 syntax is complete only when the full union has a published compatibility promise, migration evidence, adversarial conformance coverage, and independent Flow and Neux justification for every core abstraction.

