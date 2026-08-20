# Proposed Neutral language v0 authoring guide

Status: working v0 authoring proposal

Purpose: show how people and a future GUI write the complete v0 `.neu` surface.
The [decision records](decisions/README.md), checklist answers, grammar, and
examples must remain synchronized with this guide.

## 1. Current design direction

The revised surface follows these preferences:

- declarations are type-first: `num x = 10`;
- every binding is immutable and initialized once;
- `num` is the preferred author-facing numeric type;
- `int`, `uint`, and `float` representations remain compiler/IR and domain
  contract concerns beneath `num`;
- source `num` is an exact base-10 value; integer and decimal lowering is exact,
  while named IEEE binary lowering defaults to deterministic nearest-even and
  may be constrained to exact;
- text uses `string`;
- nullability is a postfix type constructor such as `string?`;
- `null` is the only explicit source null/empty literal; there is no `absent`
  token;
- `::` resolves namespaces in the current module, including a vocabulary
  namespace introduced by `use`; it never marks a module boundary;
- `.` selects a vocabulary-owned enum case or static member; general value
  member access is not part of v0; and
- Neutral remains a tool-abstraction language, not a general-purpose language.

Three details are deliberate:

1. v0 has no mutation or reassignment. v1 first investigates immutable
   derivation/composition, then explicit override; mutation is considered only
   if both fail real Flow and independently designed Neux cases.
2. Integer and decimal conversion is exact. IEEE binary conversion defaults to
   deterministic round-to-nearest, ties-to-even; a vocabulary may require exact
   representation instead.
3. `string? label` means nullable, not omittable. A field without a default must
   be supplied; a field with a default may be omitted.

## 2. Complete example

```neu
neu "0.1"
module acme_delivery

use Flow

/* Reusable configuration data. */
pub record ToolConfig {
    string image,
    string? note,
    List<string> labels = [],
}

/* Data containing symbolic references. */
pub record InvocationInput {
    Ref<ToolConfig> config,
    SecretRef<string> token,
}

string tool_image = "example.invalid/tool:1"

pub ToolConfig base = {
    image: tool_image,
    note: null,
}

pub InvocationInput input = {
    config: ref(base),
    token: secret_ref("ci/signing-token"),
}

pub namespace checks {
    pub Flow::Pipeline verify = {
        input: ref(input),
        mode: Flow::Mode.strict,
    }
}
```

The compiler produces Neutral IR. It does not execute the pipeline, resolve the
secret, contact a provider, or define `Flow::Pipeline` behavior.

## 3. Source-file structure

Every source unit has this order:

```text
language version
module name
zero or more `use` declarations
zero or more declarations
```

### Language version

```neu
neu "0.1"
```

Every unit states an exact language-behavior version. There is no omitted
version, `latest`, or range. The quoted version is not a general string literal:
it must be canonical `major.minor`, with no escapes, signs, whitespace, leading
zeroes (except the component `0`), or extra components. v0 accepts exactly
`"0.1"`. Every unit in one compilation closure must declare
the same exact version; mixed-version closures are rejected before name or type
resolution.

### Module

```neu
module acme_delivery
```

A module name is one `snake_case` identifier. It is not a namespace path, file
path, URL, package download instruction, or mutable version tag. `::` never
appears in a module name.

One logical module may span multiple source units from the same captured package
identity. Their declarations merge into one module namespace; duplicate names
are errors and source-unit order has no semantic meaning. Units from different
packages cannot contribute to the same module in v0. A vocabulary `use` remains
source-unit scoped: each unit that spells `Flow::...` must contain `use Flow`.
Equal use names in units of the same module must resolve to the same captured
bundle or compilation fails.

An imported vocabulary namespace reserves its name across the complete merged
module. If any unit says `use Flow`, no root declaration named `Flow` is legal in
any unit. Repeated `use Flow` declarations must resolve to the same exact
vocabulary identity, digest, schema version, behavior version, and feature
contract.

One v0 compilation request contains units for exactly one logical module and
package identity. v0 has no source-module/package import or cross-module source
access. `use` introduces only a captured vocabulary namespace.

### Using a vocabulary

```neu
use Flow
```

The general form is `use Vocabulary`; vocabulary names use the uppercase-leading
identifier class and `UpperCamelCase` authoring style. `Flow` is an identifier,
not a keyword. For example, a future Neux source can
say `use Neux`. `use Flow` introduces the local vocabulary namespace `Flow`. It
is a logical import requirement, not an identity, package coordinate, download
request, or permission grant. The compilation request's captured lock manifest
must map `Flow` to exactly one permitted vocabulary identity, content digest,
schema version, behavior version, and supported feature set. Missing, ambiguous, or
mutable-only mappings fail before declaration validation.

