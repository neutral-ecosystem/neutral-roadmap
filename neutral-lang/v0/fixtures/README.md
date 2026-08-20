# Neutral v0 syntax and semantic fixtures

These fixtures exercise the current design contract. They are specification
inputs, not a compiler implementation and not a serialization format for
vocabulary bundles.

## Positive

- `positive/immutable-value-reuse.neu` demonstrates forward ordinary value use
  in a binding, list, and contextual record, plus a forward `ref(...)` identity
  link.
- `positive/minimal-flow.neu` is the first source-side vertical-slice fixture.
  Its `Flow` names use only the already documented illustrative vocabulary
  surface. The test harness must supply the tiny captured data-only bundle; this
  repository does not invent a bundle serialization to make the fixture work.
- `positive/visibility-defaults-compatibility.neu` covers `pub`, public
  containers, closed constant defaults, a constant-safe vocabulary static
  default, and permitted outer-nullability widening.

## Negative

- `negative/mut-modifier.neu` must fail parsing because v0 has no `mut`
  modifier.
- `negative/reassignment.neu` must fail parsing because v0 has no reassignment
  production.
- `negative/value-cycle.neu` parses but must fail semantic analysis because its
  ordinary immutable value-dependency graph is cyclic.
- `negative/nonconstant-default.neu` rejects an ordinary binding in a record
  default.
- `negative/generic-covariance.neu` rejects widening inside `List<T>`.
- `negative/private-public-surface.neu` rejects a public signature that exposes
  a private nominal type.
- `negative/module-path.neu` rejects `::` in the single-identifier module
  header.
- `negative/version-escape.neu` rejects escape syntax in the canonical language
  version token.
- `negative/version-leading-zero.neu` rejects a noncanonical version component.
- `negative/nested-private-reference.neu` rejects a private identity target
  nested inside the logical value of a public binding.
- `negative/field-visibility.neu` rejects an independent visibility modifier on
  a record field.
- `negative/namespace-reopen-a.neu` and `namespace-reopen-b.neu` form one
  compilation case that rejects namespace reopening across source units.
- `negative/vocabulary-collision-a.neu` and `vocabulary-collision-b.neu` form one
  compilation case that rejects a module-wide collision between `use Flow` and
  a root declaration named `Flow`.

## Numeric conversion

`numeric-conversions.md` defines host-independent semantic cases against an
abstract captured numeric contract. It deliberately does not invent a concrete
vocabulary-bundle encoding before that format is designed.

## Vocabulary contracts

`vocabulary-contract-cases.md` defines closed-schema rejection, transitive
feature closure, behavioral-default provenance, feature cycles, and unreachable
feature cases without prematurely choosing a bundle encoding.

## Secret delivery

`secret-delivery-cases.md` separates core type well-formedness from selected
profile/broker delivery capability and requires rejection before secret access.

Exact numeric diagnostic numbers and byte spans remain part of the unfinished
diagnostic registry. Until that registry exists, these fixtures assert the
diagnostic layer/class and success/failure result, not unstable human text.

The Neux fixture is intentionally not sketched from Flow. It is added only after
an independent Neux vocabulary case is researched, then used to challenge the
same public Neutral IR API and proposed core abstractions.
