# Repository rules

Status: repository-wide entry point

This directory contains shared policy for documentation sources and their
public website. Each concern has one governing document:

| Concern | Governing document |
| --- | --- |
| Markdown format, metadata, ownership, and source validation | [Documentation rules](DOCUMENTATION.md) |
| Host and portable source structures and synchronization | [Portable documentation rules](PORTABLE-DOCUMENTATION.md) |
| Astro build, Cloudflare Workers configuration, deployment inputs, and lifecycle | [Documentation hosting rules](HOSTING.md) |
| Public sections, URLs, and navigation | [Website content map](../website/CONTENT-MAP.md) |

The publishing flow is:

```text
domain Markdown -> Astro in website/ -> website/dist/ -> Wrangler -> Cloudflare Workers
```

Edit domain Markdown at its canonical location. Do not copy it into `website/`
and do not commit generated `website/dist/` output.
