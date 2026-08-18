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

Source names follow the lexical case categories: declarations that introduce
values use `snake_case`, while record/type declarations use `UpperCamelCase`.
External immutable identities and human display text are preserved exactly
rather than rewritten into source casing.

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
the same lexical declaration list and source unit. Cross-unit assignment is
invalid even when units merge into the same module, because source-unit order
cannot define assignment order. A qualified assignment target, compound
assignment, increment, and mutation method are invalid. Mutation is resolved
during compilation; issued IR remains immutable.

The last valid assignment in the lexical scope determines the emitted binding
value. `ref(x)` creates a symbolic reference to binding `x`; it does not evaluate
or snapshot `x` at the reference's textual position. The referenced identity's
emitted value is the binding's final assigned value. All assignments remain in
source provenance.

## SYN-DEC-003 — Explicit types

Every binding and record field states a type. v0 checks contextual literals but
does not infer a public declaration type. Domain fields obtain expected types
from the captured vocabulary schema. Empty lists and `null` require an expected
type.

## SYN-DEC-004 — Vocabulary-owned typed declarations

Vocabulary-owned declarations use the ordinary type-first binding grammar:

```text
Vocabulary::Type declaration-name = { schema fields }
```

```neu
Flow::Pipeline verify = {
    config: ref(config),
}
```

`Pipeline` is not a core keyword or a special domain-declaration grammar branch.
The data-only bundle defines the type, allowed position, fields, target kinds,
and behavioral classification. No Flow code runs during parsing or static
schema validation.

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

Two declarations of any kind cannot share a name in one scope, including when
the declarations come from different source units merged into one module.
Vocabulary use names occupy the root namespace. v0 prohibits shadowing outer
declarations and predeclared core names. Sibling namespaces may contain equal
short names. Source-unit order never chooses a winner.

Names that violate their declaration category's case are rejected before they
can create a symbol. Valid case-distinct names in different categories remain
distinct, but tools SHOULD warn when they differ only by case. Diagnostics
identify both conflicting declarations; source order never chooses a winner.

## SYN-DEC-007 — Forward references

Immutable references may target later declarations in the captured closure.
The compiler collects declarations before resolving/checking immutable values,
so their source order is not execution order. A mutable assignment is processed
in source order and cannot be referenced before its declaration.

Forward references do not legalize direct value-initialization cycles. The
compiler constructs an initialization dependency graph from edges that embed or
need another binding's value and rejects every cycle in that graph. `ref(...)`
edges are excluded: they link binding identities rather than copying or
initializing from target values. Cycles made exclusively through `Ref<T>` are
valid. Directly embedded recursive record types remain invalid, but a record
type cycle broken entirely by `Ref<T>` is valid for the same identity-link
reason. A domain relationship cycle is rejected only when the vocabulary's
static contract prohibits it; Neutral does not infer execution semantics.

## Required evidence

Fixtures MUST cover every declaration kind, forward references, namespace
qualification, duplicate cross-kind names, shadowing, case-confusable names,
direct value cycles, valid reference-only cycles, and
source-name/display-name/IR-identity distinctions.
