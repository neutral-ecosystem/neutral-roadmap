# Neutral language v0 development plan

Status: proposed implementation checklist

This document turns the v0 architecture and decisions into an ordered,
implementation-level plan. It does not add syntax, semantics, or later-version
features. The governing sources remain:

1. [v0 architecture](../ARCHITECTURE.md)
2. [v0 requirements](../needed-features.md)
3. [architectural choices](../choices.md)
4. [master syntax checklist](../syntax.md)
5. [v0 decisions](decisions/README.md)
6. [v0 implementation roadmap](ROADMAP.md)
7. [v0 conformance fixtures](fixtures/README.md)

More specific accepted decisions take precedence. A contradiction between this
checklist and an accepted decision is a defect in this checklist, not permission
for the implementation to choose new language behavior.

## Implementation assumption

This plan assumes a stable Rust workspace because the requested repository
shape includes Cargo `.toml` files. Rust, Cargo, crate boundaries, dependencies,
and host support are implementation choices; they are not Neutral language
semantics. Record the exact Rust edition, minimum supported Rust version, and
supported hosts before completing Stage 1.

The implementation root is `neutral-lang/`. Existing design files remain in
place. The initial crate split follows public and trust boundaries:

```text
neutral-core
├── source identity, spans, diagnostics, limits, cancellation
neutral-ir
├── public logical IR, source map, provenance, derivation
neutral-vocabulary
├── closed data-only vocabulary schema and validation
neutral-compiler
├── capture API, private frontend, private semantics, IR lowering
neutral-reader
├── encoded-artifact validation and immutable public views
neutral-probe
├── independent consumer using only public reader contracts
neutral-cli
├── effectful host, filesystem adapter, compile/validate/inspect commands
neutral-test-support
├── fixtures, golden projections, alpha-equivalence and test builders
xtask
└── cross-platform developer, test, CI, evidence, and release automation
```

These are implementation packages, not new ecosystem layers. Do not expose
private lexer, parser, recovery, symbol, type-checking, or lowering models merely
to preserve this crate arrangement. Consolidation is allowed before Stage 1 is
closed if the public dependency boundaries remain testable.

## Rules for every stage

- [ ] Implement vertical slices: fixture → syntax → semantics → IR → reader →
      probe.
- [ ] Add positive, negative, boundary, and misleading-lookalike tests before
      closing a feature step.
- [ ] Assign every normative behavior and diagnostic a stable requirement or
      decision ID.
- [ ] Emit no authoritative IR after any encoding, syntax, semantic, limit, or
      cancellation failure.
- [ ] Keep `compile_captured` deterministic and free of filesystem, environment,
      locale, clock, process, command, and network access.
- [ ] Treat all source, vocabulary, and encoded IR bytes as untrusted.
- [ ] Enforce structural limits before proportional allocation or conversion.
- [ ] Keep logical equality independent of map order, thread schedule, pretty
      printing, serialized bytes, and `ElementId` spelling.
- [ ] Keep value reuse and defaults in provenance; do not create accidental
      logical value kinds for them.
- [ ] Never infer containment, ownership, dependency, readiness, or execution
      order from `Ref<T>`.
- [ ] Do not add excluded v0 syntax as a parser convenience, private IR field,
      vocabulary escape hatch, or probe convention.
- [ ] Do not use `unsafe` in v0. Any future exception requires a separate threat
      analysis and architecture decision.
- [ ] Do not use `panic!`, `unwrap`, `expect`, `todo!`, or `unimplemented!` on an
      untrusted-input path.
- [ ] Keep library errors typed and structured. Reserve rendered strings for UI
      boundaries.
- [ ] Use deterministic iteration or sort at the owning boundary; never depend
      on hash-map iteration order.
- [ ] Keep public APIs documented, immutable where practical, reentrant, and
      safe for independent concurrent calls.
- [ ] Run formatting, linting, unit, integration, conformance, documentation,
      and dependency-policy checks before closing a stage.

An item is complete only when its validation items pass. A stage is complete
only when every step and the stage validation are checked.

## Requirement coverage index

This index identifies the primary contract groups closed by each stage. It is a
navigation aid, not a substitute for the requirement → decision → fixture →
implementation → test traceability table required during development.

| Stage | Primary requirement and decision coverage |
| --- | --- |
| 1 | `SYN-GOV-001..004`, `NL-BND-001..005`, repository controls, visibility, effects, and dependency boundaries |
| 2 | `NL-V0-001..003`, `NL-CAP-001..006`, initial `NL-IR-*`, `NL-PRO-*`, `NL-API-*`, `NL-DIA-*`, and the minimal portions of `SYN-LEX-*`, `SYN-DOC-*`, and `SYN-DEC-*` |
| 3 | `NL-SRC-001..007`, `NL-DOC-001..005`, syntax portions of `NL-DEC-*`, `SYN-LEX-001..006`, `SYN-DOC-001..004`, `SYN-DIA-001..002`, and all explicit grammar exclusions |
| 4 | `NL-TYP-001..008`, `NL-VAL-001..005`, `SYN-TYP-001..007`, and `SYN-VAL-001..003` plus default/final-value portions of `SYN-VAL-005` |
| 5 | `NL-DEC-004..006`, `NL-VAL-006..008`, `NL-REF-001..005`, `NL-IR-004..005`, `SYN-DEC-005`, `SYN-VAL-004..005`, and `SYN-REF-001..004` |
| 6 | `NL-VOC-001..007` and `SYN-VOC-001..005` |
| 7 | `NL-IR-001..006`, external-reader portions of `NL-API-001..004`, and invalid-IR/resource portions of `NL-DIA-004` |
| 8 | Full `NL-V0-*`, `NL-PRO-*`, and `NL-API-*` proof; `SYN-TOL-001` and `SYN-EVO-001..002` |
| 9 | Robustness and evidence obligations in `NL-DIA-001..006`, `NL-API-004`, `SYN-DIA-*`, and `SYN-EVO-002` |
| 10 | Every v0 requirement, master-checklist item, architecture completion gate, explicit exclusion, and release artifact |

## Quality and testing standards alignment

Neutral v0 uses the following standards as an engineering alignment profile:

