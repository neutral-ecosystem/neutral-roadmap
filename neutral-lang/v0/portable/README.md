# Neutral language v0 — portable implementation seed

This directory is a self-contained starting point for the `neutral-lang`
implementation repository. Copy the contents of this directory, not the
directory itself, into the new repository root.

Start with [PLAN.md](PLAN.md). Do not implement language behavior
until the mandatory [contract-freeze gate](development/02-CONTRACT-FREEZE.md) is
approved.

## Layout

```text
README.md                     portable overview
ARCHITECTURE.md               normative v0 architecture
PLAN.md                       operational entry point
ROADMAP.md                    milestone summary
conformance/                  conformance manifests and execution assets
development/                  implementation, testing, automation, release rules
specs/                        requirements, syntax, decisions, fixtures, and showcase
```

`development/06-PROGRESS.md` is the solo-maintained working log. It records only
current focus, immediate actions, blockers, and completed validation evidence;
the specifications and checklists remain acceptance criteria rather than a
second mutable status system.