The import exposes the captured vocabulary only through its namespace. It does
not inject `Pipeline`, `Mode`, or other members as unqualified names; authors
write `Flow::Pipeline` and `Flow::Mode.strict`.

`use Flow` does not silently require every feature the vocabulary may ever add.
The compiler computes a transitive feature closure seeded by referenced
types/members and expanded through instantiated fields, nested type/schema
dependencies, applied defaults, selected static values, constraints, behavioral classifications, and
feature-to-feature dependencies. It verifies the complete fixed point and
records each feature plus its reason in IR and derivation. v0 has no
source alias or selective-use syntax; those are future import-design questions.

## 4. Comments

```neu
// Line comment.

/* A short block comment. */

/*
A multiline block comment.
Block comments do not nest.
*/

string label = "ordinary declaration"
```

`//` begins a line comment and ends immediately before the logical newline.
`/*` opens a block comment and the next `*/` closes it. A block may be written
on one line or across multiple lines. Block comments do not nest because the
first closing delimiter closes the current block. An unclosed block comment is a lexical
error from its opening delimiter to end of source.

Both forms are non-semantic trivia. v0 has no documentation-attachment syntax;
adding one requires a distinct future decision rather than overloading comment
syntax. Newlines inside a block comment remain visible to logical-line
termination, so a comment cannot join two declarations accidentally.

## 5. Identifiers and qualification

v0 identifiers remain ASCII:

```text
[A-Za-z_][A-Za-z0-9_]*
```

Names follow two case classes:

- `snake_case` for bindings, fields, namespace names, module names, and
  vocabulary-owned static values; and
- `UpperCamelCase` style for record/type names and vocabulary namespaces.

Valid:

```neu
string image2 = "tool"
string internal_name = "value"
record ToolConfig { string image, }
```

Invalid:

```neu
string imageName = "tool" // Value names use snake_case.
string _internal = "value" // Leading underscore is not permitted.
string repeated__word = "value" // Repeated underscore is not permitted.
string InternalName = "value" // Binding must start lowercase.
record toolConfig { string image, } // Type must start uppercase.
string 2image = "tool"
string naïve = "value"
```

Value-level source names match
`[a-z][a-z0-9]*(?:_[a-z][a-z0-9]*)*`; underscores separate words but cannot
lead, trail, repeat, or introduce a digit-only segment. Type/vocabulary names
match `[A-Z][A-Za-z0-9]*`. The compiler enforces this uppercase-leading lexical
class; `UpperCamelCase` is the authoring style, not a claim that the compiler
can infer word boundaries. Thus `ABC` and `X123` are lexically valid even when a
style checker recommends a clearer spelling. Identifiers are case-sensitive.
Unicode display names belong in `string` values. v0 has no quoted identifiers.

Reserved core words are:

```text
neu module use pub namespace record
true false null ref secret_ref
```

`bool`, `num`, `string`, `List`, `Ref`, and `SecretRef` are predeclared core
type/type-constructor names. Predeclared core names cannot be declared or
shadowed in any scope.

Use `::` to resolve a name through namespaces in the current module, including
an imported vocabulary namespace:

```neu
checks::config
Flow::Mode
```

Use `.` only when selecting a vocabulary-owned enum case or static member from
a resolved qualified type:

```neu
Flow::Mode.strict
```

General value member access such as `config.image` and general calls are not part
of v0. The only call-shaped core forms are `ref(...)` and `secret_ref(...)`.
A decimal point occurs only between digits in a numeric literal or after a
qualified vocabulary type/static-member path, so it cannot be confused with
`::` qualification.

Module names never participate in `::` lookup. v0 has no syntax for reaching a
different source module, so a path cannot be ambiguous between a module and a
namespace.

## 6. Declaring and exporting bindings

The default form is type-first, immutable, and terminated by a line ending:

```neu
Type name = value
```

Examples:

```neu
bool enabled = true
num attempts = 3
num ratio = 0.75
string label = "build"
List<string> labels = ["portable", "checked"]
SecretRef<string> token = secret_ref("ci/token")
pub string release_channel = "stable"
```

There is no `let` keyword and no colon between name and type.

A declared name creates the machine-facing symbolic identity within its module
and namespace. Human display labels remain ordinary `string` fields. Renaming a
declaration changes its symbolic identity in v0.

Declarations are private unless marked `pub`. `pub` may precede a namespace,
record, or binding declaration; it cannot modify a field, header, or `use`.
Nested public declarations require every containing namespace to be public.
Visibility is recorded for IR consumers, documentation, and future imports; it
is not confidentiality or authorization, and v0 still has no cross-module source
access. A public declaration's exposed type signature cannot name a private
nominal type. For every public binding, the compiler recursively inspects the
containment nodes of its complete logical value, including nested records, lists,
and vocabulary payloads. It inspects but does not follow each `Ref<T>` edge, and
every encountered reference must target a public binding.

