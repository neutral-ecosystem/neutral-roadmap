# Architecture research for Neutral Flow

Status: research memo, not a design specification
Reviewed: 2026-08-13

## Scope

This memo extracts architectural lessons from current, primary specifications and official project documentation relevant to `REQUIREMENTS.md` and the v0-v2 checklists. It covers portability, capability negotiation, durable execution, artifacts and provenance, identity and trust, event ingestion, idempotency, and observability.

It deliberately does not define a Neutral language, configuration format, expression language, or provider API. The referenced systems are precedents to interrogate, not designs to copy wholesale.

## Executive synthesis

Neutral Flow should be designed as a layered, provider-neutral planning and portability product. Its first durable product is a traceable planning decision, not a catalogue of CI/CD verbs or a universal worker implementation. A durable execution control plane is an optional later layer with a separate product and trust decision.

The most useful architectural spine is:

1. Capture an immutable workflow-definition snapshot and immutable input identities.
2. Validate and normalize intent without allocating execution resources.
3. Derive explicit required and preferred capabilities.
4. Match those requirements against a versioned target capability description.
5. Produce an immutable, inspectable logical plan or a precise incompatibility report.
6. When a Runtime is in scope, drive logical work through durable lifecycle transitions while recording individual attempts separately.
7. Assume an external-effect request may be redelivered and its outcome may be ambiguous; retry automatically only when its declared recovery contract makes that safe.
8. Identify artifacts by content and attach independently verifiable evidence to those identities.
9. Keep authorization decisions and trust transitions explicit.
10. When execution exists, export telemetry from the durable record, but never use sampled telemetry as that record.

Five distinctions are foundational:

- A dependency graph answers *what may become ready*; state machines answer *what lifecycle transition is legal now*.
- A logical work item is not an execution attempt. Retries create attempts, not new logical work.
- Artifact identity is not an artifact location or mutable tag.
- Authentication identifies an actor; authorization decides whether that actor may perform this operation on this resource in this context.
- Event identity, causation, correlation, and idempotency keys serve different purposes and must not be overloaded.

## 1. Portability and capability negotiation

### What the standards teach

The Common Workflow Language (CWL) makes a productive distinction between mandatory `requirements` and optional `hints`: an implementation that cannot satisfy a requirement must fail rather than execute weakened behavior. Its precedence rules also show that inherited defaults and narrower overrides need deterministic resolution. This is a stronger portability model than accepting a document and discovering incompatibility halfway through execution.

The Open Workflow Specification separates a specification, schemas, SDKs, runtimes, and a conformance test kit. That ecosystem separation matters more than its particular workflow model: interoperability needs executable conformance claims, not only a shared document schema.

AsyncAPI similarly separates a protocol-neutral message/API description from protocol bindings. This is a useful precedent for keeping core intent independent of transport or provider details while permitting explicit bindings.

### Architectural consequences

- Define a small core capability vocabulary in terms of observable guarantees. Provider product names and provider configuration do not belong in the core.
- Model at least two strengths: required guarantees and preferences/optimizations. An unsupported required guarantee is a planning error. An unsupported preference may be omitted only with an inspectable notice.
- A capability claim needs more than a boolean. Many capabilities have a version, limits, qualifiers, security properties, or scope. Examples include maximum duration, supported isolation classes, artifact size, network policy, cancellation strength, or whether provenance is produced by a trusted control plane.
- The target capability description is evidence supplied by an adapter and should have an identity, schema version, freshness, and issuer. Planning should preserve the exact description or digest used.
- Provider extensions need collision-resistant names, explicit versions, declared owners, and declared effects. Ignoring an unknown extension must never turn a rejection into permission or silently change behavior.
- Normalize and validate before provider selection where possible. Then perform target-specific validation after selection. These are distinct diagnostic phases.
- The target-bound plan should record resolved binding defaults, selected target, selected capability versions, deliberate accepted preferences, policy decisions, and the link back to the provider-neutral logical plan.
- Do not target the lowest common denominator. Support a genuinely portable core plus visible extension points. Portability means predictable compatibility and failure, not that every provider can perform every workflow.
- Build conformance fixtures around behavior and negative cases: unsupported required capability, ambiguous extension, invalid inheritance, limit mismatch, and provider misreporting. Schema validity alone cannot establish semantic interoperability.

