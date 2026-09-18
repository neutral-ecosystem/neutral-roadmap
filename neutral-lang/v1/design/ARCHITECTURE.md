# Neutral language v1 architecture proposal

Status: proposed design architecture

## Purpose

Neutral v1 should make Neutral usable for a real project containing reusable
definitions, while preserving the v0 separation between acquisition,
compilation, public IR, and external effects. The release should establish the
shared language substrate needed by Neutral Flow and Neutral Editor without
embedding either product's semantics.

v1 is built on the released and working v0.1 contract by reference. Its design
documents contain only deltas and explicitly map every superseded v0 requirement
to its v1 replacement. The v0 profile remains independently selectable and
frozen.

## Proposed scope

v1 extends the v0 typed, immutable, effect-free language with:

- a captured project containing multiple source units;
- one logical module per source unit and a deterministic module graph;
- explicit logical-module imports with mandatory local aliases;
- private-by-default declarations and explicit public declarations;
- qualified access to imported public records and bindings;
- cross-module value reuse and typed identity references;
- opaque `url` and `path` data values for vocabulary-defined use;
- zero or more exact captured, data-only vocabularies under unique aliases;
- project-level Neutral IR, source maps, provenance, and derivation;
- capability discovery for project shape and language services; and
- a public, versioned authoring projection for editor import and deterministic
  source projection.

The retained v0 value model remains the starting point. Adding modules does not
implicitly approve expressions, functions, mutation, inheritance, templates,
macros, or executable extensions.

## Opaque location data

v1 adds `url` and `path` as distinct typed scalar values. They are inert data:
Neutral preserves their exact typed text and may carry it through project IR,
but does not fetch a URL, open a path, normalize a path, select an operating
system interpretation, infer authority, or validate external reachability.

Their literals use the existing string-literal spelling in typed context:

```neu
url source_url = "https://example.invalid/source"
path config_file = "config/pipeline.neu"
```

`url`, `path`, and `string` are distinct types with no implicit conversions.
The compiler validates only Neutral's bounded source-literal representation;
later vocabularies may define their own data-level interpretation. They remain
values, not import targets: source imports continue to name logical modules and
cannot use paths or URLs.

## System boundary

```text
host-specific resolution
    -> host-neutral CapturedProjectRequest
    -> bounded validation and freezing of the supplied closure
    -> immutable CapturedProject
    -> effect-free module and semantic compilation
    -> complete project Neutral IR plus companion evidence
    -> optional consumer-selected views
    -> validated reader, Flow, Editor, and other consumers
```

The host owns filesystem, registry, workspace, network, credential, and package
policy. Source imports identify logical modules only. They never contain host
paths or URLs and never authorize acquisition.

The host completes all resolution before calling Neutral. Capture accepts no
resolver or acquisition callback: it validates that the exact supplied source
and vocabulary set is complete and internally consistent, then freezes it.
Capture and `compileCapturedProject` perform no external I/O.

The public input is intentionally small:

```text
CapturedProjectRequest
  captureContractVersion
  declaredProjectKey?             # non-semantic
  coreLanguageProfile
  sourceUnits[]
    logicalModuleIdentity
    logicalSourceIdentity
    sourceBytes
  vocabularySemanticLocks[]
```

It contains no roots, paths or URLs used to acquire inputs, compiler options,
output policy, authoring metadata, credentials, or package-manager state.
Caller-selected bounds, cancellation, correlation, and diagnostic-output policy
are separate processing controls.

## Project and module model

A captured project has:

- one captured closure identity and captured project revision;
- one exact core language profile;
- a finite map from logical module identity to one immutable source unit;
- exact captured vocabulary semantic contracts and lock facts; and
- a complete import graph for the captured closure.

Selected roots are consumer-view selectors only. They do not belong to capture,
compiler derivation, the logical project payload, or logical equality. A
consumer may submit a versioned `ViewRequest` after validating the complete
project. A materialized view is a derived artifact and cannot conceal
dependencies needed to interpret the selected exports.