The declared type remains explicit. The following is invalid:

```neu
x = 10 // No declaration exists.
```

## 7. Immutable value reuse

All v0 bindings are immutable. There is no `mut` modifier and no reassignment:

```neu
num retries = 3
retries = 4 // Invalid: v0 has no assignment production.
```

An ordinary binding name in value position uses its immutable logical value:

```neu
string image = "example.invalid/tool:1"
string image2 = image
List<string> images = [image, image2]

Config config = {
    image: image,
}
```

The name may be namespace-qualified within the current module and must resolve
to a value binding whose type is compatible with the expected position. It creates a
static value-dependency edge. It does not create a `Ref<T>` value or preserve an
identity relationship in IR; provenance still links the use to its source and
originating binding.

Ordinary value references may point forward because declaration order is
non-semantic:

```neu
string image2 = image
string image = "example.invalid/tool:1"
```

The compiler collects declarations, resolves ordinary value dependencies from
binding initializers, contextual fields, and list elements,
rejects every dependency cycle, and evaluates the remaining graph
deterministically. Internal topological evaluation order is not source meaning.
Record defaults are closed constants and therefore add no binding dependency
edges.

Compatibility is deliberately invariant except for outer nullability widening:

```neu
string x = "a"
string? y = x // Valid: T widens to T?.

List<string> a = ["x"]
List<string>? nullable_list = a // Valid: the whole list widens to nullable.
List<string?> b = a // Invalid: generic arguments are invariant.
```

`T?` never narrows to `T`. `List<T>`, `Ref<T>`, and `SecretRef<T>` require exact
type arguments, and nominal/vocabulary-owned types require identical resolved
type identity. Numeric representation lowering is a separate check after both
source positions have type `num`.

`ref(image)` is separate: it creates a symbolic `Ref<string>` link to the
declaration identity and does not read or copy `image`. Forward `ref(...)`
resolution is allowed and its edges are excluded from value-cycle detection.

The next design priority is immutable derivation/composition, followed by
explicit override with deterministic precedence and provenance. v0 intentionally
has no spelling for either. v1 must test the capability against real Flow
configuration and an independently designed Neux case before choosing syntax.
Actual mutation is investigated only if both immutable mechanisms prove
insufficient.

## 8. The generic numeric type

Authors normally use one type:

```neu
num count = 10
num ratio = 0.25
num negative = -4
num grouped = 1_000_000
```

The source has only `num`; `int`, `uint`, decimal widths, and IEEE binary formats
are not author-facing type keywords. Before lowering, a literal is an exact
finite base-10 rational represented as an arbitrary-precision signed coefficient
and non-negative decimal scale: `coefficient × 10^-scale`. Logical values are
normalized by removing trailing decimal zeroes, so `10` and `10.0` compare equal;
every zero spelling, including `-0.0`, becomes coefficient `0`, scale `0`. The
original spelling remains in provenance. Logical IR carries the normalized
mathematical value, and concrete encoders must preserve it losslessly rather
than assuming a host or JSON number is sufficient.

Keep three layers distinct:

1. Neutral IR stores the exact logical `num`;
2. contract lowering validates and converts it for a named target; and
3. the consumer artifact stores the encoded representation, such as binary32
   bits.

A rounded lowering result links back to the exact value and contract. It never
replaces the exact `num` in Neutral IR.

Contract-specific conversion follows these rules:

- signed and unsigned integer targets require a mathematically integral value
  within the declared range;
- decimal targets require exact representation within declared precision,
  scale, and range;
- every IEEE binary target names its format, such as binary32 or binary64;
- binary conversion defaults to deterministic IEEE 754 round-to-nearest,
  ties-to-even, like Python's nearest-representable model;
- this default permits subnormal results and rounding a sufficiently small
  nonzero value to signed zero;
- a vocabulary may require `exact`, which rejects any changed mathematical value;
- overflow, invalid sign changes for integer targets, and non-finite results are
  rejected;
- text never automatically converts to a number; and
- widths, ranges, intermediate arithmetic, and rounding never come from the
  host machine.

Here, value-preserving means that interpreting the target representation under
its declared mathematical model yields exactly the same rational as the source
`num`. A rounded result is not called value-preserving; it is accepted by the
default nearest-even binary rule and rejected by an `exact` target.

Examples:

```neu
num whole = 10
num fraction = 10.5

// Invalid: type mismatch because string is not num.
num bad_text = "10"

// Unsupported numeric literals/values:
num not_supported = NaN
num not_supported_either = infinity
```

Automatic conversion examples, where the receiving vocabulary contract names
the representation, are:

| Source value | Expected representation | Result |
| --- | --- | --- |
| `10` | `uint32` | Accepted automatically |
| `-4` | `uint32` | Rejected: invalid sign |
| `10.0` | `int32` | Accepted automatically because it is integral |
| `10.5` | `int32` | Rejected: fractional loss |
| `0.1` | binary32, `exact` | Rejected: not exactly representable |
| `0.1` | binary32, default | Accepted as bits `0x3dcccccd` |
| `0.1` | binary64, default | Accepted as bits `0x3fb999999999999a` |
| `0.5` | binary32, `exact` | Accepted because it is exact |
| `16_777_216` | binary32, `exact` | Accepted because it is exact |
| `16_777_217` | binary32, `exact` | Rejected: precision loss |
| `16_777_217` | binary32, default | Accepted as `16_777_216` |
| `0.00000000000000000000000000000000000000000000000001` | binary32, default | Accepted as positive zero |

v0 numeric literals use decimal digits. Underscores may occur only between
digits. Leading zeroes other than `0` are invalid. Fractional values require
digits on both sides of the point. There is no exponent or non-decimal base.

The compiler resource profile separately limits significant decimal digits and
decimal scale before arbitrary-precision allocation or conversion. The
provisional desktop/CI baseline is 4,096 for each; callers may choose stricter
values, and stable limits require corpus measurements.

## 9. Primitive and opaque core types

| Type | Example | Meaning |
| --- | --- | --- |
| `bool` | `true` | Boolean value |
| `num` | `10.5` | Generic exact numeric value |
| `string` | `"hello"` | Unicode text |
| `SecretRef<T>` | `secret_ref("id")` | Opaque request for secret material delivered as `T`; not a primitive scalar |

The primitive scalar types are exactly `num`, `string`, and `bool`. `List<T>`
and `Ref<T>` are generic core types, named records are nominal types, and
`SecretRef<T>` is a security-sensitive opaque reference type whose parameter is
the requested delivery type.

`SecretRef` always requires exactly one type argument. Bare `SecretRef`, an
empty argument list, and multiple arguments are invalid.

`null` has no standalone declared type. It is accepted only when the expected
type ends with `?`.

There are no implicit conversions among `bool`, `string`, `SecretRef<T>`,
records, lists, and references.

## 10. Nullable variables

Place `?` after the type. Nullability is part of the type, not the declared
name:

```neu
string? label = null
num? result = null
ToolConfig? config = null
```

The same declarations may contain non-null values:

```neu
string? label = "build"
num? result = 42
```

Without `?`, null is invalid:

```neu
string label = null // Invalid.
```

There is no `Nullable<T>` spelling, optional declaration marker, or `absent`
value. `T?` is the nullable type constructor; nullability does not mean omission.

## 11. Lists

`List<T>` is ordered and homogeneous:

```neu
List<string> names = ["build", "test"]
List<num> values = [1, 2.5, 3]
List<List<num>> matrix = [[1, 2], [3]]
List<string> empty = []
```

Order and duplicates are preserved. A trailing comma is allowed. v0 has no map,
set, tuple, or heterogeneous list.

A nullable list places `?` after the complete list type. A list with nullable
elements places it on the element type:

```neu
List<string>? names = null
List<string?> labels = ["build", null]
```

## 12. Declaring record types

Record fields are type-first:

```neu
record Config {
    string image,
    string? note,
    List<string> labels = [],
}
```

| Form | Meaning |
| --- | --- |
| `string name,` | Required and non-null |
| `string? name,` | Required and nullable |
| `string name = "default",` | Omittable through a non-null default |
| `string? name = null,` | Omittable through a nullable default |
| `List<string> names,` | Ordered repeated values |

There is no explicit optional-field modifier. A field without a default must be
supplied; a field with a default may be omitted. Nullability and omission are
independent:

```neu
record NullableDefaults {
    string? note = null,
}
```

User-record defaults use a restricted closed `constant_value` subset: scalar
literals, nullable `null`, constant lists/records, and vocabulary static values
explicitly marked constant-safe by their captured bundle. They cannot read a
binding, create an identity reference, or request a secret:

```neu
record InvalidDefaults {
    string image = default_image, // Invalid: binding dependency.
    Ref<Config> config = ref(default_config), // Invalid: identity dependency.
    SecretRef<string> token = secret_ref("prod/token"), // Invalid: secret request.
}
```

Applying a default copies its closed constant into the constructed value and
retains the field-default declaration as provenance. It adds no binding edge to
the value-dependency graph.

Fields cannot repeat. Records are nominal: equal field shapes do not make two
record declarations the same type.

Fields have no independent visibility and cannot be marked `pub` or private.
Every field of an accessible record is part of that record's visible structural
contract.

