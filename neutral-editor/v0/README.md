# Neutral Editor v0 overview

Status: proposed scope

## Purpose

Neutral Editor v0 proves that a visual editor can author the complete accepted
Neutral language v0 surface without making the canvas library, editor file, or
UI state part of Neutral language semantics.

The complete first journey is:

1. Discover installed Neutral language versions and their capability profiles.
2. Select the exact profile required by the project.
3. Open or create one `.neu` source unit containing one logical module.
4. Author records, bindings, nested values, lists, defaults, reuse, references,
   and optional captured vocabulary-owned data advertised by that profile.
5. Reject locally obvious incompatible edits using discovered compatibility
   metadata while leaving the compiler authoritative.
6. Project the visual model deterministically to `.neu`.
7. Ask `neutral-lang` for authoritative validation and map diagnostics back to
   the affected graph element.
8. Save, close, reopen, and obtain the same program meaning and layout.

This is an authoring proof, not a visual runtime.

## Implementation baseline

```text
Tauri 2
|-- React + TypeScript
|   |-- React Flow
|   |-- Zustand
|   |-- Radix UI
|   `-- Tailwind CSS
`-- Rust host services
```

The complete ownership and dependency rules are defined in
[TECHNOLOGY-STACK.md](TECHNOLOGY-STACK.md). The Rust runtime adapter boundary is
reserved but inactive in v0.

## Governing boundaries

- Neutral language contracts own syntax, names, types, compatibility,
  diagnostics, and validated IR.
- The editor owns interaction, layout, selection, commands, project files, and
  mapping editor elements to generated source spans.
- React Flow owns canvas rendering and pointer interaction only.
- A project file is an editable authoring document, not Neutral IR.
- Generated `.neu` is the language source; validated Neutral IR remains the
  authoritative compiler output.
- Neutral Flow, Neux, CI providers, operating systems, and runtimes contribute
  no hard-coded editor behavior.
- The generic editor discovers language versions, document shape, authoring
  constructs, types, limits, and capabilities; it does not infer them from a
  version string.

## v0 scope

v0 includes:

- one graph canvas with pan, zoom, selection, node movement, and connections;
- a searchable palette backed by the selected discovered capability profile;
- one generic node renderer and generated property controls;
- the complete Neutral v0 document surface: headers, zero or one captured
  vocabulary, record declarations, and immutable typed bindings;
- all v0 types: `num`, `string`, `bool`, user records, `T?`, `List<T>`,
  `Ref<T>`, and discovered vocabulary-owned nominal types;
- all v0 values: exact numbers, strings, Booleans, `null`, recursively nested
  contextual records and lists, ordinary value reuse, and `ref(name)`;
- required/defaulted and nullable/non-nullable field behavior;
- typed value ports and local preflight connection checks;
- deterministic graph-to-source projection;
- existing-source import through a public versioned authoring projection;
- validation through the selected versioned Neutral adapter;
- node/port diagnostics where stable source mapping permits it;
- command-based undo and redo for semantic edits and completed node moves;
- one versioned project format containing authoring data and presentation data;
- save/open and lossless unknown-field preservation policy; and
- a basic performance fixture of 50 nodes and 100 connections.

## Explicit non-goals

v0 does not promise:

- program execution, Run/Stop controls, or node runtime animation;
- discovery of executable operations from installed vocabularies;
- automatic vocabulary installation or a plugin marketplace;
- simultaneous free-form source and graph editing;
- custom node components supplied by vocabularies;
- multiple source units, multiple modules, nested module/document editing,
  subgraphs, groups, collaboration, debugging, breakpoints, or graph diff;
- automatic layout or thousand-node graphs;
- production installers for all desktop platforms; or
- application-specific nodes for Flow, Neux, providers, or operating systems.

The editor may retain a document-context stack and breadcrumbs for later nested
editing profiles, but the selected Neutral v0 capability exposes only one root
source/module. Recursively nested record and list **values** are part of v0 and
must remain editable.

Execution is deferred because the present Neutral language v0 is effect-free
and defines data-only vocabularies. The editor must not invent missing runtime
or executable-node contracts.

## Interface shape

```text
+------------------------------------------------------------------+
| File  Edit  View       Language: detected profile   Validate    |
+----------------+--------------------------------+----------------+
| Palette        |                                | Inspector      |
| search         |          Graph canvas          | generated      |
| descriptors    |                                | properties     |
+----------------+--------------------------------+----------------+
| Problems                                                         |
+------------------------------------------------------------------+
```

The palette, inspector, and Problems panel may be collapsible. A command palette
or context-sensitive quick-add menu is preferred over requiring long pointer
travel for every node insertion.

## Success criteria

v0 is successful when the full Neutral v0 conformance corpus and reference
projects demonstrate all of the following:

- the editor detects the exact language version and capability profile without
  a hard-coded v0 feature table in the generic UI;
- every accepted v0 construct can be imported, represented, edited, projected,
  compiled, saved, and reopened;
- every explicit v0 exclusion remains unavailable or receives its expected
  compiler diagnostic without silent repair;
- editor positions and viewport changes do not alter generated source meaning;
- compatible value reuse can be connected and incompatible types are rejected;
- identical semantic graph state produces byte-identical reference-formatted
  source;
- authoritative compiler diagnostics are not replaced by frontend guesses;
- a diagnostic can identify its owning node or port when the adapter returns a
  matching source span;
- save/reopen preserves stable element IDs, semantic content, nested values,
  reuse/reference distinctions, layout, and unknown project fields; and
- the 50-node reference graph remains usable under a recorded development
  hardware and browser/WebView profile.

The precise editor compliance claim and its mapping to every Neutral language
v0 requirement are defined in [REQUIREMENTS.md](REQUIREMENTS.md).
