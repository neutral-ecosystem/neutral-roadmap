# Neutral language v1 vocabulary contracts

Status: accepted

This document defines only the v1 delta over the accepted v0 vocabulary bundle.
It adds multiple exact bundles, `url`/`path` schema types, explicit vocabulary-
type visibility, and a separate non-semantic authoring-metadata format. All v0
JSON security, exact-number, default-value, limit, digest, closed-schema, and
data-only rules remain inherited.

## Semantic bundle profile

The v1 semantic bundle media type is:

```text
application/vnd.neutral.vocabulary+json;version=1.0
```

Its top-level closed envelope retains the v0 fields with these exact versions:

```json
{
  "format": "neutral-vocabulary-bundle",
  "encoding_version": "1.0",
  "schema_version": "1.0",
  "identity": "ExampleDomain",
  "version": "1.2.3",
  "required_features": [],
  "types": []
}
```

`identity` is the canonical vocabulary identity. `version` is one exact
semantic revision, never a range. One project may lock only one version for a
given identity.

## Type visibility

A v1 type object adds one required closed `visibility` field:

```json
{
  "name": "Pipeline",
  "visibility": "public",
  "fields": []
}
```

Allowed values are:

- `public`: source may name the type through a vocabulary alias, and public
  Neutral signatures may expose it; or
- `internal`: the semantic contract may use it to validate nested/default data,
  but Neutral source cannot name it and it cannot occur in a public signature.

An internal type reachable from a public type's field signature makes the
bundle invalid. This prevents a nominal type from being source-public while its
interpretive type closure is inaccessible.

Type-array order and field-array order remain non-semantic and normalize under
the inherited v0 rules. Changing visibility changes the canonical vocabulary
semantic identity and therefore project meaning when the vocabulary is locked.

## Added schema types

v1 adds two closed type objects wherever inherited scalar type objects are
allowed:

```json
{ "kind": "url" }
{ "kind": "path" }
```

Their defaults use the inherited tagged string-value representation with the
declared expected type. They preserve decoded scalar text and grant no
acquisition or platform authority.

## Multiple bundle rules

The captured request supplies an exact lock for every distinct canonical
vocabulary identity used by source. Bundles remain independent: a vocabulary
type cannot name a type owned by another vocabulary in v1. A bundle cannot
contain dependencies, imports, registry coordinates, scripts, validators,
native code, UI components, callbacks, or acquisition instructions.

The semantic lock validates:

```text
canonical identity
exact semantic revision
schema and encoding versions
exact byte digest
enabled feature set
normalized semantic identity
```

Formatting changes alter the exact byte digest and captured closure identity but
not the normalized semantic identity when all validated semantic fields remain
equal.

## Authoring metadata profile

Authoring metadata is a different inert input with media type:

```text
application/vnd.neutral.vocabulary-authoring+json;version=1.0
```

Its closed top-level envelope is:

```json
{
  "format": "neutral-vocabulary-authoring",
  "encoding_version": "1.0",
  "schema_version": "1.0",
  "identity": "ExampleDomain",
  "semantic_version": "1.2.3",
  "semantic_identity_digest": "sha256:<lowercase-hex>",
  "types": []
}
```

The identity, version, and semantic identity digest must match the exact
semantic contract supplied to catalogue discovery. Metadata cannot be supplied
without its semantic contract.

## Authoring type and field hints

```json
{
  "name": "Pipeline",
  "title": "Pipeline",
  "description": "A portable delivery pipeline.",
  "category": ["Flow", "Pipelines"],
  "order": "0100",
  "icon": "pipeline",
  "preferred_presentation": "card",
  "fields": []
}
```

```json
{
  "name": "image",
  "title": "Image",
  "description": "Container image reference.",
  "order": "0200",
  "preferred_presentation": "port",
  "initial_visibility": "visible"
}
```

All members shown are required except `description` and `icon`, which may be
absent. Type `preferred_presentation` is `card` or `nested`. Field
`preferred_presentation` is `property`, `port`, or `nested`. Field
`initial_visibility` is the independent token `visible` or
`hidden-when-defaulted`. Initial visibility changes only initial display; it
never changes source omission/default semantics.

Metadata entries must match existing semantic types and fields exactly. They
cannot add/remove fields, change visibility, types, defaults, requiredness,
nullability, cardinality, compatibility, validation, or source projection.
Duplicate, unknown, or mismatched type/field entries fail metadata validation.
The `types` and nested `fields` arrays are sparse presentation overrides:
omitted semantic types and fields receive the deterministic generic fallback.
An omitted override is not removal and has no semantic effect.
Only public, source-authorable types and their fields may have metadata entries.
An entry for an internal or otherwise non-authorable type is treated as
`v1-vocabulary-authoring-entry-unknown`; it cannot make that type visible.

`title`, `description`, category segments, ordering tokens, and icon tokens are
bounded by the corresponding Neutral authoring v1 `Presentation` ceilings and
are untrusted text. They cannot contain HTML authority, scripts, external
resource URLs, filesystem paths, callbacks, or component identifiers. The
Editor maps an icon token only through its own inert built-in icon namespace.

## Metadata identity and absence

`VocabularyAuthoringMetadataIdentity` is SHA-256 over an NHT-v1 frame with
domain `neutral/vocabulary-authoring-metadata-identity/v1`, encoding/schema
versions, canonical vocabulary identity, exact semantic revision and semantic
identity digest, and normalized validated metadata entries. Sparse maps are
ordered by framed semantic type/field identity. The identity affects descriptor
catalogue identity only. It never affects captured closure, logical project,
project IR, or compiler derivation identity.

If metadata is absent, the authoring bridge deterministically derives titles
from semantic names, uses an empty category, orders by canonical framed semantic
identity, and selects generic presentation from the semantic type/field shape.
Absence is therefore supported and deterministic.

## Diagnostic ownership

Core Neutral v1 owns semantic-bundle validation codes:

```text
v1-vocabulary-encoding-unsupported
v1-vocabulary-visibility-invalid
v1-vocabulary-public-closure-invalid
v1-vocabulary-cross-dependency
```

Neutral authoring v1, not core, owns metadata-validation codes:

```text
v1-vocabulary-authoring-encoding-unsupported
v1-vocabulary-authoring-semantic-mismatch
v1-vocabulary-authoring-entry-unknown
v1-vocabulary-authoring-entry-duplicate
v1-vocabulary-authoring-hint-invalid
```

This ownership lets the metadata format evolve with the authoring profile
without changing the core language diagnostic registry. All failures are
bounded data-validation failures. No semantic or authoring bundle is executed.