Record fields and bindings are immutable in v0. Authors construct a new named
value instead of updating an existing one:

```neu
Config config = {
    image: "example.invalid/tool:1",
    note: null,
}
```

v0 has no spread/update syntax. Immutable derivation/update and explicit
override are prioritized for v1, require deterministic conflict rules and full
origin tracking, and must be tested first with real Flow configuration and then
an independent Neux case. This guide does not reserve or endorse `with` or any
other future spelling.

## 13. Constructing record values

```neu
Config config = {
    image: "example.invalid/tool:1",
    note: null,
}
```

Fields use `name: value` in construction even though declarations are
type-first. Defaults allow omission. Without a default, every field—including a
nullable field—must appear.

The declared or schema-provided expected type supplies the record constructor.
Repeating the type on the right-hand side is invalid:

```neu
// Invalid: repeated constructor type.
Config config = Config { image: "example.invalid/tool:1", note: null, }

// Invalid: field shorthand.
Config config = { image }

// Valid.
Config config = { image: "example.invalid/tool:1", note: null, }
```

The braced value is contextual, not an untyped anonymous record. It is accepted
only where exactly one expected nominal record or vocabulary-owned type is
known. Ambiguous or absent expected types are errors.

## 14. Namespaces

```neu
pub namespace checks {
    string mode = "strict"

    pub namespace api {
        pub bool enabled = true
    }
}
```

The names are `checks::mode` and `checks::api::enabled`. Namespaces do not
create files, execution stages, OS namespaces, provider groups, or security
zones.

Duplicates and shadowing are invalid. Ordinary binding-value uses and symbolic
`ref(...)` links may target bindings declared later. Ordinary value edges form a
static dependency graph whose cycles are invalid; `ref(...)` edges link identity
and are excluded. Declaration order has no meaning after the required language,
module, and `use` headers.

When a module spans source units, those rules apply to the merged module scope.
File/request order never breaks a duplicate-name tie or changes resolution.
A namespace cannot be reopened: a second `namespace checks` declaration is a
duplicate even when it occurs in another unit and contains different members.

## 15. Symbolic references

Use `ref(...)` to link to a value binding:

```neu
ref(config)
ref(checks::config)
```

If the target value binding has declared type `T`, the reference has type
`Ref<T>`:

```neu
record Selection {
    Ref<Config> config,
}

Selection selected = {
    config: ref(config),
}
```

A symbolic reference is not the target's copied value and does not automatically
mean containment, execution order, or data dependency. An ordinary `config` in
value position uses the immutable value; `ref(config)` links declaration
identity. Text containing a name remains text.

Neutral IR represents `Ref<T>` with target identity, expected target type/kind,
and provenance only. It has no dependency, ordering, ownership, readiness, or
containment meaning. Consumers must use an explicit vocabulary-owned construct,
such as `Flow::Dependency`, for those relationships and must never infer them
from a reference, field name, or source position.

Only value bindings are legal targets. Record types, other types, namespaces,
modules, and vocabulary namespaces are wrong-kind errors:

```neu
ref(Config) // Invalid: record type.
ref(checks) // Invalid: namespace.
ref(Flow) // Invalid: vocabulary namespace.
```

Static ordinary value-dependency cycles are invalid. Every nominal recursive record
cycle is also invalid unless each route around the cycle crosses a `Ref<T>`
edge. Nullability and collection containment do not break an embedded cycle:
`Node?` and `List<Node>` recursive edges remain invalid, while `Ref<Node>` is an
identity edge and is allowed. These dependency graphs ignore `ref(...)` and
`Ref<T>` edges because a reference links identities rather than embedding or
copying the target value. Cycles made exclusively of reference edges are
therefore valid:

```neu
record Node { Node? next, } // Invalid: nullable embedding is recursive.
record Group { List<Group> children, } // Invalid: list embedding is recursive.
record LinkedNode { Ref<LinkedNode> next, } // Valid: identity edge.
```

```neu
record A { Ref<B> b, }
record B { Ref<A> a, }

A a = { b: ref(b), }
B b = { a: ref(a), }
```

Module-qualified references do not exist in v0. Qualified references resolve
only through namespaces in the current module and never fetch source.

## 16. Secret references

```neu
SecretRef<string> token = secret_ref("ci/signing-token")
```

`secret_ref("id")` is contextually typed and does not determine `T` itself.
The use site must supply exactly one expected `SecretRef<T>` type, optionally
under the nullable wrapper `SecretRef<T>?`. A root value with no expected type,
a non-secret expected type, or an ambiguous expected secret type is invalid.

`SecretRef<string>` is not `string`:

```neu
SecretRef<string> wrong = "ci/signing-token" // Invalid.
```

