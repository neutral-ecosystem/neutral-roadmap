# Neutral authoring v1 contract

Status: accepted

Neutral authoring v1 is the separately versioned, data-only bridge between an
exact Neutral core profile and generic authoring tools such as Neutral Editor.
It does not alter core semantics, expose a compiler AST, or permit executable
vocabulary extensions.

## Contract notation and limits

`AId<K>` is a validated authoring identifier of kind `K` with at most 256 UTF-8
bytes. `Id<K>`, `Count`, `Text<N>`, `Bytes<N>`, `List<T,N>`, `Map<K,V,N>`, and
`Optional<T>` have the same bounded meanings as the core project contract. Maps
reject duplicate keys. Every recursive authoring value and type expression has
a maximum depth of 128.

An implementation advertises hard ceilings and supports at least:

| Authoring limit | Baseline minimum supported ceiling |
| --- | ---: |
| Modules | 256 |
| Elements | 100,000 |
| Connections | 1,000,000 |
| Catalogue plus overlay descriptors | 100,000 |
| Ports or properties per descriptor | 256 |
| Conditions or constraints per descriptor | 64 |
| Children in one source slot | 100,000 |
| Comments | 100,000 |
| Bytes per comment | 64 KiB |
| Total comment bytes | 8 MiB |
| Title / order / icon text | 256 bytes |
| Short description | 1 KiB |
| Documentation text | 16 KiB |
| Category segments | 16 segments of 128 bytes |
| Opaque optional metadata entries | 64 |
| Bytes per opaque entry | 64 KiB |
| Total opaque metadata bytes | 1 MiB |
| Element/source mapping entries | 1,000,000 |

Callers may request lower ceilings. Limit checks occur before proportional
allocation and use the same fail-closed rules as core processing.

```text
AuthoringLimits {
  modules: Count
  elements: Count
  connections: Count
  descriptors: Count
  portsPerDescriptor: Count
  propertiesPerDescriptor: Count
  conditionsPerDescriptor: Count
  constraintsPerDescriptor: Count
  childrenPerSlot: Count
  valueDepth: Count
  comments: Count
  bytesPerComment: Count
  totalCommentBytes: Count
  opaqueMetadataEntries: Count
  bytesPerOpaqueEntry: Count
  totalOpaqueBytes: Count
  elementSourceMappings: Count
}

AuthoringOperationControls {
  limits: AuthoringLimits
  cancellationToken: Optional<Bytes<128>>
}
```

## Profile tuple

Every authoring operation names one exact tuple:

```text
AuthoringProfileTuple {
  adapterProtocolProfile: Profile
  coreLanguageProfile: Profile
  irProfile: Profile
  coreAuthoringProfile: Profile
  descriptorSchemaProfile: Profile
  vocabularySemanticContracts: List<VocabularySemanticContract, 64>
  vocabularyAuthoringMetadataProfiles:
    List<VocabularyAuthoringMetadataProfile, 64>
}
```

Semantic contracts and authoring metadata match by canonical vocabulary
identity and compatible semantic revision. Authoring metadata may be absent; the
bridge then produces deterministic generic labels. Metadata for an absent or
different semantic contract is rejected.

The tuple is the finite host-selected vocabulary set available to that
authoring session; it performs no discovery or acquisition. An imported project
must find every captured vocabulary lock as an exact member, but the tuple may
also contain unused authoring choices. Those extras affect catalogue/profile-
tuple identity only. When source is projected, the host places only the exact
source-used subset into `CapturedProjectRequest`, whose core lock set remains
an exact cover.

## Discovery

```text
LanguageRegistry.discover() -> List<LanguageInstallation, 64>

LanguageInstallation {
  installationIdentity: AId<Installation>
  adapterProtocolProfiles: List<Profile, 64>
  coreLanguageProfiles: List<Profile, 64>
  irProfiles: List<Profile, 64>
  authoringProfiles: List<Profile, 64>
}

LanguageAdapter.capabilities(exactProfileTuple: AuthoringProfileTuple)
  -> AuthoringCapabilities

AuthoringCapabilities {
  exactProfileTupleIdentity: Digest
  operations: List<"describe-authoring" | "new-project" |
                   "import-project" | "describe-project" |
                   "project-sources" | "format-sources" |
                   "check-compatibility" | "validate-project", 8>
  requiredCapabilityIds: List<AId<Capability>, 64>
  descriptorSchemaProfile: Profile
  hardLimits: AuthoringLimits
  explicitExclusions: List<ExplicitExclusion, 256>
}
```

