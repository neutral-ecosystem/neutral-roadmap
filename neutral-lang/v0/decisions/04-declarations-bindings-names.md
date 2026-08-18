# Section 4: declarations, bindings, and names

Status: proposed

Answers: `SYN-DEC-001` through `SYN-DEC-007`

## SYN-DEC-001 — Common declaration identity

Every declaration has a kind, source identifier, lexical namespace, module,
source span, and IR element identity. The source identifier is machine-facing.
Human display text is an ordinary typed domain field and never affects
resolution.

The resolved symbolic name is `module::namespace::name`. IR identity also
binds the owning document/derivation, so equal spellings in different captured
documents are not conflated. Renaming changes identity in v0; durable aliases
are deferred.

## SYN-DEC-002 — Type-first bindings

Bindings use:

```neu
Type name = value
```

There is no `let` keyword and no colon between the name and type. Bindings are
immutable and initialized once unless explicitly prefixed with `mut`:

```neu
mut num counter = 0
counter = 1
```

Assignment may target only a previously declared mutable local identifier in
the same lexical scope. A qualified assignment target, compound assignment,
increment, and mutation method are invalid. Mutation is resolved during
compilation; issued IR remains immutable.

The last valid assignment in the lexical scope determines the emitted binding
value. `ref(...)` resolves to the binding identity and observes that final
compiled value; it does not capture a value snapshot at the reference's textual
position. All assignments remain in source provenance.

## SYN-DEC-003 — Explicit types

Every binding and record field states a type. v0 checks contextual literals but
does not infer a public declaration type. Domain fields obtain expected types
from the captured vocabulary schema. Empty lists and `null` require an expected
type.

## SYN-DEC-004 — Domain declaration kinds

A domain declaration has:

```text
vocabulary-alias.schema-kind declaration-name { schema fields }
```

```neu
flow.pipeline verify {
    config: ref(config),
}
```

`pipeline` is not a core keyword. The data-only bundle defines kind, allowed
position, fields, target kinds, and behavioral classification. No Flow code runs
during parsing or static schema validation.

## SYN-DEC-005 — Namespaces

```neu
namespace checks {
    string image = "example.invalid/check:1"
}
```

Namespaces may nest and create lexical qualification only. They do not create
files, environments, security zones, stages, or provider groups. Their contents
are declarations, not arbitrary values.

## SYN-DEC-006 — Duplicates and shadowing

Two declarations of any kind cannot share a name in one scope. Vocabulary
aliases occupy the root namespace. v0 prohibits shadowing outer declarations
and predeclared core names. Sibling namespaces may contain equal short names.

Case-distinct ASCII names are technically distinct, but tools SHOULD warn when
they differ only by case. Diagnostics identify both conflicting declarations;
source order never chooses a winner.

## SYN-DEC-007 — Forward references

Immutable references may target later declarations in the captured closure.
The compiler collects declarations before resolving/checking immutable values,
so their source order is not execution order. A mutable assignment is processed
in source order and cannot be referenced before its declaration.

Forward references do not legalize cycles. Cyclic immutable values and recursive
records are invalid in v0. A domain relationship cycle is rejected only when
the vocabulary's static contract prohibits it; Neutral does not infer execution
semantics.

## Required evidence

Fixtures MUST cover every declaration kind, forward references, namespace
qualification, duplicate cross-kind names, shadowing, case-confusable names,
value cycles, and source-name/display-name/IR-identity distinctions.
