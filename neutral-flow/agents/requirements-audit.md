# Requirements and milestone audit

## Executive judgment

`REQUIREMENTS.md` is a useful capability inventory, especially where it separates orchestration from software-delivery workloads (`REQUIREMENTS.md`, **Common Software-Delivery Work**, lines 185-219), treats the dependency graph as primary (`Dependency Graph`, lines 138-151), and insists that provider mismatch must be explicit (`Capability Detection`, lines 503-510). Its warning against turning every CI/CD feature into a Neutral language feature is also the correct boundary (`Important Boundary for Neutral`, lines 1257-1317).

It is not yet a requirements specification from which an architecture or release plan can safely be derived. It has no named users, bounded product responsibility, representative journeys, measurable acceptance criteria, deployment assumptions, quality attributes, or explicit non-goals. Most entries are capability slogans rather than falsifiable requirements. The later “Architectural Model” then silently chooses a vertically integrated orchestration platform despite the opening promise to avoid implementation detail (`REQUIREMENTS.md`, lines 3-17 versus lines 1208-1253).

The v0/v1/v2 split is not viable as a delivery sequence:

| File | Mechanical source | Size | Architectural meaning today |
| --- | --- | ---: | --- |
| `v0/v0-checklist.md` | `REQUIREMENTS.md` **REQUIRED** section, lines 39-597 | 41 sections / 282 items | A mature CI/CD platform, not a smallest coherent release |
| `v1/v1-checklist.md` | **HELPFUL**, lines 603-968 | 37 sections / 184 items | A mixture of foundations, UX, optimizations, integrations, and scale features |
| `v2/v2-checklist.md` | **SPECULATIVE**, lines 972-1121 | 17 sections / 64 items | Seventeen mostly independent research directions, not one release |

The checklists are essentially verbatim slices of the parent file. They add no dependency order, exit criteria, use-case outcome, architectural risk retired, or explicit deferral. “Required/helpful/speculative” can remain prioritization metadata, but it cannot double as versioning.

## Contradictions and unresolved tensions

1. **A portable abstraction and a full CI/CD product are conflated.** The stated problem is provider-neutral intent (`Provider Independence`, lines 490-500), but REQUIRED also makes Neutral responsible for triggers, scheduling, worker recovery, identity, secrets, artifact storage, deployment state, audit, and cleanup (lines 51-597). Those could instead be owned by source hosts, execution providers, external stores, deployment controllers, or Neutral itself. Until ownership is explicit, the architecture cannot decide whether Neutral Flow is a model/compiler, a control plane, an execution service, an adapter layer, or all four.

2. **The supposed abstract pipeline is internally inconsistent.** The execution-cycle diagram determines capabilities before constructing the graph and planning (`REQUIREMENTS.md`, lines 1143-1156), while the architectural diagram constructs the graph, derives capability requirements, plans, matches providers, and then produces a plan (lines 1212-1229). `Execution Planning` says the plan itself determines environments, resources, and permissions (lines 155-165). These are mutually dependent activities, not a justified one-way pipeline. `ARCHITECTURE.md` should define artifacts and validation phases, including which checks may remain deferred, rather than canonize either diagram.

3. **A fully known static plan conflicts with runtime-derived behavior.** Planning is expected to resolve dependencies and reject impossible plans before resources are allocated (`Execution Planning`, lines 157-165), yet configuration and conditions may depend on earlier outputs (`Inputs and Configuration`, lines 119-121; `Conditions`, lines 225-232). Matrix expansion is later added in v1 (`v1/v1-checklist.md`, lines 31-38). The architecture must state whether a run is a finite static DAG, a graph with deferred predicates, or a graph that can expand at runtime. “Validate required outputs before consumption” (`REQUIREMENTS.md`, lines 127-134) must also distinguish static declaration checks from runtime materialization checks.

4. **Provider neutrality depends on capabilities classified as optional.** REQUIRED promises multiple source systems, multiple execution targets, capability extensions, and provider translation (`REQUIREMENTS.md`, lines 41-47 and 490-510). However, the extension contract and its versioning/isolation are v1 (`v1/v1-checklist.md`, **Extension Model**, lines 337-345), as are local provider compatibility checks (lines 249-254) and workflow format evolution (lines 349-355). A stable, safe adapter boundary and compatibility policy are prerequisites for any credible provider-neutral v0, not later conveniences.

