
# Neutral language: choices before version planning

Status: proposed architecture decisions for review

Scope: decisions needed before producing `v0`, `v1`, and `v2` checklists. This
document does not define `.neu` syntax, an expression language, concrete IR
encoding, or consumer semantics.

Related documents:

- [Needed features](needed-features.md)
- [Language and IR design research](docs/language-design-research.md)
- [Research reading list](docs/reading-list.md)
- [Neutral Flow architecture](../neutral-flow/ARCHITECTURE.md)

## How to read these decisions

The “best choice” below means the best current fit for this ecosystem:

```text
.neu source -> neutral-lang -> Neutral IR -> neutral-flow -> CI/CD domain
                                      \
                                       -> neux -> GNU/Linux domain
```

Neutral IR is the shared compiler boundary. Flow and Neux are separate
consumers and own their respective behavior. A future Flow GUI produces `.neu`;
it does not bypass the compiler.

Some decisions can be made from that boundary alone. Others require a Flow and
Neux problem corpus. A provisional decision is intentionally reversible and
must not be promoted into stable core behavior without the stated evidence.

## Decision summary

| ID | Recommended choice | Confidence |
| --- | --- | --- |
| C1 | Prove one small, effect-free, end-to-end compiler and consumer journey | High |
| C2 | Promote a structure to core only after independent Flow and Neux evidence | Medium; Neux corpus is missing |
| C3 | Use a small fixed core plus versioned, data-described domain vocabularies | High |
| C4 | Let the compiler check symbolic structure; let the owning consumer evaluate domain behavior | High |
| C5 | Make every successful authoritative compilation bind a complete captured source closure | High |
| C6 | Standardize logical equality first; keep derivation identity separate; add canonical bytes only for a named need | High |
| C7 | Use explicit feature negotiation and a rolling current/previous read window before 1.0 | Provisional |
| C8 | Resolve data-only vocabulary bundles through an explicit resolver; execute no vocabulary plugin | High |
| C9 | Put resource budgets in the API now, then freeze numeric defaults from measured corpora | Medium |
| C10 | Use two thin, effect-free probe consumers to prove the compiler boundary | High |

---

## C1. Smallest cross-domain user journey

### The question

What is the smallest useful journey that demonstrates `neutral-lang` as an
independent product rather than as a hidden part of Neutral Flow?

This decision matters because beginning with a CI pipeline would encourage the
compiler to absorb pipeline concepts. Beginning with parsing alone would prove
too little: the public IR, provenance, diagnostics, and consumer boundary could
all still be wrong.

### Options

| Option | Advantages | Disadvantages |
| --- | --- | --- |
| Parse one `.neu` file into an AST | Very small and quick to explore | Tests parser internals, not the public product; proves no consumer boundary |
| Implement a small Flow pipeline end to end | Immediately recognizable use case | Makes Flow the accidental definition of Neutral; confuses compiler and consumer behavior |
| Compile a small domain-neutral structure and read it through a public consumer API | Exercises the complete boundary while remaining small | Requires minimal IR, diagnostics, source-map, and profile contracts up front |
| Implement rich language features before any consumer | Leaves room for future expressiveness | High risk of designing unused abstractions and an unstable IR |

### Recommended decision

The first vertical slice should:

1. accept an explicit, captured `.neu` source unit;
2. resolve a small set of named declarations, structured literal values, and a
   typed reference;
3. validate one explicitly selected, data-only domain vocabulary;
4. emit immutable Neutral IR, structured diagnostics, a source map, and a
   derivation manifest;
5. read that IR through the public consumer API; and
6. let an effect-free probe consumer enumerate declarations and either produce
   a small private domain summary or a source-linked diagnostic.

The slice should not execute commands, schedule jobs, contact a provider,
evaluate a Flow condition, resolve a secret, or define provider behavior. It is
complete because it crosses every important ownership boundary, not because it
contains many features.

### Evidence required to close the decision

