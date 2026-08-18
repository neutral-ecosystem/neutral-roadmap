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
or more vocabulary requirements, and declarations:

```text
language header
module header
vocabulary requirements*
declaration*
```

Arbitrary values cannot appear at root; a root value must use an explicit
type-first declaration such as `num retries = 3`.
Vocabulary requirements precede declarations. Declaration order is presentation
order, not execution order or precedence. The root is not an implicit Flow
pipeline or Neux script.

## SYN-DOC-003 — Vocabulary requests and policy

Source requests a vocabulary with:

```neu
requires vocabulary "org.neutral.flow" as flow {
    schema: "0.1",
    behavior: "0.1",
    features: ["pipeline"],
}
```

`"org.neutral.flow"` is the exact vocabulary identity and `flow` is its
explicit source-local namespace alias. The body holds exact schema and behavior
versions plus required feature identities. Duplicate features are invalid.

This declaration performs no lookup. The compilation request MUST permit the
identity/version and its resolver MUST provide the exact captured data-only
bundle. Source cannot broaden policy, choose mutable “latest,” or activate code.
A mismatch is reported before validating vocabulary-owned typed declarations.

Aliases share the root namespace and are unique. One bundle may have only one
alias in a v0 unit.

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

v0 has no source-level imports. The request/resolver may provide a closed set of
units for qualified references. Module spelling never searches disk or network.

## Invalid and boundary cases

Missing, duplicate, late, malformed, or unsupported headers; absent or duplicate
modules; late vocabulary requirements; malformed identities or missing `as`
aliases; missing/disallowed bundles; version or digest mismatch; and duplicate
aliases each receive distinct diagnostics.

All header records and spans enter the derivation manifest. Diagnostics require
no consumer or vocabulary code execution.
