# Documentation website content map

Status: initial publication map

This map defines which canonical Markdown sources become public documentation,
how they are grouped, and the public URL shape. The future `website/docs.config.ts`
implements this map. It must discover files from source groups and validate the
result rather than maintain copied Markdown.

## Public sections

| Section | Canonical source group | Public URL prefix | Initial navigation |
| --- | --- | --- | --- |
| Overview | `/README.md` | `/` | Neutral roadmap, license, workstream entry points |
| Neutral language | `ARCHITECTURE.md`, `REQUIREMENTS.md`, `ROADMAP.md`, and `/neutral-lang/vN/portable/**/*.md` | `/language/` | three contracts plus version indexes limited to matching portable content |
| Neutral Editor | `ARCHITECTURE.md`, `REQUIREMENTS.md`, `ROADMAP.md`, and `/neutral-editor/vN/portable/**/*.md` | `/editor/` | three contracts plus version indexes limited to matching portable content |
| Neutral Flow | `ARCHITECTURE.md`, `REQUIREMENTS.md`, `ROADMAP.md`, and `/neutral-flow/vN/portable/**/*.md` | `/flow/` | three contracts plus version indexes limited to matching portable content |
| Repository rules | `/rules/**/*.md` | `/rules/` | Documentation rules and future shared policies |

The website excludes `.agents/`, `.codex/`, build output, dependency folders,
every directory whose name starts with `_` (for example `_notes/` or
`_archive/`), private operational notes, and any future document marked
`draft: true`. An underscore prefix is the repository-wide directory convention
for content that is not part of the public documentation tree.

`neux/` remains a reserved repository area. It receives a public route only
after its project-level contracts exist and it satisfies the same publication
rules as the other domains.

## Design and portable views

Versioned project documentation has two source views. The public site publishes
the project's three top-level contracts and version index pages; each version
index exposes only its matching portable view:

```text
design:   /neutral-lang/vN/design/**
portable: /neutral-lang/vN/portable/**
```

The design view is repository-only and is ignored by the website. The portable
view is the standalone implementation-seed context shown in
`portable/`, including its `conformance/`, `development/`, `docs/`, and
`spec/vN/` sections. The website only emits `vN/portable/` pages under a version
index. If a version has no
portable seed, that version route remains available and displays a
documentation-in-progress state.

See [portable documentation rules](../rules/PORTABLE-DOCUMENTATION.md) for the
required seed structure and host/portable synchronization rules.

## URL rules

Public URLs are lowercase, hyphenated, and stable. They are derived from the
source path unless a source declares an explicit `slug` override.

Examples:

| Source | Public route |
| --- | --- |
| `/README.md` | `/` |
| `/neutral-lang/ARCHITECTURE.md` | `/language/architecture/` |
| `/neutral-lang/REQUIREMENTS.md` | `/language/requirements/` |
| `/neutral-lang/ROADMAP.md` | `/language/roadmap/` |
| `/neutral-lang/v0/ROADMAP.md` | not published yet |
| `/neutral-editor/v0/REQUIREMENTS.md` | not published yet |
| `/neutral-editor/docs/node-editor-research.md` | not published yet |
| `/rules/DOCUMENTATION.md` | `/rules/documentation/` |
| `/neutral-lang/v0/portable/README.md` | `/language/v0/` |
| `/neutral-lang/v0/portable/spec/v0/architecture.md` | `/language/v0/portable/spec/v0/architecture/` |

The content loader creates a source-path to public-route index before Markdown
is rendered. A Markdown link to another published source resolves through this
index. Links to non-public repository files remain source links or are reported
as validation errors according to the publication configuration.

## Navigation rules

Navigation is generated from the content map plus optional `sidebar` metadata.
The default order is:

1. Domain entry point.
2. Architecture.
3. Requirements.
4. Decisions and specifications.
5. Roadmap/development.
6. Fixtures, showcases, and research.

Version directories group beneath their owning domain. The website shows status
near the title and labels research/archived material clearly. A source document
does not become normative because it is visible in navigation.

## Hosting boundary

This file owns content selection, public routes, and navigation only. The Astro
build pipeline, Wrangler configuration, deployment inputs, and update lifecycle
are defined by the
[documentation hosting rules](../rules/HOSTING.md).
