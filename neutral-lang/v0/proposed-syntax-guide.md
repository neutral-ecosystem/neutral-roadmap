# Proposed Neutral language v0 authoring guide

Status: editable syntax proposal — revised toward a less Rust-like surface

Purpose: show how people and a future GUI would write the complete proposed v0
`.neu` surface. Edit this file first. After the syntax is approved, the
[decision records](decisions/README.md), checklist, grammar, and examples should
be synchronized with it.

This revision intentionally differs from some existing decision records. Those
records remain unchanged until this author-facing syntax is reviewed.

## 1. Current design direction

The revised surface follows these preferences:

- declarations are type-first: `num x = 10;`;
- bindings are immutable unless prefixed with `mut`;
- `num` is the preferred author-facing numeric type;
- integer and decimal primitive representations remain compiler/IR concerns;
- safe numeric promotion is automatic;
- text uses `String`;
- nullability uses `?` after the variable or field name;
- there is no separate optional-field or `absent` syntax;
- qualification uses `.` rather than Rust-like `::`; and
- Neutral remains a tool-abstraction language, not a general-purpose language.

Three details need deliberate review:

1. `mut` introduces assignment order into a declarative language. This guide
   shows a restricted design, but mutation should be removed from v0 unless a
   real Flow and Neux need justifies it.
2. Automatic numeric conversion is limited to exact or safely widening
   conversion. Silent precision loss is rejected.
3. `String label?` means nullable, not optional. A record field must still be
   supplied unless it has a default.

## 2. Complete example

```neu
neu "0.1";
module acme.delivery;

requires vocabulary flow {
    id: "org.neutral.flow",
    schema: "0.1",
    behavior: "0.1",
    features: ["pipeline", "typed-reference"],
}

/// Reusable configuration data.
record ToolConfig {
    String image,
    String note?,
    List<String> labels = [],
}

/// Data containing symbolic references.
record InvocationInput {
    Ref<ToolConfig> config,
    SecretRef token,
}

ToolConfig base = ToolConfig {
    image: "example.invalid/tool:1",
    note: null,
};

InvocationInput input = InvocationInput {
    config: ref(base),
    token: secret_ref("ci/signing-token"),
};

namespace checks {
    flow.pipeline verify {
        input: ref(acme.delivery.input),
        mode: flow.Mode.strict,
    }
}
```

The compiler produces Neutral IR. It does not execute the pipeline, resolve the
secret, contact a provider, or define `flow.pipeline` behavior.

## 3. Source-file structure

Every source unit has this order:

```text
language version
module name
zero or more vocabulary requirements
zero or more declarations
```

### Language version

```neu
neu "0.1";
```

Every unit states an exact language-behavior version. There is no omitted
version, `latest`, or range.

### Module

```neu
module acme.delivery;
```

A module name is a dot-qualified logical name. It is not a file path, URL,
package download instruction, or mutable version tag.

v0 has no source-level import statement. The compiler request supplies the
captured source closure.

### Domain vocabulary

```neu
requires vocabulary flow {
    id: "org.neutral.flow",
    schema: "0.1",
    behavior: "0.1",
    features: ["pipeline"],
}
```

`flow` is the local alias. The source states exact vocabulary identity,
schema version, behavior version, and required features. This block performs no
download and grants no authority. The caller must allow and provide the exact
data-only bundle.

Field order is not meaningful. The formatter writes `id`, `schema`,
`behavior`, then `features`. Each appears exactly once.

## 4. Comments and documentation

```neu
// Line comment.

/*
 * Nested block comments are allowed.
 * /* Inner comment. */
 */

/// Documentation attached to the next declaration.
String label = "visible in generated documentation";
```

`//` and `/* ... */` are non-semantic comments. `///` attaches
documentation to the next declaration or record/domain field. A blank line ends
the attachment.

## 5. Identifiers and qualification

v0 identifiers remain ASCII:

```text
[A-Za-z_][A-Za-z0-9_]*
```

Valid:

```neu
String image_2 = "tool";
String _internal_name = "value";
```

Invalid:

```neu
String 2image = "tool";
String naïve = "value";
```

Identifiers are case-sensitive. Unicode display names belong in `String`
values. v0 has no quoted identifiers.