The initial v1 rule is one source unit per logical module. Two units claiming
the same logical module are an error. Partial modules and directory-based merge
rules are deferred because they make identity, diagnostics, and incremental
editing substantially less predictable.

A module name is logical and is not derived from a file path. The proposed
qualified form is a non-empty `::`-separated sequence of `snake_case` segments:

```neu
neu "1.0"
module example::delivery::shared
```

The host maps that name to captured bytes. Moving a file without changing its
logical source or module identity does not change language meaning.

Capture compares each request logical module identity with the source's
`module` header and compares every source `neu` header with the exact request
profile. It also requires unique logical source identities. A mismatch fails
before imports or declarations are resolved.

## Imports and name resolution

Imports appear after the headers and vocabulary requirements and before
ordinary declarations:

```neu
import example::delivery::shared as shared
```

An import alias is mandatory and uses `snake_case`. Imported names are always
qualified:

```neu
public shared::Image image = shared::default_image
```

Imports do not inject names into local scope. An alias must be unique among
module-import aliases and vocabulary aliases in that module. Wildcard imports,
relative paths, implicit prelude imports, alias inference, and source-selected
versions are excluded.

Every import must resolve inside the captured closure. Duplicate module
identities, missing imports, and self-imports are errors. Import cycles are
allowed: capture and semantic collection process each strongly connected
component as a group. Declaration order remains non-semantic within a module.
The inherited value-dependency and embedded-record-cycle rules, rather than the
mere presence of a module cycle, determine whether a semantic cycle is invalid.
Import-depth limits are measured over the acyclic SCC condensation graph;
module count, import-edge count, imports per module, SCC size, and condensation
depth have separate bounds.

## Visibility and exported surface

Declarations are private to their defining module unless prefixed with
`public`:

```neu
record InternalDefaults {
    string image,
}

public record JobConfig {
    string image,
}

public JobConfig default_job = {
    image: "example.invalid/tool:1",
}
```

Only root record and binding declarations have visibility. Record fields do not
have independent visibility. Imported modules may access only public names.
The project IR retains private declarations needed to validate the complete
project, while its export index exposes only public symbols.

No `private` keyword is proposed because private is the default. v1 also
excludes re-exports, package-only visibility, friend modules, protected
visibility, and runtime access control. Language visibility is structural API
surface, not authorization.

A public declaration signature may reference only public, transitively reachable
types. A public reader view contains the public dependency closure needed to
interpret an exposed declaration and does not disclose private implementation
provenance. A declaration that cannot meet those rules is invalid as public.

A public binding may reuse private declarations. Its public value is still
public, but a public view omits private symbol identities, spans, and
implementation provenance. `private` is therefore an encapsulation boundary,
not a secrecy or authorization mechanism. Vocabulary semantic contracts mark
which schema types are externally accessible; those types count as public types
for signature validation.

Identity references need a stricter rule than ordinary value reuse. Every
`Ref<T>` transitively exposed by a public binding, including one nested inside a
record or list, must target a public binding. A private value may be resolved
and its provenance redacted, but a private reference target cannot be removed
without changing the value itself.

## Cross-module values and references

Qualified imported bindings may be reused as immutable values. Their resolved
logical value and provenance cross the module boundary.

`ref(alias::name)` may target a compatible public binding in an imported
module. The IR edge records durable module-symbol identity; graph-local element
IDs remain local labels and do not become persistent cross-project identifiers.

Value dependencies include local and imported reuse. Semantic analysis computes
the value graph across and within module SCCs, then applies the inherited
declaration-level cycle rules. `Ref<T>` remains an identity edge and does not
imply execution, containment, ownership, readiness, or value dependency.

## Vocabulary model

v1 provides generic infrastructure for repeated, explicitly aliased data-only
vocabulary requirements:

```neu
use ExampleDomain as domain
```

The host lock maps each logical requirement to one exact captured bundle.
Aliases share the same namespace category as import aliases, so
`domain::Widget` and `shared::JobConfig` remain syntactically uniform and
unambiguous after resolution.