The compiler stores an opaque logical reference, never resolved secret material.
Secret references cannot be interpolated, concatenated, printed as ordinary
text, or used to grant authority. Diagnostics redact them by default.

A nullable secret reference is written by applying `?` to the complete generic
type:

```neu
SecretRef<string>? token = null
```

The type parameter describes the delivery shape requested from the later secret
broker. The compiler does not resolve the secret or claim that its eventual
contents satisfy that shape. The compiler only validates that the type argument
is a well-formed Neutral type. Secret deliverability is a separate capability
contract published by the selected consumer/profile. It may reject otherwise
well-formed shapes such as `SecretRef<Ref<Config>>` or
`SecretRef<List<SecretRef<string>>>` before broker resolution.

## 17. Vocabulary-owned typed declarations

Vocabulary-owned declarations use the same binding form as every other named
value:

```text
Vocabulary::Type name = {
    schema_field: value,
}
```

Illustrative Flow-profile source:

```neu
Flow::Pipeline verify = {
    input: ref(input),
    mode: Flow::Mode.strict,
}
```

`Pipeline` is not a Neutral keyword or a special grammar production. The
captured data-only Flow bundle defines the qualified type, its fields, static
constraints, behavioral classification, and required features. Neutral does
not execute it.

“Data-only” is strict: bundles conform to a fixed versioned Neutral-owned closed
schema. They may declare types, fields, constant defaults, static values,
representation requirements, feature dependencies, behavioral IDs/classes, and
instances of predefined Neutral constraint kinds. They cannot contain scripts,
callbacks, arbitrary expressions, executable validators, custom code,
bytecode, native/Wasm modules, or entry points. Unknown required constraint
kinds fail closed.

Required features are a transitive closure over directly referenced members,
instantiated fields, nested type/schema dependencies, applied defaults, selected
static values, constraints, behavioral classifications, and feature
dependencies. IR records the final set and why each feature entered it.

Vocabulary-owned values are immutable copyable data. For example,
`Flow::Pipeline second = verify` creates a new declaration identity containing
the same logical value and reuse provenance. A vocabulary cannot mark a value
non-copyable in v0; identity-bearing relationships use `Ref<T>`.

An unknown or unqualified domain type is invalid:

```neu
Pipeline verify = {} // Invalid: no vocabulary owner.
```

## 18. Domain-owned types and static values

```neu
Flow::ArtifactRef artifact = {
    value: "sha256:example",
}

Flow::Mode mode = Flow::Mode.strict
```

The qualified static value is not a `string`. The data-only vocabulary bundle
defines its exact owning type, value identity, schema and behavior versions, and
must-understand behavior. An enum case is the primary v0 example. Static members
are inert declared values, not functions, computed properties, or general member
lookup on a runtime value.

The left side of `.` must resolve to a vocabulary-owned type that declares the
named static value. A user-defined record can never acquire or expose static
members in v0; a qualified path that merely has the right syntactic shape is
rejected when it does not resolve through the captured vocabulary bundle.

The bundle—not the author—independently classifies field presence/default,
nullability, and behavioral meaning. Unknown required behavior fails closed. v0
has no untyped `extensions` bag through which behavioral data can be hidden.
When a vocabulary default is applied, IR records its bundle field/default
identity and version, application site, behavioral classification, introduced
feature reasons, and whether the behavior came from source or default. Omitted
syntax therefore cannot create unexplained domain behavior.

## 19. Domain-owned relationships

```neu
Flow::Dependency check_after_build = {
    from: ref(build),
    to: ref(check),
}
```

Neutral validates names, target kinds, fields, and static bundle constraints.
Flow owns whether this means pipeline ordering. A Neux relationship would keep
its independent OS meaning.

## 20. Whitespace and punctuation

The private frontend is explicitly staged:

```text
raw lexer -> newline/layout normalizer -> parser
```

The raw lexer emits physical newlines. The layout stage—not the lexer—uses
delimiter and declaration-list context to emit semantic `LINE_END` tokens or
ordinary trivia. The parser consumes the normalized stream.

- Source is UTF-8. A BOM is accepted only at byte zero.
- Malformed UTF-8 and raw NUL bytes are fatal.
- `CRLF` and lone `CR` behave as logical `LF` while original bytes remain
  available for identity and source spans.
- Indentation is not syntax.
- A physical newline terminates a complete header or declaration in a source or
  namespace declaration list.
- A trailing `//` comment is trivia before that terminator, so
  `num x = 10 // explanation` is one valid declaration.
- Newlines inside value constructors, field lists, argument lists, list values,
  and type arguments are ordinary whitespace. Namespace braces do not suppress
  declaration-terminating newlines.
- A newline after an incomplete token such as `=`, `,`, `::`, or `.` continues
  the construct.