Discovery is host-driven. Source content cannot cause installation, filesystem
search, registry access, network access, or profile substitution.

Capabilities advertise project shape, operations, limits, required capability
IDs, descriptor schema, diagnostic mapping, formatting support, compatibility
support, and explicit exclusions. A version string alone never determines UI.

## Descriptor catalogue operation

```text
describeAuthoring({
  exactProfileTuple: AuthoringProfileTuple
  controls: AuthoringOperationControls
}) -> DescriptorCatalogue | AuthoringFailure
```

The operation is deterministic, bounded, side-effect free, and performs no
external I/O. The descriptor ceiling applies to the combined catalogue and
overlay descriptor count, not independently to each list.

```text
DescriptorCatalogue {
  schemaVersion: "1.0"
  catalogueIdentity: Digest
  profileTupleIdentity: Digest
  constructDescriptors: List<ConstructDescriptor, 100000>
  typeDescriptors: List<TypeDescriptor, 100000>
  valueFormDescriptors: List<ValueFormDescriptor, 100000>
  projectActionDescriptors: List<ProjectActionDescriptor, 100000>
  explicitExclusions: List<ExplicitExclusion, 256>
}

ExplicitExclusion {
  featureIdentity: AId<Feature>
  reason: "not-in-core-profile" | "not-in-authoring-profile" |
          "missing-capability" | "intentionally-unsupported"
}
```

The catalogue identity binds every exact profile and metadata input plus the
canonical catalogue payload. Local source aliases are absent from catalogue
identity.

## Authoring identities

All authoring identities use SHA-256 over NHT-v1 with canonical map/set ordering
and exclude their own identity field:

```text
AuthoringProfileTupleIdentity = hash(
  "neutral/authoring-profile-tuple-identity/v1",
  adapter, core language, IR, core authoring, and descriptor profiles,
  map vocabulary identity -> canonical vocabulary semantic identity,
  map vocabulary identity -> vocabulary authoring-metadata identity or absent
)

DescriptorCatalogueIdentity = hash(
  "neutral/descriptor-catalogue-identity/v1",
  authoring profile tuple identity,
  canonical DescriptorCatalogue payload without catalogueIdentity
)

ProjectDescriptorOverlayIdentity = hash(
  "neutral/project-descriptor-overlay-identity/v1",
  descriptor catalogue identity,
  authoring revision,
  canonical ProjectDescriptorOverlay payload without overlayIdentity
)
```

Presentation metadata participates in authoring identities but never in core
capture, logical project, compiler derivation, or artifact identities.

## Common descriptor fields

```text
DescriptorHeader {
  descriptorIdentity: AId<Descriptor>
  owner:
    CoreOwner(coreAuthoringProfile: Profile) |
    VocabularyOwner(canonicalVocabularyIdentity: Id<Vocabulary>,
                    semanticRevision: Text<128>) |
    ModuleOwner(logicalModuleIdentity: Id<LogicalModule>)
  kind: "construct" | "type" | "value-form" | "project-action"
  schemaVersion: "1.0"
  requiredCapabilityIds: List<AId<Capability>, 64>
  availabilityConditions: List<AvailabilityCondition, 64>
  presentation: Presentation
}

Presentation {
  title: Text<256>
  shortDescription: Optional<Text<1024>>
  documentation: Optional<Text<16384>>
  categoryPath: List<Text<128>, 16>
  orderKey: Text<256>
  iconToken: Optional<Text<256>>
}

AvailabilityCondition =
  RequiresCapability(AId<Capability>) |
  RequiresSemanticFeature(AId<Feature>) |
  RequiresContext("project" | "module" | "root-declaration" |
                  "record-field" | "value" | "list-element")

Constraint =
  IdentifierCategory("snake-name" | "type-name" | "module-name" |
                     "vocabulary-name") |
  CollectionCardinality(min: Count, max: Count) |
  AllowedValueForms(List<AId<ValueForm>, 32>) |
  UniqueWithin("project" | "module" | "parent-slot") |
  ReadOnlyDerived
```