One canonical vocabulary identity resolves to one semantic-contract revision
throughout a project. Different modules and aliases may reuse that revision;
conflicting revisions for the same identity fail capture. A semantic contract
also declares its externally accessible schema types. Non-exported vocabulary
types cannot be named by source or leak through a public signature.

The supplied lock set is an exact cover of the distinct canonical vocabulary
identities required by all source modules. Every `use` occurrence maps to its
covered identity and shared revision. Missing, extra, duplicate, conflicting,
and unused locks are capture errors.

Vocabularies remain closed, data-only Neutral contracts. Multiple vocabularies
do not permit callbacks, validators, scripts, native modules, executable
plugins, hidden imports, or ambient acquisition. v1 defines no Flow, provider,
or integration vocabulary. If Flow later supplies `use Flow as flow`, Neutral
resolves its exact captured contract generically; vocabulary mapping and Flow
meaning remain outside Neutral. Cross-vocabulary type dependencies are excluded
until a domain-neutral proposal defines their identity, capture, cycle, and
validation rules.

## Project-level IR

The v1 logical payload should contain:

- language and IR behavior versions;
- logical project identity in the envelope;
- the complete logical module graph;
- per-module declarations and public export indexes;
- resolved local and cross-module type/value/reference edges;
- exact vocabulary identities and required structural features;
- tagged `url` and `path` values; and
- stable public and private module-symbol identities.

Logical source identities are companion-evidence data, not logical payload
content. Source maps identify the source unit as well as the half-open byte span.
Provenance records import traversal, qualified reuse, references, and defaults
without turning source spelling into meaning. Derivation separately commits to
the complete captured source/vocabulary closure, acceptance budgets, and
diagnostic policy.

Logical equality compares the normative `CanonicalLogicalForm`. Graph-local IDs
and logical source identities never enter that form, so equality requires no
general graph-isomorphism search. Module identity, module-symbol identity,
declaration fingerprint, captured project revision, derivation identity, and
encoded byte identity remain distinct.

Consumers may request the whole validated project or a root/export view. A view
never changes logical project identity or silently omits a dependency required
to interpret an exported declaration. Its selected roots and view schema belong
to a separate view derivation and artifact identity.

## Canonical logical form

v1 identity requires an identity-only normative canonical form even though it
does not require project IR itself to have one canonical public serialization:

```text
CanonicalLogicalForm v1
  identityProfile
  languageBehaviorProfile
  modules ordered by canonical logical module identity
    declarations addressed by stable module-symbol identity
    semantic types and values
    resolved edges using canonical type/module-symbol identity
  exact vocabulary semantic contracts
```

Declaration order is omitted where inherited semantics make it non-semantic.
Record-field and list order remain where significant. Logically unordered maps
use a specified canonical key ordering. Text, exact numbers, `url`, and `path`
have one platform-independent byte representation.

Source identities, aliases, graph-local IDs, spans, comments, provenance,
diagnostics, presentation data, and host data are excluded. Construction uses
stable keys and direct bounded ordering; it cannot depend on general graph
isomorphism or permutation search. The core identity profile fixes the exact
canonical-form version, encoding, digest algorithm, and domain tags.

## Identity chain

The following identities are separate:

```text
raw host inputs
    -> canonical captured source closure
    -> captured closure identity
    -> canonical logical project
    -> logical project identity
    -> derivation context
    -> derivation identity
    -> artifact kind and format
    -> artifact identity
```

All identities use domain-separated canonical inputs and exclude their own
identity fields. Logical project identity commits to the canonical logical
payload body, including module graph, semantic content, and exact vocabulary
semantic contracts. It excludes source maps, provenance, diagnostics, host
paths, logical source identities, source aliases, capture order, roots, and
derivation settings. Captured closure identity commits to the capture-contract
version, exact core profile, canonical source identities and bytes, and exact
vocabulary semantic locks.
Two captures may differ while producing the same logical project identity.