- The same compiler and IR APIs support both a small Flow-profile fixture and a
  small Neux-profile fixture.
- Neither probe requires compiler-private AST access or reparsing `.neu`.
- A consumer diagnostic maps back to the correct source location.
- Captured inputs reproduce the same accepted logical IR.

---

## C2. Structures justified across Flow and Neux

### The question

Which concepts are truly shared language/IR facilities, rather than Flow
features that happen to look generic?

“Both domains could hypothetically use it” is weak evidence. A concept belongs
in core only when concrete cases in both domains need the same invariant and
consumers would otherwise duplicate unsafe or incompatible machinery.

### Options

| Option | Advantages | Disadvantages |
| --- | --- | --- |
| Put the union of Flow and Neux concepts in core | Everything is immediately available | Produces a large incoherent language; couples independent applications |
| Put only primitive maps, lists, and strings in core | Extremely flexible and initially simple | Moves name resolution, types, references, and validation into every consumer; encourages stringly typed contracts |
| Promote abstractions when two independent corpora demonstrate the same need | Keeps the core useful and evidence-based | Requires maintaining corpora and sometimes tolerating temporary duplication |
| Freeze the core from the Flow corpus and validate it with Neux later | Lets Flow planning move quickly | Bias becomes expensive to remove once IR compatibility matters |

### Recommended decision

Use the two-corpus promotion rule. The current **provisional core candidates**
are:

- stable declaration identity and human-readable names;
- namespaces, scopes, and resolved typed references;
- typed scalar and structured values, including explicit `null` and structural
  field presence/omission without a second absence value;
- containment and typed relationships without execution meaning;
- immutable documents and deterministic validation;
- source provenance, origin chains, and structured diagnostics;
- required-feature negotiation; and
- namespace-qualified vocabulary-owned typed declarations whose behavior remains
  consumer-owned.

These are candidates, not a frozen Neutral data model. Flow graphs, jobs,
conditions, retries, runners, artifacts, deployments, shell commands,
processes, files, and packages remain outside core. Symbolic expressions,
composition, and expansion should also remain provisional until equivalent
Neux cases exist.

### Promotion test

A proposal enters core only if its decision record identifies:

1. one real Flow case and one real Neux case;
2. the identical invariant required by both;
3. why a domain vocabulary cannot safely own it;
4. positive, negative, and ambiguous fixtures; and
5. its compatibility and resource-cost consequences.

If the two domains need similar shapes but different behavior, only the shape
may be core; the behavior remains in each vocabulary.

---

## C3. Core IR versus Flow domain vocabulary

### The question

Where is the boundary between stable, domain-independent Neutral IR and the
versioned vocabulary that Neutral Flow understands?

This boundary controls release independence. If Flow meaning enters the core,
Neux inherits irrelevant concepts. If the core knows nothing beyond arbitrary
data, every consumer must rebuild essential compiler guarantees.

### Options

| Option | Advantages | Disadvantages |
| --- | --- | --- |
| A single universal IR containing all domain concepts | One schema and one apparent model | Core changes whenever either application evolves; invites semantic conflicts |
| A schema-less extension map around a tiny envelope | Easy to add fields | Unknown behavior is easy to ignore accidentally; weak tooling and diagnostics |
| A small fixed core plus versioned, namespaced, data-described vocabularies | Independent evolution, typed tooling, explicit ownership, fail-closed behavior | Requires vocabulary packaging, negotiation, and compatibility rules |
| Native compiler plugins for every domain | Maximum custom behavior | Executes untrusted code in the compiler and makes builds non-hermetic |

### Recommended decision

Adopt a small fixed core plus versioned domain vocabularies.

The core owns document identity, declarations, scopes, references, common value
forms, provenance, source maps, diagnostics, feature negotiation, resource
limits, and extension framing. The Flow vocabulary owns the `Pipeline` type,
the meaning of declarations using it, dependency meaning, operation contracts,
conditions, outputs, requirements, and any other CI/CD-specific declaration.
Neux owns command- and OS-specific declarations.