### Important warning

Capability discovery is not authorization. A worker may be technically capable of deployment while the requesting actor is forbidden to deploy. The planner must evaluate both and report them separately.

## 2. Dependency planning and durable execution

### DAG and lifecycle state are complementary

The requirements correctly make the dependency graph the principal structure for readiness and parallelism. It should not also carry every runtime concern. A graph determines dependency eligibility; persistent state machines govern runs, logical work, attempts, approvals, cancellation, cleanup, and resource leases.

W3C SCXML is useful as a semantic reference because it makes legal state configurations, deterministic transition selection, parallel states, and run-to-completion processing explicit. It is not a CI/CD architecture to adopt directly. The lesson is to specify lifecycle transitions and invariants independently from their storage or surface syntax.

Temporal demonstrates a second relevant pattern: a durable history can recreate orchestration state after process failure, while unreliable or non-deterministic external operations are kept outside the replay path. Its documentation also distinguishes a workflow definition, a workflow execution, a run chain, commands, events, and activity attempts. Neutral Flow does not need Temporal's programming model to benefit from those separations.

### Recommended durable model

- Preserve an append-only, ordered record of accepted state transitions and external observations sufficient to reconstruct authoritative execution state. Materialized state and snapshots may accelerate reads, but should be rebuildable or auditable against that record.
- Do not treat arbitrary worker messages as facts. The control plane validates a message against current state, lease/attempt identity, authorization, and transition rules before accepting a transition.
- Give every transition a stable run identity, entity identity, sequence/revision, cause, actor/workload identity, and timestamp. The sequence/revision establishes order; wall clocks are diagnostic evidence rather than the sole ordering authority.
- Use optimistic concurrency or equivalent single-writer serialization per affected execution aggregate. Duplicate or late worker completions must be recognized without overwriting an already accepted outcome.
- Separate logical work from attempts. Retry policy belongs to logical work; start time, worker, lease, heartbeat, logs, failure, and output observations belong to an attempt.
- A lost lease, orchestration outage, workload failure, policy denial, timeout, cancellation, and user-code failure are different facts even if several eventually contribute to a failed run.
- Cancellation is a durable request followed by convergence, not an instantaneous deletion. The system must retain which operations could not be stopped and which cleanup actions remain.
- Recovery may repeat dispatch and external calls. Therefore, correctness cannot depend on the coordinator delivering a command exactly once.
- Pin the workflow definition and plan for a run. Definition evolution should create a new version and an explicit rerun or migration decision; it must not silently reinterpret an active run.
- Keep orchestration decisions deterministic with respect to persisted inputs. Time, random choices, provider discovery, policy results, and manual decisions that affect control flow must be captured as facts before later decisions depend on them.

### Side-effect boundary

The coordinator can make its own state transitions effectively once, but it cannot generally guarantee that an external deployment, publication, payment-like action, or provider call happened exactly once. A network failure can occur after the provider applied the effect and before Neutral receives the response.

Accordingly, each effectful operation needs an explicit strategy chosen during planning:

- a provider-supported idempotency key;
- read-after-write reconciliation against a desired identity/version;
- a compare-and-set or precondition;
- a compensating action;
- or an explicit declaration that automatic retry is unsafe and requires intervention.

"Exactly once execution" should not be a platform promise. A defensible promise is durable orchestration with at-least-once delivery assumptions, deduplicated control-plane decisions, and declared side-effect recovery behavior.

## 3. Event ingress, causality, and idempotency

### Use a common envelope, preserve the source fact

