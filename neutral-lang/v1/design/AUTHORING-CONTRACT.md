# Neutral authoring v1 contract

Status: accepted

Neutral authoring v1 is the separately versioned, data-only bridge between an
exact Neutral core profile and generic authoring tools such as Neutral Editor.
It does not alter core semantics, expose a compiler AST, or permit executable
vocabulary extensions.

## Profile tuple

Every authoring operation names one exact tuple:

```text
AuthoringProfileTupleV1 {
  adapterProtocolProfile
  coreLanguageProfile
  irProfile
  coreAuthoringProfile
  descriptorSchemaProfile
  vocabularySemanticContracts[]
  vocabularyAuthoringMetadataProfiles[]
}
```

Semantic contracts and authoring metadata match by canonical vocabulary
identity and compatible semantic revision. Authoring metadata may be absent; the
bridge then produces deterministic generic labels. Metadata for an absent or
different semantic contract is rejected.

## Discovery

```text
LanguageRegistry.discover() -> LanguageInstallation[]

LanguageInstallation {
  installationIdentity
  adapterProtocolProfiles[]
  coreLanguageProfiles[]
  irProfiles[]
  authoringProfiles[]
}

LanguageAdapter.capabilities(exactProfileTuple) -> AuthoringCapabilitiesV1
```

Discovery is host-driven. Source content cannot cause installation, filesystem
search, registry access, network access, or profile substitution.

Capabilities advertise project shape, operations, limits, required capability
IDs, descriptor schema, diagnostic mapping, formatting support, compatibility
support, and explicit exclusions. A version string alone never determines UI.

## Descriptor catalogue operation

```text
describeAuthoring({
  coreAuthoringProfile
  vocabularySemanticContracts[]
  vocabularyAuthoringMetadataProfiles[]
  limits
}) -> DescriptorCatalogueV1 | AuthoringFailure
```

The operation is deterministic, bounded, side-effect free, and performs no
external I/O.

```text
DescriptorCatalogueV1 {
  schemaVersion: "1.0"
  catalogueIdentity
  profileTupleIdentity
  constructDescriptors[]
  typeDescriptors[]
  valueFormDescriptors[]
  projectActionDescriptors[]
  explicitExclusions[]
}
```

The catalogue identity binds every exact profile and metadata input plus the
canonical catalogue payload. Local source aliases are absent from catalogue
identity.

## Common descriptor fields

```text
DescriptorHeaderV1 {
  descriptorIdentity
  owner:
    CoreOwner(coreAuthoringProfile) |
    VocabularyOwner(canonicalVocabularyIdentity, semanticRevision)
  kind
  schemaVersion
  requiredCapabilityIds[]
  availabilityConditions[]
  presentation
}

PresentationV1 {
  title
  shortDescription?
  documentation?
  categoryPath[]
  orderKey
  iconToken?
}
```

Descriptor identity has immutable meaning within its owner/profile. An
incompatible semantic change requires a new descriptor identity or owner
revision. Presentation fields are bounded untrusted text and cannot affect
source projection, compatibility, or compilation.

## Construct/card descriptor

```text
ConstructDescriptorV1 {
  header
  semanticProjectionKind
  sourceSlot
  ports[]
  properties[]
  permittedChildContexts[]
  constraints[]
}
```

`semanticProjectionKind` is a closed identifier understood by the selected
adapter, such as module, import, vocabulary requirement, record declaration,
binding declaration, contextual record value, list value, scalar value, value
reuse, or identity reference. It is not executable code.

A displayed card represents authorable Neutral data. It does not imply a
function, invocation, event, task, command, workflow node, or runtime behavior.

## Port descriptor

```text
PortDescriptorV1 {
  portIdentity
  direction: "input" | "output"
  edgeKind: "value-reuse" | "identity-reference"
  typeExpression
  cardinality: "one" | "optional-one" | "many"
  required
  sourceSlot
  presentation
}
```

Value reuse and identity reference are never interchangeable. The exact type
expression uses canonical core/module/vocabulary type identities, not display
text or source aliases.

## Property descriptor

