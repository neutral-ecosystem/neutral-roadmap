# Section 14: documentation, formatting, and tools

Status: proposed

Answers: `SYN-TOL-001` and `SYN-TOL-002`

## SYN-TOL-001 — Documentation attachment

`///` begins documentation. Consecutive lines attach to the immediately
following module, vocabulary requirement, declaration, or record/domain field
when no blank line or other token intervenes.

```neu
/// Configuration consumed by the selected profile.
record Config {
    /// Human-facing label; not symbol identity.
    string label,
}
```

One optional ASCII space after `///` is stripped. Shared relative indentation
is stripped; remaining text/newlines are preserved. A blank line ends the block.
A dangling block is a warning and never attaches across another comment/item.

Documentation is optional non-behavioral metadata with provenance. It does not
affect resolution, types, logical equality, authorization, or execution.
Ordinary comments never become documentation.

## SYN-TOL-002 — Stable formatter

The reference formatter uses:

- UTF-8, logical `LF`, and one final newline;
- four-space indentation and no indentation tabs;
- one space around `=` and after `:`/`,` where applicable;
- opening brace on the declaration line;
- one item per line in multiline constructs;
- trailing commas in multiline fields/lists;
- no semicolons and one logical declaration per line;
- double-quoted text with shortest unambiguous supported escapes;
- preserved comments/documentation attachment; and
- default width 100 Unicode scalar columns except unbreakable tokens.

Formatting is deterministic and idempotent. v0 refuses to rewrite a file with
fatal parse errors. Formatting may change source/derivation identity but MUST
preserve logical IR and documentation meaning. It is not canonical IR,
signature input, or proof of domain equivalence.

## Required evidence

Golden files cover all constructs, comment boundaries, long/nested forms,
escapes, and malformed refusal. Tests assert formatter idempotence and logical
IR equality before/after formatting under equal captured non-source inputs.
