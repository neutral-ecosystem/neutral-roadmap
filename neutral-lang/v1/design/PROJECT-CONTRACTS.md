# Neutral language v1 project and identity contracts

Status: accepted

This document freezes the public project, processing, view, identity, IR-delta,
diagnostic, and resource contracts needed to produce the v1 portable seed. The
wire encoding selected for each public API may be language binding specific, but
it must preserve this closed abstract data model exactly.

## Type notation

```text
Bytes<N>       bounded byte sequence
Text<N>        bounded Unicode scalar sequence
Id<T>          validated identity of kind T
Digest         { algorithm: "sha-256", bytes: Bytes<32> }
Profile        { identity: Text, version: Text, digest: Digest }
List<T, N>     ordered list with at most N elements
Map<K, V, N>   duplicate-free keyed collection with at most N entries
Optional<T>    absent or one T
```

Unknown required fields, duplicate map keys, invalid identities, unsupported
versions, and over-limit input fail before an authoritative object is exposed.

## Captured project request

```text
CapturedProjectRequestV1 {
  contractVersion: "1.0"
  declaredProjectKey: Optional<Text<256>>       # non-semantic
  coreLanguageProfile: Profile                 # exact Neutral 1.0 profile
  sourceUnits: List<SourceUnitV1, maxSourceUnits>
  vocabularyLocks: List<VocabularySemanticLockV1, maxVocabularies>
}

SourceUnitV1 {
  logicalModuleIdentity: Id<LogicalModule>
  logicalSourceIdentity: Id<LogicalSource>
  sourceContentDigest: Digest
  sourceBytes: Bytes<maxSourceUnitBytes>
}

VocabularySemanticLockV1 {
  canonicalVocabularyIdentity: Id<Vocabulary>
  semanticRevision: Text<128>
  schemaVersion: Text<64>
  contentDigest: Digest
  semanticContractBytes: Bytes<maxVocabularyBytes>
  enabledFeatures: List<Id<Feature>, maxVocabularyFeatures>
}
```

The project key is an optional host correlation label and is excluded from every
Neutral identity. A source content digest must match the exact bytes before
parsing. Each source identity and module identity is unique. The parsed `neu`
and `module` headers must match the request.

The vocabulary lock set exactly covers the distinct canonical vocabulary
identities required by all parsed `use` declarations. Each identity occurs once
in the lock list. Every source occurrence maps to that lock. Missing, extra,
duplicate, unused, or conflicting locks fail capture.

## Capture algorithm

`captureProject` performs these observable stages in order:

1. Validate request framing, contract/profile identity, collection bounds, and
   duplicate request identities.
2. Verify every exact-byte source and vocabulary digest.
3. Decode source text under inherited v0 byte rules and parse only enough to
   validate headers, `use`, and `import` declarations.
4. Bind request module identities to source headers.
5. Validate exact vocabulary-lock coverage and vocabulary semantic contracts.
6. Validate that every import resolves once inside the declared source set.
7. Compute the canonical import graph, SCCs, SCC condensation graph, and bounds.
8. Freeze immutable source units, semantic vocabulary contracts, and capture
   facts as `CapturedProjectV1`.

Capture does no filesystem, registry, network, environment, credential, or
package-manager access. Declaration/body errors not required to establish the
closure may be reported by compilation; capture never reports success for an
invalid header or incomplete closure.

## Processing and compilation requests

```text
ProcessingControlsV1 {
  acceptanceLimits: ProjectLimitsV1
  diagnosticPolicy: DiagnosticPolicyV1
  cancellationToken: Optional<OpaqueOperationalToken>
  requestRevision: Optional<Text<128>>
}

CompilerDerivationRequestV1 {
  compilerBehaviorProfile: Profile
  irProfile: Profile
  requestedArtifactKinds: List<ArtifactKind, 16>
  nonSemanticCompilerOptions: Map<Text, ClosedOptionValue, 64>
}

ArtifactKind =
  "project-ir" |
  "source-map" |
  "provenance" |
  "diagnostics" |
  "resource-facts"
```

Unknown options fail closed. No option may change language meaning; a proposed
meaning-changing option requires a new core behavior profile. Cancellation and
request revision are operational and excluded from all identities.

## View request

```text
ViewRequestV1 {
  contractVersion: "1.0"
  viewSchemaVersion: Text<64>
  selectedPublicSymbols: List<Id<ModuleSymbol>, maxViewRoots>
  evidencePolicy: "none" | "public-source-map" | "public-provenance"
  viewOptions: Map<Text, ClosedOptionValue, 32>
}
```

Every selected symbol must be public in the validated complete project. A view
contains the complete public type/value/reference closure needed to interpret
its selections. It excludes unselected public declarations unless required by
that closure and always excludes private symbol identities and private source
evidence. A view is a derived artifact, not a smaller logical project.

