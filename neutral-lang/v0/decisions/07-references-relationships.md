# Section 7: references and structural relationships

Status: proposed

Answers: `SYN-REF-001` through `SYN-REF-004`

## SYN-REF-001 — Reference form

`ref(qualified-name)` is the only v0 symbolic identity-reference expression:

```neu
ref(config)
```

It is distinct from a declaration, text, module, path, and domain value. It
accepts one symbolic name, not computed text. Its target MUST be a value binding;
record/type declarations, namespaces, modules, and vocabulary namespaces are
invalid target kinds. A target binding of declared type `T` produces `Ref<T>`
and lowers to target document/element identity, expected target kind, and
provenance.

`string` text equal to a declaration name remains text. Identity references are
never inferred from strings or ordinary value use. In value position, `config`
uses an immutable binding value while `ref(config)` links its identity.

## SYN-REF-002 — Qualification

| Form | Example | Rule |
| --- | --- | --- |
| Local | `ref(config)` | Current scope, then lexical parents |
| Namespace | `ref(checks::config)` | Named namespace in current module |

v0 has no module-qualified reference, source-module import, or cross-module
source access. `::` traverses namespaces inside the current module or a captured
vocabulary namespace; it never denotes a module boundary. Paths and URLs are
illegal in `ref(...)`. Resolution never searches ambient files or packages.

Unresolved, ambiguous, inaccessible, and wrong-kind targets receive different
diagnostics.

`ref(x)` links the identity of immutable binding `x`; it does not evaluate,
copy, or snapshot the value at that source position. Declaration identities are
collected first, so `ref(...)` may target a later binding. This forward identity
resolution is independent from ordinary value-dependency resolution.

## SYN-REF-003 — Containment versus linking

Braced nesting establishes containment only where the construct's contract says
so:

```neu
namespace checks {
    string config = "value"
}
```

`ref(checks::config)` links but does not copy, contain, own, order, or schedule.
Source proximity/order imply nothing. IR gives containment and reference
different relationship kinds. Indentation never establishes either.

The static value-dependency cycle check follows ordinary binding-value uses and
ignores `ref(...)` edges. A cycle made entirely from typed identity references is
therefore structurally valid; a cycle that requires reading another binding's
value is invalid. Every nominal record cycle must cross a `Ref<T>` edge;
nullability and list containment do not break the cycle. A consumer may
separately reject an identity-reference cycle under its domain rules.

## SYN-REF-004 — Typed domain relationships

```neu
Flow::Dependency check_after_build = {
    from: ref(build),
    to: ref(check),
}
```

The bundle declares field types, endpoint kinds, multiplicity, features, and
static constraints. Neutral resolves and checks links but does not call them
execution edges, decide readiness, infer cycle meaning, or define failure
propagation. Relationship identity and endpoint spans remain in IR.

## Required evidence

Fixtures MUST cover every permitted qualification, rejection of module-shaped
qualification, text/reference distinction, types/namespaces/modules/vocabularies as wrong-kind targets,
ambiguous targets, forward ordinary-value and identity targets, static value
cycles versus valid identity-reference-only cycles, embedded nullable/list
recursion versus `Ref<T>` recursion, containment versus linking, and one Flow
plus one Neux relationship without shared behavior.