Compilation-result derivation identity binds captured closure and logical
project identities to compiler/IR profiles, requested artifacts, acceptance
limits, and non-semantic compiler or diagnostic policy. It identifies the
result envelope, not every contained artifact, and contains no roots. A separate
view derivation identity binds the complete logical project identity to a
`ViewRequest`, view schema, and view policy.

Artifact derivations are dependency-minimal rather than every artifact
inheriting one monolithic compiler derivation. Project IR derivation binds
logical project identity, IR profile, and IR-producing options. Source-map/
provenance derivations additionally bind the captured closure and evidence
profile. Diagnostic derivation binds captured closure, compiler behavior,
applicable limits, and diagnostic policy. Each artifact identity then binds its
own derivation identity, kind, format, and transformation inputs. A compilation-
result envelope may bind all requested outputs and its operational outcome.
Changing diagnostic verbosity therefore cannot invalidate an unchanged project
IR artifact.

Cancellation handles, request revisions, scheduling, and timing are operational
correlation state and never enter an identity. Acceptance limits and diagnostic
output policy are recorded in compiler derivation because they govern the
accepted operation, while remaining outside logical project meaning.

Every option is assigned to exactly one layer: meaning-changing inputs enter
the logical payload; acceptance and diagnostic controls enter compiler
derivation; serialization and root/export selection enter artifact or view
derivation. There is no unclassified semantic-options bag.

Host mappings cannot alter logical module identity. Conflicting mappings for one
logical module are rejected. Vocabulary aliases are module-local source bindings;
IR records canonical vocabulary identity and version, never aliases.

## Core language services

The compiler boundary should extend v0 operations rather than replace them:

```text
captureProject(request, processingControls) -> CapturedProject
compileCapturedProject(captured, compilerDerivationRequest, processingControls)
    -> ProjectCompilationResult
compileProject(request, compilerDerivationRequest, processingControls)
    -> ProjectCompilationResult
decodeAndValidateProject(bytes, capturedContracts) -> ValidatedProject
deriveView(validatedProject, viewRequest, processingControls) -> ViewArtifact
```

```text
CompilerDerivationRequest
  compilerBehaviorProfile
  irProfile
  requestedArtifactKinds[]
  nonSemanticCompilerOptions

ProcessingControls
  acceptanceLimits
  diagnosticOutputPolicy
  cancellation?                 # operational only
  requestRevision?              # operational only

ViewRequest
  viewSchemaVersion
  selectedModuleSymbols[]
  evidencePolicy
  viewSpecificOptions
```

The selected module symbols are stable public module-symbol identities, not
source aliases, file names, graph-local element IDs, or canvas nodes.

Core discovery reports exact language and IR profiles, project/module limits,
vocabulary cardinality, core operations, core diagnostic behavior, and
structural budgets. Consumers use capability IDs rather than infer behavior from
the string `1.0`.

## Neutral authoring v1 bridge

The authoring bridge is a companion protocol with its own profile identity and
compatibility window. It depends on a compatible Neutral v1 core profile but is
not part of core language semantics. Headless consumers such as Flow require
only the core unless they explicitly request authoring functions.

For generic tooling, the bridge profile supplies bounded data-only descriptors for
constructs, identifier categories, protected names, type constructors, value
forms, compatibility, captured inputs, formatting, diagnostics, and explicit
exclusions. A side-effect-free compatibility query may supplement descriptors.
Neither mechanism contains executable UI or validation code.

The Editor does not learn the authoring surface from the string `1.0`. It asks
the selected authoring profile to describe the exact core and captured
vocabulary tuple. The result is a deterministic descriptor catalogue:

```text
DescriptorCatalogue
  identity
    core profile
    authoring profile
    descriptor schema
    vocabulary semantic-contract identities and revisions
    vocabulary authoring-metadata profile identities and revisions
  constructs[]
  types[]
  valueForms[]
  actions[]
  explicitExclusions[]
```