CloudEvents is a suitable boundary format precedent. Its stable v1.0.2 specification requires the pair of `source` and `id` to identify an event occurrence and explicitly allows a retransmitted duplicate to retain that identity. It also separates transport binding, event metadata, schema identity, and opaque domain payload.

CDEvents adds a CI/CD vocabulary on top of CloudEvents. It is useful at adapters and ecosystem boundaries, especially for cross-tool observability, but its domain event taxonomy should not become the Neutral Flow execution kernel. Its current specification is pre-1.0 and its own primer emphasizes independently versioned event types.

### Ingress pipeline

An ingress boundary should conceptually perform the following before creating work:

1. authenticate the producer or receiving channel where possible;
2. enforce size and resource limits;
3. preserve the received envelope or a content digest plus protected location;
4. validate envelope and declared payload schema;
5. normalize source-specific data without discarding the original;
6. derive the workflow-selection decision;
7. atomically record deduplication state and create or link the execution request.

The deduplication key should normally include tenant/trust scope plus the producer's stable source and event ID. A repeated identity with different immutable content is a conflict worth surfacing, not a legitimate update to process silently.

### Do not overload identifiers

- Event identity detects retransmission of the same producer event.
- Correlation groups related messages or operations; AsyncAPI exposes it separately for good reason.
- Causation records which event, request, transition, or approval produced another fact.
- An execution-request idempotency key prevents repeated requests from creating repeated logical runs.
- Run, logical-work, attempt, artifact, and trace IDs identify their respective records.

These values may be linked, but should not be assumed equal.

### Retry rules

RFC 9110's HTTP semantics make the governing principle clear: automatic retry is safe when the requested effect is idempotent or the caller can determine that the first request was not applied. Transport retries alone do not make an operation idempotent.

Deduplication also needs a stated retention horizon and outcome policy. If a deduplication record expires before an event can be redelivered, a new run may legitimately be created. This should be a visible service guarantee rather than an accidental database cleanup behavior.

## 4. Artifacts, evidence, and provenance

### Content is the identity

OCI Content Descriptors provide a compact precedent: media type, digest, and byte size describe content; locations are ways to retrieve it. The digest enables content addressing and verification from an untrusted source. Mutable names or tags are convenient references but are not stable promotion identities.

Neutral Flow should therefore represent artifact identity independently from storage provider and location. Sensitive delivery should consume the same verified digest that earlier work produced or approved. Promotion and rollback should select an existing artifact identity rather than rebuild source and assume equivalence.

### Evidence is a graph, not a blob of metadata

The in-toto Statement model binds a typed claim to immutable subjects identified by digest. Its Envelope model separately authenticates the statement. OCI 1.1's `subject` and Referrers API show how SBOMs, signatures, scan results, and other artifacts can be attached to a content identity without mutating the subject.

This suggests three separate stores or logical concerns:

- artifact content and content descriptors;
- typed evidence/attestations that refer to subjects;
- policy and trust configuration used to verify those attestations.

An attestation signature proves that a particular signer endorsed bytes. It does not prove that the claim is complete, that the signer was authorized for the claimed builder, or that the builder was sufficiently isolated. Those are policy and trust-root decisions.

### Provenance must reflect authority

SLSA v1.2 separates a build definition from run details and distinguishes externally controlled parameters, internally controlled parameters, resolved dependencies, builder identity, and output subjects. It defines `builder.id` as the transitive trust base for faithfully executing and recording the build. This is directly relevant to Neutral Flow:

- provenance should be generated or verified by the trusted control plane, not solely by tenant-controlled steps;
- workflow definition, normalized intent, execution plan, source revision, resolved dependencies, target capability description, policy decisions, runner/environment identity, logical work, attempts, and artifact subjects need linkable identities;
- claims should state their completeness and authority rather than filling unknown fields with guesses;
- signer identity and builder/executor identity are distinct and need an allowed relationship;
- self-managed and hosted workers with different guarantees must not share an indistinguishable builder identity.