All availability conditions are conjunctive. Constraints only restate behavior
owned by the selected core or semantic vocabulary contract; authoring metadata
cannot add them.

Descriptor identity has immutable meaning within its owner/profile. An
incompatible semantic change requires a new descriptor identity or owner
revision. Presentation fields are bounded untrusted text and cannot affect
source projection, compatibility, or compilation.
`ModuleOwner` occurs only in a project descriptor overlay; the static catalogue
contains only core and vocabulary owners.

## Construct/card descriptor

```text
ConstructDescriptor {
  header: DescriptorHeader
  semanticProjectionKind: SemanticProjectionKind
  sourceSlot: AId<SourceSlot>
  ports: List<PortDescriptor, 256>
  properties: List<PropertyDescriptor, 256>
  permittedChildContexts: List<ContextKind, 32>
  constraints: List<Constraint, 64>
}

SemanticProjectionKind =
  "module" | "import" | "vocabulary-requirement" |
  "record-declaration" | "binding-declaration" |
  "contextual-record-value" | "list-value" | "scalar-value" |
  "value-reuse" | "identity-reference"

ContextKind =
  "project" | "module" | "root-declaration" | "record-field" |
  "value" | "list-element"
```

`semanticProjectionKind` is closed data understood by the selected adapter. It
is not executable code.

A displayed card represents authorable Neutral data. It does not imply a
function, invocation, event, task, command, workflow node, or runtime behavior.

## Port descriptor

```text
PortDescriptor {
  portIdentity: AId<Port>
  direction: "input" | "output"
  edgeKind: "value-reuse" | "identity-reference"
  typeExpression: TypeExpression
  cardinality: "one" | "optional-one" | "many"
  required: bool
  sourceSlot: AId<SourceSlot>
  presentation: Presentation
}
```

Value reuse and identity reference are never interchangeable. The exact type
expression uses canonical core/module/vocabulary type identities, not display
text or source aliases.

## Property descriptor

```text
PropertyDescriptor {
  propertyIdentity: AId<Property>
  sourceSlot: AId<SourceSlot>
  valueFormIdentity: AId<ValueForm>
  expectedType: TypeExpression
  required: bool
  defaulted: bool
  nullable: bool
  cardinality: "one" | "optional-one" | "many"
  nestingBehavior: "inline" | "child-element" | "connection"
  constraints: List<Constraint, 64>
  presentation: Presentation
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

```text
TypeExpression =
  Core(Id<CoreType>) |
  Nominal(Id<CanonicalType>) |
  Nullable(TypeExpression) |
  ListOf(TypeExpression) |
  RefTo(TypeExpression)

TypeDescriptor {
  header: DescriptorHeader
  typeIdentity: Id<CanonicalType>
  expression: TypeExpression
  sourceName: Optional<Text<256>>
  authorable: bool
}

ValueFormDescriptor {
  header: DescriptorHeader
  valueFormIdentity: AId<ValueForm>
  form: "bool-literal" | "number-literal" | "string-literal" |
        "url-literal" | "path-literal" | "null" |
        "record" | "list" | "value-reuse" | "identity-reference"
  acceptedTypeShapes: List<"exact" | "nullable" | "list" | "ref", 4>
}

ProjectActionDescriptor {
  header: DescriptorHeader
  actionKind: "create-module" | "delete-module" | "rename-module" |
              "add-element" | "remove-element" | "move-element" |
              "set-property" | "connect" | "disconnect"
  targetContexts: List<ContextKind, 32>
  inputProperties: List<PropertyDescriptor, 256>
}
```

Recursive type expressions use the authoring depth limit. `authorable: false`
permits display of a resolved type without offering it as a source choice.

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
  exactProfileTupleIdentity: Digest
  edgeKind: "value-reuse" | "identity-reference"
  sourceTypeIdentity: Id<CanonicalType>
  targetTypeIdentity: Id<CanonicalType>
}) -> {
  compatible: bool
  conversionKind: "identity" | "outer-nullable-widening" | "none"
  reasonCode: Optional<Text<128>>
}
```

