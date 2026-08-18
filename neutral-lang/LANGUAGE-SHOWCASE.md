# Neutral language showcase

Status: showcase of the current v0 working proposal

This document demonstrates every surface feature currently decided for Neutral
v0. It does not invent syntax for unchecked v1 or v2 questions. Neutral is a
typed tool-abstraction language: it describes data, identities, references, and
vocabulary-owned declarations, then produces Neutral IR. It does not execute a
pipeline, shell command, provider operation, or secret lookup.

The normative direction remains in the
[v0 authoring guide](v0/proposed-syntax-guide.md) and grouped
[decision records](v0/decisions/README.md).

## Complete source example

The Flow declarations below are illustrative vocabulary-owned data. Their exact
fields and behavior come from the captured Flow vocabulary bundle, not Neutral
core.

```neu
neu "0.1"
module example::delivery

use Flow

// One-line comments are non-semantic trivia.

///
Block comments can span lines.
They do not become documentation or IR data.
///

record ToolConfig {
    string image,
    string? note,
    string channel = "stable",
    string? description = null,
    List<string> labels = [],
}

record InvocationInput {
    Ref<ToolConfig> config,
    SecretRef<string> token,
}

// Immutable bindings are the default.
bool enabled = true
num attempts = 3
num ratio = 0.75
num grouped = 1_000_000
string message = "line one\nline two"
string lambda = "\u{03BB}"
string? release_note = null
List<string> stages = ["build", "verify"]
List<string?> labels = ["portable", null]
List<string>? inherited_labels = null

// Contextual construction gets its nominal type from the left-hand side.
// channel, description, and labels are omitted, so their defaults apply.
ToolConfig base = {
    image: "example.invalid/tool:1",
    note: null,
}

InvocationInput input = {
    config: ref(base),
    token: secret_ref("ci/signing-token"),
}

// mut and reassignment are provisional v0 features.
mut num retry_count = 0
retry_count = 2

namespace checks {
    bool checks_enabled = true

    Flow::Pipeline build = {
        input: ref(example::delivery::input),
        mode: Flow::Mode.strict,
    }

    Flow::Pipeline verify = {
        input: ref(example::delivery::input),
        mode: Flow::Mode.strict,
    }

    Flow::Dependency verify_after_build = {
        from: ref(build),
        to: ref(verify),
    }
}

Flow::ArtifactRef artifact = {
    value: "sha256:example",
}
```

There are no trailing semicolons. A newline terminates a complete simple
declaration or assignment. Commas separate fields and list elements, with a
trailing comma allowed and preferred in multiline forms.

## Headers, modules, and vocabularies

Every source unit begins with an exact language version and one logical module.
Module segments use `snake_case`:

```neu
neu "0.1"
module example::delivery
```

All units in one v0 compilation closure use the same language version. Units
from the same captured package may declare the same module; their declarations
merge into one logical module scope. Unit order has no meaning, and duplicate
names are errors. Equal module names from different packages do not merge.

A vocabulary is imported by logical name:

```neu
use Flow
```

Vocabulary names use an uppercase-leading identifier class and
`UpperCamelCase` style. `Flow` is an identifier, not a keyword. The captured
lock manifest resolves it to one exact permitted vocabulary identity,
digest, schema version, behavior version, and feature set. `use` performs no
download, ambient lookup, or permission grant. It exposes only qualified names
such as `Flow::Pipeline`; it does not inject an unqualified `Pipeline`.

Vocabulary uses are source-unit scoped. Every unit that contains a
`Flow::...` name declares `use Flow`. Equal uses in units of the same module must
resolve to the same bundle.

## Names and qualification

Identifiers are case-sensitive ASCII names:

```text
[A-Za-z_][A-Za-z0-9_]*
```

Bindings, fields, namespace/module segments, and vocabulary static values use
`snake_case`. Record/type names and vocabulary namespaces use `UpperCamelCase`
style; the compiler enforces an uppercase-leading ASCII identifier rather than
trying to infer word boundaries:

```neu
string release_name = "stable"
record ReleaseConfig { string image, }
use Flow
```

The stricter value-name shape is `[a-z][a-z0-9]*(?:_[a-z][a-z0-9]*)*`:
underscores separate words but cannot lead, trail, repeat, or introduce a
digit-only segment. Names such as `_internal`, `release__name`, `releaseName`, a
lowercase record name, or an uppercase binding name are invalid.

`::` resolves through module, namespace, or vocabulary scopes:

```text
checks::build
example::delivery::base
Flow::Mode
```

`.` selects only an inert vocabulary-owned static value, such as an enum case:

```neu
Flow::Mode mode = Flow::Mode.strict
```

It is not general value member access. Forms such as `config.image`, functions,
method calls, and computed properties are not part of v0. The left side must
resolve to a type from the captured vocabulary bundle that declares the selected
static value; user-defined records cannot have static members.

## Scalar and collection types

The author-facing primitive scalar types are:

