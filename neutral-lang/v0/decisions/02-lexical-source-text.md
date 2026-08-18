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

Space, horizontal tab, and normalized newline separate tokens but carry no
meaning. Indentation is not syntactic. There is no automatic semicolon
insertion and no backslash line continuation.

Simple declarations and headers end with `;`. Braced declarations do not take
a following semicolon. Fields and collection elements use `,`, with one
optional trailing comma. Newlines may occur wherever whitespace is legal.

```neu
let image: Text =
    "example.invalid/image:1";

record Pair {
    left: Text,
    right: Text,
}
```

A missing terminator is diagnosed at the end of its construct; the parser MUST
NOT infer one from a newline.

## SYN-LEX-003 — Comments

`//` begins a line comment. `/*` and `*/` delimit block comments, and
block comments may nest. Delimiters inside text are ordinary characters. An
unterminated block comment is one error from its opening delimiter to end of
source.

`///` is reserved for documentation under `SYN-TOL-001`. Other comments are
non-semantic trivia. v0 has no shebang or executable comment.

## SYN-LEX-004 — Identifiers and Unicode

v0 identifiers are ASCII:

```text
identifier = [A-Za-z_][A-Za-z0-9_]*
```

They are case-sensitive. Unicode is permitted in text and documentation, not in
identifiers. Tools SHOULD render a non-ASCII attempted identifier safely and
MUST NOT normalize it into an accepted name. Human display names belong in
typed text fields and are separate from symbol identity.

This conservative choice avoids normalization and confusable identity problems
in the first public contract.

## SYN-LEX-005 — Reserved and qualified names

The v0 reserved words are:

```text
neu module requires vocabulary namespace record let
true false null absent ref secret_ref
```

`Bool`, `Int`, `Decimal`, `Text`, `Null`, `Nullable`, `List`, and
`SecretRef` are predeclared core type names and cannot be redeclared in the
root namespace.

`::` joins name segments and qualification is explicit, left-to-right:

```neu
acme::delivery::config
flow::pipeline
```

v0 has no escaped identifiers. A conflicting name must be renamed, and a
vocabulary must expose a legal source alias for any external name. Quoted
identifiers are rejected because they create inconsistent identities across
tools.

## SYN-LEX-006 — Delimiters and separators

The delimiters are `()`, `[]`, `{}`, and type-application `<>`.
Separators are `,`, `:`, `;`, `=`, `?`, and `::`:

- `()` encloses arguments to built-in forms such as `ref(...)`;
- `[]` constructs ordered lists;
- `<>` encloses a type argument in `List<T>` and `Nullable<T>` only;
- `{}` encloses namespaces, records, domain declarations, and record values;
- `:` separates a name/type or field/value;
- `=` introduces a binding value or field default;
- `?` marks an optional record field only; and
- `::` qualifies names.

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

## SYN-LEX-008 — Scalars and absence

| Category | v0 forms | Logical rule |
| --- | --- | --- |
| Boolean | `true`, `false` | Exactly two `Bool` values |
| Integer | `0`, `17`, `-4`, `1_000` | Exact base-10 integer |
| Decimal | `0.0`, `-2.50`, `1_000.25` | Exact base-10 numeric value |
| Null | `null` | Sole value of `Null` |
| Absence | `absent` | Explicit omission, not a value |

Underscores may occur only between digits. Leading zeroes other than `0` are
invalid. A decimal needs digits on both sides of the point. v0 has no exponent,
non-decimal base, `NaN`, or infinity.

`Int` and `Decimal` are exact values bounded by the resource profile, not
host integers or floating point. Overflow is therefore a limit diagnostic, not
wraparound. Decimal logical equality is numeric, so `2.50` equals `2.5`;
the original spelling and scale remain only in source provenance/presentation.

`absent` is legal only in an optional position and differs from omission,
`null`, and future deferred/unavailable results.

## Required evidence

Fixtures MUST cover BOM position, newline forms, nested comments, every escape,
delimiter mismatch, missing separators, numeric boundaries, non-ASCII names,
keyword collisions, and inputs below/at/above each lexical limit.
