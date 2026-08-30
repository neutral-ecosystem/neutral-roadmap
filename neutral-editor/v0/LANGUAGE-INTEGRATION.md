# Neutral Editor v0 language integration contract

Status: integration proposal; blocked on concrete `neutral-lang` authoring APIs

## Current constraint

The current Neutral language v0 architecture specifies compiler, reader,
diagnostic, source-map, provenance, and data-only vocabulary contracts. It
deliberately exposes no public syntax tree or IR rewrite API.

Those public compiler contracts are sufficient for authoritative validation,
but not by themselves for all editor requirements. Full Neutral Editor v0
conformance additionally needs version/capability discovery and a public
authoring projection that can import and project the complete Neutral v0 source
surface without persisting compiler-private models.

This is a dependency fact, not permission for the editor to reach into compiler
internals or hard-code one language version.

## Discovery boundary

The host discovers installed adapters, then the editor explicitly selects the
profile required by a project:

```text
LanguageRegistry.discover() -> [
  {
    installationId
    adapterProtocolVersion
    supportedLanguageProfiles[]
  }
]

LanguageAdapter.capabilities(profileId) -> {
  languageIdentity
  languageVersion
  authoringProfileVersion
  documentShape
  constructs[]
  typeConstructors[]
  valueForms[]
  compatibilityService
  capturedInputRequirements
  vocabularyCapabilities
  operations
  diagnosticCapabilities
  limits
}
```

For Neutral language v0, `documentShape` reports exactly one source unit and one
logical module. The generic editor does not encode those numbers as permanent
UI rules. A later profile may report nested or multiple document contexts and
activate the same navigation abstraction differently.

Capability IDs are versioned contracts with immutable meaning. Unknown required
IDs fail closed. A language version string is display and selection data; it is
not a substitute for capability negotiation.

## Required v0 authoring capabilities

The Neutral v0 profile must describe the complete accepted surface:

- canonical language and module headers;
- zero or one captured data-only vocabulary requirement;
- record and immutable binding declarations;
- identifier categories and protected names;
- `num`, `string`, `bool`, nominal records, `T?`, `List<T>`, `Ref<T>`, and
  vocabulary-owned nominal data types;
- exact numbers, strings, Booleans, `null`, nested contextual records, ordered
  homogeneous lists, ordinary value reuse, and `ref(name)`;
- record fields, required/defaulted and nullable/non-nullable states, and
  closed constant defaults;
- forward resolution, type compatibility, reference target checks, recursion,
  and value-cycle validation ownership;
- comments and reference formatting behavior;
- source-map, provenance, diagnostic, cancellation, and resource-limit support;
  and
- explicit exclusions so the UI cannot mistake an unavailable construct for an
  optional control.

Nested record and list values are part of this profile. Nested source units,
modules, namespaces, and subgraphs are not.

## Authoring and validation operations

The editor needs behavior equivalent to:

```text
importSource({
  profileId
  sourceBytes
  logicalSourceIdentity
  capturedVocabulary
  limits
}) -> AuthoringProjection | ImportDiagnostics

projectSource({
  profileId
  authoringDocument
  limits
}) -> {
  sourceBytes
  elementSourceMap
}

validate({
  profileId
  sourceBytes
  logicalSourceIdentity
  capturedVocabulary
  behaviorVersions
  limits
  cancellation
  requestRevision
}) -> {
  requestRevision
  outcome
  diagnostics[]
  validatedIrHandle?
  sourceMap?
  provenance?
  derivation?
  resourceFacts?
}
```

`AuthoringProjection` is a public editor-facing contract, not the compiler AST.
It represents declarations, types, source value forms, reuse/reference intent,
comments supported for round-tripping, stable source anchors, and opaque
extension fields. Recovery records must never be mistaken for a valid semantic
document.

`projectSource` owns version-specific source spelling and reference formatting.
The generic editor owns interaction and presentation, not Neutral tokens.

Diagnostics include stable code, layer, severity, safe parameters/message,
primary and related original-byte spans, optional remedy, and truncation state
when the compiler provides them. The editor maps those spans through its
element/source table without changing diagnostic meaning or ordering.

## Compatibility queries

Port compatibility and property controls must use declared capability data or a
side-effect-free adapter query. The editor may cache responses under the exact
profile and type identities that produced them.

```text
checkCompatibility(profileId, sourceType, targetType) -> {
  compatible
  conversionKind
  reasonCode?
}
```

For the current v0 profile the adapter will report exact identity plus outer
`T` to `T?` widening and invariant generic arguments. The generic editor must
not contain those rules as permanent Neutral-specific code.

## Vocabulary boundary

The adapter resolves the one optional vocabulary only from host-supplied exact
captured inputs. The capability/profile response and vocabulary contract may
generate generic editors for vocabulary-owned nominal records and values.

They cannot contribute executable function/event nodes, scripts, callbacks,
custom validators, bytecode, native libraries, or React components. Executable
nodes and runtime controls require separate future language/runtime contracts.

## Compatibility and failure rules

- Missing exact profile: preserve the project and open unresolved/read-only.
- Unknown required capability: fail closed and identify the capability.
- Adapter unavailable: distinguish service failure from invalid source.
- Import unsupported: report the missing capability; do not parse privately.
- Vocabulary mismatch: preserve affected values and show compatibility
  diagnostics; never substitute a different bundle.
- Capability/profile change: invalidate derived UI state and validation caches;
  never migrate the project implicitly.
- Invalid or recovered source: show diagnostics, but produce no authoritative
  editor semantic document or IR.

The editor must not guess from a compiler version, search ambient installation
paths from source, or fall back to another profile silently.