SLSA also warns against allowing user-defined build steps to access provenance signing material and requires stronger isolation between runs at higher assurance. Core v0 should record this as a future trust boundary; it must be enforced from the first executable or evidence-signing profile, even if strong attestation is delivered later.

### SBOMs are evidence, not provenance

SPDX 3.0.1 is an open BOM data model covering composition, build information, provenance, integrity, relationships, and other domains. Neutral Flow should transport, associate, retain, and expose SBOM documents as typed evidence. It should not invent its own component vocabulary, and it should not treat the mere presence of an SBOM as proof of how an artifact was built.

## 5. Identity, permissions, secrets, and trust boundaries

### Model identities explicitly

A useful minimum distinguishes:

- human or external-system requester;
- event producer;
- workflow-definition owner;
- control-plane service;
- provider adapter;
- worker and individual attempt workload;
- approval actor;
- artifact/evidence signer and builder/executor;
- target environment or protected resource.

SPIFFE is a valuable reference for workload identity because it separates a workload's URI identity from a trust domain and issues short-lived verifiable identity documents. It does not solve application authorization, and Neutral Flow should not make possession of a workload identity sufficient for access.

NIST SP 800-207 rejects implicit trust based on network location. This is particularly important for self-hosted workers: being connected to the control plane does not make a worker trusted to read every secret, produce release provenance, or deploy to every environment.

### Credential and authorization architecture

- Keep long-lived provider credentials behind a credential broker or provider adapter. Issue short-lived, attempt-bound credentials only after dispatch authorization.
- Restrict credentials by audience/resource, action scope, tenant/project/environment, and lifetime. RFC 9700 recommends audience-restricted and sender-constrained access tokens; RFC 8693 provides a useful delegation model and distinguishes the subject from the acting party.
- Plans should refer to permissions and secret handles, never secret values. Secret resolution occurs as late as practical and only inside the authorized attempt boundary.
- Validate declared permissions during planning, then re-authorize at dispatch and at privileged transitions because policy, approval, target state, and revocation can change.
- Record policy version, inputs safe to retain, decision, authorizing identity, and reason. Do not put secrets or unrestricted token claims into audit or telemetry.
- Treat the provider adapter as a privileged deputy. It must verify that the authenticated caller, plan, attempt, target, and requested operation all agree rather than blindly translating commands.
- Approval is an authorization event with subject, scope, plan/artifact identity, expiry, and actor. A generic boolean gate is inadequate for protected delivery.

### Critical trust transition

Untrusted source contributions must not carry their runtime workspace, ambient credentials, or mutable outputs directly into privileged delivery. The privileged side should consume only explicitly declared, integrity-verified artifacts and evidence through a new isolated work unit with separately evaluated authorization.

The strongest boundary required for the first executable or delivery profile is therefore between:

1. parsing/planning untrusted intent;
2. ordinary isolated execution;
3. privileged provider actions and credential issuance;
4. trusted evidence generation/signing.

Collapsing these roles into one worker process would make later supply-chain guarantees largely cosmetic.

## 6. Observability, audit, and operational truth

### Three records, three purposes

- The durable execution record is the correctness source for current state and recovery.
- The audit record explains security-relevant actions and decisions and should be tamper-evident with deliberate retention.
- Telemetry supports diagnosis, performance analysis, and alerting and may be sampled, aggregated, dropped, or retained differently.

OpenTelemetry explicitly treats traces, metrics, and logs as independent signals joined by context. Its CI/CD semantic conventions distinguish pipeline runs, task runs, workers, and results such as user-work failure versus CI/CD system error. Those conventions are currently Release Candidate, so they are useful mapping guidance rather than a stable Neutral data contract.

### Correlation and cardinality

