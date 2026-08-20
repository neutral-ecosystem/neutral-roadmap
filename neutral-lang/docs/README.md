# Neutral language research library

Status: research input, not an accepted Neutral specification

Last reviewed: 2026-08-17

This directory collects language-design and IR research relevant to
[needed-features.md](../needed-features.md). It exists to make future
architecture and roadmap decisions evidence-led. Nothing in these notes defines
`.neu` syntax, Neutral semantics, the Neutral IR encoding, or a compiler API.
The only current language scope is the v0 contract in
[ARCHITECTURE.md](../ARCHITECTURE.md).

## Documents

- [Language and IR design research](language-design-research.md) — synthesis,
  recommendations, cautions, and proposed research sequence.
- [Annotated reading list](reading-list.md) — books, theses, papers, standards,
  and official implementation references.
- [Local library manifest](library/README.md) — attribution, licenses, source
  URLs, and checksums for locally retained open material.

## Selection policy

Sources are selected in this order:

1. standards and official project specifications;
2. peer-reviewed papers and university theses;
3. books made available by their authors or publishers;
4. official implementation documentation; and
5. practitioner material only when it describes an implementation and its limits
   clearly.

Availability on the web does not imply permission to redistribute a document.
Materials with unclear or restrictive redistribution terms are linked from the
reading list instead of copied into this repository. Local copies are not part
of Neutral's own license; each retains its original copyright and license.

## Research discipline

- A source is evidence, not an architecture decision.
- A successful design in a general-purpose language or machine-code compiler is
  not automatically suitable for Neutral.
- Application evidence may justify a captured vocabulary feature. A Neutral core
  feature needs independent, domain-neutral evidence.
- Concrete syntax, abstract syntax, public IR, compiler-internal forms, and
  consumer-private models remain separate design surfaces.
- New claims should identify the source, the inference made from it, and the
  limits of that inference.