Reserved core words are:

```text
neu module requires vocabulary namespace record mut
true false null ref secret_ref
```

`bool`, `num`, `String`, `List`, `Ref`, and `SecretRef` are
predeclared core type names and cannot be redeclared in the root namespace.

Use `.` for qualification:

```neu
checks.config
acme.delivery.checks.config
flow.pipeline
flow.Mode.strict
```

The lexer distinguishes a decimal point between digits from a qualification
point between identifiers.

## 6. Declaring variables and bindings

The default form is type-first and immutable:

```neu
Type name = value;
```

Examples:

```neu
bool enabled = true;
num attempts = 3;
num ratio = 0.75;
String label = "build";
List<String> labels = ["portable", "checked"];
SecretRef token = secret_ref("ci/token");
```

There is no `let` keyword and no colon between name and type.

A declared name creates the machine-facing symbolic identity within its module
and namespace. Human display labels remain ordinary String fields. Renaming a
declaration changes its symbolic identity in v0.

The declared type remains explicit. The following is invalid:

```neu
x = 10; // No declaration exists.
```

## 7. Mutability

Bindings are immutable unless prefixed with `mut`:

```neu
num retries = 3;
mut num counter = 0;
```

Only a mutable binding may be assigned again:

```neu
counter = 1;

// Invalid: retries is immutable.
retries = 4;
```

The restricted proposal is:

- assignment must appear after the mutable declaration in the same lexical
  scope;
- an assignment must preserve the declared type;
- there are no compound assignments, increments, or mutation methods;
- mutation happens only while compiling source;
- the final emitted IR value is immutable; and
- every assignment remains in source provenance.

This makes assignment order semantic for mutable bindings, unlike other
declarations. That cost is why `mut` is not recommended for v0 without a
concrete cross-domain use case.

## 8. The generic numeric type

Authors normally use one type:

```neu
num count = 10;
num ratio = 0.25;
num negative = -4;
num grouped = 1_000_000;
```

Primitive numeric categories remain inside the compiler and IR: integer and
exact decimal are portable categories, while binary float exists only when an
explicit domain/target contract requires it. They are not preferred v0 source
keywords. The source-level `num` type accepts integer- and fractional-shaped
literals while preserving their exact value and conversion requirements.

Automatic numeric casting follows these rules:

- integer to exact decimal is automatic;
- smaller exact representations may widen automatically;
- a conversion that overflows or loses precision is rejected;
- decimal to integer is not automatic unless the value is exactly integral and
  the receiving contract explicitly allows it;
- text never automatically converts to a number;
- provider binary floating-point conversion is consumer-owned and may be
  rejected when it cannot preserve the required value.

Examples:

```neu
num whole = 10;
num fraction = 10.5;

// Invalid numeric values:
num bad_text = "10";
num not_supported = NaN;
num not_supported_either = infinity;
```

v0 numeric literals use decimal digits. Underscores may occur only between
digits. Leading zeroes other than `0` are invalid. Fractional values require
digits on both sides of the point. There is no exponent or non-decimal base.

## 9. Other primitive types

| Type | Example | Meaning |
| --- | --- | --- |
| `bool` | `true` | Boolean value |
| `num` | `10.5` | Generic exact numeric value |
| `String` | `"hello"` | Unicode text |
| `SecretRef` | `secret_ref("id")` | Opaque secret request |

`null` has no standalone declared type. It is accepted only when the
declaration or field name ends with `?`.

There are no implicit conversions among `bool`, `String`, `SecretRef`,
records, lists, and references.

## 10. Nullable variables

Place `?` after the variable name:

```neu
String label? = null;
num result? = null;
ToolConfig config? = null;
```

The same declarations may contain non-null values:

```neu
String label? = "build";
num result? = 42;
```

Without `?`, null is invalid:

```neu
String label = null; // Invalid.
```

There is no `Nullable<T>` type, optional declaration marker, or `absent`
value. Nullability does not mean omission.

## 11. Lists

`List<T>` is ordered and homogeneous:

```neu
List<String> names = ["build", "test"];
List<num> values = [1, 2.5, 3];
List<List<num>> matrix = [[1, 2], [3]];
List<String> empty = [];
```