The query is pure and bounded. It applies inherited v0 compatibility after
resolving exact v1 identities. Compiler validation is authoritative. A mismatch
between preflight and compilation is an adapter conformance failure.

## Authoring project

```text
AuthoringProject {
  schemaVersion: "1.0"
  exactProfileTupleIdentity: Digest
  authoringRevision: Text<128>
  modules: List<AuthoringModule, 256>
  elements: Map<AId<Element>, AuthoringElement, 100000>
  connections: Map<AId<Connection>, AuthoringConnection, 1000000>
  promisedComments: Map<AId<Comment>, AuthoringComment, 100000>
  opaqueOptionalMetadata: Map<AId<OptionalMetadata>, Bytes<65536>, 64>
}

AuthoringModule {
  logicalSourceIdentity: Id<LogicalSource>
  logicalModuleIdentity: Id<LogicalModule>
  orderedRootElementIds: List<AId<Element>, 100000>
}

AuthoringElement {
  authoringElementId: AId<Element>
  descriptorIdentity: AId<Descriptor>
  owningModuleIdentity: Id<LogicalModule>
  parent: Optional<{
    parentElementId: AId<Element>,
    sourceSlotIdentity: AId<SourceSlot>
  }>
  slotValues: Map<AId<SourceSlot>, AuthoringValue, 256>
  orderedChildIdsBySlot:
    Map<AId<SourceSlot>, List<AId<Element>, 100000>, 256>
}

AuthoringConnection {
  authoringConnectionId: AId<Connection>
  edgeKind: "value-reuse" | "identity-reference"
  source: { elementId: AId<Element>, portIdentity: AId<Port> }
  target: { elementId: AId<Element>, portIdentity: AId<Port> }
}

AuthoringValue =
  Absent | Null | Bool | ExactNumberText(Text<256>) | Text(Text<65536>) |
  Identifier(Text<256>) | TypeIdentity(Id<CanonicalType>) |
  ModuleIdentity(Id<LogicalModule>) | VocabularyIdentity(Id<Vocabulary>) |
  List(List<AuthoringValue, 100000>) |
  Record(Map<AId<Property>, AuthoringValue, 256>)

AuthoringComment {
  commentId: AId<Comment>
  owningModuleIdentity: Id<LogicalModule>
  style: "line" | "block"
  text: Text<65536>
  anchor:
    ModuleAnchor("after-language-header" | "after-module-header" |
                 "end-of-module") |
    ElementAnchor(AId<Element>, "before" | "after") |
    SlotAnchor(AId<Element>, AId<SourceSlot>, "before" | "after")
  orderKey: Text<256>
}
```

Every collection and recursive value uses advertised depth and size limits.
Element and connection IDs are unique only within one authoring project.
Parent/child membership, module ownership, slot cardinality, descriptor
availability, and connection endpoints must agree in both directions. Ordered
root/child lists are the authoritative source order where order is semantic or
promised for authoring stability.

Connections are the sole representation of value reuse and identity-reference
edges. `AuthoringValue` deliberately has no symbol-identity variant. A source
slot owned by a connected target port must be `Absent`; supplying both a slot
value and a connection is `v1-authoring-edge-conflict`. Source projection
follows the target port's declared source slot and rejects duplicate incoming
edges that exceed its cardinality.

A connection source names an `output` port, its target names an `input` port,
and its edge kind must equal both port descriptors. Both elements and ports must
exist under the exact catalogue/overlay revision; compatibility preflight and
compiler validation then apply the declared type expressions.

Opaque metadata keys must be declared optional and non-semantic by the selected
authoring capability profile. Total opaque bytes and total comment bytes are
checked in addition to the per-entry limits.

Comment `text` is decoded comment content without delimiter tokens. The adapter
selects valid delimiters for the declared style; content not representable in
that style fails projection instead of being rewritten silently.

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
  exactProfileTuple: AuthoringProfileTuple
  descriptorCatalogueIdentity: Digest
  authoringProject: AuthoringProject
  controls: AuthoringOperationControls
}) -> ProjectDescriptorOverlay | AuthoringFailure