```text
PropertyDescriptorV1 {
  propertyIdentity
  sourceSlot
  valueFormIdentity
  expectedType
  required
  defaulted
  nullable
  cardinality
  nestingBehavior
  constraints[]
  presentation
}
```

Required/defaulted and nullable/non-nullable are independent. Presentation
metadata cannot override semantic requiredness, default, type, cardinality, or
nesting.

## Type and value-form descriptors

The profile catalogue contains descriptors for the complete profile-owned
surface:

- `num`, `string`, `bool`, `url`, and `path`;
- exported vocabulary nominal records;
- `T?`, `List<T>`, and `Ref<T>`; and
- explicit exclusions for unsupported types.

Value-form descriptors cover exact scalar literals, `null` under nullable
context, contextual record values, ordered lists, ordinary reuse, and identity
references. Exact numbers are represented as source-compatible text or a
lossless decimal structure, never host floating point.

Local records, imported records, bindings, aliases, and availability choices
depend on an authoring project and therefore never appear in this static
catalogue. They appear in the project descriptor overlay defined below.

## Vocabulary descriptor derivation

The bridge derives semantic ports and properties from the exact vocabulary
semantic contract. Authoring metadata may provide only:

- title and bounded documentation;
- category path and deterministic order key;
- icon token from the Editor's inert icon namespace; and
- non-semantic grouping or preferred generic presentation mode.

It cannot add or remove fields, alter types/defaults/requiredness, create custom
validation, declare effects, inject source, or provide code/components. A
conflict with semantic schema fails catalogue construction.

Future Flow vocabulary records and conventions use this same mechanism. Flow
Core interprets compiled IR; Neutral authoring and the generic Editor do not.

## Compatibility preflight

```text
checkCompatibility({
  exactProfileTupleIdentity
  edgeKind
  sourceTypeIdentity
  targetTypeIdentity
}) -> {
  compatible
  conversionKind: "identity" | "outer-nullable-widening" | "none"
  reasonCode?
}
```

The query is pure and bounded. It applies inherited v0 compatibility after
resolving exact v1 identities. Compiler validation is authoritative. A mismatch
between preflight and compilation is an adapter conformance failure.

## Authoring project

```text
AuthoringProjectV1 {
  schemaVersion: "1.0"
  exactProfileTupleIdentity
  authoringRevision
  modules: List<AuthoringModuleV1, maxSourceUnits>
  elements: Map<AuthoringElementId, AuthoringElementV1, maxAuthoringElements>
  connections: Map<AuthoringConnectionId, AuthoringConnectionV1,
                   maxAuthoringConnections>
  promisedComments[]
  opaqueOptionalMetadata
}

AuthoringModuleV1 {
  logicalSourceIdentity
  logicalModuleIdentity
  orderedRootElementIds[]
}

AuthoringElementV1 {
  authoringElementId
  descriptorIdentity
  owningModuleIdentity
  parent: Optional<{ parentElementId, sourceSlotIdentity }>
  slotValues: Map<SourceSlotIdentity, AuthoringValueV1>
  orderedChildIdsBySlot: Map<SourceSlotIdentity, List<AuthoringElementId>>
}

AuthoringConnectionV1 {
  authoringConnectionId
  edgeKind: "value-reuse" | "identity-reference"
  source: { elementId, portIdentity }
  target: { elementId, portIdentity }
}

AuthoringValueV1 =
  Absent | Null | Bool | ExactNumberText | Text |
  Identifier | TypeIdentity | SymbolIdentity |
  List<AuthoringValueV1> | Record<Map<PropertyIdentity, AuthoringValueV1>>
```

Every collection and recursive value uses advertised depth and size limits.
Element and connection IDs are unique only within one authoring project.
Parent/child membership, module ownership, slot cardinality, descriptor
availability, and connection endpoints must agree in both directions. Ordered
root/child lists are the authoritative source order where order is semantic or
promised for authoring stability.

The schema is directly editable data: a generic Editor creates, removes,
reorders, nests, and updates elements and connections according to descriptors.
No executable edit callback is required. Invalid intermediate data may be sent
to validation for diagnostics but cannot be projected as authoritative source.

It is an editor-facing projection, not compiler AST or logical IR. Stable
authoring IDs are local to this projection and never become module-symbol,
logical project, or runtime identities.

