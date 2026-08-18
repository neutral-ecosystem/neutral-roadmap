# Section 6: literal values and value construction

Status: proposed

Answers: `SYN-VAL-001` through `SYN-VAL-008`

## SYN-VAL-001 — Scalar construction

Scalar forms follow `SYN-LEX-007` and `SYN-LEX-008` and are checked against
an explicit expected type. There are no implicit conversions or host overflow
rules.

Integers and decimals are exact within configured digit/scale limits. Text is a
Unicode scalar sequence after escape processing. Invalid spelling, wrong type,
and resource exhaustion are separate diagnostics.

## SYN-VAL-002 — Record construction

Record values name their nominal type:

```neu
ImageConfig {
    image: "example.invalid/tool:1",
    labels: ["portable"],
}
```

Fields use `name: value` and appear once. Logical association is by field name,
not order. Unknown, duplicate, missing required, wrong-type, and inaccessible
fields are distinct errors.

v0 has no untyped anonymous record literal. A domain declaration body resembles
a record but obtains its schema from the qualified kind.

## SYN-VAL-003 — List construction

```neu
["first", "second",]
```

Every element matches one expected `List<T>` type. Order and duplicates are
preserved. An empty list needs an expected type. There is no implicit set
behavior, flattening, heterogeneous element type, or comma elision.

## SYN-VAL-004 — Omission, absence, null, unavailability

- An omitted optional field has no source entry.
- `absent` is an explicit absence marker legal only where optional.
- `null` is a value legal only for `Null` or `Nullable<T>`.
- Deferred/unavailable is not constructible in v0.

The compiler preserves omission versus explicit absence in provenance and as
distinct IR states when the logical model requires it. A default applies to
omission, not explicit absence. A domain schema allowing optional defaults must
define the interaction.

## SYN-VAL-005 — Explicit references

```neu
ref(config)
ref(checks::config)
ref(acme::delivery::checks::config)
```

An identifier in value position is not an implicit reference. If the target has
type/kind `T`, `ref(...)` has type `Ref<T>` and lowers to a resolved IR
link, never text or the target's copied value. It does not make the link an
execution dependency.

## SYN-VAL-006 — Qualified enum values

v0 core has no enum declaration, but a vocabulary may expose a closed enum/tag:

```neu
flow::Mode::strict
```

The bundle defines type, variants, behavior version, and unknown policy.
Unqualified `strict` and text `"strict"` are not substitutes. General core
tagged alternatives remain deferred.

## SYN-VAL-007 — Domain-owned typed values

```neu
flow::ArtifactRef {
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

Fixtures MUST cover scalar mismatch, every record error, empty/heterogeneous
lists, omission/absence/null, unresolved/wrong-kind references, unknown enum
variants, invalid domain values, and shorthand rejection.
