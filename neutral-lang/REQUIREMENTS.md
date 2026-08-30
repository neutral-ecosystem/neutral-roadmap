# Neutral language requirements

Status: project requirements

## Purpose

These requirements govern Neutral as a versioned language project. They define
what every language version and supporting tool must preserve. Version-specific
syntax, semantics, diagnostics, and fixture requirements belong under that
version's `portable/spec/vN/` tree.

## Project requirements

- **NL-PROJ-001:** Every accepted source document selects one explicit Neutral
  language version or an unambiguous compatible profile.
- **NL-PROJ-002:** A compiler must expose its selected version, supported
  capability profile, limits, and public compatibility facts to tools.
- **NL-PROJ-003:** Source syntax, compiler-private models, public Neutral IR,
  and consumer-private models remain separate representations.
- **NL-PROJ-004:** Consumers use the documented IR and reader boundary, never
  compiler-private syntax or semantic structures.
- **NL-PROJ-005:** Capture/acquisition, compilation, reading, and external
  execution remain distinct responsibilities. Compilation success is not
  authority to perform an effect.
- **NL-PROJ-006:** Every version publishes a complete portable documentation
  seed before it is called implementation-ready.
- **NL-PROJ-007:** The portable seed contains its own version architecture,
  requirements, roadmap, decisions, fixtures, and conformance evidence.
- **NL-PROJ-008:** Version evolution requires explicit compatibility and
  migration decisions. No later version changes an earlier version silently.
- **NL-PROJ-009:** Public claims of conformance require version-specific
  positive, negative, boundary, and adversarial evidence.
- **NL-PROJ-010:** Editors, runtimes, and other consumers discover language
  versions and capabilities through the public bridge; they must not hard-code
  a specific language version's surface.

## Version ownership

The current v0 requirements are defined in
[`v0/portable/specs/REQUIREMENTS.md`](v0/portable/specs/REQUIREMENTS.md).
Future versions define their own requirements in the same location. This root
contract intentionally contains no v0 grammar, type, or runtime behavior.
