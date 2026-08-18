# Section 5: type and schema notation

Status: proposed

Answers: `SYN-TYP-001` through `SYN-TYP-006`

## SYN-TYP-001 — Minimal scalars

| Type | Domain |
| --- | --- |
| `Bool` | `true` or `false` |
| `Int` | Exact integer within resource limits |
| `Decimal` | Exact normalized base-10 numeric value within limits |
| `Text` | Finite Unicode scalar sequence |
| `Null` | The sole value `null` |

There is no implicit scalar conversion. `Int` does not become `Decimal`,
text does not become a number, and `null` does not inhabit every type.

`SecretRef` is also a predeclared opaque reference type, but it is not a
scalar and has no literal value. Only `secret_ref(...)` constructs it, under
the security rules in section 12.

## SYN-TYP-002 — Nominal records

```neu
record ImageConfig {
    image: Text,
    note?: Text,
    labels: List<Text> = [],
}
```

Records are nominal: equal fields do not make two record declarations the same
type. Field names are unique. Declaration order is retained for presentation
but does not affect logical type equality. v0 has no anonymous structural type.

## SYN-TYP-003 — Homogeneous collections

`List<T>` is the only v0 collection. It is homogeneous and ordered; duplicates
are allowed. `T` may itself be a scalar, named record, qualified domain type,
nullable type, or list, within nesting limits.

Maps, sets, tuples, and heterogeneous lists are deferred. A domain can use a
named entry record inside a list in v0.

## SYN-TYP-004 — Field states

| Meaning | Syntax |
| --- | --- |
| Required | `name: T` |
| Optional | `name?: T` |
| Nullable | `name: Nullable<T>` |
| Defaulted | `name: T = value` |
| Repeated/ordered | `name: List<T>` |

`Nullable<T>` adds `null` but not omission. Optionality adds omission but
not null unless combined with `Nullable<T>`. Defaults apply only to omitted
fields. v0 rejects optional fields with defaults as redundant/ambiguous.
Repetition is a type, not a modifier.

## SYN-TYP-005 — Named references

Type references are identifiers or qualified names:

```neu
let local: ImageConfig =
    ImageConfig { image: "x", labels: [] };
let shared: acme::common::ImageConfig =
    acme::common::ImageConfig { image: "x", labels: [] };
```

Resolution produces typed identity, not retained name text. Unknown, ambiguous,
inaccessible, wrong-kind, and cyclic references are distinct errors.

## SYN-TYP-006 — Opaque domain types

A bundle may declare `flow::ArtifactRef` with exact schema/behavior versions,
source representation, static constraints, feature, and must-understand status.

```neu
flow::ArtifactRef {
    value: "sha256:example",
}
```

Opaque means Neutral does not own external behavior; it does not mean an
unbounded blob. Neutral still validates structure, limits, qualification,
provenance, and required-feature support. Unknown required types fail closed.

## Required evidence

Fixtures MUST cover scalars, no implicit conversion, nominal mismatch,
duplicates, every optional/null/default combination, empty/nested lists,
wrong-kind type references, and unsupported required domain types.
