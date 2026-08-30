# Neutral Editor v0 overview

Status: proposed scope

## Purpose

Neutral Editor v0 proves one narrow claim: a visual graph can author a small,
valid Neutral program without making the canvas library, editor file, or UI
state part of Neutral language semantics.

The complete first journey is:

1. Open one local editor project.
2. Add nodes from a small pinned descriptor catalogue.
3. Configure immutable scalar bindings and connect compatible value ports.
4. Reject a locally obvious incompatible connection.
5. Project the graph deterministically to `.neu`.
6. Ask `neutral-lang` for authoritative validation.
7. Show diagnostics on the affected node or port when mapping is available.
8. Save, close, reopen, and obtain the same program meaning and layout.

This is an authoring proof, not a visual runtime.

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

## v0 scope

v0 includes:

- one graph canvas with pan, zoom, selection, node movement, and connections;
- a searchable palette backed by a pinned descriptor catalogue;
- one generic node renderer and generated property controls;
- immutable scalar binding nodes sufficient for a small positive Neutral
  fixture;
- typed value ports and local preflight connection checks;
- deterministic graph-to-source projection;
- validation through a versioned Neutral adapter;
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
- source-to-graph recovery for arbitrary `.neu` files;
- custom node components supplied by vocabularies;
- subgraphs, groups, collaboration, debugging, breakpoints, or graph diff;
- automatic layout or thousand-node graphs;
- production installers for all desktop platforms; or
- application-specific nodes for Flow, Neux, providers, or operating systems.

These are deferred because the present Neutral language v0 is effect-free,
defines data-only vocabularies, and exposes neither a public syntax tree nor an
IR rewrite API. The editor must not invent those missing contracts.

## Interface shape

```text
+------------------------------------------------------------------+
| File  Edit  View                                  Validate       |
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

v0 is successful when one reference project demonstrates all of the following:

- editor positions and viewport changes do not alter generated source meaning;
- compatible value reuse can be connected and incompatible types are rejected;
- identical semantic graph state produces byte-identical reference-formatted
  source;
- authoritative compiler diagnostics are not replaced by frontend guesses;
- a diagnostic can identify its owning node or port when the adapter returns a
  matching source span;
- save/reopen preserves stable element IDs, semantic content, layout, and
  unknown project fields; and
- the 50-node reference graph remains usable under a recorded development
  hardware and browser/WebView profile.

The larger goals in the original overview remain useful product direction, but
they require new language, vocabulary, runtime, and distribution contracts and
therefore do not define this first proof.