## Canonical logical form

v1 reuses the accepted v0 `ByteDigestV1`, SHA-256, and Neutral Hash Transcript
v1 (`NHT-v1`) primitive framing. The v1 project domain is:

```text
neutral/logical-project-identity/v1
```

The hash input is:

```text
CanonicalLogicalFormV1 {
  identityProfile: "neutral-canonical-logical-form/1.0"
  languageBehaviorProfile: exact core semantic profile identity
  modules: map<LogicalModuleIdentity, CanonicalModuleV1>
  vocabularyContracts:
    map<CanonicalVocabularyIdentity, CanonicalVocabularySemanticIdentity>
}

CanonicalModuleV1 {
  declarations: map<ModuleSymbolIdentity, CanonicalDeclarationV1>
  publicExports: set<ModuleSymbolIdentity>
  imports: set<LogicalModuleIdentity>
}
```

NHT rules are:

- maps and sets sort by already-framed key bytes;
- module symbols use `(logical module identity, declaration name)`;
- resolved types use core, module-symbol, or exact vocabulary semantic type
  identity;
- ordinary reuse contributes the final logical value, not its path;
- references contribute expected type plus stable target module-symbol identity;
- record fields use inherited v0 semantic ordering rules;
- lists preserve order;
- exact numbers use inherited normalized numeric transcripts;
- strings, `url`, and `path` use decoded UTF-8 scalar text under distinct tags;
- graph-local IDs never enter the form; and
- construction enforces limits before allocation and never searches graph
  permutations.

The following are excluded: project key, logical source identities, source
bytes, aliases, declaration order where inherited semantics make it irrelevant,
comments, spans, provenance, diagnostics, roots, presentation, host state, and
artifact encoding.

`CanonicalVocabularySemanticIdentity` is the NHT transcript of canonical
vocabulary identity, semantic revision, schema version, enabled semantic
features, normalized exported/non-exported type schema, normalized defaults,
and required structural features. It excludes raw contract encoding, authoring
metadata, local aliases, and acquisition facts. A formatting-only vocabulary-
bundle change may therefore change captured closure identity while preserving
logical project identity.

```text
LogicalProjectIdentityV1 = SHA-256(
  NHT-v1 frame(
    "neutral/logical-project-identity/v1",
    CanonicalLogicalFormV1
  )
)
```

Independent implementations must agree on NHT transcripts and digests. Exact
hexadecimal vectors are a mandatory portable-seed fixture family.

## Other identities

Every `hash(...)` expression below means SHA-256 over an NHT-v1 frame whose
first field is the shown domain string. Maps and sets use the canonical ordering
rules above; request list or map insertion order never participates unless the
field is explicitly an ordered semantic list.

```text
CapturedClosureIdentityV1 = hash(
  "neutral/captured-closure-identity/v1",
  capture contract version,
  exact core profile,
  source map keyed by module identity containing source identity + exact bytes,
  vocabulary-lock map keyed by canonical vocabulary identity containing the
    exact validated lock fields + semantic contract bytes
)

IrDerivationIdentityV1 = hash(
  "neutral/ir-derivation-identity/v1",
  logical project identity,
  exact IR profile,
  IR-producing options
)

EvidenceDerivationIdentityV1 = hash(
  "neutral/evidence-derivation-identity/v1",
  captured closure identity,
  logical project identity,
  evidence profile
)

DiagnosticDerivationIdentityV1 = hash(
  "neutral/diagnostic-derivation-identity/v1",
  captured closure identity,
  compiler behavior profile,
  applicable acceptance limits,
  diagnostic policy
)

ViewDerivationIdentityV1 = hash(
  "neutral/view-derivation-identity/v1",
  logical project identity,
  exact ViewRequestV1
)

ArtifactIdentityV1 = hash(
  "neutral/artifact-identity/v1",
  artifact derivation identity,
  artifact kind,
  format/schema version,
  artifact transformation inputs
)
```

The compilation-result envelope has its own identity binding the captured
closure, complete requested artifact set, compiler request, applicable
processing policy, outcome, and produced artifact identities. It is not reused
as an individual artifact identity.

## Project IR delta

v1 extends the accepted v0 logical IR model with these validated structures:

```text
ProjectLogicalBodyV1 {
  languageBehaviorProfile
  modules: Map<LogicalModuleIdentity, ModuleBodyV1>
  vocabularySemanticIdentities
  requiredStructuralFeatures
}

ModuleBodyV1 {
  declarations
  publicExportIndex
  resolvedImportEdges
}

ResolvedEdgeV1 {
  kind: "type" | "value-reuse" | "identity-reference"
  source: ModuleSymbolIdentity
  target: CoreTypeIdentity | VocabularyTypeIdentity | ModuleSymbolIdentity
}
```

