# Neutral Editor v0 roadmap

Status: proposed execution order

The first complete boundary is:

```text
discover language profile
    -> import/author complete Neutral v0 model
    -> one .neu source and module
    -> compile/validate
    -> mapped diagnostics and conformance evidence
```

Every stage should preserve this path once it exists.

## Stage 0: freeze the reference journey

- approve the v0 overview, requirements, and decisions;
- map every `NL-*` requirement and explicit exclusion to an editor obligation;
- define the language registry, capability profile, authoring projection,
  projection, compatibility, and validation adapter contracts;
- define stable editor IDs, capability IDs, context paths, and source-span
  mapping rules;
- classify nested values as v0 content and nested documents/modules as future
  capability-driven contexts; and
- select all current positive and negative Neutral v0 fixtures as the initial
  editor conformance corpus.

Exit: every Neutral v0 requirement has an editor compliance disposition, and
the adapter response can describe v0 without generic editor constants.

## Stage 1: prove discovery and the complete authoring model

- discover installed adapters and select an exact language capability profile;
- implement the framework-independent one-source/one-module document model;
- represent headers, optional captured vocabulary, records, and bindings;
- represent every v0 type and source value form, including exact numbers,
  nested record/list values, defaults, reuse, and references;
- implement root and nested-value context navigation without enabling nested
  documents/modules; and
- test the model against all positive fixtures and explicit exclusions.

Exit: every valid v0 fixture has a lossless editor-domain representation and no
excluded construct can enter through the domain API.

## Stage 2: prove the canvas adapter

- create the React/TypeScript application shell;
- integrate React Flow behind a small view adapter;
- render discovered language descriptors with generic node, type, value, and
  nested-value components;
- implement selection, pan, zoom, movement, typed reuse, and identity-reference
  connections;
- keep semantic graph and presentation state separate; and
- add model and canvas-adapter tests.

Exit: the reference graph is editable and React Flow serialization is absent
from domain and persistence APIs.

## Stage 3: import, project, and validate

- integrate adapter-provided source import and deterministic projection;
- emit element/property/port source-span mappings;
- implement a fake language adapter for deterministic UI tests;
- connect the real `neutral-lang` adapter when its API exists;
- revision, debounce, and cancel validation requests; and
- show mapped node/port and document-level diagnostics.

Exit: every positive fixture survives import -> visual model -> projection ->
compile with equal logical IR, every negative fixture remains rejected, and
stale results cannot overwrite current problems.

## Stage 4: editing transactions and project files

- implement command-based undo/redo;
- specify and validate the JSON project format;
- preserve nested values, unresolved constructs, comments supported by the
  authoring projection, and unknown fields;
- implement atomic save/open through a host interface; and
- test corruption, incompatible versions, and interrupted saves.

Exit: save/reopen is lossless for all reference projects and failure never
silently damages, migrates, or simplifies a document.

## Stage 5: desktop and conformance proof

- place the application in a minimally privileged Tauri 2 host;
- keep canvas interaction inside the WebView process;
- record keyboard and accessibility checks;
- measure the 50-node/100-connection fixture;
- test supported development hosts; and
- run positive, negative, ambiguity, numeric, vocabulary, resource,
  determinism, source-map, provenance, and adversarial editor cases; and
- publish `ED-*` and `NL-*` requirement-to-evidence traceability.

Exit: the full Neutral v0 authoring surface works in the desktop shell with
bounded input, scoped capabilities, recorded performance, and no editor or
upstream language requirement without evidence.

## Deferred gates

After v0, separately decide:

1. profiles with multiple or nested source units and modules;
2. coordinated simultaneous free-form source and graph editing;
3. executable vocabulary operations and runtime discovery/execution protocols;
4. subgraphs, reusable components, and large-graph navigation;
5. the 200-node/1,000-connection performance profile; and
6. signed Linux, macOS, and Windows distribution.

None of these gates may be closed by adding editor-only language meaning.
