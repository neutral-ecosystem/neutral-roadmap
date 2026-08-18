# Proposed Neutral language v0 authoring guide

Status: working v0 authoring decision

Purpose: show how people and a future GUI write the complete v0 `.neu` surface.
The [decision records](decisions/README.md), checklist answers, grammar, and
examples must remain synchronized with this guide.

## 1. Current design direction

The revised surface follows these preferences:

- declarations are type-first: `num x = 10`;
- bindings are immutable unless prefixed with `mut`;
- `num` is the preferred author-facing numeric type;
- `int`, `uint`, and `float` representations remain compiler/IR and domain
  contract concerns beneath `num`;
- checked numeric conversion among those representations is automatic;
- text uses `string`;
- nullability is a postfix type constructor such as `string?`;
- `null` is the only explicit source null/empty literal; there is no `absent`
  token;
- `::` resolves a name through module or namespace scopes, including a
  vocabulary namespace introduced by `use`;
- `.` selects a member or enum case; and
- Neutral remains a tool-abstraction language, not a general-purpose language.

Three details need deliberate review:

1. `mut` introduces assignment order into a declarative language. This guide
   shows a restricted design, but mutation should be removed from v0 unless a
   real Flow and Neux need justifies it.
2. Automatic numeric conversion is limited to exact or safely widening
   conversion. Silent precision loss is rejected.
3. `string? label` means nullable, not optional. A record field must still be
   supplied unless it has a default.

## 2. Complete example

```neu
neu "0.1"
module acme::delivery

use Flow

/// Reusable configuration data. ///
record ToolConfig {
    string image,
    string? note,
    List<string> labels = [],
}

/// Data containing symbolic references. ///
record InvocationInput {
    Ref<ToolConfig> config,
    SecretRef<string> token,
}

ToolConfig base = {
    image: "example.invalid/tool:1",
    note: null,
}

InvocationInput input = {
    config: ref(base),
    token: secret_ref("ci/signing-token"),
}

namespace checks {
    Flow::Pipeline verify = {
        input: ref(acme::delivery::input),
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
version, `latest`, or range.

### Module

```neu
module acme::delivery
```

A module name is a `::`-qualified logical name. It is not a file path, URL,
package download instruction, or mutable version tag.

v0 has no source-module or package import statement. `use` introduces only a
captured vocabulary namespace; the compiler request supplies the source closure.

### Using a vocabulary

```neu
use Flow
```

The general form is `use Vocabulary`; `Flow` is an identifier, not a keyword.
For example, a future Neux source can say `use Neux`. `use Flow` introduces the
local vocabulary namespace `Flow`. It is a logical
import requirement, not an identity, package coordinate, download request, or
permission grant. The compilation request's captured lock manifest must map
`Flow` to exactly one permitted vocabulary identity, content digest, schema
version, behavior version, and supported feature set. Missing, ambiguous, or
mutable-only mappings fail before declaration validation.

The import exposes the captured vocabulary only through its namespace. It does
not inject `Pipeline`, `Mode`, or other members as unqualified names; authors
write `Flow::Pipeline` and `Flow::Mode.strict`.

`use Flow` does not silently require every feature the vocabulary may ever add.
Each referenced vocabulary type, member, field, or enum case identifies its
required features in the captured bundle. The compiler aggregates that used
feature set, verifies support, and records it in IR and derivation. v0 has no
source alias or selective-use syntax; those are future import-design questions.

## 4. Comments

```neu
// Line comment.

/// A short block comment. ///

///
A multiline block comment.
Block comments do not nest.
///

string label = "ordinary declaration"
```

`//` begins a line comment and ends immediately before the logical newline.
The lexer recognizes `///` before `//`: `///` opens a block comment and the next
`///` closes it. A block may be written on one line or across multiple lines.
Block comments do not nest because the
same delimiter closes the current block. An unclosed block comment is a lexical
error from its opening delimiter to end of source.