Each domain item must carry a collision-resistant vocabulary identity, schema
version, behavior version, owner, and required/optional status. Unknown required
behavior fails closed. Only explicitly non-behavioral optional metadata may be
ignored or round-tripped opaquely.

The Flow consumer may lower Neutral IR into a private normalized definition and
logical plan. Those records are not additional ecosystem-wide IRs and do not
belong to `neutral-lang`.

---

## C4. Compiler-understood versus consumer-owned symbolic behavior

### The question

How much of a symbolic expression must `neutral-lang` understand, and how much
must it preserve for Flow or Neux?

Flow will eventually need conditions and prior outputs; Neux may need deferred
environment or OS-derived values. Treating these as text makes them unsafe and
uninspectable. Giving the compiler all evaluation behavior would make it the
implementation of both applications.

### Options

| Option | Advantages | Disadvantages |
| --- | --- | --- |
| Store expressions as opaque source strings | Easy initial IR | Every consumer reparses source; inconsistent typing, security, diagnostics, and evolution |
| Let Neutral define and evaluate every operation | One evaluator and potentially strong compile-time checks | Pulls Flow and Neux semantics into the compiler; cannot evaluate runtime state honestly |
| Preserve structured typed expressions and evaluate only safe core constants | Inspectable dependencies and types without stealing domain behavior | Requires precise operation ownership and availability contracts |
| Make all expressions consumer-opaque blobs | Strong ownership separation | Compiler cannot resolve references, enforce types, bound traversal, or provide useful source maps |

### Recommended decision

Use structured symbolic nodes with split ownership.

The compiler understands:

- node structure and bounds;
- operation identity, vocabulary owner, and behavior version;
- static input/result types;
- resolved references and explicit evaluation dependencies;
- declared availability, purity, determinism, effects, and capabilities; and
- source origin.

The compiler may evaluate only a deliberately small set of pure core operations
whose full inputs are captured and whose behavior is normatively owned by
Neutral. Everything else is preserved losslessly for the responsible consumer.

Flow defines condition truth, skip/failure propagation, missing outputs, result
aggregation, and provider/runtime values. Neux defines OS lookup and command
behavior. Domain operations must never fall back to the host language's truth,
coercion, comparison, or error rules.

This is an ownership decision, not a proposal for expression syntax or a list
of operators.

---

## C5. Source closure and derivation identity

### The question

What can a successful compilation claim about all inputs that influenced its
IR, especially when imports or vocabularies came from mutable locations?

Without a complete closure, the same request can silently mean something else
tomorrow. Recording only paths or URLs also makes audits and offline replay
unreliable.

### Options

| Option | Advantages | Disadvantages |
| --- | --- | --- |
| Record root source and compiler version only | Small metadata | Cannot reproduce imports, schemas, resolver choices, or option-dependent output |
| Record mutable paths and package tags | Human-readable | Locations are not identities; content can change without the record changing |
| Capture every decision-affecting input and bind it into a derivation | Reproducible, inspectable, supports offline replay | More storage and careful resolver design |
| Require all authoring to be offline and pre-vendored | Strong hermeticity | Poor authoring experience and does not eliminate the need to identify content |

### Recommended decision

Every **authoritative successful compilation** must report a complete captured
source closure. It includes:

- the root and every transitive source unit as immutable bytes or a verified
  immutable content reference;
- every selected vocabulary/schema and reusable package;
- resolver outcomes and resolution rules that affected selection;
- compiler behavior identity, options, feature policy, and explicit
  nondeterministic inputs; and
- the identities of the resulting IR, source map, and diagnostic contract.

Network or package acquisition may occur only through the caller-supplied
resolver. Once bytes are captured, compilation must also be possible from that
closure without ambient lookup. A mutable URL or tag can remain provenance but
cannot serve as immutable identity.

The derivation identity and the IR's logical content identity are distinct. Two
derivations can yield logically equal IR while still representing different
historical facts. Secrets and credentials are never captured; only safe opaque
references and non-sensitive decision commitments may appear.

