# Neutral language v0 syntax decisions

Status: working v0 decision baseline

Editable author-facing synthesis:
[proposed v0 syntax guide](../proposed-syntax-guide.md).

Initial positive, negative, and numeric cases:
[v0 fixture index](../fixtures/README.md).


Normative words such as **MUST**, **MUST NOT**, and **MAY** describe the proposed
contract. Flow and Neux behavior is illustrative only and remains owned by those
applications.

## Decision files

| Checklist section | Decision record |
| --- | --- |
| 1. Governing syntax boundaries | [01-governing-boundaries.md](01-governing-boundaries.md) |
| 2. Lexical and source-text rules | [02-lexical-source-text.md](02-lexical-source-text.md) |
| 3. Documents, modules, imports, and profiles | [03-documents-modules-profiles.md](03-documents-modules-profiles.md) |
| 4. Declarations, bindings, and names | [04-declarations-bindings-names.md](04-declarations-bindings-names.md) |
| 5. Type and schema notation | [05-type-schema-notation.md](05-type-schema-notation.md) |
| 6. Literal values and value construction | [06-literal-values.md](06-literal-values.md) |
| 7. References and structural relationships | [07-references-relationships.md](07-references-relationships.md) |
| 10. Domain vocabulary surface | [10-domain-vocabulary.md](10-domain-vocabulary.md) |
| 12. Security-sensitive syntax | [12-security-sensitive-syntax.md](12-security-sensitive-syntax.md) |
| 13. Diagnostics and invalid/incomplete syntax | [13-diagnostics-invalid-syntax.md](13-diagnostics-invalid-syntax.md) |
| 14. Documentation, formatting, and tools | [14-documentation-formatting-tools.md](14-documentation-formatting-tools.md) |
| 15. Evolution and conformance | [15-evolution-conformance.md](15-evolution-conformance.md) |

## Coherent v0 surface

The decision set uses this shape for examples:

```neu
neu "0.1"
module acme_delivery

use Flow

pub record ImageConfig {
    string image,
    string? note,
    List<string> labels = [],
}

pub ImageConfig base = {
    image: tool_image,
    note: null,
    labels: ["portable"],
}

string tool_image = "example.invalid/tool:1"

pub namespace checks {
    pub Flow::Pipeline verify = {
        config: ref(base),
    }
}
```

This is a language-design fixture, not a claim that `Flow::Pipeline` has any
particular CI/CD meaning. The Flow vocabulary owns that type's contract and
the Flow consumer owns its interpretation.

## Deliberate v0 exclusions

v0 has no mutation or reassignment, source-module/package imports, executable macros,
general loops, anonymous functions, implicit network lookup, native plugins,
shell execution, provider credentials, or runtime lifecycle syntax. Later
checklists may add composition and symbolic structure, but only through their
recorded decisions.

Every binding is immutable. Future work first designs immutable derivation and
composition, then explicit override with provenance. Actual mutation is
investigated only if both mechanisms fail concrete Flow and independently
designed Neux cases.
