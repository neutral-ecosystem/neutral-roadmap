export const sourceRoots = ['README.md', 'rules', 'neutral-lang', 'neutral-editor', 'neutral-flow', 'neux'];

export const sectionPrefixes: Record<string, string> = {
  'neutral-lang': 'language',
  'neutral-editor': 'editor',
  'neutral-flow': 'flow',
  neux: 'neux',
  rules: 'rules',
};

export const ignoredDirectories = new Set(['.agents', '.codex', '.git', '.astro', 'dist', 'node_modules']);

export function isIgnoredDirectory(name: string) {
  return name.startsWith('_') || ignoredDirectories.has(name);
}

export const navOrder = ['README.md', 'ARCHITECTURE.md', 'REQUIREMENTS.md', 'choices.md', 'ROADMAP.md', 'DEVELOPMENT.md'];
