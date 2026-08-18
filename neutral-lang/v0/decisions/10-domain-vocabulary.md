# Section 10: domain vocabulary surface

Status: proposed

Answers: `SYN-DOM-001` through `SYN-DOM-006`

## SYN-DOM-001 — Namespace-qualified vocabulary types

Vocabulary-owned declarations use a namespace introduced by `use` plus an
ordinary qualified type-first binding:

```neu
Flow::Pipeline verify = {
    config: ref(config),
}
```

`Pipeline` is not in the core grammar's keyword set. There is no separate domain
declaration production: the selected data-only bundle describes the qualified
type's allowed scope, fields, references, static constraints, features, and
behavioral classification.

Neutral parses the contextual braced value using the expected `Flow::Pipeline`
type and validates the bundle contract. It does not implement pipeline or OS
behavior. Unknown or incorrectly qualified types are name/type diagnostics;
known vocabulary types with invalid payloads are vocabulary diagnostics.

## SYN-DOM-002 — Identity and required features

Each used vocabulary namespace is declared before ordinary declarations:

```neu
use Flow
```

The general form is `use Vocabulary`; `Flow` is an identifier, not a keyword.
For example, a future Neux source can say `use Neux`. `Flow` is a source-local
logical name. The captured lock manifest maps it to the exact vocabulary
identity, bundle content digest, schema version, behavior version, and supported
feature set. The mapping is not a range, mutable tag, or ambient registry result.
The import exposes members only as qualified names such as `Flow::Pipeline`; it
does not inject an unqualified `Pipeline` into the source scope.

Every vocabulary member/field declares the features needed to understand it.
The compiler derives the actually used required-feature set, verifies it against
the resolved bundle, and records both the exact resolution and used features in
IR/derivation. Newly added unused features are not imported implicitly.

## SYN-DOM-003 — Request is not activation

`use Flow` is a vocabulary-namespace requirement, not a package fetch or
permission grant. Compilation succeeds only when the caller's captured manifest
and policy:

- permits the exact vocabulary and behavior version;
- provides an exact captured bundle through its resolver;
- supports every feature required by the used vocabulary members; and
- satisfies configured trust/package policy.

Source cannot select a local shared library, network endpoint, filesystem path,
credential, trust root, or “latest” version. If policy and source disagree,
compilation fails before domain payload validation.

## SYN-DOM-004 — Field presence, nullability, and behavior

Vocabulary schemas use the same field model as Neutral records. Each known
field independently declares:

- presence: required, or defaulted and therefore omittable;
- type nullability: non-nullable or nullable; and
- interpretation: behavioral data or non-behavioral metadata.

There is no second vocabulary-only notion of an “optional field.” A nullable
field without a default is still required. A defaulted non-nullable field may be
omitted. The compiler records omission/default application separately from an
explicit `null`.

All fields use ordinary schema-named forms in v0; there is no universal
`extensions` or `metadata` bag. An author cannot relabel behavioral data as
metadata. Unknown behavioral fields fail closed. Unknown non-behavioral metadata
is accepted only when a supported schema feature explicitly defines its bounded
envelope and ignore/preserve policy; otherwise unknown fields are errors.

## SYN-DOM-005 — Typed fields rather than extension maps

Vocabulary-owned contextual bodies use core scalar, record, list, null,
reference, secret-reference, enum, and other qualified vocabulary-owned value
forms. Every field has a schema identity, expected type, presence/default rule,
nullability, and behavioral classification.

The following design is rejected:

```neu
Flow::Pipeline verify = {
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
| Use name was never declared | Unknown vocabulary namespace |
| Lock mapping missing or ambiguous | Vocabulary lock resolution |
| Bundle not captured/permitted | Vocabulary resolution/policy |
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
exact lock resolution, missing/ambiguous/mutable mappings, disallowed policy,
used/unused/unsupported feature states, unknown fields by classification,
invalid placement, bounded payload rejection, and proof that compilation
performs no ambient lookup or extension execution.
