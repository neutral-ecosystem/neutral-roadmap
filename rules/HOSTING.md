# Documentation hosting rules

Status: repository-wide policy

## 1. Purpose and authority

This document is the single operational contract for publishing Neutral
documentation. It defines how canonical Markdown becomes the public Astro site
and how Cloudflare Pages builds and deploys that site.

The related documents have narrower ownership:

- [Documentation rules](DOCUMENTATION.md) define how canonical Markdown is
  written and validated.
- [Portable documentation rules](PORTABLE-DOCUMENTATION.md) define the host and
  portable source layouts.
- [Website content map](../website/CONTENT-MAP.md) defines public sections,
  routes, and navigation.
- [Website README](../website/README.md) is the Astro application entry point.

Deployment settings, build triggers, and publishing behavior are defined here
only. Other documents link here instead of restating them.

## 2. Terms

`Host view` means documentation stored directly under `neutral-lang/vN/`,
excluding `portable/`. It is a content classification and is unrelated to the
hosting provider.

`Portable view` means documentation stored under
`neutral-lang/vN/portable/`, designed to remain valid when copied into a
standalone implementation repository.

`Website` means the Astro application under `website/`.

`Hosting` means the Cloudflare Pages project that builds and serves the Astro
output.

## 3. Source-of-truth model

```text
canonical Markdown in repository domains
    -> Astro loader discovers and classifies sources
    -> validation builds a source-path/route manifest
    -> Markdown links are rewritten to public routes
    -> Astro generates website/dist/
    -> Cloudflare Pages deploys website/dist/
```

Canonical content remains in `README.md`, `rules/`, `neutral-lang/`,
`neutral-editor/`, `neutral-flow/`, and `neux/`. The `website/` directory owns
rendering code and website-only assets, not copies of canonical documentation.

The website must discover eligible Markdown during every build. A committed
Markdown change therefore reaches the public site without a manual content
copy or navigation edit.

## 4. Astro publishing contract

The Astro application runs with the repository root available so its loader can
read canonical sources outside `website/`. It must:

1. Discover sources using `website/docs.config.ts`.
2. Exclude drafts, generated files, dependencies, and private tool directories.
3. Classify versioned language sources as `host` or `portable` from their paths.
4. Derive metadata when optional frontmatter is absent.
5. Build a unique source-path to public-route manifest.
6. Rewrite links between published Markdown sources through that manifest.
7. Validate source links, public routes, assets, redirects, and navigation.
8. Generate a static site in `website/dist/`.

The build must fail instead of publishing ambiguous routes, broken internal
links, missing public assets, or an unclassified source.

## 5. Cloudflare Pages configuration

Configure one Cloudflare Pages project connected to this repository:

| Setting | Value |
| --- | --- |
| Production branch | repository default branch |
| Root directory | leave unset so the build runs from the repository root |
| Build command | `npm --prefix website ci && npm --prefix website run build` |
| Build output directory | `website/dist` |
| Framework preset | Astro, or None when the fields above are set explicitly |

Do not configure `website/` as the Cloudflare root directory. The build command
runs from the repository root, invokes the package under `website/`, reads the
canonical Markdown from sibling directories, and publishes only
`website/dist/`.

The Astro project is static by default. Add a Cloudflare adapter only if a later
requirement introduces server-side rendering or runtime functions.

## 6. Build triggers

Cloudflare must rebuild when publishing code or canonical content changes.
Configure these paths as included build-watch paths:

```text
website/**
rules/**
neutral-lang/**
neutral-editor/**
neutral-flow/**
neux/**
README.md
LICENSE
```

Changes outside these paths may skip the documentation build. A pull request
preview uses the same build command and validation as production.

## 7. Update lifecycle

1. Edit the canonical Markdown in its owning domain.
2. Commit and push the change.
3. Cloudflare detects the watched path and starts the Astro build.
4. The loader rediscovers content and regenerates routes and navigation.
5. Validation must pass before deployment.
6. Cloudflare publishes the generated `website/dist/` output.

There is no content synchronization job and no generated Markdown committed to
the repository. The Git commit is the publication input; `website/dist/` is a
disposable build artifact.

## 8. Local and CI verification

After the Astro project is initialized, contributors and CI use the scripts in
`website/package.json`:

```sh
npm --prefix website ci
npm --prefix website run check
npm --prefix website run build
```

`check` validates content without deploying. `build` performs the same content
validation and produces `website/dist/`. CI must run both before a change can be
treated as publication-ready.

Until the Astro project exists, repository Markdown link and formatting checks
are the available validation baseline; these commands are a required future
application contract, not currently runnable scripts.

## 9. Ownership boundaries

- Domain maintainers own canonical content and its source-relative links.
- The website owns discovery, rendering, route rewriting, and presentation.
- Cloudflare owns build execution, previews, and deployment of generated output.
- No hosting configuration may redefine language/editor requirements or choose
  between host and portable content views.
