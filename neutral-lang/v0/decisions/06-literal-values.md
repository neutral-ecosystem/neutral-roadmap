# Section 6: literal values and value construction

Status: proposed

Answers: `SYN-VAL-001` through `SYN-VAL-008`

## SYN-VAL-001 — Scalar construction

Scalar forms follow `SYN-LEX-007` and `SYN-LEX-008` and are checked against
an explicit expected type. `num` automatically converts to a captured
contract's `int`, `uint`, or `float` representation when value and range are
preserved. Host-machine widths and overflow rules never participate.

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
Omission is still not a source value.

## SYN-VAL-005 — Explicit references

```neu
ref(config)
ref(checks::config)
ref(acme::delivery::checks::config)
```

An identifier in value position is not an implicit reference. The target MUST
be a value binding. If that binding has declared type `T`, `ref(...)` has type
`Ref<T>` and lowers to a resolved IR link, never text or the target's copied
value. Record/type declarations, namespaces, modules, and vocabulary namespaces
are wrong-kind targets. A reference does not make the link an execution
dependency.

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

## SYN-VAL-008 — Record shorthand

v0 rejects record shorthand. Authors write `image: ref(image)` rather than an
isolated `image`. Explicit association prevents confusion between local
bindings and fields and improves source maps/migrations.

## Required evidence

Fixtures MUST cover scalar mismatch, automatic numeric conversion boundaries,
every contextual-record error including repeated/absent/ambiguous expected
types, empty/heterogeneous lists, omission/null,
unresolved/wrong-kind references, unknown enum variants, invalid vocabulary-owned
values, and shorthand rejection.