If the compiler cannot identify every decision-affecting input, it may return
diagnostics or explicitly non-authoritative exploratory output, but it must not
label the result reproducible.

---

## C6. Equality, determinism, and canonical bytes

### The question

When are two IR results “the same,” and does Neutral need one canonical byte
representation?

This distinction affects caching, testing, signatures, history, and migrations.
Conflating equality with serialized bytes makes harmless encoder changes look
semantic and can make signatures misleading.

### Options

| Option | Advantages | Disadvantages |
| --- | --- | --- |
| Byte equality is the only equality | Easy to hash and compare | Encoding order, compression, or metadata changes falsely imply logical change |
| Leave equality entirely to consumers | Flexible | Caches, tests, and tools disagree; no stable ecosystem contract |
| Define logical/structural equality and a separate derivation identity | Captures meaning and history independently | Requires a normative logical model and comparison rules |
| Require canonical bytes for every encoding immediately | Convenient signatures and content addressing | Freezes representation too early and increases compatibility burden |

### Recommended decision

Define four explicit concepts:

1. **Record identity** identifies one issued historical artifact.
2. **Derivation identity** binds the complete captured compilation process.
3. **Logical equality** compares the normative IR data model under a named IR
   version, including required behavior and defined ordering rules.
4. **Byte equality** compares one particular encoding only.

Logical equality is the primary conformance contract. The compiler should also
produce deterministic logical IR and deterministic diagnostics for the same
captured derivation. It is acceptable for two permitted encoders to produce
different bytes for logically equal IR.

Do not require canonical bytes until a concrete feature—such as cross-tool
signing, content-addressed exchange, or reproducible binary fixtures—needs
them. Then define a separately versioned canonical encoding with duplicate,
ordering, Unicode, numeric, and unknown-field behavior. Never call ordinary
JSON or serializer output canonical by convention.

Semantic equivalence beyond normative logical equality is owned by a named
domain vocabulary or consumer; Neutral cannot claim two Flow pipelines behave
the same.

---

## C7. Pre-1.0 IR and API compatibility

### The question

How much compatibility can the project credibly promise while the language,
IR, compiler API, and consumer API are still being discovered?

No compatibility promise makes separate releases impractical. A long support
window before real usage exists freezes mistakes and consumes most of the
project's effort in migration code.

### Options

| Option | Advantages | Disadvantages |
| --- | --- | --- |
| Latest version only | Fastest evolution | Flow and Neux must upgrade in lockstep; old artifacts become unreadable |
| Promise indefinite compatibility now | Maximum apparent stability | Not credible before the logical model is validated; severely constrains correction |
| Rolling current/previous read support with explicit features | Allows independent upgrade and bounded migration | Requires fixtures and migration/loss reporting from the first published version |
| Depend only on semantic-version labels | Familiar release numbers | SemVer alone does not define schemas, feature negotiation, migration, or archival reading |

### Recommended decision

Version these surfaces independently:

- `.neu` language behavior;
- logical Neutral IR schema;
- each concrete encoding;
- compiler API;
- consumer API; and
- every domain vocabulary's schema and behavior.

During pre-1.0 exploration, unpublished experimental formats may break freely.
After the first published IR schema, use this bounded policy:

- producers write only the current schema;
- readers support the current and immediately previous published schema for at
  least one release overlap;
- additions are compatible only when old readers can safely classify them as
  optional and non-behavioral;
- any unknown required behavior is rejected before interpretation;
- migrations produce a new immutable IR with a derivation link and an explicit
  loss report; and
- no tool silently downgrades, drops, or defaults behavior-changing data.

This is a starting window, not a forever promise. Before 1.0, measure the real
upgrade cadence of neutral-lang, Flow, and Neux and choose a time-based long-term
support policy. Historical decoding can later be offered by a separate archival
reader rather than keeping every old behavior in the main compiler.

---