- Use stable run, logical-work, attempt, worker, plan, artifact, and provider-operation identities as correlation attributes where appropriate.
- A retry attempt should be independently observable while remaining linked to its logical work. Asynchronous and redelivered operations may need trace links rather than a forced parent-child tree.
- Keep high-cardinality run and attempt IDs out of default metric dimensions. OpenTelemetry's CI/CD resource guidance explicitly warns that per-run resources can make metrics expensive.
- Measure queue delay, planning time, execution time, provider/API time, approval wait, retry count, cancellation latency, cleanup latency, worker loss, artifact transfer, and outcome by failure domain.
- Keep span names and metric dimensions low-cardinality; put detailed identities in trace/log attributes or indexed execution storage.

### Security and reliability

W3C Trace Context standardizes interoperable trace propagation but identifies both privacy and denial-of-service risks. Incoming trace context is untrusted correlation data, not authentication or authorization. Regenerate or sanitize it when crossing trust boundaries and never place sensitive information in trace state or baggage.

OpenTelemetry sampling deliberately discards some trace data. Therefore sampled traces cannot serve as execution history, provenance, or audit evidence. Telemetry export failure must not corrupt execution state, and an operator should still be able to diagnose a run from Neutral's durable records when an external telemetry backend is unavailable.

Logs should be structured and attempt-scoped, with redaction before persistence/export. Redaction must apply to command rendering, environment data, provider responses, event payloads, and exception text; a later log scrubber is only defense in depth.

## 7. Suggested component boundaries

These are logical responsibilities, not a deployment topology:

- **Ingress adapters** authenticate, preserve, validate, normalize, and deduplicate external requests/events.
- **Definition registry** stores immutable workflow snapshots and their identities.
- **Normalizer/validator** produces provider-neutral normalized intent and diagnostics.
- **Capability registry** stores versioned target claims and adapter extension descriptions.
- **Planner** performs graph analysis, policy checks, capability matching, and emits an immutable plan.
- **Orchestrator/state authority** accepts legal transitions, determines readiness, manages cancellation/recovery, and owns the durable execution record.
- **Scheduler/dispatcher** chooses compatible capacity and issues attempt-scoped leases.
- **Workers** perform ordinary isolated work and report observations; they do not authoritatively mutate run state.
- **Provider adapters** mediate privileged provider operations and reconcile ambiguous outcomes.
- **Credential broker/policy decision point** issues narrowly scoped credentials and records authorization decisions.
- **Artifact/evidence services** store content-addressed artifacts and typed attestations with independent retention.
- **Audit and telemetry exporters** derive external views without becoming execution authorities.

Initially, several responsibilities may share one process and database. Their authority boundaries and record identities should still remain explicit so they can be isolated later without redefining the model.

## 8. Design choices to reject early

- Silent fallback when a target lacks a required capability.
- Treating successful schema parsing as proof of provider compatibility.
- A single mutable "workflow" document that serves as definition, plan, runtime state, and history.
- A single status value that erases attempt history or failure domain.
- Assuming queue delivery or RPC success provides exactly-once effects.
- Using mutable tags, paths, or URLs as the identity promoted to production.
- Letting tenant-controlled work sign authoritative provenance with an ambient platform key.
- Treating a valid signature as sufficient policy approval.
- Passing production secrets through planning, generic configuration, events, or logs.
- Trusting workers because of network location or ownership labels.
- Using trace IDs as authentication, event deduplication, or execution IDs.
- Reconstructing correctness state from sampled logs or traces.
- Hard-coding build, test, package, and deploy as mandatory kernel primitives. CDEvents vocabulary and provider adapters can describe these domains without coupling the scheduler to them.

## 9. Questions the architecture document should answer

