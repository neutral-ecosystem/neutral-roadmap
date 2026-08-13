## Reusable Workflow Components

* [ ] Define reusable groups of work.
* [ ] Parameterize reusable components.
* [ ] Return outputs from reusable components.
* [ ] Compose larger workflows from smaller components.
* [ ] Reuse components across projects.
* [ ] Version reusable components.

---

## Shared Configuration

* [ ] Define shared configuration once.
* [ ] Reuse configuration across workflows.
* [ ] Override configuration deliberately.
* [ ] Separate common configuration from environment-specific configuration.
* [ ] Make configuration precedence understandable.

---

## Workflow Templates

* [ ] Create standard workflow structures.
* [ ] Customize templates without copying everything.
* [ ] Update common workflow behavior centrally.
* [ ] Version templates independently.

---

## Matrix Execution

* [ ] Execute equivalent work for multiple values.
* [ ] Combine multiple dimensions.
* [ ] Exclude invalid combinations.
* [ ] Add exceptional combinations.
* [ ] Execute combinations concurrently where possible.
* [ ] Combine their results.

---

## Change-Aware Execution

* [ ] Determine which parts of a project changed.
* [ ] Skip work proven to be unrelated.
* [ ] Limit tests to affected areas where safe.
* [ ] Limit builds to affected areas where safe.
* [ ] Allow complete execution to be forced.

---

## Caching

* [ ] Reuse expensive intermediate results.
* [ ] Identify caches from relevant inputs.
* [ ] Invalidate incompatible caches.
* [ ] Scope caches appropriately.
* [ ] Fall back safely when a cache is unavailable.
* [ ] Treat cache use as optimization rather than correctness.

---

## Incremental Execution

* [ ] Reuse valid previous work.
* [ ] Avoid repeating work when its relevant inputs are unchanged.
* [ ] Track the inputs responsible for reusable results.
* [ ] Fall back to complete execution when previous state cannot be trusted.

---

## Concurrency Control

* [ ] Limit simultaneous work.
* [ ] Prevent incompatible operations from executing together.
* [ ] Prevent conflicting deployments.
* [ ] Group executions that share an exclusive resource.
* [ ] Cancel or supersede obsolete work when configured.

---

## Execution Priorities

* [ ] Assign relative priority to work.
* [ ] Prioritize urgent release operations.
* [ ] Prevent low-priority work from indefinitely blocking important work.
* [ ] Preserve fairness where appropriate.

---

## Resource-Aware Scheduling

* [ ] Describe resource requirements.
* [ ] Route work to suitable resources.
* [ ] Avoid expensive resources for trivial work.
* [ ] Respect resource limits.
* [ ] Balance available capacity.

---

## Dynamic Infrastructure Selection

* [ ] Choose suitable execution infrastructure dynamically.
* [ ] Consider availability.
* [ ] Consider performance.
* [ ] Consider cost.
* [ ] Preserve workflow semantics when infrastructure changes.

---

## Manual Approval

* [ ] Pause selected operations for approval.
* [ ] Restrict who may approve.
* [ ] Record approval decisions.
* [ ] Apply different approval policies to different environments.
* [ ] Resume execution after approval.

---

## Rollback

* [ ] Return an environment to a previously known artifact.
* [ ] Identify the artifact being restored.
* [ ] Avoid rebuilding when the required artifact already exists.
* [ ] Record rollback activity.
* [ ] Verify the rollback result.

---

## Progressive Delivery

* [ ] Deliver gradually.
* [ ] Limit initial exposure.
* [ ] Observe health during progression.
* [ ] Continue when conditions remain acceptable.
* [ ] Pause or reverse when conditions fail.

---

## Preview Environments

* [ ] Create temporary environments for proposed changes.
* [ ] Associate each environment with its source revision.
* [ ] Keep preview environments isolated.
* [ ] Remove them when no longer needed.

---

## Ephemeral Execution Environments

* [ ] Create fresh execution environments.
* [ ] Minimize persistent state between unrelated executions.
* [ ] Destroy temporary environments after execution.
* [ ] Reduce opportunities for cross-run contamination.

---

## Test Reporting

* [ ] Produce structured test results.
* [ ] Show failed tests separately.
* [ ] Track test duration.
* [ ] Track unstable tests.
* [ ] Compare results across executions.

---

## Coverage Reporting

* [ ] Collect coverage information.
* [ ] Enforce coverage requirements when configured.
* [ ] Detect coverage regression.
* [ ] Display coverage without requiring raw log inspection.

---

## Security Analysis

