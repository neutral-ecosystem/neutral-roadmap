# Section 2: lexical and source-text rules

Status: proposed

Answers: `SYN-LEX-001` through `SYN-LEX-008`

## SYN-LEX-001 — Encoding and line endings

`.neu` source MUST be UTF-8. A single UTF-8 byte-order mark is accepted only
at byte offset zero and ignored for tokenization; any other BOM is invalid.
Malformed UTF-8 and unescaped raw NUL bytes are fatal decoding errors.

The captured source retains original bytes for content identity. Lexing maps
`CRLF` and lone `CR` to logical `LF` for grammar and display while spans
remain half-open offsets into original bytes. Locale-dependent decoding and
silent replacement of invalid bytes are rejected as non-reproducible.

## SYN-LEX-002 — Whitespace and termination

Space and horizontal tab separate tokens but carry no meaning. Indentation is
not syntactic. A logical newline terminates a complete header, simple
declaration, or assignment in a source or namespace declaration list. There is
no semicolon token and no backslash line continuation.

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
The lexer gives the three-slash delimiter priority over the two-slash delimiter:
`///` opens a block comment and the next `///` closes it. The opening and closing
delimiters may occur on one line or different lines:

```neu
/// short block ///

///
multiline block
///
```

Block comments do not nest: the first subsequent `///` always closes the
current block. An unterminated block comment is one error from its opening
delimiter to end of source. Newlines inside block-comment trivia remain visible
to logical-line termination. Delimiters inside strings are ordinary characters.

Both comment forms are non-semantic trivia. v0 has no documentation attachment,
shebang, or executable comment.

## SYN-LEX-004 — Identifiers and Unicode

v0 identifiers are ASCII:

```text
identifier = [A-Za-z_][A-Za-z0-9_]*
```

They are case-sensitive. Unicode is permitted in strings and comments, not in
identifiers. Tools SHOULD render a non-ASCII attempted identifier safely and
MUST NOT normalize it into an accepted name. Human display names belong in
typed text fields and are separate from symbol identity.

This conservative choice avoids normalization and confusable identity problems
in the first public contract.

## SYN-LEX-005 — Reserved and qualified names

The v0 reserved words are:

```text
neu module requires vocabulary as namespace record mut
true false null ref secret_ref
```

`bool`, `num`, `string`, `List`, `Ref`, and `SecretRef` are predeclared core
type/type-constructor names and cannot be redeclared in the root namespace.

`::` resolves a name through module or namespace scopes, including a vocabulary
alias namespace. Qualification is explicit and left-to-right:

```neu
acme::delivery::config
flow::Mode
```

`.` selects a member or enum case rather than extending a qualification path:

```neu
flow::Mode.strict
```

A future namespace-owned free function is `flow::run()`, while a member call is
`runner.run()`. General calls are not otherwise part of v0. Built-in calls
remain `ref(...)` and `secret_ref(...)`.

v0 has no escaped identifiers. A conflicting name must be renamed, and a
vocabulary must expose a legal source alias for any external name. Quoted
identifiers are rejected because they create inconsistent identities across
tools.

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
- `::` resolves names through module/namespace scopes;
- `.` selects a member or enum case; and
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
| Number | `0`, `17`, `-4`, `1_000.25` | Exact source number, automatically represented as compatible `int`, `uint`, or `float` |
| String | `"text"` | Finite Unicode scalar sequence |
| Null | `null` | The only explicit source null/empty literal; legal only where the expected type is `T?` |

Underscores may occur only between digits. Leading zeroes other than `0` are
invalid. A decimal needs digits on both sides of the point. v0 has no exponent,
non-decimal base, `NaN`, or infinity.

`num` is the only source numeric type. The compiler automatically selects or
converts `int`, `uint`, or `float` representations when an expected captured
contract requires one. Automatic conversion must preserve value and range;
overflow, invalid sign conversion, and precision loss are type diagnostics.
Widths and floating formats come from the contract, never the host machine.

There is no `absent` token or standalone null type. A field omitted because a
declared default applies is structural omission, not a second source value.

## Required evidence

Fixtures MUST cover BOM position, newline forms, nested comments, trailing line
comments, every escape, delimiter mismatch, missing line endings/separators,
numeric conversion boundaries, non-ASCII names, keyword collisions, and inputs
below/at/above each lexical limit.
