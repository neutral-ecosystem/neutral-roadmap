# Section 15: evolution and conformance

Status: proposed

Answers: `SYN-EVO-001` through `SYN-EVO-003`

## SYN-EVO-001 — Normative grammar

The specification uses annotated EBNF plus separate normative lexical
productions and prose invariants. EBNF defines structure; prose defines
resolution, types, lowering, limits, and diagnostics. One parser generator's
grammar is not normative.

v0 has no infix operators or general precedence. Its value hierarchy is:

```text
value
  = scalar
  | list
  | contextual-record
  | qualified-enum-value
  | reference
  | secret-reference
```

`::` belongs to qualified-name grammar, `.` selects a member or enum case, and
leading minus belongs to a numeric literal. Delimiters determine nesting.
Implementations cannot invent precedence.

The specification records grammar version, definitions, Unicode/encoding
assumptions, and a machine-readable fixture manifest.

## SYN-EVO-002 — Conformance corpus

| Class | Purpose |
| --- | --- |
| Positive | Accepted source and expected logical IR/provenance |
| Negative | Exact diagnostic code, spans, recovery |
| Ambiguity | Lookalikes cannot gain two meanings |
| Boundary | Empty/minimum/maximum/over-limit |
| Determinism | Repeated/concurrent compilation equality |
| Historical | Previously published source classification |
| Adversarial | Deep nesting, invalid bytes, storms, deceptive text |

Each fixture captures source bytes, compilation request, bundle identities,
resource profile, expected result class, and safe diagnostics. Tests never
depend on working directory, network, locale, clock, randomness, or hash order.

The corpus includes one Flow and one independently designed Neux profile. This
tests common shape, not shared domain behavior.

## SYN-EVO-003 — Source-to-IR and reader conformance

Every accepted construct demonstrates:

1. deterministic logical lowering;
2. source-unit/span origin for emitted declarations, values, and links;
3. derivation inclusion for every decision-affecting input;
4. one public IR encoding;
5. validation/traversal through the public reader API; and
6. a consumer diagnostic mapped back to source.

The probe cannot access lexer, syntax tree, compiler internals, or source parser,
and cannot execute domain behavior. A private refactor cannot change expected
public IR without a documented public contract/version change.

IR round-trip does not reproduce original `.neu` spelling, comments, or
formatting. Source formatting has a separate contract.

## Exit rule

These decisions become accepted v0 syntax only after grammar, implementation,
formatter, fixtures, public IR mapping, and both probe cases pass. Until then,
the parent checklist remains an open-work tracker.