5. **Resource safety is required while its control mechanism is optional.** v0 must prevent resource exhaustion from corrupting behavior (`v0/v0-checklist.md`, **Resources**, lines 233-240) and execute independent work concurrently (lines 199-205), but limits, exclusion groups, and deployment conflict prevention are deferred to v1 (`v1/v1-checklist.md`, **Concurrency Control**, lines 72-78). Admission control, bounded queues, and mutual exclusion are correctness/availability mechanisms once execution or deployment is in scope.

6. **Historical identity is required while lifecycle rules are optional or speculative.** v0 promises exact workflow identity, history, artifacts, provenance, and audit (`v0/v0-checklist.md`, lines 52-70 and 372-434). Retention and workflow evolution are v1 (`v1/v1-checklist.md`, lines 197-202 and 349-355), while replay is v2 (`v2/v2-checklist.md`, lines 122-126). The current text does not say whether preserving identity means a locator, content digest, full snapshot, or the transitive closure of imported components, policies, adapters, and tools. Nor does it say how long records remain or what a rerun uses.

7. **Security is both fundamental and under-specified.** v0 includes untrusted commands, credentials, permissions, isolation, and protected deployment (`v0/v0-checklist.md`, lines 132-165 and 329-390), but organization policy and controlled overrides are v1 (lines 298-314). “Avoid intentionally exposing protected information” in logging (`REQUIREMENTS.md`, line 450) is far weaker than a security requirement and cannot address a command that echoes a secret. A threat model, trust zones, authorization decision points, credential issuance/lifetime, and honest masking limitations must precede a hosted or multi-user executor. If v0 is instead trusted local-only software, that constraint must be explicit.

8. **Exactly-once effects are implied where they cannot generally be guaranteed.** Duplicate event execution must be prevented (`REQUIREMENTS.md`, lines 53-60), completed work must not repeat after coordinator recovery (lines 281-292), and retries are allowed (lines 319-326). Dispatch, acknowledgement, and state persistence can fail independently; arbitrary commands and deployments may have irreversible external effects. The architecture needs explicit delivery guarantees, idempotency keys, leases, reconciliation, and a distinction between duplicate logical runs, duplicate attempts, and repeated external side effects. “Exactly once” must not be implied.

9. **Cancellation and cleanup are stated as immediate guarantees despite failures and partitions.** v0 requires timed-out work to stop, resources to be cleaned, and cancellation to propagate (`v0/v0-checklist.md`, lines 293-311 and 552-559). A disconnected or failed worker may be unstoppable and cleanup may be delayed. The truthful contract is a requested transition plus bounded best effort, eventual reconciliation, and visible orphaned/cleanup-pending states.

10. **“Same intent on different providers” has no equivalence contract.** Provider independence requires preserved meaning (`REQUIREMENTS.md`, lines 494-510), while execution permits arbitrary programs in differing environments (lines 169-181 and 246-255). Environment, network, filesystem, shell, identity, artifact, and cancellation behavior can differ materially. Portability needs declared profiles and explicit fidelity/unsupported results; a universal least-common-denominator promise is neither testable nor useful.

11. **The classification rule contradicts the speculative list.** SPECULATIVE capabilities “should not influence the initial architecture” (`REQUIREMENTS.md`, lines 31-33 and 972-975), yet semantic comparison, formal verification, simulation, and replay (`v2/v2-checklist.md`, lines 97-126) depend on early choices about canonical identity, deterministic planning, event history, and versioned behavior. They should not be built now, but desired future option value can constrain irreversible decisions. Conversely, predictive execution and carbon-aware scheduling need not share a release merely because both are speculative.

## Category mistakes and hidden assumptions

