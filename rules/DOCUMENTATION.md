# Documentation rules

Status: repository-wide policy

## 1. Purpose

Neutral documentation is authored as Markdown in the domain directory that owns
the behavior it describes. The future website is a rendering and publishing
layer; it does not become a second source of truth.

```text
canonical Markdown in repository domains
    -> website content loader and validation
    -> generated static site
```

Every public page must have one canonical Markdown source. Copying the same
normative content into `website/` is prohibited.

## 2. Markdown standard

All canonical Markdown documents use UTF-8 and one H1 heading. A document title
is plain language and names its subject directly.

```md
# Subject name

Status: proposed | accepted | implemented | research | archived

One short paragraph explaining the document's purpose and authority.

## Scope

...

## Requirements or decisions

...

## Evidence or next steps

...
```

The exact later headings depend on document class, but headings must form a
logical hierarchy: H1, then H2, then H3. Do not skip from H1 to H3.

Use sentence-case headings, wrapped lines, fenced code blocks with a language
tag when one exists, and relative Markdown links for repository documents.
Use descriptive link text rather than raw URLs.

Tables are appropriate for comparisons, ownership, traceability, and stable
field mappings. Lists are appropriate for requirements, rules, and short
sequences. Do not use tables merely to create page layout.

## 3. Optional public metadata

Existing source documents do not need frontmatter to become public. The website
derives an initial title from H1 and status from the `Status:` line.

Add frontmatter only when a document needs a stable publishing override:

```md
---
title: Neutral Editor v0 requirements
description: Editor compliance requirements for the Neutral language v0 profile.
status: proposed
sidebar:
  group: Neutral Editor
  order: 3
---
```

Allowed frontmatter fields are `title`, `description`, `status`, `sidebar`,
`slug`, `draft`, and `tags`. Unknown required publishing metadata fails the site
build. Frontmatter does not define Neutral language semantics or replace the
document's visible status line.

## 4. Document classes

| Class | Required content | Usual location |
| --- | --- | --- |
| Entry point | Scope, reading order, status, links to governing documents | `README.md` at a repository or domain root |
| Architecture | Purpose, boundaries, ownership, non-goals, data/control flow | domain root or version directory |
| Requirements | Stable IDs, observable obligations, completion evidence | domain root or version directory |
| Decision | Decision, reason, consequence, alternatives when needed | `v*/decisions/` |
| Roadmap | Outcome, ordered stages, exits, deferred work | domain root or version directory |
| Research | Sources, findings, applicability, unresolved questions | `docs/` |
| Development | Implementation gates, testing, automation, release evidence | `v*/development/` |
| Fixture guide | Fixture purpose, ownership, execution/coverage rules | `v*/fixtures/` |
| Showcase | Reader-oriented examples that link back to governing contracts | `docs/` or domain root |

Normative documents must state their status and authority. Research, examples,
and roadmaps must not silently define normative behavior.

## 5. Directory ownership and structure

Each public project follows this top-level shape:

```text
project/
|-- ARCHITECTURE.md
|-- REQUIREMENTS.md
|-- ROADMAP.md
|-- v0/
|-- v1/
`-- vN/
```

The three top-level documents are the project contract. Version directories
hold version history and implementation material; their public version page is
allowed to expose only the matching `vN/portable/` subtree when that subtree
exists. Host files elsewhere under `vN/` remain source material, not public
pages.

| Directory | Owns | Must not contain |
| --- | --- | --- |
| `/` | Ecosystem entry point, shared license, cross-project discovery | Duplicated domain specifications |
| `/rules/` | Repository-wide authoring, publication, contribution, and validation policies | Neutral language or application semantics |
| `/assets/` | Shared visual assets with stable names and attribution/license facts where needed | Generated website output |
| `/neutral-lang/` | Neutral language architecture, requirements, syntax, decisions, examples, and version plans | Flow, editor, runtime, or OS-specific semantics |
| `/neutral-lang/docs/` | Supporting language reading, library material, and showcase documents | Normative v0 decisions duplicated from `v0/` |
| `/neutral-lang/vN/` | Version-specific entry point, decisions, development rules, fixtures, and roadmap | Behavior from another language version without an explicit compatibility note |
| `/neutral-lang/vN/decisions/` | Accepted or proposed version-specific decisions with stable IDs | General implementation logs |
| `/neutral-lang/vN/development/` | Gates, implementation stages, environment, testing, and release evidence | New language semantics |
| `/neutral-lang/vN/fixtures/` | Positive, negative, boundary, and adversarial source fixtures plus manifests | Unexplained scratch examples |
| `/neutral-lang/vN/portable/` | Copyable standalone implementation seed with its own `spec/`, `development/`, `conformance/`, and `docs/` structure | Host-only relative links, generated build output, or unrecorded divergence from the host baseline |
| `/neutral-flow/` | Flow-specific planning, architecture, requirements, and release research | `.neu` grammar or Neutral compiler behavior |
| `/neutral-flow/docs/` | Flow research and supporting analysis | Neutral Editor product requirements |
| `/neutral-flow/vN/` | Flow version roadmaps and checklists | Cross-version copied requirements without disposition |
| `/neutral-editor/` | Editor product documentation, architecture, compliance, and implementation stack | A duplicate Neutral language specification |
| `/neutral-editor/docs/` | Node-editor research and supporting design analysis | Canonical UI code or generated website content |
| `/neutral-editor/vN/` | Editor version overview, requirements, architecture, integration contracts, decisions, and roadmap | Neutral language behavior not owned by the editor |
| `/neutral-editor/vN/decisions/` | Editor-specific decisions and consequences | Framework documentation copied verbatim |
| `/neux/` | Future OS abstraction research | Flow/editor ownership or language changes |
| `/neux/docs/` | Supporting Neux research | Production implementation artifacts until a Neux implementation scope exists |
| `/website/` | Astro application, publishing configuration, themes, routes, generated build output ignored by Git | Canonical copies of domain Markdown |

`vN` means a concrete version directory such as `v0`, `v1`, or `v2`.

Portable seeds and their corresponding host views follow the additional
[portable documentation rules](PORTABLE-DOCUMENTATION.md).
Public builds and deployment follow the
[documentation hosting rules](HOSTING.md).

## 6. Source links, assets, and anchors

Canonical Markdown links use a relative path and point to the owning source
document. Links may include a heading fragment when that fragment is stable.

The website publishing layer resolves source links through its content map and
rewrites them to public routes. A raw relative repository link must not be
assumed to work unchanged after rendering at a website URL.

Images belong under the owning domain's `img/` or a shared path in `assets/`.
Every public image needs meaningful alt text. Generated diagrams and screenshots
must identify their source or regeneration procedure when that affects review.

## 7. Change rules

1. Change the canonical source document, never a generated website copy.
2. Update the owning entry point when a new governing document is introduced.
3. Add or update stable requirement/decision IDs before relying on a behavior.
4. Keep links valid across source and published routes.
5. Keep terminology and version references consistent with the owning domain.
6. Add fixture and evidence references when a normative language/editor contract
   changes.
7. Treat a changed title or slug as a compatibility change; retain a redirect
   when the document is public.

## 8. Validation rules

The documentation pipeline must fail for:

- missing or duplicate H1 titles;
- invalid or duplicate public slugs;
- broken local source links;
- a public document without a source owner;
- unknown required frontmatter fields;
- a missing asset referenced by a public page; or
- a public route that conflicts with a retained redirect.

The Astro validation responsibilities and deployment gates are defined by the
[documentation hosting rules](HOSTING.md). Formatting lint is advisory until a
single repository formatter is selected.
