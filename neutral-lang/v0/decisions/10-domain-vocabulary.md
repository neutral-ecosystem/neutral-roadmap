# Section 10: domain vocabulary surface

Status: proposed

Answers: `SYN-DOM-001` through `SYN-DOM-006`

## SYN-DOM-001 — Namespaced domain declarations

Domain declarations use a vocabulary alias and bundle-defined kind:

```neu
flow::pipeline verify {
    config: ref(config),
}
```

The surface production is generic; `pipeline` is not in the core grammar's
keyword set. The selected data-only bundle describes the kind's allowed scope,
fields, types, references, static constraints, features, and behavioral
classification.

Neutral parses the generic braced field form and validates the bundle contract.
It does not implement pipeline or OS behavior. Unknown unqualified declaration
kinds are syntax errors; unknown qualified kinds are vocabulary diagnostics.

## SYN-DOM-002 — Identity and required features

Each used vocabulary is declared before ordinary declarations:

```neu
requires vocabulary flow {
    id: "org.neutral.flow",
    schema: "0.1",
    behavior: "0.1",
    features: ["pipeline", "typed-reference"],
}
```

Identity and both versions are exact strings whose canonical forms are defined
by the vocabulary packaging contract. They are not ranges or mutable tags.
`features` lists every feature the source requires; order is presentation
only and duplicates are invalid.

The generated IR records resolved bundle content identity and actual supported
features, not only these source spellings.

## SYN-DOM-003 — Request is not activation

`requires vocabulary` is a requirement assertion, not a package fetch or
permission grant. Compilation succeeds only when the caller's request:

- permits the exact vocabulary and behavior version;
- provides an exact captured bundle through its resolver;
- supports every requested required feature; and
- satisfies configured trust/package policy.

Source cannot select a local shared library, network endpoint, filesystem path,
credential, trust root, or “latest” version. If policy and source disagree,
compilation fails before domain payload validation.

## SYN-DOM-004 — Behavioral data and metadata

The bundle, not the source author, classifies each field/feature as:

- required behavioral data;
- optional behavioral data that still requires explicit feature understanding;
  or
- optional non-behavioral metadata that may be ignored or preserved under the
  declared round-trip policy.

All three use ordinary schema-named fields in v0; there is no universal
`extensions` or `metadata` bag. An author cannot relabel behavioral data as
metadata. Unknown behavioral fields fail closed. Unknown optional metadata is
accepted only if its envelope is explicitly declared by a supported schema
feature; otherwise unknown fields are errors.

## SYN-DOM-005 — Typed fields rather than extension maps

Domain bodies and values use core scalar, record, list, null/absence, reference,
secret-reference, enum, and qualified domain-value forms. Every field has a
schema identity and expected type.

The following design is rejected:

```neu
flow::pipeline verify {
    extensions: {
        arbitrary_provider_blob: "...",
    },
}
```

unless `extensions` itself is a precisely typed Flow field whose captured
schema defines ownership, must-understand behavior, bounds, and portability
classification. An untyped map is never the fallback for missing syntax.

## SYN-DOM-006 — Diagnostic taxonomy

Domain failures remain distinguishable:

| Condition | Diagnostic class |
| --- | --- |
| Alias was never declared | Unknown vocabulary alias |
| Bundle not provided/permitted | Vocabulary resolution/policy |
| Schema or behavior version unsupported | Vocabulary compatibility |
| Required feature unsupported | Required-feature negotiation |
| Qualified kind/type absent | Unknown vocabulary member |
| Field missing, duplicated, unknown, or wrong type | Domain payload validation |
| Declaration in disallowed scope | Domain placement |
| Static constraint fails | Domain contract |
| Consumer rejects otherwise valid IR | Consumer diagnostic, not compiler syntax |

Every diagnostic identifies source span, vocabulary identity/version, responsible
layer, and safe remedy. Bundle code is never executed to render a message.

## Required evidence

Use at least one Flow and one Neux data-only bundle fixture. Tests MUST cover
exact version matching, disallowed policy, every feature state, unknown fields
by classification, invalid placement, bounded payload rejection, and proof that
compilation performs no ambient lookup or extension execution.