ProjectDescriptorOverlay {
  schemaVersion: "1.0"
  overlayIdentity: Digest
  baseCatalogueIdentity: Digest
  authoringRevision: Text<128>
  moduleDescriptors: List<ModuleDescriptor, 256>
  moduleTypeDescriptors: List<TypeDescriptor, 100000>
  typeBindings: List<ProjectTypeBinding, 100000>
  localSymbolDescriptors: List<SymbolDescriptor, 100000>
  importedPublicSymbolDescriptors: List<SymbolDescriptor, 100000>
  aliasDescriptors: List<AliasDescriptor, 100000>
  actionAvailability: List<ActionAvailability, 100000>
}

ModuleDescriptor {
  logicalModuleIdentity: Id<LogicalModule>
  logicalSourceIdentity: Id<LogicalSource>
  presentation: Presentation
}

ProjectTypeBinding {
  visibleFromModuleIdentity: Id<LogicalModule>
  typeIdentity: Id<CanonicalType>
  typeDescriptorIdentity: AId<Descriptor>
  bindingKind: "local" | "module-import" | "vocabulary-requirement"
  sourceSpelling: Text<1024>
  visibility: "private" | "public"
}

SymbolDescriptor {
  moduleSymbolIdentity: Id<ModuleSymbol>
  visibleFromModuleIdentity: Id<LogicalModule>
  bindingKind: "local" | "module-import"
  declaredType: TypeExpression
  visibility: "private" | "public"
  selectableAs: List<"value-reuse" | "identity-reference", 2>
  sourceSpelling: Text<1024>
  presentation: Presentation
}

AliasDescriptor {
  alias: Text<256>
  target: ModuleAlias(Id<LogicalModule>) | VocabularyAlias(Id<Vocabulary>)
  owningModuleIdentity: Id<LogicalModule>
}

ActionAvailability {
  actionDescriptorIdentity: AId<Descriptor>
  target: ProjectTarget | ModuleTarget(Id<LogicalModule>) |
          ElementTarget(AId<Element>)
  available: bool
  unavailableReason: Optional<"wrong-context" | "private-target" |
                              "cardinality" | "name-conflict" |
                              "unsupported-capability">
}
```

The overlay is deterministic for the exact authoring revision and base
catalogue. It exposes canonical identities plus source aliases as presentation
bindings. It does not change catalogue, project, or language identity. An
Editor discards it when either identity or revision no longer matches.

For an invalid intermediate project, the bridge returns diagnostics and no
overlay. The Editor retains its own submitted authoring data while correcting
it; stale or recovery descriptors are never treated as compatibility facts.

## Public operations

```text
importProject({
  exactProfileTuple: AuthoringProfileTuple
  capturedProject: CapturedProject
  controls: AuthoringOperationControls
}) -> AuthoringProject | AuthoringFailure

newProject({
  exactProfileTuple: AuthoringProfileTuple
  initialModules: List<InitialModule, 256>
  controls: AuthoringOperationControls
}) -> AuthoringProject | AuthoringFailure

describeProject({
  exactProfileTuple: AuthoringProfileTuple
  descriptorCatalogueIdentity: Digest
  authoringProject: AuthoringProject
  controls: AuthoringOperationControls
}) -> ProjectDescriptorOverlay | AuthoringFailure

projectSources({
  exactProfileTuple: AuthoringProfileTuple
  authoringProject: AuthoringProject
  controls: AuthoringOperationControls
}) -> {
  authoringRevision: Text<128>
  sourceUnits: List<ProjectedSourceUnit, 256>
  elementSourceMap: List<ElementSourceMapping, 1000000>
  requiredVocabularyIdentities: List<Id<Vocabulary>, 64>
} | AuthoringFailure

formatSources({
  exactProfileTuple: AuthoringProfileTuple
  sourceUnits: List<ProjectedSourceUnit, 256>
  elementSourceMap: List<ElementSourceMapping, 1000000>
  controls: AuthoringOperationControls
}) -> FormattedSourceProjection | AuthoringFailure

validateProject({
  exactProfileTuple: AuthoringProfileTuple
  capturedProject: CapturedProject
  compilerDerivationRequest: CompilerDerivationRequest
  processingControls: ProcessingControls
  authoringLimits: AuthoringLimits
}) -> ValidationResult

InitialModule {
  logicalSourceIdentity: Id<LogicalSource>
  logicalModuleIdentity: Id<LogicalModule>
}

