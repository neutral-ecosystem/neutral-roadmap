# Neutral language v1 portable-readiness record

Status: accepted

Readiness: ready for portable promotion

This record confirms that the Neutral v1 design has no unresolved semantic or
architectural choice blocking creation of the standalone portable seed. It does
not claim that an implementation exists or passes conformance.

## Design-to-portable map

| Accepted design source | Portable destination |
| --- | --- |
| `PLAN.md` | `portable/README.md` and `portable/PLAN.md` |
| `ARCHITECTURE.md` | `portable/ARCHITECTURE.md` |
| `ROADMAP.md` | `portable/ROADMAP.md` |
| `REQUIREMENTS.md` | `portable/specs/REQUIREMENTS.md` |
| `DECISIONS.md` | `portable/specs/decisions/` records and index |
| `SOURCE-CONTRACT.md` | `portable/specs/contracts/SOURCE.md` |
| `PROJECT-CONTRACTS.md` | `portable/specs/contracts/PROJECT.md` and identity vectors |
| `VOCABULARY-CONTRACT.md` | `portable/specs/contracts/VOCABULARY.md` |
| `AUTHORING-CONTRACT.md` | `portable/specs/contracts/AUTHORING.md` |
| `CONFORMANCE.md` | `portable/conformance/README.md`, manifest, fixtures, and oracle inventory |
| `syntax-checklist.md` | `portable/specs/contracts/syntax-checklist.md` |

## Closed semantic gates

- v0 inheritance and explicit v0/v1 profile separation;
- exact v1 grammar delta and exclusions;
- one source unit per qualified logical module;
- imports, aliases, SCCs, visibility, public closure, and cross-module edges;
- multiple exact data-only vocabularies and exact lock coverage;
- inert `url` and `path` scalar values;
- pre-resolved host-neutral project capture;
- complete project IR and separate consumer views;
- NHT-v1/SHA-256 canonical logical project identity;
- artifact-specific derivation identities;
- bounded diagnostics and project resource profiles;
- public reader behavior;
- separately versioned data-only authoring bridge with static descriptors,
  project overlays, and a closed editable document model; and
- Editor and Flow ownership boundaries.

## Portable materialization work

The following work belongs to creating the seed and does not reopen semantics:

1. Create the required portable directory structure and standalone entry points.
2. Split the accepted decision ledger into portable decision records.
3. Copy the contracts with portable-relative links and SPDX headers.
4. Materialize every named fixture as exact source/request/vocabulary bytes.
5. Calculate and review literal NHT transcript and SHA-256 identity vectors.
6. Create the conformance manifest and expected-result oracle inventory.
7. Add ordered development-phase documents for implementation and release.
8. Add design/portable traceability and portability-exception records, if any.
9. Run standalone link, documentation, website-discovery, and drift checks.

## Claims boundary

After this work, v1 may be called **implementation-ready**. It may be called
**implemented** only after a compiler and reader satisfy the portable contracts.
It may be called **conformant** only after the full inherited v0 and v1 delta
corpora, independent identity vectors, and Reader/Editor/Flow boundary probes
pass with reviewed evidence.