## Project descriptor overlay

Project-local and imported names cannot be part of the profile catalogue
because that catalogue has no project input. The bridge derives them
separately:

```text
describeProject({
  exactProfileTuple
  descriptorCatalogueIdentity
  authoringProject
  limits
}) -> ProjectDescriptorOverlayV1 | AuthoringFailure

ProjectDescriptorOverlayV1 {
  schemaVersion: "1.0"
  overlayIdentity
  baseCatalogueIdentity
  authoringRevision
  moduleDescriptors[]
  localTypeDescriptors[]
  importedTypeDescriptors[]
  localSymbolDescriptors[]
  importedPublicSymbolDescriptors[]
  aliasDescriptors[]
  actionAvailability[]
}
```

The overlay is deterministic for the exact authoring revision and base
catalogue. It exposes canonical identities plus source aliases as presentation
bindings. It does not change catalogue, project, or language identity. An
Editor discards it when either identity or revision no longer matches.

For an invalid intermediate project, the bridge may return diagnostics and a
clearly non-authoritative recovery overlay. A recovery overlay cannot be used
for compatibility decisions, source projection, capture, or compilation.

## Public operations

```text
importProject({
  exactProfileTuple
  capturedProject
  limits
}) -> AuthoringProjectV1 | ImportFailure

newProject({
  exactProfileTuple
  initialModules[]
  limits
}) -> AuthoringProjectV1 | AuthoringFailure

describeProject({
  exactProfileTuple
  descriptorCatalogueIdentity
  authoringProject
  limits
}) -> ProjectDescriptorOverlayV1 | AuthoringFailure

projectSources({
  exactProfileTuple
  authoringProject
  limits
}) -> {
  sourceUnits[]
  elementSourceMap
} | ProjectionFailure

formatSources({
  exactProfileTuple
  sourceUnits[]
  limits
}) -> FormattedSourceProjection | FormattingFailure

validateProject({
  exactProfileTuple
  capturedProject
  compilerDerivationRequest
  processingControls
}) -> ValidationResult
```

`projectSources` owns all version-specific spelling. It returns deterministic
UTF-8 `.neu` units and mappings for headers, vocabulary requirements, imports,
declarations, fields, properties, values, reuse edges, and reference edges.

`newProject` creates a valid empty authoring project with exact profile and
module/source identities chosen explicitly by the host. It performs no
acquisition and does not infer module identity from a path. The host and Editor
edit only the public authoring data model; `describeProject`, compatibility
preflight, and validation provide derived guidance, while source projection and
compilation remain authoritative.

The host forms `CapturedProjectRequestV1` by combining projected bytes with
explicit source/module identities, the exact core profile, and exact vocabulary
semantic locks. The compiler consumes only that request, never the authoring
project or canvas graph.

## Round trip

For a valid captured project:

```text
importProject
    -> projectSources with no semantic edit
    -> captureProject
    -> compileCapturedProject
```

must produce equal `CanonicalLogicalFormV1` and logical project identity. The
selected authoring profile additionally preserves every comment position and
opaque optional metadata it promises to round-trip. Formatting differences do
not affect logical equality.

## Failures

Closed failure outcomes are:

```text
invalid-input
unsupported-profile
unsupported-required-capability
descriptor-conflict
vocabulary-semantic-mismatch
vocabulary-authoring-metadata-mismatch
unrepresentable-authoring-state
resource-exhausted
cancelled
service-unavailable
internal-defect
```

Invalid or recovered source may return diagnostics and explicitly
non-authoritative recovery data. It cannot return an authoritative authoring
project or IR. Unknown optional non-semantic metadata may be preserved and
ignored; unknown required fields fail closed.

## Security and limits

Capability, descriptor, metadata, authoring-project, source, diagnostic, and
adapter messages are untrusted. All text, lists, nesting, descriptors, ports,
properties, mappings, diagnostics, and opaque fields have explicit bounds.

Descriptors contain no scripts, callbacks, native modules, bytecode, validators,
HTML authority, network lookup, filesystem lookup, process access, or UI
components. Successful projection or compilation grants no permission to read,
execute, reveal, or contact anything.
