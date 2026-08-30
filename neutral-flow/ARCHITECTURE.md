# Neutral Flow architecture

Status: proposed discovery baseline

Date: 2026-08-14

Scope: product and system architecture; no implementation, configuration syntax,
Neutral language syntax, or Neutral language semantics are defined here.

Visual architecture diagrams are maintained as private design material.

### Ecosystem premise

The ecosystem contains three applications:

1. **neutral-lang** accepts `.neu` source and generates Neutral IR.
2. **neutral-flow** is a separate application that consumes Neutral IR and
   applies pipeline-specific logic to create CI/CD behavior.
3. **neux** is a separate application that consumes Neutral IR and applies
   OS-specific logic to abstract GNU command-shell operations.

A future Flow GUI is an authoring surface. It transcribes the user's visual
model into `.neu`, which still passes through `neutral-lang`; the GUI does not
emit a private Flow format or bypass the language toolchain. Neutral IR is the
only shared application boundary described here. Flow and Neux do not depend on
each other.

## Executive decision

Neutral Flow should be developed as a **layered, provider-neutral workflow
planning and portability system**, not as one indivisible CI/CD platform.

The first Neutral Flow deliverable should be **Flow Core**: an independently
useful facility for accepting Neutral IR generated from `.neu`, validating its
pipeline-specific interpretation,
producing an inspectable logical plan, collecting declared requirements,
conservatively inferring requirements for known operations, and explaining
whether captured target claims and bounded conformance evidence satisfy that
plan's requirements. An adapter may bind and statically export the plan to one
practical provider; actual post-export behavior remains provider-owned.
Effectful delegated execution and a Neutral-owned durable runtime are separate,
later product decisions.

This choice preserves the ambition in [REQUIREMENTS.md](REQUIREMENTS.md) without
requiring Neutral to build a source host, secrets manager, artifact registry,
distributed scheduler, worker fleet, deployment controller, audit service, and
programming language simultaneously.

The governing architectural decisions are:

1. The existing requirements and checklists are a **capability and risk
   catalogue**, not release definitions.
2. Provider neutrality means explicit guarantees, capability negotiation, and
   visible rejection. It does not mean universal provider equivalence or silent
   degradation.
3. `.neu` source, Neutral IR, a Flow-internal normalized definition, a logical
   plan, a target-bound plan, and runtime history are different records. Neutral
   IR is the cross-application compiler output; the later records remain internal
   to Flow and must not be presented as additional ecosystem IRs.
4. A dependency graph determines readiness. Durable state machines determine
   legal lifecycle transitions. Logical work and execution attempts remain
   distinct.
5. Definitions and plans used by a run are immutable and identifiable.
   Historical execution is never silently changed by later edits.
6. Accepted work may be redelivered and provider-call outcomes may be
   indeterminate. Neutral Flow must not promise exactly-once external effects.
7. Artifacts are identified by content; mutable names and locations are only
   references. Evidence and provenance are separate, typed claims about those
   identities.
8. Untrusted authoring, ordinary execution, privileged provider actions,
   credential issuance, and evidence signing are separate trust zones.
9. The three applications—neutral-lang, neutral-flow, and neux—must remain
   independently releasable. Flow and Neux depend on the Neutral IR contract,
   not on each other.
10. Study Flow first to discover constraints, then study Neux as an independent
    second domain. This is a discovery order, not a reason to implement Flow
    beneath an unstable language foundation.
11. Trust-zone handover re-authenticates the acting workload and mints new,
    destination-scoped authority; bearer credentials are never forwarded through
    zones or queues.
12. Provider extensions are split by privilege layer and receive an explicit
    portability/degradation grade. Required behavior is never silently weakened.
13. Timeout initiates cancellation and reconciliation; it does not prove stop or
    cleanup. Durable finalizers and execution tombstones prevent late work from
    being resurrected after active state is retired.

## 1. What this document is correcting

[REQUIREMENTS.md](REQUIREMENTS.md) is valuable as a broad inventory. In
particular, it correctly makes the dependency graph primary, separates delivery
workloads from orchestration, requires explicit provider incompatibility, and
warns that a CI/CD need does not automatically imply a Neutral language feature.

It is not yet a bounded product specification. It names no first user or
operating model and assigns nearly every responsibility of a mature CI/CD
platform to one future system. The version files then copy classification into
release numbering:

| File | Present contents | Why it is not a release |
| --- | ---: | --- |
| v0 checklist | 41 sections, 282 checks | Includes a durable, secure, provider-neutral execution and deployment platform |
| v1 checklist | 37 sections, 184 checks | Mixes foundations, policy, UX, integrations, optimizations, and scale |
| v2 checklist | 17 sections, 64 checks | Bundles unrelated research programmes because all are speculative |

“Required for an eventual strong CI/CD system” does not mean “required for the
first coherent release.” Conversely, dry-run planning, local validation,
extension contracts, format evolution, and bounded concurrency are classified
as helpful even though some become prerequisites as soon as the corresponding
product profile is attempted.

The checklists should be retained as source material until a traceable
requirements catalogue replaces them. They should not be used to estimate or
approve v0, v1, or v2.

## 2. Product charter

### Mission

Neutral Flow makes software-delivery workflow intent **inspectable before it is
acted upon** and **portable where equivalent target guarantees exist**. It
captures what was requested, validates relationships and requirements, produces
a stable plan, and preserves an explanation of how that plan was handled by a
target.

### Initial users

The first direct users are:

- a `.neu` author who uses neutral-lang and then asks Flow to interpret the
  generated Neutral IR as a CI/CD pipeline;
- a Neutral IR or Flow target-integration author who needs precise obligations
  and conformance fixtures; and
- a repository maintainer who wants to discover invalid, incompatible, or
  declared trust-policy violations before remote execution.

Future runtime users are different: platform operators, security administrators,
auditors, and teams running protected delivery. Requirements for those users
belong to a Runtime profile and must not be smuggled into the first local,
non-executing tool.

### Jobs to be done

Flow should eventually let a user answer:

- What source and complete workflow definition are under consideration?
- Is the workflow internally valid?
- Which work is independent, conditional, blocked, or ordered by data?
- What permissions, environments, resources, and provider guarantees are
  required?
- Do a selected target's captured claims and bounded conformance evidence satisfy
  those guarantees, and who owns their enforcement?
- What exact plan would be exported or executed?
- If execution exists, what happened to each logical unit and each attempt?
- Which immutable artifact was produced, verified, promoted, or deployed?
- Which actor, policy, target, and evidence justified a protected action?

### Explicit non-goals

Flow Core is not:

- a `.neu` parser, Neutral compiler, IR generator, or language-semantics layer;
- a general-purpose programming language or a replacement for arbitrary tools;
- a taxonomy that makes build, test, scan, package, or deploy kernel primitives;
- a source-control host, package manager, secrets vault, artifact registry,
  container platform, or deployment system;
- a promise that all providers behave identically;
- a hosted multi-tenant CI service;
- a mandatory dependency of Neux; or
- a vehicle for predictive scheduling, automatic workflow generation, or other
  speculative features before ordinary behavior is understood.

## 3. Product layers and claims

The name “Neutral Flow” may refer to an ecosystem of layers. Every release and
document must say which layer it means.

| Layer | Owns | Does not own |
| --- | --- | --- |
| **Flow Core** | Consumption of Neutral IR, pipeline-specific interpretation, normalization, domain validation, graph analysis, declared/conservatively inferred requirements, logical planning, and diagnostics | `.neu` parsing, Neutral IR generation, proof of opaque-command effects, remote execution, secrets, infrastructure, or deployment state |
| **Target binding** | A versioned capability description, compatibility decision, and faithful target-specific binding | Portable meaning, permission to act, or silent substitutions |
| **Static exporter** | Deterministic provider configuration or submission material with no remote effects | Provider execution, observation, cancellation, or runtime security guarantees |
| **Delegated execution adapter** (optional) | Submission identity, provider-run mapping, deduplication or reconciliation, authorization, observation, and cancellation requests while a provider owns execution | Neutral-owned scheduling or stronger guarantees than the provider contract exposes |
| **Flow Runtime** (optional) | Durable run/work/attempt state, readiness, dispatch, recovery, retry decisions, cancellation convergence, and result aggregation | Authoring syntax, provider-specific implementation details, or unrestricted credentials |
| **Runner protocol and workers** (optional) | Bounded attempt execution, environment preparation, observations, and cleanup | Global scheduling, workflow parsing, policy authority, or broad ambient access |
| **Integration adapters** | Source events, identity, policy, secrets, artifacts, evidence, deployment, notification, and telemetry bridges | Becoming hidden core state or defining provider-neutral behavior |
| **User interfaces** | Direct Flow interface and future GUI authoring that transcribes to `.neu` | Bypassing neutral-lang or reimplementing compiler, planner, or runtime logic |

