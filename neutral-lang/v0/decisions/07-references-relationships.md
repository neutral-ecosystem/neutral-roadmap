# Section 7: references and structural relationships

Status: proposed

Answers: `SYN-REF-001` through `SYN-REF-004`

## SYN-REF-001 — Reference form

`ref(qualified-name)` is the only v0 declaration-reference expression:

```neu
ref(config)
```

It is distinct from a declaration, text, module, path, and domain value. It
accepts one symbolic name, not computed text. It lowers to target document and
element identity, expected target kind, and provenance.

Text equal to a declaration name remains text. References are never inferred
from strings.

## SYN-REF-002 — Qualification

| Form | Example | Rule |
| --- | --- | --- |
| Local | `ref(config)` | Current scope, then lexical parents |
| Namespace | `ref(checks::config)` | Named namespace in current module |
| Module | `ref(acme::common::config)` | Exact module in captured closure |

A module-qualified reference does not fetch. v0 has no imports; the
request/resolver supplies the captured closure. Paths and URLs are illegal in
`ref(...)`. Resolution never searches ambient files or packages.

Unresolved, ambiguous, inaccessible, wrong-kind, and missing-closure targets
receive different diagnostics.

## SYN-REF-003 — Containment versus linking

Braced nesting establishes containment only where the construct's contract says
so:

```neu
namespace checks {
    let config: Text = "value";
}
```

`ref(checks::config)` links but does not copy, contain, own, order, or schedule.
Source proximity/order imply nothing. IR gives containment and reference
different relationship kinds. Indentation never establishes either.

## SYN-REF-004 — Typed domain relationships

```neu
flow::dependency check_after_build {
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
closure units, ambiguous/wrong-kind targets, containment versus linking, and one
Flow plus one Neux relationship without shared behavior.
