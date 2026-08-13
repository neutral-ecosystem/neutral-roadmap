
## Source and Input Context

* [ ] Identify the project or workload being processed.
* [ ] Identify the exact source or input revision used by an execution.
* [ ] Access the source and other required input materials.
* [ ] Preserve the identity of the inputs used by an execution.
* [ ] Distinguish different source states when relevant.
* [ ] Make information about the source available to workflow decisions.
* [ ] Allow execution to originate from different source systems without changing the core workflow model.

---

## Execution Requests and Triggers

* [ ] Start work in response to an external event.
* [ ] Start work explicitly on request.
* [ ] Start work based on time when required.
* [ ] Pass information from the triggering event into the workflow.
* [ ] Determine whether a received event actually requires execution.
* [ ] Allow different workflows to react to different events.
* [ ] Prevent accidental duplicate execution when the same event is delivered more than once.
* [ ] Preserve what caused each execution.

The core requirement is not any particular trigger such as a commit, release, or merge request.

The requirement is the ability to receive an event or request, evaluate it, and create an execution from it.

---

## Workflow Definition

* [ ] Describe a complete unit of automated work.
* [ ] Divide that work into smaller logical units.
* [ ] Express relationships between units of work.
* [ ] Express ordering only where ordering is actually required.
* [ ] Allow independent work to remain independent.
* [ ] Allow nested or composed workflow structures where useful.
* [ ] Give important units of work stable identities.
* [ ] Represent the workflow clearly enough to validate before execution.

A workflow must not assume a fixed sequence such as:

```text
build → test → deploy
```

Different workflows may contain completely different operations.

---

## Workflow Definition Identity

* [ ] Identify the exact workflow definition used for an execution.
* [ ] Preserve that definition for the lifetime of the execution.
* [ ] Prevent later edits from silently changing an already-running execution.
* [ ] Associate execution history with the definition that produced it.
* [ ] Define clearly what happens when an old execution is re-run.

This allows a historical execution to answer both:

```text
What source was executed?
```

and:

```text
What workflow definition executed it?
```

---

## Inputs and Configuration

* [ ] Provide values to a workflow.
* [ ] Provide values to individual units of work.
* [ ] Distinguish required inputs from optional inputs.
* [ ] Validate required inputs before execution.
* [ ] Define default values where appropriate.
* [ ] Support structured configuration.
* [ ] Support configuration derived from earlier work.
* [ ] Keep configuration dependencies explicit.
* [ ] Define deterministic rules when configuration comes from multiple sources.

---

## Outputs and Data Flow

* [ ] Allow a unit of work to produce values.
* [ ] Allow later work to consume those values.
* [ ] Pass files or artifacts between units of work.
* [ ] Reference execution context.
* [ ] Reference source context.
* [ ] Validate that required outputs exist before they are consumed.
* [ ] Keep data dependencies visible.
* [ ] Distinguish ordinary values, files, artifacts, and sensitive values.

---

## Dependency Graph

* [ ] Represent dependencies between units of work.
* [ ] Detect circular dependencies.
* [ ] Determine which work is ready to execute.
* [ ] Determine which work is blocked.
* [ ] Determine which work can execute concurrently.
* [ ] Support paths that split into independent work.
* [ ] Support paths that join after independent work completes.
* [ ] Prevent work from running before its requirements are satisfied.

The dependency graph is the primary execution structure.

A workflow should not be forced into a single linear sequence.

---

## Execution Planning

* [ ] Convert validated workflow intent into a concrete execution plan.
* [ ] Resolve dependencies before execution.
* [ ] Resolve conditions that can be determined beforehand.
* [ ] Determine immediately executable work.
* [ ] Determine potential parallelism.
* [ ] Determine required environments and resources.
* [ ] Determine required permissions.
* [ ] Detect impossible execution plans before allocating resources.
* [ ] Preserve the relationship between the original workflow and the resulting execution plan.

---

## Execution Units

* [ ] Execute individual units of work.
* [ ] Execute commands, programs, tools, or integrations.
* [ ] Execute multiple operations in a defined order when needed.
* [ ] Capture the result of every operation.
* [ ] Capture outputs produced by operations.
* [ ] Distinguish success from different forms of unsuccessful execution.
* [ ] Preserve enough context to understand what actually ran.