Both forms are non-semantic trivia. v0 has no documentation-attachment syntax;
adding one requires a distinct future decision rather than giving `///` two
meanings. Newlines inside a block comment remain visible to logical-line
termination, so a comment cannot join two declarations accidentally.

## 5. Identifiers and qualification

v0 identifiers remain ASCII:

```text
[A-Za-z_][A-Za-z0-9_]*
```

Valid:

```neu
string image_2 = "tool"
string _internal_name = "value"
```

Invalid:

```neu
string 2image = "tool"
string naïve = "value"
```

Identifiers are case-sensitive. Unicode display names belong in `string`
values. v0 has no quoted identifiers.

Reserved core words are:

```text
neu module use namespace record mut
true false null ref secret_ref
```

`bool`, `num`, `string`, `List`, `Ref`, and `SecretRef` are predeclared core
type/type-constructor names and cannot be redeclared in the root namespace.

Use `::` to resolve a name through module or namespace scopes:

```neu
checks::config
acme::delivery::checks::config
Flow::Mode
```

Use `.` only when selecting a member or enum case from a resolved value/type:

```neu
Flow::Mode.strict
```

This keeps static ownership paths distinct from member access. A future
namespace-owned free function is qualified as `Flow::run()`, while a member call
is `runner.run()`. Calls themselves remain outside v0 except for the core forms
`ref(...)` and `secret_ref(...)`. A decimal point occurs only between digits in
a numeric literal, so it cannot be confused with `::` qualification.

## 6. Declaring variables and bindings

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
```

There is no `let` keyword and no colon between name and type.

A declared name creates the machine-facing symbolic identity within its module
and namespace. Human display labels remain ordinary `string` fields. Renaming a
declaration changes its symbolic identity in v0.

The declared type remains explicit. The following is invalid:

```neu
x = 10 // No declaration exists.
```

## 7. Mutability

Bindings are immutable unless prefixed with `mut`:

```neu
num retries = 3
mut num counter = 0
```

Only a mutable binding may be assigned again:

```neu
counter = 1

// Invalid: retries is immutable.
retries = 4
```

The restricted proposal is:

- assignment must appear after the mutable declaration in the same lexical
  scope;
- the assignment target is a local identifier, never a `::`-qualified name;
- an assignment must preserve the declared type;
- there are no compound assignments, increments, or mutation methods;
- mutation happens only while compiling source;
- the final emitted IR value is immutable; and
- every assignment remains in source provenance.

At the end of the lexical scope, the last valid assignment determines the
binding's emitted value. Every `ref(...)` resolves to the binding identity and
therefore observes that final emitted value; references are not value snapshots
at their textual position. Reading a mutable binding before its declaration is
invalid.

This makes assignment order semantic for mutable bindings, unlike other
declarations. That cost is why `mut` is not recommended for v0 without a
concrete cross-domain use case.

## 8. The generic numeric type

Authors normally use one type:

```neu
num count = 10
num ratio = 0.25
num negative = -4
num grouped = 1_000_000
```

The source has only `num`; `int`, `uint`, and `float` are not author-facing type
keywords. A numeric literal is captured exactly, and an expected domain or IR
contract may require one of those representations. The compiler selects and
converts the representation automatically rather than requiring a cast in
source.

Automatic numeric casting follows these rules:

- a non-negative whole value may become `uint`, `int`, or `float` when the
  receiving representation can preserve it;
- a negative whole value may become `int` or `float` when representable;
- a fractional value becomes `float` when required by the receiving contract;
- `int`, `uint`, and `float` representations widen automatically when the
  destination preserves the value;
- narrowing, sign-changing, overflow, and precision-losing conversions are
  rejected with a type diagnostic;
- a fractional value becomes `int` or `uint` only when it is mathematically
  integral and within range;
- text never automatically converts to a number;
- representation widths and floating-point formats come from the captured
  domain contract; Neutral never guesses a host-machine width.

Examples:

```neu
num whole = 10
num fraction = 10.5

