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

**Consequence:** v0 supports only graph constructs with a deterministic source
projection. Arbitrary source import is deferred.

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

## ED-ADR-004: descriptors are data

**Decision:** Ordinary nodes and inspectors are generated from immutable,
versioned, data-only descriptors.

**Reason:** Custom executable UI modules would couple trust, portability, and
product-specific behavior to the editor.

**Consequence:** v0 uses a pinned fixture because current Neutral vocabularies
do not define executable authoring operations. Unknown required descriptor
behavior fails visibly.

## ED-ADR-005: compiler validation is authoritative

**Decision:** Local connection checks are interaction preflight; only the
versioned Neutral adapter establishes program validity.

**Reason:** Reimplementing language compatibility in TypeScript would drift.

**Consequence:** Every local rule needs parity tests, and a disagreement is an
adapter defect rather than permission to override the compiler.

## ED-ADR-006: execution is outside v0

**Decision:** v0 has Validate but no Run or Stop.

**Reason:** Compilation establishes structural and semantic acceptance, not
runtime authority or effects. The current language v0 has no execution protocol
or executable vocabulary contract.

**Consequence:** Runtime controls require a later protocol and threat model.

## ED-ADR-007: desktop effects stay at the host boundary

**Decision:** High-frequency interaction remains in React. A Tauri/Rust host
owns bounded filesystem and language-process operations through explicit,
scoped commands.

**Reason:** IPC on pointer movement adds latency and unnecessary authority.

**Consequence:** Host commands are coarse-grained and capability-scoped; domain
logic remains testable without Tauri.