The CI/CD system should provide a general execution mechanism.

It should not require every operation to belong to a predefined category such as build or test.

---

## Common Software-Delivery Work

The system must be capable of expressing these operations, but they do **not** need to be primitive concepts in the core engine.

* [ ] Acquire project dependencies.
* [ ] Validate source.
* [ ] Check formatting.
* [ ] Perform static analysis.
* [ ] Perform type checking.
* [ ] Compile or build software.
* [ ] Run tests.
* [ ] Run security analysis.
* [ ] Package outputs.
* [ ] Publish artifacts.
* [ ] Create releases.
* [ ] Deploy artifacts.
* [ ] Verify deployments.
* [ ] Run arbitrary project-specific tools.

This distinction is important:

```text
CI/CD engine capability
    execute and orchestrate work

software-development workload
    build
    test
    scan
    package
    deploy
    ...
```

The engine should orchestrate these operations rather than hard-code the software-development lifecycle.

---

## Conditions

* [ ] Execute work only when defined conditions are satisfied.
* [ ] Skip irrelevant work.
* [ ] React to previous results.
* [ ] React to source or execution context.
* [ ] React to outputs produced earlier.
* [ ] Combine multiple conditions.
* [ ] Distinguish skipped work from failed work.
* [ ] Preserve why work was executed or skipped.

---

## Parallel Execution

* [ ] Execute independent work concurrently.
* [ ] Preserve dependency guarantees during concurrent execution.
* [ ] Collect independent results correctly.
* [ ] Continue dependent work only when its requirements are satisfied.
* [ ] Prevent unrelated work from unnecessarily blocking other work.

---

## Execution Environments

* [ ] Describe the environment required by work.
* [ ] Allow different work to use different environments.
* [ ] Provide required configuration to the environment.
* [ ] Provide required tools or make their requirements known.
* [ ] Isolate executions where necessary.
* [ ] Identify the environment actually used.
* [ ] Preserve enough environment information for diagnosis and traceability.
* [ ] Avoid depending on hidden environment state where possible.

---

## Execution Isolation

* [ ] Prevent unrelated executions from unintentionally affecting each other.
* [ ] Prevent one project from accessing another project's protected information.
* [ ] Isolate untrusted work from privileged work.
* [ ] Prevent sensitive state from leaking between executions.
* [ ] Define trust boundaries between workflow execution and infrastructure.
* [ ] Clean sensitive temporary state after use.

---

## Resources

* [ ] Identify resources required by work.
* [ ] Determine whether suitable execution resources exist.
* [ ] Assign work only to compatible resources.
* [ ] Detect when an execution resource becomes unavailable.
* [ ] Release resources after work completes.
* [ ] Prevent resource exhaustion from silently corrupting workflow behavior.

---

## Durable Execution State

* [ ] Persist the state of an execution.
* [ ] Preserve which work has started.
* [ ] Preserve which work has completed.
* [ ] Preserve outputs required by dependent work.
* [ ] Recover execution state after an orchestration failure.
* [ ] Avoid repeating completed work accidentally after recovery.
* [ ] Detect lost or unavailable execution workers.
* [ ] Distinguish workflow failure from orchestration infrastructure failure.

The workflow should not disappear merely because the process coordinating it restarts.

---

## Execution Attempts

* [ ] Distinguish a logical unit of work from an individual execution attempt.
* [ ] Record every attempt.
* [ ] Preserve previous failed attempts when work is retried.
* [ ] Identify the final accepted result.
* [ ] Avoid confusing repeated attempts with separate logical work.

---

## Failure Handling

* [ ] Detect failures at every level of execution.
* [ ] Propagate failures according to dependency rules.
* [ ] Prevent accidental continuation after critical failures.
* [ ] Allow explicitly tolerated failures.
* [ ] Preserve failure information.
* [ ] Identify which operation failed.
* [ ] Distinguish project failure from infrastructure failure when possible.
* [ ] Allow downstream behavior to react to failure.

---