// Invalid numeric values:
num bad_text = "10"
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
| `0.5` | IEEE binary32 | Accepted automatically because it is exact |
| `16_777_217` | IEEE binary32 | Rejected: precision loss |

v0 numeric literals use decimal digits. Underscores may occur only between
digits. Leading zeroes other than `0` are invalid. Fractional values require
digits on both sides of the point. There is no exponent or non-decimal base.

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
| `string name = "default",` | Required field with omission default |
| `List<string> names,` | Ordered repeated values |

There is no optional field. A nullable field must still be supplied unless it
has a default:

```neu
record NullableDefaults {
    string? note = null,
}
```

Fields cannot repeat. Records are nominal: equal field shapes do not make two
record declarations the same type.

Mutability is not allowed on a record field declaration. Mutability belongs to a
binding containing the record:

```neu
mut Config config = {
    image: "example.invalid/tool:1",
    note: null,
}
```

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
namespace checks {
    string mode = "strict"

    namespace internal {
        bool enabled = true
    }
}
```

The names are `checks::mode` and `checks::internal::enabled`. Namespaces do not
create files, execution stages, OS namespaces, provider groups, or security
zones.

Duplicates and shadowing are invalid. Immutable declarations may reference
later immutable declarations, but cyclic initialization is invalid. Their
declaration order has no meaning. Mutable assignments are the only proposed v0
form whose textual order matters.

## 15. Symbolic references

Use `ref(...)` to link to a declaration:

```neu
ref(config)
ref(checks::config)
ref(acme::delivery::checks::config)
```

If the target has type/kind `T`, the reference has type `Ref<T>`:

```neu
record Selection {
    Ref<Config> config,
}

Selection selected = {
    config: ref(config),
}
```

A reference is not the target's copied value and does not automatically mean
containment, execution order, or data dependency. Text containing a name remains
text.

Module-qualified references work only when the compiler request supplied the
module in the captured closure. They never fetch it.

## 16. Secret references

```neu
SecretRef<string> token = secret_ref("ci/signing-token")
```

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
is a well-formed Neutral type; a consumer or broker separately decides whether
it supports that delivery shape.

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

An unknown or unqualified domain type is invalid:

```neu
Pipeline verify = {} // Invalid: no vocabulary owner.
```

## 18. Domain-owned types and enums

```neu
Flow::ArtifactRef artifact = {
    value: "sha256:example",
}

Flow::Mode mode = Flow::Mode.strict
```

The qualified enum value is not a `string`. The vocabulary bundle defines exact
schema and behavior versions, allowed variants, and must-understand behavior.
Domain-owned values remain bounded data and cannot execute code.

The bundle—not the author—classifies fields as required behavior or optional
non-behavioral metadata. Unknown required behavior fails closed. v0 has no
untyped `extensions` bag through which behavioral data can be hidden.

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

- Source is UTF-8. A BOM is accepted only at byte zero.
- Malformed UTF-8 and raw NUL bytes are fatal.
- `CRLF` and lone `CR` behave as logical `LF` while original bytes remain
  available for identity and source spans.
- Indentation is not syntax.
- A physical newline terminates a complete header, simple declaration, or
  assignment in a source or namespace declaration list.
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
- `::` qualifies names. `.` selects a member or enum case and also appears inside
  numeric literals; a numeric dot is the dot directly between decimal digits.

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

Diagnostic prefixes remain:

| Prefix | Meaning |
| --- | --- |
| `NL-SYN-ENC` | Encoding |
| `NL-SYN-LEX` | Tokens/literals/comments |
| `NL-SYN-PAR` | Grammar |
| `NL-SYN-NAM` | Names/collisions |
| `NL-SYN-KND` | Wrong declaration kind |
| `NL-SYN-TYP` | Type mismatch |
| `NL-SYN-DOM` | Domain schema/placement |
| `NL-SYN-FEA` | Unsupported feature |
| `NL-SYN-LIM` | Resource limit |
| `NL-SYN-INT` | Compiler/bundle defect |

Initial measurement limits remain 2 MiB per unit, 256 units, 16 MiB closure,
depth 128, 200 diagnostics plus one truncation record, 10 seconds and 512 MiB on
named benchmark hardware.

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
- compound assignment or mutation methods;
- macros or generated syntax;
- environment, filesystem, command, or network evaluation;
- executable vocabulary plugins;
- provider credentials or resolved secrets; or
- Flow/Neux runtime lifecycle syntax.

The proposed basic reassignment syntax does not make Neutral a general-purpose
language.

## 25. Quick reference

| Goal | Revised syntax |
| --- | --- |
| Language version | `neu "0.1"` |
| Module | `module acme::delivery` |
| Vocabulary import | `use Flow` |
| Immutable variable | `num x = 10` |
| Mutable variable | `mut num x = 10` |
| Reassignment | `x = 11` |
| `string` | `string name = "value"` |
| Nullable variable | `string? name = null` |
| List | `List<string> names = ["one"]` |
| Record | `record Config { string name, }` |
| Contextual record value | `Config config = { name: "value", }` |
| Nullable field | `string? note,` |
| Default field | `List<string> names = [],` |
| Namespace | `namespace checks { ... }` |
| Reference | `ref(checks::config)` |
| Reference type | `Ref<Config>` |
| Secret | `SecretRef<string> token = secret_ref("logical/id")` |
| Vocabulary-owned declaration | `Flow::Pipeline verify = { ... }` |
| Vocabulary-owned value | `Flow::ArtifactRef artifact = { ... }` |
| Domain enum | `Flow::Mode.strict` |
| Line comment | `// explanation` |
| Block comment | `/// explanation ///` |

