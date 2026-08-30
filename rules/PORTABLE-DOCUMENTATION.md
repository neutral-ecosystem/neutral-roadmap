# Portable documentation rules

Status: repository-wide policy

## 1. Purpose

A versioned Neutral domain may have two documentation representations:

- the **design view**, kept in the version's `design/` directory inside this
  roadmap repository; and
- the **portable view**, kept in that version's `portable/` subtree and designed
  to be copied into a standalone implementation repository.

They describe the same named version from different repository contexts. The
portable view is not a new language/product version and must not silently drift
from its design baseline.

```text
neutral-lang/v0/design/          repository design view
neutral-lang/v0/portable/        portable implementation seed
```

The current publication profile publishes each project's top-level contracts
and emits only `vN/portable/` content beneath each version index. It ignores
`vN/design/` completely. Design files remain repository source material and do
not receive public routes.

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

## 3. Design view structure

The design view remains in the version's private design directory:

```text
vN/
|-- design/
|   |-- DEVELOPMENT.md           design entry point when needed
|   |-- ROADMAP.md               milestone summary
|   `-- supporting design documents
`-- portable/                    standalone export seed
```

The existing `neutral-lang/v0/design/Developement.md` filename is a legacy
design entry point. New version work uses `DEVELOPMENT.md`.

## 4. Synchronization rules

1. The design baseline owns proposals and repository decision history.
2. The portable seed owns its repository-relative paths and standalone entry
   points.
3. A normative design change that is intended for implementation must update the
   corresponding portable source in the same change or record an explicit
   portability exception.
4. A portable change that alters semantics, requirements, or a decision must be
   proposed against the design baseline first.
5. Relative links must resolve within their own view after copying the portable
   seed contents into a repository root.
6. Portable documents must not link to an unavailable parent path outside the
   seed.
7. Repository validation checks links in both views and reports drift between
   declared design/portable counterparts; the website publishes only portable
   links.

## 5. Website discovery

The website content configuration uses this publication boundary:

```text
ignored source:  neutral-lang/vN/design/**
portable source: neutral-lang/vN/portable/**
```

Only the portable tree contributes version navigation. The renderer builds a
source-path/public-route index before rewriting Markdown links.

Public route shapes belong to the
[website content map](../website/CONTENT-MAP.md). Build and deployment behavior
belongs to the [documentation hosting rules](HOSTING.md).

## 6. Publication metadata

The website derives these values when frontmatter is absent:

| Value | Design source | Portable source |
| --- | --- | --- |
| `view` | `design` | `portable` |
| `version` | nearest `vN` directory | nearest `vN` directory or `spec/vN` |
| `portable` | `false` | `true` |
| `sourcePath` | repository-relative design path | repository-relative portable path |

Frontmatter may override a title, description, sidebar placement, slug, or
draft state, but cannot relabel a portable source as host or change its version
identity.

## 7. Completion evidence

A portable seed is publication-ready only when:

- its required entry points and directories exist;
- all internal links resolve after a standalone copy;
- its design/portable counterpart map has no unexplained missing required file;
- generated navigation contains no design routes or route collisions; and
- the website displays the view and version for every published page.