## Retry Behavior

* [ ] Retry work when explicitly permitted.
* [ ] Limit retry attempts.
* [ ] Allow retry behavior to depend on the failure category.
* [ ] Avoid endless retry loops.
* [ ] Preserve every attempt.
* [ ] Preserve the final failure after retries are exhausted.

---

## Time Limits

* [ ] Limit individual work duration.
* [ ] Limit larger execution scopes when required.
* [ ] Detect timeout distinctly from ordinary failure.
* [ ] Stop timed-out work.
* [ ] Clean resources after timeout.

---

## Cancellation

* [ ] Cancel an active execution.
* [ ] Cancel individual work where appropriate.
* [ ] Stop work that has become obsolete.
* [ ] Prevent new dependent work from starting after cancellation.
* [ ] Propagate cancellation where appropriate.
* [ ] Clean resources after cancellation.
* [ ] Preserve cancellation as a distinct result.

---

## Result Model

* [ ] Represent work waiting to execute.
* [ ] Represent work currently executing.
* [ ] Represent successful work.
* [ ] Represent failed work.
* [ ] Represent skipped work.
* [ ] Represent cancelled work.
* [ ] Represent timed-out work.
* [ ] Represent infrastructure failure where distinguishable.
* [ ] Determine the result of a larger workflow from its components.

---

## Identity

* [ ] Identify the actor or system requesting an execution.
* [ ] Identify actors performing protected operations.
* [ ] Authenticate access to protected CI/CD capabilities.
* [ ] Preserve important actor information for audit purposes.

---

## Permissions

* [ ] Define what workflows may access.
* [ ] Define what individual work may access.
* [ ] Minimize privileges by default.
* [ ] Prevent untrusted work from obtaining privileged capabilities.
* [ ] Separate ordinary execution permissions from deployment permissions.
* [ ] Apply permissions at the narrowest practical scope.
* [ ] Validate required permissions before protected work begins.

---

## Secrets

* [ ] Provide sensitive values only to authorized work.
* [ ] Keep secrets separate from ordinary configuration.
* [ ] Restrict secret availability to the smallest practical scope.
* [ ] Avoid storing secret values directly in workflow definitions.
* [ ] Avoid exposing secrets in normal logs and diagnostics.
* [ ] Remove temporary secret material after use.
* [ ] Prevent untrusted work from obtaining protected credentials.

---

## Trust Boundaries

* [ ] Distinguish trusted and untrusted workflow inputs.
* [ ] Distinguish trusted and untrusted source contributions.
* [ ] Prevent untrusted execution from automatically gaining protected privileges.
* [ ] Require deliberate transitions from untrusted work to privileged operations.
* [ ] Make security-sensitive boundaries visible to validation and planning.

---

## Artifacts

* [ ] Produce artifacts from execution.
* [ ] Transfer artifacts between dependent work.
* [ ] Preserve selected artifacts after execution.
* [ ] Give artifacts stable identities.
* [ ] Associate artifacts with the execution that produced them.
* [ ] Prevent artifacts from different executions from being confused.
* [ ] Preserve artifact metadata needed by later stages.

---

## Artifact Integrity

* [ ] Identify artifacts using integrity information.
* [ ] Detect unexpected artifact modification.
* [ ] Verify an artifact before sensitive delivery operations when required.
* [ ] Preserve the relationship between the verified artifact and the artifact eventually deployed.
* [ ] Avoid silently replacing a validated artifact with another artifact.

---

## Provenance

* [ ] Record where important artifacts came from.
* [ ] Associate artifacts with the source used to create them.
* [ ] Associate artifacts with the workflow definition used to create them.
* [ ] Associate artifacts with the execution that created them.
* [ ] Preserve important build and execution context.
* [ ] Make provenance available for later verification and auditing.

---

## Logging

* [ ] Record what work executed.
* [ ] Record important output from execution.
* [ ] Record when work starts and finishes.
* [ ] Separate logs by logical work unit.
* [ ] Preserve logs after execution.
* [ ] Make failed work easy to locate.
* [ ] Avoid intentionally exposing protected information.
* [ ] Associate logs with the execution and attempt that produced them.