- **One list mixes five different kinds of concern:** author-expressed intent (dependencies, conditions), engine guarantees (durability, retry), administrator policy (permissions, retention), provider facts (capabilities/resources), and presentation/integrations (visualization, notifications, reports). This makes every item look like a core-model feature. `ARCHITECTURE.md` should assign each requirement to an owner and layer.
- **Workload examples leak back into the platform scope.** The document correctly says build/test/scan/deploy are orchestrated workloads, not engine primitives (lines 185-219), but later promotes deployment, test reporting, coverage, security analysis, SBOM production, progressive delivery, and rollback into system capabilities (lines 530-585 and 713-795). Most should be expressed through general contracts for external action, evidence, artifacts, gates, and observation unless a concrete use case proves they require privileged core behavior.
- **Several clusters are duplicates rather than separate architectural concepts.** Caching, incremental execution, and optimization overlap (`REQUIREMENTS.md`, lines 654-670 and 879-886); resources, resource-aware scheduling, dynamic selection, and self-managed resources overlap (lines 270-277, 693-709, 929-935); workflow components, shared configuration, and templates overlap (lines 603-629); logging, history, audit, provenance, and evidence all require a common lineage/retention model (lines 431-471).
- **Data classifications are not orthogonal.** “ordinary values, files, artifacts, and sensitive values” (`REQUIREMENTS.md`, line 134) treats storage form, lifecycle, and sensitivity as mutually exclusive. A file or artifact can be sensitive; a value can be an artifact descriptor. Architecture should model these as separate axes without inventing language syntax.
- **A central authoritative scheduler, durable store, trusted capability registry, reliable clocks, finite batch jobs, and machine-readable provider behavior are assumed but never declared.** Long pauses, delayed callbacks, partitions, clock skew, stale capability data, and long-running/watch-style work are absent.
- **“Exact source revision” assumes immutable versioned source.** Inputs may be mutable URLs, generated content, submodules, external dependencies, or a dirty local tree (`Source and Input Context`, lines 39-47). Identity, snapshotting, availability, and reproducibility are distinct guarantees.
- **The result model is too small for the required lifecycle.** Waiting/running/success/failure/skip/cancel/timeout/infrastructure failure (`REQUIREMENTS.md`, lines 352-362) omits planning, queued, blocked, unschedulable, approval-paused, retrying, cancellation-requested, lost/orphaned, superseded, and cleanup-pending states. It also leaves join/result aggregation undefined.
- **The plan assumes one scalar workflow result.** Failure tolerance, joins, skipped branches, cancellations, partial deployments, and evidence gates make aggregation a policy, not an obvious calculation (`Result Model`, line 362; `Failure Handling`, lines 306-315).

## Missing architecture-defining requirements

These gaps should be resolved before choosing components or implementation technology:

1. **Product charter and responsibility boundary:** primary users, jobs-to-be-done, supported topology, owned versus delegated services, and explicit non-goals. In particular, decide whether Flow executes work or produces portable plans for other executors.
2. **Reference scenarios and negative scenarios:** at least a small workflow, fan-out/fan-in, output-dependent condition, coordinator restart, worker loss, duplicate event, cancelled deployment, provider mismatch, untrusted contribution, secret-bearing work, and historical rerun. Each needs an observable pass/fail outcome.
3. **Identity and lineage model:** immutable identities for logical run, plan, work unit, attempt, input snapshot, complete workflow closure, policy set, adapter/capability snapshot, environment, output, artifact, evidence, deployment, and actor. Define which are content-addressed and which are locators.
4. **Lifecycle and consistency contract:** valid state transitions, terminality, event ordering, late results, leases, acknowledgement boundaries, retry eligibility, idempotency scope, reconciliation, and partial failure behavior.
5. **Graph/planning contract:** static versus dynamic structure, phase-specific validation, deferred values, join policy, conditional edges/nodes, re-plan rules, and plan immutability.
6. **External-effect contract:** what cancellation can guarantee, how side-effecting attempts are identified, compensation versus rollback, and who reconciles uncertain outcomes.
7. **Portability contract:** distinct provider roles (source, execution, identity, secrets, artifact, deployment), capability vocabulary ownership/versioning, portable profiles, negotiation timing, and explicit degradation/rejection rules. Portability must be demonstrated against at least two materially different targets.
8. **Threat model and tenancy model:** project/organization ownership, tenant isolation, trusted/untrusted inputs, control-plane/data-plane boundaries, authorization precedence, credential brokering, extension trust, artifact/log confidentiality, and audit tamper resistance.
9. **Quality attributes with budgets:** expected scale, queue and scheduling latency, availability, recovery objectives, data durability, maximum graph/output/log/artifact sizes, fairness, quotas, backpressure, and cost envelope. “Strong” and “where practical” are not testable (`REQUIREMENTS.md`, lines 3 and 864).
10. **Lifecycle governance:** retention, deletion, legal/audit holds, encryption, privacy/data location, schema/behavior compatibility, deprecation, migrations, and what remains inspectable when payloads or artifacts expire.
11. **Requirements traceability:** stable requirement IDs, rationale, owner/layer, priority, dependencies, verification method, and scenario coverage. Markdown checkboxes alone cannot establish completion.

