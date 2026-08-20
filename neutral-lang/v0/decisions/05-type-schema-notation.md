# Section 5: type and schema notation

Status: proposed

Answers: `SYN-TYP-001` through `SYN-TYP-006`

## SYN-TYP-001 — Minimal scalars

| Type | Domain |
| --- | --- |
| `bool` | `true` or `false` |
| `num` | Exact finite base-10 rational represented independently of host numeric types |
| `string` | Finite Unicode scalar sequence |

A source number is an arbitrary-precision signed coefficient times a power of
ten, normalized for logical equality while retaining its source spelling in
provenance. All zero spellings normalize to coefficient `0`, scale `0`. Logical
IR preserves this mathematical value losslessly and does not inherit an
encoder's or host's numeric type. Contract-required integer and decimal
conversion must be exact.
Named IEEE binary conversion uses deterministic round-to-nearest, ties-to-even
by default, matching Python's nearest-representable model without inheriting its
host format. A contract may require exact representation instead. Subnormal
results and rounding a nonzero value to signed zero are valid; overflow,
invalid-sign integer conversion, and non-finite results are rejected. `string`
does not become a number, and `null` inhabits only values whose expected type is
`T?`.

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
Every nominal recursive record cycle is invalid unless the cycle is broken by a
`Ref<T>` edge. `Node?` and `List<Node>` still embed `Node` and therefore do not
make recursion valid; `Ref<Node>` links identity without embedding and is
allowed.

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
| Required, non-nullable | `T name` |
| Required, nullable | `T? name` |
| Defaulted, non-nullable | `T name = constant_value` |
| Defaulted, nullable | `T? name = null` |
| Repeated/ordered | `List<T> name` |

`?` is a postfix type constructor that adds `null` but not omission. A nullable
field remains required unless it has a default. There is no explicit
optional-field modifier. Required/defaulted and nullable/non-nullable are
independent axes for both Neutral records and vocabulary schemas. Defaults apply
only when a field has no source entry; structural omission is not another source
value. v0 has no `Nullable<T>` spelling, standalone null type, or `absent` value.
Repetition is a type, not a modifier.

A user-record default is a closed constant value. It may contain scalar
literals, `null` in a nullable expected position, lists or contextual records
composed recursively from constant values, and a vocabulary static value whose
captured bundle marks it safe for constants. It cannot contain an ordinary
binding name, `ref(...)`, or `secret_ref(...)`. A default therefore cannot make
a nominal schema depend on module state, declaration identity, or a secret
request.

## SYN-TYP-005 — Named references

Type references are local identifiers or namespace/vocabulary-qualified names:

```neu
ImageConfig local = { image: "x", labels: [] }
namespace checks {
    record ImageConfig { string image, List<string> labels = [], }
    ImageConfig shared = { image: "x", labels: [] }
}
Flow::ArtifactRef artifact = { value: "sha256:example" }
```

Resolution produces typed identity, not retained name text. Unknown, ambiguous,
inaccessible, wrong-kind, and cyclic references are distinct errors.

v0 assignment compatibility has only two rules:

1. the source and expected types are exactly identical; or
2. a non-nullable source `T` widens to the outer nullable type `T?`.

There is no reverse nullable narrowing and no generic covariance. Consequently,
`string` can initialize `string?`, and `List<string>` can initialize
`List<string>?`, but `List<string>` cannot initialize `List<string?>`.
`List<T>`, `Ref<T>`, and `SecretRef<T>` type arguments are invariant. Nominal
records and vocabulary-owned types require identical resolved type identity.
Numeric contract lowering is checked after source-level `num` compatibility and
does not create additional source subtyping.

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

Fixtures MUST cover scalars, nearest-even and exact-required numeric conversions
and their failures,
nominal mismatch, duplicates, every null/default combination, nullable elements
versus nullable collections, permitted outer nullability widening, rejected
nullable narrowing and generic covariance, closed-constant defaults, rejected
binding/identity/secret defaults, empty/nested lists, wrong-kind type references,
generic secret-delivery types, and unsupported required domain types.
