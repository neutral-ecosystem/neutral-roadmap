# Neutral language v1 architecture proposal

Status: proposed design architecture

## Purpose

Neutral v1 should make Neutral usable for a real project containing reusable
definitions, while preserving the v0 separation between acquisition,
compilation, public IR, and external effects. The release should establish the
shared language substrate needed by Neutral Flow and Neutral Editor without
embedding either product's semantics.

## Proposed scope

v1 extends the v0 typed, immutable, effect-free language with:

- a captured project containing multiple source units;
- one logical module per source unit and a deterministic module graph;
- explicit logical-module imports with mandatory local aliases;
- private-by-default declarations and explicit public declarations;
- qualified access to imported public records and bindings;
- cross-module value reuse and typed identity references;
- zero or more exact captured, data-only vocabularies under unique aliases;
- project-level Neutral IR, source maps, provenance, and derivation;
- capability discovery for project shape and language services; and
- a public, versioned authoring projection for editor import and deterministic
  source projection.

The retained v0 value model remains the starting point. Adding modules does not
implicitly approve expressions, functions, mutation, inheritance, templates,
macros, or executable extensions.

## System boundary

```text
host-selected root modules and resolver policy
    -> bounded capture of source and vocabulary closure
    -> immutable CapturedProject
    -> effect-free module and semantic compilation
    -> project Neutral IR plus companion evidence
    -> validated reader, Flow, Editor, and other consumers
```

The host owns filesystem, registry, workspace, network, credential, and package
policy. Source imports identify logical modules only. They never contain host
paths or URLs and never authorize acquisition.

Capture may call only the resolver supplied by the host. It records the exact
source and vocabulary closure before semantic compilation begins.
`compileCapturedProject` performs no external I/O.

## Project and module model

A captured project has:

- one project identity and captured project revision;
- one or more explicitly selected root modules;
- a finite map from logical module identity to one immutable source unit;
- exact captured vocabulary contracts and lock facts;
- language behavior versions, limits, and semantic options; and
- a complete import graph for the captured closure.

The initial v1 rule is one source unit per logical module. Two units claiming
the same logical module are an error. Partial modules and directory-based merge
rules are deferred because they make identity, diagnostics, and incremental
editing substantially less predictable.

A module name is logical and is not derived from a file path. The proposed
qualified form is a non-empty `::`-separated sequence of `snake_case` segments:

```neu
neu "1.0"
module example::delivery::shared
```

The host maps that name to captured bytes. Moving a file without changing its
logical source or module identity does not change language meaning.

## Imports and name resolution

Imports appear after the headers and vocabulary requirements and before
ordinary declarations:

```neu
import example::delivery::shared as shared
```

An import alias is mandatory and uses `snake_case`. Imported names are always
qualified:

```neu
public shared::Image image = shared::default_image
```

Imports do not inject names into local scope. An alias must be unique among
module-import aliases and vocabulary aliases in that module. Wildcard imports,
relative paths, implicit prelude imports, alias inference, and source-selected
versions are excluded.

Every import must resolve inside the captured closure. Duplicate module
identities, missing imports, self-imports, and module import cycles are errors.
The graph is therefore a deterministic directed acyclic graph. Declaration
order remains non-semantic within a module.

## Visibility and exported surface

Declarations are private to their defining module unless prefixed with
`public`:

```neu
record InternalDefaults {
    string image,
}

public record JobConfig {
    string image,
}

public JobConfig default_job = {
    image: "example.invalid/tool:1",
}
```

Only root record and binding declarations have visibility. Record fields do not
have independent visibility. Imported modules may access only public names.
The project IR retains private declarations needed to validate or define the
selected roots, while its export index exposes only public symbols.

No `private` keyword is proposed because private is the default. v1 also
excludes re-exports, package-only visibility, friend modules, protected
visibility, and runtime access control. Language visibility is structural API
surface, not authorization.

A public declaration cannot expose an inaccessible type or depend in its final
logical definition on a private declaration that a conforming external reader
cannot represent. The exact accessibility and provenance rule must be frozen
before implementation.

## Cross-module values and references

Qualified imported bindings may be reused as immutable values. Their resolved
logical value and provenance cross the module boundary.