1. What exact records are immutable, and what digest/canonicalization rules identify each one?
2. Which component is authoritative for every state transition and identity assignment?
3. What minimum transition history is sufficient to recover after a crash without repeating accepted work?
4. What are the delivery guarantees between orchestrator, worker, provider adapter, and event ingress?
5. How does each effect type declare or discover its idempotency/reconciliation strategy?
6. How are capability names, versions, qualifiers, limits, extensions, and conformance claims governed?
7. What happens when a target's capability description changes after planning but before dispatch?
8. Which policy decisions are made at validation, planning, dispatch, approval, artifact verification, and delivery time?
9. Which identities and trust roots apply to hosted workers, self-managed workers, adapters, and attestation signers?
10. How are untrusted-source workflows prevented from crossing into privileged execution?
11. Which artifacts and evidence keep a run alive for retention/garbage-collection purposes?
12. How are schema and lifecycle evolution handled for executions that outlive a software upgrade?
13. Which telemetry conventions are stable Neutral contracts versus exporter mappings?
14. Which guarantees are v0 product commitments, and which are explicitly deferred?

## Curated primary bibliography

### Workflow portability and execution models

- [Common Workflow Language Workflow Description v1.2.1](https://www.commonwl.org/v1.2/Workflow.html) — authoritative workflow specification; especially useful for mandatory requirements versus optional hints, precedence, validation, explicit inputs/outputs, and data dependencies.
- [Open Workflow Specification v1.0.3 repository](https://github.com/open-workflow-specification/specification/tree/v1.0.3) and its [Conformance Test Kit](https://github.com/open-workflow-specification/specification/tree/v1.0.3/ctk) — current tagged CNCF project specification and behavior-oriented conformance assets; useful as an ecosystem decomposition precedent, not as a CI/CD kernel to copy.
- [AsyncAPI Specification 3.0.0](https://www.asyncapi.com/docs/reference/specification/v3.0.0) — official protocol-neutral message API specification with explicit protocol bindings, message schemas, security schemes, and separate correlation identity.
- [W3C SCXML 1.0 Recommendation](https://www.w3.org/TR/scxml/) — stable generic state-machine reference covering legal configurations, parallel states, transition selection, causality, and deterministic run-to-completion behavior.
- [Temporal Workflow Execution](https://docs.temporal.io/workflow-execution), [Workflow Definition and determinism](https://docs.temporal.io/workflow-definition), and [Event History](https://docs.temporal.io/encyclopedia/event-history) — official documentation for one durable-execution implementation; valuable for separation of definitions, executions, commands, events, state transitions, replay, and external activities.
- [Temporal History Service architecture](https://github.com/temporalio/temporal/blob/main/docs/architecture/history-service.md) — official implementation architecture explaining a history sufficient to reconstruct workflow mutable state; use as evidence for the pattern, not as a dependency recommendation.
- [Temporal Retry Policies](https://docs.temporal.io/encyclopedia/retry-policies) — official treatment of logical workflow versus retryable activity attempts, backoff, non-retryable failures, and idempotent activity expectations.

### Events and idempotency

- [CloudEvents v1.0.2 core specification](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md) — stable vendor-neutral event envelope; provides source-plus-ID duplicate identity, event type and schema metadata, extensions, size guidance, and security cautions.
- [CloudEvents v1.0.2 Primer](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/primer.md) — official design rationale; clarifies occurrence versus event, event identity, protocol responsibilities, and intentionally minimal metadata.
- [CDEvents v0.5.0 documentation](https://cdevents.dev/docs/) and [CDEvents Primer](https://cdevents.dev/docs/primer/) — official Continuous Delivery event vocabulary layered on CloudEvents. Relevant for adapter interoperability and CI/CD lifecycle terminology; pre-1.0 status argues against making its taxonomy a core dependency.
- [RFC 9110, HTTP Semantics, section 9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods) — IETF standard explaining when retries are safe and why a communication failure creates ambiguity for non-idempotent effects.

### Artifacts, provenance, and software supply chain

- [OCI Image Specification v1.1.1: Content Descriptors](https://github.com/opencontainers/image-spec/blob/v1.1.1/descriptor.md) — authoritative content-addressing model: media type, digest, size, optional locations, and verification of untrusted content.
- [OCI Distribution Specification v1.1.1](https://github.com/opencontainers/distribution-spec/blob/v1.1.1/spec.md) — authoritative artifact distribution API; the subject/referrers model is relevant for attaching typed evidence to immutable artifact digests.
- [in-toto Attestation Framework: Statement v1](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md) — authoritative separation of digest-identified subjects, typed predicates, and claims.
- [in-toto Attestation Framework: Envelope v1](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md) — authoritative separation of claim serialization from authentication/signatures and verification guidance.
- [SLSA v1.2 Build Provenance](https://slsa.dev/spec/v1.2/build-provenance) — approved current provenance model for subjects, build definition, external/internal parameters, resolved dependencies, run details, builder identity, and extension compatibility.
- [SLSA v1.2 Build Track](https://slsa.dev/spec/v1.2/build-track-basics) — approved assurance levels; particularly relevant to run isolation and keeping provenance-signing secrets outside tenant-controlled build steps.
- [SLSA v1.2 Verifying Artifacts](https://slsa.dev/spec/v1.2/verifying-artifacts) — approved verification model connecting artifact digest, provenance authenticity, builder expectations, and policy.
- [SPDX Specification 3.0.1](https://spdx.github.io/spdx-spec/v3.0.1/) — current official open BOM data model for composition, build information, identity, integrity, provenance, and relationships.
- [NIST SP 800-204D](https://csrc.nist.gov/pubs/sp/800/204/d/final) — final NIST guidance specifically on integrating software-supply-chain security into DevSecOps CI/CD pipelines; useful as an architecture and threat-control cross-check.

### Identity, authorization, and trust

- [SPIFFE concepts](https://spiffe.io/docs/latest/spiffe/concepts/) and [SPIFFE ID specification](https://spiffe.io/docs/latest/spiffe-specs/spiffe-id/) — official workload identity, trust-domain, short-lived verifiable identity, and platform-neutral identity references. They deliberately do not replace application authorization.
- [SPIFFE Federation specification](https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/) — official model for separately administered trust domains exchanging trust bundles, relevant to federated/self-managed execution resources.
- [NIST SP 800-207, Zero Trust Architecture](https://www.nist.gov/publications/zero-trust-architecture) — final NIST guidance establishing that network location and ownership do not confer implicit trust and that access decisions protect resources rather than network segments.
- [RFC 9700, Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html) — current IETF BCP recommending audience-restricted and sender-constrained access tokens, relevant to short-lived attempt credentials.
- [RFC 8693, OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html) — IETF standard for scoped delegation and impersonation, with distinct subject and acting-party semantics.
- [NIST SP 800-218, Secure Software Development Framework 1.1](https://csrc.nist.gov/pubs/sp/800/218/final) — final outcome-based secure-development practices, including protected development environments and collection/sharing of release provenance.

### Observability

- [OpenTelemetry Specification 1.59.0](https://opentelemetry.io/docs/specs/otel/) and [architecture overview](https://opentelemetry.io/docs/specs/otel/overview/) — official signal and context model separating traces, metrics, logs, resources, propagation, and exporters.
- [OpenTelemetry CI/CD semantic conventions](https://opentelemetry.io/docs/specs/semconv/cicd/) — official Release Candidate conventions for pipeline/task runs, workers, results, spans, metrics, and logs. Useful for exporter mapping but not stable enough to define Neutral's durable model verbatim.
- [OpenTelemetry CI/CD resource conventions](https://opentelemetry.io/docs/specs/semconv/resource/cicd/) — official guidance on run and worker identities, including the high-cardinality cost of per-run metric resources.
- [OpenTelemetry tracing SDK sampling](https://opentelemetry.io/docs/specs/otel/trace/sdk/#sampling) — official confirmation that sampling intentionally discards trace data, demonstrating why traces cannot be an execution or audit database.
- [W3C Trace Context Recommendation](https://www.w3.org/TR/trace-context/) — stable interoperable trace propagation format with explicit privacy, information-exposure, and denial-of-service considerations.