There are four materially different conformance claims:

- **Core conformance:** a definition is accepted, normalized, diagnosed, and
  planned consistently.
- **Static-export conformance:** an adapter faithfully produces provider material
  for a named capability profile, but Flow makes no runtime claim.
- **Delegated-execution conformance:** controlled end-to-end observations show
  that an adapter maps and reconciles provider-owned runs consistently with a
  named tested profile. The provider remains authoritative for workload
  execution and infrastructure behavior.
- **Runtime conformance:** a Neutral-owned control plane provides its documented
  durability, transition, security, and recovery guarantees.

A static exporter must never advertise delegated-execution or Runtime
guarantees. Sharing a brand does not make the operating models equivalent.
The public description of Flow as “execution tooling” can initially be satisfied
by delegated execution; it does not imply that Neutral must own a scheduler.

## 4. Ecosystem boundaries

| Application or surface | Owns | Boundary that must hold |
| --- | --- | --- |
| **neutral-lang** | `.neu` language, compiler behavior, diagnostics, and generation of Neutral IR | Must not embed CI/CD pipeline policy or GNU/Linux command policy |
| **neutral-flow** | Consumption of Neutral IR for pipeline-specific validation, planning, and CI/CD behavior | Must not parse `.neu`, generate Neutral IR, or depend on Neux |
| **neux** | Consumption of Neutral IR for OS-specific workflows and abstraction of GNU command-shell operations | Must not become a Flow runner or place OS concepts in neutral-lang |
| **Future GUI** | Visual authoring that transcribes to `.neu` | Must not bypass neutral-lang or introduce a private Flow language/IR |
| **External CI/CD systems** | Provider-owned execution behavior behind explicit Flow integrations | Must not define Neutral IR or portable language meaning |
| **GNU/Linux OS and shell** | OS behavior and command execution behind Neux | Must not define Neutral IR or Flow pipeline meaning |

The intended stable dependency direction is:

```text
text authoring ---\
                   -> .neu -> neutral-lang -> Neutral IR -> neutral-flow -> CI/CD
future Flow GUI --/                                \
                                                    -> neux -> GNU/Linux OS
```

There are exactly three applications in this model: neutral-lang, neutral-flow,
and neux. The GUI is a future authoring surface for `.neu`, not a fourth domain
application. Neutral IR is generated by neutral-lang and consumed by the two
domain applications; Flow and Neux do not generate competing IRs.

Repository count is not an architectural measure. Logical contracts should be
separate now; repositories should split only when release cadence, compatibility,
security, ownership, or contribution boundaries justify the cost.

### Discovery order versus delivery order

Top-down requirements discovery is appropriate:

1. Build a Flow problem and failure corpus.
2. In parallel, build a bounded, independent Neux problem corpus without
   beginning Neux product development.
3. Compare them and extract only genuinely cross-domain obligations.
4. Use that evidence before freezing cross-domain Neutral commitments.

This research does not block provisional Neutral specification, parser,
diagnostic, or toolchain experiments; it constrains what they may promise as
stable. Delivery remains foundation-first, consistent with the public ecosystem
roadmap. In particular, a public compiler API or stable compiler IR must not be
frozen before the behavior and invariants it must preserve are understood. The
future dependency is:

```text
domain evidence -> required behavior and invariants
                -> representations and lowering
                -> public compiler API
                -> compatibility commitment
```

This document deliberately stops before the “required behavior and invariants”
of the Neutral language itself.

## 5. Records and identities

A central design rule is **one record per meaning and lifecycle**. The following
records may initially share storage or a process, but they are not aliases.

| Record | Meaning | Lifecycle |
| --- | --- | --- |
| **`.neu` source** | Human-authored source, including source locations; a future GUI transcribes to this form | Mutable outside a captured compilation |
| **Compiler derivation manifest** | Source closure, immutable content/references, source map, compiler options/version, and generated Neutral IR identity | Immutable neutral-lang claim; completeness is bounded by compiler conformance |
| **Neutral IR submission** | Compiler-generated IR presented to neutral-flow with its derivation identity | Immutable compiler output consumed by Flow |
| **Input/source snapshot** | Project/workload and other non-authoring inputs presented to the workflow, including identity and integrity where obtainable | Immutable for a run |
| **Normalized definition** | Defaults, references, and composition resolved enough for portable validation | Immutable and versioned |
| **Logical plan** | Target-independent executable intent, graph, deferred values, and required guarantees | Immutable |
| **Capability snapshot** | Versioned target claims, limits, qualifiers, issuer, and freshness used to decide compatibility | Immutable evidence for a decision |
| **Compatibility decision** | Logical plan, capability snapshot, adapter behavior, per-element portability/degradation vector, aggregate grade, verdict, reasons, and validity | Immutable target-fit decision; rejection need not produce a bound plan |
| **Policy decision (including authorization)** | Subject record, actor/context, every decision-affecting input by value or immutable commitment/reference, evaluator and policy version, result, reason, and expiry | Immutable decision observation; permission remains distinct from capability |
| **Authority handover** | One trust-zone transition: subject, acting workload, source and destination zones, requested operation, audience/resource, granted scope, policy-decision identity, credential issuer/type, validity, and proof-binding method | Immutable audit/causation record; never contains the credential value |
| **Bound plan** | Accepted logical plan mapped to a target with explicit bindings and extensions, referencing its compatibility decision | Immutable target mapping |
| **Export artifact** | Exact generated bytes, content identity, provider schema, and adapter version | Immutable generated output; regenerating different bytes creates a new artifact |
| **Execution request** | Actor, cause, inputs, idempotency scope, applicable bound plan, and authorization decision | Immutable request record |
| **Run** | One logical execution of one pinned plan | Durable lifecycle state |
| **Logical work unit** | One planned unit whose result participates in the run | Durable lifecycle state |
| **Attempt** | One dispatch of one logical work unit to one executor | Append-only; retries create new attempts |
| **Execution tombstone** | Terminal identity, final fencing epoch, outcome/reason, effect disposition, outstanding finalizers, external references, and late-message retention horizon | Durable rejection/reconciliation anchor after active state or payloads are removed |
| **Artifact descriptor** | Media type, content digest, size, and optional retrieval locations | Content identity is immutable; locations may change |
| **Evidence/attestation** | Typed claim asserting an issuer or signer and immutable subjects | Immutable once issued; authentication, authority, expiry, and revocation are separate observations |
| **Deployment observation** | An identified observer's claim about a relationship between an artifact and a destination | Historical observation, not proof of current deployment state or artifact identity |
| **Audit event** | Security-relevant accepted action or decision | Append-oriented with deliberate retention |

### Identity invariants

- A mutable branch, tag, file path, URL, artifact tag, or provider name is a
  locator or alias, not sufficient historical identity.
- neutral-lang resolves and enumerates the `.neu` source closure under the
  language's rules. It generates Neutral IR and provides immutable content or
  references, source maps, relevant options, and compiler identity. Flow pins
  the IR and its derivation identity but does not reparse or reinterpret `.neu`
  syntax.
- Neutral IR identity binds its compiler derivation. It is the only
  cross-application compiler output in this model; Flow-internal plans are not
  renamed as new ecosystem IRs.
- A logical plan identifies the normalized definition, explicit inputs, and
  planner behavior from which it was derived. Target capabilities and evaluated
  policy facts belong to a later binding decision.
- A compatibility decision identifies its logical plan, capability snapshot,
  adapter behavior, verdict, reasons, and validity. A policy/authorization
  decision separately identifies its subject, actor/context, every
  decision-affecting input by protected value or immutable commitment/reference,
  evaluator and policy version, result, reason, and expiry. Its audit projection
  may retain only a safe subset, but the authoritative decision cannot omit an
  input that influenced the outcome. A bound plan exists only for an accepted
  compatibility decision; an export separately identifies the exact bytes
  generated from that bound plan.
- An authority handover records why one independently authenticated workload was
  allowed to act in a different trust zone. It references the authorization
  decision and credential metadata but never stores, hashes for correlation, or
  forwards the credential value itself.
- Runtime transitions never mutate the definition or plan.
- A tombstone never resurrects a terminal attempt. Later observations may append
  reconciliation facts or settle an indeterminate external-effect disposition,
  but they cannot replace the accepted terminal outcome or reuse its fencing
  epoch.
- A rerun must state whether it uses the historical pinned plan, replans the
  historical definition against current policy/capabilities, or uses current
  source. These are different operations.
- Opaque record identity, deterministic structural equality, possible future
  behavioral equivalence, and reproducible content identity are separate
  contracts. A store-assigned identity only names a record. v0 needs equality
  over a versioned internal plan projection for identical captured inputs and a
  closed set of behavior versions. Determining that differently structured plans
  are behaviorally equivalent is deferred research. A reproducible digest also
  requires canonical bytes and a named digest algorithm. The public interchange
  encoding may remain deferred, but ad hoc serialization cannot define either
  equality or archival content identity.

