# Neutral documentation website

Status: publishing specification; Astro implementation not initialized

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

## Planned Astro structure

```text
website/
|-- src/
|   |-- components/          site-only visual components
|   |-- layouts/             documentation and shell layouts
|   |-- pages/               routes and route adapters
|   |-- styles/              site theme and global styles
|   |-- plugins/             source-link rewrite and validation plugins
|   `-- content.config.ts    Astro content collection/loader configuration
|-- docs.config.ts           canonical source groups, routes, navigation
|-- public/                  site-only static files
|-- scripts/                 local build/publish validation helpers
|-- package.json
`-- astro.config.mjs
```

The future `dist/`, `.astro/`, and dependency directories are generated and
ignored by Git. Canonical documentation remains outside `website/`.

The content loader recognizes both host and portable version views. It reads a
portable seed from `vN/portable/` using its standalone paths and does not merge
that navigation with the host view.

Cloudflare and build configuration must follow the single operational contract
in [documentation hosting rules](../rules/HOSTING.md). In particular,
Cloudflare builds from the repository root and publishes `website/dist/`.
