# Section 3: documents, modules, imports, and profiles

Status: proposed

Answers: `SYN-DOC-001` through `SYN-DOC-004` and `SYN-DOC-007`

## SYN-DOC-001 — Language behavior version

Every source unit MUST begin, after trivia, with:

```neu
neu "0.1"
```

The quoted token has its own canonical `language_version` grammar; it is not a
general `string` value. Its content is `major.minor`, where each component is
`0` or a nonzero ASCII decimal digit followed by zero or more digits. Escapes,
whitespace, signs, leading-zero variants, extra components, ranges, and names
such as `latest` are invalid. v0 accepts exactly the canonical spelling
`"0.1"`. Every unit states it explicitly; v0 does not inherit from a directory,
filename, environment, or other source. Unsupported well-formed versions fail
before later declarations are parsed.

Every source unit in one compilation closure MUST declare the same exact
language-behavior version. A mixed-version closure fails before merged module
construction, name resolution, or type checking. Cross-version compilation is
not a v0 compatibility feature.

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
presentation order, not execution order or precedence. Relative order among
`use` declarations and among ordinary declarations has no semantic meaning. The root is not an
implicit Flow pipeline or Neux script.

## SYN-DOC-003 — Vocabulary use and policy

Source introduces a vocabulary namespace with:

```neu
use Flow
```

The general form is `use Vocabulary`; vocabulary names use the uppercase-leading
identifier class and `UpperCamelCase` authoring style. `Flow` is an identifier,
not a keyword. For example, a future Neux source can
say `use Neux`. `Flow` is a source-local logical vocabulary name and the
namespace used by forms such as `Flow::Pipeline`. It is not itself a package
identity or mutable version.
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

Referenced vocabulary members seed the transitive feature-closure procedure in
`SYN-DOM-002`; nested schema dependencies, applied defaults, static values,
constraints, behavioral classifications, and feature dependencies may add
indirect requirements. The compiler verifies and records the complete closure
and its reason edges instead of treating `use Flow` as a request for every
present or future feature.

Vocabulary namespace names are reserved across the complete merged module, not
only the unit containing `use`. If any unit says `use Flow`, no declaration of
any kind named `Flow` may appear at module root in any unit. Repeating `use Flow`
in another unit is allowed only when both uses resolve to the same exact
vocabulary identity, content digest, schema version, behavior version, and
feature contract. v0 has no source alias, selective-use, version-range, or inline vocabulary-identity
syntax. Two bundles that require the same source name cannot coexist in one v0
closure; supporting that case requires the future vocabulary-renaming decision.
Within one source unit, the same `use` name may appear at most once.

## SYN-DOC-004 — Module and package names

Every unit declares one logical module:

```neu
module acme_delivery
```

A module is exactly one `snake_case` identifier. It is a logical name, not a
namespace path, filesystem path, URL, registry coordinate, mutable tag, package
identity, or display label. `::` is not part of module-name syntax.

The request associates each unit with immutable content and package identity.
The module declaration must agree with that manifest. One v0 compilation request
contains source units for exactly one logical module and captured package
identity. Multiple units may declare that same module and merge into one module
scope. A different module name or package identity is a request-level error.
Duplicate declarations across merged units are errors, and source-unit or
resolver order has no semantic meaning.

A namespace is one declaration and cannot be reopened. Two namespace
declarations named `checks` are duplicates even when they occur in different
source units and contain disjoint members. Namespace contents exist only inside
their single declaring block.

Vocabulary `use` declarations remain source-unit scoped: every unit that uses a
vocabulary-qualified name declares the corresponding `use`. Equal use names in
units of the same module must resolve to the same exact captured bundle. A
different resolution is a closure-level conflict, not an order-dependent choice.

v0 has no source-module/package imports and no cross-module source access.
`qualified::names` resolve only through namespaces in the current module or a
vocabulary namespace introduced by `use`; a module name never participates in
that resolution. `use` imports only a captured vocabulary namespace; neither
module spelling nor `use` searches disk or network. An explicit module-import or
absolute-module syntax remains a future decision.

## SYN-DOC-007 — Visibility and exports

Declarations are private unless marked `pub`:

```neu
pub record ToolConfig {
    string image,
}

pub ToolConfig config = {
    image: "example.invalid/tool:1",
}
```

`pub` may modify a namespace, record declaration, or binding declaration; it is
not legal on a field, `use`, or header. Fields have no independent visibility:
every field of an accessible record is part of that record's visible structural
contract. A nested public declaration requires
every containing namespace to be `pub`, otherwise the declaration is rejected as
a misleading unreachable export. A public declaration's exposed type signature
cannot name a private nominal type. For a public binding, the compiler
recursively traverses the complete logical value's containment nodes—including
nested records, lists, and vocabulary payloads—and inspects every encountered
`Ref<T>`. It does not follow reference edges during traversal; each encountered
reference is rejected when its target is not public. This exposure check is
bounded, cycle-safe, and independent of source nesting depth.

Visibility defines the module's exported declaration surface in IR,
documentation, and consumer tooling. Private declarations remain in IR when
needed to represent and explain the compiled module, and authorized readers may
inspect them. `pub` is therefore not confidentiality, authorization, or a trust
boundary.

Because v0 has no cross-module source access, `pub` does not make a declaration
addressable from another source module yet. Future module imports may expose only
this recorded public surface; they must not retroactively treat all v0 private
declarations as public.

## Invalid and boundary cases

Missing, duplicate, late, malformed, escaped, noncanonical, or unsupported
version headers; mixed closure
versions; multiple module/package identities in one request; duplicate names
or namespace reopening in a merged module; conflicting cross-unit vocabulary
resolutions; module-wide vocabulary/declaration name collisions; late or
duplicate `use` declarations within one unit; missing, ambiguous, or disallowed
lock mappings; version or digest mismatch; unsupported required features;
namespace collisions; misplaced `pub`; a public declaration inside a private
namespace; and public surfaces exposing private types or identity targets each
receive distinct diagnostics.

All header records and spans enter the derivation manifest. Diagnostics require
no consumer or vocabulary code execution.
