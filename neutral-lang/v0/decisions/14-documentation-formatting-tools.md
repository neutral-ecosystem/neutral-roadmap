# Section 14: documentation, formatting, and tools

Status: proposed

Answers: `SYN-TOL-001` and `SYN-TOL-002`

## SYN-TOL-001 — No documentation attachment in v0

v0 has no documentation-comment or documentation-annotation production.
`//` and `/// ... ///` are non-semantic comments and never attach to a following
module, vocabulary `use`, declaration, or field.

```neu
/// Configuration note only, not IR documentation. ///
record Config {
    // Human-facing label is a domain value, not symbol identity.
    string label,
}
```

Comments may remain in the private syntax tree and source-preserving tools, but
they do not enter logical IR or affect resolution, types, logical equality,
authorization, or execution. A future documentation feature requires its own
syntax, lowering, provenance, and compatibility decision.

## SYN-TOL-002 — Stable formatter

The reference formatter uses:

- UTF-8, logical `LF`, and one final newline;
- four-space indentation and no indentation tabs;
- one space around `=` and after `:`/`,` where applicable;
- postfix `?` attached to its type and one space before the declared name;
- contextual braced values without a repeated right-hand constructor type;
- opening brace on the declaration line;
- one item per line in multiline constructs;
- trailing commas in multiline fields/lists;
- no semicolons and one logical declaration per line;
- double-quoted text with shortest unambiguous supported escapes;
- preserved line and block comments; and
- default width 100 Unicode scalar columns except unbreakable tokens.

Formatting is deterministic and idempotent. v0 refuses to rewrite a file with
fatal parse errors. Formatting may change source/derivation identity but MUST
preserve logical IR. It is not canonical IR, signature input, or proof of
domain equivalence.

## Required evidence

Golden files cover all constructs, line and block-comment boundaries, attempted
block nesting, long forms, escapes, and malformed refusal. Tests assert
formatter idempotence and logical IR equality before/after formatting under
equal captured non-source inputs.
