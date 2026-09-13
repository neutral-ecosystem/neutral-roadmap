# Neutral language roadmap

Status: project roadmap

## Purpose

This roadmap describes the language project's version lifecycle. It is not the
delivery plan for one language release; active versions own that plan in their
portable documentation package, while released versions retain an immutable
conformance bundle.

## Ongoing workstreams

1. Maintain the project architecture, requirements, public bridge, and version
   governance defined at the language root.
2. Complete an active version's portable specification, implementation plan,
   fixtures, and conformance evidence before release.
3. Preserve compatibility records and document any version transition before
   tools or consumers adopt it.
4. Open a new version only when a demonstrated language need cannot be met by
   the current version without changing its contract.

## Version plan

| Version | State | Public documentation |
| --- | --- | --- |
| v0.1.0 | Released and archived | [Immutable v0.1.0 bundle](v0/portable/README.md) |
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

## Latest release record

The local v0 archive mirrors the released
[`v0.1.0` conformance bundle](https://github.com/neutral-ecosystem/neutral-lang/tree/main/conformance/releases/v0.1.0).
The root roadmap remains generic until v1 has an active portable package.
