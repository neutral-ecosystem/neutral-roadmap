# Section 2: lexical and source-text rules

Status: proposed

Answers: `SYN-LEX-001` through `SYN-LEX-008`

## SYN-LEX-001 — Encoding and line endings

`.neu` source MUST be UTF-8. A single UTF-8 byte-order mark is accepted only
at byte offset zero and ignored for tokenization; any other BOM is invalid.
Malformed UTF-8 and unescaped raw NUL bytes are fatal decoding errors.

The captured source retains original bytes for content identity. The raw lexer
recognizes physical newline tokens and maps `CRLF` and lone `CR` to logical `LF`
while spans remain half-open offsets into original bytes. Locale-dependent
decoding and silent replacement of invalid bytes are rejected as
non-reproducible.

## SYN-LEX-002 — Whitespace and termination

Space and horizontal tab separate tokens but carry no meaning. Indentation is
not syntactic. A logical newline terminates a complete header, simple
declaration in a source or namespace declaration list. There is
no semicolon token and no backslash line continuation.

The frontend has three private stages:

```text
raw lexer -> newline/layout normalizer -> parser
```

The raw lexer emits physical newlines without deciding grammatical
completeness. The deterministic layout normalizer tracks delimiters and
declaration-list context and converts physical newlines into semantic
`LINE_END` tokens or trivia. The parser consumes that normalized stream. This
keeps syntax-aware newline policy out of token recognition while preserving
the no-semicolon surface. A synthetic final `LINE_END` is produced by the
layout stage when a complete final item reaches end of file.

A line comment is trivia before its newline, so this is valid:

```neu
num x = 10 // explanation
```

Newlines are insignificant inside value constructors, field lists, argument
lists, list values, and type arguments. Namespace braces establish a nested
declaration-list mode and therefore do not suppress declaration terminators.
Fields and collection elements use `,`, with one optional trailing comma.

```neu
string image = "example.invalid/image:1"

record Pair {
    string left,
    string right,
}
```

A missing line ending between two simple declarations is diagnosed; the parser
MUST NOT infer a separator from indentation or token adjacency.

## SYN-LEX-003 — Comments

`//` begins a line comment but does not consume its terminating logical newline.
`/*` opens a block comment and the next `*/` closes it. The opening and closing
delimiters may occur on one line or different lines:

```neu
/* short block */

/*
multiline block
*/
```

Block comments do not nest: the first subsequent `*/` always closes the
current block. An unterminated block comment is one error from its opening
delimiter to end of source. Newlines inside block-comment trivia remain visible
to logical-line termination. Delimiters inside strings are ordinary characters.

Both comment forms are non-semantic trivia. v0 has no documentation attachment,
shebang, or executable comment.

## SYN-LEX-004 — Identifiers and Unicode

v0 identifiers are ASCII:

```text
identifier     = [A-Za-z_][A-Za-z0-9_]*
snakeName      = [a-z][a-z0-9]*(_[a-z][a-z0-9]*)*
upperCamelName = [A-Z][A-Za-z0-9]*
```

Bindings, fields, namespace names, module names, and vocabulary-owned static
values MUST use `snakeName`. Record/type names and vocabulary use names MUST use
`upperCamelName`. The latter denotes the compiler-enforced uppercase-leading
lexical class. `UpperCamelCase` is the authoring style; the compiler does not
infer word boundaries, so `ABC`, `Afoo`, `TOOLCONFIG`, and `X123` all satisfy
the lexical rule even when a style checker recommends a clearer spelling. A
snake-case underscore separates words; it cannot lead,
trail, repeat, or introduce a digit-only segment. Predeclared scalar types
(`num`, `string`, `bool`) and reserved words are explicit lowercase language
names; generic core types (`List`, `Ref`, `SecretRef`) are explicit
uppercase-leading language names styled as `UpperCamelCase`.

Case/category violations are name diagnostics rather than silently distinct
naming styles. Identifiers remain case-sensitive after validation. Unicode is
permitted in strings and comments, not in identifiers. Tools SHOULD render a
non-ASCII attempted identifier safely and MUST NOT normalize it into an accepted
name. Human display names belong in typed text fields and are separate from
symbol identity.

This conservative choice avoids normalization and confusable identity problems
in the first public contract.

## SYN-LEX-005 — Reserved and qualified names

The v0 reserved words are:

```text
neu module use pub namespace record
true false null ref secret_ref
```

`bool`, `num`, `string`, `List`, `Ref`, and `SecretRef` are predeclared core
type/type-constructor names and cannot be declared or shadowed in any scope.

`::` resolves a name through namespaces in the current module, including a
vocabulary namespace introduced by `use`. Module names never occur in qualified
source names. Qualification is explicit and left-to-right:

```neu
checks::config
Flow::Mode
```

`.` selects a vocabulary-owned enum case or static member rather than extending
a qualification path:

```neu
Flow::Mode.strict
```

General value member access such as `config.image` and general calls are not part
of v0. Built-in call-shaped forms remain `ref(...)` and `secret_ref(...)`.

v0 has no escaped identifiers. Every vocabulary use name must be an
UpperCamelCase identifier. A collision between a vocabulary namespace and
another root name is an error; the source must choose a non-conflicting
declaration name. Vocabulary renaming is deferred to a future `use`-syntax
decision and cannot happen as a lock-manifest side effect. Quoted identifiers
are rejected because they create inconsistent identities across tools.

