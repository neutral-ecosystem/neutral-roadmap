# Neutral Editor requirements

Status: proposed project contract

## Scope

Neutral Editor must represent, edit, validate, save, and reopen every construct
advertised by the selected Neutral language capability profile without changing
its meaning. The current conformance target is the complete Neutral language v0
surface for one file and one module.

## Project requirements

- **ED-PROJ-001:** The editor must discover installed language versions and
  capabilities through a versioned language bridge.
- **ED-PROJ-002:** Generic editor code must not hard-code grammar constructs,
  type sets, limits, vocabulary behavior, or compatibility rules.
- **ED-PROJ-003:** Unknown required capabilities must fail closed; unavailable
  profiles must open explicitly unresolved or read-only.
- **ED-PROJ-004:** Neutral source and compiler output remain authoritative for
  language meaning. The editor project is authoritative only for resuming visual
  editing.
- **ED-PROJ-005:** Semantic commands, undo/redo, persistence, and diagnostics
  must operate on a framework-independent editor document.
- **ED-PROJ-006:** Nested record and list values must be editable recursively to
  the limit reported by the selected profile.
- **ED-PROJ-007:** Future nested documents, modules, or subgraphs must be exposed
  only through discovered capabilities and must not create hidden v0 behavior.
- **ED-PROJ-008:** Import, visual editing, deterministic source projection,
  compiler validation, save, and reopen must preserve accepted program meaning.
- **ED-PROJ-009:** Native file, process, and OS access must remain behind narrow
  Rust host interfaces with least-privilege Tauri capabilities.
- **ED-PROJ-010:** Conformance evidence must cover positive, negative,
  diagnostic, source-map, determinism, vocabulary, resource-limit, and
  adversarial cases supplied by the language profile.

## Current conformance target

The detailed v0 obligations and evidence matrix remain implementation design
material. They are derived from the canonical
[Neutral language requirements](../neutral-lang/REQUIREMENTS.md) and accepted
v0 language decisions; this project contract does not redefine those semantics.

## Acceptance boundary

The editor is conformant for a language profile only when every advertised
construct is authorable or preservable, every excluded construct remains
unavailable, compiler diagnostics map back to the visual document, and a
save/reopen cycle is lossless for the reference corpus.