## A viable way to stage the work

Do not merely rename the current buckets or keep their contents intact. Rebuild milestones as vertical slices that retire specific risks:

- **Architecture baseline (before v0):** settle charter, boundaries, glossary, invariants, state/identity model, trust assumptions, provider roles, quality budgets, and reference scenarios. Record unresolved decisions explicitly. This is the current project’s appropriate no-code outcome.
- **Earlier v0 candidate — superseded by `ARCHITECTURE.md`:** this audit initially proposed one bounded executable reference slice with immutable captured inputs/definition, a static finite graph, preflight validation, an inspectable plan, one execution target, durable run/attempt state, basic outputs/logs, timeout/cancellation requests, and restart reconciliation. The accepted architecture narrows v0 to offline Flow Core plus a deterministic simulator and one static binding/export adapter; durable execution now sits behind a separate Runtime decision gate. The audit's underlying point remains: any later executable slice must state whether it is trusted single-user/local or remotely hostile and make only matching security claims.
- **Earlier v1 candidate — superseded by `ARCHITECTURE.md`:** this audit grouped portability with executable-service hardening. The accepted v1 is narrower: add a second materially different static target, capability negotiation, versioned adapter contracts, and format-evolution rules, then demonstrate bounded portability without remote execution. Events, secrets, quotas, telemetry, and recovery tests belong only to a later executable profile if that profile passes its decision gate.
- **Later capability releases:** composition/registry, policy/governance, delivery integrations, cross-project coordination, authoring UX, and optimizations should be separate outcome-based increments. Each speculative research feature should be evidence-gated independently rather than bundled into “v2.”

The exact contents can change after scope decisions; the important correction is that each release is a coherent user journey plus explicit non-goals, invariants, and acceptance evidence—not a horizontal list of everything judged important.

## Concrete requests for `ARCHITECTURE.md`

`ARCHITECTURE.md` should include, in order:

1. A one-paragraph product charter, named users, owned responsibilities, delegated responsibilities, and non-goals.
2. A context/boundary view separating authoring/normalization, control plane, execution/data plane, and external source/identity/secret/artifact/deployment systems. This is a responsibility map, not a commitment to separate processes.
3. A glossary and identity/lineage table for every durable entity.
4. The run/work/attempt lifecycle, graph and planning invariants, and result aggregation rules.
5. Consistency, idempotency, retry, cancellation, cleanup, and disaster-recovery guarantees—including what cannot be guaranteed.
6. Trust zones, threat assumptions, authorization points, secret flow, extension isolation, and audit guarantees.
7. Provider roles, portable capability profiles, negotiation/rejection behavior, and conformance strategy.
8. Persistence and retention responsibilities for definitions, plans, events, logs, outputs, artifacts, evidence, and deployment observations.
9. Quantified quality attributes and capacity limits.
10. Scenario-to-requirement traceability, architecture decisions with alternatives, open questions, risks, and milestone exit criteria.

Keep the strong boundary at `REQUIREMENTS.md` lines 1257-1317: this architecture should explain the CI/CD domain and its contracts without proposing Neutral syntax or prematurely assigning CI/CD-specific language semantics.
