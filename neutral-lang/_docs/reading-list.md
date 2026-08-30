# Annotated language-design reading list

Last reviewed: 2026-08-17

This is a curated bibliography for Neutral. “Relevant” means a source informs a
design question; it does not mean Neutral should reproduce that source's
language, type system, IR, or architecture.

## Suggested first reading path

1. Mernik, Heering, and Sloane for the DSL decision and domain-analysis process.
2. Karsai et al. for practical language-design review questions.
3. Krishnamurthi or Siek for growing a small complete implementation.
4. Harper or Software Foundations for precise statics/dynamics vocabulary.
5. MLIR and WebAssembly for IR layering and validation boundaries.
6. Dolstra for derivation and immutable-input identity.
7. ECMA-426, RFC 8949, and Protocol Buffers for mapping, deterministic encoding,
   and evolution pitfalls.
8. LangSec for hostile-input and parser-boundary thinking.

## Books and book-length material

### Practical Foundations for Programming Languages, Robert Harper

- Source: [official CMU page](https://www.cs.cmu.edu/~rwh/pfpl/)
- Access: abbreviated online edition is offered for individual personal use;
  linked only because its notice forbids unauthorized redistribution.
- Read for: abstract syntax, judgments, statics, dynamics, type safety, and
  disciplined definition of language behavior.
- Neutral relevance: terminology and specification method, not a proposed type
  system.

### Programming Languages: Application and Interpretation, Shriram Krishnamurthi

- Source: [author/publisher page](https://www.plai.org/) and
  [second-edition PDF](https://www.cs.brown.edu/courses/cs173/2012/book/book.pdf)
- License: CC BY-NC-SA 3.0 US for the retained edition.
- Local copy: [PDF](library/programming-languages-application-interpretation.pdf)
- Read for: representation choices, desugaring, scope, interpreters, types, and
  growing a language through explicit implementation changes.
- Caution: it teaches a general-purpose language; Neutral should not inherit that
  feature set.

### Essentials of Compilation, Jeremy G. Siek

- Source: [MIT Press open-access page](https://mitpress.mit.edu/9780262047760/essentials-of-compilation/)
- License: CC BY-NC-ND for the open-access edition; link only.
- Read for: incremental vertical compiler construction, many explicit
  intermediate languages, and testing each pass.
- Neutral relevance: grow end to end and keep transformations explicit.

### Compiler Construction, Niklaus Wirth

- Source: [author-hosted ETH PDF](https://people.inf.ethz.ch/wirth/CompilerConstruction/CompilerConstruction1.pdf)
- Access: publicly author-hosted; redistribution license not established here,
  so link only.
- Read for: the discipline of a small understandable compiler and the relation
  between language structure and translation.
- Caution: dated implementation details and a conventional executable language
  target are not Neutral's architecture.

### Programming Language Foundations in Agda, Wadler, Kokke, and Siek

- Source: [official living book](https://plfa.inf.ed.ac.uk/)
- License: CC BY 4.0.
- Local companion paper: [PDF](library/wadler-kokke-programming-language-foundations-in-agda-paper.pdf)
- Read for: operational semantics, typing, progress/preservation, and the value
  of executable/checkable definitions.
- Caution: the locally retained file is the 26-page publication about the book,
  not the complete living book.

### Software Foundations

- Source: [official series](https://deepspec.github.io/sf/)
- Access: free living, machine-checked books; consult each volume/repository for
  exact licensing.
- Read for: turning prose claims into executable definitions, proof statements,
  and regression artifacts.
- Neutral relevance: bounded formalization of core invariants, not an obligation
  to verify the entire ecosystem.

### Semantics Engineering with PLT Redex, Felleisen, Findler, and Flatt

- Source: [MIT Press](https://mitpress.mit.edu/9780262062756/semantics-engineering-with-plt-redex/)
- Access: commercial book; link only. The Redex tool and tutorials are freely
  available.
- Read for: executable models, reduction semantics, testing semantics, and
  catching design errors before implementation.

### Crafting Interpreters, Robert Nystrom

- Source: [complete author-hosted web edition](https://craftinginterpreters.com/)
- Access: full web book is free; downloadable print/PDF editions have separate
  terms, so no local copy.
- Read for: approachable end-to-end implementation, diagnostics, ASTs,
  interpreters, bytecode, and runtime engineering.
- Caution: excellent implementation teaching is not evidence for Neutral's
  language feature set.

## Theses and dissertations

### Methods and Techniques for the Design and Implementation of Domain-Specific Languages, Zef Hemel, 2012

- Source: [TU Delft repository](https://resolver.tudelft.nl/uuid:c3ca8bef-ecda-4f71-9fda-bfc4bd353660)
- Access: open repository; redistribution license is not clearly stated, so link
  only.
- Read for: coverage, verification, abstraction, generation, portability, IDE
  integration, and DSL case studies.
- Neutral relevance: evaluation criteria for an abstraction language and its
  tools.

### The Purely Functional Software Deployment Model, Eelco Dolstra, 2006

- Source: [author/Nix-hosted thesis](https://nixos.org/~eelco/pubs/phd-thesis.pdf)
- Access: publicly hosted; redistribution license not established here, so link
  only.
- Read for: immutable results, complete derivations, isolation, explicit
  dependencies, and reproducibility.
- Neutral relevance: derivation manifests and captured compiler inputs.
- Caution: Nix store identities and Neutral IR identities solve different
  problems.

### Static Types for Dynamic Documents, Mark Shields, 2001

- Source: [OHSU repository record](https://digitalcollections.ohsu.edu/record/2532)
- License: CC BY according to the repository record.
- Local copy: [PDF](library/shields-static-types-dynamic-documents-thesis.pdf)
- Read for: type-indexed rows, extensible document structure, and staged
  computation.
- Neutral relevance: structured extensible data and explicit phase separation.
- Caution: it is a specialized type-system design, not a recommendation for
  Neutral's eventual type system.

### Exploring the Implementation Space of AST and Bytecode Interpreters, Octave Larose, 2026

- Source: [University of Kent record and PDF](https://kar.kent.ac.uk/113912/1/147ol_thesis.pdf)
- License: CC BY 4.0 according to the repository record.
- Access: link only because the repository's TLS chain could not be verified by
  the download environment; certificate verification was not bypassed.
- Read for: empirical comparison of representation and interpreter design under
  different implementation substrates.
- Neutral relevance: representation choice should follow measured constraints,
  not folklore.

### Protecting Systems From Exploits Using Language-Theoretic Security, Prashant Anantharaman, 2022

- Source: [Dartmouth repository](https://digitalcommons.dartmouth.edu/dissertations/80/)
- Access: open repository; link only pending a redistribution-license review.
- Read for: formal input recognition, parser attack surface, and secure handling
  of complex formats.
- Neutral relevance: `.neu` and Neutral IR are hostile inputs at trust
  boundaries.

## Papers on language and DSL design

### When and How to Develop Domain-Specific Languages

- Authors: Marjan Mernik, Jan Heering, Anthony M. Sloane.
- Source: [CWI report PDF](https://ir.cwi.nl/pub/10893/10893D.pdf)
- Read for: decision, analysis, design, and implementation patterns; domain
  analysis; the spectrum from non-executable specification to executable DSL.
- Neutral takeaway: justify a language with domain knowledge and explicit user
  jobs before designing syntax.

### Design Guidelines for Domain Specific Languages

- Authors: Gabor Karsai, Holger Krahn, Claas Pinkernell, Bernhard Rumpe, Martin
  Schindler, Steven Völkel.
- Source: [arXiv](https://arxiv.org/abs/1409.2378)
- Read for: purpose, realization, content, concrete syntax, comprehensibility,
  and tooling review questions.
- Neutral takeaway: evaluate authoring and tooling quality, not only compiler
  implementability.

### Growing a Language

- Author: Guy L. Steele Jr.
- Source: [OOPSLA paper PDF hosted by University of Virginia](https://www.cs.virginia.edu/~evans/cs655/readings/steele.pdf)
- Read for: language growth, composability, and the relationship between a small
  basis and user-defined abstraction.
- Caution: unrestricted macro growth would conflict with Neutral's bounded,
  analyzable role unless carefully constrained.

### The Nanopass Framework for Compiler Education

- Authors: Dipanwita Sarkar, Oscar Waddell, R. Kent Dybvig.
- Source: [peer-reviewed article and DOI](https://doi.org/10.1017/S0956796805005605)
- Read for: small intermediate languages, focused passes, and per-pass
  invariants.
- Neutral takeaway: do not hide every normalization inside one compiler step.

### MLIR: A Compiler Infrastructure for the End of Moore's Law

- Authors: Chris Lattner et al.
- Source: [paper](https://arxiv.org/abs/2002.11054) and
  [official MLIR documentation](https://mlir.llvm.org/)
- Read for: extensible IR infrastructure, dialects, verification, progressive
  lowering, textual inspection, and reusable tooling.
- Caution: Neutral's stable cross-application IR is not necessarily a multi-level
  optimization IR, and its domain vocabularies should not begin as arbitrary
  executable plugins.

### Security Applications of Formal Language Theory

- Authors: Len Sassaman, Meredith L. Patterson, Sergey Bratus, Anna Shubina.
- Source: [LangSec technical report](https://langsec.org/papers/langsec-tr.pdf)
- Read for: input recognizers, composition hazards, parser differentials, and
  reducing accidental input-language complexity.
- Neutral takeaway: define and bound the full accepted language at each trust
  boundary.

## IRs and formal specifications to study

### LLVM IR

- [Language reference](https://llvm.org/docs/LangRef.html)
- Study: explicit well-formedness, verifier discipline, types, identifiers,
  metadata, textual inspection, and binary bitcode separation.
- Do not copy: low-level operations, SSA as an automatic fit, undefined behavior,
  or target assumptions.

### MLIR

- [Language reference](https://mlir.llvm.org/docs/LangRef/)
- [Defining dialects](https://mlir.llvm.org/docs/DefiningDialects/)
- [Diagnostics](https://mlir.llvm.org/docs/Diagnostics/)
- Study: namespaced operations, verification, interfaces, modular tooling, and
  explicit conversion between abstraction levels.

### WebAssembly

- [Core specification](https://webassembly.github.io/spec/core/)
- [High-level goals](https://webassembly.org/docs/high-level-goals/)
- Study: separation of decoding, validation, execution, binary and text forms,
  embeddings, profiles, proposal-driven evolution, and conformance tests.
- Neutral takeaway: keep core meaning separate from host/application authority.

## Evolution, encoding, mapping, and API standards

### Protocol Buffers schema evolution

- Source: [official updating guidance](https://protobuf.dev/programming-guides/proto2/#updating)
- Study: field-number stability, unknown fields, reserved identifiers, and how
  compatibility differs among binary, JSON, and text encodings.
- Neutral takeaway: wire evolution must be documented for the chosen encoding;
  “uses Protobuf” is not a compatibility policy.

### RFC 8949: CBOR

- Source: [RFC Editor](https://www.rfc-editor.org/rfc/rfc8949.html)
- Study: logical data model, well-formed/valid/expected layers, preferred
  serialization, deterministic encoding, map ordering, and resource/security
  considerations.
- Neutral takeaway: deterministic encoding is an explicit profile, not the
  default property of a data format.

### RFC 8785: JSON Canonicalization Scheme

- Source: [RFC Editor](https://www.rfc-editor.org/rfc/rfc8785.html)
- Study: constraints needed to make JSON hashable, especially number, string,
  duplicate-name, and property-order rules.
- Neutral takeaway: choose the logical number/string model before choosing JSON
  canonicalization.

### ECMA-426: Source Map Format

- Source: [current specification](https://tc39.es/ecma426/) and
  [2024 standard PDF](https://ecma-international.org/wp-content/uploads/ECMA-426_1st_edition_december_2024.pdf)
- Study: generated-to-original mappings, conformance, optional data, and
  standard evolution.
- Neutral takeaway: origin mapping deserves a separate versioned contract.

### Language Server Protocol

- Source: [official specification](https://microsoft.github.io/language-server-protocol/)
- Study: capability negotiation, document identity/versioning, diagnostics,
  symbols, references, partial results, cancellation, and editor/server
  separation.
- Caution: LSP is not a compiler derivation or archival IR API.

### SARIF 2.1.0

- Source: [OASIS Standard](https://docs.oasis-open.org/sarif/sarif/v2.1.0/os/sarif-v2.1.0-os.html)
- Study: stable rule identifiers, locations, related locations, code flows,
  result taxonomies, and producer metadata.
- Neutral takeaway: structured diagnostics should be primary; presentation text
  is not enough.

## Repositories and implementation documentation

- [MLIR documentation](https://mlir.llvm.org/docs/) — IR verification, dialects,
  bytecode, diagnostics, C/Python APIs, passes, and language server.
- [Rust compiler development guide](https://rustc-dev-guide.rust-lang.org/) —
  compiler queries, incremental compilation, diagnostics, and architecture.
- [Salsa](https://salsa-rs.github.io/salsa/) — demand-driven incremental
  computation used by language tooling.
- [Crafting Interpreters source](https://github.com/munificent/craftinginterpreters) —
  companion implementation to the book.
- [WebAssembly specification repository](https://github.com/WebAssembly/spec) —
  specification source, reference interpreter, and official tests.
- [ECMA-426 repository](https://github.com/tc39/ecma426) — source-map standard,
  evolution process, and proposals.

## Books worth consulting but not copying

These are useful references with ordinary commercial copyright. No local copies
should be added without permission:

- *Types and Programming Languages*, Benjamin C. Pierce.
- *Engineering a Compiler*, Keith D. Cooper and Linda Torczon.
- *Modern Compiler Implementation*, Andrew W. Appel.
- *Domain-Specific Languages*, Martin Fowler.
- *The Design and Evolution of C++*, Bjarne Stroustrup.
- *Programming Language Pragmatics*, Michael L. Scott.

Their inclusion is a reading recommendation, not a claim that they are freely
redistributable.