ProjectedSourceUnit {
  logicalSourceIdentity: Id<LogicalSource>
  logicalModuleIdentity: Id<LogicalModule>
  sourceBytes: Bytes<4194304>
  authoritative: bool
}

ElementSourceMapping {
  authoringElementIdentity: AId<Element> | AId<Connection> | AId<Comment>
  logicalSourceIdentity: Id<LogicalSource>
  sourceSlotIdentity: Optional<AId<SourceSlot>>
  startByte: Count
  endByte: Count
}

FormattedSourceProjection {
  sourceUnits: List<ProjectedSourceUnit, 256>
  elementSourceMap: List<ElementSourceMapping, 1000000>
}

ValidationResult {
  requestRevision: Optional<Text<128>>
  outcome: "valid" | "invalid" | "resource-exhausted" | "cancelled" |
           "service-unavailable" | "internal-defect"
  diagnostics: List<CoreOrAuthoringDiagnostic, 10000>
  compilationResult: Optional<ProjectCompilationResult>
}
```

`compilationResult` is present exactly when outcome is `valid`. Recovery source
projections use `authoritative: false` and cannot be captured as a successful
authoring projection without a later authoritative projection pass.

`projectSources` owns all version-specific spelling. It returns deterministic
UTF-8 `.neu` units and mappings for headers, vocabulary requirements, imports,
declarations, fields, properties, values, reuse edges, and reference edges. Its
canonical duplicate-free vocabulary-identity list lets the host select the
matching exact locks without parsing projected source.

`newProject` creates a valid empty authoring project with exact profile and
module/source identities chosen explicitly by the host. It performs no
acquisition and does not infer module identity from a path. The host and Editor
edit only the public authoring data model; `describeProject`, compatibility
preflight, and validation provide derived guidance, while source projection and
compilation remain authoritative.

The host forms `CapturedProjectRequest` by combining projected bytes with
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

must produce equal `CanonicalLogicalForm` and logical project identity. The
selected authoring profile additionally preserves every comment position and
opaque optional metadata it promises to round-trip. Formatting differences do
not affect logical equality.

## Failures and authoring diagnostics

```text
AuthoringFailure {
  outcome: "invalid-input" | "unsupported-profile" |
           "unsupported-required-capability" | "descriptor-conflict" |
           "vocabulary-semantic-mismatch" |
           "vocabulary-authoring-metadata-mismatch" |
           "unrepresentable-authoring-state" | "resource-exhausted" |
           "cancelled" | "service-unavailable" | "internal-defect"
  diagnostics: List<AuthoringDiagnostic, 10000>
  recoverySources: List<ProjectedSourceUnit, 256>
}

CoreOrAuthoringDiagnostic = CoreDiagnostic | AuthoringDiagnostic

AuthoringDiagnostic {
  fields: DiagnosticFields
  layer: "authoring"
  authoringElementIdentity: Optional<AId<Element> | AId<Connection> |
                                       AId<Comment>>
}
```

Every recovery source has `authoritative: false`; the list is empty when no
safe source recovery exists. No failure returns an authoritative authoring
project, descriptor overlay, compilation result, or IR. Unknown optional
non-semantic metadata may be preserved only under a declared optional key;
unknown required fields fail closed.

Authoring cancellation tokens are operational, grant no authority, and enter
no catalogue, overlay, project, source, derivation, or artifact identity.

Required authoring-v1 codes are:

```text
v1-authoring-model-invalid
v1-authoring-edge-conflict
v1-authoring-overlay-stale
v1-authoring-limit
v1-vocabulary-authoring-encoding-unsupported
v1-vocabulary-authoring-semantic-mismatch
v1-vocabulary-authoring-entry-unknown
v1-vocabulary-authoring-entry-duplicate
v1-vocabulary-authoring-hint-invalid
```

## Security and limits

Capability, descriptor, metadata, authoring-project, source, diagnostic, and
adapter messages are untrusted. All text, lists, nesting, descriptors, ports,
properties, mappings, diagnostics, and opaque fields have explicit bounds.

Descriptors contain no scripts, callbacks, native modules, bytecode, validators,
HTML authority, network lookup, filesystem lookup, process access, or UI
components. Successful projection or compilation grants no permission to read,
execute, reveal, or contact anything.
