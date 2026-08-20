# Section 6: literal values and value construction

Status: proposed

Answers: `SYN-VAL-001` through `SYN-VAL-008`

## SYN-VAL-001 — Scalar construction

Scalar forms follow `SYN-LEX-007` and `SYN-LEX-008` and are checked against
an explicit expected type. Source `num` is an exact arbitrary-precision base-10
rational within configured digit/scale limits. Integer and decimal targets
require exact conversion. A named IEEE binary target uses deterministic
round-to-nearest, ties-to-even by default and may be constrained to exact
representation by the vocabulary. Subnormal and signed-zero results are valid;
overflow and non-finite results are rejected. Host-machine numeric types,
widths, rounding modes, locale, and overflow rules never participate.

Numeric source values are exact within configured digit/scale limits. A
`string` is a Unicode scalar sequence after escape processing. Invalid spelling,
wrong type, failed numeric conversion, and resource exhaustion are separate
diagnostics.

## SYN-VAL-002 — Record construction

Record values use the expected nominal type supplied by their binding, field,
list element, or other statically unique context:

```neu
ImageConfig config = {
    image: "example.invalid/tool:1",
    labels: ["portable"],
}
```

Fields use `name: value` and appear once. Logical association is by field name,
not order. Unknown, duplicate, missing required, wrong-type, and inaccessible
fields are distinct errors.

Repeating the type on the right-hand side is invalid. The braced form is not an
untyped anonymous record: compilation fails when there is no expected type or
when the expected type is ambiguous. A vocabulary-owned typed declaration uses
the same contextual construction rule.

## SYN-VAL-003 — List construction

```neu
["first", "second",]
```

Every element matches one expected `List<T>` type. Order and duplicates are
preserved. An empty list needs an expected type. There is no implicit set
behavior, flattening, heterogeneous element type, or comma elision.

## SYN-VAL-004 — Omission, null, and unavailability

- A field with a default may have no source entry.
- `null` is the only explicit source null/empty literal and is legal only where
  the expected type is `T?`.
- Deferred/unavailable is not constructible in v0.

The compiler preserves structural omission/default application versus explicit
`null` in provenance and IR. v0 has no `absent` token and no optional-field
modifier. A vocabulary-owned field follows the same rule as a Neutral record
field: it may be omitted only when its captured schema supplies a default.
Omission is still not a source value. User-record defaults are closed constants
under `SYN-TYP-004`; applying one copies that constant into the constructed value
and records both the construction site and field-default declaration as origin.
It creates no ordinary binding dependency.

## SYN-VAL-005 — Binding values and identity references

An ordinary binding name in value position reads that binding's immutable
logical value:

```neu
string image = "example.invalid/tool:1"
string image2 = image
List<string> images = [image, image2]

ImageConfig config = {
    image: image,
}
```

The name may be qualified. It MUST resolve to a value binding, and its declared
type must be compatible with the expected position. It creates a static
value-dependency edge, not an identity relationship. Forward value dependencies
are allowed; every cycle in their graph is rejected before evaluation.

`ref(...)` is deliberately different:

```neu
ref(config)
ref(checks::config)
```

If the target binding has declared type `T`, `ref(...)` has type `Ref<T>` and
lowers to a resolved IR identity link, never text or the target's copied value.
Record/type declarations, namespaces, modules, and vocabulary namespaces are
wrong-kind targets for both forms. `image` means value reuse; `ref(image)` means
declaration identity. Neither form creates execution ordering.

## SYN-VAL-006 — Qualified vocabulary static values

v0 core has no enum declaration, but a data-only vocabulary may expose a typed
static value such as a closed enum/tag case:

```neu
Flow::Mode.strict
```

The bundle defines the owning type, value identity, behavior version, and
unknown policy. Unqualified `strict` and text `"strict"` are not substitutes.
A static member is an inert declared value, not a function, computed property,
or general member lookup on a runtime value. The left side of `.` MUST resolve
to a vocabulary-owned type that declares the named static value in the captured
bundle. User-defined records cannot declare or acquire static members in v0.
General core tagged alternatives remain deferred.

## SYN-VAL-007 — Domain-owned typed values

```neu
Flow::ArtifactRef artifact = {
    value: "sha256:example",
}
```

Neutral validates the captured static schema and emits qualified identity. It
does not prove the external artifact exists or is trusted. Construction cannot
execute code or perform lookup.

Every vocabulary-owned value is immutable copyable data in v0. Ordinary reuse
of `Flow::Pipeline build` in `Flow::Pipeline second = build` creates a second
declaration identity containing the same logical value and provenance linking
the reuse. Vocabulary bundles have no non-copyable-value marker. Identity-bearing
relationships must use `Ref<T>` rather than relying on object-like copy behavior.

## SYN-VAL-008 — Record shorthand

v0 rejects record shorthand. Authors write `image: image` for ordinary value
reuse or `input: ref(input)` for an identity link rather than an isolated field
name. Explicit field association prevents confusion between field selection and
binding resolution and improves source maps/migrations.

## Required evidence

Fixtures MUST cover scalar mismatch, nearest-even and exact-required numeric
conversion boundaries,
every contextual-record error including repeated/absent/ambiguous expected
types, binding values inside records/lists, forward value dependencies, static
value-dependency cycles, empty/heterogeneous lists, omission/null, unresolved
and wrong-kind value/identity references, unknown enum variants, invalid
vocabulary-owned values, and shorthand rejection.
