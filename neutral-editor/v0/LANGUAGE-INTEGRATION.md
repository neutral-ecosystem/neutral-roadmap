# Neutral Editor v0 language integration contract

Status: proposed integration contract; depends on Neutral authoring v1

## Baseline

Neutral Editor v0 is built after Neutral language v1 and uses Neutral v1 core
plus a compatible Neutral authoring v1 profile as its reference conformance
baseline. Language v1 inherits the released v0 language contract by reference;
the Editor does not duplicate either grammar.

The editor is a generic visual source author. It does not own Neutral parsing,
formatting, semantic validation, or IR production. The language bridge must
describe the installed authoring surface and translate between public authoring
records and `.neu` source. Ordinary Neutral capture and compilation remain the
only route from source to authoritative IR.

## Profile and catalogue discovery

The host discovers installed adapters and exact compatible profiles:

```text
LanguageRegistry.discover() -> LanguageInstallation[]

LanguageAdapter.capabilities(profileId) -> {
  coreProfile
  irProfile
  authoringProfile
  descriptorSchema
  projectShape
  capturedInputRequirements
  operations
  diagnosticCapabilities
  limits
  requiredCapabilityIds[]
}

LanguageAdapter.describeAuthoring({
  authoringProfile
  capturedVocabularyContracts[]
}) -> DescriptorCatalogue
```

The catalogue, not a language-version string, drives the palette, cards,
inspectors, ports, commands, nesting, and compatibility preflight. Its identity
commits to the exact core, authoring, descriptor-schema, and vocabulary profile
tuple. A change to any member invalidates derived controls and caches.

Every descriptor has a stable qualified identity, owner, schema version,
availability conditions, required capability IDs, and deterministic order.
Construct descriptors declare semantic projection kind, source slot, ports,
properties, child contexts, and constraints. Port descriptors declare
direction, semantic edge kind, exact type expression, cardinality, and
requiredness. Property descriptors declare type/value form,
required/defaulted/nullability state, cardinality, and nesting.

Descriptors are immutable data. They contain no callbacks, scripts, native
modules, custom validators, UI components, ambient lookup, or authority grants.
Unknown required fields or capabilities fail closed; optional non-semantic
presentation fields may be preserved and ignored.

## Core and vocabulary contributions

The core authoring profile describes the complete selected language surface,
including projects, source units, modules, imports, aliases, visibility,
declarations, types, value forms, reuse, references, comments, `url`, `path`,
diagnostics, limits, and explicit exclusions.

Exact captured vocabulary semantic schemas are merged into the catalogue under
their canonical vocabulary identities. A separately identified authoring-
metadata profile may contribute bounded presentation hints such as title,
category, documentation, order, and icon token. Changing those hints invalidates
the catalogue but not compiled project meaning. Local source aliases do not
change descriptor identity.

A displayed card is an authoring projection of Neutral data. It is not thereby
a language function, event, command, or executable node. A future Flow
vocabulary may define records and conventions that appear as cards, but Flow
Core interprets the compiled IR and Flow-owned system/provider mappers perform
CI/CD mapping. Neither Neutral language nor the generic Editor executes them.

## Project authoring operations

The bridge supplies behavior equivalent to:

```text
importProject({
  authoringProfile
  capturedProject
  limits
}) -> AuthoringProject | ImportDiagnostics

projectSources({
  authoringProfile
  authoringProject
  limits
}) -> {
  sourceUnits[]
  elementSourceMap
}

checkCompatibility({
  authoringProfile
  sourceType
  targetType
  edgeKind
}) -> CompatibilityResult
```

`AuthoringProject` is a public editor-facing projection, not a compiler AST. It
represents source units, modules, imports, visibility, declarations, types,
source value forms, comments promised for round-trip, stable source anchors,
and opaque supported extensions. Recovery data is never authoritative.

`projectSources` owns version-specific spelling and produces every `.neu`
source unit plus mappings from editor elements to generated source spans. The
host combines those bytes with the exact core profile, explicit logical
source/module identities, exact vocabulary semantic locks, and the capture
contract version to form `CapturedProjectRequest`. Processing limits,
cancellation, and request revision are supplied separately. Root/export
selection is a later `ViewRequest`, not capture data. None of these facts is
guessed from canvas presentation.

Neutral capture verifies that every projected `neu` header matches the selected
core profile and every projected `module` header matches the logical module
identity supplied by the host. It also rejects duplicate source identities,
missing imports, and conflicting semantic revisions of one canonical
vocabulary. The Editor presents those as capture diagnostics rather than
repairing or renaming source silently.

## Authoritative validation loop

```text
descriptor catalogue
    -> generic canvas edits
    -> AuthoringProject
    -> projectSources
    -> `.neu` source units + element/source map
    -> CapturedProjectRequest
    -> captureProject / compileCapturedProject
    -> IR + diagnostics + source map + provenance
    -> optional consumer ViewRequest
    -> mapped Editor diagnostics
```

The compiler receives source bytes, not the editor graph. Source projection or
frontend compatibility preflight does not establish validity. A generated
project is authoritative only after ordinary Neutral capture and compilation
succeed.

Validation is revisioned and cancellable. Diagnostics retain stable code,
layer, severity, safe parameters/message, logical source identity, primary and
related byte spans, optional remedy, and truncation state. The Editor maps them
through the returned element/source table without changing their meaning or
ordering and discards stale revisions.

## Compatibility and failure rules

- Missing exact profile: preserve the project and open unresolved/read-only.
- Unknown required capability or descriptor field: fail closed and identify it.
- Adapter unavailable: distinguish service failure from invalid source.
- Import or projection unavailable: report the absent operation; do not parse
  or format privately.
- Vocabulary mismatch: preserve affected data and report it; never substitute a
  different vocabulary contract.
- Catalogue tuple change: invalidate derived UI and validation caches; never
  migrate implicitly.
- Invalid or recovered source: show diagnostics, but expose no authoritative
  authoring project or IR.

The Editor never searches ambient paths or networks because of source content,
falls back to another profile silently, emits Neutral IR, or treats successful
compilation as authorization for an external effect.