## C8. Safe domain-vocabulary resolution and validation

### The question

How can the compiler discover and validate Flow or Neux vocabulary contracts
without giving downloaded extensions compiler-process authority?

A vocabulary needs more than a namespace string: it needs schemas, reference
rules, operation contracts, versions, and must-understand behavior. Loading a
native plugin to obtain those facts would make simply compiling untrusted source
an execution boundary.

### Options

| Option | Advantages | Disadvantages |
| --- | --- | --- |
| Native shared-library plugins | Arbitrary validation logic and easy host integration | Code execution, ABI coupling, non-hermetic builds, difficult sandboxing |
| Fetch schemas automatically from identifiers in source | Convenient authoring | Hidden network access, dependency confusion, mutable resolution, credential risk |
| Embed every domain vocabulary in the compiler | Simple trust boundary | Couples releases and makes third-party domains impossible |
| Resolve versioned data-only vocabulary bundles through an explicit resolver | Safe validation, capture, offline replay, independent releases | Declarative contracts cannot express every possible custom check |

### Recommended decision

Use data-only vocabulary bundles supplied by the compilation request through the
same explicit resolver model as source dependencies.

Source introduces a logical vocabulary namespace with the general form
`use Vocabulary`:

```neu
use Flow
```

`Flow` is an identifier, not a keyword; a future Neux source can say `use Neux`.
The compilation request's captured lock manifest maps `Flow` to one exact
permitted vocabulary identity, content digest, schema version, behavior version,
and supported feature set. `use Flow` never performs ambient lookup or selects
“latest.” Required features are derived from the vocabulary members actually
used, so newly added unused features do not change an existing source unit.

A bundle declares its identity, owner assertion, schema and behavior versions,
compatibility range, feature dependencies, allowed node/value forms, reference
targets, operation contracts, static constraints, and resource bounds. The
compiler validates this declarative information with built-in bounded machinery
and captures the exact bundle in the source closure.

Source cannot activate an unapproved profile or trigger ambient network access.
A signature may help policy verify bytes under key material, but it does not by
itself prove author identity, safety, or intent. Trust acceptance belongs to the
caller's package/profile policy.

Checks that require Flow or Neux meaning run in the consumer, not as compiler
plugins. If executable compiler extensions are ever unavoidable, they require a
new threat model, capability sandbox, deterministic protocol, and separate
decision; they are not part of the initial design.

---

## C9. Initial resource and diagnostic limits

### The question

What bounds prevent malicious or accidental source, nesting, imports,
expansion, and diagnostics from exhausting a compiler or IR reader?

“Reasonable size” is not a contract. One universal hard-coded number is also a
poor fit for a CLI, editor, CI validator, and server, which have different
budgets.

### Options

| Option | Advantages | Disadvantages |
| --- | --- | --- |
| No limits until performance becomes a problem | Less early design work | Unsafe readers, unbounded expansion, and APIs that cannot add accounting cleanly |
| Fixed universal constants | Simple and predictable | Too strict for some hosts and unsafe for others; hard to revise compatibly |
| Caller-supplied limits only | Flexible | Unsafe callers may omit limits; fixtures cease to be comparable |
| Named baseline profiles plus caller-chosen stricter limits and host ceilings | Safe defaults, explicit accounting, adaptable deployment | Requires benchmark corpus and careful derivation recording |

### Recommended decision

Define a versioned resource-budget object in the first compiler and reader APIs.
It should separately bound:

- bytes per source unit and per complete closure;
- source-unit count, import depth, and vocabulary dependency depth;
- nesting, collection sizes, string/binary sizes, and reference count;
- composition/expansion depth and generated-element count;
- encoded and decoded IR size;
- work units or deadline, and peak memory where the host can enforce it; and
- total diagnostics, related locations, and retained source excerpts.

Every entry point gets a safe named baseline; callers may request stricter
limits. A deployment may impose a documented ceiling. Limits that can affect
whether compilation succeeds are recorded in the derivation manifest. Crossing
a limit produces one bounded, source-linked diagnostic and cannot return
apparently complete authoritative IR.