| Type | Examples | Rule |
| --- | --- | --- |
| `num` | `10`, `-4`, `0.25`, `1_000` | Exact source number |
| `string` | `"hello"`, `"\u{03BB}"` | Finite Unicode scalar sequence |
| `bool` | `true`, `false` | Boolean |

`null` is not a fourth declared type. It is accepted only where the expected
type has postfix nullability:

```neu
string? note = null
List<string>? names = null
List<string?> labels = ["one", null]
```

`List<T>` is ordered and homogeneous. Order and duplicates are retained:

```neu
List<num> values = [1, 2.5, 1]
List<List<num>> matrix = [[1, 2], [3]]
List<string> empty = []
```

The explicit expected type disambiguates an empty list and `null`.

### Numeric representation

Source uses only `num`. A captured IR or vocabulary contract may require an
`int`, `uint`, or `float` representation. The compiler converts automatically
only when value and range are preserved. It rejects overflow, invalid sign,
narrowing, and precision loss. Text never converts to a number.

```neu
num whole = 10
num fraction = 10.5
num bad = "10" // Invalid: string is not num.
```

`NaN`, infinity, exponent notation, and non-decimal numeric literals are not v0
numeric forms.

## Records, defaults, omission, and nullability

Records are nominal and fields are type-first:

```neu
record Example {
    string required_text,
    string? required_nullable_text,
    string defaulted_text = "default",
    string? defaulted_nullable_text = null,
    List<string> ordered_values = [],
}
```

Field presence and nullability are independent:

| Declaration | Must appear in construction? | May contain `null`? |
| --- | --- | --- |
| `string name,` | Yes | No |
| `string? name,` | Yes | Yes |
| `string name = "default",` | No | No |
| `string? name = null,` | No | Yes |

There is no optional-field modifier and no `absent` value. Omission means that a
declared default is applied; it remains distinguishable from explicit `null` in
provenance and IR.

Record construction is contextual:

```neu
Example value = {
    required_text: "present",
    required_nullable_text: null,
}
```

The right-hand side does not repeat `Example`. Untyped anonymous records and
field shorthand are not supported.

## Bindings and provisional mutation

Bindings are immutable by default and always state their type:

```neu
num attempts = 3
string label = "verify"
```

There is no `let` keyword and no `name: Type` binding syntax.

The proposed `mut` form permits same-type reassignment only within the same
lexical declaration list and source unit:

```neu
mut num counter = 0
counter = 1
```

Cross-unit assignment, qualified assignment targets, compound assignment,
increments, and mutation methods are invalid. `mut` remains provisional; the
v0 proposal is not normative until it is accepted or removed.

## Namespaces

Namespaces provide lexical qualification only:

```neu
namespace checks {
    string image = "example.invalid/check:1"

    namespace internal {
        bool enabled = true
    }
}
```

The resulting names are `checks::image` and `checks::internal::enabled`.
Namespaces do not create files, pipeline stages, OS namespaces, provider groups,
or security zones. Duplicate names and shadowing are invalid. Predeclared core
names cannot be declared or shadowed in any scope.

## Symbolic references

`ref(...)` links the identity of a value binding:

```text
ref(config)
ref(checks::config)
ref(example::delivery::checks::config)
```

If the target binding has declared type `T`, the result has type `Ref<T>`.
References do not copy, evaluate, contain, order, schedule, or snapshot their
targets. A reference to a mutable binding links its identity, whose emitted
value is its final valid assignment. Because `ref(...)` resolves identity, it
may point forward to a mutable or immutable binding. A mutable assignment must
still occur after that binding's declaration.

```neu
Selection selected = { config: ref(config), }
mut Config config = { image: "example.invalid/tool:1", }
```

This is a forward identity link, not a read of `config` at that source position.
v0 has no ordinary binding-name value expression such as `num a = b`.

Only value bindings are legal targets:

```text
ref(Config) // Invalid: record type.
ref(checks) // Invalid: namespace.
ref(Flow) // Invalid: vocabulary namespace.
```

Direct value-initialization cycles are invalid. Every nominal recursive record
cycle must cross `Ref<T>`; neither `Node?` nor `List<Node>` breaks an embedded
cycle. `ref(...)` and `Ref<T>` edges are identity links and are ignored by those
cycle checks, so a reference-only cycle is valid:

```neu
record A {
    Ref<B> b,
}

record B {
    Ref<A> a,
}

A a = {
    b: ref(b),
}

B b = {
    a: ref(a),
}
```

A consumer vocabulary may still reject such a cycle under its own domain
rules. Neutral does not call every reference an execution dependency.

## Secret references

Secret requests are opaque and contextually typed:

```neu
SecretRef<string> token = secret_ref("ci/signing-token")
SecretRef<string>? nullable_token = null
```

The string identifies the logical request; it does not determine `T` and is not
the secret material. The use site supplies exactly one expected
`SecretRef<T>`, optionally under `SecretRef<T>?`. Missing, non-secret, or
ambiguous expected types are errors.

