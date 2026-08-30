# Documentation hosting rules

Status: repository-wide policy

## 1. Purpose and authority

This document is the single operational contract for publishing Neutral
documentation. It defines how canonical Markdown becomes the public Astro site
and how Wrangler deploys that site to Cloudflare Workers Static Assets.

The related documents have narrower ownership:

- [Documentation rules](DOCUMENTATION.md) define how canonical Markdown is
  written and validated.
- [Portable documentation rules](PORTABLE-DOCUMENTATION.md) define the host and
  portable source layouts.
- [Website content map](../website/CONTENT-MAP.md) defines public sections,
  routes, and navigation.
- [Website README](../website/README.md) is the Astro application entry point.

Deployment settings and publishing behavior are defined here only. Other
documents link here instead of restating them.

## 2. Terms

`Design view` means repository-only documentation stored under
`neutral-lang/vN/design/`. The website ignores it.

`Portable view` means documentation stored under
`neutral-lang/vN/portable/`, designed to remain valid when copied into a
standalone implementation repository.

`Website` means the Astro application under `website/`.

`Hosting` means the Cloudflare Worker that serves the Astro output as static
assets.

## 3. Source-of-truth model

```text
canonical Markdown in repository domains
    -> Astro loader discovers and classifies sources
    -> validation builds a source-path/route manifest
    -> Markdown links are rewritten to public routes
    -> Astro generates website/dist/
    -> Wrangler deploys website/dist/ to Cloudflare Workers Static Assets
```

Canonical content remains in `README.md`, `rules/`, `neutral-lang/`,
`neutral-editor/`, `neutral-flow/`, and `neux/`. The `website/` directory owns
rendering code and website-only assets, not copies of canonical documentation.

The website must discover eligible Markdown during every build. A committed
Markdown change therefore reaches the public site on the next explicit deploy,
without a manual content copy or navigation edit.

## 4. Astro publishing contract

The Astro application runs with the repository root available so its loader can
read canonical sources outside `website/`. It must:

1. Discover sources using `website/docs.config.ts`.
2. Exclude drafts, generated files, dependencies, private tool directories, and
   every directory whose name starts with `_`.
3. Publish project-root `ARCHITECTURE.md`, `REQUIREMENTS.md`, and `ROADMAP.md`
   when present.
4. Classify versioned sources as `design` or `portable` from their paths.
5. Publish only matching `vN/portable/` content below a version route.
6. Derive metadata when optional frontmatter is absent.
7. Build a unique source-path to public-route manifest.
8. Rewrite links between published Markdown sources through that manifest.
9. Validate source links, public routes, assets, redirects, and navigation.
10. Generate a static site in `website/dist/`.

The build must fail instead of publishing ambiguous routes, broken internal
links, missing public assets, or an unclassified source.

## 5. Cloudflare Workers configuration

Use the checked-in [`website/wrangler.jsonc`](../website/wrangler.jsonc) as the
single deployment configuration. It follows the Neutral website template:

| Setting | Value |
| --- | --- |
| Worker name | `neutral-roadmap` |
| Compatibility date | `2026-08-11` |
| Local working directory | `website/` |
| Assets directory | `./dist` relative to `website/` |
| Not-found handling | `404-page` |
| Verify command | `pnpm check && pnpm build` |
| Deploy command | `pnpm deploy` |

Run the commands from `website/`, or use their `pnpm --dir website` equivalents
from the repository root. The config resolves `./dist` to `website/dist/` and
Wrangler finds the package's `wrangler.jsonc` automatically. Authenticate with
`wrangler login`, or provide `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` in the environment. Never commit token values.

This repository intentionally does not configure a GitHub Actions deploy
workflow or a Git-triggered Cloudflare build. A push updates source control but
does not publish the site. Production changes are released explicitly with
Wrangler after local verification.

See Cloudflare's [Workers Static Assets SSG guide](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)
and [Wrangler configuration reference](https://developers.cloudflare.com/workers/wrangler/configuration/)
for provider-side behavior and available options.

The Astro project is static by default. Add a Cloudflare adapter only if a later
requirement introduces server-side rendering or runtime functions.

## 6. Template conventions and deployment

The reference Neutral website template establishes the implementation baseline:

- `pnpm` is the package manager and `pnpm-lock.yaml` is committed.
- `astro.config.mjs` stays minimal for a static Astro site.
- `src/layouts/Layout.astro` imports global CSS and wraps shared header/footer
  components.
- Styles are split into `src/styles/global.css`, component styles, and page
  styles; the roadmap site should preserve that separation.
- `public/` contains site assets; generated `.astro/`, `dist/`, and Wrangler
  state are build artifacts.
- `wrangler.jsonc` is the deployment configuration for the Workers Static
  Assets runtime and local preview.

The `deploy` script must run the content check/build before invoking
`wrangler deploy`. If a separate CI system is added later, it must reuse the
same frozen install, check, build, and deploy commands; it must not become a
second content synchronization mechanism.

## 7. Deployment inputs

The explicit deploy command must be rerun when website code or canonical
content changes. These paths are the publishing inputs:

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

Changes outside these paths do not affect the generated documentation site.

## 8. Update lifecycle

1. Edit the canonical Markdown in its owning domain.
2. Run `pnpm --dir website check` and `pnpm --dir website build`.
3. The loader rediscovers content and regenerates routes and navigation.
4. Run `pnpm --dir website deploy` from the repository root.
5. Wrangler uploads the generated `website/dist/` output to the `neutral-roadmap` Worker.

There is no content synchronization job and no generated Markdown committed to
the repository. The Git commit is the publication input; `website/dist/` is a
disposable build artifact.

## 9. Local verification

Contributors use the scripts in `website/package.json`:

```sh
pnpm --dir website install --frozen-lockfile
pnpm --dir website check
pnpm --dir website build
```

`check` validates content without deploying. `build` performs the same content
validation and produces `website/dist/`. Run `deploy` only after those checks
pass. `preview:cloudflare` starts a local Workers Static Assets preview from
the same output.

No GitHub workflow or Cloudflare Git trigger is required. Publishing is an
explicit maintainer action and uses the checked-in Wrangler configuration.

## 10. Ownership boundaries

- Domain maintainers own canonical content and its source-relative links.
- The website owns discovery, rendering, route rewriting, and presentation.
- Wrangler owns deployment, and Cloudflare Workers serves the generated output.
- No hosting configuration may redefine language/editor requirements or choose
  between design and portable content views.
