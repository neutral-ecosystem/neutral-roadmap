# Neutral Editor v0 architectural decisions

Status: proposed decision index

This compact index plays the same role as the fuller Neutral language v0
decision set. Accepted decisions should be split into separate records only
when alternatives, consequences, or revision history need more space.

## ED-ADR-001: author through source

**Decision:** The visual graph projects to `.neu`; `neutral-lang` produces and
validates Neutral IR.

**Reason:** This preserves one language and one cross-application IR boundary.
Direct editor-to-IR generation would duplicate compiler semantics and create a
second authoring contract.

**Consequence:** v0 supports every accepted construct advertised by the selected
Neutral v0 authoring profile. Existing-source import and deterministic
projection are adapter capabilities; compiler-private AST records never become
the editor format.

## ED-ADR-002: own an editor document

**Decision:** Persist a Neutral-owned editor document containing a semantic
graph and separate presentation metadata. React Flow state is only a view
projection.

**Reason:** Canvas libraries optimize rendering and interaction; their records
do not define stable program identity, migration, or compatibility.

**Consequence:** Adapters translate between domain records and React Flow nodes
and edges. Selection remains transient.

## ED-ADR-003: use React Flow as the v0 canvas

**Decision:** Begin with React, TypeScript, and `@xyflow/react`.

**Reason:** React Flow supplies the interaction primitives v0 needs, has typed
custom nodes and edges, and leaves domain state under application control. Rete
is a credible alternative when an editor also needs a pluggable data/control
processing engine, but Neutral semantics and future runtime behavior must stay
outside the frontend graph library.

**Consequence:** Wrap React Flow behind a narrow adapter and benchmark the
reference graph before treating the choice as permanent.

## ED-ADR-004: discover language capabilities

**Decision:** The editor discovers installed language profiles and obtains
document shape, constructs, types, values, compatibility, vocabulary behavior,
operations, diagnostics, and limits through a versioned adapter.

**Reason:** A version label does not describe behavior, and hard-coded v0 rules
in the generic UI would prevent safe evolution and nested future profiles.

**Consequence:** Missing or unknown required capabilities fail closed. The
exact profile is persisted, and a different profile is never selected silently.

## ED-ADR-005: descriptors are data

**Decision:** Ordinary nodes and inspectors are generated from immutable,
versioned, data-only descriptors.

**Reason:** Custom executable UI modules would couple trust, portability, and
product-specific behavior to the editor.

**Consequence:** Ordinary construct/type/value descriptors come from the
selected language profile. Captured v0 vocabularies may contribute nominal data
descriptors only; they do not provide executable operations. Unknown required
descriptor behavior fails visibly.

## ED-ADR-006: compiler validation is authoritative

**Decision:** Local connection checks are interaction preflight; only the
versioned Neutral adapter establishes program validity.

**Reason:** Reimplementing language compatibility in TypeScript would drift.

**Consequence:** Every local rule needs parity tests, and a disagreement is an
adapter defect rather than permission to override the compiler.

## ED-ADR-007: distinguish nested values from nested documents

**Decision:** Recursively nested record/list values are required v0 content.
Nested source units, modules, namespaces, and subgraphs remain unavailable
because the discovered v0 document profile reports one source and one module.

**Reason:** Value nesting is part of current Neutral semantics, while document
nesting would extend them.

**Consequence:** The editor model retains a generic context path and breadcrumb
mechanism, but only the root document context and nested value editors activate
for v0.

## ED-ADR-008: execution is outside v0

**Decision:** v0 has Validate but no Run or Stop.

**Reason:** Compilation establishes structural and semantic acceptance, not
runtime authority or effects. The current language v0 has no execution protocol
or executable vocabulary contract.

**Consequence:** Runtime controls require a later protocol and threat model.

## ED-ADR-009: desktop effects stay at the host boundary

**Decision:** High-frequency interaction remains in React. A Tauri/Rust host
owns bounded filesystem and language-process operations through explicit,
scoped commands.

**Reason:** IPC on pointer movement adds latency and unnecessary authority.

**Consequence:** Host commands are coarse-grained and capability-scoped; domain
logic remains testable without Tauri.

## ED-ADR-010: adopt the v0 implementation stack

**Decision:** Use Tauri 2 and Rust with a React/TypeScript frontend built from
React Flow, Zustand, Radix UI, and Tailwind CSS.

**Reason:** The stack separates high-frequency graph interaction from native
and language effects, provides accessible UI primitives, and supports a small
typed desktop distribution without requiring the canvas to own semantics.

**Consequence:** React Flow is isolated behind a canvas adapter; Zustand uses
separate semantic, presentation, selection, capability, validation, project,
and UI slices; Radix and Tailwind remain presentation dependencies; and Rust
services sit behind coarse, least-privilege Tauri commands. The runtime module
is reserved but inactive in v0. See
[TECHNOLOGY-STACK.md](../TECHNOLOGY-STACK.md).
