# Neutral Editor v0 technology stack

Status: proposed implementation baseline

## Stack

```text
Tauri 2
|
+-- React + TypeScript
|   +-- React Flow / @xyflow/react
|   +-- Zustand
|   +-- Radix UI
|   +-- Tailwind CSS
|
+-- Rust
    +-- Neutral language registry and bridge
    +-- Captured vocabulary resolver
    +-- Project persistence
    +-- Native OS integration
    +-- Runtime bridge (deferred from v0)
```

This stack implements the architecture; it does not define Neutral language
semantics. Versions are locked when the application workspace is initialized
and may change independently from Neutral language/profile versions.

## Dependency direction

```text
React views
    -> editor commands and selectors
    -> framework-independent editor domain
    -> typed host client
    -> Tauri IPC
    -> Rust host services
    -> neutral-lang public adapter contracts
```

Dependencies do not point back upward. React Flow records, Radix components,
Tailwind classes, Tauri command payloads, and Rust persistence structs must not
become the Neutral authoring model.

## Frontend responsibilities

### React and TypeScript

React owns application composition, panels, commands, focus, keyboard behavior,
and rendering derived editor state. TypeScript owns the frontend editor-domain
types and validates every untrusted host response before it enters state.

React does not parse `.neu`, discover the filesystem, resolve vocabularies, or
implement permanent Neutral type-compatibility rules.

### React Flow

React Flow owns:

- node and connection rendering;
- pointer-based pan, zoom, selection, movement, and connection gestures;
- viewport helpers, fit view, and zoom to selection; and
- derived canvas accessibility behavior where supported.

It does not own:

- project persistence;
- Neutral declarations, values, types, references, or source projection;
- stable project identity;
- language validation or execution; or
- the undo transaction model.

One canvas adapter maps editor-domain nodes/connections to React Flow records
and maps UI events back to editor commands.

### Zustand

Zustand stores editor state behind narrow selectors. The initial slices are:

```text
document     semantic authoring document and revision
presentation positions, viewport, active nested-value context
selection    selected/focused editor element IDs
capability   discovered installations and selected exact profile
validation   request revision, status, diagnostics, source mappings
project      path, dirty state, compatibility, save/open status
runtime      absent in v0; reserved adapter state only
ui           panels, dialogs, menus, notifications
```

Semantic commands may update `document`; pointer movement updates only
`presentation`. Store slices do not call Tauri directly. Effects run through
application services so domain and store tests do not require a desktop host.

### Radix UI

Radix supplies accessible primitives for menus, dialogs, tabs, tooltips,
popovers, dropdowns, context menus, scroll areas, and similar controls. The
application wraps primitives in a small Neutral Editor component layer rather
than importing Radix throughout domain-facing features.

### Tailwind CSS

Tailwind supplies layout and visual styling. Theme tokens for surfaces, text,
borders, focus, diagnostics, port/type colors, spacing, and density live in one
editor theme layer. Dynamic class construction is avoided where it would evade
build-time discovery.

Tailwind classes remain a presentation concern and never appear in project,
descriptor, language-capability, or IPC records.

## Shared editor domain

The domain layer sits between UI libraries and the host client. It owns:

- project and authoring document records;
- discovered capability/profile references;
- declarations, nested values, and semantic connection records;
- stable editor-local IDs and context paths;
- commands plus undo/redo transactions;
- project/source revision rules; and
- mapping language diagnostics to editor elements.

The domain depends on no React Flow, Radix, Tailwind, Tauri, filesystem, or
runtime API. Language-specific constructs enter through versioned capability
and authoring projections rather than generic-editor constants.

## Rust host responsibilities

### Language registry and bridge

- discover installed Neutral language adapters;
- return versioned capability profiles;
- import/project one source unit through the selected public authoring API;
- capture and validate exact inputs through `neutral-lang`;
- preserve cancellation, limits, diagnostics, source maps, provenance,
  derivation, and resource facts; and
- reject profile substitution and unknown required capabilities.

### Captured vocabulary resolver

- resolve only host-authorized exact vocabulary inputs;
- validate identity, version, integrity, and schema before returning data;
- perform no source-directed ambient filesystem or network search; and
- expose data-only nominal types, fields, defaults, and structural features.

This service is not an executable plugin loader.

### Project persistence

- open and decode versioned project documents under explicit limits;
- preserve unknown fields and unresolved records;
- write through an atomic replace where supported;
- distinguish project, source, and editor settings files; and
- never serialize React Flow/Zustand state as the project contract.

### Native OS integration

- file dialogs and user-selected file access;
- application-owned settings and recent-project records;
- platform menus, window lifecycle, and safe external-link opening; and
- later platform packaging/update integration when separately accepted.

### Runtime bridge

The Rust workspace may reserve a runtime adapter boundary, but v0 does not
instantiate it or expose Run/Stop commands. Runtime discovery, authorization,
execution, cancellation, logs, and node-state correlation require a separate
accepted protocol.

## IPC boundary

Tauri commands are coarse-grained, typed, cancellable where relevant, and
capability-scoped. The initial command families are conceptual rather than
fixed names:

```text
language.discover
language.capabilities
language.import_source
language.project_source
language.validate
project.open
project.save
```

Mouse movement, node dragging, pan, zoom, hover, selection, inspector typing,
and React state synchronization never cross IPC. Requests include an editor
revision; stale responses are discarded.

Project and source file access is limited to user-selected paths. The main
window receives only the Tauri permissions and command scopes required for the
active v0 operations.

## Proposed implementation layout

```text
neutral-editor/
+-- src/
|   +-- app/                 composition and application services
|   +-- domain/              framework-independent editor model/commands
|   +-- canvas/              React Flow adapter and generic renderers
|   +-- state/               Zustand stores, slices, and selectors
|   +-- language/            typed frontend capability/host client
|   +-- project/             project workflows and compatibility UI
|   +-- components/          Radix-based editor components
|   +-- styles/              Tailwind entry point and theme tokens
|   +-- diagnostics/         Problems UI and element mapping
|   +-- testing/             fake adapters and fixture builders
|
+-- src-tauri/
|   +-- src/
|   |   +-- commands/        thin Tauri command entry points
|   |   +-- language/        registry and neutral-lang adapter
|   |   +-- vocabulary/      exact captured resolver
|   |   +-- project/         decoding and atomic persistence
|   |   +-- platform/        native OS adapters
|   |   +-- runtime/         reserved; excluded from v0 activation
|   +-- capabilities/        least-privilege Tauri capability files
|
+-- tests/
    +-- conformance/         Neutral v0 editor compliance harness
    +-- fixtures/            editor/project fixture data
```

Folder names may change during implementation, but ownership and dependency
direction are architectural requirements.

## Additional boundary libraries

Serde is the Rust encoding boundary. A TypeScript runtime schema validator such
as Zod may validate capability, project, and IPC payloads before they enter the
frontend domain. If schemas are generated, one reviewed schema source must own
the cross-process contract; parallel handwritten TypeScript and Rust message
definitions are not allowed to drift silently.

## Stack acceptance checks

- React Flow can be replaced in a domain test without changing project records.
- Zustand can be initialized and command-tested without Tauri.
- Radix and Tailwind appear only in presentation/component dependencies.
- Dragging a node performs no IPC or semantic validation.
- The Rust bridge discovers the active language profile before the UI exposes
  language constructs.
- Project save/open does not serialize library-private state.
- No runtime command is reachable in the Neutral Editor v0 capability set.
