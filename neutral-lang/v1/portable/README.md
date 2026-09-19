<!-- SPDX-License-Identifier: Apache-2.0 -->

# Neutral v1 portable implementation plan

Status: accepted planning baseline

This portable package is the operational release plan for evolving the working
Neutral implementation from `v0.1.0` to `v1.0.0`. It adds project-scale
language infrastructure; it does not recreate v0 or introduce Flow execution,
Editor UX, acquisition, or vocabulary-specific behavior.

The release train and its non-negotiable gates are in [PLAN.md](PLAN.md).
[ARCHITECTURE.md](ARCHITECTURE.md) states the target boundaries, and
[ROADMAP.md](ROADMAP.md) provides the milestone view.

This is intentionally a planning package, not a claim that v1 is implemented
or conformant. Before a v1 implementation repository is released, the
remaining portable contracts, exact fixtures, identity vectors, and
conformance manifest must be materialized under `specs/` and `conformance/`.
