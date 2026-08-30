# Language and IR design research

Status: research synthesis for Neutral discovery

Last reviewed: 2026-08-17

This is background research, not a language roadmap. Only the features listed in
[the v0 architecture](../ARCHITECTURE.md) are currently specified. Examples of
composition, symbolic behavior, migration, or additional consumers below are
research considerations and create no post-v0 commitment.

## Research question

What design practices should guide a small, non-general-purpose abstraction
language whose compiler produces a stable IR for independently released
consumers?

The answer is not “copy LLVM,” “copy MLIR,” or imitate an application DSL. The useful
lesson across the literature is to separate meanings and interfaces, specify
observable behavior before freezing representation, and grow the design from
tested domain problems.

## Executive conclusions

1. **Begin with problem corpora, not grammar.** Identify users, decisions,
   invalid cases, and consumer obligations before choosing surface notation.
2. **Keep the common core smaller than any application domain.** Application
   schemas belong in captured data vocabularies; their union is not Neutral core.
3. **Specify abstract behavior independently from syntax and encoding.** A
   pleasant `.neu` form, an AST, Neutral IR, and a compact wire format solve
   different problems.
4. **Make invalidity layered.** Malformed bytes, invalid core IR, unsupported
   required features, invalid domain payloads, and consumer-invalid programs are
   different failures.
5. **Treat the IR and compiler API as products.** They need ownership,
   compatibility, resource limits, diagnostics, conformance fixtures, and a
   security model—not just data structures exposed from the compiler.
6. **Preserve provenance through every transformation.** Source maps must cover
   composition and generated elements, not only simple line mappings.
7. **Design extension points around explicit ownership and must-understand
   behavior.** Ignorable metadata and behavior-changing operations cannot share
   one “extensions” bag.
8. **Separate stable identity from serialization accidents.** Determinism,
   structural equality, canonical bytes, and semantic equivalence are four
   contracts.
9. **Make effects and authority absent by default in the compiler.** Reading
   source or IR must not execute application code, contact providers, or resolve
   secrets.
10. **Grow vertically and test each representation boundary.** A tiny complete
    compilation and consumer path teaches more than a broad, unexecutable
    grammar.

## 1. Derive the language from jobs and examples

The DSL literature consistently treats domain analysis as part of language
design. Mernik, Heering, and Sloane organize DSL work around decision, analysis,
design, and implementation patterns. Karsai and co-authors advise identifying
language uses early. Hemel's thesis treats coverage—whether users can express
what they actually need—as a design question alongside verification,
abstraction, generation, and portability.

For Neutral this implies:

- Maintain small independent consumer corpora containing successful, invalid,
  ambiguous, and incompatible cases.
- Write each case first in domain language: what must the user express, what
  must the consumer know, and what must be rejected?
- Extract a common Neutral obligation only after at least two independent domain
  cases need the same behavior.
- Keep syntax sketches disposable until the abstract obligations settle.

This approach resists two symmetrical mistakes: embedding one application's
concepts into Neutral, and making Neutral so generic that consumers reconstruct meaning
from untyped maps and strings.

Primary sources:

- [When and How to Develop Domain-Specific Languages](https://ir.cwi.nl/pub/10893/10893D.pdf)
- [Design Guidelines for Domain Specific Languages](https://arxiv.org/abs/1409.2378)
- [Methods and Techniques for the Design and Implementation of Domain-Specific Languages](https://resolver.tudelft.nl/uuid:c3ca8bef-ecda-4f71-9fda-bfc4bd353660)

## 2. Separate concrete syntax, abstract syntax, IR, and consumer models

LLVM demonstrates the value of an explicitly verified IR with equivalent
in-memory, textual, and binary forms. MLIR adds a framework for multiple levels
of abstraction and namespaced dialects. WebAssembly separately specifies core
module structure, validation, execution, binary encoding, text encoding, and
embedding interfaces.

The transferable lesson is separation, not their particular instruction sets.
Neutral needs at least these distinct artifacts:

```text
.neu source
    -> source syntax tree
    -> resolved and checked compiler model
    -> public Neutral IR
    -> consumer-private normalized model
```

Each arrow has different invariants and diagnostics. The compiler's convenient
internal AST should not become the public IR accidentally. Likewise, a
consumer-private model is not a second Neutral IR.

MLIR's dialect idea is relevant but should be narrowed for Neutral. A Neutral
domain vocabulary initially ought to be a versioned, data-described contract,
not arbitrary native code loaded into the compiler. A consumer owns what its
captured vocabulary data means, while the compiler owns qualification, structural validation,
reference resolution, source provenance, and feature negotiation.

Primary sources:

- [LLVM Language Reference Manual](https://llvm.org/docs/LangRef.html)
- [MLIR overview and design documentation](https://mlir.llvm.org/)
- [MLIR paper](https://arxiv.org/abs/2002.11054)
- [WebAssembly core specification](https://webassembly.github.io/spec/core/)
- [WebAssembly high-level goals](https://webassembly.org/docs/high-level-goals/)

## 3. Define statics, dynamics, and ownership explicitly

Harper's *Practical Foundations for Programming Languages* emphasizes defining
language concepts through precise judgments. Software Foundations and
Programming Language Foundations in Agda demonstrate that even small languages
benefit from explicit relations and machine-checked examples. Redex shows the
practical value of executable semantic models.

Neutral is not required to adopt dependent types, a proof assistant, or a
particular operational semantics. It does need a written answer for every core
construct:

- What makes it well formed?
- Which names and references does it introduce or consume?
- What information is known during compilation?
- What remains symbolic for a named domain consumer?
- Which transformations preserve meaning?
- Which errors belong to Neutral and which belong to the consumer?

For application data, Neutral can preserve a declared contract without owning
its dynamics. The IR retains the typed structure, references, vocabulary
version, and source origin needed by the responsible consumer.

Recommended modeling discipline:

1. Write the abstract syntax and judgments in prose and mathematical notation.
2. Build a tiny executable model for disputed behavior.
3. Derive positive and negative examples from the model.
4. Only then commit the behavior to the compiler and conformance suite.

Sources:

- [Practical Foundations for Programming Languages](https://www.cs.cmu.edu/~rwh/pfpl/)
- [Software Foundations](https://deepspec.github.io/sf/)
- [Programming Language Foundations in Agda](https://plfa.inf.ed.ac.uk/)
- [Semantics Engineering with PLT Redex](https://mitpress.mit.edu/9780262062756/semantics-engineering-with-plt-redex/)

## 4. Grow by small complete languages and explicit lowering passes

Wirth's compiler text, *Essentials of Compilation*, and *Programming Languages:
Application and Interpretation* all favor understanding a small complete system.
The incremental teaching approach in *Essentials of Compilation* adds one
language feature at a time and keeps the compiler end to end. The Nanopass work
similarly favors many small, testable transformations over monolithic lowering.

Neutral should apply that lesson as vertical conformance slices:

1. one source unit, one declaration, one literal, one diagnostic;
2. stable names, scopes, and references;
3. structured values and a minimal domain vocabulary;
4. composition with provenance;
5. symbolic values and consumer-owned evaluation;
6. compatibility and migration across two IR versions.

Every slice should compile, serialize, read through the public API, map errors
back to source, and be consumed by a small reference consumer. Incremental
compilation can follow later; it must reproduce full-compilation results.

Sources:

- [Compiler Construction by Niklaus Wirth](https://people.inf.ethz.ch/wirth/CompilerConstruction/CompilerConstruction1.pdf)
- [Essentials of Compilation](https://mitpress.mit.edu/9780262047760/essentials-of-compilation/)
- [Programming Languages: Application and Interpretation](https://www.cs.brown.edu/courses/cs173/2012/book/book.pdf)
- [The Nanopass Framework for Compiler Education](https://doi.org/10.1017/S0956796805005605)

## 5. Design IR invalidity and verification as first-class contracts

LLVM distinguishes syntax accepted by a parser from well-formed IR verified by
its verifier. WebAssembly separates decoding, validation, and instantiation.
RFC 8949 sharpens a similar hierarchy for data: well-formed, valid, and expected
by the application.

Neutral should use a layered acceptance model:

| Layer | Owner | Example failure |
| --- | --- | --- |
| Transport/encoding | IR decoder | truncated or invalid byte sequence |
| Core structure | neutral-lang IR verifier | duplicate identity or dangling reference |
| Required features | API negotiation | unsupported must-understand construct |
| Domain schema | selected vocabulary validator | wrong payload kind or profile version |
| Application behavior | selected consumer | structurally valid data rejected by consumer rules |
| Target/runtime | consumer integration | target lacks a required external guarantee |

An “IR parsed successfully” result proves only the first layer. APIs and
diagnostics must preserve this distinction.

Sources:

- [LLVM well-formedness and verifier model](https://llvm.org/docs/LangRef.html#well-formedness)
- [WebAssembly validation](https://webassembly.github.io/spec/core/valid/)
- [RFC 8949 CBOR](https://www.rfc-editor.org/rfc/rfc8949.html)

## 6. Treat extensibility as a compatibility and trust problem

Extensible IRs are attractive because Neutral has two independent consumers and
expects more tools. The dangerous design is an untyped extension map whose
unknown contents may or may not affect behavior.

The research supports these rules:

- Namespace every vocabulary and operation with owner and version.
- Distinguish required behavior from optional, provably non-behavioral metadata.
- Reject an unknown required feature before consumer interpretation.
- Keep schema validation data-only where possible.
- Record which vocabulary versions influenced compilation.
- Prevent a vocabulary package from gaining execution authority merely by being
  installed.
- Evolve a vocabulary independently from the core IR envelope.

Protocol Buffers is useful as a schema-evolution case study: even an encoding
designed for evolution has wire-safe and wire-unsafe changes, and its binary,
JSON, and text encodings do not share identical compatibility rules. The lesson
is to publish a Neutral-specific compatibility matrix rather than assume that a
serializer library provides one.

Sources:

- [MLIR dialect documentation](https://mlir.llvm.org/docs/DefiningDialects/)
- [Protocol Buffers schema evolution guidance](https://protobuf.dev/programming-guides/proto2/#updating)
- [WebAssembly proposal and feature-based evolution goals](https://webassembly.org/docs/high-level-goals/)

## 7. Keep identity, equality, and canonicalization separate

Reproducible systems need captured inputs and behavior versions. Dolstra's Nix
thesis is a strong case study in identifying build outputs from their complete
inputs and isolating immutable results. It is not a ready-made compiler identity
scheme, but it supports the principle that mutable locations cannot provide
historical identity.

Serialization standards add an important caution. CBOR normally permits more
than one encoding for the same data and defines deterministic restrictions only
when a protocol selects them. JSON Canonicalization similarly constrains values,
numbers, strings, and property ordering for a particular canonical form.

Neutral should therefore define independently:

- record identity for one issued IR artifact;
- derivation identity for captured source, profiles, options, and compiler;
- structural equality over a named logical projection;
- canonical bytes, only if content-addressing or signing needs them; and
- semantic equivalence, which is a later research claim.

Do not hash ordinary serializer output and call the result a semantic identity.

Sources:

- [The Purely Functional Software Deployment Model](https://nixos.org/~eelco/pubs/phd-thesis.pdf)
- [RFC 8949 deterministic CBOR](https://www.rfc-editor.org/rfc/rfc8949.html#name-deterministically-encoded-cbor)
- [RFC 8785 JSON Canonicalization Scheme](https://www.rfc-editor.org/rfc/rfc8785.html)

## 8. Make source mapping and diagnostics part of the compiler contract

Neutral must map consumer errors to `.neu` locations, including errors
on composed or generated structure. A source map added after the compiler is
finished is unlikely to preserve enough origin information.

ECMA-426 provides a mature example of a standardized generated-to-original
mapping format. LSP demonstrates the value of a stable editor protocol for
diagnostics, symbols, references, and related information. SARIF demonstrates a
richer interchange format for analysis findings. None should be copied blindly:
ECMA-426 is optimized for generated text offsets, LSP is session/editor oriented,
and SARIF is analysis-result oriented.

Neutral needs a smaller internal contract containing:

- stable diagnostic code and responsible layer;
- captured source identity and precise span convention;
- primary and related spans;
- IR element identity;
- expansion/composition origin stack;
- severity and machine-readable parameters; and
- safe human rendering with disclosure/redaction rules.

Sources:

- [ECMA-426 Source Map Format](https://tc39.es/ecma426/)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
- [SARIF 2.1.0](https://docs.oasis-open.org/sarif/sarif/v2.1.0/os/sarif-v2.1.0-os.html)

## 9. Treat compiler inputs and IR as hostile languages

Language-theoretic security research argues that ad hoc input recognition and
overly powerful input languages create attack surface. The direct Neutral lesson
is not a commitment to one parser formalism. It is to make the accepted language
explicit, validate before application use, and bound all stages controlled by
untrusted input.

The threat model should cover:

- source/import confusion and dependency substitution;
- path traversal and implicit network resolution;
- Unicode and duplicate-name ambiguity;
- parser, schema, and canonicalization differentials;
- reference, nesting, and expansion bombs;
- untrusted executable compiler plugins;
- cache poisoning across projects;
- sensitive source disclosure through diagnostics; and
- unknown behavioral extensions downgraded to metadata.

An IR reader must validate framing and core structure before constructing
consumer objects whose sizes come from attacker-controlled lengths.

Sources:

- [Language-Theoretic Security](https://langsec.org/)
- [Security Applications of Formal Language Theory](https://langsec.org/papers/langsec-tr.pdf)
- [Protecting Systems From Exploits Using Language-Theoretic Security](https://digitalcommons.dartmouth.edu/dissertations/80/)

## 10. Make the public API explicit and boring

A good compiler API makes all behavior-affecting input visible. It should accept
an explicit root, resolver, source snapshot, selected profiles, options, feature
policy, limits, cancellation, and requested outputs. It should return structured
diagnostics, IR, source map, derivation manifest, and the exact behavior versions
used.

The public IR API should expose immutable typed views, verified references,
bounded traversal, feature negotiation, and structured failures. It should not
expose the compiler's mutable AST classes or permit consumers to depend on hash
map iteration order.

Recommended failure taxonomy:

```text
transport malformed
core IR invalid
required feature unsupported
domain schema invalid
compilation rejected
compilation cancelled or exhausted budget
consumer interpretation rejected
internal implementation failure
```

Incremental compilation is an implementation optimization. Rust's query model
and Salsa are worth studying when editor latency becomes a measured problem, but
the full and incremental compilers must agree for the same captured inputs.

Sources:

- [Rust compiler incremental compilation guide](https://rustc-dev-guide.rust-lang.org/queries/incremental-compilation.html)
- [Salsa overview](https://salsa-rs.github.io/salsa/)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)

## Recommended discovery sequence

### Phase A: behavior and corpus

1. Complete a bounded, domain-neutral v0 source corpus.
2. Extract only the structural needs exercised by the generic probe.
3. Write a glossary separating source, declaration, operation, relation, value,
   vocabulary, IR, derivation, and consumer model.

### Phase B: tiny logical model

4. Define one source unit, stable declaration identities, scopes, references,
   literal/structured values, and one data-only domain vocabulary.
5. Define well-formedness judgments and diagnostic ownership.
6. Prototype the disputed parts in a small executable semantics/model.

### Phase C: first public boundary experiment

7. Define an experimental logical IR model independent of encoding.
8. Implement two throwaway encodings or APIs to expose hidden assumptions before
   selecting a stable one.
9. Pass the generic fixture through the public compiler and reader boundary into
   an effect-free probe.

### Phase D: evolution and evidence

10. Add feature negotiation, one compatible addition, and one deliberately
    incompatible change.
11. Demonstrate source-to-consumer diagnostics through composition.
12. Establish determinism, resource, fuzzing, and old-reader conformance tests.

Only after these phases should version checklists allocate features to releases.

## Advice not to adopt blindly

| Source idea | Why it is attractive | Why Neutral should be cautious |
| --- | --- | --- |
| LLVM as a universal low-level IR | Mature verifier, tooling, typed structure | Neutral preserves high-level domain intent and is not a machine-code optimizer. |
| MLIR-style arbitrary dialects | Strong extensibility ecosystem | Native compiler extensions would enlarge the trust and compatibility surface too early. |
| General-purpose functions and macros | Expressive and familiar | Neutral is intentionally not a general-purpose language; unrestricted computation impairs planning and bounded analysis. |
| Canonical JSON as identity | Easy hashing and debugging | JSON's number model and canonicalization constraints may not match Neutral's logical data model. |
| LSP as the compiler API | Broad editor support | LSP is an editor protocol, not a compilation derivation or archival IR contract. |
| One IR for every compiler phase | Fewer named formats | Source AST, public interchange, and private lowerings have different compatibility and performance needs. |
| Automatic incremental compilation first | Attractive interactive performance | It adds cache invalidation and dependency complexity before full-compilation behavior is stable. |
| Formal verification of the full design first | Strong assurance claim | Begin with bounded core properties; external-target and consumer behavior remains outside the compiler proof boundary. |

## Decisions this research does not make

- concrete `.neu` syntax;
- whether Neutral uses nominal, structural, inferred, or another type discipline;
- the exact expression/evaluation model;
- whether composition is macro expansion, parameterized declarations, or another
  mechanism;
- JSON, CBOR, Protocol Buffers, FlatBuffers, or a custom IR encoding;
- whether canonical IR bytes are required;
- an implementation language;
- an executable compiler plugin system;
- any application vocabulary design; or
- feature allocation beyond v0.

Those decisions require concrete evidence and explicit architecture gates
in [REQUIREMENTS.md](../REQUIREMENTS.md).
