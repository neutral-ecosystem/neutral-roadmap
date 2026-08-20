# Neutral v0 problem resolutions

Status: resolved in the proposed v0 design; implementation and conformance
evidence remain pending.

This file records how each audit finding changed the design. The authoritative
details are in the grouped [decision records](decisions/README.md) and the
[proposed syntax guide](proposed-syntax-guide.md).

## 1. Visibility and cross-module access — resolved

Declarations are private by default. `pub` may export a record, binding, or
namespace into public IR and generated documentation. A public declaration in a
namespace requires every containing namespace to be public. A public
declaration's exposed type signature cannot name a private nominal type, and
public identity references cannot target private declarations.

This is deliberately not a security boundary: `pub` does not grant authority or
promise confidentiality. v0 also prohibits source-module imports,
module-qualified names, and cross-module source access.

## 2. Module paths versus namespace paths — resolved

The module header contains exactly one `snake_case` name, for example
`module acme_delivery`. `::` never separates module segments. It qualifies only
namespaces in the current merged module or members of a captured vocabulary
namespace. One v0 compilation request contains units for one logical
module/package identity. Absolute module syntax is deferred until imports have a
real use case.

## 3. Record defaults are too powerful — resolved

Record fields now accept a restricted `constant_value`, not an arbitrary
`value`. A default may contain literals, compatible `null`, and lists or
contextual records recursively composed from constants. A vocabulary static
value is permitted only when its captured data-only bundle marks it
constant-safe.

Ordinary binding names, `ref(...)`, and `secret_ref(...)` are invalid in record
defaults. Applying a default copies the closed constant and records the field
default as provenance; it creates no binding dependency.

## 4. Type compatibility — resolved

v0 permits only:

1. exact resolved type identity; or
2. widening an outer non-nullable `T` to `T?`.

Nullable narrowing is invalid. `List<T>`, `Ref<T>`, and `SecretRef<T>` arguments
are invariant. Therefore `string -> string?` and
`List<string> -> List<string>?` are valid, while
`List<string> -> List<string?>` is invalid. Nominal records and
vocabulary-owned types otherwise require identical resolved identity.

## 5. Vocabulary value copying — resolved

Every vocabulary-owned v0 value is immutable copyable data. Ordinary reuse
creates a new declaration identity containing the same logical value and records
reuse provenance. Vocabulary bundles cannot declare non-copyable values in v0;
domain relationships that need identity use `Ref<T>`.

## 6. Binary rounding and underflow — resolved

Source `num` remains an exact, host-independent decimal rational. Integer and
decimal targets require exact conversion. A named IEEE binary target uses
deterministic round-to-nearest, ties-to-even by default, like Python's documented
nearest-representable model; a vocabulary may instead require exact conversion.
Subnormal results and nonzero values rounded to signed zero are valid. Overflow
and non-finite results are rejected. The selected named format, never the host
machine's float type, controls the result.

## 7. Arbitrary-precision resource exhaustion — resolved provisionally

The initial compiler profile limits each numeric literal to 4,096 significant
decimal digits and an absolute decimal scale of 4,096. Implementations check
both before constructing an arbitrary-precision coefficient or attempting
decimal-to-binary conversion. These are measured profile baselines, not frozen
language semantics; representative Flow, Neux, and adversarial corpora must
validate them before a stable release.

Python's default integer string-conversion limit is 4,300 digits, while C++
conversion APIs report out-of-range for the concrete destination type. Neutral
needs both an early work bound and exact destination-contract validation, so it
uses a nearby round profile baseline plus explicit target conversion checks.

## 8. Diagnostic names — resolved

The old umbrella `NL-SYN-*` prefix is removed. Compiler diagnostics use direct
layer classes of the form `NL-<CLASS>-<ID>`, including `NL-ENC`, `NL-LEX`,
`NL-PAR`, `NL-NAM`, `NL-KND`, `NL-TYP`, `NL-DOM`, `NL-FEA`, `NL-LIM`, and
`NL-INT`. For example, the recovery cap emits `NL-LIM-TOO-MANY`.

## 9. Default expansion in the dependency graph — resolved by construction

Because record defaults are closed constants, default expansion cannot refer to
a binding or declaration identity. It adds no ordinary value-dependency edge.
The constructed value records both its construction site and the field-default
declaration as provenance, so diagnostics can still explain where the value came
from.
