# Neutral language v1 source contract

Status: accepted

This document fixes the observable v1 source-language delta over the accepted
v0.1 source contract. Unchanged lexical, literal, declaration, record, list,
nullability, default, reuse, reference, comment, layout, and numeric behavior is
inherited by reference and is not repeated here.

## Profile and source unit

Every v1 source unit is UTF-8 under the inherited v0 source rules and begins
with exactly:

```neu
neu "1.0"
module example::qualified_name
```

One source unit defines exactly one logical module. The module header must match
the logical module identity supplied for that source unit by capture.

All source units in one project use `neu "1.0"`. Mixed v0/v1 projects are not
accepted by v1 capture.

## Added words and names

v1 reserves the lowercase words `public`, `import`, and `as`, plus the core type
names `url` and `path`. They cannot be ordinary identifiers.

```text
snake_name       = [a-z][a-z0-9_]*
type_name        = [A-Z][A-Za-z0-9_]*
module_name      = snake_name ("::" snake_name)*
module_alias     = snake_name
vocabulary_name  = type_name
vocabulary_alias = snake_name
```

The inherited restrictions on repeated underscores, trailing underscores,
protected names, Unicode identifiers, and maximum identifier length continue to
apply. `::` remains the only qualification operator. `.` is unsupported.

## Delta grammar

The notation is EBNF. `NEWLINE`, comments, layout normalization, literals,
record bodies, field declarations, and value bodies are inherited from v0.

```ebnf
document = language_header, NEWLINE,
           module_header, NEWLINE,
           { use_declaration, NEWLINE },
           { import_declaration, NEWLINE },
           { root_declaration, NEWLINE } ;

language_header = "neu", string_literal ;
module_header = "module", module_name ;

use_declaration = "use", vocabulary_name, "as", vocabulary_alias ;
import_declaration = "import", module_name, "as", module_alias ;

root_declaration = [ "public" ], ( record_declaration | binding_declaration ) ;

module_name = snake_name, { "::", snake_name } ;
qualified_type_name = alias, "::", type_name ;
qualified_value_name = module_alias, "::", snake_name ;
qualified_ref_target = module_alias, "::", snake_name ;

alias = module_alias | vocabulary_alias ;

core_scalar_type = "num" | "string" | "bool" | "url" | "path" ;
```

Type positions additionally accept `qualified_type_name`. Ordinary value-reuse
positions additionally accept `qualified_value_name`. The inherited reference
constructor additionally accepts:

```neu
ref(module_alias::binding_name)
```

All `use` declarations precede all `import` declarations. Both precede ordinary
declarations. Interleaving these groups is invalid. There are no wildcard,
relative, implicit, path-based, URL-based, or source-versioned imports.

## Alias namespace

Module aliases and vocabulary aliases share one module-local alias namespace.
An alias must be unique and cannot equal a protected core name. Resolution
records whether the alias denotes a module or vocabulary.

The same spelling is intentionally used for both qualified namespaces:

```neu
domain::Pipeline
shared::JobConfig
```

The declaration that introduced `domain` or `shared` determines the namespace.
There is no fallback from one namespace kind to the other.

## Visibility

Only root record and binding declarations may carry `public`. Absence means
private. The following are invalid:

- `private` or any other visibility word;
- visibility on fields or values;
- visibility on `use` or `import` declarations;
- public aliases or re-exports; and
- access to a private imported declaration.

A public record's complete field/type signature must be publicly interpretable.
A public binding's declared type must be publicly interpretable. Reachable local
nominal types must be public; imported nominal types must be public in their
module; vocabulary types must be exported by the exact semantic contract.

Ordinary private value reuse is allowed inside a public value because lowering
records the resolved final value and can redact private provenance. Every
`Ref<T>` transitively contained in a public value must target a public binding.

## Import and SCC processing

Compilation processes modules as follows:

1. Validate headers, aliases, and exact captured dependencies.
2. Build the import graph and its strongly connected components.
3. Topologically order the SCC condensation graph by canonical module identity.
4. Collect record and binding headers for every module in one SCC.
5. Resolve types and public surfaces for the SCC.
6. Resolve values and references across the complete project.
7. Apply inherited embedded-record and value-dependency cycle checks.

An import cycle alone is valid. A value cycle remains invalid. `Ref<T>` is an
identity edge and does not create a value dependency.

