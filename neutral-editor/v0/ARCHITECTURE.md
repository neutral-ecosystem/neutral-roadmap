# Neutral Editor v0 architecture

Status: proposed architecture

## 1. Architectural outcome

Neutral Editor is an adapter-based visual authoring application. It does not
parse Neutral with an editor-owned parser, emit Neutral IR, or execute graphs.

```text
                       Neutral Editor

  interaction state       editor document       language adapter
  -----------------       ---------------       ----------------
  selection               semantic graph   ---> project source
  viewport                nested values          |
  context path            presentation           v
       |                       |              generated .neu
       v                       v                  |
  React Flow view <--- view projection           v
                                      capture / compile / validate
                                                  |
                                                  v
                                     IR + diagnostics + source map
```

There are three distinct records:

1. The **editor project** is canonical only for resuming visual editing.
2. Generated **`.neu` source** is the program submitted to `neutral-lang`.
3. Validated **Neutral IR** is authoritative compiler output and is never
   generated or modified by the editor.

## 2. Logical components

### Editor document

The in-memory document is framework-independent and contains:

```text
ProjectDocument
  formatVersion
  languageProfileRequirement
  authoringProfileRequirement
  capturedVocabularyRequirements[]
  sourceUnits[]
    logicalSourceIdentity
    logicalModuleIdentity
    module
      vocabularyRequirements[]
      imports[]
      declarations[]
  authoringGraph
    contexts[]
    nodes[]
    connections[]
  presentation
    activeContextPath
    positions
    viewport
  extensions
```

Semantic graph records use stable editor-local IDs. They refer to discovered
construct, type, value, and port capability IDs, not React component names or
array positions. Presentation records may change without scheduling language
validation.

The document context stack exposes the project, modules, and recursively nested
record/list values reported by the selected profile. The reference Neutral v1
profile supports multiple source units with one logical module per unit.

### Descriptor catalogue

A descriptor is immutable input discovered for an exact core, authoring,
descriptor-schema, and captured-vocabulary profile tuple. It describes a
construct's stable qualified identity, owner, title, documentation, semantic
projection, source slot, ports, editable properties, nesting behavior,
availability, capability requirements, and constraints. The generic editor
does not own a Neutral descriptor table or infer one from a version string.

Descriptors are data. They cannot contain JavaScript, Rust libraries, callbacks,
custom validators, or custom React components.

Core and captured-vocabulary descriptors merge deterministically by qualified
identity. Vocabulary schemas may contribute nominal data shapes and bounded
non-semantic presentation hints, but never executable operation nodes. A card
is a projection of Neutral data, not a Neutral function or runtime operation.

### Command service

All user-visible semantic mutations are commands: add/remove node, connect,
disconnect, change property, and paste. A completed drag is one presentation
command. Commands produce undo records and declare whether source projection
and validation are required.

### Language discovery and source projection

The host discovers installed Neutral language adapters. Each adapter reports
versioned capabilities before the editor creates controls or interprets a
project. The selected adapter converts a valid editor semantic model to
deterministic `.neu` source and records an element-to-generated-span table.
It may reject a graph that cannot be represented by the selected profile.

The adapter also provides the public authoring projection needed to open an
existing valid `.neu` file without making compiler-private AST or recovery
records part of the editor contract. Import/projection/formatting behavior is
matched to the selected language capability profile.

### Language adapter

One versioned interface isolates the UI from compiler internals:

```text
LanguageRegistry
  discover() -> LanguageInstallation[]

LanguageAdapter
  capabilities() -> LanguageCapabilityProfile
  describeAuthoring(profile, capturedVocabularies) -> DescriptorCatalogue
  importProject(capturedProject, limits) -> AuthoringProject
  projectSources(document, profile, limits) -> SourceProjection[]
  checkCompatibility(profile, sourceType, targetType, edgeKind) -> result
```

The capability response includes exact core, IR, authoring, and descriptor
profiles, project shape, captured-input needs, operations, diagnostics, and
resource limits. The host forms a `CapturedProjectRequest` from projected source
units and explicit locks/roots, then uses ordinary Neutral capture and compile
operations. The adapter does not return compiler-private tokens, recovery trees,
or mutable IR.

### View projection

React Flow nodes and edges are derived view records. Its node position helpers,
selection flags, viewport, and edge types do not leak into the semantic graph.
React Flow serialization is not the project format.

### Desktop host

The React/TypeScript application owns high-frequency canvas interaction. A
Tauri/Rust host may own file dialogs, atomic project writes, and launching or
hosting the language adapter. Pointer movement never crosses IPC.

## 3. State and update rules

| Change | Update presentation | Update semantic graph | Project source | Validate |
| --- | --- | --- | --- | --- |
| Pan or zoom | yes | no | no | no |
| Node drag | yes | no | no | no |
| Select node | transient only | no | no | no |
| Add/remove node | maybe | yes | yes | yes |
| Connect/disconnect | no | yes | yes | yes |
| Edit semantic property | no | yes | yes | yes |
| Enter/leave nested value | active context only | no | no | no |
| Edit nested value | maybe | yes | yes | yes |

Semantic validation is debounced and revisioned. A result is applied only if it
matches the document revision that produced its request. Cancellation is a
normal result, not an error toast.

## 4. Validation ownership

The editor may perform fast preflight checks for direction, cardinality, and
type compatibility only from discovered capability data or an adapter query.
These improve interaction but do not establish language validity.

`neutral-lang` remains authoritative for syntax, names, types, references,
captured vocabulary contracts, limits, and diagnostics. When frontend and
compiler results differ, the compiler result governs and the mismatch becomes
an adapter test failure.

Diagnostics are mapped in this order:

1. exact generated span to property/port span;
2. exact generated span to owning node span;
3. document-level Problems entry;
4. adapter/internal error when no compiler result exists.

## 5. Persistence

v0 uses one UTF-8 JSON project document. The schema is versioned independently
from Neutral language and descriptor versions. Save uses an atomic replace when
the host platform supports it.

The project records the exact language capability profile and captured
vocabulary requirements. On open, the host discovers an exact compatible
adapter before interpreting semantic records. Missing or incompatible
requirements produce a compatibility state; nodes are retained and shown as
unresolved rather than dropped.

Unknown fields are preserved when the document is loaded and saved without a
migration that owns them. A newer unsupported major format fails closed and the
original file remains untouched.

## 6. Trust and effects

- Project, descriptor, and language-service data are untrusted and bounded.
- Capability discovery grants no authority and cannot silently select a
  different language profile for an existing project.
- Descriptor content is rendered as text or sanitized documentation, never as
  executable markup.
- Only explicit desktop commands cross the Tauri boundary.
- File access is limited to paths selected by the user and application-owned
  settings paths.
- Tauri capabilities expose only required commands and scopes.
- Validation cannot execute source, vocabulary code, or runtime effects.

## 7. Technology profile

The implementation baseline is Tauri 2 and Rust with a React/TypeScript
frontend using React Flow, Zustand, Radix UI, and Tailwind CSS. Component,
state-slice, host-service, IPC, dependency, and proposed folder ownership are
defined in [TECHNOLOGY-STACK.md](TECHNOLOGY-STACK.md).

Versions are selected and locked during workspace initialization. Technology
choices are editor implementation decisions, not Neutral semantics.