## 26. Compact grammar sketch

This is a design sketch, not yet the normative grammar.
Blank lines separate productions in this sketch. It deliberately uses no
semicolon-like production terminator, matching the `.neu` surface.

```ebnf
source =
    trivia, language_header, module_header,
    { use_declaration },
    { declaration_or_assignment },
    end_of_file

language_header = "neu", string_literal, LINE_END
module_header = "module", qualified_name, LINE_END

use_declaration =
    "use", identifier, LINE_END

declaration_or_assignment =
      namespace_declaration
    | record_declaration
    | binding_declaration
    | assignment

namespace_declaration =
    "namespace", identifier, "{",
    { declaration_or_assignment },
    "}", LINE_END

record_declaration =
    "record", identifier, "{", { record_field }, "}", LINE_END

record_field =
    type, identifier, [ "=", value ], ","

binding_declaration =
    [ "mut" ], type, identifier, "=", value, LINE_END

assignment =
    identifier, "=", value, LINE_END

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
    | qualified_enum_value
    | reference_value
    | secret_reference_value

list_value =
    "[", [ value, { ",", value }, [ "," ] ], "]"

contextual_record_value =
    "{", { value_field }, "}"

qualified_enum_value =
    qualified_name, ".", identifier

value_field =
    identifier, ":", value, ","

reference_value =
    "ref", "(", qualified_name, ")"

secret_reference_value =
    "secret_ref", "(", string_literal, ")"

qualified_name =
    identifier, { "::", identifier }
```

Static validation—not grammar alone—requires every `use` name to resolve through
the captured lock manifest to one permitted exact vocabulary bundle; derives and
checks the required feature set from used vocabulary members; enforces
nullable-only null and one unambiguous expected type for every contextual record;
rejects immutable assignment; and checks type-preserving mutation, declaration
uniqueness, and schema-owned vocabulary fields.

`LINE_END` is emitted after a physical newline, including after a trailing line
comment, when the current source or namespace declaration-list item is complete.
It is suppressed inside value/type delimiters and after syntactically incomplete
tokens. Namespace declaration braces establish a nested declaration-list mode;
they do not suppress `LINE_END`. The lexer emits a synthetic `LINE_END` before
end-of-file when needed.

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
mut num counter = 0
counter = 1
string label = "hello"
string? nullable_label = null
```

These forms are synchronized with the v0 decision records and the
master/version syntax checklists.
