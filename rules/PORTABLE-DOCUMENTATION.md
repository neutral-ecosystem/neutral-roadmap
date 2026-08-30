# Portable documentation rules

Status: repository-wide policy

## 1. Purpose

A versioned Neutral domain may have two documentation representations:

- the **host view**, kept in the version directory inside this roadmap
  repository; and
- the **portable view**, kept in that version's `portable/` subtree and designed
  to be copied into a standalone implementation repository.

They describe the same named version from different repository contexts. The
portable view is not a new language/product version and must not silently drift
from its host baseline.

```text
neutral-lang/v0/                 host view
neutral-lang/v0/portable/        portable implementation seed
```

The website can discover and render both views independently. The current
publication profile emits only `vN/portable/` views; host pages remain
unpublished until the publication profile is expanded. It labels the view near
the page title and never redirects one to the other merely because source text
is similar.

## 2. Required portable seed structure

The portable implementation seed follows this layout:

```text
portable/
|-- README.md                    portable entry point
|-- DEVELOPMENT.md               operational entry point
|-- ROADMAP.md                   milestone summary
|-- conformance/                 manifests and execution assets
|-- development/                 implementation, testing, automation, release
|-- docs/                        copied showcase and supporting reading
`-- spec/vN/                     normative version baseline
    |-- architecture.md
    |-- requirements.md
    |-- choices.md
    |-- syntax.md
    |-- syntax-checklist.md
    |-- proposed-syntax-guide.md
    |-- decisions/
    `-- fixtures/
```

`vN` is the version represented by the seed. Files may be added only when they
have one clear owner under this layout. Generated build output, dependency
directories, local progress notes unrelated to the seed, credentials, host
machine paths, and directories whose names start with `_` are excluded.

## 3. Host view structure

The host view remains in the repository's version directory:

```text
vN/
|-- README.md or DEVELOPMENT.md  version entry point
|-- ROADMAP.md                   milestone summary
|-- decisions/                   accepted/proposed version decisions
|-- development/                 host operational documents
|-- fixtures/                    host conformance source and guides
|-- portable/                    standalone export seed
`-- supporting version documents
```

The existing `neutral-lang/v0/Developement.md` filename is a legacy host entry
point. New version work uses `DEVELOPMENT.md`; publication config may retain a
redirect or alias for the existing spelling until an explicit source migration
is approved.

## 4. Synchronization rules

1. The host baseline owns the original specification and decision history.
2. The portable seed owns its repository-relative paths and standalone entry
   points.
3. A normative host change that is intended for implementation must update the
   corresponding portable source in the same change or record an explicit
   portability exception.
4. A portable change that alters semantics, requirements, or a decision must be
   proposed against the host baseline first.
5. Relative links must resolve within their own view after copying the portable
   seed contents into a repository root.
6. Portable documents must not link to an unavailable parent path outside the
   seed.
7. The website validates each view's links independently and reports drift
   between declared host/portable counterparts.

## 5. Website discovery

The website content configuration classifies a source as `host` or `portable`:

```text
host source:     neutral-lang/vN/** excluding portable/**
portable source: neutral-lang/vN/portable/**
```

The host and portable navigation trees start at their own `README.md` or
development entry point. The renderer builds a source-path/public-route index
per view before rewriting Markdown links.

Public route shapes belong to the
[website content map](../website/CONTENT-MAP.md). Build and deployment behavior
belongs to the [documentation hosting rules](HOSTING.md).

## 6. Publication metadata

The website derives these values when frontmatter is absent:

| Value | Host source | Portable source |
| --- | --- | --- |
| `view` | `host` | `portable` |
| `version` | nearest `vN` directory | nearest `vN` directory or `spec/vN` |
| `portable` | `false` | `true` |
| `sourcePath` | repository-relative host path | repository-relative portable path |

Frontmatter may override a title, description, sidebar placement, slug, or
draft state, but cannot relabel a portable source as host or change its version
identity.

## 7. Completion evidence

A portable seed is publication-ready only when:

- its required entry points and directories exist;
- all internal links resolve after a standalone copy;
- its host/portable counterpart map has no unexplained missing required file;
- generated navigation contains both views without route collisions; and
- the website displays the view and version for every published page.