Self-imports remain invalid even though they are graph-theoretic SCCs of size
one; they are redundant and usually indicate a capture or authoring error.

## Qualified types, values, and references

Only public imported symbols can be selected. Qualification never grants
visibility.

```neu
public shared::Image selected = shared::default_image
public Ref<shared::Image> selected_ref = ref(shared::default_image)
```

Imported reuse contributes the target's final logical value. Provenance records
the imported module-symbol identity. Imported references record the stable
module-symbol identity directly and never persist a graph-local element ID.

The inherited exact compatibility rules apply after qualification is resolved:
exact identity plus the inherited outer `T` to `T?` widening, invariant generic
arguments, and invariant `Ref<T>`.

## `url` and `path`

`url` and `path` are distinct scalar types constructed from the inherited
string-literal token in a typed context:

```neu
url repository = "https://example.invalid/repository"
path manifest = "config/pipeline.neu"
```

The logical value is the decoded Neutral string scalar tagged with its type.
Neutral performs no URL parsing, path normalization, platform interpretation,
reachability check, acquisition, or implicit conversion. Empty values are valid
if permitted by inherited string limits. Vocabularies may attach domain meaning
later; the language does not.

## Complete accepted example

`example::shared`:

```neu
neu "1.0"
module example::shared

public record Image {
    string reference,
}

public Image default_image = {
    reference: "example.invalid/tool:1",
}

string internal_note = "not exported"
```

`example::pipeline`:

```neu
neu "1.0"
module example::pipeline

use ExampleDomain as domain
import example::shared as shared

public domain::Pipeline pipeline = {
    image: shared::default_image,
}

public Ref<shared::Image> image_identity = ref(shared::default_image)
url source_url = "https://example.invalid/source"
path config_path = "config/pipeline.neu"
```

The exact `ExampleDomain` semantic contract must export `Pipeline` and must be
the sole project revision for that vocabulary identity.

## Required rejection examples

| Case | Example shape | Stable diagnostic |
| --- | --- | --- |
| Wrong profile | `neu "0.1"` in a v1 request | `v1-profile-mismatch` |
| Module mismatch | Request says `a::b`, header says `a::c` | `v1-module-identity-mismatch` |
| Missing import | Imported logical module absent from request | `v1-import-missing` |
| Self import | Module imports its own identity | `v1-import-self` |
| Duplicate alias | `use X as x` and `import a as x` | `v1-alias-duplicate` |
| Private access | Import selects private record or binding | `v1-symbol-inaccessible` |
| Private public type | Public signature reaches a private record | `v1-public-type-inaccessible` |
| Private public reference | Public value contains `ref(private_name)` | `v1-public-ref-inaccessible` |
| Value cycle across modules | Qualified reuses form a cycle | inherited value-cycle class with v1 related spans |
| Embedded type cycle | Imported embedded records form a direct cycle | inherited record-cycle class with v1 related spans |
| Path import | `import "file.neu" as x` | `v1-import-syntax` |
| URL import | `import https://...` | `v1-import-syntax` |
| Invalid location conversion | `string s = path_value` | inherited type-mismatch class |

## Lowering

The v1 source delta lowers to project IR as follows:

| Source construct | Logical lowering | Evidence lowering |
| --- | --- | --- |
| Module header | `LogicalModuleIdentity` | Header source span |
| `use V as a` | Exact canonical vocabulary semantic identity/revision | Local alias and declaration span |
| `import M as a` | Import edge to `LogicalModuleIdentity(M)` | Local alias and declaration span |
| `public` | Export-index membership and public API fingerprint | Modifier span |
| `a::Type` | Canonical local/imported/vocabulary type identity | Qualified-name span and resolution provenance |
| `a::value` | Resolved final value | Imported-reuse provenance and span |
| `ref(a::value)` | Stable target `ModuleSymbolIdentity` | Reference provenance and span |
| `url` / `path` | Tagged decoded scalar value | Literal span and explicit-origin provenance |

Aliases, comments, source identities, and formatting never enter logical project
identity. They remain available to the authoring projection and companion
evidence where promised.

## Explicit exclusions

v1 source has no package declarations, version ranges, partial modules,
wildcards, re-exports, namespaces, visibility tiers, functions, expressions,
operators, mutation, macros, templates, workflow declarations, executable
vocabularies, or source-triggered acquisition.
