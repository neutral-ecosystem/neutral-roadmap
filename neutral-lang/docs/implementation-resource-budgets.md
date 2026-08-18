# Implementation resource budgets

Status: implementation policy guidance, not Neutral language semantics

Neutral compilers and IR readers need bounded work, memory, and time. The API
therefore carries a versioned resource-budget object, but hardware-dependent
numbers are not language-conformance requirements.

The language contract may define deterministic structural ceilings used by a
named baseline, including source bytes, source-unit count, closure bytes,
nesting, expansion, decoded elements, and diagnostic count. Implementations may
offer stricter named profiles. A decision-affecting structural limit and the
selected profile identity enter the derivation record.

Wall-clock deadlines and peak-memory ceilings are deployment controls. A named
implementation profile that publishes either must also identify at least:

- compiler/reader build and configuration;
- CPU, available memory, and operating environment;
- concurrency and cache state;
- representative and adversarial input corpora;
- measured percentile and cancellation method; and
- whether the ceiling is enforced by the process, supervisor, or service.

Until such a benchmark is published, values such as “10 seconds” or “512 MiB”
are measurement hypotheses, not requirements. Exceeding a deployment deadline
or memory ceiling must not produce apparently complete authoritative IR. The
host reports an implementation/resource failure distinct from a language syntax
or type error.
