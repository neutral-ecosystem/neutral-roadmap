# Neutral v0 numeric conversion fixtures

Source `num` is an exact normalized value `coefficient × 10^-scale`. Each row
supplies an abstract expected contract; no host numeric conversion is permitted.

| Source | Expected contract | Result |
| --- | --- | --- |
| `0.1` | binary32, `exact` | Reject: not exactly representable |
| `0.1` | binary32, `round_ties_to_even` | Accept: bits `0x3dcccccd` |
| `0.1` | binary64, `exact` | Reject: not exactly representable |
| `0.1` | binary64, `round_ties_to_even` | Accept: bits `0x3fb999999999999a` |
| `0.5` | binary32, `exact` | Accept: bits `0x3f000000` |
| `0.5` | binary64, `exact` | Accept: bits `0x3fe0000000000000` |
| `10.0` | int32, exact | Accept as integer `10` |
| `10.5` | int32, exact | Reject: fractional loss |
| `-1` | uint32, exact | Reject: invalid sign |
| `16_777_216` | binary32, `exact` | Accept: bits `0x4b800000` |
| `16_777_217` | binary32, `exact` | Reject: not exactly representable |
| `16_777_217` | binary32, `round_ties_to_even` | Accept as `16_777_216`, bits `0x4b800000` |
| `340_282_360_000_000_000_000_000_000_000_000_000_000` | binary32, either policy | Reject: overflow |
| `0.00000000000000000000000000000000000000000000000001` | binary32, `round_ties_to_even` | Reject: nonzero-to-zero underflow |
| `0.1` | binary32, policy omitted | Reject: conversion policy required |

These cases remain semantic fixtures until the vocabulary numeric-contract
encoding is fixed. Their result is already fixed: none may inherit host
behavior.