An authorable construct descriptor has a stable qualified identity and declares
its semantic projection kind, source slot, ports, properties, nested contexts,
constraints, availability, and required capabilities. Ports distinguish value
reuse from identity reference and carry exact type expressions, direction, and
cardinality. Properties carry required/defaulted/nullability and nesting facts.
These records are sufficient for a generic palette, card, inspector, and
connection preflight; adapter-owned source projection remains responsible for
Neutral spelling.

Captured vocabulary semantic schemas contribute nominal data shapes through the
same catalogue. Optional titles, categories, documentation, ordering, and icon
tokens live in a separately identified authoring-metadata profile and are
presentation hints only. Changing those hints changes the catalogue identity,
not logical project identity or compiled IR. A vocabulary cannot ship a
callback, component, validator, script, native module, or effect. Catalogue
identities are qualified by their canonical owner, so local source aliases
cannot collide or alter their meaning.

Neutral Editor uses the bridge's public operations equivalent to:

```text
describeAuthoring(
    coreAuthoringProfile,
    vocabularySemanticContracts,
    vocabularyAuthoringMetadataProfiles
)
    -> DescriptorCatalogue
importProject(capturedProject) -> AuthoringProject | diagnostics
projectSources(authoringProject) -> source units + element/source map
validateProject(capturedProject, requestRevision) -> validation result
```

`AuthoringProject` is a versioned editor-facing projection, not a public parser
tree. It represents modules, imports, visibility, declarations, source value
forms, comments promised for round-tripping, and opaque supported extensions.
The compiler adapter owns Neutral spelling and validation; the editor owns
interaction and presentation.

A no-op import and projection must recompile to logically equal project IR. The
projection retains every authoring distinction required by the inherited v0
contract plus v1 module constructs. Its source map reaches the narrowest stable
authoring owner, including imports, fields, properties, values, reuse edges, and
reference edges.

Incremental compilation may be exposed by core or bridge implementations as an
optimization with explicit cache
keys and invalidation facts. Full and incremental compilation of the same
captured project must produce logically equal results and diagnostics.

The complete visual-authoring loop is:

```text
installed core + authoring profiles + exact vocabulary locks
    -> descriptor catalogue
    -> generic Editor cards, ports, properties, and commands
    -> AuthoringProject
    -> adapter-owned `.neu` source projection
    -> host-completed CapturedProjectRequest
    -> ordinary Neutral capture and compilation
    -> IR + diagnostics + source map + provenance
    -> optional ViewRequest
    -> Editor diagnostic projection / external IR consumer
```

The compiler consumes source, never the canvas graph. The Editor consumes
descriptors and authoring projections, never a compiler-private AST. This keeps
GUI-created files and hand-authored files on the same language path.

## Consumer boundary

Neutral Flow may consume public records and values from the project IR and map
its own vocabulary to workflow meaning. It must not parse modules, implement
visibility, or resolve imports.

A Flow visual experience is an Editor authoring package: ordinary Flow-owned
vocabulary schemas and conventions produce generic cards through the authoring
bridge. This does not make Flow operations Neutral functions. Flow Core remains
a headless IR consumer, and its system/provider mappers remain Flow-owned.

Neutral Editor may display and edit the module graph through the authoring
projection. It must not persist a private compiler AST as project meaning or
generate IR directly.

Neither consumer may treat compilation success or `public` visibility as
authority to execute, reveal a secret, access a provider, or perform an effect.

## Explicit non-goals

- package registry, dependency solver, or lockfile file format;
- filesystem-relative or URL imports;
- partial modules, wildcard imports, re-exports, or visibility tiers;
- functions, operators, control flow, mutation, or evaluation;
- secrets, environment lookup, commands, tasks, workflows, or triggers;
- executable vocabularies, plugins, callbacks, or custom validators;
- Flow planning/runtime behavior or Editor presentation state;
- automatic v0 migration or a public general-purpose IR rewrite API; and
- one canonical public project-IR serialization. v1 does define the separate,
  identity-only `CanonicalLogicalForm` required for cross-host logical identity.
