# Neutral documentation website

Status: Astro implementation initialized; publishing contract active

This directory will contain the Astro application that publishes canonical
Neutral documentation from the rest of the repository. It must render source
Markdown directly through a content loader or a generated build cache. It must
not become a hand-maintained duplicate of `neutral-lang/`, `neutral-editor/`,
`neutral-flow/`, or `neux/` documentation.

The implementation follows the sibling Neutral website template: pnpm, a
minimal Astro configuration, shared `Layout`/header/footer components, and CSS
split into global, component, and page files. Its visual language is the
template baseline, while the content loader and documentation routes are owned
by this repository.

Read these documents before creating application code:

1. [Documentation rules](../rules/DOCUMENTATION.md)
2. [Portable documentation rules](../rules/PORTABLE-DOCUMENTATION.md)
3. [Documentation hosting rules](../rules/HOSTING.md)
4. [Content map](CONTENT-MAP.md)
5. [Repository entry point](../README.md)

## Astro structure

```text
website/
|-- src/
|   |-- components/          site-only visual components
|   |-- layouts/             documentation and shell layouts
|   |-- pages/               routes and route adapters
|   |-- styles/              site theme and global styles
|   |-- lib/                 repository Markdown discovery and route mapping
|   |-- plugins/             future source-link and validation plugins
|   `-- env.d.ts             Astro type declarations
|-- docs.config.ts           canonical source groups, routes, navigation
|-- public/                  site-only static files
|-- scripts/                 local build/publish validation helpers
|-- package.json
`-- astro.config.mjs
```

The `dist/`, `.astro/`, and dependency directories are generated and
ignored by Git. Canonical documentation remains outside `website/`.

Install and run it from this directory with `pnpm install`, `pnpm dev`,
`pnpm check`, and `pnpm build`. The package manager lockfile is generated when
dependencies are installed in a networked development or CI environment.

The content loader publishes each project's top-level `ARCHITECTURE.md`,
`REQUIREMENTS.md`, and `ROADMAP.md` when present. Version index pages only link
to their matching `vN/portable/` content; host files under a version directory
are not rendered. Until a version has a portable seed, its index displays
“Documentation is still being built.”

Cloudflare and build configuration must follow the single operational contract
in [documentation hosting rules](../rules/HOSTING.md). In particular,
the Astro build reads canonical Markdown from the repository root and publishes
`website/dist/` for Wrangler.

## Cloudflare deployment

Production deployment uses Wrangler and the checked-in
[`wrangler.jsonc`](wrangler.jsonc). The config follows the Neutral website
template: the Worker is named `neutral-roadmap`, and its static assets are read from
`website/dist/` after the Astro build.

In Cloudflare Workers Builds, set the project root directory to `/website`.
Use `pnpm install --frozen-lockfile && pnpm build` as the build command and
`npx wrangler deploy` as the deploy command. Both commands then run in this
directory, so Wrangler discovers `wrangler.jsonc` and `./dist` directly.

There is deliberately no GitHub Actions workflow in this repository. When the
Cloudflare Workers Builds Git connection is active, pushes to its production
branch run the same commands automatically. The local equivalents are:

```sh
pnpm --dir website deploy
pnpm --dir website preview:cloudflare
```

Authenticate Wrangler with `wrangler login`, or provide
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the environment. Keep
token values out of the repository. `preview:cloudflare` starts the local
Workers Static Assets runtime; `deploy` publishes the generated assets.