- A closing brace ends a braced declaration.
- Fields and list items require commas.
- A trailing comma is allowed and preferred in multiline forms.
- Semicolons are not part of the source grammar and are rejected.
- Two simple declarations cannot share one physical line.
- Braces, brackets, parentheses, and generic angle brackets must match.
- `::` qualifies names. `.` selects a vocabulary-owned enum case or static
  member and also appears inside numeric literals; general value member access
  is not part of v0.

The formatter uses four spaces, a default width of 100 columns, UTF-8, `LF`,
one final newline, double-quoted strings, and multiline trailing commas.

## 21. String literals

```neu
string message = "line one\nline two"
string symbol = "\u{03BB}"
```

Double-quoted strings support escaped backslash, quote, newline, carriage
return, tab, and Unicode scalar. v0 has no raw, multiline, or interpolated
string.

## 22. Features with no source spelling

| Feature | Supplied or produced by |
| --- | --- |
| Captured bytes and source identity | Resolver/compiler request |
| Vocabulary allowlist and trust policy | Host policy |
| Captured vocabulary bundle | Resolver |
| Compiler/build identity | Compiler |
| Resource budget/deadline | Compiler request/host |
| Derivation and IR identities | Compiler |
| Source map and origins | Compiler |
| Diagnostic redaction policy | Host/tool |
| Flow logical plan | Neutral Flow |
| Neux OS model | Neux |
| Authorization, credentials, execution | Consumer/runtime |

Source cannot override these with annotations or strings.

## 23. Diagnostics and limits

Diagnostic class prefixes are:

| Prefix | Meaning |
| --- | --- |
| `NL-ENC` | Encoding |
| `NL-LEX` | Tokens/literals/comments |
| `NL-PAR` | Grammar |
| `NL-NAM` | Names/collisions |
| `NL-KND` | Wrong declaration kind |
| `NL-TYP` | Type mismatch |
| `NL-DOM` | Domain schema/placement |
| `NL-FEA` | Unsupported feature |
| `NL-LIM` | Resource limit |
| `NL-INT` | Compiler/bundle defect |

Initial structural measurement limits remain 2 MiB per unit, 256 units, 16 MiB
per closure, depth 128, 4,096 significant decimal digits and absolute scale per
numeric literal, and 200 diagnostics plus one truncation record. Numeric limits
are checked before arbitrary-precision allocation or conversion. These are
profile measurement baselines, not frozen language semantics. Deadline and
memory ceilings are implementation/deployment policy; see
[implementation resource budgets](../docs/implementation-resource-budgets.md).

Recovered syntax never produces authoritative IR.

## 24. Deliberately unsupported

v0 still has no:

- implicit declaration types;
- source-module or package imports;
- maps, sets, tuples, unions, or core enums;
- field shorthand or untyped anonymous records;
- raw, multiline, or interpolated string;
- arithmetic, boolean, or comparison operators;
- functions, lambdas, loops, exceptions, or threads;
- mutation, reassignment, compound assignment, or mutation methods;
- macros or generated syntax;
- environment, filesystem, command, or network evaluation;
- executable vocabulary plugins;
- provider credentials or resolved secrets; or
- Flow/Neux runtime lifecycle syntax.

Future work prioritizes immutable derivation/composition, then explicit
override, before mutation is investigated at all.

## 25. Quick reference

| Goal | Revised syntax |
| --- | --- |
| Language version | `neu "0.1"` |
| Module | `module acme_delivery` |
| Vocabulary import | `use Flow` |
| Public declaration | `pub Config config = { ... }` |
| Immutable binding | `num x = 10` |
| Ordinary value reuse | `num y = x` |
| `string` | `string name = "value"` |
| Nullable variable | `string? name = null` |
| List | `List<string> names = ["one"]` |
| Record | `record Config { string name, }` |
| Contextual record value | `Config config = { name: "value", }` |
| Nullable field | `string? note,` |
| Default field | `List<string> names = [],` |
| Namespace | `namespace checks { ... }` |
| Identity reference | `ref(checks::config)` |
| Reference type | `Ref<Config>` |
| Secret | `SecretRef<string> token = secret_ref("logical/id")` |
| Vocabulary-owned declaration | `Flow::Pipeline verify = { ... }` |
| Vocabulary-owned value | `Flow::ArtifactRef artifact = { ... }` |
| Domain enum | `Flow::Mode.strict` |
| Line comment | `// explanation` |
| Block comment | `/* explanation */` |

## 26. Compact grammar sketch

This is a design sketch, not yet the normative grammar.
Blank lines separate productions in this sketch. It deliberately uses no
semicolon-like production terminator, matching the `.neu` surface.
Lexical trivia may occur between tokens unless a physical newline becomes a
semantic `LINE_END`; trivia is omitted from productions for readability.