`ref(alias::name)` may target a compatible public binding in an imported
module. The IR edge records durable module-symbol identity; graph-local element
IDs remain local labels and do not become persistent cross-project identifiers.

Value dependencies include local and imported reuse. Because module imports are
acyclic, inter-module value cycles are rejected by the module graph before
declaration-level cycle analysis. `Ref<T>` remains an identity edge and does
not imply execution, containment, ownership, readiness, or value dependency.

## Vocabulary model

Projects may need a domain vocabulary and one or more provider or integration
vocabularies. v1 therefore proposes repeated, explicitly aliased requirements:

```neu
use Flow as flow
use ExampleProvider as provider
```

The host lock maps each logical requirement to one exact captured bundle.
Aliases share the same namespace category as import aliases, so
`flow::Workflow` and `shared::JobConfig` remain syntactically uniform and
unambiguous after resolution.

Vocabularies remain closed, data-only Neutral contracts. Multiple vocabularies
do not permit callbacks, validators, scripts, native modules, executable
plugins, hidden imports, or ambient acquisition. Cross-vocabulary type
dependencies are excluded from the initial proposal unless a concrete Flow
fixture proves they are necessary.

## Project-level IR

The v1 logical payload should contain:

- language and IR behavior versions;
- project identity and selected root module identities;
- the complete logical module graph;
- per-module declarations and public export indexes;
- resolved local and cross-module type/value/reference edges;
- exact vocabulary identities and required structural features; and
- identities for every source unit and public module symbol.

Source maps identify the source unit as well as the half-open byte span.
Provenance records import traversal, qualified reuse, references, and defaults
without turning source spelling into meaning. Derivation separately commits to
the complete captured source/vocabulary closure, acceptance budgets, and
diagnostic policy.

Logical equality compares the complete project graph under consistent
graph-local ID renaming. Module identity, module-symbol identity, declaration
fingerprint, captured project revision, derivation identity, and encoded byte
identity remain distinct.

Consumers may request the whole validated project or a root/export view, but a
projection must never change identity or silently omit a dependency required to
interpret an exported declaration.

## Public language and authoring services

The compiler boundary should extend v0 operations rather than replace them:

```text
captureProject(request) -> CapturedProject
compileCapturedProject(captured) -> ProjectCompilationResult
compileProject(request) -> ProjectCompilationResult
decodeAndValidateProject(bytes, capturedContracts) -> ValidatedProject
```

Capability discovery reports module/source limits, import and visibility
features, authoring projection version, vocabulary cardinality, supported
operations, diagnostic behavior, and structural budgets. Consumers must use
capability IDs rather than infer behavior from the string `1.0`.

Neutral Editor additionally needs public operations equivalent to:

```text
importProject(capturedProject) -> AuthoringProject | diagnostics
projectSources(authoringProject) -> source units + element/source map
validateProject(capturedProject, requestRevision) -> validation result
```

`AuthoringProject` is a versioned editor-facing projection, not a public parser
tree. It represents modules, imports, visibility, declarations, source value
forms, comments promised for round-tripping, and opaque supported extensions.
The compiler adapter owns Neutral spelling and validation; the editor owns
interaction and presentation.

Incremental compilation may be exposed as an optimization with explicit cache
keys and invalidation facts. Full and incremental compilation of the same
captured project must produce logically equal results and diagnostics.

## Consumer boundary

Neutral Flow may consume public records and values from the project IR and map
its own vocabulary to workflow meaning. It must not parse modules, implement
visibility, or resolve imports.

Neutral Editor may display and edit the module graph through the authoring
projection. It must not persist a private compiler AST as project meaning or
generate IR directly.

Neither consumer may treat compilation success or `public` visibility as
authority to execute, reveal a secret, access a provider, or perform an effect.

## Explicit non-goals

- package registry, dependency solver, or lockfile file format;
- filesystem-relative or URL imports;
- partial modules, wildcard imports, re-exports, or visibility tiers;
- functions, operators, control flow, mutation, or evaluation;
- secrets, environment lookup, commands, tasks, workflows, or triggers;
- executable vocabularies, plugins, callbacks, or custom validators;
- Flow planning/runtime behavior or Editor presentation state;
- automatic v0 migration or a public general-purpose IR rewrite API; and
- canonical serialization unless signing or content addressing supplies a
  separate demonstrated requirement.
