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
immutable and initialized exactly once by their declaration:

```neu
num retry_count = 3
string image = "example.invalid/tool:1"
```

v0 has no `mut` modifier and no assignment production. A bare form such as
`retry_count = 4` is invalid even if a binding already exists. Declaration order
does not select or update a value.

Mutation remains a possible future feature only if concrete Flow and
independently designed Neux cases show that composition, a new derived binding,
or an explicit override model cannot express the requirement. Such evidence
would require a new versioned semantic decision; v0 reserves no mutation syntax.

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
declarations. Predeclared core names (`bool`, `num`, `string`, `List`, `Ref`, and
`SecretRef`) cannot be declared or shadowed in any scope. Sibling namespaces may
contain equal short names. Source-unit order never chooses a winner.

Names that violate their declaration category's case are rejected before they
can create a symbol. Valid case-distinct names in different categories remain
distinct, but tools SHOULD warn when they differ only by case. Diagnostics
identify both conflicting declarations; source order never chooses a winner.

## SYN-DEC-007 — Forward references

Both ordinary binding-value references and symbolic identity references may
target later immutable bindings in the captured closure. The compiler collects
declarations before resolving either form, so declaration source order is not
evaluation or execution order.

```neu
string image2 = image // Valid forward value dependency.
string image = "example.invalid/tool:1"

Selection selected = { config: ref(config), } // Valid forward identity link.
Config config = { image: image, }
```

An ordinary name in value position evaluates to the immutable logical value of
the target binding and creates a static value-dependency edge. It does not
create a `Ref<T>` or a public identity relationship. The compiler rejects every
cycle in the value-dependency graph before evaluation. Acyclic dependencies are
evaluated in deterministic topological order; this internal order does not make
source order semantic. The graph includes ordinary value uses in binding
initializers, contextual record fields, list elements, and declared defaults.
Type compatibility is checked at every use site.

`ref(...)` edges are excluded from the value-dependency graph because they link
binding identities rather than reading target values. Reference-only cycles are
valid. Every nominal recursive record cycle is invalid unless each route around
the cycle crosses `Ref<T>`. Nullable and collection edges still embed the
record, so `Node?` and `List<Node>` recursion are invalid; `Ref<Node>` recursion
is allowed. A domain relationship cycle is rejected only when the vocabulary's
static contract prohibits it; Neutral does not infer execution semantics.

## Required evidence

Fixtures MUST cover every declaration kind, forward value and identity
references, value reuse in records and lists, namespace
qualification, duplicate cross-kind names, shadowing, case-confusable names,
static value-dependency cycles, valid reference-only cycles, and
source-name/display-name/IR-identity distinctions.
