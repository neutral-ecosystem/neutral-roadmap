# Neutral language v0 syntax decisions

Status: working v0 decision baseline

These files answer every item in
[the v0 syntax checklist](../syntax-checklist.md), grouped by its section.
They define a coherent candidate syntax but do not mark the checklist complete:
completion still requires review, a normative grammar, implementation,
diagnostic fixtures, source maps, and consumer conformance evidence.

Editable author-facing synthesis:
[proposed v0 syntax guide](../proposed-syntax-guide.md).

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
module acme::delivery

requires vocabulary "org.neutral.flow" as flow {
    schema: "0.1",
    behavior: "0.1",
    features: ["pipeline"],
}

record ImageConfig {
    string image,
    string? note,
    List<string> labels = [],
}

ImageConfig base = {
    image: "example.invalid/tool:1",
    note: null,
    labels: ["portable"],
}

namespace checks {
    flow::Pipeline verify = {
        config: ref(acme::delivery::base),
    }
}
```

This is a language-design fixture, not a claim that `flow::Pipeline` has any
particular CI/CD meaning. The Flow vocabulary owns that type's contract and
the Flow consumer owns its interpretation.

## Deliberate v0 exclusions

v0 has no unmarked mutation, imports written in source, executable macros,
general loops, anonymous functions, implicit network lookup, native plugins,
shell execution, provider credentials, or runtime lifecycle syntax. Later
checklists may add composition and symbolic structure, but only through their
recorded decisions.

Bindings are immutable by default. The explicitly marked, local-only `mut`
form remains provisional until a cross-domain case justifies retaining it.
