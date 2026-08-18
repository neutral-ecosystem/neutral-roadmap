# Section 1: governing syntax boundaries

Status: proposed

Answers: `SYN-GOV-001` through `SYN-GOV-006`

## SYN-GOV-001 — Representation boundaries

The ecosystem has four distinct representation contracts:

| Representation | Owner | Public stability | Permitted contents |
| --- | --- | --- | --- |
| Concrete `.neu` source | neutral-lang specification | Versioned public contract | Author notation, comments, vocabulary `use` requirements |
| Compiler-private models | neutral-lang implementation | None | Tokens, recovery state, syntax trees, resolution/type state, lowering forms |
| Neutral IR | neutral-lang IR specification | Independently versioned public contract | Resolved identities, typed structure, vocabulary-owned data, provenance links |
| Consumer-private model | Flow or Neux | Private to that application | Flow plans or Neux OS models and their domain behavior |

The only supported direction is:

```text
.neu -> private compiler models -> Neutral IR -> one consumer-private model
```

The future Flow GUI MUST emit `.neu`. Flow and Neux MUST consume Neutral IR
and MUST NOT parse `.neu` to recover omitted information. Neutral IR MUST NOT
contain a Flow logical/bound plan, runtime record, or Neux execution plan. A
consumer-private model MUST NOT be presented as a second ecosystem-wide IR.

Publishing the parser AST is rejected because it would couple tools to recovery
and grammar details. Letting Flow parse `.neu` is rejected because it creates
a second language implementation. Putting consumer plans in Neutral IR is
rejected because it couples unrelated applications.

Evidence MUST show that an effect-free consumer uses only the public IR API,
that a compiler-private refactor can retain logically equal IR, and that a
consumer diagnostic maps back through a source map without the private AST.

## SYN-GOV-002 — Lowering and provenance

Every accepted construct MUST have:

1. a documented surface form;
2. an abstract meaning independent of punctuation;
3. deterministic lowering into public IR or explicitly non-semantic source-map
   data; and
4. an origin chain containing captured source-unit identity and half-open byte
   span.

Comments and formatting are source trivia. Trivia MAY remain in the private tree
but MUST NOT alter logical IR. v0 has no documentation-attachment syntax.

Generated or normalized IR elements MUST name their originating construct.
Lowering MUST NOT invent Flow or Neux semantics or discard required domain data.
If required data has no public IR representation, compilation fails with an
internal contract diagnostic; a consumer is never expected to reparse source.

## SYN-GOV-003 — Core-promotion rule

A new Neutral core construct requires one concrete Flow case and one
independently developed Neux case, the same abstract invariant in both, an
explanation of why vocabulary data is insufficient, positive and negative
fixtures, and compatibility/provenance analysis.

Shape similarity alone is insufficient. Similar shapes with different behavior
remain in separate vocabularies. v0 core syntax is limited to modules,
namespaces, type-first bindings, nominal records, typed values, explicit
references, vocabulary declarations, and comments.

The union of Flow and Neux keywords is explicitly rejected as a core design.

## SYN-GOV-004 — Core and vocabulary syntax

Core declarations use unqualified reserved forms such as `record`, `mut`,
and `namespace`. Vocabulary-owned types use the same type-first binding grammar
as core and local types and MUST be namespace-qualified:

```neu
Flow::Pipeline verify = {
    config: ref(config),
}
```

Here `Flow` is introduced by `use Flow` and resolved through the compilation
request's captured lock manifest. `Pipeline` is a type described by that exact
bundle, not a special Neutral declaration-kind production. The compiler owns
parsing, qualification, schema validation, references, bounds, and provenance.
Flow owns its CI/CD meaning.

An unknown or incorrectly qualified type is invalid. A vocabulary cannot
redefine core tokens, identifier rules, scoping, identity, or provenance.

## SYN-GOV-005 — Syntax is not authority

Acceptance means only that source is well formed under selected compiler and
vocabulary contracts. No construct can, by spelling alone, authorize an actor,
mint or forward a credential, prove a signer, assert target capability, execute
a command/network request, or prove an external effect occurred.

Capability, policy, trust, and effect declarations are typed claims for a
consumer. The responsible consumer and policy layer decide acceptance and
enforcement. `secret_ref(...)` identifies an opaque request; it does not
resolve or grant access to a secret.

## SYN-GOV-006 — Completion standard

A syntax item may be checked only when all of these exist:

- normative prose and a grammar production, or an explicit no-production note;
- at least two valid examples;
- malformed, ambiguous-looking, wrong-kind, and boundary examples;
- stable diagnostic code, span, and recovery behavior;
- logical lowering and provenance rules;
- security and resource-limit treatment;
- formatter behavior;
- positive and negative parser fixtures; and
- public IR/consumer conformance evidence where the construct reaches IR.

An implementation or example alone is not a specification. These records answer
the design questions but do not yet supply implementation and fixtures, so the
parent checklist remains unchecked.