Neutral never resolves the secret. IR retains an opaque identifier and safe
provenance, while normal diagnostics and renderers redact the identifier.
`SecretRef<T>` does not implicitly convert to `string`.

## Vocabulary-owned data

Vocabulary types use the same type-first binding and contextual construction as
Neutral records:

```neu
Flow::ArtifactRef artifact = {
    value: "sha256:example",
}

Flow::Mode mode = Flow::Mode.strict
```

Every vocabulary field independently defines:

- whether it is required or has a default and may be omitted;
- whether its type is nullable; and
- whether it is behavioral data or non-behavioral metadata.

Unknown required behavior fails closed. Ignorable metadata needs an explicit,
bounded schema envelope and preservation policy. There is no untyped universal
`extensions` bag.

Vocabulary relationships are typed values whose meaning remains vocabulary
owned:

```neu
Flow::Dependency verify_after_build = {
    from: ref(build),
    to: ref(verify),
}
```

Neutral validates fields, target kinds, references, bounds, and captured static
constraints. Flow decides whether this relationship represents pipeline order.

## Multiple source units

Two captured units from the same package may contribute different declarations
to one module.

`config.neu`:

```neu
neu "0.1"
module example::shared

record Config {
    string image,
}
```

`values.neu`:

```neu
neu "0.1"
module example::shared

Config config = {
    image: "example.invalid/tool:1",
}
```

The compiler merges both declaration sets independent of resolver order. Mixed
language versions, duplicate declarations, cross-package module merging, and
cross-unit mutation are rejected.

## Comments and strings

```neu
// Line comment.

/// One-line block comment. ///

///
Multiline block comment.
Block comments do not nest.
///

string escaped = "quote: \" slash: \\ newline: \n tab: \t"
```

Both comment forms are non-semantic. Double-quoted strings support escapes for
backslash, quote, newline, carriage return, tab, and Unicode scalars. Raw,
multiline, and interpolated string literals are not part of v0.

## Source text, diagnostics, and safety limits

`.neu` source is UTF-8. One byte-order mark is accepted only at byte zero.
Malformed UTF-8 and unescaped raw NUL bytes are fatal. `CRLF` and lone `CR` act
as logical `LF`, while original bytes remain available for content identity and
source spans. Indentation is formatting, not syntax.

Diagnostics retain stable machine-readable categories:

| Prefix | Category |
| --- | --- |
| `NL-SYN-ENC` | Encoding |
| `NL-SYN-LEX` | Tokens, literals, and comments |
| `NL-SYN-PAR` | Grammar and recovery |
| `NL-SYN-NAM` | Names and collisions |
| `NL-SYN-KND` | Wrong declaration or reference kind |
| `NL-SYN-TYP` | Type mismatch or numeric conversion |
| `NL-SYN-DOM` | Vocabulary schema or placement |
| `NL-SYN-FEA` | Unsupported required feature |
| `NL-SYN-LIM` | Structural resource limit |
| `NL-SYN-INT` | Compiler or captured-bundle defect |

The draft v0 structural baseline limits a unit to 2 MiB, a closure to 256 units
and 16 MiB, structural nesting to 128, and ordinary diagnostics to 200 followed
by one truncation diagnostic. Limit failure produces no authoritative IR.
Hardware-dependent time and memory ceilings belong to named implementation
profiles, not language semantics.

## Features supplied outside source syntax

| Feature | Owner |
| --- | --- |
| Captured source bytes and identities | Resolver/compiler request |
| Package and vocabulary lock data | Resolver/compiler request |
| Vocabulary permission and trust policy | Host policy |
| Vocabulary schema and behavior bundle | Captured data-only bundle |
| Required feature derivation | Compiler and vocabulary schema |
| IR, derivation identity, origins, and source map | Compiler |
| Resource budget and diagnostic-redaction policy | Compiler request/host |
| Flow logical plan and CI/CD behavior | Neutral Flow |
| Neux OS abstraction and command behavior | Neux |
| Authorization, credentials, and execution | Consumer/runtime |

Source syntax cannot grant authority, select mutable “latest” dependencies,
read the environment or filesystem, contact a network, or execute vocabulary
code.

## Deliberately absent from v0

The current surface intentionally has no:

- implicit declaration types or `let`;
- semicolon terminators;
- source-module/package imports;
- maps, sets, tuples, unions, or core enum declarations;
- untyped anonymous records or field shorthand;
- raw, multiline, or interpolated strings;
- general value member access or indexing;
- arithmetic, Boolean, or comparison operators;
- general functions, methods, lambdas, loops, exceptions, or threads;
- compound assignment or mutation methods;
- macros, generated syntax, or executable compiler plugins;
- environment, filesystem, command, provider, or network evaluation;
- provider credentials or resolved secret material; or
- Flow/Neux runtime lifecycle semantics.

Later-version checklist entries are design questions, not implemented syntax.
They should be added to this showcase only after their decisions, lowering,
diagnostics, and conformance fixtures are complete.