Order and duplicates are preserved. A trailing comma is allowed. v0 has no map,
set, tuple, or heterogeneous list.

A nullable list places `?` after the variable:

```neu
List<String> names? = null;
```

## 12. Declaring record types

Record fields are type-first:

```neu
record Config {
    String image,
    String note?,
    List<String> labels = [],
}
```

| Form | Meaning |
| --- | --- |
| `String name,` | Required and non-null |
| `String name?,` | Required and nullable |
| `String name = "default",` | Required field with omission default |
| `List<String> names,` | Ordered repeated values |

There is no optional field. A nullable field must still be supplied unless it
has a default:

```neu
record NullableDefaults {
    String note? = null,
}
```

Fields cannot repeat. Records are nominal: equal field shapes do not make two
record declarations the same type.

Mutability is not allowed on a record field declaration. Mutability belongs to a
binding containing the record:

```neu
mut Config config = Config {
    image: "example.invalid/tool:1",
    note: null,
};
```

## 13. Constructing record values

```neu
Config config = Config {
    image: "example.invalid/tool:1",
    note: null,
};
```

Fields use `name: value` in construction even though declarations are
type-first. Defaults allow omission. Without a default, every field—including a
nullable field—must appear.

Record shorthand is not supported:

```neu
// Invalid:
Config { image }

// Valid:
Config { image: "example.invalid/tool:1", note: null, }
```

There is no anonymous record value.

## 14. Namespaces

```neu
namespace checks {
    String mode = "strict";

    namespace internal {
        bool enabled = true;
    }
}
```

The names are `checks.mode` and `checks.internal.enabled`. Namespaces do not
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
ref(checks.config)
ref(acme.delivery.checks.config)
```

If the target has type/kind `T`, the reference has type `Ref<T>`:

```neu
record Selection {
    Ref<Config> config,
}

Selection selected = Selection {
    config: ref(config),
};
```

A reference is not the target's copied value and does not automatically mean
containment, execution order, or data dependency. Text containing a name remains
text.

Module-qualified references work only when the compiler request supplied the
module in the captured closure. They never fetch it.

## 16. Secret references

```neu
SecretRef token = secret_ref("ci/signing-token");
```

`SecretRef` is not `String`:

```neu
SecretRef wrong = "ci/signing-token"; // Invalid.
```

The compiler stores an opaque logical reference, never resolved secret material.
Secret references cannot be interpolated, concatenated, printed as ordinary
text, or used to grant authority. Diagnostics redact them by default.

A nullable secret reference is written:

```neu
SecretRef token? = null;
```

## 17. Domain declarations

The generic form is:

```text
vocabulary_alias.declaration_kind name {
    schema_field: value,
}
```

Illustrative Flow-profile source:

```neu
flow.pipeline verify {
    input: ref(input),
    mode: flow.Mode.strict,
}
```

`pipeline` is not a Neutral keyword. The captured data-only Flow bundle
defines its fields, types, static constraints, and required features. Neutral
does not execute it.

An unqualified kind is invalid:

```neu
pipeline verify {} // Invalid: no vocabulary owner.
```

## 18. Domain-owned types and enums

```neu
flow.ArtifactRef artifact = flow.ArtifactRef {
    value: "sha256:example",
};