Do **not** freeze arbitrary final numbers from architectural intuition. Build an
adversarial and representative Flow/Neux corpus first. A reasonable provisional
desktop/CI profile for early measurement—not a compatibility promise—is:

| Budget | Measurement starting point |
| --- | ---: |
| Source units | 256 |
| Bytes per source unit | 2 MiB |
| Complete source closure | 16 MiB |
| Import or composition depth | 64 |
| Structural nesting depth | 128 |
| Expanded IR elements | 10,000 |
| Decoded IR size | 32 MiB |
| Emitted diagnostics | 200, followed by one truncation diagnostic |
| Compilation deadline | 10 seconds on the named reference benchmark host |
| Process memory budget | 512 MiB on the named reference benchmark host |

These numbers should be replaced before a stable release using measured valid
workloads, near-limit workloads, and malicious inputs. Latency targets are not
meaningful unless the reference hardware, compiler build, cache state, input
class, and percentile are named.

---

## C10. Consumer conformance case

### The question

What test demonstrates that Neutral IR is useful to separate applications
without implementing Flow or Neux behavior in the compiler?

A round-trip serializer test proves only encoding. A full CI run proves too much
and entangles language conformance with providers, credentials, networks, and
runtime semantics.

### Options

| Option | Advantages | Disadvantages |
| --- | --- | --- |
| Compile and deserialize the same IR | Small and deterministic | Does not prove that a consumer can use the public model |
| Run a real CI pipeline as the language conformance test | Strong end-user demonstration | Tests Flow, provider, trust, and runtime behavior at once; failures are hard to locate |
| Build one generic example consumer | Proves API usability | May accidentally optimize the model for one interpretation |
| Build two thin domain probe consumers | Demonstrates independent use and exposes accidental domain coupling | Requires a minimal vocabulary fixture for each domain |

### Recommended decision

Create two test-only, effect-free probe consumers:

- a Flow-profile probe that reads IR, validates required vocabulary features,
  enumerates vocabulary-owned typed declarations and references, and emits a deterministic
  private summary or domain diagnostic; and
- a Neux-profile probe that performs the equivalent task for one independently
  selected OS-domain fixture.

The probes must use only the public IR consumer API. They do not parse `.neu`,
evaluate domain operations, invoke a shell, contact a CI provider, or share a
private normalized model.

The conformance suite should verify:

1. successful compilation and reading for both profiles;
2. rejection of an unknown required vocabulary feature before interpretation;
3. preservation or safe skipping of declared optional non-behavioral metadata;
4. typed reference traversal without string parsing;
5. a probe-generated diagnostic mapped through the IR source map to `.neu`;
6. bounded rejection of malformed or adversarial IR; and
7. deterministic summaries for the same logical input.

This proves the architectural boundary. Flow's graph semantics and Neux's OS
semantics need their own consumer conformance suites.

---

## Consequences for future version checklists

The checklists should be built as vertical slices, not by assigning every item
in [needed-features.md](needed-features.md) to a release.

- A first slice should prove C1, the minimal portion of C3, closure capture from
  C5, logical IR validation from C6, safe profile loading from C8, bounded APIs
  from C9, and one probe from C10.
- A later slice should add cross-unit names and references, the second probe,
  and enough corpus evidence to confirm or reject the C2 candidates.
- Symbolic computation and composition should enter only with explicit
  ownership rules and concrete cases from both applications.
- Compatibility commitments begin only when an IR schema is intentionally
  published; experiments before that point must be labeled as such.
- Canonical bytes, executable plugins, incremental compilation, and rich
  semantic-equivalence claims are not default milestones. Each needs a named
  use case and separate decision.

The most important unresolved input is the Neux problem corpus. Until it exists,
the project may design and test Flow vocabularies, but it cannot honestly claim
that Flow-shaped abstractions are Neutral core.