## 6. Validation and planning

Planning is a set of validation boundaries, not one irreversible pipeline whose
ordering can be guessed from the current requirements diagram.

### Conceptual stages

1. **Compile `.neu` with neutral-lang**: enumerate the source closure, preserve
   source locations, record compiler identity/options, and generate Neutral IR.
2. **Capture and validate the Neutral IR submission** in Flow: pin the compiler
   derivation, IR, workload inputs, and cause. Flow validates the IR contract and
   its pipeline-specific use; it does not parse `.neu` or generate IR.
3. **Normalize** defaults, references, composition, and declared data
   relationships without binding to a provider.
4. **Validate portable structure**: identities, references, declared inputs and
   outputs, cycles, graph constraints, and internal consistency.
5. **Collect and analyse requirements**: preserve declared capabilities,
   resources, isolation, permissions, artifact movement, and external-effect
   properties; conservatively infer more only for operations whose contracts
   Core understands. Report declared, inferred, and unverified requirements
   separately. Opaque work must declare authority and effect requirements, and
   protected profiles reject unknown effect contracts.
6. **Produce a logical plan** or precise portable diagnostics.
7. **Evaluate policy and target compatibility** against versioned facts and
   record separate decisions whether accepted or rejected.
8. **Bind** an accepted logical plan to a selected target, validating
   target-specific limits and extensions without rewriting portable meaning.
9. **Export** exact provider material, when requested, as an artifact distinct
   from the bound plan.
10. **Submit or execute** only after the bound plan and authorization are
   accepted by the component that owns execution.

Iteration may refine a compatibility or binding decision, but it does not mutate
the normalized definition or logical plan. Selecting a target-specific
alternative is an explicit new authoring input. Applying a behavior-changing
policy overlay is an explicit, inspectable transformation that produces new
normalized-definition and logical-plan identities.

Configuration sources are not one undifferentiated map. Author inputs, project
defaults, organization/platform constraints, target bindings, protected-resource
policy, secret handles, and runtime outputs have different owners and authority.
Each category needs a deterministic precedence rule, and the effective plan must
retain where every resolved value came from. A higher-authority policy may
constrain or deny a request; it must not silently rewrite the request into
different behavior. If a future profile allows policy to insert mandatory work,
that insertion follows the explicit overlay rule above; it does not mutate the
original logical plan.

### Validation levels

Diagnostics must identify which boundary rejected a request:

- authoring-source validity;
- Flow portable-model validity;
- policy admissibility;
- target capability compatibility;
- execution readiness, including current authorization and capacity; or
- runtime materialization, such as a declared earlier output not being produced.

Schema validity alone proves none of the later levels.

### Initial graph contract

The first Flow Core profile should use a **finite, static directed acyclic graph**.
Its topology is known after planning. Independent nodes are eligible for
parallelism; declared data dependencies also imply ordering where required.
This is a provisional Flow Core constraint for a bounded profile, not a Neutral
language semantic obligation.

v0 narrows this further to an **unconditional** static DAG. It may model declared
data edges, but no condition or value is evaluated from a runtime result. This
makes structural validation and static export testable without inventing an
execution model.

Before any later profile admits result-dependent values or conditions, it needs
a provider-independent Flow behavior contract for dependency satisfaction,
skip and failure propagation, absent outputs, false/error/unknown condition
results, and joins. That contract may permit a value to remain deferred, but it
does not permit a worker to create arbitrary new graph topology. Runtime graph
expansion, loops, long-lived event waits, and dynamic matrices are separate
future research choices because they change validation, durability,
authorization, and cost reasoning substantially. This behavior contract is
solely a Flow-profile contract: it specifies no authoring syntax, expression
language, or Neutral-language semantics.

This resolves an ambiguity in the current requirements: the plan can validate
that a required output is declared and reachable before execution, while only
runtime can validate that a successful attempt actually materialized it.

### Determinism and explanation

For the same normalized-definition identity, explicit inputs, and planner
behavior version, Flow should produce the same logical plan. For the same
logical plan, target capability snapshot, binding inputs, and adapter behavior
version, it should produce the same compatibility decision and bound plan. For
the same subject, actor/context, complete set of decision-affecting values or
commitments, evaluator behavior, and policy snapshot, it should produce the same
policy decision. A reproducible export also pins the bound plan, provider schema,
export options, and adapter behavior. Any external fact that influences a
decision—time, provider discovery, policy, approval, or random choice—must be
captured before downstream decisions rely on it.

Every rejection, skip, binding, and deliberate use of a preference should be
explainable from those recorded inputs. “The provider decided” is not an adequate
portable diagnostic.

### Plan explanation

A dry run is not merely “avoid external effects.” It should expose:

- captured definition and input identities;
- the dependency graph and possible parallelism;
- work known to be eligible, known to be skipped, or deferred;
- required guarantees and optional preferences with their origins;
- requested permissions, opaque secret handles, and protected resources;
- target compatibility, quantitative limits, and portability-reducing
  extensions;
- policy decisions already known and those requiring later re-evaluation; and
- exact diagnostics mapped back to the authoring source.

This is part of the first Core outcome, not a presentation feature added
after remote execution exists.

## 7. Runtime architecture, if built

Flow Core does not require a Neutral-owned runtime. This section defines the
boundary that a future runtime must respect so that Core is not redesigned later.

### Graph and state machines have different jobs

- The dependency DAG answers which logical work *may become ready*.
- Persistent lifecycle machines answer whether a requested transition is legal
  for a run, logical unit, attempt, approval, lease, or cleanup action.

A single status string is insufficient. Runtime observation should keep at least
these dimensions distinct:

- lifecycle phase, such as planning, queued, active, settling, or finished;
- outcome, such as success, failure, skipped, cancelled, timed out, partial, or
  indeterminate;
- reason/failure domain, such as workload, infrastructure, orchestration, policy,
  provider, or invalid input; and
- convergence state, such as cancellation requested, worker lost, orphan
  suspected, or cleanup pending.

The exact public state vocabulary requires its own specification. The invariant
is that distinct facts must not be erased to make the model look simpler.

### State authority

- One logical control-plane authority per run aggregate accepts state
  transitions. It may be redundantly implemented, but competing writers must be
  serialized through the same authority and consistency rule.
- Accepted transitions and external observations form an ordered, durable,
  append-oriented record sufficient to reconstruct authoritative state. Security
  audit is a separate, linked record with different retention and disclosure.
- The minimum accepted record carries a stable transition/observation identity,
  run and entity identity, monotonic aggregate revision, expected prior revision,
  attempt/lease/fencing epoch where relevant, causation, authenticated
  actor/workload identity, occurred-at and accepted-at times, and the
  schema/interpreter version needed to recover across upgrades. Ordering is
  required within a run aggregate; no global order is implied.
- Materialized views and snapshots may make reads efficient but are not the only
  evidence that a transition occurred.
- Worker messages are observations, not direct database mutations. The authority
  validates attempt identity, lease, authorization, current state, and transition
  legality before accepting them.
- Late and duplicate results remain inspectable and cannot overwrite an already
  accepted terminal attempt.
- A lease or heartbeat can establish that a worker is currently responsible; it
  cannot prove an external side effect did not happen after contact was lost.

This does not prescribe an event-sourcing product or database. It prescribes the
recoverability and authority properties that storage must satisfy.

The runtime must also define its transactional boundaries. At minimum, ingress
deduplication and request creation, an accepted transition and its durable intent
to dispatch, and attempt-result acceptance plus newly ready work cannot be left
as unrelated best-effort writes. A transactional outbox/inbox or an equivalent
reconciliation design is required wherever state storage and delivery cannot
share one transaction. The mechanism is an implementation choice; preventing a
crash gap between authoritative state and external delivery is not.

### Delivery and retry guarantees

The honest baseline is:

- before durable acceptance a message can be lost; Flow acknowledges an ingress
  request only after durably recording its deduplication key and logical request;
- after acceptance, ingress, dispatch, acknowledgement, and provider calls may
  be repeated;
- the control plane deduplicates its own accepted decisions, and a runner
  durably claims an `(attempt identity, fencing token)` before executing it;
- stale fencing tokens and duplicate deliveries of the same admitted attempt are
  rejected. If a target cannot provide fenced admission, that is an explicit
  capability limitation and effectful work is not automatically redispatched;
- admission fencing prevents duplicate admission only; it cannot stop a stale,
  already-running worker from producing an arbitrary external effect after a
  partition. A replacement effectful attempt cannot start until the prior
  outcome is terminal or reconciled unless every affected resource enforces the
  same fence/precondition or the complete effect contract makes repetition safe,
  for example through provider-enforced idempotency with an adequate horizon;
- retries create new attempts and preserve earlier attempts;
- retry eligibility depends on failure class and the external-effect contract;
  and