* [ ] Analyze source for security problems.
* [ ] Analyze dependencies.
* [ ] Analyze produced artifacts.
* [ ] Enforce configured security policies.
* [ ] Preserve security findings.

---

## Software Composition Information

* [ ] Produce information describing software components.
* [ ] Associate component information with the corresponding artifact.
* [ ] Preserve it alongside release evidence.
* [ ] Make it available to later verification systems.

---

## Artifact Retention

* [ ] Configure artifact retention.
* [ ] Remove obsolete artifacts.
* [ ] Preserve release artifacts longer where required.
* [ ] Prevent retention cleanup from destroying actively referenced artifacts.

---

## Notifications

* [ ] Notify relevant people or systems about important results.
* [ ] Notify on failures.
* [ ] Notify on important deliveries.
* [ ] Avoid unnecessary notification noise.
* [ ] Route notifications according to project needs.

---

## Metrics and Observability

* [ ] Measure workflow duration.
* [ ] Measure queue time.
* [ ] Measure execution duration.
* [ ] Measure resource consumption.
* [ ] Identify slow work.
* [ ] Identify frequently failing work.
* [ ] Correlate telemetry with individual executions.

---

## Workflow Visualization

* [ ] Display the dependency graph.
* [ ] Display current execution state.
* [ ] Display parallel work.
* [ ] Display failed and blocked paths.
* [ ] Make complex workflows understandable visually.

---

## Dry Runs

* [ ] Validate without performing destructive operations.
* [ ] Display the calculated execution plan.
* [ ] Display work that would run.
* [ ] Display work that would be skipped.
* [ ] Display required permissions.
* [ ] Display required capabilities.

---

## Local Validation

* [ ] Validate workflow definitions locally.
* [ ] Inspect the dependency graph locally.
* [ ] Inspect provider compatibility locally.
* [ ] Detect common failures before creating a remote execution.

---

## Local Execution

* [ ] Execute suitable workflow work locally.
* [ ] Reproduce remote behavior where practical.
* [ ] Clearly expose unavoidable differences between local and remote execution.

---

## Debugging

* [ ] Re-run failed work.
* [ ] Inspect inputs received by work.
* [ ] Inspect outputs produced before failure.
* [ ] Increase diagnostic verbosity.
* [ ] Reproduce failures without rerunning unrelated work.
* [ ] Inspect the execution plan that produced the failure.

---

## Optimization

* [ ] Detect unnecessary repeated work.
* [ ] Reuse equivalent results where safe.
* [ ] Improve parallel execution.
* [ ] Choose efficient execution strategies.
* [ ] Preserve workflow meaning during optimization.
* [ ] Make optimization decisions inspectable.

---

## Cost Awareness

* [ ] Estimate execution cost where possible.
* [ ] Identify expensive work.
* [ ] Apply resource budgets.
* [ ] Prefer cheaper equivalent execution strategies.
* [ ] Report excessive resource consumption.

---

## Policy Enforcement

* [ ] Define policies above individual workflows.
* [ ] Require mandatory validation.
* [ ] Require security controls.
* [ ] Protect sensitive delivery environments.
* [ ] Prevent project workflows from weakening mandatory policies.

---

## Controlled Overrides

* [ ] Allow explicitly authorized overrides.
* [ ] Restrict who may override policy.
* [ ] Record overrides.
* [ ] Make overridden protections visible.
* [ ] Prevent silent policy bypass.

---

## Cross-Project Dependencies

* [ ] Model dependencies between projects.
* [ ] Trigger downstream work when appropriate.
* [ ] Coordinate compatible component versions.
* [ ] Avoid rebuilding unrelated projects.

---

## Self-Managed Execution Resources

* [ ] Register externally managed execution resources.
* [ ] Describe their capabilities.
* [ ] Detect availability.
* [ ] Route compatible work to them.
* [ ] Detect unhealthy execution resources.

---

## Extension Model

* [ ] Add integrations without changing core workflow semantics.
* [ ] Add execution capabilities.
* [ ] Add deployment targets.
* [ ] Add source systems.
* [ ] Add artifact systems.
* [ ] Version extension interfaces.
* [ ] Isolate extensions appropriately.

---

## Workflow Evolution

* [ ] Version workflow formats and semantics.
* [ ] Detect incompatible definitions.
* [ ] Migrate older definitions where safe.
* [ ] Preserve behavior during compatible migrations.
* [ ] Report behavior that cannot be migrated automatically.

---

## Historical Comparison

* [ ] Compare executions.
* [ ] Compare duration.
* [ ] Compare failures.
* [ ] Compare produced artifacts.
* [ ] Identify recurring problems.
* [ ] Identify performance regressions.
