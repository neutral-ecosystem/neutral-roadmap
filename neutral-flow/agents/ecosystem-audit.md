# Neutral ecosystem and project-boundary audit

Status: architecture research, 2026-08-13. This is not an implementation plan, a language design, or a definition of Neutral semantics.

## Executive judgement

The top-down investigation is sensible; the implied top-down implementation order is not.

Neutral Flow is a good first domain to study because it supplies hard requirements for composition, validation, capability negotiation, diagnostics, reproducibility, security, and long-running work. Neux should supply a second, deliberately different domain before the language foundation is frozen. That is **requirements discovery**, not permission to implement a complete CI/CD platform and then extract a language from it.

The recommended order is therefore:

1. investigate Flow use cases, failure cases, trust boundaries, and externally visible contracts;
2. investigate Neux independently, looking for both common needs and important differences;
3. derive the smallest domain-independent obligations for Neutral without importing CI/CD or Linux vocabulary into the language;
4. establish the meaning and invariants those obligations require;
5. only then stabilize compiler representations and public compiler APIs;
6. integrate Flow through a versioned domain boundary;
7. introduce the ecosystem-wide CLI after the underlying tools have stable direct interfaces.

This reconciles the user's top-down discovery strategy with the public roadmap's foundation-first delivery strategy. It also avoids a circular bootstrap in which Flow depends on Neutral while Neutral is being inferred from Flow.

The largest immediate issue is not technical. It is that **“Neutral Flow” currently denotes two products of radically different size**:

- The public roadmap describes a provider-neutral pipeline representation, validator, and planner, initially connected to a practical provider.
- The local requirements describe a full CI/CD platform: event ingestion, durable orchestration, scheduling, workers, isolation, identity, secrets, artifacts, provenance, audit, deployment, promotion, and recovery.

Both can exist as layers of one eventual product, but they are not one first release. Until that choice is made explicitly, architecture and milestone estimates will be unreliable.

## Evidence and current public state

### Local planning material

[`REQUIREMENTS.md`](../REQUIREMENTS.md) is a broad and generally thoughtful problem-space inventory. Its strongest decisions are:

- the dependency graph, rather than a fixed build/test/deploy sequence, is the execution structure;
- workflow intent must be independent of any provider;
- unsupported capabilities must fail visibly rather than be silently weakened;
- definition identity, source identity, attempt identity, artifacts, and provenance are distinct;
- security, identity, permissions, isolation, durability, and cancellation are cross-cutting concerns;
- CI/CD operations such as build, test, and deploy are workloads, not necessarily engine primitives; and
- CI/CD requirements must not automatically become Neutral language features.

Those are sound architectural constraints. The document is less successful as a release definition because it deliberately describes what a strong general-purpose system may need, not what a particular first product promises.

The three checklists are mechanical partitions of that inventory:

- [`v0-checklist.md`](../v0/v0-checklist.md) is effectively every item classified `REQUIRED`;
- [`v1-checklist.md`](../v1/v1-checklist.md) is every item classified `HELPFUL`;
- [`v2-checklist.md`](../v2/v2-checklist.md) is every item classified `SPECULATIVE`.

This maps requirement importance to release numbering, which is a category error. “Required for the eventual credible system” does not mean “must be complete in the first usable slice.” Conversely, dry-run planning and local validation are marked helpful but may be essential to a safe first planner. Deployment is marked required even though an initial validator/planner product need not deploy anything.

The local `ROADMAP.md` files are empty or headings only, so the checklists currently carry more roadmap authority than they should.

### Public organization and website

