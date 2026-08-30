# Neutral Editor v0 requirements

Status: proposed requirements

This file defines the minimum observable v0 behavior. Later product ideas are
kept out of the release contract until separately accepted.

## Product boundary

- **ED-BND-001:** The editor must author `.neu` through `neutral-lang`; it must
  not emit Neutral IR or define language semantics.
- **ED-BND-002:** The editor must contain no Flow-, Neux-, provider-, runtime-,
  or operating-system-specific node logic.
- **ED-BND-003:** React Flow records must not be the persisted semantic model.
- **ED-BND-004:** Editor presentation changes must not alter generated program
  meaning or request compiler validation.

## Reference journey

- **ED-JNY-001:** A user can create, configure, connect, delete, and move nodes
  using one generic descriptor-driven node view.
- **ED-JNY-002:** A user can search the pinned catalogue by stable name and
  display name and add a result at the current graph context.
- **ED-JNY-003:** The editor rejects direction, cardinality, and known exact-type
  mismatches before committing a connection.
- **ED-JNY-004:** The reference graph projects to deterministic reference-formatted
  `.neu` source.
- **ED-JNY-005:** The user can validate the current revision and inspect compiler
  diagnostics in a Problems panel.
- **ED-JNY-006:** The user can save and reopen the project without changing the
  graph's program meaning or presentation.

## Model and descriptors

- **ED-MOD-001:** Nodes, ports, connections, and descriptors have stable,
  opaque IDs independent of UI order.
- **ED-MOD-002:** Semantic graph and presentation metadata are separate records.
- **ED-MOD-003:** Descriptors are immutable, versioned, data-only inputs.
- **ED-MOD-004:** Unsupported or missing descriptors leave preserved unresolved
  nodes and produce diagnostics; they are never silently removed.
- **ED-MOD-005:** The reference fixture covers scalar literal values and ordinary
  immutable binding reuse supported by Neutral language v0.

## Projection and validation

- **ED-VAL-001:** Every generated declaration and editable value has an
  element-to-source-span mapping when the projection profile can provide one.
- **ED-VAL-002:** Validation requests carry a document revision, explicit
  captured inputs, limits, and cancellation.
- **ED-VAL-003:** Stale validation results must not replace diagnostics for a
  newer document revision.
- **ED-VAL-004:** Frontend checks are preflight guidance; compiler results remain
  authoritative.
- **ED-VAL-005:** A failed, cancelled, or unavailable validation request must be
  distinguishable from an invalid Neutral program.

## Editing and accessibility

- **ED-UX-001:** Add, remove, connect, disconnect, property edit, and completed
  move operations are undoable and redoable.
- **ED-UX-002:** One drag produces at most one undo entry.
- **ED-UX-003:** Core actions are available without drag-and-drop alone.
- **ED-UX-004:** Nodes and edges expose accessible names, selection state, and
  keyboard deletion; focus remains visible.
- **ED-UX-005:** The graph supports pan, zoom, box selection, multi-selection,
  fit view, and zoom to selection where supported by the canvas library.

## Persistence and compatibility

- **ED-PER-001:** The project format has its own major/minor format version and
  records exact Neutral and descriptor requirements.
- **ED-PER-002:** Save does not overwrite the existing project unless the new
  document has been encoded successfully.
- **ED-PER-003:** A newer unsupported major version is opened read-only or
  rejected without modifying the file.
- **ED-PER-004:** Unknown fields survive a no-migration load/save cycle.

## Performance and security

- **ED-QLT-001:** The reference 50-node, 100-connection graph has recorded pan,
  drag, connect, projection, and validation timings on named test hardware.
- **ED-QLT-002:** Node movement does not invoke Rust/Tauri or the language
  adapter.
- **ED-QLT-003:** Node and edge components use narrow subscriptions and avoid
  permanent animation, blur, and expensive shadows in the reference profile.
- **ED-SEC-001:** Project and descriptor decoding has explicit byte, node,
  connection, port, string, and nesting limits.
- **ED-SEC-002:** Descriptor documentation cannot execute scripts or inject
  unsanitized HTML.
- **ED-SEC-003:** Desktop capabilities grant only the file and language-adapter
  commands required by the v0 window.

## Release evidence

Each requirement must map to at least one acceptance test or recorded manual
check before v0 is called complete. Research notes and mockups are not evidence
of implementation behavior.