```ebnf
source =
    trivia, language_header, module_header,
    { use_declaration },
    { declaration },
    end_of_file

language_header = "neu", language_version, LINE_END
language_version = '"', version_component, ".", version_component, '"'
version_component = "0" | NONZERO_DIGIT, { DIGIT }
NONZERO_DIGIT = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
module_header = "module", module_name, LINE_END

use_declaration =
    "use", upper_camel_name, LINE_END

declaration =
      namespace_declaration
    | record_declaration
    | binding_declaration

namespace_declaration =
    [ visibility ], "namespace", snake_name, "{",
    { declaration },
    "}", LINE_END

record_declaration =
    [ visibility ], "record", upper_camel_name, "{", { record_field }, "}", LINE_END

record_field =
    type, snake_name, [ "=", constant_value ], ","

binding_declaration =
    [ visibility ], type, snake_name, "=", value, LINE_END

visibility = "pub"

type =
    primary_type, [ "?" ]

primary_type =
      generic_type
    | qualified_name

generic_type =
    ( "List" | "Ref" | "SecretRef" ), "<", type, ">"

value =
      boolean_literal
    | numeric_literal
    | string_literal
    | "null"
    | list_value
    | contextual_record_value
    | qualified_static_value
    | binding_value
    | reference_value
    | secret_reference_value

list_value =
    "[", [ value, { ",", value }, [ "," ] ], "]"

contextual_record_value =
    "{", { value_field }, "}"

qualified_static_value =
    qualified_name, ".", snake_name

binding_value =
    qualified_name

value_field =
    snake_name, ":", value, ","

reference_value =
    "ref", "(", qualified_name, ")"

secret_reference_value =
    "secret_ref", "(", string_literal, ")"

constant_value =
      boolean_literal
    | numeric_literal
    | string_literal
    | "null"
    | constant_list_value
    | constant_contextual_record_value
    | constant_safe_qualified_static_value

constant_list_value =
    "[", [ constant_value, { ",", constant_value }, [ "," ] ], "]"

constant_contextual_record_value =
    "{", { constant_value_field }, "}"

constant_value_field =
    snake_name, ":", constant_value, ","

qualified_name =
    identifier, { "::", identifier }

module_name =
    snake_name

identifier =
      snake_name
    | upper_camel_name

snake_name =
    ASCII_LOWER, { ASCII_LOWER | DIGIT },
    { "_", ASCII_LOWER, { ASCII_LOWER | DIGIT } }

upper_camel_name =
    ASCII_UPPER, { ASCII_LETTER | DIGIT }
```

Static validation—not grammar alone—resolves every `use` name through the
captured lock manifest to one permitted exact vocabulary bundle; validates
that bundle against the closed Neutral-owned declarative schema and rejects
unknown constraint kinds or executable payloads; reserves
every used vocabulary namespace across the merged module; derives and checks the
transitive required-feature closure from direct and indirect contributors;
enforces nullable-only null and one unambiguous expected type for every contextual record;
requires one underlying expected `SecretRef<T>` for `secret_ref(...)`; restricts
ordinary binding values and `ref(...)` targets to value bindings; permits
forward value and identity resolution; requires exact expected types or only
outer `T` to `T?` widening for ordinary value use, with invariant generic
arguments; restricts record defaults to closed constants and constant-safe
vocabulary static values; requires the left side of `.` to resolve to a vocabulary-owned type
that declares the selected static value; rejects every static ordinary-value
dependency cycle and every nominal record cycle not broken by `Ref<T>` while
ignoring identity-reference edges for those checks; rejects mixed-version
closures, cross-package module merging, cross-module source access, and
duplicate names and namespace reopening in merged module scopes; enforces
private-by-default visibility, public-container rules, and recursive public-value
reference exposure checks; checks configured numeric digit and scale budgets
before expensive conversion; and checks declaration uniqueness, name-category
casing, and schema-owned vocabulary fields.

The raw lexer emits physical newlines. The newline/layout normalizer emits
`LINE_END` after a physical newline, including after a trailing line comment,
when the current source or namespace declaration-list item is complete. It
suppresses `LINE_END` inside value/type delimiters and after syntactically
incomplete tokens. Namespace declaration braces establish a nested
declaration-list mode; they do not suppress `LINE_END`. The layout normalizer
emits a synthetic `LINE_END` before end-of-file when needed.

## 27. How to revise this proposal

When changing a form, edit:

1. the complete example;
2. its dedicated section;
3. the quick-reference row;
4. the grammar sketch;
5. the old form that becomes invalid; and
6. the semantic questions created by the change.

For the current requested style, the central examples are:

```neu
num x = 10
num y = x
string label = "hello"
string? nullable_label = null
```

These forms are synchronized with the v0 decision records and the
master/version syntax checklists.
