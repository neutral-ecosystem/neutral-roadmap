# Neutral Editor v0 language integration contract

Status: integration proposal; blocked on concrete `neutral-lang` APIs

## Current constraint

The current Neutral language v0 architecture is a small, typed, immutable,
effect-free language. Its vocabulary boundary is closed and data-only. It
deliberately exposes no public syntax tree, IR rewrite API, runtime authority,
or executable vocabulary plugin model.

Consequently, the editor cannot truthfully derive executable function/event
nodes from installed Neutral v0 vocabularies, execute a graph, or round-trip
arbitrary source using only the currently documented public contracts.

This is a dependency fact, not a reason for the editor to reach into compiler
internals.

## Minimum v0 adapter

The editor needs one implementation-neutral adapter with behavior equivalent to:

```text
capabilities() -> {
  adapterVersion
  supportedLanguageVersions
  projectionProfiles
  diagnosticSpanSupport
}

validate({
  sourceBytes
  logicalSourceIdentity
  capturedVocabulary
  limits
  cancellation
}) -> {
  requestRevision
  outcome
  diagnostics[]
}
```

Diagnostics should include stable code, severity, message, and original-byte
span when available. The editor supplies its generated-span map separately and
owns mapping those spans to nodes and ports.

The adapter must not expose private compiler recovery nodes as a stable editor
contract. A future editor-oriented recovery service may be proposed separately
from authoritative compilation.

## Pinned descriptor fixture

Until a Neutral-owned authoring metadata contract exists, v0 uses a small
pinned descriptor fixture for the accepted projection profile. It is test input,
not an installed package format or extension API.

The fixture may describe:

- immutable scalar binding nodes;
- scalar value inputs;
- one typed output representing ordinary value reuse; and
- documentation and property-control hints needed by the generic renderer.

The projector maps those descriptors only to already accepted Neutral syntax.
It cannot add source constructs or infer runtime behavior.

## Contracts required after v0

Metadata-driven installed nodes require a Neutral-owned, versioned authoring
descriptor contract that answers:

- Which language construct or vocabulary symbol does the node represent?
- Which ports are values, identities, control, events, or effects?
- What are their exact types, cardinalities, defaults, and compatibility rules?
- Which properties are authoring-time constants versus connected values?
- How does a graph construct project to source without hiding meaning?
- Which documentation and UI hints are non-semantic?
- How are descriptor identity, version, compatibility, and integrity captured?
- How are unknown required fields rejected?

Runtime controls additionally require a separate execution protocol covering
capabilities, authorization, start/cancel semantics, event ordering, node-state
correlation, logs, resource limits, and failure reconciliation. None of that is
implied by successful compilation.

## Compatibility rule

The editor must negotiate adapter capabilities and fail visibly when a required
profile is absent. It must not guess from a compiler version, search ambient
installation paths, or fall back to an older behavior silently.
