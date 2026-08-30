# Neutral language roadmap

Status: project roadmap

## Purpose

This roadmap describes the language project's version lifecycle. It is not the
delivery plan for one language release; each version owns that plan in its
portable documentation package.

## Ongoing workstreams

1. Maintain the project architecture, requirements, public bridge, and version
   governance defined at the language root.
2. Complete the active version's portable specification, implementation plan,
   fixtures, and conformance evidence.
3. Preserve compatibility records and document any version transition before
   tools or consumers adopt it.
4. Open a new version only when a demonstrated language need cannot be met by
   the current version without changing its contract.

## Version plan

| Version | State | Public documentation |
| --- | --- | --- |
| v0 | Active implementation target | [Portable v0 overview](v0/portable/README.md) |
| v1 | Not started | Documentation will appear when its portable seed exists |
| v2 | Not started | Documentation will appear when its portable seed exists |

## Version exit criteria

A version is complete only when its portable package contains:

- a normative architecture and requirements contract;
- an implementation roadmap and development entry point;
- accepted decisions, positive and negative fixtures, and conformance assets;
- public compiler/reader capability and compatibility facts; and
- evidence that supported consumers can use the public boundary without private
  compiler access.

## Current delivery plan

The current v0 delivery plan lives in
[`v0/portable/ROADMAP.md`](v0/portable/ROADMAP.md). The root roadmap will remain
generic as future versions are introduced.