At the time of this audit, GitHub repository search exposed only the public [organization `.github` repository](https://github.com/neutral-ecosystem/.github). That is a point-in-time public inventory, not evidence that private or deleted work does not exist. The local `neutral-roadmap` checkout points to a remote that is no longer publicly resolvable.

The [organization profile](https://github.com/neutral-ecosystem/.github/blob/main/profile/README.md) names four conceptual projects:

- Neutral: language, compiler, and toolchain;
- Neutral CLI: unified ecosystem command-line interface;
- Neutral Flow: CI/CD pipeline definition, validation, and execution tooling; and
- Neux: independently useful Linux system workflow tooling.

It explicitly says names, scopes, and repository structure may evolve. The [organization roadmap](https://github.com/neutral-ecosystem/.github/blob/main/ROADMAP.md) puts language goals, specification, parser/toolchain foundations, diagnostics, and standard-library direction in the current foundation stage; CLI and a Flow representation/validator/planner prototype next; and Neux later, once its independent scope is clear.

The [Neutral website](https://neutral.younesrabeh.workers.dev/) is narrower than the organization profile. It presents `neutral-lang` as the sole current project and labels tooling, automation, infrastructure, and CI/CD as intended use cases rather than available products. Its [language page](https://neutral.younesrabeh.workers.dev/neutral-lang/) says syntax and APIs remain subject to change, while its [roadmap page](https://neutral.younesrabeh.workers.dev/roadmap/) emphasizes “foundation before features.”

This public messaging supports exploratory architecture work, but it does not yet establish product contracts. In particular, the profile calls Flow “definition, validation, and execution tooling,” while the roadmap initially promises representation, validation, and planning. That difference must be resolved before calling anything Flow v0.

There is also a naming ambiguity to settle early: the profile uses **Neutral** for the core language/toolchain, while the website consistently uses **neutral-lang**. This is harmless during exploration but costly once packages, executables, repository names, diagnostics, and documentation links become public.

## Recommended ecosystem boundaries

Logical boundaries should be agreed before repository boundaries. A separate repository does not create independence, and an initial monorepo does not prevent it, provided contracts and dependency directions remain explicit.

| Component | Owns | Must not own or assume |
| --- | --- | --- |
| Neutral language and toolchain | The language specification, compiler behavior, diagnostics, language-level intermediate representations, and direct toolchain interfaces | CI/CD lifecycle vocabulary, provider APIs, Flow run state, Linux administration policy, or a dependency on Flow/Neux |
| Neutral compiler API | Versioned compilation entry points, diagnostics, and compiler outputs | Workflow scheduling, provider selection, durable run state, secrets, or deployment |
| Neutral compiler IR | Compiler-internal or compiler-facing representation of Neutral programs | The Flow normalized workflow, provider-bound execution plan, runtime state machine, or audit log |
| Flow authoring adapter | Conversion from an accepted authoring source into Flow workflow intent, with source mapping for diagnostics | Ownership of the Neutral compiler or silent reinterpretation of compiler output |
| Flow Core | The provider-neutral workflow contract, normalization, structural/domain validation, dependency analysis, required-capability derivation, and logical planning | Source-language parsing, vendor-specific execution behavior, secret storage, or Linux-only assumptions |
| Flow target adapter | Explicit capability declaration and conversion/binding between Flow plans and one execution target | Changing workflow meaning to fit a target or leaking target fields into portable core objects |
| Flow Runtime, if built | Durable run/attempt state, scheduling, recovery, cancellation, result aggregation, and event history | Being required by offline validation/export use cases, or embedding a particular provider as “the model” |
| Runner protocol and workers | Execution of bounded work requests, environment preparation, event/result reporting, and cleanup | Global graph scheduling, authoring-language knowledge, policy decisions, or broad standing credentials |
| Neutral CLI | Consistent discovery, invocation, context, authentication hand-off, output conventions, and version negotiation across independently usable tools | The only usable interface, duplicated compiler/planner logic, or an ecosystem-wide shared mutable state store |
| Neux | Independently useful Linux system operations and their own safety model | Becoming the default Flow runner, the Neutral standard library, a Linux distribution, or a prerequisite for Flow portability |
| External services | Source hosting, identity, secrets, artifacts, logs, policy decisions, notifications, and deployment targets through replaceable interfaces | Becoming implicit core state or silently defining portable behavior |

### The representations must remain distinct

A clean conceptual path is:

```text
authoring source
    -> compiler result (when Neutral is the authoring source)
    -> Flow workflow intent
    -> validated, normalized Flow definition
    -> target-independent logical plan
    -> target-bound execution plan
    -> durable run / unit / attempt records
    -> results, artifacts, evidence, and audit projections
```

These are not aliases for one universal “IR.” They have different consumers, lifetimes, security properties, compatibility rules, and identities:

- Compiler IR exists to preserve and transform language meaning.
- Flow intent preserves the domain request and author-facing locations.
- A normalized definition makes defaults and references explicit.
- A logical plan records validated work without committing to an execution provider.
- A bound plan records a particular target and its declared capabilities.
- Runtime records describe changing facts; they must never mutate the pinned definition or plan.
- Audit/evidence records are append-oriented historical claims, not current scheduler state.

Calling all of these “Neutral IR” would couple every project to compiler internals and make compatibility impossible to reason about. Flow should own its domain contracts. Neutral may produce or consume those contracts through an adapter, but the language compiler must not own them.

### The dependency direction

The intended stable dependency graph should be acyclic:

```text
Neutral compiler ----> versioned compiler contract
                              |
                              v
optional Flow adapter -> Flow intent/core -> target adapter
                                              |
                                              v
                                      provider or Flow Runtime

Neutral CLI ---------> public interfaces of each tool

Neux ----------------> its own interfaces
  \---- optional ordinary Flow integration, with no privileged path
```

Flow can inform Neutral's requirements without becoming a compiler dependency. Neux can be invoked by Flow like any other properly declared capability without becoming part of the Flow engine. The CLI can coordinate tools without becoming their shared kernel.

### Independence tests

The boundaries are credible only if all of the following remain possible:

- Flow Core can validate and plan a canonical workflow supplied through an API or fixture without loading the Neutral compiler.
- The Neutral compiler can be built, tested, versioned, and used with Flow and Neux absent.
- Flow workers can execute a bounded, versioned request without parsing authoring source.
- Replacing the first CI provider produces explicit capability differences, not core-model edits or silent behavioral drift.
- Neutral Flow retains useful offline validation/planning behavior if no Flow Runtime exists.
- Neux can be installed and used with neither Flow nor the umbrella CLI.
- Flow can target a non-Neux and, eventually, non-Linux execution mechanism; any early Linux limitation is documented as an implementation support limit, not encoded as portable meaning.
- Every project remains directly usable without the unified CLI.
- A historical run can identify source, workflow definition, logical plan, target binding, artifacts, and attempts independently.

## Product-shape decision for Neutral Flow

Before architecture is frozen, select one initial product shape:

1. **Portable frontend:** definition, validation, planning, capability checking, and export/integration with existing CI providers.
2. **Independent CI/CD control plane:** all of the above plus durable scheduling, workers, storage, identity, secrets, and deployment services.
3. **Layered product:** Flow Core is useful offline and independent; Flow Runtime is an optional later control plane.

The recommended path is the third, delivered in that order. It preserves the full ambition of the local requirements while making the public roadmap achievable. The first meaningful milestone should be Flow Core plus both a deterministic simulator and one static target/export adapter, not a hosted CI/CD service.

This decision has consequences that must not be blurred:

- Exporting to a provider means the provider owns runtime state, retries, cancellation, and much of the security boundary.
- Owning the runtime means Neutral must operate a distributed, security-sensitive service and cannot delegate those guarantees to a translation layer.
- Supporting both requires separate contracts and separate conformance claims; an exporter cannot honestly claim the guarantees of Flow Runtime.

“Provider neutral” should mean a stable portable core plus explicit capability negotiation. It must not mean a lowest-common-denominator promise, nor an opaque escape hatch that makes every workflow nominally portable. A target may support the portable profile, support named optional capabilities, or reject the plan with an exact diagnostic. Target extensions should be isolated and visibly reduce portability.

## Critique of the present version structure

The current v0/v1/v2 split should not be used as a delivery roadmap.

### Why v0 is not a credible first milestone

The v0 checklist includes the whole required set: multiple trigger modes, graph planning, parallel execution, durable recovery, worker-loss detection, retries, cancellation, identity, permissions, secrets, trust boundaries, artifacts, integrity, provenance, audit, provider independence, capability detection, deployment, environment promotion, gates, verification, and cleanup. Completing it honestly is an enterprise platform program, not a version-zero release.

It also lacks the decisions needed to make those checkboxes testable:

- target user and operating model;
- offline tool versus service versus both;
- single-user, team, or multi-tenant threat model;
- consistency and durability guarantees;
- trusted control plane and untrusted execution boundaries;
- supported execution environments;
- first provider integration and exact portability promise;
- compatibility/versioning policy for definitions, plans, worker protocol, and extensions; and
- measurable scenarios and acceptance evidence for phrases such as “where possible,” “important,” and “where appropriate.”

### Better classification

Keep the capability inventory, but add dimensions instead of release labels:

- **Product layer:** Core, adapter, Runtime, runner, CLI, or external integration.
- **Profile:** offline planning, provider export, self-hosted runtime, managed runtime, or delivery.
- **Obligation:** invariant, required for a named profile, optional capability, or research topic.
- **Maturity:** proposed, specified, fixture-covered, reference-prototyped, single-target validated, multi-target conformant, or operationally hardened.
- **Risk:** correctness, security, portability, operability, or usability.

A capability can then be “required for managed runtime” without blocking an offline planner milestone. “Speculative” items should live in a research backlog, not a promised v2; several would require independent research programs.

### Candidate first vertical slice — superseded and narrowed

The original audit mixed runtime records into Flow Core. The accepted slice in
`ARCHITECTURE.md` supersedes it: v0 is offline and non-executing. Without
defining syntax or language semantics, it should demonstrate:

- a pinned workflow definition and pinned input/source identity;
- a small acyclic work graph with explicit data dependencies;
- validation of references and cycles with source-linked diagnostics;
- a deterministic logical plan and a visible dry run;
- explicit required capabilities and one target capability report;
- rejection rather than weakening when the target is incompatible;
- a deterministic simulator for reference behavior;
- one static target/export adapter with no remote effects; and
- an explicit threat-boundary review showing what Core accepts as untrusted
  input and what future executable profiles must isolate.

Run/attempt identities, runtime results, cancellation, logs, artifacts, secret
delivery, and cleanup remain architectural constraints but are not v0 product
scope. They become conformance requirements only if an executable profile is
approved.

If a later profile includes execution, it should begin with a deliberately
narrow target and a separately stated trust model. Deployment, promotion,
manual gates, reusable templates, caching, matrices, and a distributed scheduler
remain later profiles. Security invariants are not deferrable merely because an
execution target is narrow.

## Bootstrapping and order-of-development risks

### 1. Freezing API or IR before behavior

The proposed phrase “compiler API -> IR -> semantic” reverses the dependency of stable design. A public API and an IR can be sketched as experiments, but neither can be stabilized before the behavior and invariants they must preserve are understood. Otherwise accidental representation choices become the semantics by default.

This audit intentionally does not propose those semantics. It recommends only the sequencing rule:

```text
representative domain obligations
    -> stated behavior and invariants
    -> representations/lowering strategy
    -> public compiler API
    -> compatibility commitment
```

Syntax may be prototyped in parallel, but must remain cheap to change.

### 2. Flow-only bias in a supposedly common language

If Neutral is derived only from Flow, CI/CD concepts will masquerade as general abstractions. Requiring an independent Neux corpus before freezing the language is therefore valuable. The test is not whether Flow and Neux use the same words; it is whether a small domain-independent foundation can support both while domain concepts stay in their own libraries/adapters.

### 3. Circular self-hosting

Building Flow in Neutral while Neutral is being shaped by Flow creates a three-way unstable dependency among compiler behavior, Flow contracts, and the build system. Use mature host tooling for the bootstrap. Treat early self-hosting as a later validation exercise, not an architectural requirement or release gate.

### 4. Confusing research order with release order

It is reasonable to study Flow, then Neux, then derive language needs. It does not follow that Flow Runtime should ship before the language foundation. Maintain two roadmaps:

- a **discovery roadmap** for problem cases, contracts, and architectural decisions; and
- a **delivery roadmap** for independently testable products.

The public roadmap is already closer to a delivery roadmap. The local requirements are closer to a discovery catalogue. They should not be forced into the same document.

### 5. Linux coupling through Neux

Neux is useful precisely because it is domain-specific. Making it the built-in execution substrate would leak Linux process, filesystem, privilege, service-manager, and packaging assumptions into Flow. Neux should integrate through the same declared capability and runner interfaces available to other tools.

### 6. The umbrella CLI becoming the architecture

A unified CLI is a user-experience layer, not a service locator, package manager, compiler kernel, secrets store, and workflow engine combined. Each project needs a direct stable interface. The umbrella CLI should arrive after those interfaces and mostly delegate, negotiate versions, and normalize presentation.

There is a related naming question: the language toolchain will itself need command-line access. Define the difference between the language compiler/toolchain command and “Neutral CLI” before either name becomes established.

### 7. Premature repository fragmentation

The organization roadmap says repositories will be established as projects become ready. Preserve that discipline. Split a repository when there is an independent release cadence, security boundary, maintainer group, or compatibility surface—not simply because the architecture diagram has another box. Conversely, do not share implementation-domain structs across projects merely because they live in one repository; use versioned contracts and conformance fixtures.

### 8. Provider neutrality collapsing into provider mimicry

Starting with one practical provider is correct for learning, but its event names, expression rules, matrix behavior, status model, secret scoping, and deployment concepts must not become Flow's implicit model. Capture the provider behind an adapter, record every limitation, and test the core with target-neutral fixtures plus deliberately incompatible capability sets.

### 9. Postponing security until the Runtime

Even an exporter handles untrusted repository content, source references, credentials, generated configuration, and privileged delivery transitions. The threat model begins at authoring and planning. Runtime adds more threats; it does not introduce security for the first time.

## Recommended architecture/discovery programme

This programme describes decisions and evidence, not implementation work.

### Stage A: establish the charter

- Choose the initial Flow product shape and primary user.
- State explicit non-goals for Flow Core, Flow Runtime, CLI, and Neux.
- Establish a shared glossary for definition, intent, plan, run, unit, operation, attempt, target, provider, capability, artifact, evidence, and environment.
- Resolve public names (`Neutral` versus `neutral-lang`, language CLI versus ecosystem CLI).
- Define what “provider neutral” promises and what it explicitly does not promise.

Exit evidence: short architecture decision records with named alternatives and reasons.

### Stage B: build a problem corpus

Select a small set of representative workflow stories, not a feature checklist. Include simple success, fan-out/fan-in, conditionally skipped work, invalid reference, unsupported capability, worker loss, retry, cancellation, untrusted contribution, protected delivery, and artifact promotion. For every story record actor, trust level, inputs, observable behavior, failure behavior, and evidence needed afterward.

Repeat this exercise independently for Neux before the Neutral foundation is frozen. Do not seek artificial sameness.

Exit evidence: reviewable use-case and failure-case packets with no syntax commitment.

### Stage C: define boundaries and conformance claims

- Separate the representations listed above and assign ownership/versioning.
- Specify adapter and runner responsibilities, including error ownership.
- Define capability declaration and compatibility diagnostics.
- Define which guarantees Flow Core can claim and which require Flow Runtime.
- Define compatibility dimensions separately: authoring input, normalized definition, plan, adapter, runner protocol, persisted state, and CLI.

Exit evidence: contract sketches, lifecycle/state descriptions, threat model, and provider-neutral conformance fixtures. These are not language semantics.

### Stage D: derive Neutral constraints

Compare the Flow and Neux corpora. Promote only genuinely cross-domain obligations into the Neutral language/toolchain problem statement. Keep domain policy and vocabulary in Flow and Neux. Establish behavior and invariants before stabilizing compiler IR or APIs.

Exit evidence: a narrow language charter, explicit exclusions, and traceability from every proposed common obligation back to more than one real domain need or a fundamental toolchain need.

### Stage E: future integration sequence

When implementation begins, prefer a walking skeleton:

1. Neutral foundation and direct toolchain interface;
2. Flow Core contract/validator/planner against the agreed fixtures;
3. a deterministic simulator plus one static target/export adapter;
4. optional Neutral-to-Flow authoring adapter;
5. thin direct Flow CLI, followed later by ecosystem CLI integration;
6. Flow Runtime only if operating it is an explicit product decision; and
7. Neux implementation on its own roadmap, with ordinary optional Flow integration.

No step should require Flow to build Neutral or require Neux to run Flow.

## Architecture decision gates still open

The lead should not approve an implementation roadmap until these are answered:

1. Is the first Flow deliverable an offline planner/exporter, a runtime, or a layered product?
2. Who is the first user: an individual repository author, a platform team, or an organization operating a CI service?
3. Is the first integration provider-native export, delegated remote execution, or a Neutral-owned runner?
4. What exact behavior is portable, and how are optional/target-specific capabilities disclosed?
5. Where is the canonical Flow contract owned and versioned?
6. Which representation is archival, and which may be regenerated?
7. What is the tenancy and untrusted-contribution threat model?
8. What compatibility promise, if any, applies before 1.0?
9. Which names identify the language repository, compiler command, toolchain CLI, and ecosystem CLI?
10. What observable scenario proves each milestone, including failure and recovery rather than only success?

## Final recommendation

Continue the present Flow investigation, but rename its output mentally from “v0 backlog” to “capability and risk catalogue.” Do not derive language features directly from it, do not treat every required item as a first-release gate, and do not implement a Flow Runtime merely because the requirements enumerate runtime concerns.

The ecosystem will remain tractable if it is organized around stable, one-way contracts:

- Neutral provides a domain-independent language/toolchain;
- Flow owns CI/CD intent, planning, adapters, and optionally a separately bounded runtime;
- Neux owns Linux system tooling and integrates as an ordinary capability;
- the CLI coordinates already independent tools; and
- providers, runners, secrets, artifacts, identity, and policy remain behind explicit interfaces.

The decisive architectural move is not choosing syntax or an IR. It is keeping compiler meaning, Flow intent, target planning, and runtime history separate long enough for each to become understandable.

## Sources consulted

Local:

- [CI/CD Capability Requirements](../REQUIREMENTS.md)
- [v0 checklist](../v0/v0-checklist.md)
- [v1 checklist](../v1/v1-checklist.md)
- [v2 checklist](../v2/v2-checklist.md)

Public Neutral sources (retrieved 2026-08-13):

- [Neutral Ecosystem organization profile](https://github.com/neutral-ecosystem/.github/blob/main/profile/README.md)
- [Neutral ecosystem roadmap](https://github.com/neutral-ecosystem/.github/blob/main/ROADMAP.md)
- [Neutral website](https://neutral.younesrabeh.workers.dev/)
- [`neutral-lang` website page](https://neutral.younesrabeh.workers.dev/neutral-lang/)
- [`neutral-lang` website roadmap](https://neutral.younesrabeh.workers.dev/roadmap/)
