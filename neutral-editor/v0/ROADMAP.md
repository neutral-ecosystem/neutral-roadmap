# Neutral Editor v0 roadmap

Status: proposed execution order

The first complete boundary is:

```text
fixture descriptors -> visual graph -> .neu -> validation -> mapped problems
```

Every stage should preserve this path once it exists.

## Stage 0: freeze the reference journey

- approve the v0 overview, requirements, and decisions;
- select one positive Neutral source fixture and its graph projection;
- define one invalid typed connection and one compiler diagnostic case;
- define stable editor IDs, descriptor IDs, and source-span mapping rules; and
- agree the minimum language-adapter capability response.

Exit: the expected graph, generated source, diagnostics, and save/reopen result
can be written without referring to React Flow internal types.

## Stage 1: prove the canvas adapter

- create the React/TypeScript application shell;
- integrate React Flow behind a small view adapter;
- render fixture descriptors with one generic node component;
- implement selection, pan, zoom, movement, and typed connections;
- keep semantic graph and presentation state separate; and
- add model and canvas-adapter tests.

Exit: the reference graph is editable and React Flow serialization is absent
from domain and persistence APIs.

## Stage 2: project and validate

- implement deterministic graph-to-source projection;
- emit element/property/port source-span mappings;
- implement a fake language adapter for deterministic UI tests;
- connect the real `neutral-lang` adapter when its API exists;
- revision, debounce, and cancel validation requests; and
- show mapped node/port and document-level diagnostics.

Exit: one graph produces the expected `.neu`, validates through the public
boundary, and stale results cannot overwrite current problems.

## Stage 3: editing transactions and project files

- implement command-based undo/redo;
- specify and validate the JSON project format;
- preserve unresolved nodes and unknown fields;
- implement atomic save/open through a host interface; and
- test corruption, incompatible versions, and interrupted saves.

Exit: save/reopen is lossless for the reference project and failure never
silently damages or simplifies the document.

## Stage 4: desktop and quality proof

- place the application in a minimally privileged Tauri 2 host;
- keep canvas interaction inside the WebView process;
- record keyboard and accessibility checks;
- measure the 50-node/100-connection fixture;
- test supported development hosts; and
- publish requirement-to-evidence traceability.

Exit: the reference journey works in the desktop shell with bounded input,
scoped capabilities, recorded performance, and no known requirement without
evidence.

## Deferred gates

After v0, separately decide:

1. a Neutral-owned authoring descriptor schema for installed vocabularies;
2. arbitrary source import or coordinated source/graph editing;
3. runtime discovery and execution protocols;
4. subgraphs, reusable components, and large-graph navigation;
5. the 200-node/1,000-connection performance profile; and
6. signed Linux, macOS, and Windows distribution.

None of these gates may be closed by adding editor-only language meaning.
