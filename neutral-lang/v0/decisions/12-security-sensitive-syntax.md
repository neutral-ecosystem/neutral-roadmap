# Section 12: security-sensitive syntax

Status: proposed

Answers: `SYN-SEC-001` through `SYN-SEC-006`

## SYN-SEC-001 — Opaque secret references

Secret requests use a dedicated value form:

```neu
SecretRef<string> token = secret_ref("ci/signing-token")
```

It produces an opaque value whose expected type is `SecretRef<T>`. The argument
is a logical identifier, not secret material, a provider credential, or a
filesystem path. `T` declares the delivery shape requested from the eventual
secret broker; the compiler does not inspect or guarantee the resolved content.
Only bindings or fields whose expected type is `SecretRef<T>` accept the value.
`SecretRef` requires exactly one well-formed Neutral type argument; bare, empty,
and multi-argument forms are type errors. Consumer/broker support for that
delivery shape is a later capability decision, not compiler proof.

IR contains the opaque logical identifier, sensitivity classification, and
source provenance. It MUST NOT contain resolved value, token, lease, destination
credential, or broker response. neutral-lang never resolves the reference.

## SYN-SEC-002 — Secret references are not text

`SecretRef<T>` is not `string` and has no implicit conversion, interpolation,
concatenation, formatting, equality display, or ordinary serialization as text.
v0 has no interpolation in any case. A quoted value
`"ci/signing-token"` is merely text and cannot satisfy `SecretRef<T>`.

Human renderers show a redacted placeholder and safe element identity rather
than the argument by default. A consumer must use a separate authorized broker
protocol to act on the reference; the syntax grants no authority.

## SYN-SEC-003 — No execution during compilation

v0 has no syntax for:

- evaluating native, shell, provider, or downloaded code;
- compiler macros or procedural annotations;
- dynamic libraries or plugin entry points;
- command substitution;
- environment-variable lookup;
- network/file reads; or
- secret resolution.

Vocabulary-owned typed declarations and raw text are inert data. Vocabulary bundles are
data-only. A string that resembles a shell command remains text. Compiler
constant handling is limited to parsing literal/record/list/reference forms and
applying declarative static constraints.

## SYN-SEC-004 — Explicit resolver boundary

The source language has no `include(path)`, URL import, ambient profile search,
or home/current-directory expansion. v0 source declares logical modules and
vocabulary `use` requirements; the compilation request supplies captured source
units and bundles through one explicit resolver.

Resolver credentials and mutable acquisition state never enter source, IR, or
derivation. The derivation records safe immutable content/results, not secrets.
A missing input fails closed instead of triggering fallback lookup.

## SYN-SEC-005 — Safe diagnostics

Diagnostics MUST NOT copy secret-reference arguments, values in schema-marked
sensitive fields, resolver credentials, environment values, or untrusted
control characters into ordinary messages.

Each diagnostic record separates stable code, safe parameters, primary span,
related spans, and optional excerpt. Safe/server mode omits excerpts intersecting
sensitive nodes and replaces values with typed redaction markers. Paths are
reported as safe logical source names, not accidental host paths. Terminal and
HTML renderers escape all untrusted text.

Redaction never changes whether compilation succeeds and cannot be disabled by
source syntax.

## SYN-SEC-006 — Lexical and structural limits

The initial named desktop/CI profile applies:

| Budget | v0 provisional limit |
| --- | ---: |
| Bytes per source unit | 2 MiB |
| Source units | 256 |
| Complete closure | 16 MiB |
| Import/composition depth | 64 |
| Structural nesting | 128 |
| Emitted diagnostics | 200 plus one truncation diagnostic |
| Compilation deadline | 10 seconds on the named benchmark host |
| Process memory | 512 MiB on the named benchmark host |

A text or numeric literal is additionally bounded by the containing source-unit
limit and the configured decoded-node budget. Delimiter, type, and value nesting
all consume the same structural depth budget; changing construct kind cannot
reset it. Block comments do not nest and are bounded by source-unit size and
compilation work budgets.

Limits are explicit compiler inputs and recorded in derivation when they affect
acceptance. Crossing a limit produces one bounded diagnostic and no authoritative
IR. A host may impose stricter limits but never silently larger ones than its
published safety ceiling.

## Required evidence

Tests MUST demonstrate that secret arguments never appear in normal output,
source cannot trigger any ambient effect, malicious Unicode/control text is
escaped, missing resolver inputs fail closed, and every limit is tested below,
at, and above its boundary without unbounded recovery diagnostics.