- an arbitrary command or deployment is not assumed idempotent.

Every effectful operation must declare one of these strategies during planning,
or automatic retry is rejected:

- **safe automatic retry:** provider-enforced idempotency semantics or an
  enforced compare-and-set/precondition. An idempotency key contract states its
  scope, retention horizon, and response to reuse with different request bytes;
- **ambiguity resolution before retry:** authoritative read-after-write
  reconciliation against a desired identity;
- **recovery after a confirmed effect:** a separately authorized and separately
  retryable compensation, whose own failure remains visible and which does not
  imply that the original effect never occurred; or
- **no automatic retry:** operator intervention when the outcome cannot be
  safely established.

“Exactly once” is not a Neutral Flow guarantee. The defensible claim is durable
orchestration that redelivers accepted work as needed, fences attempt admission
where the target supports it, and uses explicit deduplication and side-effect
reconciliation. Admission fencing does not fence arbitrary external effects. A
provider call can succeed remotely while returning no confirmation; such an
outcome remains indeterminate until reconciled or resolved by explicit operator
policy.

### Cancellation, timeout, and cleanup

Cancellation is a persisted request followed by convergence. A disconnected
worker or external provider may not stop immediately—or at all. Timeout is an
observation and policy decision, not proof that a process ceased at that instant.
Cleanup can fail and must be retried or surfaced as cleanup-pending. Passage of
time alone never turns an unknown external effect into a safe failure, safe retry,
or success.

Every executable profile defines these ordered deadlines per operation class;
there are no universal duration values:

1. **Execution deadline.** Persist `timeout-observed`, stop accepting ordinary
   progress for the expired lease, stop issuing credentials, request revocation
   of issued credentials where supported, rely on their short expiry otherwise,
   and persist `cancellation-requested`. This does not claim the process stopped
   or that a leaked credential became unusable immediately.
2. **Cancellation grace deadline.** If positive termination evidence is absent,
   mark convergence `worker-lost` or `provider-unconfirmed`, fence future
   admission with a higher epoch, and classify the external effect as
   `none-known`, `confirmed`, or `indeterminate`. An effectful replacement starts
   only under the retry strategies in the previous section.
3. **Reconciliation deadline.** Apply the declared fallback: authoritative
   lookup, provider-enforced idempotent retry, separately authorized
   compensation, resource quarantine, or manual intervention. Exhausting this
   deadline preserves `indeterminate`; it does not manufacture certainty.
4. **Cleanup deadline.** Keep cleanup finalizers for every owned resource. A
   failed finalizer remains visible as `cleanup-pending` or `orphaned`. Force
   release requires a separately authorized operator decision that records the
   unresolved obligation, provider mapping, and residual risk in an equally
   durable exception register before removing the finalizer; it never records
   cleanup as successful.
5. **Tombstone-retention deadline.** Active scheduling payloads may be removed
   only after the execution tombstone and required audit/evidence references are
   durable. The tombstone remains through the maximum of the documented message
   redelivery, provider-callback, lease/fence, credential-validity/revocation,
   reconciliation, and incident-investigation horizons, plus clock-skew margin.

The timeout fallback is selected before execution from the effect contract:

| Effect class | Timeout fallback |
| --- | --- |
| Pure or isolated local computation | Request stop, fence admission, verify process/container termination, run finalizers, then permit a new attempt |
| Provider-enforced idempotent action | Reconcile by idempotency key; retry with the same operation key only inside the provider's documented retention horizon |
| Desired-state/reconcilable action | Read authoritative provider state by stable operation/resource identity, then converge or retry according to the observed state |
| Compensatable action | Reconcile first; if the effect is confirmed, request a separately authorized compensation and record both outcomes |
| Opaque or non-idempotent action | Do not retry automatically; quarantine affected resources and require an operator decision |

No fallback may be upgraded to a safer class because its deadline expired.

### Execution tombstones and late messages

An execution tombstone is the definitive non-resurrection record for a retired
request, run, work unit, attempt, or owned external-resource mapping. It contains
no secret values and records at least:

- tenant/project and entity identity, parent run/work identities, terminal
  aggregate revision, and final attempt/fencing epoch;
- terminal lifecycle outcome and reason, timeout/cancellation decision
  identities, accepted-at time, and the last accepted message sequence where the
  protocol supplies one;
- external-effect disposition (`none-known`, `confirmed`, `compensated`, or
  `indeterminate`) plus stable provider operation/resource identities;
- each cleanup finalizer, its owner, latest disposition, retry policy, and
  escalation owner;
- authority-handover and policy-decision identities, without credential values;
  and
- creation time, minimum retention-until time, and the policy/version that
  selected the horizon.

The retention-until value is a minimum, not an instruction to forget unresolved
risk. An `indeterminate` effect or incomplete finalizer pins the tombstone until
it is reconciled or moved to the equally durable exception register by the
explicit operator override described above.

Tombstone creation and removal of active scheduling state occur in one
transaction, or through an outbox/reconciler protocol that makes a missing
tombstone detectable and repairable. Payload deletion is separate: logs,
artifacts, or sensitive inputs may expire while the minimal tombstone remains.

After tombstoning:

- a duplicate request returns the recorded terminal identity/outcome when still
  within its idempotency contract; it never creates a new attempt accidentally;
- a message with the retired epoch is authenticated, recorded as a late or stale
  observation, and rejected from the state machine;
- a late provider result may append a reconciliation observation and settle an
  `indeterminate` effect disposition, but cannot change the accepted terminal
  attempt outcome, remove audit history, or make dependants ready retroactively;
- retry is always a new attempt with a new identity, epoch, authorization
  decision, and authority handover; and
- once the documented retention horizon expires, the system must still reject
  uncorrelatable callbacks at ingress. A provider capable of later callbacks
  than the horizon requires a longer-lived external-operation mapping; otherwise
  that provider profile is incompatible.

The finalizer pattern—mark deletion, retain cleanup obligations, delete only
after they settle—follows the control-plane precedent documented by
[Kubernetes finalizers](https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/).

### Result aggregation

The result of a run is an explicit aggregation policy over logical work, not an
obvious scalar. It must account for skipped paths, tolerated failures, failed
cleanup, cancellation, joins, protected actions, and indeterminate provider
effects. The normalized definition or governing policy identifies the aggregation
rule; UI code must not invent it after the fact.

## 8. Provider-neutrality contract

“Provider” is not one interface. Flow should distinguish at least these roles:

- source and event provider;
- execution target and capacity provider;
- environment/isolation provider;
- identity, policy, and secret provider;
- artifact and evidence store;
- privileged external-action or deployment provider; and
- log, notification, and telemetry destination.

One vendor may implement several roles, but the portable model must not assume
that it does.

### Capabilities

A target capability is a versioned claim about an observable guarantee. A useful
description includes:

- capability and schema version;
- scope and issuer;
- qualifiers and quantitative limits;
- relevant security/isolation strength;
- extension ownership;
- freshness or validity period; and
- evidence or conformance level behind the claim.

Capabilities are not merely booleans. “Can cancel,” for example, differs between
requesting termination, forcefully ending a local process, reconciling remote
work, and proving an external effect did not occur.

Flow should distinguish:

- **required guarantees**, whose absence rejects the plan; and
- **preferences/optimizations**, whose absence may be accepted only with a
  visible explanation and no semantic change.

Capability does not imply authorization. A target may be able to deploy while a
particular actor and plan are forbidden to do so. Compatibility and permission
are evaluated and reported separately.

A bound plan pins the capability snapshot used for its decision; pinning does
not force a target to keep that capability available. If a relevant claim is
expired or has changed before submission or dispatch, the owner of execution
must check again. An incompatible change refuses execution. Selecting a new
target, accepting a weaker preference, or changing bindings produces a new
recorded decision and bound-plan identity rather than silently mutating the old
one. A static export can only record the snapshot against which it was created;
Flow cannot control later provider drift after hand-off, so the export consumer
must revalidate dispatch-critical claims before use.

### Extensions and bindings

“Extension” is not one permission. Every provider extension is split by the
layer at which it acts:

| Extension layer | Permitted effect | Required treatment |
| --- | --- | --- |
| **E0 — descriptive metadata** | Documentation, display hints, or annotations with no planning, authorization, execution, or result effect | May be preserved and ignored only when its declaration proves it is non-behavioral |
| **E1 — binding data** | Selects provider names, identifiers, locations, or encodings for already-declared portable behavior | Lives only in the bound plan; target adapter validates it; cannot add work or authority |
| **E2 — execution behavior** | Adds or changes target behavior, lifecycle, retry, cancellation, result, or resource guarantees | Must-understand; explicit author/policy opt-in; creates a provider-extended bound-plan identity |
| **E3 — privileged behavior** | Requests credentials, protected environments, deployments, signing, a controlled policy exception, or control-plane mediation | Separate privileged adapter or isolated extension host; fresh authorization and trust handover required; direct policy bypass is never permitted |

