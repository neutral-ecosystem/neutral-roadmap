# Section 13: diagnostics and invalid/incomplete syntax

Status: proposed

Answers: `SYN-DIA-001` through `SYN-DIA-006`

## SYN-DIA-001 — Stable diagnostic classes

Codes use `NL-SYN-<CLASS>-<NUMBER>`:

| Class | Responsibility |
| --- | --- |
| `ENC` | Encoding and invalid bytes |
| `LEX` | Tokens, literals, comments, delimiters |
| `PAR` | Malformed or misplaced grammar |
| `NAM` | Unknown, duplicate, ambiguous, inaccessible names and value-dependency cycles |
| `KND` | Resolved name has wrong kind |
| `TYP` | Core type/value mismatch |
| `DOM` | Vocabulary payload or placement |
| `FEA` | Unsupported required feature |
| `LIM` | Resource exhaustion |
| `INT` | Compiler/bundle-contract defect |

Codes, layer, and parameter schema are stable API; human messages may improve.
Invalid tokens, malformed constructs, unresolved names, wrong kinds, and invalid
domain payloads never collapse into one generic error.

## SYN-DIA-002 — Source spans

The primary location contains captured source-unit identity, a half-open
original-byte range `[start, end)`, and optional one-based line and
Unicode-scalar column for display.

Byte offsets are authoritative. Newline normalization maps back to original
bytes. A tab counts as one scalar column; visual width belongs to renderers. For
malformed UTF-8, the span identifies offending bytes and later display
coordinates may be absent.

## SYN-DIA-003 — Recovery

Recovery is deterministic and bounded:

- lexical errors consume the smallest invalid sequence that makes progress;
- unterminated text/comments consume to their specified safe boundary;
- fields/lists synchronize at comma or matching close;
- simple declarations synchronize at the next logical line ending or recognized
  declaration starter;
- braced declarations and contextual values synchronize at matching close; and
- top level may synchronize at a recognized declaration starter.

Recovery nodes never enter authoritative IR. Any recovered parse is failed
authoritative compilation. The parser MUST make byte progress after each error.

## SYN-DIA-004 — Ordering and cap

Diagnostics sort by module/source logical name, primary start byte, end byte,
stable code, then deterministic safe parameters. Ordering never depends on
threads, hash maps, resolver delivery, locale, or message text.

The initial cap is 200 ordinary diagnostics. The compiler then stops optional
recovery and appends exactly one `NL-SYN-LIM-TOO-MANY`. Fatal encoding or
resource failures may stop earlier. Truncation can never look successful.

## SYN-DIA-005 — Ambiguity

The grammar must be unambiguous. Whitespace, newline, indentation, formatter
style, and recovery cannot select meaning.

If invalid input admits competing recovery trees, emit
`NL-SYN-PAR-AMBIGUOUS` over the smallest distinguishing span and no
authoritative IR. Do not silently select the first parser alternative.

The ambiguity corpus covers keyword boundaries, `::` qualified ordinary value
uses, `.` vocabulary-static selection versus forbidden value member access,
ordinary `name` value use versus `ref(name)` identity linking, negative numbers,
contextual braced values, postfix nullable types, trailing comments, and missing
line endings/separators.

## SYN-DIA-006 — Example obligations

Every production needs at least two valid cases, invalid token/structure cases,
wrong-name/kind/type cases where applicable, a misleading lookalike, empty and
limit boundaries, exact expected codes/spans, and expected recovery behavior.

Examples are machine-readable fixtures linked from specification. The initial
set is indexed in [the fixture README](../fixtures/README.md). Prose alone does
not satisfy this item.

## Consumer boundary

Flow/Neux rejection of valid IR uses consumer-owned codes/layers, attaches to IR
identity, and maps through the public source map. neutral-lang MUST NOT relabel
it as syntax failure.
