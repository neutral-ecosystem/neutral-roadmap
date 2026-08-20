# Neutral v0 vocabulary contract fixtures

These are semantic fixture obligations for the future captured-bundle test
harness. They deliberately do not invent a bundle serialization.

| Case | Expected result |
| --- | --- |
| Bundle contains only closed-schema types, fields, constants, static values, predefined constraints, features, and behavior IDs | Accept when all referenced identities and versions validate |
| Bundle contains a script, callback, arbitrary expression, executable validator, bytecode, native/Wasm payload, or entry point | Reject as a vocabulary schema/security error before source validation |
| Bundle uses an unknown required constraint kind | Reject closed |
| Source directly selects a member requiring feature `a`; `a` requires `b` | Required closure is `{a, b}` with reason edges |
| Instantiated nested type requires feature `nested` | Include `nested` even when source does not spell it |
| Omitted vocabulary field applies a default requiring feature `defaulted` | Include `defaulted`; record default identity/version and application site |
| Applied default introduces behavioral classification `behavior-x` | IR provenance identifies behavior as vocabulary-default introduced |
| Selected static value or evaluated constraint requires a feature | Include that feature and its reason |
| Feature dependencies contain a cycle `a -> b -> a` | Terminate deterministically, include each identity once, and reject only if a required feature is unsupported or the bundle contract separately forbids the cycle |
| Bundle contains an unrelated unreachable feature | Do not include it in the required closure |

The harness must also prove that feature traversal order, bundle field order,
and hash-map iteration do not change the closure or diagnostic order.
