# Neutral language v1 design plan

Status: proposed design entry point

## Purpose

This directory explores a possible Neutral v1 foundation before Neutral Flow
and Neutral Editor commit to project-scale assumptions. It is a proposal, not
an accepted language contract. Nothing here changes Neutral v0.1 behavior.

The proposed outcome is deliberately narrow:

```text
captured multi-file Neutral project
    -> deterministic module graph and visibility checks
    -> validated project-level Neutral IR
    -> public reader and authoring services
    -> independent multi-file consumer and editor probes
```

The proposal adds language-scale composition and tooling contracts. It does not
add workflow execution, commands, secrets, functions, control flow, mutation,
or application-specific types.

## Reading order

1. [Architecture proposal](ARCHITECTURE.md) defines the boundaries and model.
2. [Proposed requirements](REQUIREMENTS.md) gives stable candidate IDs.
3. [Syntax checklist](syntax-checklist.md) records surface decisions still to
   close.
4. [Design roadmap](ROADMAP.md) orders evidence and specification work.

## Design questions to resolve first

1. Can one logical module be represented by exactly one source unit in v1, or
   is partial-module merging already justified?
2. Is a private-by-default `public` modifier sufficient, without re-exports or
   friend visibility?
3. Should module names remain one `snake_case` identifier or become qualified
   logical names such as `acme::delivery::shared`?
4. Can one project use multiple exact data-only vocabularies without creating
   ambiguous namespaces or an executable plugin mechanism?
5. Which authoring projection is the smallest stable public contract that lets
   Neutral Editor import and project v1 without using a compiler-private AST?

This proposal recommends one source unit per module, qualified logical module
names, explicit aliased imports, private-by-default declarations, no re-exports,
and multiple exact data-only vocabularies under unique aliases. Each choice
still needs fixtures, lowering rules, resource treatment, and review before it
can become accepted.

## Approval boundary

A portable v1 seed must not be created merely from this proposal. Promotion
requires accepted answers to the open questions, a v0-to-v1 compatibility
decision, complete observable examples, and agreement that both Flow and Editor
can use the public contracts without private compiler access.