Logical source identities are absent from `ProjectLogicalBodyV1`. Companion
source-map and provenance artifacts carry them. The project IR envelope carries
the logical project identity and IR profile but those envelope fields are
excluded when reconstructing `CanonicalLogicalFormV1`.

An untrusted external project IR decoder validates:

- closed schema and exact profiles;
- all structural limits before proportional allocation;
- canonical module and symbol uniqueness;
- public export accessibility;
- exact vocabulary semantic identities;
- every edge kind, source, target, and type compatibility;
- absence of private targets in public reference closure;
- recomputed logical project identity; and
- companion-evidence identities before evidence is associated with the project.

## Provenance delta

v1 provenance adds:

```text
local-explicit
local-reuse
imported-reuse(moduleSymbolIdentity)
local-reference(moduleSymbolIdentity)
imported-reference(moduleSymbolIdentity)
record-default
vocabulary-default(canonicalVocabularyIdentity, semanticRevision)
```

Public views redact private module-symbol identities, private spans, and reuse
paths. Redaction never changes a public logical value. A public identity
reference to a private target is invalid before view construction.

## Diagnostics

Every diagnostic contains:

```text
DiagnosticV1 {
  code
  layer: "capture" | "syntax" | "name" | "type" | "value" |
         "reference" | "vocabulary" | "ir" | "authoring" | "resource"
  severity
  safeParameters
  safeMessage
  primary: Optional<{ logicalSourceIdentity, startByte, endByte }>
  related: List<RelatedLocation, maxRelatedLocations>
  remedy: Optional<Text<maxRemedyBytes>>
  truncated: bool
}
```

Canonical ordering is logical source identity, primary start, primary end,
diagnostic code, then canonical safe-parameter order. Project-level diagnostics
without a primary source sort before source-linked diagnostics by code.

Required new codes are:

```text
v1-request-invalid
v1-profile-mismatch
v1-source-identity-duplicate
v1-module-identity-duplicate
v1-module-identity-mismatch
v1-import-syntax
v1-import-missing
v1-import-self
v1-alias-duplicate
v1-symbol-inaccessible
v1-public-type-inaccessible
v1-public-ref-inaccessible
v1-vocabulary-lock-missing
v1-vocabulary-lock-extra
v1-vocabulary-lock-duplicate
v1-vocabulary-lock-conflict
v1-vocabulary-type-inaccessible
v1-vocabulary-encoding-unsupported
v1-vocabulary-visibility-invalid
v1-vocabulary-public-closure-invalid
v1-vocabulary-cross-dependency
v1-vocabulary-authoring-encoding-unsupported
v1-vocabulary-authoring-semantic-mismatch
v1-vocabulary-authoring-entry-unknown
v1-vocabulary-authoring-entry-duplicate
v1-vocabulary-authoring-hint-invalid
v1-scc-limit
v1-project-limit
v1-view-root-invalid
v1-view-private-evidence
v1-canonical-form-profile-unsupported
v1-project-identity-mismatch
```

Messages are presentation, not identity. Credentials, host paths, acquisition
metadata, and unapproved source excerpts cannot appear.

## Resource contract

Every API accepts explicit effective limits. An implementation advertises hard
ceilings and must support at least this baseline profile:

| Limit | Baseline minimum supported ceiling |
| --- | ---: |
| Source units | 256 |
| Bytes per source unit | 4 MiB |
| Total source bytes | 32 MiB |
| Imports per module | 256 |
| Total import edges | 16,384 |
| Modules per SCC | 256 |
| SCC condensation depth | 256 |
| Vocabulary identities | 64 |
| Vocabulary bytes each | 4 MiB |
| Total declarations | 100,000 |
| Total resolved edges | 1,000,000 |
| View roots | 10,000 |
| Diagnostics returned | 10,000 |
| Related locations per diagnostic | 64 |
| Encoded artifact bytes | 64 MiB |

Inherited v0 limits on nesting, strings, numeric coefficients/scales, lists,
vocabulary schema contents, and reader traversal remain applicable. A host may
request lower limits. The effective limit is the minimum of implementation hard
ceiling, advertised profile, and caller policy.

Limit checks occur before proportional allocation. Resource exhaustion returns
a bounded non-success outcome and no authoritative partial project, IR,
authoring project, or view.

## Determinism and concurrency

For identical exact inputs and profiles:

- request source order, import order, map insertion order, filesystem order, and
  scheduling cannot change logical IR or canonical diagnostics;
- full and incremental compilation produce equal logical results and diagnostic
  projections;
- cancellation may change only the operational outcome and returned work, never
  an identity for an authoritative completed result; and
- concurrent calls share no mutable semantic state visible through public APIs.