flow.Mode mode = flow.Mode.strict;
```

The qualified enum value is not a String. The vocabulary bundle defines exact
schema and behavior versions, allowed variants, and must-understand behavior.
Domain-owned values remain bounded data and cannot execute code.

The bundle—not the author—classifies fields as required behavior or optional
non-behavioral metadata. Unknown required behavior fails closed. v0 has no
untyped `extensions` bag through which behavioral data can be hidden.

## 19. Domain-owned relationships

```neu
flow.dependency check_after_build {
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
- Newline is whitespace.
- Simple declarations and assignments end in `;`.
- Braced declarations do not have a trailing semicolon.
- Fields and list items require commas.
- A trailing comma is allowed and preferred in multiline forms.
- There is no automatic semicolon insertion.
- Braces, brackets, parentheses, and generic angle brackets must match.
- `.` qualifies names and also appears inside a numeric literal; token context
  disambiguates the two.

The formatter uses four spaces, a default width of 100 columns, UTF-8, `LF`,
one final newline, double-quoted Strings, and multiline trailing commas.

## 21. String literals

```neu
String message = "line one\nline two";
String symbol = "\u{03BB}";
```

Double-quoted Strings support escaped backslash, quote, newline, carriage
return, tab, and Unicode scalar. v0 has no raw, multiline, or interpolated
String.

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
- source-level imports;
- maps, sets, tuples, unions, or core enums;
- field shorthand or anonymous records;
- raw, multiline, or interpolated String;
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
| Language version | `neu "0.1";` |
| Module | `module acme.delivery;` |
| Vocabulary | `requires vocabulary flow { ... }` |
| Immutable variable | `num x = 10;` |
| Mutable variable | `mut num x = 10;` |
| Reassignment | `x = 11;` |
| String | `String name = "value";` |
| Nullable variable | `String name? = null;` |
| List | `List<String> names = ["one"];` |
| Record | `record Config { String name, }` |
| Record value | `Config config = Config { name: "value", };` |
| Nullable field | `String note?,` |
| Default field | `List<String> names = [],` |
| Namespace | `namespace checks { ... }` |
| Reference | `ref(checks.config)` |
| Reference type | `Ref<Config>` |
| Secret | `secret_ref("logical/id")` |
| Domain declaration | `flow.pipeline verify { ... }` |
| Domain value | `flow.ArtifactRef { ... }` |
| Domain enum | `flow.Mode.strict` |
| Documentation | `/// documentation` |

## 26. Compact grammar sketch

This is a design sketch, not yet the normative grammar.

```ebnf
source =
    trivia, language_header, module_header,
    { vocabulary_requirement },
    { declaration_or_assignment },
    end_of_file ;

language_header = "neu", string_literal, ";" ;
module_header = "module", qualified_name, ";" ;

vocabulary_requirement =
    "requires", "vocabulary", identifier, "{",
    vocabulary_fields,
    "}" ;

vocabulary_fields =
    vocabulary_field, { vocabulary_field } ;

vocabulary_field =
      ( "id" | "schema" | "behavior" ), ":", string_literal, ","
    | "features", ":", "[",
      [ string_literal, { ",", string_literal }, [ "," ] ],
      "]", "," ;

declaration_or_assignment =
      namespace_declaration
    | record_declaration
    | binding_declaration
    | assignment
    | domain_declaration ;

namespace_declaration =
    "namespace", identifier, "{",
    { declaration_or_assignment },
    "}" ;

record_declaration =
    "record", identifier, "{", { record_field }, "}" ;

record_field =
    type, nullable_name, [ "=", value ], "," ;

binding_declaration =
    [ "mut" ], type, nullable_name, "=", value, ";" ;

assignment =
    qualified_name, "=", value, ";" ;

nullable_name =
    identifier, [ "?" ] ;

domain_declaration =
    vocabulary_member, identifier, "{", { value_field }, "}" ;

type =
      generic_type
    | qualified_name ;

generic_type =
    ( "List" | "Ref" ), "<", type, ">" ;

value =
      boolean_literal
    | numeric_literal
    | string_literal
    | "null"
    | list_value
    | nominal_value
    | qualified_enum_value
    | reference_value
    | secret_reference_value ;

list_value =
    "[", [ value, { ",", value }, [ "," ] ], "]" ;

nominal_value =
    type_name, "{", { value_field }, "}" ;

qualified_enum_value =
    vocabulary_member, ".", identifier ;

value_field =
    identifier, ":", value, "," ;

reference_value =
    "ref", "(", qualified_name, ")" ;

secret_reference_value =
    "secret_ref", "(", string_literal, ")" ;

vocabulary_member =
    identifier, ".", identifier ;

type_name = qualified_name ;

qualified_name =
    identifier, { ".", identifier } ;
```

Static validation—not grammar alone—enforces exactly one vocabulary `id`,
`schema`, `behavior`, and `features` field; nullable-only null; immutable
assignment rejection; type-preserving mutation; declaration uniqueness; and
schema-owned domain fields.

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
num x = 10;
mut num counter = 0;
counter = 1;
String label = "hello";
String nullable_label? = null;
```

Once these choices are finalized, the v0 decision records and the master/version
syntax checklists should be updated together.