An extension declaration includes a collision-resistant owner/name, schema and
behavior version, layer, affected plan elements, required capabilities,
permissions/effects, compatibility range, portability impact, and whether it is
must-understand. The adapter cannot self-classify privileged behavior as
metadata. Flow validates the declared class against observed behavior and policy;
an absent, contradictory, or unknown behavioral declaration fails closed.

Provider-specific data belongs in a binding associated with the portable plan,
not as fields that gradually turn Flow Core or Neutral IR into the first
provider's schema. E2 and E3 material cannot be copied into the portable logical
plan. A policy overlay that adds mandatory work remains an explicit new input as
defined in Section 6; it is not disguised as a provider extension.

### Portability and degradation result

Binding produces one explicit result. “Degradation” never means silently
weakening a required guarantee:

| Grade | Meaning | Permitted outcome |
| --- | --- | --- |
| **P0 — portable** | The named portable profile is satisfied without behavioral provider extensions | May bind; portable claim applies to the named tested targets |
| **P1 — preference loss only** | One or more declared preferences/optimizations are unavailable; observable required behavior is unchanged | May bind only with a recorded warning and the accepted preference decision |
| **P2 — provider-bound faithful** | E1 binding data is needed, but the provider still satisfies all required portable behavior | May bind; plan is target-bound while the portable source remains valid |
| **P3 — provider-extended** | Explicit E2 or E3 behavior lies outside the portable profile | May bind only after explicit opt-in and policy approval; no cross-provider portability claim for affected elements |
| **P4 — incompatible** | A required guarantee is absent, an extension is unknown/unsafe, or fidelity cannot be established | Reject; no export, submission, or execution |

The grade is computed per plan element and capability, then aggregated to the
least-portable grade for the bound plan. The compatibility decision retains the
full vector so one P3 element is not hidden behind a plan-level label. A later
provider or capability change creates a new compatibility decision; it cannot
downgrade an accepted bound plan in place.

