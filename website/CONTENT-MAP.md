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
| Neutral language | `/neutral-lang/**/*.md` | `/language/` | Architecture, requirements, choices, syntax, version host views, portable seeds, showcase |
| Neutral Editor | `/neutral-editor/**/*.md` | `/editor/` | Overview, v0 compliance, architecture, technology stack, integration, roadmap, research |
| Neutral Flow | `/neutral-flow/**/*.md` | `/flow/` | Architecture, requirements, roadmap, version plans, research |
| Neux | `/neux/**/*.md` | `/neux/` | Reserved/research documents when present |
| Repository rules | `/rules/**/*.md` | `/rules/` | Documentation rules and future shared policies |

The website excludes `.agents/`, `.codex/`, build output, dependency folders,
every directory whose name starts with `_` (for example `_notes/` or
`_archive/`), private operational notes, and any future document marked
`draft: true`. An underscore prefix is the repository-wide directory convention
for content that is not part of the public documentation tree.

## Host and portable views

Versioned language documentation has two independently published views:

```text
host:     /neutral-lang/vN/** excluding /portable/**
portable: /neutral-lang/vN/portable/**
```

The host view is the roadmap-repository context. The portable view is the
standalone implementation-seed context shown in `portable/`, including its
`conformance/`, `development/`, `docs/`, and `spec/vN/` sections. The website
must detect both source groups, label pages with their view/version, build
separate navigation trees, and validate their links independently.

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
| `/neutral-lang/v0/ROADMAP.md` | `/language/v0/host/roadmap/` |
| `/neutral-editor/v0/REQUIREMENTS.md` | `/editor/v0/requirements/` |
| `/neutral-editor/docs/node-editor-research.md` | `/editor/research/node-editor/` |
| `/rules/DOCUMENTATION.md` | `/rules/documentation/` |
| `/neutral-lang/v0/portable/README.md` | `/language/v0/portable/` |
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
build pipeline, Cloudflare Pages settings, watched paths, and update lifecycle
are defined by the
[documentation hosting rules](../rules/HOSTING.md).
