# Neutral language v1 design roadmap

Status: proposed design roadmap

## Outcome

Produce an evidence-backed v1 portable seed for deterministic multi-file
Neutral projects, explicit module APIs, and public language tooling. This
roadmap ends at a reviewed implementation-ready contract; it does not implement
Neutral Flow or Neutral Editor.

## Stage 0 — validate the need

- Extract the smallest real multi-file authoring cases from Flow and Editor.
- Demonstrate why v0's one-unit model or a data-only vocabulary cannot satisfy
  them.
- Record required project sizes, import depths, diagnostic latency, and editor
  round-trip expectations.
- Confirm that no proposed feature assigns workflow or UI meaning in the
  language core.

Exit: at least one Flow corpus and one Editor corpus require the same
domain-neutral module behavior.

## Stage 1 — freeze observable source behavior

- Decide module-name grammar and the one-unit-per-module rule.
- Decide exact import, alias, qualified-name, and visibility syntax.
- Decide whether repeated vocabulary requirements belong in v1.
- Specify every ambiguity with existing `::`, `use`, record, binding, and
  `ref(...)` syntax.
- Create paired positive and negative multi-file fixtures before compiler work.

Exit: two independent reviewers can determine acceptance and name resolution
for every fixture without implementation knowledge.

## Stage 2 — specify capture and identity

- Define project, source-unit, module, module-symbol, public-API, declaration,
  derivation, and byte identities separately.
- Define resolver requests and captured closure consistency.
- Specify root selection, missing/extra units, duplicate modules, and cycle
  detection.
- Set structural limits for file count, total bytes, graph width/depth,
  imports, aliases, vocabularies, and diagnostics.

Exit: capture is bounded and replayable, and `compileCapturedProject` needs no
external I/O.

## Stage 3 — specify semantic and IR behavior

- Define private/public resolution and inaccessible-public-surface errors.
- Define cross-module type, value reuse, and `Ref<T>` behavior.
- Define module graph and declaration dependency ordering.
- Extend logical IR, reader validation, source maps, provenance, derivation,
  equality, and resource accounting to project scope.
- Specify root/export views without dropping interpretive dependencies.

Exit: every accepted fixture has one complete project IR meaning and every
invalid fixture has stable cross-source diagnostics.

## Stage 4 — freeze public tooling contracts

- Extend capability discovery with project-shape and v1 feature IDs.
- Specify project capture, compilation, decoding, and validated-reader APIs.
- Specify the editor-facing authoring projection and deterministic multi-source
  projection operation.
- Define request revision, cancellation, partial-result, and stale-diagnostic
  behavior.
- Define optional incremental processing and prove equivalence with clean full
  compilation.

Exit: a generic editor can import, edit, project, validate, save, and reopen the
reference project without a private Neutral parser or AST.

## Stage 5 — prove consumer independence

- Build a generic project probe using only the public reader.
- Build a Flow boundary probe that sees resolved exported data but no source or
  compiler-private model.
- Build an Editor probe using only discovery, authoring, projection, and
  validation services.
- Test repeated, concurrent, shuffled-resolver, malformed-input, and limit
  cases.
- Verify that `public` and successful compilation never trigger or authorize an
  effect.

Exit: all three probes pass and private compiler packages are absent from their
dependency graphs.

## Stage 6 — promote the portable seed

- Record accepted decisions and v0-to-v1 compatibility/migration policy.
- Create the required `portable/` entry points, specifications, development
  pipeline, fixtures, and conformance manifest.
- Verify standalone links, design-to-portable synchronization, website
  discovery, and requirement-to-evidence traceability.
- Update the project roadmap only after the portable package is complete.

Exit: v1 is implementation-ready under the repository's portable documentation
rules. Release still requires implementation and conformance evidence.

## Deferred work

Package distribution, dependency solving, re-exports, partial modules,
composition constructs, expressions, functions, macros, secrets, runtime
effects, Flow vocabulary semantics, and Editor UX remain separate proposals.