This follows the established distinction between unsupported requirements and
optional hints in
[CWL 1.2.1](https://www.commonwl.org/v1.2/Workflow.html#Requirements_and_hints),
while making provider binding and extension degradation separately visible.

Authorization remains a separate verdict: `allowed`, `denied`, or
`indeterminate`. The actionable disposition is the pair `(portability grade,
authorization verdict)`. For example, P0 plus `denied` is technically compatible
but forbidden, while P4 plus `allowed` is still incompatible. Neither decision
overrides the other.

### Extension execution split

Extension trust follows the layer split rather than a single plugin mechanism:

- Flow Core parses E0 metadata and opaque extension declarations as bounded data;
  parsing them cannot load provider code, resolve credentials, access the network,
  or mutate the logical plan.
- A target adapter evaluates E1 binding data in an adapter boundary with only the
  logical plan, capability snapshot, and declared binding inputs. It returns a
  bound-plan candidate and diagnostics; it receives no execution credential.
- E2 execution logic runs only after binding in a separately versioned adapter or
  extension host with an allowlisted protocol, resource limits, explicit network
  destinations, pinned package/content identity, and no control-plane database
  access. Package signature or publisher identity establishes provenance, not
  permission.
- E3 requests cross through the privileged adapter/credential-broker boundary
  described in Section 9. They cannot execute in an ordinary worker or inherit an
  E2 credential.

An adapter crash, timeout, malformed response, undeclared effect, or attempt to
cross its assigned layer yields an adapter failure or P4 result. Flow never falls
back to running the extension in-process with broader privilege.

### Conformance

Provider neutrality is an architectural discipline, while portability claims
are bounded evidence about named profiles, targets, and adapter versions. The
programme needs:

- a provider-independent fixture suite with positive and negative cases;
- a deterministic reference target or simulator;
- one practical adapter for learning;
- a second, materially different target before claiming that the named profile
  is portable across those targets; and
- comparison of observable plan/result behavior, unsupported features, limits,
  cancellation, outputs, artifacts, and failure categories.

Given that Neutral currently lives on GitHub, a GitHub-based first adapter is a
pragmatic candidate for the ecosystem's own workflows. It must be treated as a
learning adapter, not the source of the core model. The simulator should precede
it, and the second target should differ structurally rather than being another
thin wrapper over the same substrate.

## 9. Security and trust architecture

CI/CD executes repository-controlled code near valuable credentials and release
systems. Security is not a v1 enhancement once execution or export of privileged
behavior is in scope.

### Trust zones

1. **Untrusted authoring and event input** — definitions, source contributions,
   event payloads, parameters, imported components, and trace context.
2. **Flow Core** — parses only its domain contract, performs bounded validation,
   and never needs secret values.
3. **Control plane** — owns accepted plans, lifecycle authority, authorization
   points, and durable state.
4. **Ordinary workers** — execute bounded attempts in isolation with no ambient
   control-plane or cross-project access.
5. **Privileged adapters and credential broker** — mediate protected provider
   operations and issue narrowly scoped, short-lived credentials.
6. **Evidence authority** — issues claims or produces verification decisions
   without exposing signing authority to tenant-controlled work.
7. **External systems** — retain their own authorization and consistency
   boundaries.

These are logical authority boundaries. Co-location in one process provides no
compromise containment if that process holds the union of credentials, signing
keys, and privileges. Before Flow claims credential isolation, protected
delivery, or trustworthy provenance, untrusted workers, credential/signing-key
holders, and privileged provider adapters require independently enforced
identities, key access, and process or platform isolation. Ordinary execution
and privileged provider actions never share a worker identity or ambient
credentials in such a profile.

### Trust-zone handover

A trust boundary is crossed by **re-authentication plus constrained delegation**,
not by copying the caller's bearer token into the next zone. The receiving zone
owns the authorization decision for its resource.

For each handover from zone A to zone B:

1. The receiving endpoint authenticates the immediate caller as its own workload
   identity and validates the caller's issuer/trust domain. Federation of trust
   roots may make a foreign identity verifiable; it does not authorize an action.
2. The caller presents an integrity-protected, immutable operation envelope
   containing the subject, acting workload, run/work/attempt identities,
   bound-plan and artifact digests where relevant, requested action, destination
   resource, causation identity, expiry, and a unique handover identity. The
   envelope contains no reusable credential.
3. The receiving policy point evaluates the subject and current actor separately,
   validates the complete delegation chain and plan/action binding, and records a
   fresh policy-decision identity. Impersonation is forbidden unless a named
   profile explicitly requires and audits it; delegation preserves both subject
   and actor. Delegation depth and permitted source/destination zone pairs are
   bounded by policy; an actor cannot extend the chain merely because it holds a
   credential.
4. A credential broker or destination-zone issuer mints a **new** credential for
   the destination audience/resource. Its scope is the intersection of the
   approved operation, actor authority, plan requirements, target policy, and
   requested scope—never the union. The credential is short-lived,
   non-renewable by the worker, attempt/action-bound, and sender-constrained
   where the identity system supports proof of possession. Lack of sender
   constraint is an explicit capability weakness that policy may reject or
   contain with a brokered single action and a tighter lifetime; it is never
   silently treated as equivalent.
5. Zone B verifies issuer, audience/resource, expiry/not-before, sender binding,
   subject, actor/delegation chain, scope, tenant/project/environment, handover
   identity, and current fencing epoch before acting. A token-valid result alone
   is not authorization. The handover identity is single-admission within the
   destination scope: consuming it and creating the protected action are atomic,
   or reconciled by an equivalent inbox/idempotency protocol.
6. The system persists the authority-handover record and policy-decision
   identity, not access tokens, refresh tokens, private keys, token digests, or
   proof material. Credentials are never placed in plans, queues, artifacts,
   logs, audit payloads, or general worker state.

Token exchange is issuance, not transfer of authority by possession. Exchanging
a token does not generally revoke or shorten the input token, so revocation
propagation is a separate control and short lifetimes remain necessary. A
receiver that cannot validate the handover locally and fail closed does not form
an acceptable privileged boundary.

For synchronous calls the credential exists only at the caller boundary. For
queued work, the queue carries the integrity-protected operation envelope and an
authorization reference; the worker obtains a fresh destination credential only
after admission. A queued bearer credential whose lifetime spans scheduling is a
design error. If an external provider accepts only bearer credentials, the
privileged adapter keeps the newly scoped credential inside its zone and performs
the provider call; the ordinary worker never receives it.

This design follows the subject/actor delegation distinction in
[RFC 8693](https://www.rfc-editor.org/rfc/rfc8693.html), the audience restriction
and sender-constraining guidance in
[RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html), and the separation of
cross-domain authentication from authorization in
[SPIFFE federation](https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/).

### Controls by product profile

Core and static export can express required guarantees, validate declared target
claims, and report violations; they cannot enforce a provider's runtime behavior
after exported material leaves Flow. The controls below are enforced only by a
Delegated Execution, Runtime, or Delivery profile when Flow owns the named
transition. Otherwise they are target obligations whose conformance is bounded
and explicit.

- Plans contain permission requirements and opaque secret handles, never secret
  values.
- Requester/subject, authenticated event producer, acting control-plane
  workload, worker attempt, provider adapter, approval actor, evidence signer,
  and builder/executor are distinct identities with an issuer or trust domain.
  An event, trace, run, or attempt identifier is never treated as authentication,
  and workload identity never silently inherits a human's authority.
- Authorization is checked during planning where possible and checked again at
  dispatch and every privileged transition, because policy and revocation change.
  Each privileged transition links the fresh policy-decision identity on which
  it relied.
- Credentials are resolved as late as practical, scoped to the attempt, target,
  action, project/environment, audience/resource, and short lifetime. They are
  sender-bound where the credential system supports it.
- Provider adapters validate caller, plan, attempt, target, and requested action;
  they also validate the recorded delegation chain. They are privileged deputies,
  not blind translators.
- Untrusted work cannot carry a mutable workspace or credentials into protected
  delivery. A new isolated unit consumes only declared, integrity-verified
  artifacts and evidence.
- Approval binds an actor and decision to a plan, artifact, operation, scope, and
  expiry. It is not a reusable boolean.
- Extension execution is isolated and governed like third-party code. A data-only
  extension mechanism must not accidentally become arbitrary control-plane code.
- Audit records exclude secrets and record policy identity, safe decision inputs,
  result, actor, and reason.
- Redaction occurs before persistence and export, but documentation must state
  that masking cannot undo a secret deliberately transformed or exfiltrated by
  untrusted code.

### Tenancy

The first Core release is a local, non-executing planning tool and makes no
multi-tenant runtime claim. Disconnected operation is supported only when all
definitions, policy inputs, and capability snapshots needed by the decision are
available locally. Before any shared Runtime is built, the project must define
tenant and project ownership, isolation strength, quotas, encryption boundaries,
operator access, data location, retention, and incident recovery. “Self-hosted”
does not remove those decisions.

## 10. Data, artifacts, evidence, and provenance

The present requirements treat values, files, artifacts, and sensitive values as
if they were exclusive kinds. They are separate dimensions:

- representation/transport: structured value, stream, file, or reference;
- lifecycle: ephemeral workspace data, cached data, retained artifact, or durable
  record;
- confidentiality: public, internal, sensitive, or secret;
- content verification: unknown, digest mismatch, or verified against a named
  content identity;
- evidence authentication: absent, unverified, or authenticated under identified
  key material;
- trust-policy evaluation: unevaluated, accepted, rejected, expired, or
  indeterminate under a named policy and trust-root version; and
- lineage: source, producer attempt, plan, environment, and evidence.

### Artifact rules

- Content digest, media type, and size form the stable artifact descriptor.
- Storage locations and human-readable names may be updated without changing the
  artifact's content identity.
- A protected promotion or deployment consumes the same verified digest that was
  approved; it does not rebuild source and assume equivalence.
- Every artifact consumer verifies retrieved bytes against the content identity
  before trusted use. A transport that cannot support that check cannot support
  a content-integrity claim for the artifact.
- Sensitive artifacts apply access and retention controls independently of their
  representation.

### Evidence rules

Evidence is a graph of typed claims about immutable subjects. Successful
signature verification proves only that the signed bytes verify under identified
key material. Signer identity and intent, key compromise or revocation, signer
authorization, builder/executor identity, and claim completeness remain
trust-policy questions.

A verification decision records the claim and subject identity, signature/key
status, signer and builder identities, policy/version, trust root, evaluation
time, revocation information available at that time, and result. It does not
rewrite the immutable attestation when trust or revocation state later changes.

Neutral Flow evidence integrations should interoperate with existing formats
rather than inventing a new provenance, attestation, SBOM, or
artifact-distribution vocabulary. The relevant reference models are OCI content
descriptors, in-toto attestations, SLSA provenance, and SPDX documents. Flow
records may link to those objects without pretending they are interchangeable.

### Logical storage responsibilities

A future Runtime needs logically distinct responsibilities for:

- immutable definitions and plans;
- authoritative transition state and projections;
- logs and bounded structured outputs;
- artifact content and descriptors;
- attestations/evidence and trust policy;
- security audit; and
- derived telemetry.

They may initially share infrastructure. They require different authority,
retention, confidentiality, and garbage-collection rules. Retention distinguishes
strong references that pin bytes—such as an active protected release or explicit
hold—from weak historical references that retain an identity, descriptor, and
metadata only. Deleting payload creates an auditable **payload-deletion marker**
and preserves referential meaning; it is not the execution tombstone defined in
Section 7. An audit event naming a digest does not by itself retain the bytes
forever.

## 11. Events, audit, and observability

### Event ingress

External events should enter through adapters using a common envelope model such
as CloudEvents where practical. CloudEvents `source` and `id` are asserted event
metadata, not producer authentication. Ingress preserves the authenticated
channel/principal separately when available, enforces limits, preserves the
original event or protected digest, validates declared schemas, normalizes
source-specific data, and atomically links deduplication to an execution request
inside Flow's authoritative transaction. No cross-system atomicity is implied;
acknowledgements and retries bridge that boundary.

Event identity, causation, correlation, trace identity, execution idempotency,
run identity, and attempt identity are different. The duplicate namespace
includes the authenticated principal/channel and tenant/trust scope when those
exist, plus producer `source` and event `id`. Reusing that identity with different
immutable content is a conflict. An unauthenticated event remains explicitly
untrusted and cannot initiate protected work without an independent
authorization transition.

Deduplication has an explicit retention horizon. Once it expires, a sufficiently
late redelivery may create another request; that is a documented guarantee and
observable outcome, not an accidental consequence of database cleanup.

CDEvents is useful for interoperability at CI/CD integration boundaries. Its
event taxonomy must not become the scheduler kernel or a replacement for the
authoritative transition model.

### Three kinds of operational record

- **Execution state** is the correctness and recovery source.
- **Audit** explains protected actions and decisions and needs deliberate,
  tamper-evident retention.
- **Telemetry** supports diagnosis and capacity decisions and may be sampled,
  aggregated, delayed, or lost.

Telemetry must never be the only execution history or provenance source.
Incoming trace context is untrusted correlation data, not identity or permission.
It is size-limited and validated, then sanitized or regenerated when crossing a
trust boundary; secrets are prohibited in trace state or baggage. High-cardinality
run and attempt identities belong in indexed records and trace attributes, not
default metric dimensions. OpenTelemetry CI/CD semantic conventions are currently
Release Candidate exporter mappings, not Neutral Flow's durable schema.

Diagnostics are a first-class product output. They retain authoring-source
locations through adaptation and identify the failing validation boundary,
required capability, policy, target limitation, or runtime fact.

## 12. Logical components and initial physical shape

The eventual logical responsibilities are:

- ingress adapters;
- immutable definition registry;
- normalizer and validator;
- planner;
- capability registry and target adapters;
- policy decision and credential boundary;
- orchestration state authority;
- scheduler/dispatcher;
- workers;
- provider-action adapters;
- artifact/evidence services; and
- audit/telemetry projections.

This is not a recommendation for twelve services.

Flow Core should begin as an independently invocable component with a thin direct
user interface and no mandatory server. Adapters should depend on its versioned
contract. If a Runtime is justified, start with a **modular control-plane
application and one authoritative transactional boundary**, plus workers as a
separate security/failure boundary and external blob storage where needed.

Split services only when a measured scaling boundary, privileged trust boundary,
availability objective, independent release cadence, or ownership boundary
requires it. A message bus, microservice fleet, Kubernetes dependency, and global
multi-region scheduler are not architectural virtues by themselves.

Likewise, OCI containers may be one execution-environment capability; they are
not the definition of work. Neux may be invoked as ordinary declared tooling; it
is not a privileged default runner.

## 13. Requirement ownership map

The 530 current capability checks become manageable when assigned to profiles
and owners rather than placed in one core model.

| Capability cluster | Primary owner |
| --- | --- |
| Definition, input declarations, graph, conditions, portable validation | Flow Core |
| Planning, diagnostics, required capabilities, dry run | Flow Core |
| Target facts, bindings, compatibility and provider extensions | Target adapters plus Flow Core contract |
| External events, schedules, deduplication | Ingress adapters and Runtime profile |
| Queuing, parallel dispatch, retry, timeout, cancellation, recovery | Runtime profile |
| Environment, resource enforcement, process isolation and cleanup | Execution target/runner contract |
| Actor identity, permissions, policy, credentials and secret delivery | External identity/policy/secret systems plus a narrow broker |
| Logs and structured attempt outputs | Runner observation contract plus Runtime storage |
| Artifacts, integrity, retention and provenance | Artifact/evidence integrations with Flow lineage |
| Deployment, promotion, gates, rollback and progressive delivery | Protected external-action adapters and reusable domain components |
| Test, coverage, security and SBOM reporting | Typed result/evidence integrations, not scheduler primitives |
| Visualization, notifications, comparisons and cost views | Derived read models and integrations |
| Predictive, generative, federated and formal features | Independent research backlog with separate evidence gates |

## 14. Reference problem corpus

Architecture decisions should be tested against a small, versioned corpus of
observable problems before a public representation or runtime is designed. The
corpus describes inputs, facts, expected records, diagnostics, and invariants;
it does not prescribe Neutral syntax or an implementation.

| ID | Reference problem | Architectural question exercised |
| --- | --- | --- |
| C1 | A mutable authoring dependency is resolved and captured | Is definition identity complete and reproducible? |
| C2 | A reference is missing or the graph contains a cycle | Are invalid definitions rejected with useful source diagnostics? |
| C3 | Independent work fans out and later joins structurally | Can the logical plan represent dependency and join structure without provider concepts? |
| C4 | A condition depends on a value unavailable during planning | Is deferred evaluation explicit without making topology dynamic? |
| C5 | A target lacks a required capability | Does binding fail closed and distinguish requirements from preferences? |
| C6 | Identical captured inputs are planned twice | Is deterministic structural equality over the versioned internal projection distinct from byte identity? |
| P1 | The same logical plan binds to two materially different targets | Which behavior is genuinely portable and which is an explicit extension? |
| P2 | A target capability description is stale, malformed, or inconsistent | Is compatibility reported as compatible, incompatible, or indeterminate honestly? |
| R1 | An accepted request or command is delivered more than once | Are durable acceptance, deduplication, and attempt identity distinct? |
| R2 | The coordinator crashes after dispatch but before recording the outcome | Can recovery avoid conflicting authority and fence stale attempts? |
| R3 | A worker disappears after an external effect may have occurred | Is the effect classified for safe retry, lookup, compensation, or manual reconciliation? |
| R4 | Cancellation races with completion and cleanup fails | Does the recorded result distinguish request, admission, observed stop, cleanup, and residual risk? |
| S1 | An untrusted contribution requests protected credentials or actions | Are planning, dispatch authorization, isolation, and delegation boundaries explicit? |
| S2 | A reviewed artifact is promoted without rebuilding | Does approval bind to the exact plan, artifact digest, operation, scope, and expiry? |
| S3 | Artifact content and signed evidence disagree | Does verification fail before a protected action and remain auditable? |
| E1 | A historical run is inspected after definitions, policy, and target facts changed | Can the decision be explained from archived authoritative records rather than current state? |

C1, C2, C3, C5, and C6 constrain the unconditional Flow Core v0. C4 is retained
as the gate for a later result-dependent Flow profile and is deliberately not a
v0 acceptance case. P-series cases constrain portability claims. R, S, and E
cases must be retained now as design constraints but become executable
conformance cases only for profiles that own runtime, protected actions, or
durable history. Neux needs its own independent problem corpus; overlap is
evidence for shared Neutral abstractions, not permission to couple the products
prematurely.

## 15. Development programme

### Architecture baseline — before v0

Produce and review:

- product charter, profiles, non-goals, glossary, and project boundaries;
- representative success, invalidity, incompatibility, security, and failure
  stories;
- immutable record/identity and compatibility policy;
- initial threat model;
- capability vocabulary governance rules;
- a requirements catalogue assigning detailed rationale, dependencies,
  scenarios, and verification methods to v0-owned and cross-cutting items. The
  remaining source items receive stable IDs, owner/profile, and an explicit bulk
  disposition (defer, delegate, or reject) until that profile is proposed;
- the minimum Neutral IR contract needed by Flow, a static CI/CD target adapter,
  and a named portable profile selected by architecture decisions;
- a versioned internal plan-comparison contract and closed set of v0 behavior
  inputs/versions; and
- measurable quality budgets for the chosen profile.

Exit is agreement on observable scenarios and decisions, not a count of document
checkboxes.

v0 implementation is gated on the Core-v0 decision gates below, the
chosen adapters' threat boundaries, and the Core quality budgets. The canonical
public interchange can remain experimental, but identity and comparison inside
the v0 conformance boundary cannot be left accidental.

### Recommended v0 — Flow Core

This v0 is a non-public research and conformance prototype. It may use manually
curated Neutral IR fixtures while neutral-lang is still being developed, but
those fixtures are not a second source language or a competing IR. A public
Flow path begins with `.neu → neutral-lang → Neutral IR → neutral-flow`. One
honest vertical slice should cover:

- captured Neutral IR derivation and workload-input identity;
- Neutral IR fixtures used only to test the consumer contract before the
  compiler is available, never presented as an authoring format;
- an end-to-end `.neu` compilation path as soon as neutral-lang exposes the
  required IR contract;
- a pinned normalized definition;
- an unconditional finite static DAG with declared inputs, outputs, and
  dependencies, but no result-dependent values or conditions;
- structural, reference, cycle, and capability diagnostics with source mapping;
- an immutable logical plan, deterministic structural comparison over a
  versioned internal projection, and inspectable dry run;
- required guarantees versus preferences;
- a deterministic simulator/reference target; and
- one learning target adapter that statically binds/exports a deliberately small,
  named profile without remote effects.

v0 should explicitly exclude remote event ingestion, result-dependent values and
conditions, a Neutral-owned worker fleet, delegated execution, shared secrets,
hosted multi-tenancy, deployment, promotion, broad reusability, dynamic graph
expansion, caching, and predictive features.

Its acceptance evidence is structural and diagnostic: identical captured inputs
and behavior versions produce equal internal plan projections; invalid graphs
fail before target binding/export; unsupported guarantees identify the exact
mismatch; and the adapter cannot silently weaken the plan. Equivalence between
differently structured plans is not a v0 claim.

### Recommended v1 — demonstrate bounded portability

Add a second materially different target, versioned adapter contracts,
capability-limit negotiation, format evolution rules, and behavior-oriented
conformance. Demonstrate which profile is portable and document every target
difference. Composition or authoring improvements may be added only when they
serve the validated scenarios.

This stage provides conformance evidence that one named profile/version is
structurally portable across the tested adapter and target versions when golden
binding/export tests agree. Execution portability requires controlled end-to-end
runs and observations on both named targets; a conformance harness may perform
those tests without making delegated execution a shipped product. Neither claim
proves universal provider neutrality. A second adapter whose core behavior is
copied from the first supplies little independent evidence.

### Delegated-execution decision gate

Static portability does not authorize an effectful adapter. Add delegated
execution only for a named user journey that requires Flow to submit and observe
provider-owned runs. Before that slice, settle submission identity and duplicate
handling, provider-run mapping, fresh authorization, observation ownership,
cancellation semantics, capability refresh, and reconciliation of ambiguous
provider outcomes. Its conformance evidence includes controlled end-to-end runs;
golden exported bytes alone are insufficient.

### Runtime decision gate

Do not assume a Neutral-owned Runtime is the inevitable next version. Build it
only if evidence shows that export to existing providers cannot provide a core
user outcome or that owning durable orchestration is itself the intended product.

Before an executable Runtime slice, settle:

- tenancy and trust model;
- state and transition specification;
- delivery, lease, retry, idempotency, and reconciliation contracts;
- authorization and short-lived credential flow;
- isolation and resource limits;
- data durability, recovery, retention, and deletion objectives; and
- an operations and incident-response model.

The first Runtime slice should be deliberately bounded: one trust/tenancy mode,
one runner class, durable run/work/attempt state, bounded logs and artifact
references, restart recovery, truthful cancellation, and fault-injection
evidence. Protected delivery is a later profile, not the test command with more
credentials.

### Later capabilities

Composition, template distribution, matrices, caching, cross-project
coordination, policy administration, approvals, delivery strategies, reporting,
self-managed runners, and optimization should be separate outcome-based
increments. Each item in the present v2 checklist needs its own research case;
there is no coherent “all speculative features” release.

### Ecosystem sequence

The broader programme should maintain separate roadmaps:

- **Discovery:** Flow corpus -> bounded, independent Neux research corpus ->
  comparison and cross-domain constraints -> Neutral foundation questions. Neux
  product development remains later and independent; provisional Neutral
  experiments need not wait for the comparison.
- **Public delivery:** Neutral behavior/toolchain foundation -> stable Neutral IR
  contract -> `.neu` compilation -> neutral-flow and neux as separate IR
  consumers -> their domain integrations -> optional application-specific user
  interfaces and runtimes.

Use mature bootstrap tooling while both Neutral and Flow contracts are unstable.
Self-hosting is a later validation exercise, not an architectural prerequisite.

## 16. Quality and conformance evidence

The current requirements contain no workload or service-level evidence, so this
architecture does not invent scale numbers. Before implementing each profile,
set explicit budgets for the dimensions it owns:

| Profile | Required budgets before implementation commitment |
| --- | --- |
| Core | Maximum source/definition size, graph width/node/edge count, diagnostic limits, planning latency, and memory |
| Static adapter/export | Provider schema/size limits, capability freshness, translation fidelity, deterministic generation, and artifact size |
| Delegated-execution adapter | Target API rate limits, authorization freshness, submission deduplication/idempotency horizon, observation lag, cancellation convergence, and reconciliation horizon |
| Runtime | Queue and dispatch latency, concurrency, backpressure, fairness, availability, recovery point/time, worker-loss detection, timeout/grace/reconciliation/finalizer horizons, tombstone retention, and state growth |
| Data/evidence | Output/log/artifact limits, retention, deletion, integrity verification, and reference-safe garbage collection |
| Security | Credential lifetime/scope, authorization latency, audit retention, isolation class, and revocation/cancellation expectations |

Validation should include:

- positive and negative conformance fixtures;
- deterministic plan comparison;
- compatibility tests against untrusted, stale, malformed, incomplete, and
  internally inconsistent capability descriptions. Static analysis cannot prove
  that a remote provider is truthful; observed mismatch is adapter
  nonconformance or an indeterminate compatibility result;
- old-definition/plan readability across supported versions;
- duplicate, reordering, late-result, worker-loss, and coordinator-restart fault
  scenarios for Runtime;
- cross-zone replay, wrong-audience, expired credential, broken delegation-chain,
  stale-fence, and queued-token-leak tests for every authority handover;
- E0-through-E3 extension-layer escape tests and P0-through-P4 degradation
  fixtures, including the separate authorization verdict;
- crash tests at timeout, tombstone creation, active-state deletion, every
  finalizer transition, and tombstone expiry; late messages must never resurrect
  work or trigger dependants;
- untrusted-source to protected-action threat scenarios;
- artifact substitution and evidence-verification failures; and
- recovery without using sampled telemetry as state.

## 17. Accepted and deferred decisions

### Accepted by this baseline

- **All profiles:** layered product; separate authoring, compiler, Flow, target,
  and runtime records; no premature services or repository splits; current
  v0/v1/v2 checklists are catalogue material, not milestone contracts.
- **Core v0:** provisional unconditional finite static DAG, immutable
  definition/plan records, versioned structural plan comparison, and fail-closed
  handling of unsupported required capabilities.
- **Delegated Execution/Runtime guardrails:** accepted work may be redelivered;
  attempt fencing, explicit external-effect retry/reconciliation, and truthful
  cancellation are required before those profiles claim durability.
- **Execution/Delivery guardrails:** content-identified artifacts, separate typed
  evidence, no secret values in plans, and no ambient privilege on ordinary
  workers.
- **Trust handover:** zones exchange authenticated operation envelopes and mint
  destination-scoped credentials after fresh authorization; bearer tokens are
  never forwarded through queues or reused across zone audiences.
- **Provider extensions:** E0–E3 extension layers and P0–P4 portability grades
  are explicit; authorization is a separate verdict and required behavior is
  never silently degraded.
- **Timeout and deletion:** ordered fallback deadlines, cleanup finalizers, and
  execution tombstones are required; late observations may reconcile effects but
  cannot resurrect terminal work.

### Deferred, with a decision required before the affected profile

- the stable public Flow interchange representation and its public digest rules
  after v0's internal comparison contract;
- compatibility commitments for the Neutral IR consumer boundary and target
  adapters;
- capability profiles beyond the named v0 slice and the long-term extension
  governance body;
- whether a Neutral-owned Runtime is a product at all;
- tenancy, supported environments, isolation strengths, and quantitative limits;
- retention and compatibility guarantees before 1.0;
- policy language/engine and credential providers;
- condition evaluation details and any future dynamic topology; and
- public naming of the language, compiler command, and direct application
  interfaces.

Deferral means “no unsupported promise,” not “let the first implementation decide
accidentally.”

## 18. Principal risks

| Risk | Architectural response |
| --- | --- |
| Scope expands into an entire hosted CI platform | Ship and name product profiles separately; require a Runtime decision gate |
| First provider becomes the model | Simulator first, bindings outside Core, second-target conformance before portability claims |
| Flow concepts leak into neutral-lang or Neutral IR | Keep pipeline concepts in neutral-flow; compare against Neux before promoting anything into the shared IR contract |
| Compiler API/IR freezes accidental behavior | Stabilize behavior and invariants before public representation commitments |
| Exactly-once, immediate cancellation, or perfect cleanup is promised | Specify durable acceptance, possible redelivery, fenced admission, ambiguous effects, convergence, and reconciliation |
| A trust handover becomes bearer-token forwarding | Re-authenticate the immediate workload, preserve subject/actor delegation, mint a destination-scoped credential, and keep tokens out of queues and records |
| A provider extension crosses layers or silently reduces portability | Enforce E0–E3 isolation, compute the P0–P4 vector, and reject unknown or undeclared behavior |
| Timeout deletes authority needed to reject a late result | Atomically replace active state with a durable tombstone; pin unresolved effects/finalizers and reject retired epochs |
| Security is postponed because v0 is “only CI” | Keep trust boundaries in Core/export design; require threat model before any execution |
| Definition, plan, state, logs, and audit collapse into one document | Separate identities, authorities, and lifecycles |
| Premature microservices and repository fragmentation consume the project | Preserve logical modularity; split only on measured operational or ownership boundaries |
| Checkboxes substitute for a user outcome | Milestone exit criteria use scenarios, invariants, negative cases, and evidence |

## 19. Open decision gates

The architecture lead should not approve implementation of the affected layer
until these are answered:

### Core v0 gates

1. Which precise user journey and workflow does the first vertical slice serve?
2. What is the smallest Neutral IR contract Flow needs, and which manually
   curated fixtures can test that consumer contract before neutral-lang emits it?
3. Which practical static-export target will test the boundary, and which target
   behavior is deliberately excluded?
4. What is the smallest named portable capability profile?
5. What complete material is included in definition identity?
6. What constitutes structural equality for the v0 internal plan projection,
   and which planning facts must be archived versus safely regenerated?
7. What compatibility promise applies before 1.0 to Neutral IR, normalized
   definitions, plans, adapters, and application interfaces independently?

### Delegated-execution gates

8. Which named user journey requires effectful submission instead of static
   export, and which system owns submission, execution, observation,
   cancellation, and reconciliation transitions?
9. What result aggregation behavior is required by its executable reference
   scenarios?
10. What is the threat and tenancy model of the first executable profile?
11. Which external effects are safe to retry, and how are ambiguous effects and
    stale attempts fenced and reconciled?
12. Which issuers, trust domains, destination audiences, sender-binding methods,
    and revocation channels implement each approved authority handover?
13. For every provider operation class, what are the execution, cancellation,
    reconciliation, cleanup-finalizer, idempotency, callback, and tombstone
    horizons, and which operator owns an unresolved tombstone?

### Runtime gate

14. What measured evidence would justify building a Flow Runtime rather than
    continuing to integrate existing execution providers?

## Research basis

Supporting analysis is maintained as private design material.

Important primary references include:

- [Neutral organization profile](https://github.com/neutral-ecosystem/.github/blob/main/profile/README.md)
  and [public ecosystem roadmap](https://github.com/neutral-ecosystem/.github/blob/main/ROADMAP.md)
- [Common Workflow Language 1.2.1](https://www.commonwl.org/v1.2/Workflow.html)
- [Open Workflow Specification 1.0.3](https://github.com/open-workflow-specification/specification/tree/v1.0.3)
- [CloudEvents 1.0.2](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md)
  and [CDEvents documentation](https://cdevents.dev/docs/)
- [W3C SCXML 1.0](https://www.w3.org/TR/scxml/)
- [OCI Image Specification 1.1.1](https://github.com/opencontainers/image-spec/blob/v1.1.1/descriptor.md)
- [in-toto Attestation Framework](https://github.com/in-toto/attestation)
- [SLSA 1.2](https://slsa.dev/spec/v1.2/)
- [SPIFFE standards](https://spiffe.io/docs/latest/spiffe-specs/)
- [OAuth 2.0 Token Exchange, RFC 8693](https://www.rfc-editor.org/rfc/rfc8693.html)
- [OAuth 2.0 Security Best Current Practice, RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html)
- [Kubernetes finalizers](https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/)
- [NIST SP 800-207 Zero Trust Architecture](https://www.nist.gov/publications/zero-trust-architecture)
- [OpenTelemetry CI/CD conventions](https://opentelemetry.io/docs/specs/semconv/cicd/)

These sources are precedents and interoperability targets, not dependencies that
Neutral Flow must copy wholesale.
