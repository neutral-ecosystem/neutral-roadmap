# Section 10: domain vocabulary surface

Status: proposed

Answers: `SYN-DOM-001` through `SYN-DOM-006`

## SYN-DOM-001 — Namespace-qualified vocabulary types

Vocabulary-owned declarations use an explicit alias plus an ordinary qualified
type-first binding:

```neu
flow::Pipeline verify = {
    config: ref(config),
}
```

`Pipeline` is not in the core grammar's keyword set. There is no separate domain
declaration production: the selected data-only bundle describes the qualified
type's allowed scope, fields, references, static constraints, features, and
behavioral classification.

Neutral parses the contextual braced value using the expected `flow::Pipeline`
type and validates the bundle contract. It does not implement pipeline or OS
behavior. Unknown or incorrectly qualified types are name/type diagnostics;
known vocabulary types with invalid payloads are vocabulary diagnostics.

## SYN-DOM-002 — Identity and required features

Each used vocabulary is declared before ordinary declarations:

```neu
requires vocabulary "org.neutral.flow" as flow {
    schema: "0.1",
    behavior: "0.1",
    features: ["pipeline", "typed-reference"],
}
```

The header identity and both body versions are exact strings whose canonical
forms are defined by the vocabulary packaging contract. They are not ranges or
mutable tags. `as flow` explicitly binds the source-local namespace alias.
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

Vocabulary-owned contextual bodies use core scalar, record, list, null,
reference, secret-reference, enum, and other qualified vocabulary-owned value
forms. Every field has a schema identity and expected type.

The following design is rejected:

```neu
flow::Pipeline verify = {
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
| Qualified type absent | Unknown vocabulary member |
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
