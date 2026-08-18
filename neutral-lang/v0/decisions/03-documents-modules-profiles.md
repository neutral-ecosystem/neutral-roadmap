# Section 3: documents, modules, imports, and profiles

Status: proposed

Answers: `SYN-DOC-001` through `SYN-DOC-004`

## SYN-DOC-001 — Language behavior version

Every source unit MUST begin, after trivia, with:

```neu
neu "0.1"
```

The value is an exact language-behavior version, not a range. Every unit states
it explicitly; v0 does not inherit from a directory, filename, environment, or
other source. Unsupported versions fail before later declarations are parsed.

Language version is independent from compiler API, IR schema, encoding, and
vocabulary versions. Omitting the header or selecting “latest” is invalid.

## SYN-DOC-002 — Top-level shape

After the language header, a unit contains exactly one `module` header, zero
or more vocabulary `use` declarations, and ordinary declarations:

```text
language header
module header
use declarations*
declaration*
```

Arbitrary values cannot appear at root; a root value must use an explicit
type-first declaration such as `num retries = 3`.
`use` declarations precede ordinary declarations. Declaration order is
presentation order, not execution order or precedence. The root is not an
implicit Flow pipeline or Neux script.

## SYN-DOC-003 — Vocabulary use and policy

Source introduces a vocabulary namespace with:

```neu
use Flow
```

The general form is `use Vocabulary`; `Flow` is an identifier, not a keyword.
For example, a future Neux source can say `use Neux`. `Flow` is a source-local
logical vocabulary name and the namespace used by forms such as
`Flow::Pipeline`. It is not itself a package identity or mutable version.
The compilation request's captured lock manifest MUST map it to exactly one
permitted vocabulary identity, content digest, schema version, behavior version,
and supported feature set.

This declaration performs no ambient lookup. The resolver provides the exact
captured data-only bundle named by the manifest. Source cannot broaden policy,
choose mutable “latest,” or activate code. A missing, ambiguous, mutable-only,
disallowed, or mismatched mapping fails before validating vocabulary-owned typed
declarations.

The import exposes members only below the vocabulary namespace. It does not add
unqualified names to the surrounding scope: `Flow::Pipeline` is valid, while an
unqualified `Pipeline` is not imported.

Used vocabulary members declare their feature dependencies in the captured
bundle. The compiler aggregates and verifies those features instead of treating
`use Flow` as a request for every present or future feature. It records the
actual used feature set and exact resolution in IR/derivation.

Use names share the root namespace and are unique. v0 has no source alias,
selective-use, version-range, or inline vocabulary-identity syntax. Two bundles
that require the same source name cannot coexist in one v0 unit; supporting that
case requires the future vocabulary-renaming decision.

## SYN-DOC-004 — Module and package names

Every unit declares one logical module:

```neu
module acme::delivery
```

A module is one or more identifiers joined by `::`. It is a logical name, not
a path, URL, registry coordinate, mutable tag, package identity, or display
label.

The request associates each unit with immutable content and package identity.
The module declaration must agree with that manifest. Two units cannot claim
the same module name in one closure.

v0 has no source-module or package imports. The request/resolver may provide a
closed set of units for qualified references. `use` imports only a captured
vocabulary namespace; neither module spelling nor `use` searches disk or network.

## Invalid and boundary cases

Missing, duplicate, late, malformed, or unsupported headers; absent or duplicate
modules; late or duplicate `use` declarations; missing/ambiguous/disallowed lock
mappings; version or digest mismatch; unsupported used features; and namespace
collisions each receive distinct diagnostics.

All header records and spans enter the derivation manifest. Diagnostics require
no consumer or vocabulary code execution.
