# Node-editor research for Neutral Editor

Status: research memo, not a product specification

Reviewed: 2026-08-30

## Scope

This memo extracts reusable interaction and architecture lessons from mature
node editors and current official library documentation. These products are
precedents, not templates to copy wholesale.

## Executive synthesis

The strongest editors converge on a canvas surrounded by searchable creation,
contextual properties/help, and diagnostics or runtime feedback. Their best
ideas are not decorative; they reduce graph navigation and error-recovery cost.

Neutral Editor should adopt five patterns early:

1. searchable quick-add at the point of work, not palette drag alone;
2. context-sensitive node availability and typed connection feedback;
3. selection-driven inspector and documentation;
4. persistent, visible validation state on nodes plus a global Problems view;
5. large-graph navigation through search, zoom-to-result, collapse, and later
   reusable subgraphs rather than assuming a minimap solves complexity.

It should avoid three common traps:

- treating canvas serialization as the program model;
- mixing runtime semantics into a frontend graph library; and
- shipping every mature-editor feature before one end-to-end authoring path is
  correct.

## Product precedents

| Editor | Useful precedent | Neutral v0 treatment |
| --- | --- | --- |
| Unreal Blueprints | Typed data pins, distinct execution wires, context-sensitive creation, compile results, and search | Adopt typed/contextual creation and Problems feedback; defer execution wires until Neutral defines them |
| Node-RED | Clear palette/workspace/sidebar layout, quick-add at cursor, inline node status/errors/docs, insert-on-wire | Adopt palette + quick-add + inspector/problems; defer deployment/runtime status |
| Blender node editors | Fast keyboard search, active selection driving properties, frames/groups, hide/collapse, search that centers a result | Adopt search/center and selection-driven inspector; defer frames/groups |
| ComfyUI | A real-world warning about rendering architecture: moving from Canvas to component rendering improves UI flexibility but can trade performance and compatibility | Prefer component flexibility for v0, but require a representative graph benchmark |

Unreal's official Blueprint material distinguishes typed data from execution
flow and documents a context-sensitive node editor with compiler/debug panels.
That is useful evidence for keeping connection kind in the semantic model, but
it is not evidence that Neutral currently has execution semantics. See the
[Blueprint editor reference](https://dev.epicgames.com/documentation/unreal-engine/user-interface-reference-for-the-blueprints-visual-scripting-editor-in-unreal-engine)
and [Blueprint overview](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprints-visual-scripting-in-unreal-engine).

Node-RED's current editor is organized around a header, central workspace, and
movable sidebars. Its nodes can be added from a palette or a filtered quick-add
dialog at the cursor; nodes expose errors, status, and documentation directly.
See the [Node-RED editor guide](https://nodered.org/docs/user-guide/editor/),
[node interaction reference](https://nodered.org/docs/user-guide/editor/workspace/nodes),
and [wiring reference](https://nodered.org/docs/user-guide/editor/workspace/wires).

Blender's node selection tools show the value of keyboard search that centers
and highlights a result in a large graph, while active selection drives the
properties surface. See the [Blender node selection manual](https://docs.blender.org/manual/en/latest/interface/controls/nodes/selecting.html).

ComfyUI's Nodes 2.0 documentation explicitly describes a move from Canvas
rendering to Vue components for faster UI development and richer interaction,
while noting ongoing performance and compatibility work. This is a useful
tradeoff warning rather than a reason to choose either approach blindly. See
[ComfyUI Nodes 2.0](https://docs.comfy.org/interface/nodes-2).

## Library comparison

| Criterion | React Flow | Rete.js |
| --- | --- | --- |
| Primary shape | React canvas/diagram component | Modular visual-programming framework |
| Built-in interaction | Drag, pan, zoom, selection, connect, controls, minimap | Area, connections, selection, rendering, history, minimap through plugins |
| Processing engine | Intentionally application-owned | Dataflow and control-flow engines available |
| Framework fit | Direct React component model | Multiple renderers, including React |
| Architectural risk here | App may accidentally persist view records | App may accidentally duplicate Neutral processing semantics in Rete engines |
| v0 judgment | Preferred, behind an adapter | Keep as fallback if React Flow cannot satisfy measured interaction or extension needs |

React Flow provides the v0 canvas primitives and controlled state model without
requiring its records to become the domain model. Its official performance
guidance emphasizes memoized node/edge components and callbacks, narrow store
subscriptions, collapsible large trees, and simple styles. See the
[React Flow overview](https://reactflow.dev/),
[state-management guide](https://reactflow.dev/learn/advanced-use/state-management),
and [performance guide](https://reactflow.dev/learn/advanced-use/performance).

Rete.js is a strong alternative for processing-oriented editors. Its official
documentation provides separate editor, area, connection, renderer, dataflow,
and control-flow packages. That modularity is valuable, but its processing
engines are unnecessary for v0 because Neutral language tooling must remain the
semantic authority. See the [Rete introduction](https://retejs.org/docs/) and
[editor concepts](https://retejs.org/docs/concepts/editor/).

## Recommended interaction baseline

- Palette search groups descriptors but does not encode language semantics.
- Quick-add opens at the cursor and may be filtered by the originating port.
- Dragging from a port highlights compatible targets and explains rejection.
- Selecting a node opens generated properties and descriptor documentation.
- Node badges summarize unresolved, invalid, stale, and validating states.
- The Problems panel selects and centers the owning node when mapping exists.
- Unknown descriptors remain visible as unresolved nodes with their raw data.
- Undo records transactions, with a completed drag represented once.

## Desktop and security implications

Tauri 2 capabilities can constrain which windows or WebViews may invoke core,
application, or plugin commands. Neutral Editor should therefore expose small,
scoped file and language-adapter commands rather than general filesystem or
shell access. See the [Tauri capability reference](https://v2.tauri.app/reference/acl/capability/)
and [runtime authority](https://v2.tauri.app/security/runtime-authority/).

Canvas interaction remains frontend-local. The host boundary is for project
I/O, language integration, and later explicitly authorized runtime operations,
not mouse events or React state synchronization.

## Questions left open

- What exact public process or library API will implement `LanguageAdapter`?
- Which Neutral v0 fixture is the first visual projection profile?
- Does the reference formatter expose a library boundary or only a future CLI?
- Which source spans can be mapped stably to generated node properties?
- What project extension-preservation strategy is practical in both TypeScript
  and Rust?
- Which operating systems are development targets versus qualified v0 release
  targets?

These should be answered with a fixture and adapter spike before the editor
schema or desktop packaging is frozen.