- [ISO/IEC/IEEE 29119-1:2022](https://www.iso.org/standard/81291.html) for
  common software-testing concepts and terminology;
- [ISO/IEC/IEEE 29119-2:2021](https://www.iso.org/standard/79428.html) for test
  governance, management, and dynamic test processes;
- [ISO/IEC/IEEE 29119-3:2021](https://www.iso.org/standard/79429.html) for
  project test documentation and test-result evidence;
- [ISO/IEC/IEEE 29119-4:2021](https://www.iso.org/standard/79430.html) for
  systematic test-design techniques;
- [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) for the product
  quality model;
- [ISO/IEC 25023:2016](https://www.iso.org/standard/35747.html) for selected
  quantitative product-quality measures;
- [ISO/IEC 25040:2024](https://www.iso.org/standard/83467.html) for planning,
  executing, and concluding quality evaluations;
- [ISO/IEC 20246:2017](https://www.iso.org/standard/67407.html) for static work
  product reviews; and
- [ISO/IEC 5055:2021](https://www.iso.org/standard/80623.html) for selected
  automated source-code quality measures.

The project must maintain an edition register because standards can be revised,
confirmed, or withdrawn. ISO currently lists ISO/IEC 25023:2016 as published and
to be revised, and ISO/IEC 5055:2021 at close of review; their status must be
checked before a release claim is approved.

This plan claims alignment intent only. It does not claim ISO conformity,
accreditation, or certification. Such a claim requires access to the complete
licensed standards, an approved applicability/tailoring statement, objective
evidence for every applicable requirement, qualified review, and any required
independent conformity assessment.

### Standards applicability record

- [ ] Create `quality/standards-register.md` with standard, edition, status,
      owner, applicability, tailoring decision, evidence location, and review
      date.
- [ ] Record every excluded or tailored clause with rationale and approving
      reviewer.
- [ ] Review the register at least before each release candidate and whenever an
      applicable standard changes status.
- [ ] Keep standards-derived process requirements distinct from Neutral language
      semantics.
- [ ] Do not copy restricted standards text into the repository; record
      project-specific procedures and evidence in original wording.
- [ ] Prohibit badges or release notes that imply ISO certification without
      documented authority.

## Product quality model

The project tailors the ISO/IEC 25010 product quality characteristics to a
compiler, IR reader, and CLI. Every release quality goal needs a measurable
acceptance criterion; names alone are not evidence.

| Quality characteristic | Neutral v0 interpretation | Primary evidence |
| --- | --- | --- |
| Functional suitability | Source acceptance/rejection and public IR exactly implement the v0 contracts | Requirement traceability, conformance fixtures, golden logical projections |
| Performance efficiency | Work, memory, output, and latency remain within named profiles | Complexity tests, benchmarks, peak-memory measurements, limit tests |
| Compatibility | Supported hosts and independently versioned language/IR/encoding contracts behave as documented | Host matrix, compatibility fixtures, old-artifact reader tests |
| Interaction capability | CLI and diagnostics are understandable, safe, consistent, and source-linked | CLI system tests, diagnostic review, accessibility/readability review |
| Reliability | Repeated/concurrent work is deterministic; failures never look successful | Determinism, cancellation, recovery, soak, and no-partial-output tests |
| Security | Untrusted source, bundles, and IR cannot gain authority, execute code, leak secrets, or cause unbounded work | Threat model, fuzzing, adversarial tests, dependency review, static analysis |
| Maintainability | Boundaries, code, tests, documentation, and decisions remain understandable and changeable | Reviews, linting, complexity measures, mutation testing, architecture checks |
| Flexibility | Public host contracts and independent versions permit bounded adaptation without changing language meaning | API tests, resolver substitution tests, encoding/reader separation tests |
| Safety | Invalid or indeterminate input fails closed and cannot produce authoritative partial output or external effects | Negative tests, fault injection, cancellation tests, effect-boundary audit |

### Quality measurement rules

- [ ] Define each measure with a name, purpose, unit, calculation, data source,
      collection tool/version, sampling policy, threshold, owner, and response to
      failure.
- [ ] Store thresholds in versioned `config/quality-gates.toml`, not only in CI
      UI configuration.
- [ ] Store fast/PR/nightly/release budgets in versioned
      `config/test-profiles.toml`.
- [ ] Establish baselines on controlled hardware before setting performance
      regression thresholds.
- [ ] Treat a metric as evidence for its stated quality question only; code
      coverage is not a substitute for correct assertions or conformance.
- [ ] Review metrics for gaming, blind spots, instability, and obsolete targets.
- [ ] Require rationale and review for threshold reductions; silently lowering a
      gate is forbidden.
- [ ] Preserve signed or checksummed release quality reports with toolchain,
      commit, host, configuration, and test-data identities.

## Test-driven development policy

All production behavior follows test-driven development. Documentation-only,
build-metadata, and mechanical refactors may use a documented exception when no
observable behavior changes, but they still run the complete affected gate.

### Red → green → refactor workflow

1. **Select behavior.** Choose one accepted requirement/decision and one small
   observable outcome. Record the requirement IDs, risk, affected boundary, and
   intended test level.
2. **Write the test first.** Add the smallest test and fixture that expresses the
   behavior through the lowest stable interface that owns it.
3. **Prove red.** Run the narrow test and confirm it fails for the intended
   missing behavior—not because of a broken harness, typo, or unrelated defect.
   Preserve the failing command and result in the change evidence.
4. **Implement minimally.** Add only enough production code to satisfy the test
   while respecting existing contracts and resource boundaries.
5. **Prove green.** Run the narrow test, then the affected unit, integration,
   conformance, and smoke suites.
6. **Refactor.** Improve names, duplication, boundaries, and complexity while
   keeping the tests green. Do not alter a golden result without explicit review.
7. **Complete the slice.** Add negative, boundary, misleading-lookalike,
   source-map, provenance, diagnostic, reader, and limit tests required by the
   vertical-slice rules.
8. **Run the gate.** Run the PR-equivalent local task before review.

### TDD enforcement

- [ ] Every behavior change identifies at least one governing `NL-*` or `SYN-*`
      ID and the first failing test.
- [ ] Every defect fix begins with a minimal regression test that fails on the
      defective revision and passes on the fix.
- [ ] New parser acceptance is prohibited until semantics, lowering, reader, and
      conformance obligations are identified.
- [ ] Tests assert public behavior or a private module invariant; they do not
      freeze incidental implementation layout.
- [ ] Tests remain deterministic, isolated, order-independent, and parallel-safe.
- [ ] Unit tests perform no network access, sleep-based synchronization, or
      dependence on wall clock, locale, current directory, or developer state.
- [ ] Randomized tests record seeds and minimize failures into stable regression
      cases.
- [ ] Golden changes use a separate explicit task and require semantic review.
- [ ] Deleting, weakening, ignoring, or quarantining a test requires a linked
      rationale, risk decision, owner, and expiration/reinstatement condition.
- [ ] A flaky test is a defect. CI retries may collect evidence but cannot turn a
      failed required test into a passing gate.
- [ ] Production code may not be merged with skipped `todo!` branches,
      test-only behavior switches, or unreachable error handling for required
      paths.
- [ ] Reviewers verify the test oracle, boundary cases, and red-phase evidence,
      not only that tests exist.

## Test architecture

Test levels have distinct purposes and should overlap only where a higher-level
contract needs independent evidence.

| Suite | Scope and isolation | Required cadence | Target budget |
| --- | --- | --- | --- |
| Smoke | A few critical happy/fail-closed paths through built public artifacts | Every local gate, commit, and PR | Seconds; hard PR gate |
| Unit | One pure function/module invariant with controlled collaborators | During every TDD cycle and every PR | Fast; hard PR gate |
| Integration | Two or more crates/public boundaries in one process | Every PR and supported-host CI | Minutes; hard PR gate |
| System | Built CLI as a black box with real process/filesystem boundaries in an isolated temporary root | Every PR on primary host; nightly on full host matrix | Minutes; hard primary-host gate |
| Conformance | Normative source/bundle/IR fixtures and traceability oracles | Every PR and release | Hard gate |
| Property/metamorphic | General invariants across generated inputs and transformations | Bounded PR run; extended nightly/release | Hard bounded gate |
| Security/adversarial | Malformed input, disclosure, resource, authority, and dependency cases | Every PR for deterministic cases; extended nightly | Hard gate for deterministic cases |
| Fuzz | Coverage-guided untrusted-boundary exploration | Smoke on PR; time-boxed nightly and release campaign | Crash/hang finding blocks release |
| Performance | Microbenchmarks, end-to-end latency, throughput, memory, growth, and regression | Smoke on PR; controlled nightly/release runner | Release threshold gate |
| Soak/stress | Repetition, concurrency, cancellation, and resource stability | Nightly and release candidate | Release threshold gate |
| Mutation | Test-oracle strength for critical pure/compiler modules | Scheduled and before release | Threshold/risk gate |

Target budgets are configured values, not semantic promises. If the suite grows
beyond a budget, split/shard it or revise the reviewed profile; do not silently
drop cases.

### Smoke suite

- [ ] Build all release-facing binaries and libraries from a clean target.
- [ ] Compile and inspect the minimal scalar fixture end to end.
- [ ] Compile one full core fixture with records, defaults, lists, reuse, and
      references.
- [ ] Compile and inspect the captured vocabulary fixture.
- [ ] Decode and inspect one valid external IR artifact.
- [ ] Reject one malformed source, one invalid vocabulary, and one malformed IR
      artifact with no authoritative output.
- [ ] Run formatter idempotence on one representative fixture.
- [ ] Verify `--help`, version output, stable exit classes, and no-argument CLI
      behavior.
- [ ] Keep the suite small enough to run before every local commit.

### Unit suite

- [ ] Co-locate unit tests with private modules under `#[cfg(test)]`.
- [ ] Test UTF-8/newline mapping, span arithmetic, safe rendering, checked limits,
      cancellation state, and identity constructors.
- [ ] Test tokenization, layout decisions, parser productions, recovery limits,
      exact-number normalization, symbol collection, type compatibility, graph
      algorithms, lowering, alpha-equivalence, and validators independently.
- [ ] Use table-driven tests for equivalence partitions and decision tables.
- [ ] Use exact boundary tests for every minimum, maximum, at-limit, and
      one-over-limit case.
- [ ] Prefer small in-memory builders; do not mock private implementation details
      merely to achieve isolation.
- [ ] Assert typed outputs, codes, safe parameters, and spans—not unstable
      rendered messages unless rendering itself is under test.

### Integration suite

- [ ] Test resolver → capture while keeping semantic compilation I/O-free.
- [ ] Test captured source → compiler → logical IR → in-process reader.
- [ ] Test logical IR → encoding → decoder/validator → reader.
- [ ] Test captured vocabulary contract across capture, compiler, IR, decoder,
      and reader boundaries.
- [ ] Test reader → probe without any compiler dependency.
- [ ] Test source map/provenance/derivation consistency across crate boundaries.
- [ ] Test cancellation and limits at every component handoff.
- [ ] Test independent concurrent compilations with shuffled insertion and
      scheduling conditions.
- [ ] Use only in-memory or isolated temporary adapters; integration tests must
      not require public networks or ambient developer services.

### System suite

- [ ] Build release-mode CLI artifacts once per system-test job.
- [ ] Invoke binaries as child processes, never by calling CLI internals.
- [ ] Create a unique temporary root per test with controlled permissions,
      environment, locale, clock inputs, and working directory.
- [ ] Test compile, validate, inspect, and format commands through files and
      standard streams.
- [ ] Test Unicode paths, spaces, long paths, read-only input, missing input,
      unwritable output, existing output, broken pipes, cancellation, and
      interrupted atomic writes.
- [ ] Verify stdout/stderr separation, stable exit classes, safe diagnostics,
      and absence of partial authoritative output.
- [ ] Run on every supported OS/filesystem combination declared by the host
      matrix.
- [ ] Deny external network access during system tests unless a separately
      authorized resolver-adapter test uses a local ephemeral service.

### Performance suite

- [ ] Maintain small, representative, boundary, and adversarial benchmark corpora
      with immutable identities.
- [ ] Measure cold/warm compile latency, throughput, peak resident memory,
      allocation count/bytes where supported, artifact size, decode latency, and
      reader/probe traversal.
- [ ] Benchmark each compiler phase and the end-to-end public path.
- [ ] Measure growth against source bytes, tokens, nesting, declarations, fields,
      list items, references, numeric digits/scale, diagnostics, and IR elements.
- [ ] Include concurrent independent compilation and cancellation responsiveness.
- [ ] Use a dedicated controlled runner with pinned toolchain, CPU governor,
      power profile, background-load policy, and benchmark configuration.
- [ ] Warm up, sample repeatedly, record dispersion/confidence, and compare to a
      reviewed baseline instead of one timing.
- [ ] Separate informational PR measurements from release-blocking controlled
      measurements.
- [ ] Block unexplained regression beyond versioned absolute and relative
      thresholds.
- [ ] Require conformance tests after every performance optimization.

### Test design techniques

- [ ] Use equivalence partitioning for token, type, value, and result classes.
- [ ] Use boundary value analysis for bytes, spans, counts, nesting, scale, and
      every structural limit.
- [ ] Use decision tables for field presence/nullability/default combinations,
      type compatibility, diagnostics, and reader validity rules.
- [ ] Use state-transition testing for cancellation, recovery, CLI writes, and
      any lifecycle state introduced by tooling.
- [ ] Use syntax/grammar-based testing for accepted forms, explicit exclusions,
      malformed lookalikes, and decoder structures.
- [ ] Use pairwise or higher-strength combinatorial testing where host, line
      ending, input form, limits, and feature combinations are too numerous for
      exhaustive tests.
- [ ] Use property/metamorphic testing for normalization, formatting,
      alpha-equivalence, determinism, encode/decode, and ordering invariants.
- [ ] Use fault injection for resolver failures, allocation/limit boundaries,
      cancellation points, short writes, broken pipes, and truncated artifacts.
- [ ] Use static review for specifications, grammar, unsafe assumptions, public
      APIs, threat boundaries, tests, and generated/golden changes.
- [ ] Record the selected technique and risk rationale in each nontrivial test
      specification.

## Test evidence and acceptance policy

### Required test metadata

Every normative or risk-significant test records:

- [ ] Stable test-case ID and title.
- [ ] Governing requirement/decision IDs.
- [ ] Test level and design technique.
- [ ] Product/project risk addressed and priority.
- [ ] Preconditions, fixture identities, configuration, and structural limits.
- [ ] Action/input and an independently reviewable oracle.
- [ ] Expected typed result, diagnostic, source span, resource result, and side
      effects or explicit absence of effects.
- [ ] Timeout/budget and cleanup behavior.
- [ ] Automation status, owner, and review state.
- [ ] First implementation version and latest regression result.

### Coverage and test-strength gates

- [ ] Maintain 100% requirement coverage: every accepted `NL-*` and `SYN-*` ID
      maps to executable evidence.
- [ ] Maintain 100% diagnostic-code coverage for success/failure ownership,
      parameter schema, ordering, rendering safety, and span behavior.
- [ ] Maintain 100% explicit-exclusion coverage with at least one rejection
      fixture per excluded form.
- [ ] Set measured line, function, and region/branch coverage thresholds in
      `quality-gates.toml` after the first vertical slice; never use coverage as
      the sole release criterion.
- [ ] Require changed production lines to be exercised unless a reviewed
      exception explains why execution is impossible or meaningless.
- [ ] Set a mutation-score target for critical pure modules after calibrating the
      selected Rust mutation tool; surviving non-equivalent mutants require a
      test, a justified exception, or a release risk.
- [ ] Ratchet stable coverage and mutation thresholds upward; reductions require
      an approved quality decision.
- [ ] Track flaky, ignored, quarantined, and nondeterministic tests as release
      risks with owner and deadline.

### Test result and completion evidence

- [ ] Produce machine-readable JUnit-compatible results for every dynamic suite.
- [ ] Produce coverage, mutation, fuzz, benchmark, dependency, static-analysis,
      and documentation reports with tool versions.
- [ ] Record commit, source tree cleanliness, lockfile digest, toolchain, target,
      host image, profile, random seed, fixture digest, start/end time, and exit
      status for every CI test run.
- [ ] Retain PR evidence long enough to diagnose regressions and retain release
      evidence for the supported release lifetime.
- [ ] Summarize planned/executed/passed/failed/skipped tests, unresolved defects,
      deviations, quality measures, residual risks, and release recommendation in
      a release test-completion report.
- [ ] Treat missing, corrupt, expired, or internally inconsistent evidence as a
      failed gate.
- [ ] Never include credentials, host secrets, or unsafe source excerpts in test
      artifacts.

---

## Stage 1: initialize the repository

### Step 1: configure directories and workspace metadata

- [ ] Create `neutral-lang/Cargo.toml` as a virtual Cargo workspace manifest.
- [ ] Set the Rust edition and `rust-version` consistently through workspace
      package metadata.
- [ ] Add workspace-wide release, test, and development profiles deliberately;
      do not optimize tests in ways that hide overflow or debug assertions.
- [ ] Add workspace lint policy for forbidden unsafe code, denied warnings in
      CI, missing public documentation, and high-risk Clippy findings.
- [ ] Create `neutral-lang/rust-toolchain.toml` and pin a supported stable
      toolchain plus `rustfmt` and `clippy` components.
- [ ] Create `neutral-lang/rustfmt.toml` with project formatting policy.
- [ ] Create `neutral-lang/deny.toml` for license, advisory, duplicate-version,
      and source policy.
- [ ] Create `neutral-lang/.cargo/config.toml` only for target-neutral Cargo
      settings; do not encode a developer's paths, linker, credentials, or host
      environment.
- [ ] Create `neutral-lang/xtask/` as a non-published workspace automation
      package and configure `cargo xtask` as the single cross-platform task
      interface.
- [ ] Create `neutral-lang/config/`, `neutral-lang/quality/`,
      `neutral-lang/scripts/`, and `neutral-lang/.devcontainer/`.
- [ ] Create `neutral-lang/.env.example` containing test-harness variables and
      safe defaults only; no variable may alter Neutral source semantics.
- [ ] Create `neutral-lang/crates/`, `neutral-lang/tests/`,
      `neutral-lang/conformance/`, and `neutral-lang/fuzz/`.
- [ ] Create one directory under `crates/` for each initial crate named in the
      implementation assumption.
- [ ] Create repository-root workflows for PR, nightly, and release testing; if
      `neutral-lang` becomes a standalone repository, move them to that
      repository root without changing their gates.
- [ ] Record the minimum supported Rust version, supported host matrix, and
      dependency policy in `neutral-lang/CONTRIBUTING.md`.

#### Step validation

- [ ] `cargo metadata --manifest-path neutral-lang/Cargo.toml --no-deps`
      succeeds.
- [ ] Every workspace member is listed exactly once and has a unique package
      name.
- [ ] No manifest contains an absolute path or dependency outside the intended
      workspace.
- [ ] `rustup show active-toolchain` reports the pinned toolchain when run from
      `neutral-lang/`.
- [ ] The configured host matrix includes at least one CI host and states
      whether other hosts are supported, tested, or unsupported.
- [ ] Dependency and license checks have an executable command documented in
      `CONTRIBUTING.md`.

### Step 2: create the initial file structure

Create the following structure. Existing v0 design and fixture files are not
duplicated or moved.

```text
neutral-lang/
├── Cargo.toml
├── Cargo.lock
├── rust-toolchain.toml
├── rustfmt.toml
├── deny.toml
├── CONTRIBUTING.md
├── .env.example
├── .cargo/
│   └── config.toml
├── .devcontainer/
│   ├── devcontainer.json
│   └── Dockerfile
├── config/
│   ├── quality-gates.toml
│   └── test-profiles.toml
├── quality/
│   ├── README.md
│   ├── quality-model.md
│   ├── standards-register.md
│   ├── test-policy.md
│   ├── test-plan.md
│   ├── test-case-template.md
│   ├── test-completion-template.md
│   ├── risk-register.md
│   └── traceability.md
├── scripts/
│   ├── bootstrap.sh
│   └── bootstrap.ps1
├── xtask/
│   ├── Cargo.toml
│   └── src/
│       ├── main.rs
│       ├── command.rs
│       ├── environment.rs
│       ├── evidence.rs
│       ├── quality.rs
│       └── test.rs
├── crates/
│   ├── neutral-core/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── cancellation.rs
│   │       ├── diagnostic.rs
│   │       ├── identity.rs
│   │       ├── limits.rs
│   │       └── span.rs
│   ├── neutral-ir/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── declaration.rs
│   │       ├── derivation.rs
│   │       ├── equality.rs
│   │       ├── identity.rs
│   │       ├── provenance.rs
│   │       ├── source_map.rs
│   │       ├── types.rs
│   │       └── value.rs
│   ├── neutral-vocabulary/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── model.rs
│   │       ├── schema.rs
│   │       └── validate.rs
│   ├── neutral-compiler/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── api.rs
│   │       ├── capture.rs
│   │       ├── compile.rs
│   │       ├── frontend/
│   │       │   ├── mod.rs
│   │       │   ├── lexer.rs
│   │       │   ├── layout.rs
│   │       │   ├── parser.rs
│   │       │   ├── syntax.rs
│   │       │   └── token.rs
│   │       ├── semantic/
│   │       │   ├── mod.rs
│   │       │   ├── collect.rs
│   │       │   ├── graph.rs
│   │       │   ├── model.rs
│   │       │   ├── resolve.rs
│   │       │   ├── types.rs
│   │       │   └── validate.rs
│   │       └── lower/
│   │           ├── mod.rs
│   │           ├── ir.rs
│   │           ├── provenance.rs
│   │           └── source_map.rs
│   ├── neutral-reader/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── decode.rs
│   │       ├── encoding.rs
│   │       ├── validate.rs
│   │       └── view.rs
│   ├── neutral-probe/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       └── report.rs
│   ├── neutral-cli/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── main.rs
│   │       ├── commands.rs
│   │       └── host.rs
│   └── neutral-test-support/
│       ├── Cargo.toml
│       ├── src/
│       │   ├── lib.rs
│       │   ├── assertions.rs
│       │   ├── fixtures.rs
│       │   └── golden.rs
│       ├── tests/
│       │   ├── smoke.rs
│       │   ├── integration.rs
│       │   ├── system.rs
│       │   ├── conformance.rs
│       │   ├── determinism.rs
│       │   └── security.rs
│       └── benches/
│           ├── compile.rs
│           └── decode.rs
├── tests/
│   ├── api/
│   ├── conformance/
│   ├── determinism/
│   ├── performance/
│   ├── security/
│   └── system/
├── conformance/
│   ├── diagnostics/
│   ├── ir/
│   ├── source-map/
│   └── vocabulary/
├── fuzz/
│   ├── Cargo.toml
│   └── fuzz_targets/
│       ├── source.rs
│       ├── vocabulary.rs
│       ├── encoded_ir.rs
│       └── formatter.rs
└── test-results/                 # generated and ignored
```

- [ ] Create all non-generated directories in the target tree;
      `test-results/` is created only by automation.
- [ ] Create all placeholder Rust source files in the target tree.
- [ ] Keep placeholder Rust source files empty until Step 3.
- [ ] Create valid crate manifests with names, versions, edition, publication
      policy, and workspace lints inherited from the root.
- [ ] Commit `Cargo.lock` because the workspace ships binaries and reproducible
      conformance tooling.
- [ ] Do not add runtime dependencies until the responsible API and threat
      boundary are known.

#### Step validation

- [ ] Every listed path exists with the exact spelling and casing.
- [ ] Every placeholder `.rs` file is zero bytes before Step 3 begins.
- [ ] Every crate manifest parses with `cargo metadata`.
- [ ] No unplanned crate, generated file, checked-in build output, IDE state, or
      local secret appears in the tree.
- [ ] `target/`, coverage output, fuzz artifacts, editor state, and local
      environment files are ignored without ignoring fixtures or lock files.

### Step 3: add responsibility comments and visibility boundaries

- [ ] Add a two-line `//!` crate responsibility header to each `lib.rs`.
- [ ] Add a two-line `//!` binary responsibility header to `neutral-cli/main.rs`.
- [ ] Add a two-line `//!` module responsibility header to every other `.rs`
      file.
- [ ] State what each module owns on the first line.
- [ ] State what each module must not own or perform on the second line.
- [ ] Mark compiler frontend, recovery tree, semantic model, and lowering modules
      `pub(crate)` or private.
- [ ] Expose only documented compiler entry points, validated IR/reader views,
      diagnostic data, and required host contracts.
- [ ] Keep filesystem access in `neutral-cli::host` and resolver adapters; do not
      import filesystem or network APIs into semantic compilation modules.
- [ ] Keep `neutral-probe` independent of `neutral-compiler`, including in dev
      dependencies.

#### Step validation

- [ ] Every `.rs` file starts with exactly two meaningful responsibility lines
      before declarations.
- [ ] Responsibility comments identify both ownership and prohibited behavior.
- [ ] `cargo tree -p neutral-probe` contains neither `neutral-compiler` nor a
      private compiler crate.
- [ ] `cargo tree -p neutral-reader` contains no CLI, resolver, filesystem, or
      network dependency.
- [ ] Private compiler model types cannot be imported by a workspace integration
      test outside `neutral-compiler`.

### Step 4: establish dependency direction and minimal compilable shells

- [ ] Define the allowed crate dependency graph in `CONTRIBUTING.md`.
- [ ] Permit `neutral-core` to depend only on deliberately reviewed utility
      crates.
- [ ] Permit `neutral-ir` to depend on `neutral-core` but not on compiler or CLI
      crates.
- [ ] Permit `neutral-vocabulary` to depend on core/public model crates only.
- [ ] Permit `neutral-compiler` to depend on core, IR, and vocabulary crates.
- [ ] Permit `neutral-reader` to depend on core, IR, vocabulary, and the selected
      encoding implementation only.
- [ ] Permit `neutral-probe` to depend on core and reader-facing contracts only.
- [ ] Permit `neutral-cli` to compose compiler, reader, and probe APIs as the
      effectful host boundary.
- [ ] Restrict `neutral-test-support` to development/test use.
- [ ] Keep `xtask` non-published and outside production dependency graphs; it
      may orchestrate tools and test-support APIs but must not become required at
      runtime by compiler, reader, probe, or CLI artifacts.
- [ ] Add minimal library shells and a `fn main() -> ExitCode` CLI shell so the
      entire workspace compiles without placeholder panics.
- [ ] Add one dependency-direction test or metadata script that rejects forbidden
      crate edges.

#### Step validation

- [ ] `cargo check --workspace --all-targets --all-features` succeeds.
- [ ] `cargo tree --workspace` matches the documented dependency direction.
- [ ] There is no dependency cycle.
- [ ] No library initializes logging, reads process state, or installs global
      mutable state during loading.
- [ ] The CLI starts and returns a stable nonzero usage exit code when invoked
      without a command.

### Step 5: configure engineering gates

- [ ] Add CI jobs for formatting, linting, tests, documentation, dependency
      policy, and the repository coherence check.
- [ ] Make CI run only reproducible commands documented in `CONTRIBUTING.md`.
- [ ] Deny compiler warnings in CI.
- [ ] Require rustdoc for every public item.
- [ ] Add a Markdown link checker and decision-ID/requirement-ID uniqueness
      checker.
- [ ] Add fixture discovery tests so every `.neu` fixture has an expected
      outcome record.
- [ ] Add a check that generated/golden updates require an explicit command and
      never happen during normal tests.
- [ ] Add a dependency review policy: minimal features, default features disabled
      when unnecessary, no unreviewed build scripts, and no runtime code loading.
- [ ] Add `cargo fmt`, `cargo clippy`, `cargo test`, and `cargo doc` commands to
      the contributor guide.

#### Step validation

- [ ] `cargo fmt --all -- --check` succeeds.
- [ ] `cargo clippy --workspace --all-targets --all-features -- -D warnings`
      succeeds.
- [ ] `cargo test --workspace --all-features` succeeds.
- [ ] `RUSTDOCFLAGS="-D warnings" cargo doc --workspace --all-features --no-deps`
      succeeds.
- [ ] The dependency policy command succeeds.
- [ ] Deliberately adding a duplicate requirement ID makes the coherence check
      fail.
- [ ] Deliberately adding a forbidden probe-to-compiler dependency makes CI fail.

### Step 6: create the reproducible development and test environment

- [ ] Define one environment contract for local development, CI, containers,
      benchmarks, and releases.
- [ ] Pin the Rust toolchain, Cargo lockfile, container base by immutable digest,
      system packages, and versions of test/quality tools.
- [ ] Make `scripts/bootstrap.sh` and `scripts/bootstrap.ps1` thin entry points
      that validate prerequisites and invoke `cargo xtask bootstrap`; keep task
      logic in Rust rather than duplicating it across shells.
- [ ] Require explicit approval before bootstrap downloads or installs tools;
      verify downloaded artifacts with a trusted checksum/signature where the
      supplier provides one.
- [ ] Configure the development container to run as a non-root user with the
      repository mounted read/write and credentials, host sockets, and networks
      absent by default.
- [ ] Define environment variables in `.env.example` for test profile, result
      directory, random seed, benchmark baseline, and optional verbosity only.
- [ ] Prefix project variables with `NEUTRAL_`; never repurpose standard process
      variables such as `HOME`.
- [ ] Prohibit environment variables from changing lexing, parsing, semantics,
      logical IR, diagnostic ordering, or reader validity.
- [ ] Make test roots, Cargo target directories, caches, and result directories
      explicit and unique per concurrent job.
- [ ] Use isolated temporary directories with automatic cleanup for tests; retain
      a failed test root only through an explicit diagnostic option.
- [ ] Pin locale/timezone for CLI rendering tests while separately testing that
      semantic APIs are independent of both.
- [ ] Default tests to no external network and no ambient filesystem discovery.
- [ ] Document supported, tested, experimental, and unsupported host/toolchain
      combinations.
- [ ] Generate a machine-readable environment manifest for every CI/release run.

#### Step validation

- [ ] A fresh supported host can bootstrap and run smoke tests using only the
      documented commands.
- [ ] The development container builds from its pinned definition and passes the
      same smoke suite as the host environment.
- [ ] `cargo xtask environment verify` detects missing, wrong, or unpinned tools.
- [ ] `cargo xtask environment manifest` records tool, target, OS/container, and
      configuration identities without secrets.
- [ ] Two concurrent test jobs use distinct temporary, target, cache, and result
      paths.
- [ ] Semantic and logical outputs are equal under varied locale, timezone,
      working directory, and irrelevant environment variables.
- [ ] A network-denial test proves the compiler, reader, probe, unit tests, and
      integration tests do not require external connectivity.
- [ ] Repository cleanliness is unchanged after a successful local CI run except
      for ignored test results and build artifacts.

### Step 7: implement one automated task interface

Implement these commands in `xtask`; exact underlying tools may change only
through reviewed configuration while command meaning remains stable.

- [ ] `cargo xtask bootstrap` — validate/install approved development tools.
- [ ] `cargo xtask environment verify|manifest` — validate and record the
      execution environment.
- [ ] `cargo xtask format` — check formatting by default; require an explicit
      `--write` to modify files.
- [ ] `cargo xtask lint` — run Rust, dependency, documentation, Markdown, link,
      ID, architecture, and repository-coherence checks.
- [ ] `cargo xtask build --profile <dev|test|release>` — build selected artifacts
      with recorded configuration.
- [ ] `cargo xtask test smoke|unit|integration|system|conformance|property|security|all`
      — run exactly one named suite or the complete deterministic set.
- [ ] `cargo xtask test performance --profile <pr|nightly|release>` — run the
      configured performance campaign.
- [ ] `cargo xtask fuzz smoke|campaign` — run bounded or extended fuzzing.
- [ ] `cargo xtask coverage` — collect and enforce configured coverage measures.
- [ ] `cargo xtask mutate` — run mutation analysis for selected critical crates.
- [ ] `cargo xtask golden check|update` — verify goldens or update them only with
      an explicit reviewed command.
- [ ] `cargo xtask quality report` — assemble traceability, test, coverage,
      mutation, fuzz, benchmark, static-analysis, and deviation evidence.
- [ ] `cargo xtask ci pr|nightly|release` — reproduce the corresponding CI gate
      locally.
- [ ] `cargo xtask clean-results` — remove only the resolved generated result
      directory, never source or fixture trees.
- [ ] Make every task fail fast on invalid arguments, but preserve all available
      evidence for tests already executed.
- [ ] Make every task propagate the first meaningful nonzero status and produce
      a final machine-readable task summary.
- [ ] Do not hide failed tests with automatic retry, filtering, or fallback.
- [ ] Print the exact underlying commands and relevant nonsecret configuration
      in verbose mode.

#### Step validation

- [ ] Every documented task has `--help`, stable argument validation, and at
      least one automation unit test.
- [ ] Local and CI workflows invoke the same `cargo xtask` commands.
- [ ] A deliberately failing subcommand makes the aggregate task and CI job fail.
- [ ] An empty/misconfigured test selection fails instead of reporting zero tests
      as success.
- [ ] Result files are written beneath one resolved `test-results/<run-id>/`
      directory and cannot escape it through path traversal.
- [ ] Interrupted tasks leave a marked incomplete report rather than a passing
      summary.
- [ ] `golden check` never writes and `golden update` prints every changed case.
- [ ] `clean-results` rejects unresolved, root, parent, symlink-escaped, or
      non-result targets.

### Step 8: establish test governance and the initial suite skeleton

- [ ] Write `quality/test-policy.md` with scope, independence, TDD, test levels,
      defect handling, deviations, evidence retention, and release authority.
- [ ] Write `quality/test-plan.md` with test items, risks, levels, techniques,
      environment, entry/exit criteria, schedule/cadence, roles, and deliverables.
- [ ] Write the tailored product quality model and measurable objectives in
      `quality/quality-model.md`.
- [ ] Create the standards applicability register and quality/test risk register.
- [ ] Create concise test-case and test-completion-report templates without
      copying standards text.
- [ ] Define stable IDs for test cases, test runs, defects, risks, deviations,
      environments, fixtures, benchmarks, and reports.
- [ ] Define severity, priority, likelihood, impact, and release-blocking rules.
- [ ] Define entry and exit criteria for smoke, unit, integration, system,
      conformance, property, security, fuzz, performance, soak, and mutation
      suites.
- [ ] Add executable suite skeletons that fail with a clear "not implemented"
      status until each required initial test exists; zero-test success is
      forbidden.
- [ ] Add the first automation unit tests for task parsing, environment
      validation, suite discovery, result aggregation, and safe cleanup.
- [ ] Configure PR, nightly, and release workflows with least-privilege tokens,
      concurrency cancellation, timeouts, artifact retention, and no execution
      of untrusted code with write-capable secrets.
- [ ] Make release quality approval distinct from the developer who authored the
      behavior when project staffing permits; otherwise require an explicit
      documented self-review exception.

#### Step validation

- [ ] Test policy and plan are reviewed and all tailoring/deviations have owners.
- [ ] Every suite has a unique discovery rule, command, result schema, timeout,
      and entry/exit criterion.
- [ ] Every test result can be traced to its commit, environment, profile, and
      fixture identities.
- [ ] The PR workflow runs static gates, smoke, unit, integration, system on the
      primary host, conformance, bounded property/security/fuzz checks, and an
      informational performance smoke.
- [ ] The nightly workflow runs the full host matrix, extended property/fuzz,
      performance, soak/stress, mutation, dependency, and quality-report jobs.
- [ ] The release workflow reruns all release gates from a clean signed/tagged
      candidate and publishes immutable evidence only after success.
- [ ] CI permissions and secret exposure are reviewed for pull requests,
      protected branches, scheduled runs, and release events.

### Stage 1 validation

- [ ] The clean workspace builds, lints, tests, and documents successfully.
- [ ] All crate and module responsibility comments are present and accurate.
- [ ] Public/private and effect/pure dependency boundaries are enforced.
- [ ] Toolchain, host, dependency, security, and contribution policies are
      recorded.
- [ ] Host and container environments are pinned, reproducible, isolated, and
      described by machine-readable manifests.
- [ ] The task interface runs the same gates locally and in CI.
- [ ] TDD, ISO alignment, quality model, test plan, risk, traceability, evidence,
      deviation, and retention policies are approved.
- [ ] Every required test level has an executable nonempty skeleton and a
      documented entry/exit gate.
- [ ] No Neutral syntax or semantics have been invented during scaffolding.
- [ ] A fresh clone can run every Stage 1 command using only documented setup.

---

## Stage 2: implement the minimal atomic core

The only accepted source in the first vertical slice is:

```neu
neu "0.1"
module minimal

num answer = 42
```

The goal is a complete path, not a general parser: captured bytes → private
frontend → private semantic model → validated in-memory IR → public reader →
generic probe.

### Step 1: freeze the minimal contract and fixtures

- [ ] Add the minimal positive fixture to `v0/fixtures/positive/`.
- [ ] Add malformed UTF-8, bad/missing header, bad module name, malformed number,
      missing `=`, missing value, extra declaration, and unexpected-token
      negative fixtures for the slice.
- [ ] Assign one stable expected diagnostic code and original-byte span to every
      negative fixture.
- [ ] Write the expected logical IR projection, source map, provenance, and
      derivation record for the positive fixture.
- [ ] State which incidental values golden tests ignore: `ElementId` spelling,
      map order, rendering, and encoded bytes.
- [ ] Map every fixture to applicable `NL-*` and `SYN-*` identifiers.

#### Step validation

- [ ] Fixture discovery finds every new case exactly once.
- [ ] Each positive fixture has an expected IR, source-map, provenance, and
      derivation record.
- [ ] Each negative fixture has an expected failure layer, code, span, and safe
      parameters.
- [ ] No fixture requires records, lists, reuse, references, vocabulary, or an
      external encoding.

### Step 2: implement foundational public value types

- [ ] Implement immutable logical source identity and source content identity as
      distinct types.
- [ ] Implement checked half-open `ByteSpan` values over original captured bytes.
- [ ] Implement line/column derivation without replacing byte offsets.
- [ ] Implement stable diagnostic code, layer, severity, safe parameters,
      primary span, related location, remedy, and truncation types.
- [ ] Implement deterministic diagnostic ordering.
- [ ] Implement a versioned structural limits profile with explicit source,
      token, nesting, declaration, value, IR, traversal, and diagnostic limits.
- [ ] Implement cancellation as an operational result distinct from a language
      diagnostic.
- [ ] Validate constructors so impossible spans, unknown versions, and invalid
      limit values cannot enter public validated types.

#### Step validation

- [ ] Span tests cover empty, boundary, multibyte UTF-8, CRLF, lone CR, and EOF
      positions.
- [ ] Diagnostic ordering is stable under shuffled insertion order.
- [ ] Diagnostic rendering escapes control characters and does not reveal host
      paths or credentials.
- [ ] Limit arithmetic uses checked operations and fails before overflow or
      proportional allocation.
- [ ] Public foundational types are documented and contain no parser-specific
      concepts.

### Step 3: implement capture and pure compilation entry points

- [ ] Define `CompilationRequest`, host-supplied resolver, compiler options,
      diagnostic disclosure policy, and limits.
- [ ] Define immutable `CapturedCompilation` containing exact source bytes,
      logical/content identities, behavior versions, and all meaning-affecting
      options.
- [ ] Implement `capture(request)` as the only acquisition boundary.
- [ ] Implement `compile_captured(captured)` as an I/O-free function.
- [ ] Implement convenience `compile(request)` strictly as capture followed by
      `compile_captured`.
- [ ] Define `CompilationResult` so authoritative IR can exist only on complete
      success.
- [ ] Separate source acquisition failures, cancellation, diagnostics, and
      internal defects.

#### Step validation

- [ ] A test resolver can capture source entirely in memory.
- [ ] Missing source fails closed and never triggers a fallback resolver.
- [ ] The same `CapturedCompilation` can be compiled repeatedly without mutation.
- [ ] A compile-time test or dependency audit prevents filesystem/network APIs
      from entering the pure compilation module.
- [ ] Any diagnostic-producing compilation returns no authoritative IR.

### Step 4: implement UTF-8 capture and the minimal raw lexer

- [ ] Retain exact source bytes and content digest.
- [ ] Accept one UTF-8 BOM only at byte offset zero and exclude it from tokens.
- [ ] Reject malformed UTF-8, a noninitial BOM, and unescaped NUL as fatal input
      errors.
- [ ] Normalize CRLF and lone CR logically while retaining original-byte spans.
- [ ] Lex `neu`, `module`, `num`, snake-case identifiers, the exact version
      string, numeric literals, `=`, physical newlines, whitespace, and EOF.
- [ ] Retain trivia/newline information needed by layout and diagnostics.
- [ ] Stop safely at configured byte/token/numeric-digit limits.

#### Step validation

- [ ] Lexer golden tests compare token kind and original-byte span.
- [ ] UTF-8 and newline tests pass for LF, CRLF, lone CR, BOM, multibyte text in
      strings, malformed sequences, and NUL.
- [ ] No token contains a borrowed slice whose lifetime can outlive captured
      bytes incorrectly.
- [ ] Fuzz smoke tests produce no panic, excessive allocation, or invalid span.

### Step 5: implement minimal layout normalization

- [ ] Consume physical newlines and emit semantic `LINE_END` after each complete
      header or binding.
- [ ] Ignore blank lines and horizontal whitespace semantically.
- [ ] Insert final `LINE_END` at EOF when needed.
- [ ] Preserve enough origin information to diagnose a synthesized line end.
- [ ] Keep layout as a separate private pass between lexer and parser.

#### Step validation

- [ ] Equivalent LF, CRLF, lone-CR, trailing-newline, and no-trailing-newline
      sources produce equivalent semantic token streams.
- [ ] Blank-line count does not change logical output.
- [ ] Missing/incomplete tokens do not cause an incorrect declaration boundary.
- [ ] Layout output is deterministic and bounded.

### Step 6: implement the minimal private parser

- [ ] Parse exact `neu "0.1"` followed by exactly one `module snake_case`.
- [ ] Parse one explicit `num name = numeric_literal` binding.
- [ ] Require declaration termination through `LINE_END`; reject semicolons.
- [ ] Represent parser nodes, tokens, and recovery state as private types.
- [ ] Implement narrow recovery at the next declaration boundary.
- [ ] Mark recovered syntax as non-authoritative.
- [ ] Reject all tokens and constructs outside the minimal fixture for this
      stage with stable diagnostics.

#### Step validation

- [ ] The minimal fixture parses to the expected private tree.
- [ ] Every malformed minimal fixture produces the assigned code and span.
- [ ] A recovered tree cannot be passed to semantic lowering as valid input.
- [ ] Parser tests prove no public crate can name the syntax tree type.
- [ ] Parsing respects configured nesting, token, and diagnostic limits.

### Step 7: implement the minimal semantic model

- [ ] Validate exact language behavior version `0.1`.
- [ ] Validate one module and one module scope.
- [ ] Validate snake-case module and binding names.
- [ ] Protect all reserved core names from redeclaration.
- [ ] Resolve the explicit `num` type without host integer/float subtyping.
- [ ] Normalize the numeric spelling into an exact base-10 rational model.
- [ ] Create module-symbol identity independently from declaration position.
- [ ] Create a separate declaration fingerprint from kind, type, and logical
      definition.
- [ ] Keep the semantic model private and immutable after successful validation.

#### Step validation

- [ ] Numerically equal accepted spellings normalize to equal logical values.
- [ ] Numeric conversion uses no floating-point type.
- [ ] Renaming or moving the declaration to another module changes symbol
      identity; formatting does not.
- [ ] Any semantic failure blocks lowering.
- [ ] Semantic results are independent of hash insertion order.

### Step 8: lower minimal semantics to logical IR and companion records

- [ ] Implement distinct graph-local `ElementId`, module-symbol identity,
      declaration fingerprint, derivation identity, and content identity types.
- [ ] Lower module, binding declaration, resolved `num` type, and exact value.
- [ ] Map every emitted IR element to an original-byte source span.
- [ ] Record explicit-source and numeric-normalization provenance.
- [ ] Record meaning, acceptance/resource, and diagnostic/output derivation
      inputs in separate partitions.
- [ ] Build authoritative IR only from a fully valid semantic model.
- [ ] Keep logical payload separate from artifact envelope and encoding.

#### Step validation

- [ ] The positive fixture matches its expected logical projection modulo
      `ElementId` renaming.
- [ ] Source-map spans point to the exact original bytes.
- [ ] Provenance explains explicit value origin and numeric normalization.
- [ ] Changing a diagnostic rendering policy does not change logical IR.
- [ ] There is no serialization dependency in the logical IR crate.

### Step 9: expose the minimal immutable reader and probe

- [ ] Expose validated immutable views for module metadata, declarations, types,
      values, source map, provenance, and derivation.
- [ ] Ensure lookup/traversal is bounded by the supplied reader limits.
- [ ] Implement the probe against public reader contracts only.
- [ ] Enumerate the minimal module and scalar declaration.
- [ ] Attach one consumer-owned probe diagnostic to an IR element and map it to
      the original source span.
- [ ] Implement deterministic, safe probe output intended for tests, not as a
      canonical serialization.
- [ ] Add a CLI `compile`/`inspect` smoke path using a filesystem resolver only
      at the CLI host boundary.

#### Step validation

- [ ] The probe output contains the expected declaration, resolved type, exact
      value, and safe provenance category.
- [ ] The probe has no source parser and no compiler dependency.
- [ ] The probe diagnostic resolves to the expected original-byte span.
- [ ] Two independent reads return equal observations without mutating the
      document.
- [ ] The minimal CLI path succeeds and malformed input exits nonzero without
      writing authoritative output.

### Stage 2 validation

- [ ] The minimal fixture passes through `compile_captured`, IR, reader, and
      probe end to end.
- [ ] Every malformed minimal fixture fails with its expected bounded,
      source-linked diagnostic and no authoritative IR.
- [ ] Repeated and concurrent compilation produce equal logical projections and
      diagnostics modulo graph-local `ElementId` renaming.
- [ ] The compiler performs no external I/O after capture.
- [ ] Formatting, linting, tests, documentation, dependency policy, and fuzz
      smoke checks succeed.
- [ ] The runnable end-to-end path is preserved for all following stages.

---

## Stage 3: complete source text, lexer, layout, grammar, and recovery

### Step 1: complete lexical tokens and identifier rules

- [ ] Implement ASCII `snake_name` and `upper_name` exactly as specified.
- [ ] Implement all protected words and core names.
- [ ] Implement punctuation for `{}`, `[]`, `()`, `<>`, `:`, `=`, `?`, `,`, and
      `::`.
- [ ] Reject general `.`, chained qualification, semicolons, backslash
      continuation, and unsupported symbols.
- [ ] Add valid, invalid, boundary, and casing-lookalike fixtures.

#### Step validation

- [ ] Identifier property tests agree with the normative regexes.
- [ ] Leading, trailing, repeated underscores and wrong-category casing fail.
- [ ] Unicode lookalikes fail safely and point to original bytes.
- [ ] Core names cannot be redeclared.

### Step 2: complete comments and strings

- [ ] Implement `//` comments through the physical newline.
- [ ] Implement non-nesting `/* ... */` comments.
- [ ] Diagnose unterminated and misleading nested block comments.
- [ ] Implement `\"`, `\\`, `\n`, `\r`, `\t`, `\0`, and `\u{HEX}` escapes.
- [ ] Reject unknown escapes, surrogate values, raw controls, malformed Unicode
      escapes, and unterminated strings.
- [ ] Preserve comments as private trivia for formatting only; never lower them
      into logical IR.

#### Step validation

- [ ] Comment insertion/removal does not change logical IR.
- [ ] String tests cover every escape, Unicode boundary, and invalid form.
- [ ] Comment/string scans are linear and bounded.
- [ ] Diagnostics render hostile control text safely.

### Step 3: complete exact numeric literals

- [ ] Implement optional sign, digit separators, decimal fraction, and base-10
      exponent according to the lexical decision.
- [ ] Reject invalid separators, base prefixes, non-finite values, and incomplete
      exponent/fraction forms.
- [ ] Normalize into a sign, coefficient, and decimal scale or equivalent exact
      rational representation.
- [ ] Enforce significant-digit and scale limits before large allocation.
- [ ] Define equality and rendering without host float conversion.

#### Step validation

- [ ] Property tests compare normalization and equality across equivalent
      spellings.
- [ ] `0.1`, `0.5`, and `16_777_217` remain exact.
- [ ] Boundary and over-limit values return bounded limit diagnostics.
- [ ] No locale changes parsing or rendering.

### Step 4: complete layout normalization

- [ ] Suppress semantic line ends inside `()`, `[]`, record/value `{}`, and
      after syntactically incomplete tokens.
- [ ] Emit semantic line ends after complete headers, `use`, and declarations.
- [ ] Handle comments and physical newlines without indentation semantics.
- [ ] Define deterministic behavior for malformed delimiter stacks.
- [ ] Add the newline/comment/delimiter ambiguity corpus required by
      `SYN-DIA-002`.

#### Step validation

- [ ] Every ambiguity fixture has one expected semantic token stream.
- [ ] Equivalent line-ending styles remain logically equal.
- [ ] Missing delimiters cannot cause unbounded recovery.
- [ ] Layout and parser agree on declaration termination fixtures.

### Step 5: complete the private grammar and bounded recovery

- [ ] Parse optional `use Vocabulary` only after headers and before declarations.
- [ ] Parse record declarations, typed fields, closed defaults, and required
      commas.
- [ ] Parse complete type forms: core scalar, user record, qualified vocabulary,
      `T?`, `List<T>`, and `Ref<T>`.
- [ ] Parse scalar/null values, contextual records, lists, binding reuse, and
      `ref(name)`.
- [ ] Reject namespaces, visibility, imports, functions, operators, mutation,
      selection, templates, macros, and all other explicit exclusions.
- [ ] Recover only at documented declaration, field, and list boundaries.
- [ ] Stop optional recovery at the diagnostic cap and emit one truncation
      finding.

#### Step validation

- [ ] An executable grammar harness agrees with parser acceptance for every
      syntax fixture.
- [ ] Every accepted syntax node has a planned semantic and lowering owner.
- [ ] Every explicit exclusion has at least one stable negative fixture.
- [ ] Recovered or truncated models cannot become authoritative IR.
- [ ] Parser fuzzing and depth/count limits pass.

### Stage 3 validation

- [ ] The complete v0 grammar and formatter-facing trivia model are implemented.
- [ ] All lexical, layout, parser, ambiguity, and explicit-exclusion fixtures
      pass.
- [ ] Diagnostics use canonical ordering and original-byte spans.
- [ ] Parse behavior is deterministic across line endings, locales, and repeated
      runs.
- [ ] The Stage 2 end-to-end path still passes unchanged.

---

## Stage 4: implement core types, records, defaults, nullability, and lists

Each step is a vertical slice and must include semantic analysis, IR, reader,
diagnostics, source map, provenance, limits, and probe behavior.

### Step 1: complete scalar and nullable behavior

- [ ] Implement `string`, `bool`, `true`, `false`, and explicit `null`.
- [ ] Implement postfix outer nullability `T?`.
- [ ] Permit only exact type identity plus non-nullable `T` to outer `T?`
      widening.
- [ ] Reject `null` without a nullable expected type.
- [ ] Keep nullability distinct from field omission.

#### Step validation

- [ ] Scalar positive/negative fixtures pass through the probe.
- [ ] Widening applies only at the outer type.
- [ ] Logical values, source maps, and provenance match expected records.
- [ ] Reader traversal distinguishes null from omission.

### Step 2: implement nominal record declarations and contextual values

- [ ] Collect all root record and binding declarations before value resolution.
- [ ] Place records and bindings in one module scope and reject duplicates.
- [ ] Implement unique typed record fields and required trailing commas.
- [ ] Implement contextual `{ ... }` values with exactly one expected nominal
      type.
- [ ] Reject anonymous records, field shorthand, unknown/duplicate/missing
      fields, and structurally similar but nominally different records.
- [ ] Validate nominal recursive record graphs; nullable/list embedding does not
      break recursion.

#### Step validation

- [ ] Record fixtures cover empty, nested, missing, unknown, duplicate, wrong
      type, wrong nominal type, and direct/indirect recursion.
- [ ] Declaration order does not affect symbol resolution or output.
- [ ] Source maps identify declarations, fields, and values precisely.
- [ ] The public reader exposes nominal identity without compiler types.

### Step 3: implement closed defaults and omission

- [ ] Treat required/defaulted and non-nullable/nullable as independent axes.
- [ ] Permit closed scalar/null, list, and contextual-record defaults.
- [ ] Reject defaults containing ordinary names, `ref(...)`, or any expression.
- [ ] Materialize omitted defaulted fields as final logical values.
- [ ] Record explicit, user-record-default, and nested default provenance.
- [ ] Keep omission structural; do not add `optional`, `absent`, or `none`.

#### Step validation

- [ ] All four field-state combinations have positive and negative tests.
- [ ] `defaults-compatibility.neu` matches expected IR and provenance.
- [ ] `nonconstant-default.neu` fails at the semantic layer.
- [ ] Defaults cannot introduce value or identity graph edges.

### Step 4: implement ordered homogeneous lists

- [ ] Implement invariant `List<T>` with exactly one type argument.
- [ ] Implement ordered homogeneous list values with optional final item comma.
- [ ] Require expected element context for `[]`.
- [ ] Propagate expected types into record/list elements.
- [ ] Enforce list item, nesting, and traversal limits.
- [ ] Reject generic covariance and element type mismatch.

#### Step validation

- [ ] Empty, singleton, nested, nullable-outer, nullable-element, and over-limit
      list fixtures pass or fail as specified.
- [ ] List order remains logical in IR and reader output.
- [ ] `generic-covariance.neu` fails with the assigned type diagnostic.
- [ ] A huge declared list fails before proportional allocation.

### Stage 4 validation

- [ ] `defaults-compatibility.neu` passes end to end.
- [ ] Every record/default/nullability/list negative fixture fails at its owned
      layer with no authoritative IR.
- [ ] All Stage 4 features are visible through the public reader and probe.
- [ ] Logical output, source map, provenance, and diagnostics remain
      deterministic.
- [ ] Full workspace quality gates pass.

---

## Stage 5: implement value reuse, references, graph validation, and equality

### Step 1: implement immutable value reuse

- [ ] Resolve an unqualified name in value position to a value binding.
- [ ] Allow forward reuse after complete declaration collection.
- [ ] Support reuse in bindings, record fields, and list items.
- [ ] Build a static value-dependency graph.
- [ ] Reject every direct or indirect value cycle deterministically.
- [ ] Lower the final reused logical value, not a special reuse value kind.
- [ ] Record the complete reuse chain in provenance without unbounded traversal.

#### Step validation

- [ ] Forward, nested, transitive, unknown, wrong-kind, and cycle fixtures pass or
      fail as specified.
- [ ] `value-cycle.neu` fails with stable primary and related spans.
- [ ] Reordering independent declarations does not change logical output.
- [ ] Deep reuse chains respect traversal and diagnostic limits.

### Step 2: implement typed identity references

- [ ] Implement invariant `Ref<T>` with one type argument.
- [ ] Implement `ref(name)` as the only reference constructor.
- [ ] Allow forward reference targets.
- [ ] Require a uniquely resolved value binding whose type is exactly `T`.
- [ ] Diagnose unknown, record/type-name, vocabulary-namespace, and mismatched
      targets distinctly where required.
- [ ] Exclude identity edges from the value-dependency graph.
- [ ] Allow nominal recursion only when every cycle crosses `Ref<T>`.

#### Step validation

- [ ] Reference fixtures cover valid forward targets, wrong kind, wrong type,
      unknown name, identity-only cycles, and recursion boundaries.
- [ ] Reference source position and field names do not add semantics.
- [ ] Probe traversal follows typed identity edges without parsing strings.
- [ ] Reader validation confirms target existence, kind, and type.

### Step 3: implement graph-local identity and alpha-equivalence

- [ ] Allocate opaque document-local `ElementId` values without deriving meaning
      from their spelling or sequence.
- [ ] Implement logical graph alpha-equivalence using one consistent bijection.
- [ ] Compare declarations, resolved types, final values, and reference edges
      under that mapping.
- [ ] Keep source map, provenance, derivation, and envelope comparison as
      explicit companion comparisons rather than logical payload equality.
- [ ] Reject duplicate IDs, dangling references, and inconsistent redundant
      constraints in validated IR.

#### Step validation

- [ ] Property tests prove reflexivity, symmetry, and transitivity.
- [ ] Random `ElementId` renaming preserves equality.
- [ ] A changed edge, value, type, declaration, or inconsistent mapping breaks
      equality.
- [ ] No public documentation suggests persisting `ElementId` across documents.

### Stage 5 validation

- [ ] `immutable-value-reuse.neu` passes through compiler, IR, reader, and probe.
- [ ] All reuse, cycle, reference, recursion, and equality adversarial cases pass.
- [ ] Value and identity graphs remain semantically distinct.
- [ ] Repeated and concurrent builds compare equal modulo `ElementId` renaming.
- [ ] Stage 2–4 conformance remains green.

---

## Stage 6: implement the captured data-only vocabulary boundary

### Step 1: freeze and implement the closed bundle schema

- [ ] Publish one versioned Neutral-owned bundle schema before implementing its
      decoder.
- [ ] Include exact vocabulary identity, content digest, schema version,
      nominal type definitions, fields, closed defaults, and required structural
      feature IDs.
- [ ] Define the `Fixture::Metadata` contract used by the v0 fixture.
- [ ] Reject unknown fields and all scripts, callbacks, expressions, custom
      validators, bytecode, native/Wasm modules, and entry points.
- [ ] Define immutable meanings for published schema and feature identifiers.
- [ ] Enforce bundle byte, nesting, type, field, default, and feature limits.

#### Step validation

- [ ] Schema fixtures cover every allowed field and every forbidden executable
      shape.
- [ ] Unknown fields and unknown required features fail closed.
- [ ] Bundle validation performs no code loading or external I/O.
- [ ] Closed defaults satisfy the same constant rules as user-record defaults.

### Step 2: implement exact captured resolution

- [ ] Parse zero or one `use Vocabulary` in the required source position.
- [ ] Resolve it only through captured host lock data.
- [ ] Verify exact logical identity, content digest, schema version, and feature
      set before source payload validation.
- [ ] Reject missing, mismatched, duplicate, stale, or extra captured entries as
      specified.
- [ ] Never select `latest`, search paths/registries, or download from source
      syntax.
- [ ] Keep mutable names and host paths as provenance, not identity.

#### Step validation

- [ ] All required success/failure cases in
      `fixtures/vocabulary-contract-cases.md` pass.
- [ ] `use Fixture` without capture fails closed.
- [ ] Digest mismatch is classified as integrity failure.
- [ ] Resolver credentials and host paths never enter ordinary diagnostics or IR.

### Step 3: implement qualified nominal types and vocabulary values

- [ ] Resolve only `Vocabulary::Type` through the single imported namespace.
- [ ] Reject chained qualification, unknown namespace/type, static values, and
      general member access.
- [ ] Type-check contextual vocabulary-owned record values.
- [ ] Apply captured closed defaults as final values with vocabulary-default
      provenance.
- [ ] Record exact vocabulary identity/version and required structural features
      in logical IR.
- [ ] Expose qualified values through the public reader without assigning
      application behavior.

#### Step validation

- [ ] `minimal-vocabulary.neu` compiles and is fully enumerated by the probe.
- [ ] Missing, duplicate, unknown, and incompatible payload fields receive
      stable vocabulary diagnostics.
- [ ] `vocabulary-name-collision.neu` fails as specified.
- [ ] The probe reports typed data only and contains no `Fixture`-specific
      interpretation.

### Stage 6 validation

- [ ] Every vocabulary contract fixture passes.
- [ ] Unknown or executable bundle content fails before source payload validation.
- [ ] Compilation after capture and all reader operations remain effect-free.
- [ ] Exact vocabulary contracts and structural requirements are present in IR,
      provenance, and derivation where specified.
- [ ] All earlier stages remain green.

---

## Stage 7: implement one external IR encoding and hostile-input reader

### Step 1: select and specify the encoding

- [ ] Compare candidate encodings for exact numbers, bounded decoding, duplicate
      fields/IDs, unknown fields, tooling maturity, and language bindings.
- [ ] Write and accept a v0 encoding decision record.
- [ ] Specify framing, independent schema/version markers, media identity,
      required capabilities, size fields, and malformed-input behavior.
- [ ] Specify payload, source map, provenance, derivation, and envelope sections.
- [ ] State explicitly that encoded bytes are noncanonical and distinct from
      logical equality and derivation identity.
- [ ] Define all invalid encoded IR states before decoder implementation.

#### Step validation

- [ ] The encoding represents every positive logical IR fixture exactly.
- [ ] Exact numbers require no host float conversion.
- [ ] Unknown required semantics fail closed; optional unknown data follows an
      explicit policy.
- [ ] The decision includes resource and security analysis.

### Step 2: implement encoding

- [ ] Encode only fully validated in-memory documents.
- [ ] Include explicit framing and independent behavior/schema versions.
- [ ] Preserve logical declaration/value/reference structure and companion
      records.
- [ ] Record producer/build information only in the envelope.
- [ ] Avoid claims of canonical bytes or byte-stable equality.
- [ ] Make output deterministic where practical without turning incidental byte
      order into a language contract.

#### Step validation

- [ ] Every positive document encodes successfully within configured limits.
- [ ] Encoding does not mutate the validated document.
- [ ] Different valid encodings of the same payload compare logically equal
      after validation.
- [ ] Producer metadata changes do not alter logical payload equality.

### Step 3: implement bounded decode and validation

- [ ] Validate framing, declared lengths, versions, and capabilities before
      proportional allocation.
- [ ] Decode into an untrusted intermediate representation, never directly into
      a validated public type.
- [ ] Validate IDs, declarations, types, values, list homogeneity, references,
      source-map spans, provenance links, and derivation structure.
- [ ] Require exact host-supplied vocabulary contracts for vocabulary-owned IR.
- [ ] Perform no hidden schema lookup or external I/O.
- [ ] Return immutable typed views only after complete validation.
- [ ] Classify corrupt, truncated, oversized, duplicate-ID, dangling-reference,
      unsupported-version, unknown-feature, and inconsistent-type errors.

#### Step validation

- [ ] Valid encoded fixtures decode to alpha-equivalent logical IR.
- [ ] Every malformed/adversarial fixture fails with a bounded classified error.
- [ ] Allocation-before-validation review finds no proportional allocation from
      an unchecked length.
- [ ] Decoder fuzzing produces no panic, hang, excessive allocation, or typed
      view of invalid data.
- [ ] Missing vocabulary contracts fail without lookup.

### Stage 7 validation

- [ ] In-process and decoded reader observations are logically identical.
- [ ] All invalid encoded IR states have executable negative tests.
- [ ] Reader limits are independent, explicit, and versioned.
- [ ] Encoding bytes are never used as logical equality.
- [ ] All earlier source-to-IR conformance remains green.

---

## Stage 8: complete public tooling and conformance proof

### Step 1: complete the generic probe

- [ ] Enumerate module metadata and every exported declaration.
- [ ] Enumerate resolved core, record, list, nullable, reference, and qualified
      vocabulary types.
- [ ] Read final scalar, null, record, list, defaulted, and reused values.
- [ ] Traverse typed `Ref<T>` edges by `ElementId`.
- [ ] Display safe explicit/reuse/default/normalization provenance categories.
- [ ] Map a consumer-owned diagnostic from an IR element to captured source.
- [ ] Support both in-process validated IR and externally decoded IR.
- [ ] Keep output deterministic but explicitly noncanonical.

#### Step validation

- [ ] Probe summaries match for in-process and decoded forms modulo envelope
      metadata.
- [ ] Build metadata proves the probe has no parser or compiler dependency.
- [ ] Probe traversal respects reader limits and cannot loop on hostile graphs.
- [ ] Probe output safely escapes untrusted names and strings.

### Step 2: implement the reference formatter

- [ ] Format canonical header order.
- [ ] Use four-space indentation in record declarations and values.
- [ ] Put one record field per line with trailing comma.
- [ ] Normalize spacing around `=`, `:`, and commas.
- [ ] Emit no semicolons.
- [ ] Preserve/place comments deterministically without making them semantic.
- [ ] Format from accepted private syntax while keeping public IR independent of
      concrete source rendering.

#### Step validation

- [ ] Formatting is idempotent.
- [ ] Parse/format/parse preserves logical IR, source-independent provenance
      categories, and accepted behavior.
- [ ] Formatter handles every syntax and comment fixture.
- [ ] Formatted bytes are never presented as source identity or signing material.

### Step 3: complete CLI host commands

- [ ] Provide compile, validate, inspect, and format commands.
- [ ] Keep acquisition and filesystem writes in the CLI host layer.
- [ ] Make output destination, overwrite policy, diagnostic format, disclosure
      policy, and limits explicit.
- [ ] Write output atomically only after complete success.
- [ ] Use stable documented exit classes for success, source rejection,
      cancellation/resource failure, invalid IR, usage error, and internal
      defect.
- [ ] Never overwrite an input or existing output unless the user explicitly
      requests it.

#### Step validation

- [ ] CLI integration tests cover success, each failure class, stdout/stderr
      separation, and no-partial-output behavior.
- [ ] Host paths are absent from safe diagnostics unless an explicit disclosure
      mode permits them.
- [ ] Compile/inspect results agree with library API tests.
- [ ] CLI cancellation cannot leave apparently valid partial output.

### Step 4: close traceability and documentation

- [ ] Complete requirement → decision → fixture → implementation → test
      traceability.
- [ ] Give every diagnostic a stable code and safe parameter schema.
- [ ] Document public compiler, resolver, capture, reader, diagnostic, and probe
      APIs.
- [ ] Publish the normative lexical grammar, layout algorithm, context-free
      grammar, semantic rules, IR validity rules, and encoding specification.
- [ ] Check every item in `syntax-checklist.md` only when its full completion
      evidence exists.
- [ ] Keep examples, grammar, decisions, implementation behavior, and fixtures
      synchronized.

#### Step validation

- [ ] Every `NL-*` and `SYN-*` ID maps to at least one executable test.
- [ ] Every fixture maps to an expected outcome and owning requirement.
- [ ] No implementation-only accepted behavior lacks a decision.
- [ ] Repository coherence and local Markdown link checks pass.
- [ ] Public API examples compile as documentation tests.

### Stage 8 validation

- [ ] The generic probe proves the public boundary without source/private-model
      access.
- [ ] The formatter is idempotent and semantics-preserving.
- [ ] Compile, validate, inspect, and format CLI paths pass end to end.
- [ ] Traceability has no orphan requirement, diagnostic, fixture, or test.
- [ ] All explicit v0 exclusions remain rejected.

---

## Stage 9: harden correctness, security, determinism, and performance

### Step 1: property and metamorphic testing

- [ ] Add lexer/layout invariants and token-span properties.
- [ ] Add parse/format/parse logical equality properties.
- [ ] Add exact-number normalization/equality properties.
- [ ] Add value-cycle and record-recursion graph properties.
- [ ] Add IR alpha-equivalence properties.
- [ ] Add source-map containment and original-byte span properties.
- [ ] Add repeated and concurrent deterministic compilation properties.
- [ ] Add encoding/decoding logical-equivalence properties.

#### Step validation

- [ ] Property suites run with reproducible seeds in CI.
- [ ] Failures retain a minimized regression fixture.
- [ ] No property compares incidental map order or noncanonical bytes.
- [ ] Optimized code paths compare equal to the reference full path.

### Step 2: fuzz untrusted boundaries

- [ ] Fuzz UTF-8 validation and source decoding.
- [ ] Fuzz lexer, layout normalizer, parser, and recovery.
- [ ] Fuzz vocabulary bundle decoding/validation.
- [ ] Fuzz IR decoding/validation.
- [ ] Fuzz formatter and probe traversal on validated inputs.
- [ ] Seed corpora from all positive, negative, ambiguity, and adversarial
      fixtures.
- [ ] Convert every confirmed issue into a deterministic regression test.

#### Step validation

- [ ] Each target runs for the documented CI smoke budget.
- [ ] Extended fuzz runs report no panic, hang, memory explosion, stack
      overflow, invalid typed IR, or partial success.
- [ ] Corpus and crash artifacts contain no secrets or host-specific data.
- [ ] Fuzz-only behavior does not bypass normal public validation.

### Step 3: enforce resource and cancellation behavior

- [ ] Test exact boundaries for source/bundle/IR bytes, strings, nesting,
      declarations, fields, lists, references, numeric digits/scale, traversal,
      diagnostics, and rendering.
- [ ] Check limits before proportional allocation and conversion.
- [ ] Poll cancellation at bounded work intervals in every compiler/decoder
      stage.
- [ ] Distinguish deterministic structural-limit diagnostics from operational
      cancellation/deadline outcomes.
- [ ] Ensure cancellation and fatal limits return no authoritative partial IR.
- [ ] Bound diagnostic count and rendered size, including one truncation record.

#### Step validation

- [ ] At-limit cases succeed and one-over-limit cases fail predictably.
- [ ] Cancellation injection at every stage converges without corrupting shared
      state.
- [ ] Concurrent requests cannot consume or mutate each other's budgets.
- [ ] No deadline or physical memory value enters logical semantics.

### Step 4: security and isolation review

- [ ] Review resolver authority, capture integrity, pure compiler, vocabulary,
      decoder, CLI, formatter, and probe trust boundaries.
- [ ] Verify no source form can request filesystem, environment, network,
      command, credential, policy, or runtime authority.
- [ ] Verify no vocabulary content can execute code or install a validator.
- [ ] Review diagnostics for control injection, path disclosure, credential
      disclosure, and unbounded rendering.
- [ ] Review caches for complete keys, poisoning, cross-request leakage, and stale
      source-map/provenance reuse.
- [ ] Review all dependencies, build scripts, features, and transitive licenses.
- [ ] Publish the v0 threat model and unresolved-risk register.

#### Step validation

- [ ] Security review findings are fixed, explicitly accepted with rationale, or
      block release.
- [ ] A static/dependency scan finds no unknown executable extension path.
- [ ] Tests prove capture credentials and host policy inputs do not enter IR or
      ordinary diagnostics.
- [ ] Independent concurrent calls share no meaning-affecting mutable global
      state.

### Step 5: benchmark and publish resource profiles

- [ ] Define representative, boundary, and adversarial corpora.
- [ ] Measure phase-level time and peak memory for capture, frontend, semantics,
      lowering, encoding, decoding, and probe traversal.
- [ ] Publish named structural/resource profiles rather than machine-specific
      timing as language semantics.
- [ ] Set measurable regression thresholds for the supported CI host.
- [ ] Profile before optimizing.
- [ ] Prove every optimization preserves full-reference logical results,
      diagnostics, source maps, provenance, and derivation.

#### Step validation

- [ ] Benchmarks are reproducible enough to identify regressions.
- [ ] Adversarial growth is bounded and documented.
- [ ] Peak-memory measurements include decode-before-validation cases.
- [ ] Performance changes pass the complete conformance suite.

### Step 6: complete every dynamic test level

- [ ] Finalize the smoke suite around the smallest critical end-to-end paths and
      enforce its local/PR time budget.
- [ ] Finalize unit suites for every pure module, invariant, error class, and
      boundary calculation.
- [ ] Finalize integration suites for capture/compiler/IR/reader/vocabulary/probe
      interactions.
- [ ] Finalize black-box system suites for all CLI commands and supported hosts.
- [ ] Finalize conformance suites for every normative form, exclusion,
      diagnostic, source map, provenance, derivation, and invalid IR state.
- [ ] Finalize performance suites for phase and end-to-end latency, throughput,
      memory, artifact size, scalability, concurrency, and cancellation.
- [ ] Finalize stress/soak scenarios for repeated compilation, concurrent
      isolation, cancellation storms, diagnostic caps, and hostile decode loads.
- [ ] Verify each suite uses its own intended interface and does not gain access
      to private state merely to simplify assertions.
- [ ] Eliminate test-order dependencies, shared mutable fixtures, ambient ports,
      fixed temporary paths, sleeps as synchronization, and external services.

#### Step validation

- [ ] `cargo xtask test smoke` passes within its configured budget from a clean
      build and from an incremental build.
- [ ] `cargo xtask test unit` passes with randomized order where supported.
- [ ] `cargo xtask test integration` passes without public network access.
- [ ] `cargo xtask test system` passes against built binaries on the primary
      host and the declared matrix passes in CI.
- [ ] `cargo xtask test conformance` reports no missing or orphan fixtures.
- [ ] `cargo xtask test performance --profile release` meets all controlled
      release thresholds.
- [ ] The stress/soak profile completes without leak, hang, cross-request state,
      nondeterministic logical output, or partial authoritative success.
- [ ] `cargo xtask test all` selects every deterministic required suite exactly
      once and produces one aggregate result.

### Step 7: evaluate test strength and static quality

- [ ] Collect line, function, and region/branch coverage with path remapping and
      stable exclusions documented in `quality-gates.toml`.
- [ ] Review every uncovered production region in parser, semantic, lowering,
      vocabulary, decoder, limit, diagnostic, and cancellation code.
- [ ] Run mutation testing on exact-number, layout, compatibility, graph,
      alpha-equivalence, limits, diagnostic ordering, and decoder validation
      modules.
- [ ] Classify surviving mutants as missing test, equivalent mutant, tool
      limitation, or accepted residual risk.
- [ ] Run automated source-code measures and record tool/version/limitations;
      do not equate a tool report alone with ISO/IEC 5055 conformity.
- [ ] Conduct static work-product reviews of normative specifications, grammar,
      public APIs, architecture boundaries, threat model, tests, test oracles,
      and release evidence.
- [ ] Require independent review of security-sensitive and externally decoded IR
      paths when staffing permits.
- [ ] Assemble a quality evaluation that defines scope, quality characteristics,
      measures, thresholds, evidence, deviations, and conclusion.

#### Step validation

- [ ] `cargo xtask coverage` meets all configured thresholds and reports no
      unreviewed exclusions.
- [ ] `cargo xtask mutate` meets the configured critical-module target or lists
      approved surviving-mutant risks.
- [ ] Every required review has identified participants, scope, findings,
      decisions, and closure evidence.
- [ ] Every quality measure is reproducible from retained source evidence.
- [ ] The quality evaluation concludes each selected characteristic as pass,
      fail, or explicitly indeterminate; missing evidence cannot be inferred as
      pass.
- [ ] No ISO conformity or certification claim appears in generated reports
      unless separately approved under the standards applicability process.

### Stage 9 validation

- [ ] No known input causes unbounded work, panic, stack overflow, invalid typed
      IR, stale source location, or apparently successful partial output.
- [ ] Repeated and concurrent results are deterministic modulo allowed
      `ElementId` renaming.
- [ ] Threat model, dependency review, fuzzing status, and measured resource
      profiles are published.
- [ ] Smoke, unit, integration, system, conformance, property, security, fuzz,
      performance, soak/stress, mutation, and static-review evidence is complete.
- [ ] Coverage, mutation, quality-measure, and ISO-alignment records satisfy the
      approved project-specific gates.
- [ ] All correctness, security, performance, and earlier-stage gates pass.

---

## Stage 10: prepare the v0 release candidate

### Step 1: assemble release artifacts

- [ ] Publish the v0 language and semantic specification.
- [ ] Publish the logical IR, identity, equality, source-map, provenance, and
      derivation specifications.
- [ ] Publish one versioned noncanonical IR encoding specification.
- [ ] Publish compiler, capture/resolver, reader, diagnostic, and probe API docs.
- [ ] Publish the closed/versioned fixture vocabulary schema and captured bundle.
- [ ] Package compiler and reader libraries.
- [ ] Package compile/validate/inspect/format CLI tooling.
- [ ] Package the generic probe and complete conformance suite.
- [ ] Publish compatibility, security, supported-host, and resource-profile
      notes.
- [ ] Publish the approved quality model, standards applicability record, test
      plan, traceability matrix, release test-completion report, quality
      evaluation, deviations, and residual-risk decision.

#### Step validation

- [ ] Release packages contain only intended files and licenses.
- [ ] Release builds use the locked dependency graph and documented toolchain.
- [ ] A consumer can build the probe using only published public contracts.
- [ ] All examples run against the release artifacts.
- [ ] Quality/test evidence identifies the exact release artifacts and can be
      independently reconciled with their digests.

### Step 2: execute the release matrix

- [ ] Run formatting and lint gates from a clean checkout.
- [ ] Run smoke, unit, integration, system, conformance, property, determinism,
      security, fuzz, performance, soak/stress, mutation, documentation, and
      static-analysis suites at their release profiles.
- [ ] Run every positive, negative, ambiguity, adversarial, and resource fixture.
- [ ] Run repeated and concurrent builds.
- [ ] Run in-process and encoded probe comparisons.
- [ ] Run dependency, license, advisory, and repository coherence checks.
- [ ] Run on every supported host/toolchain combination.
- [ ] Generate the aggregate release quality report from the machine-readable
      suite evidence.

#### Step validation

- [ ] Every matrix job succeeds without ignored failure.
- [ ] No golden file changes during test execution.
- [ ] Release output is reproducible at the claimed logical level.
- [ ] Failures cannot leave or publish partial authoritative artifacts.
- [ ] Coverage, mutation, benchmark, fuzz, soak, and quality thresholds pass on
      the approved release environment.
- [ ] No required test is skipped, ignored, quarantined, flaky, retried into a
      pass, missing evidence, or indeterminate without an approved blocking risk
      decision.

### Step 3: perform final scope and boundary audit

- [ ] Verify every item in `syntax-checklist.md` has complete evidence.
- [ ] Verify every accepted source form has semantics, IR lowering, source map,
      provenance, limits, diagnostics, formatter behavior, and reader evidence.
- [ ] Verify every explicit exclusion still has a rejection fixture.
- [ ] Verify the probe has no source parser or private compiler dependency.
- [ ] Verify no API promises canonical bytes, automatic migration, public AST/IR
      rewriting, ambient lookup, application semantics, or external effects.
- [ ] Verify all accepted documents are coherent and use the same terminology.
- [ ] Resolve or explicitly block on every release-risk entry.
- [ ] Recheck current status/editions of every standard in the applicability
      register and review any change.
- [ ] Verify release notes describe standards alignment honestly and make no
      unsupported certification claim.

#### Step validation

- [ ] Requirement → decision → fixture → implementation → test traceability is
      complete and reviewed.
- [ ] No deferred feature entered through syntax, vocabulary, IR, CLI, or probe.
- [ ] No known contradiction remains between normative documents and behavior.
- [ ] Release approval records the exact language, IR, encoding, vocabulary,
      compiler, and reader versions independently.
- [ ] Release approval records the independent test/quality reviewer, or an
      explicit staffing exception and compensating review evidence.

### Stage 10 validation

- [ ] All Stage 1–9 validations pass from a clean checkout.
- [ ] Every v0 completion gate in `ARCHITECTURE.md` and `ROADMAP.md` is satisfied.
- [ ] The minimal and full positive paths work through capture →
      `compile_captured` → validated IR → public reader → generic probe.
- [ ] Every invalid path fails closed with bounded, classified diagnostics and no
      authoritative IR.
- [ ] The release includes the compiler, reader, CLI, formatter, probe, captured
      fixture vocabulary, conformance suite, and required specifications.
- [ ] The release evidence includes complete smoke, unit, integration, system,
      conformance, security, performance, and ISO-alignment evaluation results.
- [ ] Neutral language v0 is released only after all unchecked items that affect
      the release boundary are completed or the release is explicitly blocked.

## Standard validation commands

After Stage 1 automation exists, run these from the `neutral-lang/`
implementation root. They are the stable developer/CI interface:

```bash
cargo xtask environment verify
cargo xtask format
cargo xtask lint
cargo xtask test smoke
cargo xtask test unit
cargo xtask test integration
cargo xtask test system
cargo xtask test conformance
cargo xtask test property
cargo xtask test security
cargo xtask test performance --profile pr
cargo xtask fuzz smoke
cargo xtask coverage
cargo xtask quality report
cargo xtask ci pr
```

Nightly and release automation additionally run:

```bash
cargo xtask ci nightly
cargo xtask test performance --profile release
cargo xtask fuzz campaign
cargo xtask mutate
cargo xtask ci release
```

Before `xtask` exists, these bootstrap commands are the minimum direct checks:

```bash
cargo metadata --manifest-path neutral-lang/Cargo.toml --no-deps
cargo fmt --manifest-path neutral-lang/Cargo.toml --all -- --check
cargo check --manifest-path neutral-lang/Cargo.toml --workspace --all-targets --all-features
cargo clippy --manifest-path neutral-lang/Cargo.toml --workspace --all-targets --all-features -- -D warnings
cargo test --manifest-path neutral-lang/Cargo.toml --workspace --all-features
RUSTDOCFLAGS="-D warnings" cargo doc --manifest-path neutral-lang/Cargo.toml --workspace --all-features --no-deps
```

The contributor guide must define prerequisites, profiles, expected duration,
result locations, cleanup, and failure interpretation. Do not document a command
as a release gate until CI executes the same command. Do not maintain a separate
CI-only implementation of any local task.

## Deliberately postponed work

Do not add namespaces, visibility modifiers, multiple source units, imports,
secret references, static/member access, maps, sets, tuples, unions, enums, user
generics, operators, functions, control structures, mutation, override,
composition, templates, macros, executable plugins, external effects, public IR
transformation/migration APIs, canonical encoding, GUI contracts, or
application-specific syntax. A later version requires independent evidence and
an accepted decision; completion of this plan does not approve any such feature.
