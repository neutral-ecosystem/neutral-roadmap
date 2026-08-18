# Section 7: references and structural relationships

Status: proposed

Answers: `SYN-REF-001` through `SYN-REF-004`

## SYN-REF-001 — Reference form

`ref(qualified-name)` is the only v0 value-binding-reference expression:

```neu
ref(config)
```

It is distinct from a declaration, text, module, path, and domain value. It
accepts one symbolic name, not computed text. Its target MUST be a value binding;
record/type declarations, namespaces, modules, and vocabulary namespaces are
invalid target kinds. A target binding of declared type `T` produces `Ref<T>`
and lowers to target document/element identity, expected target kind, and
provenance.

`string` text equal to a declaration name remains text. References are never inferred
from strings.

## SYN-REF-002 — Qualification

| Form | Example | Rule |
| --- | --- | --- |
| Local | `ref(config)` | Current scope, then lexical parents |
| Namespace | `ref(checks::config)` | Named namespace in current module |
| Module | `ref(acme::common::config)` | Exact module in captured closure |

A module-qualified reference does not fetch. v0 has no module/package imports; the
request/resolver supplies the captured closure. Paths and URLs are illegal in
`ref(...)`. Resolution never searches ambient files or packages.

Unresolved, ambiguous, inaccessible, wrong-kind, and missing-closure targets
receive different diagnostics.

`ref(x)` links the identity of binding `x`; it does not evaluate or snapshot the
value at that source position. If `x` is mutable, the linked identity carries
the final emitted value after valid assignments are processed.

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

The direct initialization-cycle check ignores `ref(...)` edges. A cycle made
entirely from typed references is therefore structurally valid; a cycle that
requires embedding or evaluating another binding's value is invalid. A consumer
may separately reject a reference cycle under its domain rules.

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

Fixtures MUST cover every qualification, text/reference distinction, missing
closure units, types/namespaces/modules/vocabularies as wrong-kind targets,
ambiguous targets, mutable-target identity behavior, direct initialization
cycles versus valid reference-only cycles, containment versus linking, and one
Flow plus one Neux relationship without shared behavior.