## SYN-LEX-006 — Delimiters and separators

The delimiters are `()`, `[]`, `{}`, and type-application `<>`.
Separators are `,`, `:`, `=`, `?`, `::`, `.`, and logical newline:

- `()` encloses arguments to built-in forms such as `ref(...)`;
- `[]` constructs ordered lists;
- `<>` encloses a type argument in `List<T>`, `Ref<T>`, or `SecretRef<T>`;
- `{}` encloses namespaces, records, and contextual typed values;
- `:` separates a field name from its constructed value;
- `=` introduces a binding value or field default;
- `?` after a complete type marks that type nullable;
- `::` resolves namespaces in the current module and captured vocabulary
  namespaces; it never denotes a module boundary;
- `.` selects a vocabulary-owned enum case or static member; general value
  member access is not part of v0; and
- logical newline terminates complete declaration-list items.

`-` is recognized only as the immediately adjacent leading sign of a numeric
literal in v0; it is not a subtraction operator. Whitespace between `-` and
the first digit is invalid.

Unbalanced or mismatched delimiters are errors. Recovery stops at a matching
close delimiter or next top-level boundary. Commas remain required across
newlines.

## SYN-LEX-007 — Text literals

Ordinary text uses double quotes and cannot contain a raw newline. v0 supports
escaped backslash, double quote, newline, carriage return, tab, and
`\u{HEX}`. The Unicode escape has one to six hexadecimal digits and must
denote a scalar value.

Unknown escapes, isolated surrogates, out-of-range scalars, unescaped control
characters, and unterminated text are errors. Escape processing creates the
logical value; original spelling remains only in provenance.

v0 has no interpolation, raw string, or multiline string. A dollar-brace
sequence is ordinary text.

## SYN-LEX-008 — Scalars and null

| Category | v0 forms | Logical rule |
| --- | --- | --- |
| Boolean | `true`, `false` | Exactly two `bool` values |
| Number | `0`, `17`, `-4`, `1_000.25` | Exact finite base-10 rational, lowered only under an explicit numeric contract |
| String | `"text"` | Finite Unicode scalar sequence |
| Null | `null` | The only explicit source null/empty literal; legal only where the expected type is `T?` |

Underscores may occur only between digits. Leading zeroes other than `0` are
invalid. A decimal needs digits on both sides of the point. v0 has no exponent,
non-decimal base, `NaN`, or infinity.

`num` is the only source numeric type. Before contract-specific lowering, the
compiler represents it as an arbitrary-precision signed integer coefficient and
a non-negative decimal scale: `coefficient × 10^-scale`. The semantic pair is
normalized by removing trailing decimal zeroes; the original lexeme remains in
provenance. Every zero spelling, including `-0` and `-0.0`, normalizes to
coefficient `0` and scale `0`. Thus `10` and `10.0` have the same logical numeric
value. Neutral IR carries this normalized mathematical value; a concrete encoder
MUST preserve it losslessly and MUST NOT silently route it through a
host/JSON-number type.

An expected captured contract may request a signed/unsigned integer, decimal,
or named IEEE 754 binary format. Integer and decimal conversion is accepted only
when the mathematical value is exactly representable within the declared range,
precision, and scale. A binary floating-point target defaults to deterministic
IEEE 754 round-to-nearest, ties-to-even for its named format. This includes
subnormal results and rounding sufficiently small nonzero values to signed zero.
A vocabulary may instead mark the target `exact`, which rejects any changed
mathematical value. Overflow and non-finite results remain invalid. No width,
rounding mode, locale, or intermediate representation may come from the host
machine.

“Value-preserving” means that interpreting the target representation under its
declared mathematical model produces exactly the same rational number as the
normalized source `num`. A rounded result is explicitly not value-preserving;
it is accepted by the default nearest-even binary conversion but rejected by an
`exact` target.

For example, `0.1` is rejected for binary32 or binary64 under `exact`; under the
default nearest-even rule it becomes binary32 bits `0x3dcccccd` or binary64 bits
`0x3fb999999999999a`. `0.5` is exact in both formats. Conversion fixtures also
cover integral `10.0`, fractional `10.5`, overflow, and the binary32 boundary
between `16_777_216` and `16_777_217`.

Design rationale: Python likewise stores `0.1` as the nearest representable
binary fraction, but Neutral names the IEEE format so behavior is portable.
Python also applies a configurable digit cap to expensive decimal-integer text
conversion, while C++ numeric parsing targets a caller-selected bounded type and
reports out-of-range values. Neutral therefore uses explicit numeric budgets
rather than treating source-unit bytes as its only defense. See the
[Python floating-point explanation](https://docs.python.org/3/tutorial/floatingpoint.html),
[Python integer-string limit](https://docs.python.org/3/library/stdtypes.html#integer-string-conversion-length-limitation),
and [C++ `from_chars` rules](https://eel.is/c++draft/charconv.from.chars).

There is no `absent` token or standalone null type. A field omitted because a
declared default applies is structural omission, not a second source value.

## Required evidence

Fixtures MUST cover BOM position, newline forms, attempted block-comment nesting, trailing line
comments, every escape, delimiter mismatch, missing line endings/separators,
numeric conversion boundaries, non-ASCII names, keyword collisions, and inputs
below/at/above each lexical limit.