---

## Execution History

* [ ] Preserve previous executions.
* [ ] Identify executions by project and source.
* [ ] Inspect the result of previous executions.
* [ ] Inspect individual attempts.
* [ ] Preserve important workflow and deployment history.

---

## Audit Trail

* [ ] Record security-sensitive workflow operations.
* [ ] Record protected deployment operations.
* [ ] Record important permission changes.
* [ ] Record approvals when approvals are used.
* [ ] Preserve enough information to determine who or what performed an important action.

---

## Validation Before Execution

* [ ] Detect structurally invalid workflows.
* [ ] Detect missing dependencies.
* [ ] Detect circular dependencies.
* [ ] Detect missing required inputs.
* [ ] Detect references to unavailable values.
* [ ] Detect invalid configuration.
* [ ] Detect incompatible execution requirements.
* [ ] Detect impossible execution relationships.
* [ ] Detect permission problems that can be known beforehand.
* [ ] Produce understandable diagnostics.

---

## Provider Independence

For a provider-neutral CI/CD system, this is a core requirement rather than an optional improvement.

* [ ] Represent workflow intent independently from a specific provider.
* [ ] Keep provider-specific behavior outside the core workflow model where possible.
* [ ] Allow the same workflow intent to target different providers.
* [ ] Preserve the meaning of the original workflow during translation.
* [ ] Avoid silently replacing unsupported behavior with different behavior.
* [ ] Isolate provider-specific configuration when provider-specific behavior is genuinely required.

---

## Capability Detection

* [ ] Determine which capabilities an execution target provides.
* [ ] Compare workflow requirements with target capabilities.
* [ ] Reject incompatible execution plans before execution.
* [ ] Identify which requirement cannot be satisfied.
* [ ] Allow provider-specific capability extensions without changing core semantics.
* [ ] Never silently weaken workflow behavior because a target lacks a feature.

Conceptually:

```text
workflow intent
      ↓
required capabilities
      ↓
target capabilities
      ↓
compatible?
   /       \
 yes        no
 ↓           ↓
plan       diagnostic
```

---

## Deployment

When a workflow performs delivery:

* [ ] Identify exactly what is being deployed.
* [ ] Identify the destination.
* [ ] Define prerequisites for deployment.
* [ ] Prevent deployment when required checks have failed.
* [ ] Distinguish deployment from artifact creation.
* [ ] Preserve deployment status.
* [ ] Associate deployment with the deployed artifact.
* [ ] Associate deployment with its source.
* [ ] Preserve deployment history.

---

## Delivery Environments

* [ ] Represent distinct deployment environments.
* [ ] Provide environment-specific configuration.
* [ ] Provide environment-specific secrets.
* [ ] Restrict access to protected environments.
* [ ] Prevent accidental delivery to an unintended environment.
* [ ] Track which artifact or version is associated with an environment.

---

## Promotion

* [ ] Move a previously produced artifact through delivery environments.
* [ ] Preserve artifact identity during promotion.
* [ ] Avoid unintentionally rebuilding a different artifact for each environment.
* [ ] Record the promotion path.
* [ ] Preserve validation evidence associated with the promoted artifact.

---

## Delivery Gates

* [ ] Require conditions before protected delivery operations.
* [ ] Support gates based on automated results.
* [ ] Allow gates to depend on security or quality evidence.
* [ ] Prevent mandatory gates from being silently bypassed.
* [ ] Preserve the result of gate evaluation.

Human approval is one possible kind of gate, not the definition of a gate itself.

---

## Deployment Verification

* [ ] Determine whether a deployment operation completed.
* [ ] Allow post-deployment verification.
* [ ] Distinguish successful delivery from successful application health when possible.
* [ ] Preserve verification results.
* [ ] Allow later workflow decisions to depend on those results.

---

## Cleanup

* [ ] Release temporary execution resources.
* [ ] Perform cleanup after success.
* [ ] Perform cleanup after failure.
* [ ] Perform cleanup after cancellation.
* [ ] Perform cleanup after timeout.
* [ ] Remove temporary sensitive material.
* [ ] Preserve required historical information while removing temporary state.