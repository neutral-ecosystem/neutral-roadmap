# Section 5: type and schema notation

Status: proposed

Answers: `SYN-TYP-001` through `SYN-TYP-006`

## SYN-TYP-001 — Minimal scalars

| Type | Domain |
| --- | --- |
| `bool` | `true` or `false` |
| `num` | Exact source number, automatically represented as compatible `int`, `uint`, or `float` |
| `string` | Finite Unicode scalar sequence |

Numeric conversion among contract-required `int`, `uint`, and `float`
representations is automatic when it preserves value and range. Lossy,
overflowing, or invalid-sign conversion is rejected. `string` does not become a
number, and `null` inhabits only values whose expected type is `T?`.

`Ref<T>` is a predeclared typed symbolic link to a declaration of type/kind
`T`; only `ref(...)` constructs it. `SecretRef<T>` is a separate opaque
reference type whose parameter describes the requested secret-delivery shape;
it is not a scalar and has no literal value. Only
`secret_ref(...)` constructs it under the security rules in section 12.

Thus the primitive scalar set is exactly `num`, `string`, and `bool`; `null` is
a literal admitted by nullable positions, not a fourth declared scalar type.

## SYN-TYP-002 — Nominal records

```neu
record ImageConfig {
    string image,
    string? note,
    List<string> labels = [],
}
```

Records are nominal: equal fields do not make two record declarations the same
type. Field names are unique. Declaration order is retained for presentation
but does not affect logical type equality. v0 has no anonymous structural type.

## SYN-TYP-003 — Homogeneous collections

`List<T>` is the only v0 collection. It is homogeneous and ordered; duplicates
are allowed. `T` may itself be a scalar, named record, qualified domain type,
reference type, nullable type, or list, within nesting limits. Because
nullability belongs to the type, `List<string?>` and `List<string>?` are
distinct.

Maps, sets, tuples, and heterogeneous lists are deferred. A domain can use a
named entry record inside a list in v0.

## SYN-TYP-004 — Field states

| Meaning | Syntax |
| --- | --- |
| Required | `T name` |
| Nullable | `T? name` |
| Defaulted | `T name = value` |
| Repeated/ordered | `List<T> name` |

`?` is a postfix type constructor that adds `null` but not omission. A nullable
field remains required unless it
has a default. v0 has no optional-field marker, `Nullable<T>` spelling,
standalone null type, or `absent` value. Defaults apply only when a field has no
source entry; structural omission is not another source value.
Repetition is a type, not a modifier.

## SYN-TYP-005 — Named references

Type references are identifiers or qualified names:

```neu
ImageConfig local = { image: "x", labels: [] }
acme::common::ImageConfig shared =
    { image: "x", labels: [] }
```

Resolution produces typed identity, not retained name text. Unknown, ambiguous,
inaccessible, wrong-kind, and cyclic references are distinct errors.

## SYN-TYP-006 — Opaque domain types

A bundle may declare `Flow::ArtifactRef` with exact schema/behavior versions,
source representation, static constraints, feature, and must-understand status.

```neu
Flow::ArtifactRef artifact = {
    value: "sha256:example",
}
```

Opaque means Neutral does not own external behavior; it does not mean an
unbounded blob. Neutral still validates structure, limits, qualification,
provenance, and required-feature support. Unknown required types fail closed.

## Required evidence

Fixtures MUST cover scalars, automatic numeric conversions and their failures,
nominal mismatch, duplicates, every null/default combination, nullable elements
versus nullable collections, empty/nested lists, wrong-kind type references,
generic secret-delivery types, and unsupported required domain types.
